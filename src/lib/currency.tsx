// src/lib/currency.ts
export const BASE = "USD";

/**
 * Simple in-memory cache. Key: `${BASE}_${target}`.
 * { rate, expires } where expires is epoch ms.
 */
const rateCache: Record<
  string,
  {
    rate: number;
    expires: number;
  }
> = {};

/** small helper: sleep ms */
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Fetch helper with retry/backoff for transient failures.
 * Retries on network failures and on HTTP 429/5xx.
 */
async function fetchWithRetry(url: string, { retries = 4, baseMs = 400 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const status = res.status;
        // retry on rate-limit / server errors
        if ((status >= 500 && status < 600) || status === 429) {
          throw new Error(`HTTP ${status}`);
        }
        // other client errors: return as-is (no retry)
        return res;
      }
      return res;
    } catch (err: any) {
      attempt++;
      const isLast = attempt > retries;
      const wait = Math.round(baseMs * Math.pow(2, attempt - 1));
      console.warn(
        `fetchWithRetry attempt ${attempt} failed for ${url}:`,
        err?.message ?? String(err),
        isLast ? "(giving up)" : `(retrying in ${wait}ms)`
      );
      if (isLast) throw err;
      await sleep(wait + Math.random() * 200);
    }
  }
}

/**
 * Get latest exchange rate from exchangerate.host (free)
 * Falls back to a configured env var if external lookup fails.
 */
export async function getExchangeRate(target: string): Promise<number> {
  if (!target || target === BASE) return 1;

  const cacheKey = `${BASE}_${target}`;
  const now = Date.now();

  // Cache TTL: 10 minutes
  if (rateCache[cacheKey] && rateCache[cacheKey].expires > now) {
    return rateCache[cacheKey].rate;
  }

  const url = `https://api.exchangerate.host/latest?base=${BASE}&symbols=${encodeURIComponent(
    target
  )}`;

  try {
    const res = await fetchWithRetry(url, { retries: 4, baseMs: 500 });
    if (!res.ok) {
      throw new Error(`Exchange rate fetch failed: HTTP ${res.status}`);
    }
    const json = await res.json();
    const rate = json?.rates?.[target];
    if (!rate || typeof rate !== "number") {
      throw new Error("Rate not returned or invalid");
    }

    rateCache[cacheKey] = { rate, expires: now + 10 * 60 * 1000 };
    return rate;
  } catch (err: any) {
    console.error("getExchangeRate error:", err?.message ?? String(err));

    // fallback env var: FALLBACK_USD_TO_<TARGET>
    const envKey = `FALLBACK_USD_TO_${target.toUpperCase()}`;
    const fallback = Number(
      process.env[envKey] ?? process.env.FALLBACK_USD_TO_INR ?? NaN
    );

    if (Number.isFinite(fallback) && fallback > 0) {
      console.warn(
        `Using fallback rate from env ${envKey || "FALLBACK_USD_TO_INR"} = ${fallback}`
      );
      rateCache[cacheKey] = { rate: fallback, expires: now + 5 * 60 * 1000 };
      return fallback;
    }

    throw new Error(
      `Exchange rate unavailable and no fallback set (${err?.message ?? String(err)})`
    );
  }
}

/**
 * Format value with Intl.NumberFormat, falling back to naive formatting
 */
export function formatCurrency(
  amountInUSD: number,
  targetCode: string,
  locale?: string
) {
  const n = Number(amountInUSD);
  if (Number.isNaN(n)) return `${targetCode} ${amountInUSD}`;

  try {
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: targetCode,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${targetCode} ${Math.round(n)}`;
  }
}
