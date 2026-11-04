import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories, ferries, getPlace, places } from "@/features/makan/lib/data";
import { convertPrice, formatKm, isOpenNow } from "@/features/makan/lib/format";
import { fiturFeri, fiturTempat, gabungGayaMakan, koleksi, kotakTitik, lapisanPin } from "@/features/makan/lib/peta";
import { EMPTY, jumlahAktif, RADIUS_FERI_KM, saring, urutkan, type FilterState } from "@/features/makan/lib/saring";
import { bacaDaftarSlug, buatTautan, saringSlug } from "@/features/makan/lib/tautan-simpan";
import { trails, trailStops } from "@/features/makan/lib/trails";
import { PALET } from "@/features/peta/style";
import type { StyleSpecification } from "maplibre-gl";
import {
  CATATAN_KOORDINAT,
  cariKecamatan,
  konversiSemua,
  konversiTempat,
  terminalDariSitus,
} from "../../scripts/konversi-makan.mjs";

const baca = (p: string) => JSON.parse(readFileSync(join(process.cwd(), p), "utf8"));
const mentah = baca("data/makan/places.json");
const areas = baca("data/makan/areas.json");

describe("konversi data Makan ke skema tempat", () => {
  it("kecamatan dibaca dari alamat dan nama area, tanpa menebak", () => {
    expect(cariKecamatan("525P+RX9, Jl. Golden City Jaya, Kec. Bengkong, Kota Batam", "Bengkong")).toBe("Bengkong");
    expect(cariKecamatan("Jl. Raja H. Fisabilillah, Teluk Tering, Batam Kota, Batam City 29444", "Batam Centre")).toBe(
      "Batam Kota",
    );
    expect(cariKecamatan("Komplek Bumi Indah Blok F No.12, Nagoya", "Nagoya / Lubuk Baja")).toBe("Lubuk Baja");
    // Area tanpa nama kecamatan tetap null: Penuin tidak dipetakan dengan pengetahuan luar.
    expect(cariKecamatan("Jl. Komp. Penuin Centre", "Penuin")).toBeNull();
    expect(cariKecamatan("Batam", "Batam Centre")).toBeNull();
  });

  it("daftar cabang tidak dibaca sebagai alamat satu tempat", () => {
    expect(cariKecamatan("Cabang: Nagoya, Taman Baloi, Sekupang, Batam Centre", "Nagoya / Lubuk Baja")).toBe(
      "Lubuk Baja",
    );
    expect(cariKecamatan("Cabang: KDA, Kabil, Mega Legenda", "Mega Legenda")).toBeNull();
    expect(cariKecamatan("Hopeng Kopitiam Pasar Mitra 2, Batam Kota; Cahaya Garden Bengkong", "Batam Centre")).toBe(
      "Batam Kota",
    );
  });

  it("field khusus masuk atribut, koordinat disalin persis", () => {
    const asli = mentah.find((p: { id: string }) => p.id === "golden-prawn-933");
    const e = konversiTempat(asli, "Bengkong");
    expect(e).toMatchObject({
      id: "golden-prawn-933",
      nama: "Golden Prawn 933",
      kategori: "kuliner",
      subkategori: "seafood-gonggong",
      kecamatan: "Bengkong",
      lat: asli.lat,
      lng: asli.lng,
      status_koordinat: "perlu_cek_ulang",
      catatan_koordinat: CATATAN_KOORDINAT,
      sumber_riset: "17-batam-bites",
    });
    expect(e.atribut).toMatchObject({
      gmaps: asli.gmaps,
      halal: asli.halal,
      rating: asli.rating,
      reviews: asli.reviews,
    });
  });

  it("berkas 17-batam-bites.json sama dengan hasil skrip", () => {
    expect(baca("data/places/17-batam-bites.json")).toEqual(JSON.parse(JSON.stringify(konversiSemua(mentah, areas))));
  });

  it("117 tempat masuk places.json sebagai kuliner perlu_cek_ulang, dan masuk CSV koordinat", () => {
    const kuliner = baca("data/places.json").filter((p: { kategori: string }) => p.kategori === "kuliner");
    expect(kuliner).toHaveLength(117);
    expect(kuliner.every((p: { status_koordinat: string }) => p.status_koordinat === "perlu_cek_ulang")).toBe(true);
    const csv = readFileSync(join(process.cwd(), "data/koordinat_perlu_diisi.csv"), "utf8").split(/\r?\n/);
    const baris = csv.filter((l) => l.split(",")[3] === "kuliner");
    expect(baris).toHaveLength(117);
  });

  it("terminal memakai data situs lewat indeks id, gagal keras kalau alias tidak ada", () => {
    const situs = terminalDariSitus(baca("data/places.json"), baca("data/places_id_index.json"));
    expect(situs.map((t: { id_kanonik: string }) => t.id_kanonik)).toEqual([
      "terminal-feri-batam-centre",
      "terminal-feri-harbour-bay",
      "terminal-feri-sekupang",
      "terminal-feri-nongsapura",
    ]);
    expect(baca("data/makan/ferries.json")).toEqual(situs);
    expect(() => terminalDariSitus([], {})).toThrow(/batam-centre/);
  });
});

