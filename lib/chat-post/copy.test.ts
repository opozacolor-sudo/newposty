import assert from "node:assert/strict";
import test from "node:test";
import { cancelledCopy, localizeCancelledContent } from "./copy";

test("cancelled copy follows the UI locale", () => {
  assert.equal(cancelledCopy("ro"), "Anulat. Trimite o comandă nouă dacă vrei să schimbi.");
  assert.equal(
    localizeCancelledContent("Cancelled. Send a new instruction if you want to change it.", "ro"),
    "Anulat. Trimite o comandă nouă dacă vrei să schimbi.",
  );
});
