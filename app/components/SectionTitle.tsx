/**
 * 시안의 섹션 제목 배지.
 * 둥근 사각형이 아니라 가로로 긴 타원이고, 분홍 바탕 안쪽에 가는 어두운 타원 테두리가 하나 더 있다.
 */
export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center mb-7">
      <span className="relative inline-flex items-center justify-center rounded-[50%] bg-pink-soft px-9 py-5">
        <span
          aria-hidden
          className="absolute inset-x-[7px] inset-y-[6px] rounded-[50%] border border-ink/75"
        />
        <span className="relative text-[19px] leading-none text-ink">{children}</span>
      </span>
    </div>
  );
}
