import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Editing – The Next Funnel",
  description:
    "Engaging, high-retention video edits for Reels, TikToks, and ad campaigns to boost brand awareness.",
};

export default function VideoEditingPage() {
  return (
    <main className="py-5 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Heading */}
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-1 text-center 
          bg-white text-transparent bg-clip-text leading-tight pb-1"
        >
          Video Editing
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-200 leading-relaxed text-center mb-12">
          Our video editing service creates high-retention TikToks, Reels, Shorts, 
          and ad creatives that not only grab attention but keep viewers hooked. 
          From storytelling to special effects, we craft videos designed to engage 
          your audience and convert views into action.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🎬 Viral Reels & TikToks</h3>
            <p className="text-gray-200">
              Short-form edits designed to maximize reach and boost virality on social platforms.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">✨ Motion Graphics</h3>
            <p className="text-gray-200">
              Professional animations and motion graphics that add depth and excitement to your content.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">📢 Ad Creatives</h3>
            <p className="text-gray-200">
              Story-driven video ads crafted to drive conversions and ROI across campaigns.
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-md hover:shadow-lg transition">
            <h3 className="text-xl font-bold mb-3 text-white">🎥 High-Retention Edits</h3>
            <p className="text-gray-200">
              Engaging cuts, transitions, and pacing that keep viewers watching until the very end.
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
