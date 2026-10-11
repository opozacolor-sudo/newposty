import { pickLocale, type AppLocale } from "@/lib/app-locale";

export const PUBLIC_DEMO_PATH = "/demo";
export const STUDIO_DEMO_PATH = "/help";

export const DEMO_STUDIO_TRY = {
  connect: { href: "/connections", labelKey: "tryConnections" },
  "marketing-plan": { href: "/chat", labelKey: "tryChat" },
  create: { href: "/chat", labelKey: "tryChat" },
  publish: { href: "/posts", labelKey: "tryPosts" },
  calendar: { href: "/posts", labelKey: "tryPosts" },
  ads: { href: "/ads", labelKey: "tryAds" },
  analytics: { href: "/analytics", labelKey: "tryAnalytics" },
  inbox: { href: "/inbox", labelKey: "tryInbox" },
  leads: { href: "/leads", labelKey: "tryLeads" },
} as const;

export const DEMO_SLUGS = [
  "connect",
  "marketing-plan",
  "create",
  "publish",
  "calendar",
  "ads",
  "analytics",
  "inbox",
  "leads",
] as const;

export type DemoSlug = (typeof DEMO_SLUGS)[number];

export type DemoVideo = { videoId: string; kind?: "photo" | "video" };

export type DemoCopy = {
  navTitle: string;
  navBody: string;
  metaTitle: string;
  metaDescription: string;
  title: string;
  body: string;
  say: string[];
  note?: string;
};

type DemoPage = {
  slug: DemoSlug;
  videos: DemoVideo[];
  copy: Record<AppLocale, DemoCopy>;
};

export function isDemoSlug(value: string): value is DemoSlug {
  return (DEMO_SLUGS as readonly string[]).includes(value);
}

export function getDemoPage(slug: string): DemoPage | undefined {
  return DEMO_PAGES.find((page) => page.slug === slug);
}

export function demoCopy(page: DemoPage, locale: string): DemoCopy {
  return pickLocale(page.copy, locale);
}

