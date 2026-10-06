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
    "Tot ce poți face în posty.now: asistent, conexiuni, postări, statistici, mesaje, lead-uri, promovări și voce — pas cu pas, cu exemple.",
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
        "Alături de postări organice stau promovările plătite, inbox-ul (mesaje și comentarii) și un agent de lead-uri pe care îl antrenezi pe site-ul tău. Postările și reclamele sunt două lucruri diferite; studio-ul le ține pe amândouă, dar nu le amestecă.",
        "Sus în bară: Asistent, Conexiuni, Postări, Statistici, Mesaje, Lead-uri, Promovări și Manual. Mesaje se deschide în două tab-uri: mesaje directe și comentarii. Jos, în bară: ora locală, limba și contul. Dacă ești pe Team, jos alegi și clientul — conexiunile, postările și lead-urile sunt ale clientului selectat. Toate programările folosesc ceasul ăsta, nu ora din altă țară.",
      ],
      tips: [
        {
          title: "Începe cu conexiunile",
          body: "Asistentul poate scrie texte imediat. Ca să publice, să-ți arate statistici sau să răspundă în inbox, conectează întâi rețelele la Conexiuni — Social pentru postări și, dacă faci ads, Reclame.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Conexiuni: postări",
      body: [
        "Mergi la Conexiuni. În secțiunea Social leagă Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky și Reddit.",
        "Apasă Conectează, autorizează-ți contul, gata. Pe Facebook alegi pagina, pe LinkedIn poți alege profil sau pagină de companie, pe Pinterest board-ul, pe Google Business locația.",
        "Bluesky nu are login clasic: folosește un App Password (parolă de aplicație), nu parola obișnuită a contului. Dacă nu știi de unde o iei, butonul de ajutor de pe card te duce la instrucțiuni.",
        "Poți conecta mai multe conturi pe aceeași rețea. Ce e conectat aici e ce asistentul poate publica, ce apare la Postări, Statistici și Mesaje.",
      ],
      tips: [
        {
          title: "Nu e același lucru cu ads",
          body: "Instagram-ul de postări nu deschide automat Meta Ads. Promovările se conectează separat, tot în Conexiuni, jos, la Reclame.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Conexiuni: promovări (ads)",
      lead: "Postările aduc reach organic. Ads-urile plătesc ca să fie văzute. În posty.now ambele își au locul — dar se conectează separat.",
      body: [
        "Tot în Conexiuni, mai jos, la Reclame, leagă Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads și OpenAI Ads.",
        "Un cont de promovare nu publică poze în feed. El îți dă acces la campaniile plătite: ce rulează, cât cheltui, ce rezultate ai. Lista de campanii e la Promovări. Campaniile noi le ceri din Asistent.",
        "OpenAI Ads nu are fereastră de login: lipești o cheie API din ChatGPT Ads Manager. Reclamele OpenAI sunt carduri în ChatGPT (titlu, text, imagine, link), doar imagini statice, buget pe toată durata campaniei (minim 1 $), și eligibilitate de business — momentan SUA, Canada, Australia, Noua Zeelandă.",
      ],
      tips: [
        {
          title: "Organic + plătit pe Meta",
          body: "Dacă postezi pe Instagram/Facebook și vrei și campanii plătite, conectează ambele: Social (Instagram, Facebook) și Reclame (Meta Ads). Unul fără celălalt îți taie jumătate din tablou.",
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
        "Fiecare platformă de promovare lucrează altfel. Cardul din Conexiuni → Reclame îți arată ce poți crea, dacă poți da boost unei postări existente, ce audiențe ai și cât de complete sunt statisticile.",
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
          body: "Conectarea e la Conexiuni → Reclame. Lista de campanii și cheltuieli e la Promovări. Conținutul organic — poze, video, serii, promoții datate — îl lansezi din Asistent. Nu cere asistentului „cât am cheltuit pe Meta”; deschide Promovări.",
        },
      ],
    },
    {
      id: "assistant",
      title: "Asistentul",
      body: [
        "Asistentul e inima studio-ului. Aici ceri idei, texte, publicare, programare, o lună de conținut sau o promoție pe o dată anume.",
        "Scrie în română, natural, ca unui coleg. Nu trebuie comenzi speciale. Spune rețelele, când vrei să iasă și dacă vrei text sau nu. Dacă nu spui pe ce rețea (și nu e o serie pe toate), Posty te întreabă — nu ghicește.",
        "Atașează până la 50 de poze sau video, maximum 100 MB fiecare. Ordinea în care le alegi e ordinea din serie. Așteaptă să se încarce (badge portocaliu), apoi trimite mesajul.",
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
        "Microfonul de lângă atașamente nu e un extra — e felul natural de a lucra în posty.now. Apeși, vorbești ca la un om, vezi textul cum apare, corectezi un cuvânt dacă vrei, și trimiți. Ideal când selectezi 50 de fișiere, când ești pe telefon, când descrii o campanie cu dată, rețele și ton, sau când pur și simplu nu ai chef să scrii.",
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
        "Spune ziua și ora. Posty folosește ceasul din bara de jos (ora ta locală), nu un fuso ascuns. „Mâine la 18:00” e 18:00 pe ceasul ăla.",
        "Poți combina: publică story acum pe Instagram și TikTok, și programează reel-ul mâine la 12:00 tot pe Instagram.",
      ],
      examples: [
        "Programează asta mâine la 18:00 pe TikTok și Instagram.",
        "Vineri 15:00 pe LinkedIn, textul ăsta, fără poză.",
      ],
      tips: [
        {
          title: "Verifică ceasul",
          body: "Dacă călătorești sau ai VPN, uită-te la Ora locală jos, în bara studio-ului. Programările urmează ceasul ăsta.",
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
        "Atașează până la 50 de fișiere, în ordinea în care vrei să iasă. Spune „începând de mâine, câte una pe zi, pe fiecare rețea, la cea mai bună oră” sau „100 de postări carusel cu câte 5 poze mixate”. Poți amesteca poze și video.",
        "Implicit e cross, nu copy-paste. În aceeași zi, fiecare rețea primește alt fișier. Facebook poate lua media 1, X media 2, TikTok media 3. Același material nu apare pe două rețele în aceeași zi. Pe parcursul lunii fișierele rotează, ca luna să rămână plină.",
        "Dacă vrei același fișier pe toate rețelele în ziua aia, trebuie să o spui: „același pe toate”. Altfel rămâne cross.",
        "TikTok ia și poze (mod foto / carusel), și video. YouTube sare pozele — nu primește foto. În cardul de confirmare vezi, pe zile, ce rețea ce fișier ia. Seriile mari cer confirmare; nu sar peste card.",
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
          body: "Întâi seria de 50 (conținutul lunii). Apoi un chat nou sau un mesaj nou, un singur fișier, promoția. Nu le lega în aceeași încărcare.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formate pe rețea",
      body: [
        "Reel există pe Instagram, nu pe TikTok. Story există pe Instagram (și Facebook), nu pe TikTok. „Postează pe Instagram reel și pe TikTok” = Reel pe Instagram + video normal pe TikTok.",
        "„Instagram ca story și pe TikTok” = Story pe Instagram + video TikTok. „Ca video pe Instagram și TikTok” = Instagram publică video-ul ca Reel automat, TikTok ca video.",
        "Pe TikTok poți și poze (o poză sau carusel), nu doar video.",
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
        "Poți bifa „Nu mai întreba în acest chat” dacă vrei viteză. Preferința e doar pe firul ăsta; Chat nou o resetează. Seriile mari tot cer ochi pe card — e prea ușor să programezi 50 de zile greșit.",
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
      id: "posts-list",
      title: "Postări (istoric)",
      body: [
        "Postări din bară e calendarul tău: ciorne, programate și publicate, doar pentru conturile conectate. Filtrezi pe rețea, cont, status, sursă și interval.",
        "De aici verifici dacă o serie a ieșit, dacă o programare e încă în așteptare, sau deschizi postarea pe rețea. Publicarea și programarea se fac tot din Asistent; pagina asta e istoricul.",
      ],
    },
    {
      id: "messages",
      title: "Mesaje și comentarii",
      body: [
        "Mesaje din bară are două tab-uri: mesaje directe și comentarii. Vezi conversațiile de pe conturile conectate și poți răspunde din pagina asta, fără să deschizi aplicația rețelei.",
        "Filtrezi pe platformă, cont și status. Ca să apară ceva, trebuie un cont de postări conectat la Conexiuni → Social.",
        "Aici vorbești tu. Agentul de lead-uri, dacă e pornit, răspunde separat pe mesajele noi care arată intenție — nu înlocuiește inbox-ul ăsta.",
      ],
    },
    {
      id: "leads",
      title: "Lead-uri",
      lead: "Fiecare client are agentul lui. Pui link-ul site-ului, antrenezi, îi spui cum să vorbească, apoi aprinzi generarea.",
      body: [
        "La Lead-uri lipești URL-ul site-ului și apeși Antrenează. Agentul citește paginile publice și produsele. Dacă e deja antrenat, butonul scrie Deja antrenat.",
        "În caseta de jos îi spui cum vrei să decurgă conversația: prețuri, ce să identifice („cât costă”, „am liber pe o dată”), și link-ul de programare dacă ai unul. Asta e briefing-ul tău, nu înlocuiește crawl-ul.",
        "După antrenare apeși Generare lead-uri AI. De-acolo răspunde doar la mesaje noi, primite după ce ai aprins generarea — nu la conversațiile vechi și nu la mesajele trimise de tine. Inbox-ul e verificat o dată pe zi.",
        "Se prezintă ca agentul posty.now, cere acordul (DA) și trimite termenii, apoi răspunde din ce a citit pe site. Lead-urile apar în listă (mesaj, comentariu sau reclamă) cu status nou / contactat / respins. Oprește generarea din același buton când vrei să tacă.",
      ],
      tips: [
        {
          title: "Instagram conectat",
          body: "Pentru DM-uri trebuie un Instagram (sau alt canal cu inbox) conectat la Conexiuni. Antrenarea pe site nu publică și nu scrie singură pe rețele.",
        },
        {
          title: "Nu e un blast",
          body: "Generarea nu trimite mesaje la conversații vechi. Un DM de test trebuie să vină după ce ai aprins butonul, și răspunsul poate aștepta următoarea rulare zilnică.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Statistici",
      body: [
        "Statistici e tabloul postărilor organice: rata de interacțiune, acoperirea, urmăritorii, câte postări în interval, cea mai bună postare, grafice pe platformă și în timp, heatmap cu ora bună.",
        "Filtrezi pe platformă, cont, sursă (scrise de tine sau din afară) și ultimele 7 / 30 / 90 de zile. Deschizi link-ul de la cea mai bună postare ca să o vezi pe rețea. Thumbnail-ul e poza postării; la video apare iconița rețelei dacă nu există preview.",
        "Bluesky și Reddit dau statistici limitate (aprecieri, comentarii, distribuiri — fără afișări). Restul rețelelor conectate dau tabloul complet, în limita a ceea ce oferă fiecare.",
        "Aici vezi dacă conținutul organic prinde. Cheltuielile de ads nu sunt aici — alea sunt la Promovări.",
      ],
    },
    {
      id: "stats-ads",
      title: "Promovări",
      lead: "Aici se văd campaniile și banii. Dacă nu e conectat un cont de ads, pagina e goală — nu e un bug.",
      body: [
        "Promovări din bară: campaniile active și cele încheiate, pe rețelele de ads conectate. Filtrezi pe platformă, cont, status și interval. Campaniile noi se cer din Asistent.",
        "Folosește-l ca să vezi dacă o campanie merită continuată, nu ca să o confunzi cu o postare care a mers bine organic. Un reel cu multe like-uri și o campanie cu CTR bun sunt victorii diferite.",
        "Dacă nu apar campanii, verifică Conexiuni → Reclame: contul e conectat și activ în perioada aleasă?",
      ],
      tips: [
        {
          title: "O rutină scurtă",
          body: "O dată pe săptămână: Statistici (ce a prins organic) și Promovări (ce a costat și ce a adus). Apoi, în asistent, ajustezi seria sau pregătești un creativ nou — separat, cu dată, dacă e promoție. Lead-urile le treci din listă în contactat când ai vorbit cu omul.",
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
        "Creează o campanie de ads pe Meta, trafic către site, buget 10 € pe zi.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Dacă ceva nu merge",
      body: [
        "Dictarea nu scrie nimic: Chrome sau Edge, Allow pe microfon, lacătul din bara de adresă. Reîncarcă. Apoi microfonul din chat — trebuie să rămână portocaliu cât vorbești.",
        "„Se publică acum” pe TikTok: așteaptă. Procesarea nu e eroare. Bifa verde e semnalul.",
        "Nu publică: Conexiuni → Social, rețeaua e conectată? Instagram/TikTok/YouTube/Pinterest au fișier atașat?",
        "Fișier respins: maximum 100 MB, maximum 50 odată. YouTube sare pozele. TikTok acceptă poze (carusel).",
        "Confirmarea a dispărut: a expirat. Trimite comanda din nou.",
        "Statistici goale: conectează un cont de postări la Conexiuni. Campaniile ads goale: Conexiuni → Reclame, apoi Promovări. Un Instagram de postări nu umple tabloul de ads.",
        "Agentul de lead-uri nu răspunde: e antrenat? E aprins Generare lead-uri AI? Mesajul trebuie să fie nou, primit după ce ai aprins generarea. Inbox-ul se scanează o dată pe zi.",
        "Limba greșită: comutatorul de limbă e jos în bara studio-ului, lângă ceas.",
      ],
    },
  ],
};

const EN: GuideDoc = {
  title: "User guide",
  subtitle:
    "Everything you can do in posty.now: assistant, connections, posts, analytics, messages, leads, ads, and voice — step by step, with examples.",
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
        "Paid ads sit next to organic posts, plus an inbox (messages and comments) and a lead agent you train on your website. Posts and ads are different jobs; the studio holds both, and does not mix them up.",
        "Top bar: Assistant, Connections, Posts, Analytics, Messages, Leads, Ads, and Guide. Messages opens in two tabs: direct messages and comments. Bottom bar: local time, language, and your account. On Team, you also pick the client there — connections, posts, and leads belong to the selected client. Every schedule follows that clock, not some other timezone.",
      ],
      tips: [
        {
          title: "Start with connections",
          body: "The assistant can write captions immediately. To publish, show analytics, or reply in the inbox, connect networks first at Connections — Social for posting, and Ads if you run paid campaigns.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Connections: posting",
      body: [
        "Go to Connections. Under Social, connect Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky, and Reddit.",
        "Hit Connect, authorize, done. Facebook asks for a Page, LinkedIn can be a profile or a company page, Pinterest a board, Google Business a location.",
        "Bluesky does not use a normal login: it needs an App Password, not your regular account password. The help link on the card explains how to create one.",
        "You can connect more than one account on the same network. Whatever is connected here is what the assistant can publish to, and what shows up under Posts, Analytics, and Messages.",
      ],
      tips: [
        {
          title: "This is not ads",
          body: "Connecting Instagram for posting does not open Meta Ads. Paid accounts live under Connections, further down, in Ads.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Connections: ads",
      lead: "Posts earn organic reach. Ads pay to be seen. In posty.now both belong — they just connect separately.",
      body: [
        "Still on Connections, further down under Ads, connect Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads, and OpenAI Ads.",
        "An ads account does not publish to the feed. It unlocks paid campaigns: what is running, what you spend, what you get back. The campaign list is under Ads in the top bar. New campaigns are created from the Assistant.",
        "OpenAI Ads has no login popup: you paste an API key from ChatGPT Ads Manager. Those ads are cards inside ChatGPT (title, text, image, link), static images only, a fixed campaign budget (minimum $1), and business eligibility — currently the United States, Canada, Australia, and New Zealand.",
      ],
      tips: [
        {
          title: "Organic + paid on Meta",
          body: "If you post to Instagram/Facebook and also run paid campaigns, connect both: Social (Instagram, Facebook) and Ads (Meta Ads). One without the other is half the picture.",
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
        "Each ads platform works differently. The card on Connections → Ads shows what you can create, whether you can boost existing content, what audiences you get, and how complete the stats are.",
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
          body: "Connecting is at Connections → Ads. The campaign list and spend are under Ads in the top bar. Organic content — photos, video, series, dated promotions — you launch from the Assistant. Do not ask the assistant “how much did I spend on Meta”; open Ads.",
        },
      ],
    },
    {
      id: "assistant",
      title: "The assistant",
      body: [
        "The assistant is the heart of the studio. Ask for ideas, captions, publish, schedule, a month of content, or a promotion on a specific date.",
        "Write naturally. No special commands. Name the networks, when it should go out, and whether you want a caption. If you do not name a network (and it is not a series for every network), Posty asks — it does not guess.",
        "Attach up to 50 photos or videos, 100 MB each. Picker order is series order. Wait until uploads finish (orange badge), then send.",
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
        "The microphone next to attachments is not a gimmick — it is the natural way to work in posty.now. Tap, speak like you would to a colleague, watch the words appear, fix a word if you want, send. Perfect when you have just picked 50 files, when you are on your phone, when you are describing a dated campaign with networks and tone, or when you simply do not want to type.",
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
        "Name the day and the clock time. Posty uses the clock in the bottom bar (your local time), not a hidden timezone. “Tomorrow at 18:00” is 18:00 on that clock.",
        "You can combine: publish a story now on Instagram and TikTok, and schedule the reel tomorrow at 12:00 on Instagram.",
      ],
      examples: [
        "Schedule this tomorrow at 18:00 on TikTok and Instagram.",
        "Friday 15:00 on LinkedIn, this text, no photo.",
      ],
      tips: [
        {
          title: "Check the clock",
          body: "If you are travelling or on a VPN, look at Local time in the studio’s bottom bar. Schedules follow that clock.",
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
        "Attach up to 50 files, in the order they should go out. Say “starting tomorrow, one a day, on every network, at the best time” or “100 carousel posts with 5 mixed photos each”. Photos and videos can mix.",
        "The default is cross, not copy-paste. On the same day, each network gets a different file. Facebook might get media 1, X media 2, TikTok media 3. The same file never goes out on two networks that day. Across the month the files rotate so the calendar stays full.",
        "If you want the same file on every network that day, say so: “the same on all of them”. Otherwise it stays cross.",
        "TikTok takes photos (photo mode / carousel) and video. YouTube skips photos — it will not get stills. The confirmation card shows, per day, which network gets which file. Large series always ask for confirmation; they will not skip the card.",
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
          body: "First the batch of 50 (the month’s content). Then a new chat or a new message, a single file, the promotion. Do not bind them in the same upload.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formats per network",
      body: [
        "Reel exists on Instagram, not TikTok. Story exists on Instagram (and Facebook), not TikTok. “Post on Instagram as a reel and on TikTok” = Instagram Reel + a normal TikTok video.",
        "“Instagram as a story and TikTok” = Instagram Story + TikTok video. “As a video on Instagram and TikTok” = Instagram publishes the video as a Reel automatically, TikTok as a video.",
        "TikTok also takes stills (one photo or a carousel), not only video.",
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
        "You can tick “Don’t ask again in this chat” if you want speed. That preference is only for this thread; Clean chat resets it. Large series still want eyes on the card — it is too easy to schedule 50 days wrong.",
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
      id: "posts-list",
      title: "Posts (history)",
      body: [
        "Posts in the top bar is your calendar: drafts, scheduled, and published, only for the accounts connected here. Filter by network, account, status, source, and date range.",
        "Use it to check whether a series went out, whether a schedule is still pending, or to open the post on the network. Publishing and scheduling still happen in the Assistant; this page is the history.",
      ],
    },
    {
      id: "messages",
      title: "Messages and comments",
      body: [
        "Messages in the top bar has two tabs: direct messages and comments. You see threads from the connected accounts and can reply from this page, without opening the network’s app.",
        "Filter by platform, account, and status. Something only appears if a posting account is connected at Connections → Social.",
        "This inbox is you talking. The lead agent, if it is on, answers separately on new inbound messages that show intent — it does not replace this inbox.",
      ],
    },
    {
      id: "leads",
      title: "Leads",
      lead: "Each client has their own agent. Add the site link, train it, tell it how to talk, then turn generation on.",
      body: [
        "On Leads, paste the website URL and press Train the agent. It reads public pages and products. If it is already trained, the button says Already trained.",
        "In the box below, tell it how you want the conversation to go: prices, what to spot (“how much is it”, “am I free on a date”), and your booking link if you have one. That is your briefing; it does not replace the crawl.",
        "After training, press AI lead generation. From then on it only answers new inbound messages received after you turned generation on — not old threads and not messages you sent. The inbox is scanned once a day.",
        "It introduces itself as the posty.now agent, asks for consent (YES) and sends the terms, then answers from what it read on the site. Leads show in the list (message, comment, or ad) as new / contacted / dismissed. Turn generation off with the same control when you want it quiet.",
      ],
      tips: [
        {
          title: "Instagram connected",
          body: "DMs need an Instagram (or another inbox channel) connected at Connections. Training on the site does not publish and does not write to networks on its own.",
        },
        {
          title: "Not a blast",
          body: "Generation does not message old threads. A test DM has to arrive after you turned the button on, and the reply may wait for the next daily scan.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Analytics",
      body: [
        "Analytics is the organic-posts board: engagement rate, reach, followers, posts in the range, best post, charts by platform and over time, and a heatmap for a good hour.",
        "Filter by platform, account, source (created here or from the platform) and the last 7 / 30 / 90 days. Open the best-post link to see it on the network. The thumbnail is the post image; for video you get the network icon if there is no preview.",
        "Bluesky and Reddit give limited stats (likes, comments, shares — no impressions). Other connected networks give the full picture, within what each API provides.",
        "This is where you see whether organic content landed. Ad spend is not here — that is under Ads.",
      ],
    },
    {
      id: "stats-ads",
      title: "Ads",
      lead: "This is where campaigns and money show. If no ads account is connected, the page is empty — that is not a bug.",
      body: [
        "Ads in the top bar: active campaigns and past ones, on the connected ads networks. Filter by platform, account, status, and date range. New campaigns are created from the Assistant.",
        "Use it to decide whether a campaign is worth continuing, not to confuse it with a post that did well organically. A reel with many likes and a campaign with a strong CTR are different wins.",
        "If no campaigns appear, check Connections → Ads: is the account connected and active in the range you picked?",
      ],
      tips: [
        {
          title: "A short weekly loop",
          body: "Once a week: Analytics (what landed organically) and Ads (what cost money and what it returned). Then, in the assistant, adjust the series — or prepare a new dated creative if it is a promotion. Move leads in the list to contacted once you have spoken to the person.",
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
        "Create a Meta ads campaign, traffic to the site, €10 a day.",
      ],
    },
    {
      id: "troubleshoot",
      title: "If something goes wrong",
      body: [
        "Dictation writes nothing: Chrome or Edge, Allow on the microphone, lock icon in the address bar. Reload. Then the mic in chat — it should stay orange while you speak.",
        "“Publishing now” on TikTok: wait. Processing is not an error. The green check is the signal.",
        "Nothing publishes: Connections → Social, is the network connected? Do Instagram/TikTok/YouTube/Pinterest have a file attached?",
        "File rejected: 100 MB max, 50 files max. YouTube skips photos. TikTok accepts photos (carousel).",
        "Confirmation vanished: it expired. Send the command again.",
        "Empty analytics: connect a posting account at Connections. Empty ads campaigns: Connections → Ads, then Ads in the top bar. A posting Instagram does not fill the ads dashboard.",
        "Lead agent not answering: is it trained? Is AI lead generation on? The message must be new inbound after you turned generation on. The inbox is scanned once a day.",
        "Wrong language: the language switch is in the studio’s bottom bar, next to the clock.",
      ],
    },
  ],
};

export function getGuide(locale: string): GuideDoc {
  return locale === "ro" ? RO : EN;
}
