// src/app/free-audit/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FreeAuditPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [social, setSocial] = useState("");
  const [budget, setBudget] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function validate() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMsg({ type: "error", text: "Please fill Name, Email and Message." });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatusMsg({ type: "error", text: "Please enter a valid email address." });
      return false;
    }
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        message: `FREE AUDIT REQUEST\nWebsite: ${website || "—"}\nSocial: ${social || "—"}\nBudget: ${budget || "—"}\n\nMessage:\n${message.trim()}`,
        planId: "free-audit",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to send. Try again later.");
      }

      setStatusMsg({ type: "success", text: "Thanks! Your audit request was sent. We'll reach out soon." });
      setName("");
      setEmail("");
      setWebsite("");
      setSocial("");
      setBudget("");
      setMessage("");
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err?.message ?? "Unexpected error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen relative py-16 bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Free Audit</h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Request a no-cost audit of your social presence and ad funnels. We'll review profiles, ad accounts, creatives and funnel flows — then return a prioritized action plan.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <div className="rounded-2xl p-6 md:p-8 bg-white/5 border border-white/6 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-3">What we review</h2>
              <p className="text-gray-300 mb-4">
                We audit profile setup, creative & copy, ad account structure, targeting, and your conversion funnel — then prioritise fixes and quick wins.
              </p>

              <ul className="space-y-3 text-gray-200 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✅</span>
                  <span>Quick 48–72 hour turnaround</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✅</span>
                  <span>Actionable growth recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✅</span>
                  <span>Ad performance & creative review</span>
                </li>
              </ul>

              <div className="rounded-lg p-4 bg-white/3 border border-white/4">
                <h3 className="text-sm font-semibold text-white mb-1">What we need from you</h3>
                <p className="text-sm text-gray-300">Website, socials, approximate ad spend and a short description of goals/challenges.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <form
              className="bg-white/5 border border-white/6 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-sm"
              onSubmit={onSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">Name *</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="Your name"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">Email *</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="you@company.com"
                    required
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">Website</span>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="https://yourwebsite.com"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-200">Social handle / Page</span>
                  <input
                    value={social}
                    onChange={(e) => setSocial(e.target.value)}
                    className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="@yourhandle or facebook.com/page"
                  />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-sm font-medium text-gray-200">Monthly Ad Budget (approx.)</span>
                  <input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                    placeholder="$500 - $5,000"
                  />
                </label>
              </div>

              <label className="flex flex-col mt-4">
                <span className="text-sm font-medium text-gray-200">Message *</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 px-4 py-3 rounded-lg bg-transparent border border-white/10 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/10 min-h-[120px] resize-vertical"
                  placeholder="Briefly describe your goals, current pain points, or what you want us to audit."
                  required
                />
              </label>

              {statusMsg && (
                <div
                  role="status"
                  className={`mt-4 rounded-md px-4 py-3 text-sm ${
                    statusMsg.type === "success" ? "bg-green-800/10 text-green-200" : "bg-rose-800/10 text-rose-200"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                 <button
    type="submit"
    disabled={loading}
    className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-full shadow transition-all duration-300
      ${
        loading
          ? "bg-gray-400 text-white cursor-wait"
          : "bg-white text-black hover:bg-green-700 hover:text-white hover:shadow-lg active:scale-95 active:bg-green-500"
      }`}
    aria-busy={loading}
  >
    {loading ? "Sending…" : "Request For Free Audit"}
  </button>

                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setEmail("");
                    setWebsite("");
                    setSocial("");
                    setBudget("");
                    setMessage("");
                    setStatusMsg(null);
                  }}
                  className="px-4 py-2 rounded-md text-sm border border-white/10 bg-white/5 text-white hover:bg-white/6 w-full sm:w-auto"
                >
                  Reset
                </button>
              </div>

              <p className="mt-4 text-xs text-gray-300 max-w-md">
                By submitting you agree to our{" "}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
                . We'll never share your data.
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
