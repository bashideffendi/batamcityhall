// Keluaran halaman /admin/koordinat. Fungsi murni, dipakai browser moderator. Server tidak menulis apa pun:
// berkasnya diunduh, lalu dimasukkan lewat tools/import_koordinat.py (CSV) atau disimpan sebagai
// data/koordinat_user.json (hanya tempat).
export type JenisTitik = "tempat" | "halte";

export type TitikKoordinat = {
  id: string;
  jenis: JenisTitik;
  nama: string;
  /** Kategori tempat, atau kelompok halte. */
  kelompok: string;
  subkategori: string | null;
  koridor: string | null;
  kecamatan: string | null;
  kelurahan: string | null;
  alamat: string | null;
  lat: number | null;
  lng: number | null;
  statusKoordinat: string;
  catatanKoordinat: string | null;
  sumberUrl: string | null;
};

export type Isian = Record<string, { lat: number; lng: number }>;

/** Rentang yang sama dengan tools/import_koordinat.py. Di luar ini kemungkinan lat dan lng tertukar. */
export const koordinatSah = (lat: number, lng: number) =>
  Number.isFinite(lat) && Number.isFinite(lng) && lat >= 0.3 && lat <= 1.6 && lng >= 103.4 && lng <= 104.9;

export const bulatkan = (n: number) => Math.round(n * 1e6) / 1e6;

/** Menerima tempelan Google Maps "1.1234, 104.0567". */
export function bacaTempelan(teks: string): { lat: number; lng: number } | null {
  const m = /^\s*(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)\s*$/.exec(teks);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  return koordinatSah(lat, lng) ? { lat: bulatkan(lat), lng: bulatkan(lng) } : null;
}

export const kunciIsian = (t: Pick<TitikKoordinat, "jenis" | "id">) => `${t.jenis}:${t.id}`;

export const tautanGoogleMaps = (t: Pick<TitikKoordinat, "jenis" | "nama" | "alamat">) => {
  const kueri =
    t.jenis === "halte" ? `Halte Trans Batam ${t.nama} Batam` : [t.nama, t.alamat, "Batam"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kueri)}`;
};

const selCsv = (v: string | number | null) => {
  const s = v === null ? "" : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const barisCsv = (kolom: readonly string[], baris: Record<string, string | number | null>[]) =>
  [kolom.join(","), ...baris.map((b) => kolom.map((k) => selCsv(b[k] ?? null)).join(","))].join("\r\n") + "\r\n";

const KOLOM_TEMPAT = [
  "prioritas",
  "id",
  "nama",
  "kategori",
  "subkategori",
  "kecamatan",
  "kelurahan",
  "alamat",
  "lat",
  "lng",
  "status_koordinat",
  "catatan_koordinat",
  "cari_di_google_maps",
  "sumber_url",
] as const;

const KOLOM_HALTE = [
  "id",
  "nama",
  "kelompok",
  "koridor",
  "kecamatan",
  "alamat",
  "lat",
  "lng",
  "status_koordinat",
  "catatan_koordinat",
  "cari_di_google_maps",
] as const;

const terisi = (titik: readonly TitikKoordinat[], jenis: JenisTitik, isian: Isian) =>
  titik.filter((t) => t.jenis === jenis && isian[kunciIsian(t)]);

/**
 * Format data/koordinat_perlu_diisi.csv. status_koordinat ditulis "terverifikasi" karena moderator sudah
 * memeriksa titiknya; tanpa itu, importer melewati baris yang koordinatnya tidak berubah.
 */
export function csvTempat(titik: readonly TitikKoordinat[], isian: Isian): string {
  return barisCsv(
    KOLOM_TEMPAT,
    terisi(titik, "tempat", isian).map((t) => ({
      prioritas: null,
      id: t.id,
      nama: t.nama,
      kategori: t.kelompok,
      subkategori: t.subkategori,
      kecamatan: t.kecamatan,
      kelurahan: t.kelurahan,
      alamat: t.alamat,
      lat: isian[kunciIsian(t)].lat,
      lng: isian[kunciIsian(t)].lng,
      status_koordinat: "terverifikasi",
      catatan_koordinat: t.catatanKoordinat,
      cari_di_google_maps: tautanGoogleMaps(t),
      sumber_url: t.sumberUrl,
    })),
  );
}

/** Format data/trans_batam/halte_koordinat_perlu_diisi.csv. Kolom kelompok membuat importer mengenalinya. */
export function csvHalte(titik: readonly TitikKoordinat[], isian: Isian): string {
  return barisCsv(
    KOLOM_HALTE,
    terisi(titik, "halte", isian).map((t) => ({
      id: t.id,
      nama: t.nama,
      kelompok: t.kelompok,
      koridor: t.koridor,
      kecamatan: t.kecamatan,
      alamat: t.alamat,
      lat: isian[kunciIsian(t)].lat,
      lng: isian[kunciIsian(t)].lng,
      status_koordinat: "terverifikasi",
      catatan_koordinat: t.catatanKoordinat,
      cari_di_google_maps: tautanGoogleMaps(t),
    })),
  );
}

/**
 * Format data/koordinat_user.json: { id: { lat, lng, tanggal } }. Tempat dan halte selalu berkas terpisah:
 * id halte adalah namespace sendiri, dan tools/merge_places.py menolak id yang tidak ada di places.
 */
export function jsonKoordinat(
  titik: readonly TitikKoordinat[],
  jenis: JenisTitik,
  isian: Isian,
  tanggal: string,
): string {
  const hasil: Record<string, { lat: number; lng: number; tanggal: string }> = {};
  for (const t of [...terisi(titik, jenis, isian)].sort((a, b) => a.id.localeCompare(b.id))) {
    hasil[t.id] = { ...isian[kunciIsian(t)], tanggal };
  }
  return `${JSON.stringify(hasil, null, 1)}\n`;
}
