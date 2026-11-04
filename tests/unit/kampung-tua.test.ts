import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import raw from "@/data/kampung_tua/kampung_tua.json";
import legalitasRaw from "@/data/kampung_tua/kronologi_legalitas.json";
import jumlahRaw from "@/data/kampung_tua/sumber_jumlah.json";
import {
  daftarPenanda,
  ETIKA,
  idKartuKampung,
  JUMLAH,
  KALIMAT_REMPANG,
  KAMPUNG,
  kampungPerId,
  LEGALITAS,
  lencanaLokasi,
  lencanaStatus,
  TAUTAN_REMPANG,
  titikKampung,
} from "@/features/kampung-tua/data";
import { PROFIL, profilUntuk } from "@/features/kampung-tua/profil";
import { KRONOLOGI_REMPANG, TANPA_TANGGAL } from "@/features/kampung-tua/rempang";
import { tempatPerId } from "@/features/direktori/data";

// Luas, status sertifikat, dan istilah hak atas tanah. Dites sebagai teks yang sampai ke warga.
const LAHAN = /\d\s*ha\b|hektar|sertifikat|\bSHM\b|\bHPL\b|hak pengelolaan|hak milik|\bbidang\b|hutan lindung/i;
// Kata yang hanya boleh muncul sebagai ucapan pihak yang disebut, bukan narasi redaksi.
const NARASI_KERAS = /menggusur|merampas/i;
const CATATAN_PENYUSUN = /gunakan parafrase|\bseed\b|laporan menyebut|jangan tampilkan/i;

const teksKartu = (k: (typeof KAMPUNG)[number]) =>
  [k.nama, k.ringkasan, k.asal_usul_nama, k.suku_awal, k.masa_berdiri, k.cerita_rakyat, ...k.yang_bisa_dilihat].join(
    " ",
  );

describe("kartu kampung", () => {
  it("semua 56 entri tampil: 37 daratan, 16 Rempang-Galang, 3 situs", () => {
    expect(KAMPUNG).toHaveLength(raw.length);
    expect(KAMPUNG.filter((k) => k.lapisan === "daratan")).toHaveLength(37);
    expect(KAMPUNG.filter((k) => k.lapisan === "rempang")).toHaveLength(16);
    expect(KAMPUNG.filter((k) => k.lapisan === "hinterland")).toHaveLength(3);
  });

  it("semua entri tersambung ke places.json lewat id atau alias", () => {
    for (const k of KAMPUNG) expect(k.tempat, k.id).not.toBeNull();
    expect(kampungPerId.get("kt-tanjung-uma")?.tempat?.id).toBe("tanjung-uma");
  });

  it("tidak ada luas, status lahan, atau catatan penyusun di kartu", () => {
    for (const k of KAMPUNG) {
      expect(teksKartu(k), k.id).not.toMatch(LAHAN);
      expect(teksKartu(k), k.id).not.toMatch(CATATAN_PENYUSUN);
    }
  });

  it("istilah etnis lama diparafrasekan, juga di profil", () => {
    expect(kampungPerId.get("kt-panau")?.cerita_rakyat).not.toMatch(/keling/i);
    for (const p of PROFIL) for (const b of p.butir) expect(b.teks).not.toMatch(/keling/i);
  });

  it("relokasi tidak dibahas di kartu Tanjung Banon, ada di halaman Rempang", () => {
    const k = kampungPerId.get("rg-tanjung-banon");
    expect(k?.ringkasan).not.toMatch(/relokasi/i);
    expect(k?.sumber_url.join(" ")).not.toMatch(/relokasi/);
    expect(KRONOLOGI_REMPANG.some((b) => b.teks.includes("Tanjung Banon"))).toBe(true);
  });

  it("idKartuKampung hanya cocok untuk id atau alias yang sama", () => {
    expect(idKartuKampung({ id: "tanjung-uma", id_alias: ["kt-tanjung-uma"] })).toBe("kt-tanjung-uma");
    expect(idKartuKampung({ id: "kt-jabi", id_alias: [] })).toBe("kt-jabi");
    expect(idKartuKampung({ id: "kampung-tua-nongsa", id_alias: [] })).toBeNull();
    const nyata = tempatPerId.get("tanjung-uma");
    expect(nyata && idKartuKampung(nyata)).toBe("kt-tanjung-uma");
  });

  it("lencana status berkata-kata, tanpa garis bawah", () => {
    for (const k of KAMPUNG) {
      for (const l of lencanaStatus(k.status_verifikasi)) expect(l.teks, k.id).not.toContain("_");
    }
    expect(lencanaStatus("terverifikasi (sejarah); tahun wafat Nong Isa perlu_cek_ulang")).toEqual([
      { teks: "Terverifikasi (sejarah)", nada: "ok" },
      { teks: "Tahun wafat Nong Isa perlu dicek ulang", nada: "caution" },
    ]);
    const cerita = lencanaStatus("cerita_rakyat (asal-usul); lokasi terverifikasi");
    expect(cerita[0]).toMatchObject({ teks: "Cerita rakyat (asal-usul)", ceritaRakyat: true });
    expect(cerita[1].teks).toBe("Keberadaan kampung terverifikasi");
    expect(lencanaStatus("terverifikasi (situs); belum tentu tercatat sebagai 'kampung tua' resmi")[1].nada).toBe(
      "caution",
    );
  });
});

