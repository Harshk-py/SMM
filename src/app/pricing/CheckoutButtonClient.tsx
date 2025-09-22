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
  const [rzLoading, setRzLoading] = useState(false);

  // ----- PayPal flow (unchanged) -----
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

      if (approveUrl) {
        try {
          window.location.href = approveUrl;
          return;
        } catch (e) {
          console.warn("Same-tab redirect failed, falling back to new-tab.", e);
        }
      }

      if (orderId) {
        window.location.href = `/checkout/wait?orderId=${encodeURIComponent(orderId)}`;
        return;
      }

      if (approveUrl) {
        const opened = window.open(approveUrl, "_blank", "noopener,noreferrer");
        if (opened) {
          if (orderId) {
            window.location.href = `/checkout/wait?orderId=${encodeURIComponent(orderId)}`;
            return;
          } else {
            alert("PayPal opened in a new tab. If it doesn't load, try again or contact support.");
            setLoading(false);
            return;
          }
        } else {
          alert("Could not open PayPal. Please check your browser popup blocker or try again.");
          setLoading(false);
          return;
        }
      }

      alert("Approval URL missing. Please try again or contact support.");
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Checkout failed: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
    }
  }

  // ----- Razorpay helpers & flow (new) -----
  async function loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
  }

  async function handleRazorpayPay() {
    if (rzLoading) return;
    setRzLoading(true);

    try {
      // 1) Create order server-side (server should return order and keyId)
      //    Expect: { ok:true, order:{ id, amount, currency }, keyId, amount, currency }
      const res = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        alert("Could not create Razorpay order: " + (json?.error || "unknown"));
        setRzLoading(false);
        return;
      }

      // 2) load checkout
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      // 3) open Razorpay modal
      const options: any = {
        key: json.keyId, // public key from server
        name: "The Next Funnel",
        description: `${planId} plan`,
        order_id: json.order?.id,
        amount: json.order?.amount, // paise integer
        currency: json.order?.currency || "INR",
        // Optional: prefill user details if available
        prefill: {
          // name: "Customer Name",
          // email: "customer@example.com",
        },
        handler: async function (response: any) {
          // response contains razorpay_order_id, razorpay_payment_id, razorpay_signature
          try {
            const vr = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const vjson = await vr.json().catch(() => ({}));
            if (vr.ok && vjson.ok) {
              // successful payment — redirect to your success page
              // include plan, currency and payment id in query so existing success page can show receipt
              window.location.href = `/checkout/success?plan=${encodeURIComponent(planId)}&currency=INR&payment=razorpay&pid=${encodeURIComponent(response.razorpay_payment_id)}`;
            } else {
              alert("Payment verification failed: " + (vjson.error || "unknown"));
            }
          } catch (err: any) {
            console.error("verify error:", err);
            alert("Payment verification failed.");
          }
        },
        modal: {
          // optional modal settings
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay flow error:", err);
      alert(err?.message || "Razorpay error");
    } finally {
      setRzLoading(false);
    }
  }

  // ----- UI -----
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Row: PayPal button */}
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

      {/* Row: Razorpay button */}
      <button
        onClick={handleRazorpayPay}
        disabled={rzLoading}
        aria-busy={rzLoading}
        aria-label={`Pay with Razorpay for ${planId} plan`}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold shadow-md transition
          ${rzLoading ? "opacity-70 cursor-wait" : ""}
          bg-blue-400 hover:brightness-90 text-[#111]`}
      >
        {rzLoading ? "Processing…" : <span>Pay with Razorpay</span>}
      </button>
    </div>
  );
}
