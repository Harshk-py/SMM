"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  url: string;
  delayMs?: number;
};

export default function CheckoutRedirectClient({ url, delayMs = 800 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(url);
    }, delayMs);

    return () => clearTimeout(t);
  }, [router, url, delayMs]);

  return (
    <div className="max-w-lg mx-auto text-center" aria-live="polite">
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* spinner */}
        <svg
          className="w-5 h-5 animate-spin text-white"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-lg text-gray-300">
          Finishing up — you will be redirected shortly...
        </p>
      </div>

      {/* fallback if redirect fails */}
      <Link
        href={url}
        className="inline-block px-4 py-2 mt-2 rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        Go now
      </Link>
    </div>
  );
}
