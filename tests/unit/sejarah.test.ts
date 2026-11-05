import { describe, expect, it } from "vitest";
import fakta from "@/data/budaya/fakta_infografis.json";
import perubahan from "@/data/sejarah/perubahan_fisik.json";
import tokoh from "@/data/tokoh/tokoh.json";
import arsip from "@/data/sejarah/sumber_arsip.json";
import mentah from "@/data/sejarah/garis_waktu.json";
import { ANGKA_RESMI, KELOMPOK_FAKTA, LINIMASA, LUAS_INVESTASI, SEMUA_FAKTA } from "@/features/sejarah/angka";
import {
  GARIS_WAKTU,
  HALAMAN_TOKOH,
  JUMLAH_MENTAH,
  metodePenduduk,
  PENDUDUK,
  tahunUrut,
  WISMAN,
} from "@/features/sejarah/data";
import { ARSIP, KARTU_DULU, RENTANG, TITIK_DULU } from "@/features/sejarah/dulu";
import { gayaDulu, titikKeGeoJson } from "@/features/sejarah/dulu-peta";
import { keadaanPada, perhentian } from "@/features/sejarah/dulu-slider";
import { ESAI } from "@/features/sejarah/esai";
import { jalurBatang, seriPenduduk, titikLepas } from "@/features/sejarah/hitung-grafik";
import { bacaanLanjutan, namaTempat, versiNama } from "@/features/sejarah/md";
import { rapiTeks } from "@/features/sejarah/rapi";
import { LABEL_STATUS } from "@/features/sejarah/Status";
import { cariTempat } from "@/features/direktori/data";

// Kata yang menandakan catatan penyusun lolos ke warga.
const CATATAN_PENYUSUN =
  /jangan (tampil|pakai|dipakai)|disalin|task_id|sajikan|perlu dicek|riset|di laporan|cocokkan ulang|seed|⚠|✅|❓|📜|⌛/i;

