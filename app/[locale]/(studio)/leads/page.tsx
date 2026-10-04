import { getTranslations } from "next-intl/server";
import { LeadPlaybookForm, LeadStatusForm } from "@/components/studio/lead-actions";
import { FilterField, FilterForm, filterControl } from "@/components/studio/studio-filters";
import { loadWorkspace } from "@/lib/clients";
import { requireUser } from "@/lib/data";
import { ensureLeadDefaults, listLeads, loadLeadPlaybook } from "@/lib/leads/store";
import { createServerSupabase } from "@/lib/supabase/server";

const SOURCES = ["message", "comment", "ad"] as const;
const STATUSES = ["new", "contacted", "dismissed"] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const t = await getTranslations("Studio");
  const { user } = await requireUser();
  const supabase = await createServerSupabase();
  const workspace = await loadWorkspace(supabase, user.id);
  await ensureLeadDefaults({ supabase, userId: user.id, clientId: workspace.clientId });
  const playbook = await loadLeadPlaybook(supabase, user.id, workspace.clientId);
  const params = await searchParams;
  const source = SOURCES.includes(params.source as (typeof SOURCES)[number]) ? params.source : undefined;
  const status = STATUSES.includes(params.status as (typeof STATUSES)[number]) ? params.status : undefined;
  const rows = await listLeads({
    supabase,
    userId: user.id,
    clientId: workspace.clientId,
    source,
    status,
  });

  return (
    <main className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{t("leadsTitle")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">{t("leadsLead")}</p>
      <LeadPlaybookForm
        productName={playbook.product_name ?? ""}
        productPrice={playbook.product_price != null ? String(playbook.product_price) : ""}
        labels={{ product: t("leadProduct"), price: t("leadPrice"), save: t("leadSavePlaybook") }}
      />
      <FilterForm submit={t("apply")}>
        <FilterField label={t("source")}>
          <select name="source" defaultValue={params.source ?? ""} className={filterControl}>
            <option value="">{t("all")}</option>
            <option value="message">{t("leadSourceMessage")}</option>
            <option value="comment">{t("leadSourceComment")}</option>
            <option value="ad">{t("leadSourceAd")}</option>
          </select>
        </FilterField>
        <FilterField label={t("status")}>
          <select name="status" defaultValue={params.status ?? ""} className={filterControl}>
            <option value="">{t("all")}</option>
            <option value="new">{t("leadStatusNew")}</option>
            <option value="contacted">{t("leadStatusContacted")}</option>
            <option value="dismissed">{t("leadStatusDismissed")}</option>
          </select>
        </FilterField>
      </FilterForm>
      <ul className="mt-6 space-y-3">
        {rows.map((row) => {
          const qualification = row.qualification ?? {};
          return (
            <li key={row.id} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{row.full_name || t("leadNoName")}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {row.source === "ad"
                      ? t("leadSourceAd")
                      : row.source === "comment"
                        ? t("leadSourceComment")
                        : t("leadSourceMessage")}
                    {row.platform ? ` · ${row.platform}` : ""}
                    {row.created_at ? ` · ${new Date(row.created_at).toLocaleString()}` : ""}
                  </p>
                </div>
                <LeadStatusForm
                  id={row.id}
                  status={row.status}
                  labels={{
                    new: t("leadStatusNew"),
                    contacted: t("leadStatusContacted"),
                    dismissed: t("leadStatusDismissed"),
                  }}
                />
              </div>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-neutral-500">{t("leadPhone")}</dt>
                  <dd>{row.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-neutral-500">{t("leadEmail")}</dt>
                  <dd className="break-all">{row.email || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-neutral-500">{t("leadTrigger")}</dt>
                  <dd className="line-clamp-2">{row.trigger_text || "—"}</dd>
                </div>
              </dl>
              {qualification.method || qualification.maxPrice != null || qualification.eligible != null ? (
                <p className="mt-3 text-sm text-neutral-600">
                  {qualification.method === "cash" ? t("leadMethodCash") : qualification.method === "credit" ? t("leadMethodCredit") : ""}
                  {qualification.maxPrice != null ? ` · ${t("leadMaxPrice")}: ${qualification.maxPrice}` : ""}
                  {qualification.eligible === true
                    ? ` · ${t("leadEligible")}`
                    : qualification.eligible === false
                      ? ` · ${t("leadNotEligible")}`
                      : ""}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">{source === "ad" ? t("leadAdsLater") : t("empty")}</p>
      ) : null}
    </main>
  );
}
