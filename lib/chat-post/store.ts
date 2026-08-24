import type { SupabaseClient } from "@supabase/supabase-js";
import { cancelledCopy, localizeCancelledContent } from "@/lib/chat-post/copy";
import { matchScheduledReference } from "@/lib/chat-post/rules";
import { formatInZone, parseScheduledAt } from "@/lib/chat-post/timezone";
import type {
  ChatMedia,
  ManageAction,
  PendingIntent,
  PlatformExecResult,
  ResolvedAction,
} from "@/lib/chat-post/types";

const ACTION_TTL_MS = 30 * 60 * 1000;
const INTENT_TTL_MS = 20 * 60 * 1000;

export async function savePendingAction(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  resolved: Omit<ResolvedAction, "action_id">;
}) {
  const expiresAt = new Date(Date.now() + ACTION_TTL_MS).toISOString();
  const { data, error } = await input.supabase
    .from("chat_post_actions")
    .insert({
      user_id: input.userId,
      conversation_id: input.conversationId,
      kind: input.resolved.kind,
      status: "pending",
      resolved: input.resolved,
      expires_at: expiresAt,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Could not save pending action.");
  return {
    ...input.resolved,
    action_id: data.id as string,
  } satisfies ResolvedAction;
}

export async function loadPendingAction(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
}) {
  const { data } = await input.supabase
    .from("chat_post_actions")
    .select("*")
    .eq("id", input.actionId)
    .eq("user_id", input.userId)
    .maybeSingle();
  return data;
}

export async function claimPendingAction(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
}) {
  const existing = await loadPendingAction(input);
  if (!existing) return { kind: "missing" as const };
  if (existing.status === "executed") {
    return {
      kind: "already" as const,
      resolved: { ...(existing.resolved as object), action_id: existing.id } as ResolvedAction,
      results: (existing.results as PlatformExecResult[]) ?? [],
    };
  }
  if (existing.status === "cancelled") return { kind: "cancelled" as const };
  if (new Date(existing.expires_at as string).getTime() < Date.now() && existing.status === "pending") {
    return { kind: "expired" as const };
  }
  if (existing.status === "executing") {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const polled = await loadPendingAction(input);
      if (polled?.status === "executed") {
        return {
          kind: "already" as const,
          resolved: { ...(polled.resolved as object), action_id: polled.id } as ResolvedAction,
          results: (polled.results as PlatformExecResult[]) ?? [],
        };
      }
    }
    return {
      kind: "already" as const,
      resolved: { ...(existing.resolved as object), action_id: existing.id } as ResolvedAction,
      results: (existing.results as PlatformExecResult[]) ?? [],
    };
  }

  const { data } = await input.supabase
    .from("chat_post_actions")
    .update({ status: "executing" })
    .eq("id", input.actionId)
    .eq("user_id", input.userId)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (!data) {
    const again = await loadPendingAction(input);
    if (again?.status === "executed" || again?.status === "executing") {
      return {
        kind: "already" as const,
        resolved: { ...(again.resolved as object), action_id: again.id } as ResolvedAction,
        results: (again.results as PlatformExecResult[]) ?? [],
      };
    }
    return { kind: "missing" as const };
  }

  return {
    kind: "claimed" as const,
    row: data,
    resolved: { ...(data.resolved as object), action_id: data.id } as ResolvedAction,
  };
}

