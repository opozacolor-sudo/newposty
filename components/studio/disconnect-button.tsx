"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function DisconnectButton({
  accountId,
  label,
}: {
  accountId: string;
  label: string;
}) {
  const t = useTranslations("Accounts");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function onClick() {
    setPending(true);
    setError(false);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, { method: "DELETE" });
      if (!response.ok) {
        setError(true);
        return;
      }
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={pending}
        className="text-xs text-[#6B7280] underline-offset-2 hover:text-[#FF4713] hover:underline disabled:opacity-60"
      >
        {pending ? t("disconnecting") : label}
      </button>
      {error ? <span className="text-[11px] text-[#FF4713]">{t("disconnectFailed")}</span> : null}
    </span>
  );
}
