import assert from "node:assert/strict";
import test from "node:test";
import { composeSpeechTranscript } from "./speech";

test("rebuilds one word even if Android repeats the same final", () => {
  const results = Array.from({ length: 14 }, () => ({
    isFinal: true,
    0: { transcript: "programează" },
  }));
  assert.equal(composeSpeechTranscript(results).finalText, "programează");
});

test("keeps a new phrase after a different final", () => {
  const results = [
    { isFinal: true, 0: { transcript: "programează" } },
    { isFinal: true, 0: { transcript: "pe Instagram" } },
    { isFinal: false, 0: { transcript: "mâine" } },
  ];
  const next = composeSpeechTranscript(results);
  assert.equal(next.finalText, "programează pe Instagram");
  assert.equal(next.interim, "mâine");
});

test("ignores an interim that only repeats the last final", () => {
  const results = [
    { isFinal: true, 0: { transcript: "programează" } },
    { isFinal: false, 0: { transcript: "Programeaza" } },
  ];
  const next = composeSpeechTranscript(results);
  assert.equal(next.finalText, "programează");
  assert.equal(next.interim, "");
});
