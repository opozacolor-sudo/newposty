import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/env";

export async function POST() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", getSiteUrl()), { status: 303 });
}
