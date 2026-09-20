"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

/*
 * 오시는 길 지도. 3차 수정: 구글 지도 대신 네이버 지도를 쓴다.
 *
 * 네이버 지도는 주소 하나로 끼워 넣을 수 없고 발급받은 키로 스크립트를 불러와야 한다.
 * 키는 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 로 넣는다(네이버 클라우드 플랫폼 > Maps > Web Dynamic Map,
 * 배포 도메인을 등록해야 동작한다). 키가 없거나 스크립트를 못 받으면 주소 카드로 대신 보여준다.
 *
 * 지도는 보기 전용이다. 페이지 자체가 확대를 막아 둔 터라 지도 안에서만 제스처를 허용하면
 * 스크롤과 엉키기 쉽다. 대신 지도를 누르면 네이버지도 앱(또는 웹)에서 열린다.
 */

type NaverMaps = {
  maps: {
    Map: new (el: HTMLElement, options: Record<string, unknown>) => unknown;
    Marker: new (options: Record<string, unknown>) => unknown;
    LatLng: new (lat: number, lng: number) => unknown;
  };
};

const KEY = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
const SCRIPT_ID = "naver-maps-script";

export default function NaverMap({
  lat,
  lng,
  label,
  href,
}: {
  lat: number;
  lng: number;
  /** 지도 위 말풍선에 쓸 장소 이름 */
  label: string;
  /** 지도를 눌렀을 때 열 네이버지도 주소 */
  href: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(!KEY);

  useEffect(() => {
    if (!KEY) return;

    const draw = () => {
      const naver = (window as unknown as { naver?: NaverMaps }).naver;
      const el = boxRef.current;
      if (!naver?.maps || !el) return setFailed(true);

      const center = new naver.maps.LatLng(lat, lng);
      const map = new naver.maps.Map(el, {
        center,
        zoom: 16,
        draggable: false,
        pinchZoom: false,
        scrollWheel: false,
        keyboardShortcuts: false,
        disableDoubleTapZoom: true,
        disableDoubleClickZoom: true,
        disableTwoFingerTapZoom: true,
        scaleControl: false,
        mapDataControl: false,
        logoControlOptions: { position: 3 },
      });
      new naver.maps.Marker({ position: center, map, title: label });
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if ((window as unknown as { naver?: NaverMaps }).naver) draw();
      else existing.addEventListener("load", draw, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${KEY}`;
    script.async = true;
    script.onload = draw;
    script.onerror = () => setFailed(true);
    document.head.appendChild(script);
  }, [lat, lng, label]);

  if (failed) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[260px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 text-center active:scale-[0.99] transition-transform"
      >
        <MapPin className="h-6 w-6 text-pink" />
        <p className="text-[15px] text-white">{label}</p>
        <p className="text-[13px] text-white/55">눌러서 네이버지도로 보기</p>
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} 네이버지도에서 보기`}
      className="block overflow-hidden rounded-2xl border border-white/15"
    >
      <div ref={boxRef} className="h-[260px] w-full" />
    </a>
  );
}
