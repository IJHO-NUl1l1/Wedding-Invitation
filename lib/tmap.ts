/**
 * 티맵 길안내 열기. 앱이 있으면 목적지가 찍힌 경로 화면으로 바로 열고, 없으면 설치 페이지로 보낸다.
 *
 * 티맵은 웹 지도가 없어 카카오·네이버처럼 https 링크 하나로 끝나지 않는다. 플랫폼마다 여는 방법이 다르다.
 * - 안드로이드: intent:// 주소. 앱이 없으면 브라우저가 알아서 플레이스토어로 넘긴다.
 * - iOS: tmap:// 주소를 열고, 잠시 뒤에도 페이지가 그대로 보이면 앱이 없는 것으로 보고 앱스토어로 보낸다.
 */

export type Place = { name: string; lat: number; lng: number };
export type Platform = "android" | "ios" | "desktop";

const PACKAGE = "com.skt.tmap.ku";
export const TMAP_APP_STORE = "https://apps.apple.com/kr/app/id431589174";
export const TMAP_PLAY_STORE = `https://play.google.com/store/apps/details?id=${PACKAGE}`;

/** 앱이 열리지 않았다고 판단하기까지 기다리는 시간. 짧으면 앱이 뜨는 중에 스토어로 넘어가 버린다. */
const IOS_FALLBACK_MS = 2500;

export function detectPlatform(userAgent: string, maxTouchPoints = 0): Platform {
  if (/android/i.test(userAgent)) return "android";
  // iPadOS 사파리는 스스로를 맥이라고 소개하므로 터치 지원 여부로 구분한다
  if (/iphone|ipad|ipod/i.test(userAgent) || (/macintosh/i.test(userAgent) && maxTouchPoints > 1)) {
    return "ios";
  }
  return "desktop";
}

/** 티맵 경로 안내 주소. goalx는 경도, goaly는 위도다. */
export function tmapRouteUrl({ name, lat, lng }: Place) {
  return `tmap://route?goalname=${encodeURIComponent(name)}&goalx=${lng}&goaly=${lat}`;
}

export function tmapAndroidIntent(place: Place) {
  const path = tmapRouteUrl(place).slice("tmap://".length);
  return (
    `intent://${path}#Intent;scheme=tmap;package=${PACKAGE};` +
    `S.browser_fallback_url=${encodeURIComponent(TMAP_PLAY_STORE)};end`
  );
}

export function openTmap(place: Place) {
  const platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints);

  if (platform === "android") {
    window.location.href = tmapAndroidIntent(place);
    return;
  }

  if (platform === "desktop") {
    window.alert("티맵은 휴대폰에서만 열 수 있어요.");
    return;
  }

  // 앱으로 넘어가면 페이지가 가려지므로, 그때는 스토어로 보내지 않는다
  const fallback = window.setTimeout(() => {
    if (!document.hidden) window.location.href = TMAP_APP_STORE;
  }, IOS_FALLBACK_MS);
  const cancel = () => {
    if (document.hidden) window.clearTimeout(fallback);
  };
  document.addEventListener("visibilitychange", cancel);
  window.addEventListener("pagehide", () => window.clearTimeout(fallback), { once: true });
  window.setTimeout(() => document.removeEventListener("visibilitychange", cancel), IOS_FALLBACK_MS + 500);

  window.location.href = tmapRouteUrl(place);
}
