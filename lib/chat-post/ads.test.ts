import assert from "node:assert/strict";
import test from "node:test";
import { foldChatText, geoKey, isAdConfirmReply, numericTikTokItemId, tiktokItemIdFromPost } from "./ad-confirm";

test("confirm replies start the spend without needing the button", () => {
  for (const text of ["confirm", "Confirmă", "da", "pornește reclama", "start the ad", "ok"]) {
    assert.equal(isAdConfirmReply(text), true, text);
  }
  for (const text of ["nu", "anulează", "ce buget", "publică mâine"]) {
    assert.equal(isAdConfirmReply(text), false, text);
  }
});

test("targeting cities use the search id as key", () => {
  assert.deepEqual(geoKey({ id: "2759794", name: "Bucharest" }), {
    key: "2759794",
    name: "Bucharest",
  });
  assert.equal(foldChatText("București"), "bucuresti");
});

test("Spark boost needs the numeric TikTok item id, not the v_pub_url prefix", () => {
  assert.equal(numericTikTokItemId("v_pub_url~v2.7695395929968707616"), "7695395929968707616");
  assert.equal(
    numericTikTokItemId("https://www.tiktok.com/@posty.now/video/7695395929968707616"),
    "7695395929968707616",
  );
  assert.equal(
    tiktokItemIdFromPost({
      platforms: [{ platform: "tiktok", platformPostId: "v_pub_url~v2.7695395929968707616" }],
    }),
    "7695395929968707616",
  );
});
