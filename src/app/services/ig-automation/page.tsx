 import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagram Automation – The Next Funnel",
  description:
    "Smart Instagram DM automation that qualifies leads and closes deals 24/7.",
};

export default function IGAutomationPage() {
  return (
    <main className="pt-8 md:pt-12 pb-16 text-white bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: copy */}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-5 bg-white text-transparent bg-clip-text leading-tight">
              Instagram Automation
            </h1>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
              Turn DMs into revenue with keyword triggers, quick replies, and automated funnels that capture,
              qualify, and nurture leads—24/7. We set it up. You watch conversations convert.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-sm">24/7 Autoresponder</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-sm">Keyword Routing</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-sm">Lead Capture</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-sm">CRM Sync</span>
            </div>

            <div className="mt-6">
              <a
                href="/pricing"
                className="inline-block px-5 py-2 rounded-full font-semibold bg-white text-black transition-all duration-200 hover:bg-amber-400 hover:shadow-lg"
              >
                Automate My DMs →
              </a>
            </div>
          </div>

          {/* Right: Instagram-like phone DM preview */}
          <div className="mx-auto w-full flex justify-center">
            <div className="rounded-2xl p-1 bg-white/6 backdrop-blur-md border border-white/8 shadow-2xl">
              {/* Phone inner wrapper */}
             <div className="rounded-[1.4rem] bg-black/95 w-[300px] sm:w-[320px] md:w-[360px] lg:w-[420px] flex flex-col overflow-hidden">
                {/* Top bar (IG style) */}
                <div className="relative flex items-center gap-3 px-3 py-3 border-b border-white/8">
                  <div className="absolute left-1/2 -translate-x-1/2 w-14 h-6 bg-white/6 rounded-full" />
                  <div className="h-8 w-8 rounded-full bg-black">
                      <img src="/images/ig.png" className="h-7 w-7 rounded-full object-cover border border-black" alt="avatar" />
                    </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate">thenextfunnel</p>
                    </div>
                    <p className="text-[11px] text-gray-400 -mt-0.5">Active now</p>
                  </div>

                  {/* top icons */}
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path strokeWidth="2" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012 4.18 2 2 0 014 2h3a2 2 0 012 1.72c.12.86.31 1.7.57 2.5a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.58-1.63a2 2 0 012.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0122 16.92z" />
                    </svg>
                    <svg className="h-5 w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9a1 1 0 012 0v5a1 1 0 11-2 0V9zm1-4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 px-3 py-3 overflow-y-auto space-y-3">
                  <div className="flex justify-center">
                    <span className="text-[10px] text-gray-500 bg-white/6 px-2 py-0.5 rounded-full">Today • 10:24 AM</span>
                  </div>

                  {/* inbound */}
                  <div className="max-w-[86%] rounded-2xl px-3.5 py-2 text-[13px] text-gray-100 bg-[#262626] break-words">
                    Hi! What's the price of your logo package?
                  </div>

                  {/* outbound */}
                  <div className="flex justify-end">
                    <div className="max-w-[86%] rounded-2xl px-3.5 py-2 text-[13px] text-white bg-gradient-to-r from-[#7b1fa2] to-[#c24bff] break-words leading-relaxed">
                      <div>Hey there! Our logo package starts from $49. Want examples or a quick call?</div>
                      <div className="mt-2 flex gap-2">
                        <span className="inline-block rounded-full bg-white/12 px-2 py-1 text-[11px]">See Samples</span>
                        <span className="inline-block rounded-full bg-white/12 px-2 py-1 text-[11px]">Book Call</span>
                      </div>
                    </div>
                  </div>

                  {/* inbound */}
                  <div className="max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] text-gray-100 bg-[#262626] break-words">
                    Sample Please !!
                  </div>

                  {/* outbound with media thumbs */}
                  <div className="flex justify-end">
                    <div className="max-w-[86%] rounded-2xl px-3.5 py-2 text-[13px] text-white bg-gradient-to-r from-[#7b1fa2] to-[#c24bff] break-words">
                      <div>Here are a few samples. Want a free brand audit?</div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <div className="h-14 rounded-md bg-white/25" />
                        <div className="h-14 rounded-md bg-white/25" />
                        <div className="h-14 rounded-md bg-white/25" />
                      </div>
                    </div>
                  </div>

                  {/* typing indicator */}
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                    <span className="inline-flex gap-1 items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-500 animate-bounce" />
                    </span>
                    <span>typing…</span>
                  </div>
                </div>

                {/* Input bar */}
                <div className="px-3 pb-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-[#0b0b0b] border border-white/8 px-3 py-2">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path strokeWidth="2" d="M12 5v14M5 12h14" />
                    </svg>
                    <input
                      aria-label="Message"
                      placeholder="Message..."
                      className="flex-1 bg-transparent text-[13px] text-gray-300 placeholder-gray-500 outline-none"
                    />
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path strokeWidth="2" d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z" />
                      <path strokeWidth="2" d="M19 11a7 7 0 01-14 0M12 18v4" />
                    </svg>
                    <div className="p-0.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]">
  <button
    aria-label="Send"
    className="flex items-center justify-center h-6 w-6 rounded-full bg-black text-white p-1 overflow-hidden"
  >
    {/* smaller icon so it never touches the edge */}
    <svg className="h-2 w-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  </button>
</div>

                  </div>
                </div>

              </div>
            </div>

            <div className="sr-only sm:not-sr-only ml-3">
              <p className="mt-3 text-center text-xs text-gray-300/80">Instagram DM Automation Preview</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-3xl mb-3">🔑</div>
              <h3 className="font-semibold text-lg mb-1">1) Triggers</h3>
              <p className="text-gray-200 text-sm">
                Keywords, story reactions, comments, and swipe-ups automatically start the right conversation.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-lg mb-1">2) Smart Flows</h3>
              <p className="text-gray-200 text-sm">
                Branching DM funnels qualify leads, answer FAQs, share links, and collect emails—instantly.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-lg mb-1">3) Capture & Convert</h3>
              <p className="text-gray-200 text-sm">
                Push hot leads to Calendly, WhatsApp, or checkout and sync contacts to your CRM or email tool.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">FAQs</h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {[
              {
                q: "Will this look spammy to my audience?",
                a: "No. We design human-like flows with natural delays and clear choices. You stay in control and can jump in anytime.",
              },
              {
                q: "What tools do you use?",
                a: "We use reliable IG-approved partners (and native features where available). Integrations include Calendly, Sheets, email tools, and CRMs.",
              },
              {
                q: "How quickly can we go live?",
                a: "Typically 3–7 days: strategy → copy → build → QA → launch. We also offer rush setups for campaigns.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl bg-white/10 border border-white/10 px-5 py-4 open:bg-white/15 transition"
              >
                <summary className="cursor-pointer list-none font-semibold">
                  {item.q}
                  <span className="float-right text-amber-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-gray-200">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
