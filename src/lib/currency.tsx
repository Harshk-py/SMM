// src/lib/currency.ts
export const BASE = "USD";

/**
 * In-memory cache (demo). Key: `${BASE}_${target}`.
 * { rate, expires } where expires is epoch ms.
 */
const rateCache: Record<
  string,
  {
    rate: number;
    expires: number;
  }
> = {};

/**
 * Fetch latest exchange rate from exchangerate.host (free)
 * You can replace with your preferred provider.
 */
export async function getExchangeRate(target: string): Promise<number> {
  if (!target || target === BASE) return 1;

  const cacheKey = `${BASE}_${target}`;
  const now = Date.now();

  // Cache TTL: 10 minutes
  if (rateCache[cacheKey] && rateCache[cacheKey].expires > now) {
    return rateCache[cacheKey].rate;
  }

  const url = `https://api.exchangerate.host/latest?base=${BASE}&symbols=${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Exchange rate fetch failed: ${res.status}`);
  const json = await res.json();
  const rate = json?.rates?.[target];
  if (!rate) throw new Error("Rate not returned");

  rateCache[cacheKey] = { rate, expires: now + 10 * 60 * 1000 }; // 10 min cache
  return rate;
}

/**
 * Format value with Intl.NumberFormat, falling back to naive formatting
 */
export function formatCurrency(amountInUSD: number, targetCode: string, locale?: string) {
  const n = Number(amountInUSD);
  if (Number.isNaN(n)) return `${targetCode} ${amountInUSD}`;

  try {
    // If locale is not provided, rely on default for the currency code
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: targetCode,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    // fallback
    return `${targetCode} ${Math.round(n)}`;
  }
}
