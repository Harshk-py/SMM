import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Email Marketing – The Next Funnel",
  description:
    "Email funnels and newsletters to nurture leads and drive consistent conversions.",
};

export default function EmailMarketingPage() {
  return (
    <main className="py-20 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-6 text-center
          bg-white text-transparent bg-clip-text
          leading-tight pb-1"
        >
          Email Marketing
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-200 leading-relaxed text-center mb-12">
          We build automated email funnels and creative newsletters that nurture leads,
          increase engagement, and turn prospects into loyal customers. From strategy
          to copy, design, testing, and deliverability—your emails will be set up to
          convert consistently.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">⚙️ Automated Funnels</h3>
            <p className="text-gray-200">
              High-performing flows like Welcome, Lead-Nurture, Abandoned Cart, and
              Post-Purchase designed to guide subscribers from first touch to repeat
              purchases—on autopilot.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🧩 Segmentation & Personalization</h3>
            <p className="text-gray-200">
              Smart audience segments based on behavior and lifecycle. Dynamic content,
              product recommendations, and personalized timing to lift open and click-through rates.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">📬 Deliverability & List Health</h3>
            <p className="text-gray-200">
              Domain warm-up, SPF/DKIM/DMARC guidance, list cleaning, and sunsetting
              rules to keep your sender reputation strong and your emails in the inbox.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🧪 A/B Testing & Optimization</h3>
            <p className="text-gray-200">
              Continuous testing across subject lines, layouts, send times, and offers.
              Clear reporting and iteration to improve conversions every send.
            </p>
          </div>
        </div>

        {/* What We Use */}
        <div className="text-center mb-16">
          <div className="flex justify-center gap-10 flex-wrap">
            <div className="bg-white p-4 rounded-xl shadow-md w-28 h-28 flex items-center justify-center">
              <Image src="/images/e2.webp" alt="Brevo" width={150} height={150} />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md w-28 h-28 flex items-center justify-center">
              <Image src="/images/e1.webp" alt="Kit" width={150} height={150} />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md w-28 h-28 flex items-center justify-center">
              <Image src="/images/e3.webp" alt="Sender" width={150} height={150} />
            </div>
          </div>
        </div>

        {/* Results Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
          <div className="p-6 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-3xl font-extrabold text-white">+45%</h3>
            <p className="text-gray-200 mt-2">Avg. Open Rate</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-3xl font-extrabold text-white">+28%</h3>
            <p className="text-gray-200 mt-2">Higher CTR</p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-3xl font-extrabold text-white">3x</h3>
            <p className="text-gray-200 mt-2">Revenue from Flows</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/pricing"
                        className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition transform active:scale-95"
          >
            Get Started →
          </a>
        </div>
      </div>
    </main>
  );
}
