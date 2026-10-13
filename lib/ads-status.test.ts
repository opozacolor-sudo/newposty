import assert from "node:assert/strict";
import test from "node:test";
import { campaignStatusKey, campaignStatusLabel } from "./ads-status";

test("campaignStatusKey maps Meta English statuses", () => {
  assert.equal(campaignStatusKey("ACTIVE"), "campaignStatusActive");
  assert.equal(campaignStatusKey("paused"), "campaignStatusPaused");
  assert.equal(campaignStatusKey("IN_REVIEW"), "campaignStatusInReview");
  assert.equal(campaignStatusKey("processing"), "campaignStatusInReview");
  assert.equal(campaignStatusKey("CAMPAIGN_PAUSED"), "campaignStatusPaused");
  assert.equal(campaignStatusKey(null), null);
});

test("campaignStatusLabel uses the mapped copy and keeps unknown raw values", () => {
  const t = (key: string) => ({ campaignStatusActive: "Activă", campaignStatusPaused: "Pauză" }[key] ?? key);
  assert.equal(campaignStatusLabel("active", t), "Activă");
  assert.equal(campaignStatusLabel("PAUSED", t), "Pauză");
  assert.equal(campaignStatusLabel("weird", t), "weird");
  assert.equal(campaignStatusLabel("", t), "—");
});
