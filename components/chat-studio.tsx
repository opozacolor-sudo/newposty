"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { platformLabel } from "@/lib/platforms";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Account = {
  id: string;
  platform: string;
  username: string | null;
  display_name: string | null;
};
type MediaItem = { url: string; type: "image" | "video"; name?: string };

export default function ChatStudio() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [scheduledFor, setScheduledFor] = useState("");
  const [publishing, setPublishing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void Promise.all([
      fetch("/api/chat").then((response) => response.json()),
      fetch("/api/accounts").then((response) => response.json()),
    ]).then(([chat, accountPayload]) => {
      setConversationId(chat.conversationId ?? null);
      setMessages(
        (chat.messages ?? []).map((message: ChatMessage) => ({
          role: message.role,
          content: message.content,
        })),
      );
      const nextAccounts = (accountPayload.accounts ?? []) as Account[];
      setAccounts(nextAccounts);
      setSelected(nextAccounts.map((account) => account.id));
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  const canPublish = useMemo(
    () => selected.length > 0 && (input.trim().length > 0 || media.length > 0),
    [input, media.length, selected.length],
  );

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    setError(null);
    setPending(true);
    setMessages((current) => [...current, { role: "user", content: text }]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: text, media }),
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(payload.error ?? "The assistant could not reply.");
      return;
    }
    setConversationId(payload.conversationId);
    setMessages((current) => [
      ...current,
      { role: "assistant", content: payload.reply as string },
    ]);
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    for (const file of Array.from(files)) {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/media", { method: "POST", body: form });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error ?? "Upload failed");
        continue;
      }
      setMedia((current) => [...current, payload as MediaItem]);
    }
  }

  async function publish(publishNow: boolean) {
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: input.trim(),
        accountIds: selected,
        media,
        publishNow,
        scheduledFor: publishNow ? undefined : scheduledFor || undefined,
      }),
    });
    const payload = await response.json();
    setPublishing(false);
    if (!response.ok) {
      setError(payload.error ?? "Publish failed");
      return;
    }
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: publishNow
          ? "Posted. Check the dashboard for live links as they land."
          : `Scheduled for ${scheduledFor}.`,
      },
    ]);
    setInput("");
    setMedia([]);
  }

  return (
    <div className="flex h-[calc(100vh-4.5rem)] flex-col lg:h-screen">
      <header className="border-b border-line px-6 py-4">
        <h1 className="font-serif text-2xl">Studio chat</h1>
        <p className="text-sm text-muted">
          Draft captions, ask for ideas, or tell me to publish.
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-card p-6 text-sm text-muted">
            Try “Give me three Instagram captions for a rainy Monday coffee shop”
            or connect an account and say “publish this to Instagram now”.
          </div>
        ) : null}
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-2xl whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-ink text-paper"
                : "bg-card border border-line"
            }`}
          >
            {message.content}
          </article>
        ))}
        {pending ? (
          <p className="text-sm text-muted">Thinking…</p>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="border-t border-line bg-paper px-6 py-4">
        {accounts.length > 0 ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {accounts.map((account) => {
              const active = selected.includes(account.id);
              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() =>
                    setSelected((current) =>
                      current.includes(account.id)
                        ? current.filter((id) => id !== account.id)
                        : [...current, account.id],
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-card text-muted"
                  }`}
                >
                  {platformLabel(account.platform)}{" "}
                  {account.username ?? account.display_name ?? ""}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="mb-3 text-xs text-muted">
            Connect accounts to publish from chat.
          </p>
        )}

        {media.length > 0 ? (
          <ul className="mb-3 flex gap-2 overflow-x-auto">
            {media.map((item) => (
              <li key={item.url} className="text-xs text-muted">
                {item.type}: {item.name ?? item.url}
              </li>
            ))}
          </ul>
        ) : null}

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={3}
          placeholder="Ask for a caption, or write one and publish it."
          className="w-full resize-none rounded-2xl border border-line bg-card px-4 py-3 outline-none focus:border-ink"
        />
        {error ? <p className="mt-2 text-sm text-accent">{error}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="cursor-pointer rounded-full border border-line bg-card px-3 py-2 text-xs">
            Attach
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void onFiles(event.target.files);
                event.currentTarget.value = "";
              }}
            />
          </label>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(event) => setScheduledFor(event.target.value)}
            className="rounded-full border border-line bg-card px-3 py-2 text-xs"
          />
          <button
            type="button"
            disabled={publishing || !canPublish}
            onClick={() => void publish(true)}
            className="rounded-full bg-accent px-4 py-2 text-xs text-white disabled:opacity-50"
          >
            Publish now
          </button>
          <button
            type="button"
            disabled={publishing || !canPublish || !scheduledFor}
            onClick={() => void publish(false)}
            className="rounded-full border border-line bg-card px-4 py-2 text-xs disabled:opacity-50"
          >
            Schedule
          </button>
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="ml-auto rounded-full bg-ink px-4 py-2 text-xs text-paper disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
