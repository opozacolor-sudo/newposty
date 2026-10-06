import type { GuideDoc } from "./types";

export const IT: GuideDoc = {
  title: "Guida utente",
  subtitle:
    "Tutto quello che puoi fare in posty.now: assistente, connessioni, post, analytics, messaggi, lead, ads e voce — passo passo, con esempi.",
  toc: "Indice",
  tipLabel: "Consiglio",
  tryLabel: "Dillo all’assistente",
  ctaTitle: "Pronto a provarlo?",
  ctaButton: "Apri l’assistente",
  downloadLabel: "Scarica il PDF",
  pdfHref: "/manual-posty-now-it.pdf",
  quoteStart: "«",
  quoteEnd: "»",
  networkLabels: {
    can: "Può creare",
    boost: "Boost",
    audiences: "Audience",
    stats: "Analytics",
  },
  sections: [
    {
      id: "start",
      title: "Cos’è posty.now",
      body: [
        "posty.now è uno studio con assistente AI. Dici cosa vuoi — a testo o a voce — e Posty scrive, programma e pubblica sui network collegati. Non salti tra app per mettere la stessa foto su Instagram, TikTok e Facebook.",
        "Accanto ai post organici ci sono le ads a pagamento, la inbox (messaggi e commenti) e un agente lead che addestri sul tuo sito. Post e ads sono due lavori diversi; lo studio li tiene entrambi, senza mescolarli.",
        "In alto: Assistente, Connessioni, Post, Analytics, Messaggi, Lead, Ads e Guida. Messaggi si apre in due tab: messaggi diretti e commenti. In basso: ora locale, lingua e account. Su Team scegli anche il cliente — connessioni, post e lead appartengono al cliente selezionato. Ogni programmazione segue quest’orologio, non un altro fuso.",
      ],
      tips: [
        {
          title: "Inizia dalle connessioni",
          body: "L’assistente può scrivere subito. Per pubblicare, vedere i numeri o rispondere in inbox, collega prima i network in Connessioni — SOCIAL per i post, ADS se fai ads.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Connessioni: post",
      body: [
        "Vai su Connessioni. Sotto SOCIAL collega Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky e Reddit.",
        "Clicca Connect, autorizza, fatto. Facebook chiede una Pagina, LinkedIn un profilo o una pagina aziendale, Pinterest una board, Google Business una sede.",
        "Bluesky non ha un login classico: serve un App Password, non la password del account. Il link di aiuto sulla card spiega come crearne uno.",
        "Puoi collegare più account sullo stesso network. Quello che è collegato qui è ciò che l’assistente può pubblicare — e ciò che compare in Post, Analytics e Messaggi.",
      ],
      tips: [
        {
          title: "Non sono ads",
          body: "Collegare Instagram per i post non apre Meta Ads. Gli account a pagamento stanno più in basso in Connessioni, sotto ADS.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Connessioni: ads",
      lead: "I post danno portata organica. Le ads pagano per essere viste. In posty.now ci stanno entrambi — si collegano separatamente.",
      body: [
        "Sempre in Connessioni, più in basso sotto ADS: Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads e OpenAI Ads.",
        "Un account ads non pubblica nel feed. Sblocca le campagne a pagamento: cosa gira, quanto spendi, cosa torna. L’elenco campagne è in Ads nella barra in alto. Le campagne nuove si chiedono all’Assistente.",
        "OpenAI Ads non ha una finestra di login: incolli una chiave API da ChatGPT Ads Manager. Quelle ads sono card in ChatGPT (titolo, testo, immagine, link), solo immagini statiche, budget fisso per tutta la campagna (minimo 1 $), e idoneità business — al momento Stati Uniti, Canada, Australia e Nuova Zelanda.",
      ],
      tips: [
        {
          title: "Organico + a pagamento su Meta",
          body: "Se posti su Instagram/Facebook e fai anche campagne a pagamento, collega entrambi: SOCIAL (Instagram, Facebook) e ADS (Meta Ads). Uno senza l’altro è metà del quadro.",
        },
        {
          title: "Il creativo di campagna non è un file di serie",
          body: "Una promo o un’ads datata si carica da sola, con un orario chiaro. Mescolata ad altri 29 file del quotidiano, può uscire il giorno sbagliato.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "Cosa supporta ogni rete ads",
      body: [
        "Ogni piattaforma ads lavora in modo diverso. La card in Connessioni → ADS mostra cosa puoi creare, se puoi fare boost di un contenuto esistente, quali audience hai e quanto sono complete le statistiche.",
        "Boost significa mettere soldi dietro qualcosa che esiste già (un post, un Pin, un tweet). Una campagna standalone è una nuova ads. Non tutte le reti fanno entrambi.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Campagne complete: Campaign → Ad set → Ad.",
          boost: "Sì — boost di post organici esistenti.",
          audiences: "Custom e Lookalike.",
          stats: "Spend, impression, reach, CTR, CPC, CPM, ROAS, conversioni.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) e Display (Responsive Display Ads).",
          boost: "Non applicabile — Google non fa boost di un post social.",
          audiences: "Nessun targeting audience da Posty; Search e Display.",
          stats: "Report aggregati completi.",
        },
        {
          name: "LinkedIn Ads",
          can: "Immagine, video, carosello, documento, evento, text ad, conversation ads e altro.",
          boost: "Sì.",
          audiences: "Liste contatti/aziende e retargeting — sola lettura; non crei nuove audience da Posty.",
          stats: "Spend, CPC, CPM, più job title, seniority, settore, dimensione azienda.",
        },
        {
          name: "TikTok Ads",
          can: "Campagne video standalone.",
          boost: "Spark Ads — promuovi contenuto nativo TikTok.",
          audiences: "Custom e Lookalike.",
          stats: "Spend, view, CTR, CPM, quasi in tempo reale.",
        },
        {
          name: "Pinterest Ads",
          can: "Nuovi Promoted Pins.",
          boost: "Sì — promuovi Pin organici esistenti.",
          audiences: "Base: demografia e paese.",
          stats: "Spend, save, closeup, clic.",
        },
        {
          name: "X Ads",
          can: "Boost di tweet esistenti o campagne standalone (testo fino a 280 caratteri + card con link).",
          boost: "Sì.",
          audiences: "Luogo e lingua. Le liste email sono avanzate (almeno 100 utenti attivi di recente).",
          stats: "Spend, CPE, CPM, clic sul link.",
        },
        {
          name: "OpenAI Ads",
          can: "Card in ChatGPT Free/Go: titolo, testo, immagine, URL. Niente video.",
          boost: "Non applicabile.",
          audiences: "Solo luogo (paese/regione).",
          stats: "Impression, clic, spend, giornaliero.",
          note: "Solo budget sull’intera durata, minimo 1 $. Idoneità business e mercati: Stati Uniti, Canada, Australia, Nuova Zelanda.",
        },
      ],
      tips: [
        {
          title: "Dove si lavora sulle ads",
          body: "La connessione è in Connessioni → ADS. Elenco campagne e spend sono in Ads. Il contenuto organico — foto, video, serie, promo datate — lo lanci dall’Assistente. Non chiedere all’assistente «quanto ho speso su Meta»; apri Ads.",
        },
      ],
    },
    {
      id: "assistant",
      title: "L’assistente",
      body: [
        "L’assistente è il cuore dello studio. Chiedi idee, testi, pubblicazione, programmazione, un mese di contenuti o una promo in una data precisa.",
        "Scrivi in modo naturale, come a un collega. Niente comandi speciali. Indica i network, quando deve uscire e se vuoi un testo. Se non indichi un network (e non è una serie per tutti), Posty chiede — non indovina.",
        "Allega fino a 50 foto o video, 100 MB ciascuno. L’ordine del picker è l’ordine della serie. Aspetta che gli upload finiscano (badge arancione), poi invia.",
        "Nuova chat svuota il thread. Usala quando cambi argomento o vuoi azzerare «non chiedere più».",
      ],
      examples: [
        "Dammi tre testi Instagram per un caffè in un lunedì di pioggia.",
        "Pubblica questo ora su Instagram e TikTok.",
        "Da domani, uno al giorno, su ogni network, all’orario migliore.",
      ],
      tips: [
        {
          title: "Un messaggio, un’intenzione chiara",
          body: "«Pubblica questo come reel Instagram e TikTok ora, e domani alle 9 mettilo in story su Instagram» funziona in un messaggio. Mischiare una promo del venerdì con 20 foto del mese, no.",
        },
      ],
    },
    {
      id: "voice",
      title: "Dettatura vocale",
      featured: "voice",
      lead: "Parli. Posty scrive. Il modo più veloce per una istruzione lunga senza tastiera.",
      body: [
        "Il microfono accanto agli allegati non è un extra — è il modo naturale di lavorare in posty.now. Tocchi, parli come a un collega, le parole appaiono, correggi una parola, invii. Ideale con 50 file, al telefono, per una campagna datata con network e tono — o quando semplicemente non vuoi digitare.",
        "Funziona meglio in Chrome o Edge. La prima volta il browser chiede il microfono: Allow. Se hai premuto Block, lucchetto nella barra degli indirizzi, consenti il microfono, ricarica.",
        "Finché il microfono è arancione, Posty continua ad ascoltare — puoi fare una pausa e riprendere. Il placeholder diventa «Listening… speak now». Tocca di nuovo il microfono per fermarti, poi Invia.",
        "Puoi dettare in italiano. Se una frase esce storta, la correggi nel campo — non ricominci da capo. Gli allegati restano; la voce completa l’istruzione.",
      ],
      examples: [
        "Da domani, uno al giorno, su Instagram, TikTok e Facebook, all’orario migliore, senza testo.",
        "Programma questa foto venerdì alle 10, è la promo d’autunno, solo Instagram e Facebook, con una riga di vendita breve.",
      ],
      tips: [
        {
          title: "Dillo tutto in una frase",
          body: "Network, giorno, orario o «orario migliore», testo sì o no, stesso file ovunque o uno per network. Più la frase è completa, più la card di conferma è pulita.",
        },
        {
          title: "Non compare nulla nel campo?",
          body: "Quasi sempre è il permesso del microfono, non un microfono rotto. Chrome → lucchetto → Microfono → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Testi, idee, voce del brand",
      body: [
        "Se vuoi solo ispirazione, dillo. Posty offre 1–3 opzioni e non pubblica.",
        "Un testo si scrive solo se lo chiedi («scrivi una descrizione», «caption»). Se mandi una foto e dici solo «pubblica su Instagram ora», esce senza testo — non ricicla un vecchio caption del thread.",
        "Quando fornisci tu il testo, viene usato esatto. Se è troppo lungo per un network (280 caratteri su X), viene tagliato al limite e te lo dice.",
        "Puoi descrivere la voce del brand: «siamo un panificio caldo, niente emoji, niente slang». Posty la tiene nella conversazione così le bozze successive restano nel tono.",
      ],
      examples: [
        "Scrivi una descrizione breve, cinque hashtag, tono caldo.",
        "Siamo uno studio fotografico. Voce: chiara, niente superlativi. Ricordatelo.",
      ],
      tips: [
        {
          title: "Il tuo testo vince",
          body: "Se hai già il copy di campagna, incollalo o dettalo. Posty non lo riscrive. Chiedi all’AI solo quando vuoi varianti.",
        },
      ],
    },
    {
      id: "publish",
      title: "Pubblica ora",
      body: [
        "Allega un media se il network lo richiede (Instagram, TikTok, YouTube, Pinterest). Indica i network. Conferma sulla card.",
        "«Tutti i network», «dappertutto», «everywhere» significa tutti gli account di pubblicazione collegati. Puoi escludere: «dappertutto tranne LinkedIn».",
        "Non è live finché non vedi la spunta verde su quel network. «Publishing now» su TikTok significa che sta ancora elaborando — non è un errore. Aspetta la spunta.",
      ],
      examples: [
        "Pubblica questo video ora su Instagram come reel e su TikTok.",
        "Posta su ogni network tranne Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Programma a un orario preciso",
      body: [
        "Indica il giorno e l’ora. Posty usa l’orologio in basso (la tua ora locale), non un fuso nascosto. «Domani alle 18:00» è 18:00 su quell’orologio.",
        "Puoi combinare: story ora su Instagram e TikTok, e il reel domani alle 12:00 su Instagram.",
      ],
      examples: [
        "Programma questo domani alle 18:00 su TikTok e Instagram.",
        "Venerdì 15:00 su LinkedIn, questo testo, senza foto.",
      ],
      tips: [
        {
          title: "Controlla l’orologio",
          body: "Se viaggi o sei in VPN, guarda Ora locale in basso nella barra dello studio. Le programmazioni seguono quell’orologio.",
        },
      ],
    },
    {
      id: "best-time",
      title: "Orario migliore",
      body: [
        "Di «all’orario migliore», «orario ottimale», «peak time». Posty non inventa le 18:00. Prende la prossima finestra di picco dalla ricerca di settore (Sprout, Hootsuite, Later, Buffer), nel tuo fuso, come approssimazione dell’audience locale.",
        "Non sono le tue analytics personali — la dashboard dei post è giornaliera, non oraria. È un default solido; se sai che il tuo pubblico è sveglio di notte, indica l’ora. Un orario esplicito vince sempre.",
        "Ogni network ha il suo ritmo. Instagram in settimana tende verso le ~11:00 (stories ~12:00), riserva serale ~19:00. TikTok verso le ~19:00. LinkedIn salta i weekend. Instagram e TikTok «all’orario migliore» possono uscire a ore diverse — è voluto.",
      ],
      examples: [
        "Domani all’orario migliore, su Instagram e TikTok.",
        "Sposta il post di venerdì all’orario migliore.",
      ],
    },
    {
      id: "series",
      title: "Un mese di contenuti: serie quotidiana",
      body: [
        "Allega fino a 50 file, nell’ordine in cui devono uscire. Di «da domani, uno al giorno, su ogni network, all’orario migliore» o «100 post carosello con 5 foto miste ciascuno». Foto e video si possono mescolare.",
        "Il default è cross, non copia-incolla. Lo stesso giorno ogni network riceve un file diverso. Facebook può prendere il media 1, X il 2, TikTok il 3. Lo stesso file non esce su due network quel giorno. Nel mese i file ruotano così il calendario resta pieno.",
        "Se vuoi lo stesso file su tutti i network quel giorno, dillo: «lo stesso su tutti». Altrimenti resta cross.",
        "TikTok accetta foto (modalità foto / carosello) e video. YouTube salta le foto — niente still. La card di conferma mostra, per giorno, quale network prende quale file. Le serie grandi vogliono sempre la card; non la saltano.",
      ],
      examples: [
        "Da domani, uno al giorno, su ogni network, all’orario migliore.",
        "Questi 10 video, lo stesso file su ogni network ogni giorno, alle 19:00.",
      ],
      tips: [
        {
          title: "L’ordine del picker conta",
          body: "Il file 1 è il giorno 1. Non prenderli a caso se hai già un ordine. Puoi togliere un allegato con X prima di inviare.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Promo, lanci, date precise",
      lead: "Una campagna non è una serie. Una data precisa non è «uno al giorno».",
      body: [
        "Se hai una promo, un lancio, un Black Friday, un evento — carica quell’asset da solo. Di chiaramente quando e su quali network. Un file, un’istruzione, una conferma.",
        "Se metti il creativo di campagna accanto ad altre 29 foto del quotidiano, la serie lo tratta come un altro giorno del mese. Può uscire martedì invece di venerdì, su TikTok invece di Facebook, o accanto a un reel che non c’entra con l’offerta.",
        "Stessa regola se l’asset è pensato per le ads. La serie quotidiana è contenuto organico a cascata. Un’ads a pagamento, un boost, una promo con scadenza — a parte, con una data.",
      ],
      examples: [
        "Programma questa foto il 15 settembre alle 10:00, Instagram e Facebook, è la promo d’autunno. Questo testo, esatto.",
        "Pubblica il video di lancio venerdì alle 12:00 su Instagram come reel e su TikTok. Non fa parte della serie.",
      ],
      tips: [
        {
          title: "Due lavori, due messaggi",
          body: "Prima il lotto da 50 (il mese). Poi una nuova chat o un nuovo messaggio, un solo file, la promo. Non legarli nello stesso upload.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formati per network",
      body: [
        "Il reel esiste su Instagram, non su TikTok. La story esiste su Instagram (e Facebook), non su TikTok. «Su Instagram come reel e su TikTok» = Reel Instagram + video TikTok normale.",
        "«Instagram come story e TikTok» = Story Instagram + video TikTok. «Come video su Instagram e TikTok» = Instagram pubblica il video come Reel in automatico, TikTok come video.",
        "TikTok accetta anche le foto (una foto o un carosello), non solo il video.",
        "Indica un formato solo sul network che lo ha. Niente reel su YouTube, niente story su LinkedIn.",
        "Instagram, TikTok, YouTube e Pinterest richiedono un media. LinkedIn, X, Threads, Bluesky, Facebook e Reddit possono essere testo. X taglia a 280 caratteri. Non mescolare immagine e video nello stesso tweet.",
      ],
      examples: [
        "Questo video: reel Instagram e TikTok, ora. E domani alle 9:00, story Instagram.",
      ],
    },
    {
      id: "confirm",
      title: "La card di conferma",
      body: [
        "Prima che esca qualcosa, vedi una card: network, orario, anteprima, e per le serie uno slot al giorno. Conferma o Annulla / modifica.",
        "Puoi spuntare «Don’t ask again in this chat» se vuoi velocità. Vale solo per questo thread; una nuova chat lo azzera. Le serie grandi vogliono comunque occhi sulla card — è troppo facile programmare 50 giorni storti.",
        "Se annulli, invia una nuova istruzione. La conferma scade dopo qualche ora; se hai lasciato il tab aperto tutta la notte, rimanda il comando.",
      ],
    },
    {
      id: "manage",
      title: "Annulla, riprogramma, modifica",
      body: [
        "Per un post programmato dalla chat puoi chiedere di annullarlo, spostarlo o cambiare il testo. Identificalo per network, orario o un pezzo di caption.",
        "Riprogrammare può essere un nuovo orario o «all’orario migliore».",
      ],
      examples: [
        "Annulla il post TikTok di domani.",
        "Sposta il post Instagram di venerdì alle 19:00.",
        "Cambia il testo di lunedì in: …",
      ],
    },
    {
      id: "posts-list",
      title: "Post (cronologia)",
      body: [
        "Post nella barra è il tuo calendario: bozze, programmati e pubblicati, solo per gli account collegati qui. Filtri per network, account, stato, fonte e periodo.",
        "Da qui controlli se una serie è uscita, se uno slot è ancora in attesa, o apri il post sul network. Pubblicare e programmare restano nell’Assistente; questa pagina è la cronologia.",
      ],
    },
    {
      id: "messages",
      title: "Messaggi e commenti",
      body: [
        "Messaggi nella barra ha due tab: messaggi diretti e commenti. Vedi i thread degli account collegati e puoi rispondere da questa pagina, senza aprire l’app del network.",
        "Filtri per piattaforma, account e stato. Compare qualcosa solo se un account di pubblicazione è collegato in Connessioni → SOCIAL.",
        "Questa inbox sei tu. L’agente lead, se è acceso, risponde a parte sui nuovi messaggi in arrivo che mostrano intenzione — non sostituisce questa inbox.",
      ],
    },
    {
      id: "leads",
      title: "Lead",
      lead: "Ogni cliente ha il suo agente. Metti il link del sito, addestra, digli come parlare, poi accendi la generazione.",
      body: [
        "In Lead incolli l’URL del sito e premi Train the agent. Legge le pagine pubbliche e i prodotti. Se è già addestrato, il pulsante dice Già addestrato.",
        "Nel riquadro sotto gli dici come vuoi che vada la conversazione: prezzi, cosa deve cogliere («quanto costa», «sono libero in una data»), e il link di prenotazione se ce l’hai. È il tuo brief; non sostituisce il crawl.",
        "Dopo l’addestramento premi AI lead generation. Da lì risponde solo ai nuovi messaggi in arrivo dopo l’accensione — non ai thread vecchi e non ai messaggi che hai inviato tu. La inbox viene scansionata una volta al giorno.",
        "Si presenta come l’agente posty.now, chiede il consenso (SÌ) e invia i termini, poi risponde da ciò che ha letto sul sito. I lead compaiono in elenco (messaggio, commento o ads) come nuovo / contattato / rifiutato. Lo stesso controllo spegne la generazione.",
      ],
      tips: [
        {
          title: "Instagram collegato",
          body: "Per i DM serve un Instagram (o un altro canale con inbox) in Connessioni. Addestrare il sito non pubblica e non scrive da solo sui network.",
        },
        {
          title: "Non è un blast",
          body: "La generazione non scrive ai thread vecchi. Un DM di test deve arrivare dopo l’accensione, e la risposta può aspettare il prossimo giro quotidiano.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Analytics",
      body: [
        "Analytics è la dashboard dei post organici: tasso di engagement, reach, follower, post nel periodo, post migliore, grafici per piattaforma e nel tempo, heatmap per una buona ora.",
        "Filtri per piattaforma, account, fonte (creati qui o dalla piattaforma) e gli ultimi 7 / 30 / 90 giorni. Il link del post migliore lo apre sul network. La miniatura è l’immagine del post; per i video compare l’icona del network se non c’è anteprima.",
        "Bluesky e Reddit danno statistiche limitate (like, commenti, condivisioni — niente impression). Gli altri network collegati danno il quadro completo, nei limiti di ciascuna API.",
        "Qui vedi se il contenuto organico funziona. Lo spend ads non è qui — sta in Ads.",
      ],
    },
    {
      id: "stats-ads",
      title: "Ads",
      lead: "Qui si vedono campagne e soldi. Se non c’è un account ads collegato, la pagina è vuota — non è un bug.",
      body: [
        "Ads nella barra: campagne attive e concluse, sui network ads collegati. Filtri per piattaforma, account, stato e periodo. Le campagne nuove si creano dall’Assistente.",
        "Usalo per decidere se una campagna merita di continuare, non per confonderla con un post andato bene in organico. Un reel con tanti like e una campagna con CTR forte sono vittorie diverse.",
        "Nessuna campagna? Controlla Connessioni → ADS: l’account è collegato e attivo nel periodo scelto?",
      ],
      tips: [
        {
          title: "Una routine settimanale breve",
          body: "Una volta a settimana: Analytics (cosa ha funzionato in organico) e Ads (cosa è costato e cosa ha portato). Poi, nell’assistente, aggiusti la serie — o prepari un nuovo creativo datato se è una promo. Sposta i lead in contattato quando hai parlato con la persona.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Frasi che funzionano bene",
      body: [
        "Non devi imparare comandi a memoria. Questi esempi coprono quasi tutto ciò che lo studio può fare.",
      ],
      examples: [
        "Dammi tre testi Instagram per un panificio un lunedì mattina.",
        "Pubblica questo ora su Instagram come reel e su TikTok.",
        "Programma domani alle 18:00 su LinkedIn, questo testo.",
        "Domani all’orario migliore, su Instagram e TikTok.",
        "Da domani, uno al giorno, su ogni network, all’orario migliore.",
        "Lo stesso video su ogni network, uno al giorno, alle 19:00.",
        "Programma questa foto il 15 settembre alle 10:00, solo Instagram e Facebook — è la promo, non fa parte della serie.",
        "Tutti i network tranne LinkedIn.",
        "Annulla il post TikTok di domani.",
        "Sposta il post di venerdì all’orario migliore.",
        "Scrivi una descrizione, tono caldo, niente emoji.",
        "Non chiedere più la conferma in questa chat.",
        "Crea una campagna Meta ads, traffico al sito, 10 € al giorno.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Se qualcosa non va",
      body: [
        "La dettatura non scrive nulla: Chrome o Edge, Allow sul microfono, lucchetto nella barra degli indirizzi. Ricarica. Poi il microfono in chat — deve restare arancione mentre parli.",
        "«Publishing now» su TikTok: aspetta. L’elaborazione non è un errore. La spunta verde è il segnale.",
        "Non pubblica: Connessioni → SOCIAL, il network è collegato? Instagram/TikTok/YouTube/Pinterest hanno un file allegato?",
        "File rifiutato: 100 MB max, 50 file max. YouTube salta le foto. TikTok accetta le foto (carosello).",
        "Conferma sparita: è scaduta. Rimanda il comando.",
        "Analytics vuote: collega un account di pubblicazione in Connessioni. Campagne ads vuote: Connessioni → ADS, poi Ads nella barra. Un Instagram di post non riempie la dashboard ads.",
        "L’agente lead non risponde: è addestrato? AI lead generation è acceso? Il messaggio deve essere nuovo, arrivato dopo l’accensione. La inbox viene scansionata una volta al giorno.",
        "Lingua sbagliata: il selettore lingua è in basso nella barra dello studio, accanto all’orologio.",
      ],
    },
  ],
};
