"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * 내부 페이지(신랑·신부·우리 이야기)에 쓰이는 사진을 페이지가 뜨자마자 미리 받아둔다.
 * 오버레이를 여는 순간에야 받기 시작하면 첫 진입이 버벅인다.
 *
 * 표지 이미지와 경쟁하지 않도록 첫 페인트 직후(브라우저가 한가해질 때) 시작한다.
 *
 * 목록의 width·quality는 실제 사용처와 반드시 같아야 한다. next/image는 sizes가 없으면
 * width만으로 srcset을 만들기 때문에, 값이 같아야 같은 URL을 요청해 캐시가 실제로 맞는다.
 */
const WARM: { src: string; width: number; height: number }[] = [
  { src: "/images/groom-01.jpg", width: 1000, height: 1300 },
  { src: "/images/groom-02.jpg", width: 1000, height: 1300 },
  { src: "/images/people-01.jpg", width: 1000, height: 1300 },
  { src: "/images/groom-03.jpg", width: 1000, height: 1300 },
  { src: "/images/bride-01.jpg", width: 1000, height: 1300 },
  { src: "/images/bride-02.jpg", width: 1000, height: 1300 },
  { src: "/images/people-02.jpg", width: 1000, height: 1300 },
  { src: "/images/bride-03.png", width: 1000, height: 1300 },
  { src: "/images/story-01.jpg", width: 1000, height: 1400 },
  { src: "/images/story-02.jpg", width: 1000, height: 1400 },
];

export default function CollagePreloader() {
  const [warm, setWarm] = useState(false);

  useEffect(() => {
    const start = () => setWarm(true);
    const idle = (window as Window & { requestIdleCallback?: typeof requestIdleCallback })
      .requestIdleCallback;
    if (idle) {
      const id = idle(start, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(start, 600);
    return () => window.clearTimeout(id);
  }, []);

  if (!warm) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 -z-50 h-0 w-0 overflow-hidden opacity-0"
    >
      {WARM.map((it) => (
        <Image key={it.src} src={it.src} alt="" width={it.width} height={it.height} quality={90} />
      ))}
    </div>
  );
}
