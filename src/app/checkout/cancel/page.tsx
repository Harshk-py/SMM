// src/app/checkout/cancel/page.tsx
import type { Metadata } from "next";
import loadDynamic from "next/dynamic";

// ensure Next doesn't try to statically prerender this route
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout Cancelled - The Next Funnel",
  description: "Your payment was cancelled on PayPal. Return to pricing or continue browsing The Next Funnel.",
};

// load the client component only in the browser
const CancelClient = loadDynamic(() => import("./CancelClient"), { ssr: false });

export default function CheckoutCancelPage() {
  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <CancelClient />
    </main>
  );
}
