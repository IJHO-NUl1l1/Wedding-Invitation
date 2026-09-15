/**
 * PDF 각 페이지를 PNG 로 렌더링한다. poppler 없이 Chrome + pdf.js 로 처리한다.
 *   node scripts/pdf2png.mjs "<pdf 경로>" [출력폴더] [--scale=2] [--from=1] [--to=999]
 *
 * 새 npm 의존성을 추가하지 않으려고 pdf.js 는 CDN 에서 불러온다.
 */
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";

const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const flag = (k, d) => Number(args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d);

const pdfPath = positional[0];
if (!pdfPath || !existsSync(pdfPath)) {
  console.error('사용법: node scripts/pdf2png.mjs "<pdf 경로>" [출력폴더] [--scale=2] [--from=1] [--to=999]');
  process.exit(1);
}
const outDir = positional[1] ?? join("design-reference", "pdf");
const SCALE = flag("scale", 2);
const FROM = flag("from", 1);
const TO = flag("to", 999);

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
page.on("console", (m) => m.type() === "error" && console.error("  [browser]", m.text()));

await page.setContent("<!doctype html><meta charset=utf-8><body></body>");
await page.addScriptTag({ url: `${PDFJS}/pdf.min.js` });

// 빈 페이지(about:blank)에서는 file:// 을 읽을 수 없어 바이트를 직접 넘긴다
const base64 = readFileSync(pdfPath).toString("base64");
const count = await page.evaluate(async (cfg) => {
  const lib = window.pdfjsLib;
  lib.GlobalWorkerOptions.workerSrc = `${cfg.PDFJS}/pdf.worker.min.js`;
  const bin = atob(cfg.base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  window.__doc = await lib.getDocument({ data: bytes }).promise;
  return window.__doc.numPages;
}, { PDFJS, base64 });

console.log(`${basename(pdfPath)} — 총 ${count}쪽`);
const last = Math.min(count, TO);

for (let i = FROM; i <= last; i++) {
  const { data, w, h } = await page.evaluate(async (n, scale) => {
    const pg = await window.__doc.getPage(n);
    const vp = pg.getViewport({ scale });
    const c = document.createElement("canvas");
    c.width = Math.ceil(vp.width);
    c.height = Math.ceil(vp.height);
    await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    return { data: c.toDataURL("image/png").split(",")[1], w: c.width, h: c.height };
  }, i, SCALE);

  const file = join(outDir, `page-${String(i).padStart(2, "0")}.png`);
  writeFileSync(file, Buffer.from(data, "base64"));
  console.log(`  ${file}  ${w}x${h}`);
}

await browser.close();
