import assert from "node:assert/strict";
import test from "node:test";
import { hasFullStudioAccess, resolveStudioAccess } from "./access";

test("lifetime_access grants full studio access immediately", () => {
  const access = resolveStudioAccess({ lifetime_access: true });
  assert.equal(access.allowed, true);
  assert.equal(access.lifetime, true);
  assert.equal(access.kind, "lifetime");
  assert.equal(hasFullStudioAccess({ lifetime_access: true }), true);
});

test("legacy studio users keep access until subscriptions exist", () => {
  const access = resolveStudioAccess({ lifetime_access: false });
  assert.equal(access.allowed, true);
  assert.equal(access.lifetime, false);
  assert.equal(access.kind, "legacy");
});
