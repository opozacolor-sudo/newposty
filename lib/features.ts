export const FEATURE_SLUGS = ["assistant", "voice", "publish", "analytics", "ads", "clients"] as const;

export type FeatureSlug = (typeof FEATURE_SLUGS)[number];
export type FeatureIcon = "sparkles" | "mic" | "send" | "chart" | "megaphone" | "users";
export type FeatureRail = "posts" | "ads" | null;

export type FeatureCopy = {
  navTitle: string;
  navBody: string;
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

export type FeaturePage = {
  slug: FeatureSlug;
  icon: FeatureIcon;
  rail: FeatureRail;
  hero: string;
  detail: string;
  en: FeatureCopy;
  ro: FeatureCopy;
};

export const FEATURES: FeaturePage[] = [
  {
    slug: "assistant",
    icon: "sparkles",
    rail: null,
    hero: "/features/assistant-hero.png",
    detail: "/features/assistant-detail.png",
    en: {
      navTitle: "AI assistant",
      navBody: "Ask in plain language. Posty writes, plans, and publishes.",
      metaTitle: "AI assistant — posty.now",
      metaDescription:
        "The posty.now assistant writes captions, keeps your brand voice, and turns one message into a post or a month of content.",
      kicker: "Features",
      title: "Talk to it like a colleague.",
      subtitle:
        "The assistant is the studio. You ask for an idea, a caption, a publish, a schedule, or a month of posts. No special commands. If you do not name a network, it asks — it does not guess.",
      features: [
        {
          title: "Ideas, without posting",
          body: "Ask for options and you get one to three drafts. Nothing goes live until you say publish or schedule.",
        },
        {
          title: "Your words stay your words",
          body: "If you already have the campaign line, paste or dictate it. Posty uses it as-is. It only rewrites when you ask.",
        },
        {
          title: "A brand voice it can hold",
          body: "“Warm bakery, no emoji, no slang.” It keeps that in the conversation so the next captions stay on tone.",
        },
      ],
      batchTitle: "One message, one clear job",
      batchBody:
        "“Publish this reel now on Instagram and TikTok, and put it on an Instagram Story tomorrow at 9” fits in a single message. A Friday promo mixed with 20 monthly photos does not — split those, and the plan stays clean. Attach up to 30 photos or videos, 100 MB each. The order you pick is the order of the series.",
      examplesTitle: "You can say",
      examples: [
        "Give me three Instagram captions for a café on a rainy Monday.",
        "Write a short caption and five hashtags, warm tone.",
        "We are a photo studio. Voice: clear, no superlatives. Remember that.",
      ],
      steps: [
        { title: "Connect accounts first", body: "Captions work immediately. Publishing and analytics need the networks connected." },
        { title: "Say the job", body: "Networks, timing, and whether you want a caption. Romanian or English, as you would text a person." },
        { title: "Attach the files", body: "Wait until they finish uploading, then send. A new chat clears the thread when you change subject." },
        { title: "Confirm", body: "You see the plan before anything publishes." },
      ],
      faqs: [
        {
          q: "Will it post if I only asked for ideas?",
          a: "No. Ideas stay as drafts. Publishing happens when you ask to publish or schedule, and you confirm.",
        },
        {
          q: "What if I send a photo and only say “post it now”?",
          a: "It publishes without inventing a caption, and it does not reuse an old one from the chat.",
        },
        {
          q: "Does it remember the brand voice forever?",
          a: "Inside that conversation. A new chat starts clean, which is what you want when the subject changes.",
        },
      ],
    },
    ro: {
      navTitle: "Asistent AI",
      navBody: "Ceri pe limba ta. Posty scrie, planifică și publică.",
      metaTitle: "Asistent AI — posty.now",
      metaDescription:
        "Asistentul posty.now scrie caption-uri, ține vocea de brand și transformă un mesaj într-o postare sau într-o lună de conținut.",
      kicker: "Funcții",
      title: "Vorbești cu el ca cu un coleg.",
      subtitle:
        "Asistentul e studio-ul. Ceri o idee, un text, o publicare, o programare sau o lună de postări. Fără comenzi speciale. Dacă nu spui rețeaua, te întreabă — nu ghicește.",
      features: [
        {
          title: "Idei, fără să posteze",
          body: "Ceri variante și primești una până la trei. Nu iese nimic live până spui publică sau programează.",
        },
        {
          title: "Textul tău rămâne al tău",
          body: "Dacă ai deja fraza de campanie, o lipești sau o dictezi. Posty o folosește ca atare. Rescrie doar când ceri.",
        },
        {
          title: "O voce de brand pe care o ține",
          body: "„Brutărie caldă, fără emoji, fără slang.” O ține în conversație, ca următoarele texte să rămână pe ton.",
        },
      ],
      batchTitle: "Un mesaj, o treabă clară",
      batchBody:
        "„Publică reel-ul acum pe Instagram și TikTok, iar mâine la 9 pune-l story pe Instagram” încape într-un mesaj. O promoție de vineri amestecată cu 20 de poze de lună nu — le separi și planul rămâne curat. Atașezi până la 30 de poze sau video, 100 MB fiecare. Ordinea din picker e ordinea seriei.",
      examplesTitle: "Poți spune",
      examples: [
        "Dă-mi trei texte de Instagram pentru o cafenea într-o luni ploioasă.",
        "Fă-i o descriere scurtă, cu 5 hashtag-uri, ton cald.",
        "Suntem un studio foto. Voce: clară, fără superlative. Ține minte.",
      ],
      steps: [
        { title: "Întâi conectezi conturile", body: "Textele merg imediat. Publicarea și analizele au nevoie de rețele conectate." },
        { title: "Spui treaba", body: "Rețele, moment și dacă vrei caption. Română sau engleză, ca unui om." },
        { title: "Atașezi fișierele", body: "Aștepți să se încarce, apoi trimiți. Chat nou golește firul când schimbi subiectul." },
        { title: "Confirmi", body: "Vezi planul înainte să publice ceva." },
      ],
      faqs: [
        {
          q: "Postează dacă am cerut doar idei?",
          a: "Nu. Ideile rămân ciorne. Publicarea se întâmplă când ceri să publice sau să programeze, și confirmi.",
        },
        {
          q: "Dacă trimit o poză și spun doar „public-o acum”?",
          a: "Publică fără să inventeze un caption și nu reciclează unul vechi din chat.",
        },
        {
          q: "Ține minte vocea de brand mereu?",
          a: "În conversația aia. Un chat nou pornește curat, exact când schimbi subiectul.",
        },
      ],
    },
  },
  {
    slug: "voice",
    icon: "mic",
    rail: null,
    hero: "/features/voice-hero.png",
    detail: "/features/voice-detail.png",
    en: {
      navTitle: "Voice",
      navBody: "Dictate the brief. Posty writes it down.",
      metaTitle: "Voice dictation — posty.now",
      metaDescription:
        "Press the mic, say the networks, the day, and the tone. posty.now turns speech into the instruction, in Romanian or English.",
      kicker: "Features",
      title: "Say the whole brief in one breath.",
      subtitle:
        "The microphone next to attachments is how a long command should feel. Press, talk, watch the text appear, fix a word if you want, send. Useful on a phone, with 30 files selected, or when you would rather not type.",
      features: [
        {
          title: "It keeps listening",
          body: "While the mic is on, you can pause and continue. Press it again to stop, then send.",
        },
        {
          title: "Romanian or English",
          body: "Dictate in either. If a phrase comes out wrong, edit the box. You do not start over. Attachments stay.",
        },
        {
          title: "Chrome or Edge",
          body: "The browser asks for the microphone the first time. Allow it. If you blocked it, the lock in the address bar is where you turn it back on.",
        },
      ],
      batchTitle: "A month of posts, spoken",
      batchBody:
        "Networks, the day, “best time” or a clock time, caption or no caption, the same photo everywhere or one each. The fuller the sentence, the cleaner the confirmation.",
      examplesTitle: "You can say",
      examples: [
        "Starting tomorrow, one a day, on Instagram, TikTok, and Facebook, at the best time, no caption.",
        "Schedule this photo Friday at 10. Autumn promo. Instagram and Facebook only, short sales line.",
      ],
      steps: [
        { title: "Allow the mic", body: "First time only. After that it is one press." },
        { title: "Talk", body: "Networks, when, and what the post should say — or that it should say nothing." },
        { title: "Skim the text", body: "Correct a name or a time in the box." },
        { title: "Send", body: "The assistant treats it like a typed message and shows the plan to confirm." },
      ],
      faqs: [
        {
          q: "Nothing appears while I talk?",
          a: "Almost always the microphone permission, not a broken mic. Chrome, the lock icon, Microphone, Allow, then reload.",
        },
        {
          q: "Can I dictate and still attach photos?",
          a: "Yes. Files stay attached. Voice fills in the instruction.",
        },
        {
          q: "Does voice publish by itself?",
          a: "No. It becomes the message. You still confirm before anything goes live.",
        },
      ],
    },
    ro: {
      navTitle: "Voce",
      navBody: "Dictezi brief-ul. Posty îl scrie.",
      metaTitle: "Dictare vocală — posty.now",
      metaDescription:
        "Apeși microfonul și spui rețelele, ziua și tonul. posty.now transformă vorbirea în instrucțiune, în română sau engleză.",
      kicker: "Funcții",
      title: "Spui tot brief-ul dintr-o suflare.",
      subtitle:
        "Microfonul de lângă atașamente e felul în care ar trebui să se simtă o comandă lungă. Apeși, vorbești, vezi textul, corectezi un cuvânt dacă vrei, trimiți. Pe telefon, cu 30 de fișiere selectate, sau când nu ai chef să tastezi.",
      features: [
        {
          title: "Ascultă în continuare",
          body: "Cât microfonul e pornit, poți face o pauză și relua. Apeși din nou ca să oprești, apoi trimiți.",
        },
        {
          title: "Română sau engleză",
          body: "Dictezi în oricare. Dacă o frază iese prost, o editezi în casetă. Nu o iei de la capăt. Atașamentele rămân.",
        },
        {
          title: "Chrome sau Edge",
          body: "Browserul cere microfonul la prima folosire. Dai Allow. Dacă l-ai blocat, lacătul din bara de adresă îl redeschide.",
        },
      ],
      batchTitle: "O lună de postări, spusă",
      batchBody:
        "Rețelele, ziua, „cea mai bună oră” sau o oră fixă, cu caption sau fără, aceeași poză peste tot sau câte una. Cu cât fraza e mai completă, cu atât confirmarea iese mai curată.",
      examplesTitle: "Poți spune",
      examples: [
        "Începând de mâine, câte una pe zi, pe Instagram, TikTok și Facebook, la cea mai bună oră, fără descriere.",
        "Programează poza asta vineri la 10, promoția de toamnă, doar pe Instagram și Facebook, cu un text scurt de vânzare.",
      ],
      steps: [
        { title: "Permiți microfonul", body: "Doar prima dată. După aia e o apăsare." },
        { title: "Vorbești", body: "Rețele, când și ce ar trebui să spună postarea — sau că nu trebuie să spună nimic." },
        { title: "Arunci un ochi pe text", body: "Corectezi un nume sau o oră în casetă." },
        { title: "Trimiți", body: "Asistentul o tratează ca pe un mesaj scris și îți arată planul de confirmat." },
      ],
      faqs: [
        {
          q: "Nu apare nimic cât vorbesc?",
          a: "Aproape mereu e permisiunea de microfon, nu microfonul stricat. Chrome, lacăt, Microfon, Allow, apoi reîncarci.",
        },
        {
          q: "Pot dicta și să am poze atașate?",
          a: "Da. Fișierele rămân. Vocea completează instrucțiunea.",
        },
        {
          q: "Vocea publică singură?",
          a: "Nu. Devine mesajul. Confirmi înainte să iasă ceva live.",
        },
      ],
    },
  },
  {
    slug: "publish",
    icon: "send",
    rail: "posts",
    hero: "/features/publish-hero.png",
    detail: "/features/publish-detail.png",
    en: {
      navTitle: "Publish",
      navBody: "Go live now, or queue up to 30 days.",
      metaTitle: "Publish and schedule — posty.now",
      metaDescription:
        "Publish now or schedule a daily series. posty.now picks a peak hour per network, and an exact time always wins.",
      kicker: "Features",
      title: "Now, or one a day for a month.",
      subtitle:
        "Name the networks. Confirm the card. It is not live until you see the green check on that network. “Publishing now” on TikTok means it is still processing — wait for the check.",
      features: [
        {
          title: "A clock time, or the best hour",
          body: "Say Friday at 19:00 and that is the slot. Say “best time” and Posty uses a researched peak hour for that platform. An explicit time always wins.",
        },
        {
          title: "Everywhere means the accounts you connected",
          body: "“On all networks” is every posting account, and you can exclude one: everywhere except LinkedIn.",
        },
        {
          title: "The format follows the file",
          body: "Instagram photos go to Feed. Video can be a Reel. TikTok takes video and photo carousels. YouTube is video. You can still ask for a Story.",
        },
      ],
      batchTitle: "Thirty files, in the order you picked them",
      batchBody:
        "Starting tomorrow, one a day, on each network, at the best hour. The picker order is the series order. You can cancel tomorrow’s TikTok, move Friday’s Instagram to 19:00, or change Monday’s caption after it is scheduled.",
      examplesTitle: "You can say",
      examples: [
        "Publish this video now on Instagram as a Reel and on TikTok.",
        "Starting tomorrow, one a day, on every network, at the best time.",
        "Move Friday’s Instagram post to 19:00.",
      ],
      steps: [
        { title: "Attach what the network needs", body: "Photo or video for Instagram, TikTok, YouTube, Pinterest. Text can be enough elsewhere." },
        { title: "Name when", body: "Now, a clock time, or the best hour." },
        { title: "Read the card", body: "Networks, caption, and time are in front of you." },
        { title: "Confirm", body: "Then it publishes or sits on the calendar. You can still edit it later." },
      ],
      faqs: [
        {
          q: "Is a scheduled post already public?",
          a: "No. It waits for its time. You can cancel, move, or rewrite it before then.",
        },
        {
          q: "Why is TikTok still saying it is publishing?",
          a: "TikTok processes after you confirm. The green check is the moment it is actually out.",
        },
        {
          q: "Can one command cover a month?",
          a: "Yes. Up to 30 files, posted day by day, across the networks you named.",
        },
      ],
    },
    ro: {
      navTitle: "Publică",
      navBody: "Live acum, sau până la 30 de zile în coadă.",
      metaTitle: "Publicare și programare — posty.now",
      metaDescription:
        "Publici acum sau programezi o serie zilnică. posty.now alege o oră de vârf pe rețea, iar o oră exactă câștigă mereu.",
      kicker: "Funcții",
      title: "Acum, sau câte una pe zi timp de o lună.",
      subtitle:
        "Spui rețelele. Confirmi cardul. Nu e live până vezi bifa verde pe rețeaua aia. „Se publică acum” la TikTok înseamnă că încă procesează — aștepți bifa.",
      features: [
        {
          title: "O oră fixă, sau cea mai bună",
          body: "Spui vineri la 19:00 și ăla e intervalul. Spui „cea mai bună oră” și Posty folosește o oră de vârf din research pentru platforma aia. O oră spusă explicit câștigă mereu.",
        },
        {
          title: "Peste tot înseamnă conturile conectate",
          body: "„Pe toate rețelele” sunt toate conturile de postări, și poți exclude una: peste tot, în afară de LinkedIn.",
        },
        {
          title: "Formatul urmează fișierul",
          body: "Pozele de Instagram merg în Feed. Clipul poate fi Reel. TikTok primește video și carusel de poze. YouTube e video. Poți cere și Story.",
        },
      ],
      batchTitle: "Treizeci de fișiere, în ordinea în care le-ai ales",
      batchBody:
        "De mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră. Ordinea din picker e ordinea seriei. Poți anula TikTok-ul de mâine, muta Instagramul de vineri la 19:00 sau schimba textul de luni după ce e programat.",
      examplesTitle: "Poți spune",
      examples: [
        "Publică video-ul ăsta acum pe Instagram ca reel și pe TikTok.",
        "Începând de mâine, câte una pe zi, pe toate rețelele, la cea mai bună oră.",
        "Mută postarea de vineri de pe Instagram la 19:00.",
      ],
      steps: [
        { title: "Atașezi ce cere rețeaua", body: "Poză sau video pentru Instagram, TikTok, YouTube, Pinterest. În altă parte poate ajunge textul." },
        { title: "Spui când", body: "Acum, o oră fixă sau cea mai bună oră." },
        { title: "Citești cardul", body: "Rețele, caption și oră sunt în fața ta." },
        { title: "Confirmi", body: "Apoi publică sau stă în calendar. Îl poți edita și după." },
      ],
      faqs: [
        {
          q: "O postare programată e deja publică?",
          a: "Nu. Așteaptă ora ei. Până atunci o poți anula, muta sau rescrie.",
        },
        {
          q: "De ce TikTok încă zice că se publică?",
          a: "TikTok procesează după confirmare. Bifa verde e momentul în care chiar a ieșit.",
        },
        {
          q: "O comandă poate acoperi o lună?",
          a: "Da. Până la 30 de fișiere, zi de zi, pe rețelele pe care le-ai numit.",
        },
      ],
    },
  },
  {
    slug: "analytics",
    icon: "chart",
    rail: "posts",
    hero: "/features/analytics-hero.png",
    detail: "/features/analytics-detail.png",
    en: {
      navTitle: "Analytics",
      navBody: "See what the posts did, separate from what the ads spent.",
      metaTitle: "Analytics — posty.now",
      metaDescription:
        "Post stats and ad stats live apart in posty.now: reach and engagement on one side, spend and clicks on the other.",
      kicker: "Features",
      title: "Organic on one side. Spend on the other.",
      subtitle:
        "Statistics → Posts is each network as a card: posts over 30 days, engagement, followers. Open it for charts, a custom range, top posts, and comments where that network provides them. Ad spend is not in there.",
      features: [
        {
          title: "A full card, where the network allows it",
          body: "Connected networks show the picture they actually offer. Bluesky and Reddit are thinner: likes, comments, shares — no impressions.",
        },
        {
          title: "Ads have their own page",
          body: "Statistics → Ads: campaigns, spend, impressions, clicks, CTR, conversions, top campaigns, 7 or 30 days or a custom range. An empty card means no ad account is connected.",
        },
        {
          title: "A short weekly loop",
          body: "Once a week, look at what caught organically and what the ads cost. Then tell the assistant what to change.",
        },
      ],
      batchTitle: "Daily, not a live ticker",
      batchBody:
        "The posts dashboard is a daily view, not an hourly one. It is enough to see what landed. If you already know your people are up at night, name that hour when you schedule — the clock you set still wins over the suggested peak.",
      examplesTitle: "What you open",
      examples: [
        "Posts: 30-day cards, engagement, followers, top posts.",
        "Ads: spend, impressions, clicks, CTR, conversions.",
        "A custom range when you want this month against the last one.",
      ],
      steps: [
        { title: "Connect the account", body: "No network, no card. No ad account, an empty ads card — that is not a bug." },
        { title: "Read posts first", body: "What people actually engaged with." },
        { title: "Read ads second", body: "What you paid for, kept separate from a Reel that simply did well." },
        { title: "Adjust in chat", body: "Change the series, or prepare a new ad creative on its own date." },
      ],
      faqs: [
        {
          q: "Why are Bluesky or Reddit numbers smaller?",
          a: "Those networks do not hand over impressions. You still see likes, comments, and shares.",
        },
        {
          q: "Can I tell a good Reel from a good ad?",
          a: "Yes, because they are different screens. Likes and a healthy CTR are different wins.",
        },
        {
          q: "How fresh is it?",
          a: "Posts are a daily picture. Ad detail can be read over 7 days, 30 days, or a range you pick.",
        },
      ],
    },
    ro: {
      navTitle: "Analize",
      navBody: "Vezi ce au făcut postările, separat de ce au cheltuit reclamele.",
      metaTitle: "Analize — posty.now",
      metaDescription:
        "Statisticile de postări și cele de reclame stau separat în posty.now: reach și engagement într-o parte, cheltuieli și clickuri în cealaltă.",
      kicker: "Funcții",
      title: "Organicul într-o parte. Banii în cealaltă.",
      subtitle:
        "Statistică → Postări e fiecare rețea ca un card: postări pe 30 de zile, engagement, urmăritori. Deschizi cardul pentru grafice, interval, top postări și comentarii unde rețeaua le dă. Cheltuiala de ads nu e acolo.",
      features: [
        {
          title: "Card complet, cât permite rețeaua",
          body: "Rețelele conectate arată ce oferă de fapt. Bluesky și Reddit sunt mai subțiri: aprecieri, comentarii, distribuiri — fără afișări.",
        },
        {
          title: "Reclamele au pagina lor",
          body: "Statistică → Promovări: campanii, cheltuieli, impresii, clickuri, CTR, conversii, top campanii, 7 sau 30 de zile sau un interval ales. Un card gol înseamnă că nu e conectat un cont de ads.",
        },
        {
          title: "O rutină de o dată pe săptămână",
          body: "O dată pe săptămână te uiți la ce a prins organic și la ce au costat reclamele. Apoi îi spui asistentului ce schimbi.",
        },
      ],
      batchTitle: "Zilnic, nu un ticker live",
      batchBody:
        "Tabloul de postări e zilnic, nu din oră în oră. Ajunge ca să vezi ce a prins. Dacă știi că oamenii tăi sunt treji noaptea, spui ora aia la programare — ceasul pe care îl pui tot câștigă în fața orei sugerate.",
      examplesTitle: "Ce deschizi",
      examples: [
        "Postări: carduri pe 30 de zile, engagement, urmăritori, top postări.",
        "Promovări: cheltuieli, impresii, clickuri, CTR, conversii.",
        "Un interval ales când vrei luna asta față de luna trecută.",
      ],
      steps: [
        { title: "Conectezi contul", body: "Fără rețea, fără card. Fără cont de ads, cardul de promovări e gol — nu e bug." },
        { title: "Citești întâi postările", body: "Cu ce au interacționat oamenii de fapt." },
        { title: "Apoi reclamele", body: "Ce ai plătit, separat de un Reel care pur și simplu a mers bine." },
        { title: "Ajustezi în chat", body: "Schimbi seria sau pregătești un creativ nou de reclamă, pe data lui." },
      ],
      faqs: [
        {
          q: "De ce Bluesky sau Reddit au cifre mai mici?",
          a: "Rețelele astea nu dau afișări. Vezi în continuare aprecieri, comentarii și distribuiri.",
        },
        {
          q: "Pot deosebi un Reel bun de o reclamă bună?",
          a: "Da, pentru că sunt ecrane diferite. Like-urile și un CTR sănătos sunt victorii diferite.",
        },
        {
          q: "Cât de proaspete sunt?",
          a: "Postările sunt o imagine zilnică. Detaliul de ads se citește pe 7 zile, 30 de zile sau un interval ales.",
        },
      ],
    },
  },
  {
    slug: "ads",
    icon: "megaphone",
    rail: "ads",
    hero: "/features/ads-hero.png",
    detail: "/features/ads-detail.png",
    en: {
      navTitle: "Ads",
      navBody: "Describe the campaign. Posty sets it up on the ad account.",
      metaTitle: "Ads — posty.now",
      metaDescription:
        "Connect Meta, Google, LinkedIn, TikTok, Pinterest, or OpenAI ads and brief the campaign in chat. X Ads is coming soon.",
      kicker: "Features",
      title: "Say the offer. The ad account does the reach.",
      subtitle:
        "Posts are organic. Ads pay to be seen. They connect separately, under Accounts → Ads: Meta, Google, LinkedIn, TikTok, Pinterest, and OpenAI. X Ads is coming soon. An ad account does not publish into the feed.",
      features: [
        {
          title: "Boost, or a new campaign",
          body: "Some networks can put money behind a post you already made. Others want a standalone ad. The account card says which.",
        },
        {
          title: "The creative is its own job",
          body: "A promo for a specific date is uploaded on its own, with a clear brief. Mixed into 29 daily photos, it can land on the wrong day.",
        },
        {
          title: "You still approve it",
          body: "Nothing spends because a sentence was vague. You see the plan, then confirm.",
        },
      ],
      batchTitle: "What each network is actually for",
      batchBody:
        "Meta runs full campaigns and can boost an existing post, with custom and lookalike audiences. Google is Search and Display, not a boosted social post. LinkedIn covers image, video, carousel, and more, and can boost. TikTok is video campaigns and Spark Ads. Pinterest promotes Pins. OpenAI ads are static cards inside ChatGPT, image only, for eligible businesses in the US, Canada, Australia, and New Zealand.",
      examplesTitle: "You can say",
      examples: [
        "Promote this Instagram post for the weekend, people nearby, a small budget.",
        "New campaign for Friday’s offer. Meta only. I’ll attach the creative separately.",
        "Show me spend and CTR for the last 30 days.",
      ],
      steps: [
        { title: "Connect Ads, not just posts", body: "Instagram plus Meta Ads if you want both the feed and the paid campaign." },
        { title: "Brief it alone", body: "Offer, audience, date, budget idea. One message, not mixed into a content series." },
        { title: "Confirm", body: "Then it can run. Results sit under Statistics → Ads." },
        { title: "Read it next to the posts", body: "A liked Reel and a campaign with a good CTR are different decisions." },
      ],
      faqs: [
        {
          q: "Does connecting Facebook also connect ads?",
          a: "No. Posting accounts and ad accounts are separate connections.",
        },
        {
          q: "Can every network boost an existing post?",
          a: "Meta, LinkedIn, TikTok Spark Ads, and Pinterest can. Google and OpenAI do not boost a social post.",
        },
        {
          q: "Where do I see if it was worth it?",
          a: "Statistics → Ads: spend, impressions, clicks, CTR, conversions, and top campaigns.",
        },
      ],
    },
    ro: {
      navTitle: "Reclame",
      navBody: "Descrii campania. Posty o pune pe contul de ads.",
      metaTitle: "Reclame — posty.now",
      metaDescription:
        "Conectezi Meta, Google, LinkedIn, TikTok, Pinterest sau OpenAI Ads și dai brief-ul în chat. X Ads e în curând.",
      kicker: "Funcții",
      title: "Spui oferta. Contul de ads face reach-ul.",
      subtitle:
        "Postările sunt organice. Reclamele plătesc ca să fie văzute. Se conectează separat, la Conturi → Promovări: Meta, Google, LinkedIn, TikTok, Pinterest și OpenAI. X Ads e în curând. Un cont de ads nu publică în feed.",
      features: [
        {
          title: "Boost, sau o campanie nouă",
          body: "Unele rețele pot pune bani în spatele unei postări pe care o ai deja. Altele vor o reclamă de sine stătătoare. Cardul contului spune care.",
        },
        {
          title: "Creativul e o treabă separată",
          body: "O promoție pentru o dată anume se încarcă singură, cu instrucțiuni clare. Amestecată în 29 de poze zilnice, poate nimeri ziua greșită.",
        },
        {
          title: "Tot tu aprobi",
          body: "Nu se cheltuie pentru că o frază a fost vagă. Vezi planul, apoi confirmi.",
        },
      ],
      batchTitle: "La ce e fiecare rețea, de fapt",
      batchBody:
        "Meta face campanii complete și poate da boost unei postări existente, cu audiențe custom și lookalike. Google e Search și Display, nu un boost de postare socială. LinkedIn acoperă imagine, video, carusel și altele, și poate da boost. TikTok e campanii video și Spark Ads. Pinterest promovează Pinuri. Reclamele OpenAI sunt carduri statice în ChatGPT, doar imagine, pentru business-uri eligibile din SUA, Canada, Australia și Noua Zeelandă.",
      examplesTitle: "Poți spune",
      examples: [
        "Promovează postarea asta de Instagram pentru weekend, oameni din zonă, buget mic.",
        "Campanie nouă pentru oferta de vineri. Doar Meta. Creativul îl atașez separat.",
        "Arată-mi cheltuielile și CTR-ul pe ultimele 30 de zile.",
      ],
      steps: [
        { title: "Conectezi Promovări, nu doar postări", body: "Instagram plus Meta Ads dacă vrei și feed-ul, și campania plătită." },
        { title: "Brief separat", body: "Ofertă, audiență, dată, idee de buget. Un mesaj, nu amestecat într-o serie de conținut." },
        { title: "Confirmi", body: "Apoi poate rula. Rezultatele stau la Statistică → Promovări." },
        { title: "O citești lângă postări", body: "Un Reel cu like-uri și o campanie cu CTR bun sunt decizii diferite." },
      ],
      faqs: [
        {
          q: "Dacă conectez Facebook, conectez și ads?",
          a: "Nu. Conturile de postări și cele de ads sunt conexiuni separate.",
        },
        {
          q: "Orice rețea poate da boost unei postări?",
          a: "Meta, LinkedIn, TikTok Spark Ads și Pinterest pot. Google și OpenAI nu dau boost unei postări sociale.",
        },
        {
          q: "Unde văd dacă a meritat?",
          a: "Statistică → Promovări: cheltuieli, impresii, clickuri, CTR, conversii și top campanii.",
        },
      ],
    },
  },
  {
    slug: "clients",
    icon: "users",
    rail: null,
    hero: "/features/clients-hero.png",
    detail: "/features/clients-detail.png",
    en: {
      navTitle: "Clients",
      navBody: "One agency login. Each client’s networks stay apart.",
      metaTitle: "Clients — posty.now",
      metaDescription:
        "A Team studio in posty.now keeps each client’s accounts, chat, and posts in their own workspace.",
      kicker: "Features",
      title: "Switch the client. The studio switches with them.",
      subtitle:
        "Team is for an agency that posts for other people. You add clients by name. Connect, chat, schedule, ads, and stats follow the client you selected. This phase is one login — colleague invites are not in yet.",
      features: [
        {
          title: "Nothing leaks between brands",
          body: "A connected account belongs to one client. The same Instagram cannot sit on two clients, so a series cannot cross by accident.",
        },
        {
          title: "The month is theirs",
          body: "Up to 30 files, day by day, on that client’s networks. Captions and times are proposed for them, not copied from the previous brand.",
        },
        {
          title: "Ads stay on the same client",
          body: "The ad accounts you connect are part of the workspace you are in.",
        },
      ],
      batchTitle: "From an individual studio to a client list",
      batchBody:
        "If you already post for yourself, you can move to Team. The first client can be built from the accounts you already connected. After that, each new name is a clean workspace.",
      examplesTitle: "How you work",
      examples: [
        "Pick the client in the studio, then connect their Instagram and Meta Ads.",
        "Brief this month only for them: one a day, best time, their voice.",
        "Switch clients before the next brand. The chat does not follow you over.",
      ],
      steps: [
        { title: "Open Team", body: "At signup, or later from an individual studio." },
        { title: "Add the client", body: "A name is enough. No invite email in this phase." },
        { title: "Connect their accounts", body: "Posting and ads, only while that client is selected." },
        { title: "Work, then switch", body: "Schedule, publish, read stats. Change client when the next brand starts." },
      ],
      faqs: [
        {
          q: "Can my team log in with their own emails?",
          a: "Not yet. Team is one agency login and as many clients as you add.",
        },
        {
          q: "Can two clients share a TikTok?",
          a: "No. One connected account, one client.",
        },
        {
          q: "Do I have to start over to become an agency?",
          a: "No. An individual studio can upgrade, and the existing accounts can become the first client.",
        },
      ],
    },
    ro: {
      navTitle: "Clienți",
      navBody: "Un login de agenție. Rețelele fiecărui client stau separat.",
      metaTitle: "Clienți — posty.now",
      metaDescription:
        "Un studio Team în posty.now ține conturile, chat-ul și postările fiecărui client în spațiul lui.",
      kicker: "Funcții",
      title: "Schimbi clientul. Studio-ul se schimbă cu el.",
      subtitle:
        "Team e pentru o agenție care postează pentru alții. Adaugi clienții pe nume. Conectarea, chat-ul, programarea, reclamele și statisticile urmează clientul selectat. În faza asta e un singur login — invitațiile pentru colegi nu sunt încă.",
      features: [
        {
          title: "Nimic nu se scurge între branduri",
          body: "Un cont conectat ține de un client. Același Instagram nu poate sta la doi clienți, deci o serie nu sare din greșeală.",
        },
        {
          title: "Luna e a lor",
          body: "Până la 30 de fișiere, zi de zi, pe rețelele clientului ăluia. Caption-urile și orele sunt propuse pentru el, nu copiate de la brandul anterior.",
        },
        {
          title: "Reclamele rămân la același client",
          body: "Conturile de ads pe care le conectezi fac parte din workspace-ul în care ești.",
        },
      ],
      batchTitle: "De la un studio individual la o listă de clienți",
      batchBody:
        "Dacă postezi deja pentru tine, poți trece pe Team. Primul client poate fi construit din conturile pe care le-ai conectat. După aia, fiecare nume nou e un spațiu curat.",
      examplesTitle: "Cum lucrezi",
      examples: [
        "Alegi clientul în studio, apoi îi conectezi Instagramul și Meta Ads.",
        "Brief doar pentru el, luna asta: câte una pe zi, cea mai bună oră, vocea lui.",
        "Schimbi clientul înainte de următorul brand. Chat-ul nu trece cu tine.",
      ],
      steps: [
        { title: "Deschizi Team", body: "La înregistrare, sau mai târziu dintr-un studio individual." },
        { title: "Adaugi clientul", body: "Ajunge un nume. Fără email de invitație în faza asta." },
        { title: "Îi conectezi conturile", body: "Postări și ads, doar cât clientul ăla e selectat." },
        { title: "Lucrezi, apoi schimbi", body: "Programezi, publici, citești statistici. Schimbi clientul când începe următorul brand." },
      ],
      faqs: [
        {
          q: "Poate echipa să intre cu emailurile lor?",
          a: "Încă nu. Team e un login de agenție și clienții pe care îi adaugi.",
        },
        {
          q: "Pot doi clienți să împartă un TikTok?",
          a: "Nu. Un cont conectat, un client.",
        },
        {
          q: "Trebuie să o iau de la capăt ca să devin agenție?",
          a: "Nu. Un studio individual poate trece pe Team, iar conturile existente pot deveni primul client.",
        },
      ],
    },
  },
];

export function isFeatureSlug(value: string): value is FeatureSlug {
  return (FEATURE_SLUGS as readonly string[]).includes(value);
}

export function getFeature(slug: string) {
  return FEATURES.find((page) => page.slug === slug);
}
