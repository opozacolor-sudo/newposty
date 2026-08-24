import { createHash, randomBytes } from "node:crypto";
import {
  PRESALE_TOKEN_TTL_DAYS,
  PRESALE_TOTAL_SLOTS,
  PRESALE_TRANCHE_SIZE,
  PRESALE_TRANCHES,
} from "./presale-config";

export type PresaleTranche = (typeof PRESALE_TRANCHES)[number];
export type TrancheState = "sold_out" | "current" | "upcoming";

export type PresaleTrancheView = {
  tranche: number;
  priceEur: number;
  slotsFrom: number;
  slotsTo: number;
  sold: number;
  remaining: number;
  capacity: number;
  state: TrancheState;
};

export type PresaleView = {
  sold: number;
  remaining: number;
  soldOut: boolean;
  current: PresaleTrancheView | null;
  tranches: PresaleTrancheView[];
};

export function trancheForSlot(slot: number): PresaleTranche | null {
  if (slot < 1 || slot > PRESALE_TOTAL_SLOTS) return null;
  return PRESALE_TRANCHES.find((row) => slot >= row.slotsFrom && slot <= row.slotsTo) ?? null;
}

export function quoteForSoldCount(sold: number) {
  if (sold < 0) throw new Error("sold count cannot be negative");
  if (sold >= PRESALE_TOTAL_SLOTS) {
    return { soldOut: true as const };
  }
  const nextSlot = sold + 1;
  const tranche = trancheForSlot(nextSlot);
  if (!tranche) return { soldOut: true as const };
  return {
    soldOut: false as const,
    nextSlot,
    tranche: tranche.tranche,
    priceEur: tranche.priceEur,
    slotsFrom: tranche.slotsFrom,
    slotsTo: tranche.slotsTo,
  };
}

export function buildPresaleView(sold: number, byTranche: Record<string, number> = {}): PresaleView {
  const safeSold = Math.max(0, Math.min(sold, PRESALE_TOTAL_SLOTS));
  const quote = quoteForSoldCount(safeSold);
  const currentTranche = quote.soldOut ? null : quote.tranche;

  const tranches: PresaleTrancheView[] = PRESALE_TRANCHES.map((row) => {
    const capacity = row.slotsTo - row.slotsFrom + 1;
    const soldInTranche = Math.min(capacity, Math.max(0, Number(byTranche[String(row.tranche)] ?? 0)));
    const remaining = capacity - soldInTranche;
    const state: TrancheState =
      remaining <= 0 ? "sold_out" : currentTranche === row.tranche ? "current" : "upcoming";
    return {
      tranche: row.tranche,
      priceEur: row.priceEur,
      slotsFrom: row.slotsFrom,
      slotsTo: row.slotsTo,
      sold: soldInTranche,
      remaining,
      capacity,
      state,
    };
  });

  return {
    sold: safeSold,
    remaining: PRESALE_TOTAL_SLOTS - safeSold,
    soldOut: quote.soldOut,
    current: tranches.find((row) => row.state === "current") ?? null,
    tranches,
  };
}

export function createPresaleToken() {
  return randomBytes(32).toString("base64url");
}

export function hashPresaleToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function presaleTokenExpiresAt(from = new Date()) {
  return new Date(from.getTime() + PRESALE_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

export function tokenStatus(expiresAt: Date, usedAt: Date | null, now = new Date()) {
  if (usedAt) return "used" as const;
  if (expiresAt.getTime() <= now.getTime()) return "expired" as const;
  return "valid" as const;
}

export function eurosFromStripeAmount(amountTotal: number | null | undefined) {
  if (typeof amountTotal !== "number" || !Number.isFinite(amountTotal)) return null;
  return Math.round(amountTotal / 100);
}

export { PRESALE_TOTAL_SLOTS, PRESALE_TRANCHE_SIZE, PRESALE_TRANCHES };
