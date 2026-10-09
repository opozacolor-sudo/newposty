import { pickLocale, type AppLocale } from "@/lib/app-locale";

export const HOW_TO_SLUGS = ["one-message"] as const;
export type HowToSlug = (typeof HOW_TO_SLUGS)[number];

export type HowToCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  subtitle: string;
  intro: string[];
  stepsTitle: string;
  steps: { title: string; body: string }[];
  sayTitle: string;
  examples: string[];
  faqs: { q: string; a: string }[];
  relatedTitle: string;
  readGuide: string;
};

const ARTICLES: Record<HowToSlug, Record<AppLocale, HowToCopy>> = {
  "one-message": {
    en: {
      metaTitle: "How to schedule 30 Instagram posts from one message | posty.now",
      metaDescription:
        "Connect your accounts, attach up to 50 files, and tell the assistant to post one a day. A short guide to scheduling Instagram, TikTok and Facebook from chat.",
      kicker: "Guide",
      title: "How to schedule 30 posts from one message",
      subtitle:
        "You do not rebuild the same caption in five apps. You send the files once, name the networks, and confirm the plan.",
      intro: [
        "People search “how to schedule Instagram posts” because the native apps make a month of content feel like thirty separate jobs. posty.now treats it as one job: files in order, a caption per network, a time per day.",
        "This is the short version. The full product guide covers voice, ads, analytics, and the inbox. Here you only need the path from a folder of photos to a calendar that fills itself.",
      ],
      stepsTitle: "The path",
      steps: [
        {
          title: "Connect Instagram, TikTok, or Facebook",
          body: "Captions work before anything is linked. Publishing and a real schedule need the accounts connected. One authorization per network.",
        },
        {
          title: "Attach up to 50 photos or videos",
          body: "Wait until every file finishes uploading. The order you pick is the order of the series — day one is the first file, day thirty is the last.",
        },
        {
          title: "Say the job in one message",
          body: "Name the networks, the start day, and whether you want a clock time or the best hour. Example: “Starting tomorrow, one a day on Instagram and TikTok, at the best time.”",
        },
        {
          title: "Read the card, then confirm",
          body: "You see caption, networks, and time before anything is public. After that you can still move Friday to 19:00, rewrite Monday, or cancel tomorrow without touching the rest.",
        },
      ],
      sayTitle: "Lines that work",
      examples: [
        "Starting tomorrow, one a day for 30 days on Instagram, TikTok and Facebook, at the best time.",
        "Publish this Reel now on Instagram and TikTok, and put the photo on a Facebook Page post tomorrow at 10.",
        "Move Friday’s Instagram post to 19:00. Leave the rest.",
      ],
      faqs: [
        {
          q: "Can one message really cover a month?",
          a: "Yes. Up to 50 files, posted day by day, on the networks you named. Mix a Friday promo with twenty monthly photos in the same command and the plan gets messy — split those jobs.",
        },
        {
          q: "Does each network get its own caption?",
          a: "The assistant writes for the network you named. You can ask for one caption everywhere, or a native line per platform. If you already wrote the campaign line, it keeps your words.",
        },
        {
          q: "Is a scheduled post already public?",
          a: "No. It waits for its time. You can cancel, move, or rewrite it before then. On TikTok, wait for the green check after a “publish now” — processing is not the same as live.",
        },
      ],
      relatedTitle: "Keep going",
      readGuide: "Read the full product guide",
    },
    ro: {
      metaTitle: "Cum programezi 30 de postări Instagram dintr-un mesaj | posty.now",
      metaDescription:
        "Conectezi conturile, atașezi până la 50 de fișiere și îi spui asistentului să publice câte una pe zi. Ghid scurt de programare pe Instagram, TikTok și Facebook din chat.",
      kicker: "Ghid",
      title: "Cum programezi 30 de postări dintr-un mesaj",
      subtitle:
        "Nu refaci aceeași descriere în cinci aplicații. Trimiți fișierele o dată, spui rețelele și confirmi planul.",
      intro: [
        "Oamenii caută „cum programez postări Instagram” pentru că aplicațiile native fac dintr-o lună de conținut treizeci de joburi separate. posty.now tratează asta ca un singur job: fișiere în ordine, o descriere pe rețea, o oră pe zi.",
        "Asta e varianta scurtă. Manualul complet acoperă voce, reclame, analize și inbox. Aici ai doar drumul de la un folder de poze la un calendar care se umple singur.",
      ],
      stepsTitle: "Drumul",
      steps: [
        {
          title: "Conectezi Instagram, TikTok sau Facebook",
          body: "Descrierile merg înainte să legi ceva. Publicarea și un program real cer conturile conectate. O autorizare pe rețea.",
        },
        {
          title: "Atașezi până la 50 de poze sau video-uri",
          body: "Aștepți să se termine fiecare upload. Ordinea aleasă e ordinea seriei — ziua unu e primul fișier, ziua treizeci e ultimul.",
        },
        {
          title: "Spui jobul într-un mesaj",
          body: "Numești rețelele, ziua de start și dacă vrei oră fixă sau cea mai bună. Exemplu: „De mâine, câte una pe zi pe Instagram și TikTok, la cea mai bună oră.”",
        },
        {
          title: "Citești cardul, apoi confirmi",
          body: "Vezi descrierea, rețelele și ora înainte să fie publice. După aia mai poți muta vinerea la 19:00, rescrie lunea sau anula mâine fără să atingi restul.",
        },
      ],
      sayTitle: "Fraze care țin",
      examples: [
        "De mâine, câte una pe zi, 30 de zile, pe Instagram, TikTok și Facebook, la cea mai bună oră.",
        "Publică Reel-ul ăsta acum pe Instagram și TikTok, și pune poza pe Facebook mâine la 10.",
        "Mută postarea Instagram de vineri la 19:00. Lasă restul.",
      ],
      faqs: [
        {
          q: "Chiar acoperă un mesaj o lună întreagă?",
          a: "Da. Până la 50 de fișiere, publicate zi de zi, pe rețelele spuse. Amesteci o promo de vineri cu douăzeci de poze lunare în aceeași comandă și planul se încurcă — desparți joburile.",
        },
        {
          q: "Fiecare rețea își ia descrierea ei?",
          a: "Asistentul scrie pentru rețeaua pe care o numești. Poți cere o descriere peste tot, sau o linie nativă pe platformă. Dacă ai scris deja linia de campanie, rămân cuvintele tale.",
        },
        {
          q: "O postare programată e deja publică?",
          a: "Nu. Așteaptă ora ei. Poți anula, muta sau rescrie până atunci. Pe TikTok, aștepți bifa verde după un „publică acum” — procesarea nu e același lucru cu live.",
        },
      ],
      relatedTitle: "Mai departe",
      readGuide: "Citește manualul complet",
    },
    de: {
      metaTitle: "30 Instagram-Beiträge mit einer Nachricht planen | posty.now",
      metaDescription:
        "Konten verbinden, bis zu 50 Dateien anhängen und den Assistenten einen Beitrag pro Tag posten lassen. Kurzanleitung für Instagram, TikTok und Facebook aus dem Chat.",
      kicker: "Anleitung",
      title: "So planst du 30 Beiträge mit einer Nachricht",
      subtitle:
        "Du baust dieselbe Caption nicht in fünf Apps neu. Du schickst die Dateien einmal, nennst die Netzwerke und bestätigst den Plan.",
      intro: [
        "Leute suchen „Instagram-Beiträge planen“, weil die nativen Apps aus einem Monat Content dreißig einzelne Jobs machen. posty.now behandelt das als einen Job: Dateien in Reihenfolge, eine Caption pro Netzwerk, eine Uhrzeit pro Tag.",
        "Das ist die Kurzfassung. Der volle Produktguide deckt Sprache, Anzeigen, Analysen und den Inbox ab. Hier brauchst du nur den Weg vom Fotoordner zum Kalender, der sich selbst füllt.",
      ],
      stepsTitle: "Der Weg",
      steps: [
        {
          title: "Instagram, TikTok oder Facebook verbinden",
          body: "Captions gehen, bevor etwas verknüpft ist. Veröffentlichen und ein echter Plan brauchen die verbundenen Konten. Eine Autorisierung pro Netzwerk.",
        },
        {
          title: "Bis zu 50 Fotos oder Videos anhängen",
          body: "Warten, bis jeder Upload fertig ist. Die Reihenfolge, die du wählst, ist die Reihenfolge der Serie — Tag eins ist die erste Datei, Tag dreißig die letzte.",
        },
        {
          title: "Den Auftrag in einer Nachricht sagen",
          body: "Netzwerke, Starttag und ob du eine Uhrzeit oder die beste Stunde willst. Beispiel: „Ab morgen einer pro Tag auf Instagram und TikTok, zur besten Zeit.“",
        },
        {
          title: "Karte lesen, dann bestätigen",
          body: "Caption, Netzwerke und Zeit stehen vor dir, bevor etwas öffentlich ist. Danach kannst du Freitag auf 19:00 schieben, Montag umschreiben oder morgen stornieren, ohne den Rest anzufassen.",
        },
      ],
      sayTitle: "Sätze, die funktionieren",
      examples: [
        "Ab morgen einer pro Tag für 30 Tage auf Instagram, TikTok und Facebook, zur besten Zeit.",
        "Veröffentliche dieses Reel jetzt auf Instagram und TikTok, und das Foto morgen um 10 auf der Facebook-Seite.",
        "Schieb den Instagram-Beitrag von Freitag auf 19:00. Lass den Rest.",
      ],
      faqs: [
        {
          q: "Reicht eine Nachricht wirklich für einen Monat?",
          a: "Ja. Bis zu 50 Dateien, Tag für Tag, auf den Netzwerken, die du nennst. Eine Freitags-Promo mit zwanzig Monatsfotos in denselben Befehl mischen macht den Plan unsauber — diese Jobs trennen.",
        },
        {
          q: "Bekommt jedes Netzwerk eine eigene Caption?",
          a: "Der Assistent schreibt für das Netzwerk, das du nennst. Du kannst eine Caption überall wollen oder eine native Zeile pro Plattform. Wenn du die Kampagnenzeile schon hast, bleiben deine Worte.",
        },
        {
          q: "Ist ein geplanter Beitrag schon öffentlich?",
          a: "Nein. Er wartet auf seine Zeit. Du kannst ihn vorher stornieren, verschieben oder umschreiben. Bei TikTok nach „jetzt veröffentlichen“ auf den grünen Haken warten — Verarbeitung ist nicht live.",
        },
      ],
      relatedTitle: "Weiter",
      readGuide: "Den vollständigen Produktguide lesen",
    },
    it: {
      metaTitle: "Come programmare 30 post Instagram da un messaggio | posty.now",
      metaDescription:
        "Collega gli account, allega fino a 50 file e dì all’assistente di pubblicare uno al giorno. Guida breve per programmare Instagram, TikTok e Facebook dalla chat.",
      kicker: "Guida",
      title: "Come programmare 30 post da un messaggio",
      subtitle:
        "Non rifai la stessa didascalia in cinque app. Invii i file una volta, indichi le reti e confermi il piano.",
      intro: [
        "Si cerca “come programmare i post Instagram” perché le app native fanno di un mese di contenuti trenta lavori distinti. posty.now lo tratta come un solo lavoro: file in ordine, una didascalia per rete, un orario al giorno.",
        "Questa è la versione breve. La guida completa copre voce, ads, analytics e inbox. Qui serve solo il percorso da una cartella di foto a un calendario che si riempie da solo.",
      ],
      stepsTitle: "Il percorso",
      steps: [
        {
          title: "Collega Instagram, TikTok o Facebook",
          body: "Le didascalie funzionano prima del collegamento. Pubblicare e un vero calendario richiedono gli account collegati. Un’autorizzazione per rete.",
        },
        {
          title: "Allega fino a 50 foto o video",
          body: "Aspetta che ogni file finisca il caricamento. L’ordine che scegli è l’ordine della serie — il giorno uno è il primo file, il giorno trenta l’ultimo.",
        },
        {
          title: "Dì l’incarico in un messaggio",
          body: "Indica le reti, il giorno di partenza e se vuoi un orario preciso o la fascia migliore. Esempio: “Da domani uno al giorno su Instagram e TikTok, all’orario migliore.”",
        },
        {
          title: "Leggi la card, poi conferma",
          body: "Vedi didascalia, reti e ora prima che sia pubblico. Dopo puoi ancora spostare venerdì alle 19:00, riscrivere lunedì o cancellare domani senza toccare il resto.",
        },
      ],
      sayTitle: "Frasi che funzionano",
      examples: [
        "Da domani uno al giorno per 30 giorni su Instagram, TikTok e Facebook, all’orario migliore.",
        "Pubblica questo Reel ora su Instagram e TikTok, e metti la foto sulla Pagina Facebook domani alle 10.",
        "Sposta il post Instagram di venerdì alle 19:00. Lascia il resto.",
      ],
      faqs: [
        {
          q: "Un messaggio copre davvero un mese?",
          a: "Sì. Fino a 50 file, pubblicati giorno per giorno, sulle reti che hai indicato. Mischiare una promo del venerdì con venti foto mensili nello stesso comando sporca il piano — spezza quei lavori.",
        },
        {
          q: "Ogni rete ha la sua didascalia?",
          a: "L’assistente scrive per la rete che indichi. Puoi chiedere una didascalia ovunque, o una riga nativa per piattaforma. Se hai già scritto la riga di campagna, restano le tue parole.",
        },
        {
          q: "Un post programmato è già pubblico?",
          a: "No. Aspetta la sua ora. Puoi annullarlo, spostarlo o riscriverlo prima. Su TikTok, dopo un “pubblica ora” aspetta il segno verde — l’elaborazione non è live.",
        },
      ],
      relatedTitle: "Continua",
      readGuide: "Leggi la guida completa del prodotto",
    },
    fr: {
      metaTitle: "Comment programmer 30 posts Instagram en un message | posty.now",
      metaDescription:
        "Connectez vos comptes, joignez jusqu’à 50 fichiers et dites à l’assistant de publier un par jour. Guide court pour Instagram, TikTok et Facebook depuis le chat.",
      kicker: "Guide",
      title: "Comment programmer 30 posts en un message",
      subtitle:
        "Vous ne refaites pas la même légende dans cinq apps. Vous envoyez les fichiers une fois, nommez les réseaux et confirmez le plan.",
      intro: [
        "On cherche « comment programmer des posts Instagram » parce que les apps natives transforment un mois de contenu en trente jobs séparés. posty.now en fait un seul job : fichiers dans l’ordre, une légende par réseau, une heure par jour.",
        "C’est la version courte. Le guide produit complet couvre la voix, les pubs, les analyses et l’inbox. Ici, seulement le chemin d’un dossier de photos à un calendrier qui se remplit tout seul.",
      ],
      stepsTitle: "Le chemin",
      steps: [
        {
          title: "Connectez Instagram, TikTok ou Facebook",
          body: "Les légendes marchent avant tout lien. Publier et un vrai planning exigent les comptes connectés. Une autorisation par réseau.",
        },
        {
          title: "Joignez jusqu’à 50 photos ou vidéos",
          body: "Attendez la fin de chaque envoi. L’ordre que vous choisissez est l’ordre de la série — le jour un est le premier fichier, le jour trente le dernier.",
        },
        {
          title: "Dites la mission en un message",
          body: "Nommez les réseaux, le jour de départ, et si vous voulez une heure fixe ou le meilleur créneau. Exemple : « À partir de demain, un par jour sur Instagram et TikTok, à la meilleure heure. »",
        },
        {
          title: "Lisez la carte, puis confirmez",
          body: "Légende, réseaux et heure sont devant vous avant que ce soit public. Ensuite vous pouvez encore déplacer vendredi à 19:00, réécrire lundi ou annuler demain sans toucher au reste.",
        },
      ],
      sayTitle: "Des phrases qui tiennent",
      examples: [
        "À partir de demain, un par jour pendant 30 jours sur Instagram, TikTok et Facebook, à la meilleure heure.",
        "Publie ce Reel maintenant sur Instagram et TikTok, et mets la photo sur la Page Facebook demain à 10h.",
        "Déplace le post Instagram de vendredi à 19:00. Laisse le reste.",
      ],
      faqs: [
        {
          q: "Un message couvre-t-il vraiment un mois ?",
          a: "Oui. Jusqu’à 50 fichiers, publiés jour après jour, sur les réseaux nommés. Mélanger une promo du vendredi avec vingt photos du mois dans la même commande salit le plan — séparez ces jobs.",
        },
        {
          q: "Chaque réseau a-t-il sa légende ?",
          a: "L’assistant écrit pour le réseau que vous nommez. Vous pouvez demander une légende partout, ou une ligne native par plateforme. Si vous avez déjà la phrase de campagne, vos mots restent.",
        },
        {
          q: "Un post programmé est-il déjà public ?",
          a: "Non. Il attend son heure. Vous pouvez l’annuler, le déplacer ou le réécrire avant. Sur TikTok, après un « publie maintenant », attendez la coche verte — le traitement n’est pas le live.",
        },
      ],
      relatedTitle: "La suite",
      readGuide: "Lire le guide produit complet",
    },
    es: {
      metaTitle: "Cómo programar 30 publicaciones de Instagram con un mensaje | posty.now",
      metaDescription:
        "Conecta tus cuentas, adjunta hasta 50 archivos y dile al asistente que publique una al día. Guía corta para programar Instagram, TikTok y Facebook desde el chat.",
      kicker: "Guía",
      title: "Cómo programar 30 publicaciones con un mensaje",
      subtitle:
        "No rehaces el mismo pie en cinco apps. Envías los archivos una vez, nombras las redes y confirmas el plan.",
      intro: [
        "Se busca “cómo programar publicaciones en Instagram” porque las apps nativas convierten un mes de contenido en treinta encargos sueltos. posty.now lo trata como un solo encargo: archivos en orden, un pie por red, una hora por día.",
        "Esta es la versión corta. La guía completa cubre voz, anuncios, analítica e inbox. Aquí solo el camino de una carpeta de fotos a un calendario que se llena solo.",
      ],
      stepsTitle: "El camino",
      steps: [
        {
          title: "Conecta Instagram, TikTok o Facebook",
          body: "Los pies funcionan antes de enlazar nada. Publicar y un calendario de verdad necesitan las cuentas conectadas. Una autorización por red.",
        },
        {
          title: "Adjunta hasta 50 fotos o vídeos",
          body: "Espera a que termine cada subida. El orden que eliges es el de la serie — el día uno es el primer archivo, el día treinta el último.",
        },
        {
          title: "Di el encargo en un mensaje",
          body: "Nombra las redes, el día de inicio y si quieres hora fija o la mejor franja. Ejemplo: “Desde mañana, una al día en Instagram y TikTok, a la mejor hora.”",
        },
        {
          title: "Lee la tarjeta y confirma",
          body: "Ves pie, redes y hora antes de que sea público. Después aún puedes mover el viernes a las 19:00, reescribir el lunes o cancelar mañana sin tocar el resto.",
        },
      ],
      sayTitle: "Frases que funcionan",
      examples: [
        "Desde mañana, una al día durante 30 días en Instagram, TikTok y Facebook, a la mejor hora.",
        "Publica este Reel ahora en Instagram y TikTok, y pon la foto en la Página de Facebook mañana a las 10.",
        "Mueve la publicación de Instagram del viernes a las 19:00. Deja el resto.",
      ],
      faqs: [
        {
          q: "¿Un mensaje cubre de verdad un mes?",
          a: "Sí. Hasta 50 archivos, publicados día a día, en las redes que nombraste. Mezclar una promo del viernes con veinte fotos del mes en el mismo comando ensucia el plan — separa esos encargos.",
        },
        {
          q: "¿Cada red tiene su propio pie?",
          a: "El asistente escribe para la red que nombras. Puedes pedir un pie para todas, o una línea nativa por plataforma. Si ya escribiste la frase de campaña, se quedan tus palabras.",
        },
        {
          q: "¿Una publicación programada ya es pública?",
          a: "No. Espera su hora. Puedes cancelarla, moverla o reescribirla antes. En TikTok, después de un “publica ahora”, espera el visto verde — procesar no es estar en vivo.",
        },
      ],
      relatedTitle: "Sigue",
      readGuide: "Lee la guía completa del producto",
    },
  },
};

export function isHowToSlug(value: string): value is HowToSlug {
  return (HOW_TO_SLUGS as readonly string[]).includes(value);
}

export function getHowTo(slug: string, locale: string): HowToCopy | null {
  if (!isHowToSlug(slug)) return null;
  return pickLocale(ARTICLES[slug], locale);
}
