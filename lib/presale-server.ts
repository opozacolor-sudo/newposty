import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  getResendApiKey,
  getResendFrom,
  getSiteUrl,
  getStripeSecretKey,
  getSupabasePublicEnv,
  getSupabaseServiceRoleKey,
} from "@/lib/env";
import { passwordKeyFromSecret, sealPassword, unsealPassword } from "@/lib/presale-password";
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

function passwordKey() {
  return passwordKeyFromSecret(getSupabaseServiceRoleKey());
}

export function loginUrl(locale: string, email: string) {
  const params = new URLSearchParams({ email, paid: "1" });
  return `${getSiteUrl()}/${locale}/login?${params.toString()}`;
}

export async function storePendingSignup(input: {
  email: string;
  password: string;
  locale: string;
}) {
  const admin = createAdminSupabase();
  const { data, error } = await admin
    .from("presale_pending_signups")
    .insert({
      email: input.email,
      password_cipher: sealPassword(input.password, passwordKey()),
      locale: input.locale,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("Could not store pending signup");
  return data.id as string;
}

export async function attachPendingCheckout(pendingId: string, sessionId: string) {
  const admin = createAdminSupabase();
  await admin
    .from("presale_pending_signups")
    .update({ stripe_session_id: sessionId })
    .eq("id", pendingId)
    .is("consumed_at", null);
}

export async function deletePendingSignup(pendingId: string) {
  const admin = createAdminSupabase();
  await admin.from("presale_pending_signups").delete().eq("id", pendingId).is("consumed_at", null);
}

export async function createOrUpdatePresaleAuthUser(email: string, password: string) {
  const admin = createAdminSupabase();
  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (!created.error) {
    const id = created.data.user?.id;
    if (!id) throw new Error("Could not create auth user");
    return { id, created: true as const };
  }

  if (!/already|registered|exists/i.test(created.error.message)) {
    throw created.error;
  }

  const { data: existing } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (!existing?.id) throw created.error;
  const updated = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (updated.error) throw updated.error;
  return { id: existing.id, created: false as const };
}

export async function activatePendingSignup(pendingId: string, purchaseId: string) {
  const admin = createAdminSupabase();
  const { data: purchase } = await admin
    .from("presale_purchases")
    .select("id, status")
    .eq("id", purchaseId)
    .maybeSingle();
  if (!purchase || purchase.status === "registered") return purchase?.status === "registered";

  const { data: pending } = await admin
    .from("presale_pending_signups")
    .select("id, email, password_cipher, expires_at, consumed_at")
    .eq("id", pendingId)
    .maybeSingle();
  if (
    !pending ||
    pending.consumed_at ||
    !pending.password_cipher ||
    new Date(pending.expires_at as string).getTime() <= Date.now()
  ) {
    return false;
  }

  let password: string;
  try {
    password = unsealPassword(String(pending.password_cipher), passwordKey());
  } catch (error) {
    console.error("[presale] could not unseal pending password", error);
    return false;
  }

  const user = await createOrUpdatePresaleAuthUser(String(pending.email), password);
  const { error } = await admin.rpc("activate_presale_account", {
    p_purchase_id: purchaseId,
    p_user_id: user.id,
  });
  if (error) {
    if (user.created) {
      await admin.auth.admin.deleteUser(user.id);
    }
    throw error;
  }

  await admin
    .from("presale_pending_signups")
    .update({ consumed_at: new Date().toISOString(), password_cipher: "" })
    .eq("id", pending.id);
  return true;
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
    console.info("[presale] skipping email; set RESEND_API_KEY. register url ready for thanks page.");
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
    const body = await response.text();
    console.error("[presale] resend failed", response.status, body.slice(0, 500));
    return { sent: false, url };
  }
  return { sent: true, url };
}

export async function sendPresaleReadyEmail(input: {
  email: string;
  locale: string;
  slot: number;
  priceEur: number;
}) {
  const url = loginUrl(input.locale, input.email);
  const key = getResendApiKey();
  const subject =
    input.locale === "ro" ? "Contul posty.now e activ" : "Your posty.now account is active";
  const html =
    input.locale === "ro"
      ? `<p>Plata a reușit. Ești locul <strong>#${input.slot}</strong> în presale (${input.priceEur} EUR, acces pe viață).</p>
         <p>Contul e activ. Autentifică-te cu emailul și parola alese la checkout.</p>
         <p><a href="${url}">Intră în studio</a></p>`
      : `<p>Payment received. You are slot <strong>#${input.slot}</strong> in the presale (${input.priceEur} EUR, lifetime access).</p>
         <p>Your account is active. Sign in with the email and password you chose at checkout.</p>
         <p><a href="${url}">Open the studio</a></p>`;

  if (!key) {
    console.info("[presale] skipping email; set RESEND_API_KEY. login url ready for thanks page.");
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
    const body = await response.text();
    console.error("[presale] resend failed", response.status, body.slice(0, 500));
    return { sent: false, url };
  }
  return { sent: true, url };
}
