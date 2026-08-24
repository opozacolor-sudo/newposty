"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";

export function PresaleRegisterForm({ token }: { token: string }) {
  const t = useTranslations("Presale");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch(`/api/presale/register?token=${encodeURIComponent(token)}`);
      const payload = (await response.json()) as { email?: string; error?: string };
      if (cancelled) return;
      if (payload.error === "PRESALE_TOKEN_EXPIRED") {
        setExpired(true);
        setError(t("tokenExpired"));
      } else if (response.status === 503) {
        setExpired(true);
        setError(t("serverMisconfigured"));
      } else if (!response.ok) {
        setExpired(true);
        setError(t("tokenInvalid"));
      } else {
        setEmail(payload.email ?? "");
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [t, token]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/presale/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const payload = (await response.json()) as { ok?: boolean; email?: string; error?: string };
      if (!response.ok || !payload.ok || !payload.email) {
        if (payload.error === "PRESALE_TOKEN_EXPIRED") setError(t("tokenExpired"));
        else if (payload.error === "PASSWORD_MISMATCH") setError(t("passwordMismatch"));
        else if (payload.error === "PASSWORD_SHORT") setError(t("passwordShort"));
        else setError(t("registerError"));
        return;
      }
      const supabase = createBrowserSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password,
      });
      if (signInError) {
        setError(t("registerError"));
        return;
      }
      router.replace("/chat");
      router.refresh();
    } catch {
      setError(t("registerError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col px-6 py-16">
      <h1 className="font-serif text-4xl">{t("registerTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("registerSubtitle")}</p>
      {loading ? <p className="mt-8 text-sm text-muted">{t("registerLoading")}</p> : null}
      {!loading && expired ? <p className="mt-8 text-sm text-accent">{error}</p> : null}
      {!loading && !expired ? (
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm">
            {t("email")}
            <input
              type="email"
              readOnly
              value={email}
              className="mt-1 w-full rounded-2xl border border-line bg-neutral-50 px-4 py-3 text-muted outline-none"
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
          <label className="block text-sm">
            {t("confirmPassword")}
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
            />
          </label>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[#FF4713] py-3 text-sm text-white disabled:opacity-60"
          >
            {pending ? t("registering") : t("registerCta")}
          </button>
        </form>
      ) : null}
    </main>
  );
}
