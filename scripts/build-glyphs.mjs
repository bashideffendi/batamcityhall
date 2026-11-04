// Bangun glyph PBF self-hosted untuk label MapLibre dari font pilihan laporan 05.
// Tanpa dependensi native: glyph dirender dengan tiny-sdf di Chromium (Playwright), lalu
// dikodekan ke format protobuf glyph MapLibre oleh skrip ini.
//
//   node scripts/build-glyphs.mjs
//
// Keluaran: public/glyphs/<fontstack>/<range>.pbf
// Rentang: 0-255, 256-511, 8192-8447 (laporan 05: Latin, Latin Extended, tanda baca).
// Catatan: font-maker dan pendekatan ini sama-sama 1 codepoint = 1 glyph, jadi small caps asli
// tidak tersedia di peta. Label memakai kapital + letter-spacing.
import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const ROOT = join(import.meta.dirname, "..");
const RANGES = [0, 256, 8192];

const FONTS = [
  { stack: "Source Serif 4 Regular", family: "Source Serif 4", weight: 400, style: "normal", file: "@fontsource/source-serif-4/files/source-serif-4-latin-400-normal.woff2", ext: "@fontsource/source-serif-4/files/source-serif-4-latin-ext-400-normal.woff2" },
  { stack: "Source Serif 4 Italic", family: "Source Serif 4", weight: 400, style: "italic", file: "@fontsource/source-serif-4/files/source-serif-4-latin-400-italic.woff2", ext: "@fontsource/source-serif-4/files/source-serif-4-latin-ext-400-italic.woff2" },
  { stack: "Source Serif 4 Semibold", family: "Source Serif 4", weight: 600, style: "normal", file: "@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2", ext: "@fontsource/source-serif-4/files/source-serif-4-latin-ext-600-normal.woff2" },
  { stack: "Plus Jakarta Sans Medium", family: "Plus Jakarta Sans", weight: 500, style: "normal", file: "@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-500-normal.woff2", ext: "@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-ext-500-normal.woff2" },
];

// ---- protobuf minimal ----
function varint(n) {
  const out = [];
  let v = n >>> 0;
  while (v > 127) {
    out.push((v & 127) | 128);
    v >>>= 7;
  }
  out.push(v);
  return out;
}
const zigzag = (n) => ((n << 1) ^ (n >> 31)) >>> 0;
const tag = (field, wire) => varint((field << 3) | wire);
const bytes = (field, buf) => [...tag(field, 2), ...varint(buf.length), ...buf];
const str = (field, s) => bytes(field, [...Buffer.from(s, "utf8")]);
const uint = (field, n) => [...tag(field, 0), ...varint(n)];
const sint = (field, n) => [...tag(field, 0), ...varint(zigzag(n))];

function encodeGlyph(g) {
  const parts = [...uint(1, g.id)];
  if (g.bitmap.length) parts.push(...bytes(2, g.bitmap));
  parts.push(...uint(3, g.width), ...uint(4, g.height), ...sint(5, g.left), ...sint(6, g.top), ...uint(7, g.advance));
  return parts;
}
function encodeStack(name, range, glyphs) {
  const stack = [...str(1, name), ...str(2, range)];
  for (const g of glyphs) stack.push(...bytes(3, encodeGlyph(g)));
  return Buffer.from(bytes(1, stack));
}

const tinySdf = readFileSync(require.resolve("@mapbox/tiny-sdf"), "utf8").replace(/export default class TinySDF/, "window.TinySDF = class TinySDF");
const b64 = (p) => readFileSync(require.resolve(p)).toString("base64");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><title>glyphs</title>");
await page.addScriptTag({ content: tinySdf });

for (const font of FONTS) {
  const data = { family: font.family, weight: font.weight, style: font.style, latin: b64(font.file), ext: b64(font.ext) };
  await page.evaluate(async (f) => {
    for (const [src, range] of [
      [f.latin, "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
      [f.ext, "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"],
    ]) {
      const face = new FontFace(f.family, `url(data:font/woff2;base64,${src})`, { weight: String(f.weight), style: f.style, unicodeRange: range });
      await face.load();
      document.fonts.add(face);
    }
  }, data);

  for (const start of RANGES) {
    const glyphs = await page.evaluate(
      async ({ family, weight, style, start }) => {
        const sdf = new window.TinySDF({ fontSize: 24, buffer: 3, radius: 8, cutoff: 0.25, fontFamily: `"${family}"`, fontWeight: String(weight), fontStyle: style });
        const out = [];
        for (let id = start; id < start + 256; id++) {
          // Lewati kontrol dan codepoint yang tidak dimiliki font ini (jangan render fallback).
          if (id < 32 || (id >= 127 && id < 160)) continue;
          const ch = String.fromCharCode(id);
          if (!document.fonts.check(`${style} ${weight} 24px "${family}"`, ch)) continue;
          const ctx = document.createElement("canvas").getContext("2d");
          ctx.font = `${style} ${weight} 24px "${family}"`;
          const w = ctx.measureText(ch).width;
          const r = sdf.draw(ch);
          const bitmap = r.glyphWidth && r.glyphHeight ? Array.from(r.data) : [];
          out.push({ id, bitmap, width: r.glyphWidth, height: r.glyphHeight, left: Math.round(r.glyphLeft), top: Math.round(r.glyphTop - 27), advance: Math.round(w) });
        }
        return out;
      },
      { family: font.family, weight: font.weight, style: font.style, start },
    );
    const range = `${start}-${start + 255}`;
    const path = join(ROOT, "public", "glyphs", font.stack, `${range}.pbf`);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, encodeStack(font.stack, range, glyphs));
    console.log(font.stack, range, glyphs.length, "glyph");
  }
}
await browser.close();
