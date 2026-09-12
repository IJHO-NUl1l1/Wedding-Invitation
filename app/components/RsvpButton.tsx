"use client";

export default function RsvpButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("rsvp-show"))}
      aria-label="참석 여부 알리기"
      // 박스를 하트 모양 크기에 맞춘다. 큰 박스에 가운데 정렬하면 하트가 카톡보다 위에 떠 보인다.
      // 하트 끝이 viewBox 안에서 약 4px 남으므로 그만큼 아래로 내려 카톡과 바닥선을 맞춘다.
      className="fixed bottom-5 left-4 z-50 flex items-center justify-center w-[65px] h-[60px] active:scale-95 transition-transform"
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
