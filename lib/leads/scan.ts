import { agentCopy } from "@/lib/leads/copy";
import { nextAgentReply } from "@/lib/leads/qualify";
import { looksLikePraiseOnly, textMatchesPhrases } from "@/lib/leads/triggers";
import { syncAdLeads } from "@/lib/leads/ads";
import {
  ensureLeadDefaults,
  findLeadThread,
  findThreadByConversation,
  insertQualifiedLead,
  loadLeadPhrases,
  loadLeadPlaybook,
  saveLeadThread,
  upsertLeadThread,
} from "@/lib/leads/store";
import type { LeadPlaybook } from "@/lib/leads/playbook";
import type { LeadThread } from "@/lib/leads/types";
import { createAdminSupabase } from "@/lib/supabase/admin";
import {
  getInboxPostComments,
  listConversationMessages,
  listConversations,
  listInboxComments,
  replyToComment,
  sendConversationMessage,
  type ZernioConversation,
} from "@/lib/zernio";

type ScanAccount = {
  user_id: string;
  client_id: string | null;
  platform: string;
  zernio_account_id: string;
};

export type LeadScanStats = {
  scanned: number;
  replied: number;
  invited: number;
  qualified: number;
  adsImported: number;
  errors: number;
};

function inboundDirection(direction?: string | null) {
  const value = (direction || "").toLowerCase();
  if (!value) return true;
  if (/(out|send|agent|page|business)/.test(value)) return false;
  return /(in|receiv|user|customer|from)/.test(value) || true;
}

function messageText(row: { message?: string; text?: string }) {
  return String(row.message || row.text || "").trim();
}

function messageKey(row: { id?: string; createdTime?: string; message?: string; text?: string }) {
  return String(row.id || `${row.createdTime || ""}:${messageText(row)}`).trim();
}

async function applyReply(input: {
  supabase: ReturnType<typeof createAdminSupabase>;
  thread: LeadThread;
  inbound: string;
  playbook: LeadPlaybook;
  lastExternalId?: string | null;
}) {
  const next = nextAgentReply({
    thread: input.thread,
    inbound: input.inbound,
    playbook: input.playbook,
  });
  if (input.lastExternalId) next.thread.last_external_id = input.lastExternalId;
  await saveLeadThread(input.supabase, next.thread);
  if (next.thread.stage === "qualified") {
    await insertQualifiedLead({ supabase: input.supabase, thread: next.thread });
  }
  return next;
}

export async function scanLeadsInbox(): Promise<LeadScanStats> {
  const supabase = createAdminSupabase();
  const stats: LeadScanStats = {
    scanned: 0,
    replied: 0,
    invited: 0,
    qualified: 0,
    adsImported: 0,
    errors: 0,
  };

  const { data: accountRows } = await supabase
    .from("social_accounts")
    .select("user_id, client_id, platform, zernio_account_id")
    .eq("is_active", true)
    .not("zernio_account_id", "is", null)
    .limit(80);

  const accounts = ((accountRows ?? []) as ScanAccount[]).filter((row) => row.zernio_account_id);
  const userIds = [...new Set(accounts.map((row) => row.user_id))].slice(0, 20);
  if (userIds.length === 0) {
    const ads = await syncAdLeads();
    stats.adsImported = ads.imported;
    return stats;
  }

  const { data: profiles } = await supabase.from("profiles").select("id, zernio_profile_id, brand_name").in("id", userIds);
  const profileById = new Map(
    (profiles ?? []).map((row) => [
      row.id as string,
      {
        profileId: typeof row.zernio_profile_id === "string" ? row.zernio_profile_id : null,
        brandName: typeof row.brand_name === "string" ? row.brand_name : null,
      },
    ]),
  );

  for (const userId of userIds) {
    const profile = profileById.get(userId);
    if (!profile?.profileId) continue;
    const owned = accounts.filter((row) => row.user_id === userId);
    const clientIds = [...new Set(owned.map((row) => row.client_id ?? null))];

    for (const clientId of clientIds) {
      try {
        await ensureLeadDefaults({
          supabase,
          userId,
          clientId,
          brandName: profile.brandName,
        });
      } catch {
        stats.errors += 1;
      }
    }

    for (const account of owned) {
      const clientId = account.client_id ?? null;
      let phrases: string[] = [];
      let playbook: LeadPlaybook;
      try {
        phrases = await loadLeadPhrases(supabase, userId, clientId);
        playbook = await loadLeadPlaybook(supabase, userId, clientId);
      } catch {
        stats.errors += 1;
        continue;
      }

      try {
        const conversations = await listConversations({
          profileId: profile.profileId,
          accountId: account.zernio_account_id,
          limit: 20,
        });
        for (const conversation of conversations.data ?? []) {
          stats.scanned += 1;
          const result = await handleConversation({
            supabase,
            userId,
            clientId,
            accountId: account.zernio_account_id,
            platform: account.platform,
            conversation,
            phrases,
            playbook,
          });
          stats.replied += result.replied;
          stats.qualified += result.qualified;
        }
      } catch {
        stats.errors += 1;
      }

      try {
        const posts = await listInboxComments({
          profileId: profile.profileId,
          accountId: account.zernio_account_id,
          limit: 15,
        });
        for (const post of posts.data ?? []) {
          if (!post.id) continue;
          const thread = await getInboxPostComments(post.id, account.zernio_account_id, 12).catch(() => null);
          for (const comment of thread?.comments ?? []) {
            stats.scanned += 1;
            const invited = await handleComment({
              supabase,
              userId,
              clientId,
              accountId: account.zernio_account_id,
              platform: account.platform,
              postId: post.id,
              postContext: post.content ?? null,
              commentId: comment.id,
              authorName: comment.from?.name ?? comment.from?.username ?? null,
              authorHandle: comment.from?.username ?? null,
              text: comment.message ?? "",
              phrases,
            });
            stats.invited += invited;
          }
        }
      } catch {
        stats.errors += 1;
      }
    }
  }

  const ads = await syncAdLeads();
  stats.adsImported = ads.imported;
  return stats;
}

