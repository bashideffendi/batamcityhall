import { describe, expect, it } from "vitest";
import darurat from "@/data/darurat/nomor_darurat.json";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import panduan from "@/data/panduan/urusan_tanah.json";
import stats from "@/data/places_stats.json";
import { kelengkapan } from "@/features/direktori/angka";
import { pilihBerteduh } from "@/features/direktori/Berteduh";
import {
  atributPublik,
  barisIndeks,
  cariTempat,
  catatanPublik,
  DAFTAR_KATEGORI,
  daftarPin,
  kartuMinimal,
  kategoriDariSlug,
  kontakPublik,
  LABEL_BETA,
  labelSub,
  lencana,
  slugKategori,
  subDiKategori,
  tautanAman,
  teksDicek,
  TEMPAT,
  tempatDiKategori,
  tempatPerId,
  type Place,
} from "@/features/direktori/data";
import { places as tempatMakan, terapkanKoordinat } from "@/features/makan/lib/data";
import { gayaBeranda, GRUP_PIN, grupDari, pinKeGeoJson, type PinPeta } from "@/features/peta/lapisan";
import { baseStyle } from "@/features/peta/style";

const contoh = (lain: Partial<Place>): Place => ({ ...TEMPAT[0], atribut: {}, kontak: {}, ...lain });

describe("kategori direktori", () => {
  it("22 kategori tampil semua dan jumlahnya cocok dengan statistik", () => {
    expect(DAFTAR_KATEGORI).toHaveLength(22);
    for (const k of DAFTAR_KATEGORI) {
      expect(tempatDiKategori(k.kategori).length).toBe((stats.per_kategori as Record<string, number>)[k.kategori]);
    }
  });

  it("slug bolak-balik", () => {
    expect(kategoriDariSlug(slugKategori("layanan_publik"))?.kategori).toBe("layanan_publik");
    expect(kategoriDariSlug("tidak-ada")).toBeUndefined();
  });

  it("jumlah per subkategori sama dengan jumlah kategori", () => {
    for (const k of DAFTAR_KATEGORI) {
      const total = subDiKategori(k.kategori).reduce((n, s) => n + s.jumlah, 0);
      expect(total).toBe(tempatDiKategori(k.kategori).length);
    }
  });

  it("label subkategori manusiawi", () => {
    expect(labelSub("rs_tipe_b")).toBe("RS Tipe B");
    expect(labelSub("hotel_non_bintang")).toBe("Hotel non bintang");
    expect(labelSub("mie-tarempa")).toBe("Mie tarempa");
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

  it("tanggal dicek tidak dikarang", () => {
    expect(teksDicek({ atribut: {} })).toBe("Belum dicek ulang sejak riset Nov 2026");
    expect(teksDicek({ atribut: { last_verified: "2026-05-01" } })).toBe("Dicek 2026-05-01");
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
});

describe("lencana", () => {
  it("profesi selalu Beta", () => {
    const p = TEMPAT.filter((x) => ["ppat", "notaris_ppat", "pejabat_lelang_kelas_ii"].includes(x.subkategori ?? ""));
    expect(p.length).toBeGreaterThan(0);
    for (const x of p) expect(lencana(x).map((l) => l.teks)).toContain(LABEL_BETA);
  });

  it("ketidakpastian lokasi ditulis dengan kata", () => {
    const dasar = contoh({ status_data: null, subkategori: "taman" });
    expect(lencana({ ...dasar, status_koordinat: "perlu_diisi_user" }).map((l) => l.teks)).toEqual([
      "Lokasi belum diisi",
    ]);
    expect(lencana({ ...dasar, status_koordinat: "perlu_cek_ulang" }).map((l) => l.teks)).toEqual(["Lokasi perkiraan"]);
    expect(lencana({ ...dasar, status_koordinat: "terverifikasi" })).toEqual([]);
  });

  it("Rempang Eco-City kartu minimal, tanpa label status", () => {
    const p = tempatPerId.get("kawasan-rempang-eco-city") as Place;
    expect(kartuMinimal(p)).toBe(true);
    expect(lencana(p).map((l) => l.teks)).toEqual(["Lokasi belum diisi"]);
    expect(atributPublik(p)).toEqual([]);
    expect(catatanPublik(p)).toBeNull();
  });

  it("Pasar Induk Jodoh berlabel rencana", () => {
    expect(lencana(tempatPerId.get("blj-pasar-induk-jodoh") as Place).map((l) => l.teks)).toContain(
      "Rencana, belum beroperasi",
    );
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

  it("semua kategori punya grup legenda", () => {
    const semua = GRUP_PIN.flatMap((g) => g.kategori as readonly string[]);
    for (const k of DAFTAR_KATEGORI) expect(semua).toContain(k.kategori);
    expect(grupDari("kuliner")).toBe("kuliner");
  });
});

describe("gaya beranda", () => {
  const pin = { id: "x", lat: 1, lng: 104, perkiraan: true } as PinPeta;
  const base = baseStyle("day", "http://localhost");

  it("radar di bawah label, pin paling atas", () => {
    const g = gayaBeranda(base, { theme: "day", pins: [pin], radarTs: "202611051200" });
    const ids = g.layers.map((l) => l.id);
    const label = g.layers.findIndex((l) => l.type === "symbol" && !l.id.startsWith("lp-"));
    expect(ids.indexOf("lp-radar")).toBeLessThan(label);
    expect(ids.at(-1)).toBe("lp-pin-klik");
    expect(g.sources["lp-radar"]).toMatchObject({ type: "image" });
  });

  it("tanpa radar tidak ada sumber radar, peta dasar tetap utuh", () => {
    const g = gayaBeranda(base, { theme: "night", pins: [], radarTs: null });
    expect(g.sources["lp-radar"]).toBeUndefined();
    for (const l of base.layers) expect(g.layers.map((x) => x.id)).toContain(l.id);
  });

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
  it("memakai angka resmi dan menulis sumbernya", () => {
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
