// Preferensi pengguna di localStorage. Semua akses dibungkus try/catch: mode privat,
// kuota penuh, atau storage yang diblokir tidak boleh menjatuhkan app.
export const PREF = {
  mode: "bch-ll-mode",
  view: "bch-ll-view",
  collapsed: "bch-ll-collapsed",
  detail: "bch-ll-detail",
  recentCams: "bch-ll-cams-recent",
  /** "1" = petunjuk "Ketuk Pin atau Angka…" sudah tidak perlu (kamera pertama sudah dipilih) */
  camHint: "bch-ll-cam-hint",
} as const;

export function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* abaikan */
  }
}
