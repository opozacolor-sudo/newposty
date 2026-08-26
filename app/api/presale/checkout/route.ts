import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/env";
import { quoteForSoldCount } from "@/lib/presale";
import { assertPresalePassword } from "@/lib/presale-password";
import {
  attachPendingCheckout,
  deletePendingSignup,
  fetchPresaleView,
  getStripe,
  storePendingSignup,
} from "@/lib/presale-server";

export const dynamic = "force-dynamic";

function localeFrom(value: unknown) {
  return routing.locales.find((item) => item === value) ?? routing.defaultLocale;
}

export async function POST(request: Request) {
  let pendingId: string | null = null;
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
      confirmPassword?: string;
      locale?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const passwordError = assertPresalePassword(body.password ?? "", body.confirmPassword ?? "");
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    const locale = localeFrom(body.locale);
    const view = await fetchPresaleView();
    const quote = quoteForSoldCount(view.sold);
    if (quote.soldOut) {
      return NextResponse.json({ error: "PRESALE_SOLD_OUT" }, { status: 409 });
    }

    pendingId = await storePendingSignup({
      email,
      password: body.password ?? "",
      locale,
    });

    const site = getSiteUrl();
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      client_reference_id: email,
      metadata: {
        email,
        locale,
        pending_id: pendingId,
        quoted_slot: String(quote.nextSlot),
        quoted_tranche: String(quote.tranche),
        quoted_price_eur: String(quote.priceEur),
      },
      payment_intent_data: {
        metadata: { email, locale, pending_id: pendingId },
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
      await deletePendingSignup(pendingId);
      return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
    }

    await attachPendingCheckout(pendingId, session.id);
    return NextResponse.json({ url: session.url, priceEur: quote.priceEur, tranche: quote.tranche });
  } catch (error) {
    if (pendingId) {
      await deletePendingSignup(pendingId).catch(() => undefined);
    }
    const message = error instanceof Error ? error.message : "Could not start checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
