import assert from "node:assert/strict";
import test from "node:test";
import {
  hasClockTime,
  nextBestTime,
  parseDateOnly,
  wantsBestTime,
} from "./best-time";

const ZONE = "Europe/Bucharest";

test("best-time tokens and date-only values are not clock times", () => {
  assert.equal(wantsBestTime({ use_best_time: true }), true);
  assert.equal(wantsBestTime({ scheduled_at_iso: "best_time" }), true);
  assert.equal(hasClockTime("2026-08-25T18:00:00"), true);
  assert.equal(hasClockTime("2026-08-25"), false);
  assert.equal(hasClockTime("best"), false);
  assert.equal(parseDateOnly("2026-08-25"), "2026-08-25");
});

test("Instagram picks late-morning peak later the same weekday", () => {
  // Tuesday 25 Aug 2026, 10:00 in Bucharest (EEST, UTC+3)
  const now = new Date("2026-08-25T07:00:00.000Z");
  const next = nextBestTime({ platform: "instagram", timeZone: ZONE, now });
  assert.equal(next?.toISOString(), "2026-08-25T08:00:00.000Z");
});

test("Instagram falls back to evening if the morning window passed", () => {
  const now = new Date("2026-08-25T08:30:00.000Z"); // 11:30 Bucharest
  const next = nextBestTime({ platform: "instagram", timeZone: ZONE, now });
  assert.equal(next?.toISOString(), "2026-08-25T16:00:00.000Z"); // 19:00
});

test("Instagram stories prefer lunch over 11:00", () => {
  const now = new Date("2026-08-25T07:00:00.000Z");
  const next = nextBestTime({
    platform: "instagram",
    contentType: "stories",
    timeZone: ZONE,
    now,
  });
  assert.equal(next?.toISOString(), "2026-08-25T09:00:00.000Z"); // 12:00
});

test("TikTok prefers weekday evening", () => {
  const now = new Date("2026-08-25T07:00:00.000Z");
  const next = nextBestTime({ platform: "tiktok", timeZone: ZONE, now });
  assert.equal(next?.toISOString(), "2026-08-25T16:00:00.000Z"); // 19:00
});

test("LinkedIn skips the weekend and lands on Monday morning", () => {
  // Saturday 29 Aug 2026, 10:00 Bucharest
  const now = new Date("2026-08-29T07:00:00.000Z");
  const next = nextBestTime({ platform: "linkedin", timeZone: ZONE, now });
  assert.equal(next?.toISOString(), "2026-08-31T06:00:00.000Z"); // Mon 09:00
});

test("onOrAfterYmd starts from the named day", () => {
  const now = new Date("2026-08-25T07:00:00.000Z");
  const next = nextBestTime({
    platform: "instagram",
    timeZone: ZONE,
    now,
    onOrAfterYmd: "2026-08-26",
  });
  assert.equal(next?.toISOString(), "2026-08-26T08:00:00.000Z"); // Wed 11:00
});

test("resolve splits Instagram and TikTok when peak hours differ", async () => {
  const { resolveCreateActions } = await import("./resolve");
  const now = new Date("2026-08-25T07:00:00.000Z");
  const result = await resolveCreateActions({
    actions: [
      {
        mode: "schedule",
        use_best_time: true,
        platforms: ["instagram", "tiktok"],
        caption: "hello",
        caption_source: "user_provided",
      },
    ],
    accounts: [
      { id: "1", platform: "instagram", username: "ig", display_name: null, zernio_account_id: "z1" },
      { id: "2", platform: "tiktok", username: "tt", display_name: null, zernio_account_id: "z2" },
    ],
    media: [{ id: "m1", url: "https://example.com/a.mp4", type: "video" }],
    locale: "ro",
    timezone: ZONE,
    apiKey: "test",
    keepToolCaption: true,
    now,
  });
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.resolved.actions.length, 2);
  const hours = result.resolved.actions.map((action) => action.scheduled_at_iso);
  assert.ok(hours.some((value) => value?.includes("T11:00:00")));
  assert.ok(hours.some((value) => value?.includes("T19:00:00")));
  assert.ok(result.resolved.warnings.some((warning) => /research/i.test(warning)));
});
