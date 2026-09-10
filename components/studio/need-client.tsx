"use client";

import { useTranslations } from "next-intl";
import { ClientSwitcher } from "@/components/studio/client-switcher";

export function NeedClient() {
  const t = useTranslations("Clients");
  return (
    <main className="flex h-full items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">{t("emptyTitle")}</h1>
        <p className="mt-3 text-sm leading-6 text-[#6B7280]">{t("emptyBody")}</p>
        <div className="mt-6 rounded-2xl border border-[#E5E5E5] p-4">
          <ClientSwitcher clients={[]} selectedId={null} />
        </div>
      </div>
    </main>
  );
}