export const DEMO_PAGES: DemoPage[] = [
  {
    slug: "connect",
    videos: [{ videoId: "sAtPuXaUDr8" }],
    copy: {
      en: {
        navTitle: "Connect accounts",
        navBody: "Social and ads, once each.",
        metaTitle: "Connect Instagram, TikTok and ads | Demo | posty.now",
        metaDescription: "See how you connect social accounts and ad accounts in posty.now.",
        title: "Connect your accounts",
        body: "Social is for posts. Ads is for paid reach. You connect them separately — Instagram does not open TikTok Ads on its own. One authorization per network.",
        say: ["Show me what’s connected.", "Connect Instagram and TikTok."],
      },
      ro: {
        navTitle: "Conectare conturi",
        navBody: "Social și reclame, o dată fiecare.",
        metaTitle: "Conectează Instagram, TikTok și ads | Demo | posty.now",
        metaDescription: "Vezi cum conectezi conturile de social și de ads în posty.now.",
        title: "Conectează-ți conturile",
        body: "Social e pentru postări. Reclamele sunt pentru reach plătit. Le conectezi separat — Instagram nu deschide singur TikTok Ads. O autorizare pe rețea.",
        say: ["Ce am conectat?", "Conectează Instagram și TikTok."],
      },
      de: {
        navTitle: "Konten verbinden",
        navBody: "Social und Ads, jeweils einmal.",
        metaTitle: "Instagram, TikTok und Ads verbinden | Demo | posty.now",
        metaDescription: "So verbindest du Social- und Ads-Konten in posty.now.",
        title: "Verbinde deine Konten",
        body: "Social ist für Beiträge. Ads sind für bezahlte Reichweite. Du verbindest sie getrennt — Instagram öffnet TikTok Ads nicht von allein. Eine Autorisierung pro Netzwerk.",
        say: ["Was ist verbunden?", "Verbinde Instagram und TikTok."],
      },
      it: {
        navTitle: "Collega gli account",
        navBody: "Social e ads, una volta ciascuno.",
        metaTitle: "Collega Instagram, TikTok e ads | Demo | posty.now",
        metaDescription: "Come colleghi account social e ads in posty.now.",
        title: "Collega i tuoi account",
        body: "Il social è per i post. Gli ads sono per la copertura a pagamento. Li colleghi separatamente — Instagram non apre da solo TikTok Ads. Un’autorizzazione per rete.",
        say: ["Cosa ho collegato?", "Collega Instagram e TikTok."],
      },
      fr: {
        navTitle: "Connecter les comptes",
        navBody: "Social et pubs, une fois chacun.",
        metaTitle: "Connecter Instagram, TikTok et les pubs | Démo | posty.now",
        metaDescription: "Comment connecter les comptes social et pubs dans posty.now.",
        title: "Connecte tes comptes",
        body: "Le social sert aux posts. Les pubs servent à la portée payante. Tu les connectes séparément — Instagram n’ouvre pas TikTok Ads tout seul. Une autorisation par réseau.",
        say: ["Qu’est-ce qui est connecté ?", "Connecte Instagram et TikTok."],
      },
      es: {
        navTitle: "Conectar cuentas",
        navBody: "Social y anuncios, una vez cada una.",
        metaTitle: "Conecta Instagram, TikTok y anuncios | Demo | posty.now",
        metaDescription: "Cómo conectas cuentas social y de anuncios en posty.now.",
        title: "Conecta tus cuentas",
        body: "Social es para publicaciones. Anuncios es para alcance de pago. Las conectas por separado — Instagram no abre solo TikTok Ads. Una autorización por red.",
        say: ["¿Qué tengo conectado?", "Conecta Instagram y TikTok."],
      },
    },
  },
  {
    slug: "marketing-plan",
    videos: [{ videoId: "Jo14pLFdMOQ" }],
    copy: {
      en: {
        navTitle: "Marketing plan",
        navBody: "30 days: how to post, photo and video prompts.",
        metaTitle: "30-day marketing plan from chat | Demo | posty.now",
        metaDescription:
          "Ask for a month of content for your café. Each day gets a theme, a photo prompt, and a video prompt.",
        title: "A 30-day plan, from chat",
        body: "You say the business. It asks a few short questions — including when the plan should start — then writes a day-by-day plan: how to post that day, a photo prompt, and a video prompt — or “make a clip like this”. It does not invent 30 files in the first reply. When you want day 3 as a real image or clip, you ask.",
        say: [
          "I want a 30-day marketing plan for my café. For each day: how to post, a photo prompt, and a video prompt.",
          "Make the photo for 1 November from that plan.",
          "Make a clip like the 4 November prompt.",
        ],
      },
      ro: {
        navTitle: "Plan de marketing",
        navBody: "30 de zile: cum postezi, prompt de poză și de video.",
        metaTitle: "Plan de marketing 30 de zile din chat | Demo | posty.now",
        metaDescription:
          "Ceri o lună de conținut pentru cafenea. Fiecare zi are temă, prompt de poză și prompt de video.",
        title: "Un plan pe 30 de zile, din chat",
        body: "Spui business-ul. Întreabă câteva lucruri scurte — inclusiv de când să înceapă planul — apoi scrie planul pe zile: cum postezi în ziua aia, un prompt de poză și un prompt de video — sau „fă un clip așa”. Nu inventează 30 de fișiere din prima. Când vrei ziua de 3 ca poză sau clip real, ceri.",
        say: [
          "Vreau un plan de marketing 30 de zile pentru cafeneaua mea. Pe fiecare zi: cum postez, prompt de poză, prompt de video.",
          "Fă poza pentru 1 noiembrie din plan.",
          "Fă un clip ca promptul de pe 4 noiembrie.",
        ],
      },
      de: {
        navTitle: "Marketingplan",
        navBody: "30 Tage: wie posten, Foto- und Videoprompts.",
        metaTitle: "30-Tage-Marketingplan aus dem Chat | Demo | posty.now",
        metaDescription:
          "Bitte um einen Monat Inhalt für dein Café. Jeder Tag bekommt Thema, Foto- und Videoprompt.",
        title: "Ein 30-Tage-Plan, aus dem Chat",
        body: "Du nennst das Geschäft. Es stellt ein paar kurze Fragen — auch ab wann der Plan starten soll — und schreibt dann Tag für Tag: wie du postest, ein Fotoprompt und ein Videoprompt — oder „mach einen Clip so“. Es erzeugt nicht 30 Dateien in der ersten Antwort. Wenn du Tag 3 als echtes Bild oder Clip willst, fragst du.",
        say: [
          "Ich will einen 30-Tage-Marketingplan für mein Café. Pro Tag: wie posten, Fotoprompt, Videoprompt.",
          "Mach das Foto für den 1. November aus dem Plan.",
          "Mach einen Clip wie der Prompt vom 4. November.",
        ],
      },
      it: {
        navTitle: "Piano marketing",
        navBody: "30 giorni: come postare, prompt foto e video.",
        metaTitle: "Piano marketing 30 giorni dalla chat | Demo | posty.now",
        metaDescription:
          "Chiedi un mese di contenuti per il caffè. Ogni giorno ha tema, prompt foto e prompt video.",
        title: "Un piano di 30 giorni, dalla chat",
        body: "Dici il business. Fa poche domande — anche da quando deve partire il piano — poi scrive il piano giorno per giorno: come postare, un prompt foto e un prompt video — o «fai un clip così». Non inventa 30 file alla prima risposta. Quando vuoi il giorno 3 come foto o clip vera, lo chiedi.",
        say: [
          "Voglio un piano marketing di 30 giorni per il mio caffè. Ogni giorno: come posto, prompt foto, prompt video.",
          "Fai la foto del 1° novembre dal piano.",
          "Fai un clip come il prompt del 4 novembre.",
        ],
      },
      fr: {
        navTitle: "Plan marketing",
        navBody: "30 jours : comment poster, prompts photo et vidéo.",
        metaTitle: "Plan marketing 30 jours depuis le chat | Démo | posty.now",
        metaDescription:
          "Demande un mois de contenu pour ton café. Chaque jour a un thème, un prompt photo et un prompt vidéo.",
        title: "Un plan sur 30 jours, depuis le chat",
        body: "Tu dis le business. Il pose quelques questions courtes — y compris à partir de quand le plan commence — puis écrit le plan jour par jour : comment poster, un prompt photo et un prompt vidéo — ou « fais un clip comme ça ». Il n’invente pas 30 fichiers dès la première réponse. Quand tu veux le jour 3 en image ou clip réel, tu le demandes.",
        say: [
          "Je veux un plan marketing 30 jours pour mon café. Chaque jour : comment poster, prompt photo, prompt vidéo.",
          "Fais la photo du 1er novembre d’après le plan.",
          "Fais un clip comme le prompt du 4 novembre.",
        ],
      },
      es: {
        navTitle: "Plan de marketing",
        navBody: "30 días: cómo publicar, prompts de foto y vídeo.",
        metaTitle: "Plan de marketing 30 días desde el chat | Demo | posty.now",
        metaDescription:
          "Pide un mes de contenido para tu café. Cada día tiene tema, prompt de foto y prompt de vídeo.",
        title: "Un plan de 30 días, desde el chat",
        body: "Dices el negocio. Pregunta unas pocas cosas — también desde cuándo debe empezar el plan — y escribe el plan día a día: cómo publicar, un prompt de foto y un prompt de vídeo — o «haz un clip así». No inventa 30 archivos en la primera respuesta. Cuando quieras el día 3 como foto o clip real, lo pides.",
        say: [
          "Quiero un plan de marketing de 30 días para mi café. Cada día: cómo publico, prompt de foto, prompt de vídeo.",
          "Haz la foto del 1 de noviembre del plan.",
          "Haz un clip como el prompt del 4 de noviembre.",
        ],
      },
    },
  },
  {
    slug: "create",
    videos: [
      { videoId: "VDWhsthWngM", kind: "photo" },
      { videoId: "inmrjR37nLs", kind: "video" },
    ],
    copy: {
      en: {
        navTitle: "Create content",
        navBody: "A photo. Then a video.",
        metaTitle: "Create photos and video in chat | Demo | posty.now",
        metaDescription: "See how the assistant makes a still and a short clip from a brief or a site.",
        title: "Create a photo, then a video",
        body: "Give it the site, the product, or a prompt. It makes one still. Then you can ask it to animate that still, or write a new clip. After the file exists, you choose: organic post or paid ad. It will not invent a budget.",
        say: [
          "Make a photo from this site.",
          "Make a video from this photo.",
          "Here’s the product and the logo — make an image.",
        ],
      },
      ro: {
        navTitle: "Creare conținut",
        navBody: "O poză. Apoi un video.",
        metaTitle: "Creează poze și video din chat | Demo | posty.now",
        metaDescription: "Vezi cum asistentul face o poză și un clip scurt dintr-un brief sau un site.",
        title: "Creezi o poză, apoi un video",
        body: "Îi dai site-ul, produsul sau un prompt. Face o poză. Apoi poți să-i ceri să animeze poza, sau un clip nou. După fișier, alegi: postare organică sau reclamă. Nu inventează buget.",
        say: [
          "Fă o poză din site-ul ăsta.",
          "Fă un video din poza asta.",
          "Uite produsul și logo-ul — fă o imagine.",
        ],
      },
      de: {
        navTitle: "Inhalt erstellen",
        navBody: "Ein Foto. Dann ein Video.",
        metaTitle: "Fotos und Video im Chat erstellen | Demo | posty.now",
        metaDescription: "So macht der Assistent ein Standbild und einen kurzen Clip aus einem Briefing oder einer Site.",
        title: "Ein Foto, dann ein Video",
        body: "Du gibst die Site, das Produkt oder einen Prompt. Es macht ein Standbild. Dann kannst du es animieren lassen oder einen neuen Clip. Nach der Datei wählst du: organischer Post oder Anzeige. Es erfindet kein Budget.",
        say: [
          "Mach ein Foto von dieser Site.",
          "Mach ein Video aus diesem Foto.",
          "Hier Produkt und Logo — mach ein Bild.",
        ],
      },
      it: {
        navTitle: "Crea contenuti",
        navBody: "Una foto. Poi un video.",
        metaTitle: "Crea foto e video in chat | Demo | posty.now",
        metaDescription: "Come l’assistente fa uno still e un clip breve da un brief o un sito.",
        title: "Crea una foto, poi un video",
        body: "Dai il sito, il prodotto o un prompt. Fa uno still. Poi puoi chiedere di animarlo, o un clip nuovo. Dopo il file scegli: post organico o ads. Non inventa un budget.",
        say: [
          "Fai una foto da questo sito.",
          "Fai un video da questa foto.",
          "Ecco il prodotto e il logo — fai un’immagine.",
        ],
      },
      fr: {
        navTitle: "Créer du contenu",
        navBody: "Une photo. Puis une vidéo.",
        metaTitle: "Créer photos et vidéo dans le chat | Démo | posty.now",
        metaDescription: "Comment l’assistant fait un still et un court clip à partir d’un brief ou d’un site.",
        title: "Une photo, puis une vidéo",
        body: "Tu donnes le site, le produit ou un prompt. Il fait un still. Puis tu peux l’animer, ou demander un nouveau clip. Après le fichier, tu choisis : post organique ou pub. Il n’invente pas un budget.",
        say: [
          "Fais une photo à partir de ce site.",
          "Fais une vidéo à partir de cette photo.",
          "Voici le produit et le logo — fais une image.",
        ],
      },
      es: {
        navTitle: "Crear contenido",
        navBody: "Una foto. Luego un vídeo.",
        metaTitle: "Crea fotos y vídeo en el chat | Demo | posty.now",
        metaDescription: "Cómo el asistente hace un still y un clip corto desde un brief o un sitio.",
        title: "Crea una foto, luego un vídeo",
        body: "Le das el sitio, el producto o un prompt. Hace un still. Luego puedes pedirle que lo anime, o un clip nuevo. Después del archivo eliges: publicación orgánica o anuncio. No inventa un presupuesto.",
        say: [
          "Haz una foto de este sitio.",
          "Haz un vídeo de esta foto.",
          "Aquí el producto y el logo — haz una imagen.",
        ],
      },
    },
  },
  {
    slug: "publish",
    videos: [{ videoId: "Z0LRMOy40u4" }],
    copy: {
      en: {
        navTitle: "Post and schedule",
        navBody: "Now, later, or a whole series.",
        metaTitle: "Publish and schedule posts | Demo | posty.now",
        metaDescription: "Post now, schedule one piece, or fill many days from one message.",
        title: "Post now, schedule one, schedule many",
        body: "One file can go live now, wait for tomorrow at 18:00, or sit in a 30-day series. Name the networks. Confirm the card. Nothing is public until you see the check.",
        say: [
          "Post this now on Instagram as a reel and on TikTok.",
          "Schedule this tomorrow at 18:00 on Instagram and Facebook.",
          "Starting tomorrow, one a day on every network, at the best time.",
        ],
      },
      ro: {
        navTitle: "Postare și programare",
        navBody: "Acum, mai târziu, sau o serie întreagă.",
        metaTitle: "Publică și programează postări | Demo | posty.now",
        metaDescription: "Postezi acum, programezi una, sau umpli multe zile dintr-un mesaj.",
        title: "Postezi acum, programezi una, programezi multe",
        body: "Un fișier poate ieși acum, aștepta mâine la 18:00, sau sta într-o serie de 30 de zile. Numești rețelele. Confirmi cardul. Nimic nu e public până vezi bifa.",
        say: [
          "Postează asta acum pe Instagram ca reel și pe TikTok.",
          "Programează asta mâine la 18:00 pe Instagram și Facebook.",
          "De mâine, câte una pe zi, pe toate rețelele, la cea mai bună oră.",
        ],
      },
      de: {
        navTitle: "Posten und planen",
        navBody: "Jetzt, später oder eine ganze Serie.",
        metaTitle: "Beiträge veröffentlichen und planen | Demo | posty.now",
        metaDescription: "Jetzt posten, eines planen oder viele Tage aus einer Nachricht füllen.",
        title: "Jetzt, eines, viele",
        body: "Eine Datei kann jetzt live gehen, bis morgen 18:00 warten oder in einer 30-Tage-Serie liegen. Nenne die Netzwerke. Bestätige die Karte. Nichts ist öffentlich, bis du den Haken siehst.",
        say: [
          "Poste das jetzt auf Instagram als Reel und auf TikTok.",
          "Plane das morgen um 18:00 auf Instagram und Facebook.",
          "Ab morgen, eines pro Tag, auf allen Netzwerken, zur besten Zeit.",
        ],
      },
      it: {
        navTitle: "Pubblica e programma",
        navBody: "Ora, più tardi, o una serie intera.",
        metaTitle: "Pubblica e programma i post | Demo | posty.now",
        metaDescription: "Pubblica ora, programma uno o riempi molti giorni da un messaggio.",
        title: "Ora, uno, tanti",
        body: "Un file può uscire ora, aspettare domani alle 18:00 o stare in una serie di 30 giorni. Nomina le reti. Conferma la scheda. Niente è pubblico finché non vedi il segno.",
        say: [
          "Pubblica questo ora su Instagram come reel e su TikTok.",
          "Programma questo domani alle 18:00 su Instagram e Facebook.",
          "Da domani, uno al giorno, su tutte le reti, all’ora migliore.",
        ],
      },
      fr: {
        navTitle: "Publier et programmer",
        navBody: "Maintenant, plus tard, ou toute une série.",
        metaTitle: "Publier et programmer des posts | Démo | posty.now",
        metaDescription: "Publie maintenant, programme une pièce, ou remplis plusieurs jours depuis un message.",
        title: "Maintenant, une, plusieurs",
        body: "Un fichier peut sortir maintenant, attendre demain à 18:00, ou rester dans une série de 30 jours. Nomme les réseaux. Confirme la carte. Rien n’est public avant la coche.",
        say: [
          "Poste ça maintenant sur Instagram en reel et sur TikTok.",
          "Programme ça demain à 18:00 sur Instagram et Facebook.",
          "À partir de demain, un par jour, sur tous les réseaux, à la meilleure heure.",
        ],
      },
      es: {
        navTitle: "Publicar y programar",
        navBody: "Ahora, luego o toda una serie.",
        metaTitle: "Publica y programa posts | Demo | posty.now",
        metaDescription: "Publica ahora, programa una pieza o llena muchos días desde un mensaje.",
        title: "Ahora, una, muchas",
        body: "Un archivo puede salir ahora, esperar mañana a las 18:00 o quedarse en una serie de 30 días. Nombra las redes. Confirma la tarjeta. Nada es público hasta que ves el visto.",
        say: [
          "Publica esto ahora en Instagram como reel y en TikTok.",
          "Programa esto mañana a las 18:00 en Instagram y Facebook.",
          "Desde mañana, una al día, en todas las redes, a la mejor hora.",
        ],
      },
    },
  },
  {
    slug: "calendar",
    videos: [{ videoId: "dHU99vwyRsU" }],
    copy: {
      en: {
        navTitle: "Post calendar",
        navBody: "The month, on one board.",
        metaTitle: "Post calendar | Demo | posty.now",
        metaDescription: "See the scheduled month and move a day without rebuilding the rest.",
        title: "The post calendar",
        body: "After you confirm a series, the days fill the calendar. You can move Friday, rewrite Monday, or cancel tomorrow. The rest stays.",
        say: ["Move Friday’s post to 10:00.", "What’s scheduled this week?"],
      },
      ro: {
        navTitle: "Calendarul de postări",
        navBody: "Luna, pe o tablă.",
        metaTitle: "Calendarul de postări | Demo | posty.now",
        metaDescription: "Vezi luna programată și muți o zi fără să refaci restul.",
        title: "Calendarul de postări",
        body: "După ce confirmi o serie, zilele umplu calendarul. Poți muta vinerea, rescrie lunea sau anula mâine. Restul rămâne.",
        say: ["Mută postarea de vineri la 10:00.", "Ce am programat săptămâna asta?"],
      },
      de: {
        navTitle: "Beitragskalender",
        navBody: "Der Monat, auf einem Board.",
        metaTitle: "Beitragskalender | Demo | posty.now",
        metaDescription: "Sieh den geplanten Monat und verschiebe einen Tag, ohne den Rest neu zu bauen.",
        title: "Der Beitragskalender",
        body: "Nach der Bestätigung einer Serie füllen die Tage den Kalender. Du kannst Freitag verschieben, Montag neu schreiben oder morgen streichen. Der Rest bleibt.",
        say: ["Verschiebe Freitags Beitrag auf 10:00.", "Was ist diese Woche geplant?"],
      },
      it: {
        navTitle: "Calendario post",
        navBody: "Il mese, su una bacheca.",
        metaTitle: "Calendario dei post | Demo | posty.now",
        metaDescription: "Vedi il mese programmato e sposta un giorno senza rifare il resto.",
        title: "Il calendario dei post",
        body: "Dopo che confermi una serie, i giorni riempiono il calendario. Puoi spostare venerdì, riscrivere lunedì o annullare domani. Il resto resta.",
        say: ["Sposta il post di venerdì alle 10:00.", "Cosa ho in programma questa settimana?"],
      },
      fr: {
        navTitle: "Calendrier des posts",
        navBody: "Le mois, sur un tableau.",
        metaTitle: "Calendrier des posts | Démo | posty.now",
        metaDescription: "Vois le mois programmé et déplace un jour sans refaire le reste.",
        title: "Le calendrier des posts",
        body: "Après confirmation d’une série, les jours remplissent le calendrier. Tu peux déplacer vendredi, réécrire lundi ou annuler demain. Le reste reste.",
        say: ["Déplace le post de vendredi à 10:00.", "Qu’est-ce qui est programmé cette semaine ?"],
      },
      es: {
        navTitle: "Calendario de posts",
        navBody: "El mes, en un tablero.",
        metaTitle: "Calendario de posts | Demo | posty.now",
        metaDescription: "Ve el mes programado y mueve un día sin rehacer el resto.",
        title: "El calendario de posts",
        body: "Cuando confirmas una serie, los días llenan el calendario. Puedes mover el viernes, reescribir el lunes o cancelar mañana. El resto se queda.",
        say: ["Mueve el post del viernes a las 10:00.", "¿Qué tengo programado esta semana?"],
      },
    },
  },
  {
    slug: "ads",
    videos: [{ videoId: "4wncfgRaxOU" }],
    copy: {
      en: {
        navTitle: "Create ads",
        navBody: "TikTok Ads: engagement, a day, a budget.",
        metaTitle: "TikTok ads from chat | Demo | posty.now",
        metaDescription:
          "Brief a TikTok engagement campaign: one day, a budget, Bucharest and Ilfov, business owners and creators.",
        title: "A paid campaign, from the same chat",
        body: "Connect TikTok Ads first. TikTok standalone ads are video — a carousel of stills is not an ad by itself. Make a clip from those photos, then brief the campaign: engagement, one day, 100 lei, men and women, Bucharest and Ilfov, business owners and content creators. You confirm before it spends.",
        say: [
          "TikTok ad, engagement, 1 day, 100 lei, men and women, Bucharest and Ilfov, business owners and content creators. Here are the carousel photos, in order — make a clip, then the ad.",
        ],
        note: "TikTok’s ads API takes video, not a still carousel. Gender, city, region, and interests are supported. The assistant prepares the brief; you still confirm spend.",
      },
      ro: {
        navTitle: "Creare reclame",
        navBody: "TikTok Ads: engagement, o zi, un buget.",
        metaTitle: "Reclame TikTok din chat | Demo | posty.now",
        metaDescription:
          "Brief pentru o campanie TikTok de engagement: o zi, un buget, București și Ilfov, proprietari de business și creatori.",
        title: "O campanie plătită, din același chat",
        body: "Conectezi întâi TikTok Ads. Reclamele TikTok standalone sunt video — un carusel de poze nu e reclamă singur. Faci un clip din pozele alea, apoi dai brief-ul: engagement, o zi, 100 lei, bărbați și femei, București și Ilfov, proprietari de business și creatori de conținut. Confirmi înainte să cheltuie.",
        say: [
          "Reclamă TikTok, engagement, 1 zi, 100 lei, bărbați și femei, București și Ilfov, proprietari de business și creatori de conținut. Iată pozele din carusel, în ordine — fă un clip, apoi reclama.",
        ],
        note: "API-ul de ads TikTok ia video, nu un carusel de still-uri. Genul, orașul, regiunea și interesele sunt suportate. Asistentul pregătește brief-ul; tu confirmi cheltuiala.",
      },
      de: {
        navTitle: "Anzeigen erstellen",
        navBody: "TikTok Ads: Engagement, ein Tag, ein Budget.",
        metaTitle: "TikTok-Anzeigen aus dem Chat | Demo | posty.now",
        metaDescription:
          "Briefe eine TikTok-Engagement-Kampagne: ein Tag, ein Budget, Bukarest und Ilfov, Unternehmer und Creator.",
        title: "Eine bezahlte Kampagne, aus demselben Chat",
        body: "Verbinde zuerst TikTok Ads. Standalone-Anzeigen auf TikTok sind Video — ein Still-Karussell ist keine Anzeige. Mach einen Clip aus den Fotos, dann das Briefing: Engagement, ein Tag, 100 Lei, Männer und Frauen, Bukarest und Ilfov, Unternehmer und Creator. Du bestätigst, bevor es ausgibt.",
        say: [
          "TikTok-Anzeige, Engagement, 1 Tag, 100 Lei, Männer und Frauen, Bukarest und Ilfov, Unternehmer und Creator. Hier die Karussellfotos, in Reihenfolge — mach einen Clip, dann die Anzeige.",
        ],
        note: "Die TikTok-Ads-API nimmt Video, kein Still-Karussell. Geschlecht, Stadt, Region und Interessen sind möglich. Der Assistent bereitet das Briefing vor; du bestätigst die Ausgabe.",
      },
      it: {
        navTitle: "Crea ads",
        navBody: "TikTok Ads: engagement, un giorno, un budget.",
        metaTitle: "Ads TikTok dalla chat | Demo | posty.now",
        metaDescription:
          "Brief di una campagna TikTok di engagement: un giorno, un budget, Bucarest e Ilfov, titolari e creator.",
        title: "Una campagna a pagamento, dalla stessa chat",
        body: "Collega prima TikTok Ads. Le ads standalone TikTok sono video — un carosello di still non è un’ad. Fai un clip da quelle foto, poi il brief: engagement, un giorno, 100 lei, uomini e donne, Bucarest e Ilfov, titolari di business e creator. Confermi prima che spenda.",
        say: [
          "Ad TikTok, engagement, 1 giorno, 100 lei, uomini e donne, Bucarest e Ilfov, titolari di business e creator. Ecco le foto del carosello, in ordine — fai un clip, poi l’ad.",
        ],
        note: "L’API ads di TikTok prende video, non un carosello di still. Genere, città, regione e interessi sono supportati. L’assistente prepara il brief; tu confermi la spesa.",
      },
      fr: {
        navTitle: "Créer des pubs",
        navBody: "TikTok Ads : engagement, un jour, un budget.",
        metaTitle: "Pubs TikTok depuis le chat | Démo | posty.now",
        metaDescription:
          "Briefe une campagne TikTok d’engagement : un jour, un budget, Bucarest et Ilfov, dirigeants et créateurs.",
        title: "Une campagne payante, depuis le même chat",
        body: "Connecte d’abord TikTok Ads. Les pubs standalone TikTok sont de la vidéo — un carrousel de stills n’est pas une pub. Fais un clip à partir des photos, puis le brief : engagement, un jour, 100 lei, hommes et femmes, Bucarest et Ilfov, dirigeants et créateurs. Tu confirmes avant qu’elle dépense.",
        say: [
          "Pub TikTok, engagement, 1 jour, 100 lei, hommes et femmes, Bucarest et Ilfov, dirigeants et créateurs. Voici les photos du carrousel, dans l’ordre — fais un clip, puis la pub.",
        ],
        note: "L’API ads TikTok prend de la vidéo, pas un carrousel de stills. Genre, ville, région et intérêts sont supportés. L’assistant prépare le brief ; tu confirmes la dépense.",
      },
      es: {
        navTitle: "Crear anuncios",
        navBody: "TikTok Ads: engagement, un día, un presupuesto.",
        metaTitle: "Anuncios TikTok desde el chat | Demo | posty.now",
        metaDescription:
          "Brief de una campaña TikTok de engagement: un día, un presupuesto, Bucarest e Ilfov, dueños y creadores.",
        title: "Una campaña de pago, desde el mismo chat",
        body: "Conecta primero TikTok Ads. Los anuncios standalone de TikTok son vídeo — un carrusel de stills no es un anuncio. Haz un clip con esas fotos y luego el brief: engagement, un día, 100 lei, hombres y mujeres, Bucarest e Ilfov, dueños de negocio y creadores. Confirmas antes de que gaste.",
        say: [
          "Anuncio TikTok, engagement, 1 día, 100 lei, hombres y mujeres, Bucarest e Ilfov, dueños de negocio y creadores. Aquí las fotos del carrusel, en orden — haz un clip, luego el anuncio.",
        ],
        note: "La API de ads de TikTok toma vídeo, no un carrusel de stills. Género, ciudad, región e intereses están soportados. El asistente prepara el brief; tú confirmas el gasto.",
      },
    },
  },
  {
    slug: "analytics",
    videos: [{ videoId: "WVbQxFO_qeg" }],
    copy: {
      en: {
        navTitle: "Statistics",
        navBody: "What worked, on each network.",
        metaTitle: "Post and ads statistics | Demo | posty.now",
        metaDescription: "See reach, engagement, and ads spend from the studio.",
        title: "Statistics",
        body: "Organic posts and paid campaigns have their own boards. You see what ran, what landed, and what you spent — without opening five native apps.",
        say: ["How did last week go on Instagram?", "Open ads stats."],
      },
      ro: {
        navTitle: "Statistici",
        navBody: "Ce a mers, pe fiecare rețea.",
        metaTitle: "Statistici postări și reclame | Demo | posty.now",
        metaDescription: "Vezi reach, engagement și cheltuieli de ads din studio.",
        title: "Statistici",
        body: "Postările organice și campaniile plătite au table separate. Vezi ce a rulat, ce a prins și cât ai cheltuit — fără cinci aplicații native.",
        say: ["Cum a mers săptămâna trecută pe Instagram?", "Deschide statisticile de ads."],
      },
      de: {
        navTitle: "Statistiken",
        navBody: "Was wirkte, pro Netzwerk.",
        metaTitle: "Beitrags- und Ads-Statistiken | Demo | posty.now",
        metaDescription: "Reichweite, Engagement und Ads-Ausgaben im Studio.",
        title: "Statistiken",
        body: "Organische Beiträge und bezahlte Kampagnen haben eigene Boards. Du siehst, was lief, was ankam und was du ausgegeben hast — ohne fünf native Apps.",
        say: ["Wie lief letzte Woche auf Instagram?", "Öffne die Ads-Statistiken."],
      },
      it: {
        navTitle: "Statistiche",
        navBody: "Cosa ha funzionato, su ogni rete.",
        metaTitle: "Statistiche post e ads | Demo | posty.now",
        metaDescription: "Reach, engagement e spesa ads dallo studio.",
        title: "Statistiche",
        body: "Post organici e campagne a pagamento hanno bacheche proprie. Vedi cosa è andato, cosa ha funzionato e quanto hai speso — senza cinque app native.",
        say: ["Com’è andata la scorsa settimana su Instagram?", "Apri le statistiche ads."],
      },
      fr: {
        navTitle: "Statistiques",
        navBody: "Ce qui a marché, sur chaque réseau.",
        metaTitle: "Statistiques posts et pubs | Démo | posty.now",
        metaDescription: "Portée, engagement et dépenses pubs depuis le studio.",
        title: "Statistiques",
        body: "Les posts organiques et les campagnes payantes ont leurs tableaux. Tu vois ce qui a tourné, ce qui a pris, et ce que tu as dépensé — sans cinq apps natives.",
        say: ["Comment s’est passée la semaine dernière sur Instagram ?", "Ouvre les stats pubs."],
      },
      es: {
        navTitle: "Estadísticas",
        navBody: "Qué funcionó, en cada red.",
        metaTitle: "Estadísticas de posts y anuncios | Demo | posty.now",
        metaDescription: "Alcance, engagement y gasto de anuncios desde el estudio.",
        title: "Estadísticas",
        body: "Los posts orgánicos y las campañas de pago tienen sus tableros. Ves qué corrió, qué funcionó y cuánto gastaste — sin cinco apps nativas.",
        say: ["¿Cómo fue la semana pasada en Instagram?", "Abre las estadísticas de anuncios."],
      },
    },
  },
  {
    slug: "inbox",
    videos: [{ videoId: "nUqSFRSG5YM" }],
    copy: {
      en: {
        navTitle: "Messages and comments",
        navBody: "One inbox for both.",
        metaTitle: "Messages and comments inbox | Demo | posty.now",
        metaDescription: "Read DMs and comments from connected accounts in one studio inbox.",
        title: "Messages and comments",
        body: "This inbox is you talking. You read, reply, filter. The lead agent, if it is on, answers new inbound intent separately — it does not replace this screen.",
        say: ["Show comments with interest.", "Reply to this message."],
      },
      ro: {
        navTitle: "Mesaje și comentarii",
        navBody: "Un inbox pentru ambele.",
        metaTitle: "Inbox mesaje și comentarii | Demo | posty.now",
        metaDescription: "Citești DM-urile și comentariile din conturile conectate, într-un singur inbox.",
        title: "Mesaje și comentarii",
        body: "Inbox-ul ăsta ești tu. Citești, răspunzi, filtrezi. Agentul de lead-uri, dacă e pornit, răspunde separat la intent nou — nu înlocuiește ecranul ăsta.",
        say: ["Arată comentariile cu intent.", "Răspunde la mesajul ăsta."],
      },
      de: {
        navTitle: "Nachrichten und Kommentare",
        navBody: "Ein Posteingang für beides.",
        metaTitle: "Posteingang Nachrichten und Kommentare | Demo | posty.now",
        metaDescription: "DMs und Kommentare verbundener Konten in einem Studio-Posteingang.",
        title: "Nachrichten und Kommentare",
        body: "Dieser Posteingang bist du. Du liest, antwortest, filterst. Der Lead-Agent, wenn er an ist, beantwortet neue Absicht getrennt — er ersetzt diesen Screen nicht.",
        say: ["Zeig Kommentare mit Absicht.", "Antworte auf diese Nachricht."],
      },
      it: {
        navTitle: "Messaggi e commenti",
        navBody: "Una inbox per entrambi.",
        metaTitle: "Inbox messaggi e commenti | Demo | posty.now",
        metaDescription: "Leggi DM e commenti degli account collegati in una sola inbox.",
        title: "Messaggi e commenti",
        body: "Questa inbox sei tu. Leggi, rispondi, filtri. L’agente lead, se è acceso, risponde a parte alle nuove intenzioni — non sostituisce questa schermata.",
        say: ["Mostra i commenti con intento.", "Rispondi a questo messaggio."],
      },
      fr: {
        navTitle: "Messages et commentaires",
        navBody: "Une boîte pour les deux.",
        metaTitle: "Boîte messages et commentaires | Démo | posty.now",
        metaDescription: "Lis les DM et commentaires des comptes connectés dans une seule boîte.",
        title: "Messages et commentaires",
        body: "Cette boîte, c’est toi. Tu lis, tu réponds, tu filtres. L’agent de leads, s’il est allumé, répond à part aux nouvelles intentions — il ne remplace pas cet écran.",
        say: ["Montre les commentaires avec intention.", "Réponds à ce message."],
      },
      es: {
        navTitle: "Mensajes y comentarios",
        navBody: "Una bandeja para ambos.",
        metaTitle: "Bandeja de mensajes y comentarios | Demo | posty.now",
        metaDescription: "Lee DMs y comentarios de las cuentas conectadas en una sola bandeja.",
        title: "Mensajes y comentarios",
        body: "Esta bandeja eres tú. Lees, respondes, filtras. El agente de leads, si está encendido, responde aparte a la intención nueva — no sustituye esta pantalla.",
        say: ["Muestra los comentarios con intención.", "Responde a este mensaje."],
      },
    },
  },
  {
    slug: "leads",
    videos: [{ videoId: "ML7dGFen5Rw" }],
    copy: {
      en: {
        navTitle: "Leads",
        navBody: "Train the agent, then watch it catch.",
        metaTitle: "Train the lead agent | Demo | posty.now",
        metaDescription: "Give it the site, tell it how to go, then turn on AI lead generation.",
        title: "Train the lead agent",
        body: "You give it the website. It reads products and pages. Then you tell it how to go — if they ask the price or a free slot, send the booking link. Reset training when you want a clean take. Generation stays off until you turn it on.",
        say: [
          "I do a café. If they ask the price or whether we have a table, send the booking link. Do not invent hours.",
        ],
      },
      ro: {
        navTitle: "Lead-uri",
        navBody: "Antrenezi agentul, apoi îl lași să prindă.",
        metaTitle: "Antrenează agentul de lead-uri | Demo | posty.now",
        metaDescription: "Îi dai site-ul, îi spui cum să meargă, apoi pornești generarea AI.",
        title: "Antrenezi agentul de lead-uri",
        body: "Îi dai site-ul. Citește produse și pagini. Apoi îi spui cum să meargă — dacă întreabă prețul sau un loc liber, trimite link-ul de rezervare. Resetezi antrenarea când vrei o priză curată. Generarea stă oprită până o pornești tu.",
        say: [
          "Am o cafenea. Dacă întreabă prețul sau dacă avem masă, trimite link-ul de rezervare. Nu inventa ore.",
        ],
      },
      de: {
        navTitle: "Leads",
        navBody: "Trainiere den Agenten, dann fängt er.",
        metaTitle: "Lead-Agent trainieren | Demo | posty.now",
        metaDescription: "Gib die Site, sag wie er gehen soll, dann schalte die KI-Lead-Generierung ein.",
        title: "Den Lead-Agenten trainieren",
        body: "Du gibst die Website. Er liest Produkte und Seiten. Dann sagst du, wie er gehen soll — wenn sie nach Preis oder einem freien Platz fragen, den Buchungslink schicken. Setze das Training zurück, wenn du einen sauberen Take willst. Die Generierung bleibt aus, bis du sie anschaltest.",
        say: [
          "Ich habe ein Café. Wenn sie nach dem Preis oder einem Tisch fragen, schick den Buchungslink. Erfinde keine Uhrzeiten.",
        ],
      },
      it: {
        navTitle: "Lead",
        navBody: "Addestra l’agente, poi lo lasci prendere.",
        metaTitle: "Addestra l’agente lead | Demo | posty.now",
        metaDescription: "Dai il sito, gli dici come andare, poi accendi la generazione AI.",
        title: "Addestra l’agente lead",
        body: "Gli dai il sito. Legge prodotti e pagine. Poi gli dici come andare — se chiedono il prezzo o un posto, manda il link di prenotazione. Resetti l’addestramento quando vuoi una ripresa pulita. La generazione resta spenta finché non la accendi tu.",
        say: [
          "Ho un caffè. Se chiedono il prezzo o un tavolo, manda il link di prenotazione. Non inventare orari.",
        ],
      },
      fr: {
        navTitle: "Leads",
        navBody: "Tu entraînes l’agent, puis tu le laisses attraper.",
        metaTitle: "Entraîner l’agent de leads | Démo | posty.now",
        metaDescription: "Donne le site, dis-lui comment faire, puis allume la génération IA.",
        title: "Entraîner l’agent de leads",
        body: "Tu lui donnes le site. Il lit produits et pages. Puis tu lui dis comment faire — s’ils demandent le prix ou une place, envoyer le lien de réservation. Tu réinitialises l’entraînement pour une prise propre. La génération reste éteinte jusqu’à ce que tu l’allumes.",
        say: [
          "J’ai un café. S’ils demandent le prix ou une table, envoie le lien de réservation. N’invente pas les horaires.",
        ],
      },
      es: {
        navTitle: "Leads",
        navBody: "Entrenas al agente y lo dejas pillar.",
        metaTitle: "Entrena el agente de leads | Demo | posty.now",
        metaDescription: "Le das el sitio, le dices cómo ir y enciendes la generación IA.",
        title: "Entrena el agente de leads",
        body: "Le das el sitio. Lee productos y páginas. Luego le dices cómo ir — si preguntan el precio o un hueco, envía el enlace de reserva. Reseteas el entrenamiento cuando quieres una toma limpia. La generación sigue apagada hasta que la enciendes.",
        say: [
          "Tengo un café. Si preguntan el precio o si hay mesa, envía el enlace de reserva. No inventes horarios.",
        ],
      },
    },
  },
];
