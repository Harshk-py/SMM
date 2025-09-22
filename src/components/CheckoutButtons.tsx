// src/app/pricing/ClientPayModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import CheckoutButtons from "@/components/CheckoutButtons";

type Props = {
  planId: string;
  usdAmount?: number;
  currency?: string;
};

export default function ClientPayModal({
  planId,
  usdAmount = 0,
  currency = "USD",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full">
      {/* Visible trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-4 py-2 rounded-full bg-white text-black font-semibold"
      >
        Purchase plan
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-[#081428] border border-white/6 rounded-2xl p-6 shadow-xl">
            <header className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Purchase Plan</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1"
              >
                ✕
              </button>
            </header>

            <div className="space-y-4">
              <CheckoutButtons
                planId={planId}
                usdAmount={usdAmount}
                currency={currency}
              />

              <div className="text-sm text-gray-300">
                <p>
                  If you prefer another payment method, contact us by email and
                  we’ll send instructions.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-full border border-white/10 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
