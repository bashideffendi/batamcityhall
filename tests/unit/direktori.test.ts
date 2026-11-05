import { describe, expect, it } from "vitest";
import darurat from "@/data/darurat/nomor_darurat.json";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import panduan from "@/data/panduan/urusan_tanah.json";
import stats from "@/data/places_stats.json";
import { kelengkapan } from "@/features/direktori/angka";
import { pilihBerteduh } from "@/features/direktori/Berteduh";
import {
  alamatPublik,
  atributPublik,
  barisIndeks,
  cariTempat,
  catatanPublik,
  DAFTAR_KATEGORI,
  daftarPin,
  jamPublik,
  kaidahJudul,
  kartuMinimal,
  kategoriDariSlug,
  kategoriTampil,
  kontakPublik,
  labelSub,
  labelTempat,
  ledeKategori,
  lencana,
  lokasiTeks,
  namaKategori,
  punyaHalaman,
  punyaTitik,
  slugBaru,
  slugKategori,
  statusBaris,
  subDiKategori,
  tanggalIndonesia,
  tautanAman,
  tautanArah,
  teksDicek,
  TEMPAT,
  tempatDiKategori,
  tempatPerId,
  type Place,
} from "@/features/direktori/data";
import { places as tempatMakan, terapkanKoordinat } from "@/features/makan/lib/data";
import { JENIS_PETA } from "@/components/map/icons";
import { jenisDari } from "@/features/peta/jenis-tempat";
import { pinKeGeoJson, type PinPeta } from "@/features/peta/lapisan";

const contoh = (lain: Partial<Place>): Place => ({ ...TEMPAT[0], atribut: {}, kontak: {}, ...lain });

describe("kategori direktori", () => {
  it("21 kategori tampilan dan jumlahnya cocok dengan statistik", () => {
    expect(DAFTAR_KATEGORI).toHaveLength(21);
    const perKategori = stats.per_kategori as Record<string, number>;
    for (const k of DAFTAR_KATEGORI) {
      const jumlah = k.sumber.reduce((n, s) => n + perKategori[s], 0);
      expect(tempatDiKategori(k.kategori).length, k.nama).toBe(jumlah);
    }
  });

  it("semua kategori data masuk ke tepat satu kategori tampilan", () => {
    for (const k of Object.keys(stats.per_kategori)) {
      expect(DAFTAR_KATEGORI.filter((d) => (d.sumber as string[]).includes(k)), k).toHaveLength(1);
    }
  });

  it("pemerintahan dan layanan publik digabung tanpa mengubah data sumber", () => {
    const k = kategoriTampil("layanan_publik");
    expect(k?.nama).toBe("Kantor dan Layanan Publik");
    expect(kategoriTampil("pemerintahan")).toBe(k);
    expect(namaKategori("layanan_publik")).toBe("Kantor dan Layanan Publik");
    expect(TEMPAT.some((p) => p.kategori === "layanan_publik")).toBe(true);
    expect(barisIndeks(TEMPAT.find((p) => p.kategori === "layanan_publik") as Place).k).toBe("pemerintahan");
  });

  it("slug bolak-balik, slug lama dialihkan", () => {
    expect(kategoriDariSlug(slugKategori("kesehatan"))?.kategori).toBe("kesehatan");
    expect(kategoriDariSlug("tidak-ada")).toBeUndefined();
    expect(kategoriDariSlug("layanan-publik")).toBeUndefined();
    expect(slugBaru("layanan-publik")).toBe("pemerintahan");
    expect(slugBaru("kesehatan")).toBeNull();
    expect(slugBaru("constructor")).toBeNull();
  });

  it("nama label menjadi judul mengikuti kaidah judul", () => {
    expect(kaidahJudul("Darurat dan Keamanan")).toBe("Darurat dan Keamanan");
    expect(kaidahJudul("Kantor dan Layanan Publik")).toBe("Kantor dan Layanan Publik");
    expect(kaidahJudul("Lain-lain")).toBe("Lain-Lain");
    expect(kaidahJudul("RS Tipe B")).toBe("RS Tipe B");
  });

  it("lede kategori memakai rumus 3.8 dan tidak menulis Batam dua kali", () => {
    const k = (kunci: string) => kategoriTampil(kunci) as NonNullable<ReturnType<typeof kategoriTampil>>;
    expect(ledeKategori(k("kesehatan"), 45)).toBe("Rumah sakit, puskesmas, dan donor darah di Batam. Ada 45 tempat.");
    expect(ledeKategori(k("khas_batam"), 3)).toBe("Hal yang hanya ada di Batam. Ada 3 tempat.");
  });

  it("jumlah per subkategori sama dengan jumlah kategori", () => {
    for (const k of DAFTAR_KATEGORI) {
      const total = subDiKategori(k.kategori).reduce((n, s) => n + s.jumlah, 0);
      expect(total).toBe(tempatDiKategori(k.kategori).length);
    }
  });

  it("label subkategori manusiawi", () => {
    expect(labelSub("rs_tipe_b")).toBe("RS Tipe B");
    expect(labelSub("hotel_non_bintang")).toBe("Hotel Nonbintang");
    expect(labelSub("mie-tarempa")).toBe("Mie Tarempa dan Luti Gendang");
    expect(labelSub("kantor_pos_cabang")).toBe("Kantor Pos Cabang");
    expect(labelSub("vihara")).toBe("Wihara");
    expect(labelSub(null)).toBe("Lainnya");
  });
});

