// Dibaca lewat objek env saat jalan, bukan process.env.NEXT_PUBLIC_X langsung, supaya tidak dibekukan saat
// build dan bisa diuji. Modul ini hanya dipakai di server.
export type ModeKiriman = "supabase" | "contoh" | "mati";

export type Env = Record<string, string | undefined>;

/**
 * - supabase: ketiga variabel terisi.
 * - contoh: variabel Supabase kosong semua, dan bukan produksi, atau NEXT_PUBLIC_MODE_CONTOH=1.
 * - mati: selain itu. Termasuk Supabase yang terisi sebagian: lebih baik jujur tertutup daripada diam-diam
 *   menampilkan data fiktif di situs yang pemiliknya mengira sudah tersambung.
 */
export function modeKiriman(env: Env = process.env): ModeKiriman {
  const terisi = [
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    env.SUPABASE_SERVICE_ROLE_KEY,
  ].filter(Boolean).length;
  if (terisi === 3) return "supabase";
  if (terisi > 0) return "mati";
  if (env.NEXT_PUBLIC_MODE_CONTOH === "1") return "contoh";
  return env.NODE_ENV === "production" ? "mati" : "contoh";
}

export const PESAN_MATI = "Formulir ini belum aktif.";
export const PESAN_MATI_REKOMENDASI = `${PESAN_MATI} Rekomendasi belum dapat dikirim.`;
