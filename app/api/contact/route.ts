import { NextResponse } from "next/server";
import { escapeHtml, getContactInbox, sendResendEmail } from "@/lib/email";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createServerSupabase } from "@/lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${clientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (
    name.length < 1 ||
    name.length > 200 ||
    !emailPattern.test(email) ||
    email.length > 320 ||
    message.length < 1 ||
    message.length > 8000
  ) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    return NextResponse.json({ error: "Could not save message" }, { status: 500 });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const sent = await sendResendEmail({
    to: getContactInbox(),
    replyTo: email,
    subject: `Posty contact: ${name}`,
    html: `<p><strong>${safeName}</strong> &lt;${safeEmail}&gt;</p><p>${safeMessage}</p>`,
  });

  if (!sent.sent) {
    return NextResponse.json({ error: "Could not send message" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
