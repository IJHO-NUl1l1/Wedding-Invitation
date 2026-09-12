"use client";

export default function RsvpButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("rsvp-show"))}
      aria-label="참석 여부 알리기"
      className="fixed bottom-6 left-5 z-50 flex flex-col items-center justify-center w-20 h-20 active:scale-95 transition-transform"
    >
      {/* viewBox는 그대로 두고 렌더 크기만 키워서 비율·내부 글자 위치를 유지한다 */}
      <svg width="65" height="60" viewBox="0 0 52 48" aria-hidden="true">
        <path
          d="M26 45S3 30.5 3 16.5C3 8.5 9 3 15.8 3c4.3 0 8.1 2.3 10.2 5.8C28.1 5.3 31.9 3 36.2 3 43 3 49 8.5 49 16.5 49 30.5 26 45 26 45z"
          fill="var(--heart)"
        />
        <text
          x="26"
          y="24"
          textAnchor="middle"
          className="font-hand"
          fontSize="12"
          fill="#FFFFFF"
        >
          참석
        </text>
        <text
          x="26"
          y="35"
          textAnchor="middle"
          className="font-hand"
          fontSize="12"
          fill="#FFFFFF"
        >
          여부
        </text>
      </svg>
    </button>
  );
}
