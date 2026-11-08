import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { gambarLayar, DESAIN } from "@/features/kartu-pos/desain";
import { grafisHidanganKecil } from "@/features/makan/lib/hidangan";

const ada = (url: string) => existsSync(join(process.cwd(), "public", url));

// Versi kecil dibuat scripts/buat-varian-gambar.mjs. Gambar baru tanpa versi kecil akan tampil kosong.
describe("versi kecil gambar", () => {
  it("setiap gambar hidangan punya versi 352 px", () => {
    const kategori = readdirSync(join(process.cwd(), "public", "grafis", "hidangan"))
      .filter((n) => n.endsWith(".webp"))
      .map((n) => n.replace(/\.webp$/, ""));
    expect(kategori.length).toBeGreaterThan(20);
    expect(kategori.filter((k) => !ada(grafisHidanganKecil(k)))).toEqual([]);
  });

  it("setiap desain kartu pos punya versi layar", () => {
    expect(DESAIN.filter((d) => !ada(gambarLayar(d.gambar))).map((d) => d.id)).toEqual([]);
  });
});
