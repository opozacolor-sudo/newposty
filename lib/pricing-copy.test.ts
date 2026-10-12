import assert from "node:assert/strict";
import test from "node:test";
import { annualSaveCents, pricingCopy } from "./pricing-copy";

test("yearly plans save against 12 months", () => {
  const studio = pricingCopy("en").plans.find((plan) => plan.id === "studio");
  const growth = pricingCopy("ro").plans.find((plan) => plan.id === "growth");
  assert.equal(studio && annualSaveCents(studio), 3000);
  assert.equal(growth && annualSaveCents(growth), 5000);
});

test("all six locales have three plans and two packs, unlimited leads on growth", () => {
  for (const locale of ["en", "ro", "de", "it", "fr", "es"] as const) {
    const copy = pricingCopy(locale);
    assert.equal(copy.plans.length, 3);
    assert.equal(copy.packs.length, 2);
    assert.deepEqual(
      copy.packs.map((pack) => pack.id),
      ["photos", "videos"],
    );
    assert.equal(copy.plans[2]?.featured, true);
    assert.equal(copy.plans[2]?.features.some((feature) => /30/.test(feature)), false);
    assert.equal(copy.faqs.length, 5);
    assert.equal(copy.faqs[0]?.a.toLowerCase().includes("tax is on"), false);
  }
});
