import type { AppLocale } from "@/lib/locales";

export function localeFromLeadText(text: string): AppLocale {
  const sample = text.trim();
  if (/[ăâîșț]/i.test(sample) || /\b(dumneavoastră|preț|cât|costă|valabil)\b/i.test(sample)) return "ro";
  if (/[ß]/i.test(sample) || /\b(und|nicht|preis|kosten|wieviel|wie viel)\b/i.test(sample)) return "de";
  if (/[ñ¿¡]/i.test(sample) || /\b(cuánto|cuanto|precio|hola|gracias)\b/i.test(sample)) return "es";
  if (/\b(combien|prix|bonjour|s'il)\b/i.test(sample) || /[œæ]/i.test(sample)) return "fr";
  if (/\b(quanto|prezzo|ciao|grazie|per favore)\b/i.test(sample)) return "it";
  if (/[a-z]/i.test(sample)) return "en";
  return "ro";
}
