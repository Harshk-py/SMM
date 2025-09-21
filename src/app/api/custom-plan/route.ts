import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Custom plan request received:", body);

    if (!body?.email || !body?.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Replace with email sending/database persistence
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Error handling /api/custom-plan", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
