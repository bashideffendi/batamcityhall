import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TERMINAL_LUAR_BATAM, TERMINAL_TANPA_TITIK, titikTerminalDiPeta } from "@/features/jalan/feri-data";
import { gayaJalan, LAYER_KLIK, titikKeGeoJson } from "@/features/jalan/peta-lapisan";
import { bacaRuteGeo, muatRuteGeo, RUTE_KOSONG } from "@/features/jalan/rute-geo";
import { pasanganDiPola, RANTAI, SIMPUL, susunDiagram, type Diagram, type SumberSkema } from "@/features/jalan/skema";
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

const POLA_GAP: Record<string, string> = { K3: "K3_pergi", K8: "K8_ke_jodoh", K9: "K9_pergi" };
const SUMBER: SumberSkema = {
  koridor: KORIDOR.map((k) => ({ id: k.id, status: k.status, jumlah_halte_sumber: k.jumlah_halte_sumber })),
  pola: POLA,
  kelompokDari: kelompokDariHalte,
  namaDari: namaKelompok,
  labelGapDari: (id) => {
    const p = POLA.find((x) => x.id === POLA_GAP[id]);
    return p ? labelGap(hitungGap(p)) : null;
  },
};

const LEBAR = susunDiagram(SUMBER, { orientasi: "lebar" });
const HP = susunDiagram(SUMBER, { orientasi: "hp" });

function semuaRuas(d: Diagram) {
  const ruas: { a: [number, number]; b: [number, number]; asal: string }[] = [];
  for (const g of d.garis) {
    for (const s of g.segmen) {
      for (let i = 0; i < s.titik.length - 1; i++) ruas.push({ a: s.titik[i], b: s.titik[i + 1], asal: g.id });
    }
    if (g.stub) ruas.push({ a: g.stub[0], b: g.stub[1], asal: `${g.id} stub` });
  }
  for (const f of d.feri) {
    for (let i = 0; i < f.titik.length - 1; i++) ruas.push({ a: f.titik[i], b: f.titik[i + 1], asal: "feri" });
  }
  ruas.push({ a: d.rencana.titik[0], b: d.rencana.titik[1], asal: "K10" });
  return ruas;
}

