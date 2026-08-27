import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { quoteForSoldCount } from "@/lib/presale";
import { fetchPresaleView, getStripe } from "@/lib/presale-server";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function localeFrom(value: unknown) {
  return routing.locales.find((item) => item === value) ?? routing.defaultLocale;
}

export async function POST(request: Request) {
  const limited = rateLimit(`checkout:${clientIp(request)}`, 8, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      locale?: string;
      immediateStartConsent?: boolean;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!emailPattern.test(email) || email.length > 320) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }
    if (body.immediateStartConsent !== true) {
      return NextResponse.json({ error: "CONSENT_REQUIRED" }, { status: 400 });
    }

    const locale = localeFrom(body.locale);
    const view = await fetchPresaleView();
    const quote = quoteForSoldCount(view.sold);
    if (quote.soldOut) {
      return NextResponse.json({ error: "PRESALE_SOLD_OUT" }, { status: 409 });
    }

    const site = getSiteUrl();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: email,
      metadata: {
        email,
        locale,
        quoted_slot: String(quote.nextSlot),
        quoted_tranche: String(quote.tranche),
        quoted_price_eur: String(quote.priceEur),
        immediate_start_consent: "1",
      },
      payment_intent_data: {
        metadata: { email, locale, immediate_start_consent: "1" },
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: quote.priceEur * 100,
            product_data: {
              name: `posty.now lifetime — tranche ${quote.tranche}`,
              description: "One-time presale purchase. Lifetime studio access.",
            },
          },
        },
      ],
      success_url: `${site}/${locale}/presale/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/${locale}/presale`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, priceEur: quote.priceEur, tranche: quote.tranche });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}
