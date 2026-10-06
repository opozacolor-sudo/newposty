import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_LEAD_PHRASES } from "@/lib/leads/triggers";
import type { LeadPlaybook } from "@/lib/leads/playbook";
import { publicAgentBrand, type AgentKnowledge, type LeadAgent } from "@/lib/leads/knowledge";
import type { LeadAnswers, LeadRow, LeadSource, LeadStage, LeadStatus, LeadThread, LeadTranscriptItem } from "@/lib/leads/types";

function clientFilter(query: any, clientId: string | null) {
  return clientId ? query.eq("client_id", clientId) : query.is("client_id", null);
}

export async function ensureLeadDefaults(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  brandName?: string | null;
}) {
  let phrasesQuery = input.supabase.from("lead_triggers").select("phrase").eq("user_id", input.userId);
  phrasesQuery = clientFilter(phrasesQuery, input.clientId);
  const { data: existing } = await phrasesQuery;
  if (!existing || existing.length === 0) {
    await input.supabase.from("lead_triggers").insert(
      DEFAULT_LEAD_PHRASES.map((phrase) => ({
        user_id: input.userId,
        client_id: input.clientId,
        phrase,
      })),
    );
  }

  let playbookQuery = input.supabase.from("lead_playbooks").select("*").eq("user_id", input.userId).eq("kind", "auto_credit");
  playbookQuery = clientFilter(playbookQuery, input.clientId);
  const { data: playbooks } = await playbookQuery.limit(1);
  if (!playbooks || playbooks.length === 0) {
    await input.supabase.from("lead_playbooks").insert({
      user_id: input.userId,
      client_id: input.clientId,
      kind: "auto_credit",
      product_name: input.brandName || null,
    });
  }
}

export async function loadLeadPhrases(supabase: SupabaseClient, userId: string, clientId: string | null) {
  let query = supabase.from("lead_triggers").select("phrase").eq("user_id", userId);
  query = clientFilter(query, clientId);
  const { data } = await query;
  const phrases = (data ?? []).map((row) => String(row.phrase)).filter(Boolean);
  return phrases.length > 0 ? phrases : DEFAULT_LEAD_PHRASES;
}

export async function loadLeadPlaybook(
  supabase: SupabaseClient,
  userId: string,
  clientId: string | null,
): Promise<LeadPlaybook> {
  let query = supabase.from("lead_playbooks").select("*").eq("user_id", userId).eq("kind", "auto_credit");
  query = clientFilter(query, clientId);
  const { data } = await query.limit(1);
  const row = data?.[0];
  return {
    kind: "auto_credit",
    product_name: row?.product_name ?? null,
    product_price: row?.product_price != null ? Number(row.product_price) : null,
    debt_ratio: row?.debt_ratio != null ? Number(row.debt_ratio) : 0.4,
    months: row?.months != null ? Number(row.months) : 60,
    cash_factor: row?.cash_factor != null ? Number(row.cash_factor) : 0.6,
  };
}

export async function findLeadThread(input: {
  supabase: SupabaseClient;
  userId: string;
  source: LeadSource;
  accountId: string;
  externalId: string;
}) {
  const { data } = await input.supabase
    .from("lead_threads")
    .select("*")
    .eq("user_id", input.userId)
    .eq("source", input.source)
    .eq("account_id", input.accountId)
    .eq("external_id", input.externalId)
    .maybeSingle();
  return (data as LeadThread | null) ?? null;
}

export async function findThreadByConversation(input: {
  supabase: SupabaseClient;
  userId: string;
  accountId: string;
  conversationId: string;
}) {
  const { data } = await input.supabase
    .from("lead_threads")
    .select("*")
    .eq("user_id", input.userId)
    .eq("account_id", input.accountId)
    .eq("conversation_id", input.conversationId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as LeadThread | null) ?? null;
}

