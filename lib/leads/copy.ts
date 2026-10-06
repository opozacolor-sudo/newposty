import type { CreditQualification, LeadPlaybook } from "@/lib/leads/playbook";
import type { AppLocale } from "@/lib/locales";
import { isAppLocale } from "@/lib/locales";

type AgentStrings = {
  commentInvite: string;
  intro: (termsUrl: string) => string;
  askMethod: string;
  askIncome: string;
  eligible: (result: CreditQualification, playbook: LeadPlaybook) => string;
  cashNext: string;
  needConsent: string;
  needContact: string;
  done: string;
};

function eligibleCopy(
  locale: AppLocale,
  result: CreditQualification,
  playbook: LeadPlaybook,
) {
  const price = playbook.product_price;
  const withPrice = {
    ro: price ? ` (produs ${price}).` : ".",
    en: price ? ` (product ${price}).` : ".",
    de: price ? ` (Produkt ${price}).` : ".",
    fr: price ? ` (produit ${price}).` : ".",
    it: price ? ` (prodotto ${price}).` : ".",
    es: price ? ` (producto ${price}).` : ".",
  }[locale];
  if (result.eligible === true) {
    return {
      ro: `În regulă, se pare că vă puteți încadra${withPrice} Ce e de făcut? Vă rog să-mi lăsați numele complet, numărul de telefon și adresa de email. Un agent real vă va contacta în cel mai scurt timp.`,
      en: `You appear to qualify${withPrice} Please send your full name, phone number, and email. A person will contact you shortly.`,
      de: `In Ordnung, Sie scheinen zu passen${withPrice} Bitte senden Sie Ihren vollständigen Namen, Ihre Telefonnummer und E-Mail. Eine Person kontaktiert Sie in Kürze.`,
      fr: `D’accord, vous semblez correspondre${withPrice} Merci d’indiquer votre nom complet, téléphone et e-mail. Une personne vous contacte rapidement.`,
      it: `Va bene, sembra che possiate rientrare${withPrice} Vi prego di lasciare nome completo, telefono ed email. Una persona vi contatterà a breve.`,
      es: `De acuerdo, parece que encajáis${withPrice} Dejad nombre completo, teléfono y correo. Una persona os contactará enseguida.`,
    }[locale];
  }
  if (result.eligible === false) {
    return {
      ro: "Din calculul preliminar nu vă încadrați la credit pentru acest preț. Lăsați totuși numele, telefonul și emailul — un agent real verifică opțiunile.",
      en: "The first calculation does not fit this price on credit. Still leave your name, phone, and email — a person will check options.",
      de: "Nach der ersten Berechnung passt dieser Preis auf Kredit nicht. Hinterlassen Sie trotzdem Name, Telefon und E-Mail — eine Person prüft Optionen.",
      fr: "Le premier calcul ne correspond pas à ce prix à crédit. Laissez tout de même nom, téléphone et e-mail — une personne vérifie les options.",
      it: "Dal primo calcolo non rientrate a credito per questo prezzo. Lasciate comunque nome, telefono ed email — una persona verifica le opzioni.",
      es: "El primer cálculo no encaja a crédito para este precio. Dejad igualmente nombre, teléfono y correo: una persona revisará las opciones.",
    }[locale];
  }
  return {
    ro: "Am notat. Vă rog numele complet, telefonul și emailul. Un agent real vă contactează.",
    en: "Noted. Please send your full name, phone, and email. A person will contact you.",
    de: "Notiert. Bitte vollständiger Name, Telefon und E-Mail. Eine Person kontaktiert Sie.",
    fr: "Noté. Merci du nom complet, téléphone et e-mail. Une personne vous contacte.",
    it: "Segnato. Vi prego nome completo, telefono ed email. Una persona vi contatta.",
    es: "Anotado. Nombre completo, teléfono y correo. Una persona os contacta.",
  }[locale];
}

