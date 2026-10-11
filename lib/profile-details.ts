export type ProfileDetails = {
  display_name: string;
  company_site: string;
  contact_email: string;
  contact_phone: string;
  billing_name: string;
  billing_tax_id: string;
  billing_address: string;
  billing_city: string;
  billing_postal_code: string;
  billing_country: string;
};

const LIMITS = {
  display_name: 80,
  company_site: 300,
  contact_email: 160,
  contact_phone: 40,
  billing_name: 160,
  billing_tax_id: 40,
  billing_address: 200,
  billing_city: 80,
  billing_postal_code: 20,
  billing_country: 80,
} as const;

function optionalText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function optionalSite(value: unknown): string {
  const text = optionalText(value, LIMITS.company_site);
  if (!text) return "";
  const withProto = /^https?:\/\//i.test(text) ? text : `https://${text}`;
  try {
    const url = new URL(withProto);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return text;
  }
}

function optionalEmail(value: unknown): string {
  const text = optionalText(value, LIMITS.contact_email);
  if (!text) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? text : "";
}

export function parseProfileDetails(payload: unknown): ProfileDetails {
  const body = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  return {
    display_name: optionalText(body.display_name, LIMITS.display_name),
    company_site: optionalSite(body.company_site),
    contact_email: optionalEmail(body.contact_email),
    contact_phone: optionalText(body.contact_phone, LIMITS.contact_phone),
    billing_name: optionalText(body.billing_name, LIMITS.billing_name),
    billing_tax_id: optionalText(body.billing_tax_id, LIMITS.billing_tax_id),
    billing_address: optionalText(body.billing_address, LIMITS.billing_address),
    billing_city: optionalText(body.billing_city, LIMITS.billing_city),
    billing_postal_code: optionalText(body.billing_postal_code, LIMITS.billing_postal_code),
    billing_country: optionalText(body.billing_country, LIMITS.billing_country),
  };
}

export function profileDetailsFromRow(
  row: Partial<ProfileDetails> | null | undefined,
  fallbackEmail?: string | null,
): ProfileDetails {
  return {
    display_name: optionalText(row?.display_name, LIMITS.display_name),
    company_site: optionalText(row?.company_site, LIMITS.company_site),
    contact_email: optionalText(row?.contact_email ?? fallbackEmail, LIMITS.contact_email),
    contact_phone: optionalText(row?.contact_phone, LIMITS.contact_phone),
    billing_name: optionalText(row?.billing_name, LIMITS.billing_name),
    billing_tax_id: optionalText(row?.billing_tax_id, LIMITS.billing_tax_id),
    billing_address: optionalText(row?.billing_address, LIMITS.billing_address),
    billing_city: optionalText(row?.billing_city, LIMITS.billing_city),
    billing_postal_code: optionalText(row?.billing_postal_code, LIMITS.billing_postal_code),
    billing_country: optionalText(row?.billing_country, LIMITS.billing_country),
  };
}
