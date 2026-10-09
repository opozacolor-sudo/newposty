import assert from "node:assert/strict";
import test from "node:test";
import {
  FAL_EDIT_MODEL,
  FAL_IMAGE_RESOLUTION,
  FAL_IMAGE_THINKING,
  FAL_TEXT_MODEL,
  falImageAspectRatio,
  pickFalImageModel,
} from "./fal-image";
import { normalizeFalKey } from "./env";

test("Nano Banana 2.1 at 1K for text-only posters, edit when photos exist", () => {
  assert.equal(pickFalImageModel(false), FAL_TEXT_MODEL);
  assert.equal(pickFalImageModel(true), FAL_EDIT_MODEL);
  assert.equal(FAL_TEXT_MODEL, "google/nano-banana-2.1");
  assert.equal(FAL_EDIT_MODEL, "google/nano-banana-2.1/edit");
  assert.equal(FAL_IMAGE_RESOLUTION, "1K");
  assert.equal(FAL_IMAGE_THINKING, "medium");
  assert.equal(falImageAspectRatio("portrait_4_3"), "4:5");
  assert.equal(falImageAspectRatio("square_hd"), "1:1");
  assert.equal(falImageAspectRatio("landscape_4_3"), "4:3");
});

test("strips Key or Bearer prefix from the image API key", () => {
  assert.equal(normalizeFalKey("Key abc"), "abc");
  assert.equal(normalizeFalKey("Bearer abc"), "abc");
  assert.equal(normalizeFalKey("  abc  "), "abc");
});