export async function finishAction(input: {
  supabase: SupabaseClient;
  actionId: string;
  userId: string;
  conversationId: string;
  resolved: ResolvedAction;
  results: PlatformExecResult[];
}) {
  await input.supabase
    .from("chat_post_actions")
    .update({ status: "executed", results: input.results, resolved: input.resolved })
    .eq("id", input.actionId)
    .eq("user_id", input.userId);

  for (let index = 0; index < input.resolved.actions.length; index += 1) {
    const action = input.resolved.actions[index];
    for (const target of action.platforms) {
      const result = input.results.find(
        (item) => item.platform === target.platform && item.handle === target.handle,
      );
      const status =
        input.resolved.kind === "manage" && input.resolved.manage?.action === "cancel"
          ? "cancelled"
          : result?.status === "success"
            ? action.mode === "schedule"
              ? "scheduled"
              : "published"
            : result?.status === "pending"
              ? "publishing"
              : "failed";
      await input.supabase.from("post_actions").insert({
        user_id: input.userId,
        conversation_id: input.conversationId,
        action_id: input.actionId,
        platform: target.platform,
        account_id: target.accountId,
        zernio_post_id: result?.zernio_post_id ?? null,
        status,
        scheduled_at: action.scheduled_at_utc,
        caption: target.caption,
        error_code: result?.error_code ?? null,
        error_message: result?.error_message_human ?? null,
      });
    }
  }

  if (input.resolved.kind === "manage" && input.resolved.manage) {
    const nextStatus = input.resolved.manage.action === "cancel" ? "cancelled" : "scheduled";
    await input.supabase
      .from("post_actions")
      .update({
        status: nextStatus,
        caption:
          input.resolved.manage.action === "edit_caption"
            ? (input.resolved.manage.new_value ?? input.resolved.manage.caption)
            : input.resolved.manage.caption,
        scheduled_at:
          input.resolved.manage.action === "reschedule"
            ? parseScheduledAt(input.resolved.manage.new_value ?? "", input.resolved.timezone)?.toISOString() ??
              input.resolved.manage.scheduled_at_utc
            : input.resolved.manage.scheduled_at_utc,
      })
    .eq("id", input.resolved.manage.postActionId)
    .eq("user_id", input.userId);
  }
}

export async function saveRefreshedResults(input: {
  supabase: SupabaseClient;
  actionId: string;
  userId: string;
  conversationId: string;
  results: PlatformExecResult[];
}) {
  await input.supabase
    .from("chat_post_actions")
    .update({ results: input.results })
    .eq("id", input.actionId)
    .eq("user_id", input.userId);

  for (const result of input.results) {
    if (result.status === "pending" || !result.zernio_post_id) continue;
    await input.supabase
      .from("post_actions")
      .update({
        status: result.status === "success" ? "published" : "failed",
        error_code: result.error_code ?? null,
        error_message: result.error_message_human ?? null,
      })
      .eq("zernio_post_id", result.zernio_post_id)
      .eq("user_id", input.userId);
  }

  const { data: messages } = await input.supabase
    .from("messages")
    .select("id, payload")
    .eq("conversation_id", input.conversationId)
    .eq("kind", "results");

  for (const message of messages ?? []) {
    const payload = message.payload as { type?: string; action_id?: string } | null;
    if (payload?.action_id !== input.actionId) continue;
    await input.supabase
      .from("messages")
      .update({
        payload: {
          ...payload,
          results: input.results,
          allFailed: input.results.length > 0 && input.results.every((item) => item.status === "error"),
        },
      })
      .eq("id", message.id);
  }
}

export async function cancelPendingAction(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
  locale?: string;
}) {
  const existing = await loadPendingAction(input);
  await input.supabase
    .from("chat_post_actions")
    .update({ status: "cancelled" })
    .eq("id", input.actionId)
    .eq("user_id", input.userId)
    .eq("status", "pending");

  const storedLocale =
    existing?.resolved && typeof existing.resolved === "object"
      ? (existing.resolved as { locale?: string }).locale
      : undefined;
  await dismissConfirmationMessages({
    supabase: input.supabase,
    userId: input.userId,
    actionId: input.actionId,
    locale: input.locale ?? storedLocale,
  });
}

async function messagesForAction(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
}) {
  const { data } = await input.supabase
    .from("messages")
    .select("id, kind, payload, conversation_id")
    .eq("user_id", input.userId)
    .in("kind", ["confirmation", "results"]);
  return (data ?? []).filter((message) => {
    const payload = message.payload as { action_id?: string } | null;
    return payload?.action_id === input.actionId;
  });
}

