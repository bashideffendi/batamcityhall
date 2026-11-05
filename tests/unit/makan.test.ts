import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { areas as areaTampil, categories, ferries, getPlace, places, satuLabel, tempatTerdekat } from "@/features/makan/lib/data";
import {
  adalahPonsel,
  alamatBersih,
  bukaLarut,
  bukaPagi,
  convertPrice,
  formatBulan,
  formatHarga,
  formatJam,
  formatKm,
  formatKmDesimal,
  hargaRingkas,
  hargaTertinggi,
  isOpenNow,
  jamSgt,
  keSgt,
  statusJam,
} from "@/features/makan/lib/format";
import { polaMosaik } from "@/features/makan/lib/foto";
import { kategoriDariSlug, RUMPUN, semuaSlugHidangan, slugHidangan } from "@/features/makan/lib/hidangan";
import { getPanduan, panduan, panduanUntuk } from "@/features/makan/lib/panduan";
import { bacaAlamat, tautanPeta, tulisAlamat } from "@/features/makan/lib/saring";

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

  it("satu label per tempat, menurut urutan pedoman", () => {
    expect(satuLabel(["wajib-coba", "legendaris"])).toEqual(["legendaris"]);
    expect(satuLabel(["hits", "wajib-coba"])).toEqual(["wajib-coba"]);
    expect(satuLabel(["hidden-gem"])).toEqual(["hidden-gem"]);
    expect(satuLabel([])).toEqual([]);
    expect(places.every((p) => p.labels.length <= 1)).toBe(true);
    expect(places.find((p) => p.id === "golden-prawn-933")?.labels).toEqual(["legendaris"]);
    // Data mentah tetap menyimpan semua labelnya.
    expect(mentah.find((p: { id: string }) => p.id === "golden-prawn-933").labels).toHaveLength(2);
  });

  it("nomor ponsel tidak sampai ke UI, nomor kantor tetap, data mentah tetap menyimpannya", () => {
    expect(adalahPonsel("+62 812-3456-7890")).toBe(true);
    expect(adalahPonsel("0812 3456 7890")).toBe(true);
    expect(adalahPonsel("+62 778 411142")).toBe(false);
    expect(adalahPonsel("")).toBe(false);
    expect(places.some((p) => adalahPonsel(p.phone))).toBe(false);
    expect(places.find((p) => p.id === "golden-prawn-933")?.phone).toBe("+62 778 411142");
    expect(mentah.filter((p: { phone: string }) => adalahPonsel(p.phone))).toHaveLength(24);
  });

  it("kategori sesuai tabel pedoman 3.4", () => {
    expect(Object.fromEntries(categories.map((c) => [c.id, c.name_id]))).toEqual({
      "seafood-gonggong": "Makanan laut dan gonggong",
      "sup-ikan": "Sup ikan",
      "mie-tarempa": "Mi tarempa dan luti gendang",
      "nasi-ayam-hainan": "Nasi ayam hainan",
      kopitiam: "Kopitiam",
      "martabak-prata": "Martabak dan prata",
      "mie-bakmi": "Mi dan bakmi",
      bubur: "Bubur",
      "nasi-padang": "Nasi padang",
      "sunda-jawa": "Masakan Sunda dan Jawa",
      "sate-kambing": "Sate kambing",
      bakso: "Bakso",
      "dimsum-chinese": "Dim sum dan masakan Tionghoa",
      "ayam-penyet": "Ayam penyet dan lalapan",
      "pecel-gado": "Pecel dan gado-gado",
      "oleh-oleh": "Oleh-oleh dan kue",
      cafe: "Kafe dan kedai kopi",
    });
  });

  it("teks tempat bebas kata promosi, nama usaha tetap persis", () => {
    const LARANG_ID = /legendaris|melegenda|terbaik|terenak|hidden gem|wajib coba|instagramable|mantap|berating|ramah kantong/i;
    const LARANG_EN = /legendary|\bbest\b|must-|hidden.gem|highly-rated|wallet-friendly|!/i;
    for (const p of mentah as { id: string; name: string; desc_id: string; desc_en: string; signature: string }[]) {
      expect(p.desc_id, p.id).not.toMatch(LARANG_ID);
      expect(p.signature, p.id).not.toMatch(LARANG_ID);
      expect(p.desc_en, p.id).not.toMatch(LARANG_EN);
    }
    expect(places.find((p) => p.id === "mie-terempak")?.name).toBe("Mie Terempa'K (Mie Tarempa Sungai Panas)");
    expect(places.find((p) => p.id === "mie-ayam-gerobakan-legendaris")?.name).toBe("Mie Ayam Gerobakan Legendaris");
  });

  it("nama area tampil tanpa garis miring, berkas datanya tetap untuk konversi", () => {
    expect(areaTampil.find((a) => a.id === "nagoya-lubuk-baja")?.name).toBe("Nagoya, Lubuk Baja");
    expect(areas.find((a: { id: string }) => a.id === "nagoya-lubuk-baja").name).toBe("Nagoya / Lubuk Baja");
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
    expect(saring(places, s({ labels: ["hits"] }), null)).toHaveLength(3);
    // Antarkelompok AND, dalam satu kelompok OR.
    expect(saring(places, s({ cats: ["sup-ikan", "bakso"] }), null)).toHaveLength(12);
    const gabung = saring(places, s({ halal: ["halal"], cats: ["sup-ikan"] }), null);
    expect(gabung.every((p) => p.halal === "halal" && p.category === "sup-ikan")).toBe(true);
  });

  it("saringan baru: sarapan, larut, bayar, dan harga di bawah Rp50 ribu", () => {
    expect(saring(places, s({ waktu: ["sarapan"] }), null).every((p) => bukaPagi(p.hours))).toBe(true);
    expect(saring(places, s({ waktu: ["larut"] }), null).every((p) => bukaLarut(p.hours))).toBe(true);
    expect(saring(places, s({ bayar: ["card"] }), null).every((p) => p.payments.includes("card"))).toBe(true);
    const murah = saring(places, s({ murah: true }), null);
    expect(murah.length).toBeGreaterThan(0);
    expect(murah.every((p) => (hargaTertinggi(p.price_idr) ?? Infinity) <= 50000)).toBe(true);
  });

  it("urutan: buka paling larut dan harga terendah, data kosong di belakang", () => {
    const larut = saring(places, s({ sort: "larut" }), null);
    expect(larut.at(-1)?.hours).toBe("");
    const harga = saring(places, s({ sort: "harga" }), null);
    expect(hargaTertinggi(harga[0].price_idr)).not.toBeNull();
    expect(hargaTertinggi(harga.at(-1)?.price_idr ?? "")).toBeNull();
  });

  it("saringan bolak-balik lewat alamat", () => {
    const awal = s({
      query: "gonggong",
      cats: ["seafood-gonggong"],
      areas: ["bengkong"],
      halal: ["muslim-friendly"],
      tiers: ["$$$"],
      labels: ["wajib-coba"],
      waktu: ["larut"],
      bayar: ["card"],
      murah: true,
      ferry: "harbour-bay",
      openNow: true,
      sort: "larut",
    });
    expect(bacaAlamat(tulisAlamat(awal))).toEqual(awal);
    expect(tulisAlamat(EMPTY)).toBe("");
    expect(tautanPeta({ halal: ["halal"], openNow: true })).toBe("/makan/peta?halal=halal&buka=1");
    // Kode lama tidak bocor ke alamat, dan lokasi pengguna tidak pernah ikut.
    expect(tulisAlamat(s({ labels: ["hidden-gem", "hits"] }))).toBe("?label=jarang,populer");
    expect(tulisAlamat(s({ userLoc: { lat: 1, lng: 104 }, sort: "nearby" }))).toBe("");
  });

  it("alamat asing tidak merusak saringan", () => {
    const r = bacaAlamat("?halal=entah&hidangan=entah&urut=entah&waktu=entah&bayar=entah");
    expect(r).toEqual(EMPTY);
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

  it("pencarian menerima ejaan lama dan nama kategori", () => {
    const ids = (query: string) => saring(places, s({ query }), null).map((p) => p.id);
    expect(ids("mie tarempa")).toContain("mie-terempak");
    expect(ids("mi tarempa")).toContain("mie-terempak");
    expect(ids("sop ikan")).toContain("yong-kee-istimewa");
    expect(ids("seafood")).toContain("golden-prawn-933");
    expect(ids("makanan laut")).toContain("golden-prawn-933");
    expect(ids("Kafe dan kedai kopi")).toContain("anchor-cafe-roastery");
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
    // Kurs di data/makan/kurs.json: S$1 = Rp14.187, RM1 = Rp4.461.
    expect(convertPrice("Rp150.000–350.000", "IDR")).toBe("");
    expect(convertPrice("Rp150.000–350.000", "SGD")).toBe("≈ S$11—25");
    expect(convertPrice("Rp150.000–350.000", "MYR")).toBe("≈ RM34—78");
    expect(convertPrice("mulai Rp70.000", "SGD")).toBe("≈ S$5+");
    expect(convertPrice("Rp20.000–50.000", "SGD", "id")).toBe("≈ S$1,5—3,5");
    expect(convertPrice("Rp20.000–50.000", "SGD", "en")).toBe("≈ S$1.5—3.5");
    expect(convertPrice("Rp3.000/pc atau Rp80.000/25 pc", "SGD")).toBe("");
    expect(convertPrice("", "SGD")).toBe("");
  });

  it("harga ringkas tidak mengubah makna", () => {
    expect(hargaRingkas("Rp150.000–350.000")).toBe("Rp150—350 ribu");
    expect(hargaRingkas("Rp150.000–350.000", "en")).toBe("Rp150—350k");
    expect(hargaRingkas("Rp75.000")).toBe("Rp75 ribu");
    expect(hargaRingkas("Rp60.000/kotak")).toBe("Rp60.000 per kotak");
    expect(hargaRingkas("mulai Rp19.000")).toBe("Mulai Rp19.000");
    expect(hargaRingkas("Rp3.000/pc atau Rp80.000/25 pc")).toBe("Rp3.000 per buah atau Rp80.000 per 25 buah");
    expect(hargaRingkas("")).toBe("");
  });

  it("harga tertinggi hanya dari kisaran bersatuan sama", () => {
    expect(hargaTertinggi("Rp20.000–50.000")).toBe(50000);
    expect(hargaTertinggi("Rp75.000")).toBe(75000);
    expect(hargaTertinggi("Rp60.000/kotak")).toBeNull();
    expect(hargaTertinggi("mulai Rp19.000")).toBeNull();
    expect(hargaTertinggi("")).toBeNull();
  });

  it("jam: SGT satu jam di depan, sarapan, dan buka larut", () => {
    expect(jamSgt("09.30–23.00")).toBe("10.30—00.00 SGT");
    expect(jamSgt("24 jam")).toBe("");
    expect(keSgt("23.30")).toBe("00.30");
    expect(bukaPagi("07.00–21.00")).toBe(true);
    expect(bukaPagi("08.00–14.00 (Senin–Sabtu)")).toBe(true);
    expect(bukaPagi("07.00")).toBe(true);
    expect(bukaPagi("10.00–21.00")).toBe(false);
    expect(bukaPagi("")).toBe(false);
    expect(bukaLarut("10.30–00.30")).toBe(true);
    expect(bukaLarut("16.00–24.00")).toBe(true);
    expect(bukaLarut("24 jam")).toBe(true);
    expect(bukaLarut("10.00–22.00")).toBe(false);
    expect(bukaLarut("")).toBe(false);
  });

  it("plus code dibuang dari alamat, sisanya tetap", () => {
    expect(alamatBersih("525P+RX9, Jl. Golden City Jaya, Bengkong")).toBe("Jl. Golden City Jaya, Bengkong");
    expect(alamatBersih("Jl. Imam Bonjol, Nagoya")).toBe("Jl. Imam Bonjol, Nagoya");
  });

  it("harga dari price_idr: kisaran bertanda pisah, tanpa menambah satuan", () => {
    expect(formatHarga("Rp150.000–350.000")).toBe("Rp150.000—Rp350.000");
    expect(formatHarga("Rp75.000")).toBe("Rp75.000");
    expect(formatHarga("mulai Rp19.000")).toBe("Mulai Rp19.000");
    expect(formatHarga("mulai Rp88.000 net", "en")).toBe("From Rp88.000 net");
    expect(formatHarga("Rp60.000/kotak")).toBe("Rp60.000 per kotak");
    expect(formatHarga("Rp120.000–350.000/box")).toBe("Rp120.000—Rp350.000 per kotak");
    expect(formatHarga("Rp120.000–350.000/box", "en")).toBe("Rp120.000—Rp350.000 per box");
    expect(formatHarga("Rp3.000/pc atau Rp80.000/25 pc")).toBe("Rp3.000 per buah atau Rp80.000 per 25 buah");
    expect(formatHarga("Rp3.000/pc atau Rp80.000/25 pc", "en")).toBe("Rp3.000 per piece or Rp80.000 per 25 pieces");
    expect(formatHarga("")).toBe("");
    for (const p of places) expect(formatHarga(p.price_idr), p.id).not.toMatch(/[–/$]/);
  });

  it("jam untuk dibaca: tanda pisah dan zona waktu", () => {
    expect(formatJam("09.30–23.00")).toBe("09.30—23.00 WIB");
    expect(formatJam("24 jam")).toBe("24 jam");
    expect(formatJam("24 jam", "en")).toBe("24 hours");
    expect(formatJam("07.00")).toBe("07.00 WIB");
    expect(formatJam("08.00–14.00 (Senin–Sabtu)")).toBe("08.00—14.00 WIB (Senin—Sabtu)");
    expect(formatJam("06.15–13.00 (Senin tutup)", "en")).toBe("06.15—13.00 WIB (closed Monday)");
    expect(formatJam("10.00–19.00 (Jumat–Minggu hingga 20.00)")).toBe("10.00—19.00 WIB (Jumat—Minggu sampai 20.00 WIB)");
    expect(formatJam("")).toBe("");
    for (const p of places) expect(formatJam(p.hours), p.id).not.toMatch(/[–:]/);
  });

  it("bahan kalimat jam buka", () => {
    expect(statusJam("10.00–21.00", wib("2026-11-04T12:00:00"))).toEqual({ buka: true, jam: "21.00" });
    expect(statusJam("10.00–21.00", wib("2026-11-04T22:00:00"))).toEqual({ buka: false, jam: "10.00" });
    expect(statusJam("10.00–19.00 (Jumat–Minggu hingga 20.00)", wib("2026-11-06T12:00:00"))).toEqual({ buka: true, jam: "20.00" });
    expect(statusJam("10.00–19.00 (Jumat–Minggu hingga 20.00)", wib("2026-11-04T12:00:00"))).toEqual({ buka: true, jam: "19.00" });
    expect(statusJam("24 jam", wib("2026-11-04T03:00:00"))).toEqual({ buka: true, jam: null });
    expect(statusJam("07.00", wib("2026-11-04T08:00:00"))).toBeNull();
    expect(statusJam("", wib("2026-11-04T08:00:00"))).toBeNull();
  });

  it("bulan pemeriksaan data", () => {
    expect(formatBulan("2026-06")).toBe("Juni 2026");
    expect(formatBulan("2026-06", "en")).toBe("June 2026");
    expect(formatBulan("bukan-tanggal")).toBe("bukan-tanggal");
  });

  it("jarak", () => {
    expect(formatKmDesimal(0.7)).toBe("0,7 km");
    expect(formatKmDesimal(2.8, "en")).toBe("2.8 km");
    expect(formatKm(0.65)).toBe("650 m");
    expect(formatKm(2.1)).toBe("2,1 km");
    expect(formatKm(2.1, "en")).toBe("2.1 km");
  });
});

