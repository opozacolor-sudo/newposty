import assert from "node:assert/strict";
import test from "node:test";
import { orderedMedia, planCrossAssignments, wantsDailySeries } from "./series";
import type { ChatMedia } from "./types";

const ZONE = "Europe/Bucharest";

test("daily series phrases require more than one file", () => {
  assert.equal(wantsDailySeries({ cadence: "daily", mediaCount: 1 }), false);
  assert.equal(wantsDailySeries({ cadence: "daily", mediaCount: 2 }), true);
  assert.equal(
    wantsDailySeries({
      brief: "începând de mâine postează câte una pe zi pe fiecare rețea",
      mediaCount: 30,
    }),
    true,
  );
  assert.equal(wantsDailySeries({ brief: "publică toate acum", mediaCount: 8 }), false);
});

test("orderedMedia follows the given id list, not object order", () => {
  const media: ChatMedia[] = [
    { id: "a", url: "https://example.com/a.jpg", type: "image" },
    { id: "b", url: "https://example.com/b.jpg", type: "image" },
    { id: "c", url: "https://example.com/c.jpg", type: "image" },
  ];
  assert.deepEqual(
    orderedMedia(["c", "a"], media).map((item) => item.id),
    ["c", "a"],
  );
});

test("cross plan gives each network a different file on the same day", () => {
  const assignments = planCrossAssignments({
    mediaIds: ["m1", "m2", "m3"],
    platforms: ["facebook", "twitter", "tiktok"],
    accepts: () => true,
  });
  const day0 = assignments.filter((item) => item.dayIndex === 0);
  assert.deepEqual(
    day0.map((item) => [item.platform, item.mediaId]),
    [
      ["facebook", "m1"],
      ["twitter", "m2"],
      ["tiktok", "m3"],
    ],
  );
  for (const day of [0, 1, 2]) {
    const ids = assignments.filter((item) => item.dayIndex === day).map((item) => item.mediaId);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("cross plan does not give TikTok a photo", () => {
  const assignments = planCrossAssignments({
    mediaIds: ["pic", "clip"],
    platforms: ["instagram", "tiktok"],
    accepts: (platform, mediaId) => platform !== "tiktok" || mediaId === "clip",
  });
  assert.ok(assignments.every((item) => item.platform !== "tiktok" || item.mediaId === "clip"));
  const day0 = assignments.filter((item) => item.dayIndex === 0);
  assert.ok(day0.some((item) => item.platform === "instagram" && item.mediaId === "pic"));
  assert.ok(day0.some((item) => item.platform === "tiktok" && item.mediaId === "clip"));
});

test("resolve expands one photo per day and skips TikTok on images", async () => {
  const { resolveCreateActions } = await import("./resolve");
  const now = new Date("2026-08-25T07:00:00.000Z");
  const media: ChatMedia[] = [
    { id: "p1", url: "https://example.com/1.jpg", type: "image", name: "1.jpg" },
    { id: "p2", url: "https://example.com/2.jpg", type: "image", name: "2.jpg" },
    { id: "p3", url: "https://example.com/3.jpg", type: "image", name: "3.jpg" },
  ];
  const result = await resolveCreateActions({
    actions: [
      {
        mode: "schedule",
        cadence: "daily",
        use_best_time: true,
        platforms: [],
        media_refs: ["p1", "p2", "p3"],
        caption: "",
        caption_source: "user_provided",
      },
    ],
    accounts: [
      { id: "1", platform: "instagram", username: "ig", display_name: null, zernio_account_id: "z1" },
      { id: "2", platform: "tiktok", username: "tt", display_name: null, zernio_account_id: "z2" },
    ],
    media,
    locale: "ro",
    timezone: ZONE,
    apiKey: "test",
    keepToolCaption: true,
    fallbackBrief: "începând de mâine câte una pe zi pe fiecare rețea la cea mai bună oră",
    now,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.resolved.series?.cadence, "daily");
  assert.equal(result.resolved.series?.distribution, "cross");
  assert.equal(result.resolved.series?.total_days, 3);
  assert.equal(result.resolved.series?.start_on, "2026-08-26");
  const days = new Set(result.resolved.actions.map((action) => action.day_index));
  assert.deepEqual([...days].sort(), [0, 1, 2]);
  assert.ok(result.resolved.actions.every((action) => action.media.length === 1));
  assert.ok(
    result.resolved.actions.every((action) => action.platforms.every((platform) => platform.platform === "instagram")),
  );
  for (const day of [0, 1, 2]) {
    const ids: string[] = result.resolved.actions
      .filter((action) => action.day_index === day)
      .flatMap((action) => action.media.map((item) => item.id));
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("a video day in a mixed series still reaches TikTok", async () => {
  const { resolveCreateActions } = await import("./resolve");
  const now = new Date("2026-08-25T07:00:00.000Z");
  const result = await resolveCreateActions({
    actions: [
      {
        mode: "schedule",
        cadence: "daily",
        use_best_time: true,
        platforms: ["instagram", "tiktok"],
        media_refs: ["pic", "clip"],
        caption: "",
        caption_source: "user_provided",
      },
    ],
    accounts: [
      { id: "1", platform: "instagram", username: "ig", display_name: null, zernio_account_id: "z1" },
      { id: "2", platform: "tiktok", username: "tt", display_name: null, zernio_account_id: "z2" },
    ],
    media: [
      { id: "pic", url: "https://example.com/a.jpg", type: "image" },
      { id: "clip", url: "https://example.com/a.mp4", type: "video" },
    ],
    locale: "ro",
    timezone: ZONE,
    apiKey: "test",
    keepToolCaption: true,
    fallbackBrief: "câte una pe zi",
    now,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  const day0 = result.resolved.actions.filter((action) => action.day_index === 0);
  assert.ok(day0.some((action) => action.platforms.some((platform) => platform.platform === "instagram")));
  assert.ok(day0.some((action) => action.platforms.some((platform) => platform.platform === "tiktok")));
  const day0Media = day0.flatMap((action) => action.media.map((item) => item.id));
  assert.equal(new Set(day0Media).size, day0Media.length);
  assert.ok(
    !day0.some(
      (action) =>
        action.platforms.some((platform) => platform.platform === "tiktok") &&
        action.media.some((item) => item.type === "image"),
    ),
  );
});
