import { KATA_TUGAS_EN, kaidahJudul } from "@/lib/judul";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cariDi, halamanSitus } from "@/features/cari/cocok";
import { placeSchema, statsSchema } from "@/lib/data/schema";
import { BAGIAN, bagianDiAlamat, KAKI_KETERANGAN } from "@/lib/site";

const baca = (p: string): unknown => JSON.parse(readFileSync(join(process.cwd(), p), "utf8"));

describe("teks wajib", () => {
  it("kaki halaman singkat", () => {
    expect(KAKI_KETERANGAN).toBe("Proyek independen warga Batam. Tanpa iklan.");
  });
});

describe("menu", () => {
  it("urutan bagian sesuai keputusan pemilik", () => {
    expect(BAGIAN.map((b) => b.nama)).toEqual([
      "Cuaca",
      "CCTV",
      "Transportasi",
      "Makanan",
      "Berita",
      "Jurnal",
      "Infografik",
      "Things to Do",
      "Komunitas",
      "Tukang Langganan",
      "Info Loker",
      "Layanan Warga",
      "Sejarah dan Budaya",
    ]);
  });

  it("setiap nama menu dan submenu memakai Title Case", () => {
    for (const b of BAGIAN) {
      expect(kaidahJudul(b.nama, b.id === "kegiatan" ? KATA_TUGAS_EN : undefined), b.nama).toBe(b.nama);
      for (const s of b.isi) expect(kaidahJudul(s.label), s.label).toBe(s.label);
    }
  });

  it("peta transportasi di ujung submenu, tidak di antara Trans Batam dan Feri", () => {
    const isi = BAGIAN.find((b) => b.id === "transportasi")?.isi.map((s) => s.label) ?? [];
    expect(isi.slice(0, 3)).toEqual(expect.arrayContaining(["Trans Batam", "Feri"]));
    expect(isi.indexOf("Feri") - isi.indexOf("Trans Batam")).toBe(1);
    expect(isi.at(-1)).toBe("Peta Transportasi");
  });

  it("alamat menunjuk bagian yang benar", () => {
    expect(bagianDiAlamat("/cuaca/hujan")?.id).toBe("cuaca");
    expect(bagianDiAlamat("/cctv")?.id).toBe("cctv");
    expect(bagianDiAlamat("/kartu-pos")?.id).toBe("budaya");
    expect(bagianDiAlamat("/jalan/feri/panduan")?.id).toBe("transportasi");
    expect(bagianDiAlamat("/makanan-lain")).toBeUndefined();
    expect(bagianDiAlamat("/")).toBeUndefined();
  });
});

describe("pencarian situs", () => {
  const halaman = halamanSitus(BAGIAN);

  it("menemukan halaman dan tidak peka huruf besar", () => {
    expect(cariDi(halaman, "TRANS BATAM", (h) => [h.nama, h.bagian])[0].href).toBe("/jalan/trans-batam");
    expect(cariDi(halaman, "nomor darurat", (h) => [h.nama, h.bagian])[0].href).toBe("/info/darurat");
  });

  it("semua kata harus ada, dan nama yang diawali kata itu lebih dulu", () => {
    const d = [{ n: "Masjid Raya" }, { n: "Raya Bakso" }, { n: "Bakso" }];
    expect(cariDi(d, "raya", (x) => [x.n]).map((x) => x.n)).toEqual(["Raya Bakso", "Masjid Raya"]);
    expect(cariDi(d, "bakso raya", (x) => [x.n]).map((x) => x.n)).toEqual(["Raya Bakso"]);
    expect(cariDi(d, "   ", (x) => [x.n])).toEqual([]);
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

describe("kaidah judul", () => {
  it("Title Case, kata tugas tetap kecil, kapital yang ada tidak diubah", () => {
    expect(kaidahJudul("Martabak dan Prata")).toBe("Martabak dan Prata");
    expect(kaidahJudul("Oleh-Oleh dan Kue")).toBe("Oleh-Oleh dan Kue");
    expect(kaidahJudul("Dim Sum dan Masakan Tionghoa")).toBe("Dim Sum dan Masakan Tionghoa");
    expect(kaidahJudul("Udang mentega/sereal")).toBe("Udang Mentega/Sereal");
    expect(kaidahJudul("Telaga Punggur—Tanjung Uban (kapal cepat)")).toBe("Telaga Punggur—Tanjung Uban (Kapal Cepat)");
    expect(kaidahJudul("Hari Jadi ke-196")).toBe("Hari Jadi ke-196");
    expect(kaidahJudul("Tour de Batam (UCI)")).toBe("Tour de Batam (UCI)");
    expect(kaidahJudul("di atas laut")).toBe("Di Atas Laut");
    expect(kaidahJudul("Seafood and gonggong", KATA_TUGAS_EN)).toBe("Seafood and Gonggong");
  });
});
