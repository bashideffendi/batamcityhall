import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { baseStyle, LUAR_FOKUS, MAP_BOUNDS, PALET, SOURCE_ID, type MapTheme } from "@/features/peta/style";

const ORIGIN = "http://localhost:3000";
const TEMA: MapTheme[] = ["light", "dark"];

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
        .filter((s) => /Newsreader|Plus Jakarta/.test(s))
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

  it("urutan lapisan: jalan, selubung, air, garis pantai, jembatan, label", () => {
    const urutan = ["earth", "buildings", "roads_major", "selubung-luar-fokus", "water", "garis-pantai", "roads_bridges_major"].map((id) =>
      ids.indexOf(id),
    );
    expect(urutan.every((i) => i >= 0)).toBe(true);
    expect(urutan).toEqual([...urutan].sort((a, b) => a - b));
    expect(layers.findIndex((l) => l.type === "symbol")).toBeGreaterThan(ids.indexOf("garis-pantai"));
  });

  it("tanpa garis koordinat dan garis 1 derajat", () => {
    expect(ids.filter((id) => /graticule|garis-1n|waterline/.test(id))).toEqual([]);
  });

  it("selubung memakai warna pulau di luar Batam", () => {
    const selubung = layers.find((l) => l.id === "selubung-luar-fokus");
    expect(selubung?.type === "fill" && selubung.paint?.["fill-color"]).toBe(PALET[tema].landOther);
  });

  it("area luar fokus tidak menyentuh Batam, Rempang, dan Galang", () => {
    const [utara, timur] = LUAR_FOKUS.coordinates.map(([cincin]) => cincin);
    expect(Math.min(...utara.map(([, lat]) => lat))).toBeGreaterThan(1.2);
    expect(Math.min(...timur.map(([lng]) => lng))).toBeGreaterThan(104.18);
  });

});

describe("tema", () => {
  it("warna darat dan laut sesuai token", () => {
    expect(PALET.light.land).toBe("#FFF5E0");
    expect(PALET.light.water).toBe("#E4EFF7");
    expect(PALET.dark.land).toBe("#22201B");
    expect(PALET.dark.water).toBe("#16222C");
  });

  it("bbox mengikuti keputusan research/00", () => {
    expect(MAP_BOUNDS).toEqual([
      [103.55, 0.45],
      [104.75, 1.5],
    ]);
  });
});
