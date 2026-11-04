// Ekspor dan impor daftar tersimpan lewat tautan berisi slug. Favorit di domain lama tidak bisa pindah
// otomatis, dan tautan ini juga jalan antarperangkat tanpa akun.
export const PARAM_TAUTAN = "simpan";

export function buatTautan(origin: string, ids: readonly string[]): string {
  return `${origin}/makan/tersimpan?${PARAM_TAUTAN}=${ids.join(",")}`;
}

/** Terima tautan utuh, atau slug dipisah koma atau spasi. Urutan dipertahankan, ganda dibuang. */
export function bacaDaftarSlug(teks: string): string[] {
  let isi = teks.trim();
  try {
    const nilai = new URL(isi).searchParams.get(PARAM_TAUTAN);
    if (nilai !== null) isi = nilai;
  } catch {
    // Bukan URL: berarti daftar slug biasa.
  }
  return [...new Set(isi.split(/[\s,]+/).filter(Boolean))];
}

/** Pisahkan slug yang dikenal dari yang tidak, supaya tautan rusak tidak mengotori daftar. */
export function saringSlug(slugs: readonly string[], dikenal: (slug: string) => boolean) {
  return { valid: slugs.filter(dikenal), ditolak: slugs.filter((s) => !dikenal(s)) };
}
