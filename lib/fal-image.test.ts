import assert from "node:assert/strict";
import test from "node:test";
import { FAL_EDIT_MODEL, FAL_TEXT_MODEL, pickFalImageModel } from "./fal-image";

test("cheap Flux.2 [dev] for text-only posters, edit when photos exist", () => {
  assert.equal(pickFalImageModel(false), FAL_TEXT_MODEL);
  assert.equal(pickFalImageModel(true), FAL_EDIT_MODEL);
  assert.equal(FAL_TEXT_MODEL, "fal-ai/flux-2");
  assert.equal(FAL_EDIT_MODEL, "fal-ai/flux-2/edit");
});
