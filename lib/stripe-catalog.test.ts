import assert from "node:assert/strict";
import test from "node:test";
import {
  canUseAds,
  canUseLeads,
  catalogByLookupKey,
  effectivePlan,
  highestPlan,
  planCta,
  STRIPE_CATALOG,
} from "./stripe-catalog";

test("catalog has three plans with monthly and annual, plus photo and video packs", () => {
  assert.equal(STRIPE_CATALOG.length, 8);
  assert.equal(catalogByLookupKey("studio_monthly")?.amountCents, 1500);
  assert.equal(catalogByLookupKey("studio_annual")?.amountCents, 15000);
  assert.equal(catalogByLookupKey("promote_monthly")?.amountCents, 2100);
  assert.equal(catalogByLookupKey("promote_annual")?.amountCents, 23000);
  assert.equal(catalogByLookupKey("growth_monthly")?.amountCents, 4000);
  assert.equal(catalogByLookupKey("growth_annual")?.amountCents, 43000);
  assert.equal(catalogByLookupKey("pack_photos_30")?.amountCents, 250);
  assert.equal(catalogByLookupKey("pack_videos_30")?.amountCents, 500);
  assert.equal(catalogByLookupKey("pack_leads_30"), undefined);
});

test("lifetime and growth can use ads and leads; studio cannot", () => {
  assert.equal(canUseAds(effectivePlan(true, "none")), true);
  assert.equal(canUseLeads(effectivePlan(true, "studio")), true);
  assert.equal(canUseAds("promote"), true);
  assert.equal(canUseLeads("promote"), false);
  assert.equal(canUseAds("studio"), false);
  assert.equal(canUseLeads("studio"), false);
  assert.equal(canUseAds("none"), false);
});

test("highest active plan wins", () => {
  assert.equal(highestPlan(["studio", "growth", "promote"]), "growth");
  assert.equal(highestPlan([]), null);
});

test("plan cards offer upgrade, downgrade, or switch interval", () => {
  assert.equal(planCta("none", null, "studio", false), "choose");
  assert.equal(planCta("studio", "month", "studio", false), "current");
  assert.equal(planCta("studio", "month", "studio", true), "switchInterval");
  assert.equal(planCta("studio", "month", "growth", false), "upgrade");
  assert.equal(planCta("growth", "year", "studio", true), "downgrade");
  assert.equal(planCta("lifetime", "month", "promote", false), "current");
});
