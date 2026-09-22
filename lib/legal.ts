import { REFUND_MONTHLY_REFERENCE_EUR, WITHDRAWAL_DAYS } from "@/lib/billing";

export const COMPANY = {
  name: "VLN MOTORS SRL",
  cui: "51921930",
  reg: "J2025040412004",
  euid: "ROONRC.J2025040412004",
  founded: "2025-06-05",
  email: "opozacolor@gmail.com",
  site: "https://posty.now",
} as const;

export const LEGAL_LINKS = [
  { href: "/terms", id: "terms" },
  { href: "/privacy", id: "privacy" },
  { href: "/cookies", id: "cookies" },
  { href: "/refunds", id: "refunds" },
  { href: "/subscription", id: "subscription" },
] as const;

export type LegalSection = { id: string; heading: string; body: string[] };
export type LegalPage = {
  id: (typeof LEGAL_LINKS)[number]["id"];
  href: string;
  label: string;
  title: string;
  description: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

const price = REFUND_MONTHLY_REFERENCE_EUR;
const days = WITHDRAWAL_DAYS;

function operatorRo() {
  return `${COMPANY.name}, CUI ${COMPANY.cui}, Nr. Reg. Com. ${COMPANY.reg}, EUID ${COMPANY.euid}, înființată la ${COMPANY.founded}. Serviciul este posty.now (${COMPANY.site}). Contact: ${COMPANY.email}.`;
}

function operatorEn() {
  return `${COMPANY.name}, tax ID ${COMPANY.cui}, trade register ${COMPANY.reg}, EUID ${COMPANY.euid}, incorporated on ${COMPANY.founded}. The service is posty.now (${COMPANY.site}). Contact: ${COMPANY.email}.`;
}

const ro: LegalPage[] = [
  {
    id: "terms",
    href: "/terms",
    label: "Termeni",
    title: "Termeni și condiții",
    description: "Contractul de utilizare a posty.now, încheiat cu VLN MOTORS SRL.",
    updated: "Ultima actualizare: 22 septembrie 2026",
    intro: [
      operatorRo(),
      "Acești termeni se aplică site-ului, listei de preînregistrare și studio-ului posty.now. Plățile, abonamentul și rambursările sunt detaliate în Condițiile de abonament și în Politica de anulare și rambursare. Prelucrarea datelor este în Politica de confidențialitate.",
    ],
    sections: [
      {
        id: "service",
        heading: "1. Ce este serviciul",
        body: [
          "posty.now este un studio în care conectezi rețele sociale și conturi de reclame, scrii sau dictezi ce vrei publicat, iar asistentul pregătește textul, ora și publicarea sau programarea. Poți vedea statistici și poți cere campanii plătite pe conturile de ads pe care le conectezi tu.",
          "Conturile noi sunt închise până la 15 octombrie 2026. Până atunci poți lăsa un email pe lista de preînregistrare. Emailul de pe listă nu este un abonament și nu se plătește.",
        ],
      },
      {
        id: "account",
        heading: "2. Contul",
        body: [
          "Ca să folosești studio-ul îți trebuie un cont, cu vârsta de cel puțin 16 ani și capacitate de a încheia un contract. Ești responsabil de parolă și de tot ce se face din cont.",
          "Poți alege Individual sau Team. Team înseamnă un singur login de agenție și clienți adăugați pe nume. În faza asta nu există invitații pentru colegi. Un cont de rețea conectat ține de un singur client.",
        ],
      },
      {
        id: "networks",
        heading: "3. Rețelele conectate",
        body: [
          "Când conectezi Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit sau un cont de ads, ne autorizezi să folosim conexiunea doar ca să facem ce ceri în studio: publicare, programare, statistici sau o campanie.",
          "Tu respecți regulile fiecărei rețele. posty.now nu este Meta, Google, TikTok, LinkedIn, Pinterest sau celelalte rețele. Banii de reclamă îi plătești acelor rețele, din contul lor de ads. Nu sunt incluși în abonamentul către VLN MOTORS SRL.",
        ],
      },
      {
        id: "content",
        heading: "4. Conținutul tău și textele AI",
        body: [
          "Conținutul pe care îl încarci rămâne al tău. Ne dai o licență limitată să îl stocăm, să îl procesăm și să îl trimitem către rețele doar ca să funcționeze serviciul.",
          "Textele generate pot fi greșite. Tu verifici caption-ul, hashtag-urile și ora înainte de confirmare. Nu promitem reach, engagement sau că o rețea va accepta postarea.",
          "Dictarea vocală folosește recunoașterea vocală a browserului. Noi primim textul care ajunge în casetă, nu păstrăm înregistrarea audio.",
        ],
      },
      {
        id: "use",
        heading: "5. Utilizare interzisă",
        body: [
          "Nu folosești serviciul pentru spam, fraudă, hărțuire sau alte fapte ilegale, pentru a ocoli limitele rețelelor, pentru conținut care încalcă drepturi de autor sau viața privată, ori ca să vinzi sau să împarți contul.",
        ],
      },
      {
        id: "pay",
        heading: "6. Ce plătești și cui",
        body: [
          `Contractul de plată este între tine și ${COMPANY.name}. Stripe este doar procesatorul: banii intra prin Stripe, apoi în contul firmei. Stripe nu este vânzătorul serviciului.`,
          `Abonamentul este pentru accesul la studio, ${price} EUR pe lună, după luna gratuită descrisă în Condițiile de abonament. Nu plătești ca să te pui pe lista de așteptare. Nu plătești către noi bugetul de reclame.`,
          "Suma datorată este cea afișată pe pagina de plată, înainte să confirmi. Dacă firma este sau devine plătitoare de TVA, taxa apare acolo și pe factură, înainte de încasare.",
        ],
      },
      {
        id: "delete",
        heading: "7. Ștergerea contului",
        body: [
          "Din studio, în meniul contului, alegi Șterge cont și confirmi. Se deconectează rețelele, se șterge utilizatorul și datele live ale studio-ului (conversații, postări, fișiere încărcate). Dacă nu te poți autentifica, scrii de pe pagina de contact, de pe același email, că vrei ștergerea.",
          "Ștergerea contului nu șterge singură o plată deja făcută. Pentru bani, se aplică Politica de anulare și rambursare. Facturile emise se păstrează cât cere legea fiscală, chiar după ce contul de studio a dispărut.",
        ],
      },
      {
        id: "end",
        heading: "8. Suspendare, lege, contact",
        body: [
          "Poți opri utilizarea oricând. Putem suspenda accesul dacă încalci termenii sau dacă legea o cere.",
          "Nu excludem răspunderea pentru dol, culpă gravă sau pentru drepturile pe care legea nu permite să le limitezi, inclusiv drepturile consumatorului. În rest, răspunderea pentru o pretenție legată de serviciu este limitată la suma plătită către noi în ultimele 12 luni.",
          "Termenii sunt guvernați de legea română. Consumatorii pot sesiza ANPC. Instanțele sunt cele din România, în afară de regulile imperative de protecție a consumatorului din țara ta.",
          `Întrebări: ${COMPANY.email}.`,
        ],
      },
    ],
  },
  {
    id: "privacy",
    href: "/privacy",
    label: "Confidențialitate",
    title: "Politică de confidențialitate și GDPR",
    description: "Ce date prelucrează VLN MOTORS SRL pentru posty.now, de ce, și cum le ștergi.",
    updated: "Ultima actualizare: 22 septembrie 2026",
    intro: [
      `${operatorRo()} ${COMPANY.name} este operatorul datelor pentru posty.now.`,
      "Nu vindem date personale. Nu folosim datele tale ca să antrenăm un model de inteligență artificială.",
    ],
    sections: [
      {
        id: "what",
        heading: "1. Ce date și de ce",
        body: [
          "Lista de preînregistrare: emailul și limba (română sau engleză). Temei: pași înainte de contract și consimțământul dat când trimiți formularul. Scop: să te anunțăm la deschiderea din 15 octombrie 2026. Poți cere scoaterea de pe listă la adresa de contact.",
          "Cont: email, identificatorul de autentificare și hash-ul parolei, ținut de furnizorul de autentificare. Temei: contractul. Scop: să intri în studio.",
          "Studio: mesajele din chat, fișierele încărcate (până la 30, maximum 100 MB fiecare), postările, programările, clienții Team (doar numele) și contul activ selectat. Temei: contractul. Scop: să publicăm, să programăm și să arătăm istoricul.",
          "Rețele: identificatori și nume de conturi conectate, plus token-uri de acces necesare publicării. Temei: contractul. Scop: acțiunea pe care o ceri. Nu citim inbox-ul privat în afara a ceea ce rețeaua dă pentru statisticile afișate.",
          "Voce: browserul transformă vorbirea în text. Noi stocăm textul din mesaj, dacă îl trimiți. Nu stocăm audio.",
          "Plăți: Stripe procesează cardul. Noi păstrăm identificatorul de client Stripe, statusul plății, suma și data, ca să știm dacă abonamentul e activ și ca să emitem factura. Nu stocăm numărul complet al cardului. Temei: contractul și obligația legală contabilă.",
          "Contact: numele, emailul și mesajul trimis din formular. Temei: interes legitim / pași precontractuali, ca să răspundem.",
        ],
      },
      {
        id: "who",
        heading: "2. Cui ajung datele",
        body: [
          "Furnizor de hosting (Vercel), bază de date și autentificare (Supabase), plăți (Stripe), email tranzacțional (Resend), un furnizor de modele AI căruia îi trimitem mesajul ca să genereze textul, și un furnizor de publicare prin care pleacă postarea către rețeaua pe care ai conectat-o.",
          "Rețelele pe care le conectezi primesc conținutul pe care îl confirmi. Ele au propriile reguli.",
          "Putem divulga date dacă legea o cere (de exemplu o factură sau o solicitare a unei autorități).",
        ],
      },
      {
        id: "keep",
        heading: "3. Cât timp",
        body: [
          "Emailul de pe listă stă până la lansare și anunț, sau până ceri ștergerea, oricare vine primul.",
          "Datele de studio se șterg când ștergi contul: utilizatorul, conversațiile, postările din baza live și fișierele din stocare. Backup-urile criptate ale bazei se rotesc automat și nu sunt folosite ca prelucrare curentă.",
          "Documentele contabile și de facturare se păstrează pe termenul prevăzut de legea fiscală din România, chiar dacă studio-ul a fost șters.",
        ],
      },
      {
        id: "rights",
        heading: "4. Drepturile tale",
        body: [
          "Poți cere acces, rectificare, ștergere, restricționare, opoziție și portabilitate, și poți retrage consimțământul pentru lista de preînregistrare. Ștergerea contului din studio este modul direct de a cere ștergerea datelor de studio.",
          "Poți depune plângere la ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal).",
          `Cererile se trimit la ${COMPANY.email} sau din pagina de contact, de pe emailul contului. Răspundem în termenul din GDPR, de regulă o lună.`,
        ],
      },
      {
        id: "delete",
        heading: "5. Ștergerea contului",
        body: [
          "Autentificat: meniul contului → Șterge cont → confirmi. Se deconectează rețelele, apoi se șterge utilizatorul și datele live.",
          "Neautentificat: mesaj din pagina de contact, același email, cu cererea de ștergere. Verificăm că ești titularul înainte să ștergem.",
          "Ștergerea nu anulează singură obligația de plată pentru o perioadă deja începută și nu șterge facturile pe care legea ne obligă să le ținem.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    href: "/cookies",
    label: "Cookie-uri",
    title: "Politică de cookie-uri",
    description: "Cookie-urile strict necesare ca să funcționeze posty.now.",
    updated: "Ultima actualizare: 22 septembrie 2026",
    intro: [
      operatorRo(),
      "Folosim doar cookie-uri strict necesare. Nu avem cookie-uri de analiză, de publicitate sau de la rețele sociale pe site. De aceea nu afișăm un banner de consimțământ: legea permite cookie-urile fără de care serviciul nu poate funcționa.",
    ],
    sections: [
      {
        id: "list",
        heading: "1. Ce cookie-uri",
        body: [
          "Sesiunea de autentificare, pusă de furnizorul de autentificare, ca să rămâi logat în studio. Durată: sesiunea și reînnoirea ei.",
          "NEXT_LOCALE: limba aleasă, română sau engleză.",
          "posty_client: clientul Team selectat în studio, ca postările să nu sară la alt client. Este httpOnly. Durată: până la 400 de zile, sau până schimbi clientul ori ștergi contul.",
          "Cookie-uri scurte de conectare OAuth, doar pe durata legării unei rețele, ca revenirea din fereastra rețelei să fie a ta.",
        ],
      },
      {
        id: "control",
        heading: "2. Cum le controlezi",
        body: [
          "Le poți șterge din browser. Fără cookie-ul de sesiune nu rămâi autentificat. Fără NEXT_LOCALE, site-ul alege limba din nou. Fără posty_client, studio-ul Team nu mai știe ce client era deschis.",
          "Nu vindem identificatori din cookie-uri și nu îi legăm de reclame în afara site-ului.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    href: "/refunds",
    label: "Rambursare",
    title: "Politică de anulare și rambursare",
    description: "Cum anulezi abonamentul posty.now și când se întorc banii.",
    updated: "Ultima actualizare: 22 septembrie 2026",
    intro: [
      operatorRo(),
      "Anularea oprește reînnoirea. Rambursarea întoarce bani deja încasați. Sunt lucruri diferite. Ștergerea contului nu este, singură, o cerere de rambursare.",
    ],
    sections: [
      {
        id: "free",
        heading: "1. Lista de așteptare și luna gratuită",
        body: [
          "Preînregistrarea nu costă nimic. Nu există ce rambursa.",
          "Dacă ești pe listă și îți faci cont la deschiderea din 15 octombrie 2026, prima lună de studio este gratuită. Dacă anulezi în luna aceea, nu se încasează nimic.",
        ],
      },
      {
        id: "withdraw",
        heading: `2. Retragerea în ${days} de zile`,
        body: [
          `Dacă ești consumator (persoană fizică), poți renunța la contractul la distanță în ${days} zile de la încheiere, fără să invoci un motiv, conform OUG 34/2014.`,
          "Dacă ceri ca studio-ul să înceapă imediat, în perioada de retragere, și confirmi că știi că pierzi dreptul de retragere pentru serviciul digital deja furnizat, nu se mai restituie integral perioada deja folosită.",
          `Dacă nu ai cerut începerea imediată și te retragi în ${days} de zile, îți restituim integral suma încasată pentru abonamentul acela.`,
        ],
      },
      {
        id: "cancel",
        heading: "3. Anularea după aceea",
        body: [
          "Anulezi abonamentul din cont. Rămâne activ până la sfârșitul perioadei deja plătite, apoi nu se mai reînnoiește. Luna începută nu se restituie, pentru că accesul a fost disponibil.",
          "Bugetul de reclame plătit către Meta, Google, TikTok, LinkedIn, Pinterest sau altele nu trece prin noi. Îl anulezi în contul acelei rețele. Nu îl rambursăm noi.",
        ],
      },
      {
        id: "lifetime",
        heading: "4. Cumpărări mai vechi, pe viață",
        body: [
          `Dacă ai plătit o singură dată pentru acces pe viață, înainte de abonamentul lunar, rambursarea este suma plătită minus ${price} EUR pentru fiecare lună începută de la activare, dar nu mai puțin de zero. În ${days} zile, fără consimțământ de începere imediată, rambursarea este integrală.`,
          "Exemplu: ai plătit 150 EUR și au trecut două luni începute, fără să fii în fereastra de retragere integrală. Se restituie 150 − 30 = 120 EUR.",
        ],
      },
      {
        id: "how",
        heading: "5. Cum se face",
        body: [
          `Din cont, pentru anulare. Pentru o rambursare care nu apare singură, scrii la ${COMPANY.email}, de pe emailul contului, cu data plății. Banii se întorc pe aceeași metodă, prin Stripe, după ce calculul de mai sus este aplicat.`,
          "Ștergerea contului se face separat, din meniul contului. Dacă vrei și banii înapoi, o spui explicit în același interval în care mai ai dreptul.",
        ],
      },
    ],
  },
  {
    id: "subscription",
    href: "/subscription",
    label: "Abonament",
    title: "Condițiile abonamentului",
    description: "Ce cumperi de la VLN MOTORS SRL, cât costă și când se reînnoiește.",
    updated: "Ultima actualizare: 22 septembrie 2026",
    intro: [
      operatorRo(),
      "Aceste condiții sunt contractul de abonament. Le accepți când confirmi plata. Până atunci, lista de preînregistrare nu te obligă la nimic.",
    ],
    sections: [
      {
        id: "what",
        heading: "1. Ce cumperi",
        body: [
          `Cumperi acces lunar la studio-ul posty.now, operat de ${COMPANY.name}: asistent (text și dictare), publicare și programare pe rețelele conectate, statistici, conectarea conturilor de reclame și, la Team, clienți pe același login.`,
          "Nu cumperi buget de reclamă, reach garantat sau un loc pe o rețea socială. Alea se plătesc, dacă vrei, direct rețelei, din contul ei de ads.",
          "Nu există, în acest abonament, tarif separat per client. Un cont, un abonament. Dacă vom introduce un preț per client, îl vei vedea pe pagina de plată înainte de orice sumă nouă, și abonamentul vechi nu se schimbă fără să ți se spună.",
        ],
      },
      {
        id: "price",
        heading: "2. Cât și de ce",
        body: [
          `Prețul abonamentului este ${price} EUR pe lună, pentru accesul descris mai sus.`,
          "Prima lună este gratuită dacă emailul tău este pe lista de preînregistrare și îți creezi contul când se deschid înregistrările, la 15 octombrie 2026. După luna gratuită, se încasează luna următoare doar dacă nu ai anulat.",
          "Înainte de prima încasare vezi suma pe pagina Stripe. Acolo se confirmă și moneda. Dacă se aplică TVA, este evidențiat înainte să plătești, nu după.",
          `${COMPANY.name} emite factura pentru suma încasată, conform legislației fiscale din România, inclusiv e-Factura atunci când regula se aplică (persoană fizică sau firmă). Ca să facturăm o firmă, ne dai datele de facturare corecte.`,
        ],
      },
      {
        id: "renew",
        heading: "3. Reînnoire și anulare",
        body: [
          "Abonamentul se reînnoiește lunar, până îl anulezi. Anularea oprește următoarea încasare. Accesul rămâne până la capătul perioadei deja plătite sau gratuite.",
          `Retragerea în ${days} de zile și rambursările sunt în Politica de anulare și rambursare.`,
        ],
      },
      {
        id: "fail",
        heading: "4. Dacă plata nu trece",
        body: [
          "Dacă reînnoirea eșuează, Stripe poate reîncerca. Dacă nu se încasează, accesul la studio se oprește la sfârșitul perioadei plătite. Datele nu se șterg doar pentru o plată eșuată. Ștergerea o faci tu, din cont, sau o ceri în scris.",
        ],
      },
    ],
  },
];

const en: LegalPage[] = [
  {
    id: "terms",
    href: "/terms",
    label: "Terms",
    title: "Terms and conditions",
    description: "The contract for using posty.now, with VLN MOTORS SRL.",
    updated: "Last updated: 22 September 2026",
    intro: [
      operatorEn(),
      "These terms cover the site, the pre-registration list, and the posty.now studio. Payment, the subscription, and refunds are in the Subscription terms and the Cancellation and refund policy. Personal data is in the Privacy policy.",
    ],
    sections: [
      {
        id: "service",
        heading: "1. The service",
        body: [
          "posty.now is a studio where you connect social networks and ad accounts, type or dictate what you want published, and the assistant prepares the caption, the time, and the publish or schedule. You can read stats and ask for paid campaigns on ad accounts you connect yourself.",
          "New accounts stay closed until 15 October 2026. Until then you can leave an email on the pre-registration list. That email is not a subscription and it is not paid.",
        ],
      },
      {
        id: "account",
        heading: "2. The account",
        body: [
          "The studio needs an account. You must be at least 16 and able to enter a contract. You are responsible for the password and for everything done from the account.",
          "You can choose Individual or Team. Team is one agency login and clients added by name. Colleague invites are not part of this phase. A connected network account belongs to one client.",
        ],
      },
      {
        id: "networks",
        heading: "3. Connected networks",
        body: [
          "When you connect Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit, or an ad account, you authorize us to use that connection only for what you ask in the studio: publishing, scheduling, stats, or a campaign.",
          "You follow each network’s rules. posty.now is not Meta, Google, TikTok, LinkedIn, Pinterest, or the other networks. Ad spend is paid to those networks, from their ad account. It is not part of the subscription you pay VLN MOTORS SRL.",
        ],
      },
      {
        id: "content",
        heading: "4. Your content and AI text",
        body: [
          "Content you upload stays yours. You give us a limited licence to store it, process it, and send it to networks only so the service can run.",
          "Generated text can be wrong. You check the caption, hashtags, and time before you confirm. We do not promise reach, engagement, or that a network will accept the post.",
          "Voice dictation uses the browser’s speech recognition. We receive the text that lands in the box. We do not keep the audio.",
        ],
      },
      {
        id: "use",
        heading: "5. Prohibited use",
        body: [
          "You do not use the service for spam, fraud, harassment, or other illegal acts, to bypass a network’s limits, for content that infringes copyright or privacy, or to sell or share the account.",
        ],
      },
      {
        id: "pay",
        heading: "6. What you pay, and to whom",
        body: [
          `The paid contract is between you and ${COMPANY.name}. Stripe only processes the payment: money moves through Stripe into the company’s account. Stripe is not the seller.`,
          `The subscription is access to the studio, EUR ${price} per month, after the free month described in the Subscription terms. The waitlist is free. You do not pay us your ad budget.`,
          "The amount due is the amount shown on the payment page before you confirm. If the company is, or becomes, VAT-registered, the tax is shown there and on the invoice before the charge.",
        ],
      },
      {
        id: "delete",
        heading: "7. Deleting the account",
        body: [
          "In the studio, open the account menu, choose Delete account, and confirm. Networks are disconnected, and the user and live studio data are deleted (conversations, posts, uploaded files). If you cannot sign in, use the contact page from the same email and ask for deletion.",
          "Deleting the account does not by itself undo a payment already taken. Money follows the Cancellation and refund policy. Invoices are kept for as long as tax law requires, even after the studio account is gone.",
        ],
      },
      {
        id: "end",
        heading: "8. Suspension, law, contact",
        body: [
          "You can stop using the service at any time. We can suspend access if you break these terms or if the law requires it.",
          "We do not exclude liability for fraud, gross negligence, or rights the law does not allow us to limit, including consumer rights. Otherwise, liability for a claim about the service is limited to the amount you paid us in the last 12 months.",
          "These terms are governed by Romanian law. Consumers can complain to ANPC. Courts are those of Romania, except where mandatory consumer rules in your country say otherwise.",
          `Questions: ${COMPANY.email}.`,
        ],
      },
    ],
  },
  {
    id: "privacy",
    href: "/privacy",
    label: "Privacy",
    title: "Privacy and GDPR policy",
    description: "What VLN MOTORS SRL processes for posty.now, why, and how you delete it.",
    updated: "Last updated: 22 September 2026",
    intro: [
      `${operatorEn()} ${COMPANY.name} is the controller for posty.now.`,
      "We do not sell personal data. We do not use your data to train an AI model.",
    ],
    sections: [
      {
        id: "what",
        heading: "1. What we process, and why",
        body: [
          "Pre-registration list: email and language (Romanian or English). Basis: steps before a contract, and the consent you give by submitting the form. Purpose: to tell you when we open on 15 October 2026. You can ask to be removed via the contact address.",
          "Account: email, auth identifier, and password hash, held by the auth provider. Basis: contract. Purpose: signing in.",
          "Studio: chat messages, uploaded files (up to 30, 100 MB each), posts, schedules, Team clients (name only), and the selected client. Basis: contract. Purpose: publishing, scheduling, and history.",
          "Networks: identifiers and names of connected accounts, plus the access tokens needed to publish. Basis: contract. Purpose: the action you asked for.",
          "Voice: the browser turns speech into text. We store the message text if you send it. We do not store audio.",
          "Payments: Stripe processes the card. We keep the Stripe customer id, payment status, amount, and date, so we know the subscription is active and so we can invoice. We do not store the full card number. Basis: contract and legal accounting duty.",
          "Contact form: name, email, and message. Basis: legitimate interest or pre-contract steps, so we can reply.",
        ],
      },
      {
        id: "who",
        heading: "2. Who receives data",
        body: [
          "Hosting (Vercel), database and authentication (Supabase), payments (Stripe), transactional email (Resend), an AI-model provider that receives the chat message in order to draft text, and a publishing provider that sends the confirmed post to the network you connected.",
          "Networks you connect receive the content you confirm. They have their own rules.",
          "We disclose data when the law requires it, for example an invoice or an authority request.",
        ],
      },
      {
        id: "keep",
        heading: "3. How long",
        body: [
          "A waitlist email stays until launch and the announcement, or until you ask us to delete it, whichever comes first.",
          "Studio data is deleted when you delete the account: the user, conversations, live posts, and stored files. Encrypted database backups rotate on their own and are not used for day-to-day processing.",
          "Accounting and invoice records are kept for the period required by Romanian tax law, even if the studio was deleted.",
        ],
      },
      {
        id: "rights",
        heading: "4. Your rights",
        body: [
          "You can ask for access, rectification, erasure, restriction, objection, and portability, and you can withdraw consent for the pre-registration list. Deleting the account in the studio is the direct way to erase studio data.",
          "You can complain to the ANSPDCP, the Romanian data-protection authority.",
          `Send requests to ${COMPANY.email} or through the contact page, from the account email. We reply within the GDPR period, usually one month.`,
        ],
      },
      {
        id: "delete",
        heading: "5. Deleting the account",
        body: [
          "Signed in: account menu → Delete account → confirm. Networks are disconnected, then the user and live data are deleted.",
          "Signed out: a message from the contact page, same email, asking for deletion. We check that you are the account holder before we delete.",
          "Deletion does not by itself cancel a fee for a period that already started, and it does not delete invoices the law requires us to keep.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    href: "/cookies",
    label: "Cookies",
    title: "Cookie policy",
    description: "The strictly necessary cookies posty.now uses.",
    updated: "Last updated: 22 September 2026",
    intro: [
      operatorEn(),
      "We use strictly necessary cookies only. There are no analytics, advertising, or social cookies on the site. That is why there is no consent banner: the law allows cookies the service cannot run without.",
    ],
    sections: [
      {
        id: "list",
        heading: "1. Which cookies",
        body: [
          "The sign-in session, set by the auth provider, so you stay logged in. Duration: the session and its refresh.",
          "NEXT_LOCALE: the language you picked, Romanian or English.",
          "posty_client: the Team client selected in the studio, so posts do not jump to another client. It is httpOnly. Duration: up to 400 days, or until you switch client or delete the account.",
          "Short OAuth cookies, only while you connect a network, so the return from that network’s window is yours.",
        ],
      },
      {
        id: "control",
        heading: "2. How you control them",
        body: [
          "You can delete them in the browser. Without the session cookie you are signed out. Without NEXT_LOCALE the site picks a language again. Without posty_client a Team studio no longer knows which client was open.",
          "We do not sell cookie identifiers and we do not tie them to ads outside the site.",
        ],
      },
    ],
  },
  {
    id: "refunds",
    href: "/refunds",
    label: "Refunds",
    title: "Cancellation and refund policy",
    description: "How you cancel a posty.now subscription and when money comes back.",
    updated: "Last updated: 22 September 2026",
    intro: [
      operatorEn(),
      "Cancellation stops renewal. A refund returns money already taken. They are different. Deleting the account is not, by itself, a refund request.",
    ],
    sections: [
      {
        id: "free",
        heading: "1. The waitlist and the free month",
        body: [
          "Pre-registration costs nothing. There is nothing to refund.",
          "If you are on the list and you create an account when we open on 15 October 2026, the first studio month is free. If you cancel during that month, nothing is charged.",
        ],
      },
      {
        id: "withdraw",
        heading: `2. The ${days}-day withdrawal`,
        body: [
          `If you are a consumer, you can withdraw from the distance contract within ${days} days of concluding it, without giving a reason, under Romanian Government Emergency Ordinance 34/2014.`,
          "If you ask the studio to start immediately during the withdrawal period, and you confirm that you know you lose the withdrawal right for digital service already supplied, the period already used is not refunded in full.",
          `If you did not ask for an immediate start and you withdraw within ${days} days, we refund the amount taken for that subscription in full.`,
        ],
      },
      {
        id: "cancel",
        heading: "3. Cancellation after that",
        body: [
          "You cancel the subscription from the account. It stays active until the end of the period already paid, then it does not renew. The month that has started is not refunded, because access was available.",
          "Ad budgets paid to Meta, Google, TikTok, LinkedIn, Pinterest, or others do not pass through us. You cancel those in that network’s account. We do not refund them.",
        ],
      },
      {
        id: "lifetime",
        heading: "4. Older lifetime purchases",
        body: [
          `If you paid once for lifetime access, before the monthly subscription, the refund is the amount paid minus EUR ${price} for each month that has started since activation, and not less than zero. Within ${days} days, without consent to an immediate start, the refund is full.`,
          "Example: you paid EUR 150 and two months have started, outside the full-withdrawal window. The refund is 150 − 30 = EUR 120.",
        ],
      },
      {
        id: "how",
        heading: "5. How",
        body: [
          `From the account, to cancel. For a refund that does not happen on its own, write to ${COMPANY.email} from the account email, with the payment date. Money returns to the same method, through Stripe, after the calculation above.`,
          "Account deletion is separate, from the account menu. If you also want money back, say so while you still have that right.",
        ],
      },
    ],
  },
  {
    id: "subscription",
    href: "/subscription",
    label: "Subscription",
    title: "Subscription terms",
    description: "What you buy from VLN MOTORS SRL, what it costs, and when it renews.",
    updated: "Last updated: 22 September 2026",
    intro: [
      operatorEn(),
      "These terms are the subscription contract. You accept them when you confirm payment. Until then, the pre-registration list obliges you to nothing.",
    ],
    sections: [
      {
        id: "what",
        heading: "1. What you buy",
        body: [
          `You buy monthly access to the posty.now studio, operated by ${COMPANY.name}: the assistant (text and dictation), publishing and scheduling on connected networks, stats, connecting ad accounts, and, on Team, clients on the same login.`,
          "You are not buying ad budget, guaranteed reach, or a place on a social network. Those are paid, if you want them, directly to the network, from its ad account.",
          "This subscription has no separate per-client fee. One account, one subscription. If we introduce a per-client price, you will see it on the payment page before any new amount, and the old subscription does not change without notice.",
        ],
      },
      {
        id: "price",
        heading: "2. How much, and why",
        body: [
          `The subscription price is EUR ${price} per month, for the access described above.`,
          "The first month is free if your email is on the pre-registration list and you create the account when signups open, on 15 October 2026. After the free month, the next month is charged only if you have not cancelled.",
          "Before the first charge you see the amount on the Stripe page. Currency is confirmed there. If VAT applies, it is shown before you pay, not after.",
          `${COMPANY.name} invoices the amount collected under Romanian tax law, including e-Factura when that rule applies (an individual or a company). To invoice a company, you give us correct billing details.`,
        ],
      },
      {
        id: "renew",
        heading: "3. Renewal and cancellation",
        body: [
          "The subscription renews monthly until you cancel. Cancellation stops the next charge. Access remains until the end of the period already paid or free.",
          `The ${days}-day withdrawal and refunds are in the Cancellation and refund policy.`,
        ],
      },
      {
        id: "fail",
        heading: "4. If a payment fails",
        body: [
          "If renewal fails, Stripe may retry. If it is not collected, studio access stops at the end of the paid period. Data is not deleted only because a payment failed. You delete it from the account, or you ask in writing.",
        ],
      },
    ],
  },
];

export function legalPages(locale: string) {
  return locale === "ro" ? ro : en;
}

export function legalPage(locale: string, id: LegalPage["id"]) {
  const page = legalPages(locale).find((item) => item.id === id);
  if (!page) throw new Error(`Missing legal page: ${id}`);
  return page;
}
