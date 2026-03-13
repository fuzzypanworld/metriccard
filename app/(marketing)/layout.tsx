export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 12% 0%, rgba(59,130,246,0.10), transparent 40%), radial-gradient(circle at 88% 100%, rgba(14,165,233,0.06), transparent 40%), radial-gradient(circle at 50% 50%, rgba(99,102,241,0.04), transparent 60%), var(--background)",
      }}
    >
      {children}
    </div>
  );
}