describe("garis waktu", () => {
  it("semua entri data tampil, tidak ada yang hilang saat diurutkan", () => {
    expect(JUMLAH_MENTAH).toBe(49);
    expect(GARIS_WAKTU).toHaveLength(49);
    expect(new Set(GARIS_WAKTU.map((e) => e.id))).toEqual(new Set(mentah.map((e) => e.id)));
  });

  it("urut kronologis", () => {
    const urut = GARIS_WAKTU.map((e) => tahunUrut(mentah.find((m) => m.id === e.id)!.tahun));
    expect(urut).toEqual([...urut].sort((a, b) => a - b));
  });

  it("setiap entri punya teks, status, dan kategori", () => {
    for (const e of GARIS_WAKTU) {
      expect(e.teks.length, e.id).toBeGreaterThan(0);
      expect(e.status, e.id).toBeTruthy();
      expect(e.kategori, e.id).toBeTruthy();
    }
  });

  it("catatan penyusun tersaring", () => {
    for (const e of GARIS_WAKTU) {
      expect(e.teks, e.id).not.toMatch(CATATAN_PENYUSUN);
      expect(e.teks, e.id).not.toContain(" — ");
    }
    expect(GARIS_WAKTU.find((e) => e.id === "gw-001")!.teks).not.toMatch(/zaman batu/i);
  });

  it("Rempang bertanggal dan beratribusi, tanpa luas lahan", () => {
    const r = GARIS_WAKTU.find((e) => e.id === "gw-t16")!;
    expect(r.tanggal).toBe("2023-08-28");
    expect(r.teks).toContain("28 Agustus 2023");
    expect(r.teks).toContain("BP Batam");
    expect(r.teks).toContain("Tempo");
    expect(r.teks).toContain("Terakhir diperbarui");
    expect(r.teks).not.toMatch(/8\.142|7\.572|17\.000|hektar|\bha\b/);
    expect(JSON.stringify(GARIS_WAKTU)).not.toContain("8.142");
  });

  it("Nong Isa wafat diturunkan ke beda versi", () => {
    const e = GARIS_WAKTU.find((x) => x.id === "gw-008")!;
    expect(e.status).toBe("perbedaan_versi");
    expect(e.teks).toContain("masih diperdebatkan");
  });

  it("tautan tokoh mengarah ke halaman yang ada", () => {
    const ada = new Set(tokoh.map((t) => t.id));
    for (const id of Object.values(HALAMAN_TOKOH)) expect(ada.has(id), id).toBe(true);
  });

  it("gw-t06 yang status datanya kosong tampil belum terverifikasi", () => {
    expect(GARIS_WAKTU.find((e) => e.id === "gw-t06")!.status).toBe("belum_terverifikasi");
  });

  it("satu label per butir, dari empat label pedoman", () => {
    expect(Object.values(LABEL_STATUS)).toEqual(["Tercatat", "Berbeda versi", "Belum terverifikasi", "Cerita rakyat"]);
    for (const e of GARIS_WAKTU) expect(Object.keys(LABEL_STATUS), e.id).toContain(e.status);
  });

  it("bentuk untuk browser tanpa tautan sumber", () => {
    expect(JSON.stringify(GARIS_WAKTU)).not.toMatch(/https?:|\.go\.id/);
    expect(JSON.stringify(KARTU_DULU)).not.toMatch(/https?:|\.go\.id/);
    expect(JSON.stringify(ARSIP)).not.toMatch(/https?:|\.go\.id/);
  });

  it("dua versi jumlah di kamp Jepang tampil berdampingan", () => {
    const e = GARIS_WAKTU.find((x) => x.id === "gw-012")!;
    expect(e.teks).toContain("112.708");
    expect(e.teks).toContain("68.000");
  });

  it("data mentah bebas emoji status", () => {
    expect(JSON.stringify(mentah)).not.toMatch(/✅|⚠|❓/);
    expect(JSON.stringify(perubahan)).not.toMatch(/✅|⚠|❓/);
  });

  it("teks data dirapikan: rentang, bulan, petik", () => {
    expect(rapiTeks("Okt 1945 – Juli 1946")).toBe("Oktober 1945—Juli 1946");
    expect(rapiTeks("Mar–Jul 1998")).toBe("Maret—Juli 1998");
    expect(rapiTeks("17–18 Jan 2026")).toBe("17—18 Januari 2026");
    expect(rapiTeks('menyebut "laksamana" Malaka')).toBe("menyebut “laksamana” Malaka");
    expect(rapiTeks("Jan van Riebeeck")).toBe("Jan van Riebeeck");
  });

  it("tahun urut dari teks bebas", () => {
    expect(tahunUrut("Abad ke-15–16")).toBe(1400);
    expect(tahunUrut("1970-an")).toBe(1970);
    expect(tahunUrut("Semester I 2026")).toBe(2026);
    expect(tahunUrut("awal Masehi")).toBe(0);
  });

  it("esai hanya merujuk entri yang ada, dan Rempang tanpa luas", () => {
    const ada = new Set(GARIS_WAKTU.map((e) => e.id));
    for (const l of ESAI) for (const id of l.rujukan) expect(ada.has(id), id).toBe(true);
    expect(JSON.stringify(ESAI)).not.toMatch(/8\.142|7\.572|17\.000/);
  });
});

