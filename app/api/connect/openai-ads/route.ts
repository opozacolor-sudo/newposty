import { NextResponse } from "next/server";
import { ensureZernioProfile, syncSocialAccounts } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase/server";
import { connectOpenAIAdsCredentials } from "@/lib/zernio";

export async function POST(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { apiKey?: string };
  const apiKey = body.apiKey?.trim() ?? "";
  if (!apiKey) {
    return NextResponse.json(
      { error: "An OpenAI Ads API key is required." },
      { status: 400 },
    );
  }

  try {
    const profile = await ensureZernioProfile(user.id, user.email);
    if (!profile.zernio_profile_id) {
      throw new Error("Could not create a Zernio profile for this user.");
    }

    await connectOpenAIAdsCredentials({
      apiKey,
      profileId: profile.zernio_profile_id,
    });
    await syncSocialAccounts(user.id, profile.zernio_profile_id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "OpenAI Ads connect failed" }, { status: 500 });
  }
}
