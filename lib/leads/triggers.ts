export const DEFAULT_LEAD_PHRASES = [
  "pret",
  "preț",
  "cat costa",
  "cât costă",
  "mai e valabil",
  "mai este valabil",
  "disponibil",
  "vreau",
  "rezerv",
  "rezerva",
  "credit",
  "rate",
  "oferta",
  "ofertă",
  "price",
  "how much",
  "available",
  "still available",
  "i want",
  "interested",
];

function compact(value: string) {
  return value
    .toLocaleLowerCase("ro")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function textMatchesPhrases(text: string, phrases: string[]) {
  const hay = compact(text);
  if (hay.length < 3) return false;
  return phrases.some((phrase) => {
    const needle = compact(phrase);
    return needle.length >= 3 && hay.includes(needle);
  });
}

export function looksLikePraiseOnly(text: string) {
  const compactText = compact(text);
  if (compactText.length < 4) return true;
  const stripped = compactText.replace(
    /(super|frumos|frumoasa|wow|fire|lit|love|like|emoji|poza|poz|foto|photo|imagine|pic)+/g,
    "",
  );
  return stripped.length < 3;
}
