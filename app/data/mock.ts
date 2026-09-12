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
  wedding: {
    date: "2026년 11월 14일",
    dayOfWeek: "토요일",
    time: "오후 12시 20분",
    year: 2026,
    month: 11,
    day: 14,
  },
  venue: {
    name: "신도림 웨스턴 베니비스",
    hall: "그레이스홀",
    address: "서울시 구로구 구로동 3-25",
    addressDetail: "신도림테크노마트 7층 그레이스홀",
    phone: "02-2111-7000",
    meal: "예식 후 피로연 (고급 뷔페)",
    subway: "1·2호선 신도림역 직결 (테크노마트 방향 출구 이용)",
    bus: "신도림역 정류장 하차 후 테크노마트 방향 도보 1분",
    parking: "테크노마트 건물 지하주차장 (2시간 무료)",
    mapQuery: "신도림 웨스턴 베니비스",
    kakaoMapUrl: "https://map.kakao.com/link/search/서울시 구로구 구로동 3-25",
    naverMapUrl: "https://map.naver.com/v5/search/서울시 구로구 구로동 3-25",
    // 좌표 없이 동작하는 검색 스킴. 티맵 앱이 설치된 기기에서만 열린다.
    tmapUrl: "tmap://search?name=신도림 웨스턴 베니비스",
  },
  /** 표지 */
  cover: {
    image: "/images/cover-couple.jpg",
    frame: "/images/frame-lace.jpg",
    titleEn: "Forever Begins Today!",
    subtitleEn: "we are getting married!",
  },

  /** 인사말 — 시안 2페이지 */
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

  /** 인물 선택 — 시안 3페이지 */
  people: {
    groom: { thumb: "/images/family-groom.jpg", label: "고기환 · 김미영의 장남", name: "고희성" },
    bride: { thumb: "/images/family-bride.jpg", label: "박준석 · 남양희의 장녀", name: "박지서" },
    story: { thumb: "/images/story-couple.jpg", label: "우리의", name: "이야기" },
  },

  /** 신랑/신부 상세 — 시안 4·5페이지 */
  groomPage: {
    letters: [
      { image: "/images/letter-groom-mother.jpg", from: "어머니" },
      { image: "/images/letter-groom-father.jpg", from: "아버지" },
    ],
    childhood: "/images/child-groom.jpg",
    family: "/images/family-groom.jpg",
  },
  bridePage: {
    letters: [
      { image: "/images/letter-bride-father.jpg", from: "아버지" },
      { image: "/images/letter-bride-mother.jpg", from: "어머니" },
    ],
    childhood: "/images/child-bride-cutout.png",
    family: "/images/family-bride.jpg",
  },

  /** 우리 이야기 — 시안 6페이지. 메모 문구는 아직 미작성 */
  storyPage: {
    photos: ["/images/story-bubbles.jpg", "/images/story-bride-roses.jpg"],
    notes: ["미작성", "미작성"],
  },

  /**
   * 갤러리 — 촬영 회차별로 묶어 21장(3의 배수). 기본 9장 노출 + '더보기'.
   * 야간 한강 컷은 '우리 이야기' 페이지에서 이미 쓰므로 갤러리에서는 뺐다.
   */
  gallery: [
    // 야외 · 흰 드레스
    "/images/gallery-01.jpg",
    "/images/gallery-20.jpg",
    "/images/gallery-19.jpg",
    "/images/gallery-18.jpg",
    "/images/gallery-03.jpg",
    "/images/gallery-14.jpg",
    "/images/gallery-15.jpg",
    "/images/gallery-02.jpg",
    "/images/gallery-16.jpg",
    "/images/gallery-05.jpg",
    // 한복
    "/images/gallery-06.jpg",
    "/images/gallery-07.jpg",
    "/images/gallery-10.jpg",
    "/images/gallery-08.jpg",
    "/images/gallery-09.jpg",
    "/images/gallery-11.jpg",
    "/images/gallery-21.jpg",
    "/images/gallery-22.jpg",
    // 우산 · 다리
    "/images/gallery-12.jpg",
    "/images/gallery-13.jpg",
    "/images/gallery-17.jpg",
  ],
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
