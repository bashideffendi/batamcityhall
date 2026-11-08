// Tema situs: "light" (kertas gading) dan "dark" (chart malam). Tersimpan di localStorage,
// semua akses dibungkus try/catch supaya mode privat tidak menjatuhkan halaman.
export type SiteTheme = "light" | "dark";

const KEY = "bch-theme";

export function readTheme(): SiteTheme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(next: SiteTheme) {
  document.documentElement.dataset.theme = next;
  window.dispatchEvent(new Event("bch-theme"));
}

export function setStoredTheme(next: SiteTheme) {
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* abaikan */
  }
}

export function storedTheme(): SiteTheme | null {
  try {
    const s = localStorage.getItem(KEY);
    return s === "light" || s === "dark" ? s : null;
  } catch {
    return null;
  }
}

export function toggleTheme(): SiteTheme {
  const next: SiteTheme = readTheme() === "dark" ? "light" : "dark";
  setStoredTheme(next);
  applyTheme(next);
  return next;
}

export function subscribeTheme(onChange: () => void): () => void {
  window.addEventListener("bch-theme", onChange);
  return () => window.removeEventListener("bch-theme", onChange);
}

/** Selama belum ada pilihan tersimpan, tema mengikuti perubahan prefers-color-scheme. */
export function followSystemTheme(): () => void {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    // Langit & Laut ikut jam WIB, bukan preferensi sistem (useThemeMode).
    // Pola harus sama dengan THEME_SCRIPT di app/layout.tsx (CCTV pindah ke /cctv).
    if (/^\/(cuaca\/(hujan|gelombang)|cctv)/.test(window.location.pathname)) return;
    if (!storedTheme()) applyTheme(mq.matches ? "dark" : "light");
  };
  mq.addEventListener("change", onChange);
  // Preferensi bisa berubah antara skrip tema di <head> dan pemasangan pendengar ini, jadi samakan sekali di awal.
  onChange();
  return () => mq.removeEventListener("change", onChange);
}
