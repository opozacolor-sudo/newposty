import {
  createPost,
  deletePost,
  getTikTokCreatorInfo,
  updatePost,
  ZernioError,
  type TikTokSettings,
  type ZernioMediaItem,
  type ZernioPlatformTarget,
} from "@/lib/zernio";
import { humanZernioError } from "@/lib/zernio-error-messages";
import { isFutureDate, parseScheduledAt } from "@/lib/chat-post/timezone";
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

async function tiktokSettingsFor(accountId: string): Promise<TikTokSettings> {
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
    const levels = Array.isArray(info.privacyLevels)
      ? info.privacyLevels.filter((level): level is string => typeof level === "string")
      : [];
    return {
      ...defaults,
      privacy_level: levels.find((level) => level === "PUBLIC_TO_EVERYONE") ?? levels[0] ?? defaults.privacy_level,
      allow_comment: !info.postingLimits?.commentDisabled,
      allow_duet: !info.postingLimits?.duetDisabled,
      allow_stitch: !info.postingLimits?.stitchDisabled,
    };
  } catch {
    return defaults;
  }
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
    const platformTarget: ZernioPlatformTarget = {
      platform: input.target.platform,
      accountId: input.target.zernioAccountId,
      platformSpecificData:
        input.target.platform === "instagram" ? instagramPlatformData(input.target.contentType) : undefined,
    };
    const post = await createPost({
      content: input.content,
      title: input.target.platform === "youtube" ? input.content.slice(0, 100) : undefined,
      platforms: [platformTarget],
      mediaItems: input.media.length > 0 ? input.media : undefined,
      publishNow: input.mode === "publish_now",
      scheduledFor: input.mode === "schedule" ? (input.scheduledFor ?? undefined) : undefined,
      timezone: input.timezone,
      xRequestId: input.target.requestId,
      tiktokSettings: input.target.platform === "tiktok" ? await tiktokSettingsFor(input.target.zernioAccountId) : undefined,
    });
    const platformResult = post.platforms?.[0];
    return {
      platform: input.target.platform,
      handle: input.target.handle,
      status: "success",
      post_url: platformResult?.platformPostUrl ?? null,
      zernio_post_id: post._id,
      error_message_human: null,
    };
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

