// Bangun ikon situs tanpa dependensi native, memakai Chromium (Playwright):
//   app/apple-icon.png                ikon iOS 180 px dari public/logo/monogram.svg
//   public/icon-192.png, icon-512.png ikon PWA dari sumber yang sama
//
//   node scripts/build-aset.mjs
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LATAR = "#FFFFFF";

const browser = await chromium.launch();
const page = await browser.newPage();
const svg = readFileSync(join(ROOT, "public", "logo", "monogram.svg"), "utf8");

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(
  `<!doctype html><style>html,body{margin:0;background:${LATAR}}svg{display:block;width:150px;height:150px;margin:15px}</style>${svg}`,
);
writeFileSync(join(ROOT, "app", "apple-icon.png"), await page.screenshot());
console.log("apple-icon.png: 180×180");

for (const ukuran of [192, 512]) {
  const sisi = Math.round(ukuran * 0.72);
  await page.setViewportSize({ width: ukuran, height: ukuran });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:${LATAR};display:grid;place-items:center;height:100%}svg{display:block;width:${sisi}px;height:${sisi}px}</style>${svg}`,
  );
  writeFileSync(join(ROOT, "public", `icon-${ukuran}.png`), await page.screenshot());
  console.log(`icon-${ukuran}.png`);
}

await browser.close();
