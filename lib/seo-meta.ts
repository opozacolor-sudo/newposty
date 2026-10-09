import type { FeatureSlug } from "@/lib/features";
import type { MadeForSlug } from "@/lib/made-for";
import { pickLocale, type AppLocale } from "@/lib/app-locale";

type Meta = { title: string; description: string };
type LocaleMeta = Record<AppLocale, Meta>;

const FEATURE_META: Record<FeatureSlug, LocaleMeta> = {
  assistant: {
    en: {
      title: "AI assistant for Instagram, TikTok and Facebook | posty.now",
      description:
        "Ask in plain language. The assistant writes captions, keeps your voice, and turns one message into a post or a month of content.",
    },
    ro: {
      title: "Asistent AI pentru Instagram, TikTok și Facebook | posty.now",
      description:
        "Îl întrebi pe limba ta. Asistentul scrie descrieri, ține vocea brandului și transformă un mesaj într-o postare sau într-o lună de conținut.",
    },
    de: {
      title: "KI-Assistent für Instagram, TikTok und Facebook | posty.now",
      description:
        "Frag in Alltagssprache. Der Assistent schreibt Captions, hält deinen Ton und macht aus einer Nachricht einen Post oder einen Monat Content.",
    },
    it: {
      title: "Assistente IA per Instagram, TikTok e Facebook | posty.now",
      description:
        "Chiedi in linguaggio naturale. L’assistente scrive didascalie, tiene il tuo tono e trasforma un messaggio in un post o in un mese di contenuti.",
    },
    fr: {
      title: "Assistant IA pour Instagram, TikTok et Facebook | posty.now",
      description:
        "Parlez simplement. L’assistant rédige les légendes, garde votre ton et transforme un message en une publication ou un mois de contenu.",
    },
    es: {
      title: "Asistente de IA para Instagram, TikTok y Facebook | posty.now",
      description:
        "Pídelo en tu idioma. El asistente escribe pies de foto, mantiene tu tono y convierte un mensaje en una publicación o en un mes de contenido.",
    },
  },
  voice: {
    en: {
      title: "Dictate Instagram and TikTok captions by voice | posty.now",
      description:
        "Talk the brief. posty.now turns a voice note into captions, hashtags, and a scheduled post on the networks you connected.",
    },
    ro: {
      title: "Dictează descrieri Instagram și TikTok | posty.now",
      description:
        "Spui brieful cu vocea. posty.now transformă o notă vocală în descrieri, hashtag-uri și o postare programată pe rețelele conectate.",
    },
    de: {
      title: "Instagram- und TikTok-Texte per Sprache diktieren | posty.now",
      description:
        "Sprich das Briefing. posty.now macht aus einer Sprachnotiz Captions, Hashtags und einen geplanten Beitrag auf deinen Netzwerken.",
    },
    it: {
      title: "Dettatura vocale per didascalie Instagram e TikTok | posty.now",
      description:
        "Dì il brief a voce. posty.now trasforma una nota vocale in didascalie, hashtag e un post programmato sulle reti collegate.",
    },
    fr: {
      title: "Dictez vos légendes Instagram et TikTok | posty.now",
      description:
        "Dictez le brief. posty.now transforme une note vocale en légendes, hashtags et une publication planifiée sur vos réseaux.",
    },
    es: {
      title: "Dicta pies de foto para Instagram y TikTok | posty.now",
      description:
        "Di el brief en voz alta. posty.now convierte una nota de voz en pies de foto, hashtags y una publicación programada.",
    },
  },
  publish: {
    en: {
      title: "Schedule 30 social posts from one message | posty.now",
      description:
        "Publish now or queue a daily series on Instagram, TikTok and Facebook. Pick a clock time or the best hour per network.",
    },
    ro: {
      title: "Programează 30 de postări dintr-un mesaj | posty.now",
      description:
        "Publici acum sau pui în coadă o serie zilnică pe Instagram, TikTok și Facebook. Oră fixă sau cea mai bună oră pe rețea.",
    },
    de: {
      title: "30 Social-Media-Beiträge mit einer Nachricht planen | posty.now",
      description:
        "Jetzt posten oder eine tägliche Serie auf Instagram, TikTok und Facebook planen. Feste Uhrzeit oder beste Stunde pro Netzwerk.",
    },
    it: {
      title: "Programma 30 post social da un messaggio | posty.now",
      description:
        "Pubblica ora o metti in coda una serie quotidiana su Instagram, TikTok e Facebook. Ora precisa o la fascia migliore per rete.",
    },
    fr: {
      title: "Programmez 30 posts en un message | posty.now",
      description:
        "Publiez maintenant ou planifiez une série quotidienne sur Instagram, TikTok et Facebook. Heure fixe ou meilleur créneau par réseau.",
    },
    es: {
      title: "Programa 30 publicaciones con un mensaje | posty.now",
      description:
        "Publica ahora o programa una serie diaria en Instagram, TikTok y Facebook. Hora fija o la mejor franja por red.",
    },
  },
  analytics: {
    en: {
      title: "Instagram, TikTok and Facebook analytics | posty.now",
      description:
        "See what landed after you post. Reach, engagement and ads in one studio, next to the chat that published them.",
    },
    ro: {
      title: "Analize Instagram, TikTok și Facebook | posty.now",
      description:
        "Vezi ce a prins după ce ai publicat. Reach, engagement și reclame, în același studio lângă chat-ul care le-a scos.",
    },
    de: {
      title: "Instagram-, TikTok- und Facebook-Analysen | posty.now",
      description:
        "Sieh, was nach dem Posten ankam. Reichweite, Engagement und Anzeigen in einem Studio, neben dem Chat der veröffentlicht hat.",
    },
    it: {
      title: "Analytics Instagram, TikTok e Facebook | posty.now",
      description:
        "Vedi cosa ha funzionato dopo la pubblicazione. Reach, engagement e ads in uno studio, accanto alla chat che li ha pubblicati.",
    },
    fr: {
      title: "Analyses Instagram, TikTok et Facebook | posty.now",
      description:
        "Voyez ce qui a marché après publication. Portée, engagement et pubs dans un même studio, à côté du chat qui les a publiées.",
    },
    es: {
      title: "Analítica de Instagram, TikTok y Facebook | posty.now",
      description:
        "Mira qué funcionó después de publicar. Alcance, engagement y anuncios en un estudio, junto al chat que los publicó.",
    },
  },
  ads: {
    en: {
      title: "AI ads for Meta, TikTok and Google | posty.now",
      description:
        "Say the goal — profile visits, a link, a launch. posty.now builds the campaign on Meta, TikTok, Google, LinkedIn, Pinterest or X.",
    },
    ro: {
      title: "Reclame AI pe Meta, TikTok și Google | posty.now",
      description:
        "Spui obiectivul — vizite pe profil, un link, un lansare. posty.now construiește campania pe Meta, TikTok, Google, LinkedIn, Pinterest sau X.",
    },
    de: {
      title: "KI-Anzeigen für Meta, TikTok und Google | posty.now",
      description:
        "Sag das Ziel — Profilbesuche, ein Link, ein Launch. posty.now baut die Kampagne auf Meta, TikTok, Google, LinkedIn, Pinterest oder X.",
    },
    it: {
      title: "Ads IA su Meta, TikTok e Google | posty.now",
      description:
        "Dì l’obiettivo — visite al profilo, un link, un lancio. posty.now crea la campagna su Meta, TikTok, Google, LinkedIn, Pinterest o X.",
    },
    fr: {
      title: "Publicités IA sur Meta, TikTok et Google | posty.now",
      description:
        "Dites l’objectif — visites de profil, un lien, un lancement. posty.now construit la campagne sur Meta, TikTok, Google, LinkedIn, Pinterest ou X.",
    },
    es: {
      title: "Anuncios con IA en Meta, TikTok y Google | posty.now",
      description:
        "Di el objetivo — visitas al perfil, un enlace, un lanzamiento. posty.now arma la campaña en Meta, TikTok, Google, LinkedIn, Pinterest o X.",
    },
  },
  clients: {
    en: {
      title: "Manage client social accounts in one studio | posty.now",
      description:
        "Agencies and teams switch clients without leaving the chat. Posts, ads, and analytics stay on the right accounts.",
    },
    ro: {
      title: "Gestionează conturile clienților dintr-un studio | posty.now",
      description:
        "Agențiile și echipele schimbă clientul fără să iasă din chat. Postările, reclamele și analizele rămân pe conturile corecte.",
    },
    de: {
      title: "Kunden-Accounts in einem Studio verwalten | posty.now",
      description:
        "Agenturen und Teams wechseln den Kunden, ohne den Chat zu verlassen. Posts, Anzeigen und Analysen bleiben auf den richtigen Konten.",
    },
    it: {
      title: "Gestisci gli account dei clienti in uno studio | posty.now",
      description:
        "Agenzie e team cambiano cliente senza uscire dalla chat. Post, ads e analytics restano sugli account giusti.",
    },
    fr: {
      title: "Gérez les comptes clients dans un studio | posty.now",
      description:
        "Agences et équipes changent de client sans quitter le chat. Posts, pubs et analyses restent sur les bons comptes.",
    },
    es: {
      title: "Gestiona cuentas de clientes en un estudio | posty.now",
      description:
        "Agencias y equipos cambian de cliente sin salir del chat. Publicaciones, anuncios y analítica se quedan en las cuentas correctas.",
    },
  },
};

