// src/app/api/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_SECRET) {
  console.error("Razorpay secret (RAZORPAY_KEY_SECRET) is not configured.");
}

export async function POST(req: Request) {
  try {
    if (!KEY_SECRET) {
      return NextResponse.json({ ok: false, error: "Razorpay secret not configured" }, { status: 500 });
    }

    // Expect JSON body with razorpay_order_id, razorpay_payment_id, razorpay_signature
    const body = await req.json().catch(() => ({})) as Record<string, any>;

    const razorpay_order_id = String(body?.razorpay_order_id || "");
    const razorpay_payment_id = String(body?.razorpay_payment_id || "");
    const razorpay_signature = String(body?.razorpay_signature || "");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ ok: false, error: "missing fields" }, { status: 400 });
    }

    const generated_signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.warn("Invalid Razorpay signature", { generated_signature, razorpay_signature, order: razorpay_order_id });
      return NextResponse.json({ ok: false, error: "invalid signature" }, { status: 400 });
    }

    // ---- Payment verified ----
    // TODO: persist payment to your DB here (idempotent):
    // Example fields to save: razorpay_order_id, razorpay_payment_id, planId (if tracked), amount, currency, payer info, created_at
    // Example:
    // await prisma.payment.create({ data: { provider: 'razorpay', provider_order_id: razorpay_order_id, provider_payment_id: razorpay_payment_id, status: 'captured', ... } });

    console.log("Razorpay payment verified", { razorpay_order_id, razorpay_payment_id });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("verify error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "verify failed" }, { status: 500 });
  }
}
