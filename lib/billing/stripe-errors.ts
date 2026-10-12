export function isMissingStripeResource(error: unknown, resource: string) {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  if (code === "resource_missing" && message.toLowerCase().includes(resource)) return true;
  return new RegExp(`No such ${resource}`, "i").test(message);
}

export function publicStripeMessage(error: unknown) {
  if (error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")) {
    return "Stripe is not configured.";
  }
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Checkout failed.";
}
