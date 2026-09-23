import assert from "node:assert/strict";
import test from "node:test";
import { ownsAccount, scopeByAccountId, scopePosts } from "./studio-scope";

const owned = new Set(["acc-a", "acc-b"]);

test("scopePosts drops posts that only target another account", () => {
  const posts = scopePosts(
    [
      { id: "mine", platforms: [{ accountId: "acc-a" }, { accountId: "acc-other" }] },
      { id: "theirs", platforms: [{ accountId: { _id: "acc-other" } }] },
      { id: "blank", platforms: [] },
    ],
    owned,
  );
  assert.equal(posts.length, 1);
  assert.equal(posts[0]?.id, "mine");
  assert.deepEqual(
    posts[0]?.platforms.map((item) => item.accountId),
    ["acc-a"],
  );
});

test("scopeByAccountId keeps only owned rows", () => {
  const rows = scopeByAccountId(
    [{ accountId: "acc-b" }, { accountId: "acc-other" }, { accountId: "" }],
    owned,
    (row) => row.accountId,
  );
  assert.deepEqual(rows, [{ accountId: "acc-b" }]);
  assert.equal(ownsAccount(owned, "acc-a"), true);
  assert.equal(ownsAccount(owned, "acc-other"), false);
});
