import { ENTRI_FERI } from "@/features/jalan/feri-data";

// Jadwal ringkas untuk widget di browser, dibuat saat build. Berkas mentah memuat catatan penyusun, jadi yang
// dikirim hanya hasil normalisasi. Perhitungan "terakhir" terjadi di klien karena bergantung jam sekarang.
export const dynamic = "force-static";

export function GET() {
  return Response.json(ENTRI_FERI);
}
