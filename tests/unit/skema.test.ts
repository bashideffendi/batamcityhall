import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TERMINAL_LUAR_BATAM, TERMINAL_TANPA_TITIK, titikTerminalDiPeta } from "@/features/jalan/feri-data";
import { gayaJalan, LAYER_KLIK, titikKeGeoJson } from "@/features/jalan/peta-lapisan";
import { bacaRuteGeo, muatRuteGeo, RUTE_KOSONG } from "@/features/jalan/rute-geo";
import { halteDiPeta, JARINGAN, namaHalte, PETA } from "@/features/jalan/peta-bus/data";
import { HALTE_TAMBAHAN, JALUR, SIMPUL } from "@/features/jalan/peta-bus/jaringan";
import { LEBAR_KANVAS, TINGGI_KANVAS } from "@/features/jalan/peta-bus/siluet";
import { koridorPerRuas, polilinRuas, tabrakanLabel } from "@/features/jalan/peta-bus/susun";
import {
  arahStrip,
  HALTE,
  hitungGap,
  HUB_TANPA_TITIK,
  kelompokDariHalte,
  kontras,
  KORIDOR,
  koridorDariSlug,
  labelGap,
  lencanaKoridor,
  namaKelompok,
  pindahKoridor,
  POLA,
  polaKoridor,
  teksHeadway,
  teksJumlahHalte,
  titikTransDiPeta,
  transitKoridor,
  warnaMalam,
  type Halte,
} from "@/features/jalan/trans-data";
import type { StyleSpecification } from "maplibre-gl";

// Halte di data yang sengaja tidak masuk peta: daftar jadwal lama Moovit untuk K5 dan RSBP versi 2022.
const BUKAN_DI_PETA = new Set(["melchem-2", "tg-sengkuang", "lurah-sengkuang", "tvs-2", "sindo-2", "batu-ampar", "rsbp"]);

describe("peta bus", () => {
  it("semua ruas bersudut kelipatan 45 derajat dan tiap rantai tersambung", () => {
    for (const r of JARINGAN.ruas) expect(() => polilinRuas({ ...JARINGAN, kanvas: undefined }, r)).not.toThrow();
    expect(() => koridorPerRuas(JARINGAN)).not.toThrow();
  });

  it("sembilan koridor aktif digambar, K10 hanya sebagai rencana", () => {
    expect(PETA.garis.map((g) => g.id).sort()).toEqual(["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9"]);
    expect(PETA.rencana.map((r) => r.id)).toEqual(["K10"]);
  });

  it("semua halte di urutan data ada di peta, kecuali jadwal lama", () => {
    const diPeta = halteDiPeta();
    const hilang = new Set<string>();
    for (const p of POLA) {
      for (const h of p.halte) {
        if (h.jenis !== "halte") continue;
        const g = kelompokDariHalte(h.halte_id);
        if (!diPeta.has(g) && !BUKAN_DI_PETA.has(g)) hilang.add(g);
      }
    }
    expect([...hilang]).toEqual([]);
  });

  it("tiap halte di peta tercatat di data atau di daftar tambahan Peta Bus Batam", () => {
    const kelompok = new Set(HALTE.map((h) => h.kelompok));
    const asing = [...halteDiPeta()].filter((h) => !kelompok.has(h) && !(h in HALTE_TAMBAHAN));
    expect(asing).toEqual([]);
    // Tambahan tidak menggandakan halte yang sudah ada di data.
    expect(Object.keys(HALTE_TAMBAHAN).filter((h) => kelompok.has(h))).toEqual([]);
  });

  it("tidak ada nama halte yang bertumpuk", () => {
    expect(tabrakanLabel(PETA)).toEqual([]);
  });

  it("garis dan label tetap di dalam kanvas", () => {
    for (const [, [x0, y0, x1, y1]] of Object.entries(PETA.batas)) {
      expect(x0).toBeGreaterThanOrEqual(0);
      expect(y0).toBeGreaterThanOrEqual(0);
      expect(x1).toBeLessThanOrEqual(LEBAR_KANVAS);
      expect(y1).toBeLessThanOrEqual(TINGGI_KANVAS);
    }
    for (const l of PETA.label) {
      expect(l.kotak[0], l.id).toBeGreaterThanOrEqual(0);
      expect(l.kotak[2], l.id).toBeLessThanOrEqual(LEBAR_KANVAS);
    }
  });

  it("data November 2026 menang: K7 lewat bandara", () => {
    const k7 = JALUR.K7[0];
    expect(k7.indexOf("BDR")).toBe(k7.indexOf("SBD") + 1);
    expect(SIMPUL.BDR.halte).toBe("bandara-hang-nadim");
  });

  it("halte transit memuat semua koridor yang lewat simpulnya", () => {
    const bc = PETA.simpul.find((s) => s.id === "BC")!;
    expect(bc.koridor.sort()).toEqual(["K1", "K2", "K5", "K6", "K7"]);
    const kepri = PETA.simpul.find((s) => s.id === "KPR")!;
    expect(kepri.koridor.sort()).toEqual(["K2", "K6", "K8"]);
  });

  it("A dan B digabung menjadi satu nama", () => {
    expect(namaKelompok("raflesia")).toBe("Rafflesia");
    expect(namaKelompok("uib")).toBe("UIB");
    expect(namaKelompok("kepri-mall")).toBe("Kepri Mall");
    expect(namaKelompok("taman-sari")).toBe("Taman Sari");
    expect(namaKelompok("basecamp")).toBe("Base Camp");
    // Angka tanpa pasangan bukan penanda sisi.
    const botania = HALTE.find((h) => h.nama === "Botania 2")!;
    expect(namaKelompok(botania.kelompok)).toBe("Botania 2");
    expect(namaHalte("tiban-mas")).toBe("Tiban Mas");
  });
});

