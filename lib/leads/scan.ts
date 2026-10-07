import { agentCopy } from "@/lib/leads/copy";
import { localeFromLeadText } from "@/lib/leads/locale";
import { nextAgentReply } from "@/lib/leads/qualify";
import { inboxMessageTime, isAfterListenFrom, isInboundLeadMessage, isNewLeadInbound } from "@/lib/leads/scan-rules";
import { syncAdLeads } from "@/lib/leads/ads";
import type { AgentKnowledge } from "@/lib/leads/knowledge";
import {
  findLeadThread,
  findThreadByConversation,
  insertQualifiedLead,
  listEnabledLeadAgents,
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

function messageText(row: { message?: string; text?: string }) {
  return String(row.message || row.text || "").trim();
}

function messageKey(row: { id?: string; createdTime?: string; createdAt?: string; sentAt?: string; message?: string; text?: string }) {
  return String(row.id || `${inboxMessageTime(row) || ""}:${messageText(row)}`).trim();
}

async function listAccountConversations(profileId: string, accountId: string) {
  const inbox = await listConversations({
    profileId,
    accountId,
    folder: "inbox",
    limit: 20,
  });
  const requests = await listConversations({
    profileId,
    accountId,
    folder: "requests",
    limit: 20,
  }).catch(() => ({ data: [] as ZernioConversation[] }));
  const byId = new Map<string, ZernioConversation>();
  for (const row of [...(inbox.data ?? []), ...(requests.data ?? [])]) {
    if (row.id) byId.set(row.id, row);
  }
  return [...byId.values()];
}

export async function scanLeadsForAccount(zernioAccountId: string): Promise<LeadScanStats> {
  const supabase = createAdminSupabase();
  const { data } = await supabase
    .from("social_accounts")
    .select("user_id")
    .eq("zernio_account_id", zernioAccountId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  const userId = typeof data?.user_id === "string" ? data.user_id : "";
  if (!userId) {
    return { scanned: 0, replied: 0, invited: 0, qualified: 0, adsImported: 0, errors: 0 };
  }
  return scanLeadsInbox(userId);
}

export async function scanLeadsInbox(onlyUserId?: string): Promise<LeadScanStats> {
  const supabase = createAdminSupabase();
  const stats: LeadScanStats = {
    scanned: 0,
    replied: 0,
    invited: 0,
    qualified: 0,
    adsImported: 0,
    errors: 0,
  };

  const enabledAgents = await listEnabledLeadAgents(supabase, onlyUserId);
  if (enabledAgents.length === 0) {
    const ads = await syncAdLeads();
    stats.adsImported = ads.imported;
    return stats;
  }
  const enabledKeys = new Set(
    enabledAgents.map((row) => `${row.user_id}:${row.client_id ?? ""}`),
  );
  const knowledgeByKey = new Map(
    enabledAgents.map((row) => [`${row.user_id}:${row.client_id ?? ""}`, row.knowledge]),
  );

  const { data: accountRows } = await supabase
    .from("social_accounts")
    .select("user_id, client_id, platform, zernio_account_id")
    .eq("is_active", true)
    .not("zernio_account_id", "is", null)
    .limit(80);

  const accounts = ((accountRows ?? []) as ScanAccount[]).filter(
    (row) => row.zernio_account_id && enabledKeys.has(`${row.user_id}:${row.client_id ?? ""}`),
  );
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
    for (const account of owned) {
      const clientId = account.client_id ?? null;
      let phrases: string[] = [];
      let playbook: LeadPlaybook;
      const knowledge = knowledgeByKey.get(`${userId}:${clientId ?? ""}`) ?? {};
      try {
        phrases = await loadLeadPhrases(supabase, userId, clientId);
        playbook = await loadLeadPlaybook(supabase, userId, clientId);
      } catch {
        stats.errors += 1;
        continue;
      }

      try {
        const conversations = await listAccountConversations(profile.profileId, account.zernio_account_id);
        for (const conversation of conversations) {
          stats.scanned += 1;
          try {
            const result = await handleConversation({
              supabase,
              userId,
              clientId,
              accountId: account.zernio_account_id,
              platform: account.platform,
              conversation,
              phrases,
              playbook,
              knowledge,
            });
            stats.replied += result.replied;
            stats.qualified += result.qualified;
          } catch {
            stats.errors += 1;
          }
        }
      } catch {
        stats.errors += 1;
      }

      try {
        const posts = await listInboxComments({
          profileId: profile.profileId,
          accountId: account.zernio_account_id,
          since: knowledge.listenFrom ?? undefined,
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
              createdTime: inboxMessageTime(comment),
              listenFrom: knowledge.listenFrom,
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
  knowledge?: AgentKnowledge;
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

  const listenFrom = input.knowledge?.listenFrom ?? null;
  const messagesBody = await listConversationMessages(conversationId, input.accountId).catch(() => null);
  const messages = [...(messagesBody?.messages ?? messagesBody?.data ?? [])].sort((a, b) =>
    String(inboxMessageTime(a) ?? "").localeCompare(String(inboxMessageTime(b) ?? "")),
  );
  const inbound = messages.filter((row) => {
    const createdTime = inboxMessageTime(row);
    return isInboundLeadMessage(row) && messageText(row) && isAfterListenFrom(createdTime, listenFrom);
  });
  const latest = inbound[inbound.length - 1];
  if (!latest) return result;

  const latestText = messageText(latest);
  const latestTime = inboxMessageTime(latest);
  if (!existing && !isNewLeadInbound(latestText, input.phrases, latestTime, listenFrom)) {
    return result;
  }

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
      triggerText: latestText,
      stage: "invited",
    }));

  if (thread.stage === "qualified" || thread.stage === "dismissed") return result;

  const seenIndex = inbound.findIndex((item) => messageKey(item) === thread.last_external_id);
  const lastUser = [...thread.transcript].reverse().find((item) => item.role === "user")?.text;
  const textIndex = lastUser ? inbound.findIndex((item) => messageText(item) === lastUser) : -1;
  const unseen = existing
    ? seenIndex >= 0
      ? inbound.slice(seenIndex + 1)
      : textIndex >= 0
        ? inbound.slice(textIndex + 1)
        : inbound.filter((item) => !thread.transcript.some((entry) => entry.role === "user" && entry.text === messageText(item)))
    : [latest];

  const toProcess = unseen;
  if (toProcess.length === 0) return result;

  let lastReply: string | null = null;
  for (const row of toProcess) {
    const next = await nextAgentReply({
      thread,
      inbound: messageText(row),
      playbook: input.playbook,
      knowledge: input.knowledge,
    });
    thread = next.thread;
    thread.last_external_id = messageKey(row);
    if (next.reply) lastReply = next.reply;
    if (next.thread.stage === "qualified") result.qualified += 1;
    if (next.thread.stage === "dismissed") break;
  }

  if (lastReply) {
    await sendConversationMessage(conversationId, input.accountId, lastReply, {
      platform: input.conversation.platform || input.platform,
      lastInboundAt: latestTime,
    });
    result.replied += 1;
  }
  await saveLeadThread(input.supabase, thread);
  if (thread.stage === "qualified") {
    await insertQualifiedLead({ supabase: input.supabase, thread });
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
  createdTime?: string;
  listenFrom?: string | null;
  phrases: string[];
}) {
  const text = input.text.trim();
  const externalId = input.commentId || `${input.postId}:${text.slice(0, 40)}`;
  if (!isNewLeadInbound(text, input.phrases, input.createdTime, input.listenFrom)) return 0;

  const existing = await findLeadThread({
    supabase: input.supabase,
    userId: input.userId,
    source: "comment",
    accountId: input.accountId,
    externalId,
  });
  if (existing) return 0;

  const locale = localeFromLeadText(text);
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
