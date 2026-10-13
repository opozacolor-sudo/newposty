"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { ProfileDetails } from "@/lib/profile-details";

const fieldClass =
  "posty-clay-field h-10 w-full rounded-full px-3 text-sm text-[#1d1d1f]";

export function ProfileForm({ initial }: { initial: ProfileDetails }) {
  const t = useTranslations("Profile");
  const [values, setValues] = useState(initial);
  const [working, setWorking] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: keyof ProfileDetails, value: string) {
    setSaved(false);
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setWorking(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        setError(t("error"));
        return;
      }
      const body = (await response.json()) as { details?: ProfileDetails };
      if (body.details) setValues(body.details);
      setSaved(true);
    } catch {
      setError(t("error"));
    } finally {
      setWorking(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-6 space-y-5">
      <div className="grid items-stretch gap-4 lg:grid-cols-2 lg:gap-5">
        <ProfileCard title={t("companyTitle")}>
          <Field label={t("companySite")}>
            <input
              type="text"
              inputMode="url"
              placeholder="https://"
              value={values.company_site}
              onChange={(event) => setField("company_site", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label={t("name")}>
            <input
              value={values.display_name}
              onChange={(event) => setField("display_name", event.target.value)}
              maxLength={80}
              className={fieldClass}
            />
          </Field>
          <Field label={t("contactEmail")}>
            <input
              type="email"
              value={values.contact_email}
              onChange={(event) => setField("contact_email", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label={t("contactPhone")}>
            <input
              type="tel"
              value={values.contact_phone}
              onChange={(event) => setField("contact_phone", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </ProfileCard>

        <ProfileCard title={t("billingTitle")}>
          <Field label={t("billingName")}>
            <input
              value={values.billing_name}
              onChange={(event) => setField("billing_name", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label={t("billingTaxId")}>
            <input
              value={values.billing_tax_id}
              onChange={(event) => setField("billing_tax_id", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <Field label={t("billingAddress")}>
            <input
              value={values.billing_address}
              onChange={(event) => setField("billing_address", event.target.value)}
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("billingCity")}>
              <input
                value={values.billing_city}
                onChange={(event) => setField("billing_city", event.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label={t("billingPostal")}>
              <input
                value={values.billing_postal_code}
                onChange={(event) => setField("billing_postal_code", event.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label={t("billingCountry")}>
            <input
              value={values.billing_country}
              onChange={(event) => setField("billing_country", event.target.value)}
              className={fieldClass}
            />
          </Field>
        </ProfileCard>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={working} className="posty-site-btn h-10 px-5 text-sm disabled:opacity-60">
          {working ? t("saving") : t("save")}
        </button>
        {error ? <p className="text-sm text-[#FF4713]">{error}</p> : null}
        {saved ? <p className="text-sm text-[#5c5652]">{t("saved")}</p> : null}
      </div>
    </form>
  );
}

function ProfileCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="posty-clay-card-wrap min-w-0">
      <section className="posty-clay-card relative flex h-full flex-col overflow-hidden rounded-[1.5rem] p-5 sm:rounded-[2rem] sm:p-6">
        <div className="relative z-[3] flex h-full flex-col gap-4">
          <h2 className="text-sm font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>
          {children}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[#5c5652]">
      {label}
      {children}
    </label>
  );
}
