export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-full overflow-hidden">{children}</div>;
}
