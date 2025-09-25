// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

/** helper to safely read env keys */
function getEnv(k: string) {
  return (process.env[k] ?? "").toString();
}

/** send notification email if SMTP configured */
async function sendNotificationEmail({
  name,
  email,
  message,
  planId,
}: {
  name: string;
  email: string;
  message: string;
  planId?: string | null;
}) {
  const host = getEnv("SMTP_HOST");
  const user = getEnv("SMTP_USER");
  const pass = getEnv("SMTP_PASS");
  const portRaw = getEnv("SMTP_PORT") || "587";
  const recipient = getEnv("CONTACT_RECIPIENT");

  if (!host || !user || !pass || !recipient) {
    console.warn("SMTP not configured, skipping notification email");
    return;
  }

  const port = Math.max(0, Number.parseInt(portRaw, 10) || 587);
  const secure = port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const subject = `New contact message${planId ? ` — inquiry: ${planId}` : ""}`;
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${planId ? `<p><strong>Inquiry:</strong> ${escapeHtml(planId)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
  `;

  await transporter.sendMail({
    from: `"The Next Funnel" <${user}>`,
    to: recipient,
    subject,
    html,
  });
}

/** very small html escaper */
function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const name = (body.name ?? "").toString().trim();
    const email = (body.email ?? "").toString().trim();
    const message = (body.message ?? "").toString().trim();

    // accept either planId or inquiryType from frontend
    const planIdRaw = body.planId ?? body.inquiryType ?? null;
    const planId = planIdRaw ? String(planIdRaw).trim() : null;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email and message are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "invalid email address" },
        { status: 400 }
      );
    }

    // Save to DB
    let saved: any = null;
    try {
      saved = await prisma.contactMessage.create({
        data: { name, email, message, planId },
      });
    } catch (dbErr: any) {
      console.error("Prisma save failed:", dbErr);
    }

    // Send notification email
    try {
      await sendNotificationEmail({ name, email, message, planId });
    } catch (emailErr: any) {
      console.warn("Email notification failed:", emailErr);
    }

    return NextResponse.json({ ok: true, message: "Saved", saved });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "internal error" },
      { status: 500 }
    );
  }
}
