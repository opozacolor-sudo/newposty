import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export const CLIENT_COOKIE = "posty_client";

export type AccountKind = "individual" | "team";

export type ClientRow = {
  id: string;
  name: string;
};

export type Workspace = {
  kind: AccountKind;
  isTeam: boolean;
  clients: ClientRow[];
  clientId: string | null;
};

export function parseAccountKind(value: unknown): AccountKind {
  return value === "team" ? "team" : "individual";
}

export function clientCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 400,
  };
}

export async function listClients(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ClientRow[];
}

export async function loadWorkspace(supabase: SupabaseClient, userId: string): Promise<Workspace> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("account_kind")
    .eq("id", userId)
    .maybeSingle();
  const kind = parseAccountKind(profile?.account_kind);
  if (kind !== "team") {
    return { kind, isTeam: false, clients: [], clientId: null };
  }

  const clients = await listClients(supabase, userId);
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(CLIENT_COOKIE)?.value ?? null;
  const clientId = clients.some((client) => client.id === fromCookie)
    ? fromCookie
    : (clients[0]?.id ?? null);

  return { kind, isTeam: true, clients, clientId };
}

export function asRows<T = Record<string, unknown>>(data: unknown) {
  return (Array.isArray(data) ? data : []) as T[];
}

export function applyClientScope(query: any, workspace: Workspace) {
  if (!workspace.isTeam) {
    return query.is("client_id", null);
  }
  if (!workspace.clientId) {
    return query.eq("client_id", "00000000-0000-0000-0000-000000000000");
  }
  return query.eq("client_id", workspace.clientId);
}
