import {
  boostAd,
  createPost,
  createStandaloneAd,
  getPost,
  getTikTokCreatorInfo,
  getZernioAccount,
  listAdAccounts,
  searchAdTargeting,
  ZernioError,
  type TikTokSettings,
  type ZernioAccount,
  type ZernioPost,
} from "@/lib/zernio";
import { foldChatText, geoKey, tiktokItemIdFromPost } from "@/lib/chat-post/ad-confirm";
import { humanZernioError } from "@/lib/zernio-error-messages";
import { classifyPublishOutcome, platformErrorText, platformPublicUrl } from "@/lib/chat-post/publish-status";
import type { ChatMedia, ConnectedAccount, PlatformExecResult, ResolvedAction, ResolvedAd } from "@/lib/chat-post/types";

const DEFAULT_TIKTOK_SETTINGS: TikTokSettings = {
  privacy_level: "PUBLIC_TO_EVERYONE",
  allow_comment: true,
  allow_duet: true,
  allow_stitch: true,
  content_preview_confirmed: true,
  express_consent_given: true,
};

function isZernioObjectId(value: string) {
  return /^[a-f0-9]{24}$/i.test(value);
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function advertiserIdFromAccount(account: (ZernioAccount & Record<string, unknown>) | null) {
  if (!account) return null;
  const nested =
    account.metadata && typeof account.metadata === "object"
      ? (account.metadata as Record<string, unknown>)
      : {};
  const candidates = [
    account.platformAdAccountId,
    account.advertiserId,
    account.adAccountId,
    nested.advertiserId,
    nested.advertiser_id,
    nested.platformAdAccountId,
    account.platformUserId,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value && !isZernioObjectId(value)) return value;
  }
  return firstString(...candidates);
}

async function resolveAdvertiserId(adsAccountId: string) {
  const listed = await listAdAccounts(adsAccountId).catch(() => []);
  const selectable = listed.find((item) => item.selectable) ?? listed[0];
  if (selectable?.id) return selectable.id;
  const adsRemote = (await getZernioAccount(adsAccountId).catch(() => null)) as
    | (ZernioAccount & Record<string, unknown>)
    | null;
  return advertiserIdFromAccount(adsRemote) || adsAccountId;
}

function adCopy(locale: string) {
  const table: Record<string, Record<string, string>> = {
    en: {
      missing: "The ad brief is missing.",
      failed: "The ad did not start.",
      wait: "TikTok is still publishing the video. Wait a minute, then start the ad again.",
      noPost: "TikTok did not accept the video.",
    },
    ro: {
      missing: "Lipsește brief-ul de reclamă.",
      failed: "Reclama nu a pornit.",
      wait: "TikTok încă publică videoul. Așteaptă un minut, apoi pornește reclama din nou.",
      noPost: "TikTok nu a acceptat videoul.",
    },
    de: {
      missing: "Das Anzeigenbriefing fehlt.",
      failed: "Die Anzeige ist nicht gestartet.",
      wait: "TikTok veröffentlicht das Video noch. Warte eine Minute und starte die Anzeige erneut.",
      noPost: "TikTok hat das Video nicht angenommen.",
    },
    it: {
      missing: "Manca il brief dell’ads.",
      failed: "L’ads non è partita.",
      wait: "TikTok sta ancora pubblicando il video. Aspetta un minuto e poi avvia di nuovo l’ads.",
      noPost: "TikTok non ha accettato il video.",
    },
    fr: {
      missing: "Le brief de la pub manque.",
      failed: "La pub n’a pas démarré.",
      wait: "TikTok publie encore la vidéo. Attends une minute, puis relance la pub.",
      noPost: "TikTok n’a pas accepté la vidéo.",
    },
    es: {
      missing: "Falta el brief del anuncio.",
      failed: "El anuncio no arrancó.",
      wait: "TikTok sigue publicando el vídeo. Espera un minuto y vuelve a lanzar el anuncio.",
      noPost: "TikTok no aceptó el vídeo.",
    },
  };
  return table[locale] ?? table.en;
}

async function firstTarget(input: {
  dimension: "geo" | "interest";
  queries: string[];
  geoType?: "city" | "region";
  accountId: string;
  adAccountId?: string;
}) {
  for (const q of input.queries) {
    const hits = await searchAdTargeting({
      dimension: input.dimension,
      q,
      platform: "tiktok",
      accountId: input.accountId,
      adAccountId: input.adAccountId,
      geoType: input.geoType,
      countryCode: "RO",
    }).catch(() => []);
    if (hits[0]) return hits[0];
  }
  return null;
}