describe("data sensitif tidak sampai ke warga", () => {
  it("atribut publik tidak pernah memuat rating, luas, atau SK PPAT", () => {
    const terlarang = /rating|reviews|luas|target_investasi|nomor_sk|npwpd|nop\b/i;
    for (const p of TEMPAT) {
      for (const a of atributPublik(p)) expect(a.label).not.toMatch(terlarang);
    }
  });

  it("kartu kampung tua dan kuliner tanpa atribut", () => {
    for (const p of TEMPAT.filter((x) => x.kategori === "kampung_tua" || x.kategori === "kuliner")) {
      expect(atributPublik(p)).toEqual([]);
    }
  });

  it("indeks browser tidak membawa atribut", () => {
    expect(Object.keys(barisIndeks(TEMPAT[0]))).not.toContain("atribut");
    expect(JSON.stringify(TEMPAT.map(barisIndeks))).not.toMatch(/"rating"|"reviews"/);
  });

  it("catatan kerja penyusun tersaring", () => {
    expect(catatanPublik(contoh({ kategori: "kesehatan", catatan: "Menurut laporan 06, cek." }))).toBeNull();
    expect(catatanPublik(contoh({ kategori: "kesehatan", catatan: "Jangan tampilkan DPO." }))).toBeNull();
    expect(catatanPublik(contoh({ kategori: "jasa", catatan: "Jam dari agregator." }))).toBeNull();
    expect(catatanPublik(contoh({ kategori: "kampung_tua", catatan: "Kampung lama." }))).toBeNull();
    expect(catatanPublik(contoh({ kategori: "kesehatan", catatan: "Pendaftaran tutup pukul 11." }))).toBe(
      "Pendaftaran tutup pukul 11.",
    );
  });

  it("situs palsu tidak pernah jadi tautan", () => {
    expect(tautanAman("https://damkarbatam.com/x")).toBe(false);
    expect(tautanAman("https://disdikkotabatam.org")).toBe(false);
    expect(tautanAman("https://batam.go.id")).toBe(true);
    expect(kontakPublik(contoh({ kontak: { website: "bpbd.damkarbatam.com" } }))).toEqual([]);
  });

  it("jam layanan tanpa emoji catatan", () => {
    expect(jamPublik({ jam_layanan: "05.30–23.30 (data 2018, ⚠️ perlu cek ulang)" })).toBe("05.30—23.30 WIB");
    expect(jamPublik({ jam_layanan: null })).toBeNull();
  });

  it("jam tampil dengan titik, tanda pisah, dan zona waktu", () => {
    expect(jamPublik({ jam_layanan: "08:00-14:00" })).toBe("08.00—14.00 WIB");
    expect(jamPublik({ jam_layanan: "Sen-Jum 08.30-17.00; Sab 08.30-15.30" })).toBe(
      "Senin—Jumat 08.30—17.00 WIB; Sabtu 08.30—15.30 WIB",
    );
    expect(jamPublik({ jam_layanan: "Senin–Jumat 08.00–16.30 WIB (antrean tutup 15.00)" })).toBe(
      "Senin—Jumat 08.00—16.30 WIB (antrean tutup 15.00 WIB)",
    );
    expect(jamPublik({ jam_layanan: "Selasa-Minggu 09.00-17.00; Senin & tanggal merah tutup" })).toBe(
      "Selasa—Minggu 09.00—17.00 WIB; Senin dan tanggal merah tutup",
    );
    expect(jamPublik({ jam_layanan: "24 jam" })).toBe("24 jam");
    expect(jamPublik({ jam_layanan: "Layanan darah 24/7" })).toBe("Layanan darah 24 jam");
  });

  it("jam dengan catatan sumber hanya menyisakan jamnya", () => {
    expect(jamPublik({ jam_layanan: "09.00-21.00 (situs Gramedia); sumber lain 10.00-22.00" })).toBe("09.00—21.00 WIB");
    expect(jamPublik({ jam_layanan: "06.00-18.00 (BP Batam) / 07.00-18.00 (media)" })).toBe("06.00—18.00 WIB");
    expect(jamPublik({ jam_layanan: "07.00-18.00 (Sisparnas); media 07.00-19.00" })).toBe("07.00—18.00 WIB");
    expect(jamPublik({ jam_layanan: "Tidak konsisten: 09.00-17.00 Senin-Jumat (cek ulang)" })).toBeNull();
  });

  it("alamat tanpa catatan penyusun, nama kantor tetap utuh", () => {
    expect(alamatPublik({ alamat: "Jl. Bunga Raya No. 3 (data 2009, cek ulang)" })).toBe("Jl. Bunga Raya No. 3");
    expect(alamatPublik({ alamat: "Jl. Ibnu Sutowo No. 1, Batam Centre (layanan daring: lms.bpbatam.go.id)" })).toBe(
      "Jl. Ibnu Sutowo No. 1, Batam Centre",
    );
    expect(alamatPublik({ alamat: "Kantor Hukum Mustari & Partners, Jl. Engku Puteri" })).toBe(
      "Kantor Hukum Mustari & Partners, Jl. Engku Puteri",
    );
    expect(alamatPublik({ alamat: "Mega Mall Batam Centre & Kepri Mall" })).toBe("Mega Mall Batam Centre dan Kepri Mall");
    expect(alamatPublik({ alamat: "Kavling Baru Sumber Jaya, Jl. Gereja" })).toBe("Kavling Baru Sumber Jaya, Jl. Gereja");
    expect(alamatPublik({ alamat: null })).toBeNull();
  });

  it("direktori tidak lagi menulis catatan tanggal cek", () => {
    expect(teksDicek({ atribut: {} })).toBe("");
    expect(teksDicek({ atribut: { last_verified: "2026-05-01" } })).toBe("Dicek 2026-05-01");
  });

  it("tanggal ISO menjadi tanggal Indonesia", () => {
    expect(tanggalIndonesia("2026-11-04")).toBe("4 November 2026");
    expect(tanggalIndonesia("Desember 2020")).toBe("Desember 2020");
  });

  it("uang dan ukuran tidak terbaca sebagai jam", () => {
    const nilai = (harga: string) => atributPublik(contoh({ kategori: "wisata", atribut: { harga } }))[0]?.nilai;
    expect(nilai("Rp10.000")).toBe("Rp10.000");
    expect(nilai("Rp5.000 dewasa, Rp2.500 anak")).toBe("Rp5.000 dewasa, Rp2.500 anak");
    expect(nilai("Rp250.000-320.000")).toBe("Rp250.000—Rp320.000");
    expect(nilai("Rp10.000 (registri Kemenbud); sumber lain gratis/Rp5.000")).toBe("Rp10.000");
    expect(nilai("Rp15.000 weekday / Rp25.000 weekend (Kompas); sumber lain Rp10.000")).toBe(
      "Rp15.000 hari kerja, Rp25.000 akhir pekan",
    );
    for (const p of TEMPAT) {
      for (const a of atributPublik(p)) expect(a.nilai, p.id).not.toMatch(/WIB\d/);
    }
  });

  // Sapuan ke seluruh data: places.json memuat banyak catatan penyusun, dan semua harus berhenti di fungsi *Publik.
  it("tidak ada catatan kerja, sumber, atau tautan pemerintah yang sampai ke pembaca", () => {
    const terlarang =
      /perlu (di)?cek|perlu_cek|cek ulang|belum dicek|\bcek\b|sumber|wikipedia|agregator|pihak ketiga|go\.id|https?:|\u26A0|laporan|\briset\b/i;
    for (const p of TEMPAT) {
      const teks = [
        jamPublik(p),
        alamatPublik(p),
        catatanPublik(p),
        lokasiTeks(p),
        labelSub(p.subkategori),
        ...labelTempat(p).map((l) => l.teks),
        ...atributPublik(p).flatMap((a) => [a.label, a.nilai]),
        ...kontakPublik(p).flatMap((k) => [k.label, k.teks]),
      ];
      for (const x of teks) {
        // "Sumber" dalam nama jalan (Kavling Baru Sumber Jaya) adalah alamat, bukan sebutan sumber.
        if (x && !/Sumber Jaya/.test(x)) expect(x, p.id).not.toMatch(terlarang);
      }
    }
  });

  it("tidak ada tanda dan atau kata tidak baku di label dan nilai atribut", () => {
    for (const p of TEMPAT) {
      // Kuliner memakai nama kategori pemilik, termasuk Mie dan Seafood (PEDOMAN, koreksi rombak butir 13).
      if (p.kategori !== "kuliner") expect(labelSub(p.subkategori), p.id).not.toMatch(/&|\bmie\b|\bcafe\b|seafood|vihara/i);
      for (const a of atributPublik(p)) expect(`${a.label} ${a.nilai}`, p.id).not.toMatch(/&|\bcafe\b|seafood|booking/i);
    }
  });
});

