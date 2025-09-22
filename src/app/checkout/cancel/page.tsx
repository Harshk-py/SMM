// src/app/checkout/cancel/page.tsx
import type { Metadata } from "next";
import CancelClient from "./CancelClient";

// ensure Next.js does not try to prerender this route
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout Cancelled - The Next Funnel",
  description:
    "Your payment was cancelled on PayPal. Return to pricing or continue browsing The Next Funnel.",
};

export default function CheckoutCancelPage() {
  return <CancelClient />;
}
