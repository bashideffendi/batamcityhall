// Aturan Tukang Langganan sebagai fungsi murni (research/00 bagian 4). Tanpa node:crypto dan tanpa env.

export const MIN_PEREKOMENDASI = 2;
export const LABEL_CONTOH = "Contoh fiktif";
export const VERSI_PERSETUJUAN = "2026-11-draf";

export type StatusModerasi = "menunggu" | "disetujui" | "ditolak";

export type TukangBaris = {
  id: string;
  kunci: string;
  nama: string;
  jasa: string;
  areaKecamatan: string[];
  areaCatatan: string | null;
  panggilan: boolean;
  caraHubungi: string;
  statusModerasi: StatusModerasi;
  izinTukangAt: string | null;
  kontakBolehTampil: boolean;
  disembunyikan: boolean;
  terakhirDicek: string | null;
  dibuatAt: string;
};

export type RekomendasiBaris = {
  id: string;
  tukangId: string;
  cerita: string;
  tag: string[];
  kapanDipakai: string;
  kontakPerekomendasi: string;
  kontakHash: string;
  statusModerasi: StatusModerasi;
  dibuatAt: string;
};

/** Satu-satunya bentuk data tukang yang boleh sampai ke halaman publik. */
export type TukangPublik = {
  id: string;
  nama: string;
  jasa: string;
  areaKecamatan: string[];
  areaCatatan: string | null;
  panggilan: boolean;
  kontak: string | null;
  jumlahRekomendasi: number;
  cerita: { teks: string; tag: string[]; kapanDipakai: string }[];
  tag: { teks: string; jumlah: number }[];
  terakhirDicek: string | null;
  masihBuka: number;
  sudahPindah: number;
};

type Rek = Pick<RekomendasiBaris, "kontakHash" | "statusModerasi">;

/** Satu orang yang mengirim tiga kali tetap dihitung satu. Hanya rekomendasi yang disetujui. */
export function jumlahPerekomendasi(rekomendasi: readonly Rek[]): number {
  return new Set(rekomendasi.filter((r) => r.statusModerasi === "disetujui").map((r) => r.kontakHash)).size;
}

export type HasilSyarat = { boleh: boolean; jumlah: number; kurang: string[] };

/** Syarat tampil publik. Harus sama dengan view tukang_publik di supabase/migrations. */
export function syaratTampil(
  t: Pick<TukangBaris, "statusModerasi" | "izinTukangAt" | "disembunyikan">,
  rekomendasi: readonly Rek[],
): HasilSyarat {
  const jumlah = jumlahPerekomendasi(rekomendasi);
  const kurang: string[] = [];
  if (jumlah < MIN_PEREKOMENDASI) {
    kurang.push(`Butuh ${MIN_PEREKOMENDASI - jumlah} rekomendasi lagi dari warga berbeda`);
  }
  if (!t.izinTukangAt) kurang.push("Izin tukang belum dicatat");
  if (t.statusModerasi !== "disetujui") kurang.push("Belum disetujui moderator");
  if (t.disembunyikan) kurang.push("Disembunyikan sementara karena laporan");
  return { boleh: kurang.length === 0, jumlah, kurang };
}

