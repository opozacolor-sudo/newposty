import { NextResponse } from "next/server";
import { hashPresaleToken, tokenStatus } from "@/lib/presale";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function loadToken(token: string) {
  const admin = createAdminSupabase();
  const tokenHash = hashPresaleToken(token);
  const { data: row } = await admin
    .from("presale_registration_tokens")
    .select("expires_at, used_at, purchase_id")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (!row) return { status: "invalid" as const, email: null, tokenHash };

  const { data: purchase } = await admin
    .from("presale_purchases")
    .select("email, status")
    .eq("id", row.purchase_id)
    .maybeSingle();

  const status = tokenStatus(
    new Date(row.expires_at as string),
    row.used_at ? new Date(row.used_at as string) : null,
  );
  return {
    status,
    email: purchase?.email?.trim().toLowerCase() ?? null,
    tokenHash,
    purchaseStatus: purchase?.status ?? null,
  };
}

function misconfigured(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY") || message.includes("STRIPE_SECRET_KEY")) {
    return NextResponse.json({ error: "SERVER_MISCONFIGURED" }, { status: 503 });
  }
  return null;
}

export async function GET(request: Request) {
  const limited = rateLimit(`register-get:${clientIp(request)}`, 20, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const token = new URL(request.url).searchParams.get("token")?.trim() ?? "";
    if (!token) {
      return NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 400 });
    }
    const loaded = await loadToken(token);
    if (loaded.status === "invalid") {
      return NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 404 });
    }
    if (loaded.status === "expired") {
      return NextResponse.json({ error: "PRESALE_TOKEN_EXPIRED", email: loaded.email }, { status: 410 });
    }
    if (loaded.status === "used") {
      return NextResponse.json({ error: "PRESALE_TOKEN_USED", email: loaded.email }, { status: 409 });
    }
    return NextResponse.json({ email: loaded.email, status: "valid" });
  } catch (error) {
    return misconfigured(error) ?? NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = rateLimit(`register-post:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
    };
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!token) {
      return NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "PASSWORD_SHORT" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "PASSWORD_MISMATCH" }, { status: 400 });
    }

    const loaded = await loadToken(token);
    if (loaded.status === "invalid") {
      return NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 404 });
    }
    if (loaded.status === "expired") {
      return NextResponse.json({ error: "PRESALE_TOKEN_EXPIRED" }, { status: 410 });
    }
    if (loaded.status === "used") {
      return NextResponse.json({ error: "PRESALE_TOKEN_USED" }, { status: 409 });
    }
    if (!loaded.email) {
      return NextResponse.json({ error: "PRESALE_TOKEN_INVALID" }, { status: 400 });
    }

    const admin = createAdminSupabase();
    let userId: string | null = null;
    const created = await admin.auth.admin.createUser({
      email: loaded.email,
      password,
      email_confirm: true,
    });

    if (created.error) {
      if (!/already|registered|exists/i.test(created.error.message)) {
        return NextResponse.json({ error: "REGISTER_FAILED" }, { status: 400 });
      }
      const { data: existing } = await admin
        .from("profiles")
        .select("id")
        .ilike("email", loaded.email)
        .maybeSingle();
      userId = existing?.id ?? null;
      if (!userId) {
        return NextResponse.json({ error: "ACCOUNT_EXISTS" }, { status: 409 });
      }
      const updated = await admin.auth.admin.updateUserById(userId, {
        password,
        email_confirm: true,
      });
      if (updated.error) {
        return NextResponse.json({ error: "REGISTER_FAILED" }, { status: 400 });
      }
    } else {
      userId = created.data.user.id;
    }

    const { error: completeError } = await admin.rpc("complete_presale_registration", {
      p_token_hash: loaded.tokenHash,
      p_user_id: userId,
    });
    if (completeError) {
      const message = completeError.message;
      if (message.includes("PRESALE_TOKEN_EXPIRED")) {
        return NextResponse.json({ error: "PRESALE_TOKEN_EXPIRED" }, { status: 410 });
      }
      if (message.includes("PRESALE_TOKEN_USED")) {
        return NextResponse.json({ error: "PRESALE_TOKEN_USED" }, { status: 409 });
      }
      return NextResponse.json({ error: "REGISTER_FAILED" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, email: loaded.email, lifetimeAccess: true });
  } catch (error) {
    return misconfigured(error) ?? NextResponse.json({ error: "REGISTER_FAILED" }, { status: 500 });
  }
}