describe("kejujuran data di UI", () => {
  it("rating dan reviews tidak sampai ke UI, data mentah tetap menyimpannya", () => {
    expect(places).toHaveLength(117);
    for (const p of places) {
      expect(p).not.toHaveProperty("rating");
      expect(p).not.toHaveProperty("reviews");
    }
    expect(mentah.filter((p: { rating: number | null }) => p.rating !== null)).toHaveLength(51);
  });

  it("pin perkiraan ditandai, terminal berongga kalau koordinatnya belum pasti", () => {
    expect(places.every((p) => p.coord_approx)).toBe(true);
    expect(fiturTempat(places[0]).properties.perkiraan).toBe(true);
    const skp = ferries.find((f) => f.id === "sekupang")!;
    const hb = ferries.find((f) => f.id === "harbour-bay")!;
    expect(fiturFeri(skp).properties.perkiraan).toBe(true);
    expect(fiturFeri(hb).properties.perkiraan).toBe(false);
  });

  it("kode Makan tidak memuat emoji dan warna hex lama", () => {
    const berkas = (d: string): string[] =>
      readdirSync(d).flatMap((n) => {
        const p = join(d, n);
        return statSync(p).isDirectory() ? berkas(p) : [p];
      });
    for (const f of [...berkas("features/makan"), ...berkas("app/makan")]) {
      const isi = readFileSync(f, "utf8");
      expect(isi, f).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(isi, f).not.toMatch(/#[0-9a-fA-F]{6}\b/);
    }
  });

  it("tiap kategori punya ikon garis sendiri", () => {
    const ikon = readFileSync("features/makan/components/Ikon.tsx", "utf8");
    expect(categories).toHaveLength(17);
    for (const c of categories) expect(ikon, c.id).toMatch(new RegExp(`"?${c.id}"?:\\s*"M`));
  });

  it("jalur hanya menunjuk tempat yang ada", () => {
    expect(trails).toHaveLength(5);
    for (const t of trails) expect(trailStops(t)).toHaveLength(t.stops.length);
  });
});

describe("filter", () => {
  const s = (patch: Partial<FilterState>): FilterState => ({ ...EMPTY, ...patch });

  it("tanpa filter semua tampil, pilihan kurator di depan", () => {
    const r = saring(places, EMPTY, null);
    expect(r).toHaveLength(117);
    const nPilihan = places.filter((p) => p.featured).length;
    expect(r.slice(0, nPilihan).every((p) => p.featured)).toBe(true);
    expect(r[nPilihan].featured).toBe(false);
  });

  it("halal, kategori, area, harga, label", () => {
    expect(saring(places, s({ halal: ["halal"] }), null)).toHaveLength(80);
    expect(saring(places, s({ cats: ["sup-ikan"] }), null)).toHaveLength(5);
    expect(saring(places, s({ areas: ["bengkong"] }), null)).toHaveLength(12);
    expect(saring(places, s({ tiers: ["$$$"] }), null)).toHaveLength(10);
    expect(saring(places, s({ labels: ["hits"] }), null)).toHaveLength(6);
    // Antarkelompok AND, dalam satu kelompok OR.
    expect(saring(places, s({ cats: ["sup-ikan", "bakso"] }), null)).toHaveLength(12);
    const gabung = saring(places, s({ halal: ["halal"], cats: ["sup-ikan"] }), null);
    expect(gabung.every((p) => p.halal === "halal" && p.category === "sup-ikan")).toBe(true);
  });

  it("terminal: hanya yang terdekat ke terminal itu dan dalam radius", () => {
    const r = saring(places, s({ ferry: "harbour-bay", sort: "ferry" }), null);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.nearestFerryId === "harbour-bay" && p.nearestFerryKm <= RADIUS_FERI_KM)).toBe(true);
    expect(r[0].nearestFerryKm).toBeLessThanOrEqual(r[r.length - 1].nearestFerryKm);
  });

  it("pencarian mencakup nama, menu, dan alamat tanpa peduli huruf besar", () => {
    expect(saring(places, s({ query: "GOLDEN prawn" }), null).map((p) => p.id)).toContain("golden-prawn-933");
    expect(saring(places, s({ query: "gonggong" }), null).length).toBeGreaterThan(1);
    expect(saring(places, s({ query: "tidak-ada-yang-seperti-ini" }), null)).toHaveLength(0);
  });

  it("buka sekarang memakai waktu yang diberikan, jam tidak diketahui tidak dihitung buka", () => {
    const siang = Date.parse("2026-11-04T05:00:00Z"); // 12.00 WIB
    const r = saring(places, s({ openNow: true }), siang);
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => isOpenNow(p.hours, new Date(siang)) === true)).toBe(true);
    expect(r.some((p) => !p.hours)).toBe(false);
    // Belum tahu waktu (render server): filter belum berlaku.
    expect(saring(places, s({ openNow: true }), null)).toHaveLength(117);
  });

  it("urut A-Z dan terdekat dari lokasi pengguna", () => {
    const az = urutkan(places, "az", null);
    expect(az[0].name.localeCompare(az[1].name)).toBeLessThanOrEqual(0);
    const dekat = urutkan(places, "nearby", { lat: 1.15, lng: 104.03 });
    expect(dekat).toHaveLength(117);
  });

  it("jumlah filter aktif", () => {
    expect(jumlahAktif(EMPTY)).toBe(0);
    expect(jumlahAktif(s({ query: " a ", cats: ["bakso", "bubur"], ferry: "sekupang", openNow: true }))).toBe(5);
    expect(jumlahAktif(s({ query: "   " }))).toBe(0);
  });
});

