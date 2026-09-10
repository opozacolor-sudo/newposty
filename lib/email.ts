import { getResendApiKey, getResendFrom } from "@/lib/env";

export function getContactInbox() {
  return process.env.CONTACT_TO?.trim() || "opozacolor@gmail.com";
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendResendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ sent: true } | { sent: false; reason: string }> {
  const key = getResendApiKey();
  if (!key) {
    console.error("[resend] missing RESEND_API_KEY");
    return { sent: false, reason: "missing_key" };
  }

  const body: Record<string, unknown> = {
    from: getResendFrom(),
    to: input.to,
    subject: input.subject,
    html: input.html,
  };
  if (input.replyTo) body.reply_to = input.replyTo;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error("[resend] failed", response.status, text);
    return { sent: false, reason: `http_${response.status}` };
  }

  return { sent: true };
}
