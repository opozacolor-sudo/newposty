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

export function getResendFrom() {
  return process.env.RESEND_FROM?.trim() || "posty.now <beth.t@example.com>";
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
