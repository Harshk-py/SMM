import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Ads – The Next Funnel",
  description:
    "High-converting Meta (Facebook & Instagram) ads that bring measurable ROI and scalable growth.",
};

export default function MetaAdsPage() {
  return (
    <main className="py-5 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-1 text-center 
          bg-white text-transparent bg-clip-text leading-tight pb-1"
        >
          Meta Ads
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-200 leading-relaxed text-center mb-12">
          Our ROI-focused Meta advertising campaigns are built to scale your business.
          From creative testing to data-driven optimization, we help you convert clicks
          into paying customers with precision targeting and performance tracking.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">📊 Full-Funnel Strategy</h3>
            <p className="text-gray-200">
              From awareness to conversions, we craft ad campaigns tailored to each stage 
              of the funnel for maximum impact.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🎯 Advanced Targeting</h3>
            <p className="text-gray-200">
              Leverage Meta’s powerful tools to target the right audience with laser precision 
              and custom audience segments.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🎨 High Converting Creatives</h3>
            <p className="text-gray-200">
              Engaging ad creatives designed to stop the scroll and drive meaningful clicks 
              that lead to conversions.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-grey-400">📈 ROI & Performance Tracking</h3>
            <p className="text-gray-200">
              Transparent reports and analytics so you know exactly how your ads are performing 
              and scaling profitably.
            </p>
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
