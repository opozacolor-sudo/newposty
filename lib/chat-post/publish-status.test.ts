import assert from "node:assert/strict";
import test from "node:test";
import { classifyPublishOutcome, platformErrorText, platformPublicUrl } from "./publish-status";
import { humanZernioError } from "../zernio-error-messages";
import { platformProfileUrl } from "../platforms";

test("create accepted is not success if TikTok later failed", () => {
  const post = {
    _id: "1",
    status: "failed",
    platforms: [
      {
        platform: "tiktok",
        status: "failed",
        errorMessage: "Daily active user quota reached.",
        errorCategory: "quota_exhausted",
      },
    ],
  };
  assert.equal(classifyPublishOutcome({ post, platform: "tiktok", mode: "publish_now" }), "error");
  assert.match(platformErrorText(post, "tiktok"), /quota/i);
});

test("in-flight TikTok is pending, not an error, even if the aggregate is partial", () => {
  assert.equal(
    classifyPublishOutcome({
      post: {
        _id: "1",
        status: "partial",
        platforms: [{ platform: "tiktok", status: "processing" }],
      },
      platform: "tiktok",
      mode: "publish_now",
    }),
    "pending",
  );
});

test("published without a public URL is still success", () => {
  assert.equal(
    classifyPublishOutcome({
      post: {
        _id: "1",
        status: "published",
        platforms: [{ platform: "tiktok", status: "published" }],
      },
      platform: "tiktok",
      mode: "publish_now",
    }),
    "success",
  );
});

test("platformPublicUrl reads permalink when platformPostUrl is missing", () => {
  assert.equal(
    platformPublicUrl({ platform: "tiktok", permalink: "https://www.tiktok.com/@a/video/1" }),
    "https://www.tiktok.com/@a/video/1",
  );
});

test("published Instagram is success", () => {
  assert.equal(
    classifyPublishOutcome({
      post: {
        _id: "1",
        status: "published",
        platforms: [{ platform: "instagram", status: "published", platformPostUrl: "https://ig" }],
      },
      platform: "instagram",
      mode: "publish_now",
    }),
    "success",
  );
});

test("TikTok profile fallback url is the public profile", () => {
  assert.equal(platformProfileUrl("tiktok", "@aipixxel"), "https://www.tiktok.com/@aipixxel");
});

test("TikTok daily active-user cap is not blamed on posting too many clips", () => {
  const ro = humanZernioError({
    code: "quota_exhausted",
    message: "Daily active user quota reached.",
    locale: "ro",
  });
  assert.match(ro, /utilizatori activi/i);
  assert.doesNotMatch(ro, /prea multe postări/i);
  assert.match(
    humanZernioError({ message: "TikTok: Daily active user quota reached.", locale: "en" }),
    /connected apps/i,
  );
});
