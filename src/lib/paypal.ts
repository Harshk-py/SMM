// src/lib/paypal.ts
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const API =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

function assertEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

/**
 * Resolve a URL that may be absolute or relative.
 * Relative URLs are resolved using NEXT_PUBLIC_BASE_URL, SITE_URL, or VERCEL_URL.
 * Throws a helpful error if it cannot produce an absolute URL.
 */
function resolveAbsoluteUrl(urlOrPath: string): string {
  if (!urlOrPath) throw new Error("Empty URL provided");

  // already absolute
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;

  // prefer explicit public base
  const envBase = (process.env.NEXT_PUBLIC_BASE_URL || process.env.SITE_URL || "").replace(/\/$/, "");
  if (envBase) {
    return `${envBase}${urlOrPath.startsWith("/") ? urlOrPath : "/" + urlOrPath}`;
  }

  // Vercel sets VERCEL_URL (like my-app.vercel.app) at build/runtime — assume https
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    const base = `https://${vercel.replace(/\/$/, "")}`;
    return `${base}${urlOrPath.startsWith("/") ? urlOrPath : "/" + urlOrPath}`;
  }

  // helpful error for developers
  throw new Error(
    `Cannot resolve relative URL "${urlOrPath}". Please provide an absolute URL, or set NEXT_PUBLIC_BASE_URL, SITE_URL, or ensure VERCEL_URL is available in the environment.`
  );
}

/**
 * Get OAuth2 access token from PayPal. Caller should handle exceptions.
 */
export async function getAccessToken(): Promise<string> {
  const clientId = assertEnv("PAYPAL_CLIENT_ID");
  const secret = assertEnv("PAYPAL_CLIENT_SECRET");

  const res = await fetch(`${API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`PayPal token fetch failed: ${res.status} ${txt}`);
  }

  const json = await res.json();
  if (!json?.access_token) {
    throw new Error("PayPal token response missing access_token");
  }
  return json.access_token;
}

/**
 * Create PayPal order server-side.
 *
 * opts:
 * - amount: string like "599.00"
 * - currency: "USD" or other supported currency
 * - returnUrl / cancelUrl: absolute URLs OR relative paths (e.g. "/checkout/cancel")
 * - customId?: optional string stored on purchase_units[0].custom_id (useful to store planId)
 *
 * Returns: raw PayPal order JSON on success.
 */
export async function createOrderServerSide(opts: {
  amount: string;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
  customId?: string;
}) {
  if (!opts?.amount || !opts?.currency || !opts?.returnUrl || !opts?.cancelUrl) {
    throw new Error("Missing required createOrderServerSide options");
  }

  const token = await getAccessToken();

  // Resolve relative return/cancel URLs to absolute
  const returnUrl = resolveAbsoluteUrl(opts.returnUrl);
  const cancelUrl = resolveAbsoluteUrl(opts.cancelUrl);

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: { currency_code: opts.currency, value: opts.amount },
        // only include custom_id if provided
        ...(opts.customId ? { custom_id: String(opts.customId) } : {}),
        description: opts.customId ? `Purchase: ${opts.customId}` : "Purchase via The Next Funnel",
      },
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
    },
  };

  const res = await fetch(`${API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(JSON.stringify(json));
    return json;
  } catch (err) {
    // If response is not JSON or OK
    throw new Error(`Create order failed: ${res.status} ${text}`);
  }
}

/**
 * Capture a PayPal order server-side.
 * - orderId: PayPal order id (string).
 *
 * Returns a normalized object containing:
 * {
 *   raw: <raw paypal json>,
 *   orderId,
 *   status,
 *   captureId?,
 *   payer?: { name?, email?, payer_id? },
 *   purchase_units: [ { custom_id?, amount: {currency_code, value}, payments: {...} } ],
 * }
 */
export async function captureOrderServerSide(orderId: string) {
  if (!orderId) throw new Error("orderId is required for capture");
  const token = await getAccessToken();

  const res = await fetch(
    `${API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch (err) {
    throw new Error(`Capture failed (non-JSON): ${res.status} ${text}`);
  }

  if (!res.ok) {
    // propagate PayPal error body
    throw new Error(`Capture failed: ${res.status} ${JSON.stringify(json)}`);
  }

  // Normalize useful fields
  const status =
    (json?.status as string) ||
    (json?.purchase_units?.[0]?.payments?.captures?.[0]?.status as string) ||
    null;

  const captureId =
    json?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
    json?.id ||
    null;

  const payer =
    json?.payer && typeof json.payer === "object"
      ? {
          name:
            json.payer?.name?.given_name && json.payer?.name?.surname
              ? `${json.payer.name.given_name} ${json.payer.name.surname}`
              : json.payer?.name?.given_name || json.payer?.name?.surname || null,
          email: json.payer?.email_address || null,
          payer_id: json.payer?.payer_id || null,
        }
      : null;

  const purchase_units = Array.isArray(json?.purchase_units) ? json.purchase_units : [];

  // Extract custom_id (planId) and amounts for convenience (first pu)
  const firstPU = purchase_units[0] ?? null;
  const custom_id = firstPU?.custom_id ?? null;
  const amount = firstPU?.payments?.captures?.[0]?.amount ?? firstPU?.amount ?? null;
  const currency_code = amount?.currency_code ?? amount?.currency ?? null;
  const value = amount?.value ?? null;

  // Return a consistent shape for server handlers to inspect
  return {
    raw: json,
    orderId,
    status,
    captureId,
    payer,
    purchase_units,
    custom_id,
    amount: value,
    currency: currency_code,
  };
}
