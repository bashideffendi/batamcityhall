// Halaman admin "Data yang perlu dicek ulang" (CLAUDE_CODE_PROMPT 5 butir 7). Fungsi murni.
export const BULAN_KEDALUWARSA = 6;
/** Entri tanpa tanggal cek dihitung sejak riset, sama dengan teksDicek() di direktori. */
export const TANGGAL_RISET = "2026-11";

export type AlasanCek = "perlu_cek_ulang" | "usang" | "lewat_6_bulan";

export const NAMA_ALASAN: Record<AlasanCek, string> = {
  perlu_cek_ulang: "Status perlu diperiksa ulang",
  usang: "Status usang",
  lewat_6_bulan: "Lebih dari 6 bulan sejak dicek",
};

type Sumber = { status_data: string | null; atribut: Record<string, unknown> };

/** "2026-06" dan "2026-06-15" dibaca sebagai tanggal awalnya. Selain itu dianggap tidak ada. */
function bacaTanggal(nilai: unknown): Date | null {
  if (typeof nilai !== "string" || !/^\d{4}-\d{2}(-\d{2})?$/.test(nilai)) return null;
  const d = new Date(nilai.length === 7 ? `${nilai}-01T00:00:00Z` : `${nilai}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function lewatEnamBulan(tanggal: unknown, sekarang: Date): boolean {
  const d = bacaTanggal(tanggal) ?? bacaTanggal(TANGGAL_RISET);
  if (!d) return false;
  const batas = new Date(d);
  batas.setUTCMonth(batas.getUTCMonth() + BULAN_KEDALUWARSA);
  return sekarang.getTime() > batas.getTime();
}

export function alasanCekUlang(p: Sumber, sekarang: Date): AlasanCek[] {
  const hasil: AlasanCek[] = [];
  if (p.status_data === "perlu_cek_ulang") hasil.push("perlu_cek_ulang");
  if (p.status_data === "usang") hasil.push("usang");
  if (lewatEnamBulan(p.atribut?.last_verified, sekarang)) hasil.push("lewat_6_bulan");
  return hasil;
}
