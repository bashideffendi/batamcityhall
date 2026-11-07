import { describe, expect, it } from "vitest";
import { agendaBelumLewat, gabungTulisan, lokerBelumLewat, tulisanDariBaris } from "@/features/konten/baca";
import { buatSlug, pecahParagraf, SkemaAgenda, SkemaAksiKonten, SkemaJurnal, SkemaLoker, SkemaUbahanFoodCourt, SkemaUbahanMakan } from "@/features/konten/skema";
import { GalatSlugGanda, storeContoh, type BarisAgenda, type BarisLoker } from "@/features/konten/store";
import { terapkanUbahan, terapkanUbahanFoodCourt } from "@/features/konten/ubahan";
import type { FoodCourt } from "@/features/makan/lib/foodcourt";
import { modeKiriman } from "@/features/tukang/mode";
import type { Place } from "@/features/makan/lib/types";
import { TULISAN } from "@/features/jurnal/data";

const jurnal = {
  slug: "nongsa-baru",
  judul: "Nongsa Baru",
  penulis: "Redaksi",
  tanggal: "2026-11-06",
  rubrik: "Sejarah",
  ringkasan: "Ringkas.",
  gambar: null,
  isi: "Paragraf satu.\n\nParagraf dua.",
  terbit: true,
};
const memoriKosong = () => ({ jurnal: [], foto: [], agenda: [], loker: [], makan: [], foodcourt: [] });

describe("isian Jurnal", () => {
  it("alamat dibuat dari judul", () => {
    expect(buatSlug("Nongsa dan Mandat 18 Desember 1829")).toBe("nongsa-dan-mandat-18-desember-1829");
    expect(buatSlug("  Kopi, Roti & Sejarah!  ")).toBe("kopi-roti-sejarah");
    expect(buatSlug("Café Tepi Laut")).toBe("cafe-tepi-laut");
  });

  it("paragraf dipisah baris kosong, baris tunggal disambung", () => {
    expect(pecahParagraf("Satu\nlanjutan.\r\n\r\nDua.\n\n\n")).toEqual(["Satu lanjutan.", "Dua."]);
  });

  it("judul, penulis, dan tanggal wajib", () => {
    expect(SkemaJurnal.safeParse(jurnal).success).toBe(true);
    expect(SkemaJurnal.safeParse({ ...jurnal, penulis: " " }).success).toBe(false);
    expect(SkemaJurnal.safeParse({ ...jurnal, tanggal: "6 Nov" }).success).toBe(false);
    expect(SkemaJurnal.safeParse({ ...jurnal, slug: "Bukan Slug" }).success).toBe(false);
    expect(SkemaJurnal.safeParse({ ...jurnal, gambar: "javascript:alert(1)" }).success).toBe(false);
  });

  it("tulisan basis data menang bila alamatnya sama, urut terbaru", () => {
    const baru = tulisanDariBaris({ ...jurnal, id: "x" });
    const sama = { ...baru, slug: TULISAN[0].slug, judul: "Versi Baru" };
    const hasil = gabungTulisan(TULISAN, [baru, sama]);
    expect(hasil.filter((t) => t.slug === TULISAN[0].slug).map((t) => t.judul)).toEqual(["Versi Baru"]);
    expect(hasil.map((t) => t.tanggal)).toEqual([...hasil.map((t) => t.tanggal)].sort().reverse());
    expect(baru.isi).toEqual(["Paragraf satu.", "Paragraf dua."]);
    expect(baru.gambar).toBe("/grafis/bagian/jurnal.webp");
  });
});

