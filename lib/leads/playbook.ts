export type LeadPlaybook = {
  kind: string;
  product_name?: string | null;
  product_price?: number | null;
  debt_ratio: number;
  months: number;
  cash_factor: number;
};

export type CreditQualification = {
  method: "credit" | "cash" | null;
  salary?: number | null;
  tenureMonths?: number | null;
  maxPrice?: number | null;
  eligible?: boolean | null;
};

export function qualifyAutoCredit(input: {
  playbook: LeadPlaybook;
  salary: number;
  tenureMonths?: number | null;
}): CreditQualification {
  const salary = Math.max(0, input.salary);
  const total = salary * input.playbook.debt_ratio * input.playbook.months;
  const maxPrice = input.playbook.cash_factor > 0 ? total / input.playbook.cash_factor : total;
  const price = input.playbook.product_price;
  return {
    method: "credit",
    salary,
    tenureMonths: input.tenureMonths ?? null,
    maxPrice,
    eligible: typeof price === "number" && price > 0 ? maxPrice >= price : null,
  };
}

export function parseConsent(text: string): boolean | null {
  const lower = text.toLocaleLowerCase("en");
  const trimmed = lower.replace(/[!.?,-]/g, " ").replace(/\s+/g, " ").trim();
  if (/^(nu|no|nein|non|refuz|refuse)$/.test(trimmed)) return false;
  if (/^(da|yes|ja|oui|s[iìí]|ok|okay|acord|agree)$/.test(trimmed)) return true;
  if (/\b(nu|no|nein|non|refuz|refuse)\b/.test(lower)) return false;
  if (/\b(da|yes|ja|oui|s[ìí]|ok|okay|acord|agree)\b/.test(lower)) return true;
  return null;
}

export function parsePurchaseMethod(text: string): "credit" | "cash" | null {
  const lower = text.toLocaleLowerCase("ro");
  if (/credit|rate|leasing|finant|finanț/.test(lower)) return "credit";
  if (/cash|bani|numerar|integral|avem banii|am banii/.test(lower)) return "cash";
  return null;
}

export function parseMoneyAndMonths(text: string) {
  const numbers = [...text.matchAll(/(\d+(?:[.,]\d+)?)/g)].map((match) =>
    Number(match[1].replace(",", ".")),
  );
  const months =
    text.match(/(\d+)\s*(luni|luna|months|month)/i)?.[1] ??
    (numbers.find((value) => value > 0 && value <= 120) && /an|luni|month/.test(text.toLowerCase())
      ? String(numbers.find((value) => value > 0 && value <= 120))
      : null);
  const salary = [...numbers].sort((a, b) => b - a).find((value) => value >= 800) ?? null;
  return {
    salary,
    tenureMonths: months ? Number(months) : numbers.find((value) => value > 0 && value <= 120) ?? null,
  };
}

export function parseContact(text: string) {
  const email = text.match(/[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+/)?.[0] ?? null;
  const phone = text.match(/(\+?\d[\d\s().-]{6,}\d)/)?.[1]?.replace(/[^\d+]/g, "") ?? null;
  const without = text
    .replace(email ?? "", "")
    .replace(phone ?? "", "")
    .replace(/nume|telefon|email|tel|mail/gi, "")
    .replace(/[,:]+/g, " ")
    .trim();
  const fullName = without.split(/\s+/).filter((part) => part.length > 1).slice(0, 5).join(" ") || null;
  return { email, phone, fullName };
}
