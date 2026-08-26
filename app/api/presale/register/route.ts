import { NextResponse } from "next/server";
import { hashPresaleToken, tokenStatus } from "@/lib/presale";
import { createOrUpdatePresaleAuthUser } from "@/lib/presale-server";
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
    let userId: string;
    try {
      const user = await createOrUpdatePresaleAuthUser(loaded.email, password);
      userId = user.id;
    } catch (error) {
      const message = error instanceof Error ? error.message : "REGISTER_FAILED";
      if (/already|registered|exists/i.test(message)) {
        return NextResponse.json({ error: "ACCOUNT_EXISTS" }, { status: 409 });
      }
      return NextResponse.json({ error: message }, { status: 400 });
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
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, email: loaded.email, lifetimeAccess: true });
  } catch (error) {
    return misconfigured(error) ?? NextResponse.json({ error: "REGISTER_FAILED" }, { status: 500 });
  }
}
