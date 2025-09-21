// src/app/pricing/ClientCardCheckout.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

// dynamic import of the card component (Stripe Elements)
const CardCheckoutClient = dynamic(() => import("./CardCheckoutClient"), { ssr: false });

type Props = { planId: string };

export default function ClientCardCheckout({ planId }: Props) {
  // Add a small wrapper with width constraints so the card element cannot overflow
  return (
    <div className="w-full max-w-lg">
      <CardCheckoutClient planId={planId} />
    </div>
  );
}
