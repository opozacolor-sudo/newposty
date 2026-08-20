import {
  createPost,
  deletePost,
  getPost,
  getTikTokCreatorInfo,
  updatePost,
  ZernioError,
  type TikTokCreatorInfo,
  type TikTokSettings,
  type ZernioMediaItem,
  type ZernioPlatformTarget,
  type ZernioPost,
} from "@/lib/zernio";
import { humanZernioError } from "@/lib/zernio-error-messages";
import { isFutureDate, parseScheduledAt } from "@/lib/chat-post/timezone";
import {
  classifyPublishOutcome,
  isInFlightStatus,
  platformEntry,
  platformErrorText,
  platformStatus,
} from "@/lib/chat-post/publish-status";
import type {
  PlatformExecResult,
  ResolvedAction,
  ResolvedPlatform,
} from "@/lib/chat-post/types";

function errorCode(error: unknown) {
  if (error instanceof ZernioError && error.body && typeof error.body === "object" && "code" in error.body) {
    return String((error.body as { code: unknown }).code);
  }
  return null;
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function instagramPlatformData(contentType?: string): Record<string, unknown> | undefined {
  if (contentType === "stories" || contentType === "story") {
    return { contentType: "story" };
  }
  if (contentType === "reels" || contentType === "reel") {
    return { shareToFeed: true };
  }
  return undefined;
}

function privacyLevelValues(info: TikTokCreatorInfo) {
  return (info.privacyLevels ?? [])
    .map((level) => (typeof level === "string" ? level : level.value))
    .filter((value): value is string => Boolean(value));
}

function tiktokCanPostMore(info: TikTokCreatorInfo) {
  if (typeof info.creator?.canPostMore === "boolean") return info.creator.canPostMore;
  if (typeof info.canPostMore === "boolean") return info.canPostMore;
  return true;
}

async function tiktokSettingsFor(accountId: string): Promise<{
  canPostMore: boolean;
  settings: TikTokSettings;
}> {
  const defaults: TikTokSettings = {
    privacy_level: "PUBLIC_TO_EVERYONE",
    allow_comment: true,
    allow_duet: true,
    allow_stitch: true,
    content_preview_confirmed: true,
    express_consent_given: true,
  };
  try {
    const info = await getTikTokCreatorInfo(accountId, "video");
    const levels = privacyLevelValues(info);
    const interactions = info.postingLimits?.interactionSettings;
    return {
      canPostMore: tiktokCanPostMore(info),
      settings: {
        ...defaults,
        privacy_level: levels.find((level) => level === "PUBLIC_TO_EVERYONE") ?? levels[0] ?? defaults.privacy_level,
        allow_comment: interactions?.comment ?? !info.postingLimits?.commentDisabled,
        allow_duet: interactions?.duet ?? !info.postingLimits?.duetDisabled,
        allow_stitch: interactions?.stitch ?? !info.postingLimits?.stitchDisabled,
      },
    };
  } catch {
    return { canPostMore: true, settings: defaults };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntilSettled(post: ZernioPost, platform: string) {
  let current = post;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const status = platformStatus(current, platform);
    const postStatus = (current.status ?? "").toLowerCase();
    if (!isInFlightStatus(status) && !isInFlightStatus(postStatus) && (status || postStatus === "failed")) {
      return current;
    }
    await sleep(1500);
    try {
      current = await getPost(current._id);
    } catch {
      return current;
    }
  }
  return current;
}

function resultFromPost(input: {
  post: ZernioPost;
  target: ResolvedPlatform;
  mode: "publish_now" | "schedule";
  locale: string;
}): PlatformExecResult {
  const outcome = classifyPublishOutcome({
    post: input.post,
    platform: input.target.platform,
    mode: input.mode,
  });
  const entry = platformEntry(input.post, input.target.platform);
  if (outcome === "success") {
    return {
      platform: input.target.platform,
      handle: input.target.handle,
      status: "success",
      post_url: entry?.platformPostUrl ?? null,
      zernio_post_id: input.post._id,
      error_message_human: null,
    };
  }
  if (outcome === "pending") {
    return {
      platform: input.target.platform,
      handle: input.target.handle,
      status: "pending",
      post_url: null,
      zernio_post_id: input.post._id,
      error_message_human:
        input.locale === "ro"
          ? "Se publică încă. Verifică Statistică în câteva minute."
          : "Still publishing. Check Stats in a few minutes.",
    };
  }
  const message = platformErrorText(input.post, input.target.platform);
  return {
    platform: input.target.platform,
    handle: input.target.handle,
    status: "error",
    zernio_post_id: input.post._id,
    error_code: entry?.errorCategory ?? null,
    error_message_human: humanZernioError({
      code: entry?.errorCategory,
      message,
      locale: input.locale,
    }),
  };
}

async function publishOne(input: {
  target: ResolvedPlatform;
  content: string;
  media: ZernioMediaItem[];
  mode: "publish_now" | "schedule";
  scheduledFor?: string | null;
  timezone: string;
  locale: string;
}): Promise<PlatformExecResult> {
  try {
    let tiktokSettings: TikTokSettings | undefined;
    if (input.target.platform === "tiktok") {
      const tiktok = await tiktokSettingsFor(input.target.zernioAccountId);
      if (!tiktok.canPostMore) {
        return {
          platform: input.target.platform,
          handle: input.target.handle,
          status: "error",
          error_code: "quota_exhausted",
          error_message_human: humanZernioError({
            code: "quota_exhausted",
            locale: input.locale,
          }),
        };
      }
      tiktokSettings = tiktok.settings;
    }

    const platformTarget: ZernioPlatformTarget = {
      platform: input.target.platform,
      accountId: input.target.zernioAccountId,
      platformSpecificData:
        input.target.platform === "instagram" ? instagramPlatformData(input.target.contentType) : undefined,
    };
    let post = await createPost({
      content: input.content,
      title: input.target.platform === "youtube" ? input.content.slice(0, 100) : undefined,
      platforms: [platformTarget],
      mediaItems: input.media.length > 0 ? input.media : undefined,
      publishNow: input.mode === "publish_now",
      scheduledFor: input.mode === "schedule" ? (input.scheduledFor ?? undefined) : undefined,
      timezone: input.timezone,
      xRequestId: input.target.requestId,
      tiktokSettings,
    });
    if (input.mode === "publish_now") {
      post = await waitUntilSettled(post, input.target.platform);
    }
    return resultFromPost({
      post,
      target: input.target,
      mode: input.mode,
      locale: input.locale,
    });
  } catch (error) {
    const code = errorCode(error);
    return {
      platform: input.target.platform,
      handle: input.target.handle,
      status: "error",
      error_code: code,
      error_message_human: humanZernioError({
        code,
        message: errorMessage(error),
        locale: input.locale,
      }),
    };
  }
}

export async function executeResolvedAction(input: {
  resolved: ResolvedAction;
  locale: string;
}): Promise<PlatformExecResult[]> {
  if (input.resolved.kind === "manage" && input.resolved.manage) {
    return [await executeManage(input.resolved, input.locale)];
  }

  const results: PlatformExecResult[] = [];
  for (const action of input.resolved.actions) {
    const media: ZernioMediaItem[] = action.media.map((item) => ({
      url: item.url,
      type: item.type,
      title: item.name ?? undefined,
    }));
    for (const target of action.platforms) {
      results.push(
        await publishOne({
          target,
          content: target.caption,
          media,
          mode: action.mode,
          scheduledFor: action.scheduled_at_iso,
          timezone: input.resolved.timezone,
          locale: input.locale,
        }),
      );
    }
  }
  return results;
}

async function executeManage(resolved: ResolvedAction, locale: string): Promise<PlatformExecResult> {
  const manage = resolved.manage;
  if (!manage) {
    return {
      platform: "unknown",
      handle: "",
      status: "error",
      error_message_human: locale === "ro" ? "Nu am ce modifica." : "There is nothing to change.",
    };
  }
  try {
    if (manage.action === "cancel") {
      await deletePost(manage.zernioPostId);
      return {
        platform: manage.platform,
        handle: manage.handle,
        status: "success",
        error_message_human: null,
      };
    }
    if (manage.action === "reschedule") {
      const next = manage.new_value ? parseScheduledAt(manage.new_value, resolved.timezone) : null;
      if (!next || !isFutureDate(next)) {
        return {
          platform: manage.platform,
          handle: manage.handle,
          status: "error",
          error_message_human:
            locale === "ro" ? "Ora nouă e invalidă sau e în trecut." : "The new time is invalid or in the past.",
        };
      }
      const local = formatParts(next, resolved.timezone);
      await updatePost(manage.zernioPostId, {
        scheduledFor: local,
        timezone: resolved.timezone,
        isDraft: false,
      });
      return {
        platform: manage.platform,
        handle: manage.handle,
        status: "success",
        error_message_human: null,
      };
    }
    await updatePost(manage.zernioPostId, {
      content: manage.new_value ?? manage.caption,
    });
    return {
      platform: manage.platform,
      handle: manage.handle,
      status: "success",
      error_message_human: null,
    };
  } catch (error) {
    const code = errorCode(error);
    return {
      platform: manage.platform,
      handle: manage.handle,
      status: "error",
      error_code: code,
      error_message_human: humanZernioError({
        code,
        message: errorMessage(error),
        locale,
      }),
    };
  }
}

function formatParts(date: Date, timeZone: string) {
  const formatted = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => formatted.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

export function applyCaptionOverrides(resolved: ResolvedAction, overrides?: Record<string, string>) {
  if (!overrides) return resolved;
  return {
    ...resolved,
    actions: resolved.actions.map((action) => ({
      ...action,
      platforms: action.platforms.map((platform) => ({
        ...platform,
        caption: overrides[platform.platform] ?? platform.caption,
      })),
    })),
  };
}

