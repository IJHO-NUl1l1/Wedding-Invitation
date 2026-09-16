/**
 * 앱 아이콘을 코드로 그린다. 핑크 타일 + 검정 모노그램으로 고정하고 서체만 바꿔 후보를 만든다.
 *
 *   node scripts/generate-icon.mjs                    후보 전부 생성
 *   node scripts/generate-icon.mjs --apply=cormorant  후보 생성 + 그 서체를 실제 아이콘으로 적용
 *   node scripts/generate-icon.mjs --size=512         크기 지정 (기본 1024)
 *   node scripts/generate-icon.mjs --fill=0.8         글자가 타일에서 차지할 비율 (기본 0.72)
 *
 * 후보  design-reference/icon-candidates/icon-<서체>.png   (배포되지 않는 자리)
 * 적용  app/icon.png            — 브라우저 탭·홈 화면 아이콘 (Next 가 자동으로 읽는 자리)
 *      public/icons/icon.png   — 카카오 공유·오픈그래프 썸네일이 주소로 불러가는 자리
 *
 * 서체마다 글자의 실제 높이와 여백이 달라 font-size 를 같게 주면 크기가 들쭉날쭉해진다.
 * 그래서 크게 그린 뒤 글자 영역을 픽셀로 재서 타일 한가운데에 같은 비율로 앉힌다.
 * 모바일 홈 화면에서는 OS 가 모서리를 알아서 깎으므로 배경은 끝까지 채운다.
 */
import puppeteer from "puppeteer-core";
import { createCanvas, loadImage } from "canvas";
import { writeFileSync, copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const SIZE = Number(arg("size") ?? 1024);
const FILL = Number(arg("fill") ?? 0.72);
const APPLY = arg("apply");

// globals.css 의 테마 값
const PINK = [240, 144, 168]; // --pink #F090A8
const INK = "#101010";

const FONTS = [
  { key: "yellowtail", family: "Yellowtail", weight: 400, italic: false, note: "표지 제목과 같은 흘림체" },
  { key: "playfair", family: "Playfair Display", weight: 700, italic: false, note: "굵고 안정적인 세리프" },
  { key: "bodoni", family: "Bodoni Moda", weight: 700, italic: false, note: "획 굵기 대비가 큰 세리프" },
  { key: "italiana", family: "Italiana", weight: 400, italic: false, note: "가늘고 넓게 퍼지는 세리프" },
  { key: "prata", family: "Prata", weight: 400, italic: false, note: "묵직하고 또렷한 세리프" },
  { key: "cormorant", family: "Cormorant Garamond", weight: 600, italic: true, note: "기울어진 우아한 세리프" },
];

if (APPLY && !FONTS.some((f) => f.key === APPLY)) {
  console.error(`--apply 는 ${FONTS.map((f) => f.key).join(", ")} 중 하나여야 합니다.`);
  process.exit(1);
}

// 한 번의 요청으로 모든 서체를 받아 두면 서체마다 다시 기다리지 않아도 된다
const fontsUrl =
  "https://fonts.googleapis.com/css2?" +
  FONTS.map(
    (f) => `family=${f.family.replace(/ /g, "+")}:${f.italic ? "ital,wght@1," : "wght@"}${f.weight}`
  ).join("&") +
  "&display=block";

const outDir = join(root, "design-reference/icon-candidates");
mkdirSync(outDir, { recursive: true });

// 글자를 크게 그릴 임시 화면. 가로로 넉넉해야 흘림체의 삐침까지 들어간다
const RENDER_W = 2400;
const RENDER_H = 1000;

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const made = {};

for (const f of FONTS) {
  // 탭을 재사용하면 서체가 캐시된 뒤 로딩 완료 신호를 기다리다 멈춘다
  const page = await browser.newPage();
  await page.setViewport({ width: RENDER_W, height: RENDER_H, deviceScaleFactor: 1 });
  await page.setContent(
    `<!DOCTYPE html><html><head><meta charset="utf-8">
      <link href="${fontsUrl}" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: ${RENDER_W}px; height: ${RENDER_H}px; background: rgb(${PINK.join(",")});
          display: flex; align-items: center; justify-content: center;
        }
        span {
          font-family: '${f.family}', serif; font-weight: ${f.weight};
          ${f.italic ? "font-style: italic;" : ""}
          font-size: 520px; line-height: 1; color: ${INK}; white-space: nowrap;
        }
      </style></head><body><span>H&amp;J</span></body></html>`,
    { waitUntil: "load", timeout: 60000 }
  );
  // 서체가 실제로 내려받아져 적용된 뒤에 찍는다
  await page.evaluate(
    async (family, weight, italic) => {
      await document.fonts.load(`${italic ? "italic " : ""}${weight} 520px '${family}'`);
      await document.fonts.ready;
    },
    f.family,
    f.weight,
    f.italic
  );
  const shot = await page.screenshot();
  await page.close();

  // 배경색과 다른 픽셀(= 글자)의 경계를 찾는다
  const img = await loadImage(shot);
  const probe = createCanvas(img.width, img.height);
  probe.getContext("2d").drawImage(img, 0, 0);
  const d = probe.getContext("2d").getImageData(0, 0, img.width, img.height).data;

  let x0 = img.width, y0 = img.height, x1 = 0, y1 = 0;
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      const i = (y * img.width + x) * 4;
      const diff =
        Math.abs(d[i] - PINK[0]) + Math.abs(d[i + 1] - PINK[1]) + Math.abs(d[i + 2] - PINK[2]);
      if (diff < 40) continue; // 배경
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  const markW = x1 - x0 + 1;
  const markH = y1 - y0 + 1;

  const scale = Math.min((SIZE * FILL) / markW, (SIZE * FILL) / markH);
  const outW = Math.round(markW * scale);
  const outH = Math.round(markH * scale);

  const out = createCanvas(SIZE, SIZE);
  const ctx = out.getContext("2d");
  ctx.fillStyle = `rgb(${PINK.join(",")})`;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.drawImage(img, x0, y0, markW, markH, (SIZE - outW) / 2, (SIZE - outH) / 2, outW, outH);

  const file = join(outDir, `icon-${f.key}.png`);
  writeFileSync(file, out.toBuffer("image/png"));
  made[f.key] = file;
  console.log(`${f.key.padEnd(11)} ${f.family.padEnd(19)} 글자 ${outW}x${outH}  ${f.note}`);
}

await browser.close();

if (APPLY) {
  const appIcon = join(root, "app/icon.png");
  mkdirSync(join(root, "public/icons"), { recursive: true });
  copyFileSync(made[APPLY], appIcon);
  copyFileSync(made[APPLY], join(root, "public/icons/icon.png"));
  console.log(`\n적용 완료 (${APPLY}, ${SIZE}x${SIZE})`);
  console.log("  app/icon.png");
  console.log("  public/icons/icon.png");
} else {
  console.log(`\n적용하려면: node scripts/generate-icon.mjs --apply=<${FONTS.map((f) => f.key).join("|")}>`);
}
