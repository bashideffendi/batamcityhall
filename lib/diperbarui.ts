// Jam data terbaru untuk baris "Diperbarui pukul" di kepala beranda. Kotak Hari Ini mengisinya dari citra radar
// terbaru, jadi jam yang tampil adalah jam data, bukan jam halaman dibuka.
let jam = "";
const pendengar = new Set<() => void>();

export function setDiperbarui(baru: string) {
  if (baru === jam) return;
  jam = baru;
  pendengar.forEach((f) => f());
}
export const bacaDiperbarui = () => jam;
export function subscribeDiperbarui(f: () => void) {
  pendengar.add(f);
  return () => {
    pendengar.delete(f);
  };
}
