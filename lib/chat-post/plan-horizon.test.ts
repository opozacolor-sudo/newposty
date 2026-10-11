import assert from "node:assert/strict";
import test from "node:test";
import {
  parseRequestedPlanDays,
  planAccessLine,
  planExceedsAccess,
  plannedDaysFromSeries,
  planTooLongMessage,
} from "./plan-horizon";

test("parseRequestedPlanDays reads days and months, not monthly photos", () => {
  assert.equal(parseRequestedPlanDays("idei de conținut pentru 30 de zile"), 30);
  assert.equal(parseRequestedPlanDays("content ideas for 6 months"), 180);
  assert.equal(parseRequestedPlanDays("o lună de postări"), 30);
  assert.equal(parseRequestedPlanDays("pe 6 luni"), 180);
  assert.equal(parseRequestedPlanDays("20 de poze de lună"), null);
  assert.equal(parseRequestedPlanDays("publică reel-ul acum"), null);
});

test("planExceedsAccess allows lifetime and equal remaining days", () => {
  assert.equal(planExceedsAccess(180, { kind: "lifetime" }), false);
  assert.equal(planExceedsAccess(30, { kind: "period", daysRemaining: 30, endsOn: "2026-11-10" }), false);
  assert.equal(planExceedsAccess(31, { kind: "period", daysRemaining: 30, endsOn: "2026-11-10" }), true);
  assert.equal(planExceedsAccess(180, { kind: "period", daysRemaining: 30, endsOn: "2026-11-10" }), true);
});

test("plannedDaysFromSeries takes the longer of brief and series length", () => {
  assert.equal(plannedDaysFromSeries({ brief: "6 luni", dailyDays: 10 }), 180);
  assert.equal(plannedDaysFromSeries({ brief: "câte una pe zi", dailyDays: 30 }), 30);
  assert.equal(plannedDaysFromSeries({ catalogDays: 30 }), 30);
});

test("refusal copy is localized and names the dates", () => {
  const access = { kind: "period" as const, daysRemaining: 30, endsOn: "2026-11-10" };
  assert.match(planTooLongMessage("ro", { planDays: 180, access }), /180/);
  assert.match(planTooLongMessage("ro", { planDays: 180, access }), /abonament/);
  assert.match(planTooLongMessage("de", { planDays: 180, access }), /Abo/);
  assert.match(planAccessLine(access), /30 days remaining/);
});
