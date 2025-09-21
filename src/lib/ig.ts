// src/lib/ig.ts
const GRAPH = "https://graph.facebook.com/v19.0";

// Read env vars once and validate
const rawAccessToken = process.env.PAGE_ACCESS_TOKEN;
const rawPageId = process.env.PAGE_ID;

if (!rawAccessToken) {
  throw new Error("Missing PAGE_ACCESS_TOKEN in environment");
}
if (!rawPageId) {
  throw new Error("Missing PAGE_ID in environment");
}

// Narrow to string so TypeScript won't complain later
const PAGE_ACCESS_TOKEN: string = rawAccessToken;
const PAGE_ID: string = rawPageId;

export type SendTextParams = {
  recipientId: string;
  text: string;
};

/**
 * Sends a text message to a Page-scoped user ID (PSID).
 * Your Instagram Business Account must be connected to this Page.
 */
export async function sendText({ recipientId, text }: SendTextParams) {
  const url = `${GRAPH}/${PAGE_ID}/messages?access_token=${encodeURIComponent(
    PAGE_ACCESS_TOKEN
  )}`;

  const body = {
    recipient: { id: recipientId },
    message: { text },
    messaging_type: "RESPONSE",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `IG send error ${res.status} ${res.statusText}: ${errText || "no body"}`
    );
  }

  return res.json();
}