export async function upsertLeadThread(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  source: LeadSource;
  platform?: string | null;
  accountId: string;
  externalId: string;
  conversationId?: string | null;
  postId?: string | null;
  commentId?: string | null;
  authorName?: string | null;
  authorHandle?: string | null;
  triggerText?: string | null;
  postContext?: string | null;
  stage: LeadStage;
  answers?: LeadAnswers;
  transcript?: LeadTranscriptItem[];
  lastExternalId?: string | null;
}) {
  const { data, error } = await input.supabase
    .from("lead_threads")
    .upsert(
      {
        user_id: input.userId,
        client_id: input.clientId,
        source: input.source,
        platform: input.platform ?? null,
        account_id: input.accountId,
        external_id: input.externalId,
        conversation_id: input.conversationId ?? null,
        post_id: input.postId ?? null,
        comment_id: input.commentId ?? null,
        author_name: input.authorName ?? null,
        author_handle: input.authorHandle ?? null,
        trigger_text: input.triggerText ?? null,
        post_context: input.postContext ?? null,
        stage: input.stage,
        answers: input.answers ?? {},
        transcript: input.transcript ?? [],
        last_external_id: input.lastExternalId ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,source,account_id,external_id" },
    )
    .select("*")
    .single();
  if (error) throw error;
  return data as LeadThread;
}

export async function saveLeadThread(supabase: SupabaseClient, thread: LeadThread) {
  const { error } = await supabase
    .from("lead_threads")
    .update({
      stage: thread.stage,
      answers: thread.answers,
      transcript: thread.transcript,
      last_external_id: thread.last_external_id,
      conversation_id: thread.conversation_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", thread.id);
  if (error) throw error;
}

export async function insertQualifiedLead(input: {
  supabase: SupabaseClient;
  thread: LeadThread;
}) {
  const { data: existing } = await input.supabase
    .from("leads")
    .select("id")
    .eq("thread_id", input.thread.id)
    .maybeSingle();
  if (existing) return existing.id as string;
  const { data, error } = await input.supabase
    .from("leads")
    .insert({
      user_id: input.thread.user_id,
      client_id: input.thread.client_id,
      thread_id: input.thread.id,
      source: input.thread.source,
      platform: input.thread.platform,
      account_id: input.thread.account_id,
      full_name: input.thread.answers.fullName ?? null,
      phone: input.thread.answers.phone ?? null,
      email: input.thread.answers.email ?? null,
      trigger_text: input.thread.trigger_text,
      transcript: input.thread.transcript,
      qualification: input.thread.answers,
      status: "new",
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function listLeads(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  source?: string;
  status?: string;
}) {
  let query = input.supabase.from("leads").select("*").eq("user_id", input.userId).order("created_at", { ascending: false }).limit(80);
  query = clientFilter(query, input.clientId);
  if (input.source) query = query.eq("source", input.source);
  if (input.status) query = query.eq("status", input.status);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as LeadRow[];
}

export async function updateLeadStatus(input: {
  supabase: SupabaseClient;
  userId: string;
  leadId: string;
  status: LeadStatus;
}) {
  const { error } = await input.supabase
    .from("leads")
    .update({ status: input.status, updated_at: new Date().toISOString() })
    .eq("id", input.leadId)
    .eq("user_id", input.userId);
  if (error) throw error;
}

export async function loadInterestKeys(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
}) {
  let query = input.supabase
    .from("lead_threads")
    .select("source, external_id, conversation_id, comment_id, post_id")
    .eq("user_id", input.userId);
  query = clientFilter(query, input.clientId);
  const { data } = await query.limit(200);
  const keys = new Set<string>();
  for (const row of data ?? []) {
    if (row.conversation_id) keys.add(`message:${row.conversation_id}`);
    if (row.comment_id) keys.add(`comment:${row.comment_id}`);
    if (row.post_id) keys.add(`post:${row.post_id}`);
    if (row.external_id) keys.add(`${row.source}:${row.external_id}`);
  }
  return keys;
}

export async function listOpenLeadThreads(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("lead_threads")
    .select("*")
    .eq("user_id", userId)
    .in("stage", ["await_consent", "helping", "ask_method", "ask_income", "ask_contact"])
    .limit(40);
  return (data ?? []) as LeadThread[];
}

export async function insertAdLead(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  platform?: string | null;
  accountId?: string | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  triggerText?: string | null;
  qualification?: LeadAnswers;
}) {
  const { error } = await input.supabase.from("leads").insert({
    user_id: input.userId,
    client_id: input.clientId,
    source: "ad",
    platform: input.platform ?? null,
    account_id: input.accountId ?? null,
    full_name: input.fullName ?? null,
    phone: input.phone ?? null,
    email: input.email ?? null,
    trigger_text: input.triggerText ?? "Lead form reclamă",
    transcript: [],
    qualification: input.qualification ?? {},
    status: "new",
  });
  if (error) throw error;
}

export async function loadLeadAgent(
  supabase: SupabaseClient,
  userId: string,
  clientId: string | null,
): Promise<LeadAgent | null> {
  let query = supabase.from("lead_agents").select("*").eq("user_id", userId);
  query = clientFilter(query, clientId);
  const { data } = await query.limit(1);
  const row = data?.[0];
  if (!row) return null;
  return {
    id: row.id,
    user_id: row.user_id,
    client_id: row.client_id ?? null,
    site_url: row.site_url ?? null,
    knowledge: (row.knowledge ?? {}) as AgentKnowledge,
    trained_at: row.trained_at ?? null,
    enabled: Boolean(row.enabled),
    addon_status: row.addon_status ?? "unsubscribed",
  };
}

export async function saveTrainedAgent(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  siteUrl: string;
  knowledge: AgentKnowledge;
}) {
  const existing = await loadLeadAgent(input.supabase, input.userId, input.clientId);
  const knowledge = {
    ...input.knowledge,
    business: publicAgentBrand({ business: input.knowledge.business, siteUrl: input.siteUrl }),
  };
  const payload = {
    site_url: input.siteUrl,
    knowledge,
    trained_at: new Date().toISOString(),
    enabled: false,
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    const merged = {
      ...payload,
      knowledge: {
        ...knowledge,
        instructions: existing.knowledge.instructions ?? knowledge.instructions,
        coach: existing.knowledge.coach ?? knowledge.coach,
        booking: {
          ...knowledge.booking,
          url: existing.knowledge.booking?.url || knowledge.booking?.url || null,
          how: existing.knowledge.booking?.how || knowledge.booking?.how || null,
          available: Boolean(existing.knowledge.booking?.url || knowledge.booking?.url || knowledge.booking?.available),
        },
      },
    };
    const { error } = await input.supabase.from("lead_agents").update(merged).eq("id", existing.id).eq("user_id", input.userId);
    if (error) throw error;
    return loadLeadAgent(input.supabase, input.userId, input.clientId);
  }
  const { error } = await input.supabase.from("lead_agents").insert({
    user_id: input.userId,
    client_id: input.clientId,
    ...payload,
  });
  if (error) throw error;
  return loadLeadAgent(input.supabase, input.userId, input.clientId);
}

export async function setLeadAgentEnabled(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  enabled: boolean;
}) {
  const existing = await loadLeadAgent(input.supabase, input.userId, input.clientId);
  if (!existing?.trained_at) {
    throw new Error("not_trained");
  }
  const { error } = await input.supabase
    .from("lead_agents")
    .update({
      enabled: input.enabled,
      addon_status: input.enabled ? "active" : existing.addon_status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id)
    .eq("user_id", input.userId);
  if (error) throw error;
  return { ...existing, enabled: input.enabled };
}

export async function saveAgentKnowledge(input: {
  supabase: SupabaseClient;
  userId: string;
  clientId: string | null;
  knowledge: AgentKnowledge;
  markTrained?: boolean;
}) {
  const existing = await loadLeadAgent(input.supabase, input.userId, input.clientId);
  const payload = {
    knowledge: input.knowledge,
    trained_at: input.markTrained ? new Date().toISOString() : existing?.trained_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  if (existing) {
    const { error } = await input.supabase.from("lead_agents").update(payload).eq("id", existing.id).eq("user_id", input.userId);
    if (error) throw error;
    return loadLeadAgent(input.supabase, input.userId, input.clientId);
  }
  const { error } = await input.supabase.from("lead_agents").insert({
    user_id: input.userId,
    client_id: input.clientId,
    ...payload,
    enabled: false,
  });
  if (error) throw error;
  return loadLeadAgent(input.supabase, input.userId, input.clientId);
}

export async function listEnabledLeadAgents(supabase: SupabaseClient, userId?: string) {
  let query = supabase
    .from("lead_agents")
    .select("user_id, client_id, knowledge, site_url")
    .eq("enabled", true)
    .not("trained_at", "is", null);
  if (userId) query = query.eq("user_id", userId);
  const { data } = await query.limit(40);
  return (data ?? []) as Array<{
    user_id: string;
    client_id: string | null;
    knowledge: AgentKnowledge;
    site_url: string | null;
  }>;
}

export async function recordLeadClick(input: {
  supabase: SupabaseClient;
  threadId: string;
  url: string;
}) {
  const { data: thread } = await input.supabase.from("lead_threads").select("*").eq("id", input.threadId).maybeSingle();
  if (!thread) return null;
  const answers = { ...(thread.answers ?? {}), clickedUrl: input.url, clickedAt: new Date().toISOString() };
  await input.supabase.from("lead_threads").update({ answers, updated_at: new Date().toISOString() }).eq("id", thread.id);
  const { data: lead } = await input.supabase.from("leads").select("id, qualification").eq("thread_id", thread.id).maybeSingle();
  if (lead) {
    await input.supabase
      .from("leads")
      .update({
        qualification: { ...(lead.qualification ?? {}), clickedUrl: input.url, clickedAt: answers.clickedAt },
        updated_at: new Date().toISOString(),
      })
      .eq("id", lead.id);
  }
  await input.supabase.from("lead_clicks").insert({
    user_id: thread.user_id,
    client_id: thread.client_id,
    thread_id: thread.id,
    lead_id: lead?.id ?? null,
    url: input.url,
  });
  return thread as LeadThread;
}
