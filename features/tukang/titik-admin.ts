// Daftar titik yang belum terverifikasi, untuk /admin/koordinat. Hanya di server, dan hanya dikirim ke browser
// setelah gerbang admin lolos. Halte dari data mentah, tempat dari direktori.
import halteMentah from "@/data/trans_batam/halte.json";
import { TEMPAT } from "@/features/direktori/data";
import type { TitikKoordinat } from "./koordinat";

type Halte = {
  id: string;
  nama: string;
  kelompok: string | null;
  koridor: string[] | null;
  kecamatan: string | null;
  alamat: string | null;
  lat: number | null;
  lng: number | null;
  status_koordinat: string;
  catatan_koordinat: string | null;
};

const URUTAN: Record<string, number> = { perlu_diisi_user: 0, perlu_cek_ulang: 1 };

export function daftarTitik(): TitikKoordinat[] {
  const tempat: TitikKoordinat[] = TEMPAT.filter((p) => p.status_koordinat !== "terverifikasi").map((p) => ({
    id: p.id,
    jenis: "tempat",
    nama: p.nama,
    kelompok: p.kategori,
    subkategori: p.subkategori,
    koridor: null,
    kecamatan: p.kecamatan,
    kelurahan: p.kelurahan,
    alamat: p.alamat,
    lat: p.lat,
    lng: p.lng,
    statusKoordinat: p.status_koordinat,
    catatanKoordinat: p.catatan_koordinat ?? null,
    sumberUrl: p.sumber_url[0] ?? null,
  }));
  const halte: TitikKoordinat[] = (halteMentah.halte as unknown as Halte[])
    .filter((h) => h.status_koordinat !== "terverifikasi")
    .map((h) => ({
      id: h.id,
      jenis: "halte",
      nama: h.nama,
      kelompok: h.kelompok ?? "",
      subkategori: null,
      koridor: h.koridor?.join(" ") ?? null,
      kecamatan: h.kecamatan,
      kelurahan: null,
      alamat: h.alamat,
      lat: h.lat,
      lng: h.lng,
      statusKoordinat: h.status_koordinat,
      catatanKoordinat: h.catatan_koordinat,
      sumberUrl: null,
    }));
  return [...tempat, ...halte].sort(
    (a, b) => (URUTAN[a.statusKoordinat] ?? 2) - (URUTAN[b.statusKoordinat] ?? 2) || a.nama.localeCompare(b.nama),
  );
}
