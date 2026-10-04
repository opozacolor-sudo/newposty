import assert from "node:assert/strict";
import test from "node:test";
import {
  dailyPostCap,
  mediaForThisTurn,
  nextPackedSlot,
  orderedMedia,
  parseRemixRequest,
  planCrossAssignments,
  planRemixSets,
  wantsDailySeries,
} from "./series";
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
  assert.equal(
    wantsDailySeries({
      brief: "Programeazăacestematerialepe toateplatformeleîncepândde azi",
      mediaCount: 18,
    }),
    true,
  );
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

test("a new batch drops earlier chat files unless the user asks for them", () => {
  const older: ChatMedia[] = [
    { id: "old1", url: "https://example.com/old1.jpg", type: "image" },
    { id: "old2", url: "https://example.com/old2.jpg", type: "image" },
  ];
  const incoming: ChatMedia[] = [
    { id: "n1", url: "https://example.com/n1.jpg", type: "image" },
    { id: "n2", url: "https://example.com/n2.jpg", type: "image" },
    { id: "n3", url: "https://example.com/n3.jpg", type: "image" },
    { id: "n4", url: "https://example.com/n4.jpg", type: "image" },
    { id: "n5", url: "https://example.com/n5.jpg", type: "image" },
  ];
  const all = [...older, ...incoming];
  assert.deepEqual(
    mediaForThisTurn({
      refs: ["old1", "old2", "n1", "n2", "n3", "n4", "n5"],
      all,
      thisMessage: incoming,
      brief: "câte una pe zi începând cu 28.09 la cea mai bună oră",
    }).map((item) => item.id),
    ["n1", "n2", "n3", "n4", "n5"],
  );
  assert.deepEqual(
    mediaForThisTurn({
      refs: ["old1", "old2"],
      all,
      thisMessage: incoming,
      brief: "câte una pe zi",
    }).map((item) => item.id),
    ["n1", "n2", "n3", "n4", "n5"],
  );
  assert.deepEqual(
    mediaForThisTurn({
      refs: ["old1", "n1"],
      all,
      thisMessage: incoming,
      brief: "și pe cele dinainte, câte una pe zi",
    }).map((item) => item.id),
    ["old1", "n1"],
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

test("resolve expands one photo per day including TikTok", async () => {
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
    result.resolved.actions.some((action) =>
      action.platforms.some((platform) => platform.platform === "tiktok"),
    ),
  );
  assert.ok(
    result.resolved.actions.some((action) =>
      action.platforms.some((platform) => platform.platform === "instagram"),
    ),
  );
  for (const day of [0, 1, 2]) {
    const ids: string[] = result.resolved.actions
      .filter((action) => action.day_index === day)
      .flatMap((action) => action.media.map((item) => item.id));
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("remix brief asks for 100 unique 5-photo carousels packed in-day", () => {
  const plan = parseRemixRequest({
    brief: "fa-mi 100 de postari carusel cu cate 5 poze mixate ca fiecare postare sa fie diferita",
    photoCount: 40,
  });
  assert.deepEqual(plan, { count: 100, size: 5, pack: "fill_day" });
  assert.equal(
    parseRemixRequest({
      brief: "100 carusele mixate pe zile",
      photoCount: 40,
    })?.pack,
    "daily",
  );
});

test("remix sets are unique combinations first", () => {
  const ids = Array.from({ length: 12 }, (_, index) => `p${index + 1}`);
  const sets = planRemixSets(ids, 5, 20);
  assert.equal(sets.length, 20);
  assert.ok(sets.every((set) => set.length === 5));
  const keys = sets.map((set) => [...set].sort().join("|"));
  assert.equal(new Set(keys).size, 20);
});

test("TikTok daily cap rolls leftover remix posts to the next day", () => {
  const used = new Map<string, number>();
  const start = new Date("2026-08-26T06:00:00.000Z");
  const days = new Set<string>();
  for (let index = 0; index < 20; index += 1) {
    const slot = nextPackedSlot({
      platform: "tiktok",
      used,
      cursor: start,
      timeZone: ZONE,
      pack: "fill_day",
      postIndex: index,
      startOn: "2026-08-26",
    });
    days.add(slot.toISOString().slice(0, 10));
  }
  assert.equal(dailyPostCap("tiktok"), 15);
  assert.ok(days.size >= 2);
});

test("resolve expands mixed carousels and stays on Instagram the same day", async () => {
  const { resolveCreateActions } = await import("./resolve");
  const now = new Date("2026-08-25T07:00:00.000Z");
  const media: ChatMedia[] = Array.from({ length: 8 }, (_, index) => ({
    id: `p${index + 1}`,
    url: `https://example.com/${index + 1}.jpg`,
    type: "image",
    name: `${index + 1}.jpg`,
  }));
  const result = await resolveCreateActions({
    actions: [
      {
        mode: "schedule",
        cadence: "remix",
        remix_count: 6,
        remix_size: 5,
        pack: "fill_day",
        scheduled_at_iso: "2026-08-26T09:00:00",
        platforms: ["instagram"],
        media_refs: media.map((item) => item.id),
        caption: "mix",
        caption_source: "user_provided",
      },
    ],
    accounts: [
      { id: "1", platform: "instagram", username: "ig", display_name: null, zernio_account_id: "z1" },
    ],
    media,
    locale: "ro",
    timezone: ZONE,
    apiKey: "test",
    keepToolCaption: true,
    fallbackBrief: "6 postari carusel cu cate 5 poze mixate toate in aceeasi zi",
    now,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.resolved.series?.cadence, "remix");
  assert.equal(result.resolved.series?.remix_count, 6);
  assert.equal(result.resolved.series?.remix_size, 5);
  assert.equal(result.resolved.actions.length, 6);
  assert.ok(result.resolved.actions.every((action) => action.media.length === 5));
  const keys = result.resolved.actions.map((action) =>
    action.media
      .map((item) => item.id)
      .slice()
      .sort()
      .join("|"),
  );
  assert.equal(new Set(keys).size, 6);
  assert.ok(result.resolved.actions.every((action) => action.scheduled_at_iso?.startsWith("2026-08-26")));
  assert.ok(
    result.resolved.actions.every((action) =>
      action.platforms.every((platform) => platform.contentType === "carousel"),
    ),
  );
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
