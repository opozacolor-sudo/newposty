import { NextResponse } from "next/server";
import { CLIENT_COOKIE, clientCookieOptions, listClients, parseAccountKind } from "@/lib/clients";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_kind")
    .eq("id", user.id)
    .maybeSingle();
  if (parseAccountKind(profile?.account_kind) !== "team") {
    return NextResponse.json({ error: "NOT_TEAM" }, { status: 403 });
  }

  let payload: { clientId?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const clientId = String(payload.clientId ?? "").trim();
  const clients = await listClients(supabase, user.id);
  if (!clients.some((client) => client.id === clientId)) {
    return NextResponse.json({ error: "Unknown client" }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_COOKIE, clientId, clientCookieOptions());
  return response;
}
