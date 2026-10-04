import assert from "node:assert/strict";
import test from "node:test";
import { pickFalVideoModel, FAL_IMAGE_VIDEO_MODEL, FAL_TEXT_VIDEO_MODEL } from "../fal-video";
import { buildVideoPrompt } from "./video";

test("cheap H3 Max Turbo for text-only clips, image-to-video when a still exists", () => {
  assert.equal(pickFalVideoModel(false), FAL_TEXT_VIDEO_MODEL);
  assert.equal(pickFalVideoModel(true), FAL_IMAGE_VIDEO_MODEL);
});

test("video prompt stays vertical and reuses the still when one is attached", () => {
  const prompt = buildVideoPrompt({
    locale: "ro",
    brief: "animă posterul",
    brandName: "Posty",
    siteTitle: "posty.now",
    siteUrl: "https://posty.now",
    hasImage: true,
  });
  assert.match(prompt, /9:16/);
  assert.match(prompt, /https:\/\/posty\.now/);
  assert.match(prompt, /Animate the attached still/);
  assert.match(prompt, /Romanian/);
});