describe("warna koridor", () => {
  const malam = "#0F1B2A";
  const siang = "#F4EFE4";
  it("semua koridor aktif minimal 3:1 di kedua tema", () => {
    for (const k of KORIDOR.filter((x) => x.status === "aktif")) {
      expect(kontras(k.warna, siang), `${k.id} siang`).toBeGreaterThanOrEqual(3);
      expect(kontras(warnaMalam(k.warna), malam), `${k.id} malam`).toBeGreaterThanOrEqual(3);
    }
  });
  it("warna malam yang sudah cukup tidak diubah, K1 yang kurang dinaikkan", () => {
    expect(warnaMalam("#2E86A8")).toBe("#2E86A8");
    expect(warnaMalam("#2F4C7E")).not.toBe("#2F4C7E");
  });
});

describe("strip map per arah", () => {
  it("13 pola dan tab per arah", () => {
    expect(POLA).toHaveLength(13);
    expect(polaKoridor("K1")).toHaveLength(2);
    expect(polaKoridor("K5")).toHaveLength(3);
    expect(polaKoridor("K10")).toHaveLength(0);
  });

  it("gap tetap ada sebagai baris sendiri: 10 gap di 8 pola", () => {
    const semua = POLA.map(arahStrip);
    const gap = semua.flatMap((a) => a.baris.filter((b) => b.jenis === "gap"));
    expect(gap).toHaveLength(10);
    expect(semua.filter((a) => a.baris.some((b) => b.jenis === "gap"))).toHaveLength(8);
  });

  it("label angka hanya bila bisa dihitung", () => {
    const pola = (id: string) => POLA.find((p) => p.id === id)!;
    expect(hitungGap(pola("K8_ke_jodoh"))).toBe(70);
    expect(hitungGap(pola("K9_pergi"))).toBe(41);
    expect(hitungGap(pola("K3_pergi"))).toBe(40);
    // Dua gap: tidak bisa dibagi. Tanpa total: tidak bisa dihitung. Total bertentangan: tidak bisa dihitung.
    expect(hitungGap(pola("K2_ke_tanjung_uncang"))).toBeNull();
    expect(hitungGap(pola("K1_balik"))).toBeNull();
    expect(hitungGap(pola("K5_ke_batam_center_moovit_ujung"))).toBeNull();
    expect(labelGap(null)).toBe("halte tidak tercantum di sumber");
    expect(labelGap(70)).toBe("±70 halte tidak tercantum di sumber");
  });

  it("tidak ada nomor urut, dan semua halte tanpa koordinat berlabel lokasi belum diisi", () => {
    const k1 = arahStrip(POLA.find((p) => p.id === "K1_pergi")!);
    expect(JSON.stringify(k1)).not.toMatch(/urut/);
    const halte = k1.baris.filter((b) => b.jenis === "halte");
    expect(halte[0]).toMatchObject({ nama: "Transferpoint Sekupang", lokasi: "perkiraan", ujung: true });
    expect(halte[1]).toMatchObject({ nama: "Taman Palapa", lokasi: "belum", ujung: false });
    expect(k1.tercantum).toBe("31 dari 56 halte tercantum di sumber.");
  });

  it("catatan arah tanpa instruksi penyusun", () => {
    const teks = JSON.stringify(POLA.map(arahStrip));
    expect(teks).not.toMatch(/wajib|patterns|\*\*|perlu_cek/);
  });
});

