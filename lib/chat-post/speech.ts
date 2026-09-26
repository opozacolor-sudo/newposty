export type SpeechResultLike = {
  isFinal: boolean;
  0?: { transcript: string };
  item?: (index: number) => { transcript: string } | undefined;
};

export function transcriptFromResult(result: SpeechResultLike) {
  return (result[0]?.transcript ?? result.item?.(0)?.transcript ?? "").replace(/\s+/g, " ").trim();
}

function foldSpeech(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("ro")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

export function sameSpeechPiece(left?: string, right?: string) {
  return foldSpeech(left ?? "") === foldSpeech(right ?? "");
}

export function composeSpeechTranscript(results: ArrayLike<SpeechResultLike>) {
  const finals: string[] = [];
  let interim = "";
  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    const piece = transcriptFromResult(result);
    if (!piece) continue;
    if (result.isFinal) {
      if (!sameSpeechPiece(finals[finals.length - 1], piece)) finals.push(piece);
      continue;
    }
    if (!sameSpeechPiece(finals[finals.length - 1], piece)) interim = piece;
  }
  return {
    finalText: finals.join(" "),
    interim,
  };
}

export function isAndroidSpeech() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}
