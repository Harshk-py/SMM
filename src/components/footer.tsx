// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="text-white">
      {/* subtle divider */}
      <div className="w-full border-t border-white/10" />

      {/* Navy band */}
      <div className="bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 items-start">
            {/* Brand + Social row */}
            <div className="md:col-span-5">
              <Link href="/" className="inline-flex items-baseline gap-2">
                <span className="text-2xl font-extrabold tracking-tight">THE NEXT FUNNEL</span>
              </Link>

              <p className="mt-3 max-w-md opacity-90">
                Automate Instagram DMs, capture leads, and scale your engagement with smart flows.
              </p>

              {/* Social row (circular icons) */}
              <div className="mt-6 flex items-center gap-4">
                <RoundSocial href="https://www.facebook.com/profile.php?id=61580867836089" label="Facebook">
                  <FaFacebookF className="h-4 w-4" />
                </RoundSocial>

                <RoundSocial href="https://www.instagram.com/thenextfunnel" label="Instagram">
                  <FaInstagram className="h-4 w-4" />
                </RoundSocial>

                <RoundSocial href="https://linkedin.com/in/harshkushwahawk" label="LinkedIn">
                  <FaLinkedinIn className="h-4 w-4" />
                </RoundSocial>
                <RoundSocial href="mailto:thenextfunnel@gmail.com" label="Email">
    <Mail size={16} />
  </RoundSocial>
              </div>
            </div>

            {/* Company */}
            <div className="md:col-span-3">
              <h4 className="mb-4 text-lg font-semibold">COMPANY</h4>
              <ul className="space-y-2">
                <Li href="/about-us">About Us</Li>
                <Li href="/services">Services</Li>
                <Li href="/pricing">Pricing</Li>
                <Li href="/privacy-policy">Privacy Policy</Li>
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <h4 className="mb-4 text-lg font-semibold">CONTACT</h4>
              <ul className="space-y-3">
                <Line icon={<Mail size={16} />}>
                  <a className="hover:underline" href="mailto:thenextfunnel@gmail.com">
                    thenextfunnel@gmail.com
                  </a>
                </Line>

                <Line icon={<Phone size={16} />}>
                  <a className="hover:underline" href="tel:+919696456932">
                    +91 9696456932
                  </a>
                </Line>

                <Line icon={<MapPin size={16} />}>INDIA • Remote</Line>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white border-t border-black/10 text-black">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="opacity-100">© {year} The Next Funnel, All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-90">
            <Link className="hover:underline" href="/privacy-policy">Privacy</Link>
            <Link className="hover:underline" href="/terms">Terms</Link>
            <Link className="hover:underline" href="/status">Status</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* Helpers */
function Li({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:underline">
        {children}
      </Link>
    </li>
  );
}

function RoundSocial({ href, label, children }: { href: string; label: string; children: React.ReactNode; }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/15 transition"
    >
      <span className="text-white/95">{children}</span>
    </a>
  );
}

function Line({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="opacity-90">{icon}</span>
      <span className="opacity-95">{children}</span>
    </li>
  );
}