export function ringkasTag(daftar: readonly string[][]): { teks: string; jumlah: number }[] {
  const hitung = new Map<string, number>();
  for (const tag of daftar) for (const t of new Set(tag)) hitung.set(t, (hitung.get(t) ?? 0) + 1);
  return [...hitung]
    .map(([teks, jumlah]) => ({ teks, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.teks.localeCompare(b.teks));
}

/**
 * Daftar putih kolom. Kontak perekomendasi, hash, dan kunci tidak disebut di sini, jadi tidak bisa bocor.
 * Mengembalikan null kalau syarat tampil belum terpenuhi.
 */
export function kePublik(
  t: TukangBaris,
  rekomendasi: readonly RekomendasiBaris[],
  sinyal: { masihBuka: number; sudahPindah: number },
): TukangPublik | null {
  if (!syaratTampil(t, rekomendasi).boleh) return null;
  const disetujui = rekomendasi.filter((r) => r.statusModerasi === "disetujui");
  return {
    id: t.id,
    nama: t.nama,
    jasa: t.jasa,
    areaKecamatan: t.areaKecamatan,
    areaCatatan: t.areaCatatan,
    panggilan: t.panggilan,
    kontak: t.kontakBolehTampil ? t.caraHubungi : null,
    jumlahRekomendasi: jumlahPerekomendasi(rekomendasi),
    cerita: disetujui.map((r) => ({ teks: r.cerita, tag: r.tag, kapanDipakai: r.kapanDipakai })),
    tag: ringkasTag(disetujui.map((r) => r.tag)),
    terakhirDicek: t.terakhirDicek,
    masihBuka: sinyal.masihBuka,
    sudahPindah: sinyal.sudahPindah,
  };
}

export function saringPublik(
  daftar: readonly TukangPublik[],
  f: { jasa?: string; kecamatan?: string },
): TukangPublik[] {
  return daftar.filter(
    (t) => (!f.jasa || t.jasa === f.jasa) && (!f.kecamatan || t.areaKecamatan.includes(f.kecamatan)),
  );
}

const BUKAN_ANGKA = /\D/g;

/** 0812-3456 7890, +62 812 3456 7890, dan 62812... dianggap orang yang sama. Surel tanpa beda huruf besar. */
export function normalKontak(kontak: string): string {
  const k = kontak.trim().toLowerCase();
  if (k.includes("@")) return k;
  const angka = k.replace(BUKAN_ANGKA, "");
  return angka.startsWith("0") ? `62${angka.slice(1)}` : angka;
}

export const kontakSah = (kontak: string) => {
  const k = kontak.trim();
  if (k.includes("@")) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(k);
  const n = normalKontak(k).length;
  return /^\+?[\d\s().-]+$/.test(k) && n >= 9 && n <= 15;
};

const kataNama = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/**
 * Pencocok kiriman kedua ke tukang yang sama: jasa + nomor bila ada, atau jasa + nama + kecamatan pertama.
 * Sengaja condong memisah: dua orang bernama sama yang tergabung akan memalsukan hitungan, sedangkan yang
 * terpisah bisa digabungkan moderator.
 */
export function kunciTukang(i: { jasa: string; nama: string; caraHubungi: string; areaKecamatan: string[] }): string {
  const angka = i.caraHubungi.replace(BUKAN_ANGKA, "");
  if (angka.length >= 9) return `${i.jasa}|hp|${normalKontak(angka)}`;
  return `${i.jasa}|nama|${kataNama(i.nama)}|${[...i.areaKecamatan].sort()[0] ?? ""}`;
}

/** Layar admin hanya menerima versi ini. Kontak lengkap hanya bisa dibaca langsung di basis data. */
export function samarkanKontak(kontak: string | null | undefined): string | null {
  if (!kontak) return null;
  const k = kontak.trim();
  if (k.includes("@")) {
    const [nama, domain] = k.split("@");
    return `${nama.slice(0, 1)}***@${domain}`;
  }
  const angka = normalKontak(k);
  return `${angka.slice(0, 2)}***${angka.slice(-2)}`;
}

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function teksBulan(yyyyMm: string): string {
  const m = /^(\d{4})-(\d{2})/.exec(yyyyMm);
  if (!m) return yyyyMm;
  return `${BULAN[Number(m[2]) - 1] ?? ""} ${m[1]}`.trim();
}

export function teksTanggal(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${BULAN[Number(m[2]) - 1] ?? ""} ${m[1]}`;
}

/** Untuk layar moderator. */
export const teksTerakhirDicek = (t: string | null) => (t ? `Terakhir dicek ${teksTanggal(t)}` : "Belum pernah dicek");

/** Untuk kartu publik (PEDOMAN 3.5). Tanpa tanggal, bagian ini tidak tampil. */
export const teksTerakhirDiperiksa = (t: string | null) => (t ? `Terakhir diperiksa ${teksBulan(t)}` : null);

/** Nomor telepon menjadi tautan tombol Hubungi. Alamat dan teks lain tidak punya tautan. */
export function tautanTelepon(kontak: string): string | null {
  const k = kontak.trim();
  if (k.includes("@") || !kontakSah(k)) return null;
  return `tel:+${normalKontak(k)}`;
}

/** Hari ini menurut Batam. Kolom terakhir dicek berupa tanggal. */
export const hariIni = (sekarang = new Date()) => new Date(sekarang.getTime() + 7 * 3600e3).toISOString().slice(0, 10);
