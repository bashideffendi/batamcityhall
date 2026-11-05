import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import acara from "@/data/budaya/acara.json";
import kamus from "@/data/budaya/kamus.json";
import komunitas from "@/data/budaya/komunitas.json";
import tradisi from "@/data/budaya/tradisi_melayu.json";
import tempat from "@/data/places.json";
import { buatPencariKata, hurufDari } from "@/features/budaya/cari";
import {
  adaCatatanPublik,
  belumDiperiksaPenutur,
  daftarAcara,
  daftarKata,
  daftarKomunitas,
  daftarTempatAcara,
  daftarTradisi,
  ISTILAH_ETNIS_LAMA,
  adaKonteksKata,
  kanalKomunitas,
  PENGANTAR_BUDAYA,
  statusAcara,
  tanggalTidakPasti,
} from "@/features/budaya/data";
import { BULAN, bulanWib, KELOMPOK_ACARA, KELOMPOK_KATA, LABEL_STATUS, STATUS_ACARA } from "@/features/budaya/label";
import { rapiTeks } from "@/features/sejarah/rapi";

const baca = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

// Yang tidak boleh sampai ke warga: ikon sebagai status, dan kalimat untuk penyusun.
const IKON = /[⚠✅❌⌛]/;
const INSTRUKSI =
  /jangan dimasukkan|jangan kunci|pakai versi|rekomendasi konten|catatan_laporan|asal_data|\bseed\b|perlu dicek ke|laporan \d|\bTODO\b/i;

const idSama = (a: { id: string }[], b: { id: string }[]) =>
  expect(a.map((x) => x.id).sort()).toEqual(b.map((x) => x.id).sort());

