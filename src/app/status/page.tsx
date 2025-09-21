// src/app/status/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status – The Next Funnel",
  description: "Service status, incidents, and scheduled maintenance.",
};

type Service = { id: string; name: string; status: "operational" | "partial" | "down" | "maintenance"; note?: string };

const SERVICES: Service[] = [
  { id: "site", name: "Website", status: "operational" },
  { id: "api", name: "Public API (if any)", status: "operational" },
  { id: "chatbot", name: "Chat Assistant", status: "operational" },
  { id: "email", name: "Transactional Email", status: "operational" },
];

export default function StatusPage() {
  const formatStatus = (s: Service["status"]) => {
    switch (s) {
      case "operational":
        return { label: "Operational", color: "bg-green-500" };
      case "partial":
        return { label: "Partial Outage", color: "bg-yellow-500" };
      case "down":
        return { label: "Major Outage", color: "bg-red-600" };
      case "maintenance":
        return { label: "Maintenance", color: "bg-blue-500" };
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#0a1a2f] via-[#0d2140] to-[#1a3b6b] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4">System Status</h1>
        <p className="text-gray-300 mb-8">
          Live status of our site and services. If you are experiencing issues, please check this page for updates.
        </p>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {SERVICES.map((svc) => {
            const s = formatStatus(svc.status);
            return (
              <div key={svc.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">{svc.name}</div>
                  {svc.note && <div className="text-sm text-gray-300">{svc.note}</div>}
                </div>

                <div className={`px-3 py-1 rounded-full text-sm font-medium ${s.color} text-black`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent incidents / history */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Recent incidents</h2>

          <div className="space-y-4 text-gray-300">
            <div>
              <div className="text-sm font-medium">No incidents reported</div>
              <div className="text-xs text-gray-400">All systems operational.</div>
            </div>

            {/* Example incident item (comment out if not used) */}
            {/* <div>
              <div className="text-sm font-medium">2024-11-12 — Chat Assistant partial outage</div>
              <div className="text-xs text-gray-400">We experienced intermittent delays in the assistant. Issue resolved.</div>
            </div> */}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="mb-2">If you are seeing a problem not listed here, please contact us at:</p>
          <p className="font-medium text-white">thenextfunnel@gmail.com</p>
        </div>
      </div>
    </main>
  );
}