describe("kontak", () => {
  it("satu nomor jadi tautan, teks campuran tetap teks", () => {
    const [t, w] = kontakPublik(contoh({ kontak: { telepon: "(0778) 470303", whatsapp: "0811-700-2019" } }));
    expect(t.href).toBe("tel:0778470303");
    expect(w.href).toBe("https://wa.me/628117002019");
    const [c] = kontakPublik(contoh({ kontak: { whatsapp: "+62 811-7001-9960 (admin donor)" } }));
    expect(c.href).toBeNull();
  });

  it("email dan situs pemerintah tidak tampil", () => {
    const hasil = kontakPublik(contoh({ kontak: { email: "a@batam.go.id", website: "https://batam.go.id" } }));
    expect(hasil).toEqual([]);
  });

  it("ponsel di tempat makan disembunyikan, nomor kantor tetap tampil (8.3)", () => {
    expect(kontakPublik(contoh({ kategori: "kuliner", kontak: { telepon: "0812-1111-2222" } }))).toEqual([]);
    expect(kontakPublik(contoh({ kategori: "kuliner", kontak: { telepon: "(0778) 470303" } }))).toHaveLength(1);
    expect(kontakPublik(contoh({ kategori: "jasa", kontak: { telepon: "0812-1111-2222" } }))).toHaveLength(1);
  });
});

