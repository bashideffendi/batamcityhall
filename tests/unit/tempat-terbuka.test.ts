import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  adalahTerbuka,
  barisIndeks,
  daftarPin,
  kontakPublik,
  punyaHalaman,
  punyaTitik,
  TEMPAT,
  TEMPAT_KURASI,
} from "@/features/direktori/data";
import { jenisDari } from "@/features/peta/jenis-tempat";
import { tempatTerbukaSchema } from "@/lib/data/schema";

// Tempat dari data terbuka Overture (keputusan pemilik 9 Nov 2026). Aturan yang dijaga: lihat tools/overture/impor.py.
const mentah = JSON.parse(readFileSync(join(process.cwd(), "data/tempat-terbuka.json"), "utf8"));
const terbuka = TEMPAT.filter(adalahTerbuka);

describe("data terbuka Overture", () => {
  it("lolos skema: titik di Batam, keyakinan sumber, tanpa ponsel, media sosial, atau situs pemerintah", () => {
    expect(() => tempatTerbukaSchema.parse(mentah)).not.toThrow();
    expect(mentah.tempat.length).toBeGreaterThan(3000);
    expect(mentah.sumber.nama).toBe("Overture Maps Foundation");
  });

  it("tidak ada kategori yang hanya boleh dari data kurasi", () => {
    const dilarang = new Set(["pemerintahan", "layanan_publik", "keamanan_darurat", "kampung_tua"]);
    expect(terbuka.filter((p) => dilarang.has(p.kategori))).toEqual([]);
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

  it("nomor yang tampil hanya telepon tetap, tidak pernah ponsel", () => {
    for (const p of terbuka) {
      for (const k of kontakPublik(p).filter((x) => x.label === "Telepon")) expect(k.teks, p.id).not.toMatch(/^\(?0?8|^\+?628/);
    }
  });

  it("tanpa nama perumahan, kompleks, perusahaan pabrik, atau kantor yang sudah dikurasi", () => {
    const pola = /\b(perum|perumahan|cluster|puskesmas|polsek|polres|kelurahan|kecamatan|bpjs|industri|industrial)\b/i;
    expect(terbuka.filter((p) => pola.test(p.nama)).map((p) => p.nama)).toEqual([]);
  });

  it("pin peta dan indeks pencarian memuat tempat dari data terbuka", () => {
    const pin = daftarPin();
    expect(pin.filter((p) => p.id.startsWith("ov-")).length).toBeGreaterThan(3000);
    expect(pin.filter((p) => p.id.startsWith("ov-")).every((p) => p.perkiraan)).toBe(true);
    expect(TEMPAT.map(barisIndeks).filter((b) => b.id.startsWith("ov-")).length).toBe(terbuka.length);
  });

  it("kafe dan musala ikut panel Tempat di peta", () => {
    expect(jenisDari("kuliner", "kafe")).toBe("kopi");
    expect(jenisDari("ibadah", "musala")).toBe("masjid");
  });
});
