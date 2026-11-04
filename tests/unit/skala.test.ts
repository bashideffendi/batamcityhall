import { describe, expect, it } from "vitest";
import {
  angkaBulat,
  batang,
  formatAngka,
  meterPerPiksel,
  METER_PER_KM,
  METER_PER_MIL_LAUT,
  penyebutSkala,
} from "@/features/peta/skala";

describe("meterPerPiksel", () => {
  it("cocok dengan rumus tile 512 px di khatulistiwa", () => {
    expect(meterPerPiksel(0, 0)).toBeCloseTo(78271.517, 2);
    expect(meterPerPiksel(0, 10)).toBeCloseTo(76.437, 2);
  });

  it("mengecil mengikuti kosinus lintang", () => {
    expect(meterPerPiksel(60, 0)).toBeCloseTo(78271.517 / 2, 1);
  });
});

describe("angkaBulat", () => {
  it.each([
    [1, 1],
    [1.9, 1],
    [2, 2],
    [4.9, 2],
    [5, 5],
    [9.9, 5],
    [10, 10],
    [0.7, 0.5],
    [0.15, 0.1],
    [1200, 1000],
  ])("%d → %d", (maks, hasil) => {
    expect(angkaBulat(maks)).toBeCloseTo(hasil, 9);
  });
});

describe("batang", () => {
  it("tidak pernah melebihi lebar maksimum", () => {
    for (const zoom of [7, 8.3, 9.7, 11, 12.4, 14, 16]) {
      const m = meterPerPiksel(1, zoom);
      for (const satuan of [METER_PER_KM, METER_PER_MIL_LAUT]) {
        const b = batang(m, 120, satuan);
        expect(b.px).toBeLessThanOrEqual(120 + 1e-6);
        expect(b.px).toBeGreaterThan(120 / 5 - 1e-6);
      }
    }
  });

  it("panjang piksel setara nilainya", () => {
    const b = batang(100, 120, METER_PER_KM);
    expect(b.nilai).toBe(10);
    expect(b.px).toBeCloseTo(100, 6);
  });

  it("satu mil laut lebih panjang dari satu km", () => {
    expect(batang(10, 1000, METER_PER_MIL_LAUT).nilai).toBe(5);
    expect(batang(10, 1000, METER_PER_KM).nilai).toBe(10);
  });

  it("nilai berbasis 5 dibagi lima segmen, lainnya dua", () => {
    expect(batang(100, 60, METER_PER_KM).segmen).toBe(5);
    expect(batang(100, 25, METER_PER_KM).segmen).toBe(2);
  });
});

describe("penyebutSkala", () => {
  it("dibulatkan ke dua angka penting", () => {
    expect(penyebutSkala(100)).toBe(380000);
    expect(penyebutSkala(66.1458)).toBe(250000);
  });
});

describe("formatAngka", () => {
  it("memakai format Indonesia", () => {
    expect(formatAngka(250000)).toBe("250.000");
    expect(formatAngka(0.5)).toBe("0,5");
  });
});
