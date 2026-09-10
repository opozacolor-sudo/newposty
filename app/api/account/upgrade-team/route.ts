import { NextResponse } from "next/server";
import { CLIENT_COOKIE, clientCookieOptions, parseAccountKind } from "@/lib/clients";
import { createAdminSupabase } from "@/lib/supabase/admin";
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
    .select("account_kind, display_name, email")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Missing profile" }, { status: 404 });
  if (parseAccountKind(profile.account_kind) === "team") {
    return NextResponse.json({ ok: true, alreadyTeam: true });
  }

  let payload: { name?: unknown } = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const fallback =
    (typeof profile.display_name === "string" && profile.display_name.trim()) ||
    (typeof profile.email === "string" ? profile.email.split("@")[0] : "") ||
    "Client";
  const name = String(payload.name ?? fallback).trim() || fallback;
  if (name.length > 80) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .insert({ user_id: user.id, name })
    .select("id, name")
    .single();
  if (clientError || !client) {
    return NextResponse.json({ error: "Could not create client" }, { status: 500 });
  }

  const admin = createAdminSupabase();
  const { error: kindError } = await admin
    .from("profiles")
    .update({ account_kind: "team" })
    .eq("id", user.id);
  if (kindError) {
    await admin.from("clients").delete().eq("id", client.id).eq("user_id", user.id);
    return NextResponse.json({ error: "Could not switch to team" }, { status: 500 });
  }

  await Promise.all([
    admin.from("social_accounts").update({ client_id: client.id }).eq("user_id", user.id).is("client_id", null),
    admin.from("conversations").update({ client_id: client.id }).eq("user_id", user.id).is("client_id", null),
    admin.from("posts").update({ client_id: client.id }).eq("user_id", user.id).is("client_id", null),
  ]);

  const response = NextResponse.json({ ok: true, client });
  response.cookies.set(CLIENT_COOKIE, client.id, clientCookieOptions());
  return response;
}
