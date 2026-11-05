// "Belanja di Singapura atau di Nagoya?" Hanya menghitung ongkos jalan, dari tarif yang tercatat. Kurs diisi pengguna.

/** Tanggal tarif di bawah, untuk catatan di halaman kalkulator. */
export const TARIF_PER = "4 November 2026";

export const TARIF = {
  /** BatamFast pulang-pergi termasuk fee. Harga "mulai dari", data/feri/info_praktis.md, per 4 Nov 2026. */
  feriPpSgd: 76,
  /** Fuel surcharge Singapura ke Batam, berlaku sejak 12 Maret 2026. */
  surchargeSgd: 6,
  /** Fuel surcharge Batam ke Singapura. */
  surchargeRp: 65_000,
  /** Trans Batam umum, sekali naik. data/trans_batam/info_praktis.json. */
  busRp: 5_000,
} as const;

export type Ongkos = { singapura: number; nagoya: number; selisih: number };

/** null kalau kurs atau jumlah orang tidak masuk akal. Tiap naik bus dihitung satu tarif. */
export function hitungOngkos(kursSgd: number, orang: number, naikBus = 2): Ongkos | null {
  if (!Number.isFinite(kursSgd) || kursSgd <= 0 || !Number.isInteger(orang) || orang < 1 || orang > 50) return null;
  const singapura = orang * ((TARIF.feriPpSgd + TARIF.surchargeSgd) * kursSgd + TARIF.surchargeRp);
  const nagoya = orang * naikBus * TARIF.busRp;
  return { singapura, nagoya, selisih: singapura - nagoya };
}

const AKURASI_SATU_DESIMAL = { maximumFractionDigits: 1 } as const;

/** Rp1,6 juta. Di bawah satu juta ditulis penuh: Rp850.000. */
export function teksRupiahSekitar(n: number): string {
  if (n >= 1e9) return `Rp${(n / 1e9).toLocaleString("id-ID", AKURASI_SATU_DESIMAL)} miliar`;
  if (n >= 1e6) return `Rp${(n / 1e6).toLocaleString("id-ID", AKURASI_SATU_DESIMAL)} juta`;
  return `Rp${Math.round(n).toLocaleString("id-ID")}`;
}
