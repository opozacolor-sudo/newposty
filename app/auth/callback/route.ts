import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/chat";
  const supabase = await createServerSupabase();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, getSiteUrl()));
}
