"use client";

import { ArrowUp } from "lucide-react";
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
    <form onSubmit={onSubmit} className="flex items-center gap-2 sm:gap-2.5">
      <div className="posty-chat-composer flex min-w-0 flex-1 items-center rounded-full p-1 sm:p-1.5">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={placeholder}
          maxLength={2000}
          rows={1}
          className="posty-chat-input min-w-0 flex-1 resize-none bg-transparent px-3 text-sm leading-5 text-[#1d1d1f] outline-none placeholder:text-[#8a8682]"
        />
      </div>
      <button
        type="submit"
        disabled={pending || message.trim().length === 0}
        className="posty-site-btn posty-chat-send disabled:opacity-40"
        aria-label={pending ? sendingLabel : sendLabel}
        title={pending ? sendingLabel : sendLabel}
      >
        <ArrowUp size={18} />
      </button>
      {error ? <span className="sr-only">{errorLabel}</span> : null}
    </form>
  );
}