describe("baris dan kartu tempat", () => {
  it("baris status: IGD didahulukan, lalu jam, lalu kosong", () => {
    expect(statusBaris({ atribut: { igd_24jam: true }, jam_layanan: "08.00-14.00" })).toBe("IGD 24 Jam");
    expect(statusBaris({ atribut: {}, jam_layanan: "08.00-14.00" })).toBe("08.00—14.00 WIB");
    expect(statusBaris({ atribut: {}, jam_layanan: null })).toBeNull();
  });

  it("lokasi kosong tidak diganti teks pengganti", () => {
    expect(lokasiTeks({ kelurahan: null, kecamatan: null })).toBe("");
    expect(lokasiTeks({ kelurahan: "Sadai", kecamatan: "Bengkong" })).toBe("Sadai, Bengkong");
  });

  it("tempat yang hanya punya nama tidak mendapat halaman", () => {
    const hanyaNama = contoh({
      kategori: "ibadah",
      alamat: null,
      lat: null,
      lng: null,
      jam_layanan: null,
      catatan: null,
      status_koordinat: "perlu_diisi_user",
    });
    expect(punyaHalaman(hanyaNama)).toBe(false);
    expect(punyaHalaman({ ...hanyaNama, alamat: "Jl. Gereja" })).toBe(true);
    expect(punyaHalaman({ ...hanyaNama, kategori: "kampung_tua" })).toBe(true);
    // Atribut yang isinya catatan kerja tidak dihitung sebagai isi.
    expect(punyaHalaman({ ...hanyaNama, atribut: { akreditasi_bphn: "perlu cek" } })).toBe(false);
  });

  it("titik di peta: yang belum diisi dan di luar Batam tidak dihitung", () => {
    const d = contoh({ lat: 1, lng: 104, status_koordinat: "perlu_cek_ulang" });
    expect(punyaTitik(d)).toBe(true);
    expect(punyaTitik({ ...d, status_koordinat: "perlu_diisi_user" })).toBe(false);
    expect(punyaTitik({ ...d, atribut: { lokasi_luar_batam: true } })).toBe(false);
    expect(punyaTitik({ ...d, lat: null })).toBe(false);
  });

  it("petunjuk arah tidak memakai koordinat perkiraan", () => {
    const d = contoh({ nama: "Kantor A", kecamatan: "Bengkong", lat: 1, lng: 104, atribut: {} });
    expect(tautanArah({ ...d, status_koordinat: "terverifikasi" })).toContain("destination=1,104");
    expect(tautanArah({ ...d, status_koordinat: "perlu_cek_ulang" })).toContain("query=Kantor%20A%20Bengkong%20Batam");
    const g = "https://www.google.com/maps/search/?api=1&query=Ayam";
    expect(tautanArah({ ...d, atribut: { gmaps: g } })).toBe(g);
  });

  it("baris indeks membawa jam rapi dan jam mentah", () => {
    const b = barisIndeks(contoh({ jam_layanan: "08.00-14.00", atribut: { igd_24jam: true } }));
    expect(b.j).toBe("08.00-14.00");
    expect(b.jt).toBe("08.00—14.00 WIB");
    expect(b.i).toBe(true);
  });
});

