"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { SITE } from "@/lib/constants";
import {
  trackAiAdvisorEvent,
  trackWhatsAppClick,
} from "@/lib/analytics";

type AdvisorSource = {
  label: string;
  href: string;
};

type AdvisorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  mode?: "local" | "ai" | "fallback";
  sources?: AdvisorSource[];
};

type AdvisorResponse = {
  answer?: string;
  error?: string;
  mode?: "local" | "ai" | "fallback";
  sources?: AdvisorSource[];
  handoff?: boolean;
};

const quickPrompts = [
  "Which sodium metasilicate grade fits my application?",
  "What MSDS and certificates are available?",
  "Help me prepare a quotation request.",
];

const initialMessage: AdvisorMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hello! I’m the SilicateChem Procurement Advisor. I can help with product selection, specifications, packing, documents, and RFQ preparation. Final prices and commercial terms are confirmed by our human sales team.",
  mode: "local",
};

const fallbackMessage =
  "The automated answer is temporarily unavailable. Please continue with our human sales team on WhatsApp or use the quotation form.";

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ProcurementAdvisor() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [messages, setMessages] = useState<AdvisorMessage[]>([initialMessage]);
  const sessionIdRef = useRef<string | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const whatsappDigits = SITE.whatsapp.replace(/[^0-9]/g, "");
  const buyerMessages = messages
    .filter((message) => message.role === "user")
    .slice(-4)
    .map((message) => `- ${message.content}`)
    .join("\n");
  const handoffText = [
    "Hello SilicateChem, I used the AI Procurement Advisor.",
    "My inquiry:",
    buyerMessages || "- I would like to discuss a sodium metasilicate requirement.",
    "Please continue with a human sales representative.",
  ]
    .join("\n")
    .slice(0, 1_500);
  const whatsappHref = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    handoffText
  )}`;

  function toggleOpen() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      trackAiAdvisorEvent({
        event: "ai_advisor_open",
        pagePath: pathname,
      });
    }
  }

  function scrollToLatest() {
    requestAnimationFrame(() => {
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    });
  }

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || busy) return;

    if (requestCount >= 20) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content:
            "This chat session has reached its request limit. Please continue on WhatsApp for human support.",
          mode: "fallback",
        },
      ]);
      scrollToLatest();
      return;
    }

    const userMessage: AdvisorMessage = {
      id: createMessageId(),
      role: "user",
      content: message,
    };
    const priorHistory = messages
      .filter((item) => item.id !== "welcome")
      .slice(-6)
      .map((item) => ({ role: item.role, content: item.content }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setBusy(true);
    setRequestCount((count) => count + 1);
    scrollToLatest();
    trackAiAdvisorEvent({
      event: "ai_advisor_question",
      pagePath: pathname,
    });

    try {
      sessionIdRef.current = sessionIdRef.current ?? createMessageId();
      const response = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: priorHistory,
          pagePath: pathname,
          sessionId: sessionIdRef.current,
        }),
      });
      const result = (await response.json()) as AdvisorResponse;
      const mode = result.mode ?? "fallback";

      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: result.answer ?? result.error ?? fallbackMessage,
          mode,
          sources: result.sources,
        },
      ]);
      trackAiAdvisorEvent({
        event: "ai_advisor_answer",
        pagePath: pathname,
        label: mode,
      });
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          content: fallbackMessage,
          mode: "fallback",
        },
      ]);
      trackAiAdvisorEvent({
        event: "ai_advisor_answer",
        pagePath: pathname,
        label: "network_fallback",
      });
    } finally {
      setBusy(false);
      scrollToLatest();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-24 md:right-6">
      {open && (
        <section
          id="procurement-advisor-panel"
          role="dialog"
          aria-label="AI Procurement Advisor"
          className="absolute bottom-[calc(100%+0.75rem)] right-0 flex h-[min(68vh,34rem)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[#D7E6EF] bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-[#0B2D5B] px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m18 16 .8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z" />
                </svg>
              </span>
              <div>
                <h2 className="text-sm font-bold">AI Procurement Advisor</h2>
                <p className="flex items-center gap-1.5 text-xs text-white/75">
                  <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                  24-hour pre-sales guidance
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="rounded p-1 text-2xl leading-none text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close AI Procurement Advisor"
            >
              ×
            </button>
          </header>

          <div
            ref={messageListRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[#F7F9FA] p-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#0B2D5B] text-white"
                      : "rounded-bl-md border border-[#E2E6EA] bg-white text-[#334155]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                    <div className="mt-2 border-t border-[#E2E6EA] pt-2">
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#64748B]">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {message.sources.map((source) => (
                          <Link
                            key={source.href}
                            href={source.href}
                            className="rounded-full bg-[#EAF4FA] px-2 py-1 text-[11px] font-semibold text-[#0B2D5B] hover:bg-[#D7EAF4]"
                          >
                            {source.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="block w-full rounded-xl border border-[#D7E6EF] bg-white px-3 py-2.5 text-left text-xs font-semibold text-[#0B2D5B] hover:border-[#2E7D9A] hover:bg-[#F4F8FB]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-[#E2E6EA] bg-white px-4 py-3 text-sm text-[#64748B]">
                  Checking approved product information…
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#E2E6EA] bg-white p-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                maxLength={1_500}
                placeholder="Ask about grade, packing, documents or RFQ…"
                className="min-h-11 flex-1 resize-none rounded-xl border border-[#CBD5E1] px-3 py-2 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#2E7D9A]"
                aria-label="Procurement question"
              />
              <button
                type="submit"
                disabled={busy || input.trim().length < 2}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B2D5B] text-white hover:bg-[#071F3F] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send procurement question"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 12 14-7-4 14-3-6-7-1Z" />
                </svg>
              </button>
            </form>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackAiAdvisorEvent({
                    event: "ai_advisor_handoff",
                    pagePath: pathname,
                    label: "whatsapp",
                  });
                  trackWhatsAppClick({
                    pagePath: pathname,
                    pageSource: pathname,
                    location: "ai_advisor_handoff",
                  });
                }}
                className="rounded-lg bg-[#25D366] px-3 py-2 text-center text-xs font-bold text-white hover:bg-[#1FBD59]"
              >
                Continue on WhatsApp
              </a>
              <Link
                href="/contact?type=quote&source=ai-advisor"
                className="rounded-lg border border-[#0B2D5B] px-3 py-2 text-center text-xs font-bold text-[#0B2D5B] hover:bg-[#F4F8FB]"
              >
                Submit RFQ
              </Link>
            </div>
            <p className="mt-2 text-center text-[10px] leading-4 text-[#64748B]">
              Guidance only. Final specifications, availability, price and delivery require sales confirmation.
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#0B2D5B] text-white shadow-xl transition-colors hover:bg-[#071F3F]"
        aria-label={open ? "Close AI Procurement Advisor" : "Open AI Procurement Advisor"}
        aria-expanded={open}
        aria-controls="procurement-advisor-panel"
      >
        {open ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <>
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 5.5h14v10H9l-4 3v-13Z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 9h6M9 12h4" />
            </svg>
            <span className="absolute -right-1 -top-1 rounded-full bg-[#25D366] px-1.5 py-0.5 text-[9px] font-black text-white">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}
