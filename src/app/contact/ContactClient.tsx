// src/app/contact/ContactClient.tsx
"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  planId: string;      // <-- send this key to match your API
  message: string;
};

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    planId: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!/\S+@\S+\.\S+/.test(form.email))
      return "Please enter a valid email.";
    if (!form.planId.trim()) return "Please select an inquiry type.";
    if (!form.message.trim()) return "Please enter a message.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // debug: show the outgoing payload in console (remove in production)
      console.log("Contact payload:", form);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // sends { name, email, planId, message }
      });

      // helpful debug: inspect response body for errors while testing
      const text = await res.text();
      let parsed: any = null;
      try { parsed = text ? JSON.parse(text) : null; } catch (e) { parsed = text; }
      console.log("Contact response:", res.status, parsed);

      if (!res.ok) {
        // if backend returned JSON error, show it
        const message =
          parsed && typeof parsed === "object" && parsed.error
            ? parsed.error
            : "Submission failed";
        throw new Error(message);
      }

      setSuccess("Thanks! We'll get back to you shortly.");
      setForm({ name: "", email: "", planId: "", message: "" });
    } catch (err: any) {
      setError(err?.message || "Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-3 rounded-md bg-green-600/60 text-white">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-600/80 text-white">{error}</div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          name="name"
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          name="email"
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>
{/* Inquiry Type Dropdown (sends planId) */}
<div>
  <label className="block text-sm text-gray-300 mb-2">Type of Inquiry</label>
  <select
    name="planId"
    className="w-full px-3 py-2 rounded-md bg-black border border-white/20 text-white focus:outline-none"
    value={form.planId}
    onChange={(e) => update("planId", e.target.value)}
  >
    <option value="" className="bg-black text-white">Select an option</option>
    <option value="pricing" className="bg-black text-white">💲 Pricing</option>
    <option value="services" className="bg-black text-white">📌 Services</option>
    <option value="support" className="bg-black text-white">🛠️ Support</option>
    <option value="partnership" className="bg-black text-white">🤝 Partnership</option>
    <option value="custom-plan" className="bg-black text-white">🪛 Custom Plan</option>
    <option value="other" className="bg-black text-white">✨ Other</option>
  </select>
</div>

      {/* Message */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Message</label>
        <textarea
          name="message"
          rows={4}
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400"
          placeholder="Write your message here..."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-full bg-white text-black font-semibold disabled:opacity-60 active:scale-95 transition"
        >
          {submitting ? "Sending…" : "Send"}
        </button>

        <button
          type="button"
          onClick={() =>
            setForm({ name: "", email: "", planId: "", message: "" })
          }
          className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 active:scale-95 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
