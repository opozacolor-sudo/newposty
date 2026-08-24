import Anthropic from "@anthropic-ai/sdk";
import { getPlatformCapability } from "@/lib/platform-capabilities";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import {
  adaptContentType,
  contentTypeForPlatform,
  inferMediaKind,
  resolvePlatformSelection,
  truncateCaption,
  userRequestedCaption,
  validationReason,
} from "@/lib/chat-post/rules";
import {
  bestTimeResearchWarning,
  hasClockTime,
  nextBestTime,
  parseDateOnly,
  wantsBestTime,
} from "@/lib/chat-post/best-time";
import {
  formatInZone,
  isFutureDate,
  localIsoInZone,
  parseScheduledAt,
} from "@/lib/chat-post/timezone";
import type {
  CaptionSource,
  ChatMedia,
  ConnectedAccount,
  ExcludedPlatform,
  ResolvedAction,
  ResolvedCreateAction,
  ResolvedPlatform,
  ScheduleSource,
  ToolPostAction,
} from "@/lib/chat-post/types";

function handleOf(account: ConnectedAccount) {
  if (account.username) return `@${account.username.replace(/^@/, "")}`;
  return account.display_name ?? platformLabel(account.platform);
}

function accountForPlatform(accounts: ConnectedAccount[], platform: string) {
  return accounts.find((account) => account.platform === platform) ?? null;
}

