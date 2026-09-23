import { getTranslations } from "next-intl/server";
import { PlatformIcon } from "@/components/studio/platform-icon";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { Link } from "@/i18n/navigation";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { getPlatform, isPlatformId, platformLabel } from "@/lib/platforms";
import { loadScopedPosts, loadStudioScopeWithProfile } from "@/lib/studio-feed";
import type { ZernioPost } from "@/lib/zernio";

export default async function PostsHistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const params = await searchParams;
  const scope = await loadStudioScopeWithProfile(user.id, await getZernioProfileId(user.id));
  const posting = scope.accounts.filter((account) => isPlatformId(account.platform));
  const result =
    posting.length === 0
      ? { posts: [], error: null }
      : await loadScopedPosts(scope, {
          accountId: params.account,
          platform: params.platform,
          status: params.status,
          source: params.source,
          fromDate: params.from,
          toDate: params.to,
          search: params.q,
        });

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("postsTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("postsLead")}</p>
      {posting.length === 0 ? (
        <p className="mt-6 text-sm">
          <Link href="/connections" className="font-medium text-[#FF4713]">
            {t("connectFirst")}
          </Link>
        </p>
      ) : (
        <FilterForm submit={t("apply")}>
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
                  {platformLabel(account.platform)} · {account.username || account.display_name || account.platform}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label={t("status")}>
            <select name="status" defaultValue={params.status ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              <option value="scheduled">{t("scheduled")}</option>
              <option value="published">{t("published")}</option>
              <option value="draft">{t("draft")}</option>
              <option value="failed">{t("failed")}</option>
            </select>
          </FilterField>
          <FilterField label={t("source")}>
            <select name="source" defaultValue={params.source ?? ""} className={filterControl}>
              <option value="">{t("all")}</option>
              <option value="zernio">{t("authored")}</option>
              <option value="external">{t("external")}</option>
            </select>
          </FilterField>
          <FilterField label={t("from")}>
            <input type="date" name="from" defaultValue={params.from ?? ""} className={filterControl} />
          </FilterField>
          <FilterField label={t("to")}>
            <input type="date" name="to" defaultValue={params.to ?? ""} className={filterControl} />
          </FilterField>
          <FilterField label={t("search")}>
            <input type="search" name="q" defaultValue={params.q ?? ""} className={filterControl} />
          </FilterField>
        </FilterForm>
      )}
      <StudioNotice
        kind={result.error}
        labels={{ failed: t("loadFailed"), unavailable: t("unavailable"), unknown: t("unknownAccount") }}
      />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {result.posts.map((post) => (
          <PostCard key={post._id} post={post} statusLabel={statusLabel(post.status, t)} emptyLabel={t("noContent")} />
        ))}
      </ul>
      {posting.length > 0 && result.posts.length === 0 && !result.error ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}

function statusLabel(
  status: string | undefined,
  t: (key: "scheduled" | "published" | "draft" | "failed" | "pending") => string,
) {
  if (status === "scheduled" || status === "published" || status === "draft" || status === "failed") return t(status);
  if (status === "pending" || status === "publishing") return t("pending");
  return status || "";
}

function postThumb(post: ZernioPost) {
  const media = post.mediaItems?.[0];
  if (media?.thumbnail) return media.thumbnail;
  if (media?.url && media.type !== "video") return media.url;
  if (typeof post.thumbnailUrl === "string") return post.thumbnailUrl;
  return null;
}

function PostCard({
  post,
  statusLabel: label,
  emptyLabel,
}: {
  post: ZernioPost;
  statusLabel: string;
  emptyLabel: string;
}) {
  const thumb = postThumb(post);
  const platform = post.platforms?.[0];
  const meta = platform ? getPlatform(platform.platform) : null;
  const when = post.scheduledFor ? new Date(post.scheduledFor) : null;
  return (
    <li className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="relative aspect-square bg-neutral-100">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-3 text-center text-xs text-neutral-400">
            {post.content?.slice(0, 80) || emptyLabel}
          </div>
        )}
        {label ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700">
            {label}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-2 px-2.5 py-2">
        {meta ? <PlatformIcon size="sm" connected platform={meta} /> : null}
        <div className="min-w-0">
          <p className="truncate text-[11px] text-neutral-500">
            {when
              ? when.toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : ""}
          </p>
          <p className="truncate text-[11px] text-neutral-400">
            {platform ? platformLabel(platform.platform) : ""}
            {post.content ? ` · ${post.content}` : ""}
          </p>
        </div>
      </div>
    </li>
  );
}
