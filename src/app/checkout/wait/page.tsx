// src/app/checkout/wait/page.tsx
import type { Metadata } from "next";
import CheckoutWaitClient from "./CheckoutWaitClient";

export const metadata: Metadata = {
  title: "Waiting for payment – The Next Funnel",
  description: "Waiting for PayPal approval...",
};

type Props = { searchParams: { [key: string]: string | undefined } };

export default function CheckoutWaitPage({ searchParams }: Props) {
  const orderId = searchParams?.orderId ?? searchParams?.token ?? "";

  // If no orderId, show a helpful message instead of an empty/ugly page
  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
        <div className="max-w-lg text-center bg-white/5 p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold mb-4">No order to wait for</h1>
          <p className="text-gray-300 mb-4">We couldn't find an order ID in the URL. If you just started checkout, try again from the pricing page.</p>

          <div className="flex gap-3 justify-center">
            <a href="/pricing" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition">Return to Pricing</a>
            <a href="/" className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition">Home</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
      <div className="w-full max-w-3xl">
        <CheckoutWaitClient orderId={orderId} />
      </div>
    </main>
  );
}
