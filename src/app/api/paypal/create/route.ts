// src/app/api/paypal/create/route.ts
import { NextResponse } from "next/server";
import { createOrderServerSide } from "@/lib/paypal";
import { getExchangeRate } from "@/lib/currency";

/**
 * Server-side canonical plan prices (USD). Always use server-side mapping.
 */
const PLAN_PRICES_USD: Record<string, number> = {
  starter: 299,
  performance: 599,
  premium: 2499,
  automation: 999,
};

const ALLOWED_CURRENCIES = new Set([
  "USD",
  "INR",
  "GBP",
  "AUD",
  "CAD",
  "AED",
  "EUR",
  "JPY",
  "SGD",
]);

type BodyShape = {
  planId?: string;
  currency?: string;
  amount?: string | number;
};

/** Resolve an absolute base URL for the app.
 *  Order of precedence:
 *   1. NEXT_PUBLIC_BASE_URL (recommended)
 *   2. SITE_URL
 *   3. VERCEL_URL (provided by Vercel) — prefixed with https://
 */
function resolveBaseUrl(): string {
  const envBase = (process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || "").replace(/\/$/, "");
  if (envBase) return envBase;
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }
  throw new Error(
    "No base URL configured. Set NEXT_PUBLIC_BASE_URL or SITE_URL in Vercel (or ensure VERCEL_URL is available)."
  );
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as BodyShape;
    const planId = String(body.planId || "").trim();

    // Keep the original requested currency for return/cancel links and client display
    const requestedCurrencyRaw = String(body.currency || "USD");
    const requestedCurrency = requestedCurrencyRaw.toUpperCase();

    // Server-side validation: planId must exist
    if (!planId || typeof PLAN_PRICES_USD[planId] === "undefined") {
      return NextResponse.json({ error: "invalid planId" }, { status: 400 });
    }

    // Normalize currency and fallback to USD when unknown
    let currency = requestedCurrency;
    if (!ALLOWED_CURRENCIES.has(currency)) {
      currency = "USD";
    }

    // IMPORTANT: PayPal does NOT support INR in many regions — force PayPal orders to USD
    // If the user requested INR (or some unsupported PayPal currency), we will still show/return the requestedCurrency
    // but create the PayPal order in USD.
    const payPalCurrency = currency === "INR" ? "USD" : currency;

    // Canonical USD amount (server-side source of truth)
    const amountUsd = Number(PLAN_PRICES_USD[planId]);

    // Convert to the currency that will be used for PayPal (payPalCurrency).
    // If payPalCurrency is USD this is just amountUsd; otherwise convert USD -> target.
    let amountForPayPal = amountUsd;
    if (payPalCurrency !== "USD") {
      try {
        const rate = await getExchangeRate(payPalCurrency);
        if (!rate || typeof rate !== "number" || rate <= 0) {
          throw new Error("invalid exchange rate");
        }
        amountForPayPal = Number((amountUsd * rate).toFixed(2));
      } catch (err) {
        // If conversion fails, fall back to USD amount and use USD as payPal currency
        console.warn("Exchange rate fetch failed, falling back to USD for PayPal:", err);
        amountForPayPal = amountUsd;
      }
    } else {
      // payPalCurrency === "USD"
      amountForPayPal = amountUsd;
    }

    const amountStr = Number(amountForPayPal).toFixed(2);

    // Resolve base URL and build return/cancel using the user's originally requested currency
    const baseUrl = resolveBaseUrl(); // will throw a helpful error if none
    const returnUrl = `${baseUrl}/checkout/success?plan=${encodeURIComponent(planId)}&currency=${encodeURIComponent(
      requestedCurrency
    )}`;
    const cancelUrl = `${baseUrl}/checkout/cancel?plan=${encodeURIComponent(planId)}&currency=${encodeURIComponent(
      requestedCurrency
    )}`;

    // Create PayPal order using payPalCurrency and the computed amountForPayPal
    const order = await createOrderServerSide({
      amount: amountStr,
      currency: payPalCurrency,
      returnUrl,
      cancelUrl,
      customId: planId,
    } as any);

    const orderId = order?.id ?? null;
    const approveUrl = order?.links?.find((l: any) => l.rel === "approve")?.href ?? null;

    if (!orderId || !approveUrl) {
      console.error("PayPal order created but missing fields:", { order });
      return NextResponse.json({ error: "failed to create PayPal order or approval link" }, { status: 500 });
    }

    // Return the PayPal order info and also include the originally requested currency
    return NextResponse.json({
      ok: true,
      orderId,
      approveUrl,
      amount: amountStr,
      currency: payPalCurrency, // the actual currency used for PayPal
      requestedCurrency, // what the user originally requested (INR, USD, etc.)
      planId,
    });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: err?.message ?? "create order failed" }, { status: 500 });
  }
}
