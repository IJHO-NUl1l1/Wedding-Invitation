/**
 * 앱 아이콘을 코드로 그린다. 후보 세 가지를 모두 만들고, 고른 하나를 실제 아이콘 자리에 넣는다.
 *
 *   node scripts/generate-icon.mjs              후보 3개만 생성
 *   node scripts/generate-icon.mjs --apply=b    3개 생성 + B안을 실제 아이콘으로 적용
 *   node scripts/generate-icon.mjs --size=512   크기 지정 (기본 1024)
 *
 * 후보  design-reference/icon-candidates/icon-a|b|c.png   (배포되지 않는 자리)
 * 적용  app/icon.png            — 브라우저 탭·홈 화면 아이콘 (Next 가 자동으로 읽는 자리)
 *      public/icons/icon.png   — 카카오 공유·오픈그래프 썸네일이 주소로 불러가는 자리
 *
 * 모바일 홈 화면에서는 OS 가 모서리를 알아서 깎으므로, 배경을 끝까지 채운 정사각형으로 그린다.
 */
import puppeteer from "puppeteer-core";
import { copyFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const SIZE = Number(arg("size") ?? 1024);
const APPLY = arg("apply");

// globals.css 의 테마 값
const INK = "#101010";
const PINK = "#F090A8";
const SOFT = "#F8C8D0";

/** 크기를 바꿔도 비율이 유지되도록 값은 모두 SIZE 기준으로 계산한다 */
const px = (ratio) => Math.round(SIZE * ratio);

const head = `
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hahmlet:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${SIZE}px; height: ${SIZE}px; display: flex;
      align-items: center; justify-content: center; font-family: 'Hahmlet', serif;
    }
    .tile {
      width: 100%; height: 100%; position: relative; display: flex;
      flex-direction: column; align-items: center; justify-content: center;
    }
    .mark { line-height: 1; white-space: nowrap; letter-spacing: -0.02em; font-weight: 600; }
  </style>`;

const VARIANTS = {
  // A. 검정 타일 + 핑크 모노그램 + 가는 둥근 테두리
  a: `<div class="tile" style="background:${INK}">
        <div style="position:absolute;inset:7%;border:${px(0.004)}px solid ${SOFT}40;border-radius:22%"></div>
        <span class="mark" style="font-size:${px(0.371)}px;color:${PINK}">H&amp;J</span>
      </div>`,
  // B. 핑크 타일 + 검정 모노그램. 대비가 가장 커서 작은 크기에서 잘 읽힌다
  b: `<div class="tile" style="background:${PINK}">
        <span class="mark" style="font-size:${px(0.391)}px;color:${INK}">H&amp;J</span>
      </div>`,
  // C. 검정 타일 + 핑크 모노그램 + 예식일
  c: `<div class="tile" style="background:${INK}">
        <span class="mark" style="font-size:${px(0.332)}px;color:${PINK}">H&amp;J</span>
        <span style="margin-top:${px(0.035)}px;font-size:${px(0.086)}px;font-weight:400;color:${SOFT};letter-spacing:0.06em">2026.11.14</span>
      </div>`,
};

if (APPLY && !VARIANTS[APPLY]) {
  console.error(`--apply 는 ${Object.keys(VARIANTS).join(", ")} 중 하나여야 합니다.`);
  process.exit(1);
}

const outDir = join(root, "design-reference/icon-candidates");
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const made = {};

for (const [key, body] of Object.entries(VARIANTS)) {
  const page = await browser.newPage();
  await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });
  await page.setContent(`<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`, {
    waitUntil: "networkidle0",
  });
  // 웹폰트가 실제로 적용된 뒤에 찍는다
  await page.evaluate(() => document.fonts.ready);

  const file = join(outDir, `icon-${key}.png`);
  await page.screenshot({ path: file });
  made[key] = file;
  await page.close();
  console.log(`후보 ${key.toUpperCase()}안  ${file}`);
}

await browser.close();

if (APPLY) {
  const appIcon = join(root, "app/icon.png");
  mkdirSync(join(root, "public/icons"), { recursive: true });
  copyFileSync(made[APPLY], appIcon);
  copyFileSync(made[APPLY], join(root, "public/icons/icon.png"));
  console.log(`\n적용 완료 (${APPLY.toUpperCase()}안, ${SIZE}x${SIZE})`);
  console.log("  app/icon.png");
  console.log("  public/icons/icon.png");
} else {
  console.log(`\n적용하려면: node scripts/generate-icon.mjs --apply=<${Object.keys(VARIANTS).join("|")}>`);
}
