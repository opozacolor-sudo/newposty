"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

export function InboxReplyForm({
  endpoint,
  fields,
  placeholder,
  sendLabel,
  sendingLabel,
  errorLabel,
}: {
  endpoint: "/api/inbox/reply" | "/api/inbox/messages";
  fields: Record<string, string>;
  placeholder: string;
  sendLabel: string;
  sendingLabel: string;
  errorLabel: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || pending) return;
    setPending(true);
    setError(false);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, message: text }),
      });
      if (!response.ok) {
        setError(true);
        return;
      }
      setMessage("");
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={placeholder}
        maxLength={2000}
        rows={3}
        className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || message.trim().length === 0}
          className="rounded-full bg-[#FF4713] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {pending ? sendingLabel : sendLabel}
        </button>
        {error ? <span className="text-sm text-[#FF4713]">{errorLabel}</span> : null}
      </div>
    </form>
  );
}