async function tiktokSettingsFor(accountId: string): Promise<TikTokSettings> {
  try {
    const info = await getTikTokCreatorInfo(accountId, "video");
    const levels = (info.privacyLevels ?? [])
      .map((level) => (typeof level === "string" ? level : level.value))
      .filter((value): value is string => Boolean(value));
    const interactions = info.postingLimits?.interactionSettings;
    return {
      ...DEFAULT_TIKTOK_SETTINGS,
      privacy_level:
        levels.find((level) => level === "PUBLIC_TO_EVERYONE") ??
        levels[0] ??
        DEFAULT_TIKTOK_SETTINGS.privacy_level,
      allow_comment: interactions?.comment ?? !info.postingLimits?.commentDisabled,
      allow_duet: interactions?.duet ?? !info.postingLimits?.duetDisabled,
      allow_stitch: interactions?.stitch ?? !info.postingLimits?.stitchDisabled,
    };
  } catch {
    return DEFAULT_TIKTOK_SETTINGS;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntilPublished(post: ZernioPost, locale: string): Promise<ZernioPost> {
  let current = post;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const outcome = classifyPublishOutcome({
      post: current,
      platform: "tiktok",
      mode: "publish_now",
    });
    if (outcome === "success") return current;
    if (outcome === "error") {
      throw new Error(
        humanZernioError({
          message: platformErrorText(current, "tiktok"),
          locale,
        }) || adCopy(locale).noPost,
      );
    }
    await sleep(3000);
    current = await getPost(current._id);
  }
  throw new Error(adCopy(locale).wait);
}

async function waitUntilTikTokItemId(post: ZernioPost, locale: string): Promise<{ post: ZernioPost; itemId: string }> {
  let current = await waitUntilPublished(post, locale);
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const itemId = tiktokItemIdFromPost(current);
    if (itemId) return { post: current, itemId };
    await sleep(3000);
    current = await getPost(current._id);
  }
  throw new Error(adCopy(locale).wait);
}

function isUnpublishedBoost(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  return /not been published|not published/i.test(message);
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
  const advertiserId = await resolveAdvertiserId(ads.zernio_account_id);
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
    platform_ad_account_id: advertiserId,
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
  const copy = adCopy(input.locale);
  if (!ad) {
    return [
      {
        platform: "tiktokads",
        handle: "TikTok Ads",
        status: "error",
        error_message_human: copy.missing,
      },
    ];
  }
  try {
    const advertiser = ad.platform_ad_account_id;
    const targetingAdvertiser = advertiser && !isZernioObjectId(advertiser) ? advertiser : undefined;
    const cities: Array<{ key: string; name: string }> = [];
    for (const location of ad.locations) {
      if (/ilfov/i.test(location)) continue;
      const hit = await firstTarget({
        dimension: "geo",
        geoType: "city",
        queries: [location, foldChatText(location)],
        accountId: ad.ads_account_id,
        adAccountId: targetingAdvertiser,
      });
      if (hit) cities.push(geoKey(hit));
    }
    const regionHit = ad.locations.some((item) => /ilfov/i.test(item))
      ? await firstTarget({
          dimension: "geo",
          geoType: "region",
          queries: ["Ilfov", "RO-IF"],
          accountId: ad.ads_account_id,
          adAccountId: targetingAdvertiser,
        })
      : null;
    const interestHits: Array<{ id: string; name: string }> = [];
    for (const interest of ad.interests) {
      const hit = await firstTarget({
        dimension: "interest",
        queries: [interest],
        accountId: ad.ads_account_id,
        adAccountId: targetingAdvertiser,
      });
      if (hit) interestHits.push(hit);
    }
    const start = new Date();
    const end = new Date(start.getTime() + ad.days * 24 * 60 * 60 * 1000);
    const targeting = {
      countries: ["RO"],
      ...(cities.length ? { cities } : {}),
      ...(regionHit ? { regions: [geoKey(regionHit)] } : {}),
      ...(interestHits.length ? { interests: interestHits } : {}),
    };

    if (ad.format === "spark") {
      if (!ad.tiktok_account_id) {
        throw new Error(copy.failed);
      }
      const created = await createPost({
        content: ad.caption || " ",
        publishNow: true,
        timezone: input.resolved.timezone,
        platforms: [{ platform: "tiktok", accountId: ad.tiktok_account_id }],
        mediaItems: ad.media.map((item) => ({ url: item.url, type: item.type })),
        tiktokSettings: await tiktokSettingsFor(ad.tiktok_account_id),
      });
      if (!created?._id) {
        throw new Error(copy.noPost);
      }
      const ready = await waitUntilTikTokItemId(created, input.locale);
      const boostBody: Record<string, unknown> = {
        platformPostId: ready.itemId,
        accountId: ad.tiktok_account_id,
        adAccountId: advertiser,
        name: "Spark views",
        goal: ad.goal,
        budget: { amount: ad.budget_amount, type: "daily", currency: ad.budget_currency },
        schedule: { startDate: start.toISOString(), endDate: end.toISOString() },
        targeting,
      };
      let lastError: unknown = null;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          await boostAd(boostBody);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (!isUnpublishedBoost(error) || attempt === 4) throw error;
          await sleep(8000);
        }
      }
      if (lastError) throw lastError;
      return [
        {
          platform: "tiktokads",
          handle: ad.tiktok_handle,
          status: "success",
          post_url: platformPublicUrl(ready.post.platforms?.[0] ?? null),
          zernio_post_id: ready.post._id,
          error_message_human: null,
        },
      ];
    }

    await createStandaloneAd({
      accountId: ad.ads_account_id,
      adAccountId: advertiser,
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
    return [
      {
        platform: "tiktokads",
        handle: ad.tiktok_handle,
        status: "success",
        post_url: null,
        zernio_post_id: null,
        error_message_human: null,
      },
    ];
  } catch (error) {
    const message =
      error instanceof ZernioError
        ? humanZernioError({ code: error.code, message: error.message, locale: input.locale })
        : error instanceof Error
          ? error.message
          : copy.failed;
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
