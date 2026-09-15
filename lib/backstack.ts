import { useEffect, useRef } from "react";

/**
 * 전체화면 레이어(내부 페이지 오버레이 · 사진 확대 뷰어 · 참석여부 모달)는 서로 겹쳐 열린다.
 * popstate는 열린 모든 레이어에 전달되므로, 각 레이어가 history.state에 자기 깊이를 기록해 두고
 * 도착한 항목의 깊이가 자기보다 얕을 때만 닫아야 뒤로가기 한 번에 맨 위 레이어만 닫힌다.
 */
const KEY = "layerDepth";

function currentDepth(): number {
  const state = window.history.state as Record<string, unknown> | null;
  const depth = state?.[KEY];
  return typeof depth === "number" ? depth : 0;
}

let scrollLocks = 0;

export function useBackLayer(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    // Next.js가 history.state에 라우터 정보를 넣어두므로 덮어쓰지 않고 이어 붙인다
    const depth = currentDepth() + 1;
    window.history.pushState({ ...(window.history.state ?? {}), [KEY]: depth }, "");

    if (scrollLocks++ === 0) document.body.classList.add("overlay-open");

    let popped = false;
    const onPop = () => {
      if (currentDepth() < depth) {
        popped = true;
        onCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPop);

    return () => {
      window.removeEventListener("popstate", onPop);
      if (--scrollLocks <= 0) {
        scrollLocks = 0;
        document.body.classList.remove("overlay-open");
      }
      // 닫기 버튼으로 닫혔다면 우리가 넣은 항목이 아직 남아 있으니 되돌린다
      if (!popped && currentDepth() >= depth) window.history.back();
    };
  }, [open]);
}
