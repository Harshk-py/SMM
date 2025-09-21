// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/footer";
import ClientChatLoader from "@/components/ClientChatLoader";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "The Next Funnel",
  description:
    "The Next Funnel is a Social Media Marketing agency specializing in social media management, Meta ads, content creation, and automation.",
  icons: {
    icon: "/images/logo.png",
  },
};

/**
 * Notes:
 * - This file remains a Server Component (no "use client" here) to preserve SSR benefits.
 * - Header is a client component (handles mobile menu and user interactions).
 * - Keep heavy client-only widgets inside ClientChatLoader or other client components.
 */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Example preconnects or preloads (uncomment/adapt if you use external fonts/CDN)
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preload" as="image" href="/images/hero.avif" />
        */}
      </head>

      <body className="min-h-screen antialiased flex flex-col">
        {/* Header (client component for mobile menu) */}
        <Header />

        {/* Main page content */}
        <main className="flex-1">{children}</main>

        {/* Footer (imported - if Footer uses hooks it must include "use client") */}
        <Footer />

        {/* Client-only loader for chat/widget — implemented in a client component */}
        <ClientChatLoader />
      </body>
    </html>
  );
}
