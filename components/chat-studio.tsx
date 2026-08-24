"use client";

import { ArrowUp, Eraser, Mic, Paperclip, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { PostConfirmationCard } from "@/components/chat/post-confirmation-card";
import { PostResultsMessage } from "@/components/chat/post-results-message";
import type {
  ChatMedia,
  ConfirmationPayload,
  ResultsPayload,
  UserMediaPayload,
} from "@/lib/chat-post/types";
import { localizeCancelledContent, resultsReply } from "@/lib/chat-post/copy";
import { MAX_CHAT_ATTACHMENTS } from "@/lib/chat-post/series";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  kind?: string | null;
  payload?: ConfirmationPayload | ResultsPayload | UserMediaPayload | null;
};

type Attachment = {
  localId: string;
  name: string;
  type: "image" | "video";
  previewUrl: string | null;
  item: ChatMedia | null;
};

async function runPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>) {
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(items.length, 1)) }, () => run()));
}

function visibleText(content: string) {
  return content.replace(/\n\n\[media_refs:[\s\S]*$/, "").trim();
}

function MessageMedia({
  items,
  onDark,
}: {
  items: ChatMedia[];
  onDark?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <ul className="mb-2 flex gap-2 overflow-x-auto">
      {items.map((item) => (
        <li
          key={item.id}
          className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border ${
            onDark ? "border-white/20 bg-white/10" : "border-[#E5E5E5] bg-[#F5F5F5]"
          }`}
        >
          {item.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt={item.name ?? ""} className="h-full w-full object-cover" />
          ) : (
            <span
              className={`flex h-full items-center justify-center px-1 text-center text-[10px] ${
                onDark ? "text-white/80" : "text-[#6B7280]"
              }`}
            >
              {item.name ?? "video"}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    length: number;
    0?: { transcript: string };
    item?: (index: number) => { transcript: string } | undefined;
  }>;
};

type SpeechRecognitionErrorLike = {
  error?: string;
};

function createSpeechRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const SpeechWindow = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = SpeechWindow.SpeechRecognition ?? SpeechWindow.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

function transcriptFromResult(result: SpeechRecognitionEventLike["results"][number]) {
  return result[0]?.transcript ?? result.item?.(0)?.transcript ?? "";
}

function speechLang(locale: string) {
  if (locale.toLowerCase().startsWith("ro")) return "ro-RO";
  return "en-US";
}

export default function ChatStudio() {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const media = attachments
    .map((item) => item.item)
    .filter((item): item is ChatMedia => Boolean(item));
  const uploading = attachments.some((item) => !item.item);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [clearing, setClearing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseInputRef = useRef("");
  const finalTranscriptRef = useRef("");
  const wantListenRef = useRef(false);
  const loadGenRef = useRef(0);

  useEffect(() => {
    const gen = ++loadGenRef.current;
    void fetch(`/api/chat?locale=${encodeURIComponent(locale)}`)
      .then((response) => response.json())
      .then((chat) => {
        if (gen !== loadGenRef.current) return;
        setConversationId(chat.conversationId ?? null);
        setMessages(
          (chat.messages ?? []).map((message: ChatMessage) => ({
            role: message.role,
            content: localizeCancelledContent(message.content, locale),
            kind: message.kind,
            payload: message.payload,
          })),
        );
      });
  }, [locale]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  async function clearChat() {
    if (clearing || pending) return;
    loadGenRef.current += 1;
    setClearing(true);
    setError(null);
    recognitionRef.current?.abort?.();
    recognitionRef.current?.stop();
    wantListenRef.current = false;
    setListening(false);
    const response = await fetch("/api/chat", { method: "DELETE" });
    const payload = (await response.json().catch(() => ({}))) as {
      conversationId?: string | null;
      error?: string;
    };
    setClearing(false);
    if (!response.ok) {
      setError(payload.error ?? t("replyFailed"));
      return;
    }
    for (const item of attachments) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
    setConversationId(payload.conversationId ?? null);
    setMessages([]);
    setAttachments([]);
    setInput("");
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || pending || uploading) return;
    setInput("");
    setError(null);
    setPending(true);
    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
        kind: "text",
        payload: media.length > 0 ? { type: "user_media", media } : null,
      },
    ]);
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message: text, media, locale }),
    });
    const payload = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(payload.error ?? t("replyFailed"));
      return;
    }
    setConversationId(payload.conversationId);
    setAttachments([]);
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: payload.reply as string,
        kind: payload.kind,
        payload: payload.payload,
      },
    ]);
  }

  function onComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  async function onFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const picked = Array.from(files);
    const room = MAX_CHAT_ATTACHMENTS - attachments.length;
    if (picked.length > room) {
      setError(t("tooManyFiles", { max: MAX_CHAT_ATTACHMENTS }));
    }
    const batch = picked.slice(0, Math.max(0, room));
    if (batch.length === 0) return;
    const slots: Attachment[] = batch.map((file) => ({
      localId: crypto.randomUUID(),
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      item: null,
    }));
    setAttachments((current) => [...current, ...slots]);
    await runPool(
      slots.map((slot, index) => ({ slot, file: batch[index] })),
      4,
      async ({ slot, file }) => {
        try {
          const prepareResponse = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "prepare",
              filename: file.name,
              contentType: file.type || "application/octet-stream",
              size: file.size,
            }),
          });
          const prepare = (await prepareResponse.json()) as {
            error?: string;
            code?: string;
            signedUrl?: string;
            path?: string;
          };
          if (!prepareResponse.ok || !prepare.signedUrl || !prepare.path) {
            setError(
              prepare.code === "file_too_large" ? t("fileTooLarge") : (prepare.error ?? t("uploadFailed")),
            );
            setAttachments((current) => current.filter((item) => item.localId !== slot.localId));
            return;
          }

          const put = await fetch(prepare.signedUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type || "application/octet-stream" },
            body: file,
          });
          if (!put.ok) {
            setError(t("uploadFailed"));
            setAttachments((current) => current.filter((item) => item.localId !== slot.localId));
            return;
          }

          const completeResponse = await fetch("/api/media", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "complete",
              path: prepare.path,
              name: file.name,
              type: slot.type,
            }),
          });
          const payload = (await completeResponse.json()) as ChatMedia & { error?: string };
          if (!completeResponse.ok) {
            setError(payload.error ?? t("uploadFailed"));
            setAttachments((current) => current.filter((item) => item.localId !== slot.localId));
            return;
          }
          setAttachments((current) =>
            current.map((item) => (item.localId === slot.localId ? { ...item, item: payload } : item)),
          );
        } catch {
          setError(t("uploadFailed"));
          setAttachments((current) => current.filter((item) => item.localId !== slot.localId));
        } finally {
          if (slot.previewUrl) URL.revokeObjectURL(slot.previewUrl);
          setAttachments((current) =>
            current.map((item) => (item.localId === slot.localId ? { ...item, previewUrl: null } : item)),
          );
        }
      },
    );
  }

  async function toggleDictation() {
    if (listening || wantListenRef.current) {
      wantListenRef.current = false;
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = createSpeechRecognition();
    if (!recognition) {
      setSpeechSupported(false);
      setError(t("speechUnavailable"));
      return;
    }

    if (!window.isSecureContext) {
      setError(t("speechUnavailable"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      for (const track of stream.getTracks()) track.stop();
    } catch {
      setError(t("speechDenied"));
      setListening(false);
      return;
    }

    baseInputRef.current = input ? `${input.trim()} ` : "";
    finalTranscriptRef.current = "";
    wantListenRef.current = true;
    recognition.lang = speechLang(locale);
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      let interim = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const piece = transcriptFromResult(result).trim();
        if (!piece) continue;
        if (result.isFinal) {
          finalTranscriptRef.current = `${finalTranscriptRef.current}${piece} `;
        } else {
          interim += `${piece} `;
        }
      }
      setInput(`${baseInputRef.current}${finalTranscriptRef.current}${interim}`.replace(/\s+/g, " ").trimStart());
    };
    recognition.onerror = (event) => {
      const code = event.error ?? "";
      if (code === "no-speech" || code === "aborted") return;
      if (code === "language-not-supported" && recognition.lang !== "en-US") {
        recognition.lang = "en-US";
        return;
      }
      wantListenRef.current = false;
      setListening(false);
      if (code === "not-allowed" || code === "service-not-allowed") {
        setError(t("speechDenied"));
        return;
      }
      setError(t("speechError"));
    };
    recognition.onend = () => {
      if (!wantListenRef.current) {
        setListening(false);
        return;
      }
      window.setTimeout(() => {
        if (!wantListenRef.current) {
          setListening(false);
          return;
        }
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      }, 180);
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setListening(true);
      setError(null);
    } catch {
      wantListenRef.current = false;
      setListening(false);
      setError(t("speechError"));
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col bg-white lg:h-full">
      <header className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <button
          type="button"
          onClick={() => void clearChat()}
          disabled={clearing || pending}
          title={t("cleanChat")}
          aria-label={t("cleanChat")}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E5E5E5] px-2.5 py-1 text-[11px] text-[#6B7280] hover:border-[#FF4713] hover:text-[#FF4713] disabled:opacity-40"
        >
          <Eraser size={11} />
          {t("cleanChat")}
        </button>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((message, index) => (
          <article
            key={`${message.role}-${index}`}
            className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto whitespace-pre-wrap bg-[#1A1A1A] text-white"
                : "border border-[#E5E5E5] bg-[#FAFAFA] text-[#1A1A1A]"
            }`}
          >
            {message.role === "user" && message.payload?.type === "user_media" ? (
              <MessageMedia items={message.payload.media} onDark />
            ) : null}
            <div className="whitespace-pre-wrap">
              {visibleText(
                message.kind === "results" && message.payload?.type === "results"
                  ? resultsReply(locale, message.payload.results)
                  : localizeCancelledContent(message.content, locale),
              )}
            </div>
            {message.role === "assistant" &&
            message.kind === "confirmation" &&
            message.payload?.type === "confirmation" ? (
              <PostConfirmationCard
                payload={message.payload}
                onDone={(next) => {
                  setMessages((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? next.kind === "cancelled"
                          ? { ...item, kind: "text", payload: null, content: t("postCancelled") }
                          : {
                              ...item,
                              kind: "results",
                              payload: next.payload as ResultsPayload,
                              content: resultsReply(
                                locale,
                                (next.payload as ResultsPayload).results,
                              ),
                            }
                        : item,
                    ),
                  );
                }}
              />
            ) : null}
            {message.role === "assistant" &&
            message.kind === "results" &&
            message.payload?.type === "results" ? (
              <PostResultsMessage payload={message.payload} />
            ) : null}
          </article>
        ))}
        {messages.length === 0 && !pending ? (
          <div className="max-w-xl space-y-2">
            <p className="text-sm text-[#6B7280]">{t("empty")}</p>
            <p className="text-xs leading-5 text-[#6B7280]">{t("campaignTip")}</p>
          </div>
        ) : null}
        {pending ? <p className="text-sm text-[#6B7280]">{t("thinking")}</p> : null}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={(event) => void send(event)} className="border-t border-[#E5E5E5] bg-white px-4 py-4 sm:px-6">
        {attachments.length > 0 ? (
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-[#FF4713]">
              {uploading
                ? t("attachingProgress", { done: media.length, total: attachments.length })
                : t("attachedReady")}
            </p>
            <ul className="flex gap-2 overflow-x-auto">
              {attachments.map((item) => (
                <li
                  key={item.localId}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F5F5F5] ${
                    item.item ? "border-[#FF4713]" : "border-[#FF4713] bg-[#FFF4F0]"
                  }`}
                >
                  {item.type === "image" && (item.item?.url || item.previewUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.item?.url ?? item.previewUrl ?? ""}
                      alt={item.name}
                      className={`h-full w-full object-cover ${item.item ? "" : "opacity-70"}`}
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center px-1 text-center text-[10px] text-[#6B7280]">
                      {item.name}
                    </span>
                  )}
                  {!item.item ? (
                    <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[10px] text-white">
                      {t("attaching")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setAttachments((current) => current.filter((entry) => entry.localId !== item.localId))
                      }
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      aria-label={t("removeAttachment")}
                    >
                      <X size={12} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {attachments.length >= 2 ? (
              <p className="mt-2 text-[11px] leading-4 text-[#9A3412]">{t("campaignTip")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="relative rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] focus-within:border-[#FF4713]">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onComposerKeyDown}
            rows={3}
            placeholder={listening ? t("speechListening") : t("placeholder")}
            className="w-full resize-none bg-transparent px-4 pb-12 pt-3 text-sm text-[#1A1A1A] outline-none placeholder:text-[#6B7280]"
          />
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  media.length > 0 || uploading
                    ? "bg-[#FF4713] text-white"
                    : "text-[#6B7280] hover:bg-white hover:text-[#FF4713]"
                }`}
                aria-label={t("attach")}
                title={t("attach")}
              >
                <Paperclip size={18} />
                {attachments.length > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold text-[#FF4713]">
                    {attachments.length}
                  </span>
                ) : null}
              </button>
              <button
                type="button"
                onClick={() => void toggleDictation()}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                  listening
                    ? "bg-[#FF4713] text-white"
                    : "text-[#6B7280] hover:bg-white hover:text-[#FF4713]"
                }`}
                style={listening ? { animation: "mic-pulse 1.4s ease-out infinite" } : undefined}
                aria-label={listening ? t("stopDictation") : t("dictate")}
                title={speechSupported ? (listening ? t("stopDictation") : t("dictate")) : t("speechUnavailable")}
              >
                <Mic size={18} />
              </button>
            </div>
            <button
              type="submit"
              disabled={pending || uploading || !input.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FF4713] text-white hover:bg-[#e03d0f] disabled:opacity-40"
              aria-label={t("send")}
              title={t("send")}
            >
              <ArrowUp size={18} />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => {
              void onFiles(event.target.files);
              event.currentTarget.value = "";
            }}
          />
        </div>
        {error ? <p className="mt-2 text-sm text-[#FF4713]">{error}</p> : null}
      </form>
    </div>
  );
}
