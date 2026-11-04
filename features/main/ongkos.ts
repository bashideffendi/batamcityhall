// "Ke Singapura atau ke Nagoya?" Hanya menghitung ongkos jalan, dari tarif yang tercatat. Kurs diisi pengguna.

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
