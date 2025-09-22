// src/components/RazorpayButton.tsx
"use client";

import React, { useState } from "react";

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

export default function RazorpayButton({ planId }: { planId: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        console.error("Create order failed:", json);
        alert(json.error || "Could not create Razorpay order. Check server logs.");
        setLoading(false);
        return;
      }

      // Order object from server (Razorpay returns amount in paise)
      const order = json.order || null;
      if (!order || !order.id) {
        console.error("Invalid order data from server:", json);
        alert("Invalid order data received from server.");
        setLoading(false);
        return;
      }

      // Ensure we have an integer amount in paise. Prefer server-provided order.amount.
      let amountPaise: number | null = null;
      if (typeof order.amount === "number" && Number.isInteger(order.amount)) {
        amountPaise = order.amount;
      } else if (typeof json.amount === "string" || typeof json.amount === "number") {
        // server returned human-readable amount (e.g. "599.00") -> convert to paise
        const maybe = Number(json.amount);
        if (!Number.isNaN(maybe)) {
          amountPaise = Math.round(maybe * 100);
        }
      }

      if (amountPaise === null) {
        console.warn("Could not determine amount in paise. Order object:", order, "json.amount:", json.amount);
        // Still allow checkout if order.amount exists (Razorpay will use server-side order)
      }

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options: any = {
        key: json.keyId || json.key || "", // public key from server
        name: "The Next Funnel",
        description: `${planId} plan`,
        order_id: order.id,
        amount: amountPaise ?? order.amount, // prefer integer paise, fallback to server order.amount
        currency: order.currency || json.currency || "INR",
        prefill: {
          // optional: name/email if you have them in client
        },
        handler: async function (response: any) {
          // verify server-side
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyJson = await verifyRes.json().catch(() => ({}));
            if (verifyRes.ok && verifyJson.ok) {
              window.location.href = `/checkout/success?plan=${encodeURIComponent(
                planId
              )}&currency=INR&payment=razorpay&pid=${encodeURIComponent(response.razorpay_payment_id)}`;
            } else {
              console.error("Verification failed:", verifyJson);
              alert("Payment verification failed: " + (verifyJson.error || "unknown"));
            }
          } catch (err) {
            console.error("Verification request error:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          // optional configuration
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error("Razorpay flow error:", err);
      alert(err?.message ?? "Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      aria-busy={loading}
      aria-label={`Pay with Razorpay for ${planId} plan`}
      className="px-6 py-3 rounded bg-amber-400 disabled:opacity-60 disabled:cursor-wait"
    >
      {loading ? "Processing…" : "Pay with Razorpay"}
    </button>
  );
}
