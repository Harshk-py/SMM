// src/components/ChatWidgetClient.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

export default function ChatWidgetClient() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
  }, [open]);

  // Auto-scroll when messages change (only if near bottom)
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 140;
    if (isNearBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Welcome message on mount (does not auto-open)
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: "👋 Hello! Welcome to The Next Funnel — ask me about pricing, free audits, or how automation can grow your brand.",
        },
      ]);
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg: Msg = { role: "user", text: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          history: newMessages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "AI error");

      const reply = data.reply ?? "Sorry — I couldn't generate a response.";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error: " + (err?.message ?? "failed") },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Helper: determine if assistant message is short & single-line
  function isShortSingleLine(text: string) {
    if (!text) return false;
    const maxLen = 120;
    return text.length <= maxLen && !text.includes("\n");
  }

  return (
    <>
      {/* component-local styles: typing placeholder + small animations */}
      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-chat-fade { animation: chatFadeIn 200ms ease forwards; }

        @keyframes dot-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.9; }
          50% { transform: translateY(-4px); opacity: 0.5; }
        }
        .dot-bounce { animation: dot-bounce 800ms infinite; }

        /* Typing placeholder animation (typewriter) */
        .typing-placeholder {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid rgba(255,255,255,0.6); /* caret */
          box-sizing: content-box;
          /* width controlled by steps to simulate typing */
          animation: typing 2.6s steps(26, end) infinite, blink 1s step-end infinite;
        }

        @keyframes typing {
          0% { width: 0; }
          50% { width: 100%; }
          100% { width: 100%; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }

        /* when we don't want the repeating typing, use this class to run it once */
        .typing-placeholder.once {
          animation: typing 1.6s steps(26, end) 1 normal both, blink 1s step-end infinite;
        }

        /* Hide placeholder when focused or when user has typed */
        .placeholder-hidden { opacity: 0; transform: translateY(2px); transition: opacity 160ms ease, transform 160ms ease; }

        /* Ensure input text is white */
        .chat-input {
          color: #ffffff;
        }

        /* Small responsive tweak: reduce panel size on tiny screens */
        @media (max-width: 420px) {
          .chat-panel { width: 300px !important; height: 420px !important; }
        }
      `}</style>

      <div className="fixed right-5 bottom-5 z-50">
        {/* Toggle */}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Open chat"
            className="relative flex items-center gap-3 px-4 py-2 rounded-full bg-black text-white shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0" stopColor="#ee00ce" />
                  <stop offset="1" stopColor="#d60988" />
                </linearGradient>
              </defs>
              <path
                d="M3 11c0-4.97 4.03-8 9-8s9 3.03 9 8-4.03 9-9 9c-1 0-1.95-.22-2.8-.61L4 21l1.95-5.09C3.72 14.57 3 12.86 3 11z"
                fill="url(#g1)"
              />
            </svg>
            <span className="text-sm font-medium">Chat</span>
            {/* subtle pulse dot */}
            <span className="absolute -top-1 -right-1 inline-block w-2 h-2 rounded-full bg-pink-500 opacity-90 animate-pulse" />
          </button>
        )}

        {/* Panel */}
        {open && (
          <div className="relative">
            <div
              className="chat-panel w-[320px] md:w-[380px] h-[440px] overflow-hidden rounded-3xl shadow-2xl"
              role="dialog"
              aria-modal="true"
            >
              {/* Solid panel (mostly opaque to avoid transparency issues) */}
              <div
                className="h-full rounded-3xl border border-white/8 flex flex-col"
                style={{
                  background: "rgba(2,6,23,0.96)", // near-solid to avoid readability issues
                  backdropFilter: "blur(6px) saturate(120%)",
                }}
              >
                {/* Header (solid black for contrast) */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-t-3xl"
                  style={{ background: "#000" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white font-semibold shadow">
                      TN
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">The Next Funnel Assistant</div>
                      <div className="text-xs text-white/70">Quick answers about services & automation</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMessages([]);
                        setInput("");
                        setTimeout(() => inputRef.current?.focus(), 40);
                      }}
                      className="text-xs text-white/80 px-2 py-1 rounded hover:bg-white/6 transition"
                      aria-label="Clear chat"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="text-xs text-white/80 px-2 py-1 rounded hover:bg-white/6 transition"
                      aria-label="Close chat"
                    >
                      Close
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={bodyRef}
                  className="px-4 py-3 flex-1 overflow-y-auto space-y-3"
                  style={{ background: "transparent" }}
                >
                  {messages.length === 0 && (
                    <div className="text-sm text-gray-300 animate-chat-fade">
                      Hello — I can help with pricing, audits, Instagram automation and more.
                    </div>
                  )}

                  {messages.map((m, i) => {
                    const short = m.role === "assistant" && isShortSingleLine(m.text);
                    const isAssistant = m.role === "assistant";

                    return (
                      <div key={i} className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                        {/* bubble */}
                        <div
                          className={`max-w-[84%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap animate-chat-fade ${isAssistant ? "rounded-tl-none" : "rounded-tr-none"}`}
                          style={
                            isAssistant
                              ? short
                                ? {
                                    background: "rgba(255,255,255,0.04)", // clean subtle solid for short replies
                                    color: "rgba(255,255,255,0.95)",
                                    border: "1px solid rgba(255,255,255,0.04)",
                                  }
                                : {
                                    background: "linear-gradient(90deg, rgba(14,165,233,0.08), rgba(139,92,246,0.06))",
                                    color: "rgba(255,255,255,0.95)",
                                    border: "1px solid rgba(255,255,255,0.04)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                                  }
                              : {
                                  background: "linear-gradient(180deg,#ffffff,#f3f4f6)",
                                  color: "#041124",
                                  boxShadow: "0 6px 18px rgba(2,6,23,0.18)",
                                }
                          }
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}

                  {/* typing indicator */}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-3 px-3 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div className="text-xs text-gray-300">Assistant</div>
                        <div className="flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-gray-300 dot-bounce" />
                          <span className="inline-block h-2 w-2 rounded-full bg-gray-300 dot-bounce" style={{ animationDelay: "120ms" }} />
                          <span className="inline-block h-2 w-2 rounded-full bg-gray-300 dot-bounce" style={{ animationDelay: "240ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input area with animated placeholder */}
                <div className="px-4 py-3 border-t border-white/6 flex items-center gap-3">
                  <div className="relative flex-1">
                    {/* actual input: text will be white */}
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="" /* hide native placeholder because we use animated one */
                      className="chat-input flex-1 rounded-full px-4 py-2 bg-transparent placeholder-gray-400 text-white focus:outline-none"
                      aria-label="Type your message"
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    />

                    {/* Animated placeholder overlay:
                        - shown only when input is empty AND not focused
                        - uses a CSS typewriter animation (runs once)
                    */}
                    <div
                      aria-hidden="true"
                      className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-opacity duration-150 ${
                        input || focused ? "placeholder-hidden" : ""
                      }`}
                    >
                      <span className="typing-placeholder once text-white/70 text-sm">
                        Type your question…
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={sendMessage}
                    disabled={loading || input.trim() === ""}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-transform duration-150 transform ${
                      loading || input.trim() === ""
                        ? "bg-white/18 text-black opacity-70 cursor-not-allowed"
                        : "bg-white text-black hover:scale-105 active:scale-95"
                    }`}
                    aria-label="Send message"
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="80" strokeLinecap="round" fill="none" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M2 21l21-9L2 3l7 9-7 9z" fill="currentColor" />
                      </svg>
                    )}
                    <span className="text-sm">{loading ? "…" : "Send"}</span>
                  </button>
                </div>
              </div>

              {/* decorative tail */}
              <div
                style={{
                  position: "absolute",
                  right: 26,
                  bottom: -9,
                  width: 18,
                  height: 18,
                  transform: "rotate(45deg)",
                  background: "rgba(2,6,23,0.96)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
