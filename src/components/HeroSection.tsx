"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BANNERS = [
  // keep original filenames in /public/images
  "/images/b2.webp",
  "/images/b3.webp",
  "/images/b1.webp",
];

export default function HeroSection() {
  const router = useRouter();

  // banner rotation
  const [bannerIndex, setBannerIndex] = useState(0);
  const rotateIntervalMs = 3000;
  const fadeDurationMs = 1000;

  // preload banners (lightweight)
  useEffect(() => {
    if (typeof window === "undefined") return;
    BANNERS.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS.length);
    }, rotateIntervalMs);
    return () => clearInterval(id);
  }, []);

  const targets = {
    marketSizeB: 208,
    cagrPercent: 12.5,
    annualSpendB: 50,
  };

  const [marketSize, setMarketSize] = useState(0);
  const [cagr, setCagr] = useState(0);
  const [annualSpend, setAnnualSpend] = useState(0);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setMarketSize(targets.marketSizeB);
      setCagr(targets.cagrPercent);
      setAnnualSpend(targets.annualSpendB);
      return;
    }

    const duration = 1500;
    const start = performance.now();

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      setMarketSize(Number((targets.marketSizeB * ease).toFixed(0)));
      setCagr(Number((targets.cagrPercent * ease).toFixed(1)));
      setAnnualSpend(Number((targets.annualSpendB * ease).toFixed(0)));
      if (p < 1) requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [prefersReducedMotion]);

  const transitionStyle = prefersReducedMotion
    ? "opacity 200ms linear, transform 200ms linear"
    : `opacity ${fadeDurationMs}ms ease-out, transform ${fadeDurationMs}ms ease-out`;

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background banners */}
      <div className="absolute inset-0 -z-10">
        {BANNERS.map((src, idx) => {
          const isActive = idx === bannerIndex;

          return (
            <div
              key={src}
              aria-hidden={!isActive}
              style={{
                transition: transitionStyle,
                transform: isActive ? "scale(1)" : "scale(1.03)",
                opacity: isActive ? 1 : 0,
              }}
              className="absolute inset-0"
            >
              {/* next/image with sizes so mobile gets a small image */}
              <Image
                src={src}
                alt={`Banner ${idx + 1}`}
                fill
                // Priority only for the initial hero image (index 0) to avoid preloading all rotated images
                priority={idx === 0}
                // Non-active rotated banners should be lazy-loaded (no blocking on mobile)
                loading={idx === 0 ? "eager" : "lazy"}
                // Quality reduced slightly to save KB (desktop remains visually similar)
                quality={70}
                // IMPORTANT: sizes tells the browser how large this image will be at different breakpoints
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
                className="object-cover"
              />
            </div>
          );
        })}

        {/* overlay for readability (keep as before) */}
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 text-center lg:text-left z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6 transform -translate-y-6 lg:-translate-y-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
              Turning{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
                Social Media
              </span>{" "}
              into{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
                Smart Funnels
              </span>{" "}
              with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
                AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-xl">
              We Scale Businesses with Creative Ads, Engaging Content and AI
              Powered Automation which helps Brands to CONNECT, ENGAGE and GROW
              FASTER.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-black hover:text-white active:scale-95 transition-transform duration-150"
                onClick={() => router.push("/services")}
              >
                Services
              </Button>

              <Button
                variant="outline"
                className="border-white text-white hover:bg-black hover:text-white active:scale-95 transition-transform duration-150"
                onClick={() => router.push("/pricing")}
              >
                Pricing
              </Button>

              <Button
                variant="outline"
                className="border-white text-white hover:bg-black hover:text-white active:scale-95 transition-transform duration-150"
                onClick={() => router.push("/about-us")}
              >
                About Us
              </Button>
            </div>

            {/* Mobile / tablet stats (unchanged) */}
            <div className="mt-8 flex flex-wrap justify-center lg:hidden gap-4">
              <StatBox value={marketSize} label="Social Media Market Size" type="billion" />
              <StatBox value={cagr} label="Annual Growth Rate (CAGR)" type="percent" />
              <StatBox value={annualSpend} label="Annual Spend by Businesses" type="billion" />
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex lg:col-span-5 items-start justify-end -translate-y-6">
            <div className="w-full max-w-xs flex flex-col items-stretch space-y-6">
              <StatBoxLarge value={marketSize} label="Social Media Market Size" type="billion" />
              <StatBoxLarge value={cagr} label="Annual Growth Rate (CAGR)" type="percent" />
              <StatBoxLarge value={annualSpend} label="Annual Spend by Businesses" type="billion" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Mobile / tablet stat box */
function StatBox({
  value,
  label,
  type = "billion",
}: {
  value: number;
  label: string;
  type?: "billion" | "percent";
}) {
  let display = "";
  if (type === "percent") {
    display = `${value.toFixed(1)}%`;
  } else {
    display = `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}B`;
  }

  return (
    <div className="bg-white/10 px-4 py-3 rounded-lg w-44 text-center hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
      <p className="text-2xl font-bold">{display}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}

/* Desktop right column stat card (unchanged) */
function StatBoxLarge({
  value,
  label,
  type = "billion",
}: {
  value: number;
  label: string;
  type?: "billion" | "percent";
}) {
  let display = "";
  if (type === "percent") {
    display = `${value.toFixed(1)}%`;
  } else {
    display = `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}B`;
  }

  return (
    <div className="bg-white/7 px-6 py-6 rounded-2xl w-full text-center hover:scale-105 transition-transform duration-300 backdrop-blur-md border border-white/10 shadow-lg">
      <p className="text-3xl font-extrabold">{display}</p>
      <p className="text-sm opacity-90 mt-1">{label}</p>
    </div>
  );
}
