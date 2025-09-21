// src/app/services/social-media-management/page.tsx
import type { Metadata } from "next";
import { HiOutlineChevronDown } from "react-icons/hi";

export const metadata: Metadata = {
  title: "Social Media Management – The Next Funnel",
  description:
    "Boost your online presence with our expert social media management services. From content strategy to daily posting and analytics.",
};

const FAQ_ITEMS = [
  {
    q: "How often do you post?",
    a: "We typically post 4–7 times a week depending on your package, audience behavior, and platform best practices. We customize frequency to match your goals and audience engagement patterns.",
  },
  {
    q: "Can I see reports?",
    a: "Yes, We deliver monthly analytics reports that highlight reach, engagement, top-performing content, follower growth, and actionable recommendations.",
  },
  {
    q: "Which platforms do you manage?",
    a: "We handle Facebook, Instagram And YouTube. We also advise on platform prioritization and cross-posting strategies depending on your audience and business goals.",
  },
  {
    q: "Do you create content or only schedule it?",
    a: "We do both. Our packages include content creation (graphics, captions, short videos) and scheduling. You can also provide content and we'll optimize and post it for you.",
  },
  {
    q: "How do you handle community management?",
    a: "We monitor comments and messages, respond according to your brand voice, and escalate anything that needs your attention. Community guidelines and response templates are created during onboarding.",
  },
];

export default function SocialMediaManagementPage() {
  return (
    <main className="py-5 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header / Hero */}
        <header className="text-center mb-8">
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-2 
                       bg-white text-transparent bg-clip-text leading-tight"
          >
            Social Media Management
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Grow your brand with daily posts, stories, and analytics-driven strategies.
            Our social media management service ensures that your business stands out
            and connects with the right audience.
          </p>
        </header>

        {/* Quick benefits */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white/10 rounded-2xl shadow-md hover:shadow-lg text-center">
            <p className="text-gray-100 font-medium">Daily engaging posts crafted by experts</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl shadow-md hover:shadow-lg text-center">
            <p className="text-gray-100 font-medium">Consistency across all platforms</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl shadow-md hover:shadow-lg text-center">
            <p className="text-gray-100 font-medium">Tailored strategies for your brand</p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <article className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">📅 Content Calendar</h3>
            <p className="text-gray-200">
              We plan and schedule your posts ahead of time to maintain consistency and engagement.
            </p>
          </article>

          <article className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">📈 Analytics & Reports</h3>
            <p className="text-gray-200">
              Track performance with detailed insights on reach, engagement, and growth metrics.
            </p>
          </article>

          <article className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🎯 Audience Growth</h3>
            <p className="text-gray-200">
              We help you reach new audiences through targeted strategies that build loyal followers.
            </p>
          </article>

          <article className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🤝 Community Engagement</h3>
            <p className="text-gray-200">
              We respond, engage, and build relationships with your audience to boost trust and loyalty.
            </p>
          </article>
        </section>

        {/* Why Choose Us */}
        <section className="mt-10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Why Choose The Next Funnel?</h2>
          <p className="text-gray-300 max-w-3xl mx-auto mb-8">
            With years of expertise in managing social media for startups, e-commerce brands,
            and enterprises, we know what works. Our dedicated team combines creativity with
            data-driven insights to maximize your results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/10 rounded-2xl shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold text-white mb-2">Proven Growth</h4>
              <p className="text-gray-300">100+ clients grew faster with our strategies.</p>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold text-white mb-2">Creative Content</h4>
              <p className="text-gray-300">We craft unique content tailored to your brand voice.</p>
            </div>
            <div className="p-6 bg-white/10 rounded-2xl shadow hover:shadow-lg">
              <h4 className="text-xl font-semibold text-white mb-2">Full Support</h4>
              <p className="text-gray-300">From posting to engagement – we handle it all.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center text-white mb-6">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <blockquote className="p-6 bg-white/10 rounded-2xl shadow-md backdrop-blur-lg">
              <p className="text-gray-200 italic mb-4">
                “The Next Funnel transformed our social presence. Engagement and sales skyrocketed within months!”
              </p>
              <footer>
                <p className="text-white font-bold">Sarah Johnson</p>
                <p className="text-gray-400 text-sm">CEO, EcoTrend</p>
              </footer>
            </blockquote>

            <blockquote className="p-6 bg-white/10 rounded-2xl shadow-md backdrop-blur-lg">
              <p className="text-gray-200 italic mb-4">
                “Professional, consistent, and creative! Their team manages everything so smoothly.”
              </p>
              <footer>
                <p className="text-white font-bold">David Kim</p>
                <p className="text-gray-400 text-sm">Founder, FitZone</p>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* FAQ using native details/summary (no React state) */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold text-center text-white mb-6">Frequently Asked Questions</h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <details
                key={idx}
                className="bg-white/5 rounded-xl ring-1 ring-white/5 p-4"
                // open by default for the first item
                {...(idx === 0 ? { open: true } : {})}
              >
                <summary className="list-none cursor-pointer flex items-center justify-between">
                  <span className="text-lg md:text-xl font-semibold text-white">{item.q}</span>
                  <HiOutlineChevronDown className="w-6 h-6 text-gray-200" />
                </summary>
                <div className="mt-3 text-gray-300">
                  <p>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mt-8 pb-12">
          <a
            href="/pricing"
                        className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition transform active:scale-95"

          >
            Get Started →
          </a>
        </section>
      </div>
    </main>
  );
}
