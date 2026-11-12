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
  /** "bmkg" atau "copernicus": sumber peta tinggi gelombang yang dipilih pembaca */
  sumberGelombang: "bch-ll-sumber-gelombang",
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

const BMKG_MATI = "bch-ll-bmkg-mati";
const BMKG_MATI_MS = 30 * 60 * 1000;

/** Ubin gelombang BMKG gagal dimuat dalam 30 menit terakhir di tab ini: langsung pakai Copernicus. */
export function bmkgBaruGagal(): boolean {
  try {
    const t = Number(sessionStorage.getItem(BMKG_MATI));
    return t > 0 && Date.now() - t < BMKG_MATI_MS;
  } catch {
    return false;
  }
}

export function catatBmkgGagal(gagal: boolean): void {
  try {
    if (gagal) sessionStorage.setItem(BMKG_MATI, String(Date.now()));
    else sessionStorage.removeItem(BMKG_MATI);
  } catch {
    /* abaikan */
  }
}
