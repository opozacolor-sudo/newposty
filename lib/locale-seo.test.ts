import assert from "node:assert/strict";
import test from "node:test";
import { localeAlternates, pathWithoutLocale } from "./locale-seo";

test("strips the locale prefix", () => {
  assert.equal(pathWithoutLocale("/en", "en"), "");
  assert.equal(pathWithoutLocale("/en/", "en"), "");
  assert.equal(pathWithoutLocale("/en/pricing", "en"), "/pricing");
  assert.equal(pathWithoutLocale("/ro/guide/chat", "ro"), "/guide/chat");
});

test("canonical and x-default point at prefixed locale URLs, not /", () => {
  const home = localeAlternates("en", "/en");
  assert.equal(home.canonical, "https://posty.now/en");
  assert.equal(home.languages?.["x-default"], "https://posty.now/en");
  assert.equal(home.languages?.ro, "https://posty.now/ro");

  const pricing = localeAlternates("ro", "/ro/pricing");
  assert.equal(pricing.canonical, "https://posty.now/ro/pricing");
  assert.equal(pricing.languages?.["x-default"], "https://posty.now/en/pricing");
  assert.equal(pricing.languages?.en, "https://posty.now/en/pricing");
});