describe("format", () => {
  const wib = (iso: string) => new Date(`${iso}+07:00`);

  it("buka sekarang dihitung menurut WIB, bukan jam perangkat", () => {
    expect(isOpenNow("10.00–21.00", wib("2026-11-04T12:00:00"))).toBe(true);
    expect(isOpenNow("10.00–21.00", wib("2026-11-04T09:59:00"))).toBe(false);
    expect(isOpenNow("10.00–21.00", wib("2026-11-04T21:00:00"))).toBe(false);
    expect(isOpenNow("10.30–00.30", wib("2026-11-05T00:15:00"))).toBe(true);
    expect(isOpenNow("16.00–24.00", wib("2026-11-04T23:59:00"))).toBe(true);
    expect(isOpenNow("24 jam", wib("2026-11-04T03:00:00"))).toBe(true);
  });

  it("keterangan hari di data dihormati, yang tak jelas dijawab tidak tahu", () => {
    expect(isOpenNow("06.15–13.00 (Senin tutup)", wib("2026-11-02T08:00:00"))).toBe(false);
    expect(isOpenNow("06.15–13.00 (Senin tutup)", wib("2026-11-03T08:00:00"))).toBe(true);
    expect(isOpenNow("08.00–14.00 (Senin–Sabtu)", wib("2026-11-08T09:00:00"))).toBe(false);
    expect(isOpenNow("08.00–14.00 (Senin–Sabtu)", wib("2026-11-07T09:00:00"))).toBe(true);
    expect(isOpenNow("10.00–19.00 (Jumat–Minggu hingga 20.00)", wib("2026-11-06T19:30:00"))).toBe(true);
    expect(isOpenNow("10.00–19.00 (Jumat–Minggu hingga 20.00)", wib("2026-11-04T19:30:00"))).toBe(false);
    expect(isOpenNow("07.00", wib("2026-11-04T08:00:00"))).toBeNull();
    expect(isOpenNow("", wib("2026-11-04T08:00:00"))).toBeNull();
    expect(isOpenNow("10.00–21.00 (libur nasional tutup)", wib("2026-11-04T12:00:00"))).toBeNull();
  });

  it("konversi harga jujur soal bentuk teks aslinya", () => {
    expect(convertPrice("Rp150.000–350.000", "IDR")).toBe("Rp150.000–350.000");
    expect(convertPrice("Rp150.000–350.000", "SGD")).toBe("~S$13–29");
    expect(convertPrice("Rp150.000–350.000", "MYR")).toBe("~RM42–99");
    expect(convertPrice("mulai Rp70.000", "SGD")).toBe("~S$5.8+");
    expect(convertPrice("Rp3.000/pc atau Rp80.000/25 pc", "SGD")).toBe("");
    expect(convertPrice("", "SGD")).toBe("");
  });

  it("jarak", () => {
    expect(formatKm(0.65)).toBe("650 m");
    expect(formatKm(2.1)).toBe("2,1 km");
    expect(formatKm(2.1, "en")).toBe("2.1 km");
  });
});

