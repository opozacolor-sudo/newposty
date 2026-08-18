import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { isPlatformId } from "@/lib/platforms";
import { ensureZernioProfile } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase/server";
import { getConnectUrl } from "@/lib/zernio";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") ?? "";
  if (!isPlatformId(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", getSiteUrl()));
  }

  try {
    const profile = await ensureZernioProfile(user.id, user.email);
    if (!profile.zernio_profile_id) {
      throw new Error("Could not create a Zernio profile for this user.");
    }

    const authUrl = await getConnectUrl({
      platform,
      profileId: profile.zernio_profile_id,
      redirectUrl: `${getSiteUrl()}/accounts/connected?platform=${platform}`,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connect failed";
    const target = new URL("/accounts", getSiteUrl());
    target.searchParams.set("error", message);
    return NextResponse.redirect(target);
  }
}