export async function dismissConfirmationMessages(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
  locale?: string;
}) {
  const messages = await messagesForAction(input);
  for (const message of messages) {
    if (message.kind !== "confirmation") continue;
    await input.supabase
      .from("messages")
      .update({
        kind: "text",
        payload: null,
        content: cancelledCopy(input.locale),
      })
      .eq("id", message.id)
      .eq("user_id", input.userId);
  }
}

export async function replaceConfirmationWithResults(input: {
  supabase: SupabaseClient;
  userId: string;
  actionId: string;
  results: PlatformExecResult[];
  excluded_by_validation?: Array<{ platform: string; reason: string }>;
}) {
  const allFailed = input.results.length > 0 && input.results.every((item) => item.status === "error");
  const messages = await messagesForAction(input);
  for (const message of messages) {
    if (message.kind !== "confirmation") continue;
    const payload = message.payload as Record<string, unknown> | null;
    await input.supabase
      .from("messages")
      .update({
        kind: "results",
        payload: {
          type: "results",
          action_id: input.actionId,
          results: input.results,
          allFailed,
          excluded_by_validation: input.excluded_by_validation ?? payload?.excluded_by_validation ?? [],
        },
      })
      .eq("id", message.id)
      .eq("user_id", input.userId);
  }
}

type LoadedChatMessage = {
  role: string;
  content: string;
  kind?: string | null;
  payload?: unknown;
  created_at?: string;
};

export async function hydrateConfirmationMessages(input: {
  supabase: SupabaseClient;
  userId: string;
  messages: LoadedChatMessage[];
  locale?: string;
}): Promise<LoadedChatMessage[]> {
  const confirmations = input.messages.filter((message) => message.kind === "confirmation");
  if (confirmations.length === 0) {
    return input.messages.map((message) => ({
      ...message,
      content: localizeCancelledContent(message.content, input.locale),
    }));
  }

  const actionIds = [
    ...new Set(
      confirmations
        .map((message) => (message.payload as { action_id?: string } | null)?.action_id)
        .filter((value): value is string => Boolean(value)),
    ),
  ];
  if (actionIds.length === 0) {
    return input.messages.map((message) => ({
      ...message,
      content: localizeCancelledContent(message.content, input.locale),
    }));
  }

  const { data: actions } = await input.supabase
    .from("chat_post_actions")
    .select("id, status, results, resolved")
    .eq("user_id", input.userId)
    .in("id", actionIds);
  const byId = new Map((actions ?? []).map((action) => [action.id as string, action]));

  const next = [...input.messages];
  for (let index = 0; index < next.length; index += 1) {
    const message = next[index];
    if (message.kind !== "confirmation") {
      next[index] = {
        ...message,
        content: localizeCancelledContent(message.content, input.locale),
      };
      continue;
    }
    const actionId = (message.payload as { action_id?: string } | null)?.action_id;
    const action = actionId ? byId.get(actionId) : undefined;
    const storedLocale =
      action?.resolved && typeof action.resolved === "object"
        ? (action.resolved as { locale?: string }).locale
        : undefined;
    const locale = input.locale ?? storedLocale;

    if (!action || action.status === "cancelled") {
      const updated = {
        ...message,
        kind: "text",
        payload: null,
        content: cancelledCopy(locale),
      };
      next[index] = updated;
      if (actionId) {
        await dismissConfirmationMessages({
          supabase: input.supabase,
          userId: input.userId,
          actionId,
          locale,
        });
      }
      continue;
    }

    if (action.status === "executed" || action.status === "executing") {
      const results = (action.results as PlatformExecResult[]) ?? [];
      const updated = {
        ...message,
        kind: "results",
        payload: {
          type: "results",
          action_id: action.id,
          results,
          allFailed: results.length > 0 && results.every((item) => item.status === "error"),
        },
      };
      next[index] = updated;
      await replaceConfirmationWithResults({
        supabase: input.supabase,
        userId: input.userId,
        actionId: action.id as string,
        results,
      });
    }
  }
  return next;
}