const MADE_FOR_META: Record<MadeForSlug, LocaleMeta> = {
  creators: {
    en: {
      title: "Social media scheduler for creators | posty.now",
      description:
        "Film it, say it, and schedule Instagram, TikTok and YouTube from one chat. Up to 50 posts in one go.",
    },
    ro: {
      title: "Programare postări pentru creatori | posty.now",
      description:
        "Filmezi, spui brieful și programezi Instagram, TikTok și YouTube dintr-un chat. Până la 50 de postări dintr-un foc.",
    },
    de: {
      title: "Social-Media-Planer für Creator | posty.now",
      description:
        "Dreh, sag das Briefing und plane Instagram, TikTok und YouTube aus einem Chat. Bis zu 50 Beiträge auf einmal.",
    },
    it: {
      title: "Scheduler social per creator | posty.now",
      description:
        "Gira, dì il brief e programma Instagram, TikTok e YouTube da una chat. Fino a 50 post in una volta.",
    },
    fr: {
      title: "Planificateur social pour créateurs | posty.now",
      description:
        "Filmez, dictez le brief et planifiez Instagram, TikTok et YouTube depuis un chat. Jusqu’à 50 posts d’un coup.",
    },
    es: {
      title: "Programador de redes para creadores | posty.now",
      description:
        "Graba, di el brief y programa Instagram, TikTok y YouTube desde un chat. Hasta 50 publicaciones de una vez.",
    },
  },
  "small-business": {
    en: {
      title: "Social media scheduler for small business | posty.now",
      description:
        "Stay present on Instagram, TikTok and Facebook without a social team. One message plans the week.",
    },
    ro: {
      title: "Programare postări pentru afaceri mici | posty.now",
      description:
        "Rămâi prezent pe Instagram, TikTok și Facebook fără o echipă de social. Un mesaj îți planifică săptămâna.",
    },
    de: {
      title: "Social-Media-Planer für kleine Unternehmen | posty.now",
      description:
        "Bleib auf Instagram, TikTok und Facebook sichtbar — ohne Social-Team. Eine Nachricht plant die Woche.",
    },
    it: {
      title: "Scheduler social per piccole imprese | posty.now",
      description:
        "Resta presente su Instagram, TikTok e Facebook senza un team social. Un messaggio pianifica la settimana.",
    },
    fr: {
      title: "Planificateur social pour petites entreprises | posty.now",
      description:
        "Restez présent sur Instagram, TikTok et Facebook sans équipe social. Un message planifie la semaine.",
    },
    es: {
      title: "Programador de redes para pymes | posty.now",
      description:
        "Mantente en Instagram, TikTok y Facebook sin un equipo de social. Un mensaje te planifica la semana.",
    },
  },
  agencies: {
    en: {
      title: "Social media scheduler for agencies | posty.now",
      description:
        "Run posts, ads and analytics for multiple clients from one studio. Switch accounts without leaving the chat.",
    },
    ro: {
      title: "Programare postări pentru agenții | posty.now",
      description:
        "Postări, reclame și analize pentru mai mulți clienți, dintr-un studio. Schimbi contul fără să ieși din chat.",
    },
    de: {
      title: "Social-Media-Planer für Agenturen | posty.now",
      description:
        "Posts, Anzeigen und Analysen für mehrere Kunden in einem Studio. Konten wechseln, ohne den Chat zu verlassen.",
    },
    it: {
      title: "Scheduler social per agenzie | posty.now",
      description:
        "Post, ads e analytics per più clienti da uno studio. Cambia account senza uscire dalla chat.",
    },
    fr: {
      title: "Planificateur social pour agences | posty.now",
      description:
        "Posts, pubs et analyses pour plusieurs clients dans un studio. Changez de compte sans quitter le chat.",
    },
    es: {
      title: "Programador de redes para agencias | posty.now",
      description:
        "Publicaciones, anuncios y analítica para varios clientes en un estudio. Cambia de cuenta sin salir del chat.",
    },
  },
  nonprofits: {
    en: {
      title: "Social media scheduler for nonprofits | posty.now",
      description:
        "Keep campaigns, events and donation posts moving on Instagram, Facebook and LinkedIn without extra staff.",
    },
    ro: {
      title: "Programare postări pentru ONG-uri | posty.now",
      description:
        "Campanii, evenimente și postări de donații pe Instagram, Facebook și LinkedIn, fără personal în plus.",
    },
    de: {
      title: "Social-Media-Planer für Nonprofits | posty.now",
      description:
        "Kampagnen, Events und Spendenposts auf Instagram, Facebook und LinkedIn — ohne extra Personal.",
    },
    it: {
      title: "Scheduler social per nonprofit | posty.now",
      description:
        "Campagne, eventi e post per donazioni su Instagram, Facebook e LinkedIn, senza staff extra.",
    },
    fr: {
      title: "Planificateur social pour associations | posty.now",
      description:
        "Campagnes, événements et posts de dons sur Instagram, Facebook et LinkedIn, sans personnel en plus.",
    },
    es: {
      title: "Programador de redes para ONG | posty.now",
      description:
        "Campañas, eventos y publicaciones de donación en Instagram, Facebook y LinkedIn, sin personal extra.",
    },
  },
  "higher-education": {
    en: {
      title: "Social media scheduler for universities | posty.now",
      description:
        "Campus news, events and admissions on Instagram, TikTok and LinkedIn — planned from one conversation.",
    },
    ro: {
      title: "Programare postări pentru universități | posty.now",
      description:
        "Noutăți de campus, evenimente și admitere pe Instagram, TikTok și LinkedIn — planificate dintr-o conversație.",
    },
    de: {
      title: "Social-Media-Planer für Hochschulen | posty.now",
      description:
        "Campus-News, Events und Zulassung auf Instagram, TikTok und LinkedIn — geplant aus einem Gespräch.",
    },
    it: {
      title: "Scheduler social per università | posty.now",
      description:
        "News del campus, eventi e ammissioni su Instagram, TikTok e LinkedIn — pianificati da una conversazione.",
    },
    fr: {
      title: "Planificateur social pour universités | posty.now",
      description:
        "Actus campus, événements et admissions sur Instagram, TikTok et LinkedIn — planifiés depuis une conversation.",
    },
    es: {
      title: "Programador de redes para universidades | posty.now",
      description:
        "Novedades del campus, eventos y admisiones en Instagram, TikTok y LinkedIn — planificados desde una conversación.",
    },
  },
  developers: {
    en: {
      title: "Schedule social posts from your product | posty.now",
      description:
        "Connect posting, scheduling and analytics to the product you already ship. One studio, the networks your users need.",
    },
    ro: {
      title: "Programează postări din produsul tău | posty.now",
      description:
        "Lipești publicarea, programarea și analizele de produsul pe care îl ai deja. Un studio, rețelele de care au nevoie userii.",
    },
    de: {
      title: "Social Posts aus deinem Produkt planen | posty.now",
      description:
        "Hänge Publishing, Planung und Analysen an das Produkt, das du schon auslieferst. Ein Studio, die Netzwerke deiner Nutzer.",
    },
    it: {
      title: "Programma post social dal tuo prodotto | posty.now",
      description:
        "Collega pubblicazione, scheduling e analytics al prodotto che già spedisci. Uno studio, le reti che servono agli utenti.",
    },
    fr: {
      title: "Planifiez des posts depuis votre produit | posty.now",
      description:
        "Branchez publication, planification et analyses sur le produit que vous livrez déjà. Un studio, les réseaux dont vos utilisateurs ont besoin.",
    },
    es: {
      title: "Programa publicaciones desde tu producto | posty.now",
      description:
        "Conecta publicación, programación y analítica al producto que ya envías. Un estudio, las redes que necesitan tus usuarios.",
    },
  },
};

