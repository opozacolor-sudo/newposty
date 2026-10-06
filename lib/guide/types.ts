export type GuideTip = { title: string; body: string };
export type GuideExample = string;
export type GuideNetwork = {
  name: string;
  can: string;
  boost: string;
  audiences: string;
  stats: string;
  note?: string;
};

export type GuideSection = {
  id: string;
  title: string;
  lead?: string;
  body: string[];
  tips?: GuideTip[];
  examples?: GuideExample[];
  networks?: GuideNetwork[];
  featured?: "voice";
};

export type GuideDoc = {
  title: string;
  subtitle: string;
  toc: string;
  tipLabel: string;
  tryLabel: string;
  ctaTitle: string;
  ctaButton: string;
  downloadLabel: string;
  pdfHref: string;
  quoteStart: string;
  quoteEnd: string;
  networkLabels: {
    can: string;
    boost: string;
    audiences: string;
    stats: string;
  };
  sections: GuideSection[];
};
