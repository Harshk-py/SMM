// src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

// Minimal country -> currency mapping (extend as needed)
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  IN: "INR",
  US: "USD",
  GB: "GBP",
  AE: "AED",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  // add more as needed
};

const DEFAULT_CURRENCY = "USD";
const COOKIE_NAME = "NF_CURRENCY";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(req: NextRequest) {
  try {
    // If cookie already set, do nothing
    const existing = req.cookies.get(COOKIE_NAME);
    if (existing && existing.value) return NextResponse.next();

    // Try request.geo (fast, provided by many hosts: Vercel/Cloudflare)
    // @ts-ignore - some deployments expose request.geo
    const geo = (req as any).geo;
    const country = geo?.country?.toUpperCase?.();

    let currency = DEFAULT_CURRENCY;
    if (country && COUNTRY_TO_CURRENCY[country]) {
      currency = COUNTRY_TO_CURRENCY[country];
    } else {
      // fallback: try header injected by some platforms
      const headerCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("x-country");
      if (headerCountry && COUNTRY_TO_CURRENCY[headerCountry.toUpperCase()]) {
        currency = COUNTRY_TO_CURRENCY[headerCountry.toUpperCase()];
      }
    }

    const res = NextResponse.next();
    // Set cookie if not present
    res.cookies.set({
      name: COOKIE_NAME,
      value: currency,
      httpOnly: false, // accessible client-side if needed
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    // On any error, continue without modifying response
    return NextResponse.next();
  }
}

// Apply middleware to the whole site (or restrict to /pricing)
export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"], // runs for most requests - adjust to only /pricing if you prefer
};