describe("penanda peta", () => {
  it("kampung tanpa koordinat tidak dirender, enam entri", () => {
    const tanpa = KAMPUNG.filter((k) => !titikKampung(k)).map((k) => k.id);
    expect(tanpa.sort()).toEqual([
      "kt-air-raja",
      "kt-seranggong",
      "rg-air-lingka",
      "rg-kampung-baru",
      "rg-sijantung",
      "rg-tanjung-pengapit",
    ]);
    expect(daftarPenanda()).toHaveLength(50);
    expect(lencanaLokasi(kampungPerId.get("kt-air-raja")!).teks).toBe("Lokasi belum diisi");
  });

  it("semua koordinat masih perkiraan dan tidak diaku terverifikasi", () => {
    for (const p of daftarPenanda()) expect(p.perkiraan, p.id).toBe(true);
    expect(lencanaLokasi(kampungPerId.get("kt-jabi")!).teks).toBe("Lokasi perkiraan");
  });

  it("titik memakai koordinat kanonik places.json, sama dengan peta beranda", () => {
    const uma = daftarPenanda().find((p) => p.id === "kt-tanjung-uma");
    const tempat = tempatPerId.get("tanjung-uma");
    expect([uma?.lat, uma?.lng]).toEqual([tempat?.lat, tempat?.lng]);
  });

  it("data untuk browser hanya kolom ringkas", () => {
    expect(Object.keys(daftarPenanda()[0]).sort()).toEqual(
      ["id", "lapisan", "lat", "lng", "lokasi", "nama", "perkiraan"].sort(),
    );
  });
});

describe("jumlah kampung tua", () => {
  it("sembilan baris tampil dengan atribusi per angka", () => {
    expect(JUMLAH).toHaveLength(jumlahRaw.length);
    expect(JUMLAH).toHaveLength(9);
    for (const b of JUMLAH) {
      expect(b.sumber.length, b.angka).toBeGreaterThan(0);
      expect(b.angka).not.toContain("*");
      expect(b.konteks).not.toMatch(/https?:|sumber sama|link di atas/);
      expect(b.tautan.length, b.angka).toBeGreaterThan(0);
    }
  });

  it("diktum soal Hak Pengelolaan tidak tampil", () => {
    for (const b of JUMLAH) expect(b.konteks, b.angka).not.toMatch(LAHAN);
  });

  it("konflik STPN dan Batam Pos ditandai", () => {
    expect(JUMLAH.filter((b) => b.konflik).map((b) => b.sumber)).toEqual(["Batam Pos (2025)"]);
  });
});

