// src/app/api/razorpay/webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const rawBody = await req.text(); // IMPORTANT: use raw text for signature verification
  const signature = req.headers.get("x-razorpay-signature") || "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "")
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ ok: false, error: "invalid webhook signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  // handle payload.type e.g. payment.captured, order.paid etc.
  // Save to DB or trigger post-payment flow.

  return NextResponse.json({ ok: true });
}
