import {
  boostAd,
  createPost,
  createStandaloneAd,
  getPost,
  getTikTokCreatorInfo,
  getZernioAccount,
  listAdAccounts,
  listInboxComments,
  searchAdTargeting,
  ZernioError,
  type TikTokSettings,
  type ZernioAccount,
  type ZernioPost,
} from "@/lib/zernio";
import {
  foldChatText,
  geoKey,
  isMetaAdNetwork,
  isTikTokAdNetwork,
  pickLatestInstagramInboxPost,
  tiktokItemIdFromPost,
} from "@/lib/chat-post/ad-confirm";
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
      needMetaAds: "Connect Meta Ads under Connections → Ads, then ask again.",
      needInstagram: "Connect Instagram under Connections → Social, then ask again.",
      noIgPost: "I cannot see a recent Instagram post to boost. Publish it first, then ask again.",
    },
    ro: {
      missing: "Lipsește brief-ul de reclamă.",
      failed: "Reclama nu a pornit.",
      wait: "TikTok încă publică videoul. Așteaptă un minut, apoi pornește reclama din nou.",
      noPost: "TikTok nu a acceptat videoul.",
      needMetaAds: "Conectează Meta Ads la Conexiuni → Reclame, apoi cere din nou.",
      needInstagram: "Conectează Instagram la Conexiuni → Social, apoi cere din nou.",
      noIgPost: "Nu văd o postare recentă de Instagram de promovat. Public-o întâi, apoi cere din nou.",
    },
    de: {
      missing: "Das Anzeigenbriefing fehlt.",
      failed: "Die Anzeige ist nicht gestartet.",
      wait: "TikTok veröffentlicht das Video noch. Warte eine Minute und starte die Anzeige erneut.",
      noPost: "TikTok hat das Video nicht angenommen.",
      needMetaAds: "Verbinde Meta Ads unter Verbindungen → Anzeigen und frage dann erneut.",
      needInstagram: "Verbinde Instagram unter Verbindungen → Social und frage dann erneut.",
      noIgPost: "Ich sehe keinen aktuellen Instagram-Beitrag zum Boosten. Veröffentliche ihn zuerst, dann frage erneut.",
    },
    it: {
      missing: "Manca il brief dell’ads.",
      failed: "L’ads non è partita.",
      wait: "TikTok sta ancora pubblicando il video. Aspetta un minuto e poi avvia di nuovo l’ads.",
      noPost: "TikTok non ha accettato il video.",
      needMetaAds: "Collega Meta Ads in Connessioni → Ads, poi chiedi di nuovo.",
      needInstagram: "Collega Instagram in Connessioni → Social, poi chiedi di nuovo.",
      noIgPost: "Non vedo un post Instagram recente da promuovere. Pubblicalo prima, poi chiedi di nuovo.",
    },
    fr: {
      missing: "Le brief de la pub manque.",
      failed: "La pub n’a pas démarré.",
      wait: "TikTok publie encore la vidéo. Attends une minute, puis relance la pub.",
      noPost: "TikTok n’a pas accepté la vidéo.",
      needMetaAds: "Connecte Meta Ads dans Connexions → Pubs, puis redemande.",
      needInstagram: "Connecte Instagram dans Connexions → Social, puis redemande.",
      noIgPost: "Je ne vois pas de post Instagram récent à booster. Publie-le d’abord, puis redemande.",
    },
    es: {
      missing: "Falta el brief del anuncio.",
      failed: "El anuncio no arrancó.",
      wait: "TikTok sigue publicando el vídeo. Espera un minuto y vuelve a lanzar el anuncio.",
      noPost: "TikTok no aceptó el vídeo.",
      needMetaAds: "Conecta Meta Ads en Conexiones → Anuncios y vuelve a pedirlo.",
      needInstagram: "Conecta Instagram en Conexiones → Social y vuelve a pedirlo.",
      noIgPost: "No veo una publicación reciente de Instagram para impulsar. Publícala primero y vuelve a pedirlo.",
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
  platform?: "tiktok" | "facebook";
}) {
  for (const q of input.queries) {
    const hits = await searchAdTargeting({
      dimension: input.dimension,
      q,
      platform: input.platform ?? "tiktok",
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
  let itemId: string | null = null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    itemId = tiktokItemIdFromPost(current);
    const url = platformPublicUrl(current.platforms?.find((row) => row.platform === "tiktok") ?? current.platforms?.[0] ?? null);
    if (itemId && (url || attempt >= 8)) return { post: current, itemId };
    await sleep(4000);
    current = await getPost(current._id);
  }
  if (itemId) return { post: current, itemId };
  throw new Error(adCopy(locale).wait);
}

function boostMessage(error: unknown) {
  return error instanceof Error ? error.message : "";
}

function isRetryableBoost(error: unknown) {
  const message = boostMessage(error);
  return /not been published|not published|unable to get spark|spark ad post|not a valid integer|tiktok_item_id/i.test(
    message,
  );
}

function isWrongBoostAccount(error: unknown) {
  return /not been published to this account|ads-only|no tiktok identity|sparkauthcode/i.test(
    boostMessage(error),
  );
}

type PaidAdBrief = {
  network?: string;
  goal?: string;
  spark?: boolean;
  budget_amount?: number;
  budget_currency?: string;
  budget_type?: "daily" | "lifetime";
  days?: number;
  start_now?: boolean;
  locations?: string[];
  interests?: string[];
  caption?: string;
  media_refs?: string[];
  instagram_only?: boolean;
};

type PaidAdInput = {
  locale: string;
  timezone: string;
  accounts: ConnectedAccount[];
  adsAccounts: ConnectedAccount[];
  media: ChatMedia[];
  brief: PaidAdBrief;
};

export async function resolvePaidAd(input: PaidAdInput) {
  const network = input.brief.network ?? "";
  if (isMetaAdNetwork(network) && !isTikTokAdNetwork(network)) {
    return resolveMetaAd(input);
  }
  return resolveTikTokAd(input);
}

export async function resolveTikTokAd(input: PaidAdInput): Promise<{ ok: true; resolved: Omit<ResolvedAction, "action_id"> } | { ok: false; error: string }> {
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
    budget_type: input.brief.budget_type === "lifetime" ? "lifetime" : "daily",
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

async function resolveMetaAd(input: PaidAdInput): Promise<{ ok: true; resolved: Omit<ResolvedAction, "action_id"> } | { ok: false; error: string }> {
  const copy = adCopy(input.locale);
  const instagram = input.accounts.find((account) => account.platform === "instagram");
  const ads = input.adsAccounts.find((account) => account.platform === "metaads");
  if (!ads) {
    return { ok: false, error: copy.needMetaAds };
  }
  if (!instagram) {
    return { ok: false, error: copy.needInstagram };
  }
  const amount = Number(input.brief.budget_amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return {
      ok: false,
      error: input.locale === "ro" ? "Spune bugetul (ex. 100 lei)." : "Name the budget (e.g. 100 lei).",
    };
  }
  const listed = await listInboxComments({
    accountId: instagram.zernio_account_id,
    platform: "instagram",
    limit: 12,
    sortBy: "date",
    sortOrder: "desc",
  }).catch(() => ({ data: [] as Array<{ id?: string; platform?: string; createdTime?: string; content?: string; permalink?: string }> }));
  const latest = pickLatestInstagramInboxPost(listed.data ?? []);
  if (!latest?.id) {
    return { ok: false, error: copy.noIgPost };
  }
  const days = Math.max(1, Math.round(Number(input.brief.days) || 1));
  const locations = (input.brief.locations ?? []).map((item) => item.trim()).filter(Boolean);
  const interests = (input.brief.interests ?? []).map((item) => item.trim()).filter(Boolean);
  const advertiserId = await resolveAdvertiserId(ads.zernio_account_id);
  const network = foldChatText(input.brief.network ?? "");
  const instagramOnly =
    input.brief.instagram_only === true ||
    /doar instagram|only instagram|instagram only|nur instagram|solo instagram|seulement instagram/.test(network) ||
    (isMetaAdNetwork(input.brief.network ?? "") && /instagram/.test(network) && !/facebook/.test(network));
  const ad: ResolvedAd = {
    platform: "metaads",
    format: "boost",
    goal: input.brief.goal === "video_views" ? "video_views" : "engagement",
    budget_amount: amount,
    budget_currency: (input.brief.budget_currency || "RON").toUpperCase(),
    budget_type: input.brief.budget_type === "daily" ? "daily" : "lifetime",
    days,
    start_now: input.brief.start_now !== false,
    locations,
    interests,
    caption: (input.brief.caption ?? latest.content ?? "").trim(),
    media: [],
    tiktok_account_id: null,
    tiktok_handle: "",
    instagram_account_id: instagram.zernio_account_id,
    instagram_handle: instagram.username ?? instagram.display_name ?? "Instagram",
    platform_post_id: latest.id,
    post_url: latest.permalink ?? null,
    instagram_only: instagramOnly,
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
        postId: ready.post._id,
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
      for (let attempt = 0; attempt < 8; attempt += 1) {
        try {
          await boostAd(boostBody);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          if (isWrongBoostAccount(error) && ad.tiktok_account_id) {
            boostBody.accountId = ad.tiktok_account_id;
          }
          if (!isRetryableBoost(error) || attempt === 7) throw error;
          await sleep(10_000);
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

export async function executeMetaAd(input: {
  resolved: ResolvedAction;
  locale: string;
}): Promise<PlatformExecResult[]> {
  const ad = input.resolved.ad;
  const copy = adCopy(input.locale);
  if (!ad || ad.platform !== "metaads") {
    return [
      {
        platform: "metaads",
        handle: "Meta Ads",
        status: "error",
        error_message_human: copy.missing,
      },
    ];
  }
  const handle = ad.instagram_handle || "Instagram";
  try {
    if (!ad.platform_post_id || !ad.instagram_account_id) {
      throw new Error(copy.noIgPost);
    }
    const advertiser = ad.platform_ad_account_id;
    const targetingAdvertiser = advertiser && !isZernioObjectId(advertiser) ? advertiser : undefined;
    const geoAccount = ad.ads_account_id;
    const cities: Array<{ key: string; name: string; radius: number; distance_unit: "kilometer" }> = [];
    const regions: Array<{ key: string; name: string }> = [];
    for (const location of ad.locations) {
      const asRegion = /ilfov|judet|județ|region/i.test(location);
      const hit = await firstTarget({
        dimension: "geo",
        geoType: asRegion ? "region" : "city",
        queries: [location, foldChatText(location), location === "București" ? "Bucharest" : location],
        accountId: geoAccount,
        adAccountId: targetingAdvertiser,
        platform: "facebook",
      });
      if (!hit) continue;
      if (asRegion) regions.push(geoKey(hit));
      else cities.push({ ...geoKey(hit), radius: 25, distance_unit: "kilometer" });
    }
    const interestHits: Array<{ id: string; name: string }> = [];
    for (const interest of ad.interests) {
      const hit = await firstTarget({
        dimension: "interest",
        queries: [interest],
        accountId: geoAccount,
        adAccountId: targetingAdvertiser,
        platform: "facebook",
      });
      if (hit) interestHits.push(hit);
    }
    const start = new Date();
    const end = new Date(start.getTime() + ad.days * 24 * 60 * 60 * 1000);
    const lifetime = ad.budget_type !== "daily";
    const targeting: Record<string, unknown> = {
      ...(cities.length || regions.length ? {} : { countries: ["RO"] }),
      ...(cities.length ? { cities } : {}),
      ...(regions.length ? { regions } : {}),
      ...(interestHits.length ? { interests: interestHits } : {}),
      ...(ad.instagram_only
        ? {
            placements: {
              publisherPlatforms: ["instagram"],
              instagramPositions: ["stream", "explore", "explore_home", "reels", "profile_feed"],
            },
          }
        : {}),
    };
    await boostAd({
      platformPostId: ad.platform_post_id,
      accountId: ad.instagram_account_id,
      adAccountId: advertiser,
      name: ad.goal === "engagement" ? "Instagram comments" : "Instagram boost",
      goal: ad.goal,
      budget: {
        amount: ad.budget_amount,
        type: lifetime ? "lifetime" : "daily",
        currency: ad.budget_currency,
      },
      schedule: { startDate: start.toISOString(), endDate: end.toISOString() },
      targeting,
    });
    return [
      {
        platform: "metaads",
        handle,
        status: "success",
        post_url: ad.post_url ?? null,
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
        platform: "metaads",
        handle,
        status: "error",
        error_message_human: message,
      },
    ];
  }
}

export function adSummaryLines(ad: ResolvedAd, locale: string) {
  const copy = {
    en: {
      spark: "Spark — it also lands on the TikTok profile.",
      standalone: "Standalone ad (not a profile post).",
      boost: "Boost the latest Instagram post.",
      igOnly: "Instagram only — not Facebook.",
      views: "Goal: 6-second views.",
      engagement: "Goal: comments / engagement.",
      day: "day",
      days: "days",
      perDay: "per day",
      total: "total",
      location: "Location",
      interests: "Interests",
      budget: "Budget",
    },
    ro: {
      spark: "Spark — apare și pe profilul TikTok.",
      standalone: "Reclamă standalone (nu e postare de profil).",
      boost: "Boost pe ultima postare de Instagram.",
      igOnly: "Doar Instagram — fără Facebook.",
      views: "Obiectiv: vizualizări (6s).",
      engagement: "Obiectiv: comentarii.",
      day: "zi",
      days: "zile",
      perDay: "pe zi",
      total: "total",
      location: "Locație",
      interests: "Interese",
      budget: "Buget",
    },
    de: {
      spark: "Spark — erscheint auch auf dem TikTok-Profil.",
      standalone: "Standalone-Anzeige (kein Profilbeitrag).",
      boost: "Boost des neuesten Instagram-Beitrags.",
      igOnly: "Nur Instagram — nicht Facebook.",
      views: "Ziel: 6-Sekunden-Views.",
      engagement: "Ziel: Kommentare.",
      day: "Tag",
      days: "Tage",
      perDay: "pro Tag",
      total: "gesamt",
      location: "Ort",
      interests: "Interessen",
      budget: "Budget",
    },
    it: {
      spark: "Spark — compare anche sul profilo TikTok.",
      standalone: "Ads standalone (non è un post del profilo).",
      boost: "Boost dell’ultimo post Instagram.",
      igOnly: "Solo Instagram — senza Facebook.",
      views: "Obiettivo: visualizzazioni (6s).",
      engagement: "Obiettivo: commenti.",
      day: "giorno",
      days: "giorni",
      perDay: "al giorno",
      total: "totale",
      location: "Luogo",
      interests: "Interessi",
      budget: "Budget",
    },
    fr: {
      spark: "Spark — ça apparaît aussi sur le profil TikTok.",
      standalone: "Pub autonome (pas un post de profil).",
      boost: "Boost du dernier post Instagram.",
      igOnly: "Instagram seulement — pas Facebook.",
      views: "Objectif : vues (6s).",
      engagement: "Objectif : commentaires.",
      day: "jour",
      days: "jours",
      perDay: "par jour",
      total: "total",
      location: "Lieu",
      interests: "Intérêts",
      budget: "Budget",
    },
    es: {
      spark: "Spark — también aparece en el perfil de TikTok.",
      standalone: "Anuncio independiente (no es un post del perfil).",
      boost: "Impulso de la última publicación de Instagram.",
      igOnly: "Solo Instagram — sin Facebook.",
      views: "Objetivo: visualizaciones (6s).",
      engagement: "Objetivo: comentarios.",
      day: "día",
      days: "días",
      perDay: "al día",
      total: "total",
      location: "Ubicación",
      interests: "Intereses",
      budget: "Presupuesto",
    },
  }[locale] ?? {
    spark: "Spark — it also lands on the TikTok profile.",
    standalone: "Standalone ad (not a profile post).",
    boost: "Boost the latest Instagram post.",
    igOnly: "Instagram only — not Facebook.",
    views: "Goal: 6-second views.",
    engagement: "Goal: comments / engagement.",
    day: "day",
    days: "days",
    perDay: "per day",
    total: "total",
    location: "Location",
    interests: "Interests",
    budget: "Budget",
  };
  const period = ad.days === 1 ? copy.day : copy.days;
  const spend =
    ad.budget_type === "lifetime"
      ? `${copy.budget}: ${ad.budget_amount} ${ad.budget_currency} ${copy.total}, ${ad.days} ${period}.`
      : `${copy.budget}: ${ad.budget_amount} ${ad.budget_currency} ${copy.perDay}, ${ad.days} ${period}.`;
  const formatLine =
    ad.format === "boost" ? copy.boost : ad.format === "spark" ? copy.spark : copy.standalone;
  return [
    formatLine,
    ad.instagram_only ? copy.igOnly : "",
    ad.post_url ?? "",
    ad.goal === "video_views" ? copy.views : copy.engagement,
    spend,
    ad.locations.length ? `${copy.location}: ${ad.locations.join(", ")}.` : "",
    ad.interests.length ? `${copy.interests}: ${ad.interests.join(", ")}.` : "",
  ].filter(Boolean);
}