const COPY: Record<AppLocale, AgentStrings> = {
  ro: {
    commentInvite: "Salut! Am văzut mesajul. Scrie-mi te rog în privat ca să te pot ajuta.",
    intro: (termsUrl) =>
      `Bună ziua, sunt agentul posty.now. Am văzut mesajul. Dacă sunteți de acord cu termenii (${termsUrl}), răspundeți DA ca să vă ajut cu detalii de pe site.`,
    askMethod: "Prin ce metodă doriți să achiziționați? Credit sau aveți dumneavoastră banii?",
    askIncome: "De cât timp lucrați și ce salariu net aveți?",
    eligible: (result, playbook) => eligibleCopy("ro", result, playbook),
    cashNext:
      "În regulă. Vă rog numele complet, numărul de telefon și adresa de email. Un agent real vă contactează.",
    needConsent: "Ca să continuăm, răspundeți DA și citiți termenii.",
    needContact: "Am nevoie de nume, telefon și email ca un coleg să vă sune.",
    done: "Mulțumesc. Sunteți lead calificat. Un agent real vă contactează în cel mai scurt timp.",
  },
  en: {
    commentInvite: "Hi! I saw your comment. Please message me privately so I can help.",
    intro: (termsUrl) =>
      `Hello, I am the posty.now agent. I saw your message. If you agree with the terms (${termsUrl}), reply YES and I will help with details from the site.`,
    askMethod: "How would you like to buy — credit, or do you already have the funds?",
    askIncome: "How long have you been working, and what is your net salary?",
    eligible: (result, playbook) => eligibleCopy("en", result, playbook),
    cashNext: "All right. Please send your full name, phone number, and email. A person will contact you.",
    needConsent: "To continue, reply YES after you read the terms.",
    needContact: "I still need a name, phone, and email so a colleague can call you.",
    done: "Thank you. You are a qualified lead. A person will contact you shortly.",
  },
  de: {
    commentInvite: "Hallo! Ich habe deine Nachricht gesehen. Schreib mir bitte privat, damit ich helfen kann.",
    intro: (termsUrl) =>
      `Guten Tag, ich bin der posty.now-Agent. Ich habe Ihre Nachricht gesehen. Wenn Sie den Bedingungen zustimmen (${termsUrl}), antworten Sie JA, damit ich mit Angaben von der Website helfen kann.`,
    askMethod: "Wie möchten Sie kaufen — auf Kredit, oder haben Sie das Geld selbst?",
    askIncome: "Wie lange arbeiten Sie schon, und wie hoch ist Ihr Nettogehalt?",
    eligible: (result, playbook) => eligibleCopy("de", result, playbook),
    cashNext:
      "In Ordnung. Bitte vollständiger Name, Telefonnummer und E-Mail. Eine Person kontaktiert Sie.",
    needConsent: "Um fortzufahren, antworten Sie JA und lesen Sie die Bedingungen.",
    needContact: "Ich brauche noch Name, Telefon und E-Mail, damit ein Kollege anrufen kann.",
    done: "Danke. Sie sind ein qualifizierter Lead. Eine Person kontaktiert Sie in Kürze.",
  },
  fr: {
    commentInvite: "Bonjour ! J’ai vu votre message. Écrivez-moi en privé pour que je puisse vous aider.",
    intro: (termsUrl) =>
      `Bonjour, je suis l’agent posty.now. J’ai vu votre message. Si vous acceptez les conditions (${termsUrl}), répondez OUI pour que je vous aide avec les infos du site.`,
    askMethod: "Comment souhaitez-vous acheter — à crédit, ou avez-vous déjà les fonds ?",
    askIncome: "Depuis combien de temps travaillez-vous, et quel est votre salaire net ?",
    eligible: (result, playbook) => eligibleCopy("fr", result, playbook),
    cashNext:
      "D’accord. Merci d’indiquer votre nom complet, téléphone et e-mail. Une personne vous contacte.",
    needConsent: "Pour continuer, répondez OUI après avoir lu les conditions.",
    needContact: "J’ai encore besoin du nom, du téléphone et de l’e-mail pour qu’un collègue vous appelle.",
    done: "Merci. Vous êtes un lead qualifié. Une personne vous contacte rapidement.",
  },
  it: {
    commentInvite: "Ciao! Ho visto il messaggio. Scrivimi in privato così posso aiutarti.",
    intro: (termsUrl) =>
      `Buongiorno, sono l’agente posty.now. Ho visto il messaggio. Se accettate i termini (${termsUrl}), rispondete SÌ così vi aiuto con i dettagli dal sito.`,
    askMethod: "Come volete acquistare — a credito, o avete già i fondi?",
    askIncome: "Da quanto lavorate e qual è lo stipendio netto?",
    eligible: (result, playbook) => eligibleCopy("it", result, playbook),
    cashNext: "Va bene. Vi prego nome completo, telefono ed email. Una persona vi contatta.",
    needConsent: "Per continuare, rispondete SÌ dopo aver letto i termini.",
    needContact: "Mi servono ancora nome, telefono ed email perché un collega possa chiamarvi.",
    done: "Grazie. Siete un lead qualificato. Una persona vi contatterà a breve.",
  },
  es: {
    commentInvite: "¡Hola! He visto tu mensaje. Escríbeme en privado para poder ayudarte.",
    intro: (termsUrl) =>
      `Hola, soy el agente de posty.now. He visto el mensaje. Si aceptáis los términos (${termsUrl}), responded SÍ y os ayudo con los datos del sitio.`,
    askMethod: "¿Cómo queréis comprar — a crédito, o ya tenéis los fondos?",
    askIncome: "¿Cuánto tiempo lleváis trabajando y cuál es el salario neto?",
    eligible: (result, playbook) => eligibleCopy("es", result, playbook),
    cashNext: "De acuerdo. Nombre completo, teléfono y correo. Una persona os contacta.",
    needConsent: "Para continuar, responded SÍ después de leer los términos.",
    needContact: "Todavía necesito nombre, teléfono y correo para que un compañero os llame.",
    done: "Gracias. Sois un lead cualificado. Una persona os contactará enseguida.",
  },
};

export function agentCopy(locale: string) {
  return COPY[isAppLocale(locale) ? locale : "en"];
}

export function topicLabel(input: { triggerText?: string | null; postContext?: string | null; productName?: string | null }) {
  const fromPost = (input.postContext || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (fromPost) return fromPost;
  if (input.productName) return input.productName;
  const trigger = (input.triggerText || "").replace(/\s+/g, " ").trim().slice(0, 80);
  return trigger || "oferta din postare";
}
