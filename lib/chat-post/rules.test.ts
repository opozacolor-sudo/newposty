import assert from "node:assert/strict";
import test from "node:test";
import { canonicalizePlatform, getPlatformCapability } from "../platform-capabilities";
import {
  adaptContentType,
  contentTypeForPlatform,
  matchScheduledReference,
  resolvePlatformSelection,
  truncateCaption,
  validationReason,
} from "./rules";
import { isFutureDate, parseScheduledAt } from "./timezone";

test("aliases map to canonical platform ids", () => {
  assert.equal(canonicalizePlatform("ig"), "instagram");
  assert.equal(canonicalizePlatform("x"), "twitter");
  assert.equal(canonicalizePlatform("google my business"), "googlebusiness");
  assert.equal(canonicalizePlatform("pagina de facebook"), "facebook");
  assert.equal(canonicalizePlatform("__all_connected__"), "__all_connected__");
});

test("all networks expands from connected accounts and applies exclusions", () => {
  const result = resolvePlatformSelection({
    requested: ["__all_connected__"],
    excluded: ["x"],
    connectedPlatforms: ["instagram", "twitter", "tiktok"],
  });
  assert.deepEqual(result.platforms.sort(), ["instagram", "tiktok"]);
  assert.equal(result.wantsAll, true);
});

test("tiktok rejects images", () => {
  const reason = validationReason({
    platform: "tiktok",
    capability: getPlatformCapability("tiktok"),
    media: [{ id: "1", url: "https://example.com/a.jpg", type: "image" }],
    locale: "en",
  });
  assert.ok(reason);
  assert.match(reason ?? "", /video/i);
});

test("tiktok accepts a reel-tagged video instead of dropping the platform", () => {
  const media = [{ id: "1", url: "https://example.com/a.mp4", type: "video" as const }];
  const reason = validationReason({
    platform: "tiktok",
    capability: getPlatformCapability("tiktok"),
    media,
    contentType: "reels",
    locale: "ro",
  });
  assert.equal(reason, null);
  assert.deepEqual(
    adaptContentType({ platform: "tiktok", requested: "reels", mediaKind: "video" }),
    { contentType: "video", incompatible: false },
  );
});

test("instagram maps a generic video type to reels", () => {
  assert.deepEqual(
    adaptContentType({ platform: "instagram", requested: "video", mediaKind: "video" }),
    { contentType: "reels", incompatible: false },
  );
});

test("Instagram reel and TikTok applies reels only to Instagram", () => {
  const input = {
    contentType: "reels",
    contentTypes: { instagram: "reels" } as Record<string, string>,
  };
  assert.equal(contentTypeForPlatform({ platform: "instagram", ...input }), "reels");
  assert.equal(contentTypeForPlatform({ platform: "tiktok", contentTypes: input.contentTypes }), undefined);
  assert.equal(contentTypeForPlatform({ platform: "tiktok", contentType: "reels" }), undefined);
});

test("Instagram as video and TikTok stays a normal TikTok video", () => {
  const media = [{ id: "1", url: "https://example.com/a.mp4", type: "video" as const }];
  assert.equal(contentTypeForPlatform({ platform: "tiktok", contentType: "video" }), "video");
  assert.equal(contentTypeForPlatform({ platform: "instagram", contentType: "video" }), undefined);
  assert.deepEqual(
    adaptContentType({ platform: "instagram", requested: "video", mediaKind: "video" }),
    { contentType: "reels", incompatible: false },
  );
  assert.equal(
    validationReason({
      platform: "tiktok",
      capability: getPlatformCapability("tiktok"),
      media,
      contentType: "video",
      locale: "ro",
    }),
    null,
  );
});

test("instagram without media is excluded", () => {
  const reason = validationReason({
    platform: "instagram",
    capability: getPlatformCapability("instagram"),
    media: [],
    locale: "ro",
  });
  assert.ok(reason);
});

test("user caption over the limit is truncated with a warning flag", () => {
  const result = truncateCaption("abcdefghij", 8);
  assert.equal(result.truncated, true);
  assert.ok(result.caption.endsWith("…"));
  assert.ok(result.caption.length <= 8);
});

test("past schedule times are rejected", () => {
  const past = parseScheduledAt("2020-01-01T18:00:00", "Europe/Bucharest");
  assert.ok(past);
  assert.equal(isFutureDate(past), false);
});

test("ambiguous scheduled references stay as a list", () => {
  const matches = matchScheduledReference("instagram", [
    { id: "1", platform: "instagram", caption: "hello", scheduled_at: "2026-08-21T18:00:00Z" },
    { id: "2", platform: "instagram", caption: "later", scheduled_at: "2026-08-22T18:00:00Z" },
    { id: "3", platform: "tiktok", caption: "hello", scheduled_at: "2026-08-21T18:00:00Z" },
  ]);
  assert.equal(matches.length, 2);
});
