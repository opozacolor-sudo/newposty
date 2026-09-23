import { getTranslations } from "next-intl/server";
import { InboxReplyForm } from "@/components/studio/inbox-actions";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import {
  loadOwnedCommentThread,
  loadOwnedMessages,
  loadScopedCommentPosts,
  loadScopedConversations,
  loadStudioScopeWithProfile,
} from "@/lib/studio-feed";
import { ownsAccount } from "@/lib/studio-scope";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const params = await searchParams;
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
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("inboxTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("inboxLead")}</p>
      <div className="mt-4 flex gap-2 text-sm">
        <Link
          href="/inbox?tab=messages"
          className={tab === "messages" ? "font-medium text-[#FF4713]" : "text-neutral-500"}
        >
          {t("messagesTab")}
        </Link>
        <Link
          href="/inbox?tab=comments"
          className={tab === "comments" ? "font-medium text-[#FF4713]" : "text-neutral-500"}
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
        </FilterForm>
      )}
      <StudioNotice
        kind={listedError}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <ul className="mt-8 space-y-3">
        {tab === "messages"
          ? conversations.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const open = params.conversation === row.id;
              return [
                <li key={row.id} className="rounded-2xl border border-neutral-100 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{row.participantName || "—"}</p>
                      <p className="text-xs text-neutral-500">
                        {platformLabel(row.platform ?? "")}
                        {row.accountUsername ? ` · @${row.accountUsername.replace(/^@/, "")}` : ""}
                        {row.unreadCount ? ` · ${row.unreadCount}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/inbox?tab=messages&conversation=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                      className="text-sm font-medium text-[#FF4713]"
                    >
                      {t("reply")}
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">{row.lastMessage || ""}</p>
                  {open && thread ? (
                    <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
                      {thread.messages.map((message, index) => (
                        <p key={message.id || index} className="text-sm text-neutral-800">
                          {message.message || message.text || ""}
                        </p>
                      ))}
                      <InboxReplyForm
                        endpoint="/api/inbox/messages"
                        fields={{ conversationId: row.id, accountId: row.accountId }}
                        placeholder={t("replyPlaceholder")}
                        sendLabel={t("reply")}
                        sendingLabel={t("sending")}
                        errorLabel={t("replyFailed")}
                      />
                    </div>
                  ) : null}
                </li>,
              ];
            })
          : commentPosts.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const open = params.post === row.id && params.threadAccount === row.accountId;
              return [
                <li key={`${row.accountId}-${row.id}`} className="rounded-2xl border border-neutral-100 px-4 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{platformLabel(row.platform ?? "")}</p>
                      <p className="text-xs text-neutral-500">
                        {row.accountUsername ? `@${row.accountUsername.replace(/^@/, "")}` : ""}
                        {typeof row.commentCount === "number" ? ` · ${row.commentCount}` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/inbox?tab=comments&post=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                      className="text-sm font-medium text-[#FF4713]"
                    >
                      {t("comments")}
                    </Link>
                  </div>
                  <p className="mt-2 text-sm text-neutral-700">{row.content || ""}</p>
                  {open && comments ? (
                    <div className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
                      {comments.comments.map((comment, index) => (
                        <div key={comment.id || index} className="text-sm">
                          <p className="text-xs text-neutral-500">{comment.from?.username || comment.from?.name || ""}</p>
                          <p>{comment.message}</p>
                        </div>
                      ))}
                      <InboxReplyForm
                        endpoint="/api/inbox/reply"
                        fields={{ postId: row.id, accountId: row.accountId }}
                        placeholder={t("replyPlaceholder")}
                        sendLabel={t("reply")}
                        sendingLabel={t("sending")}
                        errorLabel={t("replyFailed")}
                      />
                    </div>
                  ) : null}
                </li>,
              ];
            })}
      </ul>
      {posting.length > 0 &&
      (tab === "messages" ? conversations.rows.length : commentPosts.rows.length) === 0 &&
      !listedError ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}
