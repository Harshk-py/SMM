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

// ⚡ Hardcode dev origin to port 3001
const ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as BodyShape;
    const planId = String(body.planId || "").trim();
    let currency = String(body.currency || "USD").toUpperCase();

    // Validate planId (server is source of truth)
    if (!planId || typeof PLAN_PRICES_USD[planId] === "undefined") {
      return NextResponse.json({ error: "invalid planId" }, { status: 400 });
    }

    // Validate currency; fallback to USD if unknown
    if (!ALLOWED_CURRENCIES.has(currency)) {
      currency = "USD";
    }

    // Canonical USD amount (server-side)
    const amountUsd = Number(PLAN_PRICES_USD[planId]);

    // Convert to requested currency server-side if needed
    let amountForPayPal = amountUsd;
    if (currency !== "USD") {
      try {
        const rate = await getExchangeRate(currency);
        if (!rate || typeof rate !== "number" || rate <= 0) {
          throw new Error("invalid exchange rate");
        }
        amountForPayPal = Number((amountUsd * rate).toFixed(2));
      } catch (err) {
        console.warn("Exchange rate fetch failed, falling back to USD:", err);
        currency = "USD";
        amountForPayPal = amountUsd;
      }
    }

    const amountStr = Number(amountForPayPal).toFixed(2);

    // Build return and cancel URLs always on port 3001
    const returnUrl = `${ORIGIN}/checkout/success?plan=${encodeURIComponent(planId)}&currency=${encodeURIComponent(currency)}`;
    const cancelUrl = `${ORIGIN}/checkout/cancel?plan=${encodeURIComponent(planId)}&currency=${encodeURIComponent(currency)}`;

    const order = await createOrderServerSide({
      amount: amountStr,
      currency,
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

    return NextResponse.json({
      ok: true,
      orderId,
      approveUrl,
      amount: amountStr,
      currency,
      planId,
    });
  } catch (err: any) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: err?.message ?? "create order failed" }, { status: 500 });
  }
}
