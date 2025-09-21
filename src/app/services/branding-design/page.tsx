// src/app/branding-design/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Branding & Design – The Next Funnel",
  description:
    "Create a powerful visual identity with branding and design services. Logos, carousels, and brand assets tailored to your business.",
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-lg bg-white/6 flex items-center justify-center text-white/95">
      {children}
    </div>
  );
}

/* Simple inline "logo" generator — replace text or styling as desired */
function LogoMark({ size = 48, label = "TNF" }: { size?: number; label?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="gA" x1="0" x2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#gA)" />
      <text x="50%" y="53%" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fontSize="20" fill="#fff">
        {label}
      </text>
    </svg>
  );
}

/* Mockup: phone with logo in app */
function MockupPhone({ label = "TNF" }: { label?: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/8 flex flex-col items-center gap-3">
      <div className="text-sm text-white/75">App preview</div>
      <div className="w-36 h-[72px] rounded-2xl bg-[#071126] p-2 flex items-center justify-center shadow-inner">
        <div className="w-28 h-28 flex items-center justify-center bg-transparent">
          <LogoMark label={label} size={56} />
        </div>
      </div>
      <div className="text-xs text-white/60">Logo on mobile app</div>
    </div>
  );
}

/* Mockup: signboard */
function MockupSign({ label = "The Next Funnel" }: { label?: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/8 flex flex-col items-center gap-3">
      <div className="text-sm text-white/75">Signage</div>
      <svg width="180" height="72" viewBox="0 0 360 144" className="rounded-lg shadow-sm" aria-hidden>
        <defs>
          <linearGradient id="gB" x1="0" x2="1">
            <stop offset="0" stopColor="#041124" />
            <stop offset="1" stopColor="#0b2238" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="360" height="144" rx="10" fill="url(#gB)" />
        {/* logo mark */}
        <rect x="22" y="22" width="100" height="100" rx="12" fill="#fff" opacity="0.06" />
        <g transform="translate(64,82)">
          <LogoMark label="TNF" size={48} />
        </g>
        <text x="140" y="82" fill="#fff" fontSize="28" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">
          {label}
        </text>
      </svg>
      <div className="text-xs text-white/60">Signboard / storefront look</div>
    </div>
  );
}

/* Mockup: social card */
function MockupSocialCard({ label = "The Next Funnel" }: { label?: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/8 flex flex-col items-center gap-3">
      <div className="text-sm text-white/75">Social preview</div>
      <div className="w-56 h-32 rounded-lg overflow-hidden shadow-md bg-gradient-to-tr from-[#061a2d] to-[#10243a]">
        <div className="flex h-full">
          <div className="p-3 flex items-center">
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <LogoMark label="TNF" size={48} />
            </div>
          </div>
          <div className="flex-1 p-3 flex flex-col justify-center text-white">
            <div className="font-semibold">{label}</div>
            <div className="text-xs text-white/80 mt-1">Creative ads • AI automation</div>
          </div>
        </div>
      </div>
      <div className="text-xs text-white/60">Post / ad card</div>
    </div>
  );
}

/* Mockup: avatar / favicon */
function MockupAvatar({ label = "TNF" }: { label?: string }) {
  return (
    <div className="p-4 bg-white/5 rounded-2xl border border-white/8 flex flex-col items-center gap-3">
      <div className="text-sm text-white/75">Avatar</div>
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 flex items-center justify-center shadow-lg">
        <span className="text-white font-bold">{label}</span>
      </div>
      <div className="text-xs text-white/60">Profile / favicon</div>
    </div>
  );
}