describe("asal nama dan bacaan", () => {
  it("8 versi, semua berlabel", () => {
    const v = versiNama();
    expect(v).toHaveLength(8);
    for (const x of v) expect(Object.keys(LABEL_STATUS), x.versi).toContain(x.status);
    expect(v.filter((x) => x.status === "cerita_rakyat")).toHaveLength(5);
  });

  it("5 nama tempat dengan label", () => {
    const t = namaTempat();
    expect(t.map((x) => x.nama.split(" ")[0])).toEqual(["Nongsa", "Nagoya", "Hang", "Barelang", "Nama"]);
    expect(t[0].status).toBe("cerita_rakyat");
    expect(t[0].isi).not.toMatch(/[📜⚠]/u);
  });

  it("catatan penyusun di berkas md tidak ikut", () => {
    const semua = JSON.stringify([versiNama(), namaTempat(), bacaanLanjutan()]);
    expect(semua).not.toMatch(/Disalin|task_id|Sajikan|Celah/);
  });

  it("9 bacaan bertautan", () => {
    const b = bacaanLanjutan();
    expect(b).toHaveLength(9);
    for (const x of b) expect(x.url).toMatch(/^https:\/\//);
  });
});

describe("penduduk dan wisman", () => {
  it("semua titik punya metode", () => {
    expect(PENDUDUK).toHaveLength(11);
    expect(PENDUDUK.filter((p) => p.metode === "registrasi_disdukcapil").map((p) => p.jumlah)).toEqual([
      1037187, 1294548, 1394459,
    ]);
    expect(PENDUDUK.filter((p) => p.metode === "proyeksi_bps").map((p) => p.jumlah)).toEqual([1276930, 1296960]);
    expect(PENDUDUK.filter((p) => p.metode === "perkiraan_populer")).toHaveLength(4);
  });

  it("metode yang tidak dikenal menggagalkan build, bukan ditebak", () => {
    expect(() => metodePenduduk("entah")).toThrow();
  });

  it("garis tidak mencampur metode, dan semua titik tergambar", () => {
    const seri = seriPenduduk(PENDUDUK);
    for (const s of seri) expect(new Set(s.titik.map((t) => t.metode)).size).toBe(1);
    expect(seri.flatMap((s) => s.titik).length + titikLepas(PENDUDUK).length).toBe(PENDUDUK.length);
  });

  it("angka 1,79 juta tidak masuk data grafik", () => {
    expect(PENDUDUK.some((p) => p.jumlah > 1_500_000)).toBe(false);
  });

  it("wisman 2023 tampil sebagai rentang, bukan nol", () => {
    expect(WISMAN).toHaveLength(4);
    const w = WISMAN.find((x) => x.tahun === 2023)!;
    expect(w.jumlah).toBeNull();
    expect(w.rentang).toEqual([1_100_000, 1_190_000]);
  });

  it("jalur batang tidak rusak pada lebar kecil", () => {
    expect(jalurBatang(0, 0, 2, 20)).toBe("M0 0h2v20h-2z");
    expect(jalurBatang(0, 0, 100, 20)).toContain("a4 4");
  });
});

describe("Batam Dulu", () => {
  it("14 kartu dengan rentang", () => {
    expect(KARTU_DULU).toHaveLength(14);
    expect(Object.keys(RENTANG).sort()).toEqual(perubahan.map((p) => p.id).sort());
  });

  it("tahun slider berasal dari tahun_kunci, tidak dikarang", () => {
    for (const p of perubahan) {
      const r = RENTANG[p.id];
      for (const t of [r.mulai, r.selesai]) {
        const dekade = `${String(t).slice(0, 3)}0-an`;
        expect(p.tahun_kunci.includes(String(t)) || p.tahun_kunci.includes(dekade), `${p.id} ${t}`).toBe(true);
      }
      expect(r.mulai).toBeLessThanOrEqual(r.selesai);
    }
  });

  it("keadaan pada tahun tertentu", () => {
    const k = { mulai: 1992, selesai: 1998 };
    expect(keadaanPada(k, 1991)).toBe("sebelum");
    expect(keadaanPada(k, 1992)).toBe("dalam");
    expect(keadaanPada(k, 1998)).toBe("dalam");
    expect(keadaanPada(k, 1999)).toBe("sesudah");
  });

  it("perhentian slider unik, urut, dan berakhir di tahun kini", () => {
    const h = perhentian(KARTU_DULU, 2026);
    expect(h).toEqual([...new Set(h)].sort((a, b) => a - b));
    expect(h.at(-1)).toBe(2026);
    expect(h[0]).toBe(1847);
  });

  it("titik peta hanya yang berkoordinat di places.json", () => {
    for (const t of TITIK_DULU) {
      const p = cariTempat(t.id)!;
      expect(p.lat).toBe(t.lat);
      expect(p.lng).toBe(t.lng);
      expect(p.status_koordinat).not.toBe("perlu_diisi_user");
      expect(t.perkiraan).toBe(p.status_koordinat !== "terverifikasi");
    }
    expect(TITIK_DULU.map((t) => t.pf).sort()).toEqual(["pf-03", "pf-03", "pf-09", "pf-10", "pf-11"]);
    expect(TITIK_DULU.some((t) => t.id === "tugu-jepang-sembulang")).toBe(false);
  });

  it("gaya peta memuat titik tanpa mengubah lapisan dasar", () => {
    const dasar = { version: 8 as const, sources: {}, layers: [] };
    const gaya = gayaDulu(dasar, "light", TITIK_DULU, {}, null);
    expect(gaya.layers.map((l) => l.id)).toContain("dulu-klik");
    expect(titikKeGeoJson(TITIK_DULU, {}).features).toHaveLength(TITIK_DULU.length);
    expect(titikKeGeoJson(TITIK_DULU, { "pf-09": "dalam" }).features.filter((f) => f.properties?.aktif)).toHaveLength(
      1,
    );
  });

  it("11 arsip, semua status punya label, dan tidak ada berkas gambar yang dirujuk", () => {
    expect(ARSIP).toHaveLength(arsip.length);
    for (const a of ARSIP) expect(a.pakaiUlang, a.id).toBeTruthy();
    expect(JSON.stringify(ARSIP)).not.toMatch(/\.(jpg|jpeg|png|webp)/i);
  });
});

describe("Angka Batam", () => {
  it("semua fakta berangka tampil, masing-masing di satu kelompok", () => {
    expect(SEMUA_FAKTA).toHaveLength(fakta.angka.length);
    // Dua baris tanpa angka tidak tampil (pedoman prinsip 7).
    expect(KELOMPOK_FAKTA.flatMap((k) => k.baris.map((b) => b.id)).sort()).toEqual(
      fakta.angka
        .map((a) => a.id)
        .filter((id) => id !== "fi-023" && id !== "fi-024")
        .sort(),
    );
    expect(LINIMASA).toHaveLength(fakta.linimasa_sejarah.length);
  });

  it("catatan penyusun tersaring", () => {
    for (const b of SEMUA_FAKTA) {
      expect(`${b.indikator} ${b.angka} ${b.tahun} ${b.status} ${b.catatan ?? ""}`, b.id).not.toMatch(CATATAN_PENYUSUN);
    }
    for (const k of ANGKA_RESMI)
      for (const b of k.baris)
        expect(`${b.label} ${b.angka} ${b.catatan ?? ""}`, b.indikator).not.toMatch(CATATAN_PENYUSUN);
  });

  it("angka kosong tidak diisi nol", () => {
    for (const id of ["fi-023", "fi-024"]) {
      expect(SEMUA_FAKTA.find((b) => b.id === id)!.angka).toBe("Belum ada angka");
    }
  });

  it("status angka satu label atau kosong", () => {
    for (const b of SEMUA_FAKTA) {
      expect([null, "Tercatat", "Berbeda versi", "Belum terverifikasi"], b.id).toContain(b.status);
    }
    expect(SEMUA_FAKTA.find((x) => x.id === "fi-053")!.status).toBe("Berbeda versi");
    expect(SEMUA_FAKTA.find((x) => x.id === "fi-045")!.status).toBeNull();
    expect(JSON.stringify(fakta.angka)).not.toMatch(/✅|⚠|⌛/);
  });

  it("1,79 juta tampil berlabel berbeda versi dan dinyatakan tidak dipakai", () => {
    const b = SEMUA_FAKTA.find((x) => x.id === "fi-001")!;
    expect(b.status).toBe("Berbeda versi");
    expect(b.catatan).toContain("Tidak kami pakai");
  });

  it("kampung tua tidak menyebut Perda 2/2004", () => {
    const b = SEMUA_FAKTA.find((x) => x.id === "fi-065")!;
    expect(`${b.tahun} ${b.catatan}`).not.toContain("2/2004");
    expect(b.tahun).toContain("sejak 2019");
  });

  it("agama urut abjad, bukan peringkat", () => {
    const a = KELOMPOK_FAKTA.find((k) => k.topik === "agama")!.baris.map((b) => b.indikator);
    expect(a[0]).toBe("Buddha");
    expect(a).toEqual([...a].sort((x, y) => x.localeCompare(y, "id")));
  });

  it("indikator angka resmi yang dipilih ada di data, dan yang internal tidak ikut", () => {
    const semua = ANGKA_RESMI.flatMap((k) => k.baris.map((b) => b.indikator));
    expect(semua.length).toBeGreaterThan(20);
    for (const larang of [
      "kode_wilayah_kemendikdasmen_kota_batam",
      "ambang_kelengkapan_osm_school",
      "relasi_kota_batam",
      "usulan_tpu_baru_2023",
      "pasar_induk_jodoh",
    ])
      expect(semua).not.toContain(larang);
  });

  it("tidak ada data pajak hotel", () => {
    expect(JSON.stringify(ANGKA_RESMI)).not.toMatch(/pajak/i);
  });

  it("baris luas dan investasi bersumber", () => {
    for (const b of LUAS_INVESTASI) expect(b.sumber.length, b.indikator).toBeGreaterThan(0);
    expect(JSON.stringify(LUAS_INVESTASI)).not.toMatch(/Rempang/);
  });
});
