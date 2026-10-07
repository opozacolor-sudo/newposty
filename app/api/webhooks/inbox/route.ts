import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getZernioWebhookSecret } from "@/lib/env";
import { scanLeadsForAccount } from "@/lib/leads/scan";

export const maxDuration = 60;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function signaturesMatch(received: string, computed: string) {
  const left = Buffer.from(received);
  const right = Buffer.from(computed);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function inboundAccountId(payload: Record<string, unknown>) {
  const account = payload.account;
  if (account && typeof account === "object") {
    const row = account as Record<string, unknown>;
    const id = row.accountId ?? row.id;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  const message = payload.message;
  if (message && typeof message === "object") {
    const id = (message as Record<string, unknown>).accountId;
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  return "";
}

function isIncomingEvent(payload: Record<string, unknown>) {
  const event = String(payload.event ?? "");
  if (event === "comment.received") return true;
  if (event !== "message.received") return false;
  const message = payload.message;
  if (!message || typeof message !== "object") return true;
  const direction = String((message as Record<string, unknown>).direction ?? "").toLowerCase();
  return !direction || /(in|inbound|incoming|received)/.test(direction);
}

export async function POST(request: Request) {
  const secret = getZernioWebhookSecret();
  if (!secret) return NextResponse.json({ error: "Webhook secret missing" }, { status: 503 });

  const signature = request.headers.get("x-zernio-signature") || request.headers.get("x-late-signature") || "";
  const rawBody = await request.text();
  const computed = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!signature || !signaturesMatch(signature, computed)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isIncomingEvent(payload)) return NextResponse.json({ ok: true, skipped: true });

  const accountId = inboundAccountId(payload);
  if (!accountId) return NextResponse.json({ ok: true, skipped: true });

  try {
    const stats = await scanLeadsForAccount(accountId);
    return NextResponse.json({ ok: true, stats });
  } catch {
    return NextResponse.json({ error: "Lead scan failed" }, { status: 502 });
  }
}
