import assert from "node:assert/strict";
import test from "node:test";
import {
  assertPresalePassword,
  passwordKeyFromSecret,
  sealPassword,
  unsealPassword,
} from "./presale-password";

test("rejects short or mismatched passwords", () => {
  assert.equal(assertPresalePassword("short", "short"), "PASSWORD_SHORT");
  assert.equal(assertPresalePassword("long-enough", "different"), "PASSWORD_MISMATCH");
  assert.equal(assertPresalePassword("long-enough", "long-enough"), null);
});

test("sealed passwords round-trip and fail with the wrong key", () => {
  const key = passwordKeyFromSecret("service-role-secret");
  const sealed = sealPassword("hunter2-plus", key);
  assert.equal(unsealPassword(sealed, key), "hunter2-plus");
  assert.notEqual(sealed, "hunter2-plus");
  assert.throws(() => unsealPassword(sealed, passwordKeyFromSecret("other-secret")));
});
