"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ClientRow } from "@/lib/clients";

export function ClientSwitcher({
  clients,
  selectedId,
}: {
  clients: ClientRow[];
  selectedId: string | null;
}) {
  const t = useTranslations("Clients");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = clients.find((client) => client.id === selectedId) ?? clients[0] ?? null;

  async function selectClient(clientId: string) {
    await fetch("/api/clients/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });
    window.location.reload();
  }

  async function addClient() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!response.ok) {
        setError(t("error"));
        return;
      }
      window.location.reload();
    } catch {
      setError(t("error"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-[#6B7280]">{t("label")}</p>
      {current ? (
        <select
          value={current.id}
          onChange={(event) => void selectClient(event.target.value)}
          className="w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2 text-sm text-[#1A1A1A]"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      ) : null}
      {open ? (
        <div className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-2">
          <label className="block text-xs text-[#6B7280]">
            {t("name")}
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-lg border border-[#E5E5E5] bg-white px-2 py-1.5 text-sm text-[#1A1A1A]"
            />
          </label>
          {error ? <p className="mt-1 text-xs text-[#FF4713]">{error}</p> : null}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="flex-1 rounded-lg border border-[#E5E5E5] bg-white px-2 py-1.5 text-xs"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              disabled={pending || !name.trim()}
              onClick={() => void addClient()}
              className="flex-1 rounded-lg bg-[#FF4713] px-2 py-1.5 text-xs text-white disabled:opacity-60"
            >
              {t("save")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
        >
          {clients.length === 0 ? t("addFirst") : t("add")}
        </button>
      )}
    </div>
  );
}
