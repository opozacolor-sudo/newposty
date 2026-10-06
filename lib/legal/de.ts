import { REFUND_MONTHLY_REFERENCE_EUR as price, WITHDRAWAL_DAYS as days } from "@/lib/billing";
import type { LegalCompany, LegalPage } from "@/lib/legal-types";

function operator(c: LegalCompany) {
  return `${c.name}, Steuernummer ${c.cui}, Handelsregister ${c.reg}, EUID ${c.euid}, gegründet am ${c.founded}. Der Dienst ist posty.now (${c.site}). Kontakt: ${c.email}.`;
}

export function legalPagesDe(c: LegalCompany): LegalPage[] {
  return [
    {
      id: "terms",
      href: "/terms",
      label: "AGB",
      title: "Allgemeine Geschäftsbedingungen",
      description: "Der Vertrag zur Nutzung von posty.now mit VLN MOTORS SRL.",
      updated: "Zuletzt aktualisiert: 6. Oktober 2026",
      intro: [
        operator(c),
        "Diese Bedingungen gelten für die Website, die Voranmeldung und das posty.now-Studio. Zahlung, Abo und Erstattungen stehen in den Abo-Bedingungen und in der Widerrufs- und Erstattungsrichtlinie. Personenbezogene Daten stehen in der Datenschutzerklärung.",
      ],
      sections: [
        {
          id: "service",
          heading: "1. Der Dienst",
          body: [
            "posty.now ist ein Studio: du verbindest soziale Netzwerke und Anzeigenkonten, schreibst oder diktierst, was veröffentlicht werden soll, und der Assistent bereitet Text, Uhrzeit und Veröffentlichung oder Planung vor. Du siehst Analysen, Nachrichten und Kommentare, kannst einen Lead-Agenten auf einer öffentlichen Website trainieren und bezahlte Kampagnen auf Ads-Konten anfragen, die du selbst verbindest.",
            "Neue Konten bleiben bis zum 15. Oktober 2026 geschlossen. Bis dahin kannst du eine E-Mail auf die Voranmeldung setzen. Diese E-Mail ist kein Abo und kostet nichts.",
          ],
        },
        {
          id: "account",
          heading: "2. Das Konto",
          body: [
            "Für das Studio brauchst du ein Konto, mindestens 16 Jahre und die Fähigkeit, einen Vertrag zu schließen. Du bist für das Passwort und für alles verantwortlich, was über das Konto geschieht.",
            "Du kannst Individual oder Team wählen. Team ist ein Agentur-Login und Kunden nach Namen. Kollegeneinladungen gehören nicht zu dieser Phase. Ein verbundenes Netzwerkkonto gehört zu einem Kunden.",
          ],
        },
        {
          id: "networks",
          heading: "3. Verbundene Netzwerke",
          body: [
            "Wenn du Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Google Business, Bluesky, Reddit oder ein Ads-Konto verbindest, erlaubst du uns, die Verbindung nur für das zu nutzen, was du im Studio anfragst: Veröffentlichen, Planen, Analysen, Lesen von Nachrichten und Kommentaren, den Lead-Agenten in Abschnitt 5 oder eine Kampagne.",
            "Du hältst die Regeln jedes Netzwerks ein. posty.now ist nicht Meta, Google, TikTok, LinkedIn, Pinterest oder die anderen Netzwerke. Werbebudget zahlst du an diese Netzwerke, aus deren Ads-Konto. Es ist nicht Teil des Abos an VLN MOTORS SRL.",
          ],
        },
        {
          id: "content",
          heading: "4. Deine Inhalte und KI-Texte",
          body: [
            "Inhalte, die du hochlädst, bleiben dein. Du gibst uns eine beschränkte Lizenz, sie zu speichern, zu verarbeiten und an Netzwerke zu senden, nur damit der Dienst laufen kann.",
            "Generierte Texte können falsch sein. Du prüfst Caption, Hashtags und Uhrzeit vor der Bestätigung. Wir versprechen keine Reichweite, kein Engagement und nicht, dass ein Netzwerk den Beitrag annimmt.",
            "Sprachdiktat nutzt die Spracherkennung des Browsers. Wir erhalten den Text in der Box. Audio speichern wir nicht.",
          ],
        },
        {
          id: "leads",
          heading: "5. Der Lead-Agent und die Zustimmung im Chat",
          body: [
            "Du kannst einen Agenten auf den öffentlichen Seiten einer Website trainieren (die URL, die du angibst) und KI-Lead-Generierung einschalten. Wenn er an ist, liest er neue Nachrichten und Kommentare, die nach dem Einschalten eingehen, auf den verbundenen Posting-Konten. Er schreibt nicht in alte Threads und schreibt niemanden an, der dir danach nicht geschrieben hat.",
            "Der Agent stellt sich als posty.now-Agent vor. Bevor er weitermacht, sendet er einen Link zu diesen Bedingungen und bittet um ausdrückliche Zustimmung: die Antwort JA (oder YES, DA, OUI, SÌ, SÍ). Ohne JA fragt er nicht nach Telefon, E-Mail oder anderen Kontaktdaten und markiert die Person nicht als qualifizierten Lead.",
            "Antwortet die Person JA, stimmt sie zu, dass VLN MOTORS SRL über posty.now im Namen der Seite oder des Kontos, an das sie geschrieben hat, das Gespräch fortsetzen, ihre Nachricht nutzen, aus den öffentlichen Seiten der trainierten Website antworten und den Namen, das Telefon und die E-Mail erfassen darf, die sie hinterlässt (und, wenn sie sie schreibt, Angaben für eine Vorprüfung, etwa Zahlungsart oder Einkommen), damit eine Person von dieser Seite sie kontaktieren kann. Die Datenverarbeitung steht in der Datenschutzerklärung. Sie kann ablehnen: nicht JA antworten oder NEIN schreiben.",
            "Der Lead (Nachricht, Kontaktdaten, Transkript, Status) bleibt in der Studio-Liste beim Kunden, dem das Konto zugeordnet ist. Du bist verantwortlich, diese Funktion nach den Regeln des Netzwerks und dem Recht, einschließlich DSGVO, gegenüber Menschen zu nutzen, die dir geschrieben haben. Du schaltest die Generierung im selben Studio-Steuerelement aus. Wir versprechen keine Verkäufe, Buchungen oder dass die Person antwortet.",
          ],
        },
        {
          id: "use",
          heading: "6. Verbotene Nutzung",
          body: [
            "Du nutzt den Dienst nicht für Spam, Betrug, Belästigung oder andere rechtswidrige Taten, um Limits eines Netzwerks zu umgehen, für Inhalte, die Urheberrecht oder Privatsphäre verletzen, oder um das Konto zu verkaufen oder zu teilen.",
          ],
        },
        {
          id: "pay",
          heading: "7. Was du zahlst, und an wen",
          body: [
            `Der bezahlte Vertrag besteht zwischen dir und ${c.name}. Stripe verarbeitet nur die Zahlung: Geld läuft über Stripe auf das Firmenkonto. Stripe ist nicht der Verkäufer.`,
            `Das Abo ist Zugang zum Studio, ${price} EUR pro Monat, nach dem kostenlosen Monat in den Abo-Bedingungen. Die Warteliste ist kostenlos. Du zahlst uns dein Werbebudget nicht.`,
            "Der fällige Betrag ist der auf der Zahlungsseite gezeigte Betrag, bevor du bestätigst. Ist oder wird die Firma umsatzsteuerpflichtig, erscheint die Steuer dort und auf der Rechnung vor der Abbuchung.",
          ],
        },
        {
          id: "delete",
          heading: "8. Konto löschen",
          body: [
            "Im Studio öffnest du das Kontomenü, wählst Konto löschen und bestätigst. Netzwerke werden getrennt, Nutzer und Live-Studiostaten gelöscht (Unterhaltungen, Beiträge, Dateien, Leads). Kannst du dich nicht anmelden, nutze die Kontaktseite von derselben E-Mail und bitte um Löschung.",
            "Das Löschen des Kontos macht eine bereits eingezogene Zahlung nicht von selbst rückgängig. Geld folgt der Widerrufs- und Erstattungsrichtlinie. Rechnungen werden so lange aufbewahrt, wie das Steuerrecht es verlangt, auch wenn das Studiokonto weg ist.",
          ],
        },
        {
          id: "end",
          heading: "9. Sperre, Recht, Kontakt",
          body: [
            "Du kannst die Nutzung jederzeit beenden. Wir können den Zugang sperren, wenn du diese Bedingungen brichst oder das Recht es verlangt.",
            "Wir schließen die Haftung für Vorsatz, grobe Fahrlässigkeit oder Rechte, die das Gesetz uns nicht erlauben zu beschränken, einschließlich Verbraucherrechte, nicht aus. Sonst ist die Haftung für einen Anspruch zum Dienst auf den Betrag begrenzt, den du uns in den letzten 12 Monaten gezahlt hast.",
            "Es gilt rumänisches Recht. Verbraucher können sich an die ANPC wenden. Gerichte sind die in Rumänien, außer zwingende Verbraucherschutzregeln deines Landes etwas anderes sagen.",
            `Fragen: ${c.email}.`,
          ],
        },
      ],
    },
    {
      id: "privacy",
      href: "/privacy",
      label: "Datenschutz",
      title: "Datenschutz und DSGVO",
      description: "Welche Daten VLN MOTORS SRL für posty.now verarbeitet, warum, und wie du sie löschst.",
      updated: "Zuletzt aktualisiert: 6. Oktober 2026",
      intro: [
        `${operator(c)} ${c.name} ist der Verantwortliche für posty.now.`,
        "Wir verkaufen keine personenbezogenen Daten. Wir nutzen deine Daten nicht, um ein KI-Modell zu trainieren.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Welche Daten, und warum",
          body: [
            "Voranmeldung: E-Mail und Sprache (Rumänisch, Englisch, Deutsch, Italienisch, Französisch oder Spanisch). Grundlage: Schritte vor einem Vertrag und die Einwilligung durch das Formular. Zweck: Mitteilung zur Öffnung am 15. Oktober 2026. Du kannst die Streichung über die Kontaktadresse verlangen.",
            "Konto: E-Mail, Auth-Kennung und Passwort-Hash beim Auth-Anbieter. Grundlage: Vertrag. Zweck: Anmeldung.",
            "Studio: Chat-Nachrichten, Dateien (bis 50, je 100 MB), Beiträge, Planungen, Team-Kunden (nur Name), das gewählte Kundenkonto und Leads (Nachricht, Transkript, Name, Telefon, E-Mail, Status). Grundlage: Vertrag. Zweck: Veröffentlichen, Planen, Verlauf und Lead-Liste.",
            "Netzwerke: Kennungen und Namen verbundener Konten plus Tokens zum Veröffentlichen und Lesen des Posteingangs. Wir lesen Nachrichten und Kommentare verbundener Konten, um Interesse zu erkennen, zu antworten (Qualifizierung privat; ein öffentlicher Kommentar lädt nur zum privaten Chat ein) und einen qualifizierten Lead nach ausdrücklicher JA-/YES-Zustimmung zu diesen AGB im Chat zu speichern. Telefon, E-Mail oder Gehalt stehen nicht in öffentlichen Kommentaren. Grundlage: Vertrag. Zweck: die Aktion, die du angefragt hast.",
            "Die Person, die der Seite schreibt: antwortet sie JA, verarbeiten wir die Nachricht sowie Name, Telefon und E-Mail, die sie hinterlässt, damit der Studiokontoinhaber sie kontaktieren kann. Grundlage: die Einwilligung durch JA. Sie kann Löschung über die Kontaktadresse verlangen. Ohne JA erheben wir keine Kontaktdaten.",
            "Sprache: der Browser macht Sprache zu Text. Wir speichern den Nachrichtentext, wenn du ihn sendest. Audio speichern wir nicht.",
            "Zahlungen: Stripe verarbeitet die Karte. Wir behalten Stripe-Kunden-ID, Zahlungsstatus, Betrag und Datum, damit wir wissen, ob das Abo aktiv ist, und damit wir Rechnung stellen. Die vollständige Kartennummer speichern wir nicht. Grundlage: Vertrag und gesetzliche Buchführungspflicht.",
            "Kontaktformular: Name, E-Mail und Nachricht. Grundlage: berechtigtes Interesse oder vorvertragliche Schritte, damit wir antworten können.",
          ],
        },
        {
          id: "who",
          heading: "2. Wer Daten erhält",
          body: [
            "Hosting (Vercel), Datenbank und Authentifizierung (Supabase), Zahlungen (Stripe), transaktionale E-Mail (Resend), ein KI-Modellanbieter, der die Chat-Nachricht zum Entwerfen von Text erhält, und ein Veröffentlichungsanbieter, der den bestätigten Beitrag an das verbundene Netzwerk sendet.",
            "Verbundene Netzwerke erhalten den Inhalt, den du bestätigst. Sie haben eigene Regeln.",
            "Ein qualifizierter Lead (Name, Telefon, E-Mail, Transkript) ist im Studio für den Kontoinhaber sichtbar, beim gewählten Kunden. Wir verkaufen ihn nicht.",
            "Wir geben Daten weiter, wenn das Gesetz es verlangt, etwa eine Rechnung oder eine Behördenanfrage.",
          ],
        },
        {
          id: "keep",
          heading: "3. Wie lange",
          body: [
            "Eine Wartelisten-E-Mail bleibt bis zur Öffnung und der Mitteilung oder bis du Löschung verlangst, je nachdem was zuerst kommt.",
            "Studiostaten werden gelöscht, wenn du das Konto löschst: Nutzer, Unterhaltungen, Live-Beiträge, Dateien und Leads. Verschlüsselte Datenbank-Backups rotieren von selbst und dienen nicht der laufenden Verarbeitung.",
            "Buchhaltungs- und Rechnungsunterlagen bleiben so lange, wie rumänisches Steuerrecht es verlangt, auch wenn das Studio gelöscht wurde.",
          ],
        },
        {
          id: "rights",
          heading: "4. Deine Rechte",
          body: [
            "Du kannst Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Übertragbarkeit verlangen und die Einwilligung für die Voranmeldung widerrufen. Hast du einer Seite geschrieben und im Chat JA geantwortet, kannst du diese Einwilligung widerrufen und die Löschung des Leads verlangen. Das Löschen des Kontos im Studio ist der direkte Weg, Studiostaten zu löschen.",
            "Du kannst dich bei der ANSPDCP beschweren, der rumänischen Datenschutzbehörde.",
            `Anfragen an ${c.email} oder über die Kontaktseite, von der Konto-E-Mail. Wir antworten in der DSGVO-Frist, in der Regel einem Monat.`,
          ],
        },
        {
          id: "delete",
          heading: "5. Konto löschen",
          body: [
            "Angemeldet: Kontomenü → Konto löschen → bestätigen. Netzwerke werden getrennt, dann Nutzer und Livedaten gelöscht.",
            "Abgemeldet: Nachricht über die Kontaktseite, dieselbe E-Mail, mit Löschantrag. Wir prüfen, dass du der Kontoinhaber bist, bevor wir löschen.",
            "Löschung hebt allein keine Gebühr für einen bereits begonnenen Zeitraum auf und löscht keine Rechnungen, die das Gesetz uns zu behalten verpflichtet.",
          ],
        },
      ],
    },
    {
      id: "cookies",
      href: "/cookies",
      label: "Cookies",
      title: "Cookie-Richtlinie",
      description: "Die unbedingt erforderlichen Cookies, die posty.now nutzt.",
      updated: "Zuletzt aktualisiert: 22. September 2026",
      intro: [
        operator(c),
        "Wir nutzen nur unbedingt erforderliche Cookies. Es gibt keine Analyse-, Werbe- oder Social-Cookies auf der Website. Deshalb gibt es kein Einwilligungsbanner: das Gesetz erlaubt Cookies, ohne die der Dienst nicht laufen kann.",
      ],
      sections: [
        {
          id: "list",
          heading: "1. Welche Cookies",
          body: [
            "Die Anmeldesitzung, gesetzt vom Auth-Anbieter, damit du angemeldet bleibst. Dauer: die Sitzung und ihre Erneuerung.",
            "NEXT_LOCALE: die gewählte Sprache (Rumänisch, Englisch, Deutsch, Italienisch, Französisch oder Spanisch).",
            "posty_client: der im Studio gewählte Team-Kunde, damit Beiträge nicht zu einem anderen Kunden springen. Es ist httpOnly. Dauer: bis zu 400 Tage, oder bis du den Kunden wechselst oder das Konto löschst.",
            "Kurze OAuth-Cookies nur während du ein Netzwerk verbindest, damit die Rückkehr aus dem Netzwerkfenster dir gehört.",
          ],
        },
        {
          id: "control",
          heading: "2. Wie du sie steuerst",
          body: [
            "Du kannst sie im Browser löschen. Ohne Sitzungscookie bist du abgemeldet. Ohne NEXT_LOCALE wählt die Website die Sprache neu. Ohne posty_client weiß ein Team-Studio nicht mehr, welcher Kunde offen war.",
            "Wir verkaufen keine Cookie-Kennungen und verknüpfen sie nicht mit Werbung außerhalb der Website.",
          ],
        },
      ],
    },
    {
      id: "refunds",
      href: "/refunds",
      label: "Erstattung",
      title: "Widerruf und Erstattung",
      description: "Wie du ein posty.now-Abo kündigst und wann Geld zurückkommt.",
      updated: "Zuletzt aktualisiert: 22. September 2026",
      intro: [
        operator(c),
        "Kündigung stoppt die Verlängerung. Eine Erstattung gibt bereits eingezogenes Geld zurück. Das ist nicht dasselbe. Das Löschen des Kontos ist für sich kein Erstattungsantrag.",
      ],
      sections: [
        {
          id: "free",
          heading: "1. Warteliste und kostenloser Monat",
          body: [
            "Die Voranmeldung kostet nichts. Es gibt nichts zu erstatten.",
            "Stehst du auf der Liste und erstellst du ein Konto zur Öffnung am 15. Oktober 2026, ist der erste Studiomonat kostenlos. Kündigst du in diesem Monat, wird nichts abgebucht.",
          ],
        },
        {
          id: "withdraw",
          heading: `2. Der ${days}-Tage-Widerruf`,
          body: [
            `Als Verbraucher kannst du vom Fernabsatzvertrag innerhalb von ${days} Tagen nach Abschluss ohne Angabe von Gründen zurücktreten, nach rumänischer Dringlichkeitsverordnung 34/2014.`,
            "Verlangst du, dass das Studio in der Widerrufsfrist sofort beginnt, und bestätigst du, dass du das Widerrufsrecht für bereits erbrachte digitale Leistung verlierst, wird der bereits genutzte Zeitraum nicht vollständig erstattet.",
            `Hast du keinen sofortigen Beginn verlangt und trittst du innerhalb von ${days} Tagen zurück, erstatten wir den für dieses Abo eingezogenen Betrag vollständig.`,
          ],
        },
        {
          id: "cancel",
          heading: "3. Kündigung danach",
          body: [
            "Du kündigst das Abo im Konto. Es bleibt bis zum Ende des bereits bezahlten Zeitraums aktiv, danach verlängert es sich nicht. Der begonnene Monat wird nicht erstattet, weil der Zugang verfügbar war.",
            "Werbebudgets an Meta, Google, TikTok, LinkedIn, Pinterest oder andere laufen nicht über uns. Die kündigst du in deren Konto. Wir erstatten sie nicht.",
          ],
        },
        {
          id: "lifetime",
          heading: "4. Ältere Lifetime-Käufe",
          body: [
            `Hast du einmal für Lifetime-Zugang gezahlt, vor dem Monatsabo, ist die Erstattung der gezahlte Betrag minus ${price} EUR für jeden seit Aktivierung begonnenen Monat, nicht weniger als null. Innerhalb von ${days} Tagen, ohne Zustimmung zum sofortigen Beginn, ist die Erstattung vollständig.`,
            "Beispiel: du hast 150 EUR gezahlt und zwei Monate haben begonnen, außerhalb des vollständigen Widerrufsfensters. Die Erstattung ist 150 − 30 = 120 EUR.",
          ],
        },
        {
          id: "how",
          heading: "5. Wie",
          body: [
            `Im Konto kündigen. Für eine Erstattung, die nicht von selbst kommt, schreib an ${c.email} von der Konto-E-Mail, mit dem Zahlungsdatum. Geld geht über Stripe auf dieselbe Methode zurück, nach der Berechnung oben.`,
            "Kontolöschung ist getrennt, im Kontomenü. Willst du auch Geld zurück, sag es, solange du das Recht noch hast.",
          ],
        },
      ],
    },
    {
      id: "subscription",
      href: "/subscription",
      label: "Abo",
      title: "Abo-Bedingungen",
      description: "Was du bei VLN MOTORS SRL kaufst, was es kostet und wann es sich verlängert.",
      updated: "Zuletzt aktualisiert: 22. September 2026",
      intro: [
        operator(c),
        "Diese Bedingungen sind der Abo-Vertrag. Du nimmst sie an, wenn du die Zahlung bestätigst. Bis dahin verpflichtet dich die Voranmeldung zu nichts.",
      ],
      sections: [
        {
          id: "what",
          heading: "1. Was du kaufst",
          body: [
            `Du kaufst monatlichen Zugang zum posty.now-Studio, betrieben von ${c.name}: Assistent (Text und Diktat), Veröffentlichen und Planen auf verbundenen Netzwerken, Analysen, Posteingang (Nachrichten und Kommentare), einen auf einer Website trainierten Lead-Agenten, Verbinden von Ads-Konten und, bei Team, Kunden unter demselben Login.`,
            "Du kaufst kein Werbebudget, keine garantierte Reichweite und keinen Platz in einem sozialen Netzwerk. Das zahlst du, wenn du willst, direkt an das Netzwerk, aus dessen Ads-Konto.",
            "In diesem Abo gibt es keine separate Gebühr pro Kunde. Ein Konto, ein Abo. Führen wir einen Preis pro Kunde ein, siehst du ihn auf der Zahlungsseite vor jedem neuen Betrag, und das alte Abo ändert sich nicht ohne Hinweis.",
          ],
        },
        {
          id: "price",
          heading: "2. Wie viel, und warum",
          body: [
            `Der Abopreis ist ${price} EUR pro Monat für den oben beschriebenen Zugang.`,
            "Der erste Monat ist kostenlos, wenn deine E-Mail auf der Voranmeldung steht und du das Konto zur Öffnung der Anmeldungen am 15. Oktober 2026 anlegst. Nach dem kostenlosen Monat wird der nächste Monat nur abgebucht, wenn du nicht gekündigt hast.",
            "Vor der ersten Abbuchung siehst du den Betrag auf der Stripe-Seite. Die Währung wird dort bestätigt. Fällt Umsatzsteuer an, steht sie vor der Zahlung, nicht danach.",
            `${c.name} stellt die eingezogene Summe nach rumänischem Steuerrecht in Rechnung, einschließlich e-Factura, wenn die Regel gilt (Privatperson oder Firma). Für eine Firmenrechnung gibst du korrekte Rechnungsdaten.`,
          ],
        },
        {
          id: "renew",
          heading: "3. Verlängerung und Kündigung",
          body: [
            "Das Abo verlängert sich monatlich, bis du kündigst. Kündigung stoppt die nächste Abbuchung. Der Zugang bleibt bis zum Ende des bereits bezahlten oder kostenlosen Zeitraums.",
            `Der ${days}-Tage-Widerruf und Erstattungen stehen in der Widerrufs- und Erstattungsrichtlinie.`,
          ],
        },
        {
          id: "fail",
          heading: "4. Wenn eine Zahlung scheitert",
          body: [
            "Scheitert die Verlängerung, kann Stripe erneut versuchen. Wird nichts eingezogen, endet der Studiozugang am Ende des bezahlten Zeitraums. Daten werden nicht nur wegen einer fehlgeschlagenen Zahlung gelöscht. Du löschst sie im Konto oder schriftlich.",
          ],
        },
      ],
    },
  ];
}
