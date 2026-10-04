import assert from "node:assert/strict";
import test from "node:test";
import { buildPosterPrompt } from "./poster";

test("poster prompt keeps the headline and site, and asks to reuse attached photos", () => {
  const prompt = buildPosterPrompt({
    locale: "ro",
    brief: "poster pentru lansare",
    headline: "Postează inteligent",
    brandName: "Posty",
    siteTitle: "posty.now",
    siteDescription: "Studio social",
    siteUrl: "https://posty.now",
    hasReferences: true,
  });
  assert.match(prompt, /Postează inteligent/);
  assert.match(prompt, /https:\/\/posty\.now/);
  const withPrice = buildPosterPrompt({
    locale: "ro",
    brief: "poster produs",
    siteTitle: "Lampa",
    siteUrl: "https://shop.ro/p/lampa",
    price: "189 RON",
    hasReferences: false,
  });
  assert.match(withPrice, /189 RON/);
  assert.match(prompt, /attached or page photos/);
  assert.match(prompt, /Romanian/);
});