describe("kalender acara", () => {
  const daftar = daftarAcara();

  it("semua acara di file data tampil, tanpa dobel", () => {
    expect(daftar).toHaveLength(acara.length);
    idSama(daftar, acara);
    expect(new Set(daftar.map((a) => a.id)).size).toBe(acara.length);
  });

  it("urut berdasarkan bulan, bukan urutan array; tanpa bulan di akhir", () => {
    const bulan = daftar.map((a) => a.bulan ?? 13);
    expect(bulan).toEqual([...bulan].sort((a, b) => a - b));
    expect(daftar.at(-1)?.id).toBe("ev-t02");
    const urut = daftar.map((a) => a.id);
    expect(urut.indexOf("ev-012")).toBeLessThan(urut.indexOf("ev-011"));
    // Dalam satu bulan: 2 Nov sebelum 28 Nov, 25 Des sebelum 31 Des, 2 Jul sebelum 12 Jul.
    expect(urut.indexOf("ev-t03")).toBeLessThan(urut.indexOf("ev-026"));
    expect(urut.indexOf("ev-t04")).toBeLessThan(urut.indexOf("ev-030"));
    expect(urut.indexOf("ev-011")).toBeLessThan(urut.indexOf("ev-013"));
  });

  it("tanggal per edisi sama dengan data, hanya penulisannya yang dirapikan", () => {
    for (const a of daftar) {
      const mentah = acara.find((x) => x.id === a.id);
      expect(a.edisi.map((e) => e.tanggal)).toEqual(mentah?.tabel.map((t) => rapiTeks(t.tanggal)));
    }
    const ksm = daftar.find((a) => a.id === "ev-011");
    expect(ksm?.edisi.map((e) => e.tanggal)).toEqual([
      "16—18 Mei 2025",
      "2—5 Juli 2026 (pembukaan 3 Juli, Didik Nini Thowok tampil)",
    ]);
  });

  it("acara tanpa hari dan bulan Masehi ditandai tidak pasti", () => {
    const tidakPasti = acara.filter(tanggalTidakPasti).map((a) => a.id);
    expect(tidakPasti.sort()).toEqual(["ev-002", "ev-009", "ev-014", "ev-017", "ev-023", "ev-t02"]);
  });

  it("status selalu dari kosakata yang sah, termasuk empat acara dari tabel", () => {
    for (const a of daftar) expect(STATUS_ACARA).toContain(a.status);
    const status = (id: string) => statusAcara(acara.find((a) => a.id === id)!);
    expect(status("ev-t01")).toBe("pernah");
    expect(status("ev-t02")).toBe("belum pasti");
    expect(status("ev-t03")).toBe("pernah");
    expect(status("ev-t04")).toBe("belum pasti");
    expect(status("ev-025")).toBe("dibatalkan");
    expect(status("ev-005")).toBe("belum pasti");
    expect(STATUS_ACARA.map((s) => LABEL_STATUS[s].teks)).toEqual([
      "Rutin",
      "Pernah Diadakan",
      "Belum Pasti",
      "Dibatalkan",
    ]);
  });

  it("acara batal dan tidak rutin tidak berlabel rutin atau tahunan", () => {
    for (const id of ["ev-021", "ev-025", "ev-t01", "ev-009"]) {
      const a = daftar.find((x) => x.id === id)!;
      expect(a.status).not.toBe("rutin");
      expect(JSON.stringify(a)).not.toMatch(/tahunan/i);
    }
  });

  it("semua kategori masuk kelompok filter, dan tiap kelompok ada isinya", () => {
    const dipakai = new Set(daftar.map((a) => a.kelompok));
    expect([...dipakai].sort()).toEqual(KELOMPOK_ACARA.map((k) => k.slug).sort());
    const keagamaan = daftar.filter((a) => a.kelompok === "keagamaan").map((a) => a.id);
    expect(keagamaan).toEqual(expect.arrayContaining(["ev-008", "ev-016", "ev-t02", "ev-t04"]));
  });

  it("acara keagamaan dan lunar menulis aturan kalendernya", () => {
    for (const id of ["ev-007", "ev-008", "ev-009", "ev-010", "ev-014", "ev-t02"]) {
      expect(daftar.find((a) => a.id === id)?.pola).toMatch(/^Mengikuti/);
    }
  });

  it("bentuk publik bebas ikon dan instruksi penyusun", () => {
    const teks = JSON.stringify(daftar);
    expect(teks).not.toMatch(IKON);
    expect(teks).not.toMatch(INSTRUKSI);
    expect(daftar.some((a) => "tabel" in a || "catatan_laporan" in a || "asal_data" in a)).toBe(false);
  });

  it("setiap acara bercatatan laporan punya catatan publik", () => {
    for (const a of acara) {
      if (a.catatan_laporan?.length) expect(adaCatatanPublik(a.id), a.id).toBe(true);
    }
  });

  it("angka umat Hindu tampil sebagai perkiraan pengurus, bukan data resmi", () => {
    const a = daftar.find((x) => x.id === "ev-008")!;
    expect(a.catatan.join(" ")).toMatch(/perkiraan pengurus, bukan data resmi/);
  });

  it("acara kampung tua tidak menyebut batas, luas, atau status lahan", () => {
    for (const id of ["ev-013", "ev-014"]) {
      expect(JSON.stringify(daftar.find((a) => a.id === id))).not.toMatch(
        /sengketa|\bluas\b|\bbatas\b|status lahan|hektar/i,
      );
    }
  });

  it("sumber dan tautannya tidak sampai ke browser", () => {
    expect(JSON.stringify(daftar)).not.toMatch(/https?:|\.go\.id|sumber sekunder/i);
    for (const a of daftar) expect("sumber" in a, a.id).toBe(false);
  });

  it("tautan tempat menunjuk tempat yang benar-benar ada di direktori", () => {
    for (const t of daftarTempatAcara()) {
      const p = tempat.find((x) => x.id === t.id);
      expect(p?.nama, t.id).toBe(t.nama);
    }
  });

  it("nama bulan lengkap dan bulan WIB benar di pergantian bulan", () => {
    expect(BULAN).toHaveLength(12);
    expect(bulanWib(new Date("2026-10-31T17:30:00Z"))).toBe(11);
    expect(bulanWib(new Date("2026-10-31T16:30:00Z"))).toBe(10);
  });
});