async function handleConversation(input: {
  supabase: ReturnType<typeof createAdminSupabase>;
  userId: string;
  clientId: string | null;
  accountId: string;
  platform: string;
  conversation: ZernioConversation;
  phrases: string[];
  playbook: LeadPlaybook;
}) {
  const result = { replied: 0, qualified: 0 };
  const conversationId = input.conversation.id;
  if (!conversationId) return result;

  const existing = await findThreadByConversation({
    supabase: input.supabase,
    userId: input.userId,
    accountId: input.accountId,
    conversationId,
  });

  const lastMessage = String(input.conversation.lastMessage || "").trim();
  const interested = Boolean(lastMessage) && textMatchesPhrases(lastMessage, input.phrases) && !looksLikePraiseOnly(lastMessage);

  if (!existing && !interested) return result;

  let thread =
    existing ??
    (await upsertLeadThread({
      supabase: input.supabase,
      userId: input.userId,
      clientId: input.clientId,
      source: "message",
      platform: input.conversation.platform || input.platform,
      accountId: input.accountId,
      externalId: conversationId,
      conversationId,
      authorName: input.conversation.participantName ?? null,
      triggerText: lastMessage,
      stage: "invited",
    }));

  if (thread.stage === "qualified" || thread.stage === "dismissed") return result;

  const messagesBody = await listConversationMessages(conversationId, input.accountId).catch(() => null);
  const messages = [...(messagesBody?.messages ?? messagesBody?.data ?? [])].sort((a, b) =>
    String(a.createdTime ?? "").localeCompare(String(b.createdTime ?? "")),
  );

  const inbound = messages.filter((row) => inboundDirection(row.direction) && messageText(row));
  const seenIndex = inbound.findIndex((item) => messageKey(item) === thread.last_external_id);
  const lastUser = [...thread.transcript].reverse().find((item) => item.role === "user")?.text;
  const textIndex = lastUser ? inbound.findIndex((item) => messageText(item) === lastUser) : -1;
  const unseen =
    seenIndex >= 0
      ? inbound.slice(seenIndex + 1)
      : textIndex >= 0
        ? inbound.slice(textIndex + 1)
        : thread.last_external_id
          ? inbound.filter((item) => !thread.transcript.some((entry) => entry.role === "user" && entry.text === messageText(item)))
          : inbound;

  const toProcess =
    unseen.length > 0
      ? unseen
      : interested && thread.stage === "invited"
        ? [{ id: conversationId, message: lastMessage, direction: "inbound" }]
        : [];

  let lastReply: string | null = null;
  for (const row of toProcess) {
    const text = messageText(row);
    const next = await applyReply({
      supabase: input.supabase,
      thread,
      inbound: text,
      playbook: input.playbook,
      lastExternalId: messageKey(row),
    });
    thread = next.thread;
    if (next.reply) lastReply = next.reply;
    if (next.thread.stage === "qualified") result.qualified += 1;
    if (next.thread.stage === "dismissed") break;
  }

  if (lastReply) {
    await sendConversationMessage(conversationId, input.accountId, lastReply);
    result.replied += 1;
  }
  return result;
}

async function handleComment(input: {
  supabase: ReturnType<typeof createAdminSupabase>;
  userId: string;
  clientId: string | null;
  accountId: string;
  platform: string;
  postId: string;
  postContext: string | null;
  commentId?: string;
  authorName: string | null;
  authorHandle: string | null;
  text: string;
  phrases: string[];
}) {
  const text = input.text.trim();
  const externalId = input.commentId || `${input.postId}:${text.slice(0, 40)}`;
  if (!text || looksLikePraiseOnly(text) || !textMatchesPhrases(text, input.phrases)) return 0;

  const existing = await findLeadThread({
    supabase: input.supabase,
    userId: input.userId,
    source: "comment",
    accountId: input.accountId,
    externalId,
  });
  if (existing) return 0;

  const locale = /[ăâîșț]|pret|preț|valabil|vreau|cât/i.test(text) ? "ro" : "ro";
  const invite = agentCopy(locale).commentInvite;
  await replyToComment({
    postId: input.postId,
    accountId: input.accountId,
    message: invite,
    commentId: input.commentId,
  });
  await upsertLeadThread({
    supabase: input.supabase,
    userId: input.userId,
    clientId: input.clientId,
    source: "comment",
    platform: input.platform,
    accountId: input.accountId,
    externalId,
    postId: input.postId,
    commentId: input.commentId ?? null,
    authorName: input.authorName,
    authorHandle: input.authorHandle,
    triggerText: text,
    postContext: input.postContext,
    stage: "invited",
    lastExternalId: externalId,
    transcript: [
      { role: "user", text, at: new Date().toISOString() },
      { role: "agent", text: invite, at: new Date().toISOString() },
    ],
  });
  return 1;
}
