import assert from "node:assert/strict";
import test from "node:test";
import { isAfterListenFrom, isInboundLeadMessage, isNewLeadInbound, looksLikeOwnOutreach } from "./scan-rules";

test("own outreach is never a lead", () => {
  const pitch =
    "Buna ziua! Sunt Daniel și am creat posty.now — Preînregistrează-te acum și ofertă specială";
  assert.equal(looksLikeOwnOutreach(pitch), true);
  assert.equal(isInboundLeadMessage({ direction: "inbound", message: pitch }), false);
  assert.equal(isInboundLeadMessage({ direction: "outbound", message: "cât costă?" }), false);
});

test("only explicit inbound after listenFrom can open a thread", () => {
  const from = "2026-10-06T10:00:00.000Z";
  assert.equal(isAfterListenFrom("2026-10-06T09:00:00.000Z", from), false);
  assert.equal(isAfterListenFrom("2026-10-06T10:01:00.000Z", from), true);
  assert.equal(isAfterListenFrom(undefined, from), false);
  assert.equal(isInboundLeadMessage({ direction: "inbound", message: "cât costă?" }), true);
  assert.equal(isInboundLeadMessage({ message: "cât costă?" }), false);
  assert.equal(isNewLeadInbound("cât costă?", ["pret", "cât costă"], "2026-10-06T10:01:00.000Z", from), true);
  assert.equal(isNewLeadInbound("cât costă?", ["pret", "cât costă"], "2026-10-06T09:00:00.000Z", from), false);
});
