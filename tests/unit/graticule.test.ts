import { describe, expect, it } from "vitest";
import {
  formatBujur,
  formatLintang,
  garisSatuUtara,
  graticule,
  kelipatanMenit,
  pilihLangkah,
  tepiSumbu,
} from "@/features/peta/graticule";

describe("format koordinat", () => {
  it("memakai singkatan arah Indonesia", () => {
    expect(formatLintang(1)).toBe("1°00′ U");
    expect(formatLintang(-1.5)).toBe("1°30′ S");
    expect(formatBujur(104.05)).toBe("104°03′ T");
    expect(formatBujur(-104.05)).toBe("104°03′ B");
  });

  it("menaikkan derajat saat menit dibulatkan menjadi 60", () => {
    expect(formatLintang(1.9999)).toBe("2°00′ U");
  });
});

describe("kelipatanMenit", () => {
  it("tidak bergeser karena pembulatan desimal", () => {
    const hasil = kelipatanMenit(1, 1 + 5 / 60, 1);
    expect(hasil).toHaveLength(6);
    expect(hasil[0]).toBe(1);
    expect(hasil[5]).toBeCloseTo(1 + 5 / 60, 12);
  });

  it("menyertakan batas yang tepat di kelipatan", () => {
    expect(kelipatanMenit(1, 2, 60)).toEqual([1, 2]);
  });

  it("kosong bila tidak ada kelipatan di rentang", () => {
    expect(kelipatanMenit(1.001, 1.002, 60)).toEqual([]);
  });
});

describe("graticule", () => {
  const batas = { west: 103.55, south: 0.45, east: 104.75, north: 1.5 };

  it("membuat garis lintang dan bujur selebar batas", () => {
    const fc = graticule(batas, 30);
    const lintang = fc.features.filter((f) => f.properties?.sumbu === "lintang");
    const bujur = fc.features.filter((f) => f.properties?.sumbu === "bujur");
    expect(lintang.map((f) => f.properties?.nilai)).toEqual([0.5, 1, 1.5]);
    expect(bujur.map((f) => f.properties?.nilai)).toEqual([104, 104.5]);
    expect(lintang[0].geometry.coordinates).toEqual([
      [103.55, 0.5],
      [104.75, 0.5],
    ]);
  });

  it("garis 1°N tepat di lintang 1", () => {
    const [f] = garisSatuUtara(batas).features;
    expect(f.geometry.coordinates).toEqual([
      [103.55, 1],
      [104.75, 1],
    ]);
  });
});

describe("tepiSumbu", () => {
  const proyeksi = (deg: number) => (deg - 1) * 3600; // 60 px per menit

  it("memilih langkah terkecil yang masih cukup renggang", () => {
    expect(pilihLangkah(60, 8, [1, 2, 5])).toBe(1);
    expect(pilihLangkah(3, 8, [1, 2, 5])).toBe(5);
    expect(pilihLangkah(0.1, 8, [1, 2, 5])).toBe(5);
  });

  it("strip berselang dan menutup seluruh sisi", () => {
    const { strip } = tepiSumbu(1, 1.5, 1800, proyeksi, formatLintang);
    expect(strip[0].dari).toBeLessThanOrEqual(0);
    expect(strip[strip.length - 1].ke).toBeGreaterThanOrEqual(1800);
    for (let i = 1; i < strip.length; i++) {
      expect(strip[i].gelap).toBe(!strip[i - 1].gelap);
      expect(strip[i].dari).toBeCloseTo(strip[i - 1].ke, 6);
    }
  });

  it("warna strip tetap saat peta digeser", () => {
    const warnaDi = (min: number, max: number) => {
      const { strip } = tepiSumbu(min, max, (max - min) * 3600, proyeksi, formatLintang);
      const s = strip.find((x) => x.dari === proyeksi(1.1));
      return s?.gelap;
    };
    expect(warnaDi(1, 1.5)).toBeDefined();
    expect(warnaDi(1, 1.5)).toBe(warnaDi(1.05, 1.55));
  });

  it("label berjarak minimal dan berisi koordinat", () => {
    const { label } = tepiSumbu(1, 1.5, 1800, proyeksi, formatLintang);
    expect(label[0]).toEqual({ posisi: 0, teks: "1°00′ U" });
    expect(label[1].posisi - label[0].posisi).toBeGreaterThanOrEqual(72);
  });

  it("kosong bila ukuran tidak masuk akal", () => {
    expect(tepiSumbu(1, 1, 100, proyeksi, formatLintang)).toEqual({ strip: [], label: [] });
    expect(tepiSumbu(1, 2, 0, proyeksi, formatLintang)).toEqual({ strip: [], label: [] });
  });
});
