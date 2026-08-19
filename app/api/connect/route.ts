import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { ensureZernioProfile, syncSocialAccounts } from "@/lib/data";
import {
  getAdsPlatform,
  isAdsPlatformId,
  isConnectPlatformId,
} from "@/lib/platforms";
import { createServerSupabase } from "@/lib/supabase/server";
import { connectAdsAccount, getConnectUrl } from "@/lib/zernio";

function accountsHome(ads: boolean) {
  return new URL(ads ? "/accounts/ads" : "/accounts/posts", getSiteUrl());
}

async function parentAccountId(
  supabase: Awaited<ReturnType<typeof createServerSupabase>>,
  userId: string,
  platform: string,
) {
  const { data } = await supabase
    .from("social_accounts")
    .select("zernio_account_id")
    .eq("user_id", userId)
    .eq("platform", platform)
    .eq("is_active", true)
    .order("connected_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return typeof data?.zernio_account_id === "string" ? data.zernio_account_id : null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get("platform") ?? "";
  const force = url.searchParams.get("force") === "1";
  const ads = isAdsPlatformId(platform);

  if (!isConnectPlatformId(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }
  if (platform === "bluesky") {
    const target = accountsHome(false);
    target.searchParams.set("error", "Bluesky uses an app password, not OAuth.");
    return NextResponse.redirect(target);
  }
  if (platform === "openaiads") {
    const target = accountsHome(true);
    target.searchParams.set("error", "openai_key");
    return NextResponse.redirect(target);
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

    const redirectUrl = `${getSiteUrl()}/accounts/connected?platform=${platform}`;

    if (ads) {
      const adsPlatform = getAdsPlatform(platform);
      if (!adsPlatform) {
        return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
      }

      let accountId: string | undefined;
      if ("parentPlatform" in adsPlatform && adsPlatform.parentPlatform) {
        const parentId = await parentAccountId(
          supabase,
          user.id,
          adsPlatform.parentPlatform,
        );
        const required =
          "parentRequired" in adsPlatform && adsPlatform.parentRequired === true;
        if (required && !parentId) {
          const target = accountsHome(true);
          target.searchParams.set("error", "need_x");
          return NextResponse.redirect(target);
        }
        accountId = parentId ?? undefined;
      }

      const result = await connectAdsAccount({
        connectPath: adsPlatform.connectPath,
        profileId: profile.zernio_profile_id,
        redirectUrl,
        accountId,
        force,
      });

      if ("alreadyConnected" in result) {
        await syncSocialAccounts(user.id, profile.zernio_profile_id);
        const target = accountsHome(true);
        target.searchParams.set("connected", "1");
        target.searchParams.set("platform", platform);
        return NextResponse.redirect(target);
      }

      return NextResponse.redirect(result.authUrl);
    }

    const authUrl = await getConnectUrl({
      platform,
      profileId: profile.zernio_profile_id,
      redirectUrl,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connect failed";
    const target = accountsHome(ads);
    target.searchParams.set("error", message);
    return NextResponse.redirect(target);
  }
}
