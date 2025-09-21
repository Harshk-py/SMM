"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter Growth",
  performance: "Performance Growth",
  automation: "Automation Growth",
};

type BannerState = {
  visible: boolean;
  plan?: string | null;
  amount?: string | null;
  message?: string | null;
};

export default function SuccessBannerClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<BannerState>({ visible: false });

  useEffect(() => {
    const payment = searchParams?.get("payment") ?? null; // e.g. "success"
    const plan = searchParams?.get("plan") ?? null; // e.g. "starter"
    const amt = searchParams?.get("amount") ?? null; // optional human-readable amount

    if (payment === "success") {
      setState({
        visible: true,
        plan,
        amount: amt,
        message: `Payment successful${plan ? ` — ${PLAN_LABELS[plan] ?? plan}` : ""}${amt ? ` (${amt})` : ""}`,
      });

      // Remove query params from URL after showing banner to avoid re-show on refresh
      // Build a clean URL without search params and replace current history entry
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("plan");
      url.searchParams.delete("amount");
      // use replace to avoid adding a history entry
      router.replace(url.pathname + url.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!state.visible) return;
    const t = window.setTimeout(() => setState((s) => ({ ...s, visible: false })), 6000);
    return () => clearTimeout(t);
  }, [state.visible]);

  if (!state.visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[min(96%,900px)] max-w-3xl px-4 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-black flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM10.2426 17.3137L5.92893 13.0001L7.34315 11.5859L10.2426 14.4854L16.6569 8.07112L18.0711 9.48534L10.2426 17.3137Z" />
        </svg>

        <div>
          <p className="font-semibold">{state.message ?? "Payment successful"}</p>
          <p className="text-sm text-black/80">{state.plan ? `${PLAN_LABELS[state.plan] ?? state.plan}` : "Thank you — we received your payment."}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/dashboard"
          className="inline-block px-3 py-1 rounded-full bg-black/10 text-black text-sm font-semibold hover:opacity-90 transition"
        >
          View dashboard
        </a>

        <button
          onClick={() => setState((s) => ({ ...s, visible: false }))}
          aria-label="Dismiss"
          className="rounded-full p-2 hover:bg-black/10"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
