"use client";

import React, { useRef, useState } from "react";

type FormState = {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  services: string;
  message: string;
};

export default function CustomPlanForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    budget: "",
    services: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // field-level errors
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const refMap = useRef<Partial<Record<keyof FormState, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((s) => ({ ...s, [k]: v }));
    setFieldErrors((fe) => {
      const next = { ...fe };
      if (next[k]) delete next[k];
      return next;
    });
    setSuccess(null);
  }

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) errs.name = "Please enter your name.";
    if (!form.email.trim()) errs.email = "Please enter your email.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.services.trim() && !form.message.trim())
      errs.services = "Please describe the services you need or add a message.";

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      const firstKey = Object.keys(errs)[0] as keyof FormState;
      const el = refMap.current[firstKey];
      if (el && "focus" in el) {
        (el as HTMLElement).focus();
        setTimeout(() => (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" }), 80);
      }
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Submission failed");
      }

      setSuccess("✅ Thanks! We received your request and will contact you soon.");
      setForm({ name: "", email: "", company: "", budget: "", services: "", message: "" });
    } catch (err: any) {
      // show generic inline error near submit button
      setSuccess("❌ Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const attachRef = (k: keyof FormState) => (el: any) => {
    refMap.current[k] = el;
  };

  const submitBtnClasses =
    "px-4 py-2 rounded-full bg-white text-black font-semibold disabled:opacity-60 transform transition-all duration-150 hover:scale-[1.025] active:scale-95";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success message only */}
      {success ? <div className="p-4 rounded-md bg-emerald-600/20 text-emerald-200">{success}</div> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <input
            ref={attachRef("name")}
            className={`w-full px-3 py-2 rounded-md bg-white/5 border ${
              fieldErrors.name ? "border-red-400" : "border-white/6"
            }`}
            placeholder="Full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p>}
        </div>

        <div>
          <input
            ref={attachRef("email")}
            className={`w-full px-3 py-2 rounded-md bg-white/5 border ${
              fieldErrors.email ? "border-red-400" : "border-white/6"
            }`}
            placeholder="Email address"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-400">{fieldErrors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          ref={attachRef("company")}
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6"
          placeholder="Company (optional)"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
        <input
          ref={attachRef("budget")}
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6"
          placeholder="Monthly budget (optional)"
          value={form.budget}
          onChange={(e) => update("budget", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">Services you're interested in</label>
        <input
          ref={attachRef("services")}
          className={`w-full px-3 py-2 rounded-md bg-white/5 border ${
            fieldErrors.services ? "border-red-400" : "border-white/6"
          }`}
          placeholder="E.g. Content creation, Ads, Email automation"
          value={form.services}
          onChange={(e) => update("services", e.target.value)}
        />
        {fieldErrors.services && <p className="mt-1 text-xs text-red-400">{fieldErrors.services}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-2">Tell us about your goals</label>
        <textarea
          ref={attachRef("message")}
          rows={4}
          className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/6"
          placeholder="Write a short summary of your goals, target audience, timelines..."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className={submitBtnClasses}>
          {submitting ? "Sending…" : "Request My Custom Plan"}
        </button>

        <button
          type="button"
          onClick={() =>
            setForm({ name: "", email: "", company: "", budget: "", services: "", message: "" })
          }
          className="px-4 py-2 rounded-full border border-white/10 text-white"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
