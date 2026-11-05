import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { placeSchema, statsSchema } from "@/lib/data/schema";
import { KAKI_KETERANGAN, LOKET } from "@/lib/site";

const baca = (p: string): unknown => JSON.parse(readFileSync(join(process.cwd(), p), "utf8"));

describe("teks wajib", () => {
  it("kaki halaman persis seperti pedoman 3.1", () => {
    expect(KAKI_KETERANGAN).toBe("Proyek independen warga Batam · Tanpa iklan");
  });
});

describe("menu loket", () => {
  it("tujuh loket bernomor urut", () => {
    expect(LOKET.map((l) => l.nomor)).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
  });
});

describe("data tempat", () => {
  const places = placeSchema.array().parse(baca("data/places.json"));
  const stats = statsSchema.parse(baca("data/places_stats.json")) as {
    total_tempat: number;
    per_status_koordinat: Record<string, number>;
  };

  it("jumlah cocok dengan statistik", () => {
    expect(places.length).toBe(stats.total_tempat);
  });

  it("status koordinat cocok dengan statistik", () => {
    const hitung: Record<string, number> = {};
    for (const p of places) hitung[p.status_koordinat] = (hitung[p.status_koordinat] ?? 0) + 1;
    expect(hitung).toEqual(stats.per_status_koordinat);
  });

  it("tempat tanpa koordinat berstatus perlu_diisi_user, tidak ada koordinat tebakan", () => {
    const tanpa = places.filter((p) => p.lat == null || p.lng == null);
    expect(tanpa.every((p) => p.status_koordinat === "perlu_diisi_user")).toBe(true);
  });

  it("tidak ada kolom pajak di data hotel", () => {
    const kepala = readFileSync(join(process.cwd(), "data/akomodasi/hotel.csv"), "utf8").split("\n")[0].toLowerCase();
    expect(kepala).not.toMatch(/npwpd|\bnop\b|sspd|sptpd|pajak/);
  });
});
