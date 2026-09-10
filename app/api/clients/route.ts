import { NextResponse } from "next/server";
import { CLIENT_COOKIE, clientCookieOptions, listClients, parseAccountKind } from "@/lib/clients";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
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
  const kind = parseAccountKind(profile?.account_kind);
  if (kind !== "team") {
    return NextResponse.json({ clients: [], kind });
  }

  const clients = await listClients(supabase, user.id);
  return NextResponse.json({ clients, kind });
}

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

  let payload: { name?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  if (name.length < 1 || name.length > 80) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({ user_id: user.id, name })
    .select("id, name")
    .single();
  if (error || !data) {
    return NextResponse.json({ error: "Could not add client" }, { status: 500 });
  }

  const response = NextResponse.json({ client: data });
  response.cookies.set(CLIENT_COOKIE, data.id, clientCookieOptions());
  return response;
}
