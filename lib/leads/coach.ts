import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicApiKey } from "@/lib/env";
import { firstPublicUrlInText, publicHttpUrl } from "@/lib/site-brief";
import type { AgentKnowledge, CoachTurn } from "@/lib/leads/knowledge";
import { chatLanguageName, isAppLocale } from "@/lib/locales";

const BOOKING_HOST = /mero|calend|book|rezerv|program|appoint/i;

export function urlsInText(text: string) {
  return [...text.matchAll(/https?:\/\/[^\s<>"'）)]+/gi)]
    .map((match) => publicHttpUrl(match[0].replace(/[.,;:]+$/, "")))
    .filter((url): url is string => Boolean(url));
}

export function bookingUrlFromText(text: string, current?: string | null) {
  const urls = urlsInText(text);
  return urls.find((url) => BOOKING_HOST.test(url)) ?? urls[0] ?? current ?? firstPublicUrlInText(text);
}

export function wantsBookingLink(text: string) {
  return /pret|preț|costa|cost|liber|disponibil|program|rezerv|data|dată|când|cand|ora|gene|unghii|ungh|slot|calendar/i.test(
    text,
  );
}

export function absorbOwnerBrief(knowledge: AgentKnowledge, message: string): AgentKnowledge {
  const bookingUrl = bookingUrlFromText(message, knowledge.booking?.url);
  const instructions = [knowledge.instructions, message.trim()].filter(Boolean).join("\n\n").slice(0, 8000);
  const turn: CoachTurn = { role: "user", text: message.trim(), at: new Date().toISOString() };
  return {
    ...knowledge,
    instructions,
    booking: {
      available: Boolean(bookingUrl) || Boolean(knowledge.booking?.available),
      url: bookingUrl ?? knowledge.booking?.url ?? null,
      how:
        knowledge.booking?.how ||
        (bookingUrl
          ? "Când întreabă de preț, locuri libere sau o dată, trimite link-ul de programare. Nu inventa ore."
          : null),
    },
    coach: [...(knowledge.coach ?? []), turn].slice(-24),
  };
}

export async function coachReply(knowledge: AgentKnowledge, message: string, locale: string) {
  const loc = isAppLocale(locale) ? locale : "en";
  const booking = knowledge.booking?.url;
  const fallback = {
    ro: booking
      ? `Am notat. Când întreabă de preț sau dacă ai liber pe o dată, îi dau link-ul de programare și notăm click-ul.`
      : `Am notat cum vrei să decurgă. Dacă ai un link de calendar (Mero sau altul), pune-l aici ca să-l dau la programare.`,
    en: booking
      ? `Noted. When they ask about price or a free slot, I will send the booking link and we will record the click.`
      : `Noted. If you have a calendar link (Mero or similar), send it here so I can use it for bookings.`,
    de: booking
      ? `Notiert. Wenn sie nach Preis oder einem freien Termin fragen, sende ich den Buchungslink und wir erfassen den Klick.`
      : `Notiert. Wenn du einen Kalenderlink hast (Mero oder ähnlich), schick ihn hier, damit ich ihn für Buchungen nutze.`,
    fr: booking
      ? `Noté. Quand ils demandent le prix ou un créneau libre, j’envoie le lien de réservation et on enregistre le clic.`
      : `Noté. Si tu as un lien de calendrier (Mero ou autre), envoie-le ici pour que je l’utilise pour les réservations.`,
    it: booking
      ? `Segnato. Quando chiedono il prezzo o uno slot libero, invio il link di prenotazione e registriamo il clic.`
      : `Segnato. Se hai un link di calendario (Mero o simile), mettilo qui così lo uso per le prenotazioni.`,
    es: booking
      ? `Anotado. Cuando pregunten el precio o un hueco libre, envío el enlace de reserva y registramos el clic.`
      : `Anotado. Si tienes un enlace de calendario (Mero u otro), ponlo aquí para usarlo en las reservas.`,
  }[loc];

  let apiKey = "";
  try {
    apiKey = getAnthropicApiKey();
  } catch {
    return fallback;
  }
  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 220,
      system:
        "You are helping the business owner train their Posty lead agent. Confirm in one short paragraph what you will do in DMs. Do not invent prices. If they gave a booking/Mero link, say you will send that tracked link when someone asks price or availability.",
      messages: [
        {
          role: "user",
          content: `Language: ${chatLanguageName(loc)}.\nOwner: ${message}\nBooking link: ${booking || "none"}\nPrior instructions: ${knowledge.instructions || ""}`,
        },
      ],
    });
    return response.content.find((block) => block.type === "text")?.text?.trim() || fallback;
  } catch {
    return fallback;
  }
}
