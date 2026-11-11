import "server-only";
// Tempat dari data Google Maps yang dihimpun pemilik (data/tempat-google.json, dibuat tools/google/impor.py dari
// Direktori_Batam.xlsx). Keputusan pemilik 11 Nov 2026: semua tempat dipakai, baris dari data pajak tidak.
//
// Bentuknya diubah menjadi Place supaya halaman kategori, peta, pencarian, dan sitemap memakainya tanpa jalur khusus.
// Titiknya belum didatangi, jadi status koordinatnya perlu_cek_ulang: pin berongga dan "Titik ini perkiraan area".
// Tombol arah memakai tautan Google Maps tempat itu (atribut.gmaps). Rating dan jumlah ulasan hanya dipakai untuk
// tanda Rekomendasi dan urutan, tidak ditampilkan.
import raw from "@/data/tempat-google.json";
import type { Place } from "@/lib/data/schema";

type Mentah = {
  id: string;
  nama: string;
  kategori: Place["kategori"];
  sub: string;
  kecamatan: Place["kecamatan"];
  kelurahan: string | null;
  lat: number;
  lng: number;
  alamat: string | null;
  telepon: string | null;
  situs: string | null;
  gmaps: string | null;
  rating: number | null;
  ulasan: number | null;
  rekomendasi: boolean;
};

const DATA = raw as { sumber: { nama: string; diimpor: string }; tempat: Mentah[] };

export const TEMPAT_TERBUKA: Place[] = DATA.tempat.map((t) => ({
  id: t.id,
  nama: t.nama,
  nama_alternatif: [],
  kategori: t.kategori,
  subkategori: t.sub,
  kecamatan: t.kecamatan,
  kelurahan: t.kelurahan,
  alamat: t.alamat,
  lat: t.lat,
  lng: t.lng,
  status_koordinat: "perlu_cek_ulang",
  catatan_koordinat: null,
  jam_layanan: null,
  kontak: { ...(t.telepon ? { telepon: t.telepon } : {}), ...(t.situs ? { website: t.situs } : {}) },
  atribut: {
    sumber_terbuka: "google",
    ...(t.gmaps ? { gmaps: t.gmaps } : {}),
    ...(t.rekomendasi ? { rekomendasi: true } : {}),
    ...(t.rating != null ? { rating_google: t.rating } : {}),
    ...(t.ulasan != null ? { ulasan_google: t.ulasan } : {}),
  },
  status_data: null,
  catatan: null,
  tag_osm: null,
  sumber_url: [],
  sumber_riset: [`google-maps-${DATA.sumber.diimpor}`],
  id_alias: [],
}));

/** Tempat dari data Google: tidak dibangun sebagai halaman statis dan tidak masuk daftar cek ulang admin. */
export const adalahTerbuka = (p: Pick<Place, "atribut">) => p.atribut.sumber_terbuka === "google";
