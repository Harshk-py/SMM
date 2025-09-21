"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
};

export default function ContactClient() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    inquiryType: "",
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
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.inquiryType.trim()) return "Please select an inquiry type.";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      setSuccess("Thanks! We'll get back to you shortly.");
      setForm({ name: "", email: "", inquiryType: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong — try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-3 rounded-md bg-green-600/60 text-white-300">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-600/80 text-white">{error}</div>
      )}

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <input
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      {/* Inquiry Type Dropdown */}
      <div>
  <label className="block text-sm text-gray-300 mb-2">
    Type of Inquiry
  </label>
  <select
    className="w-full px-3 py-2 rounded-md bg-[#0a1a2f] border border-white/10 text-black placeholder-gray-400 focus:outline-none"
    value={form.inquiryType}
    onChange={(e) => update("inquiryType", e.target.value)}
  >
    <option value="" className="text-black">Select an option</option>
    <option value="pricing" className="text-black">💲 Pricing</option>
    <option value="services" className="text-black">📌 Services</option>
    <option value="support" className="text-black">🛠️ Support</option>
    <option value="partnership" className="text-black">🤝 Partnership</option>
    <option value="other" className="text-black">✨ Other</option>
  </select>
</div>


      {/* Message */}
      <div>
        <label className="block text-sm text-gray-300 mb-2">Message</label>
        <textarea
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
            setForm({ name: "", email: "", inquiryType: "", message: "" })
          }
          className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white/10 active:scale-95 transition"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
