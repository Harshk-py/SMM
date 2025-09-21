// src/app/checkout/success/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { captureOrderServerSide, getAccessToken } from "@/lib/paypal";
import { getExchangeRate } from "@/lib/currency";
import CheckoutRedirectClient from "../CheckoutRedirectClient";

export const metadata: Metadata = {
  title: "Checkout Success – The Next Funnel",
  description: "Thank you — payment successful. Order receipt and details.",
};

type Props = {
  searchParams: { [key: string]: string | undefined };
};

const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const PAYPAL_API =
  PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

const PLAN_PRICES_USD: Record<string, number> = {
  starter: 299,
  performance: 599,
  automation: 999,
};

async function fetchOrderFromPayPal(orderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch PayPal order: ${res.status} ${text}`);
  }
  return res.json();
}

function parseCaptureOrOrder(result: any) {
  const status = result?.status ?? null;
  const payer = result?.payer ?? null;

  let amountValue: string | null = null;
  let currency: string | null = null;

  const pu = result?.purchase_units?.[0] ?? null;
  const captureFromPu = pu?.payments?.captures?.[0] ?? null;
  const captureFromResult = result?.purchase_units?.[0]?.payments?.captures?.[0] ?? null;
  const capture = captureFromPu || captureFromResult || null;
  const amountObj = capture?.amount ?? pu?.amount ?? null;

  if (amountObj) {
    amountValue = amountObj?.value ?? amountObj?.amount?.value ?? null;
    currency = amountObj?.currency_code ?? amountObj?.currency ?? null;
  }

  if (!amountValue && result?.amount) {
    amountValue = result.amount?.value ?? null;
    currency = result.amount?.currency_code ?? result.amount?.currency ?? currency;
  }

  const payerName =
    ((payer?.name?.given_name ?? "") + (payer?.name?.family_name ? ` ${payer?.name?.family_name}` : "")).trim() ||
    null;
  const payerEmail = payer?.email_address ?? null;

  return { status, payerName, payerEmail, amountValue, currency };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const orderId = (searchParams?.token ?? searchParams?.orderId ?? searchParams?.id ?? null) as string | null;
  const planParam = (searchParams?.plan ?? null) as string | null;
  const incomingCurrency = (searchParams?.currency ?? null)?.toUpperCase() ?? null;

  let displayPrice: string | null = null;
  if (planParam && PLAN_PRICES_USD[planParam]) {
    const usd = PLAN_PRICES_USD[planParam];

    if (incomingCurrency && incomingCurrency !== "USD") {
      try {
        const rate = await getExchangeRate(incomingCurrency);
        if (rate && typeof rate === "number" && rate > 0) {
          const converted = usd * rate;
          try {
            displayPrice = new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: incomingCurrency,
              maximumFractionDigits: 2,
            }).format(converted);
          } catch {
            displayPrice = `${incomingCurrency} ${converted.toFixed(2)}`;
          }
        }
      } catch {
        displayPrice = null;
      }
    }

    if (!displayPrice) {
      try {
        displayPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
        }).format(usd);
      } catch {
        displayPrice = `USD ${usd}`;
      }
    }
  }

  if (!orderId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
        <div className="max-w-lg text-center bg-white/5 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">No order found</h1>
          <p className="text-gray-300 mb-4">We couldn't detect an order token in the URL.</p>

          {planParam && (
            <p className="text-gray-300 mb-4">
              Attempted plan: <span className="font-semibold">{planParam}</span>{" "}
              {displayPrice && <span>— {displayPrice}</span>}
            </p>
          )}

          <Link href="/" className="inline-block px-5 py-2 bg-white/10 rounded-full">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  try {
    let captureResult: any = null;
    try {
      captureResult = await captureOrderServerSide(orderId);
    } catch (captureErr: any) {
      console.warn("captureOrderServerSide failed; falling back to fetching order:", captureErr?.message ?? captureErr);
      captureResult = null;
    }

    let parsed: ReturnType<typeof parseCaptureOrOrder>;
    let rawResult: any = null;

    if (captureResult) {
      rawResult = captureResult;
      parsed = parseCaptureOrOrder(captureResult);
    } else {
      try {
        const order = await fetchOrderFromPayPal(orderId);
        rawResult = order;
        parsed = parseCaptureOrOrder(order);
      } catch (fetchErr: any) {
        console.error("Error fetching order after capture failure:", fetchErr);
        return (
          <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
            <div className="max-w-lg text-center bg-white/5 p-8 rounded-2xl">
              <h1 className="text-2xl font-bold mb-4">Payment verification failed</h1>
              <p className="text-gray-300 mb-4">
                We couldn't verify your payment at this time. If your card was charged, please contact support with your order ID.
              </p>

              <p className="font-mono break-all mb-4">{orderId}</p>

              <Link href="/contact" className="inline-block px-5 py-2 bg-white/10 rounded-full">
                Contact Support
              </Link>
            </div>
          </main>
        );
      }
    }

    const { status, payerName, payerEmail, amountValue, currency } = parsed;

    if (status === "COMPLETED") {
      const humanAmount =
        amountValue && currency
          ? new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amountValue))
          : displayPrice ?? null;

      const planQuery = planParam ? `&plan=${encodeURIComponent(planParam)}` : "";
      const amountQuery = humanAmount ? `&amount=${encodeURIComponent(humanAmount)}` : "";
      const redirectUrl = `/pricing?payment=success${planQuery}${amountQuery}`;

      const originalQs = new URLSearchParams(searchParams as Record<string, string>).toString();
      const manualReceiptUrl = `/checkout/success?${originalQs}`;

      return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
          <div className="w-full max-w-3xl">
            <div className="bg-white/5 p-8 rounded-2xl">
              <h1 className="text-2xl font-bold mb-4">Payment Completed</h1>
              <p className="text-gray-300 mb-4">Thanks — your payment was captured. Redirecting to pricing with your receipt…</p>

              <CheckoutRedirectClient url={redirectUrl} delayMs={700} />

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={redirectUrl} className="px-4 py-2 rounded-full bg-white/10">
                  Go now
                </Link>
                <Link href={manualReceiptUrl} className="px-4 py-2 rounded-full border border-white/10">
                  View receipt (manual)
                </Link>
              </div>

              <div className="mt-4 text-center text-sm text-gray-400">
                {payerName && <div>Paid by: <span className="font-semibold">{payerName}</span></div>}
                {payerEmail && <div>Email: <span className="font-mono">{payerEmail}</span></div>}
              </div>
            </div>
          </div>
        </main>
      );
    }

    // Not completed block
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
        <div className="max-w-lg text-center bg-white/5 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Payment not completed</h1>

          <p className="text-gray-300 mb-4">
            Order <span className="font-mono break-all">{orderId}</span> currently has status: <strong>{status ?? "UNKNOWN"}</strong>.
          </p>

          {planParam && (
            <p className="text-gray-300 mb-3">
              Attempted plan: <span className="font-semibold">{planParam}</span> {displayPrice && <span>— {displayPrice}</span>}
            </p>
          )}

          <p className="text-gray-300 mb-4">
            If you approved payment in PayPal, it may still be processing. Try again in a few moments or contact support.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/checkout/wait?orderId=${encodeURIComponent(orderId)}`} className="px-4 py-2 rounded-full bg-white/10">
              Retry wait
            </Link>
            <Link href="/pricing" className="px-4 py-2 rounded-full border border-white/10">
              Return to Pricing
            </Link>
            <Link href={`/contact?orderId=${encodeURIComponent(orderId)}`} className="px-4 py-2 rounded-full border border-white/10">
              Contact Support
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (err: any) {
    console.error("Capture flow error:", err);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white p-8">
        <div className="max-w-lg text-center bg-white/5 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-4">Payment capture failed</h1>
          <p className="text-gray-300 mb-6">
            There was an error finalizing your payment. If your PayPal account shows the payment as completed, contact support with your order ID:
          </p>
          <p className="font-mono break-all mb-4">{orderId}</p>

          <Link href="/contact" className="inline-block px-5 py-2 bg-white/10 rounded-full">
            Contact Support
          </Link>
        </div>
      </main>
    );
  }
}
