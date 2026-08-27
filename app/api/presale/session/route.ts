import { NextResponse } from "next/server";
import { getStripe } from "@/lib/presale-server";
import { clientIp, rateLimit, tooMany } from "@/lib/rate-limit";
import { createAdminSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limited = rateLimit(`session:${clientIp(request)}`, 20, 15 * 60 * 1000);
  if (!limited.ok) return tooMany(limited.retryAfterSec);

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id")?.trim();
  if (!sessionId) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ status: "unpaid" }, { status: 402 });
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!paymentIntentId) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }

  const admin = createAdminSupabase();
  const { data: purchase } = await admin
    .from("presale_purchases")
    .select("status")
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ status: "pending" }, { status: 202 });
  }
  if (purchase.status === "registered") {
    return NextResponse.json({ status: "registered" });
  }

  return NextResponse.json({ status: "paid" });
}
