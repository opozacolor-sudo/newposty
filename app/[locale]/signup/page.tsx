"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { LocaleSwitch } from "@/components/locale-switch";
import { Link, useRouter } from "@/i18n/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    setInfo(null);
    const supabase = createBrowserSupabase();
    const origin = window.location.origin;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
    setPending(false);
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
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl italic">
          newposty
        </Link>
        <LocaleSwitch />
      </div>
      <h1 className="mt-8 font-serif text-4xl">{t("signupTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("signupSubtitle")}</p>
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
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
          />
        </label>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
        {info ? <p className="text-sm text-good">{info}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-accent py-3 text-sm text-white disabled:opacity-60"
        >
          {pending ? t("creating") : t("create")}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted">
        {t("alreadyHave")}{" "}
        <Link href="/login" className="text-ink underline">
          {t("signIn")}
        </Link>
      </p>
    </main>
  );
}