export default function BrandingDesignPage() {
  return (
    <main className="py-12 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      <div className="mx-auto max-w-6xl px-6">
        {/* HERO */}
        <header className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Branding & Design that Converts
          </h1>
          <p className="text-lg text-white/85">
            We craft distinctive visual identities and marketing assets — logos,
            social carousels, ad creative and brand systems — designed to build
            trust, improve conversions and scale your presence across channels.
          </p>
        </header>

        {/* Quick Benefits */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 bg-white/5 rounded-xl border border-white/8">
            <div className="flex items-start gap-4">
              <Icon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 21c.6-3 2-6 6-9l7-7 3 3-7 7c-3 4-6 5-9 6z" fill="currentColor" />
                </svg>
              </Icon>
              <div>
                <h4 className="font-semibold">Design With Purpose</h4>
                <p className="text-sm text-white/80 mt-1">
                  Every asset is created to support a clear business goal — awareness,
                  leads, or conversions.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/8">
            <div className="flex items-start gap-4">
              <Icon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
                </svg>
              </Icon>
              <div>
                <h4 className="font-semibold">Brand Systems</h4>
                <p className="text-sm text-white/80 mt-1">
                  Logo, color palette, typography, iconography and templates — everything
                  to keep your brand consistent and reusable.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/8">
            <div className="flex items-start gap-4">
              <Icon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 20l1-4 4-1 9-9 1 1-9 9-1 4-4 1z" fill="currentColor" />
                </svg>
              </Icon>
              <div>
                <h4 className="font-semibold">Designed to Scale</h4>
                <p className="text-sm text-white/80 mt-1">
                  Templates and systems that make it fast to produce marketing creative
                  without sacrificing quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables grid */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white/5 rounded-xl border border-white/8">
              <h3 className="font-semibold mb-2">Logo & Mark</h3>
              <p className="text-sm text-white/80 mb-3">
                Primary & secondary marks, monochrome and responsive variants,
                and clear usage guidelines.
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                <li>✦ Primary / secondary logo</li>
                <li>✦ Favicon & app icon</li>
                <li>✦ File pack: SVG, EPS, PNG</li>
              </ul>
            </div>

            <div className="p-5 bg-white/5 rounded-xl border border-white/8">
              <h3 className="font-semibold mb-2">Brand System</h3>
              <p className="text-sm text-white/80 mb-3">
                Colors, fonts, tone, and layout rules so all content feels cohesive.
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                <li>✦ Color palette & usage</li>
                <li>✦ Typography scale</li>
                <li>✦ Icon set & patterns</li>
              </ul>
            </div>

            <div className="p-5 bg-white/5 rounded-xl border border-white/8">
              <h3 className="font-semibold mb-2">Marketing Assets</h3>
              <p className="text-sm text-white/80 mb-3">
                Ready-to-publish social posts, ad creative, story templates and carousels.
              </p>
              <ul className="text-sm text-white/80 space-y-1">
                <li>✦ 10 social carousel templates</li>
                <li>✦ 5 static ad variants</li>
                <li>✦ Editable Figma / Canva files</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">How we work</h2>

          <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                title: "Discover",
                desc: "Brand interview, competitors & audience research.",
              },
              {
                title: "Define",
                desc: "Positioning, tone, and core messaging workshop.",
              },
              {
                title: "Design",
                desc: "Exploration, concepts, feedback rounds and refinement.",
              },
              {
                title: "Deliver",
                desc: "Final assets, templates and a hand-off guide.",
              },
            ].map((s, i) => (
              <li
                key={s.title}
                className="p-4 bg-white/5 rounded-xl border border-white/8 text-center"
              >
                <div className="mx-auto w-11 h-11 rounded-full bg-white/6 flex items-center justify-center mb-3 text-white font-semibold">
                  {i + 1}
                </div>
                <h4 className="font-semibold">{s.title}</h4>
                <p className="text-sm text-white/80 mt-2">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-3">
            <details className="bg-white/5 rounded-xl p-4 border border-white/8">
              <summary className="cursor-pointer list-none font-medium">How long does a branding project usually take?</summary>
              <div className="mt-2 text-sm text-white/80">Starter projects typically take 2–3 weeks. Growth and Enterprise timelines vary depending on scope and feedback rounds.</div>
            </details>
            <details className="bg-white/5 rounded-xl p-4 border border-white/8">
              <summary className="cursor-pointer list-none font-medium">Will we own the final assets?</summary>
              <div className="mt-2 text-sm text-white/80">Yes — final deliverables are licensed/assigned to you as defined in the service agreement.</div>
            </details>
            <details className="bg-white/5 rounded-xl p-4 border border-white/8">
              <summary className="cursor-pointer list-none font-medium">Do you provide source files?</summary>
              <div className="mt-2 text-sm text-white/80">We provide editable Figma or Canva files, plus exported SVG/PNG/AI assets.</div>
            </details>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <a
            href="/pricing"
            className="inline-block px-6 py-3 rounded-full bg-white text-black font-semibold shadow hover:shadow-lg transition transform active:scale-95"
          >
            Get Started →
          </a>
        </div>

        <div className="h-12" />
      </div>
    </main>
  );
}
