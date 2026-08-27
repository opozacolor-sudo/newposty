"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LocaleSwitch } from "@/components/locale-switch";
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
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl italic">
          newposty
        </Link>
        <LocaleSwitch />
      </div>
      <h1 className="mt-8 font-serif text-4xl">{t("loginTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("loginSubtitle")}</p>
      {confirmed ? (
        <p className="mt-4 text-sm text-good">{t("emailConfirmed")}</p>
      ) : null}
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          {t("email")}
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
          />
        </label>
        <label className="block text-sm">
          {t("password")}
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
          />
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-ink py-3 text-sm text-paper disabled:opacity-60"
        >
          {pending ? t("signingIn") : t("signIn")}
        </button>
      </form>
      {SIGNUPS_OPEN ? (
        <p className="mt-6 text-sm text-muted">
          {t("newHere")}{" "}
          <Link href="/signup" className="text-ink underline">
            {t("createAccount")}
          </Link>
        </p>
      ) : null}
    </main>
  );
}
