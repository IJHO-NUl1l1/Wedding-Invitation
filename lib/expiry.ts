/** 예식 다음 날 오전 9시부터 청첩장을 닫는다. (월은 0부터) */
export const CLOSE_AT = new Date(2026, 10, 15, 9, 0, 0);

export function isClosed(now: Date = new Date()) {
  return now.getTime() >= CLOSE_AT.getTime();
}
