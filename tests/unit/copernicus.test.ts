import { describe, expect, it } from "vitest";
import {
  framesCopernicus,
  haluskan,
  keIso,
  tabelNilai,
  tabelPita,
  warnaPita,
} from "@/features/langit-laut/lib/copernicus";

describe("peta gelombang Copernicus", () => {
  it("daftar waktu per 3 jam UTC, 12 jam ke belakang sampai 60 jam ke depan", () => {
    const now = Date.UTC(2026, 10, 12, 4, 20); // 11.20 WIB
    const f = framesCopernicus(now);
    expect(f.source).toBe("copernicus");
    expect(f.frames).toHaveLength(25);
    expect(f.frames[0]).toBe("202611111500");
    expect(f.frames.at(-1)).toBe("202611141500");
    // 03.00 UTC lebih dekat ke 04.20 UTC daripada 06.00 UTC
    expect(f.frames[f.nowIndex]).toBe("202611120300");
    expect(keIso(f.frames[f.nowIndex])).toBe("2026-11-12T03:00:00Z");
  });

  it("warna pita mengikuti batas bawah skala BMKG", () => {
    expect(warnaPita(0)).toEqual([0x07, 0x5d, 0xe6]);
    expect(warnaPita(0.49)).toEqual([0x07, 0x5d, 0xe6]);
    expect(warnaPita(0.5)).toEqual([0x31, 0x75, 0xbc]);
    expect(warnaPita(1.3)).toEqual([0x01, 0xd7, 0x43]);
    expect(warnaPita(9)).toEqual([0x69, 0x1d, 0x77]);
  });

  it("tabel nilai membalik skala abu-abu yang tidak linear menjadi meter", () => {
    // Skala tiruan: indeks 0..255, merah = indeks + 10 dipotong 255 (seperti cmocean gray yang bergeser).
    const cm = Array.from({ length: 256 }, (_, i) => {
      const r = Math.min(255, i + 10);
      return [r, r, r];
    });
    const nilai = tabelNilai(cm, 7);
    expect(nilai[10]).toBeCloseTo(0, 6); // merah 10 = indeks 0
    expect(nilai[47]).toBeCloseTo((37 / 255) * 7, 6);
    expect(nilai[0]).toBeCloseTo(0, 6); // di bawah nilai terkecil
    const pita = tabelPita(7);
    expect(Array.from(pita.slice(130 * 3, 130 * 3 + 3))).toEqual(warnaPita(1.3));
  });

  it("penghalusan hanya merata-ratakan piksel berdata dan mengisi celah sempit", () => {
    const w = 9;
    const h = 1;
    // empat piksel 1 m, satu piksel tanpa data, empat piksel 2 m
    const nilai = Float32Array.from([1, 1, 1, 1, 0, 2, 2, 2, 2]);
    const bobot = Float32Array.from([1, 1, 1, 1, 0, 1, 1, 1, 1]);
    haluskan(nilai, bobot, w, h, 1);
    expect(nilai[0]).toBeCloseTo(1, 6);
    expect(nilai[8]).toBeCloseTo(2, 6);
    expect(nilai[4]).toBeGreaterThan(1);
    expect(nilai[4]).toBeLessThan(2);
    expect(bobot[4]).toBeGreaterThan(0);
  });
});
