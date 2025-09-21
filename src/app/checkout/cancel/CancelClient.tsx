// src/app/checkout/cancel/CancelClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CancelClient() {
  const params = useSearchParams();
  const plan = params?.get("plan");
  const currency = params?.get("currency");
  const token = params?.get("token");

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#061028] to-[#082033] text-white flex items-center">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-tr from-white/4 to-white/2 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-10 sm:p-12 text-center">
              <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-white/6 border border-white/8">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Payment Cancelled</h1>

              <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
                You cancelled the PayPal checkout.
                {plan && currency ? (
                  <span className="block mt-2 text-gray-200">
                    <span className="text-gray-300">Plan:</span> <span className="font-medium">{plan}</span>{" "}
                    <span className="mx-2">•</span> <span className="font-medium">{currency}</span>
                  </span>
                ) : null}
              </p>

              {token ? (
                <div className="mt-7">
                  <div className="mx-auto max-w-md bg-white/6 border border-white/8 rounded-md p-3">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Transaction token</div>
                    <div className="font-mono text-sm text-white break-words bg-white/3 rounded px-3 py-2 select-all">
                      {token}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-rose-500 hover:bg-rose-600 transition text-sm sm:text-base font-semibold shadow-sm"
                >
                  Try checkout again
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/20 bg-white/6 hover:bg-white/8 transition text-sm sm:text-base"
                >
                  Back to Home
                </Link>
              </div>

              <p className="mt-6 text-xs text-gray-400">
                Need help? <Link href="/contact" className="underline">Contact support</Link> and provide the transaction token above.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} The Next Funnel — secure checkout powered by PayPal
          </div>
        </div>
      </div>
    </main>
  );
}
