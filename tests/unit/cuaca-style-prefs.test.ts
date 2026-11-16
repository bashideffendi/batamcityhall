import { afterEach, describe, expect, it, vi } from "vitest";
import { baseStyle, PALET_CUACA } from "@/features/peta/style";
import { PREF, readRainOpacity, writePref } from "@/features/langit-laut/lib/prefs";

afterEach(() => vi.unstubAllGlobals());
describe.each(["light", "dark"] as const)("dasar cuaca %s", (theme) => {
  it("opsi cuaca tidak mengubah gaya bawaan dan menghapus label yang bertabrakan", () => {
    const original = baseStyle(theme, "http://localhost");
    const weather = baseStyle(theme, "http://localhost", { chart: false, cuaca: true });
    expect(weather.layers.some(l => l.type === "symbol")).toBe(false);
    expect(original.layers.some(l => l.type === "symbol")).toBe(true);
    expect(baseStyle(theme, "http://localhost", { cuaca: false })).toEqual(original);
    const earth = weather.layers.find(l => l.id === "earth");
    const water = weather.layers.find(l => l.id === "water");
    expect(earth?.type === "fill" && earth.paint?.["fill-color"]).toBe(PALET_CUACA[theme].land);
    expect(water?.type === "fill" && water.paint?.["fill-color"]).toBe(PALET_CUACA[theme].water);
  });
});
describe("ketebalan radar", () => {
  it.each([null, "", "rusak", "0", "1.5", "Infinity"])("nilai %s kembali ke 0,8", value => {
    vi.stubGlobal("localStorage", { getItem: () => value });
    expect(readRainOpacity()).toBe(0.8);
  });
  it("tersimpan dan terbaca kembali", () => {
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string,v: string) => data.set(k,v) });
    writePref(PREF.rainOpacity, "0.45");
    expect(readRainOpacity()).toBe(0.45);
  });
  it("storage diblokir tetap aman", () => {
    vi.stubGlobal("localStorage", { getItem: () => { throw Error(); }, setItem: () => { throw Error(); } });
    expect(readRainOpacity()).toBe(0.8);
    expect(() => writePref(PREF.rainOpacity, "0.3")).not.toThrow();
  });
});
