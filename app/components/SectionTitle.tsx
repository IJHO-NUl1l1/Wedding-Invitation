export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-8">
      <span className="relative inline-flex items-center justify-center px-9 py-2.5 rounded-full bg-pink-soft text-ink text-base font-medium tracking-tight">
        <span
          aria-hidden
          className="absolute inset-0 -m-2 rounded-full bg-pink-soft/35 blur-md"
        />
        <span className="relative">{children}</span>
      </span>
    </div>
  );
}
