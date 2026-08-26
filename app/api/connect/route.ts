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

function wantsJson(request: Request) {
  const url = new URL(request.url);
  return url.searchParams.get("client") === "mobile" || url.searchParams.get("format") === "json";
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
  const json = wantsJson(request);
  const mobile = url.searchParams.get("client") === "mobile";

  if (!isConnectPlatformId(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }
  if (platform === "bluesky") {
    if (json) {
      return NextResponse.json(
        { error: "Bluesky uses an app password, not OAuth." },
        { status: 400 },
      );
    }
    const target = accountsHome(false);
    target.searchParams.set("error", "Bluesky uses an app password, not OAuth.");
    return NextResponse.redirect(target);
  }
  if (platform === "openaiads") {
    if (json) {
      return NextResponse.json({ error: "openai_key" }, { status: 400 });
    }
    const target = accountsHome(true);
    target.searchParams.set("error", "openai_key");
    return NextResponse.redirect(target);
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    if (json) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", getSiteUrl()));
  }

  try {
    const profile = await ensureZernioProfile(user.id, user.email);
    if (!profile.zernio_profile_id) {
      throw new Error("Could not create a Zernio profile for this user.");
    }

    const redirectUrl = mobile
      ? `${getSiteUrl()}/api/oauth/mobile-callback?platform=${encodeURIComponent(platform)}`
      : `${getSiteUrl()}/accounts/connected?platform=${platform}`;

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
          if (json) {
            return NextResponse.json(
              { error: "need_x", message: "Connect the parent social account first." },
              { status: 400 },
            );
          }
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
        if (json) {
          return NextResponse.json({ alreadyConnected: true, platform });
        }
        const target = accountsHome(true);
        target.searchParams.set("connected", "1");
        target.searchParams.set("platform", platform);
        return NextResponse.redirect(target);
      }

      if (json) return NextResponse.json({ authUrl: result.authUrl });
      return NextResponse.redirect(result.authUrl);
    }

    const authUrl = await getConnectUrl({
      platform,
      profileId: profile.zernio_profile_id,
      redirectUrl,
    });

    if (json) return NextResponse.json({ authUrl });
    return NextResponse.redirect(authUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connect failed";
    if (json) return NextResponse.json({ error: message }, { status: 500 });
    const target = accountsHome(ads);
    target.searchParams.set("error", message);
    return NextResponse.redirect(target);
  }
}
