/**
 * 사진을 코드에서 직접 불러온다(정적 import).
 *
 * "/images/gallery-06.jpg" 처럼 주소를 문자열로 적으면, 파일 내용을 바꿔도 주소가 그대로라
 * 브라우저와 CDN이 예전 사진을 계속 보여준다. 실제로 2차 수정 때 파일 이름은 두고 내용만
 * 맞바꾼 탓에, 먼저 접속했던 기기에서 갤러리 순서가 뒤섞이고 같은 사진이 두 번 나왔다.
 *
 * 이렇게 불러오면 Next가 파일 내용으로 이름을 지어(/_next/static/media/gallery-06.9f3a2c.jpg)
 * 사진이 바뀌면 주소도 같이 바뀐다. 캐시가 끼어들 자리가 없어지고, 대신 영구 캐시(immutable)라
 * 다시 받는 일도 없다. 가로·세로 크기도 파일에서 읽어오므로 따로 적지 않아도 된다.
 */

import cover01 from "@/public/images/cover-01.jpg";
import coverFrameImg from "@/public/images/cover-frame.jpg";
import greetingBgImg from "@/public/images/greeting-bg.jpg";

import dateGlassLeftImg from "@/public/images/date-glass-left.png";
import dateGlassRightImg from "@/public/images/date-glass-right.png";

import people01 from "@/public/images/people-01.jpg";
import people02 from "@/public/images/people-02.jpg";
import people03 from "@/public/images/people-03.jpg";
import people04 from "@/public/images/people-04.png";
import people05 from "@/public/images/people-05.png";
import peopleBowImg from "@/public/images/people-bow.png";

import groom01 from "@/public/images/groom-01.jpg";
import groom02 from "@/public/images/groom-02.jpg";
import groom03 from "@/public/images/groom-03.png";
import bride01 from "@/public/images/bride-01.jpg";
import bride02 from "@/public/images/bride-02.jpg";
import bride03 from "@/public/images/bride-03.png";

import story01 from "@/public/images/story-01.jpg";
import story02 from "@/public/images/story-02.jpg";
import story03 from "@/public/images/story-03.jpg";
import story04 from "@/public/images/story-04.jpg";

import gallery01 from "@/public/images/gallery-01.jpg";
import gallery02 from "@/public/images/gallery-02.jpg";
import gallery03 from "@/public/images/gallery-03.jpg";
import gallery04 from "@/public/images/gallery-04.jpg";
import gallery05 from "@/public/images/gallery-05.jpg";
import gallery06 from "@/public/images/gallery-06.jpg";
import gallery07 from "@/public/images/gallery-07.jpg";
import gallery08 from "@/public/images/gallery-08.jpg";
import gallery09 from "@/public/images/gallery-09.jpg";
import gallery10 from "@/public/images/gallery-10.jpg";
import gallery11 from "@/public/images/gallery-11.jpg";
import gallery12 from "@/public/images/gallery-12.jpg";
import gallery13 from "@/public/images/gallery-13.jpg";
import gallery14 from "@/public/images/gallery-14.jpg";
import gallery15 from "@/public/images/gallery-15.jpg";
import gallery16 from "@/public/images/gallery-16.jpg";
import gallery17 from "@/public/images/gallery-17.jpg";
import gallery18 from "@/public/images/gallery-18.jpg";
import gallery19 from "@/public/images/gallery-19.jpg";
import gallery20 from "@/public/images/gallery-20.jpg";
import gallery21 from "@/public/images/gallery-21.jpg";
import gallery22 from "@/public/images/gallery-22.jpg";

export const coverPhoto = cover01;
export const coverFrame = coverFrameImg;
export const greetingBg = greetingBgImg;
export const dateGlassLeft = dateGlassLeftImg;
export const dateGlassRight = dateGlassRightImg;
export const peopleBow = peopleBowImg;

export const groomFamily = people01;
export const brideFamily = people02;
export const storyThumb = people03;
/** 인물선택 2판 전용 어린시절 사진 (내부 페이지는 groomChild/brideChild를 쓴다) */
export const groomChildPanel = people04;
export const brideChildPanel = people05;

export const groomLetterMother = groom01;
export const groomLetterFather = groom02;
export const groomChild = groom03;
export const brideLetterFather = bride01;
export const brideLetterMother = bride02;
export const brideChild = bride03;

export const storyBubbles = story01;
export const storyRoses = story02;
/** 모눈종이 = 신부가 쓴 메모, 노란 줄종이 = 신랑이 쓴 메모 */
export const storyMemoBride = story03;
export const storyMemoGroom = story04;

/** 갤러리 22장. 배열 순서가 곧 화면에 보이는 순서다. */
export const galleryPhotos = [
  gallery01, gallery02, gallery03, gallery04, gallery05, gallery06,
  gallery07, gallery08, gallery09, gallery10, gallery11, gallery12,
  gallery13, gallery14, gallery15, gallery16, gallery17, gallery18,
  gallery19, gallery20, gallery21, gallery22,
];
