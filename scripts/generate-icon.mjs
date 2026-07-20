import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PADDING = 80; // 최종 상하좌우 여백 (px, 2x 기준)

// 1단계: 넉넉한 캔버스에 렌더링
const W = 1200;
const H = 600;

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });

await page.setContent(`
  <!DOCTYPE html>
  <html>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        width: ${W}px; height: ${H}px;
        background: #F9F5F0;
        display: flex; align-items: center; justify-content: center;
      }
      span {
        font-family: 'Great Vibes', cursive;
        font-size: 160px;
        color: #D4A0B5;
        line-height: 1;
      }
    </style>
  </head>
  <body><span>H &amp; J</span></body>
  </html>
`, { waitUntil: "networkidle0" });

const tmpPath = join(root, "public/icon_tmp.png");
await page.screenshot({ path: tmpPath, clip: { x: 0, y: 0, width: W, height: H } });
await browser.close();

// 2단계: 실제 글자 영역만 trim
const { data, info } = await sharp(tmpPath)
  .trim({ background: "#F9F5F0", threshold: 10 })
  .toBuffer({ resolveWithObject: true });

// 3단계: 정사각형 캔버스에 중앙 배치 (상하좌우 동일 여백)
const side = Math.max(info.width, info.height) + PADDING * 2;
const left = Math.floor((side - info.width) / 2);
const top = Math.floor((side - info.height) / 2);

await sharp({
  create: {
    width: side,
    height: side,
    channels: 4,
    background: { r: 249, g: 245, b: 240, alpha: 1 },
  },
})
  .composite([{ input: data, left, top }])
  .png()
  .toFile(join(root, "public/icon.png"));

const { unlinkSync } = await import("fs");
unlinkSync(tmpPath);

console.log(`생성 완료: public/icon.png (${side}x${side})`);
