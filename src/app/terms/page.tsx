// src/app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions – The Next Funnel",
  description: "Terms & Conditions for The Next Funnel — use of site and services.",
};

export default function TermsPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6">Terms &amp; Conditions</h1>
        <p className="text-gray-300 mb-8">
          These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of The Next Funnel website and services.
          By accessing or using our site or purchasing services from us, you agree to be bound by these Terms.
        </p>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">1. Services</h2>
          <p className="text-gray-300">
            The Next Funnel provides social media marketing, content creation, ad management and automation services.
            Specific deliverables, timelines, and fees are described in separate service agreements or proposals.
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">2. Acceptable Use</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>You agree not to use our services for illegal, abusive, or malicious activities.</li>
            <li>Do not attempt to reverse-engineer, disrupt, or overload our systems.</li>
            <li>Respect intellectual property rights and avoid sending copyrighted or infringing content without permission.</li>
          </ul>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">3. Payments & Refunds</h2>
          <p className="text-gray-300">
            Fees and payment terms are defined in your service agreement. Unless otherwise stated, payments are due per the invoice schedule.
            Refunds (if any) are handled on a case-by-case basis and depend on the specific service agreement.
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
          <p className="text-gray-300">
            We retain ownership of our pre-existing tools, processes, templates, and intellectual property. Client-provided content remains the client's property.
            Deliverables created for you are licensed as described in your agreement.
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-300">
            To the fullest extent permitted by law, The Next Funnel is not liable for indirect, incidental, special, or consequential damages.
            Our total aggregate liability for claims arising out of or relating to these Terms is limited to amounts paid to us for the relevant services in the prior 12 months.
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">6. Privacy</h2>
          <p className="text-gray-300">
            We handle personal data as described in our <a href="/privacy" className="underline text-white">Privacy Policy</a>.
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
          <p className="text-gray-300">
            These Terms are governed by the laws of the jurisdiction stated in your agreement (or the company&apos;s registered jurisdiction).
          </p>
        </section>

        <section className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
          <p className="text-gray-300">
            We may update these Terms occasionally. We will post changes on this page and update the &quot;Effective Date&quot; below.
          </p>
        </section>

        <footer className="mt-8 text-gray-400 text-sm">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          <p className="mt-2">© {year} The Next Funnel. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
