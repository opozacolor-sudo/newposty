import { isAppLocale, type AppLocale } from "@/lib/locales";

const COPY = {
  noImageCredits: {
    en: "You’re out of photo credits. Buy a 30-photo pack on Profile.",
    ro: "Nu mai ai credit de poze. Cumpără pachetul de 30 de poze din Profil.",
    de: "Dein Fotoguthaben ist leer. Kauf ein 30-Fotos-Paket unter Profil.",
    it: "Hai finito i crediti foto. Compra il pacchetto da 30 foto nel Profilo.",
    fr: "Plus de crédits photo. Achète le pack 30 photos dans Profil.",
    es: "No te quedan créditos de fotos. Compra el pack de 30 fotos en Perfil.",
  },
  noVideoCredits: {
    en: "You’re out of video credits. Buy a 30-video pack on Profile.",
    ro: "Nu mai ai credit de video. Cumpără pachetul de 30 de video din Profil.",
    de: "Dein Videoguthaben ist leer. Kauf ein 30-Video-Paket unter Profil.",
    it: "Hai finito i crediti video. Compra il pacchetto da 30 video nel Profilo.",
    fr: "Plus de crédits vidéo. Achète le pack 30 vidéos dans Profil.",
    es: "No te quedan créditos de vídeo. Compra el pack de 30 vídeos en Perfil.",
  },
  needPromote: {
    en: "Paid ads are on Promovare or Creștere. Open Profile to subscribe.",
    ro: "Reclamele plătite sunt pe Promovare sau Creștere. Deschide Profil ca să te abonezi.",
    de: "Bezahlte Ads gibt es in Promovare oder Creștere. Öffne Profil zum Abonnieren.",
    it: "Le ads a pagamento sono su Promovare o Creștere. Apri Profilo per abbonarti.",
    fr: "Les pubs payantes sont sur Promovare ou Creștere. Ouvre Profil pour t’abonner.",
    es: "Los anuncios de pago están en Promovare o Creștere. Abre Perfil para suscribirte.",
  },
  needGrowth: {
    en: "Leads are on Creștere. Open Profile to subscribe.",
    ro: "Lead-urile sunt pe Creștere. Deschide Profil ca să te abonezi.",
    de: "Leads gibt es in Creștere. Öffne Profil zum Abonnieren.",
    it: "I lead sono su Creștere. Apri Profilo per abbonarti.",
    fr: "Les leads sont sur Creștere. Ouvre Profil pour t’abonner.",
    es: "Los leads están en Creștere. Abre Perfil para suscribirte.",
  },
  adsLimit: {
    en: "This plan includes up to 3 ads accounts.",
    ro: "Planul include maxim 3 conturi ads.",
    de: "Dieser Plan umfasst maximal 3 Ads-Konten.",
    it: "Questo piano include al massimo 3 account ads.",
    fr: "Ce plan inclut 3 comptes ads maximum.",
    es: "Este plan incluye un máximo de 3 cuentas ads.",
  },
} as const;

export type BillingCopyKey = keyof typeof COPY;

export function billingCopy(locale: string | undefined, key: BillingCopyKey) {
  const table = COPY[key];
  const loc: AppLocale = isAppLocale(locale) ? locale : "en";
  return table[loc];
}
