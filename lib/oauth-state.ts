import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

const COOKIE = "posty_oauth_state";
const STATE_TTL_MS = 10 * 60 * 1000;

export type OAuthStatePayload = {
  userId: string;
  platform: string;
  clientId: string | null;
};

function oauthSecret() {
  return (
    process.env.OAUTH_STATE_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  );
}

function sign(value: string) {
  const secret = oauthSecret();
  if (!secret) throw new Error("Missing OAuth state secret");
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function signaturesMatch(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createOAuthState(payload: OAuthStatePayload) {
  const body = Buffer.from(
    JSON.stringify({
      u: payload.userId,
      p: payload.platform,
      c: payload.clientId,
      e: Date.now() + STATE_TTL_MS,
    }),
    "utf8",
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readOAuthState(state: string | null | undefined): OAuthStatePayload | null {
  if (!state || !state.includes(".")) return null;
  const splitAt = state.lastIndexOf(".");
  const body = state.slice(0, splitAt);
  const signature = state.slice(splitAt + 1);
  if (!body || !signature || !signaturesMatch(sign(body), signature)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      u?: unknown;
      p?: unknown;
      c?: unknown;
      e?: unknown;
    };
    if (typeof parsed.u !== "string" || typeof parsed.p !== "string" || typeof parsed.e !== "number") {
      return null;
    }
    if (parsed.e < Date.now()) return null;
    return {
      userId: parsed.u,
      platform: parsed.p,
      clientId: typeof parsed.c === "string" && parsed.c ? parsed.c : null,
    };
  } catch {
    return null;
  }
}

export function withOAuthStateCookie(
  response: NextResponse,
  state: string,
  clientId?: string | null,
) {
  const secure = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    sameSite: (secure ? "none" : "lax") as "none" | "lax",
    secure,
    maxAge: 10 * 60,
    path: "/",
  };
  response.cookies.set(COOKIE, state, options);
  if (clientId) {
    response.cookies.set("posty_oauth_client", clientId, options);
  }
  return response;
}

export function oauthClientCookieName() {
  return "posty_oauth_client";
}

export function oauthStateCookieName() {
  return COOKIE;
}