describe("kronologi legalitas", () => {
  it("dua puluh butir tampil dan urutannya tetap", () => {
    expect(LEGALITAS.map((b) => b.tanggal)).toEqual(legalitasRaw.map((b) => b.tanggal));
    expect(LEGALITAS).toHaveLength(20);
  });

  it("tidak ada luas atau status lahan, butirnya ditandai disaring", () => {
    for (const b of LEGALITAS) expect(b.peristiwa, b.tanggal).not.toMatch(LAHAN);
    expect(LEGALITAS.filter((b) => b.disaring).map((b) => b.tanggal)).toEqual([
      "1 Apr 2019",
      "Akhir 2019",
      "Nov 2020",
      "Jul 2026",
      "16 Okt 2026",
    ]);
  });

  it("Tanjung Uma dan angka sertifikat keluar dari butir Oktober 2026", () => {
    const b = LEGALITAS.find((x) => x.tanggal === "16 Okt 2026");
    expect(b?.peristiwa).not.toMatch(/1\.450|Tanjung Uma/);
    expect(b?.peristiwa).toContain("peraturan daerah khusus");
  });

  it("kolom siapa bilang selalu ada", () => {
    for (const b of LEGALITAS) expect(b.siapa.length, b.tanggal).toBeGreaterThan(0);
  });
});

describe("kronologi Rempang", () => {
  const semua = [...KRONOLOGI_REMPANG, ...TANPA_TANGGAL];

  it("tiap pihak utama punya suara", () => {
    for (const p of ["pemerintah", "ombudsman", "warga"]) {
      expect(semua.filter((b) => b.pihak === p).length, p).toBeGreaterThan(0);
    }
  });

  it("tiap butir bertanggal dan bersumber", () => {
    for (const b of semua) {
      expect(b.tanggal.length, b.teks).toBeGreaterThan(0);
      expect(b.sumber.length, b.teks).toBeGreaterThan(0);
    }
    for (const b of KRONOLOGI_REMPANG) expect(b.tanggal, b.teks).toMatch(/\d{4}/);
  });

  it("tanpa luas, status lahan, atau narasi redaksi yang keras", () => {
    for (const b of semua) {
      expect(b.teks, b.tanggal).not.toMatch(LAHAN);
      expect(b.teks, b.tanggal).not.toMatch(NARASI_KERAS);
      expect(b.teks, b.tanggal).not.toMatch(/2\.000|7\.572|17\.000/);
    }
  });

  it("kalimat kartu dipakai persis dan menaut ke dua pihak", () => {
    expect(KALIMAT_REMPANG).toBe(
      "Kampung-kampung di Pulau Rempang berada dalam kawasan yang direncanakan untuk Rempang Eco-City sejak 2023. Status dan pandangan para pihak masih berkembang; lihat sumber bertanggal.",
    );
    expect(TAUTAN_REMPANG.map((t) => t.label).join(" ")).toMatch(/Ombudsman.*BP Batam/);
  });
});

describe("profil panjang", () => {
  it("dua belas profil, semua menunjuk kampung yang ada", () => {
    expect(PROFIL).toHaveLength(12);
    for (const p of PROFIL) for (const id of p.kampung) expect(kampungPerId.has(id), id).toBe(true);
  });

  it("topik lahan dikeluarkan dari Tanjung Uma, Tanjung Riau, dan Teluk Mata Ikan", () => {
    for (const id of ["kt-tanjung-uma", "kt-tanjung-riau", "kt-teluk-mata-ikan"]) {
      for (const b of profilUntuk(id)?.butir ?? []) expect(b.teks, id).not.toMatch(/legalitas|sertifikat|\bSHM\b/i);
    }
    for (const p of PROFIL) for (const b of p.butir) expect(b.teks).not.toMatch(LAHAN);
  });

  it("alamat rumah pribadi tidak ikut", () => {
    for (const p of PROFIL) for (const b of p.butir) expect(b.teks).not.toMatch(/RT 0|RW 1/);
  });

  it("hikayat Sang Nila Utama disebut bukan bukti arkeologis", () => {
    const teks = profilUntuk("kt-tanjung-bemban")
      ?.butir.map((b) => b.teks)
      .join(" ");
    expect(teks).toContain("bukan bukti arkeologis");
  });
});

describe("etika", () => {
  it("enam butir sama dengan panduan_etika.md", () => {
    const md = readFileSync("data/kampung_tua/panduan_etika.md", "utf8");
    expect(ETIKA).toHaveLength(6);
    for (const e of ETIKA) expect(md, e).toContain(e);
  });
});
