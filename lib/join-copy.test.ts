import assert from "node:assert/strict";
import test from "node:test";
import { joinCopy } from "./join-copy";

test("join copy exists in all six locales and names November limits", () => {
  for (const locale of ["en", "ro", "de", "it", "fr", "es"] as const) {
    const copy = joinCopy(locale);
    assert.match(copy.photos, /15/);
    assert.match(copy.videos, /15/);
    assert.ok(copy.laterTitle.length > 4);
    assert.ok(copy.nowTitle.length > 2);
    assert.doesNotMatch(copy.lead, /zernio/i);
  }
  assert.match(joinCopy("ro").title, /noiembrie/i);
});