export async function loadConversationMedia(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  ids?: string[];
}) {
  let query = input.supabase
    .from("conversation_media")
    .select("id, url, type, name")
    .eq("user_id", input.userId);
  if (input.ids && input.ids.length > 0) {
    query = query.in("id", input.ids);
  } else {
    query = query.eq("conversation_id", input.conversationId);
  }
  const { data } = await query;
  return (data ?? []) as ChatMedia[];
}

export async function attachMediaToConversation(input: {
  supabase: SupabaseClient;
  userId: string;
  conversationId: string;
  ids: string[];
}) {
  if (input.ids.length === 0) return;
  await input.supabase
    .from("conversation_media")
    .update({ conversation_id: input.conversationId })
    .eq("user_id", input.userId)
    .in("id", input.ids)
    .is("conversation_id", null);
}

export function pendingIntentValid(intent: PendingIntent | null, at = new Date()) {
  if (!intent?.saved_at) return false;
  return at.getTime() - new Date(intent.saved_at).getTime() < INTENT_TTL_MS;
}

export async function savePendingIntent(input: {
  supabase: SupabaseClient;
  conversationId: string;
  userId: string;
  intent: PendingIntent | null;
}) {
  await input.supabase
    .from("conversations")
    .update({
      pending_intent: input.intent,
      pending_intent_at: input.intent ? new Date().toISOString() : null,
    })
    .eq("id", input.conversationId)
    .eq("user_id", input.userId);
}

export async function findScheduledCandidates(input: {
  supabase: SupabaseClient;
  userId: string;
  reference: string;
}) {
  const { data } = await input.supabase
    .from("post_actions")
    .select("id, platform, caption, scheduled_at, zernio_post_id, account_id, status")
    .eq("user_id", input.userId)
    .eq("status", "scheduled")
    .order("scheduled_at", { ascending: false })
    .limit(20);
  return matchScheduledReference(input.reference, data ?? []);
}

export async function resolveManageAction(input: {
  supabase: SupabaseClient;
  userId: string;
  reference: string;
  action: ManageAction;
  new_value?: string;
  timezone: string;
  locale: string;
}): Promise<
  | { ok: true; resolved: Omit<ResolvedAction, "action_id"> }
  | { ok: false; error: string; choices?: Array<{ id: string; label: string }> }
> {
  const matches = await findScheduledCandidates(input);
  if (matches.length === 0) {
    return {
      ok: false,
      error:
        input.locale === "ro"
          ? "Nu am găsit o postare programată care să se potrivească."
          : "I could not find a matching scheduled post.",
    };
  }
  if (matches.length > 1) {
    return {
      ok: false,
      error:
        input.locale === "ro"
          ? "Am găsit mai multe postări programate. Care dintre ele?"
          : "I found more than one scheduled post. Which one?",
      choices: matches.map((item) => ({
        id: item.id as string,
        label: `${item.platform} · ${(item.caption ?? "").slice(0, 48)} · ${item.scheduled_at ?? ""}`,
      })),
    };
  }
  const item = matches[0];
  if (!item.zernio_post_id) {
    return {
      ok: false,
      error:
        input.locale === "ro"
          ? "Postarea programată nu mai poate fi modificată."
          : "That scheduled post can no longer be changed.",
    };
  }
  const when = item.scheduled_at ? new Date(item.scheduled_at as string) : null;
  return {
    ok: true,
    resolved: {
      kind: "manage",
      timezone: input.timezone,
      locale: input.locale,
      actions: [],
      excluded_by_validation: [],
      excluded_platforms: [],
      warnings: [],
      manage: {
        action: input.action,
        postActionId: item.id as string,
        zernioPostId: item.zernio_post_id as string,
        platform: item.platform as string,
        handle: "",
        caption: (item.caption as string) ?? "",
        scheduled_at_utc: item.scheduled_at as string | null,
        scheduled_label: when ? formatInZone(when, input.timezone, input.locale) : null,
        new_value: input.new_value,
      },
    },
  };
}