describe("data mentah", () => {
  it("bebas emoji status", () => {
    for (const isi of [
      acara.map((a) => [a.nama, a.lokasi, a.penyelenggara, a.tabel.map((t) => [t.status, t.lokasi])]),
      komunitas,
      tradisi,
    ]) {
      expect(JSON.stringify(isi)).not.toMatch(IKON);
    }
  });
});

describe("kamus", () => {
  const daftar = daftarKata();

  it("semua kata di file data tampil", () => {
    expect(daftar).toHaveLength(kamus.length);
    idSama(daftar, kamus);
  });

  it("urut alfabet dan setiap entri punya huruf", () => {
    const kata = daftar.map((k) => k.kata.toLowerCase());
    expect(kata).toEqual([...kata].sort((a, b) => a.localeCompare(b, "id")));
    for (const k of daftar) expect(hurufDari(k.kata)).toMatch(/^[A-Z]$/);
  });

  it("entri bertanda [P] diberi tanda bintang, termasuk yang artinya saja", () => {
    expect(daftar.filter((k) => k.belumDiperiksa)).toHaveLength(kamus.filter((k) => k.catatan.includes("[P]")).length);
    expect(belumDiperiksaPenutur("[P] kasual")).toBe(true);
    expect(belumDiperiksaPenutur("[S] istilah; arti [P]")).toBe(true);
    expect(belumDiperiksaPenutur("[S]")).toBe(false);
    expect(belumDiperiksaPenutur("[S] istilah lama")).toBe(false);
  });

  it("arti ditulis tanpa garis miring, contoh tanpa tanda seru", () => {
    for (const k of daftar) {
      expect(k.arti, k.id).not.toMatch(/\//);
      expect(k.contoh ?? "", k.id).not.toContain("!");
    }
    expect(daftar.find((k) => k.id === "k-001")?.arti).toBe("rumah liar");
  });

  it("enam kelompok terisi semua", () => {
    const dipakai = new Set(daftar.map((k) => k.kelompok));
    expect([...dipakai].sort()).toEqual(KELOMPOK_KATA.map((k) => k.slug).sort());
  });

  it("label asal: Melayu Kepri hanya bila data menulis begitu", () => {
    const label = (kata: string) => daftar.find((k) => k.kata === kata)?.labelRagam;
    expect(label("pompong")).toBe("Melayu Kepri");
    expect(label("tekong")).toBe("Melayu");
    expect(label("ruli")).toBe("Bahasa Batam");
    expect(label("kopitiam")).toBe("Bahasa Batam");
  });

  it("istilah etnis lama yang merendahkan tidak tampil tanpa konteks", () => {
    for (const k of kamus) {
      if (ISTILAH_ETNIS_LAMA.test(`${k.kata} ${k.arti} ${k.contoh}`)) expect(adaKonteksKata(k.id), k.id).toBe(true);
    }
  });

  it("pencarian menemukan kata, arti, dan salah ketik kecil", () => {
    const cari = buatPencariKata(daftar);
    expect(cari("pompong").has("k-003")).toBe(true);
    expect(cari("ayo").has("k-050")).toBe(true);
    expect(cari("pompng").has("k-003")).toBe(true);
    expect(cari("hokkien").size).toBeGreaterThan(0);
    expect(cari("xyzzy").size).toBe(0);
  });

  it("bebas ikon dan tanda mentah", () => {
    const teks = JSON.stringify(daftar);
    expect(teks).not.toMatch(IKON);
    expect(teks).not.toMatch(/\[[SP]\]/);
  });
});

describe("budaya Melayu", () => {
  const daftar = daftarTradisi();

  it("semua tradisi tampil", () => {
    expect(daftar).toHaveLength(tradisi.length);
    idSama(daftar, tradisi);
  });

  it("file md dan json memuat tradisi yang sama, pengantar diambil dari md", () => {
    const md = baca("data/budaya/budaya_melayu.md");
    const baris = md.split("\n").filter((b) => b.startsWith("| **"));
    expect(baris).toHaveLength(tradisi.length);
    for (const t of tradisi) expect(md).toContain(`**${t.nama}**`);
    expect(md).toContain(PENGANTAR_BUDAYA.tuanRumah);
    expect(md).toContain(PENGANTAR_BUDAYA.panggung);
  });

  it("instruksi penyusun tidak ikut tampil", () => {
    const teks = JSON.stringify(daftar);
    expect(teks).not.toMatch(IKON);
    expect(teks).not.toMatch(INSTRUKSI);
    const halaman = baca("app/cerita/budaya/page.tsx");
    expect(halaman).not.toMatch(/Rekomendasi konten/);
  });

  it("tradisi tanpa sumber tetap tampil dengan label belum terverifikasi, tanpa tautan", () => {
    for (const t of daftar) {
      const mentah = tradisi.find((x) => x.id === t.id)!;
      expect(["Tercatat", "Belum Terverifikasi"], t.id).toContain(t.status.teks);
      if (!mentah.sumber_url.length) expect(t.status.teks).toBe("Belum Terverifikasi");
    }
    expect(daftar.find((t) => t.id === "tr-007")?.status.teks).toBe("Belum Terverifikasi");
    expect(daftar.find((t) => t.id === "tr-001")?.status.teks).toBe("Tercatat");
    expect(JSON.stringify(daftar)).not.toMatch(/https?:|\.go\.id/);
  });

  it("tidak mengklaim asli Batam", () => {
    expect(JSON.stringify(daftar)).not.toMatch(/asli Batam/i);
  });
});

describe("komunitas", () => {
  const daftar = daftarKomunitas();

  it("semua komunitas tampil, termasuk anggota entri gabungan", () => {
    expect(daftar).toHaveLength(komunitas.length);
    idSama(daftar, komunitas);
    for (const k of komunitas) {
      if (k.anggota) expect(daftar.find((x) => x.id === k.id)?.anggota).toEqual(k.anggota);
    }
  });

  it("kanal hanya tampil bila status persis terverifikasi", () => {
    const berkanal = daftar.filter((k) => k.kanal).map((k) => k.id);
    expect(berkanal).toEqual(["kom-001", "kom-004", "kom-010"]);
    for (const k of daftar) expect(k.kanal?.href ?? "", k.id).not.toMatch(/\.go\.id/);
    const akun = daftar.flatMap((k) => (k.kanal?.teks.startsWith("Instagram") ? [k.kanal.teks] : []));
    expect(akun).toEqual(["Instagram @sukalaribatam", "Instagram @batam_10k"]);
    expect(kanalKomunitas({ kontak_publik: "IG @akun_belum_dicek", status: "Belum Terverifikasi" })).toBeNull();
    expect(kanalKomunitas({ kontak_publik: "runningcrews.com", status: "Belum Terverifikasi" })).toBeNull();
    expect(kanalKomunitas({ kontak_publik: "kebudayaan.kemdikbud.go.id/bpnbkepri", status: "Tercatat" })).toBeNull();
  });

  it("tidak ada nomor HP, email, atau WhatsApp", () => {
    const teks = JSON.stringify(daftar);
    expect(teks).not.toMatch(/(\+62|\b08)\d{7,}/);
    expect(teks).not.toMatch(/[\w.]+@[\w-]+\.[a-z]{2,}/i);
    expect(teks).not.toMatch(/wa\.me|whatsapp/i);
  });

  it("bebas ikon", () => {
    expect(JSON.stringify(daftar)).not.toMatch(IKON);
  });

  it("sumber_rekomendasi_warga.json tidak dipakai halaman mana pun", () => {
    for (const berkas of [
      "features/budaya/data.ts",
      "app/komunitas/page.tsx",
      "app/things-to-do/page.tsx",
      "app/cerita/kamus/page.tsx",
      "app/cerita/budaya/page.tsx",
    ]) {
      expect(baca(berkas)).not.toMatch(/sumber_rekomendasi_warga/);
    }
  });
});
