// src/app/api/razorpay/create/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getExchangeRate } from "@/lib/currency";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  // This will fail at import time in dev/build if env vars missing — helpful for early feedback.
  console.error("Missing Razorpay env vars: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
}

const razorpay = new Razorpay({
  key_id: KEY_ID || "",
  key_secret: KEY_SECRET || "",
});

// canonical USD prices (server-side source of truth)
const PLAN_PRICES_USD: Record<string, number> = {
  starter: 299,
  performance: 599,
  premium: 2499,
  automation: 999,
};

export async function POST(req: Request) {
  try {
    if (!KEY_ID || !KEY_SECRET) {
      return NextResponse.json({ ok: false, error: "Razorpay keys not configured" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const planId = String(body?.planId || "").trim();
    if (!planId || typeof PLAN_PRICES_USD[planId] === "undefined") {
      return NextResponse.json({ ok: false, error: "invalid planId" }, { status: 400 });
    }

    // 1) compute INR amount from canonical USD price
    const usd = Number(PLAN_PRICES_USD[planId]);
    if (Number.isNaN(usd)) {
      return NextResponse.json({ ok: false, error: "invalid plan price" }, { status: 500 });
    }

    let rate: number | null = null;
    try {
      rate = await getExchangeRate("INR"); // your helper: USD -> INR
    } catch (err) {
      console.error("Failed to fetch exchange rate:", err);
      return NextResponse.json({ ok: false, error: "exchange rate unavailable" }, { status: 502 });
    }

    if (!rate || typeof rate !== "number" || rate <= 0) {
      console.error("Invalid exchange rate:", rate);
      return NextResponse.json({ ok: false, error: "invalid exchange rate" }, { status: 502 });
    }

    const amountInINR = Number((usd * rate).toFixed(2)); // e.g. 599.00
    const amountPaise = Math.round(amountInINR * 100); // integer paise e.g. 59900

    // 2) create Razorpay order
    const orderOptions = {
      amount: amountPaise,
      currency: "INR",
      receipt: `receipt_${planId}_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(orderOptions);

    // Normalize response shape for client
    const payload = {
      ok: true,
      order: {
        id: order.id,
        amount: order.amount ?? amountPaise,
        currency: order.currency ?? "INR",
      },
      keyId: KEY_ID,
      amount: amountInINR.toFixed(2),
      currency: "INR",
      planId,
    };

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Razorpay create order error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "create order failed" },
      { status: 500 }
    );
  }
}
