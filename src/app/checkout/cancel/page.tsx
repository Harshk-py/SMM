// src/app/checkout/cancel/page.tsx
export const metadata = {
  title: "Checkout Cancelled - The Next Funnel",
  description: "Your payment was cancelled on PayPal.",
};

// Temporary safe static page — avoids any client/server imports during build
export default function TempCancelPage() {
  return (
    <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif" }}>
      <h1>Payment Cancelled</h1>
      <p>This is a temporary page to allow the site to deploy. The full cancel UI will be restored after debugging.</p>
      <p>
        <a href="/pricing">Return to pricing</a>
      </p>
    </main>
  );
}
