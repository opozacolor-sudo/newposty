export type GuideTip = { title: string; body: string };
export type GuideExample = string;
export type GuideNetwork = {
  name: string;
  can: string;
  boost: string;
  audiences: string;
  stats: string;
  note?: string;
};

export type GuideSection = {
  id: string;
  title: string;
  lead?: string;
  body: string[];
  tips?: GuideTip[];
  examples?: GuideExample[];
  networks?: GuideNetwork[];
  featured?: "voice";
};

export type GuideDoc = {
  title: string;
  subtitle: string;
  toc: string;
  tipLabel: string;
  tryLabel: string;
  ctaTitle: string;
  ctaButton: string;
  downloadLabel: string;
  pdfHref: string;
  quoteStart: string;
  quoteEnd: string;
  networkLabels: {
    can: string;
    boost: string;
    audiences: string;
    stats: string;
  };
  sections: GuideSection[];
};

const RO: GuideDoc = {
  title: "Manual de utilizare",
  subtitle:
    "Tot ce poți face în posty.now: postări, promovări, statistici, programări și voce — pas cu pas, cu exemple și sfaturi.",
  toc: "Cuprins",
  tipLabel: "Sfat",
  tryLabel: "Spune-i asistentului",
  ctaTitle: "Gata să încerci?",
  ctaButton: "Deschide asistentul",
  downloadLabel: "Descarcă PDF",
  pdfHref: "/manual-posty-now-ro.pdf",
  quoteStart: "„",
  quoteEnd: "”",
  networkLabels: {
    can: "Poate crea",
    boost: "Boost",
    audiences: "Audiențe",
    stats: "Statistici",
  },
  sections: [
    {
      id: "start",
      title: "Ce este posty.now",
      body: [
        "posty.now este un studio cu asistent AI. Tu spui ce vrei — cu text sau cu voce — iar Posty redactează, programează și publică pe rețelele conectate. Nu sari între aplicații ca să pui aceeași poză pe Instagram, TikTok și Facebook.",
        "Alături de postări organice stau și promovările plătite. Conectezi conturile de ads, vezi campaniile, cheltuielile, impresiile, clickurile și conversiile într-un singur loc. Postările și reclamele sunt două lucruri diferite; studio-ul le ține pe amândouă, dar nu le amestecă.",
        "În stânga ai Asistentul, Statistică (Postări / Promovări) și Conturi (tot Postări / Promovări). Limba și ora locală sunt jos. Toate programările folosesc ceasul ăsta, nu ora din altă țară.",
      ],
      tips: [
        {
          title: "Începe cu conturile",
          body: "Asistentul poate scrie texte imediat. Ca să publice sau să-ți arate statistici, conectează întâi rețelele — postări și, dacă faci ads, promovări.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Conturi de postări",
      body: [
        "Mergi la Conturi → Postări. Aici leagă Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky și Reddit.",
        "Apasă Conectează, autorizează-ți contul, gata. Pe Facebook alegi pagina, pe LinkedIn poți alege profil sau pagină de companie, pe Pinterest board-ul, pe Google Business locația.",
        "Bluesky nu are login clasic: folosește un App Password (parolă de aplicație), nu parola obișnuită a contului. Dacă nu știi de unde o iei, butonul de ajutor de pe card te duce la instrucțiuni.",
        "Poți conecta mai multe conturi pe aceeași rețea. Ce e conectat aici e ce asistentul poate publica.",
      ],
      tips: [
        {
          title: "Nu e același lucru cu ads",
          body: "Instagram-ul de postări nu deschide automat Meta Ads. Promovările se conectează separat, la Conturi → Promovări.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Conturi de promovări (ads)",
      lead: "Postările aduc reach organic. Ads-urile plătesc ca să fie văzute. În posty.now ambele își au locul — dar se conectează separat.",
      body: [
        "Mergi la Conturi → Promovări. Aici leagă Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads și OpenAI Ads.",
        "Un cont de promovare nu publică poze în feed. El îți dă acces la campaniile plătite: ce rulează, cât cheltui, ce rezultate ai. Statisticile le vezi la Statistică → Promovări.",
        "X Ads cere mai întâi X conectat la Conturi → Postări, apoi conectezi X Ads. OpenAI Ads nu are fereastră de login: lipești o cheie API din ChatGPT Ads Manager. Reclamele OpenAI sunt carduri în ChatGPT (titlu, text, imagine, link), doar imagini statice, buget pe toată durata campaniei (minim 1 $), și eligibilitate de business — momentan SUA, Canada, Australia, Noua Zeelandă.",
      ],
      tips: [
        {
          title: "Organic + plătit pe Meta",
          body: "Dacă postezi pe Instagram/Facebook și vrei și campanii plătite, conectează ambele: Postări (Instagram, Facebook) și Promovări (Meta Ads). Unul fără celălalt îți taie jumătate din tablou.",
        },
        {
          title: "Creativul de campanie nu e un fișier din serie",
          body: "O reclamă sau o promoție pentru o dată anume se încarcă singură, cu instrucțiuni clare. Amestecată cu alte 29 de poze de conținut zilnic, poate intra pe ziua greșită.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "Ce suportă fiecare rețea de ads",
      body: [
        "Fiecare platformă de promovare lucrează altfel. Cardul din Conturi → Promovări îți arată ce poți crea, dacă poți da boost unei postări existente, ce audiențe ai și cât de complete sunt statisticile.",
        "Boost înseamnă să pui bani în spatele unui conținut care deja există (o postare, un Pin, un tweet). Campanie standalone înseamnă o reclamă nouă, gândită ca ads. Nu toate rețelele fac ambele.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Campanii complete: Campanie → Ad Set → Reclamă.",
          boost: "Da — poți promova postări organice existente.",
          audiences: "Custom și Lookalike.",
          stats: "Cheltuieli, impresii, reach, CTR, CPC, CPM, ROAS, conversii.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) și Display (Responsive Display Ads).",
          boost: "Nu se aplică — Google nu „boostuiește” o postare de social.",
          audiences: "Nu e targetare pe audiențe din Posty; Search și Display.",
          stats: "Rapoarte agregate complete.",
        },
        {
          name: "LinkedIn Ads",
          can: "Imagine, video, carusel, document, eveniment, text ad, conversation ads și altele.",
          boost: "Da.",
          audiences: "Liste de contacte/companii și retargeting — doar citire, nu creezi audiențe noi din Posty.",
          stats: "Cheltuieli, CPC, CPM, plus job title, seniority, industrie, mărime companie.",
        },
        {
          name: "TikTok Ads",
          can: "Campanii standalone video.",
          boost: "Spark Ads — promovezi conținut nativ TikTok.",
          audiences: "Custom și Lookalike.",
          stats: "Cheltuieli, views, CTR, CPM, aproape în timp real.",
        },
        {
          name: "Pinterest Ads",
          can: "Promoted Pins noi.",
          boost: "Da — poți promova Pinuri organice existente.",
          audiences: "De bază: demografic și țară.",
          stats: "Cheltuieli, saves, closeups, clicks.",
        },
        {
          name: "X Ads",
          can: "Promovezi tweet-uri existente sau campanii standalone (text până la 280 de caractere + card cu link).",
          boost: "Da.",
          audiences: "Locație și limbă. Listele de email sunt o opțiune avansată (minim 100 de utilizatori activi recent).",
          stats: "Cheltuieli, CPE, CPM, clickuri pe link.",
        },
        {
          name: "OpenAI Ads",
          can: "Carduri în ChatGPT Free/Go: titlu, text, imagine, URL. Fără video.",
          boost: "Nu se aplică.",
          audiences: "Doar locație (țară/regiune).",
          stats: "Impresii, clickuri, cheltuieli, zilnic.",
          note: "Buget doar pe toată durata campaniei, minim 1 $. Eligibilitate business și piețe: SUA, Canada, Australia, Noua Zeelandă.",
        },
      ],
      tips: [
        {
          title: "Unde lucrezi ads-urile",
          body: "Conectarea și citirea rezultatelor sunt în posty.now (Conturi → Promovări, Statistică → Promovări). Conținutul organic — poze, video, serii, promoții datate — îl lansezi din Asistent. Nu cere asistentului „cât am cheltuit pe Meta”; deschide Statistică → Promovări.",
        },
      ],
    },
    {
      id: "assistant",
      title: "Asistentul",
      body: [
        "Asistentul e inima studio-ului. Aici ceri idei, texte, publicare, programare, o lună de conținut sau o promoție pe o dată anume.",
        "Scrie în română, natural, ca unui coleg. Nu trebuie comenzi speciale. Spune rețelele, când vrei să iasă și dacă vrei text sau nu. Dacă nu spui pe ce rețea (și nu e o serie pe toate), Posty te întreabă — nu ghicește.",
        "Atașează până la 30 de poze sau video, maximum 100 MB fiecare. Ordinea în care le alegi e ordinea din serie. Așteaptă să se încarce (badge portocaliu), apoi trimite mesajul.",
        "Chat nou golește firul. Folosește-l când schimbi subiectul sau vrei să nu mai țină minte „nu mai întreba”.",
      ],
      examples: [
        "Dă-mi trei texte de Instagram pentru o cafenea într-o luni ploioasă.",
        "Publică asta acum pe Instagram și TikTok.",
        "Începând de mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră.",
      ],
      tips: [
        {
          title: "Un mesaj = o intenție clară",
          body: "„Publică reel-ul acum pe Instagram și TikTok, iar mâine la 9 pune-l story pe Instagram” merge într-un singur mesaj. Dacă amesteci o promoție de vineri cu 20 de poze de lună, nu mai e clar.",
        },
      ],
    },
    {
      id: "voice",
      title: "Dictare vocală",
      featured: "voice",
      lead: "Vorbește. Posty scrie. E cel mai rapid mod să dai o comandă lungă fără să tastezi.",
      body: [
        "Microfonul de lângă atașamente nu e un extra — e felul natural de a lucra în posty.now. Apeși, vorbești ca la un om, vezi textul cum apare, corectezi un cuvânt dacă vrei, și trimiți. Ideal când selectezi 30 de fișiere, când ești pe telefon, când descrii o campanie cu dată, rețele și ton, sau când pur și simplu nu ai chef să scrii.",
        "Funcționează cel mai bine în Chrome sau Edge. La prima folosire browserul cere microfonul: apasă Allow. Dacă ai apăsat greșit pe Block, deschide lacătul din bara de adresă, permite microfonul, reîncarcă pagina.",
        "Cât timp microfonul e portocaliu, Posty te ascultă continuu — poți face o pauză, poți relua. Placeholder-ul devine „Te ascult… vorbește acum”. Apeși din nou microfonul ca să oprești, apoi Trimite.",
        "Poți dicta în română. Dacă o frază iese ciudat, o editezi în casetă — nu trebuie să o iei de la capăt. Atașamentele rămân; vocea completează instrucțiunea.",
      ],
      examples: [
        "Începând de mâine, câte una pe zi, pe Instagram, TikTok și Facebook, la cea mai bună oră, fără descriere.",
        "Programează poza asta vineri la 10, e promoția de toamnă, doar pe Instagram și Facebook, cu un text scurt de vânzare.",
      ],
      tips: [
        {
          title: "Spune tot dintr-o suflare",
          body: "Rețelele, ziua, ora sau „cea mai bună oră”, dacă vrei caption sau nu, dacă e aceeași poză pe toate sau câte una pe rețea. Cu cât e fraza mai completă, cu atât confirmarea iese din prima.",
        },
        {
          title: "Niciun sunet în casetă?",
          body: "În aproape toate cazurile e permisiunea de microfon, nu microfonul stricat. Chrome → lacăt → Microfon → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Texte, idei, voce de brand",
      body: [
        "Dacă vrei doar inspirație, spune-o. Posty îți dă 1–3 variante și nu publică nimic.",
        "Descrierea se scrie doar dacă o ceri („fă-i o descriere”, „scrie un text”, „caption”). Dacă trimiți o poză și spui doar „publică pe Instagram acum”, iese fără text — nu reciclează un caption vechi din chat.",
        "Când dai tu textul, îl folosește exact. Dacă e prea lung pentru o rețea (de exemplu 280 de caractere pe X), îl taie la limită și îți spune.",
        "Poți spune cum vrei să sune brandul: „suntem o brutărie caldă, fără emoji, fără slang”. Posty ține minte vocea în conversație ca textele următoare să rămână pe ton.",
      ],
      examples: [
        "Fă-i o descriere scurtă, cu 5 hashtag-uri, ton cald.",
        "Suntem un studio foto. Voce: clară, fără superlative. Ține minte.",
      ],
      tips: [
        {
          title: "Caption-ul tău e lege",
          body: "Dacă ai deja textul de campanie, lipește-l sau dictă-l. Posty nu îl rescrie. Cere AI-ul doar când vrei variante.",
        },
      ],
    },
    {
      id: "publish",
      title: "Publică acum",
      body: [
        "Atașează media dacă rețeaua o cere (Instagram, TikTok, YouTube, Pinterest). Spune rețelele. Confirmă în card.",
        "„Pe toate rețelele”, „peste tot”, „everywhere” înseamnă toate conturile de postări conectate. Poți exclude: „peste tot, în afară de LinkedIn”.",
        "Nu e live până nu vezi bifa verde pe rețeaua aia. „Se publică acum” la TikTok înseamnă că încă procesează — nu e eroare. Așteaptă bifa.",
      ],
      examples: [
        "Publică video-ul ăsta acum pe Instagram ca reel și pe TikTok.",
        "Postează pe toate rețelele, în afară de Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Programează la o oră anume",
      body: [
        "Spune ziua și ora. Posty folosește ceasul din sidebar (ora ta locală), nu un fuso ascuns. „Mâine la 18:00” e 18:00 pe ceasul ăla.",
        "Poți combina: publică story acum pe Instagram și TikTok, și programează reel-ul mâine la 12:00 tot pe Instagram.",
      ],
      examples: [
        "Programează asta mâine la 18:00 pe TikTok și Instagram.",
        "Vineri 15:00 pe LinkedIn, textul ăsta, fără poză.",
      ],
      tips: [
        {
          title: "Verifică ceasul",
          body: "Dacă călătorești sau ai VPN, uită-te la Ora locală din stânga. Programările urmează ceasul din studio.",
        },
      ],
    },
    {
      id: "best-time",
      title: "Cea mai bună oră",
      body: [
        "Spune „la cea mai bună oră”, „ora optimă”, „peak time”. Posty nu inventează 18:00. Alege următoarea fereastră de vârf din research pe industrie (Sprout, Hootsuite, Later, Buffer), în fusul tău, ca proximare a audienței.",
        "Nu sunt statisticile tale personale — dashboard-ul de postări e pe zile, nu pe ore. Recomandarea e un start bun; dacă știi că publicul tău e noaptea, pune ora ta. Ora explicită câștigă întotdeauna.",
        "Fiecare rețea are alt ritm. Instagram în timpul săptămânii tinde spre ~11:00 (stories ~12:00), cu rezervă seara ~19:00. TikTok spre ~19:00. LinkedIn sare weekend-urile. Dacă programezi Instagram și TikTok la „cea mai bună oră”, pot ieși la ore diferite — e intenționat.",
      ],
      examples: [
        "Mâine la cea mai bună oră, pe Instagram și TikTok.",
        "Mută postarea de vineri la cea mai bună oră.",
      ],
    },
    {
      id: "series",
      title: "O lună de conținut: seria zilnică",
      body: [
        "Atașează până la 30 de fișiere, în ordinea în care vrei să iasă. Spune „începând de mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră”. Poți amesteca poze și video.",
        "Implicit e cross, nu copy-paste. În aceeași zi, fiecare rețea primește alt fișier. Facebook poate lua media 1, X media 2, TikTok media 3. Același material nu apare pe două rețele în aceeași zi. Pe parcursul lunii fișierele rotează, ca luna să rămână plină.",
        "Dacă vrei același fișier pe toate rețelele în ziua aia, trebuie să o spui: „același pe toate”. Altfel rămâne cross.",
        "TikTok și YouTube sar pozele — nu primesc foto. Video-urile da. În cardul de confirmare vezi, pe zile, ce rețea ce fișier ia. Seriile mari cer confirmare; nu sar peste card.",
      ],
      examples: [
        "Începând de mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră.",
        "Aceleași 10 video-uri, fiecare zi același fișier pe toate rețelele, la 19:00.",
      ],
      tips: [
        {
          title: "Ordinea din picker contează",
          body: "Fișierul 1 e ziua 1. Nu le băga aleatoriu dacă ai deja o ordine în cap. Poți scoate un atașament cu X înainte să trimiți.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Promoții, lansări, date anume",
      lead: "O campanie nu e o serie. O dată anume nu e „câte una pe zi”.",
      body: [
        "Dacă ai o promoție, o lansare, un Black Friday, un eveniment — încarcă materialul ăla singur. Spune clar când să iasă și pe ce rețele. Un fișier, o instrucțiune, o confirmare.",
        "Dacă pui creativul de campanie lângă alte 29 de poze de conținut zilnic, seria îl tratează ca pe încă o zi din lună. Poate ieși marți în loc de vineri, pe TikTok în loc de Facebook, sau amestecat cu un reel care n-are treabă cu oferta.",
        "Asta e valabil și când materialul e gândit pentru ads. Seria zilnică e pentru conținut organic în cascadă. Reclama, boost-ul, promoția cu deadline — separat, cu dată.",
      ],
      examples: [
        "Programează poza asta pe 15 septembrie la 10:00, Instagram și Facebook, e promoția de toamnă. Textul ăsta, exact.",
        "Publică video-ul de lansare vineri la 12:00 pe Instagram ca reel și pe TikTok. Nu e parte din serie.",
      ],
      tips: [
        {
          title: "Două joburi, două mesaje",
          body: "Întâi seria de 30 (conținutul lunii). Apoi un chat nou sau un mesaj nou, un singur fișier, promoția. Nu le lega în aceeași încărcare.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formate pe rețea",
      body: [
        "Reel există pe Instagram, nu pe TikTok. Story există pe Instagram (și Facebook), nu pe TikTok. „Postează pe Instagram reel și pe TikTok” = Reel pe Instagram + video normal pe TikTok.",
        "„Instagram ca story și pe TikTok” = Story pe Instagram + video TikTok. „Ca video pe Instagram și TikTok” = Instagram publică video-ul ca Reel automat, TikTok ca video.",
        "Spune formatul doar pe rețeaua care îl are. Nu cere reel pe YouTube sau story pe LinkedIn.",
        "Instagram, TikTok, YouTube, Pinterest cer media. LinkedIn, X, Threads, Bluesky, Facebook, Reddit pot și text. X taie la 280 de caractere. Nu combina imagine și video în același tweet.",
      ],
      examples: [
        "Video-ul ăsta: Instagram reel și TikTok, acum. Și mâine la 9:00, Instagram story.",
      ],
    },
    {
      id: "confirm",
      title: "Cardul de confirmare",
      body: [
        "Înainte să iasă ceva, vezi un card: rețele, oră, preview, pentru serii câte un slot pe zi. Confirmă sau Anulează / modifică.",
        "Poți bifa „Nu mai întreba în acest chat” dacă vrei viteză. Preferința e doar pe firul ăsta; Chat nou o resetează. Seriile mari tot cer ochi pe card — e prea ușor să programezi 30 de zile greșit.",
        "Dacă anulezi, trimiți o comandă nouă. Cardul de confirmare expiră în câteva ore; dacă ai lăsat tab-ul deschis peste noapte, fă comanda din nou.",
      ],
    },
    {
      id: "manage",
      title: "Anulează, reprogramează, editează",
      body: [
        "Pentru o postare programată din chat, poți spune să o anuleze, să o mute sau să schimbe textul. Identific-o după rețea, oră sau o bucată din caption.",
        "Reprogramarea poate fi la o oră nouă sau „la cea mai bună oră”.",
      ],
      examples: [
        "Anulează postarea de mâine de pe TikTok.",
        "Mută postarea de vineri de pe Instagram la 19:00.",
        "Schimbă textul postării de luni: …",
      ],
    },
    {
      id: "stats-posts",
      title: "Statistică: postări",
      body: [
        "Statistică → Postări. Fiecare rețea e un card: postări pe 30 de zile, engagement, urmăritori. Deschizi cardul pentru grafice, interval custom, top postări, comentarii unde există.",
        "Bluesky și Reddit dau statistici limitate (aprecieri, comentarii, distribuiri — fără afișări). Restul rețelelor conectate dau tabloul complet, în limita a ceea ce oferă fiecare.",
        "Aici vezi dacă conținutul organic prinde. Nu e locul pentru cheltuieli de ads.",
      ],
    },
    {
      id: "stats-ads",
      title: "Statistică: promovări",
      lead: "Aici se văd banii. Dacă nu e conectat un cont de ads, cardul e gol — nu e un bug.",
      body: [
        "Statistică → Promovări. Pe fiecare rețea de ads: număr de campanii (30 de zile), cheltuieli, impresii. În detaliu: clickuri, CTR, conversii, top campanii, interval de date (7 / 30 / custom).",
        "Folosește-l ca să vezi dacă o campanie merită continuată, nu ca să o confunzi cu o postare care a mers bine organic. Un reel cu multe like-uri și o campanie cu CTR bun sunt victorii diferite.",
        "Schimbă perioada din detaliu dacă vrei să compari o lună de sale cu luna precedentă. Dacă nu apar campanii, verifică Conturi → Promovări: contul e conectat și activ în perioada aleasă?",
      ],
      tips: [
        {
          title: "O rutină scurtă",
          body: "O dată pe săptămână: Statistică → Postări (ce a prins organic) și Statistică → Promovări (ce a costat și ce a adus). Apoi, în asistent, ajustezi seria sau pregătești un creativ nou — separat, cu dată, dacă e promoție.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Fraze care merg bine",
      body: [
        "Nu trebuie să memorezi comenzi. Astea sunt exemple care acoperă aproape tot ce poate face studio-ul.",
      ],
      examples: [
        "Dă-mi trei texte de Instagram pentru o brutărie, luni dimineața.",
        "Publică asta acum pe Instagram ca reel și pe TikTok.",
        "Programează mâine la 18:00 pe LinkedIn, textul ăsta.",
        "Mâine la cea mai bună oră, pe Instagram și TikTok.",
        "Începând de mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră.",
        "Același video pe toate rețelele, câte una pe zi, la 19:00.",
        "Programează poza asta pe 15 septembrie la 10:00, doar Instagram și Facebook — e promoția, nu e din serie.",
        "Pe toate rețelele, în afară de LinkedIn.",
        "Anulează postarea de mâine de pe TikTok.",
        "Mută postarea de vineri la cea mai bună oră.",
        "Fă-i o descriere, ton cald, fără emoji.",
        "Nu mai întreba confirmarea în chat-ul ăsta.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Dacă ceva nu merge",
      body: [
        "Dictarea nu scrie nimic: Chrome sau Edge, Allow pe microfon, lacătul din bara de adresă. Reîncarcă. Apoi microfonul din chat — trebuie să rămână portocaliu cât vorbești.",
        "„Se publică acum” pe TikTok: așteaptă. Procesarea nu e eroare. Bifa verde e semnalul.",
        "Nu publică: Conturi → Postări, rețeaua e conectată? Instagram/TikTok/YouTube/Pinterest au fișier atașat?",
        "Fișier respins: maximum 100 MB, maximum 30 odată. Pozele nu merg pe TikTok/YouTube în serie.",
        "Confirmarea a dispărut: a expirat. Trimite comanda din nou.",
        "Statistici ads goale: Conturi → Promovări, conectează rețeaua, apoi Statistică → Promovări. Un Instagram de postări nu umple tabloul de ads.",
        "Limba greșită: comutatorul de limbă e jos în sidebar, lângă ceas.",
      ],
    },
  ],
};

const EN: GuideDoc = {
  title: "User guide",
  subtitle:
    "Everything you can do in posty.now: posts, ads, analytics, scheduling, and voice — step by step, with examples and tips.",
  toc: "Contents",
  tipLabel: "Tip",
  tryLabel: "Try saying",
  ctaTitle: "Ready to try it?",
  ctaButton: "Open the assistant",
  downloadLabel: "Download PDF",
  pdfHref: "/manual-posty-now-en.pdf",
  quoteStart: "“",
  quoteEnd: "”",
  networkLabels: {
    can: "Can create",
    boost: "Boost",
    audiences: "Audiences",
    stats: "Analytics",
  },
  sections: [
    {
      id: "start",
      title: "What posty.now is",
      body: [
        "posty.now is a studio with an AI assistant. You say what you want — by typing or by speaking — and Posty drafts, schedules, and publishes on your connected networks. You do not bounce between apps to put the same photo on Instagram, TikTok, and Facebook.",
        "Paid ads sit next to organic posts. You connect ads accounts and see campaigns, spend, impressions, clicks, and conversions in one place. Posts and ads are different jobs; the studio holds both, and does not mix them up.",
        "On the left: Assistant, Statistics (Posts / Ads), and Accounts (Posts / Ads again). Language and local time are at the bottom. Every schedule follows that clock, not some other timezone.",
      ],
      tips: [
        {
          title: "Start with accounts",
          body: "The assistant can write captions immediately. To publish or to show analytics, connect networks first — posting accounts, and ads accounts if you run paid campaigns.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Posting accounts",
      body: [
        "Go to Accounts → Posts. Connect Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky, and Reddit.",
        "Hit Connect, authorize, done. Facebook asks for a Page, LinkedIn can be a profile or a company page, Pinterest a board, Google Business a location.",
        "Bluesky does not use a normal login: it needs an App Password, not your regular account password. The help link on the card explains how to create one.",
        "You can connect more than one account on the same network. Whatever is connected here is what the assistant can publish to.",
      ],
      tips: [
        {
          title: "This is not ads",
          body: "Connecting Instagram for posting does not open Meta Ads. Paid accounts live under Accounts → Ads.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Ads accounts",
      lead: "Posts earn organic reach. Ads pay to be seen. In posty.now both belong — they just connect separately.",
      body: [
        "Go to Accounts → Ads. Connect Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads, and OpenAI Ads.",
        "An ads account does not publish to the feed. It unlocks paid campaigns: what is running, what you spend, what you get back. You read that under Statistics → Ads.",
        "X Ads needs X connected on Accounts → Posts first, then you connect X Ads. OpenAI Ads has no login popup: you paste an API key from ChatGPT Ads Manager. Those ads are cards inside ChatGPT (title, text, image, link), static images only, lifetime budget (minimum $1), and business eligibility — currently the United States, Canada, Australia, and New Zealand.",
      ],
      tips: [
        {
          title: "Organic + paid on Meta",
          body: "If you post to Instagram/Facebook and also run paid campaigns, connect both: Posts (Instagram, Facebook) and Ads (Meta Ads). One without the other is half the picture.",
        },
        {
          title: "Campaign creative is not a series file",
          body: "A promotion or a dated ad should be uploaded on its own, with a clear publish time. Mixed into 29 other daily-content files, it can land on the wrong day.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "What each ads network supports",
      body: [
        "Each ads platform works differently. The card on Accounts → Ads shows what you can create, whether you can boost existing content, what audiences you get, and how complete the stats are.",
        "Boost means putting money behind something that already exists (a post, a Pin, a tweet). A standalone campaign is a new ad. Not every network does both.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Full campaigns: Campaign → Ad set → Ad.",
          boost: "Yes — boost existing organic posts.",
          audiences: "Custom and Lookalike.",
          stats: "Spend, impressions, reach, CTR, CPC, CPM, ROAS, conversions.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) and Display (Responsive Display Ads).",
          boost: "Not applicable — Google does not boost a social post.",
          audiences: "No audience targeting from Posty; Search and Display.",
          stats: "Full aggregated reports.",
        },
        {
          name: "LinkedIn Ads",
          can: "Image, video, carousel, document, event, text ad, conversation ads, and more.",
          boost: "Yes.",
          audiences: "Contact/company lists and retargeting — read-only; you cannot create new audiences from Posty.",
          stats: "Spend, CPC, CPM, plus job title, seniority, industry, company size.",
        },
        {
          name: "TikTok Ads",
          can: "Standalone video campaigns.",
          boost: "Spark Ads — promote native TikTok content.",
          audiences: "Custom and Lookalike.",
          stats: "Spend, views, CTR, CPM, near real time.",
        },
        {
          name: "Pinterest Ads",
          can: "New Promoted Pins.",
          boost: "Yes — promote existing organic Pins.",
          audiences: "Basic: demographics and country.",
          stats: "Spend, saves, closeups, clicks.",
        },
        {
          name: "X Ads",
          can: "Boost existing tweets or standalone campaigns (text up to 280 characters + a link card).",
          boost: "Yes.",
          audiences: "Location and language. Custom email lists are advanced (at least 100 recently active users).",
          stats: "Spend, CPE, CPM, link clicks.",
        },
        {
          name: "OpenAI Ads",
          can: "Cards in ChatGPT Free/Go: title, text, image, URL. No video.",
          boost: "Not applicable.",
          audiences: "Location only (country/region).",
          stats: "Impressions, clicks, spend, daily.",
          note: "Lifetime budget only, minimum $1. Business eligibility and markets: United States, Canada, Australia, New Zealand.",
        },
      ],
      tips: [
        {
          title: "Where ads work happens",
          body: "Connecting accounts and reading results live in posty.now (Accounts → Ads, Statistics → Ads). Organic content — photos, video, series, dated promotions — you launch from the Assistant. Do not ask the assistant “how much did I spend on Meta”; open Statistics → Ads.",
        },
      ],
    },
    {
      id: "assistant",
      title: "The assistant",
      body: [
        "The assistant is the heart of the studio. Ask for ideas, captions, publish, schedule, a month of content, or a promotion on a specific date.",
        "Write naturally. No special commands. Name the networks, when it should go out, and whether you want a caption. If you do not name a network (and it is not a series for every network), Posty asks — it does not guess.",
        "Attach up to 30 photos or videos, 100 MB each. Picker order is series order. Wait until uploads finish (orange badge), then send.",
        "Clean chat clears the thread. Use it when you change topic or want to reset “don’t ask again”.",
      ],
      examples: [
        "Give me three Instagram captions for a rainy Monday coffee shop.",
        "Publish this now on Instagram and TikTok.",
        "Starting tomorrow, one a day, on every network, at the best time.",
      ],
      tips: [
        {
          title: "One message, one clear intent",
          body: "“Publish this as an Instagram reel and TikTok now, and tomorrow at 9 put it on Instagram Stories” works in one message. Mixing a Friday promotion with 20 photos for the month does not.",
        },
      ],
    },
    {
      id: "voice",
      title: "Voice dictation",
      featured: "voice",
      lead: "Talk. Posty types. It is the fastest way to give a long instruction without a keyboard.",
      body: [
        "The microphone next to attachments is not a gimmick — it is the natural way to work in posty.now. Tap, speak like you would to a colleague, watch the words appear, fix a word if you want, send. Perfect when you have just picked 30 files, when you are on your phone, when you are describing a dated campaign with networks and tone, or when you simply do not want to type.",
        "It works best in Chrome or Edge. The first time, the browser asks for the microphone: press Allow. If you hit Block by mistake, open the lock icon in the address bar, allow the microphone, reload.",
        "While the mic is orange, Posty keeps listening — you can pause and continue. The placeholder becomes “Listening… speak now”. Tap the mic again to stop, then Send.",
        "You can dictate in Romanian or English. If a phrase comes out wrong, edit it in the box — you do not start over. Attachments stay; voice fills in the instruction.",
      ],
      examples: [
        "Starting tomorrow, one a day, on Instagram, TikTok, and Facebook, at the best time, no caption.",
        "Schedule this photo Friday at 10, it’s the autumn sale, Instagram and Facebook only, with a short sales line.",
      ],
      tips: [
        {
          title: "Say the whole thing",
          body: "Networks, day, clock time or “best time”, caption or not, same file everywhere or a different file per network. The more complete the sentence, the cleaner the confirmation card.",
        },
        {
          title: "Nothing appearing in the box?",
          body: "Almost always microphone permission, not a broken mic. Chrome → lock icon → Microphone → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Captions, ideas, brand voice",
      body: [
        "If you only want inspiration, say so. Posty offers 1–3 options and does not publish.",
        "A caption is written only if you ask (“write a caption”, “give it a description”). If you send a photo and say “publish on Instagram now”, it goes out with no text — it will not reuse an old caption from the thread.",
        "When you supply the copy, it is used exactly. If it is too long for a network (280 characters on X), it is trimmed to the limit and you are told.",
        "You can describe the brand voice: “we are a warm bakery, no emoji, no slang.” Posty keeps that in the conversation so later drafts stay on tone.",
      ],
      examples: [
        "Write a short caption, five hashtags, warm tone.",
        "We are a photo studio. Voice: clear, no superlatives. Remember that.",
      ],
      tips: [
        {
          title: "Your copy wins",
          body: "If you already have campaign copy, paste or dictate it. Posty will not rewrite it. Ask the AI only when you want options.",
        },
      ],
    },
    {
      id: "publish",
      title: "Publish now",
      body: [
        "Attach media if the network requires it (Instagram, TikTok, YouTube, Pinterest). Name the networks. Confirm on the card.",
        "“All networks”, “everywhere” means every connected posting account. You can exclude: “everywhere except LinkedIn”.",
        "It is not live until you see a green check on that network. “Publishing now” on TikTok means it is still processing — not an error. Wait for the check.",
      ],
      examples: [
        "Publish this video now on Instagram as a reel and on TikTok.",
        "Post on every network except Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Schedule at a specific time",
      body: [
        "Name the day and the clock time. Posty uses the sidebar clock (your local time), not a hidden timezone. “Tomorrow at 18:00” is 18:00 on that clock.",
        "You can combine: publish a story now on Instagram and TikTok, and schedule the reel tomorrow at 12:00 on Instagram.",
      ],
      examples: [
        "Schedule this tomorrow at 18:00 on TikTok and Instagram.",
        "Friday 15:00 on LinkedIn, this text, no photo.",
      ],
      tips: [
        {
          title: "Check the clock",
          body: "If you are travelling or on a VPN, look at Local time on the left. Schedules follow the studio clock.",
        },
      ],
    },
    {
      id: "best-time",
      title: "Best time",
      body: [
        "Say “at the best time”, “optimal time”, “peak time”. Posty does not invent 18:00. It picks the next peak window from industry research (Sprout, Hootsuite, Later, Buffer), in your timezone, as a stand-in for audience local time.",
        "This is not your personal analytics — the posts dashboard is daily, not hourly. It is a solid default; if you know your audience is up at night, name the hour. An explicit clock time always wins.",
        "Each network has its own rhythm. Instagram on weekdays tends toward ~11:00 (stories ~12:00), with an evening fallback ~19:00. TikTok toward ~19:00. LinkedIn skips weekends. Instagram and TikTok at “best time” may go out at different hours — that is intentional.",
      ],
      examples: [
        "Tomorrow at the best time, on Instagram and TikTok.",
        "Move Friday’s post to the best time.",
      ],
    },
    {
      id: "series",
      title: "A month of content: daily series",
      body: [
        "Attach up to 30 files, in the order they should go out. Say “starting tomorrow, one a day, on every network, at the best time”. Photos and videos can mix.",
        "The default is cross, not copy-paste. On the same day, each network gets a different file. Facebook might get media 1, X media 2, TikTok media 3. The same file never goes out on two networks that day. Across the month the files rotate so the calendar stays full.",
        "If you want the same file on every network that day, say so: “the same on all of them”. Otherwise it stays cross.",
        "TikTok and YouTube skip photos — they will not get stills. Videos are fine. The confirmation card shows, per day, which network gets which file. Large series always ask for confirmation; they will not skip the card.",
      ],
      examples: [
        "Starting tomorrow, one a day, on every network, at the best time.",
        "These 10 videos, the same file on every network each day, at 19:00.",
      ],
      tips: [
        {
          title: "Picker order matters",
          body: "File 1 is day 1. Do not grab them at random if you already have an order in mind. You can remove an attachment with X before you send.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Promotions, launches, specific dates",
      lead: "A campaign is not a series. A specific date is not “one a day”.",
      body: [
        "If you have a promotion, a launch, a Black Friday, an event — upload that asset on its own. Say clearly when it should go out and on which networks. One file, one instruction, one confirmation.",
        "If you drop campaign creative next to 29 other daily-content photos, the series treats it as just another day in the month. It may go out on Tuesday instead of Friday, on TikTok instead of Facebook, or next to a reel that has nothing to do with the offer.",
        "The same rule applies when the asset is meant for ads. A daily series is cascading organic content. A paid ad, a boost, a promotion with a deadline — separate, with a date.",
      ],
      examples: [
        "Schedule this photo on 15 September at 10:00, Instagram and Facebook, it’s the autumn sale. This copy, exactly.",
        "Publish the launch video Friday at 12:00 on Instagram as a reel and on TikTok. It is not part of the series.",
      ],
      tips: [
        {
          title: "Two jobs, two messages",
          body: "First the batch of 30 (the month’s content). Then a new chat or a new message, a single file, the promotion. Do not bind them in the same upload.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formats per network",
      body: [
        "Reel exists on Instagram, not TikTok. Story exists on Instagram (and Facebook), not TikTok. “Post on Instagram as a reel and on TikTok” = Instagram Reel + a normal TikTok video.",
        "“Instagram as a story and TikTok” = Instagram Story + TikTok video. “As a video on Instagram and TikTok” = Instagram publishes the video as a Reel automatically, TikTok as a video.",
        "Name a format only on the network that has it. Do not ask for a reel on YouTube or a story on LinkedIn.",
        "Instagram, TikTok, YouTube, and Pinterest require media. LinkedIn, X, Threads, Bluesky, Facebook, and Reddit can be text. X trims at 280 characters. Do not mix image and video in the same tweet.",
      ],
      examples: [
        "This video: Instagram reel and TikTok, now. And tomorrow at 9:00, Instagram story.",
      ],
    },
    {
      id: "confirm",
      title: "The confirmation card",
      body: [
        "Before anything goes out, you see a card: networks, time, preview, and for series a slot per day. Confirm or Cancel / edit.",
        "You can tick “Don’t ask again in this chat” if you want speed. That preference is only for this thread; Clean chat resets it. Large series still want eyes on the card — it is too easy to schedule 30 days wrong.",
        "If you cancel, send a new instruction. Confirmation expires after a few hours; if you left the tab open overnight, send the command again.",
      ],
    },
    {
      id: "manage",
      title: "Cancel, reschedule, edit",
      body: [
        "For a post scheduled from chat, you can ask to cancel it, move it, or change the caption. Identify it by network, time, or a snippet of the text.",
        "Rescheduling can be a new clock time or “at the best time”.",
      ],
      examples: [
        "Cancel tomorrow’s TikTok post.",
        "Move Friday’s Instagram post to 19:00.",
        "Change Monday’s caption to: …",
      ],
    },
    {
      id: "stats-posts",
      title: "Statistics: posts",
      body: [
        "Statistics → Posts. Each network is a card: posts over 30 days, engagement, followers. Open a card for charts, a custom range, top posts, and comments where they exist.",
        "Bluesky and Reddit give limited stats (likes, comments, shares — no impressions). Other connected networks give the full picture, within what each API provides.",
        "This is where you see whether organic content landed. It is not the place for ad spend.",
      ],
    },
    {
      id: "stats-ads",
      title: "Statistics: ads",
      lead: "This is where the money shows. If no ads account is connected, the card is empty — that is not a bug.",
      body: [
        "Statistics → Ads. Per ads network: campaign count (30 days), spend, impressions. In detail: clicks, CTR, conversions, top campaigns, date range (7 / 30 / custom).",
        "Use it to decide whether a campaign is worth continuing, not to confuse it with a post that did well organically. A reel with many likes and a campaign with a strong CTR are different wins.",
        "Change the range in the detail view if you want to compare a sale month with the previous one. If no campaigns appear, check Accounts → Ads: is the account connected and active in the range you picked?",
      ],
      tips: [
        {
          title: "A short weekly loop",
          body: "Once a week: Statistics → Posts (what landed organically) and Statistics → Ads (what cost money and what it returned). Then, in the assistant, adjust the series — or prepare a new dated creative if it is a promotion.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Phrases that work well",
      body: [
        "You do not need to memorize commands. These examples cover almost everything the studio can do.",
      ],
      examples: [
        "Give me three Instagram captions for a bakery on a Monday morning.",
        "Publish this now on Instagram as a reel and on TikTok.",
        "Schedule tomorrow at 18:00 on LinkedIn, this text.",
        "Tomorrow at the best time, on Instagram and TikTok.",
        "Starting tomorrow, one a day, on every network, at the best time.",
        "The same video on every network, one a day, at 19:00.",
        "Schedule this photo on 15 September at 10:00, Instagram and Facebook only — it’s the promotion, not part of the series.",
        "Every network except LinkedIn.",
        "Cancel tomorrow’s TikTok post.",
        "Move Friday’s post to the best time.",
        "Write a caption, warm tone, no emoji.",
        "Don’t ask for confirmation again in this chat.",
      ],
    },
    {
      id: "troubleshoot",
      title: "If something goes wrong",
      body: [
        "Dictation writes nothing: Chrome or Edge, Allow on the microphone, lock icon in the address bar. Reload. Then the mic in chat — it should stay orange while you speak.",
        "“Publishing now” on TikTok: wait. Processing is not an error. The green check is the signal.",
        "Nothing publishes: Accounts → Posts, is the network connected? Do Instagram/TikTok/YouTube/Pinterest have a file attached?",
        "File rejected: 100 MB max, 30 files max. Photos are skipped on TikTok/YouTube in a series.",
        "Confirmation vanished: it expired. Send the command again.",
        "Empty ads stats: Accounts → Ads, connect the network, then Statistics → Ads. A posting Instagram does not fill the ads dashboard.",
        "Wrong language: the language switch is at the bottom of the sidebar, next to the clock.",
      ],
    },
  ],
};

export function getGuide(locale: string): GuideDoc {
  return locale === "ro" ? RO : EN;
}
