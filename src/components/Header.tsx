// src/components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  // lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    const originalOverflow = document.documentElement.style.overflow;
    if (open) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = originalOverflow || "";
    }
    return () => {
      document.documentElement.style.overflow = originalOverflow || "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-4 md:py-7 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="The Next Funnel - Home">
          <Image
            src="/images/1.webp"
            alt="The Next Funnel Logo"
            width={140}
            height={48}
            sizes="(max-width: 640px) 120px, 160px"
            priority={false}
            className="block"
          />
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/services" className="nav-link">Services</Link>
          <Link href="/pricing" className="nav-link">Pricing</Link>
          <Link href="/free-audit" className="nav-link">Free Audit</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            /* Close (X) icon */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            /* Hamburger icon */
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile nav panel (overlay) */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)} // close when clicking backdrop
        >
          <div
            className="absolute top-0 right-0 w-80 max-w-full h-full bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()} // prevent backdrop click from closing when interacting with menu
          >
            <nav className="flex flex-col gap-4 font-medium" aria-label="Mobile primary">
              <Link href="/" onClick={() => setOpen(false)} className="py-2 border-b border-gray-100">Home</Link>
              <Link href="/services" onClick={() => setOpen(false)} className="py-2 border-b border-gray-100">Services</Link>
              <Link href="/pricing" onClick={() => setOpen(false)} className="py-2 border-b border-gray-100">Pricing</Link>
              <Link href="/free-audit" onClick={() => setOpen(false)} className="py-2 border-b border-gray-100">Free Audit</Link>
              <Link href="/contact" onClick={() => setOpen(false)} className="py-2">Contact</Link>

              <div className="mt-4">
                <a
                  href="/custom-plan"
                  onClick={() => setOpen(false)}
                  className="inline-block w-full text-center px-4 py-3 rounded-md bg-black text-white font-semibold"
                >
                  Build My Custom Plan
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
