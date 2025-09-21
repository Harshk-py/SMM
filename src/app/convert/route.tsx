// src/app/api/convert/route.ts
import { NextResponse } from "next/server";
import { getExchangeRate, BASE } from "@/lib/currency";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const to = (url.searchParams.get("to") || "USD").toUpperCase();
    const amount = Number(url.searchParams.get("amount") || "0");

    if (!amount || Number.isNaN(amount)) {
      return NextResponse.json({ error: "invalid amount" }, { status: 400 });
    }

    // if same currency, short-circuit
    if (to === BASE) {
      return NextResponse.json({ amount: amount, currency: BASE });
    }

    const rate = await getExchangeRate(to);
    const converted = Math.round(amount * rate);

    return NextResponse.json({ amount: converted, currency: to });
  } catch (err) {
    return NextResponse.json({ error: "conversion failed" }, { status: 500 });
  }
}
