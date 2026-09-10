function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabasePublicEnv() {
  // NEXT_PUBLIC_* must be read with a static key so Next.js inlines them in the browser bundle.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) {
    throw new Error(
      "Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return { url, anonKey };
}

export function getAnthropicApiKey() {
  return required("ANTHROPIC_API_KEY");
}

export function getZernioApiKey() {
  return required("ZERNIO_API_KEY");
}

export function getSupabaseServiceRoleKey() {
  return required("SUPABASE_SERVICE_ROLE_KEY");
}

export function getStripeSecretKey() {
  return required("STRIPE_SECRET_KEY");
}

export function getStripeWebhookSecret() {
  return required("STRIPE_WEBHOOK_SECRET");
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() ?? "";
}

const RESEND_FROM_DEFAULT = "Posty <hello@posty.now>";
const EMAIL_ONLY = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const NAME_AND_EMAIL = /^([^<>]+)<([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)>$/;
const NAME_THEN_EMAIL = /^(.+?)\s+([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+)$/;

export function getResendFrom() {
  const raw = (process.env.RESEND_FROM?.trim() ?? "").replace(/^["']|["']$/g, "").trim();
  if (!raw) return RESEND_FROM_DEFAULT;
  if (EMAIL_ONLY.test(raw)) return raw;
  const named = raw.match(NAME_AND_EMAIL);
  if (named) return `${named[1].trim()} <${named[2]}>`;
  const loose = raw.match(NAME_THEN_EMAIL);
  if (loose) return `${loose[1].trim()} <${loose[2]}>`;
  console.error("[resend] invalid RESEND_FROM, using default");
  return RESEND_FROM_DEFAULT;
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  const onVercel = Boolean(process.env.VERCEL);
  if (explicit && !(onVercel && explicit.includes("localhost"))) {
    return explicit;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return explicit || "http://localhost:3000";
}

export function getPublicSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (!origin.includes("localhost")) return origin;
  }
  if (fromEnv && !fromEnv.includes("localhost")) return fromEnv;
  return fromEnv || "https://newposty.vercel.app";
}