describe("label tempat", () => {
  it("paling banyak satu label per tempat", () => {
    for (const p of TEMPAT) expect(labelTempat(p).length, p.id).toBeLessThanOrEqual(1);
  });

  it("catatan kerja tidak menjadi label", () => {
    const dasar = contoh({ subkategori: "taman", status_data: "perlu_cek_ulang" });
    for (const status_koordinat of ["perlu_diisi_user", "perlu_cek_ulang", "terverifikasi"] as const) {
      expect(labelTempat(contoh({ ...dasar, status_koordinat }))).toEqual([]);
    }
    expect(labelTempat({ ...dasar, status_data: "sumber_tunggal" })).toEqual([]);
    expect(labelTempat({ ...dasar, status_data: "usang" })).toEqual([]);
  });

  it("profesi tidak lagi berlabel Beta", () => {
    const p = TEMPAT.filter((x) => ["ppat", "notaris_ppat", "pejabat_lelang_kelas_ii"].includes(x.subkategori ?? ""));
    expect(p.length).toBeGreaterThan(0);
    for (const x of p) expect(labelTempat(x).map((l) => l.teks).join(" "), x.id).not.toMatch(/beta/i);
  });

  it("mode mural tetap bisa membaca lokasi perkiraan", () => {
    const dasar = contoh({ status_data: null, subkategori: "taman" });
    expect(lencana({ ...dasar, status_koordinat: "perlu_cek_ulang" }).map((l) => l.teks)).toEqual(["Lokasi perkiraan"]);
    expect(lencana({ ...dasar, status_koordinat: "terverifikasi" })).toEqual([]);
    expect(lencana({ ...dasar, status_koordinat: "perlu_diisi_user" })).toEqual([]);
  });

  it("Rempang Eco-City kartu minimal, tanpa label status", () => {
    const p = tempatPerId.get("kawasan-rempang-eco-city") as Place;
    expect(kartuMinimal(p)).toBe(true);
    expect(labelTempat(p)).toEqual([]);
    expect(atributPublik(p)).toEqual([]);
    expect(catatanPublik(p)).toBeNull();
  });

  it("Pasar Induk Jodoh berlabel rencana", () => {
    expect(labelTempat(tempatPerId.get("blj-pasar-induk-jodoh") as Place).map((l) => l.teks)).toEqual([
      "Rencana, belum beroperasi",
    ]);
  });
});

