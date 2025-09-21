"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = { orderId: string };

export default function CheckoutWaitClient({ orderId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const cancelledRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);

  useEffect(() => {
    if (!orderId) {
      setError("Order ID missing.");
      setLoading(false);
      return;
    }

    // Reset refs & UI state
    cancelledRef.current = false;
    attemptsRef.current = 0;
    setAttempts(0);
    setError(null);
    setStatus(null);
    setLoading(true);

    const maxAttempts = 100; // safety cap
    const intervalMs = 3000;

    async function checkOnce() {
      if (cancelledRef.current) return;
      setLoading(true);

      try {
        // increment attempts counters (UI + ref)
        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);

        const res = await fetch(`/api/paypal/check?orderId=${encodeURIComponent(orderId)}`, { cache: "no-store" });
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = json?.error || `Status check failed (code ${res.status})`;
          setError(msg);
          setLoading(false);
          // stop polling on server errors
          cancelledRef.current = true;
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }

        const s = json?.status ?? null;
        setStatus(s);
        setError(null);

        // If server indicates captured/completed, redirect to success
        if (s === "COMPLETED" || json?.captured === true) {
          setLoading(false);
          cancelledRef.current = true;
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // navigate to success page (replace so back doesn't re-open wait)
          router.replace(`/checkout/success?token=${encodeURIComponent(orderId)}`);
          return;
        }

        // Timeout check
        if (attemptsRef.current >= maxAttempts) {
          setError("Timed out waiting for payment. Please check your PayPal tab or contact support.");
          setLoading(false);
          cancelledRef.current = true;
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
      } catch (err: any) {
        console.error("Polling error:", err);
        setError(String(err?.message || err));
        // keep polling — network hiccups may resolve
      } finally {
        setLoading(false);
      }
    }

    // run first check immediately
    checkOnce();

    // schedule repeated checks
    timerRef.current = window.setInterval(() => {
      if (cancelledRef.current) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }
      checkOnce();
    }, intervalMs);

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // intentionally depend only on orderId (router is stable)
  }, [orderId]);

  async function manualCheck() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/paypal/check?orderId=${encodeURIComponent(orderId)}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json?.error || `Status check failed (code ${res.status})`);
        setLoading(false);
        return;
      }

      const s = json?.status ?? null;
      setStatus(s);

      if (s === "COMPLETED" || json?.captured === true) {
        // stop polling and navigate
        cancelledRef.current = true;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        router.replace(`/checkout/success?token=${encodeURIComponent(orderId)}`);
        return;
      }
    } catch (err: any) {
      console.error("Manual check error:", err);
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  function handleStopWaiting() {
    cancelledRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    router.push("/pricing");
  }

  return (
    <div className="max-w-xl mx-auto text-center bg-white/5 p-8 rounded-lg">
      <h2 className="text-2xl font-bold mb-3">Waiting for payment approval…</h2>
      <p className="text-gray-300 mb-4">
        We are checking the payment status. If you were redirected to PayPal, complete the payment there — this page will update automatically.
      </p>

      <div className="mb-4" aria-live="polite">
        <p className="text-sm text-gray-200">
          Order ID: <span className="font-mono break-all">{orderId}</span>
        </p>
        <p className="text-sm text-gray-200">
          Status:{" "}
          <span className="font-semibold">{status ?? (loading ? "checking…" : "pending")}</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">Attempts: {attempts}</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* spinner */}
          <svg
            aria-hidden="true"
            className={`w-5 h-5 animate-spin ${loading ? "text-white" : "text-white/40"}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-sm text-gray-200">{loading ? "Checking…" : "Idle"}</span>
        </div>

        <button
          onClick={manualCheck}
          className="px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition text-sm"
          aria-disabled={loading}
        >
          Retry now
        </button>

        <button
          onClick={handleStopWaiting}
          className="px-3 py-2 rounded-full border border-white/10 hover:bg-white/5 transition text-sm"
        >
          Stop waiting
        </button>
      </div>

      {error && <p className="text-sm text-amber-300 mb-3">{error}</p>}

      <div className="flex gap-3 justify-center">
        <Link href="/pricing" className="px-4 py-2 rounded-full bg-white/10">
          Return to Pricing
        </Link>
        <Link href={`/checkout/success?token=${encodeURIComponent(orderId)}`} className="px-4 py-2 rounded-full border border-white/10">
          Open Receipt (manual)
        </Link>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        If the PayPal tab was closed without completing, try again or contact support.
      </p>
    </div>
  );
}
