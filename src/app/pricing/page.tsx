// src/app/pricing/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import { getExchangeRate } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Pricing – The Next Funnel",
  description: "Pricing plans with automatic currency conversion based on location.",
};

// Cache this page for 1 hour so we don't re-fetch exchange rates on every request.
// Adjust as needed (e.g., 3600 seconds = 1 hour).
export const revalidate = 3600;

const CheckoutButtonClient = dynamic(() => import("./CheckoutButtonClient"), {
  ssr: false,
  loading: () => <div className="h-10" />,
});
const ClientPayModal = dynamic(() => import("./ClientPayModal"), {
  ssr: false,
  loading: () => <div />,
});
const SuccessBannerClient = dynamic(() => import("./SuccessBannerClient"), {
  ssr: false,
  loading: () => null,
});

/** Inline, tiny SVG for checkmark (avoids pulling react-icons into the bundle) */
function CheckIcon({ className = "w-4 h-4 flex-none" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
    >
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const PLANS = [
  {
    id: "starter",
    name: "Starter Boost",
    usd: 99,
    bullets: [
      "12–15 Social Media Posts (Static + Carousels)",
      "Basic Video Editing (5 Reels)",
      "Monthly Content Calendar",
      "Instagram Page Optimization",
      "Only Instagram",
    ],
  },
  {
    id: "performance",
    name: "Performance Pro",
    usd: 199,
    bullets: [
      "FREE Logo Designing",
      "20–25 Posts (Static + Carousels)",
      "Advanced Video Editing (10 Reels/Shorts) ",
      "Meta Ads Management",
      "Analytics & Growth Reports",
      "Only Instagram, Facebook and Youtube",
    ],
  },
  {
    id: "premium",
    name: "Premium Growth",
    usd: 599,
    bullets: [
      "Performance Pro Plan Included",
      "Instagram DM Automation",
      "Sales Funnels + Landing Pages (High-Converting)",
      "Email Marketing (Automated Nurture + Campaigns)",
      "Full Web Development + Lead Automation System",
      "Advanced Scaling Across Instagram, Facebook, YouTube & Pinterest",
    ],
  },
];

const CURRENCY_META: Record<string, { code: string; locale?: string }> = {
  USD: { code: "USD", locale: "en-US" },
  INR: { code: "INR", locale: "en-IN" },
  GBP: { code: "GBP", locale: "en-GB" },
  AUD: { code: "AUD", locale: "en-AU" },
  CAD: { code: "CAD", locale: "en-CA" },
  AED: { code: "AED", locale: "en-AE" },
};

export default async function PricingPage() {
  const cookieStore = await cookies();
  const currencyFromCookie = cookieStore.get("NF_CURRENCY")?.value ?? "USD";
  const currencyMeta = CURRENCY_META[currencyFromCookie] ?? { code: currencyFromCookie };

  let rate = 1;
  try {
    // Keep exchange rate fetching server-side but resilient.
    // If getExchangeRate already has internal caching, great — otherwise consider caching at lib level.
    rate = await getExchangeRate(currencyMeta.code);
    if (!rate || typeof rate !== "number" || Number.isNaN(rate) || rate <= 0) rate = 1;
  } catch (err) {
    // swallow errors — fallback to 1 so site remains usable even if the rate service fails
    rate = 1;
  }

  const format = (usdAmount: number) => {
    const converted = Math.round(usdAmount * rate);
    try {
      return new Intl.NumberFormat(currencyMeta.locale ?? undefined, {
        style: "currency",
        currency: currencyMeta.code,
        maximumFractionDigits: 0,
      }).format(converted);
    } catch {
      return `${currencyMeta.code} ${converted}`;
    }
  };

  return (
    <main className="relative min-h-screen py-16 bg-gradient-to-r from-[#061221] via-[#07263e] to-[#0f3b5b] text-white">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <SuccessBannerClient />

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Pricing Plans</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Prices shown in <span className="font-semibold">{currencyMeta.code}</span>. Rates are updated periodically.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((p) => {
            const isFeatured = p.id === "performance";

            const bgClass =
              p.id === "starter"
                ? "bg-gradient-to-b from-[#06283a] to-[#094d66]"
                : p.id === "performance"
                ? "bg-gradient-to-b from-[#3b185f] to-[#6a2ea6]"
                : "bg-gradient-to-b from-[#0b2f2f] to-[#0f6b5a]";

            return (
              <article
                key={p.id}
                className={`p-6 md:p-8 rounded-2xl border ${bgClass} ${
                  isFeatured ? "border-white/10 shadow-2xl" : "border-white/6"
                } flex flex-col justify-between`}
              >
                <div>
                  {isFeatured && (
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-black font-semibold text-sm mb-4">
                      Recommended
                    </div>
                  )}

                  <h3 className="text-xl font-semibold mb-2">{p.name}</h3>

                  <div className="flex items-baseline gap-3 mb-3">
                    <span className={`font-extrabold ${isFeatured ? "text-4xl md:text-5xl" : "text-3xl"}`}>
                      {format(p.usd)}
                    </span>
                    <span className="text-sm text-gray-300">/month</span>
                  </div>

                  <ul className="space-y-3 text-gray-200 mb-4">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 text-green-400"><CheckIcon /></span>
                        <span className="text-sm leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/6">
                  <div className="space-y-3">
                    <CheckoutButtonClient
                      planId={p.id}
                      usdAmount={p.usd}
                      currency={currencyMeta.code}
                      variant={isFeatured ? "featured" : "default"}
                    />

                    <div className="mt-1">
                      <ClientPayModal planId={p.id} />
                    </div>

                    <div className="text-center mt-2">
                      <a
                        href={`/contact?plan=${encodeURIComponent(p.id)}`}
                        className="text-sm text-gray-300 underline"
                        aria-label={`Contact us about the ${p.name} plan`}
                      >
                        Or contact us about this plan
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-12 bg-white/6 border border-white/6 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xl font-semibold">Need a tailored plan?</h4>
            <p className="text-gray-300 max-w-xl">
              Let’s build one for your brand. We’ll combine the right mix of content, automation, and ads to match your goals.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="/custom-plan" className="px-6 py-3 rounded-full font-semibold bg-white text-black">
              Build My Custom Plan
            </a>
          </div>
        </section>

        <footer className="mt-10 text-center text-gray-400">
          <p className="text-sm">Prices shown are converted estimates. Final pricing at checkout may vary.</p>
        </footer>
      </div>
    </main>
  );
}
