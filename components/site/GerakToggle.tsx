"use client";

import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("bch-gerak", onChange);
  return () => window.removeEventListener("bch-gerak", onChange);
};
const readTenang = () => document.documentElement.dataset.gerak === "tenang";

// Tombol "Animasi: aktif/nonaktif" (PEDOMAN 3.1). prefers-reduced-motion tetap
// berlaku lewat token CSS; tombol ini tambahan untuk yang ingin memilih sendiri.
export default function GerakToggle() {
  const tenang = useSyncExternalStore(subscribe, readTenang, () => false);

  const toggle = () => {
    const next = !tenang;
    if (next) document.documentElement.dataset.gerak = "tenang";
    else delete document.documentElement.dataset.gerak;
    try {
      localStorage.setItem("bch-gerak", next ? "tenang" : "hidup");
    } catch {
      /* abaikan */
    }
    window.dispatchEvent(new Event("bch-gerak"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={tenang}
      style={{
        background: "none",
        border: 0,
        padding: "0.25rem 0",
        color: "inherit",
        cursor: "pointer",
        textDecoration: "underline",
        font: "inherit",
      }}
    >
      Animasi: {tenang ? "Nonaktif" : "Aktif"}
    </button>
  );
}
