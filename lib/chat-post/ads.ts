import { boostAd, createPost, createStandaloneAd, getZernioAccount, searchAdTargeting } from "@/lib/zernio";
import { humanZernioError } from "@/lib/zernio-error-messages";
import { ZernioError } from "@/lib/zernio";
import type { ChatMedia, ConnectedAccount, PlatformExecResult, ResolvedAction, ResolvedAd } from "@/lib/chat-post/types";

async function firstTarget(dimension: string, queries: string[]) {
  for (const q of queries) {
    const hits = await searchAdTargeting({ dimension, q, platform: "tiktok" }).catch(() => []);
    if (hits[0]) return hits[0];
  }
  return null;
}

export async function resolveTikTokAd(input: {
  locale: string;
  timezone: string;
  accounts: ConnectedAccount[];
  adsAccounts: ConnectedAccount[];
  media: ChatMedia[];
  brief: {
    goal?: string;
    spark?: boolean;
    budget_amount?: number;
    budget_currency?: string;
    days?: number;
    start_now?: boolean;
    locations?: string[];
    interests?: string[];
    caption?: string;
    media_refs?: string[];
  };
}): Promise<{ ok: true; resolved: Omit<ResolvedAction, "action_id"> } | { ok: false; error: string }> {
  const ro = input.locale === "ro";
  const tiktok = input.accounts.find((account) => account.platform === "tiktok");
  const ads = input.adsAccounts.find((account) => account.platform === "tiktokads");
  if (!ads) {
    return {
      ok: false,
      error: ro
        ? "Conectează TikTok Ads la Conturi → Reclame, apoi cere din nou."
        : "Connect TikTok Ads under Accounts → Ads, then ask again.",
    };
  }
  const spark = input.brief.spark !== false;
  if (spark && !tiktok) {
    return {
      ok: false,
      error: ro
        ? "Spark cere și TikTok-ul de postări conectat (același profil)."
        : "Spark also needs the posting TikTok connected (the same profile).",
    };
  }
  const media =
    input.brief.media_refs && input.brief.media_refs.length > 0
      ? input.media.filter((item) => input.brief.media_refs?.includes(item.id))
      : input.media.filter((item) => item.type === "video");
  const video = media.find((item) => item.type === "video") ?? media[0];
  if (!video || video.type !== "video") {
    return {
      ok: false,
      error: ro
        ? "Atașează clipul video. Reclama TikTok e video."
        : "Attach the video clip. A TikTok ad is video.",
    };
  }
  const amount = Number(input.brief.budget_amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      ok: false,
      error: ro ? "Spune bugetul (ex. 50 lei)." : "Name the budget (e.g. 50 lei).",
    };
  }
  const days = Math.max(1, Math.round(Number(input.brief.days) || 1));
  const locations = (input.brief.locations ?? []).map((item) => item.trim()).filter(Boolean);
  const interests = (input.brief.interests ?? []).map((item) => item.trim()).filter(Boolean);
  const caption = (input.brief.caption ?? "").trim();
  const adsRemote = await getZernioAccount(ads.zernio_account_id).catch(() => null);
  const platformAdAccountId =
    adsRemote?.platformAdAccountId || adsRemote?.platformUserId || ads.zernio_account_id;
  const ad: ResolvedAd = {
    platform: "tiktokads",
    format: spark ? "spark" : "standalone",
    goal: input.brief.goal === "engagement" ? "engagement" : "video_views",
    budget_amount: amount,
    budget_currency: (input.brief.budget_currency || "RON").toUpperCase(),
    days,
    start_now: input.brief.start_now !== false,
    locations,
    interests,
    caption,
    media: [video],
    tiktok_account_id: tiktok?.zernio_account_id ?? null,
    tiktok_handle: tiktok?.username ?? tiktok?.display_name ?? "TikTok",
    ads_account_id: ads.zernio_account_id,
    platform_ad_account_id: platformAdAccountId,
  };
  return {
    ok: true,
    resolved: {
      kind: "ad",
      timezone: input.timezone,
      locale: input.locale,
      actions: [],
      excluded_by_validation: [],
      excluded_platforms: [],
      warnings: [],
      ad,
    },
  };
}