describe("agenda", () => {
  const dasar = { nama: "Konser", jenis: "konser", mulai: "2026-12-01", lokasi: "Batam", terbit: true };

  it("tanggal selesai tidak boleh sebelum mulai, jenis harus dikenal", () => {
    expect(SkemaAgenda.safeParse(dasar).success).toBe(true);
    expect(SkemaAgenda.safeParse({ ...dasar, selesai: "2026-11-30" }).success).toBe(false);
    expect(SkemaAgenda.safeParse({ ...dasar, jenis: "rahasia" }).success).toBe(false);
  });

  it("acara yang sudah lewat tidak tampil, yang masih berlangsung tampil", () => {
    const a = (id: string, mulai: string, selesai: string | null = null) => ({ ...dasar, id, mulai, selesai }) as BarisAgenda;
    const hasil = agendaBelumLewat([a("lewat", "2026-11-01"), a("nanti", "2026-12-01"), a("jalan", "2026-11-01", "2026-11-10")], "2026-11-06");
    expect(hasil.map((x) => x.id)).toEqual(["jalan", "nanti"]);
  });
});

describe("info loker", () => {
  const dasar = { posisi: "Operator", perusahaan: "PT Contoh", jenis: "kontrak", lokasi: "Muka Kuning", cara_melamar: "Kirim surat lamaran.", tanggal: "2026-11-01", terbit: true };

  it("posisi, perusahaan, dan cara melamar wajib, batas tidak sebelum posting", () => {
    expect(SkemaLoker.safeParse(dasar).success).toBe(true);
    expect(SkemaLoker.safeParse({ ...dasar, perusahaan: " " }).success).toBe(false);
    expect(SkemaLoker.safeParse({ ...dasar, cara_melamar: "" }).success).toBe(false);
    expect(SkemaLoker.safeParse({ ...dasar, jenis: "rahasia" }).success).toBe(false);
    expect(SkemaLoker.safeParse({ ...dasar, batas: "2026-10-01" }).success).toBe(false);
    expect(SkemaLoker.safeParse({ ...dasar, tautan: "javascript:alert(1)" }).success).toBe(false);
  });

  it("lowongan yang lewat batas tidak tampil, tanpa batas tetap tampil, terbaru lebih dulu", () => {
    const l = (id: string, tanggal: string, batas: string | null) => ({ ...dasar, id, tanggal, batas }) as BarisLoker;
    const hasil = lokerBelumLewat([l("lama", "2026-10-01", "2026-10-31"), l("a", "2026-11-01", "2026-11-30"), l("b", "2026-11-03", null)], "2026-11-06");
    expect(hasil.map((x) => x.id)).toEqual(["b", "a"]);
  });

  it("draf tidak terbaca publik", async () => {
    const s = storeContoh(memoriKosong());
    await s.simpanLoker({ ...SkemaLoker.parse(dasar), terbit: false });
    expect(await s.loker(false)).toEqual([]);
    expect(await s.loker(true)).toHaveLength(1);
  });
});

