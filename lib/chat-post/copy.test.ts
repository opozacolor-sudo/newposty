import assert from "node:assert/strict";
import test from "node:test";
import { cancelledCopy, localizeCancelledContent, resultsReply } from "./copy";

test("cancelled copy follows the UI locale", () => {
  assert.equal(cancelledCopy("ro"), "Anulat. Trimite o comandă nouă dacă vrei să schimbi.");
  assert.equal(
    localizeCancelledContent("Cancelled. Send a new instruction if you want to change it.", "ro"),
    "Anulat. Trimite o comandă nouă dacă vrei să schimbi.",
  );
});

test("results reply does not ask to confirm after posting", () => {
  assert.match(
    resultsReply("ro", [
      { status: "success" },
      { status: "error" },
    ]),
    /mai jos/,
  );
  assert.doesNotMatch(
    resultsReply("ro", [{ status: "success" }]),
    /confirm/i,
  );
});
