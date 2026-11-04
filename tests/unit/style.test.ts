import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { baseStyle, LUAR_FOKUS, MAP_BOUNDS, PALET, SOURCE_ID, type MapTheme } from "@/features/peta/style";

const ORIGIN = "http://localhost:3000";
const TEMA: MapTheme[] = ["day", "night"];

// Mengumpulkan semua nilai string di dalam objek style, termasuk di dalam ekspresi.
function semuaString(nilai: unknown, out: string[] = []): string[] {
  if (typeof nilai === "string") out.push(nilai);
  else if (Array.isArray(nilai)) nilai.forEach((v) => semuaString(v, out));
  else if (nilai && typeof nilai === "object") Object.values(nilai).forEach((v) => semuaString(v, out));
  return out;
}

describe.each(TEMA)("baseStyle %s", (tema) => {
  const style = baseStyle(tema, ORIGIN);
  const layers = style.layers;
  const ids = layers.map((l) => l.id);

  it("memakai URL absolut untuk tile dan glyph", () => {
    const src = style.sources[SOURCE_ID] as { url: string };
    expect(src.url).toBe(`pmtiles://${ORIGIN}/tiles/batam.pmtiles`);
    expect(style.glyphs).toBe(`${ORIGIN}/glyphs/{fontstack}/{range}.pbf`);
  });

  it("id layer unik", () => {
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tidak ada warna di luar token", () => {
    const token = new Set(Object.values(PALET[tema]).map((c) => c.toLowerCase()));
    const warna = semuaString(layers).filter((s) => /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\()/i.test(s));
    expect(warna.length).toBeGreaterThan(0);
    expect(warna.filter((c) => !token.has(c.toLowerCase()))).toEqual([]);
  });

  it("semua font label punya glyph di public/glyphs", () => {
    const font = new Set<string>();
    for (const l of layers) {
      if (l.type !== "symbol") continue;
      const tf = l.layout?.["text-font"];
      semuaString(tf)
        .filter((s) => /Source Serif|Plus Jakarta|Noto/.test(s))
        .forEach((s) => font.add(s));
    }
    expect(font.size).toBeGreaterThan(0);
    for (const f of font) {
      expect(existsSync(join(process.cwd(), "public", "glyphs", f, "0-255.pbf")), f).toBe(true);
    }
  });

  it("tidak bergantung pada sprite", () => {
    expect(style.sprite).toBeUndefined();
    for (const l of layers) {
      if (l.type === "symbol") expect(l.layout?.["icon-image"], l.id).toBeUndefined();
    }
  });

  it("urutan lapisan: jalan, selubung, air, waterlining, jembatan, graticule, label", () => {
    const urutan = [
      "earth",
      "buildings",
      "roads_major",
      "selubung-luar-fokus",
      "water",
      "waterline-0",
      "roads_bridges_major",
      "graticule-5",
    ].map((id) => ids.indexOf(id));
    expect(urutan.every((i) => i >= 0)).toBe(true);
    expect(urutan).toEqual([...urutan].sort((a, b) => a - b));
    expect(layers.findIndex((l) => l.type === "symbol")).toBeGreaterThan(ids.indexOf("graticule-5"));
    expect(ids[ids.length - 1]).toBe("garis-1n-label");
  });

  it("selubung memakai warna darat, tidak ada warna baru", () => {
    const selubung = layers.find((l) => l.id === "selubung-luar-fokus");
    expect(selubung?.type === "fill" && selubung.paint?.["fill-color"]).toBe(PALET[tema].land);
  });

  it("area luar fokus tidak menyentuh Batam, Rempang, dan Galang", () => {
    const [utara, timur] = LUAR_FOKUS.coordinates.map(([cincin]) => cincin);
    expect(Math.min(...utara.map(([, lat]) => lat))).toBeGreaterThan(1.2);
    expect(Math.min(...timur.map(([lng]) => lng))).toBeGreaterThan(104.18);
  });

  it("garis 1°N berlabel dan beraksen", () => {
    const label = layers.find((l) => l.id === "garis-1n-label");
    expect(label?.type === "symbol" && label.layout?.["text-field"]).toBe("1°00′ U");
    const garis = layers.find((l) => l.id === "garis-1n");
    expect(garis?.type === "line" && garis.paint?.["line-color"]).toBe(PALET[tema].line1n);
  });
});

describe("tema", () => {
  it("warna darat dan laut sesuai token", () => {
    expect(PALET.day.land).toBe("#F4EFE4");
    expect(PALET.day.water).toBe("#DCE3E1");
    expect(PALET.night.land).toBe("#16263A");
    expect(PALET.night.water).toBe("#0F1B2A");
  });

  it("bbox mengikuti keputusan research/00", () => {
    expect(MAP_BOUNDS).toEqual([
      [103.55, 0.45],
      [104.75, 1.5],
    ]);
  });
});