export async function executeTikTokAd(input: {
  resolved: ResolvedAction;
  locale: string;
}): Promise<PlatformExecResult[]> {
  const ad = input.resolved.ad;
  const ro = input.locale === "ro";
  if (!ad) {
    return [
      {
        platform: "tiktokads",
        handle: "TikTok Ads",
        status: "error",
        error_message_human: ro ? "Lipsește brief-ul de reclamă." : "The ad brief is missing.",
      },
    ];
  }
  try {
    const cities: Array<{ id: string; name: string }> = [];
    for (const location of ad.locations) {
      const hit = await firstTarget("city", [location, location.replace("ș", "s").replace("ă", "a")]);
      if (hit) cities.push(hit);
    }
    const region =
      ad.locations.some((item) => /ilfov/i.test(item)) && (await firstTarget("region", ["Ilfov", "RO-IF"]));
    const interestHits: Array<{ id: string; name: string }> = [];
    for (const interest of ad.interests) {
      const hit = await firstTarget("interest", [interest]);
      if (hit) interestHits.push(hit);
    }
    const start = new Date();
    const end = new Date(start.getTime() + ad.days * 24 * 60 * 60 * 1000);
    const targeting = {
      countries: ["RO"],
      ...(cities.length ? { cities } : {}),
      ...(region ? { regions: [region] } : {}),
      ...(interestHits.length ? { interests: interestHits } : {}),
    };
    let postId: string | null = null;
    if (ad.format === "spark" && ad.tiktok_account_id) {
      const post = await createPost({
        content: ad.caption || " ",
        publishNow: true,
        timezone: input.resolved.timezone,
        platforms: [{ platform: "tiktok", accountId: ad.tiktok_account_id }],
        mediaItems: ad.media.map((item) => ({ url: item.url, type: item.type, title: item.name ?? undefined })),
      });
      postId = post._id;
    }
    if (ad.format === "spark" && postId) {
      await boostAd({
        postId,
        accountId: ad.tiktok_account_id,
        adAccountId: ad.platform_ad_account_id,
        name: "Spark views",
        goal: ad.goal,
        budget: { amount: ad.budget_amount, type: "daily" },
        schedule: { startDate: start.toISOString(), endDate: end.toISOString() },
        targeting,
      });
    } else {
      await createStandaloneAd({
        accountId: ad.ads_account_id,
        adAccountId: ad.platform_ad_account_id,
        name: "Video views",
        goal: ad.goal,
        budgetAmount: ad.budget_amount,
        budgetType: "daily",
        body: ad.caption || " ",
        imageUrl: ad.media[0]?.url,
        countries: ["RO"],
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        targeting,
      });
    }
    return [
      {
        platform: "tiktokads",
        handle: ad.tiktok_handle,
        status: "success",
        post_url: null,
        zernio_post_id: postId,
        error_message_human: null,
      },
    ];
  } catch (error) {
    const message =
      error instanceof ZernioError
        ? humanZernioError({ code: error.code, message: error.message, locale: input.locale })
        : error instanceof Error
          ? error.message
          : ro
            ? "Reclama nu a pornit."
            : "The ad did not start.";
    return [
      {
        platform: "tiktokads",
        handle: ad.tiktok_handle,
        status: "error",
        error_message_human: message,
      },
    ];
  }
}

export function adSummaryLines(ad: ResolvedAd, locale: string) {
  const ro = locale === "ro";
  return [
    ad.format === "spark"
      ? ro
        ? "Spark — apare și pe profilul TikTok."
        : "Spark — it also lands on the TikTok profile."
      : ro
        ? "Reclamă standalone (nu e postare de profil)."
        : "Standalone ad (not a profile post).",
    ro
      ? `Obiectiv: ${ad.goal === "video_views" ? "vizualizări (6s)" : "engagement"}.`
      : `Goal: ${ad.goal === "video_views" ? "6-second views" : "engagement"}.`,
    ro
      ? `Buget: ${ad.budget_amount} ${ad.budget_currency} / zi, ${ad.days} ${ad.days === 1 ? "zi" : "zile"}.`
      : `Budget: ${ad.budget_amount} ${ad.budget_currency} / day, ${ad.days} day(s).`,
    ad.locations.length
      ? ro
        ? `Locație: ${ad.locations.join(", ")}.`
        : `Location: ${ad.locations.join(", ")}.`
      : "",
    ad.interests.length
      ? ro
        ? `Interese: ${ad.interests.join(", ")}.`
        : `Interests: ${ad.interests.join(", ")}.`
      : "",
  ].filter(Boolean);
}
