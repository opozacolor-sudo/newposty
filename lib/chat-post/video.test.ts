import assert from "node:assert/strict";
import test from "node:test";
import {
  pickFalVideoModel,
  FAL_IMAGE_VIDEO_MODEL,
  FAL_TEXT_VIDEO_MODEL,
  VIDEO_DURATION_SEC,
  VIDEO_RESOLUTION,
} from "../fal-video";
import { buildVideoPrompt } from "./video";

test("H3 Max Turbo is always text-to-video, 480p and 5 seconds", () => {
  assert.equal(pickFalVideoModel(false), FAL_TEXT_VIDEO_MODEL);
  assert.equal(pickFalVideoModel(true), FAL_TEXT_VIDEO_MODEL);
  assert.equal(FAL_IMAGE_VIDEO_MODEL, "minimax/h3-max-turbo/image-to-video");
  assert.equal(VIDEO_RESOLUTION, "480P");
  assert.equal(VIDEO_DURATION_SEC, 5);
});

test("video prompt stays vertical and does not ask to animate an attached still", () => {
  const prompt = buildVideoPrompt({
    locale: "ro",
    brief: "clip pentru lansare",
    brandName: "Posty",
    siteTitle: "posty.now",
    siteUrl: "https://posty.now",
    hasImage: false,
  });
  assert.match(prompt, /9:16/);
  assert.match(prompt, /https:\/\/posty\.now/);
  assert.doesNotMatch(prompt, /Animate the attached still/);
  assert.match(prompt, /Romanian/);
});
