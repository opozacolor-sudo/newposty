import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPresaleView,
  eurosFromStripeAmount,
  hashPresaleToken,
  quoteForSoldCount,
  tokenStatus,
  trancheForSlot,
} from "./presale";

test("quotes tranche 1 at 100 EUR for the first slot", () => {
  const quote = quoteForSoldCount(0);
  assert.equal(quote.soldOut, false);
  if (quote.soldOut) return;
  assert.equal(quote.nextSlot, 1);
  assert.equal(quote.tranche, 1);
  assert.equal(quote.priceEur, 100);
});

test("refuses checkout after 1500 paid slots", () => {
  assert.deepEqual(quoteForSoldCount(1500), { soldOut: true });
  assert.equal(trancheForSlot(1501), null);
});

test("two near-simultaneous checkouts on the last tranche-1 slot keep both payments", () => {
  const quoteA = quoteForSoldCount(299);
  const quoteB = quoteForSoldCount(299);
  assert.equal(quoteA.soldOut, false);
  assert.equal(quoteB.soldOut, false);
  if (quoteA.soldOut || quoteB.soldOut) return;
  assert.equal(quoteA.priceEur, 100);
  assert.equal(quoteB.priceEur, 100);

  const first = trancheForSlot(300);
  const second = trancheForSlot(301);
  assert.equal(first?.tranche, 1);
  assert.equal(first?.priceEur, 100);
  assert.equal(second?.tranche, 2);
  assert.equal(second?.priceEur, 150);
  assert.equal(quoteA.priceEur, 100);
});

test("expired registration tokens are flagged without throwing", () => {
  const expired = new Date("2026-01-01T00:00:00.000Z");
  const now = new Date("2026-01-08T00:00:01.000Z");
  assert.equal(tokenStatus(expired, null, now), "expired");
  assert.equal(tokenStatus(new Date("2026-01-10T00:00:00.000Z"), null, now), "valid");
  assert.equal(tokenStatus(new Date("2026-01-10T00:00:00.000Z"), now, now), "used");
});

test("token hashes are stable and do not equal the raw token", () => {
  const token = "test-token-value";
  assert.equal(hashPresaleToken(token), hashPresaleToken(token));
  assert.notEqual(hashPresaleToken(token), token);
});

test("progress view marks current, upcoming, and sold-out tranches", () => {
  const view = buildPresaleView(300, { "1": 300 });
  assert.equal(view.soldOut, false);
  assert.equal(view.current?.tranche, 2);
  assert.equal(view.tranches[0].state, "sold_out");
  assert.equal(view.tranches[1].state, "current");
  assert.equal(view.tranches[1].remaining, 300);
  assert.equal(view.tranches[2].state, "upcoming");
});

test("full sell-out hides the current tranche", () => {
  const view = buildPresaleView(1500, { "1": 300, "2": 300, "3": 300, "4": 300, "5": 300 });
  assert.equal(view.soldOut, true);
  assert.equal(view.current, null);
  assert.ok(view.tranches.every((row) => row.state === "sold_out"));
});

test("stripe amount is stored as the paid EUR price, not recalculated", () => {
  assert.equal(eurosFromStripeAmount(10000), 100);
  assert.equal(eurosFromStripeAmount(15000), 150);
});