describe("data makanan", () => {
  const lama = { id: "a", name: "Lama", lat: 1.1, lng: 104, rating: 4.5, category: "bubur", area: "bengkong", last_verified: "2020-01-01" } as unknown as Place;
  const kolom = {
    name: "Baru",
    category: "bubur",
    area: "bengkong",
    halal: "halal",
    desc_id: "Keterangan.",
    price_tier: "$",
    address: "Jl. Satu",
  };

  it("tempat baru wajib berkoordinat di Batam, tempat lama tidak boleh mengubah koordinat", () => {
    expect(SkemaUbahanMakan.safeParse({ baru: true, tempat_id: "baru", ...kolom }).success).toBe(false);
    expect(SkemaUbahanMakan.safeParse({ baru: true, tempat_id: "baru", ...kolom, lat: 104, lng: 1 }).success).toBe(false);
    expect(SkemaUbahanMakan.safeParse({ baru: true, tempat_id: "baru", ...kolom, lat: 1.1, lng: 104 }).success).toBe(true);
    const ubah = SkemaUbahanMakan.parse({ baru: false, tempat_id: "a", ...kolom, lat: 9, lng: 9 });
    expect(ubah).not.toHaveProperty("lat");
  });

  it("kategori, kawasan, dan food court harus dikenal", () => {
    expect(SkemaUbahanMakan.safeParse({ baru: false, tempat_id: "a", ...kolom, category: "rahasia" }).success).toBe(false);
    expect(SkemaUbahanMakan.safeParse({ baru: false, tempat_id: "a", ...kolom, area: "rahasia" }).success).toBe(false);
    // Food court baru tersimpan di basis data, jadi keberadaannya diperiksa API. Skema menolak bentuk yang salah.
    expect(SkemaUbahanMakan.safeParse({ baru: false, tempat_id: "a", ...kolom, food_court: "Bukan Alamat!" }).success).toBe(false);
    expect(SkemaUbahanMakan.safeParse({ baru: false, tempat_id: "a", ...kolom, kategori_lain: ["rahasia"] }).success).toBe(false);
    const hasil = SkemaUbahanMakan.parse({ baru: false, tempat_id: "a", ...kolom, food_court: "", kategori_lain: ["ayce"] });
    expect(hasil).toMatchObject({ food_court: null, kategori_lain: ["ayce"] });
    expect(SkemaUbahanMakan.parse({ baru: false, tempat_id: "a", ...kolom, food_court: "a2-food-court" }).food_court).toBe("a2-food-court");
  });

  it("food court dan kategori lain ikut diterapkan, dan bisa dilepas", () => {
    const u = { tempat_id: "a", baru: false, data: { name: "Lama", food_court: "a2-food-court", kategori_lain: ["ayce"] } };
    const { tempat } = terapkanUbahan([lama], [u], "2026-11-06");
    expect(tempat[0]).toMatchObject({ food_court: "a2-food-court", kategori_lain: ["ayce"] });
    const lepas = terapkanUbahan(tempat, [{ tempat_id: "a", baru: false, data: { name: "Lama", food_court: null } }], "2026-11-06");
    expect(lepas.tempat[0].food_court).toBeNull();
  });

  it("ubahan hanya menyentuh kolom yang diizinkan, data asli tidak berubah", () => {
    const u = { tempat_id: "a", baru: false, data: { name: "Diubah", lat: 9, rating: 1 } };
    const { tempat, dilewati } = terapkanUbahan([lama], [u], "2026-11-06");
    expect(tempat[0]).toMatchObject({ name: "Diubah", lat: 1.1, rating: 4.5, last_verified: "2026-11-06" });
    expect(lama.name).toBe("Lama");
    expect(dilewati).toEqual([]);
  });

  it("tempat baru ditambahkan tanpa rating, yang tak lengkap dilewati", () => {
    const u = [
      { tempat_id: "b", baru: true, data: { name: "Baru", category: "bubur", area: "bengkong", lat: 1.1, lng: 104 } },
      { tempat_id: "c", baru: true, data: { name: "Tanpa Titik" } },
      { tempat_id: "hilang", baru: false, data: { name: "Hilang" } },
    ];
    const { tempat, dilewati } = terapkanUbahan([lama], u, "2026-11-06");
    expect(tempat.map((p) => p.id)).toEqual(["a", "b"]);
    expect(tempat[1]).toMatchObject({ rating: null, coord_approx: false, verified: true });
    expect(dilewati).toEqual(["c", "hilang"]);
  });
});

describe("penyimpanan contoh", () => {
  it("tulisan draf tidak terbaca publik, alamat tidak boleh ganda", async () => {
    const s = storeContoh(memoriKosong());
    await s.simpanJurnal({ ...jurnal, terbit: false, id: undefined });
    expect(await s.jurnal(false)).toEqual([]);
    expect(await s.jurnal(true)).toHaveLength(1);
    await expect(s.simpanJurnal({ ...jurnal, id: undefined })).rejects.toBeInstanceOf(GalatSlugGanda);
    const [b] = await s.jurnal(true);
    await s.simpanJurnal({ ...b, terbit: true });
    expect(await s.jurnal(false)).toHaveLength(1);
    await s.hapusJurnal(b.id);
    expect(await s.jurnal(true)).toEqual([]);
  });

  it("aksi tak dikenal ditolak", () => {
    expect(SkemaAksiKonten.safeParse({ aksi: "hapus_semua" }).success).toBe(false);
    expect(SkemaAksiKonten.safeParse({ aksi: "hapus_jurnal", id: "bukan-uuid" }).success).toBe(false);
  });

  it("tanpa basis data, situs tidak mencoba menyimpan apa pun di produksi", () => {
    expect(modeKiriman({ NODE_ENV: "production" })).toBe("mati");
  });
});

