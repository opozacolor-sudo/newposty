"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { AuthShell, authField, authLabel } from "@/components/auth/auth-shell";
import { btnSolid, clayTile } from "@/components/marketing/styles";
import { Link, useRouter } from "@/i18n/navigation";
import { getPublicSiteUrl } from "@/lib/env";
import { SIGNUPS_OPEN } from "@/lib/flags";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountKind, setAccountKind] = useState<"individual" | "team">("individual");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!SIGNUPS_OPEN) {
      router.replace("/waitlist");
      return;
    }
    setPending(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = createBrowserSupabase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getPublicSiteUrl()}/auth/callback`,
          data: { account_kind: accountKind },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        router.push("/chat");
        router.refresh();
        return;
      }
      setInfo(t("confirmEmail"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("unexpected"));
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{t("signupTitle")}</h1>
      <p className="mt-1.5 text-sm leading-6 text-[#5c5652]">{t("signupSubtitle")}</p>
      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <fieldset>
          <legend className={authLabel}>{t("accountKind")}</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["individual", "team"] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setAccountKind(kind)}
                className={`${clayTile} px-3 py-3 text-left text-sm ${
                  accountKind === kind ? "ring-1 ring-[#1d1d1f]/25" : "opacity-80"
                }`}
              >
                <span className="block font-medium text-[#1d1d1f]">{t(`${kind}Label`)}</span>
                <span className="mt-1 block text-[11px] leading-4 text-[#5c5652]">{t(`${kind}Hint`)}</span>
              </button>
            ))}
          </div>
        </fieldset>
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
            minLength={8}
            autoComplete="new-password"
            placeholder={t("passwordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={authField}
          />
        </label>
        {error ? <p className="text-sm text-[#8b3a2a]">{error}</p> : null}
        {info ? <p className="text-sm text-[#3f6b4a]">{info}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className={`${btnSolid} posty-site-btn mt-2 w-full !py-3 disabled:opacity-60`}
        >
          {pending ? t("creating") : t("create")}
        </button>
      </form>
      <p className="mt-7 text-center text-[13px] leading-6 text-[#5c5652]">
        {t("alreadyHave")}{" "}
        <Link href="/login" className="font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </AuthShell>
  );
}
