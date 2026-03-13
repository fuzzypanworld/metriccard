export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(circle at 12% 0%, rgba(59,130,246,0.12), transparent 36%), radial-gradient(circle at 88% 100%, rgba(14,165,233,0.08), transparent 34%), var(--background)",
      }}
    >
      {children}
    </div>
  );
}
