export type LegalSection = { id: string; heading: string; body: string[] };

export type LegalPageId = "terms" | "privacy" | "cookies" | "refunds" | "subscription";

export type LegalPage = {
  id: LegalPageId;
  href: string;
  label: string;
  title: string;
  description: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

export type LegalCompany = {
  name: string;
  cui: string;
  reg: string;
  euid: string;
  founded: string;
  email: string;
  site: string;
};
