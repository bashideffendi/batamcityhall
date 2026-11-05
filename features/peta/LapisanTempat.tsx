"use client";

import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { tambahLayer, usePeta } from "@/features/langit-laut/components/PetaLangit";
import { muatGambar, namaGambar } from "./gambar-penanda";
import { FONT } from "./style";

const SUMBER = "ll-tempat";
const L_BULAT = "ll-tempat-bulat";
const L_TITIK = "ll-tempat-titik";
const L_SENTUH = "ll-tempat-sentuh";
const L_LABEL = "ll-tempat-label";

/** Di bawah zoom ini tempat tampil sebagai titik kecil, supaya sebarannya terlihat. Di atasnya memakai ikon. */
export const ZOOM_IKON = 13;

/** Satu penanda gaya A di peta (PEDOMAN 5.4). */
export type FiturPin = {
  id: string;
  nama: string;
  lat: number;
  lng: number;
  /** kunci ikon di ikon.json */
  glyph: string;
  warna: string;
  perkiraan: boolean;
  /** tempat penting selalu berlabel nama */
  penting: boolean;
};

/** Setiap tempat berdiri sendiri (koreksi pemilik, 5 November 2026): tidak ada pengelompokan berangka. */
export default function LapisanTempat({
  fitur,
  pilihId = null,
  onPilih,
}: {
  fitur: FiturPin[];
  pilihId?: string | null;
  onPilih: (id: string | null) => void;
}) {
  const map = usePeta();
  const onPilihRef = useRef(onPilih);
  const pilihRef = useRef(pilihId);
  useEffect(() => {
    onPilihRef.current = onPilih;
    pilihRef.current = pilihId;
  });
  const data = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: fitur.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: { id: p.id, nama: p.nama, warna: p.warna, ikon: namaGambar(p.glyph, p.warna, p.perkiraan), penting: p.penting },
      })),
    }),
    [fitur],
  );

  useEffect(() => {
    const hilang = (e: { id: string }) => muatGambar(map, e.id);
    map.on("styleimagemissing", hilang);
    if (!map.getSource(SUMBER)) {
      map.addSource(SUMBER, { type: "geojson", data: { type: "FeatureCollection", features: [] } });
    }
    tambahLayer(map, {
      id: L_BULAT,
      type: "circle",
      source: SUMBER,
      maxzoom: ZOOM_IKON,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 2.5, 11, 3.5, ZOOM_IKON, 5],
        "circle-color": ["get", "warna"],
        "circle-stroke-color": "#FFFFFF",
        "circle-stroke-width": 0.75,
      },
    });
    tambahLayer(map, {
      id: L_TITIK,
      type: "symbol",
      source: SUMBER,
      minzoom: ZOOM_IKON,
      layout: {
        "icon-image": ["get", "ikon"],
        "icon-size": ["interpolate", ["linear"], ["zoom"], ZOOM_IKON, 0.7, 15, 1],
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
      },
    });
    // Area sentuh tak terlihat: titik kecil terlalu sempit untuk jari.
    tambahLayer(map, {
      id: L_SENTUH,
      type: "circle",
      source: SUMBER,
      paint: { "circle-radius": 11, "circle-opacity": 0, "circle-stroke-width": 0 },
    });
    tambahLayer(map, {
      id: L_LABEL,
      type: "symbol",
      source: SUMBER,
      filter: ["get", "penting"],
      layout: {
        "text-field": ["get", "nama"],
        "text-font": [FONT.island],
        "text-size": 12.5,
        "text-anchor": "left",
        "text-offset": [1.2, 0],
        "text-optional": true,
      },
      paint: { "text-color": "#161616", "text-halo-color": "#FFFFFF", "text-halo-width": 1.5 },
    });
    const saringLabel = (sorot: string) =>
      map.setFilter(L_LABEL, ["any", ["get", "penting"], ["==", ["get", "id"], pilihRef.current ?? ""], ["==", ["get", "id"], sorot]]);
    const klik = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") onPilihRef.current(id);
    };
    // Menyorot titik memunculkan namanya.
    const sorot = (e: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string" && map.getLayer(L_LABEL)) saringLabel(id);
    };
    const lepas = () => {
      map.getCanvas().style.cursor = "";
      if (map.getLayer(L_LABEL)) saringLabel("");
    };
    map.on("click", L_SENTUH, klik);
    map.on("mousemove", L_SENTUH, sorot);
    map.on("mouseleave", L_SENTUH, lepas);
    return () => {
      map.off("styleimagemissing", hilang);
      map.off("click", L_SENTUH, klik);
      map.off("mousemove", L_SENTUH, sorot);
      map.off("mouseleave", L_SENTUH, lepas);
      for (const l of [L_LABEL, L_SENTUH, L_TITIK, L_BULAT]) if (map.getLayer(l)) map.removeLayer(l);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map]);

  useEffect(() => {
    for (const f of fitur) muatGambar(map, namaGambar(f.glyph, f.warna, f.perkiraan));
    (map.getSource(SUMBER) as GeoJSONSource | undefined)?.setData(data);
  }, [map, data, fitur]);

  useEffect(() => {
    if (!map.getLayer(L_LABEL)) return;
    map.setFilter(L_LABEL, ["any", ["get", "penting"], ["==", ["get", "id"], pilihId ?? ""]]);
  }, [map, pilihId]);
  return null;
}
