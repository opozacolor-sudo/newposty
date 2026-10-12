import type Stripe from "stripe";
import { stripeWebhookSecrets } from "@/lib/env";
import { getStripe } from "@/lib/presale-server";

export function constructStripeWebhookEvent(raw: string, signature: string) {
  const stripe = getStripe();
  const secrets = stripeWebhookSecrets();
  if (secrets.length === 0) {
    throw new Error("Missing required environment variable: STRIPE_WEBHOOK_SECRET");
  }
  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return stripe.webhooks.constructEvent(raw, signature, secret);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Invalid signature");
}

export type { Stripe };
