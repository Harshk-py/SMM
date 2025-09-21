// src/app/privacy/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – The Next Funnel",
  description:
    "Learn how The Next Funnel collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Page heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-white">
          Privacy Policy
        </h1>

        <p className="text-gray-300 mb-10 text-lg leading-relaxed">
          At <strong>The Next Funnel</strong>, we respect your privacy and are
          committed to protecting your personal data. This Privacy Policy
          explains what information we collect, how we use it, and what rights
          you have regarding your data.
        </p>

        {/* Sections */}
        <Section id="info" title="1. Information We Collect">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>
              <strong>Personal Information:</strong> such as your name, email,
              phone number, or payment details when you sign up for services or
              contact us.
            </li>
            <li>
              <strong>Usage Data:</strong> including your IP address, browser
              type, device information, and pages visited on our website.
            </li>
            <li>
              <strong>Cookies & Tracking:</strong> small files used to improve
              user experience, analyze traffic, and remember preferences.
            </li>
          </ul>
        </Section>

        <Section id="use" title="2. How We Use Your Information">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>To provide and manage our services.</li>
            <li>To process payments securely.</li>
            <li>To send updates, receipts, and customer support responses.</li>
            <li>To improve our website, offerings, and customer experience.</li>
            <li>To comply with legal obligations and prevent fraud.</li>
          </ul>
        </Section>

        <Section id="sharing" title="3. Sharing of Information">
          <p className="text-gray-300">
            We do <strong>not sell</strong> or trade your personal data. We may
            share your information only with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-300 mt-2">
            <li>
              Trusted third-party service providers (e.g., payment processors,
              email providers).
            </li>
            <li>Legal authorities, if required by law.</li>
          </ul>
        </Section>

        <Section id="security" title="4. Data Security">
          <p className="text-gray-300">
            We implement industry-standard security measures to protect your
            personal information. However, no method of transmission over the
            internet or electronic storage is 100% secure.
          </p>
        </Section>

        <Section id="rights" title="5. Your Rights">
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Access, update, or delete your personal data.</li>
            <li>Opt-out of marketing emails at any time.</li>
            <li>Request a copy of the data we hold about you.</li>
          </ul>
        </Section>

        <Section id="cookies" title="6. Cookies">
          <p className="text-gray-300">
            We use cookies to enhance your browsing experience. You can disable
            cookies in your browser settings, but some features may not function
            properly.
          </p>
        </Section>

        <Section id="third-party" title="7. Third-Party Services">
          <p className="text-gray-300">
            Our website may include links to third-party websites. We are not
            responsible for the privacy practices of external sites.
          </p>
        </Section>

        <Section id="changes" title="8. Changes to This Policy">
          <p className="text-gray-300">
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page with a revised effective date.
          </p>
        </Section>

        <Section id="contact" title="9. Contact Us">
          <p className="text-gray-300">
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:{" "}
            <a
              href="mailto:privacy@thenextfunnel.com"
              className="underline text-white hover:text-gray-200"
            >
              thenextfunnel@gmail.com
            </a>
            .
          </p>
        </Section>

        {/* Call to action */}
        <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/10 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Need More Information?
          </h3>
          <p className="text-gray-300 mb-4">
            We're here to answer your questions about how your data is handled.
          </p>
          <a
            href="mailto:thenextfunnel@gmail.com"
className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition transform active:scale-95 duration-150"
          >
            Contact Our Team
          </a>
        </div>

        {/* Footer note */}
        <footer className="mt-10 text-gray-400 text-sm text-center">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          <p>
            &copy; {new Date().getFullYear()} The Next Funnel. All rights
            reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

/* Reusable Section wrapper */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="mb-10 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
    >
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      {children}
    </section>
  );
}