const SPECIALIST_META: LocaleMeta = {
  en: {
    title: "Hire a specialist to set up Instagram and TikTok | posty.now",
    description:
      "A specialist opens, connects and configures your social and ads accounts. You just use posty.now.",
  },
  ro: {
    title: "Angajează un specialist pentru Instagram și TikTok | posty.now",
    description:
      "Un specialist îți deschide, conectează și configurează conturile de social și de reclame. Tu doar folosești posty.now.",
  },
  de: {
    title: "Spezialist für Instagram- und TikTok-Setup | posty.now",
    description:
      "Ein Spezialist öffnet, verbindet und konfiguriert deine Social- und Werbekonten. Du nutzt nur posty.now.",
  },
  it: {
    title: "Assumi uno specialista per Instagram e TikTok | posty.now",
    description:
      "Uno specialista apre, collega e configura i tuoi account social e ads. Tu usi solo posty.now.",
  },
  fr: {
    title: "Engagez un spécialiste Instagram et TikTok | posty.now",
    description:
      "Un spécialiste ouvre, connecte et configure vos comptes social et pubs. Vous utilisez seulement posty.now.",
  },
  es: {
    title: "Contrata un especialista de Instagram y TikTok | posty.now",
    description:
      "Un especialista abre, conecta y configura tus cuentas social y de anuncios. Tú solo usas posty.now.",
  },
};

export function getFeatureMeta(slug: FeatureSlug, locale: string): Meta {
  return pickLocale(FEATURE_META[slug], locale);
}

export function getMadeForMeta(slug: MadeForSlug, locale: string): Meta {
  return pickLocale(MADE_FOR_META[slug], locale);
}

export function getSpecialistMeta(locale: string): Meta {
  return pickLocale(SPECIALIST_META, locale);
}
