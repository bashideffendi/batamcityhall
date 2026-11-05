import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Gempa } from "@/features/langit-laut/lib/api-types";
import {
  alasanRelevan,
  arahDari,
  gabungGempa,
  gempaRelevan,
  jarakKm,
  ringkasGempa,
  sebutTsunami,
  teksLalu,
  teksLetak,
  teksMagnitudo,
  TITIK_BATAM,
  uraiGempa,
} from "@/features/langit-laut/lib/gempa";

// Bentuk berkas disalin dari respons BMKG 5 Nov 2026.
const AUTOGEMPA = {
  Infogempa: {
    gempa: {
      Tanggal: "04 Nov 2026",
      Jam: "14:56:34 WIB",
      DateTime: "2026-11-04T07:56:34+00:00",
      Coordinates: "-1.14,120.15",
      Lintang: "1.14 LS",
      Bujur: "120.15 BT",
      Magnitude: "3.4",
      Kedalaman: "10 km",
      Wilayah: "Pusat gempa berada di darat 40 km timur laut Sigi",
      Potensi: "Gempa ini dirasakan untuk diteruskan pada masyarakat",
      Dirasakan: "III Sigi, II Palu",
      Shakemap: "20261104145634.mmi.jpg",
    },
  },
};
const DIRASAKAN = {
  Infogempa: {
    gempa: [
      {
        Tanggal: "04 Nov 2026",
        Jam: "14:56:34 WIB",
        DateTime: "2026-11-04T07:56:34+00:00",
        Coordinates: "-1.14,120.15",
        Lintang: "1.14 LS",
        Bujur: "120.15 BT",
        Magnitude: "3.4",
        Kedalaman: "10 km",
        Wilayah: "Pusat gempa berada di darat 40 km timur laut Sigi",
        Dirasakan: "III Sigi, II Palu",
      },
    ],
  },
};
const M5 = {
  Infogempa: {
    gempa: [
      {
        Tanggal: "02 Nov 2026",
        Jam: "15:13:10 WIB",
        DateTime: "2026-11-02T08:13:10+00:00",
        Coordinates: "1.31,124.83",
        Lintang: "1.31 LU",
        Bujur: "124.83 BT",
        Magnitude: "5.3",
        Kedalaman: "148 km",
        Wilayah: "1 km BaratDaya TOMOHON-SULUT",
        Potensi: "Tidak berpotensi tsunami",
      },
    ],
  },
};

const NOW = Date.parse("2026-11-04T12:00:00Z");

function gempa(sebagian: Partial<Gempa> = {}): Gempa {
  return {
    waktu: "2026-11-04T10:00:00.000Z",
    tanggal: "04 Nov 2026",
    jam: "17:00:00 WIB",
    lat: -1,
    lon: 120,
    magnitudo: 4,
    kedalamanKm: 10,
    wilayah: "Wilayah contoh",
    potensi: "",
    dirasakan: "",
    shakemap: "",
    daftar: ["dirasakan"],
    jarakKm: 1800,
    arah: "timur",
    ...sebagian,
  };
}

describe("titik acuan Batam", () => {
  it("sama dengan titik label Kec. Batam Kota di data BIG", () => {
    const geo = JSON.parse(
      readFileSync(join(process.cwd(), "features/langit-laut/lib/kecamatan-geo.json"), "utf8"),
    ) as {
      features: { properties: { name: string; kab: string; label: [number, number] } }[];
    };
    const kec = geo.features.find((f) => f.properties.name === "Batam Kota" && f.properties.kab === "Batam");
    expect(kec?.properties.label).toEqual([TITIK_BATAM.lat, TITIK_BATAM.lon]);
  });
});

