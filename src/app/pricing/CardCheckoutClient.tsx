"use client";

import React, { useState } from "react";

type Props = {
  planId: string;
  variant?: "featured" | "default";
};

export default function CardCheckoutClient({ planId, variant = "default" }: Props) {
  const [copied, setCopied] = useState(false);
  const contactEmail = "thenextfunnel@gmail.com";

  async function handleCopyEmail() {
    try {
      await navigator.clipboard?.writeText(contactEmail);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${contactEmail}`;
    }
  }

  return (
    <div
      className={`p-4 max-w-lg mx-auto rounded-lg shadow ${
        variant === "featured" ? "border-2 border-green-500" : "border"
      } bg-white/5`}
    >
      <h3 className="text-lg font-semibold mb-2">Payments temporarily disabled</h3>
      <p className="mb-4 text-sm">
        Online card payments are currently unavailable. If you’re interested in the{" "}
        <strong>{planId}</strong> plan, please reach us at{" "}
        <span className="font-semibold">{contactEmail}</span>.
      </p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopyEmail}
          className="px-3 py-2 rounded border bg-white/6 hover:bg-white/10 transition"
          aria-label="Copy contact email"
        >
          {copied ? "Copied!" : "Copy email"}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        💡 If you’d like to pay via <span className="font-semibold">UPI</span>,{" "}
        <span className="font-semibold">Bank Transfer</span>, or any other method, just contact us and we’ll share the details.
      </p>
    </div>
  );
}