async function generateCaption(input: {
  apiKey: string;
  brief: string;
  locale: string;
  brandName?: string | null;
  brandVoice?: string | null;
  maxChars: number;
}) {
  const anthropic = new Anthropic({ apiKey: input.apiKey });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 400,
    system: [
      "Write one social caption ready to publish. No preamble, no quotes around the whole caption.",
      `Language: ${input.locale === "ro" ? "Romanian" : "English"}.`,
      `Hard max length: ${input.maxChars} characters.`,
      input.brandName ? `Brand: ${input.brandName}` : "",
      input.brandVoice ? `Voice: ${input.brandVoice}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    messages: [{ role: "user", content: input.brief || "Write a short caption for the attached media." }],
  });
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
  return truncateCaption(text, input.maxChars).caption;
}

export async function resolveCreateActions(input: {
  actions: ToolPostAction[];
  accounts: ConnectedAccount[];
  media: ChatMedia[];
  locale: string;
  timezone: string;
  apiKey: string;
  brandName?: string | null;
  brandVoice?: string | null;
  fallbackBrief?: string;
  keepToolCaption?: boolean;
  now?: Date;
}): Promise<
  | { ok: true; resolved: Omit<ResolvedAction, "action_id"> }
  | { ok: false; error: string; missing?: Array<"platform" | "media" | "caption" | "time"> }
> {
  const postingAccounts = input.accounts.filter((account) => isPlatformId(account.platform));
  const connectedPlatforms = [...new Set(postingAccounts.map((account) => account.platform))];
  const excluded_by_validation: ExcludedPlatform[] = [];
  const excluded_platforms: string[] = [];
  const warnings: string[] = [];
  const resolvedActions: ResolvedCreateAction[] = [];
  const missing = new Set<"platform" | "media" | "caption" | "time">();

  if (input.actions.length === 0) {
    return { ok: false, error: input.locale === "ro" ? "Nu am ce posta." : "There is nothing to post.", missing: ["platform"] };
  }

  for (const action of input.actions) {
    const selection = resolvePlatformSelection({
      requested: action.platforms ?? [],
      excluded: action.excluded_platforms ?? [],
      connectedPlatforms,
    });
    excluded_platforms.push(...selection.excludedIds);

    if (selection.unknown.length > 0) {
      warnings.push(
        input.locale === "ro"
          ? `Nu recunosc: ${selection.unknown.join(", ")}.`
          : `Unrecognized platforms: ${selection.unknown.join(", ")}.`,
      );
    }

    if (!selection.wantsAll && selection.platforms.length === 0) {
      missing.add("platform");
      return {
        ok: false,
        error:
          input.locale === "ro"
            ? "Pe ce platformă vrei să postez? Spune Instagram, TikTok sau „toate rețelele”."
            : "Which platform should I post to? Say Instagram, TikTok, or “all networks”.",
        missing: ["platform"],
      };
    }

    if (selection.wantsAll && connectedPlatforms.length === 0) {
      return {
        ok: false,
        error:
          input.locale === "ro"
            ? "Nu ai niciun cont de postare conectat. Le conectezi din Conturi → Postări."
            : "You have no posting accounts connected. Connect them from Accounts → Posts.",
      };
    }

    const media = action.media_refs
      ? input.media.filter((item) => action.media_refs?.includes(item.id))
      : input.media;

    let caption = action.caption?.trim() ?? "";
    let caption_source: CaptionSource = action.caption_source ?? "user_provided";
    const keepCaption = input.keepToolCaption ?? userRequestedCaption(input.fallbackBrief ?? "");
    if (!keepCaption) {
      caption = "";
      caption_source = "user_provided";
    }
    if (!caption && caption_source === "ai_generated") {
      const tightest =
        selection.platforms
          .map((platform) => getPlatformCapability(platform)?.maxCaptionChars ?? 2200)
          .sort((a, b) => a - b)[0] ?? 2200;
      caption = await generateCaption({
        apiKey: input.apiKey,
        brief: input.fallbackBrief || caption,
        locale: input.locale,
        brandName: input.brandName,
        brandVoice: input.brandVoice,
        maxChars: tightest,
      });
    }

    let scheduledUtc: Date | null = null;
    const useResearchTime = wantsBestTime(action) && !hasClockTime(action.scheduled_at_iso);
    const namedDay =
      parseDateOnly(action.scheduled_on) ?? parseDateOnly(action.scheduled_at_iso);
    if (action.mode === "schedule" && !useResearchTime) {
      if (!action.scheduled_at_iso || !hasClockTime(action.scheduled_at_iso)) {
        missing.add("time");
        return {
          ok: false,
          error:
            input.locale === "ro"
              ? "La ce oră să programez postarea? Poți spune o oră sau „cea mai bună oră”."
              : "What time should I schedule the post? You can name a clock time or say “best time”.",
          missing: ["time"],
        };
      }
      scheduledUtc = parseScheduledAt(action.scheduled_at_iso, input.timezone);
      if (!scheduledUtc) {
        return {
          ok: false,
          error:
            input.locale === "ro"
              ? "Nu am putut citi data. Folosește o oră clară, de exemplu mâine la 18:00."
              : "I could not read that date. Use a clear time, for example tomorrow at 18:00.",
          missing: ["time"],
        };
      }
      if (!isFutureDate(scheduledUtc)) {
        return {
          ok: false,
          error:
            input.locale === "ro"
              ? "Ora e în trecut. Alege un moment viitor."
              : "That time is in the past. Choose a future time.",
        };
      }
    }

    const platforms: ResolvedPlatform[] = [];
    for (const platform of selection.platforms) {
      const account = accountForPlatform(postingAccounts, platform);
      const capability = getPlatformCapability(platform);
      if (!account) {
        excluded_by_validation.push({
          platform,
          reason:
            input.locale === "ro"
              ? `${platformLabel(platform)} nu e conectat.`
              : `${platformLabel(platform)} is not connected.`,
        });
        continue;
      }
      const requestedType = contentTypeForPlatform({
        platform,
        contentType: action.content_type,
        contentTypes: action.content_types,
      });
      const reason = validationReason({
        platform,
        capability,
        media,
        contentType: requestedType,
        locale: input.locale,
      });
      if (reason) {
        if (capability?.requiresMedia && media.length === 0) missing.add("media");
        excluded_by_validation.push({ platform, reason });
        continue;
      }
      const limited = truncateCaption(caption, capability?.maxCaptionChars);
      if (limited.truncated) {
        warnings.push(
          input.locale === "ro"
            ? `Textul pentru ${platformLabel(platform)} a fost scurtat la ${capability?.maxCaptionChars} caractere.`
            : `The ${platformLabel(platform)} caption was shortened to ${capability?.maxCaptionChars} characters.`,
        );
      }
      const adapted = adaptContentType({
        platform,
        requested: requestedType,
        mediaKind: inferMediaKind(media),
      });
      platforms.push({
        platform,
        accountId: account.id,
        zernioAccountId: account.zernio_account_id,
        handle: handleOf(account),
        caption: limited.caption,
        captionTruncated: limited.truncated,
        contentType: adapted.contentType,
        requestId: crypto.randomUUID(),
      });
    }

    if (platforms.length === 0 && missing.has("media")) {
      return {
        ok: false,
        error:
          input.locale === "ro"
            ? "Atașează fișierul (foto sau video) ca să pot posta acolo."
            : "Attach the file (photo or video) so I can post there.",
        missing: ["media"],
      };
    }

    if (platforms.length === 0) {
      continue;
    }

    if (action.mode === "schedule" && useResearchTime) {
      const grouped = new Map<string, { utc: Date; platforms: ResolvedPlatform[] }>();
      for (const platform of platforms) {
        const utc = nextBestTime({
          platform: platform.platform,
          contentType: platform.contentType,
          timeZone: input.timezone,
          now: input.now,
          onOrAfterYmd: namedDay,
        });
        if (!utc) {
          excluded_by_validation.push({
            platform: platform.platform,
            reason:
              input.locale === "ro"
                ? "Nu am găsit o fereastră de vârf în următoarele zile."
                : "I could not find a peak window in the coming days.",
          });
          continue;
        }
        const key = utc.toISOString();
        const group = grouped.get(key);
        if (group) group.platforms.push(platform);
        else grouped.set(key, { utc, platforms: [platform] });
      }
      if (grouped.size === 0) continue;
      if (!warnings.includes(bestTimeResearchWarning(input.locale))) {
        warnings.push(bestTimeResearchWarning(input.locale));
      }
      if (namedDay) {
        const drifted = [...grouped.values()].some(
          (group) => localIsoInZone(group.utc, input.timezone).slice(0, 10) !== namedDay,
        );
        if (drifted) {
          warnings.push(
            input.locale === "ro"
              ? "Fereastra de vârf din ziua cerută a trecut, am luat următoarea."
              : "The peak window on that day has passed, so I took the next one.",
          );
        }
      }
      for (const group of grouped.values()) {
        resolvedActions.push(
          scheduledAction({
            mode: action.mode,
            scheduledUtc: group.utc,
            timezone: input.timezone,
            locale: input.locale,
            scheduleSource: "best_time_research",
            platforms: group.platforms,
            media,
            caption_source,
          }),
        );
      }
      continue;
    }

    resolvedActions.push(
      scheduledAction({
        mode: action.mode,
        scheduledUtc,
        timezone: input.timezone,
        locale: input.locale,
        scheduleSource: action.mode === "schedule" ? "user" : undefined,
        platforms,
        media,
        caption_source,
      }),
    );
  }

  if (resolvedActions.length === 0) {
    const reasons = excluded_by_validation.map((item) => `${platformLabel(item.platform)}: ${item.reason}`).join("\n");
    return {
      ok: false,
      error:
        reasons ||
        (input.locale === "ro"
          ? "Nicio platformă validă pentru această postare."
          : "No valid platform remains for this post."),
    };
  }

  return {
    ok: true,
    resolved: {
      kind: "create",
      timezone: input.timezone,
      locale: input.locale,
      actions: resolvedActions,
      excluded_by_validation,
      excluded_platforms: [...new Set(excluded_platforms)],
      warnings,
    },
  };
}

function scheduledAction(input: {
  mode: ResolvedCreateAction["mode"];
  scheduledUtc: Date | null;
  timezone: string;
  locale: string;
  scheduleSource?: ScheduleSource;
  platforms: ResolvedPlatform[];
  media: ChatMedia[];
  caption_source: CaptionSource;
}): ResolvedCreateAction {
  return {
    mode: input.mode,
    scheduled_at_iso: input.scheduledUtc ? localIsoInZone(input.scheduledUtc, input.timezone) : null,
    scheduled_at_utc: input.scheduledUtc?.toISOString() ?? null,
    scheduled_label: input.scheduledUtc
      ? formatInZone(input.scheduledUtc, input.timezone, input.locale)
      : input.locale === "ro"
        ? "Acum"
        : "Now",
    schedule_source: input.scheduleSource,
    platforms: input.platforms,
    media: input.media,
    caption_source: input.caption_source,
  };
}
