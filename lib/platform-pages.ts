import { pickLocale, type AppLocale } from "@/lib/app-locale";

export const PLATFORM_LANDING_SLUGS = ["instagram", "tiktok", "facebook"] as const;
export type PlatformLandingSlug = (typeof PLATFORM_LANDING_SLUGS)[number];

export type PlatformLandingCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  subtitle: string;
  features: { title: string; body: string }[];
  batchTitle: string;
  batchBody: string;
  examplesTitle: string;
  examples: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

type LocaleCopy = Record<AppLocale, PlatformLandingCopy>;

const PAGES: Record<PlatformLandingSlug, LocaleCopy> = {
  instagram: {
    en: {
      metaTitle: "Schedule Instagram posts, Reels and Stories | posty.now",
      metaDescription:
        "Plan Instagram Feed, Reels and Stories from one chat. AI writes the caption, picks a peak hour, or queues up to 50 posts.",
      kicker: "Instagram",
      title: "Schedule Instagram posts from one message",
      subtitle:
        "Describe the photo or Reel in chat. posty.now writes a native caption, picks a peak hour, and publishes to Feed, Reels or Stories — now or one a day for a month.",
      features: [
        {
          title: "Feed, Reels, Stories",
          body: "Photos go to Feed. Video can be a Reel. Ask for a Story when that is the format. You do not rebuild the post in Instagram.",
        },
        {
          title: "Captions that sound like you",
          body: "Paste the line you already have, or let the assistant write it. Hashtags stay optional. Your brand voice holds across the series.",
        },
        {
          title: "Your time, or the best hour",
          body: "Say Friday at 19:00 and that is the slot. Say “best time” and Posty uses a researched peak hour for Instagram.",
        },
      ],
      batchTitle: "A month of Instagram, in the order you picked",
      batchBody:
        "Drop up to 50 photos or videos. Starting tomorrow, one a day, at the best hour — or at the clock time you name. Cancel, move, or rewrite a post before it goes live.",
      examplesTitle: "You can say",
      examples: [
        "Publish this as an Instagram Reel now, with a short caption.",
        "Starting tomorrow, one Instagram post a day for 30 days, at the best time.",
        "Put this photo on an Instagram Story tomorrow at 9.",
      ],
      steps: [
        { title: "Connect Instagram", body: "One authorization. Captions work immediately; publishing needs the account linked." },
        { title: "Send the file and the job", body: "Photo or video, plus when and which format — Feed, Reel, or Story." },
        { title: "Check the card", body: "Caption, time, and network sit in front of you before anything is public." },
        { title: "Confirm", body: "It publishes now or waits on the calendar. You can still edit it later." },
      ],
      faqs: [
        {
          q: "How do I schedule Instagram posts?",
          a: "Connect Instagram, attach the photo or video, and say when. One message can queue a daily series. Nothing is live until you confirm the card.",
        },
        {
          q: "Can it post Reels and Stories, not just Feed?",
          a: "Yes. Photos default to Feed. Video can be a Reel. Ask for a Story when you want that format.",
        },
        {
          q: "Do I need a professional Instagram account?",
          a: "Publishing through a scheduler needs a Professional account linked to a Facebook Page. The specialist page can set that up if you do not have it.",
        },
      ],
    },
    ro: {
      metaTitle: "Programare postări Instagram, Reels și Stories | posty.now",
      metaDescription:
        "Programezi Feed, Reels și Stories pe Instagram dintr-un chat. AI-ul scrie descrierea, alege ora de vârf sau pune în coadă până la 50 de postări.",
      kicker: "Instagram",
      title: "Programează postări Instagram dintr-un mesaj",
      subtitle:
        "Descrii poza sau Reel-ul în chat. posty.now scrie o descriere nativă, alege o oră de vârf și publică pe Feed, Reels sau Stories — acum sau câte una pe zi, o lună.",
      features: [
        {
          title: "Feed, Reels, Stories",
          body: "Pozele merg pe Feed. Video-ul poate fi Reel. Cer Stories când ăla e formatul. Nu refaci postarea în Instagram.",
        },
        {
          title: "Descrieri care sună a tine",
          body: "Lipești linia pe care o ai deja sau lași asistentul să o scrie. Hashtag-urile rămân opționale. Vocea brandului ține toată seria.",
        },
        {
          title: "Ora ta, sau cea mai bună",
          body: "Spui vineri la 19:00 și ăla e intervalul. Spui „cea mai bună oră” și Posty folosește o oră de vârf din research pentru Instagram.",
        },
      ],
      batchTitle: "O lună de Instagram, în ordinea aleasă de tine",
      batchBody:
        "Pui până la 50 de poze sau video-uri. De mâine, câte una pe zi, la cea mai bună oră — sau la ora pe care o spui. Anulezi, muți sau rescrii o postare înainte să iasă live.",
      examplesTitle: "Poți spune",
      examples: [
        "Publică asta ca Reel pe Instagram acum, cu o descriere scurtă.",
        "De mâine, câte o postare Instagram pe zi, 30 de zile, la cea mai bună oră.",
        "Pune poza asta pe un Instagram Story mâine la 9.",
      ],
      steps: [
        { title: "Conectezi Instagram", body: "O autorizare. Descrierile merg imediat; publicarea cere contul legat." },
        { title: "Trimiți fișierul și jobul", body: "Poză sau video, plus când și ce format — Feed, Reel sau Story." },
        { title: "Verifici cardul", body: "Descrierea, ora și rețeaua sunt în față, înainte să fie publice." },
        { title: "Confirmi", body: "Publică acum sau așteaptă pe calendar. Mai poți edita după." },
      ],
      faqs: [
        {
          q: "Cum programez postări pe Instagram?",
          a: "Conectezi Instagram, atașezi poza sau video-ul și spui când. Un mesaj poate pune în coadă o serie zilnică. Nimic nu e live până confirmi cardul.",
        },
        {
          q: "Poate pune Reels și Stories, nu doar Feed?",
          a: "Da. Pozele merg implicit pe Feed. Video-ul poate fi Reel. Cer Stories când vrei formatul ăla.",
        },
        {
          q: "Am nevoie de cont Instagram profesional?",
          a: "Publicarea printr-un scheduler cere un cont Professional legat de o Pagină Facebook. Pagina de specialist poate seta asta dacă nu-l ai.",
        },
      ],
    },
    de: {
      metaTitle: "Instagram-Beiträge, Reels und Stories planen | posty.now",
      metaDescription:
        "Plane Feed, Reels und Stories auf Instagram aus einem Chat. KI schreibt die Caption, wählt die beste Stunde oder reiht bis zu 50 Beiträge ein.",
      kicker: "Instagram",
      title: "Instagram-Beiträge mit einer Nachricht planen",
      subtitle:
        "Beschreib das Foto oder Reel im Chat. posty.now schreibt eine native Caption, wählt eine Spitzenstunde und veröffentlicht in Feed, Reels oder Stories — jetzt oder einen Beitrag pro Tag für einen Monat.",
      features: [
        {
          title: "Feed, Reels, Stories",
          body: "Fotos gehen in den Feed. Video kann ein Reel sein. Frag nach einer Story, wenn das das Format ist. Du baust den Post nicht in Instagram neu.",
        },
        {
          title: "Captions, die nach dir klingen",
          body: "Füg die Zeile ein, die du schon hast, oder lass den Assistenten schreiben. Hashtags bleiben optional. Deine Markenstimme hält über die Serie.",
        },
        {
          title: "Deine Uhrzeit oder die beste Stunde",
          body: "Sag Freitag um 19:00, das ist der Slot. Sag „beste Zeit“, und Posty nutzt eine recherchierte Spitzenstunde für Instagram.",
        },
      ],
      batchTitle: "Ein Monat Instagram, in der Reihenfolge deiner Wahl",
      batchBody:
        "Bis zu 50 Fotos oder Videos. Ab morgen einer pro Tag, zur besten Stunde — oder zur Uhrzeit, die du nennst. Stornieren, verschieben oder umschreiben, bevor es live geht.",
      examplesTitle: "Du kannst sagen",
      examples: [
        "Veröffentliche das jetzt als Instagram Reel, mit kurzer Caption.",
        "Ab morgen ein Instagram-Beitrag pro Tag für 30 Tage, zur besten Zeit.",
        "Leg das Foto morgen um 9 auf eine Instagram Story.",
      ],
      steps: [
        { title: "Instagram verbinden", body: "Eine Autorisierung. Captions gehen sofort; zum Posten muss das Konto verknüpft sein." },
        { title: "Datei und Auftrag senden", body: "Foto oder Video, plus wann und welches Format — Feed, Reel oder Story." },
        { title: "Karte prüfen", body: "Caption, Zeit und Netzwerk stehen vor dir, bevor etwas öffentlich ist." },
        { title: "Bestätigen", body: "Es geht jetzt live oder wartet im Kalender. Du kannst es später noch ändern." },
      ],
      faqs: [
        {
          q: "Wie plane ich Instagram-Beiträge?",
          a: "Verbinde Instagram, häng Foto oder Video an und sag wann. Eine Nachricht kann eine tägliche Serie einreihen. Nichts ist live, bis du die Karte bestätigst.",
        },
        {
          q: "Kann es Reels und Stories posten, nicht nur den Feed?",
          a: "Ja. Fotos gehen standardmäßig in den Feed. Video kann ein Reel sein. Frag nach einer Story, wenn du dieses Format willst.",
        },
        {
          q: "Brauche ich ein professionelles Instagram-Konto?",
          a: "Posten über einen Scheduler braucht ein Professional-Konto, das mit einer Facebook-Seite verknüpft ist. Die Spezialisten-Seite kann das einrichten.",
        },
      ],
    },
    it: {
      metaTitle: "Programma post, Reels e Storie Instagram | posty.now",
      metaDescription:
        "Pianifica Feed, Reels e Storie su Instagram da una chat. L’IA scrive la didascalia, sceglie la fascia migliore o mette in coda fino a 50 post.",
      kicker: "Instagram",
      title: "Programma post Instagram da un messaggio",
      subtitle:
        "Descrivi la foto o il Reel in chat. posty.now scrive una didascalia nativa, sceglie una fascia di picco e pubblica su Feed, Reels o Storie — ora o uno al giorno per un mese.",
      features: [
        {
          title: "Feed, Reels, Storie",
          body: "Le foto vanno nel Feed. Il video può essere un Reel. Chiedi una Storia quando quello è il formato. Non rifai il post in Instagram.",
        },
        {
          title: "Didascalie che sembrano tue",
          body: "Incolla la riga che hai già o lascia scrivere l’assistente. Gli hashtag restano opzionali. Il tono del brand tiene su tutta la serie.",
        },
        {
          title: "La tua ora, o la migliore",
          body: "Dì venerdì alle 19:00 ed è quello lo slot. Dì “orario migliore” e Posty usa una fascia di picco per Instagram.",
        },
      ],
      batchTitle: "Un mese di Instagram, nell’ordine che scegli tu",
      batchBody:
        "Fino a 50 foto o video. Da domani, uno al giorno, nella fascia migliore — o all’ora che indichi. Annulla, sposta o riscrivi un post prima che sia live.",
      examplesTitle: "Puoi dire",
      examples: [
        "Pubblica questo come Reel su Instagram ora, con una didascalia breve.",
        "Da domani un post Instagram al giorno per 30 giorni, all’orario migliore.",
        "Metti questa foto su una Storia Instagram domani alle 9.",
      ],
      steps: [
        { title: "Collega Instagram", body: "Un’autorizzazione. Le didascalie funzionano subito; per pubblicare serve l’account collegato." },
        { title: "Invia file e incarico", body: "Foto o video, più quando e quale formato — Feed, Reel o Storia." },
        { title: "Controlla la card", body: "Didascalia, ora e rete ti stanno davanti prima che sia pubblico." },
        { title: "Conferma", body: "Pubblica ora o resta in calendario. Puoi ancora modificarlo dopo." },
      ],
      faqs: [
        {
          q: "Come programmo i post su Instagram?",
          a: "Collega Instagram, allega foto o video e dì quando. Un messaggio può mettere in coda una serie quotidiana. Niente è live finché non confermi la card.",
        },
        {
          q: "Può pubblicare Reels e Storie, non solo il Feed?",
          a: "Sì. Le foto vanno di default nel Feed. Il video può essere un Reel. Chiedi una Storia quando vuoi quel formato.",
        },
        {
          q: "Serve un account Instagram professionale?",
          a: "Pubblicare con uno scheduler richiede un account Professional collegato a una Pagina Facebook. La pagina specialista può configurarlo.",
        },
      ],
    },
    fr: {
      metaTitle: "Programmez posts, Reels et Stories Instagram | posty.now",
      metaDescription:
        "Planifiez Feed, Reels et Stories Instagram depuis un chat. L’IA rédige la légende, choisit le meilleur créneau ou met jusqu’à 50 posts en file.",
      kicker: "Instagram",
      title: "Programmez vos posts Instagram en un message",
      subtitle:
        "Décrivez la photo ou le Reel dans le chat. posty.now rédige une légende native, choisit une heure de pointe et publie en Feed, Reels ou Stories — maintenant ou un par jour pendant un mois.",
      features: [
        {
          title: "Feed, Reels, Stories",
          body: "Les photos vont au Feed. La vidéo peut être un Reel. Demandez une Story quand c’est le format. Vous ne refaites pas le post dans Instagram.",
        },
        {
          title: "Des légendes qui sonnent comme vous",
          body: "Collez la phrase déjà prête, ou laissez l’assistant écrire. Les hashtags restent optionnels. La voix de marque tient sur toute la série.",
        },
        {
          title: "Votre heure, ou la meilleure",
          body: "Dites vendredi à 19:00, c’est le créneau. Dites « meilleure heure » et Posty utilise un pic recherché pour Instagram.",
        },
      ],
      batchTitle: "Un mois d’Instagram, dans l’ordre que vous choisissez",
      batchBody:
        "Jusqu’à 50 photos ou vidéos. À partir de demain, une par jour, à la meilleure heure — ou à l’heure que vous nommez. Annulez, déplacez ou réécrivez avant la mise en ligne.",
      examplesTitle: "Vous pouvez dire",
      examples: [
        "Publie ça en Reel Instagram maintenant, avec une légende courte.",
        "À partir de demain, un post Instagram par jour pendant 30 jours, à la meilleure heure.",
        "Mets cette photo en Story Instagram demain à 9h.",
      ],
      steps: [
        { title: "Connectez Instagram", body: "Une autorisation. Les légendes marchent tout de suite ; publier exige le compte lié." },
        { title: "Envoyez le fichier et la mission", body: "Photo ou vidéo, plus quand et quel format — Feed, Reel ou Story." },
        { title: "Vérifiez la carte", body: "Légende, heure et réseau sont devant vous avant que ce soit public." },
        { title: "Confirmez", body: "Ça publie maintenant ou attend dans le calendrier. Vous pouvez encore modifier ensuite." },
      ],
      faqs: [
        {
          q: "Comment programmer des posts Instagram ?",
          a: "Connectez Instagram, joignez la photo ou la vidéo et dites quand. Un message peut mettre une série quotidienne en file. Rien n’est en ligne tant que vous n’avez pas confirmé la carte.",
        },
        {
          q: "Peut-il publier des Reels et Stories, pas seulement le Feed ?",
          a: "Oui. Les photos vont par défaut au Feed. La vidéo peut être un Reel. Demandez une Story quand vous voulez ce format.",
        },
        {
          q: "Faut-il un compte Instagram professionnel ?",
          a: "Publier via un planificateur exige un compte Professional lié à une Page Facebook. La page spécialiste peut le configurer.",
        },
      ],
    },
    es: {
      metaTitle: "Programa posts, Reels e Historias de Instagram | posty.now",
      metaDescription:
        "Planifica Feed, Reels e Historias de Instagram desde un chat. La IA escribe el pie, elige la mejor hora o pone en cola hasta 50 publicaciones.",
      kicker: "Instagram",
      title: "Programa publicaciones de Instagram con un mensaje",
      subtitle:
        "Describe la foto o el Reel en el chat. posty.now escribe un pie nativo, elige una hora pico y publica en Feed, Reels o Historias — ahora o una al día durante un mes.",
      features: [
        {
          title: "Feed, Reels, Historias",
          body: "Las fotos van al Feed. El vídeo puede ser un Reel. Pide una Historia cuando ese sea el formato. No rehaces la publicación en Instagram.",
        },
        {
          title: "Pies de foto que suenan a ti",
          body: "Pega la frase que ya tienes o deja que el asistente la escriba. Los hashtags son opcionales. La voz de marca se mantiene en toda la serie.",
        },
        {
          title: "Tu hora, o la mejor",
          body: "Di viernes a las 19:00 y ese es el hueco. Di “mejor hora” y Posty usa una franja pico investigada para Instagram.",
        },
      ],
      batchTitle: "Un mes de Instagram, en el orden que elijas",
      batchBody:
        "Hasta 50 fotos o vídeos. Desde mañana, una al día, a la mejor hora — o a la hora que indiques. Cancela, mueve o reescribe una publicación antes de que salga.",
      examplesTitle: "Puedes decir",
      examples: [
        "Publica esto como Reel de Instagram ahora, con un pie corto.",
        "Desde mañana, una publicación de Instagram al día durante 30 días, a la mejor hora.",
        "Pon esta foto en una Historia de Instagram mañana a las 9.",
      ],
      steps: [
        { title: "Conecta Instagram", body: "Una autorización. Los pies funcionan al momento; publicar necesita la cuenta enlazada." },
        { title: "Envía el archivo y el encargo", body: "Foto o vídeo, más cuándo y qué formato — Feed, Reel o Historia." },
        { title: "Revisa la tarjeta", body: "Pie, hora y red están delante antes de que sea público." },
        { title: "Confirma", body: "Publica ahora o espera en el calendario. Aún puedes editarlo después." },
      ],
      faqs: [
        {
          q: "¿Cómo programo publicaciones en Instagram?",
          a: "Conecta Instagram, adjunta la foto o el vídeo y di cuándo. Un mensaje puede poner en cola una serie diaria. Nada está en vivo hasta que confirmas la tarjeta.",
        },
        {
          q: "¿Puede publicar Reels e Historias, no solo el Feed?",
          a: "Sí. Las fotos van por defecto al Feed. El vídeo puede ser un Reel. Pide una Historia cuando quieras ese formato.",
        },
        {
          q: "¿Necesito una cuenta profesional de Instagram?",
          a: "Publicar con un programador exige una cuenta Professional vinculada a una Página de Facebook. La página de especialista puede configurarlo.",
        },
      ],
    },
  },
  tiktok: {
    en: {
      metaTitle: "Schedule TikTok videos and photo posts | posty.now",
      metaDescription:
        "Plan TikTok from one chat. AI writes the caption, posts video or photo carousels, and queues up to 50 days at the best hour.",
      kicker: "TikTok",
      title: "Schedule TikTok posts from one message",
      subtitle:
        "Send the video or the photo set. posty.now writes a TikTok caption, picks a peak hour, and publishes now — or one a day until the batch is done.",
      features: [
        {
          title: "Video and photo carousels",
          body: "TikTok takes video and photo posts. You name the format in chat instead of rebuilding it in the TikTok app.",
        },
        {
          title: "Captions that fit the clip",
          body: "Short, native, optional hashtags. If you already have the line, it stays as you wrote it.",
        },
        {
          title: "Wait for the green check",
          body: "“Publishing now” on TikTok still means it is processing. The post is live when the check appears — not before.",
        },
      ],
      batchTitle: "Thirty clips, one command",
      batchBody:
        "Attach up to 50 files. Starting tomorrow, one a day, at the best time for TikTok. Move Friday’s clip to 19:00 or cancel tomorrow without touching the rest.",
      examplesTitle: "You can say",
      examples: [
        "Publish this video on TikTok now.",
        "Starting tomorrow, one TikTok a day for 30 days, at the best time.",
        "Move Friday’s TikTok to 19:00.",
      ],
      steps: [
        { title: "Connect TikTok", body: "One authorization. Scheduling and publishing need the account linked." },
        { title: "Attach the clip", body: "Video, or photos for a carousel. Wait until the upload finishes, then send." },
        { title: "Name when", body: "Now, a clock time, or the best hour." },
        { title: "Confirm, then wait for the check", body: "TikTok processes after confirm. The green check is the live moment." },
      ],
      faqs: [
        {
          q: "How do I schedule TikTok videos?",
          a: "Connect TikTok, attach the file, and say when. One message can queue a daily series. Confirm the card; wait for the green check before you assume it is live.",
        },
        {
          q: "Can it post photos on TikTok, not only video?",
          a: "Yes. TikTok accepts video and photo carousels. Say which format you want in the same message.",
        },
        {
          q: "Why does TikTok still say it is publishing?",
          a: "TikTok processes after you confirm. That is normal. The green check is the moment it is actually out.",
        },
      ],
    },
    ro: {
      metaTitle: "Programare video și postări foto TikTok | posty.now",
      metaDescription:
        "Programezi TikTok dintr-un chat. AI-ul scrie descrierea, publică video sau carusele foto și pune în coadă până la 50 de zile, la cea mai bună oră.",
      kicker: "TikTok",
      title: "Programează postări TikTok dintr-un mesaj",
      subtitle:
        "Trimiți video-ul sau setul de poze. posty.now scrie o descriere de TikTok, alege o oră de vârf și publică acum — sau câte una pe zi până se termină seria.",
      features: [
        {
          title: "Video și carusele foto",
          body: "TikTok ia video și postări foto. Spui formatul în chat, nu-l refaci în aplicația TikTok.",
        },
        {
          title: "Descrieri care se potrivesc clipului",
          body: "Scurte, native, hashtag-uri opționale. Dacă ai deja linia, rămâne cum ai scris-o.",
        },
        {
          title: "Aștepți bifa verde",
          body: "„Se publică acum” pe TikTok înseamnă că încă procesează. Postarea e live când apare bifa — nu înainte.",
        },
      ],
      batchTitle: "Treizeci de clipuri, o comandă",
      batchBody:
        "Atașezi până la 50 de fișiere. De mâine, câte una pe zi, la cea mai bună oră pentru TikTok. Muți clipul de vineri la 19:00 sau anulezi mâine fără să atingi restul.",
      examplesTitle: "Poți spune",
      examples: [
        "Publică video-ul ăsta pe TikTok acum.",
        "De mâine, câte un TikTok pe zi, 30 de zile, la cea mai bună oră.",
        "Mută TikTok-ul de vineri la 19:00.",
      ],
      steps: [
        { title: "Conectezi TikTok", body: "O autorizare. Programarea și publicarea cer contul legat." },
        { title: "Atașezi clipul", body: "Video, sau poze pentru carusel. Aștepți upload-ul, apoi trimiți." },
        { title: "Spui când", body: "Acum, o oră fixă sau cea mai bună oră." },
        { title: "Confirmi, apoi aștepți bifa", body: "TikTok procesează după confirmare. Bifa verde e momentul live." },
      ],
      faqs: [
        {
          q: "Cum programez video-uri pe TikTok?",
          a: "Conectezi TikTok, atașezi fișierul și spui când. Un mesaj poate pune în coadă o serie zilnică. Confirmi cardul; aștepți bifa verde înainte să crezi că e live.",
        },
        {
          q: "Poate pune și poze pe TikTok, nu doar video?",
          a: "Da. TikTok acceptă video și carusele foto. Spui formatul în același mesaj.",
        },
        {
          q: "De ce zice TikTok că încă se publică?",
          a: "TikTok procesează după ce confirmi. E normal. Bifa verde e momentul în care e chiar afară.",
        },
      ],
    },
    de: {
      metaTitle: "TikTok-Videos und Fotoposts planen | posty.now",
      metaDescription:
        "Plane TikTok aus einem Chat. KI schreibt die Caption, postet Video oder Foto-Karussells und reiht bis zu 50 Tage zur besten Stunde ein.",
      kicker: "TikTok",
      title: "TikTok-Beiträge mit einer Nachricht planen",
      subtitle:
        "Schick das Video oder das Fotoset. posty.now schreibt eine TikTok-Caption, wählt eine Spitzenstunde und veröffentlicht jetzt — oder einen Clip pro Tag, bis die Serie durch ist.",
      features: [
        {
          title: "Video und Foto-Karussells",
          body: "TikTok nimmt Video und Fotoposts. Du nennst das Format im Chat, statt es in der TikTok-App neu zu bauen.",
        },
        {
          title: "Captions, die zum Clip passen",
          body: "Kurz, nativ, Hashtags optional. Wenn du die Zeile schon hast, bleibt sie, wie du sie geschrieben hast.",
        },
        {
          title: "Auf den grünen Haken warten",
          body: "„Wird jetzt veröffentlicht“ heißt bei TikTok noch Verarbeitung. Live ist der Post, wenn der Haken da ist — nicht vorher.",
        },
      ],
      batchTitle: "Dreißig Clips, ein Befehl",
      batchBody:
        "Bis zu 50 Dateien. Ab morgen einer pro Tag, zur besten Zeit für TikTok. Freitags Clip auf 19:00 schieben oder morgen stornieren, ohne den Rest anzufassen.",
      examplesTitle: "Du kannst sagen",
      examples: [
        "Veröffentliche dieses Video jetzt auf TikTok.",
        "Ab morgen ein TikTok pro Tag für 30 Tage, zur besten Zeit.",
        "Schieb das TikTok von Freitag auf 19:00.",
      ],
      steps: [
        { title: "TikTok verbinden", body: "Eine Autorisierung. Planen und Posten brauchen das verknüpfte Konto." },
        { title: "Clip anhängen", body: "Video oder Fotos für ein Karussell. Warten, bis der Upload fertig ist, dann senden." },
        { title: "Wann sagen", body: "Jetzt, eine Uhrzeit oder die beste Stunde." },
        { title: "Bestätigen, dann auf den Haken warten", body: "TikTok verarbeitet nach der Bestätigung. Der grüne Haken ist der Live-Moment." },
      ],
      faqs: [
        {
          q: "Wie plane ich TikTok-Videos?",
          a: "Verbinde TikTok, häng die Datei an und sag wann. Eine Nachricht kann eine tägliche Serie einreihen. Bestätige die Karte; warte auf den grünen Haken, bevor du denkst, es sei live.",
        },
        {
          q: "Kann es Fotos auf TikTok posten, nicht nur Video?",
          a: "Ja. TikTok nimmt Video und Foto-Karussells. Sag das Format in derselben Nachricht.",
        },
        {
          q: "Warum sagt TikTok noch, es werde veröffentlicht?",
          a: "TikTok verarbeitet nach der Bestätigung. Das ist normal. Der grüne Haken ist der Moment, in dem es wirklich draußen ist.",
        },
      ],
    },
    it: {
      metaTitle: "Programma video e post foto TikTok | posty.now",
      metaDescription:
        "Pianifica TikTok da una chat. L’IA scrive la didascalia, pubblica video o caroselli foto e mette in coda fino a 50 giorni nella fascia migliore.",
      kicker: "TikTok",
      title: "Programma post TikTok da un messaggio",
      subtitle:
        "Invia il video o il set di foto. posty.now scrive una didascalia TikTok, sceglie una fascia di picco e pubblica ora — o uno al giorno finché la serie non è finita.",
      features: [
        {
          title: "Video e caroselli foto",
          body: "TikTok accetta video e post foto. Indichi il formato in chat invece di rifarlo nell’app TikTok.",
        },
        {
          title: "Didascalie che stanno al clip",
          body: "Brevi, native, hashtag opzionali. Se hai già la riga, resta com’è scritta.",
        },
        {
          title: "Aspetta il segno verde",
          body: "“In pubblicazione ora” su TikTok significa ancora elaborazione. Il post è live quando compare il segno — non prima.",
        },
      ],
      batchTitle: "Trenta clip, un comando",
      batchBody:
        "Fino a 50 file. Da domani uno al giorno, all’orario migliore per TikTok. Sposta il clip di venerdì alle 19:00 o cancella quello di domani senza toccare il resto.",
      examplesTitle: "Puoi dire",
      examples: [
        "Pubblica questo video su TikTok ora.",
        "Da domani un TikTok al giorno per 30 giorni, all’orario migliore.",
        "Sposta il TikTok di venerdì alle 19:00.",
      ],
      steps: [
        { title: "Collega TikTok", body: "Un’autorizzazione. Programmazione e pubblicazione richiedono l’account collegato." },
        { title: "Allega il clip", body: "Video, o foto per un carosello. Aspetta il caricamento, poi invia." },
        { title: "Dì quando", body: "Ora, un orario preciso o la fascia migliore." },
        { title: "Conferma, poi aspetta il segno", body: "TikTok elabora dopo la conferma. Il segno verde è il momento live." },
      ],
      faqs: [
        {
          q: "Come programmo i video su TikTok?",
          a: "Collega TikTok, allega il file e dì quando. Un messaggio può mettere in coda una serie quotidiana. Conferma la card; aspetta il segno verde prima di dare per live.",
        },
        {
          q: "Può pubblicare foto su TikTok, non solo video?",
          a: "Sì. TikTok accetta video e caroselli foto. Indica il formato nello stesso messaggio.",
        },
        {
          q: "Perché TikTok dice ancora che sta pubblicando?",
          a: "TikTok elabora dopo la conferma. È normale. Il segno verde è il momento in cui è davvero fuori.",
        },
      ],
    },
    fr: {
      metaTitle: "Programmez vidéos et posts photo TikTok | posty.now",
      metaDescription:
        "Planifiez TikTok depuis un chat. L’IA rédige la légende, publie la vidéo ou un carrousel photo et met jusqu’à 50 jours en file au meilleur créneau.",
      kicker: "TikTok",
      title: "Programmez vos posts TikTok en un message",
      subtitle:
        "Envoyez la vidéo ou le set de photos. posty.now rédige une légende TikTok, choisit une heure de pointe et publie maintenant — ou une par jour jusqu’à la fin de la série.",
      features: [
        {
          title: "Vidéo et carrousels photo",
          body: "TikTok prend la vidéo et les posts photo. Vous nommez le format dans le chat au lieu de le refaire dans l’app TikTok.",
        },
        {
          title: "Des légendes qui collent au clip",
          body: "Courtes, natives, hashtags optionnels. Si vous avez déjà la phrase, elle reste telle quelle.",
        },
        {
          title: "Attendez la coche verte",
          body: "« Publication en cours » sur TikTok veut encore dire traitement. Le post est en ligne quand la coche apparaît — pas avant.",
        },
      ],
      batchTitle: "Trente clips, une commande",
      batchBody:
        "Jusqu’à 50 fichiers. À partir de demain, un par jour, au meilleur moment pour TikTok. Déplacez le clip de vendredi à 19:00 ou annulez demain sans toucher au reste.",
      examplesTitle: "Vous pouvez dire",
      examples: [
        "Publie cette vidéo sur TikTok maintenant.",
        "À partir de demain, un TikTok par jour pendant 30 jours, à la meilleure heure.",
        "Déplace le TikTok de vendredi à 19:00.",
      ],
      steps: [
        { title: "Connectez TikTok", body: "Une autorisation. Planifier et publier exigent le compte lié." },
        { title: "Joignez le clip", body: "Vidéo, ou photos pour un carrousel. Attendez la fin de l’envoi, puis envoyez." },
        { title: "Dites quand", body: "Maintenant, une heure précise, ou le meilleur créneau." },
        { title: "Confirmez, puis attendez la coche", body: "TikTok traite après confirmation. La coche verte est le moment live." },
      ],
      faqs: [
        {
          q: "Comment programmer des vidéos TikTok ?",
          a: "Connectez TikTok, joignez le fichier et dites quand. Un message peut mettre une série quotidienne en file. Confirmez la carte ; attendez la coche verte avant de croire que c’est en ligne.",
        },
        {
          q: "Peut-il publier des photos sur TikTok, pas seulement de la vidéo ?",
          a: "Oui. TikTok accepte la vidéo et les carrousels photo. Dites le format dans le même message.",
        },
        {
          q: "Pourquoi TikTok dit-il encore que ça publie ?",
          a: "TikTok traite après confirmation. C’est normal. La coche verte est le moment où c’est vraiment sorti.",
        },
      ],
    },
    es: {
      metaTitle: "Programa vídeos y posts de fotos en TikTok | posty.now",
      metaDescription:
        "Planifica TikTok desde un chat. La IA escribe el pie, publica vídeo o carruseles de fotos y pone en cola hasta 50 días a la mejor hora.",
      kicker: "TikTok",
      title: "Programa publicaciones de TikTok con un mensaje",
      subtitle:
        "Envía el vídeo o el set de fotos. posty.now escribe un pie de TikTok, elige una hora pico y publica ahora — o uno al día hasta terminar la serie.",
      features: [
        {
          title: "Vídeo y carruseles de fotos",
          body: "TikTok acepta vídeo y publicaciones de fotos. Indicas el formato en el chat en lugar de rehacerlo en la app de TikTok.",
        },
        {
          title: "Pies que encajan con el clip",
          body: "Cortos, nativos, hashtags opcionales. Si ya tienes la frase, se queda como la escribiste.",
        },
        {
          title: "Espera el visto verde",
          body: "“Publicando ahora” en TikTok sigue siendo procesamiento. La publicación está en vivo cuando aparece el visto — no antes.",
        },
      ],
      batchTitle: "Treinta clips, una orden",
      batchBody:
        "Hasta 50 archivos. Desde mañana, uno al día, a la mejor hora para TikTok. Mueve el clip del viernes a las 19:00 o cancela el de mañana sin tocar el resto.",
      examplesTitle: "Puedes decir",
      examples: [
        "Publica este vídeo en TikTok ahora.",
        "Desde mañana, un TikTok al día durante 30 días, a la mejor hora.",
        "Mueve el TikTok del viernes a las 19:00.",
      ],
      steps: [
        { title: "Conecta TikTok", body: "Una autorización. Programar y publicar necesitan la cuenta enlazada." },
        { title: "Adjunta el clip", body: "Vídeo, o fotos para un carrusel. Espera a que termine la subida y luego envía." },
        { title: "Di cuándo", body: "Ahora, una hora fija o la mejor franja." },
        { title: "Confirma y espera el visto", body: "TikTok procesa después de confirmar. El visto verde es el momento en vivo." },
      ],
      faqs: [
        {
          q: "¿Cómo programo vídeos en TikTok?",
          a: "Conecta TikTok, adjunta el archivo y di cuándo. Un mensaje puede poner en cola una serie diaria. Confirma la tarjeta; espera el visto verde antes de darlo por publicado.",
        },
        {
          q: "¿Puede publicar fotos en TikTok, no solo vídeo?",
          a: "Sí. TikTok acepta vídeo y carruseles de fotos. Di el formato en el mismo mensaje.",
        },
        {
          q: "¿Por qué TikTok sigue diciendo que está publicando?",
          a: "TikTok procesa después de confirmar. Es normal. El visto verde es el momento en que realmente está fuera.",
        },
      ],
    },
  },
  facebook: {
    en: {
      metaTitle: "Schedule Facebook posts and Reels | posty.now",
      metaDescription:
        "Plan Facebook Page posts and Reels from one chat. AI writes the caption, picks a peak hour, and can queue a month of content.",
      kicker: "Facebook",
      title: "Schedule Facebook posts from one message",
      subtitle:
        "Talk to the assistant like a colleague. posty.now writes the caption, publishes to your Facebook Page, and can run the same idea on Instagram in the same breath.",
      features: [
        {
          title: "Page posts and Reels",
          body: "Photos, video, and Reels on the Page you connected. You confirm the card; nothing is public before that.",
        },
        {
          title: "Instagram in the same command",
          body: "Facebook and Instagram often ship together. Name both networks in one message when the asset works on both.",
        },
        {
          title: "Ads when a post should travel",
          body: "The organic post and the paid campaign stay separate. Say the goal if you want Meta ads from the same studio.",
        },
      ],
      batchTitle: "A month on the Page, without living in Ads Manager",
      batchBody:
        "Up to 50 files, one a day, at the best hour for Facebook — or at the time you name. Edit Monday’s caption after it is scheduled. Boost later if the post earns it.",
      examplesTitle: "You can say",
      examples: [
        "Publish this on the Facebook Page now, with a short caption.",
        "Starting tomorrow, one Facebook post a day for 30 days, at the best time.",
        "Same photo on Facebook and Instagram, tomorrow at 10.",
      ],
      steps: [
        { title: "Connect the Facebook Page", body: "A Page, not only a personal profile. One authorization covers posting." },
        { title: "Send the work", body: "Photo, video, or text. Say if Instagram should get it too." },
        { title: "Read the card", body: "Networks, caption, and time before anything goes live." },
        { title: "Confirm", body: "It publishes or sits on the calendar. Ads stay a separate ask." },
      ],
      faqs: [
        {
          q: "How do I schedule Facebook posts?",
          a: "Connect your Facebook Page, attach the file or write the update, and say when. One message can queue a daily series. Confirm the card first.",
        },
        {
          q: "Can I post to Facebook and Instagram together?",
          a: "Yes. Name both networks in the same message when the photo or video fits both. Each network still gets its own caption if you ask.",
        },
        {
          q: "Does this also run Facebook ads?",
          a: "Organic posts and ads are separate. Say the campaign goal when you want paid reach on Meta. Ad spend goes to Meta, not to posty.now.",
        },
      ],
    },
    ro: {
      metaTitle: "Programare postări și Reels Facebook | posty.now",
      metaDescription:
        "Programezi postări și Reels pe Pagina de Facebook dintr-un chat. AI-ul scrie descrierea, alege ora de vârf și poate pune o lună de conținut în coadă.",
      kicker: "Facebook",
      title: "Programează postări Facebook dintr-un mesaj",
      subtitle:
        "Vorbești cu asistentul ca și cu un coleg. posty.now scrie descrierea, publică pe Pagina de Facebook și poate duce aceeași idee pe Instagram din aceeași suflare.",
      features: [
        {
          title: "Postări pe Pagină și Reels",
          body: "Poze, video și Reels pe Pagina conectată. Confirmi cardul; nimic nu e public înainte.",
        },
        {
          title: "Instagram, în aceeași comandă",
          body: "Facebook și Instagram pleacă des împreună. Numești ambele rețele într-un mesaj când materialul ține pe amândouă.",
        },
        {
          title: "Reclame când postul trebuie să meargă mai departe",
          body: "Postarea organică și campania plătită rămân separate. Spui obiectivul dacă vrei reclame Meta din același studio.",
        },
      ],
      batchTitle: "O lună pe Pagină, fără să stai în Ads Manager",
      batchBody:
        "Până la 50 de fișiere, câte una pe zi, la cea mai bună oră pentru Facebook — sau la ora pe care o spui. Editezi descrierea de luni după ce e programată. Dai boost mai târziu, dacă merită.",
      examplesTitle: "Poți spune",
      examples: [
        "Publică asta pe Pagina de Facebook acum, cu o descriere scurtă.",
        "De mâine, câte o postare Facebook pe zi, 30 de zile, la cea mai bună oră.",
        "Aceeași poză pe Facebook și Instagram, mâine la 10.",
      ],
      steps: [
        { title: "Conectezi Pagina de Facebook", body: "O Pagină, nu doar un profil personal. O autorizare acoperă publicarea." },
        { title: "Trimiți lucrarea", body: "Poză, video sau text. Spui dacă și Instagram o ia." },
        { title: "Citești cardul", body: "Rețele, descriere și oră, înainte să iasă live." },
        { title: "Confirmi", body: "Publică sau așteaptă pe calendar. Reclamele rămân o cerere separată." },
      ],
      faqs: [
        {
          q: "Cum programez postări pe Facebook?",
          a: "Conectezi Pagina de Facebook, atașezi fișierul sau scrii update-ul și spui când. Un mesaj poate pune în coadă o serie zilnică. Confirmi cardul întâi.",
        },
        {
          q: "Pot pune pe Facebook și Instagram împreună?",
          a: "Da. Numești ambele rețele în același mesaj când poza sau video-ul ține pe amândouă. Fiecare rețea își poate lua descrierea ei, dacă ceri.",
        },
        {
          q: "Asta rulează și reclame Facebook?",
          a: "Postările organice și reclamele sunt separate. Spui obiectivul campaniei când vrei reach plătit pe Meta. Banii de reclamă se duc la Meta, nu la posty.now.",
        },
      ],
    },
    de: {
      metaTitle: "Facebook-Beiträge und Reels planen | posty.now",
      metaDescription:
        "Plane Beiträge und Reels auf deiner Facebook-Seite aus einem Chat. KI schreibt die Caption, wählt die beste Stunde und kann einen Monat Content einreihen.",
      kicker: "Facebook",
      title: "Facebook-Beiträge mit einer Nachricht planen",
      subtitle:
        "Sprich mit dem Assistenten wie mit einem Kollegen. posty.now schreibt die Caption, veröffentlicht auf deiner Facebook-Seite und kann dieselbe Idee im selben Atemzug auf Instagram bringen.",
      features: [
        {
          title: "Seitenbeiträge und Reels",
          body: "Fotos, Video und Reels auf der verbundenen Seite. Du bestätigst die Karte; vorher ist nichts öffentlich.",
        },
        {
          title: "Instagram im selben Befehl",
          body: "Facebook und Instagram gehen oft zusammen raus. Nenn beide Netzwerke in einer Nachricht, wenn das Material auf beiden sitzt.",
        },
        {
          title: "Anzeigen, wenn der Post weiterreisen soll",
          body: "Organischer Post und bezahlte Kampagne bleiben getrennt. Sag das Ziel, wenn du Meta-Anzeigen aus demselben Studio willst.",
        },
      ],
      batchTitle: "Ein Monat auf der Seite, ohne Ads Manager",
      batchBody:
        "Bis zu 50 Dateien, eine pro Tag, zur besten Stunde für Facebook — oder zur Uhrzeit, die du nennst. Montags Caption nach dem Planen noch ändern. Später boosten, wenn der Post es wert ist.",
      examplesTitle: "Du kannst sagen",
      examples: [
        "Veröffentliche das jetzt auf der Facebook-Seite, mit kurzer Caption.",
        "Ab morgen ein Facebook-Beitrag pro Tag für 30 Tage, zur besten Zeit.",
        "Dasselbe Foto auf Facebook und Instagram, morgen um 10.",
      ],
      steps: [
        { title: "Facebook-Seite verbinden", body: "Eine Seite, nicht nur ein privates Profil. Eine Autorisierung reicht zum Posten." },
        { title: "Die Arbeit senden", body: "Foto, Video oder Text. Sag, ob Instagram es auch bekommen soll." },
        { title: "Karte lesen", body: "Netzwerke, Caption und Zeit, bevor etwas live geht." },
        { title: "Bestätigen", body: "Es veröffentlicht oder wartet im Kalender. Anzeigen bleiben eine separate Bitte." },
      ],
      faqs: [
        {
          q: "Wie plane ich Facebook-Beiträge?",
          a: "Verbinde deine Facebook-Seite, häng die Datei an oder schreib das Update und sag wann. Eine Nachricht kann eine tägliche Serie einreihen. Erst die Karte bestätigen.",
        },
        {
          q: "Kann ich Facebook und Instagram zusammen posten?",
          a: "Ja. Nenn beide Netzwerke in derselben Nachricht, wenn Foto oder Video auf beiden passt. Jedes Netzwerk kann eine eigene Caption bekommen, wenn du das willst.",
        },
        {
          q: "Läuft das auch Facebook-Anzeigen?",
          a: "Organische Posts und Anzeigen sind getrennt. Sag das Kampagnenziel, wenn du bezahlte Reichweite auf Meta willst. Der Werbeetat geht an Meta, nicht an posty.now.",
        },
      ],
    },
    it: {
      metaTitle: "Programma post e Reels Facebook | posty.now",
      metaDescription:
        "Pianifica post e Reels sulla Pagina Facebook da una chat. L’IA scrive la didascalia, sceglie la fascia migliore e può mettere in coda un mese di contenuti.",
      kicker: "Facebook",
      title: "Programma post Facebook da un messaggio",
      subtitle:
        "Parla con l’assistente come con un collega. posty.now scrive la didascalia, pubblica sulla tua Pagina Facebook e può portare la stessa idea su Instagram nello stesso respiro.",
      features: [
        {
          title: "Post della Pagina e Reels",
          body: "Foto, video e Reels sulla Pagina collegata. Confermi la card; prima non è pubblico.",
        },
        {
          title: "Instagram nello stesso comando",
          body: "Facebook e Instagram partono spesso insieme. Indica entrambe le reti in un messaggio quando il materiale sta su entrambe.",
        },
        {
          title: "Ads quando il post deve viaggiare",
          body: "Il post organico e la campagna a pagamento restano separati. Dì l’obiettivo se vuoi ads Meta dallo stesso studio.",
        },
      ],
      batchTitle: "Un mese sulla Pagina, senza vivere in Ads Manager",
      batchBody:
        "Fino a 50 file, uno al giorno, nella fascia migliore per Facebook — o all’ora che indichi. Modifica la didascalia di lunedì dopo averla programmata. Fai boost più tardi se il post lo merita.",
      examplesTitle: "Puoi dire",
      examples: [
        "Pubblica questo sulla Pagina Facebook ora, con una didascalia breve.",
        "Da domani un post Facebook al giorno per 30 giorni, all’orario migliore.",
        "La stessa foto su Facebook e Instagram, domani alle 10.",
      ],
      steps: [
        { title: "Collega la Pagina Facebook", body: "Una Pagina, non solo un profilo personale. Un’autorizzazione copre la pubblicazione." },
        { title: "Invia il lavoro", body: "Foto, video o testo. Dì se anche Instagram deve prenderlo." },
        { title: "Leggi la card", body: "Reti, didascalia e ora, prima che sia live." },
        { title: "Conferma", body: "Pubblica o resta in calendario. Le ads restano una richiesta a parte." },
      ],
      faqs: [
        {
          q: "Come programmo i post su Facebook?",
          a: "Collega la Pagina Facebook, allega il file o scrivi l’update e dì quando. Un messaggio può mettere in coda una serie quotidiana. Prima conferma la card.",
        },
        {
          q: "Posso pubblicare su Facebook e Instagram insieme?",
          a: "Sì. Indica entrambe le reti nello stesso messaggio quando foto o video stanno su entrambe. Ogni rete può avere la sua didascalia, se la chiedi.",
        },
        {
          q: "Questo gestisce anche le ads Facebook?",
          a: "Post organici e ads sono separati. Dì l’obiettivo della campagna quando vuoi reach a pagamento su Meta. La spesa va a Meta, non a posty.now.",
        },
      ],
    },
    fr: {
      metaTitle: "Programmez posts et Reels Facebook | posty.now",
      metaDescription:
        "Planifiez posts et Reels sur votre Page Facebook depuis un chat. L’IA rédige la légende, choisit le meilleur créneau et peut mettre un mois de contenu en file.",
      kicker: "Facebook",
      title: "Programmez vos posts Facebook en un message",
      subtitle:
        "Parlez à l’assistant comme à un collègue. posty.now rédige la légende, publie sur votre Page Facebook et peut porter la même idée sur Instagram dans le même souffle.",
      features: [
        {
          title: "Posts de Page et Reels",
          body: "Photos, vidéo et Reels sur la Page connectée. Vous confirmez la carte ; rien n’est public avant.",
        },
        {
          title: "Instagram dans la même commande",
          body: "Facebook et Instagram partent souvent ensemble. Nommez les deux réseaux dans un message quand le visuel tient sur les deux.",
        },
        {
          title: "Pubs quand le post doit aller plus loin",
          body: "Le post organique et la campagne payante restent séparés. Dites l’objectif si vous voulez des pubs Meta depuis le même studio.",
        },
      ],
      batchTitle: "Un mois sur la Page, sans vivre dans Ads Manager",
      batchBody:
        "Jusqu’à 50 fichiers, un par jour, au meilleur créneau Facebook — ou à l’heure que vous nommez. Modifiez la légende de lundi après planification. Boostez plus tard si le post le mérite.",
      examplesTitle: "Vous pouvez dire",
      examples: [
        "Publie ça sur la Page Facebook maintenant, avec une légende courte.",
        "À partir de demain, un post Facebook par jour pendant 30 jours, à la meilleure heure.",
        "La même photo sur Facebook et Instagram, demain à 10h.",
      ],
      steps: [
        { title: "Connectez la Page Facebook", body: "Une Page, pas seulement un profil perso. Une autorisation couvre la publication." },
        { title: "Envoyez le travail", body: "Photo, vidéo ou texte. Dites si Instagram doit le prendre aussi." },
        { title: "Lisez la carte", body: "Réseaux, légende et heure, avant que ce soit en ligne." },
        { title: "Confirmez", body: "Ça publie ou attend dans le calendrier. Les pubs restent une demande à part." },
      ],
      faqs: [
        {
          q: "Comment programmer des posts Facebook ?",
          a: "Connectez votre Page Facebook, joignez le fichier ou écrivez la mise à jour et dites quand. Un message peut mettre une série quotidienne en file. Confirmez d’abord la carte.",
        },
        {
          q: "Puis-je publier sur Facebook et Instagram ensemble ?",
          a: "Oui. Nommez les deux réseaux dans le même message quand la photo ou la vidéo tient sur les deux. Chaque réseau peut avoir sa légende si vous la demandez.",
        },
        {
          q: "Est-ce que ça gère aussi les pubs Facebook ?",
          a: "Posts organiques et pubs sont séparés. Dites l’objectif de campagne quand vous voulez de la portée payante sur Meta. Le budget pub va à Meta, pas à posty.now.",
        },
      ],
    },
    es: {
      metaTitle: "Programa posts y Reels de Facebook | posty.now",
      metaDescription:
        "Planifica posts y Reels en tu Página de Facebook desde un chat. La IA escribe el pie, elige la mejor hora y puede poner en cola un mes de contenido.",
      kicker: "Facebook",
      title: "Programa publicaciones de Facebook con un mensaje",
      subtitle:
        "Habla con el asistente como con un colega. posty.now escribe el pie, publica en tu Página de Facebook y puede llevar la misma idea a Instagram en el mismo aliento.",
      features: [
        {
          title: "Posts de Página y Reels",
          body: "Fotos, vídeo y Reels en la Página conectada. Confirmas la tarjeta; nada es público antes.",
        },
        {
          title: "Instagram en el mismo comando",
          body: "Facebook e Instagram salen a menudo juntos. Nombra ambas redes en un mensaje cuando el material sirve en las dos.",
        },
        {
          title: "Anuncios cuando el post debe viajar",
          body: "El post orgánico y la campaña de pago siguen separados. Di el objetivo si quieres anuncios Meta desde el mismo estudio.",
        },
      ],
      batchTitle: "Un mes en la Página, sin vivir en Ads Manager",
      batchBody:
        "Hasta 50 archivos, uno al día, a la mejor hora para Facebook — o a la hora que indiques. Edita el pie del lunes después de programarlo. Haz boost más tarde si el post lo merece.",
      examplesTitle: "Puedes decir",
      examples: [
        "Publica esto en la Página de Facebook ahora, con un pie corto.",
        "Desde mañana, una publicación de Facebook al día durante 30 días, a la mejor hora.",
        "La misma foto en Facebook e Instagram, mañana a las 10.",
      ],
      steps: [
        { title: "Conecta la Página de Facebook", body: "Una Página, no solo un perfil personal. Una autorización cubre la publicación." },
        { title: "Envía el trabajo", body: "Foto, vídeo o texto. Di si Instagram también debe llevarlo." },
        { title: "Lee la tarjeta", body: "Redes, pie y hora, antes de que salga en vivo." },
        { title: "Confirma", body: "Publica o espera en el calendario. Los anuncios siguen siendo una petición aparte." },
      ],
      faqs: [
        {
          q: "¿Cómo programo publicaciones en Facebook?",
          a: "Conecta tu Página de Facebook, adjunta el archivo o escribe la actualización y di cuándo. Un mensaje puede poner en cola una serie diaria. Confirma primero la tarjeta.",
        },
        {
          q: "¿Puedo publicar en Facebook e Instagram a la vez?",
          a: "Sí. Nombra ambas redes en el mismo mensaje cuando la foto o el vídeo sirve en las dos. Cada red puede tener su propio pie si lo pides.",
        },
        {
          q: "¿Esto también gestiona anuncios de Facebook?",
          a: "Los posts orgánicos y los anuncios van aparte. Di el objetivo de la campaña cuando quieras alcance de pago en Meta. El gasto va a Meta, no a posty.now.",
        },
      ],
    },
  },
};

export function isPlatformLandingSlug(value: string): value is PlatformLandingSlug {
  return (PLATFORM_LANDING_SLUGS as readonly string[]).includes(value);
}

export function getPlatformLanding(slug: string, locale: string): PlatformLandingCopy | null {
  if (!isPlatformLandingSlug(slug)) return null;
  return pickLocale(PAGES[slug], locale);
}
