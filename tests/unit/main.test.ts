import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { acaraTerdekat } from "@/features/hari-ini/ModulAcara";
import { DESAIN, salamDari } from "@/features/kartu-pos/desain";

describe("kartu pos", () => {
  it("setiap desain punya gambar", () => {
    expect(DESAIN.length).toBeGreaterThanOrEqual(6);
    for (const d of DESAIN) expect(existsSync(`public${d.gambar}`), d.id).toBe(true);
  });

  it("salam tidak pernah kosong", () => {
    expect(salamDari("Nongsa")).toBe("Nongsa");
    expect(salamDari("  ")).toBe("Batam");
  });
});

describe("acara terdekat", () => {
  const acara = [{ bulan: 1 }, { bulan: 3 }, { bulan: 11 }, { bulan: 12 }, { bulan: null }];

  it("mulai dari bulan ini, berputar ke tahun depan, tanpa acara yang tak berbulan", () => {
    expect(acaraTerdekat(acara, 11, 5).map((a) => a.bulan)).toEqual([11, 12, 1, 3]);
    expect(acaraTerdekat(acara, 2, 2).map((a) => a.bulan)).toEqual([3, 11]);
  });
});
