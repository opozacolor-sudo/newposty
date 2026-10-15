import assert from "node:assert/strict";
import test from "node:test";
import {
  PACKAGES_FROM_ISO,
  PROMO_PHOTO_UNITS,
  PROMO_UNTIL_ISO,
  PROMO_VIDEO_UNITS,
  promoActive,
  promoCreditSessionId,
  promoStillOpen,
} from "./promo";

test("launch promo is 15 photos and 15 videos until 15 November 2026", () => {
  assert.equal(PROMO_PHOTO_UNITS, 15);
  assert.equal(PROMO_VIDEO_UNITS, 15);
  assert.equal(promoStillOpen(new Date("2026-11-15T20:00:00.000Z")), true);
  assert.equal(promoStillOpen(new Date("2026-11-15T22:00:00.000Z")), false);
  assert.ok(Date.parse(PACKAGES_FROM_ISO) < Date.parse(PROMO_UNTIL_ISO));
});

test("promoActive reads the stored end date", () => {
  assert.equal(promoActive(null, new Date("2026-10-20T12:00:00.000Z")), false);
  assert.equal(promoActive(PROMO_UNTIL_ISO, new Date("2026-11-01T12:00:00.000Z")), true);
  assert.equal(promoActive(PROMO_UNTIL_ISO, new Date("2026-11-16T00:00:00.000Z")), false);
  assert.equal(promoCreditSessionId("u1", "image"), "promo-nov2026-image-u1");
});