describe("tautan daftar tersimpan", () => {
  it("bolak-balik lewat tautan", () => {
    const url = buatTautan("https://contoh.test", ["a-b", "c"]);
    expect(url).toBe("https://contoh.test/makan/simpanan?simpan=a-b,c");
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
      layers: [{ id: "background", type: "background" }, ...lapisanPin("light")],
    };
    const hasil = gabungGayaMakan(lama, baru, "dark");
    expect(Object.keys(hasil.sources).sort()).toEqual(["mk-pin", "protomaps"]);
    expect((hasil.sources.protomaps as { url: string }).url).toBe("pmtiles://x");
    expect(hasil.layers.map((l) => l.id)).toEqual(["background", ...lapisanPin("dark").map((l) => l.id)]);
    const pilih = hasil.layers.find((l) => l.id === "mk-pilih-titik") as { paint: Record<string, unknown> };
    expect(pilih.paint["circle-stroke-color"]).toBe(PALET.dark.ink);
  });

  it("tanpa gaya lama, gaya baru dipakai apa adanya", () => {
    expect(gabungGayaMakan(undefined, baru, "light")).toBe(baru);
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

describe("hidangan dan rumpun", () => {
  it("17 hidangan masuk tepat satu rumpun dan punya gambar", () => {
    const dariRumpun = RUMPUN.flatMap((r) => r.kategori);
    expect(new Set(dariRumpun).size).toBe(dariRumpun.length);
    expect([...dariRumpun].sort()).toEqual(categories.map((c) => c.id).sort());
    for (const c of categories) {
      expect(existsSync(`public/grafis/hidangan/${c.id}.webp`), c.id).toBe(true);
      expect(kategoriDariSlug(slugHidangan(c.id))).toBe(c.id);
    }
    expect(semuaSlugHidangan).toHaveLength(17);
    expect(kategoriDariSlug("tidak-ada")).toBeUndefined();
  });

  it("rumpun membentuk baris enam ubin", () => {
    // Laut 3 + Roti 2 + Kopi 1, Tionghoa 5 + Bawa 1, Nusantara 5 + ubin Semua.
    expect(RUMPUN.map((r) => r.kategori.length)).toEqual([3, 2, 1, 5, 1, 5]);
  });
});

describe("panduan", () => {
  it("semua panduan punya isi, id unik, dan judul tiga bahasa", () => {
    const ids = panduan.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const g of panduan) {
      expect(g.tempat.length, g.id).toBeGreaterThan(0);
      for (const l of ["id", "en", "zh"] as const) {
        expect(g.judul(l), g.id).not.toBe("");
        expect(g.dek(l), g.id).not.toBe("");
      }
    }
  });

  it("jalur berurut dan punya gambar lebar, daftar hitungan mengikuti data", () => {
    const jalur = panduan.filter((g) => g.berurut);
    expect(jalur).toHaveLength(5);
    for (const g of jalur) expect(existsSync(`public${g.grafis}`), g.id).toBe(true);
    expect(getPanduan("sarapan")?.tempat.every((p) => bukaPagi(p.hours))).toBe(true);
    expect(getPanduan("lewat-pukul-22")?.tempat.every((p) => bukaLarut(p.hours))).toBe(true);
    expect(getPanduan("legendaris")?.tempat.every((p) => p.labels.includes("legendaris"))).toBe(true);
    expect(getPanduan("tidak-ada")).toBeUndefined();
    expect(panduanUntuk("golden-prawn-933").map((g) => g.id)).toContain("seafood-classics");
  });

  it("tempat terdekat tidak memuat tempat itu sendiri", () => {
    const p = places[0];
    const r = tempatTerdekat(p, 3);
    expect(r).toHaveLength(3);
    expect(r.map((x) => x.id)).not.toContain(p.id);
  });
});

describe("galeri", () => {
  it("mosaik paling banyak lima foto", () => {
    expect(polaMosaik(0)).toBe(0);
    expect(polaMosaik(3)).toBe(3);
    expect(polaMosaik(5)).toBe(5);
    expect(polaMosaik(12)).toBe(5);
  });
});

describe("peta cetak", () => {
  it("semua tempat dan terminal masuk potongan peta", async () => {
    const { POTONGAN, titik } = await import("@/features/makan/components/PetaCetak");
    for (const p of [...places, ...ferries]) {
      const { x, y } = titik(p.lat, p.lng);
      expect(x, p.id).toBeGreaterThan(POTONGAN.x);
      expect(x, p.id).toBeLessThan(POTONGAN.x + POTONGAN.w);
      expect(y, p.id).toBeGreaterThan(POTONGAN.y);
      expect(y, p.id).toBeLessThan(POTONGAN.y + POTONGAN.h);
    }
  });
});
