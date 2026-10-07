import type { GuideDoc } from "./types";

export const DE: GuideDoc = {
  title: "Anleitung",
  subtitle:
    "Alles, was du in posty.now tun kannst: Assistent, Verbindungen, Beiträge, Analysen, Nachrichten, Leads, Anzeigen und Sprache — Schritt für Schritt, mit Beispielen.",
  toc: "Inhalt",
  tipLabel: "Tipp",
  tryLabel: "Sag dem Assistenten",
  ctaTitle: "Bereit zum Ausprobieren?",
  ctaButton: "Assistent öffnen",
  downloadLabel: "PDF herunterladen",
  pdfHref: "/manual-posty-now-de.pdf",
  quoteStart: "„",
  quoteEnd: "“",
  networkLabels: {
    can: "Kann erstellen",
    boost: "Boost",
    audiences: "Zielgruppen",
    stats: "Analysen",
  },
  sections: [
    {
      id: "start",
      title: "Was posty.now ist",
      body: [
        "posty.now ist ein Studio mit KI-Assistent. Du sagst, was du willst — per Text oder per Stimme — und Posty schreibt, plant und veröffentlicht auf den verbundenen Netzwerken. Du springst nicht zwischen Apps, um dasselbe Foto auf Instagram, TikTok und Facebook zu bringen.",
        "Neben organischen Beiträgen stehen bezahlte Anzeigen, der Posteingang (Nachrichten und Kommentare) und ein Lead-Agent, den du auf deiner Website trainierst. Beiträge und Ads sind zwei verschiedene Jobs; das Studio hält beides, vermischt sie aber nicht.",
        "Oben in der Leiste: Assistent, Verbindungen, Beiträge, Analysen, Nachrichten, Leads, Anzeigen und Anleitung. Nachrichten öffnet zwei Tabs: Direktnachrichten und Kommentare. Unten: Ortszeit, Sprache und Konto. Im Team wählst du dort auch den Kunden — Verbindungen, Beiträge und Leads gehören zum ausgewählten Kunden. Jede Planung folgt dieser Uhr, nicht einer anderen Zeitzone.",
      ],
      tips: [
        {
          title: "Fang mit den Verbindungen an",
          body: "Der Assistent kann sofort Texte schreiben. Zum Veröffentlichen, für Analysen oder Antworten im Posteingang verbindest du zuerst die Netzwerke unter Verbindungen — SOCIAL fürs Posten, ADS wenn du Werbung schaltest.",
        },
      ],
    },
    {
      id: "accounts-posts",
      title: "Verbindungen: Beiträge",
      body: [
        "Gehe zu Verbindungen. Unter SOCIAL verbindest du Instagram, Facebook, Threads, TikTok, YouTube, LinkedIn, Pinterest, Google Business, X, Bluesky und Reddit.",
        "Klick auf Connect, autorisiere, fertig. Facebook fragt nach einer Seite, LinkedIn nach Profil oder Unternehmensseite, Pinterest nach einem Board, Google Business nach einem Standort.",
        "Bluesky hat kein normales Login: du brauchst ein App Password, nicht das übliche Kontopasswort. Der Hilfe-Link auf der Karte erklärt, wie du eines erstellst.",
        "Du kannst mehrere Konten im selben Netzwerk verbinden. Was hier hängt, kann der Assistent veröffentlichen — und es erscheint unter Beiträge, Analysen und Nachrichten.",
      ],
      tips: [
        {
          title: "Das ist keine Werbung",
          body: "Ein Instagram zum Posten öffnet nicht automatisch Meta Ads. Bezahlte Konten liegen weiter unten in Verbindungen, unter ADS.",
        },
      ],
    },
    {
      id: "accounts-ads",
      title: "Verbindungen: Anzeigen",
      lead: "Beiträge bringen organische Reichweite. Ads zahlen, um gesehen zu werden. In posty.now gehört beides dazu — sie werden nur getrennt verbunden.",
      body: [
        "Immer noch unter Verbindungen, weiter unten bei ADS: Meta Ads, Google Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads, X Ads und OpenAI Ads.",
        "Ein Anzeigenkonto postet nicht ins Feed. Es schaltet bezahlte Kampagnen frei: was läuft, was du ausgibst, was zurückkommt. Die Kampagnenliste steht unter Anzeigen in der oberen Leiste. Neue Kampagnen erstellst du im Assistenten.",
        "OpenAI Ads hat kein Login-Fenster: du fügst einen API-Schlüssel aus dem ChatGPT Ads Manager ein. Diese Ads sind Karten in ChatGPT (Titel, Text, Bild, Link), nur statische Bilder, festes Kampagnenbudget (mindestens 1 $), und Business-Berechtigung — derzeit USA, Kanada, Australien und Neuseeland.",
      ],
      tips: [
        {
          title: "Organisch + bezahlt bei Meta",
          body: "Wenn du auf Instagram/Facebook postest und auch Anzeigen schaltest, verbinde beides: SOCIAL (Instagram, Facebook) und ADS (Meta Ads). Eins ohne das andere ist nur die halbe Sicht.",
        },
        {
          title: "Kampagnen-Creative ist keine Seriendatei",
          body: "Eine Aktion oder eine datierte Anzeige lädst du allein hoch, mit klarer Uhrzeit. Zwischen 29 anderen Tagesdateien kann sie am falschen Tag landen.",
        },
      ],
    },
    {
      id: "ads-networks",
      title: "Was jedes Ads-Netzwerk kann",
      body: [
        "Jede Ads-Plattform arbeitet anders. Die Karte unter Verbindungen → ADS zeigt, was du anlegen kannst, ob du bestehenden Inhalt boosten kannst, welche Zielgruppen du bekommst und wie vollständig die Zahlen sind.",
        "Boost heißt: Geld hinter etwas setzen, das schon existiert (Beitrag, Pin, Tweet). Eine eigenständige Kampagne ist eine neue Anzeige. Nicht jedes Netzwerk kann beides.",
      ],
      networks: [
        {
          name: "Meta Ads",
          can: "Vollständige Kampagnen: Campaign → Ad set → Ad.",
          boost: "Ja — bestehende organische Beiträge boosten.",
          audiences: "Custom und Lookalike.",
          stats: "Spend, Impressions, Reichweite, CTR, CPC, CPM, ROAS, Conversions.",
        },
        {
          name: "Google Ads",
          can: "Search (Responsive Search Ads) und Display (Responsive Display Ads).",
          boost: "Nicht zutreffend — Google boostet keinen Social-Post.",
          audiences: "Kein Audience-Targeting aus Posty; Search und Display.",
          stats: "Vollständige aggregierte Reports.",
        },
        {
          name: "LinkedIn Ads",
          can: "Bild, Video, Karussell, Dokument, Event, Text-Ad, Conversation Ads und mehr.",
          boost: "Ja.",
          audiences: "Kontakt-/Firmenlisten und Retargeting — nur Lesen; neue Zielgruppen legst du nicht in Posty an.",
          stats: "Spend, CPC, CPM, plus Jobtitel, Seniorität, Branche, Unternehmensgröße.",
        },
        {
          name: "TikTok Ads",
          can: "Eigenständige Video-Kampagnen.",
          boost: "Spark Ads — natives TikTok-Content bewerben.",
          audiences: "Custom und Lookalike.",
          stats: "Spend, Views, CTR, CPM, nahezu in Echtzeit.",
        },
        {
          name: "Pinterest Ads",
          can: "Neue Promoted Pins.",
          boost: "Ja — bestehende organische Pins bewerben.",
          audiences: "Basis: Demografie und Land.",
          stats: "Spend, Saves, Closeups, Clicks.",
        },
        {
          name: "X Ads",
          can: "Bestehende Tweets boosten oder eigenständige Kampagnen (Text bis 280 Zeichen + Link-Karte).",
          boost: "Ja.",
          audiences: "Ort und Sprache. E-Mail-Listen sind fortgeschritten (mindestens 100 kürzlich aktive Nutzer).",
          stats: "Spend, CPE, CPM, Link-Klicks.",
        },
        {
          name: "OpenAI Ads",
          can: "Karten in ChatGPT Free/Go: Titel, Text, Bild, URL. Kein Video.",
          boost: "Nicht zutreffend.",
          audiences: "Nur Ort (Land/Region).",
          stats: "Impressions, Klicks, Spend, täglich.",
          note: "Nur Laufzeitbudget, mindestens 1 $. Business-Berechtigung und Märkte: USA, Kanada, Australien, Neuseeland.",
        },
      ],
      tips: [
        {
          title: "Wo Ads-Arbeit stattfindet",
          body: "Verbinden unter Verbindungen → ADS. Kampagnenliste und Ausgaben unter Anzeigen in der Leiste. Organischen Inhalt — Fotos, Video, Serien, datierte Aktionen — startest du im Assistenten. Frag den Assistenten nicht „wie viel habe ich bei Meta ausgegeben“; öffne Anzeigen.",
        },
      ],
    },
    {
      id: "assistant",
      title: "Der Assistent",
      body: [
        "Der Assistent ist das Herz des Studios. Hier holst du Ideen, Texte, Veröffentlichung, Planung, einen Monat Content oder eine Aktion an einem bestimmten Datum.",
        "Schreib natürlich, wie zu einem Kollegen. Keine Spezialbefehle. Nenne die Netzwerke, wann es raus soll, und ob du einen Text willst. Wenn du kein Netzwerk nennst (und es keine Serie für alle ist), fragt Posty nach — es rät nicht.",
        "Hänge bis zu 50 Fotos oder Videos an, je 100 MB. Die Reihenfolge im Picker ist die Serienreihenfolge. Warte, bis Uploads fertig sind (oranges Badge), dann senden.",
        "Neuer Chat leert den Thread. Nutze das, wenn du das Thema wechselst oder „nicht mehr fragen“ zurücksetzen willst.",
      ],
      examples: [
        "Gib mir drei Instagram-Texte für ein Café an einem verregneten Montag.",
        "Veröffentliche das jetzt auf Instagram und TikTok.",
        "Ab morgen, einen pro Tag, auf jedem Netzwerk, zur besten Zeit.",
      ],
      tips: [
        {
          title: "Eine Nachricht, eine klare Absicht",
          body: "„Veröffentliche das jetzt als Instagram-Reel und TikTok, und morgen um 9 als Instagram-Story“ geht in einer Nachricht. Eine Freitagsaktion mit 20 Monatsfotos zu mischen, nicht.",
        },
      ],
    },
    {
      id: "voice",
      title: "Sprachdiktat",
      featured: "voice",
      lead: "Reden. Posty tippt. Der schnellste Weg zu einer langen Anweisung ohne Tastatur.",
      body: [
        "Das Mikrofon neben den Anhängen ist kein Extra — so arbeitet man in posty.now. Tippen, sprechen wie zu einem Kollegen, Wörter erscheinen, ein Wort korrigieren, senden. Ideal bei 50 Dateien, am Handy, bei einer datierten Kampagne mit Netzwerken und Ton — oder wenn du einfach nicht tippen willst.",
        "Am besten in Chrome oder Edge. Beim ersten Mal fragt der Browser nach dem Mikrofon: Allow. Hast du Block getroffen, Schloss in der Adressleiste, Mikrofon erlauben, neu laden.",
        "Solange das Mikrofon orange ist, hört Posty weiter — du kannst pausieren und weitermachen. Der Platzhalter wird „Listening… speak now“. Nochmal aufs Mikro tippen zum Stoppen, dann Senden.",
        "Du kannst auf Deutsch diktieren. Kommt ein Satz schief, korrigierst du ihn in der Box — du fängst nicht neu an. Anhänge bleiben; die Stimme füllt die Anweisung.",
      ],
      examples: [
        "Ab morgen, einen pro Tag, auf Instagram, TikTok und Facebook, zur besten Zeit, ohne Text.",
        "Plane dieses Foto für Freitag um 10, das ist der Herbstsale, nur Instagram und Facebook, mit einer kurzen Verkaufszeile.",
      ],
      tips: [
        {
          title: "Sag alles in einem Satz",
          body: "Netzwerke, Tag, Uhrzeit oder „beste Zeit“, Text ja oder nein, gleiche Datei überall oder eine pro Netzwerk. Je vollständiger der Satz, desto sauberer die Bestätigungskarte.",
        },
        {
          title: "Nichts erscheint in der Box?",
          body: "Fast immer Mikrofon-Berechtigung, nicht ein kaputtes Mikro. Chrome → Schloss → Mikrofon → Allow.",
        },
      ],
    },
    {
      id: "ideas",
      title: "Texte, Ideen, Markenstimme",
      body: [
        "Willst du nur Inspiration, sag das. Posty liefert 1–3 Varianten und veröffentlicht nichts.",
        "Ein Text entsteht nur, wenn du ihn anforderst („schreib eine Beschreibung“, „Caption“). Schickst du ein Foto und sagst nur „jetzt auf Instagram veröffentlichen“, geht es ohne Text raus — kein alter Caption aus dem Chat.",
        "Lieferst du den Text, wird er genau so verwendet. Ist er für ein Netzwerk zu lang (280 Zeichen auf X), wird er gekürzt und du wirst informiert.",
        "Du kannst die Markenstimme beschreiben: „wir sind eine warme Bäckerei, keine Emojis, kein Slang.“ Posty behält das im Gespräch, damit spätere Entwürfe im Ton bleiben.",
      ],
      examples: [
        "Schreib eine kurze Beschreibung, fünf Hashtags, warmer Ton.",
        "Wir sind ein Fotostudio. Stimme: klar, keine Superlative. Merk dir das.",
      ],
      tips: [
        {
          title: "Dein Text gilt",
          body: "Hast du schon Kampagnentext, füge ihn ein oder diktiere ihn. Posty schreibt ihn nicht um. Die KI nur, wenn du Varianten willst.",
        },
      ],
    },
    {
      id: "publish",
      title: "Jetzt veröffentlichen",
      body: [
        "Hänge Medien an, wenn das Netzwerk sie braucht (Instagram, TikTok, YouTube, Pinterest). Nenne die Netzwerke. Bestätige auf der Karte.",
        "„Alle Netzwerke“, „überall“, „everywhere“ meint jedes verbundene Posting-Konto. Du kannst ausschließen: „überall außer LinkedIn“.",
        "Es ist nicht live, bis du den grünen Haken auf diesem Netzwerk siehst. „Publishing now“ auf TikTok heißt: noch in Verarbeitung — kein Fehler. Warte auf den Haken.",
      ],
      examples: [
        "Veröffentliche dieses Video jetzt auf Instagram als Reel und auf TikTok.",
        "Poste auf jedem Netzwerk außer Reddit.",
      ],
    },
    {
      id: "schedule",
      title: "Zu einer bestimmten Uhrzeit planen",
      body: [
        "Nenne Tag und Uhrzeit. Posty nutzt die Uhr in der unteren Leiste (deine Ortszeit), keine versteckte Zeitzone. „Morgen um 18:00“ ist 18:00 auf dieser Uhr.",
        "Du kannst kombinieren: Story jetzt auf Instagram und TikTok, Reel morgen um 12:00 auf Instagram.",
      ],
      examples: [
        "Plane das morgen um 18:00 auf TikTok und Instagram.",
        "Freitag 15:00 auf LinkedIn, dieser Text, ohne Foto.",
      ],
      tips: [
        {
          title: "Prüfe die Uhr",
          body: "Bei Reise oder VPN schau auf Ortszeit unten in der Studio-Leiste. Planungen folgen dieser Uhr.",
        },
      ],
    },
    {
      id: "best-time",
      title: "Beste Zeit",
      body: [
        "Sag „zur besten Zeit“, „optimale Zeit“, „peak time“. Posty erfindet nicht 18:00. Es nimmt das nächste Peak-Fenster aus Branchenforschung (Sprout, Hootsuite, Later, Buffer), in deiner Zeitzone, als Annäherung an die lokale Audience.",
        "Das sind nicht deine persönlichen Analysen — das Beitrags-Dashboard ist täglich, nicht stündlich. Ein solider Default; weißt du, dass dein Publikum nachts wach ist, nenne die Stunde. Eine explizite Uhrzeit gewinnt immer.",
        "Jedes Netzwerk hat seinen Rhythmus. Instagram unter der Woche eher ~11:00 (Stories ~12:00), Abendreserve ~19:00. TikTok eher ~19:00. LinkedIn überspringt Wochenenden. Instagram und TikTok zur „besten Zeit“ können zu verschiedenen Stunden rausgehen — das ist Absicht.",
      ],
      examples: [
        "Morgen zur besten Zeit, auf Instagram und TikTok.",
        "Verschiebe Freitags Beitrag auf die beste Zeit.",
      ],
    },
    {
      id: "series",
      title: "Ein Monat Content: tägliche Serie",
      body: [
        "Hänge bis zu 50 Dateien in der gewünschten Reihenfolge an. Sag „ab morgen, einen pro Tag, auf jedem Netzwerk, zur besten Zeit“ oder „100 Karussell-Posts mit je 5 gemischten Fotos“. Fotos und Videos dürfen gemischt werden.",
        "Standard ist cross, nicht Copy-Paste. Am selben Tag bekommt jedes Netzwerk eine andere Datei. Facebook kann Medium 1, X Medium 2, TikTok Medium 3. Dieselbe Datei geht an dem Tag nicht auf zwei Netzwerke. Über den Monat rotieren die Dateien, damit der Kalender voll bleibt.",
        "Willst du dieselbe Datei an dem Tag überall, sag das: „dasselbe auf allen“. Sonst bleibt es cross.",
        "TikTok nimmt Fotos (Fotomodus / Karussell) und Video. YouTube überspringt Fotos — keine Stills. Die Bestätigungskarte zeigt pro Tag, welches Netzwerk welche Datei bekommt. Große Serien wollen immer die Karte — sie überspringen sie nicht.",
      ],
      examples: [
        "Ab morgen, einen pro Tag, auf jedem Netzwerk, zur besten Zeit.",
        "Diese 10 Videos, dieselbe Datei auf jedem Netzwerk pro Tag, um 19:00.",
      ],
      tips: [
        {
          title: "Die Picker-Reihenfolge zählt",
          body: "Datei 1 ist Tag 1. Nicht zufällig greifen, wenn du schon eine Reihenfolge hast. Ein Anhang kannst du mit X entfernen, bevor du sendest.",
        },
      ],
    },
    {
      id: "campaign",
      title: "Aktionen, Launches, feste Daten",
      lead: "Eine Kampagne ist keine Serie. Ein festes Datum ist nicht „einen pro Tag“.",
      body: [
        "Hast du eine Aktion, einen Launch, Black Friday, ein Event — lade genau dieses Asset allein hoch. Sag klar, wann und auf welchen Netzwerken. Eine Datei, eine Anweisung, eine Bestätigung.",
        "Legst du Kampagnen-Creative neben 29 andere Tagesfotos, behandelt die Serie es als weiteren Tag im Monat. Es kann dienstags statt freitags raus, auf TikTok statt Facebook, oder neben einem Reel, das nichts mit dem Angebot zu tun hat.",
        "Dasselbe gilt, wenn das Asset für Ads gedacht ist. Die tägliche Serie ist kaskadierender organischer Content. Eine bezahlte Anzeige, ein Boost, eine Aktion mit Deadline — getrennt, mit Datum.",
      ],
      examples: [
        "Plane dieses Foto auf den 15. September um 10:00, Instagram und Facebook, das ist der Herbstsale. Dieser Text, genau so.",
        "Veröffentliche das Launch-Video Freitag um 12:00 auf Instagram als Reel und auf TikTok. Es gehört nicht zur Serie.",
      ],
      tips: [
        {
          title: "Zwei Jobs, zwei Nachrichten",
          body: "Zuerst der Stapel von 50 (Monatscontent). Dann neuer Chat oder neue Nachricht, eine Datei, die Aktion. Nicht in demselben Upload verbinden.",
        },
      ],
    },
    {
      id: "formats",
      title: "Formate pro Netzwerk",
      body: [
        "Reel gibt es auf Instagram, nicht auf TikTok. Story gibt es auf Instagram (und Facebook), nicht auf TikTok. „Auf Instagram als Reel und auf TikTok“ = Instagram Reel + normales TikTok-Video.",
        "„Instagram als Story und TikTok“ = Instagram-Story + TikTok-Video. „Als Video auf Instagram und TikTok“ = Instagram veröffentlicht das Video automatisch als Reel, TikTok als Video.",
        "TikTok nimmt auch Stills (ein Foto oder Karussell), nicht nur Video.",
        "Nenne ein Format nur auf dem Netzwerk, das es hat. Kein Reel auf YouTube, keine Story auf LinkedIn.",
        "Instagram, TikTok, YouTube und Pinterest brauchen Medien. LinkedIn, X, Threads, Bluesky, Facebook und Reddit können Text. X kürzt bei 280 Zeichen. Bild und Video nicht im selben Tweet mischen.",
      ],
      examples: [
        "Dieses Video: Instagram-Reel und TikTok, jetzt. Und morgen um 9:00, Instagram-Story.",
      ],
    },
    {
      id: "confirm",
      title: "Die Bestätigungskarte",
      body: [
        "Bevor etwas rausgeht, siehst du eine Karte: Netzwerke, Zeit, Vorschau, bei Serien ein Slot pro Tag. Bestätigen oder Abbrechen / ändern.",
        "Du kannst „Don’t ask again in this chat“ ankreuzen, wenn du Tempo willst. Das gilt nur für diesen Thread; neuer Chat setzt es zurück. Große Serien wollen trotzdem Augen auf der Karte — 50 Tage falsch zu planen ist zu leicht.",
        "Bei Abbruch schickst du eine neue Anweisung. Die Bestätigung läuft nach ein paar Stunden ab; Tab über Nacht offen gelassen: Befehl nochmal senden.",
      ],
    },
    {
      id: "manage",
      title: "Abbrechen, verschieben, bearbeiten",
      body: [
        "Für einen aus dem Chat geplanten Beitrag kannst du ihn abbrechen, verschieben oder den Text ändern. Identifiziere ihn über Netzwerk, Zeit oder ein Stück Caption.",
        "Neu planen kann eine neue Uhrzeit sein oder „zur besten Zeit“.",
      ],
      examples: [
        "Storniere den TikTok-Beitrag von morgen.",
        "Verschiebe Freitags Instagram-Beitrag auf 19:00.",
        "Ändere den Montagstext auf: …",
      ],
    },
    {
      id: "posts-list",
      title: "Beiträge (Verlauf)",
      body: [
        "Beiträge in der Leiste ist dein Kalender: Entwürfe, geplant und veröffentlicht, nur für die hier verbundenen Konten. Filter nach Netzwerk, Konto, Status, Quelle und Zeitraum.",
        "Hier prüfst du, ob eine Serie raus ist, ob ein Slot noch wartet, oder öffnest den Beitrag im Netzwerk. Veröffentlichen und Planen bleibt im Assistenten; diese Seite ist der Verlauf.",
      ],
    },
    {
      id: "messages",
      title: "Nachrichten und Kommentare",
      body: [
        "Nachrichten in der Leiste hat zwei Tabs: Direktnachrichten und Kommentare. Du siehst Threads der verbundenen Konten und kannst von dieser Seite antworten, ohne die App des Netzwerks zu öffnen.",
        "Filter nach Plattform, Konto und Status. Es erscheint nur etwas, wenn ein Posting-Konto unter Verbindungen → SOCIAL hängt.",
        "Dieser Posteingang bist du. Der Lead-Agent, wenn er an ist, antwortet getrennt auf neue eingehende Nachrichten mit Absicht — er ersetzt diesen Posteingang nicht.",
      ],
    },
    {
      id: "leads",
      title: "Leads",
      lead: "Jeder Kunde hat seinen Agenten. Website-Link, trainieren, sagen wie er sprechen soll, dann Generierung an.",
      body: [
        "Unter Leads fügst du die Website-URL ein und klickst auf Train the agent. Er liest öffentliche Seiten und Produkte. Ist er schon trainiert, steht da Bereits trainiert.",
        "Im Kasten darunter sagst du, wie das Gespräch laufen soll: Preise, woran er Absicht erkennt („was kostet das“, „bin ich an einem Datum frei“), und dein Buchungslink falls vorhanden. Das ist dein Briefing; es ersetzt den Crawl nicht.",
        "Nach dem Training klickst du auf AI lead generation. Ab dann antwortet er nur auf neue eingehende Nachrichten nach dem Einschalten — nicht auf alte Threads und nicht auf Nachrichten, die du gesendet hast. Er antwortet, wenn die Nachricht ankommt, nicht erst am nächsten Tag.",
        "Er stellt sich als posty.now-Agent vor, holt Einwilligung (JA) und sendet die Bedingungen, dann antwortet er aus dem, was er auf der Site gelesen hat. Leads stehen in der Liste (Nachricht, Kommentar oder Anzeige) als neu / kontaktiert / abgelehnt. Dieselbe Steuerung schaltet die Generierung wieder aus.",
      ],
      tips: [
        {
          title: "Instagram verbunden",
          body: "Für DMs braucht es ein Instagram (oder einen anderen Inbox-Kanal) unter Verbindungen. Das Website-Training veröffentlicht nichts und schreibt nicht von allein in Netzwerke.",
        },
        {
          title: "Kein Blast",
          body: "Die Generierung schreibt keine alten Threads an. Eine Test-DM muss nach dem Einschalten ankommen, und die Antwort kann auf den nächsten Tageslauf warten.",
        },
      ],
    },
    {
      id: "stats-posts",
      title: "Analysen",
      body: [
        "Analysen ist das Board für organische Beiträge: Engagement-Rate, Reichweite, Follower, Beiträge im Zeitraum, bester Beitrag, Charts nach Plattform und Zeit, Heatmap für eine gute Stunde.",
        "Filter nach Plattform, Konto, Quelle (hier erstellt oder von der Plattform) und den letzten 7 / 30 / 90 Tagen. Der Link beim besten Beitrag öffnet ihn im Netzwerk. Das Thumbnail ist das Beitragsbild; bei Video erscheint das Netzwerk-Icon, wenn es keine Vorschau gibt.",
        "Bluesky und Reddit liefern begrenzte Zahlen (Likes, Kommentare, Shares — keine Impressions). Andere verbundene Netzwerke das volle Bild, soweit die jeweilige API es hergibt.",
        "Hier siehst du, ob organischer Content landet. Ad-Spend ist nicht hier — der liegt unter Anzeigen.",
      ],
    },
    {
      id: "stats-ads",
      title: "Anzeigen",
      lead: "Hier siehst du Kampagnen und Geld. Ist kein Ads-Konto verbunden, ist die Seite leer — das ist kein Bug.",
      body: [
        "Anzeigen in der Leiste: aktive und abgeschlossene Kampagnen auf den verbundenen Ads-Netzwerken. Filter nach Plattform, Konto, Status und Zeitraum. Neue Kampagnen kommen aus dem Assistenten.",
        "Nutze es, um zu entscheiden, ob eine Kampagne weiterlaufen soll — nicht um sie mit einem organisch starken Beitrag zu verwechseln. Ein Reel mit vielen Likes und eine Kampagne mit starkem CTR sind verschiedene Siege.",
        "Keine Kampagnen? Prüfe Verbindungen → ADS: ist das Konto verbunden und im gewählten Zeitraum aktiv?",
      ],
      tips: [
        {
          title: "Eine kurze Wochenroutine",
          body: "Einmal pro Woche: Analysen (was organisch landete) und Anzeigen (was kostete und was es brachte). Dann im Assistenten die Serie anpassen — oder ein neues datiertes Creative, wenn es eine Aktion ist. Leads in der Liste auf kontaktiert setzen, sobald du mit der Person gesprochen hast.",
        },
      ],
    },
    {
      id: "phrases",
      title: "Sätze, die gut funktionieren",
      body: [
        "Du musst keine Befehle auswendig lernen. Diese Beispiele decken fast alles ab, was das Studio kann.",
      ],
      examples: [
        "Gib mir drei Instagram-Texte für eine Bäckerei am Montagmorgen.",
        "Veröffentliche das jetzt auf Instagram als Reel und auf TikTok.",
        "Plane morgen um 18:00 auf LinkedIn, dieser Text.",
        "Morgen zur besten Zeit, auf Instagram und TikTok.",
        "Ab morgen, einen pro Tag, auf jedem Netzwerk, zur besten Zeit.",
        "Dasselbe Video auf jedem Netzwerk, einen pro Tag, um 19:00.",
        "Plane dieses Foto auf den 15. September um 10:00, nur Instagram und Facebook — das ist die Aktion, nicht Teil der Serie.",
        "Jedes Netzwerk außer LinkedIn.",
        "Storniere den TikTok-Beitrag von morgen.",
        "Verschiebe Freitags Beitrag auf die beste Zeit.",
        "Schreib eine Beschreibung, warmer Ton, keine Emojis.",
        "Frag in diesem Chat nicht nochmal nach Bestätigung.",
        "Erstelle eine Meta-Ads-Kampagne, Traffic zur Website, 10 € am Tag.",
      ],
    },
    {
      id: "troubleshoot",
      title: "Wenn etwas nicht klappt",
      body: [
        "Diktat schreibt nichts: Chrome oder Edge, Allow am Mikrofon, Schloss in der Adressleiste. Neu laden. Dann das Mikro im Chat — es bleibt orange, solange du sprichst.",
        "„Publishing now“ auf TikTok: warten. Verarbeitung ist kein Fehler. Der grüne Haken ist das Signal.",
        "Nichts wird veröffentlicht: Verbindungen → SOCIAL, ist das Netzwerk verbunden? Haben Instagram/TikTok/YouTube/Pinterest eine Datei?",
        "Datei abgelehnt: max. 100 MB, max. 50 Dateien. YouTube überspringt Fotos. TikTok akzeptiert Fotos (Karussell).",
        "Bestätigung weg: abgelaufen. Befehl nochmal senden.",
        "Leere Analysen: Posting-Konto unter Verbindungen verbinden. Leere Ads-Kampagnen: Verbindungen → ADS, dann Anzeigen in der Leiste. Ein Posting-Instagram füllt das Ads-Dashboard nicht.",
        "Lead-Agent antwortet nicht: trainiert? Ist AI lead generation an? Die Nachricht muss neu eingehend sein, nach dem Einschalten.",
        "Falsche Sprache: der Sprachschalter sitzt unten in der Studio-Leiste, neben der Uhr.",
      ],
    },
  ],
};
