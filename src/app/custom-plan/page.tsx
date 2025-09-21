
import CustomPlanForm from "../../components/CustomPlanForm"; // <- relative import
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build My Custom Plan – The Next Funnel",
  description:
    "Tell us about your goals and we'll build a tailored marketing + automation plan for your brand.",
};

export default function CustomPlanPage() {
  return (
    <main className="min-h-screen py-16 bg-gradient-to-r from-[#061221] via-[#07263e] to-[#0f3b5b] text-white">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Build My Custom Plan</h1>
          <p className="text-gray-300 mt-3 max-w-2xl mx-auto">
            Tell us about your brand, goals and budget. We'll design a tailored mix of content, automation and ads
            to reach your growth objectives.
          </p>
        </header>

        <section className="bg-white/5 border border-white/6 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What we'll do</h3>
              <ul className="text-gray-200 space-y-2 list-inside">
                <li>• Proposal with recommended channels, content and funnels</li>
                <li>• Estimated timeline &amp; cost</li>
                <li>• Suggested KPIs &amp; growth tactics</li>
                <li>• Optional kick-off meeting</li>
              </ul>

              <div className="mt-6 text-sm text-gray-300">
                Prefer to speak first?{" "}
                <a href="/contact" className="underline" aria-label="Contact us about a custom plan">
                  Contact us
                </a>{" "}
                and mention "Custom Plan".
              </div>
            </div>

            <div>
              {/* Client component that handles the form and submission */}
              <CustomPlanForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
