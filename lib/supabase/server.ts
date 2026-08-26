import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/env";

export async function createServerSupabase(): Promise<SupabaseClient> {
  const { url, anonKey } = getSupabasePublicEnv();
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return createClient(url, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component; proxy will refresh the session.
        }
      },
    },
  });
}

export async function getRequestAuth() {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");
  const supabase = await createServerSupabase();
  const jwt = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : undefined;
  const {
    data: { user },
  } = await supabase.auth.getUser(jwt);
  return { supabase, user };
}