describe("teks koridor", () => {
  it("tiga bentuk jumlah halte", () => {
    const k = (id: string) => koridorDariSlug(id)!;
    expect(teksJumlahHalte(k("k1"))).toEqual({ teks: "56 halte menurut sumber", perluCek: false });
    expect(teksJumlahHalte(k("k5"))).toEqual({ teks: "41 atau 65 halte, sumber berbeda", perluCek: true });
    expect(teksJumlahHalte(k("k7"))?.teks).toBe("76 halte, sebelum rute bandara");
    expect(teksJumlahHalte(k("k10"))).toBeNull();
  });

  it("dua bentuk headway", () => {
    const k = (id: string) => koridorDariSlug(id)!;
    expect(teksHeadway(k("k7")).teks).toContain("pagi sibuk 20 menit");
    expect(teksHeadway(k("k1"))).toEqual({ teks: "±20–35 menit menurut jadwal Moovit lama", perluCek: true });
    expect(teksHeadway(k("k5")).perluCek).toBe(true);
    expect(teksHeadway(k("k2")).teks).toBe("belum diketahui");
    expect(teksHeadway(k("k9")).teks).toContain("jarang");
  });

  it("K10 berlabel rencana", () => {
    expect(lencanaKoridor(koridorDariSlug("k10")!)[0].teks).toBe("rencana, belum beroperasi");
    expect(koridorDariSlug("k99")).toBeUndefined();
  });

  it("transit dan perpindahan dari data, tanpa istilah teknis", () => {
    expect(JSON.stringify(transitKoridor("K1"))).not.toMatch(/line-offset/);
    expect(pindahKoridor("K8").map((p) => p.koridor)).toContain("K9");
    expect(pindahKoridor("K1").find((p) => p.koridor === "K5")?.halte).toContain("Bundaran Madani");
    // Tidak pernah menawarkan pindah ke koridor rencana.
    expect(pindahKoridor("K4").map((p) => p.koridor)).not.toContain("K10");
  });
});

describe("titik di peta", () => {
  it("hanya hub berongga, landmark lain tidak dirender, tp-jodoh tanpa koordinat hanya di daftar", () => {
    const titik = titikTransDiPeta();
    expect(titik.map((t) => t.id).sort()).toEqual(["tp-batam-center", "tp-punggur", "tp-sekupang"]);
    expect(titik.every((t) => t.perkiraan && t.jenis === "hub")).toBe(true);
    expect(JSON.stringify(titik)).not.toMatch(/1\.1175|konflik/);
    expect(HUB_TANPA_TITIK.map((h) => h.id)).toEqual(["tp-jodoh"]);
  });

  it("halte tampil otomatis setelah koordinatnya terverifikasi, tetap tidak bila null", () => {
    const contoh = (h: Partial<Halte>): Halte => ({
      id: "contoh",
      nama: "Contoh A",
      kelompok: "contoh",
      koridor: ["K1"],
      kecamatan: null,
      lat: 1.1,
      lng: 104,
      status_koordinat: "terverifikasi",
      ...h,
    });
    expect(titikTransDiPeta([contoh({})])[0]).toMatchObject({ jenis: "halte", perkiraan: false });
    expect(titikTransDiPeta([contoh({ status_koordinat: "perlu_cek_ulang" })])).toHaveLength(0);
    expect(titikTransDiPeta([contoh({ lat: null, lng: null })])).toHaveLength(0);
  });

  it("terminal dari places.json: status mengikuti data, luar Batam tidak jadi pin", () => {
    const t = titikTerminalDiPeta();
    const per = Object.fromEntries(t.map((x) => [x.id, x]));
    expect(per.btc).toMatchObject({ perkiraan: false, lat: 1.13086 });
    expect(per.nsp).toMatchObject({ perkiraan: false, lat: 1.18838 });
    expect(per.skp).toMatchObject({ perkiraan: true, lat: 1.122 });
    expect(per.wfc.perkiraan).toBe(true);
    for (const id of ["sg-scc", "sg-tmft", "my-stl", "gcb", "pr-skp"]) expect(per[id], id).toBeUndefined();
    expect(TERMINAL_LUAR_BATAM.map((x) => x.id)).toEqual(["sg-scc", "sg-tmft", "my-stl"]);
    expect(TERMINAL_TANPA_TITIK.map((x) => x.id)).toContain("gcb");
  });

  it("GeoJSON memakai urutan lng,lat", () => {
    const f = titikKeGeoJson(titikTransDiPeta()).features[0];
    expect(f.geometry).toEqual({ type: "Point", coordinates: [104.055225, 1.130856] });
  });
});

