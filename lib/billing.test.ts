import assert from "node:assert/strict";
import test from "node:test";
import {
  computeLifetimeRefund,
  elapsedMonthsCeiling,
  lifetimeRefundEur,
} from "./billing";

test("elapsed months: any started month counts as a full month", () => {
  const start = new Date("2026-09-05T10:00:00.000Z");
  assert.equal(elapsedMonthsCeiling(start, start), 1);
  assert.equal(elapsedMonthsCeiling(start, new Date("2026-09-20T10:00:00.000Z")), 1);
  assert.equal(elapsedMonthsCeiling(start, new Date("2026-10-05T10:00:00.000Z")), 2);
  assert.equal(elapsedMonthsCeiling(start, new Date("2026-10-20T10:00:00.000Z")), 2);
});

test("lifetime refund uses paid price minus 15€ per consumed month, never negative", () => {
  assert.equal(lifetimeRefundEur(150, 2), 120);
  assert.equal(lifetimeRefundEur(100, 1), 85);
  assert.equal(lifetimeRefundEur(100, 7), 0);
});

test("without immediate-start consent, the first 14 days are a full refund", () => {
  const start = new Date("2026-09-05T10:00:00.000Z");
  const result = computeLifetimeRefund({
    paidEur: 100,
    startedAt: start,
    now: new Date("2026-09-10T10:00:00.000Z"),
    consentedImmediateStart: false,
  });
  assert.equal(result.fullWithdrawal, true);
  assert.equal(result.amountEur, 100);
});

test("with immediate-start consent, day-one refund already deducts the first month", () => {
  const start = new Date("2026-09-05T10:00:00.000Z");
  const result = computeLifetimeRefund({
    paidEur: 150,
    startedAt: start,
    now: new Date("2026-09-06T10:00:00.000Z"),
    consentedImmediateStart: true,
  });
  assert.equal(result.fullWithdrawal, false);
  assert.equal(result.monthsConsumed, 1);
  assert.equal(result.amountEur, 135);
});

test("without consent, day 15 uses the formula instead of a full withdrawal", () => {
  const start = new Date("2026-09-05T10:00:00.000Z");
  const result = computeLifetimeRefund({
    paidEur: 150,
    startedAt: start,
    now: new Date("2026-09-20T10:00:00.001Z"),
    consentedImmediateStart: false,
  });
  assert.equal(result.fullWithdrawal, false);
  assert.equal(result.monthsConsumed, 1);
  assert.equal(result.amountEur, 135);
});
