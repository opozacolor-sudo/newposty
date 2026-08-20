import assert from "node:assert/strict";
import test from "node:test";
import { classifyPublishOutcome, platformErrorText } from "./publish-status";
import { humanZernioError } from "../zernio-error-messages";

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

test("HTTP create without a platform status is pending, not success", () => {
  assert.equal(
    classifyPublishOutcome({
      post: { _id: "1", status: "publishing", platforms: [{ platform: "tiktok", status: "pending" }] },
      platform: "tiktok",
      mode: "publish_now",
    }),
    "pending",
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

test("TikTok daily quota gets a plain-language error", () => {
  const ro = humanZernioError({
    code: "quota_exhausted",
    message: "Daily active user quota reached.",
    locale: "ro",
  });
  assert.match(ro, /limit/i);
  assert.match(
    humanZernioError({ message: "TikTok: Daily active user quota reached.", locale: "en" }),
    /daily/i,
  );
});
