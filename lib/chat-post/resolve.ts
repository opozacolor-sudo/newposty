import Anthropic from "@anthropic-ai/sdk";
import { getPlatformCapability } from "@/lib/platform-capabilities";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import {
  adaptContentType,
  inferMediaKind,
  resolvePlatformSelection,
  truncateCaption,
  validationReason,
} from "@/lib/chat-post/rules";
import {
  formatInZone,
  isFutureDate,
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
    const caption_source: CaptionSource = action.caption_source ?? (caption ? "user_provided" : "ai_generated");
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
    if (action.mode === "schedule") {
      if (!action.scheduled_at_iso) {
        missing.add("time");
        return {
          ok: false,
          error:
            input.locale === "ro"
              ? "La ce oră să programez postarea?"
              : "What time should I schedule the post?",
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
      const reason = validationReason({
        platform,
        capability,
        media,
        contentType: action.content_type,
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
        requested: action.content_type,
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

    resolvedActions.push({
      mode: action.mode,
      scheduled_at_iso: action.mode === "schedule" ? localLabelIso(scheduledUtc, input.timezone) : null,
      scheduled_at_utc: scheduledUtc?.toISOString() ?? null,
      scheduled_label: scheduledUtc
        ? formatInZone(scheduledUtc, input.timezone, input.locale)
        : input.locale === "ro"
          ? "Acum"
          : "Now",
      platforms,
      media,
      caption_source,
    });
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

function localLabelIso(date: Date | null, timeZone: string) {
  if (!date) return null;
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
