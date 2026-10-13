import assert from "node:assert/strict";
import test from "node:test";
import { helpKnowledge } from "./knowledge";
import { helpSystemPrompt } from "./prompt";

test("help knowledge stays in the product voice and the locale", () => {
  const ro = helpKnowledge("ro");
  assert.match(ro, /conexiuni/i);
  assert.match(ro, /tva/i);
  assert.doesNotMatch(ro, /zernio/i);
  assert.doesNotMatch(helpSystemPrompt({ locale: "en" }), /zernio/i);
});
