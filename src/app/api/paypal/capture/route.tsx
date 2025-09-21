// src/app/api/paypal/capture/route.ts
import { NextResponse } from "next/server";
import { captureOrderServerSide } from "@/lib/paypal";

/**
 * POST body:
 * { orderId: string }
 *
 * Response (success): {
 *   ok: true,
 *   status: 'COMPLETED' | 'PENDING' | ...,
 *   orderId,
 *   captureId?,
 *   payer: { name?, email?, payer_id? },
 *   purchase_units: [...]
 * }
 *
 * Response (error): { error: string }
 */

// Minimal typed shape for the parts of the PayPal response we read.
// This is intentionally small — expand as needed if you rely on more fields.
type PayPalCaptureResult = {
  id?: string;
  status?: string | null;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id?: string;
        status?: string | null;
        amount?: { value?: string; currency_code?: string } | null;
        currency_code?: string | null;
      } | null> | null;
    } | null;
  } | null> | null;
  payer?: {
    name?: { given_name?: string; surname?: string } | null;
    email_address?: string | null;
    payer_id?: string | null;
  } | null;
  // include any other fields you might need later
  [k: string]: any;
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    // Call your PayPal capture helper
    const result = await captureOrderServerSide(orderId);

    if (!result) {
      console.error("Capture returned empty result for orderId:", orderId);
      return NextResponse.json({ error: "Empty capture result" }, { status: 502 });
    }

    // Cast to the small typed view so TypeScript is happy when we access fields.
    const typedResult = result as PayPalCaptureResult;

    // PayPal capture responses vary depending on integration.
    // We try to safely extract a common shape:
    const status =
      // prefer top-level status
      (typedResult.status as string) ??
      // fallback to first purchase unit's payments.captures[0].status
      typedResult.purchase_units?.[0]?.payments?.captures?.[0]?.status ??
      null;

    // captureId may live in payments.captures[0].id or top-level id
    const captureId =
      typedResult.purchase_units?.[0]?.payments?.captures?.[0]?.id ??
      typedResult.id ??
      null;

    // Payer details (if present)
    const payer =
      typedResult.payer && typeof typedResult.payer === "object"
        ? {
            name:
              typedResult.payer.name?.given_name && typedResult.payer.name?.surname
                ? `${typedResult.payer.name.given_name} ${typedResult.payer.name.surname}`
                : typedResult.payer.name?.given_name || typedResult.payer.name?.surname || null,
            email: typedResult.payer.email_address ?? null,
            payer_id: typedResult.payer.payer_id ?? null,
          }
        : null;

    // purchase units (raw) for bookkeeping or DB save
    const purchase_units = typedResult.purchase_units ?? [];

    // Log full result for server debugging (consider trimming or removing in prod)
    console.info("PayPal capture result:", {
      orderId,
      status,
      captureId,
      payer,
      purchase_units_count: purchase_units.length,
    });

    // Verify the capture status is successful:
    // PayPal may report "COMPLETED" or "CAPTURED" depending on API used.
    const okStatuses = new Set(["COMPLETED", "CAPTURED", "SUCCESS"]);
    const isSuccessful = typeof status === "string" && okStatuses.has(status.toUpperCase());

    if (!isSuccessful) {
      // For non-final statuses, return the result but mark as not completed
      return NextResponse.json(
        {
          ok: false,
          message: "Capture not completed",
          status: status ?? "unknown",
          orderId,
          captureId,
          payer,
          purchase_units,
          result,
        },
        { status: 200 }
      );
    }

    // ----------------------
    // TODO: Persist order in your DB here (example)
    // await db.orders.create({
    //   orderId,
    //   captureId,
    //   amount: purchase_units[0]?.payments?.captures?.[0]?.amount,
    //   currency: purchase_units[0]?.payments?.captures?.[0]?.currency_code,
    //   payerEmail: payer?.email,
    //   planId: ... // if you sent planId in client metadata, include it in order creation
    // });
    //
    // Optionally send receipt email / webhook to internal systems
    // ----------------------

    // Return a concise success payload to the client
    return NextResponse.json({
      ok: true,
      status,
      orderId,
      captureId,
      payer,
      purchase_units,
      result, // include raw result for debugging if needed (omit in production)
    });
  } catch (err: any) {
    console.error("Capture error:", err);
    const message = err?.message || "capture error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