describe("uraiGempa", () => {
  it("autogempa berupa satu objek", () => {
    const [g, ...sisa] = uraiGempa(AUTOGEMPA, "terbaru") ?? [];
    expect(sisa).toEqual([]);
    expect(g.waktu).toBe("2026-11-04T07:56:34.000Z");
    expect(g.tanggal).toBe("04 Nov 2026");
    expect(g.jam).toBe("14:56:34 WIB");
    expect(g.lat).toBe(-1.14);
    expect(g.lon).toBe(120.15);
    expect(g.magnitudo).toBe(3.4);
    expect(g.kedalamanKm).toBe(10);
    expect(g.potensi).toBe("Gempa ini dirasakan untuk diteruskan pada masyarakat");
    expect(g.dirasakan).toBe("III Sigi, II Palu");
    expect(g.shakemap).toBe("20261104145634.mmi.jpg");
    expect(g.daftar).toEqual(["terbaru"]);
  });

  it("daftar berupa array", () => {
    expect(uraiGempa(M5, "m5")?.[0].wilayah).toBe("1 km BaratDaya TOMOHON-SULUT");
  });

  it("skema tak dikenal menjadi null, bukan daftar kosong", () => {
    expect(uraiGempa({}, "m5")).toBeNull();
    expect(uraiGempa({ Infogempa: {} }, "m5")).toBeNull();
    expect(uraiGempa(null, "m5")).toBeNull();
  });

  it("entri tanpa waktu sah dibuang", () => {
    expect(uraiGempa({ Infogempa: { gempa: [{ DateTime: "bukan tanggal" }] } }, "m5")).toEqual([]);
  });

  it("Coordinates rusak: pakai Lintang dan Bujur", () => {
    const [g] =
      uraiGempa(
        { Infogempa: { gempa: { DateTime: "2026-11-04T07:56:34+00:00", Lintang: "1.14 LS", Bujur: "120.15 BT" } } },
        "m5",
      ) ?? [];
    expect(g.lat).toBe(-1.14);
    expect(g.lon).toBe(120.15);
  });

  it("koordinat tak terbaca tidak ditebak", () => {
    const [g] = uraiGempa({ Infogempa: { gempa: { DateTime: "2026-11-04T07:56:34+00:00" } } }, "m5") ?? [];
    expect(g.lat).toBeNull();
    expect(g.jarakKm).toBeNull();
    expect(g.arah).toBe("");
    expect(teksLetak(g)).toBe("");
  });

  it("nama Shakemap yang aneh tidak dipakai", () => {
    const [g] =
      uraiGempa({ Infogempa: { gempa: { DateTime: "2026-11-04T07:56:34+00:00", Shakemap: "../x.jpg?a=1" } } }, "m5") ??
      [];
    expect(g.shakemap).toBe("");
  });
});

describe("jarak dan arah", () => {
  it("Sigi di timur Batam, sekitar 1.800 km", () => {
    const sigi = { lat: -1.14, lon: 120.15 };
    expect(jarakKm(TITIK_BATAM, sigi)).toBeGreaterThan(1750);
    expect(jarakKm(TITIK_BATAM, sigi)).toBeLessThan(1850);
    expect(arahDari(TITIK_BATAM, sigi)).toBe("timur");
  });

  it("delapan arah mata angin", () => {
    const pusat = { lat: 0, lon: 100 };
    expect(arahDari(pusat, { lat: 5, lon: 100 })).toBe("utara");
    expect(arahDari(pusat, { lat: 5, lon: 105 })).toBe("timur laut");
    expect(arahDari(pusat, { lat: -5, lon: 105 })).toBe("tenggara");
    expect(arahDari(pusat, { lat: -5, lon: 95 })).toBe("barat daya");
    expect(arahDari(pusat, { lat: 5, lon: 95 })).toBe("barat laut");
  });
});

describe("gabungGempa", () => {
  it("gempa yang sama di dua berkas jadi satu dan kolomnya saling melengkapi", () => {
    const hasil = gabungGempa([
      uraiGempa(DIRASAKAN, "dirasakan") ?? [],
      [
        {
          ...gempa(),
          waktu: "2026-11-04T07:56:40.000Z",
          lat: -1.15,
          lon: 120.16,
          wilayah: "lain",
          potensi: "Tidak berpotensi tsunami",
          daftar: ["m5"],
        },
      ],
    ]);
    expect(hasil).toHaveLength(1);
    expect(hasil[0].wilayah).toBe("Pusat gempa berada di darat 40 km timur laut Sigi");
    expect(hasil[0].potensi).toBe("Tidak berpotensi tsunami");
    expect(hasil[0].daftar).toEqual(["dirasakan", "m5"]);
  });

  it("gempa berbeda tetap terpisah, terbaru di atas", () => {
    const hasil = gabungGempa([uraiGempa(M5, "m5") ?? [], uraiGempa(AUTOGEMPA, "terbaru") ?? []]);
    expect(hasil.map((g) => g.magnitudo)).toEqual([3.4, 5.3]);
  });

  it("waktu sama tetapi berjauhan bukan gempa yang sama", () => {
    expect(gabungGempa([[gempa({ lat: -1, lon: 120 })], [gempa({ lat: 3, lon: 100 })]])).toHaveLength(2);
  });
});

describe("sebutTsunami", () => {
  it.each([
    ["Tidak berpotensi tsunami", false],
    ["Tidak berpotensi Tsunami untuk diteruskan pada masyarakat", false],
    ["Gempa ini dirasakan untuk diteruskan pada masyarakat", false],
    ["", false],
    ["Berpotensi tsunami", true],
    ["BERPOTENSI TSUNAMI untuk diteruskan pada masyarakat", true],
  ])("%s", (teks, harap) => {
    expect(sebutTsunami(teks)).toBe(harap);
  });
});

