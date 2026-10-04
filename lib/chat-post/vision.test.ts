import assert from "node:assert/strict";
import test from "node:test";
import { CAPTION_PHOTO_LIMIT, CHAT_TURN_PHOTO_LIMIT, selectPhotosForClaude } from "./vision";

const photos = Array.from({ length: 18 }, (_, index) => ({
  id: `p${index + 1}`,
  type: "image" as const,
  url: `https://cdn.example/${index + 1}.jpg`,
  name: `${index + 1}.jpg`,
}));

test("chat turn sends a sample of photos, not the whole 18-file batch", () => {
  const picked = selectPhotosForClaude(photos, CHAT_TURN_PHOTO_LIMIT);
  assert.equal(picked.length, 4);
  assert.deepEqual(
    picked.map((item) => item.id),
    ["p1", "p2", "p3", "p4"],
  );
});

test("caption generation looks at at most two photos", () => {
  assert.equal(selectPhotosForClaude(photos, CAPTION_PHOTO_LIMIT).length, 2);
});

test("videos are skipped so they cannot block the request", () => {
  const mixed = [
    { id: "v1", type: "video" as const, url: "https://cdn.example/a.mp4", name: "a.mp4" },
    { id: "p1", type: "image" as const, url: "https://cdn.example/a.jpg", name: "a.jpg" },
  ];
  assert.deepEqual(
    selectPhotosForClaude(mixed, CHAT_TURN_PHOTO_LIMIT).map((item) => item.id),
    ["p1"],
  );
});
