import { describe, expect, it } from "vitest";
import {
  bentukUdara,
  jamDari,
  KATEGORI_UDARA,
  kategoriUdara,
  rentangKategori,
  teksPartikel,
} from "@/features/langit-laut/lib/udara";

/** Jawaban tiruan berbentuk Open-Meteo: jam dinding WIB dari 8 Nov 00.00 sampai 10 Nov 23.00, AQI naik 1 tiap jam. */
function contoh(kini = "2026-11-09T19:00") {
  const time: string[] = [];
  const us_aqi: (number | null)[] = [];
  const pm2_5: number[] = [];
  const pm10: number[] = [];
  for (let i = 0; i < 72; i++) {
    const d = new Date(Date.UTC(2026, 10, 8, i));
    time.push(d.toISOString().slice(0, 16));
    us_aqi.push(i);
    pm2_5.push(i / 10);
    pm10.push(i / 5);
  }
  return {
    timezone: "Asia/Jakarta",
    current: { time: kini, interval: 3600, us_aqi: 57.4, pm2_5: 11.2, pm10: 12.9 },
    hourly: { time, us_aqi, pm2_5, pm10 },
  };
}

describe("kategori AQI", () => {
  it("batas kategori mengikuti skala AQI Amerika Serikat", () => {
    expect(kategoriUdara(0).label).toBe("Baik");
    expect(kategoriUdara(50).label).toBe("Baik");
    expect(kategoriUdara(51).label).toBe("Sedang");
    expect(kategoriUdara(100).label).toBe("Sedang");
    expect(kategoriUdara(101).label).toBe("Tidak Sehat bagi Kelompok Sensitif");
    expect(kategoriUdara(150).label).toBe("Tidak Sehat bagi Kelompok Sensitif");
    expect(kategoriUdara(151).label).toBe("Tidak Sehat");
    expect(kategoriUdara(201).label).toBe("Sangat Tidak Sehat");
    expect(kategoriUdara(301).label).toBe("Berbahaya");
    expect(kategoriUdara(999).label).toBe("Berbahaya");
  });

  it("rentang tertulis lengkap dan saran tanpa kata Anda", () => {
    expect(KATEGORI_UDARA.map((_, i) => rentangKategori(i))).toEqual([
      "0—50",
      "51—100",
      "101—150",
      "151—200",
      "201—300",
      "301 ke atas",
    ]);
    for (const k of KATEGORI_UDARA) expect(k.saran).not.toMatch(/\bAnda\b/);
  });
});

describe("bentuk data Open-Meteo", () => {
  const diambil = new Date("2026-11-09T12:05:00Z");

  it("angka sekarang dibulatkan, partikel tetap desimal", () => {
    const b = bentukUdara(contoh(), diambil);
    expect(b.status).toBe("ok");
    expect(b.diambil).toBe("2026-11-09T12:05:00.000Z");
    expect(b.sekarang).toEqual({ waktu: "2026-11-09T19:00", aqi: 57, pm25: 11.2, pm10: 12.9 });
  });

  it("24 jam terakhir: dari sesudah 8 Nov 19.00 sampai 9 Nov 19.00", () => {
    // AQI tiruan = jam ke-i sejak 8 Nov 00.00, jadi 8 Nov 20.00 = 20 dan 9 Nov 19.00 = 43.
    expect(bentukUdara(contoh(), diambil).lalu).toEqual({ min: 20, max: 43 });
  });

  it("24 jam ke depan hanya jam kelipatan 3, delapan baris, melewati tengah malam", () => {
    const d = bentukUdara(contoh(), diambil).depan;
    expect(d.map((x) => jamDari(x.waktu))).toEqual(["21.00", "00.00", "03.00", "06.00", "09.00", "12.00", "15.00", "18.00"]);
    expect(d[1].waktu).toBe("2026-11-10T00:00");
  });

  it("nilai kosong atau negatif dibuang, tidak dikarang", () => {
    const c = contoh();
    c.hourly.us_aqi[45] = null;
    c.hourly.us_aqi[48] = -3;
    const d = bentukUdara(c, diambil).depan;
    expect(d.find((x) => x.waktu === "2026-11-10T00:00")).toBeUndefined();
  });

  it("tanpa AQI saat ini: gagal, supaya route menjawab 503", () => {
    const c = contoh();
    (c.current as Record<string, unknown>).us_aqi = null;
    expect(() => bentukUdara(c, diambil)).toThrow(/AQI saat ini/);
    expect(() => bentukUdara({}, diambil)).toThrow();
  });
});

describe("teks", () => {
  it("partikel memakai koma desimal dan satuan", () => {
    expect(teksPartikel(11.2)).toBe("11,2 µg/m³");
    expect(teksPartikel(12)).toBe("12 µg/m³");
    expect(teksPartikel(null)).toBe("—");
  });
});
