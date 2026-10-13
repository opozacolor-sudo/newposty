import { pickLocale, type AppLocale } from "@/lib/app-locale";
import { formatEurFromCents } from "@/lib/stripe-catalog";

export type PricingPlanId = "studio" | "promote" | "growth";

export type PricingPlanCopy = {
  id: PricingPlanId;
  name: string;
  tag: string;
  gain: string;
  features: string[];
  monthlyCents: number;
  annualCents: number;
  featured?: boolean;
};

export type PricingPackCopy = {
  id: "photos" | "videos";
  name: string;
  priceCents: number;
  body: string;
  note?: string;
};

export type PricingPageCopy = {
  kicker: string;
  title: string;
  lead: string;
  monthly: string;
  annual: string;
  perMonth: string;
  perYear: string;
  saveYear: string;
  vat: string;
  featured: string;
  includes: string;
  waitlist: string;
  launch: string;
  plans: PricingPlanCopy[];
  packsTitle: string;
  packsLead: string;
  packs: PricingPackCopy[];
  gainsTitle: string;
  gains: Array<{ title: string; body: string }>;
  compareTitle: string;
  compare: Array<{ title: string; body: string }>;
  faqs: Array<{ q: string; a: string }>;
};

const COPY: Record<AppLocale, PricingPageCopy> = {
  en: {
    kicker: "Prices",
    title: "One studio. Three ways in.",
    lead: "Talk to it. It posts, promotes, and brings you people. Prices exclude 21% VAT. The first month is free if you pre-register.",
    monthly: "Monthly",
    annual: "Yearly",
    perMonth: "/ month",
    perYear: "/ year",
    saveYear: "Save {amount} vs monthly",
    vat: "Prices exclude 21% VAT. Packs can be bought any time. They last 30 days or until you use them.",
    featured: "Most complete",
    includes: "Everything in {plan}, plus",
    waitlist: "Pre-register — first month free",
    launch: "Launch 15 October",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "You speak. It posts.",
        gain: "A month of content from one brief — not from 30 logins.",
        features: [
          "Assistant in chat and by voice, in your language",
          "Publish and schedule on every connected network",
          "A 30-day plan, a product catalog from your site, best time per network",
          "Analytics, messages, and comments in one inbox",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Organic, then paid.",
        gain: "You run the campaign. You don’t hire an ads manager for a Spark or a boost.",
        features: [
          "Paid ads from the same chat — Spark, views, traffic",
          "Up to 3 ads accounts",
          "Ads results next to your organic stats",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Posts that bring customers.",
        gain: "The inbox qualifies. You close. Qualified leads are unlimited.",
        features: [
          "A lead agent trained on your public site",
          "Unlimited qualified leads — no extra pack",
          "Replies to new messages and comments after you turn it on",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Packs, when you need them",
    packsLead: "Buy any time. Not a subscription. They expire in 30 days or when the 30 units are used.",
    packs: [
      { id: "photos", name: "30 photos", priceCents: 250, body: "Posters and product stills from chat. Use them on Studio, Promovare, or Creștere." },
      { id: "videos", name: "30 videos", priceCents: 500, body: "5-second clips, ready for Reels and TikTok. Same packs on every plan." },
    ],
    gainsTitle: "What you actually get",
    gains: [
      { title: "Your time back", body: "One chat instead of six apps. Dictate the brief. Confirm. The calendar fills." },
      { title: "Content that ships", body: "Photos, clips, captions, and a month of posts from the site or the product you already have." },
      { title: "Spend you control", body: "Ads start only when you press the black button. The budget is yours. We don’t add a media fee." },
      { title: "People, not vanity", body: "On Creștere the agent answers people who wrote to you. You get names, phones, and a thread — not just views." },
    ],
    compareTitle: "Vs doing it the old way",
    compare: [
      { title: "Vs an agency", body: "You keep the accounts, the voice, and the spend. The studio is the operator — you don’t wait a week for a carousel." },
      { title: "Vs hiring in-house", body: "A specialist for setup is optional. Day to day you talk to Posty, not a new salary." },
      { title: "Vs posting by hand", body: "Best time per network, one caption adapted, thirty days booked. You don’t copy-paste until midnight." },
    ],
    faqs: [
      { q: "Is VAT included?", a: "No. Prices exclude 21% Romanian VAT. VAT is added at checkout." },
      { q: "Can I start on Studio and upgrade?", a: "Yes. Promovare includes Studio. Creștere includes Promovare. Packs stay with you." },
      { q: "Do I need a pack to post?", a: "No. Studio posts files you already have. Packs are only for AI photos and videos you generate in chat." },
      { q: "Can I use leads without Creștere?", a: "No. The lead agent is on Creștere. There is no separate lead pack." },
      { q: "What happens after 15 October?", a: "Pre-register now and the first month is free. Then the plan you pick renews monthly or yearly." },
    ],
  },
  ro: {
    kicker: "Prețuri",
    title: "Un studio. Trei drumuri.",
    lead: "Îi spui. El postează, promovează și îți aduce oameni. Prețurile sunt fără TVA 21%. Prima lună e gratuită dacă te preînregistrezi.",
    monthly: "Lunar",
    annual: "Anual",
    perMonth: "/ lună",
    perYear: "/ an",
    saveYear: "Economisești {amount} față de lunar",
    vat: "Prețurile sunt fără TVA 21%. Pachetele se cumpără oricând. Țin 30 de zile sau până le consumi.",
    featured: "Cel mai complet",
    includes: "Tot din {plan}, plus",
    waitlist: "Preînregistrează-te — prima lună gratuită",
    launch: "Lansare 15 octombrie",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "Tu spui. El postează.",
        gain: "O lună de conținut dintr-un brief — nu din 30 de login-uri.",
        features: [
          "Asistent în chat și pe voce, pe limba ta",
          "Publici și programezi pe toate rețelele conectate",
          "Plan pe 30 de zile, catalog din site, ora bună pe fiecare rețea",
          "Statistici, mesaje și comentarii într-un singur inbox",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Organic, apoi plătit.",
        gain: "Tu pornești campania. Nu angajezi un om de ads pentru un Spark sau un boost.",
        features: [
          "Reclame din același chat — Spark, vizualizări, trafic",
          "Maxim 3 conturi ads",
          "Rezultatele ads lângă statisticile organice",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Postări care aduc clienți.",
        gain: "Inbox-ul califică. Tu închizi. Lead-urile calificate sunt nelimitate.",
        features: [
          "Agent de lead-uri antrenat pe site-ul tău public",
          "Lead-uri calificate nelimitate — fără pachet extra",
          "Răspunde la mesaje și comentarii noi, după ce îl pornești",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Pachete, când ai nevoie",
    packsLead: "Le cumperi oricând. Nu sunt abonament. Expiră în 30 de zile sau când s-au consumat cele 30 de unități.",
    packs: [
      { id: "photos", name: "30 de poze", priceCents: 250, body: "Postere și poze de produs din chat. Le folosești pe Studio, Promovare sau Creștere." },
      { id: "videos", name: "30 de video", priceCents: 500, body: "Clipuri de 5 secunde, gata pentru Reels și TikTok. Aceleași pachete pe orice plan." },
    ],
    gainsTitle: "Ce câștigi, concret",
    gains: [
      { title: "Timpul înapoi", body: "Un chat în loc de șase aplicații. Dictezi brieful. Confirmi. Calendarul se umple." },
      { title: "Conținut care pleacă", body: "Poze, clipuri, descrieri și o lună de postări din site-ul sau produsul pe care îl ai deja." },
      { title: "Bugetul rămâne al tău", body: "Reclama pornește doar când apeși butonul negru. Cheltuiala e a ta. Nu punem comision de media." },
      { title: "Oameni, nu vanitate", body: "Pe Creștere, agentul răspunde cui ți-a scris. Primești nume, telefon și un fir — nu doar vizualizări." },
    ],
    compareTitle: "Față de cum se făcea",
    compare: [
      { title: "Față de o agenție", body: "Tu ții conturile, vocea și cheltuiala. Studio-ul e operatorul — nu aștepți o săptămână un carusel." },
      { title: "Față de angajat intern", body: "Specialistul de setup e opțional. Zi de zi vorbești cu Posty, nu cu un salariu nou." },
      { title: "Față de postat de mână", body: "Ora bună pe fiecare rețea, o descriere adaptată, 30 de zile puse. Nu copiezi până la miezul nopții." },
    ],
    faqs: [
      { q: "Prețurile includ TVA?", a: "Nu. Sunt fără TVA 21%. Taxa se adaugă la plată." },
      { q: "Pot începe pe Studio și să urc?", a: "Da. Promovare include Studio. Creștere include Promovare. Pachetele rămân ale tale." },
      { q: "Am nevoie de pachet ca să postez?", a: "Nu. Studio postează fișierele pe care le ai. Pachetele sunt doar pentru pozele și video-urile generate în chat." },
      { q: "Pot folosi lead-uri fără Creștere?", a: "Nu. Agentul e pe Creștere. Nu există pachet separat de lead-uri." },
      { q: "Ce se întâmplă după 15 octombrie?", a: "Te preînregistrezi acum și prima lună e gratuită. Apoi planul ales se reînnoiește lunar sau anual." },
    ],
  },
  de: {
    kicker: "Preise",
    title: "Ein Studio. Drei Einstiege.",
    lead: "Du sprichst. Es postet, wirbt und bringt dir Menschen. Preise ohne 21 % MwSt. Der erste Monat ist frei, wenn du dich vormerkst.",
    monthly: "Monatlich",
    annual: "Jährlich",
    perMonth: "/ Monat",
    perYear: "/ Jahr",
    saveYear: "{amount} sparen gegenüber monatlich",
    vat: "Preise ohne 21 % MwSt. Pakete kaufst du jederzeit. Sie gelten 30 Tage oder bis sie aufgebraucht sind.",
    featured: "Am vollständigsten",
    includes: "Alles aus {plan}, plus",
    waitlist: "Vormerken — erster Monat frei",
    launch: "Start 15. Oktober",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "Du sprichst. Es postet.",
        gain: "Ein Monat Content aus einem Briefing — nicht aus 30 Logins.",
        features: [
          "Assistent im Chat und per Stimme, in deiner Sprache",
          "Publizieren und planen auf allen verbundenen Netzen",
          "30-Tage-Plan, Katalog von der Website, beste Zeit pro Netz",
          "Statistiken, Nachrichten und Kommentare in einem Posteingang",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Organic, dann bezahlt.",
        gain: "Du startest die Kampagne. Du stellst niemanden für ein Spark oder ein Boost ein.",
        features: [
          "Ads aus demselben Chat — Spark, Views, Traffic",
          "Maximal 3 Ads-Konten",
          "Ads-Ergebnisse neben den organischen Zahlen",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Posts, die Kunden bringen.",
        gain: "Der Posteingang qualifiziert. Du schließt ab. Qualifizierte Leads sind unbegrenzt.",
        features: [
          "Lead-Agent, trainiert auf deiner öffentlichen Website",
          "Unbegrenzt qualifizierte Leads — kein Extra-Paket",
          "Antwortet auf neue Nachrichten und Kommentare, sobald er an ist",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Pakete, wenn du sie brauchst",
    packsLead: "Jederzeit kaufen. Kein Abo. 30 Tage oder bis die 30 Einheiten weg sind.",
    packs: [
      { id: "photos", name: "30 Fotos", priceCents: 250, body: "Poster und Produktfotos aus dem Chat. Auf Studio, Promovare oder Creștere." },
      { id: "videos", name: "30 Videos", priceCents: 500, body: "5-Sekunden-Clips für Reels und TikTok. Dieselben Pakete auf jedem Plan." },
    ],
    gainsTitle: "Was du wirklich bekommst",
    gains: [
      { title: "Zeit zurück", body: "Ein Chat statt sechs Apps. Diktier das Briefing. Bestätige. Der Kalender füllt sich." },
      { title: "Content, der rausgeht", body: "Fotos, Clips, Captions und ein Monat Posts von der Site oder dem Produkt, das du schon hast." },
      { title: "Budget bleibt deins", body: "Ads starten nur mit dem schwarzen Knopf. Der Spend ist deiner. Keine Media-Fee von uns." },
      { title: "Menschen, keine Eitelkeit", body: "Auf Creștere antwortet der Agent Leuten, die dir geschrieben haben. Namen, Telefon, Thread — nicht nur Views." },
    ],
    compareTitle: "Gegenüber dem alten Weg",
    compare: [
      { title: "Vs. Agentur", body: "Konten, Stimme und Spend bleiben bei dir. Das Studio operiert — du wartest keine Woche auf ein Karussell." },
      { title: "Vs. Festanstellung", body: "Ein Spezialist fürs Setup ist optional. Im Alltag sprichst du mit Posty, nicht mit einem neuen Gehalt." },
      { title: "Vs. von Hand posten", body: "Beste Zeit pro Netz, eine angepasste Caption, 30 Tage gebucht. Kein Copy-Paste bis Mitternacht." },
    ],
    faqs: [
      { q: "Ist MwSt. drin?", a: "Nein. Preise ohne 21 % rumänische MwSt. Die Steuer kommt an der Kasse dazu." },
      { q: "Kann ich mit Studio starten und upgraden?", a: "Ja. Promovare enthält Studio. Creștere enthält Promovare. Pakete bleiben bei dir." },
      { q: "Brauche ich ein Paket zum Posten?", a: "Nein. Studio postet Dateien, die du schon hast. Pakete sind nur für KI-Fotos und -Videos im Chat." },
      { q: "Kann ich Leads ohne Creștere nutzen?", a: "Nein. Der Lead-Agent gehört zu Creștere. Es gibt kein separates Lead-Paket." },
      { q: "Was passiert nach dem 15. Oktober?", a: "Jetzt vormerken, erster Monat frei. Danach läuft der gewählte Plan monatlich oder jährlich." },
    ],
  },
  it: {
    kicker: "Prezzi",
    title: "Uno studio. Tre ingressi.",
    lead: "Gli parli. Pubblica, promuove e ti porta persone. Prezzi IVA 21% esclusa. Il primo mese è gratis se ti pre-iscrivi.",
    monthly: "Mensile",
    annual: "Annuale",
    perMonth: "/ mese",
    perYear: "/ anno",
    saveYear: "Risparmi {amount} rispetto al mensile",
    vat: "Prezzi IVA 21% esclusa. I pacchetti si comprano quando vuoi. Durano 30 giorni o fino a esaurimento.",
    featured: "Il più completo",
    includes: "Tutto di {plan}, più",
    waitlist: "Pre-iscriviti — primo mese gratis",
    launch: "Lancio 15 ottobre",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "Tu parli. Pubblica.",
        gain: "Un mese di contenuti da un brief — non da 30 login.",
        features: [
          "Assistente in chat e in voce, nella tua lingua",
          "Pubblica e programma su tutte le reti collegate",
          "Piano di 30 giorni, catalogo dal sito, orario migliore per rete",
          "Statistiche, messaggi e commenti in una sola inbox",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Organico, poi a pagamento.",
        gain: "Parti tu la campagna. Non assumi un ads manager per uno Spark o un boost.",
        features: [
          "Ads dalla stessa chat — Spark, views, traffico",
          "Massimo 3 account ads",
          "Risultati ads accanto alle stats organiche",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Post che portano clienti.",
        gain: "La inbox qualifica. Tu chiudi. I lead qualificati sono illimitati.",
        features: [
          "Agente lead addestrato sul tuo sito pubblico",
          "Lead qualificati illimitati — nessun pacchetto extra",
          "Risponde a messaggi e commenti nuovi dopo che lo accendi",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Pacchetti, quando servono",
    packsLead: "Li compri quando vuoi. Non sono un abbonamento. Scadono in 30 giorni o quando finiscono le 30 unità.",
    packs: [
      { id: "photos", name: "30 foto", priceCents: 250, body: "Poster e still di prodotto dalla chat. Su Studio, Promovare o Creștere." },
      { id: "videos", name: "30 video", priceCents: 500, body: "Clip da 5 secondi, pronte per Reels e TikTok. Stessi pacchetti su ogni piano." },
    ],
    gainsTitle: "Cosa ottieni davvero",
    gains: [
      { title: "Il tempo indietro", body: "Una chat invece di sei app. Ditta il brief. Confermi. Il calendario si riempie." },
      { title: "Contenuti che partono", body: "Foto, clip, didascalie e un mese di post dal sito o dal prodotto che hai già." },
      { title: "Il budget resta tuo", body: "Le ads partono solo col pulsante nero. Lo spend è tuo. Nessuna fee media da noi." },
      { title: "Persone, non vanità", body: "Su Creștere l’agente risponde a chi ti ha scritto. Nomi, telefono, thread — non solo views." },
    ],
    compareTitle: "Rispetto al modo vecchio",
    compare: [
      { title: "Vs un’agenzia", body: "Tieni account, voce e spend. Lo studio opera — non aspetti una settimana un carosello." },
      { title: "Vs assumere in house", body: "Lo specialista per il setup è opzionale. Ogni giorno parli con Posty, non con un nuovo stipendio." },
      { title: "Vs postare a mano", body: "Orario migliore per rete, una didascalia adattata, trenta giorni prenotati. Niente copia-incolla a mezzanotte." },
    ],
    faqs: [
      { q: "L’IVA è inclusa?", a: "No. Prezzi IVA rumena 21% esclusa. L’imposta si aggiunge al pagamento." },
      { q: "Posso partire da Studio e salire?", a: "Sì. Promovare include Studio. Creștere include Promovare. I pacchetti restano tuoi." },
      { q: "Mi serve un pacchetto per postare?", a: "No. Studio pubblica i file che hai già. I pacchetti sono solo per foto e video generati in chat." },
      { q: "Posso usare i lead senza Creștere?", a: "No. L’agente lead è su Creștere. Non c’è un pacchetto lead separato." },
      { q: "Cosa succede dopo il 15 ottobre?", a: "Pre-iscriviti ora e il primo mese è gratis. Poi il piano scelto si rinnova mensile o annuale." },
    ],
  },
  fr: {
    kicker: "Tarifs",
    title: "Un studio. Trois portes.",
    lead: "Tu lui parles. Il publie, pousse et t’amène des gens. Prix hors TVA 21 %. Le premier mois est offert si tu te pré-inscris.",
    monthly: "Mensuel",
    annual: "Annuel",
    perMonth: "/ mois",
    perYear: "/ an",
    saveYear: "Économise {amount} vs le mensuel",
    vat: "Prix hors TVA 21 %. Les packs s’achètent quand tu veux. Ils durent 30 jours ou jusqu’à épuisement.",
    featured: "Le plus complet",
    includes: "Tout de {plan}, plus",
    waitlist: "Pré-inscription — premier mois offert",
    launch: "Lancement 15 octobre",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "Tu parles. Il publie.",
        gain: "Un mois de contenu à partir d’un brief — pas de 30 connexions.",
        features: [
          "Assistant en chat et à la voix, dans ta langue",
          "Publie et programme sur tous les réseaux connectés",
          "Plan 30 jours, catalogue depuis le site, meilleure heure par réseau",
          "Stats, messages et commentaires dans une seule boîte",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Organique, puis payant.",
        gain: "Tu lances la campagne. Tu n’embauches pas un ads manager pour un Spark ou un boost.",
        features: [
          "Pubs depuis le même chat — Spark, vues, trafic",
          "3 comptes ads maximum",
          "Résultats pubs à côté des stats organiques",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Des posts qui amènent des clients.",
        gain: "La boîte qualifie. Tu closes. Les leads qualifiés sont illimités.",
        features: [
          "Agent leads formé sur ton site public",
          "Leads qualifiés illimités — pas de pack extra",
          "Répond aux nouveaux messages et commentaires une fois allumé",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Packs, quand tu en as besoin",
    packsLead: "Achète à tout moment. Pas un abonnement. 30 jours ou jusqu’à épuisement des 30 unités.",
    packs: [
      { id: "photos", name: "30 photos", priceCents: 250, body: "Affiches et visuels produit depuis le chat. Sur Studio, Promovare ou Creștere." },
      { id: "videos", name: "30 vidéos", priceCents: 500, body: "Clips de 5 secondes, prêts pour Reels et TikTok. Les mêmes packs sur chaque offre." },
    ],
    gainsTitle: "Ce que tu gagnes vraiment",
    gains: [
      { title: "Ton temps", body: "Un chat au lieu de six apps. Dicte le brief. Confirme. Le calendrier se remplit." },
      { title: "Du contenu qui part", body: "Photos, clips, légendes et un mois de posts depuis le site ou le produit que tu as déjà." },
      { title: "Le budget reste le tien", body: "La pub part seulement avec le bouton noir. Le spend est le tien. Pas de frais média de notre côté." },
      { title: "Des gens, pas de la vanité", body: "Sur Creștere, l’agent répond à ceux qui t’ont écrit. Noms, téléphone, fil — pas seulement des vues." },
    ],
    compareTitle: "Face à l’ancienne façon",
    compare: [
      { title: "Vs une agence", body: "Tu gardes les comptes, la voix et le spend. Le studio opère — tu n’attends pas une semaine un carrousel." },
      { title: "Vs embaucher", body: "Le spécialiste pour le setup est optionnel. Au quotidien tu parles à Posty, pas à un nouveau salaire." },
      { title: "Vs poster à la main", body: "Meilleure heure par réseau, une légende adaptée, trente jours réservés. Pas de copier-coller jusqu’à minuit." },
    ],
    faqs: [
      { q: "La TVA est incluse ?", a: "Non. Prix hors TVA roumaine 21 %. La taxe s’ajoute au paiement." },
      { q: "Je peux commencer sur Studio et monter ?", a: "Oui. Promovare inclut Studio. Creștere inclut Promovare. Les packs restent à toi." },
      { q: "Il me faut un pack pour poster ?", a: "Non. Studio publie les fichiers que tu as déjà. Les packs sont pour les photos et vidéos générées dans le chat." },
      { q: "Je peux utiliser les leads sans Creștere ?", a: "Non. L’agent leads est sur Creștere. Il n’y a pas de pack leads à part." },
      { q: "Et après le 15 octobre ?", a: "Pré-inscris-toi maintenant, le premier mois est offert. Ensuite l’offre choisie se renouvelle au mois ou à l’année." },
    ],
  },
  es: {
    kicker: "Precios",
    title: "Un estudio. Tres entradas.",
    lead: "Le hablas. Publica, promociona y te trae gente. Precios sin IVA del 21%. El primer mes es gratis si te preinscribes.",
    monthly: "Mensual",
    annual: "Anual",
    perMonth: "/ mes",
    perYear: "/ año",
    saveYear: "Ahorras {amount} frente al mensual",
    vat: "Precios sin IVA del 21%. Los packs se compran cuando quieras. Duran 30 días o hasta que se gasten.",
    featured: "El más completo",
    includes: "Todo de {plan}, más",
    waitlist: "Preinscríbete — primer mes gratis",
    launch: "Lanzamiento 15 de octubre",
    plans: [
      {
        id: "studio",
        name: "Studio",
        tag: "Tú hablas. Publica.",
        gain: "Un mes de contenido desde un brief — no desde 30 inicios de sesión.",
        features: [
          "Asistente en chat y por voz, en tu idioma",
          "Publica y programa en todas las redes conectadas",
          "Plan de 30 días, catálogo del sitio, mejor hora por red",
          "Estadísticas, mensajes y comentarios en una sola bandeja",
        ],
        monthlyCents: 1500,
        annualCents: 15000,
      },
      {
        id: "promote",
        name: "Promovare",
        tag: "Orgánico, luego de pago.",
        gain: "Tú lanzas la campaña. No contratas a alguien de ads para un Spark o un boost.",
        features: [
          "Anuncios desde el mismo chat — Spark, views, tráfico",
          "Máximo 3 cuentas ads",
          "Resultados ads junto a las stats orgánicas",
        ],
        monthlyCents: 2100,
        annualCents: 23000,
      },
      {
        id: "growth",
        name: "Creștere",
        tag: "Posts que traen clientes.",
        gain: "La bandeja cualifica. Tú cierras. Los leads cualificados son ilimitados.",
        features: [
          "Agente de leads entrenado en tu sitio público",
          "Leads cualificados ilimitados — sin pack extra",
          "Responde a mensajes y comentarios nuevos cuando lo enciendes",
        ],
        monthlyCents: 4000,
        annualCents: 43000,
        featured: true,
      },
    ],
    packsTitle: "Packs, cuando los necesitas",
    packsLead: "Cómpralos cuando quieras. No son suscripción. Caducan a los 30 días o al gastar las 30 unidades.",
    packs: [
      { id: "photos", name: "30 fotos", priceCents: 250, body: "Pósters y fotos de producto desde el chat. En Studio, Promovare o Creștere." },
      { id: "videos", name: "30 vídeos", priceCents: 500, body: "Clips de 5 segundos, listos para Reels y TikTok. Los mismos packs en cada plan." },
    ],
    gainsTitle: "Lo que ganas de verdad",
    gains: [
      { title: "Tu tiempo de vuelta", body: "Un chat en lugar de seis apps. Dicta el brief. Confirma. El calendario se llena." },
      { title: "Contenido que sale", body: "Fotos, clips, pies de foto y un mes de posts desde el sitio o el producto que ya tienes." },
      { title: "El presupuesto es tuyo", body: "El anuncio arranca solo con el botón negro. El spend es tuyo. Sin comisión de media nuestra." },
      { title: "Personas, no vanidad", body: "En Creștere el agente responde a quien te escribió. Nombre, teléfono e hilo — no solo views." },
    ],
    compareTitle: "Frente a cómo se hacía",
    compare: [
      { title: "Vs una agencia", body: "Tú guardas las cuentas, la voz y el spend. El estudio opera — no esperas una semana un carrusel." },
      { title: "Vs contratar en casa", body: "El especialista de setup es opcional. Día a día hablas con Posty, no con un sueldo nuevo." },
      { title: "Vs publicar a mano", body: "Mejor hora por red, un pie adaptado, treinta días reservados. Sin copiar y pegar hasta medianoche." },
    ],
    faqs: [
      { q: "¿El IVA está incluido?", a: "No. Precios sin IVA rumano del 21%. El impuesto se añade al pagar." },
      { q: "¿Puedo empezar en Studio y subir?", a: "Sí. Promovare incluye Studio. Creștere incluye Promovare. Los packs se quedan contigo." },
      { q: "¿Necesito un pack para publicar?", a: "No. Studio publica los archivos que ya tienes. Los packs son solo para fotos y vídeos generados en el chat." },
      { q: "¿Puedo usar leads sin Creștere?", a: "No. El agente de leads va con Creștere. No hay un pack de leads aparte." },
      { q: "¿Qué pasa después del 15 de octubre?", a: "Preinscríbete ahora y el primer mes es gratis. Luego el plan elegido se renueva al mes o al año." },
    ],
  },
};

export function pricingCopy(locale: string) {
  return pickLocale(COPY, locale);
}

export function annualSaveCents(plan: PricingPlanCopy) {
  return plan.monthlyCents * 12 - plan.annualCents;
}

export function priceLabel(cents: number, locale: string) {
  return formatEurFromCents(cents, locale);
}
