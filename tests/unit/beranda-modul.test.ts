import { describe, expect, it } from "vitest";
import { daftarKata } from "@/features/budaya/data";
import { DATASET } from "@/features/dataset/data";
import { angkaBeranda, keAngka } from "@/features/hari-ini/angka-beranda";
import { indeksKata, ringkasKata, tanggalWib } from "@/features/hari-ini/kata-hari-ini";
import { INFOGRAFIK_REPO } from "@/features/infografik/data";
import { ENTRI_FERI } from "@/features/jalan/feri-data";
import {
  keberangkatanBerikutnya,
  keMenit,
  normalisasi,
  tanggalDataTertua,
  type JadwalMentah,
  type RuteMentah,
} from "@/features/jalan/feri-terakhir";

/** Jam dinding WIB menjadi Date. 5 Nov 2026 hari Kamis, 7 Nov Sabtu, 9 Nov Senin. */
const wib = (tgl: string, jam: string) => new Date(`${tgl}T${jam}:00+07:00`);

describe("Feri ke Singapura di beranda", () => {
  const rute: RuteMentah = { id: "x", asal_id: "a", tujuan: "HarbourFront", operator: ["Op"], jenis: "internasional" };
  const jadwal = (j: Partial<JadwalMentah>): JadwalMentah => ({
    rute_id: "x",
    arah: "Terminal A -> HarbourFront (Op, WIB)",
    jam_berangkat: ["06:00", "09:00", "12:00", "15:00", "18:00"],
    tanggal_data: "2026-11-01",
    zona_waktu: "Asia/Jakarta",
    ...j,
  });

  it("tiga jam berikutnya, berurutan, tanpa jam yang sudah lewat", () => {
    const [b] = keberangkatanBerikutnya(normalisasi([jadwal({})], [rute]), wib("2026-11-05", "08:30"));
    expect(b.jam).toEqual(["09:00", "12:00", "15:00"]);
    expect(b.besok).toBeNull();
  });

  it("jam yang sama dari dua operator ditulis sekali", () => {
    const entri = normalisasi(
      [jadwal({}), jadwal({ arah: "Terminal A -> HarbourFront (Op2, WIB)", jam_berangkat: ["09:00", "10:30"] })],
      [rute],
    );
    const [b] = keberangkatanBerikutnya(entri, wib("2026-11-05", "08:30"));
    expect(b.jam).toEqual(["09:00", "10:30", "12:00"]);
    expect(b.operator).toEqual(["Op", "Op2"]);
  });

  it("setelah jam terakhir: habis, dengan jam pertama besok", () => {
    const [b] = keberangkatanBerikutnya(normalisasi([jadwal({})], [rute]), wib("2026-11-05", "19:00"));
    expect(b.jam).toEqual([]);
    expect(b.besok).toBe("06:00");
  });

  it("jadwal yang diragukan, contoh, dan berzona lain tidak dipakai", () => {
    const entri = normalisasi(
      [
        jadwal({ status_data: "perlu_cek_ulang", jam_berangkat: ["09:30"] }),
        jadwal({ hari: "contoh Senin 2 Nov 2026", jam_berangkat: ["09:45"] }),
        jadwal({ zona_waktu: "Asia/Singapore", jam_berangkat: ["09:50"] }),
      ],
      [rute],
    );
    expect(keberangkatanBerikutnya(entri, wib("2026-11-05", "08:30"))).toEqual([]);
  });

  it("rute akhir pekan tidak tampil di hari kerja, tampil di hari Sabtu", () => {
    const entri = normalisasi([jadwal({ hari: "Sab–Min" })], [rute]);
    expect(keberangkatanBerikutnya(entri, wib("2026-11-05", "08:30"))).toEqual([]);
    expect(keberangkatanBerikutnya(entri, wib("2026-11-07", "08:30"))[0].jam).toEqual(["09:00", "12:00", "15:00"]);
  });

  it("data nyata: hanya dari Batam ke Singapura, jam setelah sekarang, paling banyak tiga", () => {
    const now = wib("2026-11-05", "12:00");
    const baris = keberangkatanBerikutnya(ENTRI_FERI, now);
    expect(baris.length).toBeGreaterThanOrEqual(4);
    for (const b of baris) {
      expect(b.tujuan, b.asal).toMatch(/HarbourFront|Tanah Merah/);
      expect(b.asal).not.toMatch(/HarbourFront|Tanah Merah|Gold Coast/);
      expect(b.jam.length).toBeLessThanOrEqual(3);
      expect(b.jam.every((j) => keMenit(j) >= 12 * 60)).toBe(true);
      expect([...b.jam].sort((x, y) => keMenit(x) - keMenit(y))).toEqual(b.jam);
      expect(b.operator.join(" ")).not.toMatch(/Majestic/);
    }
    expect(baris.map((b) => b.asal)).toEqual(expect.arrayContaining(["Batam Centre", "Harbour Bay", "Sekupang"]));
    expect(tanggalDataTertua(baris)).toMatch(/^2026-/);
  });
});

describe("Batam dalam Angka di beranda", () => {
  const angka = angkaBeranda();

  it("empat angka, masing-masing menaut ke halaman yang ada", () => {
    expect(angka).toHaveLength(4);
    const slug = new Set(INFOGRAFIK_REPO.map((i) => `/infografik/${i.slug}`));
    for (const a of angka) if (a.href.startsWith("/infografik/")) expect(slug.has(a.href), a.href).toBe(true);
  });

  it("angka dihitung dari data, bukan diketik", () => {
    expect(keAngka("2.791,09 km²")).toBeCloseTo(2791.09);
    expect(keAngka("1.394.459")).toBe(1394459);
    const [penduduk, laut, wisman, kecamatan] = angka;
    expect(penduduk.nilai).toBe("1,30—1,39 juta");
    expect(laut.nilai).toBe("±73%");
    expect(wisman.nilai).toBe("1.613.202");
    expect(kecamatan.nilai).toBe("12");
    expect(kecamatan.ket).toBe("64 kelurahan");
  });

  it("jumlah dataset untuk tautan Dataset", () => {
    expect(DATASET.length).toBeGreaterThan(900);
  });
});

describe("Kata Hari Ini", () => {
  const daftar = daftarKata().map(ringkasKata);

  it("tanggal menurut WIB, bukan UTC", () => {
    expect(tanggalWib(new Date("2026-11-08T17:30:00Z"))).toBe("2026-11-09");
    expect(tanggalWib(new Date("2026-11-08T16:30:00Z"))).toBe("2026-11-08");
  });

  it("satu kata per hari, berganti tiap hari, berputar di seluruh kamus", () => {
    const n = daftar.length;
    const a = indeksKata("2026-11-09", n);
    expect(indeksKata("2026-11-09", n)).toBe(a);
    expect(indeksKata("2026-11-10", n)).toBe((a + 1) % n);
    const terpakai = new Set(Array.from({ length: n }, (_, i) => indeksKata(`2026-01-${String(1 + (i % 28)).padStart(2, "0")}`, n)));
    expect(terpakai.size).toBe(Math.min(n, 28));
  });

  it("yang dikirim ke peramban tanpa sumber dan tanpa catatan penyusun", () => {
    for (const k of daftar) {
      expect(Object.keys(k).sort()).toEqual(["arti", "belumDiperiksa", "contoh", "id", "kata", "konteks", "labelRagam"]);
      expect(JSON.stringify(k)).not.toMatch(/https?:|\[S\]|\[P\]/);
    }
  });
});
