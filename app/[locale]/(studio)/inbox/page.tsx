import { getTranslations } from "next-intl/server";
import { InboxReplyForm } from "@/components/studio/inbox-actions";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { StudioFillCard } from "@/components/studio/studio-surface";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import {
  isOwnInboxMessage,
  loadOwnedCommentThread,
  loadOwnedMessages,
  loadScopedCommentPosts,
  loadScopedConversations,
  loadStudioScopeWithProfile,
} from "@/lib/studio-feed";
import { ownsAccount } from "@/lib/studio-scope";
import { loadWorkspace } from "@/lib/clients";
import { loadInterestKeys } from "@/lib/leads/store";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  const interestKeys = await loadInterestKeys({
    supabase,
    userId: user.id,
    clientId: workspace.clientId,
  });
  const params = await searchParams;
  const interestOnly = params.interest === "1";
  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const posting = scope.accounts.filter((account) => isPlatformId(account.platform));
  const tab = params.tab === "comments" ? "comments" : "messages";
  const filters = { accountId: params.account, platform: params.platform, status: params.status };
  const conversations =
    posting.length === 0 || tab !== "messages"
      ? { rows: [], error: null }
      : await loadScopedConversations(scope, filters);
  const commentPosts =
    posting.length === 0 || tab !== "comments"
      ? { rows: [], error: null }
      : await loadScopedCommentPosts(scope, filters);
  const listedError = tab === "comments" ? commentPosts.error : conversations.error;

  const openAccount = params.threadAccount ?? "";
  const threadAllowed = ownsAccount(scope.ownedIds, openAccount);
  const comments =
    tab === "comments" && params.post && threadAllowed
      ? await loadOwnedCommentThread(scope, params.post, openAccount)
      : null;
  const thread =
    tab === "messages" && params.conversation && threadAllowed
      ? await loadOwnedMessages(scope, params.conversation, openAccount)
      : null;

  return (
    <StudioFillCard wide>
      <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-3 pt-3 sm:px-4 sm:pt-4">
      <h1 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">{t("inboxTitle")}</h1>
      <div className="mt-2 flex gap-2 text-sm">
        <Link
          href="/inbox?tab=messages"
          className={tab === "messages" ? "posty-site-btn !px-3 !py-1 text-[12px]" : "posty-clay-tile rounded-full px-3 py-1 text-[12px] text-[#5c5652]"}
        >
          {t("messagesTab")}
        </Link>
        <Link
          href="/inbox?tab=comments"
          className={tab === "comments" ? "posty-site-btn !px-3 !py-1 text-[12px]" : "posty-clay-tile rounded-full px-3 py-1 text-[12px] text-[#5c5652]"}
        >
          {t("commentsTab")}
        </Link>
      </div>
      {posting.length === 0 ? (
        <p className="mt-6 text-sm">
          <Link href="/connections" className="font-medium text-[#FF4713]">
            {t("connectFirst")}
          </Link>
        </p>
      ) : (
        <FilterForm submit={t("apply")}>
          <input type="hidden" name="tab" value={tab} />
          <FilterField label={t("platform")}>
            <select name="platform" defaultValue={params.platform ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              {[...new Set(posting.map((account) => account.platform))].map((platform) => (
                <option key={platform} value={platform}>
                  {platformLabel(platform)}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label={t("account")}>
            <select name="account" defaultValue={params.account ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              {posting.map((account) => (
                <option key={account.zernioAccountId} value={account.zernioAccountId}>
                  {platformLabel(account.platform)} · {account.username || account.display_name}
                </option>
              ))}
            </select>
          </FilterField>
          {tab === "messages" ? (
            <FilterField label={t("status")}>
              <select name="status" defaultValue={params.status ?? ""} className={filterControl}>
                <option value="">{t("all")}</option>
                <option value="active">{t("open")}</option>
                <option value="archived">{t("archived")}</option>
              </select>
            </FilterField>
          ) : null}
          <FilterField label={t("interest")}>
            <select name="interest" defaultValue={interestOnly ? "1" : ""} className={filterControl}>
              <option value="">{t("all")}</option>
              <option value="1">{t("interestOnly")}</option>
            </select>
          </FilterField>
        </FilterForm>
      )}
      </div>
      <StudioNotice
        kind={listedError}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <div
        className={`grid min-h-0 flex-1 gap-2 px-2.5 pb-2.5 pt-2 sm:px-3.5 lg:grid-cols-[18rem_minmax(0,1fr)] lg:grid-rows-none lg:gap-3 ${
          (tab === "messages" && thread && params.conversation) || (tab === "comments" && comments && params.post)
            ? "grid-rows-[minmax(9rem,34%)_minmax(0,1fr)]"
            : "grid-rows-1"
        }`}
      >
      <ul className="posty-chat-history min-h-0 overflow-y-auto rounded-[1.25rem]">
        {tab === "messages"
          ? conversations.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const interested = interestKeys.has(`message:${row.id}`);
              if (interestOnly && !interested) return [];
              const open = params.conversation === row.id;
              return [
                <li key={row.id}>
                  <Link
                    href={`/inbox?tab=messages&conversation=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                    className={`flex items-center gap-3 px-3 py-3 ${open ? "posty-clay-tile mx-2 my-1 rounded-2xl" : "hover:bg-white/15"}`}
                  >
                    <Face src={row.participantPicture} name={row.participantName || "?"} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="block truncate text-sm font-medium">{row.participantName || "—"}</span>
                        {interested ? (
                          <span className="rounded-full bg-[#FF4713]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#FF4713]">
                            {t("interest")}
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate text-xs text-[#5c5652]">
                        {platformLabel(row.platform ?? "")}
                        {row.accountUsername ? ` · @${row.accountUsername.replace(/^@/, "")}` : ""}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-[#3f3b38]">{row.lastMessage || ""}</span>
                    </span>
                  </Link>
                </li>,
              ];
            })
          : commentPosts.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const interested = interestKeys.has(`post:${row.id}`);
              if (interestOnly && !interested) return [];
              const open = params.post === row.id && params.threadAccount === row.accountId;
              return [
                <li key={`${row.accountId}-${row.id}`}>
                  <Link
                    href={`/inbox?tab=comments&post=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                    className={`flex items-center gap-3 px-3 py-3 ${open ? "posty-clay-tile mx-2 my-1 rounded-2xl" : "hover:bg-white/15"}`}
                  >
                    <PostFace src={row.picture} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="block truncate text-sm font-medium">{row.content || platformLabel(row.platform ?? "")}</span>
                        {interested ? (
                          <span className="rounded-full bg-[#FF4713]/10 px-1.5 py-0.5 text-[10px] font-medium text-[#FF4713]">
                            {t("interest")}
                          </span>
                        ) : null}
                      </span>
                      <span className="block truncate text-xs text-[#5c5652]">
                        {platformLabel(row.platform ?? "")}
                        {row.accountUsername ? ` · @${row.accountUsername.replace(/^@/, "")}` : ""}
                        {typeof row.commentCount === "number" ? ` · ${row.commentCount}` : ""}
                      </span>
                    </span>
                  </Link>
                </li>,
              ];
            })}
      </ul>
      <section className="flex min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
        {tab === "messages" && thread && params.conversation ? (
          <>
            <ThreadPerson
              src={conversations.rows.find((row) => row.id === params.conversation)?.participantPicture}
              name={conversations.rows.find((row) => row.id === params.conversation)?.participantName || ""}
            />
            <div className="posty-chat-history min-h-0 flex-1 space-y-3 overflow-y-auto rounded-[1.25rem] px-3 py-3 sm:px-4 sm:py-4">
              {[...thread.messages]
                .sort((a, b) => String(a.createdTime ?? "").localeCompare(String(b.createdTime ?? "")))
                .map((message, index) => {
                const own = isOwnInboxMessage(message);
                const text = message.message || message.text || "";
                const who = conversations.rows.find((row) => row.id === params.conversation)?.participantName || t("them");
                return (
                  <div key={message.id || index} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[min(36rem,85%)] rounded-2xl px-3.5 py-2.5 text-sm ${
                        own ? "posty-clay-well" : "posty-clay-tile text-[#1d1d1f]"
                      }`}
                    >
                      <p className={`text-[11px] ${own ? "text-white/70" : "text-[#5c5652]"}`}>
                        {own ? t("you") : who}
                      </p>
                      <p className="mt-0.5 whitespace-pre-wrap break-words">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="shrink-0 px-1 pb-1 pt-2 sm:px-0">
              <InboxReplyForm
                endpoint="/api/inbox/messages"
                fields={{ conversationId: params.conversation, accountId: openAccount }}
                placeholder={t("replyPlaceholder")}
                sendLabel={t("reply")}
                sendingLabel={t("sending")}
                errorLabel={t("replyFailed")}
              />
            </div>
          </>
        ) : null}
        {tab === "comments" && comments && params.post ? (
          <>
            <ThreadPost
              src={commentPosts.rows.find((row) => row.id === params.post)?.picture}
              caption={commentPosts.rows.find((row) => row.id === params.post)?.content || ""}
            />
            <div className="posty-chat-history min-h-0 flex-1 space-y-3 overflow-y-auto rounded-[1.25rem] px-3 py-3 sm:px-4 sm:py-4">
              {comments.comments.map((comment, index) => (
                <div key={comment.id || index} className="flex justify-start gap-2 text-sm">
                  <Face src={comment.from?.picture} name={comment.from?.name || comment.from?.username || "?"} />
                  <div className="posty-clay-tile min-w-0 max-w-[min(36rem,85%)] rounded-2xl px-3.5 py-2.5">
                    <p className="text-xs text-[#5c5652]">{comment.from?.username || comment.from?.name || ""}</p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-[#1d1d1f]">{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 px-1 pb-1 pt-2 sm:px-0">
              <InboxReplyForm
                endpoint="/api/inbox/reply"
                fields={{ postId: params.post, accountId: openAccount }}
                placeholder={t("replyPlaceholder")}
                sendLabel={t("reply")}
                sendingLabel={t("sending")}
                errorLabel={t("replyFailed")}
              />
            </div>
          </>
        ) : null}
        </div>
      </section>
      </div>
      {posting.length > 0 &&
      (tab === "messages" ? conversations.rows.length : commentPosts.rows.length) === 0 &&
      !listedError ? (
        <p className="px-4 pb-3 text-sm text-[#5c5652]">{t("empty")}</p>
      ) : null}
      </div>
    </StudioFillCard>
  );
}

function Face({ src, name }: { src?: string; name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (!src) {
    return (
      <span className="posty-clay-tile inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-[#5c5652]">
        {letter}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
  );
}

function PostFace({ src }: { src?: string }) {
  if (!src) return <span className="posty-clay-tile inline-block h-12 w-12 shrink-0 rounded-lg" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
  );
}

function ThreadPerson({ src, name }: { src?: string; name: string }) {
  if (!name && !src) return null;
  return (
    <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
      <Face src={src} name={name || "?"} />
      <p className="truncate text-sm font-medium text-[#1d1d1f]">{name}</p>
    </div>
  );
}

function ThreadPost({ src, caption }: { src?: string; caption: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 sm:px-4">
      <PostFace src={src} />
      <p className="line-clamp-2 text-sm text-[#3f3b38]">{caption}</p>
    </div>
  );
}
