"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { authField, authLabel } from "@/components/auth/auth-shell";
import { btnSolid } from "@/components/marketing/styles";
import { Link, useRouter } from "@/i18n/navigation";
import { getPublicSiteUrl } from "@/lib/env";
import { INVITE_SIGNUP } from "@/lib/flags";
import { createBrowserSupabase } from "@/lib/supabase/client";

export function JoinForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!INVITE_SIGNUP) {
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
          data: { account_kind: "individual", invite: true },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      if (data.session) {
        await fetch("/api/account/promo", { method: "POST" }).catch(() => undefined);
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
    <form id="signup" onSubmit={onSubmit} className="space-y-4">
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
      <p className="text-center text-[13px] leading-6 text-[#5c5652]">
        {t("alreadyHave")}{" "}
        <Link href="/login" className="font-medium text-[#1d1d1f] underline-offset-4 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
