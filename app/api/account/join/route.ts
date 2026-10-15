import { NextResponse } from "next/server";
import { INVITE_SIGNUP } from "@/lib/flags";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function misconfigured(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    return NextResponse.json({ error: "SERVER_MISCONFIGURED" }, { status: 503 });
  }
  return null;
}

export async function POST(request: Request) {
  if (!INVITE_SIGNUP) return NextResponse.json({ error: "Closed" }, { status: 404 });

  const limited = rateLimit(`join:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!EMAIL.test(email)) {
      return NextResponse.json({ error: "EMAIL_INVALID" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "PASSWORD_SHORT" }, { status: 400 });
    }

    const admin = createAdminSupabase();
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { account_kind: "individual" },
    });

    if (created.error) {
      if (/already|registered|exists/i.test(created.error.message)) {
        return NextResponse.json({ error: "ACCOUNT_EXISTS" }, { status: 409 });
      }
      return NextResponse.json({ error: "JOIN_FAILED" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return misconfigured(error) ?? NextResponse.json({ error: "JOIN_FAILED" }, { status: 500 });
  }
}