describe("diagram skematik", () => {
  for (const d of [LEBAR, HP]) {
    it(`${d.orientasi}: semua ruas bersudut kelipatan 45 derajat`, () => {
      for (const { a, b, asal } of semuaRuas(d)) {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        if (Math.hypot(dx, dy) < 0.05) continue;
        const sudut = (Math.atan2(dy, dx) * 180) / Math.PI;
        const sisa = Math.abs(((sudut % 45) + 45) % 45);
        expect(Math.min(sisa, 45 - sisa), `${asal} ${a} ${b}`).toBeLessThan(1.5);
      }
    });

    it(`${d.orientasi}: titik tetap di dalam kanvas`, () => {
      for (const { a, b, asal } of semuaRuas(d)) {
        for (const [x, y] of [a, b]) {
          expect(x, asal).toBeGreaterThanOrEqual(0);
          expect(x, asal).toBeLessThanOrEqual(d.lebar);
          expect(y, asal).toBeGreaterThanOrEqual(0);
          expect(y, asal).toBeLessThanOrEqual(d.tinggi);
        }
      }
    });
  }

  it("sembilan koridor aktif digambar, K10 hanya sebagai rencana", () => {
    expect(LEBAR.garis.map((g) => g.id).sort()).toEqual(["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9"]);
    expect(LEBAR.rencana.labelUjung.teks).toContain("rencana");
  });

  it("urutan simpul tiap koridor cocok dengan pola di data", () => {
    for (const [k, rantai] of Object.entries(RANTAI)) {
      for (let i = 0; i < rantai.length - 1; i++) {
        const info = pasanganDiPola(POLA, kelompokDariHalte, k, rantai[i], rantai[i + 1]);
        expect(info, `${k}: ${rantai[i]} ke ${rantai[i + 1]}`).not.toBeNull();
      }
      // Urutan monoton: tiga simpul berturut-turut tidak boleh berbalik arah di pola yang sama.
      for (const p of polaKoridor(k)) {
        const urut = p.halte.flatMap((h) => (h.jenis === "halte" ? [kelompokDariHalte(h.halte_id)] : []));
        const posisi = rantai.map((s) => urut.indexOf(s)).filter((x) => x !== -1);
        if (posisi.length < 3) continue;
        const naik = posisi.every((x, i) => i === 0 || x > posisi[i - 1]);
        const turun = posisi.every((x, i) => i === 0 || x < posisi[i - 1]);
        const umum = new Set(["K1_balik", "K3_balik", "K5_ke_jodoh_moovit"]);
        if (!umum.has(p.id)) expect(naik || turun, `${k} ${p.id} ${posisi}`).toBe(true);
      }
    }
  });

  it("simpul di rantai memang dilayani koridor itu menurut data", () => {
    const koridorKelompok = new Map<string, Set<string>>();
    for (const h of HALTE) {
      const s = koridorKelompok.get(h.kelompok) ?? new Set<string>();
      h.koridor.forEach((k) => s.add(k));
      koridorKelompok.set(h.kelompok, s);
    }
    for (const [k, rantai] of Object.entries(RANTAI)) {
      for (const s of rantai) expect(koridorKelompok.get(s)?.has(k), `${k} ${s}`).toBe(true);
    }
    for (const s of Object.keys(SIMPUL)) expect(koridorKelompok.has(s), s).toBe(true);
  });

  it("gap menjadi garis putus, ruas utuh tidak", () => {
    const putus = (k: string) => LEBAR.garis.find((g) => g.id === k)!.segmen.filter((s) => s.putus).length;
    expect(putus("K1")).toBe(0);
    expect(putus("K4")).toBe(0);
    expect(putus("K6")).toBe(0);
    expect(putus("K7")).toBe(0);
    expect(putus("K2")).toBe(2);
    expect(putus("K3")).toBe(1);
    expect(putus("K8")).toBe(1);
    // Pasangan yang punya gap di pola tidak boleh tersambung garis penuh.
    expect(pasanganDiPola(POLA, kelompokDariHalte, "K8", "kabil-raya", "pasar-angkasa")?.adaGap).toBe(true);
    expect(pasanganDiPola(POLA, kelompokDariHalte, "K2", "panbil", "simpang-tembesi")?.adaGap).toBe(true);
    expect(pasanganDiPola(POLA, kelompokDariHalte, "K2", "basecamp", "hidayatullah")?.adaGap).toBe(true);
    expect(pasanganDiPola(POLA, kelompokDariHalte, "K3", "nagoya-hill", "tp-jodoh")?.adaGap).toBe(true);
    expect(pasanganDiPola(POLA, kelompokDariHalte, "K1", "kartini", "uib")?.adaGap).toBe(false);
  });

  it("K9 berakhir dengan garis putus pendek yang tidak tersambung", () => {
    const k9 = LEBAR.garis.find((g) => g.id === "K9")!;
    expect(k9.stub).not.toBeNull();
    expect(k9.labelGap?.teks.join(" ")).toBe("±41 halte tidak tercantum di sumber");
    expect(LEBAR.garis.find((g) => g.id === "K8")?.labelGap?.teks.join(" ")).toBe(
      "±70 halte tidak tercantum di sumber",
    );
  });

  it("ruas berimpit digambar sejajar, bukan ditumpuk", () => {
    const y = (k: string, x: number) => {
      const g = LEBAR.garis.find((a) => a.id === k)!;
      for (const s of g.segmen) {
        for (let i = 0; i < s.titik.length - 1; i++) {
          const [a, b] = [s.titik[i], s.titik[i + 1]];
          if (a[1] === b[1] && Math.min(a[0], b[0]) <= x && Math.max(a[0], b[0]) >= x) return a[1];
        }
      }
      return null;
    };
    // Kartini ke UIB: K1 dan K3. Bundaran Madani ke Ikan Daun: K1 dan K5.
    const xKartiniUib = 86 + 8 * 28;
    expect(y("K1", xKartiniUib)).not.toBeNull();
    expect(y("K1", xKartiniUib)).not.toBe(y("K3", xKartiniUib));
    const xPusat = 86 + 19 * 28;
    expect(y("K1", xPusat)).not.toBe(y("K5", xPusat));
    // Jaraknya sama dengan jarak paralel.
    expect(Math.abs(y("K1", xKartiniUib)! - y("K3", xKartiniUib)!)).toBeCloseTo(LEBAR.jarakParalel, 1);
  });

  it("halte transfer memuat semua koridor yang berhenti di sana", () => {
    const koridor = (id: string) => LEBAR.simpul.find((s) => s.id === id)?.koridor.sort();
    expect(koridor("tp-batam-center")).toEqual(["K1", "K2", "K5", "K6", "K7"]);
    expect(koridor("tp-sekupang")).toEqual(["K1", "K3", "K4"]);
    expect(koridor("tp-jodoh")).toEqual(["K3", "K5", "K8"]);
    expect(koridor("tp-punggur")).toEqual(["K8", "K9"]);
    expect(koridor("kampung-mangga")).toEqual(["K7", "K9"]);
    expect(koridor("hidayatullah")).toEqual(["K2", "K4"]);
    expect(LEBAR.simpul.find((s) => s.id === "tp-batam-center")?.transfer).toBe(true);
    expect(LEBAR.simpul.find((s) => s.id === "uniba")?.transfer).toBe(false);
    // K2 lewat Mega Mall tanpa berhenti.
    expect(koridor("mega-mall")).toEqual(["K1", "K5"]);
  });

  it("tick seragam mengikuti jumlah halte tercantum", () => {
    const k7 = LEBAR.garis.find((g) => g.id === "K7")!;
    const antara = RANTAI.K7.slice(0, -1).reduce((n, s, i) => {
      const info = pasanganDiPola(POLA, kelompokDariHalte, "K7", s, RANTAI.K7[i + 1]);
      return n + (info?.antara ?? 0);
    }, 0);
    expect(k7.tick).toHaveLength(antara);
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
    const kosong = gayaJalan(base, { theme: "day", titik, rute: RUTE_KOSONG });
    expect(kosong.layers.some((l) => l.type === "line")).toBe(false);
    expect(kosong.layers.map((l) => l.id)).toContain(LAYER_KLIK);

    const ada = gayaJalan(base, { theme: "night", titik, rute: bacaRuteGeo(teks(fitur())) });
    const garis = ada.layers.find((l) => l.id === "jl-rute-garis");
    expect(garis?.type).toBe("line");
    expect(JSON.stringify(garis)).toContain("line-offset");
  });

  it("hub bergaya berongga", () => {
    const g = gayaJalan(base, { theme: "day", titik: titikTransDiPeta(), rute: RUTE_KOSONG });
    const hub = g.layers.find((l) => l.id === "jl-hub-kira") as { paint: Record<string, unknown> };
    expect(hub.paint["circle-color"]).toBe("rgba(0,0,0,0)");
    expect(hub.paint["circle-stroke-width"]).toBeGreaterThan(0);
  });
});
