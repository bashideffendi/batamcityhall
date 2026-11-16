"use client";

import { useEffect } from "react";
import { SOURCE_ID } from "@/features/peta/style";
import type { ThemeMode } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "@/features/peta/PetaKerja";

// Garis pantai digambar DI ATAS warna radar dan gelombang (pemilik 16 Nov 2026: "gimana agar radar ini jelas berada
// di atas area mana"). Warna radar menutup peta dasar, jadi tanpa garis ini bentuk pulau hilang tepat di tempat
// hujan. Garis pantai diberi alas terang supaya terbaca di atas warna apa pun; warna radar sendiri tidak diubah.
// Sumbernya layer `earth` peta dasar, jadi garisnya sama persis dengan peta di bawahnya. Jalan sengaja tidak
// digambar di peta cuaca (pemilik: tidak ada fungsinya untuk membaca hujan).
const PANTAI = "ll-pantai";
const ALAS = "ll-pantai-alas";

const WARNA: Record<ThemeMode, { pantai: string; alas: string }> = {
  light: { pantai: "#1F2B35", alas: "#FFFFFF" },
  dark: { pantai: "#F1F4F6", alas: "#0E1418" },
};

export default function GarisAtas({ theme }: { theme: ThemeMode }) {
  const map = usePeta();

  useEffect(() => {
    tambahLayer(map, {
      id: ALAS,
      type: "line",
      source: SOURCE_ID,
      "source-layer": "earth",
      layout: { "line-join": "round" },
      paint: { "line-opacity": 0.7, "line-width": ["interpolate", ["linear"], ["zoom"], 6, 1.6, 10, 3] },
    });
    tambahLayer(map, {
      id: PANTAI,
      type: "line",
      source: SOURCE_ID,
      "source-layer": "earth",
      layout: { "line-join": "round" },
      paint: { "line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.6, 10, 1.2] },
    });
    return () => {
      for (const id of [PANTAI, ALAS]) if (map.getLayer(id)) map.removeLayer(id);
    };
  }, [map]);

  useEffect(() => {
    const w = WARNA[theme === "dark" ? "dark" : "light"];
    if (map.getLayer(PANTAI)) map.setPaintProperty(PANTAI, "line-color", w.pantai);
    if (map.getLayer(ALAS)) map.setPaintProperty(ALAS, "line-color", w.alas);
  }, [map, theme]);

  return null;
}
