// src/app/pricing/CheckoutButtonClient.tsx
"use client";

import React, { useState } from "react";
import { FaPaypal } from "react-icons/fa";

type Props = {
  planId: string;
  usdAmount: number;
  currency?: string;
  variant?: "featured" | "default";
};

export default function CheckoutButtonClient({
  planId,
  usdAmount,
  currency = "USD",
  variant = "default",
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, amount: usdAmount.toFixed(2), currency }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Error creating order: " + (data?.error || "Unknown error"));
        setLoading(false);
        return;
      }

      const approveUrl = data?.approveUrl as string | undefined;
      const orderId = data?.orderId as string | undefined;

      // Preferred flow: navigate current tab to PayPal (so return/cancel land back in same tab)
      if (approveUrl) {
        try {
          // Try same-tab navigation first. This is the most reliable for PayPal redirects.
          window.location.href = approveUrl;
          // do not setLoading(false) — navigation will unload the page
          return;
        } catch (e) {
          // fallback below if assigning fails for some reason
          console.warn("Same-tab redirect failed, falling back to new-tab.", e);
        }
      }

      // If approveUrl missing but we have orderId, send user to the wait page that polls the order
      if (orderId) {
        // If PayPal didn't give an approve URL we show a wait page that will poll status.
        window.location.href = `/checkout/wait?orderId=${encodeURIComponent(orderId)}`;
        return;
      }

      // As a last resort: try opening a new tab (some browsers may block programmatic new tabs unless user gesture)
      if (approveUrl) {
        const opened = window.open(approveUrl, "_blank", "noopener,noreferrer");
        if (opened) {
          // If new tab opened, navigate current tab to a wait page that polls order status (if we have orderId)
          if (orderId) {
            window.location.href = `/checkout/wait?orderId=${encodeURIComponent(orderId)}`;
            return;
          } else {
            // If we don't have an order id, show a helpful message and leave the page as-is
            alert("PayPal opened in a new tab. If it doesn't load, try again or contact support.");
            setLoading(false);
            return;
          }
        } else {
          // popup blocked — show helpful error
          alert("Could not open PayPal. Please check your browser popup blocker or try again.");
          setLoading(false);
          return;
        }
      }

      // Nothing usable returned from server
      alert("Approval URL missing. Please try again or contact support.");
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err?.message || "unknown"));
    } finally {
      // If user was redirected the page unloads and this isn't used. Otherwise re-enable.
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      aria-busy={loading}
      aria-label={`Pay with PayPal for ${planId} plan`}
      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold shadow-md transition
        ${loading ? "opacity-70 cursor-wait" : ""}
        bg-[#FFC439] hover:bg-[#f7b600] text-[#111]`}
    >
      {loading ? "Processing…" : (
        <>
          <FaPaypal className="text-xl text-[#003087]" />
          <span>Pay with PayPal</span>
        </>
      )}
    </button>
  );
}
