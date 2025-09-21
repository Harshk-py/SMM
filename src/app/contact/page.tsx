// src/app/contact/page.tsx
import React, { Suspense } from "react";
import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact – The Next Funnel",
  description: "Get in touch with The Next Funnel — questions about pricing, audits, partnerships or support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-black/10 p-8 rounded-2xl shadow-lg backdrop-blur-sm border border-white/6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-3">Contact Us</h1>
        <p className="mb-6 text-sm md:text-base text-gray-300 text-center">
          Have a question or need help? Choose an inquiry type, tell us a bit about your needs and we’ll
          get back to you — usually within one business day.
        </p>

        <Suspense
          fallback={
            <div className="py-6 text-center text-sm text-gray-400">
              Loading contact form…
            </div>
          }
        >
          <ContactClient />
        </Suspense>
      </div>
    </main>
  );
}
