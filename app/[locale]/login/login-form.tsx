"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell, authField, authLabel } from "@/components/auth/auth-shell";
import { btnSolid } from "@/components/marketing/styles";
import { Link, useRouter } from "@/i18n/navigation";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { safeInternalPath } from "@/lib/safe-path";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get("next"));
  const confirmed = searchParams.get("confirmed") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const supabase = createBrowserSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(t("unexpected"));
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError(t("unexpected"));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("loginTitle")}</h1>
      <p className="mt-1.5 text-sm leading-6 text-[#5c5652]">{t("loginSubtitle")}</p>
      {confirmed ? <p className="mt-4 text-sm text-[#3f6b4a]">{t("emailConfirmed")}</p> : null}
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <label className={authLabel}>
          {t("email")}
          <input
            type="email"
            required
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={authField}
          />
        </label>
        <label className={authLabel}>
          {t("password")}
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authField}
          />
        </label>
        {error ? <p className="text-sm text-[#8b3a2a]">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className={`${btnSolid} posty-site-btn mt-2 w-full !py-3 disabled:opacity-60`}
        >
          {pending ? t("signingIn") : t("signIn")}
        </button>
      </form>
      <p className="mt-7 text-center text-[13px] leading-6 text-[#5c5652]">
        {SIGNUPS_OPEN ? (
          <>
            {t("newHere")}{" "}
            <Link href="/signup" className="font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
              {t("createAccount")}
            </Link>
          </>
        ) : (
          <>
            {t("waitlistHint")}{" "}
            <Link href="/waitlist" className="font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
              {t("waitlistLink")}
            </Link>
          </>
        )}
      </p>
    </AuthShell>
  );
}
