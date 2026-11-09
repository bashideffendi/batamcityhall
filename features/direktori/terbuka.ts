import "server-only";
// Tempat dari data terbuka Overture Maps (data/tempat-terbuka.json, dibuat tools/overture/impor.py). Keputusan pemilik
// 9 Nov 2026: direktori diperbesar dari data terbuka, bukan menyalin Google Maps. Kredit di Kolofon.
//
// Bentuknya diubah menjadi Place supaya halaman kategori, peta, pencarian, dan sitemap memakainya tanpa jalur khusus.
// Titiknya belum didatangi, jadi status koordinatnya perlu_cek_ulang: pin berongga dan "Titik ini perkiraan area".
import raw from "@/data/tempat-terbuka.json";
import type { Place } from "@/lib/data/schema";

type Mentah = {
  id: string;
  nama: string;
  kategori: Place["kategori"];
  sub: string;
  kecamatan: NonNullable<Place["kecamatan"]>;
  lat: number;
  lng: number;
  alamat: string | null;
  telepon: string | null;
  situs: string | null;
  keyakinan: number;
};

const DATA = raw as { sumber: { rilis: string; diambil: string }; tempat: Mentah[] };

export const RILIS_TERBUKA = DATA.sumber.rilis;

export const TEMPAT_TERBUKA: Place[] = DATA.tempat.map((t) => ({
  id: t.id,
  nama: t.nama,
  nama_alternatif: [],
  kategori: t.kategori,
  subkategori: t.sub,
  kecamatan: t.kecamatan,
  kelurahan: null,
  alamat: t.alamat,
  lat: t.lat,
  lng: t.lng,
  status_koordinat: "perlu_cek_ulang",
  catatan_koordinat: null,
  jam_layanan: null,
  kontak: { ...(t.telepon ? { telepon: t.telepon } : {}), ...(t.situs ? { website: t.situs } : {}) },
  atribut: { sumber_terbuka: "overture" },
  status_data: null,
  catatan: null,
  tag_osm: null,
  sumber_url: [],
  sumber_riset: [`overture-${DATA.sumber.rilis}`],
  id_alias: [],
}));

/** Tempat dari data terbuka: tidak dibangun sebagai halaman statis dan tidak masuk daftar cek ulang admin. */
export const adalahTerbuka = (p: Pick<Place, "atribut">) => p.atribut.sumber_terbuka === "overture";