describe("pin peta", () => {
  const pins = daftarPin();

  it("tempat tanpa koordinat dan luar Batam tidak jadi pin", () => {
    const semua = new Set(pins.flatMap((p) => [p.id, ...p.lain.map((l) => l.id)]));
    for (const p of TEMPAT) {
      if (p.lat == null) expect(semua.has(p.id)).toBe(false);
    }
    for (const p of TEMPAT.filter((x) => x.atribut.lokasi_luar_batam === true)) {
      expect(semua.has(p.id)).toBe(false);
    }
  });

  it("satu titik satu pin", () => {
    const titik = pins.map((p) => `${p.lat},${p.lng}`);
    expect(new Set(titik).size).toBe(titik.length);
    const a = contoh({ id: "a", lat: 1.1, lng: 104, status_koordinat: "perlu_cek_ulang" });
    const b = contoh({ id: "b", lat: 1.1, lng: 104, status_koordinat: "perlu_cek_ulang" });
    const hasil = daftarPin([a, b]);
    expect(hasil).toHaveLength(1);
    expect(hasil[0].lain.map((l) => l.id)).toEqual(["b"]);
  });

  it("hanya yang terverifikasi tampil pasti", () => {
    for (const p of pins) {
      expect(p.perkiraan).toBe(tempatPerId.get(p.id)?.status_koordinat !== "terverifikasi");
    }
  });

  it("jenis di panel Tempat selalu punya ikon", () => {
    const ikon = new Set(JENIS_PETA.map((j) => j.id));
    for (const p of daftarPin()) {
      const j = jenisDari(p.k, p.s);
      if (j) expect(ikon).toContain(j);
    }
  });

  it("kategori non-tempat tidak tampil di panel Tempat", () => {
    expect(jenisDari("pemerintahan", "kantor_walikota")).toBeNull();
    expect(jenisDari("pemakaman", null)).toBeNull();
    expect(jenisDari("jasa", "bengkel")).toBeNull();
    expect(jenisDari("kuliner", "seafood")).toBe("seafood");
    expect(jenisDari("akomodasi", null)).toBe("hotel");
    expect(jenisDari("transportasi", "pelabuhan_internasional")).toBe("feri");
  });
});

describe("pin peta", () => {
  const pin = { id: "x", lat: 1, lng: 104, perkiraan: true } as PinPeta;

  it("GeoJSON memakai urutan lng, lat", () => {
    const fc = pinKeGeoJson([pin]);
    expect(fc.features[0].geometry).toEqual({ type: "Point", coordinates: [104, 1] });
    expect(fc.features[0].properties).toEqual({ id: "x", perkiraan: true });
  });
});

