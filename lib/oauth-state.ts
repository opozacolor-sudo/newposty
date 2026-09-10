import { NextResponse } from "next/server";

const COOKIE = "posty_oauth_state";

export function createOAuthState() {
  return crypto.randomUUID();
}

export function withOAuthStateCookie(
  response: NextResponse,
  state: string,
  clientId?: string | null,
) {
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
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
