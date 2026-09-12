export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-7">
      <span className="inline-flex items-center justify-center px-10 py-2.5 rounded-full bg-pink-soft text-ink text-[19px] tracking-tight">
        {children}
      </span>
    </div>
  );
}
