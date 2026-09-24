import * as img from "@/app/data/images";

/** 오시는 길 안내 한 항목. steps(경로 단계) 또는 note(단문) 중 하나를 쓴다. */
export type GuideItem = {
  label: string;
  /** 제목만 보이고 화살표를 눌러야 내용이 펼쳐진다 (2차 수정 9번) */
  collapsible?: boolean;
  /** 버스 노선처럼 나열이 필요한 값 */
  badges?: string[];
  steps?: string[];
  note?: string;
  sub?: string;
};

/** 마음 전하실 곳의 계좌 한 줄 */
export type Account = { role: string; name: string; bank: string; number: string };

export const weddingData = {
  groom: {
    name: "고희성",
    firstName: "희성",
    nameEn: "Heesung",
    birthday: "1993.03.23",
    job: "METRO 9 역무원",
    hobbies: "맛집 투어, 헬스",
    personality: "책임감 있고 성실한 성격",
    parents: "고기환 · 김미영",
    account: { bank: "카카오뱅크", number: "3333-12-3456789" },
    phone: "010-9113-3596",
    decisionStory:
      "감정에 휘둘리지 않고 항상 중심을 잘 잡는 사람이라 같이 있을 때는 늘 마음이 편안하고 안정됩니다. 앞으로 어떤 상황이 닥치더라도 함께 잘 풀어나갈 수 있겠다는 믿음이 있어 결혼을 결심하게 되었습니다.",
  },
  bride: {
    name: "박지서",
    firstName: "지서",
    nameEn: "Jiseo",
    birthday: "1999.12.13",
    job: "시흥 진말초등학교 교사",
    hobbies: "독서, 뜨개질",
    personality: "차분하고 꾸준한 성격",
    parents: "박준석 · 남양희",
    account: { bank: "국민은행", number: "1234-5678-9012-34" },
    phone: "010-3343-6779",
    decisionStory:
      "한결같은 믿음과 신뢰로 저를 배려해 주는 모습에 큰 감동을 받았습니다. 누구보다도 믿음직스럽고 단단한 사람이라는 확신이 들어 결혼을 결심하게 되었습니다.",
  },
  /** 마음 전하실 곳 (2차 수정 8번: 부모님 계좌 추가). 순서는 받은 그대로. */
  accounts: {
    groom: [
      { role: "신랑", name: "고희성", bank: "신한은행", number: "110-522-761711" },
      { role: "아버지", name: "고기환", bank: "우리은행", number: "753-08-330370" },
      { role: "어머니", name: "김미영", bank: "국민은행", number: "846601-01-197306" },
    ] as Account[],
    bride: [
      { role: "신부", name: "박지서", bank: "농협", number: "351-03442622-43" },
      { role: "아버지", name: "박준석", bank: "국민은행", number: "608-002-04068215" },
      { role: "어머니", name: "남양희", bank: "농협", number: "735013-52-157075" },
    ] as Account[],
  },
  wedding: {
    date: "2026년 11월 14일",
    dayOfWeek: "토요일",
    time: "오후 12시 20분",
    year: 2026,
    month: 11,
    day: 14,
  },
  venue: {
    name: "서울 신도림 웨스턴 베니비스",
    hall: "그레이스홀",
    address: "서울시 구로구 구로동 3-25",
    addressDetail: "신도림테크노마트 7층 그레이스홀",
    phone: "02-2111-7000",
    mapQuery: "신도림 웨스턴 베니비스",
    /**
     * 시안 3페이지의 오시는 길 안내.
     * 원문의 긴 문장을 단계로 쪼개고, 버스 번호는 뱃지로 분리해 읽기 쉽게 했다.
     */
    guide: [
      {
        label: "지하철",
        collapsible: true,
        steps: [
          "1·2호선 신도림역 하차",
          "2·3번 출구쪽 개찰구로 이동",
          "바로 우측으로 직진해 테크노마트(지하 1층)로 이동",
          "입구쪽 안내직원이 서 있는 우측 출입문으로 내부 진입",
          "전용 엘리베이터를 타고 7층 그레이스홀 도착",
        ],
      },
      {
        label: "버스",
        collapsible: true,
        badges: [
          "5619", "6411", "6511", "6611", "6650", "6651", "5615", "5714",
          "6512", "6513", "6516", "6637", "6640", "160", "503", "600",
          "670", "662", "301", "320", "510", "10", "11-1", "11-2", "83", "88",
        ],
        steps: ["신도림역 정류장 하차 → 테크노마트 7층 (도보 10분 소요)"],
      },
      { label: "자가용", collapsible: true, note: "네비게이션에 '신도림테크노마트' 검색" },
      {
        label: "주차",
        note: "신도림 테크노마트 지하주차장(B3~B7) 이용",
        // 가운뎃점에서 줄을 나눠 두 줄로 보여준다
        sub: "7층 상담실 앞 안내데스크에서 3시간 무료주차권 등록\n초과 시 30분당 1,500원",
      },
      { label: "ATM", note: "지하 1층 · 1층 에스컬레이터 근처" },
      { label: "엘리베이터", note: "엘리베이터 이용객이 많을 수 있어 에스컬레이터 이용을 추천드립니다." },
      { label: "식사", note: "11시 50분 ~ 13시 50분" },
    ] as GuideItem[],
    kakaoMapUrl: "https://map.kakao.com/link/search/서울시 구로구 구로동 3-25",
    naverMapUrl: "https://map.naver.com/v5/search/서울시 구로구 구로동 3-25",
    /** 티맵 길안내 목적지. 좌표는 OpenStreetMap에 등록된 신도림 테크노마트 건물 위치 */
    tmap: { name: "신도림테크노마트", lat: 37.5070089, lng: 126.8902959 },
  },
  /** 표지 */
  cover: {
    image: img.coverPhoto,
    frame: img.coverFrame,
    titleEn: "Forever Begins Today!",
    /** 2차 수정 2번: 부제목 아래, 사진 바로 위에 들어가는 영어 이름 */
    namesEn: "Goh Hee Sung ✻ Park Ji Seo",
  },

  /** 인사말 — 시안 2페이지. 2차 수정에서 흰 편지지(greeting-bg.jpg) 위에 올린다 */
  greetingQuote: {
    lines: [
      "누군가 너에 대해 묻는다면",
      "나는 대답할거야",
      "그 애는 나의 제목같은 사람이라고",
      "모든걸 제치고",
      "언제나 맨 앞에 놓일 문장이라고",
    ],
    source: "하현, 〈제목〉",
  },

  /** 인물 선택 — 2차 수정 시안(v2-revision-0914/01·02) */
  people: {
    groom: { thumb: img.groomFamily, label: "고기환 · 김미영의 장남", name: "고희성" },
    bride: { thumb: img.brideFamily, label: "박준석 · 남양희의 장녀", name: "박지서" },
    story: { thumb: img.storyThumb, label: "우리의", name: "이야기" },
    /** 인물선택 2판의 어린시절 사진 (2차 수정 새 사진). 내부 페이지는 이전 사진(groomPage/bridePage.childhood)을 그대로 쓴다 */
    groomChild: img.groomChildPanel,
    brideChild: img.brideChildPanel,
  },

  /** 신랑/신부 상세 — 2차 수정 시안(v2-revision-0914/03·04). 가족사진은 인물 선택 파트의 사진을 같이 쓴다 */
  groomPage: {
    letters: [
      { image: img.groomLetterMother, from: "어머니" },
      { image: img.groomLetterFather, from: "아버지" },
    ],
    childhood: img.groomChild,
    family: img.groomFamily,
  },
  bridePage: {
    letters: [
      { image: img.brideLetterFather, from: "아버지" },
      { image: img.brideLetterMother, from: "어머니" },
    ],
    childhood: img.brideChild,
    family: img.brideFamily,
  },

  /** 우리 이야기 — 시안 6페이지. 메모지는 두 사람이 직접 쓴 실물 사진 */
  storyPage: {
    photos: [img.storyBubbles, img.storyRoses],
    /** [모눈종이 = 신부가 쓴 메모, 노란 줄종이 = 신랑이 쓴 메모] */
    memos: [img.storyMemoBride, img.storyMemoGroom],
  },

  /**
   * 갤러리 — 22장. 기본 9장 노출 + '더보기'.
   * 01~09는 두 사람이 고른 대표 사진(2차 수정 7번), 10~22는 나머지.
   * 파일 번호 = 갤러리에 보이는 순서.
   */
  gallery: img.galleryPhotos,
  galleryPreviewCount: 9,
  /** 초대 문구 — 시안 2페이지 */
  greetingLines: [
    "소중한 분들을 모시고",
    "첫 시작을 함께 하고자 합니다.",
    "귀한 걸음 하시어 축복해 주신다면",
    "더 없는 기쁨으로 간직하겠습니다.",
  ],
  guestbookUrl: "#guestbook",
};
