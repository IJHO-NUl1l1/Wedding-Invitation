/**
 * 예식이 끝난 뒤 청첩장을 어떻게 보여줄지 모으는 스위치.
 *
 * 지금은 "잠깐 더 열어두고, 다 쓴 자리만 마감 안내로 덮는" 상태다.
 * 나중에 직접 닫을 때는 AUTO_CLOSE 를 true 로 바꾸면 CLOSE_AT 이후 전체가 감사 인사로 바뀐다.
 */

/** 예식 다음 날 오전 9시. (월은 0부터) */
export const CLOSE_AT = new Date(2026, 10, 15, 9, 0, 0);

/**
 * 시간이 되면 청첩장 전체를 닫을지 여부.
 * false면 CLOSE_AT 이 지나도 청첩장은 그대로 열려 있다. 수동으로 닫을 때 true 로 바꾼다.
 */
export const AUTO_CLOSE = false;

/**
 * 예식이 끝나 더는 쓰지 않는 자리. true면 그 자리를 마감 안내로 덮는다.
 * 되살리려면 해당 항목만 false 로 돌리면 된다.
 */
export const CLOSED_PARTS = {
  /** 참석 여부 버튼과 입력창 */
  rsvp: true,
  /** 오시는 길 (지도·교통편·주차) */
  venue: true,
  /** 방명록 작성칸. 이미 남겨진 축하 글은 그대로 보인다 */
  guestbookForm: true,
};

export function isClosed(now: Date = new Date()) {
  return AUTO_CLOSE && now.getTime() >= CLOSE_AT.getTime();
}
