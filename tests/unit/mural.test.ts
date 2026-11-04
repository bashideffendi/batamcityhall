import { readFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import gcpBerkas from "@/data/mural/harbourbay-nagoya-jodoh.gcps.json";
import landmarks from "@/data/mural/landmarks.json";
import segmen from "@/data/mural/segmen.json";
import { JADWAL_MURAL, KARTU, PERHENTIAN, QUEST_AKTIF, RUTE_TAK_DIGAMBAR, SEGMEN_AKTIF } from "@/features/mural/data";
import { cahayaBatam, jamWib } from "@/features/mural/lib/cahaya";
import {
  awalHariLokal,
  berikutnya,
  berlakuPadaHari,
  instanJam,
  lompatMenit,
  perjalananAktif,
  posisiKapal,
  type BarisJadwal,
} from "@/features/mural/lib/feri";
import {
  berkasGcp,
  buatTransformer,
  galatTinggalkanSatu,
  keGeo,
  kePiksel,
  uraiBerkasGcp,
  type Gcp,
} from "@/features/mural/lib/gcp";
import { cariHotspot, dalamPoligon, luasPoligon, sepanjangGaris, type Titik } from "@/features/mural/lib/geom";
import { BATAS_PARTIKEL_HP, jumlahPartikel, keadaanHujan, teksHujan } from "@/features/mural/lib/hujan";
import { keadaanOmbak, parameterOmbak, teksOmbak } from "@/features/mural/lib/ombak";
import {
  bacaProgres,
  bolehJadiQuest,
  hitungTemuan,
  KUNCI_PROGRES,
  tandaiTemuan,
  teksProgres,
  tulisProgres,
} from "@/features/mural/lib/quest";
import type { FramesResponse, PerairanResponse } from "@/features/langit-laut/lib/api-types";

const META = JSON.parse(readFileSync(join(process.cwd(), "public/mural", SEGMEN_AKTIF, "meta.json"), "utf8")) as {
  lebar: number;
  tinggi: number;
  bingkai: { barat: number; timur: number; utara: number; selatan: number };
  kecamatan: { nama: string; cincin: Titik[][] }[];
  rute: { id: string; titik: Titik[] }[];
  titik: { id: string; x: number; y: number; asli: Titik | null; poligon: Titik[] }[];
  lampu: Titik[];
};

const WIB = (s: string) => Date.parse(`${s}+07:00`);

describe("cahaya", () => {
  it("mengikuti matahari di Batam, dalam WIB", () => {
    expect(cahayaBatam(new Date(WIB("2026-11-05T12:00:00"))).fase).toBe("siang");
    expect(cahayaBatam(new Date(WIB("2026-11-05T23:30:00"))).fase).toBe("malam");
    const senja = cahayaBatam(new Date(WIB("2026-11-05T17:50:00")));
    expect(senja.fase).toBe("senja");
    expect(senja.label).toBe("Senja");
    expect(cahayaBatam(new Date(WIB("2026-11-05T05:40:00"))).label).toBe("Fajar");
  });

  it("menulis jam dalam WIB apa pun zona mesinnya", () => {
    expect(jamWib(new Date("2026-11-05T11:05:00Z"))).toBe("18.05 WIB");
  });
});

describe("feri dari jadwal", () => {
  const baris = (b: Partial<BarisJadwal>): BarisJadwal => ({
    ruteId: "hb-hfc",
    arah: "uji",
    operator: "Uji",
    zona: "Asia/Jakarta",
    jam: ["08:30"],
    hari: "setiap hari",
    tanggalData: "2026-11-04",
    sumber: null,
    durasiMenit: 50,
    menujuTerminal: false,
    ...b,
  });

  it("jam SGT tidak dibaca sebagai WIB", () => {
    // 08:15 SGT = 07:15 WIB. Pukul 07:40 WIB kapal sudah 25 menit di jalan.
    const j = baris({ zona: "Asia/Singapore", jam: ["08:15"], menujuTerminal: true });
    const aktif = perjalananAktif([j], WIB("2026-11-05T07:40:00"));
    expect(aktif).toHaveLength(1);
    expect(aktif[0].fraksi).toBeCloseTo(0.5, 5);
    expect(perjalananAktif([j], WIB("2026-11-05T08:10:00"))).toHaveLength(0);
  });

  it("jadwal asli Horizon: berangkat dari kedua arah dengan zona masing-masing", () => {
    expect(JADWAL_MURAL.map((b) => b.zona).sort()).toEqual(["Asia/Jakarta", "Asia/Singapore"]);
    const keluar = JADWAL_MURAL.find((b) => b.zona === "Asia/Jakarta")!;
    const pulang = JADWAL_MURAL.find((b) => b.zona === "Asia/Singapore")!;
    expect(keluar.menujuTerminal).toBe(false);
    expect(pulang.menujuTerminal).toBe(true);
    expect(keluar.durasiMenit).toBe(50);
    expect(keluar.arah).toBe("Harbour Bay ke HarbourFront");
  });

  it("perjalanan malam melewati tengah malam tetap terhitung", () => {
    const j = baris({ jam: ["23:40"], durasiMenit: 50 });
    const aktif = perjalananAktif([j], WIB("2026-11-06T00:05:00"));
    expect(aktif).toHaveLength(1);
    expect(aktif[0].fraksi).toBeCloseTo(0.5, 5);
  });

  it("hari yang tidak jelas tidak digambar", () => {
    expect(berlakuPadaHari("contoh 4 Nov 2026", 3)).toBeNull();
    expect(berlakuPadaHari("Sab–Min", 6)).toBe(true);
    expect(berlakuPadaHari("Sab–Min", 3)).toBe(false);
    expect(perjalananAktif([baris({ hari: "contoh 4 Nov 2026" })], WIB("2026-11-05T08:40:00"))).toHaveLength(0);
  });

  it("rute tanpa durasi tidak digambar dan disebut alasannya", () => {
    expect(JADWAL_MURAL.every((b) => b.ruteId === "hb-hfc")).toBe(true);
    expect(RUTE_TAK_DIGAMBAR.join()).toContain("Puteri Harbour");
  });

  it("keberangkatan berikutnya", () => {
    const n = berikutnya([baris({})], WIB("2026-11-05T20:00:00"));
    expect(n?.berangkat).toBe(WIB("2026-11-06T08:30:00"));
  });

  it("awal hari lokal dan instan jam", () => {
    const awal = awalHariLokal(WIB("2026-11-05T01:00:00"), "Asia/Singapore");
    expect(instanJam(awal, "08:15")).toBe(Date.parse("2026-11-05T08:15:00+08:00"));
  });

  it("kapal yang pulang menempuh garis terbalik", () => {
    const g: Titik[] = [
      [0, 0],
      [100, 0],
    ];
    expect(posisiKapal(g, 0.25, false).x).toBe(25);
    expect(posisiKapal(g, 0.25, true).x).toBe(75);
  });

  it("gerak tenang: posisi dihitung per menit", () => {
    expect(lompatMenit(WIB("2026-11-05T08:30:42"))).toBe(WIB("2026-11-05T08:30:00"));
  });
});

describe("hujan per poligon", () => {
  const ts = "202611051155"; // SGT
  const sekarang = Date.parse("2026-11-05T12:00:00+08:00");
  const kec = (name: string, sedang: number) => ({
    code: "x",
    name,
    kab: "Batam",
    land: 10,
    rain: sedang,
    ringan: 0,
    sedang,
    lebat: 0,
  });
  const frames = (over: Partial<FramesResponse>): FramesResponse => ({
    frames: [{ ts, url: "", time: "", date: "" }],
    count: 1,
    stale: false,
    ageMinutes: 5,
    source: "mss",
    echo: { near: true, coverage: 0, level: "sedang", lastTs: ts, lookbackMin: 60, kec: [kec("Lubuk Baja", 6)] },
    ...over,
  });

  it("level per kecamatan dari server", () => {
    const k = keadaanHujan(frames({}), false, sekarang);
    expect(k.status).toBe("tersedia");
    if (k.status === "tersedia") expect(k.perKecamatan).toEqual({ "Lubuk Baja": "sedang" });
    expect(teksHujan(k, ["Batu Ampar", "Lubuk Baja"])).toContain("Lubuk Baja: hujan sedang");
    expect(teksHujan(k, ["Batu Ampar", "Lubuk Baja"])).toContain("Perkiraan radar");
  });

  it("gagal, kosong, basi, atau tanpa echo = tidak tersedia, bukan cerah", () => {
    for (const k of [
      keadaanHujan(null, true, sekarang),
      keadaanHujan(frames({ frames: [] }), false, sekarang),
      keadaanHujan(frames({ echo: null }), false, sekarang),
      keadaanHujan(frames({}), false, sekarang + 3 * 3600_000),
    ]) {
      expect(k.status).toBe("tidak-tersedia");
      expect(teksHujan(k, ["Lubuk Baja"])).toMatch(/tidak digambar/i);
    }
  });

  it("partikel punya batas keras", () => {
    expect(jumlahPartikel(100_000_000, "lebat", BATAS_PARTIKEL_HP)).toBe(BATAS_PARTIKEL_HP);
    expect(jumlahPartikel(1_000_000, "lebat", 9999)).toBeGreaterThan(jumlahPartikel(1_000_000, "ringan", 9999));
  });
});

describe("ombak", () => {
  const sekarang = Date.parse("2026-11-05T12:00:00Z");
  const respons = (waveM: number | null): PerairanResponse =>
    ({
      code: "P.R.02",
      name: "x",
      issued: "",
      current: null,
      upcoming: false,
      slots: [
        {
          validFrom: "2026-11-05T11:00:00Z",
          validTo: "2026-11-05T13:00:00Z",
          waveCat: "Sedang",
          waveM,
        },
      ],
    }) as unknown as PerairanResponse;

  it("gerak mengikuti tinggi gelombang", () => {
    expect(parameterOmbak(0.3)).toEqual({ amplitudo: 1, kecepatan: 0.25, busa: false });
    expect(parameterOmbak(1.2).busa).toBe(false);
    expect(parameterOmbak(1.2).amplitudo).toBeGreaterThan(1);
    expect(parameterOmbak(2).busa).toBe(true);
  });

  it("tersedia dari slot jam ini", () => {
    const k = keadaanOmbak(respons(1.25), false, sekarang);
    expect(k.status).toBe("tersedia");
    expect(teksOmbak(k)).toContain("1,3 m");
    expect(teksOmbak(k)).toContain("BMKG");
  });

  it("tanpa angka berarti tidak tersedia, bukan tenang", () => {
    for (const k of [keadaanOmbak(null, true, sekarang), keadaanOmbak(respons(null), false, sekarang)]) {
      expect(k.status).toBe("tidak-tersedia");
      expect(teksOmbak(k)).toContain("bukan berarti laut tenang");
    }
  });
});

describe("quest", () => {
  const simpan = () => {
    const isi = new Map<string, string>();
    return {
      getItem: (k: string) => isi.get(k) ?? null,
      setItem: (k: string, v: string) => void isi.set(k, v),
    };
  };

  it("tidak ada target di titik sensitif", () => {
    const perId = new Map(landmarks.map((l) => [l.id, l]));
    for (const t of QUEST_AKTIF.target) {
      const l = perId.get(t.id);
      expect(l, t.id).toBeTruthy();
      expect(bolehJadiQuest(l!), t.id).toBe(true);
      expect(l!.segmen).toBe(SEGMEN_AKTIF);
    }
  });

  it("aturan menutup kamp Galang, Nghia Trang, Rempang, dan semua kampung tua", () => {
    const dilarang = landmarks.filter(
      (l) =>
        l.segmen === "rempang" ||
        l.segmen === "galang" ||
        l.kategori === "kampung-tua-rujukan" ||
        l.id === "kamp-pengungsi-galang" ||
        l.id === "makam-nghia-trang",
    );
    expect(dilarang.length).toBeGreaterThanOrEqual(13);
    for (const l of dilarang) expect(bolehJadiQuest(l), l.id).toBe(false);
  });

  it("id di luar target tidak memberi poin", () => {
    const p = tandaiTemuan({}, QUEST_AKTIF, "tanjung-uma");
    expect(hitungTemuan(p, QUEST_AKTIF).ditemukan).toBe(0);
  });

  it("menandai sekali, menyimpan, dan membaca lagi", () => {
    const s = simpan();
    let p = tandaiTemuan({}, QUEST_AKTIF, "harbour-bay");
    p = tandaiTemuan(p, QUEST_AKTIF, "harbour-bay");
    expect(hitungTemuan(p, QUEST_AKTIF).ditemukan).toBe(1);
    tulisProgres(s, p);
    expect(bacaProgres(s)).toEqual(p);
    expect(teksProgres(QUEST_AKTIF, 1, 5)).toContain("1 dari 5");
    const semua = QUEST_AKTIF.target.reduce((acc, t) => tandaiTemuan(acc, QUEST_AKTIF, t.id), {});
    expect(hitungTemuan(semua, QUEST_AKTIF).selesai).toBe(true);
  });

  it("penyimpanan rusak atau menolak tidak melempar galat", () => {
    const rusak = { getItem: () => "{bukan json", setItem: () => {} };
    expect(bacaProgres(rusak)).toEqual({});
    const tolak = {
      getItem: () => {
        throw new Error("ditolak");
      },
      setItem: () => {
        throw new Error("penuh");
      },
    };
    expect(bacaProgres(tolak)).toEqual({});
    expect(() => tulisProgres(tolak, {})).not.toThrow();
    expect(bacaProgres(null)).toEqual({});
    const salahBentuk = { getItem: (k: string) => (k === KUNCI_PROGRES ? "[1,2]" : null), setItem: () => {} };
    expect(bacaProgres(salahBentuk)).toEqual({});
  });
});

describe("geometri dan hit-test", () => {
  const kotak = (x: number, y: number, s: number): Titik[] => [
    [x, y],
    [x + s, y],
    [x + s, y + s],
    [x, y + s],
  ];
  it("poligon terkecil didahulukan", () => {
    const besar = { id: "besar", x: 50, y: 50, poligon: kotak(0, 0, 100) };
    const kecil = { id: "kecil", x: 50, y: 50, poligon: kotak(40, 40, 20) };
    expect(cariHotspot([50, 50], [besar, kecil], 0)?.id).toBe("kecil");
    expect(cariHotspot([10, 10], [besar, kecil], 0)?.id).toBe("besar");
  });
  it("toleransi sentuh dipakai kalau di luar poligon", () => {
    const h = { id: "a", x: 50, y: 50, poligon: kotak(45, 45, 10) };
    expect(cariHotspot([70, 50], [h], 25)?.id).toBe("a");
    expect(cariHotspot([70, 50], [h], 5)).toBeNull();
  });
  it("sepanjang garis", () => {
    const g: Titik[] = [
      [0, 0],
      [10, 0],
      [10, 10],
    ];
    expect(sepanjangGaris(g, 0.75)).toMatchObject({ x: 10, y: 5 });
    expect(sepanjangGaris(g, 2).y).toBe(10);
    expect(luasPoligon(kotak(0, 0, 10))).toBe(100);
    expect(dalamPoligon([5, 5], kotak(0, 0, 10))).toBe(true);
  });
});

describe("GCP dan transformasi", () => {
  const gcps = gcpBerkas.gcps as Gcp[];
  it("dua arah pulang-pergi dengan @allmaps/transform", () => {
    const t = buatTransformer(gcps)!;
    const [lng, lat] = keGeo(t, [2000, 1200]);
    const [x, y] = kePiksel(t, [lng, lat]);
    expect(x).toBeCloseTo(2000, 3);
    expect(y).toBeCloseTo(1200, 3);
    expect(lng).toBeGreaterThan(META.bingkai.barat);
    expect(lng).toBeLessThan(META.bingkai.timur);
  });
  it("kurang dari 3 titik tidak membuat transformasi", () => {
    expect(buatTransformer(gcps.slice(0, 2))).toBeNull();
  });
  it("galat leave-one-out kecil pada kisi linear", () => {
    const g = galatTinggalkanSatu(gcps);
    expect(g).toHaveLength(gcps.length);
    expect(g.every((d) => d !== null && d < 1)).toBe(true);
  });
  it("berkas unduhan dapat dibaca lagi, berkas rusak ditolak", () => {
    const teks = JSON.stringify(berkasGcp(SEGMEN_AKTIF, gcps, "uji"));
    expect(uraiBerkasGcp(teks)).toEqual(gcps);
    expect(uraiBerkasGcp("{}")).toBeNull();
    expect(uraiBerkasGcp('{"gcps":[{"resource":[1],"geo":[1,2]}]}')).toBeNull();
    expect(uraiBerkasGcp("bukan json")).toBeNull();
  });
});

describe("data segmen", () => {
  it("8 perhentian urut, tepat satu aktif", () => {
    expect(PERHENTIAN).toHaveLength(8);
    expect(PERHENTIAN.map((p) => p.urutan)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(PERHENTIAN.filter((p) => p.aktif).map((p) => p.id)).toEqual([SEGMEN_AKTIF]);
    expect(PERHENTIAN.map((p) => p.id)).toEqual(segmen.map((s) => s.id));
  });
  it("perhentian tidak membawa catatan penyusun", () => {
    const teks = JSON.stringify(PERHENTIAN);
    expect(teks).not.toMatch(/⚠|\*\*|perlu cek|terbesar/i);
  });
  it("kartu aman: tanpa brief ilustrator, catatan penyusun, atau klaim lahan", () => {
    const teks = JSON.stringify(KARTU);
    expect(teks).not.toMatch(/deskripsi_visual|ide_hotspot|PERLU-CEK|ESTIMASI|⚠|🧭|\*\*|Quest:/);
    for (const k of KARTU) expect(k.lencana.every((l) => !!l.teks)).toBe(true);
    const uma = KARTU.find((k) => k.id === "tanjung-uma")!;
    expect(uma.rujukan?.href).toBe("/cerita/kampung-tua");
    expect(uma.bolehQuest).toBe(false);
    expect(JSON.stringify(uma)).not.toMatch(/hektare|\bha\b|status lahan|batas wilayah|legalitas/i);
    expect(teks).not.toMatch(/surga tersembunyi|wajib dikunjungi|instagramable|—/);
  });
  it("tiap landmark segmen punya kartu; pin hanya untuk yang berpin", () => {
    const seed = landmarks
      .filter((l) => l.segmen === SEGMEN_AKTIF)
      .map((l) => l.id)
      .sort();
    expect(KARTU.map((k) => k.id).sort()).toEqual(seed);
    expect(META.titik.map((t) => t.id).sort()).toEqual(
      KARTU.filter((k) => k.berpin)
        .map((k) => k.id)
        .sort(),
    );
  });
  it("posisi pin konsisten dengan koordinat data dan tidak digeser jauh", () => {
    for (const t of META.titik) {
      expect(t.x).toBeGreaterThanOrEqual(0);
      expect(t.x).toBeLessThanOrEqual(META.lebar);
      expect(t.y).toBeGreaterThanOrEqual(0);
      expect(t.y).toBeLessThanOrEqual(META.tinggi);
      if (t.asli) expect(Math.hypot(t.x - t.asli[0], t.y - t.asli[1])).toBeLessThan(420);
    }
  });
  it("rute feri bermula di koordinat terminal terverifikasi", () => {
    const hb = META.rute.find((r) => r.id === "hb-hfc")!;
    const t = buatTransformer(gcpBerkas.gcps as Gcp[])!;
    const [x, y] = kePiksel(t, [103.9971, 1.1539]);
    expect(Math.hypot(hb.titik[0][0] - x, hb.titik[0][1] - y)).toBeLessThan(2);
  });
  it("poligon hujan memakai nama kecamatan radar", () => {
    const nama = META.kecamatan.map((k) => k.nama);
    expect(nama).toEqual(expect.arrayContaining(["Batu Ampar", "Lubuk Baja", "Bengkong"]));
    expect(META.lampu.length).toBeGreaterThan(50);
  });
  it("ukuran tile di repo di bawah 5 MB", () => {
    const hitung = (d: string): number =>
      readdirSync(d, { withFileTypes: true }).reduce(
        (s, e) => s + (e.isDirectory() ? hitung(join(d, e.name)) : statSync(join(d, e.name)).size),
        0,
      );
    expect(hitung(join(process.cwd(), "public/mural"))).toBeLessThan(5 * 1024 * 1024);
  });
});