describe("routes.geojson", () => {
  const fitur = (
    over: Record<string, unknown> = {},
    coords = [
      [104, 1.1],
      [104.01, 1.11],
    ],
  ) => ({
    type: "Feature",
    geometry: { type: "LineString", coordinates: coords },
    properties: { koridor: "K1", arah: "pergi", warna: "#2F4C7E", offset: 3, sumber_geometri: "map-matching", ...over },
  });
  const teks = (...f: unknown[]) => JSON.stringify({ type: "FeatureCollection", features: f });

  it("berkas sekarang hanya berisi garis OSM Koridor 1", async () => {
    const isi = readFileSync(join(process.cwd(), "data/trans_batam/routes.geojson"), "utf8");
    const fitur = JSON.parse(isi).features as { properties: { koridor: string; sumber_geometri: string } }[];
    expect(fitur.length).toBeGreaterThan(0);
    expect(new Set(fitur.map((f) => f.properties.koridor))).toEqual(new Set(["K1"]));
    expect(fitur.every((f) => f.properties.sumber_geometri === "osm")).toBe(true);
    expect((await muatRuteGeo()).features).toHaveLength(fitur.length);
  });

  it("menerima hasil map-matching, menolak perkiraan, titik di luar area, dan berkas rusak", () => {
    expect(bacaRuteGeo(teks(fitur())).features).toHaveLength(1);
    expect(bacaRuteGeo(teks(fitur({ sumber_geometri: "perkiraan" }))).features).toHaveLength(0);
    expect(bacaRuteGeo(teks(fitur({}, [[104, 1.1]]))).features).toHaveLength(0);
    expect(
      bacaRuteGeo(
        teks(
          fitur({}, [
            [1.1, 104],
            [1.2, 104],
          ]),
        ),
      ).features,
    ).toHaveLength(0);
    expect(bacaRuteGeo("bukan json")).toEqual(RUTE_KOSONG);
    expect(bacaRuteGeo("{}")).toEqual(RUTE_KOSONG);
  });

  const base = { version: 8, sources: {}, layers: [] } as StyleSpecification;
  it("tanpa data tidak ada lapisan garis, dengan data memakai line-offset", () => {
    const titik = titikTransDiPeta();
    const kosong = gayaJalan(base, { theme: "light", titik, rute: RUTE_KOSONG });
    expect(kosong.layers.some((l) => l.type === "line")).toBe(false);
    expect(kosong.layers.map((l) => l.id)).toContain(LAYER_KLIK);

    const ada = gayaJalan(base, { theme: "dark", titik, rute: bacaRuteGeo(teks(fitur())) });
    const garis = ada.layers.find((l) => l.id === "jl-rute-garis");
    expect(garis?.type).toBe("line");
    expect(JSON.stringify(garis)).toContain("line-offset");
  });

  it("penanda memakai ikon gaya A, lokasi perkiraan diberi garis putus-putus", () => {
    const fc = titikKeGeoJson(titikTransDiPeta());
    const ikon = fc.features.map((f) => String(f.properties?.ikon));
    expect(ikon.every((i) => i.startsWith("mk~"))).toBe(true);
    for (const f of fc.features) expect(String(f.properties?.ikon).endsWith("~p")).toBe(f.properties?.perkiraan === true);
    const g = gayaJalan(base, { theme: "light", titik: titikTransDiPeta(), rute: RUTE_KOSONG });
    expect(g.layers.find((l) => l.id === "jl-titik-ikon")?.type).toBe("symbol");
  });
});
