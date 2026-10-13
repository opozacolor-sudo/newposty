import assert from "node:assert/strict";
import test from "node:test";
import {
  foldChatText,
  geoKey,
  isAdConfirmReply,
  isMetaAdNetwork,
  isTikTokAdNetwork,
  numericTikTokItemId,
  pickLatestInstagramInboxPost,
  pickMetaAdAccount,
  tiktokItemIdFromPost,
} from "./ad-confirm";

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

test("Meta vs TikTok ads networks", () => {
  assert.equal(isMetaAdNetwork("Instagram"), true);
  assert.equal(isMetaAdNetwork("doar instagram"), true);
  assert.equal(isMetaAdNetwork("meta ads"), true);
  assert.equal(isMetaAdNetwork("tiktok"), false);
  assert.equal(isTikTokAdNetwork("tiktokads"), true);
  assert.equal(isTikTokAdNetwork("instagram"), false);
});

test("latest Instagram inbox post is the newest organic row", () => {
  const latest = pickLatestInstagramInboxPost([
    { id: "old", platform: "instagram", createdTime: "2026-10-12T08:00:00.000Z" },
    { id: "18098554325084197", platform: "instagram", createdTime: "2026-10-13T08:52:57.000Z" },
    { id: "fb", platform: "facebook", createdTime: "2026-10-13T09:00:00.000Z" },
  ]);
  assert.equal(latest?.id, "18098554325084197");
});

test("Meta boost prefers the posty.now ad account over an ineligible personal one", () => {
  const picked = pickMetaAdAccount([
    {
      id: "act_1191586852290195",
      name: "Paul D Smeianu",
      selectable: true,
      accountStatus: 3,
      billingStatus: "missing",
    },
    {
      id: "act_1794507248368170",
      name: "posty.now",
      selectable: true,
      accountStatus: 1,
      billingStatus: "missing",
    },
  ]);
  assert.equal(picked?.id, "act_1794507248368170");
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
