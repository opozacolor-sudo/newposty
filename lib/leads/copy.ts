import type { CreditQualification, LeadPlaybook } from "@/lib/leads/playbook";

export function agentCopy(locale: "ro" | "en") {
  const ro = locale === "ro";
  return {
    commentInvite: ro
      ? "Salut! Am văzut mesajul. Scrie-mi te rog în privat ca să te pot ajuta."
      : "Hi! I saw your comment. Please message me privately so I can help.",
    intro: (topic: string, termsUrl: string) =>
      ro
        ? `Bună ziua, sunt agentul posty.now pentru ${topic}. Am văzut mesajul. Dacă sunteți de acord cu termenii (${termsUrl}), răspundeți DA ca să vă ajut cu detalii de pe site.`
        : `Hello, I am the posty.now agent for ${topic}. I saw your message. If you agree with the terms (${termsUrl}), reply YES and I will help with details from the site.`,
    askMethod: ro
      ? "Prin ce metodă doriți să achiziționați? Credit sau aveți dumneavoastră banii?"
      : "How would you like to buy — credit, or do you already have the funds?",
    askIncome: ro
      ? "De cât timp lucrați și ce salariu net aveți?"
      : "How long have you been working, and what is your net salary?",
    eligible: (result: CreditQualification, playbook: LeadPlaybook) => {
      const price = playbook.product_price;
      if (result.eligible === true) {
        return ro
          ? `În regulă, se pare că vă puteți încadra${price ? ` (produs ${price}).` : "."} Ce e de făcut? Vă rog să-mi lăsați numele complet, numărul de telefon și adresa de email. Un agent real vă va contacta în cel mai scurt timp.`
          : `You appear to qualify${price ? ` (product ${price}).` : "."} Please send your full name, phone number, and email. A person will contact you shortly.`;
      }
      if (result.eligible === false) {
        return ro
          ? "Din calculul preliminar nu vă încadrați la credit pentru acest preț. Lăsați totuși numele, telefonul și emailul — un agent real verifică opțiunile."
          : "The first calculation does not fit this price on credit. Still leave your name, phone, and email — a person will check options.";
      }
      return ro
        ? "Am notat. Vă rog numele complet, telefonul și emailul. Un agent real vă contactează."
        : "Noted. Please send your full name, phone, and email. A person will contact you.";
    },
    cashNext: ro
      ? "În regulă. Vă rog numele complet, numărul de telefon și adresa de email. Un agent real vă contactează."
      : "All right. Please send your full name, phone number, and email. A person will contact you.",
    needConsent: ro
      ? "Ca să continuăm, răspundeți DA și citiți termenii."
      : "To continue, reply YES after you read the terms.",
    needContact: ro
      ? "Am nevoie de nume, telefon și email ca un coleg să vă sune."
      : "I still need a name, phone, and email so a colleague can call you.",
    done: ro
      ? "Mulțumesc. Sunteți lead calificat. Un agent real vă contactează în cel mai scurt timp."
      : "Thank you. You are a qualified lead. A person will contact you shortly.",
  };
}

export function topicLabel(input: { triggerText?: string | null; postContext?: string | null; productName?: string | null }) {
  const fromPost = (input.postContext || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (fromPost) return fromPost;
  if (input.productName) return input.productName;
  const trigger = (input.triggerText || "").replace(/\s+/g, " ").trim().slice(0, 80);
  return trigger || "oferta din postare";
}
