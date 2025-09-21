// src/app/api/paypal/check/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAccessToken, captureOrderServerSide } from "@/lib/paypal";

const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const API =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/**
 * Minimal typed shape for the PayPal response fields we read.
 * Expand if you depend on more fields later.
 */
type PayPalCaptureResult = {
  id?: string;
  status?: string | null;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string | null;
        amount?: { value?: string; currency_code?: string } | null;
      } | null> | null;
    } | null;
  } | null> | null;
  payer?: {
    name?: { given_name?: string; surname?: string } | null;
    email_address?: string | null;
    payer_id?: string | null;
  } | null;
  [k: string]: any;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    // 🔑 Fetch PayPal access token
    const token = await getAccessToken();

    // 🔎 Retrieve order details
    const res = await fetch(`${API}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("PayPal order fetch failed:", res.status, text);
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch order from PayPal",
          status: res.status,
          detail: text,
        },
        { status: 502 }
      );
    }

    const orderRaw = await res.json().catch(() => null);
    const order = (orderRaw ?? {}) as PayPalCaptureResult & { status?: string };
    const status = (order.status as string) ?? "UNKNOWN";

    // ✅ COMPLETED — already done
    if (status === "COMPLETED") {
      return NextResponse.json({
        ok: true,
        status,
        completed: true,
        order,
      });
    }

    // 🔄 APPROVED — not yet captured, capture automatically
    if (status === "APPROVED") {
      try {
        const rawCapture = await captureOrderServerSide(orderId);
        const captureResult = (rawCapture ?? {}) as PayPalCaptureResult;

        const captureStatus =
          captureResult.status ??
          captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.status ??
          "UNKNOWN";

        const captureId =
          captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id ??
          captureResult.id ??
          null;

        return NextResponse.json({
          ok: true,
          status: captureStatus,
          captured: true,
          orderId,
          captureId,
          result: captureResult,
        });
      } catch (captureErr: any) {
        console.error("⚠️ Auto-capture failed:", captureErr);
        return NextResponse.json(
          {
            ok: false,
            status: "APPROVED",
            error: captureErr?.message ?? String(captureErr),
          },
          { status: 500 }
        );
      }
    }

    // ⏳ Other states: CREATED, PAYER_ACTION_REQUIRED, VOIDED, etc.
    return NextResponse.json({
      ok: true,
      status,
      orderId,
      order,
    });
  } catch (err: any) {
    console.error("❌ Check endpoint error:", err);
    return NextResponse.json(
      { error: err?.message ?? "internal error" },
      { status: 500 }
    );
  }
}
