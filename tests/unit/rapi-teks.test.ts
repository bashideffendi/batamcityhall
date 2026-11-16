import { describe, expect, it } from "vitest";
import { jamPublik } from "@/features/direktori/data";
import { hariPublik, teksTanggal as teksTanggalFeri } from "@/features/jalan/feri-terakhir";
import { rapiTeks } from "@/features/sejarah/rapi";
import { teksBulan, teksTanggal as teksTanggalTukang } from "@/features/tukang/aturan";
import {
  BULAN,
  BULAN_SINGKAT,
  bulanDekatAngka,
  bulanLengkap,
  HARI,
  HARI_SINGKAT,
  hariLengkap,
  jamBertitik,
  tanggalIndonesia,
  tulisTanggal,
} from "@/lib/rapi-teks";

// Satu tabel bulan dan hari untuk seluruh situs (PEDOMAN 2.6). Sebelum 16 Nov 2026 tabel ini ditulis ulang di sepuluh
// berkas dan aturannya mulai berbeda antarbagian.

describe("tabel bulan dan hari", () => {
  it("dua belas bulan dan tujuh hari, singkatan sejajar dengan nama lengkapnya", () => {
    expect(BULAN).toHaveLength(12);
    expect(BULAN_SINGKAT).toHaveLength(12);
    BULAN_SINGKAT.forEach((s, i) => expect(BULAN[i].startsWith(s.slice(0, 2))).toBe(true));
    expect(HARI).toHaveLength(7);
    // Urutan Date.getUTCDay(): 1 Januari 2026 hari Kamis.
    expect(HARI[new Date(Date.UTC(2026, 0, 1)).getUTCDay()]).toBe("Kamis");
    HARI_SINGKAT.forEach((s, i) => expect(HARI[i].startsWith(s)).toBe(true));
  });

  it("singkatan menjadi nama lengkap, termasuk ejaan Agt dan huruf kecil", () => {
    expect(bulanLengkap("Sep")).toBe("September");
    expect(bulanLengkap("Agt")).toBe("Agustus");
    expect(bulanLengkap("Mei")).toBe("Mei");
    expect(bulanLengkap("Xyz")).toBe("Xyz");
    expect(hariLengkap("Sen")).toBe("Senin");
    expect(hariLengkap("jum")).toBe("Jumat");
    expect(hariLengkap("MIN")).toBe("Minggu");
    expect(hariLengkap("Hari")).toBe("Hari");
  });
});

describe("kepingan perapian", () => {
  it("jam bertitik", () => {
    expect(jamBertitik("08:00 sampai 16:30")).toBe("08.00 sampai 16.30");
    expect(jamBertitik("rasio 1:2")).toBe("rasio 1:2");
  });

  it("bulan ditulis lengkap hanya bila menempel pada angka atau rentang", () => {
    expect(bulanDekatAngka("30 Apr 2017")).toBe("30 April 2017");
    expect(bulanDekatAngka("12 Sep")).toBe("12 September");
    expect(bulanDekatAngka("Sep 2026")).toBe("September 2026");
    expect(bulanDekatAngka("Jan—Mar")).toBe("Januari—Maret");
    expect(bulanDekatAngka("12 Agt 2024")).toBe("12 Agustus 2024");
    // Nama orang tidak ikut berubah.
    expect(bulanDekatAngka("Jan Pieterszoon dan Mar Hasan")).toBe("Jan Pieterszoon dan Mar Hasan");
  });

  it("tanggal tanpa nol di depan dan bulan lengkap", () => {
    expect(tulisTanggal(2026, 11, 5)).toBe("5 November 2026");
    expect(tulisTanggal("2026", 11)).toBe("November 2026");
    expect(tulisTanggal(2026, 13, 5)).toBe("5 2026");
    expect(tanggalIndonesia("2026-11-04")).toBe("4 November 2026");
    expect(tanggalIndonesia("sekitar 2026")).toBe("sekitar 2026");
  });
});

describe("bagian situs memakai aturan yang sama", () => {
  it("Direktori dan Sejarah menulis bulan yang sama dari singkatan yang sama", () => {
    expect(jamPublik({ jam_layanan: "Sen–Jum 08:00–16:00, sejak 12 Agt 2024" })).toBe(
      "Senin—Jumat 08.00—16.00 WIB, sejak 12 Agustus 2024",
    );
    expect(rapiTeks("diresmikan 12 Agt 2024")).toBe("diresmikan 12 Agustus 2024");
    expect(rapiTeks("17 Sep – 3 Okt 1883")).toBe("17 September—3 Oktober 1883");
  });

  it("jadwal feri, tanggal Tukang Langganan, dan Dataset memakai tabel yang sama", () => {
    expect(hariPublik("Sen-Jum, Jan–Mar; contoh 2 Agu 2026")).toBe("Senin—Jumat, Januari—Maret; contoh 2 Agustus 2026");
    expect(teksTanggalFeri("2026-08-02")).toBe("2 Agustus 2026");
    expect(teksTanggalFeri("2026-08")).toBe("Agustus 2026");
    expect(teksTanggalFeri("2026")).toBe("2026");
    expect(teksTanggalFeri(null)).toBe("tanggal tidak tercatat");
    expect(teksBulan("2026-03")).toBe("Maret 2026");
    expect(teksTanggalTukang("2026-03-09")).toBe("9 Maret 2026");
  });

  it("nomor telepon di teks bebas tidak dibaca sebagai rentang angka", () => {
    expect(jamPublik({ jam_layanan: "08.00-16.00, janji lewat 0778-322611" })).toBe("08.00—16.00 WIB, janji lewat 0778-322611");
    expect(jamPublik({ jam_layanan: "Hubungi 0812-3456-789 atau +62 778-322611" })).toBe("Hubungi 0812-3456-789 atau +62 778-322611");
  });
});
