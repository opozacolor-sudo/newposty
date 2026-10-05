import assert from "node:assert/strict";
import test from "node:test";
import { chatLanguageName, isAppLocale, speechLangFor } from "./locales";

test("new studio languages are first-class locales", () => {
  for (const locale of ["en", "ro", "de", "it", "fr", "es"]) {
    assert.equal(isAppLocale(locale), true);
  }
  assert.equal(isAppLocale("pt"), false);
  assert.equal(chatLanguageName("de"), "German");
  assert.equal(chatLanguageName("it"), "Italian");
  assert.equal(chatLanguageName("fr"), "French");
  assert.equal(chatLanguageName("es"), "Spanish");
  assert.equal(speechLangFor("de"), "de-DE");
});
