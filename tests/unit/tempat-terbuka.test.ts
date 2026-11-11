import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  adalahTerbuka,
  barisIndeks,
  daftarPin,
  labelTempat,
  punyaHalaman,
  punyaTitik,
  tautanArah,
  TEMPAT,
  TEMPAT_KURASI,
  tempatDiKategori,
} from "@/features/direktori/data";
import { tempatGoogleSchema } from "@/lib/data/schema";

// Tempat dari data Google Maps yang dihimpun pemilik (keputusan pemilik 11 Nov 2026). Lihat tools/google/impor.py.
const mentah = JSON.parse(readFileSync(join(process.cwd(), "data/tempat-google.json"), "utf8"));
const terbuka = TEMPAT.filter(adalahTerbuka);

describe("data Google Maps pemilik", () => {
  it("lolos skema dan memuat semua tempat", () => {
    expect(() => tempatGoogleSchema.parse(mentah)).not.toThrow();
    expect(mentah.tempat.length).toBeGreaterThan(11000);
    expect(mentah.sumber.nama).toBe("Google Maps");
  });

  it("tanpa kolom pajak", () => {
    for (const t of mentah.tempat) expect(Object.keys(t).some((k) => /pajak/i.test(k)), t.id).toBe(false);
  });

  it("id unik dan tidak bertabrakan dengan data kurasi", () => {
    const kurasi = new Set(TEMPAT_KURASI.map((p) => p.id));
    expect(new Set(terbuka.map((p) => p.id)).size).toBe(terbuka.length);
    expect(terbuka.filter((p) => kurasi.has(p.id))).toEqual([]);
  });

  it("semua bertitik perkiraan dan punya halaman", () => {
    for (const p of terbuka) {
      expect(p.status_koordinat, p.id).toBe("perlu_cek_ulang");
      expect(punyaTitik(p), p.id).toBe(true);
      expect(punyaHalaman(p), p.id).toBe(true);
    }
  });

  it("tombol arah memakai tautan Google Maps tempat itu", () => {
    const p = terbuka.find((x) => typeof x.atribut.gmaps === "string");
    expect(p).toBeDefined();
    expect(tautanArah(p!)).toBe(p!.atribut.gmaps);
  });

  it("tanda Rekomendasi hanya untuk rating 4,5 dari sedikitnya 100 ulasan, dan tampil lebih dulu", () => {
    const rek = mentah.tempat.filter((t: { rekomendasi: boolean }) => t.rekomendasi);
    expect(rek.length).toBeGreaterThan(500);
    for (const t of rek) {
      expect(t.rating, t.id).toBeGreaterThanOrEqual(4.5);
      expect(t.ulasan, t.id).toBeGreaterThanOrEqual(100);
    }
    const p = terbuka.find((x) => x.atribut.rekomendasi === true)!;
    expect(labelTempat(p)).toEqual([{ teks: "Rekomendasi", nada: "ok" }]);
    expect(tempatDiKategori("kuliner")[0].atribut.rekomendasi).toBe(true);
  });

  it("pin peta dan indeks pencarian memuat tempat dari data Google", () => {
    // Tempat dengan titik yang sama persis digabung dalam satu pin (daftar lain).
    const pin = daftarPin();
    const dalamPin = pin.flatMap((p) => [p.id, ...p.lain.map((l) => l.id)]).filter((id) => id.startsWith("gm-"));
    expect(dalamPin.length).toBe(terbuka.length);
    expect(pin.filter((p) => p.id.startsWith("gm-")).every((p) => p.perkiraan)).toBe(true);
    expect(TEMPAT.map(barisIndeks).filter((b) => b.id.startsWith("gm-")).length).toBe(terbuka.length);
  });
});
