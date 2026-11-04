// Tema situs: "day" (kertas gading) dan "night" (chart malam). Tersimpan di localStorage,
// semua akses dibungkus try/catch supaya mode privat tidak menjatuhkan halaman.
export type SiteTheme = "day" | "night";

const KEY = "bch-theme";

export function readTheme(): SiteTheme {
  if (typeof document === "undefined") return "day";
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
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
    return s === "day" || s === "night" ? s : null;
  } catch {
    return null;
  }
}

export function toggleTheme(): SiteTheme {
  const next: SiteTheme = readTheme() === "night" ? "day" : "night";
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
    if (window.location.pathname.startsWith("/langit-laut")) return;
    if (!storedTheme()) applyTheme(mq.matches ? "night" : "day");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
