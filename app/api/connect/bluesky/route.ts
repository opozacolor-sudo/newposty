import { NextResponse } from "next/server";
import { ensureZernioProfile, syncSocialAccounts } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase/server";
import { connectBlueskyCredentials } from "@/lib/zernio";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    identifier?: string;
    appPassword?: string;
  };
  const identifier = body.identifier?.trim() ?? "";
  const appPassword = body.appPassword?.trim() ?? "";
  if (!identifier || !appPassword) {
    return NextResponse.json(
      { error: "Bluesky username and app password are required." },
      { status: 400 },
    );
  }

  try {
    const profile = await ensureZernioProfile(user.id, user.email);
    if (!profile.zernio_profile_id) {
      throw new Error("Could not create a Zernio profile for this user.");
    }

    await connectBlueskyCredentials({
      identifier,
      appPassword,
      profileId: profile.zernio_profile_id,
    });
    await syncSocialAccounts(user.id, profile.zernio_profile_id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bluesky connect failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
