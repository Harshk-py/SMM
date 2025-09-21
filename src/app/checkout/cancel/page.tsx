// src/app/checkout/cancel/page.tsx
import type { Metadata } from "next";
import CancelClient from "./CancelClient";

export const metadata: Metadata = {
  title: "Checkout Cancelled – The Next Funnel",
  description:
    "Your payment was cancelled on PayPal. Return to pricing or continue browsing The Next Funnel.",
};

export default function CheckoutCancelPage() {
  // Server component: render the client-side UI component
  return <CancelClient />;
}
