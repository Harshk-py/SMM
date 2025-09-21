export const metadata = {
  title: "Services — The Next Funnel",
  description: "Explore the services offered by The Next Funnel",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