describe("rujukan panduan", () => {
  it("semua tempat_terkait dan tempat_id bisa ditemukan", () => {
    const ids = [
      ...panduan.kebutuhan.flatMap((k) => k.tempat_terkait),
      ...nasional.flatMap((n) => n.tempat_terkait),
      ...darurat.call_center.map((c) => c.tempat_id),
      ...darurat.pemadam_kebakaran.map((c) => c.tempat_id),
      ...darurat.polisi.map((c) => c.tempat_id),
    ];
    for (const id of ids) expect(cariTempat(id), id).toBeDefined();
  });

  it("delapan kebutuhan, lima langkah", () => {
    expect(panduan.kebutuhan).toHaveLength(8);
    expect(panduan.urutan_jual_beli_rumah.langkah).toHaveLength(5);
  });
});

describe("angka kelengkapan", () => {
  it("memakai angka resmi dan membawa sumbernya untuk Kolofon", () => {
    const masjid = kelengkapan("ibadah").find((a) => a.label === "masjid");
    expect(masjid?.nilai).toBe(972);
    expect(masjid?.sumber).toContain("Kemenag");
    expect(masjid?.terdata).toBeGreaterThan(0);
  });
});

describe("impor koordinat ke Makan", () => {
  const dasar = { id: "a", lat: 1, lng: 104, coord_approx: true };

  it("koordinat warga menimpa dan menghapus status perkiraan", () => {
    expect(terapkanKoordinat(dasar, { a: { lat: 1.5, lng: 104.5 } })).toEqual({
      id: "a",
      lat: 1.5,
      lng: 104.5,
      coord_approx: false,
    });
  });

  it("id lain tidak berubah", () => {
    expect(terapkanKoordinat(dasar, { b: { lat: 2, lng: 105 } })).toBe(dasar);
    expect(terapkanKoordinat({ ...dasar, id: "constructor" }, {}).lat).toBe(1);
  });

  it("data Makan tetap tanpa rating", () => {
    expect(JSON.stringify(tempatMakan[0])).not.toMatch(/"rating"|"reviews"/);
  });
});

describe("berteduh", () => {
  const b = (id: string, s: string, c: string, k = "kuliner") => ({ id, s, c, k }) as ReturnType<typeof barisIndeks>;

  it("hanya kopitiam dan kafe di kecamatan yang hujan, maksimal tiga", () => {
    const baris = [
      b("a", "kopitiam", "Lubuk Baja"),
      b("b", "cafe", "Lubuk Baja"),
      b("c", "bakso", "Lubuk Baja"),
      b("d", "kopitiam", "Nongsa"),
      b("e", "kopitiam", "Lubuk Baja", "wisata"),
      b("f", "kopitiam", "Lubuk Baja"),
      b("g", "cafe", "Lubuk Baja"),
    ];
    expect(pilihBerteduh(baris, ["LUBUK BAJA"]).map((x) => x.id)).toEqual(["a", "b", "f"]);
    expect(pilihBerteduh(baris, [])).toEqual([]);
  });
});

describe("catatan kurasi", () => {
  it("catatan penting tetap sampai ke warga tanpa kata kerja penyusun", () => {
    const p = tempatPerId.get("pub-possar") as Place;
    expect(catatanPublik(p)).toContain("Masih berstatus Pos SAR");
    expect(catatanPublik(p)).not.toMatch(/laporan|tabel/i);
  });

  it("nomor darurat sesuai pedoman 3.8", () => {
    const telepon = nasional.filter((n) => n.jenis === "telepon");
    expect(telepon.map((n) => [n.kontak, n.nama])).toEqual([
      ["112", "Panggilan darurat"],
      ["110", "Polisi"],
      ["113", "Pemadam kebakaran"],
      ["115", "SAR"],
      ["119", "Ambulans"],
    ]);
  });
});
