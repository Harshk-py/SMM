// src/app/page.tsx
import Link from "next/link";
import HeroSection from "@/components/HeroSection"; // assumed optimized and LCP-aware

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Hero (keep this component responsible for its own LCP image & optimization) */}
      <HeroSection />

      {/* About Section — responsive, comfortable line-length on mobile */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">Who We Are</h2>

            <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-md">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6 text-center md:text-left">
                The Next Funnel is a forward-thinking{" "}
                <span className="font-semibold text-blue-600">Social Media Marketing Agency</span>{" "}
                built to help businesses simplify and accelerate digital growth. We do not just create content; we craft strategies that convert by combining{" "}
                <span className="font-semibold">creativity with data-driven insights</span>. We ensure that every post, ad, and campaign serves a clear purpose and delivers measurable results.
              </p>

              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center md:text-left">
                We specialize in <span className="font-semibold">Social Media Management, Meta Ads, Content Creation and Automation</span>, providing brands with the tools to scale their online presence with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">What We Do Best</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Social Media Management",
                desc: "Consistent posting, community engagement, and trend-driven strategies to keep your brand relevant.",
              },
              {
                title: "Paid Advertising (Meta, Google & More)",
                desc: "ROI-focused ad funnels that generate leads and sales.",
              },
              {
                title: "Content Creation",
                desc: "Creative posts, videos, and campaigns that stop the scroll and drive action.",
              },
              {
                title: "Automation & Funnels",
                desc: "Smart systems that convert visitors into repeat buyers without manual effort.",
              },
              {
                title: "Analytics & Optimization",
                desc: "Real-time performance tracking to refine and scale campaigns.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center">Why Brands Trust The Next Funnel</h2>

            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-md text-center md:text-left">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We take a <span className="font-semibold">strategy-first approach</span> to tailor campaigns to your goals. Our focus is on creating content that <span className="font-semibold">drives performance</span>, backed by <span className="font-semibold">measurable data</span>. With a complete funnel approach—from <span className="font-semibold">awareness to sales</span>—we deliver results that scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Funnel Section */}
      <section className="bg-gray-50 py-12 sm:py-20 px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">How We Build Your Next Funnel</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {[
              { num: "01", title: "Discovery", desc: "Understand your brand & goals clearly before planning.", color: "bg-red-500", icon: "🔍" },
              { num: "02", title: "Strategy", desc: "Design a custom plan for maximum impact and ROI.", color: "bg-yellow-500", icon: "📊" },
              { num: "03", title: "Execution", desc: "Launch creative content and ad campaigns across channels.", color: "bg-blue-500", icon: "🚀" },
              { num: "04", title: "Optimization", desc: "Test, refine, and improve for better performance.", color: "bg-green-500", icon: "⚡" },
              { num: "05", title: "Scaling", desc: "Expand strategies for sustainable growth & revenue.", color: "bg-purple-500", icon: "📈" },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 bg-white shadow-md rounded-xl p-4 sm:p-5 hover:shadow-lg transition">
                <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-white font-bold text-lg ${step.color}`}>
                  {step.num}
                </div>

                <div className="text-left">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="mr-2">{step.icon}</span> {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 md:px-8 text-center bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Build Your Next Funnel?</h2>
          <p className="mb-8 text-base sm:text-lg">
            Let’s create a <strong>social media strategy that actually converts</strong>. Whether you’re a startup or an established brand, we’ll help you scale smarter.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-md bg-white text-black font-semibold transition-transform active:scale-95"
            >
              Get Started Today
            </Link>

            <Link
              href="/free-audit"
              className="inline-block px-6 py-3 rounded-md border border-white/30 text-white font-semibold transition-transform active:scale-95"
            >
              Free Audit
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