describe("food court dari dashboard", () => {
  const isian = {
    nama: "Pujasera Uji",
    kecamatan: "Sekupang",
    alamat: "Jl. Uji",
    jam: "",
    isi: "Keterangan.",
    tingkat: "dibaca",
    sumber_url: ["https://example.com/uji"],
  };
  const lama: FoodCourt = {
    id: "lama",
    nama: "Lama",
    kecamatan: "Batam Kota",
    alamat: "Jl. Lama",
    jam: "",
    isi: "Isi lama.",
    tingkat: "daftar",
    sumber_url: ["https://example.com/lama"],
    lat: 1.1,
    lng: 104,
  };

  it("butuh kecamatan Batam, tautan sumber https, dan nama yang belum dipakai", () => {
    expect(SkemaUbahanFoodCourt.safeParse({ baru: true, foodcourt_id: "pujasera-uji", ...isian }).success).toBe(true);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: true, foodcourt_id: "pujasera-uji", ...isian, sumber_url: [] }).success).toBe(false);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: true, foodcourt_id: "pujasera-uji", ...isian, sumber_url: ["http://example.com"] }).success).toBe(false);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: true, foodcourt_id: "pujasera-uji", ...isian, kecamatan: "Tanjungpinang" }).success).toBe(false);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: true, foodcourt_id: "a2-food-court", ...isian }).success).toBe(false);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: false, foodcourt_id: "a2-food-court", ...isian }).success).toBe(true);
    expect(SkemaUbahanFoodCourt.safeParse({ baru: false, foodcourt_id: "tidak-ada", ...isian }).success).toBe(false);
  });

  it("ubahan menjaga koordinat, food court baru masuk tanpa koordinat, data asli tidak berubah", () => {
    const { daftar, dilewati } = terapkanUbahanFoodCourt(
      [lama],
      [
        { foodcourt_id: "lama", baru: false, data: { ...isian, nama: "Lama Diubah" } as FoodCourt },
        { foodcourt_id: "pujasera-uji", baru: true, data: isian as FoodCourt },
        { foodcourt_id: "hilang", baru: false, data: isian as FoodCourt },
      ],
    );
    expect(daftar[0]).toMatchObject({ id: "lama", nama: "Lama Diubah", lat: 1.1, lng: 104 });
    expect(daftar[1]).toMatchObject({ id: "pujasera-uji", nama: "Pujasera Uji", lat: null, lng: null });
    expect(dilewati).toEqual(["hilang"]);
    expect(lama.nama).toBe("Lama");
  });

  it("tersimpan, bisa diganti, dan bisa dibuang", async () => {
    const s = storeContoh(memoriKosong());
    const d = SkemaUbahanFoodCourt.parse({ baru: true, foodcourt_id: "pujasera-uji", ...isian });
    await s.simpanUbahanFoodCourt(d);
    await s.simpanUbahanFoodCourt({ ...d, nama: "Pujasera Uji Dua" });
    expect(await s.ubahanFoodCourt()).toEqual([{ foodcourt_id: "pujasera-uji", baru: true, data: expect.objectContaining({ nama: "Pujasera Uji Dua" }) }]);
    await s.hapusUbahanFoodCourt("pujasera-uji");
    expect(await s.ubahanFoodCourt()).toEqual([]);
    expect(SkemaAksiKonten.safeParse({ aksi: "simpan_foodcourt", data: d }).success).toBe(true);
  });
});
