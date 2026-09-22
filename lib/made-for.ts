export const MADE_FOR_SLUGS = [
  "creators",
  "small-business",
  "agencies",
  "nonprofits",
  "higher-education",
  "developers",
] as const;

export type MadeForSlug = (typeof MADE_FOR_SLUGS)[number];

export type MadeForCopy = {
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
  adsTitle: string;
  adsBody: string;
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export type MadeForPage = {
  slug: MadeForSlug;
  hero: string;
  detail: string;
  en: MadeForCopy;
  ro: MadeForCopy;
};

export const MADE_FOR: MadeForPage[] = [
  {
    slug: "creators",
    hero: "/made-for/creators-hero.png",
    detail: "/made-for/creators-batch.png",
    en: {
      navTitle: "Creators",
      navBody: "Stay consistent without living in five apps.",
      metaTitle: "posty.now for creators",
      metaDescription:
        "Dictate or type what you made. posty.now writes the caption, picks the hour, and posts across your networks — up to 30 pieces in one go.",
      kicker: "Made for creators",
      title: "Film it. Say it. Posty does the rest.",
      subtitle:
        "You already spend the day making the work. posty.now turns one voice note or a short chat into captions, hashtags, and a post on every network you connected — in about a minute.",
      features: [
        {
          title: "Chat, or just talk",
          body: "Describe the video, the photo, or the take. Posty writes a native caption for each platform instead of one caption pasted everywhere.",
        },
        {
          title: "The hour that fits",
          body: "It picks a researched peak time per network. You can still override it when the drop has to go out now.",
        },
        {
          title: "See what landed",
          body: "Analytics sit next to the studio, so you can tell which post actually moved — without a spreadsheet.",
        },
      ],
      batchTitle: "A month of posts, while the idea is still warm",
      batchBody:
        "Drop in up to 30 photos or videos at once. Posty lines them up day by day, cross-platform, with the right format: Instagram stills go to Feed, video can go to Reels, TikTok takes photos and video.",
      adsTitle: "When a post should travel further",
      adsBody:
        "Say the goal — profile visits, a product link, a launch. Posty can build the paid campaign on Meta, TikTok, Google, LinkedIn, or Pinterest from the same conversation. X Ads is coming soon.",
      steps: [
        {
          title: "Connect once",
          body: "Instagram, TikTok, Facebook, LinkedIn, YouTube and the rest, in one authorization flow. X is coming soon.",
        },
        { title: "Send the work", body: "Text, photo, or video. Or dictate it. You do not rebuild the post for every app." },
        { title: "Check the plan", body: "Caption, networks, and time are in front of you before anything goes live." },
        { title: "Publish or queue", body: "One command publishes now or schedules the series. Then you go back to making." },
      ],
      faqs: [
        {
          q: "Can I post the same piece everywhere?",
          a: "Yes. Posty adapts the text per network and publishes to the accounts you connected, in one go.",
        },
        {
          q: "Do I have to pick the time myself?",
          a: "No. It suggests a strong hour for each platform. You can replace it whenever you want a specific slot.",
        },
        {
          q: "Can I boost a post without opening Ads Manager?",
          a: "You describe the campaign in chat. Posty sets it up on the ad accounts you have connected.",
        },
      ],
    },
    ro: {
      navTitle: "Creatori",
      navBody: "Rămâi constant, fără cinci aplicații deschise.",
      metaTitle: "posty.now pentru creatori",
      metaDescription:
        "Dictezi sau scrii ce ai făcut. posty.now scrie caption-ul, alege ora și postează pe rețelele tale — până la 30 de materiale dintr-o dată.",
      kicker: "Creat pentru creatori",
      title: "Filmezi. Spui. Posty face restul.",
      subtitle:
        "Ziua o petreci făcând conținutul. posty.now transformă o notă vocală sau un mesaj scurt în caption, hashtag-uri și postare pe fiecare rețea conectată — cam într-un minut.",
      features: [
        {
          title: "Din chat, sau pe voce",
          body: "Descrii clipul, poza sau ideea. Posty scrie un text nativ pentru fiecare platformă, nu același caption lipit peste tot.",
        },
        {
          title: "Ora care se potrivește",
          body: "Alege o oră de vârf din research, pe fiecare rețea. Poți s-o schimbi când postarea trebuie să iasă acum.",
        },
        {
          title: "Vezi ce a prins",
          body: "Analizele stau lângă studio, ca să știi ce postare a mișcat ceva — fără un tabel separat.",
        },
      ],
      batchTitle: "O lună de postări, cât ideea e încă caldă",
      batchBody:
        "Pui până la 30 de poze sau clipuri odată. Posty le așază zi de zi, cross-platform, cu formatul potrivit: pozele de Instagram merg în Feed, clipul poate merge în Reels, TikTok primește și poze, și video.",
      adsTitle: "Când o postare trebuie să ajungă mai departe",
      adsBody:
        "Spui ținta — vizite pe profil, un link de produs, o lansare. Posty poate construi campania plătită pe Meta, TikTok, Google, LinkedIn sau Pinterest, din aceeași conversație. X Ads urmează.",
      steps: [
        { title: "Conectezi o dată", body: "Instagram, TikTok, Facebook, LinkedIn, YouTube și restul, dintr-un flux. X e în curând." },
        { title: "Trimiți lucrul", body: "Text, poză sau video. Sau dictezi. Nu reconstruiești postarea pentru fiecare aplicație." },
        { title: "Verifici planul", body: "Caption, rețele și oră sunt în fața ta înainte să plece ceva live." },
        { title: "Publici sau pui în coadă", body: "O comandă publică acum sau programează seria. Apoi te întorci la făcut." },
      ],
      faqs: [
        {
          q: "Pot posta același material peste tot?",
          a: "Da. Posty adaptează textul pe fiecare rețea și publică pe conturile conectate, dintr-o dată.",
        },
        {
          q: "Trebuie să aleg eu ora?",
          a: "Nu. Propune o oră bună pentru fiecare platformă. O poți înlocui când vrei un interval anume.",
        },
        {
          q: "Pot promova o postare fără Ads Manager?",
          a: "Descrii campania în chat. Posty o pregătește pe conturile de reclame pe care le-ai conectat.",
        },
      ],
    },
  },
  {
    slug: "small-business",
    hero: "/made-for/small-business-hero.png",
    detail: "/made-for/small-business-window.png",
    en: {
      navTitle: "Small business",
      navBody: "A simpler way to run the shop’s social — and its ads.",
      metaTitle: "posty.now for small business",
      metaDescription:
        "One chat for posts, scheduling, and paid ads. Built for owners who do not have a marketing team.",
      kicker: "Made for small business",
      title: "The shop is open. The posts should be too.",
      subtitle:
        "You do not need a social hire to stay visible. Tell posty.now about today’s offer, a new product, or this weekend’s hours. It writes the posts, times them, and can turn the same brief into a paid ad.",
      features: [
        {
          title: "One photo, every local channel",
          body: "Instagram, Facebook, and Google Business from the same message. The caption changes so it does not read like a copy-paste.",
        },
        {
          title: "A week planned between customers",
          body: "Queue up to 30 pieces. Posty publishes one a day at a sensible hour, so the feed does not go quiet when you are on the floor.",
        },
        {
          title: "Numbers you can read",
          body: "See which post brought attention, without learning a new analytics product.",
        },
      ],
      batchTitle: "The offer goes out while you are still in the shop",
      batchBody:
        "A voice note between customers is enough: what you are selling, the photo, the date. Posty drafts the posts and, if you want reach beyond your followers, the ad.",
      adsTitle: "A weekend promotion, without a media buyer",
      adsBody:
        "Say the budget idea and who should see it — people nearby, a product, a booking link. Posty sets up the campaign on Meta, Google, TikTok, LinkedIn, or Pinterest. Personalized email marketing is on the way, for when you want to write to customers you already have.",
      steps: [
        { title: "Connect the shop", body: "The networks customers already use, plus the ad account if you want to pay for reach." },
        { title: "Describe the offer", body: "Plain language. Photo from your phone. No brief, no brand deck." },
        { title: "Approve the draft", body: "You see the caption, the time, and — if you asked — the ad, before it spends or publishes." },
        { title: "Let the week run", body: "Scheduled posts go out on their own. You stay with the customers in front of you." },
      ],
      faqs: [
        {
          q: "I am not a marketer. Is this still for me?",
          a: "Yes. You talk the way you would explain the offer to a regular. Posty handles captions, timing, and the platforms.",
        },
        {
          q: "Can I advertise only sometimes?",
          a: "Yes. Organic posts work on their own. Ads are there when a specific offer needs to leave your existing audience.",
        },
        {
          q: "Does it post to Google Business?",
          a: "Yes, alongside Instagram, Facebook, TikTok, LinkedIn, YouTube, Pinterest, Bluesky, and Reddit. X is coming soon.",
        },
      ],
    },
    ro: {
      navTitle: "Afaceri mici",
      navBody: "Un mod mai simplu să ții socialul magazinului — și reclamele.",
      metaTitle: "posty.now pentru afaceri mici",
      metaDescription:
        "Un chat pentru postări, programări și reclame plătite. Pentru cei care nu au o echipă de marketing.",
      kicker: "Creat pentru afaceri mici",
      title: "Magazinul e deschis. Și postările ar trebui să fie.",
      subtitle:
        "Nu ai nevoie de un om de social ca să rămâi vizibil. Îi spui lui posty.now oferta de azi, produsul nou sau programul de weekend. Scrie postările, le pune la oră și poate transforma același brief într-o reclamă plătită.",
      features: [
        {
          title: "O poză, toate canalele locale",
          body: "Instagram, Facebook și Google Business din același mesaj. Caption-ul se schimbă, ca să nu pară copy-paste.",
        },
        {
          title: "O săptămână planificată între clienți",
          body: "Pui până la 30 de materiale. Posty publică câte unul pe zi, la o oră potrivită, ca feed-ul să nu amuțească când ești în magazin.",
        },
        {
          title: "Cifre pe care le citești",
          body: "Vezi ce postare a adus atenție, fără să înveți un alt tool de analiză.",
        },
      ],
      batchTitle: "Oferta pleacă cât ești încă în magazin",
      batchBody:
        "O notă vocală între clienți ajunge: ce vinzi, poza, data. Posty face ciorna postărilor și, dacă vrei reach dincolo de urmăritori, și reclama.",
      adsTitle: "O promoție de weekend, fără media buyer",
      adsBody:
        "Spui ideea de buget și cine ar trebui s-o vadă — oameni din zonă, un produs, un link de rezervare. Posty pregătește campania pe Meta, Google, TikTok, LinkedIn sau Pinterest. Email marketing personalizat urmează, pentru când vrei să scrii clienților pe care îi ai deja.",
      steps: [
        { title: "Conectezi magazinul", body: "Rețelele pe care sunt deja clienții, plus contul de ads dacă vrei reach plătit." },
        { title: "Descrii oferta", body: "Pe limba ta. Poză din telefon. Fără brief și fără prezentare de brand." },
        { title: "Aprobi ciorna", body: "Vezi caption-ul, ora și — dacă ai cerut — reclama, înainte să cheltuiască sau să publice." },
        { title: "Lași săptămâna să meargă", body: "Postările programate ies singure. Tu rămâi cu oamenii din fața ta." },
      ],
      faqs: [
        {
          q: "Nu sunt marketer. E totuși pentru mine?",
          a: "Da. Vorbești cum ai explica oferta unui client obișnuit. Posty se ocupă de text, oră și platforme.",
        },
        {
          q: "Pot face reclame doar din când în când?",
          a: "Da. Postările organice merg singure. Reclamele sunt acolo când o ofertă trebuie să iasă din publicul pe care îl ai deja.",
        },
        {
          q: "Postează și pe Google Business?",
          a: "Da, lângă Instagram, Facebook, TikTok, LinkedIn, YouTube, Pinterest, Bluesky și Reddit. X e în curând.",
        },
      ],
    },
  },
  {
    slug: "agencies",
    hero: "/made-for/agencies-hero.png",
    detail: "/made-for/agencies-desk.png",
    en: {
      navTitle: "Agencies",
      navBody: "Every client’s networks, in one studio.",
      metaTitle: "posty.now for agencies",
      metaDescription:
        "One agency login, a client for each brand, and a chat that posts, schedules, and runs ads without mixing accounts.",
      kicker: "Made for agencies",
      title: "One login. A clean workspace per client.",
      subtitle:
        "posty.now Team is built for an agency that posts for other people. You add clients by name. Their accounts, chats, and posts stay on that client — not mixed into the next brand’s feed.",
      features: [
        {
          title: "Switch the client, not the tool",
          body: "Pick who you are working for. Connect, chat, schedule, and read stats only for that client.",
        },
        {
          title: "A month queued in one sitting",
          body: "Up to 30 assets, posted day by day, across that client’s networks. Captions and times are proposed, not copied blindly.",
        },
        {
          title: "Ads live with the same client",
          body: "Meta, Google, LinkedIn, TikTok, Pinterest, and OpenAI ads stay attached to the client you selected.",
        },
      ],
      batchTitle: "The calendar does not leak between brands",
      batchBody:
        "A series for one client cannot land on another client’s Instagram. You still move fast: describe the month, review the plan, confirm. Teammate invites are not part of this phase — it is one agency login, many clients.",
      adsTitle: "Client campaigns without a second product",
      adsBody:
        "Tell Posty the offer, the audience, and the goal. It prepares the paid campaign on the ad accounts connected to that client. Organic posting and paid reach stay in the same conversation. Personalized email marketing comes next.",
      steps: [
        { title: "Open a Team studio", body: "One login for the agency. Add each client by name." },
        { title: "Connect their networks", body: "Accounts belong to the client you selected. Switching clients switches the studio." },
        { title: "Brief it in chat", body: "Voice or text. The month, the offer, the networks, the ad if there is one." },
        { title: "Ship the plan", body: "Review captions and times, then schedule or publish. Stats stay on that client." },
      ],
      faqs: [
        {
          q: "Can two clients share one Instagram?",
          a: "No. A connected account belongs to one client, so a post cannot cross into another brand by accident.",
        },
        {
          q: "Can I invite the rest of the team?",
          a: "Not in this phase. Team means one agency login and as many clients as you add. Colleague invites come later.",
        },
        {
          q: "Do ads count as a separate tool?",
          a: "No. You ask for the campaign in the same chat, on the ad platforms you connected for that client.",
        },
      ],
    },
    ro: {
      navTitle: "Agenții",
      navBody: "Rețelele fiecărui client, într-un singur studio.",
      metaTitle: "posty.now pentru agenții",
      metaDescription:
        "Un login de agenție, un client pentru fiecare brand și un chat care postează, programează și pune reclame fără să amestece conturile.",
      kicker: "Creat pentru agenții",
      title: "Un login. Un spațiu curat pentru fiecare client.",
      subtitle:
        "posty.now Team e pentru o agenție care postează pentru alții. Adaugi clienții pe nume. Conturile, chat-ul și postările rămân la clientul ăla — nu se amestecă în feed-ul următorului brand.",
      features: [
        {
          title: "Schimbi clientul, nu unealta",
          body: "Alegi pentru cine lucrezi. Conectezi, scrii, programezi și citești statistici doar pentru el.",
        },
        {
          title: "O lună pusă în coadă dintr-o ședință",
          body: "Până la 30 de materiale, zi de zi, pe rețelele clientului. Caption-urile și orele sunt propuse, nu copiate orb.",
        },
        {
          title: "Reclamele stau la același client",
          body: "Meta, Google, LinkedIn, TikTok, Pinterest și OpenAI Ads rămân legate de clientul selectat.",
        },
      ],
      batchTitle: "Calendarul nu se scurge între branduri",
      batchBody:
        "O serie pentru un client nu poate ateriza pe Instagramul altuia. Totuși mergi repede: descrii luna, verifici planul, confirmi. Invitațiile pentru colegi nu sunt în faza asta — e un login de agenție și oricâți clienți adaugi.",
      adsTitle: "Campanii de client, fără un al doilea produs",
      adsBody:
        "Îi spui lui Posty oferta, audiența și ținta. Pregătește campania plătită pe conturile de ads conectate la clientul ăla. Postarea organică și reach-ul plătit stau în aceeași conversație. Email marketing personalizat urmează.",
      steps: [
        { title: "Deschizi un studio Team", body: "Un login pentru agenție. Adaugi fiecare client pe nume." },
        { title: "Le conectezi rețelele", body: "Conturile țin de clientul selectat. Schimbi clientul, se schimbă studio-ul." },
        { title: "Brief în chat", body: "Voce sau text. Luna, oferta, rețelele, reclama dacă există." },
        { title: "Trimiți planul", body: "Verifici caption-urile și orele, apoi programezi sau publici. Statisticile rămân la client." },
      ],
      faqs: [
        {
          q: "Pot doi clienți să împartă un Instagram?",
          a: "Nu. Un cont conectat ține de un singur client, ca o postare să nu sară din greșeală la alt brand.",
        },
        {
          q: "Pot invita restul echipei?",
          a: "Nu în faza asta. Team înseamnă un login de agenție și clienții pe care îi adaugi. Invitațiile pentru colegi vin mai târziu.",
        },
        {
          q: "Reclamele sunt un tool separat?",
          a: "Nu. Ceri campania în același chat, pe platformele de ads conectate pentru clientul ăla.",
        },
      ],
    },
  },
  {
    slug: "nonprofits",
    hero: "/made-for/nonprofits-hero.png",
    detail: "/made-for/nonprofits-event.png",
    en: {
      navTitle: "Nonprofits",
      navBody: "Campaigns and updates, without a comms department.",
      metaTitle: "posty.now for nonprofits",
      metaDescription:
        "Tell posty.now about the event, the drive, or the update. It posts across your channels and can run a small paid push when the moment matters.",
      kicker: "Made for nonprofits",
      title: "The work is the point. The posts should not eat the week.",
      subtitle:
        "A small team can still show up online. Describe the fundraiser, the volunteer call, or the recap. posty.now writes it, times it, and publishes it where your people already are.",
      features: [
        {
          title: "One update, every channel",
          body: "The same story, written so it fits Instagram, Facebook, LinkedIn, or a short video network — without a second afternoon of copy.",
        },
        {
          title: "The campaign stays on the calendar",
          body: "Queue the week or the month, up to 30 pieces. The feed keeps moving after the event night is over.",
        },
        {
          title: "Proof for the board",
          body: "Analytics show what was seen, so the next report is not a guess.",
        },
      ],
      batchTitle: "Plan the drive before the weekend hits",
      batchBody:
        "Photos from the last event, dates for the next one, a clear ask. Posty lines them up day by day so volunteers are not also the social team.",
      adsTitle: "A small paid push, when the ask is time-sensitive",
      adsBody:
        "Organic reach is the default. When a deadline is real — donations this week, volunteers by Friday — say who should see it and Posty prepares the ad on Meta, Google, or the other accounts you connected. No media plan required.",
      steps: [
        { title: "Connect the organization’s accounts", body: "The channels you already use. Ads only if you choose to spend." },
        { title: "Explain the ask", body: "Who it helps, what you need, by when. Voice is fine if you are between meetings." },
        { title: "Read it before it goes out", body: "Tone matters. You approve the caption and the time." },
        { title: "Keep the story going", body: "A queued series covers the days you are out doing the actual work." },
      ],
      faqs: [
        {
          q: "We post rarely. Is a scheduler still useful?",
          a: "Yes. The point is the weeks you do have something to say: one sitting can cover the whole run-up to an event.",
        },
        {
          q: "Will it sound like a brand agency?",
          a: "It writes from what you said. You can tell it to stay plain, warm, or short before anything publishes.",
        },
        {
          q: "Do we have to run ads?",
          a: "No. Ads are optional, for the moments when the people who need to see the ask are not already following you.",
        },
      ],
    },
    ro: {
      navTitle: "ONG-uri",
      navBody: "Campanii și noutăți, fără un departament de comunicare.",
      metaTitle: "posty.now pentru ONG-uri",
      metaDescription:
        "Îi spui lui posty.now de eveniment, strângere sau update. Postează pe canalele voastre și poate face un boost plătit mic când momentul contează.",
      kicker: "Creat pentru ONG-uri",
      title: "Lucrul contează. Postările nu ar trebui să-ți mănânce săptămâna.",
      subtitle:
        "O echipă mică poate totuși să apară online. Descrii strângerea de fonduri, apelul de voluntari sau rezumatul. posty.now îl scrie, îi pune ora și îl publică unde sunt deja oamenii voștri.",
      features: [
        {
          title: "Un update, toate canalele",
          body: "Aceeași poveste, scrisă să încapă pe Instagram, Facebook, LinkedIn sau o rețea de video — fără o după-amiază în plus de copy.",
        },
        {
          title: "Campania rămâne în calendar",
          body: "Pui săptămâna sau luna, până la 30 de materiale. Feed-ul continuă și după seara evenimentului.",
        },
        {
          title: "Dovadă pentru board",
          body: "Analizele arată ce s-a văzut, ca următorul raport să nu fie o presupunere.",
        },
      ],
      batchTitle: "Planifici strângerea înainte de weekend",
      batchBody:
        "Poze de la ultimul eveniment, datele următorului, o cerere clară. Posty le așază zi de zi, ca voluntarii să nu fie și echipa de social.",
      adsTitle: "Un boost plătit mic, când cererea are termen",
      adsBody:
        "Reach-ul organic e varianta normală. Când termenul e real — donații săptămâna asta, voluntari până vineri — spui cine ar trebui să vadă și Posty pregătește reclama pe Meta, Google sau celelalte conturi conectate. Fără plan media.",
      steps: [
        { title: "Conectezi conturile organizației", body: "Canalele pe care le folosiți deja. Ads doar dacă alegeți să cheltuiți." },
        { title: "Explici cererea", body: "Pe cine ajută, ce vă trebuie, până când. Vocea merge, dacă ești între întâlniri." },
        { title: "Citești înainte să iasă", body: "Tonul contează. Aprobi caption-ul și ora." },
        { title: "Povestea continuă", body: "O serie programată acoperă zilele în care ești pe teren." },
      ],
      faqs: [
        {
          q: "Postăm rar. Ne trebuie totuși un scheduler?",
          a: "Da. Contează săptămânile în care aveți ce spune: o ședință poate acoperi toată perioada dinaintea unui eveniment.",
        },
        {
          q: "O să sune a agenție de brand?",
          a: "Scrie din ce ați spus voi. Puteți cere să rămână simplu, cald sau scurt, înainte să publice ceva.",
        },
        {
          q: "Trebuie să facem reclame?",
          a: "Nu. Reclamele sunt opționale, pentru momentele în care oamenii care trebuie să vadă cererea nu vă urmăresc deja.",
        },
      ],
    },
  },
  {
    slug: "higher-education",
    hero: "/made-for/education-hero.png",
    detail: "/made-for/education-campus.png",
    en: {
      navTitle: "Higher education",
      navBody: "Campus updates, events, and admissions — on time.",
      metaTitle: "posty.now for higher education",
      metaDescription:
        "Schedule campus posts from chat: events, admissions, and student life, with the right hour on each network.",
      kicker: "Made for higher education",
      title: "The campus calendar, posted without a war room.",
      subtitle:
        "Open days, deadlines, student stories, a talk tonight. posty.now takes the note from the communications desk and turns it into posts on the accounts the university already runs.",
      features: [
        {
          title: "Deadlines do not depend on whoever is free",
          body: "Write the date once. Posty schedules the reminder across the networks, at an hour students actually open the app.",
        },
        {
          title: "Different accounts, one brief",
          body: "Admissions, a faculty, the main campus page. Say which account, and the caption fits that voice.",
        },
        {
          title: "A month of student life in one pass",
          body: "Up to 30 photos or clips, one a day, so the feed is not only announcements.",
        },
      ],
      batchTitle: "Open day is a series, not a single story",
      batchBody:
        "Teaser, reminder, day-of, recap. Describe the run and attach the photos. Posty spaces them out instead of dumping four posts on Thursday afternoon.",
      adsTitle: "Admissions reach, when organic is not enough",
      adsBody:
        "A program launch or an application deadline can leave the campus following. Say the audience and the date. Posty prepares the paid campaign on Meta, Google, LinkedIn, TikTok, or Pinterest. You still approve it before it spends.",
      steps: [
        { title: "Connect the campus accounts", body: "The pages and profiles you are allowed to post from." },
        { title: "Send the notice", body: "The date, the place, who it is for. A voice note from a busy office is enough." },
        { title: "Match the voice", body: "Tell Posty if this one is admissions, a faculty, or student life." },
        { title: "Schedule the run", body: "Review the series, then let the reminders go out on their own." },
      ],
      faqs: [
        {
          q: "Can we post to several campus accounts?",
          a: "Yes. Connect each one, then say which account a post belongs to.",
        },
        {
          q: "Will it pick a time students might see?",
          a: "It suggests a peak hour per platform. You can pin a post to the morning of a deadline if you prefer.",
        },
        {
          q: "Can admissions run a paid campaign from here?",
          a: "Yes, on the ad accounts you connect. Nothing spends until you confirm the plan.",
        },
      ],
    },
    ro: {
      navTitle: "Învățământ superior",
      navBody: "Noutăți de campus, evenimente și admitere — la timp.",
      metaTitle: "posty.now pentru învățământ superior",
      metaDescription:
        "Programezi postările de campus din chat: evenimente, admitere și viață de student, cu ora potrivită pe fiecare rețea.",
      kicker: "Creat pentru învățământ superior",
      title: "Calendarul campusului, postat fără o cameră de război.",
      subtitle:
        "Zile porți deschise, termene, povești de studenți, o conferință diseară. posty.now ia notița de la biroul de comunicare și o transformă în postări pe conturile pe care universitatea le are deja.",
      features: [
        {
          title: "Termenele nu depind de cine e liber",
          body: "Scrii data o dată. Posty programează reminderul pe rețele, la o oră la care studenții chiar deschid aplicația.",
        },
        {
          title: "Conturi diferite, un singur brief",
          body: "Admitere, o facultate, pagina principală. Spui care cont, iar caption-ul se potrivește vocii ăleia.",
        },
        {
          title: "O lună de viață de student dintr-o trecere",
          body: "Până la 30 de poze sau clipuri, una pe zi, ca feed-ul să nu fie doar anunțuri.",
        },
      ],
      batchTitle: "Ziua porților deschise e o serie, nu un story",
      batchBody:
        "Teaser, reminder, ziua evenimentului, recap. Descrii cursul și atașezi pozele. Posty le spațiază, în loc să arunce patru postări joi după-amiază.",
      adsTitle: "Reach de admitere, când organic nu ajunge",
      adsBody:
        "Lansarea unui program sau un termen de înscriere poate ieși din urmăritorii campusului. Spui audiența și data. Posty pregătește campania plătită pe Meta, Google, LinkedIn, TikTok sau Pinterest. O aprobi înainte să cheltuiască.",
      steps: [
        { title: "Conectezi conturile de campus", body: "Paginile și profilurile din care aveți voie să postați." },
        { title: "Trimiți anunțul", body: "Data, locul, pentru cine e. O notă vocală dintr-un birou aglomerat ajunge." },
        { title: "Potrivești vocea", body: "Îi spui lui Posty dacă e admitere, o facultate sau viață de student." },
        { title: "Programezi seria", body: "Verifici seria, apoi lași reminderele să iasă singure." },
      ],
      faqs: [
        {
          q: "Putem posta pe mai multe conturi de campus?",
          a: "Da. Le conectați pe fiecare, apoi spuneți cărei postări îi aparține.",
        },
        {
          q: "Alege o oră pe care studenții ar putea s-o vadă?",
          a: "Propune o oră de vârf pe platformă. Puteți fixa o postare în dimineața unui termen, dacă preferați.",
        },
        {
          q: "Admiterea poate rula o campanie plătită de aici?",
          a: "Da, pe conturile de ads pe care le conectați. Nu se cheltuie nimic până confirmați planul.",
        },
      ],
    },
  },
  {
    slug: "developers",
    hero: "/made-for/developers-hero.png",
    detail: "/made-for/developers-desk.png",
    en: {
      navTitle: "Developers",
      navBody: "Ship the product. Don’t build a social scheduler.",
      metaTitle: "posty.now for developers",
      metaDescription:
        "Launch notes, changelogs, and product posts from chat — scheduled across networks, with ads when a release needs reach.",
      kicker: "Made for developers",
      title: "Your users will not read the commit.",
      subtitle:
        "posty.now is not an API you embed. It is the studio you use when a release, a waitlist, or a changelog still has to show up on social — without you writing a posting pipeline.",
      features: [
        {
          title: "From the diff to a post",
          body: "Say what shipped, in the words you would use in a changelog. Posty turns that into a caption people actually finish reading.",
        },
        {
          title: "Launch week, queued",
          body: "Teaser, release day, a follow-up. Up to 30 pieces, one a day, on the networks you connected.",
        },
        {
          title: "You stay in the product",
          body: "No tab for every network. One chat, then back to the thing you are building.",
        },
      ],
      batchTitle: "A release is more than the night it ships",
      batchBody:
        "The posts before and after are what people see. Describe the sequence once — problem, what changed, where to try it — and Posty schedules it instead of you remembering on Friday.",
      adsTitle: "Pay for the launch window, not for a new dashboard",
      adsBody:
        "If the release needs people who do not follow you yet, say so. Posty prepares the campaign on Meta, Google, LinkedIn, TikTok, or Pinterest. You confirm before it spends. There is no public developer API in this phase.",
      steps: [
        { title: "Connect the product’s accounts", body: "Wherever you already talk to users. X is coming soon." },
        { title: "Describe the change", body: "What it does, who it is for, the link. Voice notes work if your hands are on the keyboard." },
        { title: "Read the caption", body: "Cut the jargon if you want. Nothing publishes until you say so." },
        { title: "Schedule the week", body: "The series goes out while you are on the next bug." },
      ],
      faqs: [
        {
          q: "Is there an API?",
          a: "Not in this phase. You use the studio in the browser: chat, schedule, analytics, and ads.",
        },
        {
          q: "Can it post a changelog without sounding like marketing?",
          a: "Yes. Tell it to stay short and concrete. It writes from your description.",
        },
        {
          q: "Can a launch also be an ad?",
          a: "Yes. Ask for a campaign in the same chat, on the ad accounts you connected, and approve it before spend.",
        },
      ],
    },
    ro: {
      navTitle: "Developeri",
      navBody: "Lansezi produsul. Nu-ți construiești un scheduler.",
      metaTitle: "posty.now pentru developeri",
      metaDescription:
        "Note de lansare, changelog și postări de produs din chat — programate pe rețele, cu reclame când un release are nevoie de reach.",
      kicker: "Creat pentru developeri",
      title: "Utilizatorii nu citesc commit-ul.",
      subtitle:
        "posty.now nu e un API pe care îl îngropi în produs. E studio-ul pe care îl folosești când un release, un waitlist sau un changelog trebuie să apară pe social — fără să scrii tu o conductă de postare.",
      features: [
        {
          title: "De la diff la postare",
          body: "Spui ce a ieșit, în cuvintele din changelog. Posty le transformă într-un caption pe care oamenii îl termină de citit.",
        },
        {
          title: "Săptămâna de lansare, în coadă",
          body: "Teaser, ziua de release, un follow-up. Până la 30 de materiale, una pe zi, pe rețelele conectate.",
        },
        {
          title: "Rămâi în produs",
          body: "Fără un tab pentru fiecare rețea. Un chat, apoi înapoi la ce construiești.",
        },
      ],
      batchTitle: "Un release e mai mult decât noaptea în care iese",
      batchBody:
        "Postările dinainte și de după sunt ce văd oamenii. Descrii secvența o dată — problema, ce s-a schimbat, unde se încearcă — și Posty o programează, în loc să-ți amintești vineri.",
      adsTitle: "Plătești fereastra de lansare, nu un dashboard nou",
      adsBody:
        "Dacă release-ul are nevoie de oameni care nu te urmăresc încă, spui asta. Posty pregătește campania pe Meta, Google, LinkedIn, TikTok sau Pinterest. Confirmi înainte să cheltuiască. Nu există API public pentru developeri în faza asta.",
      steps: [
        { title: "Conectezi conturile produsului", body: "Unde vorbești deja cu utilizatorii. X e în curând." },
        { title: "Descrii schimbarea", body: "Ce face, pentru cine, linkul. Nota vocală merge dacă ai mâinile pe tastatură." },
        { title: "Citești caption-ul", body: "Tai jargonul dacă vrei. Nu se publică nimic până spui tu." },
        { title: "Programezi săptămâna", body: "Seria iese cât ești pe următorul bug." },
      ],
      faqs: [
        {
          q: "Există un API?",
          a: "Nu în faza asta. Folosești studio-ul în browser: chat, programare, analize și reclame.",
        },
        {
          q: "Poate posta un changelog fără să sune a marketing?",
          a: "Da. Îi spui să rămână scurt și concret. Scrie din descrierea ta.",
        },
        {
          q: "O lansare poate fi și o reclamă?",
          a: "Da. Ceri campania în același chat, pe conturile de ads conectate, și o aprobi înainte de cheltuială.",
        },
      ],
    },
  },
];

export function isMadeForSlug(value: string): value is MadeForSlug {
  return (MADE_FOR_SLUGS as readonly string[]).includes(value);
}

export function getMadeFor(slug: string) {
  return MADE_FOR.find((page) => page.slug === slug);
}
