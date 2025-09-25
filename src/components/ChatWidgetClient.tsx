"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatWidgetClient() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = useCallback(() => {
    setMounted(true);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // welcome message
  useEffect(() => {
    if (!mounted) return;
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text:
            "👋 Hello! Welcome to The Next Funnel — ask me about pricing, audits, or automation.",
        },
      ]);
    }
  }, [mounted, messages.length]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = bodyRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior });
    } catch {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  const isUserNearBottom = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 180;
  }, []);

  useEffect(() => {
    if (isUserNearBottom()) scrollToBottom("smooth");
  }, [messages.length, loading, isUserNearBottom, scrollToBottom]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Msg = { role: "user", text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTimeout(() => scrollToBottom("smooth"), 20);

    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: (messages.length > 6 ? messages.slice(-6) : messages).map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload?.error ?? "AI error");

      const reply = payload.reply ?? "Sorry — couldn't generate a response.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setTimeout(() => scrollToBottom("smooth"), 60);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error: " + (err?.message ?? "failed") },
      ]);
      setTimeout(() => scrollToBottom("smooth"), 60);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [input, messages, scrollToBottom]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void sendMessage();
      }
    },
    [sendMessage]
  );

  const bubbleStyle = useMemo(
    () => ({
      assistantShort: {
        background: "rgba(255,255,255,0.04)",
        color: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(255,255,255,0.04)",
      } as React.CSSProperties,
      assistantLong: {
        background: "linear-gradient(90deg, rgba(14,165,233,0.06), rgba(139,92,246,0.04))",
        color: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(255,255,255,0.04)",
      } as React.CSSProperties,
      user: {
        background: "linear-gradient(180deg,#ffffff,#f3f4f6)",
        color: "#041124",
        boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
      } as React.CSSProperties,
    }),
    []
  );

  if (!mounted) {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <button
          onClick={handleOpen}
          aria-label="Open chat"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white shadow-lg focus:outline-none"
          title="Chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 11c0-4.97 4.03-8 9-8s9 3.03 9 8-4.03 9-9 9c-1 0-1.95-.22-2.8-.61L4 21l1.95-5.09C3.72 14.57 3 12.86 3 11z" fill="#ff6ea6"/>
          </svg>
          <span className="text-sm font-medium">Chat</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 bottom-6 z-50">
      {!open && (
        <button
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 60);
          }}
          aria-label="Open chat"
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-black text-white shadow-lg focus:outline-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 11c0-4.97 4.03-8 9-8s9 3.03 9 8-4.03 9-9 9c-1 0-1.95-.22-2.8-.61L4 21l1.95-5.09C3.72 14.57 3 12.86 3 11z" fill="#ff6ea6"/>
          </svg>
          <span className="text-sm font-medium">Chat</span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          className="w-[300px] md:w-[360px] max-h-[80vh] rounded-2xl shadow-2xl bg-[rgba(2,6,23,0.96)] border border-white/8 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-black shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/images/ig.png" className="h-6 w-6 rounded-full object-cover" alt="avatar" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">The Next Funnel Assistant</div>
                <div className="text-xs text-white/70 truncate">Quick answers about services</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMessages([]);
                  setInput("");
                  setTimeout(() => inputRef.current?.focus(), 40);
                }}
                className="text-xs text-white/80 px-2 py-1 rounded hover:bg-white/6"
                aria-label="Clear chat"
                title="Clear"
              >
                Clear
              </button>
              <button
                onClick={handleClose}
                className="text-xs text-white/80 px-2 py-1 rounded hover:bg-white/6"
                aria-label="Close chat"
                title="Close"
              >
                Close
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={bodyRef} className="px-3 py-3 overflow-y-auto flex-1 space-y-3 text-sm">
            {messages.map((m, i) => {
              const isAssistant = m.role === "assistant";
              const isShort = m.text.length <= 120 && !m.text.includes("\n");
              const style = isAssistant ? (isShort ? bubbleStyle.assistantShort : bubbleStyle.assistantLong) : bubbleStyle.user;

              return (
                <div key={i} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                  <div style={{ maxWidth: "84%" }}>
                    <div style={{ padding: "8px 12px", borderRadius: 12, ...style, whiteSpace: "pre-wrap" }}>
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-white">
                <svg width="36" height="12" viewBox="0 0 36 12" fill="none" aria-hidden>
                  <circle cx="6" cy="6" r="2" fill="#ffffff">
                    <animate attributeName="cy" dur="0.8s" values="6;2;6" repeatCount="indefinite" />
                  </circle>
                  <circle cx="18" cy="6" r="2" fill="#ffffff">
                    <animate attributeName="cy" dur="0.8s" values="6;1;6" begin="0.12s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="30" cy="6" r="2" fill="#ffffff">
                    <animate attributeName="cy" dur="0.8s" values="6;3;6" begin="0.24s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <span className="text-white">Assistant is typing…</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-white/6 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type your question..."
                className="flex-1 rounded-full px-3 py-2 bg-transparent 
                           text-white placeholder-white 
                           focus:outline-none overflow-hidden"
                style={{ color: "#ffffff" }}  // force white text
                aria-label="Type your message"
                autoComplete="off"
              />

              <button
                onClick={() => void sendMessage()}
                disabled={loading || input.trim() === ""}
                className={`flex items-center justify-center rounded-full font-semibold transition-transform
                  ${loading || input.trim() === "" ? "bg-white/18 text-black cursor-not-allowed px-3 py-2" : "bg-white text-black hover:scale-105 px-3 py-2"}
                `}
                aria-label="Send message"
                title="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M2 21l21-9L2 3l7 9-7 9z" fill="currentColor" />
                </svg>
                <span className="hidden md:inline-block ml-2 text-sm">{loading ? "…" : "Send"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
