import { PNG } from "pngjs";
import { describe, expect, it } from "vitest";
import { SKALA_RADAR, warnaiRadar } from "@/features/langit-laut/lib/warna-radar";

function citra(warna: [number, number, number, number]) {
  const p = new PNG({ width: 2, height: 2 });
  for (let i = 0; i < p.data.length; i += 4) p.data.set(warna, i);
  return PNG.sync.write(p);
}
const hasil = (b: Buffer) => PNG.sync.read(warnaiRadar(b));
const warnaDi = (p: PNG, x: number, y: number) => [...p.data.subarray((y * p.width + x) * 4, (y * p.width + x) * 4 + 4)];

describe("warna radar (PEDOMAN 5.2)", () => {
  it("membesar sesuai skala", () => {
    const p = hasil(citra([0, 255, 255, 255]));
    expect(p.width).toBe(2 * SKALA_RADAR);
    expect(p.height).toBe(2 * SKALA_RADAR);
  });

  it("ringan: titik biru di atas biru muda", () => {
    const p = hasil(citra([0, 255, 255, 255]));
    expect(warnaDi(p, 0, 0)).toEqual([0xcf, 0xe4, 0xf2, 255]);
    expect(warnaDi(p, 1, 1)).toEqual([0x3f, 0x8f, 0xcb, 255]);
  });

  it("sedang dan lebat memakai warna rata, kelasnya sama dengan hitungan hujan", () => {
    expect(warnaDi(hasil(citra([255, 255, 0, 255])), 0, 0)).toEqual([0x3f, 0x8f, 0xcb, 255]);
    expect(warnaDi(hasil(citra([255, 0, 0, 255])), 1, 1)).toEqual([0x2c, 0x4f, 0x88, 255]);
  });

  it("piksel kosong tetap kosong", () => {
    expect(warnaDi(hasil(citra([0, 0, 0, 0])), 0, 0)[3]).toBe(0);
  });
});
