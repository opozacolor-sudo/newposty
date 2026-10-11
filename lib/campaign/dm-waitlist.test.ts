import assert from "node:assert/strict";
import test from "node:test";
import { extractSoloEmail, inboundWaitlistTarget } from "./dm-waitlist";

test("extractSoloEmail accepts a lone address and a short intro", () => {
  assert.equal(extractSoloEmail("ana@firma.ro"), "ana@firma.ro");
  assert.equal(extractSoloEmail("Emailul meu: Ana@Firma.ro"), "ana@firma.ro");
  assert.equal(extractSoloEmail("  foo.bar+ads@gmail.com  "), "foo.bar+ads@gmail.com");
});

test("extractSoloEmail ignores long pitches and missing addresses", () => {
  assert.equal(extractSoloEmail("vreau"), null);
  assert.equal(
    extractSoloEmail("Salut, sunt Ana de la firma X și vreau luna gratuită, scrie-mi pe ana@firma.ro după ce vorbim de preț și de contract"),
    null,
  );
  assert.equal(extractSoloEmail("ana@firma.ro și ion@firma.ro"), null);
});

test("inboundWaitlistTarget only takes incoming Instagram DMs with one email", () => {
  const hit = inboundWaitlistTarget({
    event: "message.received",
    account: { accountId: "acc-1" },
    message: {
      direction: "incoming",
      platform: "instagram",
      conversationId: "conv-1",
      text: "ana@firma.ro",
    },
  });
  assert.equal(hit?.email, "ana@firma.ro");
  assert.equal(hit?.conversationId, "conv-1");
  assert.equal(inboundWaitlistTarget({ event: "comment.received", message: { text: "ana@firma.ro" } }), null);
  assert.equal(
    inboundWaitlistTarget({
      event: "message.received",
      message: { direction: "outgoing", platform: "instagram", conversationId: "c", text: "ana@firma.ro" },
    }),
    null,
  );
});
