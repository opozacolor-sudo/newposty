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
  promoNoImage: {
    en: "The free period includes 15 photos, until 15 November. Extra photo packs start after that.",
    ro: "Perioada gratuită include 15 poze, până pe 15 noiembrie. Pachetele extra de poze încep după.",
    de: "Die freie Zeit umfasst 15 Fotos, bis 15. November. Extra-Fotopakete kommen danach.",
    it: "Il periodo gratis include 15 foto, fino al 15 novembre. I pack extra di foto partono dopo.",
    fr: "La période gratuite inclut 15 photos, jusqu’au 15 novembre. Les packs photo extra viennent après.",
    es: "El periodo gratis incluye 15 fotos, hasta el 15 de noviembre. Los packs extra de fotos empiezan después.",
  },
  promoNoVideo: {
    en: "The free period includes 15 videos, until 15 November. Extra video packs start after that.",
    ro: "Perioada gratuită include 15 video, până pe 15 noiembrie. Pachetele extra de video încep după.",
    de: "Die freie Zeit umfasst 15 Videos, bis 15. November. Extra-Videopakete kommen danach.",
    it: "Il periodo gratis include 15 video, fino al 15 novembre. I pack extra di video partono dopo.",
    fr: "La période gratuite inclut 15 vidéos, jusqu’au 15 novembre. Les packs vidéo extra viennent après.",
    es: "El periodo gratis incluye 15 vídeos, hasta el 15 de noviembre. Los packs extra de vídeo empiezan después.",
  },
  promoPacksLater: {
    en: "Photo and video packs of 30 start after the free period, on 15 November.",
    ro: "Pachetele de 30 de poze și 30 de video încep după perioada gratuită, pe 15 noiembrie.",
    de: "30er Foto- und Videopakete starten nach der freien Zeit, am 15. November.",
    it: "I pack da 30 foto e 30 video partono dopo il periodo gratis, il 15 novembre.",
    fr: "Les packs 30 photos et 30 vidéos commencent après la période gratuite, le 15 novembre.",
    es: "Los packs de 30 fotos y 30 vídeos empiezan después del periodo gratis, el 15 de noviembre.",
  },
} as const;

export type BillingCopyKey = keyof typeof COPY;

export function billingCopy(locale: string | undefined, key: BillingCopyKey) {
  const table = COPY[key];
  const loc: AppLocale = isAppLocale(locale) ? locale : "en";
  return table[loc];
}

export function generationCreditMessage(
  locale: string | undefined,
  kind: "image" | "video",
  promo: boolean,
) {
  if (promo) return billingCopy(locale, kind === "image" ? "promoNoImage" : "promoNoVideo");
  return billingCopy(locale, kind === "image" ? "noImageCredits" : "noVideoCredits");
}