describe("alasanRelevan", () => {
  it("jauh dan kecil tidak disebut", () => {
    expect(alasanRelevan(gempa(), NOW)).toEqual([]);
  });

  it("lewat 24 jam tidak disebut, sedekat apa pun", () => {
    expect(alasanRelevan(gempa({ waktu: "2026-11-03T11:59:00.000Z", jarakKm: 10 }), NOW)).toEqual([]);
  });

  it("dalam 300 km", () => {
    expect(alasanRelevan(gempa({ jarakKm: 300 }), NOW)).toEqual(["dekat"]);
    expect(alasanRelevan(gempa({ jarakKm: 301 }), NOW)).toEqual([]);
  });

  it("M 6 ke atas dalam 1.000 km", () => {
    expect(alasanRelevan(gempa({ jarakKm: 900, magnitudo: 6 }), NOW)).toEqual(["besar"]);
    expect(alasanRelevan(gempa({ jarakKm: 900, magnitudo: 5.9 }), NOW)).toEqual([]);
    expect(alasanRelevan(gempa({ jarakKm: 1100, magnitudo: 7 }), NOW)).toEqual([]);
  });

  it("dirasakan di Kepri", () => {
    expect(alasanRelevan(gempa({ dirasakan: "II Batam" }), NOW)).toEqual(["dirasakan"]);
    expect(alasanRelevan(gempa({ dirasakan: "III Tanjungpinang, II Bintan" }), NOW)).toEqual(["dirasakan"]);
    expect(alasanRelevan(gempa({ dirasakan: "III Sigi, II Palu" }), NOW)).toEqual([]);
  });

  it("disebut BMKG berpotensi tsunami, di mana pun", () => {
    expect(alasanRelevan(gempa({ potensi: "Berpotensi tsunami" }), NOW)).toEqual(["tsunami"]);
    expect(alasanRelevan(gempa({ potensi: "Tidak berpotensi tsunami" }), NOW)).toEqual([]);
  });

  it("koordinat tak terbaca tidak dihitung dekat", () => {
    expect(alasanRelevan(gempa({ jarakKm: null, magnitudo: 8 }), NOW)).toEqual([]);
  });
});

describe("gempaRelevan", () => {
  it("tidak ada: null", () => {
    expect(gempaRelevan([gempa()], NOW)).toBeNull();
    expect(gempaRelevan(undefined, NOW)).toBeNull();
  });

  it("yang menyebut tsunami menang atas yang lebih baru", () => {
    const dekat = gempa({ waktu: "2026-11-04T11:00:00.000Z", jarakKm: 100 });
    const tsunami = gempa({ waktu: "2026-11-04T09:00:00.000Z", potensi: "Berpotensi tsunami" });
    expect(gempaRelevan([dekat, tsunami], NOW)).toBe(tsunami);
  });

  it("selain itu yang terbaru", () => {
    const lama = gempa({ waktu: "2026-11-04T09:00:00.000Z", jarakKm: 100 });
    const baru = gempa({ waktu: "2026-11-04T11:00:00.000Z", jarakKm: 200 });
    expect(gempaRelevan([lama, baru], NOW)).toBe(baru);
  });
});

describe("teks", () => {
  it("magnitudo memakai koma", () => {
    expect(teksMagnitudo(5.3)).toBe("M 5,3");
    expect(teksMagnitudo(6)).toBe("M 6,0");
    expect(teksMagnitudo(null)).toBe("Magnitudo belum tercatat");
  });

  it("letak dibulatkan ke 10 km", () => {
    expect(teksLetak({ jarakKm: 644, arah: "barat laut" })).toBe("±640 km barat laut Batam");
    expect(teksLetak({ jarakKm: 1796, arah: "timur" })).toBe("±1.800 km timur Batam");
    expect(teksLetak({ jarakKm: 3, arah: "utara" })).toBe("±10 km utara Batam");
  });

  it("waktu relatif", () => {
    const lalu = (ms: number) => new Date(NOW - ms).toISOString();
    expect(teksLalu(lalu(20 * 1000), NOW)).toBe("baru saja");
    expect(teksLalu(lalu(5 * 60000), NOW)).toBe("5 menit lalu");
    expect(teksLalu(lalu(3 * 3600e3), NOW)).toBe("3 jam lalu");
    expect(teksLalu(lalu(50 * 3600e3), NOW)).toBe("2 hari lalu");
  });

  it("ringkasan Hari Ini", () => {
    const r = ringkasGempa(gempa({ magnitudo: 5.3, jarakKm: 644, arah: "barat laut", dirasakan: "III Padang" }), NOW);
    expect(r.judul).toBe("M 5,3, ±640 km barat laut Batam");
    expect(r.rincian).toBe("2 jam lalu. Dirasakan: III Padang");
  });

  it("kalimat BMKG soal tsunami disalin di ringkasan, yang menyangkal tidak", () => {
    expect(ringkasGempa(gempa({ potensi: "Berpotensi tsunami" }), NOW).rincian).toContain("Berpotensi tsunami");
    expect(ringkasGempa(gempa({ potensi: "Tidak berpotensi tsunami" }), NOW).rincian).not.toContain("tsunami");
  });
});
