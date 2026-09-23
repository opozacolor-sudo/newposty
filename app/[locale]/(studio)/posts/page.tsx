import { getTranslations } from "next-intl/server";
import { FilterField, FilterForm, StudioNotice, filterControl } from "@/components/studio/studio-filters";
import { getZernioProfileId } from "@/lib/account-server";
import { requireUser } from "@/lib/data";
import { isPlatformId, platformLabel } from "@/lib/platforms";
import { loadScopedPosts, loadStudioScopeWithProfile } from "@/lib/studio-feed";
import { Link } from "@/i18n/navigation";

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
      <ul className="mt-8 divide-y divide-neutral-100 rounded-2xl border border-neutral-100">
        {result.posts.map((post) => (
          <li key={post._id} className="px-4 py-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-medium text-neutral-800">{post.status || "—"}</span>
              <span>{post.scheduledFor ? new Date(post.scheduledFor).toLocaleString() : ""}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-800">{post.content || "—"}</p>
            <ul className="mt-2 flex flex-wrap gap-2 text-xs">
              {(post.platforms ?? []).map((target, index) => (
                <li key={`${post._id}-${index}`} className="rounded-full bg-neutral-100 px-2 py-1">
                  {platformLabel(target.platform)}
                  {target.status ? ` · ${target.status}` : ""}
                  {target.platformPostUrl ? (
                    <>
                      {" "}
                      <a href={target.platformPostUrl} className="text-[#FF4713]" target="_blank" rel="noreferrer">
                        URL
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {posting.length > 0 && result.posts.length === 0 && !result.error ? (
        <p className="mt-4 text-sm text-neutral-500">{t("empty")}</p>
      ) : null}
    </main>
  );
}
