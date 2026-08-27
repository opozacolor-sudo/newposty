import assert from "node:assert/strict";
import test from "node:test";
import { safeInternalPath } from "./safe-path";

test("safeInternalPath rejects protocol-relative and external URLs", () => {
  assert.equal(safeInternalPath("/chat"), "/chat");
  assert.equal(safeInternalPath("/accounts/posts"), "/accounts/posts");
  assert.equal(safeInternalPath("//evil.com"), "/chat");
  assert.equal(safeInternalPath("https://evil.com"), "/chat");
  assert.equal(safeInternalPath("\\evil"), "/chat");
  assert.equal(safeInternalPath(null), "/chat");
});
