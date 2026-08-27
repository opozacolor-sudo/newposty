import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  getResendApiKey,
  getResendFrom,
  getSiteUrl,
  getStripeSecretKey,
  getSupabasePublicEnv,
} from "@/lib/env";
import {
  buildPresaleView,
  createPresaleToken,
  hashPresaleToken,
  presaleTokenExpiresAt,
} from "@/lib/presale";
import { createAdminSupabase } from "@/lib/supabase/admin";

export function getStripe() {
  return new Stripe(getStripeSecretKey());
}

export async function fetchPresaleView() {
  const { url, anonKey } = getSupabasePublicEnv();
  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.rpc("presale_public_status");
  if (error) throw error;
  const payload = data as { sold?: number; byTranche?: Record<string, number> } | null;
  return buildPresaleView(Number(payload?.sold ?? 0), payload?.byTranche ?? {});
}

export async function issueRegistrationToken(purchaseId: string) {
  const admin = createAdminSupabase();
  const token = createPresaleToken();
  const { error } = await admin.from("presale_registration_tokens").insert({
    purchase_id: purchaseId,
    token_hash: hashPresaleToken(token),
    expires_at: presaleTokenExpiresAt().toISOString(),
  });
  if (error) throw error;
  return token;
}

export function registrationUrl(locale: string, token: string) {
  return `${getSiteUrl()}/${locale}/presale/register/${encodeURIComponent(token)}`;
}

export async function sendPresaleRegisterEmail(input: {
  email: string;
  token: string;
  locale: string;
  slot: number;
  priceEur: number;
}) {
  const url = registrationUrl(input.locale, input.token);
  const key = getResendApiKey();
  const subject =
    input.locale === "ro"
      ? "Finalizează contul posty.now"
      : "Finish your posty.now account";
  const html =
    input.locale === "ro"
      ? `<p>Plata a reușit. Ești locul <strong>#${input.slot}</strong> în presale (${input.priceEur} EUR, acces pe viață).</p>
         <p><a href="${url}">Creează parola și intră în studio</a></p>
         <p>Linkul e valabil 7 zile.</p>`
      : `<p>Payment received. You are slot <strong>#${input.slot}</strong> in the presale (${input.priceEur} EUR, lifetime access).</p>
         <p><a href="${url}">Create your password and open the studio</a></p>
         <p>This link is valid for 7 days.</p>`;

  if (!key) {
    console.info("[presale] skipping email; set RESEND_API_KEY.");
    return { sent: false, url };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getResendFrom(),
      to: input.email,
      subject,
      html,
    }),
  });
  if (!response.ok) {
    await response.text().catch(() => "");
    console.error("[presale] resend failed", response.status);
    return { sent: false, url };
  }
  return { sent: true, url };
}
