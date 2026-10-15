import { pickLocale, type AppLocale } from "@/lib/app-locale";

export type JoinPageCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  promoTitle: string;
  promoLead: string;
  photos: string;
  videos: string;
  profileLater: string;
  nowTitle: string;
  nowLead: string;
  included: string;
  laterTitle: string;
  laterLead: string;
  laterCta: string;
};

const COPY: Record<AppLocale, JoinPageCopy> = {
  en: {
    metaTitle: "Create your studio | posty.now",
    metaDescription:
      "Email and password. Free until 15 November. 15 photos and 15 videos. Complete your profile later.",
    kicker: "Invite",
    title: "Open a studio. Free until 15 November.",
    lead: "Email and password. You fill in the company and billing details later, in Profile.",
    promoTitle: "Included now",
    promoLead: "No card. The studio is free until 15 November. Generation stays at 15 photos and 15 videos.",
    photos: "15 photos",
    videos: "15 videos",
    profileLater: "Company name, billing, and Team come later in Profile.",
    nowTitle: "The packages",
    nowLead: "You can use all three during the free period. After 15 November you pick one and pay.",
    included: "Included until 15 November",
    laterTitle: "Packages after 1 November",
    laterLead: "Prices exclude 21% VAT. Photo and video packs of 30 sit next to the plans — you buy them when you need them.",
    laterCta: "Create the account",
  },
  ro: {
    metaTitle: "Creează-ți studio-ul | posty.now",
    metaDescription:
      "Email și parolă. Gratuit până pe 15 noiembrie. 15 poze și 15 video. Completezi profilul mai târziu.",
    kicker: "Invitație",
    title: "Deschide un studio. Gratuit până pe 15 noiembrie.",
    lead: "Email și parolă. Firma și datele de facturare le completezi mai târziu, în Profil.",
    promoTitle: "Inclus acum",
    promoLead: "Fără card. Studio-ul e gratuit până pe 15 noiembrie. Generarea stă la 15 poze și 15 video.",
    photos: "15 poze",
    videos: "15 video",
    profileLater: "Numele firmei, facturarea și Team le pui mai târziu în Profil.",
    nowTitle: "Pachetele",
    nowLead: "Le poți folosi pe toate trei în perioada gratuită. După 15 noiembrie alegi unul și plătești.",
    included: "Inclus până pe 15 noiembrie",
    laterTitle: "Pachete după 1 noiembrie",
    laterLead: "Prețurile sunt fără TVA 21%. Pachetele de 30 de poze și 30 de video stau lângă planuri — le cumperi când ai nevoie.",
    laterCta: "Creează contul",
  },
  de: {
    metaTitle: "Studio eröffnen | posty.now",
    metaDescription:
      "E-Mail und Passwort. Bis 15. November frei. 15 Fotos und 15 Videos. Profil später ausfüllen.",
    kicker: "Einladung",
    title: "Studio eröffnen. Bis 15. November frei.",
    lead: "E-Mail und Passwort. Firma und Rechnung füllst du später unter Profil aus.",
    promoTitle: "Jetzt enthalten",
    promoLead: "Keine Karte. Das Studio ist bis 15. November frei. Generierung bleibt bei 15 Fotos und 15 Videos.",
    photos: "15 Fotos",
    videos: "15 Videos",
    profileLater: "Firmenname, Rechnung und Team kommen später unter Profil.",
    nowTitle: "Die Pakete",
    nowLead: "Alle drei kannst du in der freien Zeit nutzen. Nach dem 15. November wählst du eines und zahlst.",
    included: "Enthalten bis 15. November",
    laterTitle: "Pakete ab 1. November",
    laterLead: "Preise ohne 21 % MwSt. 30-Foto- und 30-Video-Pakete stehen neben den Plänen — du kaufst sie, wenn du sie brauchst.",
    laterCta: "Konto erstellen",
  },
  it: {
    metaTitle: "Apri il tuo studio | posty.now",
    metaDescription:
      "Email e password. Gratis fino al 15 novembre. 15 foto e 15 video. Completi il profilo dopo.",
    kicker: "Invito",
    title: "Apri uno studio. Gratis fino al 15 novembre.",
    lead: "Email e password. Azienda e fatturazione le completi dopo, in Profilo.",
    promoTitle: "Incluso ora",
    promoLead: "Niente carta. Lo studio è gratis fino al 15 novembre. La generazione resta a 15 foto e 15 video.",
    photos: "15 foto",
    videos: "15 video",
    profileLater: "Nome azienda, fatturazione e Team li metti dopo in Profilo.",
    nowTitle: "I pacchetti",
    nowLead: "Puoi usarli tutti e tre nel periodo gratis. Dopo il 15 novembre ne scegli uno e paghi.",
    included: "Incluso fino al 15 novembre",
    laterTitle: "Pacchetti dal 1° novembre",
    laterLead: "Prezzi senza IVA 21%. I pack da 30 foto e 30 video stanno accanto ai piani — li compri quando ti servono.",
    laterCta: "Crea l’account",
  },
  fr: {
    metaTitle: "Ouvrir votre studio | posty.now",
    metaDescription:
      "E-mail et mot de passe. Gratuit jusqu’au 15 novembre. 15 photos et 15 vidéos. Le profil plus tard.",
    kicker: "Invitation",
    title: "Ouvrez un studio. Gratuit jusqu’au 15 novembre.",
    lead: "E-mail et mot de passe. Société et facturation : plus tard, dans Profil.",
    promoTitle: "Inclus maintenant",
    promoLead: "Sans carte. Le studio est gratuit jusqu’au 15 novembre. La génération reste à 15 photos et 15 vidéos.",
    photos: "15 photos",
    videos: "15 vidéos",
    profileLater: "Nom de société, facturation et Team : plus tard dans Profil.",
    nowTitle: "Les forfaits",
    nowLead: "Vous pouvez utiliser les trois pendant la période gratuite. Après le 15 novembre, vous en choisissez un et vous payez.",
    included: "Inclus jusqu’au 15 novembre",
    laterTitle: "Forfaits dès le 1er novembre",
    laterLead: "Prix hors TVA 21 %. Les packs 30 photos et 30 vidéos sont à côté des plans — vous les achetez au besoin.",
    laterCta: "Créer le compte",
  },
  es: {
    metaTitle: "Crea tu estudio | posty.now",
    metaDescription:
      "Email y contraseña. Gratis hasta el 15 de noviembre. 15 fotos y 15 vídeos. Completas el perfil después.",
    kicker: "Invitación",
    title: "Abre un estudio. Gratis hasta el 15 de noviembre.",
    lead: "Email y contraseña. Empresa y facturación las completas después, en Perfil.",
    promoTitle: "Incluido ahora",
    promoLead: "Sin tarjeta. El estudio es gratis hasta el 15 de noviembre. La generación se queda en 15 fotos y 15 vídeos.",
    photos: "15 fotos",
    videos: "15 vídeos",
    profileLater: "Nombre de empresa, facturación y Team van después en Perfil.",
    nowTitle: "Los paquetes",
    nowLead: "Puedes usar los tres en el periodo gratis. Después del 15 de noviembre eliges uno y pagas.",
    included: "Incluido hasta el 15 de noviembre",
    laterTitle: "Paquetes a partir del 1 de noviembre",
    laterLead: "Precios sin IVA 21 %. Los packs de 30 fotos y 30 vídeos van junto a los planes — los compras cuando los necesitas.",
    laterCta: "Crear la cuenta",
  },
};

export function joinCopy(locale: string) {
  return pickLocale(COPY, locale);
}
