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
    <main className="flex h-full min-h-0 flex-col">
      <div className="border-b border-neutral-100 px-4 py-3">
      <h1 className="text-lg font-semibold tracking-tight">{t("inboxTitle")}</h1>
      <div className="mt-2 flex gap-2 text-sm">
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
      </div>
      <StudioNotice
        kind={listedError}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_minmax(0,1fr)]">
      <ul className="min-h-0 overflow-y-auto border-r border-neutral-100">
        {tab === "messages"
          ? conversations.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const open = params.conversation === row.id;
              return [
                <li key={row.id}>
                  <Link
                    href={`/inbox?tab=messages&conversation=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                    className={`flex items-center gap-3 border-b border-neutral-100 px-4 py-3 ${open ? "bg-neutral-50" : "hover:bg-neutral-50"}`}
                  >
                    <Face src={row.participantPicture} name={row.participantName || "?"} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{row.participantName || "—"}</span>
                      <span className="block truncate text-xs text-neutral-500">
                        {platformLabel(row.platform ?? "")}
                        {row.accountUsername ? ` · @${row.accountUsername.replace(/^@/, "")}` : ""}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-neutral-600">{row.lastMessage || ""}</span>
                    </span>
                  </Link>
                </li>,
              ];
            })
          : commentPosts.rows.flatMap((row) => {
              if (!("id" in row) || !row.id || !row.accountId) return [];
              const open = params.post === row.id && params.threadAccount === row.accountId;
              return [
                <li key={`${row.accountId}-${row.id}`}>
                  <Link
                    href={`/inbox?tab=comments&post=${encodeURIComponent(row.id)}&threadAccount=${encodeURIComponent(row.accountId)}`}
                    className={`flex items-center gap-3 border-b border-neutral-100 px-4 py-3 ${open ? "bg-neutral-50" : "hover:bg-neutral-50"}`}
                  >
                    <PostFace src={row.picture} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{row.content || platformLabel(row.platform ?? "")}</span>
                      <span className="block truncate text-xs text-neutral-500">
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
        {tab === "messages" && thread && params.conversation ? (
          <>
            <ThreadPerson
              src={conversations.rows.find((row) => row.id === params.conversation)?.participantPicture}
              name={conversations.rows.find((row) => row.id === params.conversation)?.participantName || ""}
            />
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {thread.messages.map((message, index) => (
                <p key={message.id || index} className="max-w-xl rounded-2xl bg-neutral-100 px-3 py-2 text-sm">
                  {message.message || message.text || ""}
                </p>
              ))}
            </div>
            <div className="border-t border-neutral-100 px-4 py-3">
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
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {comments.comments.map((comment, index) => (
                <div key={comment.id || index} className="flex gap-2 text-sm">
                  <Face src={comment.from?.picture} name={comment.from?.name || comment.from?.username || "?"} />
                  <div className="min-w-0">
                    <p className="text-xs text-neutral-500">{comment.from?.username || comment.from?.name || ""}</p>
                    <p>{comment.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 px-4 py-3">
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
      </section>
      </div>
      {posting.length > 0 &&
      (tab === "messages" ? conversations.rows.length : commentPosts.rows.length) === 0 &&
      !listedError ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}

function Face({ src, name }: { src?: string; name: string }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (!src) {
    return (
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-500">
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
  if (!src) return <span className="inline-block h-12 w-12 shrink-0 rounded-lg bg-neutral-100" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
  );
}

function ThreadPerson({ src, name }: { src?: string; name: string }) {
  if (!name && !src) return null;
  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
      <Face src={src} name={name || "?"} />
      <p className="truncate text-sm font-medium">{name}</p>
    </div>
  );
}

function ThreadPost({ src, caption }: { src?: string; caption: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
      <PostFace src={src} />
      <p className="line-clamp-2 text-sm text-neutral-700">{caption}</p>
    </div>
  );
}
