import { REFUND_MONTHLY_REFERENCE_EUR as price, WITHDRAWAL_DAYS as days } from "@/lib/billing";
import type { LegalCompany, LegalPage } from "@/lib/legal-types";

function operator(c: LegalCompany) {
  return `${c.name}, codice fiscale ${c.cui}, registro imprese ${c.reg}, EUID ${c.euid}, costituita il ${c.founded}. Il servizio è posty.now (${c.site}). Contatto: ${c.email}.`;
}

export function legalPagesIt(c: LegalCompany): LegalPage[] {
  return [
    {
      id: "terms",
      href: "/terms",
      label: "Termini",
      title: "Termini e condizioni",
      description: "Il contratto di utilizzo di posty.now con VLN MOTORS SRL.",
      updated: "Ultimo aggiornamento: 6 ottobre 2026",
      intro: [
        operator(c),
        "Questi termini si applicano al sito, alla preiscrizione e allo studio posty.now. Pagamento, abbonamento e rimborsi sono nelle Condizioni di abbonamento e nella Politica di recesso e rimborso. I dati personali sono nell’Informativa sulla privacy.",
      ],
      sections: [
        {
          id: "service",
          heading: "1. Il servizio",
          body: [
            "posty.now è uno studio: colleghi reti social e account ads, scrivi o detti cosa pubblicare e l’assistente prepara testo, orario e pubblicazione o programmazione. Vedi analisi, messaggi e commenti, puoi addestrare un agente lead su un sito pubblico e richiedere campagne a pagamento sugli account ads che colleghi tu.",
            "I nuovi account restano chiusi fino al 15 ottobre 2026. Fino ad allora puoi lasciare un’email sulla lista di preiscrizione. Questa email non è un abbonamento e non costa nulla.",
          ],
        },
        {
          id: "account",
          heading: "2. L’account",
          body: [
            "Per lo studio ti serve un account, almeno 16 anni e la capacità di stipulare un contratto. Sei responsabile della password e di tutto ciò che avviene dall’account.",
            "Puoi scegliere Individual o Team. Team è un login di agenzia e clienti per nome. Gli inviti ai colleghi non fanno parte di questa fase. Un account di rete collegato appartiene a un cliente.",
          ],
        },
        {
          id: "networks",
          heading: "3. Reti collegate",
          body: [
            "Quando colleghi Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit o un account ads, ci autorizzi a usare la connessione solo per ciò che chiedi nello studio: pubblicare, programmare, analisi, lettura di messaggi e commenti, l’agente lead della sezione 5 o una campagna.",
            "Rispetti le regole di ogni rete. posty.now non è Meta, Google, TikTok, LinkedIn, Pinterest né le altre reti. Il budget pubblicitario lo paghi a quelle reti, dal loro account ads. Non è incluso nell’abbonamento a VLN MOTORS SRL.",
          ],
        },
        {
          id: "content",
          heading: "4. I tuoi contenuti e i testi IA",
          body: [
            "I contenuti che carichi restano tuoi. Ci dai una licenza limitata per memorizzarli, elaborarli e inviarli alle reti, solo perché il servizio funzioni.",
            "I testi generati possono essere sbagliati. Controlli didascalia, hashtag e orario prima di confermare. Non promettiamo portata, engagement né che una rete accetti il post.",
            "La dettatura usa il riconoscimento vocale del browser. Riceviamo il testo nella casella. Non memorizziamo l’audio.",
          ],
        },
        {
          id: "leads",
          heading: "5. L’agente lead e il consenso in chat",
          body: [
            "Puoi addestrare un agente sulle pagine pubbliche di un sito (l’URL che indichi) e attivare la generazione IA di lead. Quando è attivo, legge i nuovi messaggi e commenti arrivati dopo l’attivazione, sugli account di pubblicazione collegati. Non scrive in thread vecchi e non scrive a chi non ti ha scritto dopo.",
            "L’agente si presenta come agente posty.now. Prima di continuare, invia un link a questi termini e chiede un consenso esplicito: la risposta SÌ (o YES, DA, JA, OUI, SÍ). Senza SÌ non chiede telefono, email o altri contatti e non segna la persona come lead qualificato.",
            "Se la persona risponde SÌ, accetta che VLN MOTORS SRL, tramite posty.now per conto della pagina o dell’account a cui ha scritto, prosegua la conversazione, usi il suo messaggio, risponda dalle pagine pubbliche del sito addestrato e raccolga nome, telefono ed email che lascia (e, se li scrive, dati di prequalifica come modalità di pagamento o reddito), così una persona di quella pagina può contattarla. Il trattamento dei dati è nell’Informativa sulla privacy. Può rifiutare: non rispondere SÌ, oppure scrivere NO.",
            "Il lead (messaggio, contatti, trascrizione, stato) resta nell’elenco dello studio, presso il cliente a cui è associato l’account. Sei responsabile di usare questa funzione secondo le regole della rete e la legge, incluso il GDPR, verso chi ti ha scritto. Disattivi la generazione nello stesso controllo dello studio. Non promettiamo vendite, prenotazioni né che la persona risponda.",
          ],
        },
        {
          id: "use",
          heading: "6. Uso vietato",
          body: [
            "Non usi il servizio per spam, frode, molestie o altri atti illeciti, per aggirare i limiti di una rete, per contenuti che violano copyright o privacy, né per vendere o condividere l’account.",
          ],
        },
        {
          id: "pay",
          heading: "7. Cosa paghi, e a chi",
          body: [
            `Il contratto a pagamento è tra te e ${c.name}. Stripe elabora solo il pagamento: il denaro passa da Stripe al conto aziendale. Stripe non è il venditore.`,
            `L’abbonamento è l’accesso allo studio, ${price} EUR al mese, dopo il mese gratuito nelle Condizioni di abbonamento. La lista d’attesa è gratuita. Non ci paghi il budget pubblicitario.`,
            "L’importo dovuto è quello mostrato sulla pagina di pagamento prima della conferma. Se l’azienda è o diventa soggetta a IVA, l’imposta compare lì e sulla fattura prima dell’addebito.",
          ],
        },
        {
          id: "delete",
          heading: "8. Eliminare l’account",
          body: [
            "Nello studio apri il menu dell’account, scegli Elimina account e confermi. Le reti vengono scollegate, utente e dati live dello studio vengono eliminati (conversazioni, post, file, lead). Se non puoi accedere, usa la pagina Contatto dalla stessa email e chiedi l’eliminazione.",
            "Eliminare l’account non annulla da solo un pagamento già incassato. Il denaro segue la Politica di recesso e rimborso. Le fatture restano per il tempo richiesto dal diritto fiscale, anche se l’account studio non c’è più.",
          ],
        },
        {
          id: "end",
          heading: "9. Sospensione, diritto, contatto",
          body: [
            "Puoi smettere di usare il servizio in qualsiasi momento. Possiamo sospendere l’accesso se violi questi termini o se la legge lo richiede.",
            "Non escludiamo la responsabilità per dolo, colpa grave o diritti che la legge ci vieta di limitare, compresi i diritti dei consumatori. Altrimenti la responsabilità per un reclamo relativo al servizio è limitata all’importo che ci hai pagato negli ultimi 12 mesi.",
            "Si applica il diritto rumeno. I consumatori possono rivolgersi all’ANPC. I tribunali sono quelli della Romania, salvo norme imperative di tutela dei consumatori del tuo Paese.",
            `Domande: ${c.email}.`,
          ],
        },
      ],
    },
    {
      id: "privacy",
      href: "/privacy",
      label: "Privacy",
      title: "Privacy e GDPR",
      description: "Quali dati VLN MOTORS SRL tratta per posty.now, perché e come li elimini.",
      updated: "Ultimo aggiornamento: 6 ottobre 2026",
      intro: [
        `${operator(c)} ${c.name} è il titolare del trattamento per posty.now.`,
        "Non vendiamo dati personali. Non usiamo i tuoi dati per addestrare un modello IA.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Quali dati, e perché",
          body: [
            "Preiscrizione: email e lingua (rumeno, inglese, tedesco, italiano, francese o spagnolo). Base: passi precontrattuali e consenso tramite il modulo. Finalità: avviso dell’apertura il 15 ottobre 2026. Puoi chiedere la rimozione all’indirizzo di contatto.",
            "Account: email, identificativo di auth e hash della password presso il fornitore di auth. Base: contratto. Finalità: accesso.",
            "Studio: messaggi della chat, file (fino a 50, 100 MB ciascuno), post, programmazioni, clienti Team (solo nome), il cliente scelto e i lead (messaggio, trascrizione, nome, telefono, email, stato). Base: contratto. Finalità: pubblicare, programmare, cronologia e elenco lead.",
            "Reti: identificativi e nomi degli account collegati più i token per pubblicare e leggere la casella. Leggiamo messaggi e commenti degli account collegati per riconoscere l’interesse, rispondere (qualifica in privato; un commento pubblico invita solo alla chat privata) e salvare un lead qualificato dopo il consenso esplicito SÌ/YES a questi termini in chat. Telefono, email o stipendio non stanno nei commenti pubblici. Base: contratto. Finalità: l’azione che hai chiesto.",
            "La persona che scrive alla pagina: se risponde SÌ, trattiamo il messaggio e il nome, telefono ed email che lascia, così il titolare dell’account studio può contattarla. Base: il consenso tramite SÌ. Può chiedere l’eliminazione all’indirizzo di contatto. Senza SÌ non raccogliamo contatti.",
            "Voce: il browser trasforma la voce in testo. Memorizziamo il testo del messaggio se lo invii. Non memorizziamo l’audio.",
            "Pagamenti: Stripe elabora la carta. Conserviamo ID cliente Stripe, stato del pagamento, importo e data, per sapere se l’abbonamento è attivo e per fatturare. Non memorizziamo il numero completo della carta. Base: contratto e obbligo legale di tenuta contabile.",
            "Modulo di contatto: nome, email e messaggio. Base: interesse legittimo o passi precontrattuali, per poter rispondere.",
          ],
        },
        {
          id: "who",
          heading: "2. Chi riceve i dati",
          body: [
            "Hosting (Vercel), database e autenticazione (Supabase), pagamenti (Stripe), email transazionale (Resend), un fornitore di modello IA che riceve il messaggio della chat per redigere il testo, e un fornitore di pubblicazione che invia il post confermato alla rete collegata.",
            "Le reti collegate ricevono i contenuti che confermi. Hanno regole proprie.",
            "Un lead qualificato (nome, telefono, email, trascrizione) è visibile nello studio per il titolare dell’account, presso il cliente scelto. Non lo vendiamo.",
            "Comunichiamo dati se la legge lo richiede, ad esempio una fattura o una richiesta di un’autorità.",
          ],
        },
        {
          id: "keep",
          heading: "3. Per quanto tempo",
          body: [
            "Un’email della lista d’attesa resta fino all’apertura e all’avviso, o fino a quando chiedi l’eliminazione, a seconda di cosa arriva prima.",
            "I dati dello studio vengono eliminati quando elimini l’account: utente, conversazioni, post live, file e lead. I backup cifrati del database ruotano da soli e non servono al trattamento corrente.",
            "Documenti contabili e fatture restano per il tempo richiesto dal diritto fiscale rumeno, anche se lo studio è stato eliminato.",
          ],
        },
        {
          id: "rights",
          heading: "4. I tuoi diritti",
          body: [
            "Puoi chiedere accesso, rettifica, cancellazione, limitazione, opposizione e portabilità, e revocare il consenso per la preiscrizione. Se hai scritto a una pagina e risposto SÌ in chat, puoi revocare quel consenso e chiedere l’eliminazione del lead. Eliminare l’account nello studio è la via diretta per cancellare i dati dello studio.",
            "Puoi presentare un reclamo all’ANSPDCP, l’autorità rumena per la protezione dei dati.",
            `Richieste a ${c.email} o tramite la pagina Contatto, dall’email dell’account. Rispondiamo nel termine GDPR, di solito un mese.`,
          ],
        },
        {
          id: "delete",
          heading: "5. Eliminare l’account",
          body: [
            "Collegato: menu account → Elimina account → conferma. Le reti vengono scollegate, poi si eliminano utente e dati live.",
            "Scollegato: messaggio dalla pagina Contatto, stessa email, con richiesta di eliminazione. Verifichiamo che tu sia il titolare prima di eliminare.",
            "L’eliminazione da sola non annulla un corrispettivo per un periodo già iniziato e non cancella le fatture che la legge ci obbliga a conservare.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      href: "/cookies",
      label: "Cookie",
      title: "Informativa sui cookie",
      description: "I cookie strettamente necessari usati da posty.now.",
      updated: "Ultimo aggiornamento: 22 settembre 2026",
      intro: [
        operator(c),
        "Usiamo solo cookie strettamente necessari. Non ci sono cookie di analisi, pubblicità o social sul sito. Perciò non c’è un banner di consenso: la legge consente i cookie senza i quali il servizio non può funzionare.",
      ],
      sections: [
        {
          id: "list",
          heading: "1. Quali cookie",
          body: [
            "La sessione di accesso, impostata dal fornitore di auth, per restare collegato. Durata: la sessione e il suo rinnovo.",
            "NEXT_LOCALE: la lingua scelta (rumeno, inglese, tedesco, italiano, francese o spagnolo).",
            "posty_client: il cliente Team scelto nello studio, perché i post non saltino a un altro cliente. È httpOnly. Durata: fino a 400 giorni, o finché cambi cliente o elimini l’account.",
            "Cookie OAuth brevi solo mentre colleghi una rete, perché il ritorno dalla finestra della rete sia tuo.",
          ],
        },
        {
          id: "control",
          heading: "2. Come li controlli",
          body: [
            "Puoi eliminarli nel browser. Senza cookie di sessione sei scollegato. Senza NEXT_LOCALE il sito sceglie di nuovo la lingua. Senza posty_client uno studio Team non sa più quale cliente era aperto.",
            "Non vendiamo identificativi dei cookie e non li colleghiamo a pubblicità fuori dal sito.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      href: "/refunds",
      label: "Rimborso",
      title: "Recesso e rimborso",
      description: "Come disdici un abbonamento posty.now e quando torna il denaro.",
      updated: "Ultimo aggiornamento: 22 settembre 2026",
      intro: [
        operator(c),
        "La disdetta ferma il rinnovo. Un rimborso restituisce il denaro già incassato. Non è la stessa cosa. Eliminare l’account non è, da solo, una richiesta di rimborso.",
      ],
      sections: [
        {
          id: "free",
          heading: "1. Lista d’attesa e mese gratuito",
          body: [
            "La preiscrizione non costa nulla. Non c’è nulla da rimborsare.",
            "Se sei in lista e crei un account all’apertura del 15 ottobre 2026, il primo mese di studio è gratuito. Se disdici in quel mese, non viene addebitato nulla.",
          ],
        },
        {
          id: "withdraw",
          heading: `2. Il recesso di ${days} giorni`,
          body: [
            `Come consumatore puoi recedere dal contratto a distanza entro ${days} giorni dalla conclusione senza motivazione, secondo l’ordinanza d’urgenza rumena 34/2014.`,
            "Se chiedi che lo studio inizi subito nel periodo di recesso e confermi di perdere il diritto di recesso per la prestazione digitale già fornita, il periodo già usato non viene rimborsato per intero.",
            `Se non hai chiesto l’inizio immediato e recedi entro ${days} giorni, rimborsiamo per intero l’importo incassato per questo abbonamento.`,
          ],
        },
        {
          id: "cancel",
          heading: "3. Disdetta dopo",
          body: [
            "Disdici l’abbonamento nell’account. Resta attivo fino alla fine del periodo già pagato, poi non si rinnova. Il mese iniziato non viene rimborsato, perché l’accesso era disponibile.",
            "I budget ads verso Meta, Google, TikTok, LinkedIn, Pinterest o altri non passano da noi. Li interrompi nel loro account. Non li rimborsiamo.",
          ],
        },
        {
          id: "lifetime",
          heading: "4. Vecchi acquisti lifetime",
          body: [
            `Se hai pagato una volta per un accesso lifetime, prima dell’abbonamento mensile, il rimborso è l’importo pagato meno ${price} EUR per ogni mese iniziato dall’attivazione, non meno di zero. Entro ${days} giorni, senza consenso all’inizio immediato, il rimborso è intero.`,
            "Esempio: hai pagato 150 EUR e sono iniziati due mesi, fuori dalla finestra di recesso completo. Il rimborso è 150 − 30 = 120 EUR.",
          ],
        },
        {
          id: "how",
          heading: "5. Come",
          body: [
            `Disdici nell’account. Per un rimborso che non arriva da solo, scrivi a ${c.email} dall’email dell’account, con la data di pagamento. Il denaro torna via Stripe sullo stesso metodo, secondo il calcolo sopra.`,
            "L’eliminazione dell’account è separata, nel menu account. Se vuoi anche i soldi, dillo finché hai ancora il diritto.",
          ],
        },
      ],
    },
    {
      id: "subscription",
      href: "/subscription",
      label: "Abbonamento",
      title: "Condizioni di abbonamento",
      description: "Cosa acquisti da VLN MOTORS SRL, quanto costa e quando si rinnova.",
      updated: "Ultimo aggiornamento: 22 settembre 2026",
      intro: [
        operator(c),
        "Queste condizioni sono il contratto di abbonamento. Le accetti quando confermi il pagamento. Fino ad allora la preiscrizione non ti vincola a nulla.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Cosa acquisti",
          body: [
            `Acquisti l’accesso mensile allo studio posty.now, gestito da ${c.name}: assistente (testo e dettatura), pubblicazione e programmazione sulle reti collegate, analisi, casella (messaggi e commenti), un agente lead addestrato su un sito, collegamento di account ads e, in Team, clienti sotto lo stesso login.`,
            "Non acquisti budget pubblicitario, portata garantita né un posto su una rete sociale. Quello lo paghi, se vuoi, direttamente alla rete, dal suo account ads.",
            "In questo abbonamento non c’è un costo separato per cliente. Un account, un abbonamento. Se introduciamo un prezzo per cliente, lo vedi sulla pagina di pagamento prima di qualsiasi nuovo importo, e il vecchio abbonamento non cambia senza preavviso.",
          ],
        },
        {
          id: "price",
          heading: "2. Quanto, e perché",
          body: [
            `Il prezzo dell’abbonamento è ${price} EUR al mese per l’accesso descritto sopra.`,
            "Il primo mese è gratuito se la tua email è sulla preiscrizione e crei l’account all’apertura delle iscrizioni il 15 ottobre 2026. Dopo il mese gratuito, il mese successivo viene addebitato solo se non hai disdetto.",
            "Prima del primo addebito vedi l’importo sulla pagina Stripe. La valuta è confermata lì. Se si applica l’IVA, compare prima del pagamento, non dopo.",
            `${c.name} fattura la somma incassata secondo il diritto fiscale rumeno, inclusa e-Factura se la regola vale (privato o azienda). Per una fattura aziendale dai dati di fatturazione corretti.`,
          ],
        },
        {
          id: "renew",
          heading: "3. Rinnovo e disdetta",
          body: [
            "L’abbonamento si rinnova ogni mese finché non disdici. La disdetta ferma il prossimo addebito. L’accesso resta fino alla fine del periodo già pagato o gratuito.",
            `Il recesso di ${days} giorni e i rimborsi sono nella Politica di recesso e rimborso.`,
          ],
        },
        {
          id: "fail",
          heading: "4. Se un pagamento fallisce",
          body: [
            "Se il rinnovo fallisce, Stripe può riprovare. Se non viene incassato nulla, l’accesso allo studio termina alla fine del periodo pagato. I dati non vengono eliminati solo per un pagamento fallito. Li elimini nell’account o per iscritto.",
          ],
        },
      ],
    },
  ];
}
