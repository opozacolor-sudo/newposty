import { NextResponse } from "next/server";

const COOKIE = "posty_oauth_state";

export function createOAuthState() {
  return crypto.randomUUID();
}

export function withOAuthStateCookie(response: NextResponse, state: string) {
  response.cookies.set(COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/",
  });
  return response;
}

export function oauthStateCookieName() {
  return COOKIE;
}
