import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services – The Next Funnel",
  description:
    "Social media, Meta ads, content creation, automation, and more.",
};

const services = [
  {
    title: "Social Media Management",
    desc: "Grow your brand with daily posts, stories & analytics-driven strategies.",
    gradient: "from-indigo-500 to-purple-600",
    link: "/services/social-media-management",
  },
  {
    title: "Branding & Design",
    desc: "Beautiful carousels, logos & branding to make your business stand out.",
    gradient: "from-pink-500 to-red-500",
    link: "/services/branding-design",
  },
  {
    title: "Video Editing",
    desc: "High-retention reels, TikToks & ad creatives that go viral.",
    gradient: "from-purple-500 to-indigo-600",
    link: "/services/video-editing",
  },
  {
    title: "Meta Ads",
    desc: "ROI-focused Facebook & Instagram ads that convert clicks into sales.",
    gradient: "from-green-400 to-emerald-600",
    link: "/services/meta-ads",
  },
  {
    title: "Email Marketing",
    desc: "Automated email funnels & newsletters to nurture and convert leads.",
    gradient: "from-red-400 to-pink-600",
    link: "/services/email-marketing",
  },
  {
    title: "IG Automation",
    desc: "Smart DM automation to reply instantly, qualify leads & close deals 24/7.",
    gradient: "from-orange-400 to-yellow-500",
    link: "/services/ig-automation",
  },
];

export default function Page() {
  return (
    <main className="relative py-14 text-white overflow-hidden bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      {/* 🎨 Floating Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="floating-icon left-10 top-10">📱</span>
        <span className="floating-icon right-16 top-12">🎨</span>
        <span className="floating-icon left-1/3 top-5">🎬</span>
        <span className="floating-icon right-1/4 top-32">📢</span>
        <span className="floating-icon left-1/4 top-40">📧</span>
        <span className="floating-icon right-10 top-48">🤖</span>
      </div>

      <div className="container relative z-10 mx-auto px-3">
        {/* Heading */}
        <div className="container mx-auto px-1 max-w-6xl">
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 text-center 
            bg-white text-transparent bg-clip-text leading-tight"
          >
            OUR SERVICES
          </h1>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-8 text-white bg-gradient-to-r ${service.gradient} transition-transform duration-300 transform hover:-translate-y-2`}
            >
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold mb-3 whitespace-nowrap">
                  {service.title}
                </h3>
                <p className="text-gray-100 flex-grow">{service.desc}</p>

                {/* CTA */}
                <Link href={service.link}>
                  <button
                    className="mt-5 w-full px-5 py-3 bg-white text-gray-900 font-semibold rounded-full shadow 
                      transition-all duration-300 ease-in-out
                      hover:text-gray hover:shadow-lg 
                      hover:scale-105 active:scale-95"
                  >
                    Learn More →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
