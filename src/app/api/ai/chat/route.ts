// src/app/api/ai/chat/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Message = { role: "system" | "user" | "assistant"; content: string };

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

if (!OPENAI_KEY) {
  console.warn("OPENAI_API_KEY not set - AI route will return 500 if called");
}

/**
 * Load small JSON file with site facts (optional).
 * Returns null if file not present or unreadable.
 */
function loadSiteFacts() {
  try {
    const p = path.resolve(process.cwd(), "data", "site_facts.json");
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (err: any) {
    console.warn("Could not load site_facts.json:", err?.message ?? err);
    return null;
  }
}

/**
 * Simple in-memory token-bucket rate limiter (per IP).
 * For production, use Redis or a shared store to avoid per-process limits.
 */
const rateBuckets = new Map<string, { tokens: number; lastRefill: number }>();
const MAX_TOKENS = Number(process.env.AI_CHAT_RATE_LIMIT_PER_MIN ?? 30); // tokens/min
const REFILL_INTERVAL_MS = 60_000;

function allowRequest(ip: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) ?? { tokens: MAX_TOKENS, lastRefill: now };
  // refill
  const elapsed = now - bucket.lastRefill;
  if (elapsed > 0) {
    const refill = (elapsed / REFILL_INTERVAL_MS) * MAX_TOKENS;
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + refill);
    bucket.lastRefill = now;
  }
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    rateBuckets.set(ip, bucket);
    return true;
  }
  rateBuckets.set(ip, bucket);
  return false;
}

async function callOpenAI(payload: any) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }
  return res.json();
}

/** OPTIONAL moderation function - uncomment if you want to enable moderation */
async function checkModeration(text: string) {
  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: text }),
  });
  if (!res.ok) {
    const textErr = await res.text().catch(() => "");
    console.warn("Moderation API error:", res.status, textErr);
    return { flagged: false };
  }
  const data = await res.json();
  const flagged = !!data?.results?.[0]?.flagged;
  return { flagged, detail: data?.results?.[0] ?? null };
}

/** Validate and normalize an incoming messages payload into Message[] */
function normalizeMessages(body: any): { messages: Message[]; error?: string } {
  // If explicitly provided as array of objects with role/content
  if (Array.isArray(body?.messages) && body.messages.length > 0) {
    const normalized: Message[] = [];
    for (const item of body.messages) {
      if (typeof item === "string" && item.trim()) {
        normalized.push({ role: "user", content: item.trim() });
      } else if (item && typeof item === "object") {
        const role = (item.role ?? "user") as string;
        const content = (item.content ?? item.text ?? "").toString().trim();
        if (!content) continue;
        normalized.push({
          role: role === "assistant" ? "assistant" : role === "system" ? "system" : "user",
          content,
        });
      }
    }
    if (normalized.length) return { messages: normalized };
    return { messages: [], error: "messages array provided but contained no valid entries" };
  }

  // Accept single message string via body.message
  if (typeof body?.message === "string" && body.message.trim()) {
    return { messages: [{ role: "user", content: body.message.trim() }] };
  }

  // Accept messages as array of strings
  if (Array.isArray(body) && body.length > 0 && typeof body[0] === "string") {
    return { messages: body.filter(Boolean).map((s: string) => ({ role: "user", content: s })) };
  }

  // Accept body as { messages: "single string" }
  if (typeof body?.messages === "string" && body.messages.trim()) {
    return { messages: [{ role: "user", content: body.messages.trim() }] };
  }

  return { messages: [], error: "no messages found in request" };
}

export async function POST(req: Request) {
  try {
    if (!OPENAI_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    if (!allowRequest(ip)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    // parse body safely
    let rawBody: any = {};
    try {
      rawBody = await req.json();
    } catch (e) {
      rawBody = {};
    }

    // debug: log received body for troubleshooting (remove or lower in prod)
    console.debug("AI route received body:", JSON.stringify(rawBody));

    const { messages, error } = normalizeMessages(rawBody);

    if (!messages || messages.length === 0) {
      // return received body to aid debugging (remove in production)
      return NextResponse.json(
        { error: "messages are required", detail: error ?? "no valid messages", received: rawBody },
        { status: 400 }
      );
    }

    // Optional moderation (uncomment if needed)
    /*
    const userText = messages.map(m => m.content).join("\n");
    const mod = await checkModeration(userText);
    if (mod.flagged) {
      return NextResponse.json({ error: "input_rejected_by_moderation", detail: mod.detail }, { status: 400 });
    }
    */

    // Load site facts to include in the system prompt
    const siteFacts = loadSiteFacts();
    const siteBlurb = siteFacts?.blurb ?? "We offer services in social media, ads, automation and marketing.";
    const listedServices = Array.isArray(siteFacts?.services) ? siteFacts.services.join(", ") : "";
    const listedPackages = Array.isArray(siteFacts?.packages)
      ? siteFacts.packages.map((p: any) => `${p.title} (${p.price_usd}): ${p.summary}`).join("\n")
      : "";
    const contactEmail = siteFacts?.contact?.email ?? process.env.CONTACT_RECIPIENT ?? "";

    const systemPrompt: Message = {
      role: "system",
      content:
        `You are the website assistant for The Next Funnel. When answering user queries, prefer to respond using the site's actual offerings and wording.\n\n` +
        `Site blurb: ${siteBlurb}\n\n` +
        (listedServices ? `Services: ${listedServices}.\n\n` : "") +
        (listedPackages ? `Packages (name, price, summary):\n${listedPackages}\n\n` : "") +
        (contactEmail ? `Contact email: ${contactEmail}\n\n` : "") +
        `Behavior: Answer concisely and helpfully.\n` +
        `- If the user asks "what are your packages" or "pricing", list the packages exactly as shown above (use the package title, price, and one-line summary).\n` +
        `- If the user asks for contact details, provide the contact email above (do not invent other emails or phone numbers).\n` +
        `- If the user asks for custom pricing or account-specific details, recommend requesting a free audit and offer next steps for contacting sales.\n` +
        `- Keep responses friendly, professional, and brief unless the user asks for more detail.`,
    };

    const payload = {
      model: MODEL,
      messages: [systemPrompt, ...messages],
      max_tokens: 800,
      temperature: 0.2,
    };

    const data = await callOpenAI(payload);
    const reply = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";
    const usage = data?.usage ?? null;

    return NextResponse.json({ reply: (reply as string).trim(), usage });
  } catch (err: any) {
    console.error("AI chat route error:", err);
    return NextResponse.json({ error: err?.message ?? "internal error" }, { status: 500 });
  }
}
