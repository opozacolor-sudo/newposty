import assert from "node:assert/strict";
import test from "node:test";
import { isMissingStripeResource, publicStripeMessage } from "./stripe-errors";

test("detects a customer that does not exist in this Stripe mode", () => {
  assert.equal(
    isMissingStripeResource(
      { code: "resource_missing", message: "No such customer: 'cus_live'" },
      "customer",
    ),
    true,
  );
  assert.equal(isMissingStripeResource(new Error("No such price: 'price_x'"), "customer"), false);
});

test("hides missing secret-key env names from the client", () => {
  assert.equal(
    publicStripeMessage(new Error("Missing required environment variable: STRIPE_SECRET_KEY")),
    "Stripe is not configured.",
  );
});