describe("tautan daftar tersimpan", () => {
  it("bolak-balik lewat tautan", () => {
    const url = buatTautan("https://contoh.test", ["a-b", "c"]);
    expect(url).toBe("https://contoh.test/makan/tersimpan?simpan=a-b,c");
    expect(bacaDaftarSlug(url)).toEqual(["a-b", "c"]);
  });

  it("menerima daftar slug biasa, ganda dibuang, slug asing ditolak", () => {
    expect(bacaDaftarSlug(" a, b\nc  a ")).toEqual(["a", "b", "c"]);
    expect(bacaDaftarSlug("")).toEqual([]);
    const { valid, ditolak } = saringSlug(
      ["golden-prawn-933", "tidak-ada", "__proto__"],
      (x) => getPlace(x) !== undefined,
    );
    expect(valid).toEqual(["golden-prawn-933"]);
    expect(ditolak).toEqual(["tidak-ada", "__proto__"]);
  });
});

describe("lapisan peta", () => {
  const baru: StyleSpecification = {
    version: 8,
    sources: { protomaps: { type: "vector", url: "pmtiles://x" } },
    layers: [{ id: "background", type: "background" }],
  };

  it("saat tema berganti sumber dan layer mk- ikut, dengan warna tema baru", () => {
    const lama: StyleSpecification = {
      version: 8,
      sources: {
        protomaps: { type: "vector", url: "pmtiles://lama" },
        "mk-pin": { type: "geojson", data: koleksi([fiturTempat(places[0])]), cluster: true },
      },
      layers: [{ id: "background", type: "background" }, ...lapisanPin("day")],
    };
    const hasil = gabungGayaMakan(lama, baru, "night");
    expect(Object.keys(hasil.sources).sort()).toEqual(["mk-pin", "protomaps"]);
    expect((hasil.sources.protomaps as { url: string }).url).toBe("pmtiles://x");
    expect(hasil.layers.map((l) => l.id)).toEqual(["background", ...lapisanPin("night").map((l) => l.id)]);
    const pin = hasil.layers.find((l) => l.id === "mk-pin-titik") as { paint: Record<string, unknown> };
    expect(pin.paint["circle-stroke-color"]).toBe(PALET.night.accent);
  });

  it("tanpa gaya lama, gaya baru dipakai apa adanya", () => {
    expect(gabungGayaMakan(undefined, baru, "day")).toBe(baru);
  });

  it("kotak mencakup semua titik", () => {
    expect(kotakTitik([])).toBeNull();
    expect(
      kotakTitik([
        { lat: 1, lng: 104 },
        { lat: 1.2, lng: 103.9 },
      ]),
    ).toEqual([
      [103.9, 1],
      [104, 1.2],
    ]);
  });
});
