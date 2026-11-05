"use client";

import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useEffect, useMemo, useRef } from "react";
import { tambahLayer, usePeta } from "@/features/langit-laut/components/PetaLangit";
import { muatGambar, namaGambar } from "./gambar-penanda";
import { FONT } from "./style";

const SUMBER = "ll-tempat";
const L_KLASTER = "ll-tempat-klaster";
const L_ANGKA = "ll-tempat-angka";
const L_TITIK = "ll-tempat-titik";
const L_LABEL = "ll-tempat-label";

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
  /** urutan warna klaster: klaster memakai warna kelompok pertama */
  idx: number;
  /** tempat penting selalu berlabel nama */
  penting: boolean;
};

const gerakTenang = () =>
  document.documentElement.dataset.gerak === "tenang" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Penanda gaya A dengan klaster 22 px. */
export default function LapisanTempat({
  fitur,
  warnaUrut,
  pilihId = null,
  onPilih,
}: {
  fitur: FiturPin[];
  warnaUrut: string[];
  pilihId?: string | null;
  onPilih: (id: string | null) => void;
}) {
  const map = usePeta();
  const onPilihRef = useRef(onPilih);
  useEffect(() => {
    onPilihRef.current = onPilih;
  });
  const warnaAwal = useRef(warnaUrut);
  const data = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: fitur.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: { id: p.id, nama: p.nama, ikon: namaGambar(p.glyph, p.warna, p.perkiraan), idx: p.idx, penting: p.penting },
      })),
    }),
    [fitur],
  );

  useEffect(() => {
    const hilang = (e: { id: string }) => muatGambar(map, e.id);
    map.on("styleimagemissing", hilang);
    if (!map.getSource(SUMBER)) {
      map.addSource(SUMBER, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterRadius: 22,
        clusterMaxZoom: 14,
        clusterProperties: { idxMin: ["min", ["get", "idx"]] },
      });
    }
    const warna = warnaAwal.current;
    const warnaKlaster =
      warna.length > 1 ? ["match", ["get", "idxMin"], ...warna.flatMap((w, i) => [i, w]), "#161616"] : (warna[0] ?? "#161616");
    tambahLayer(map, {
      id: L_KLASTER,
      type: "circle",
      source: SUMBER,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#FFFFFF",
        "circle-stroke-width": 2.5,
        "circle-stroke-color": warnaKlaster as never,
        "circle-radius": 13,
      },
    });
    tambahLayer(map, {
      id: L_ANGKA,
      type: "symbol",
      source: SUMBER,
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": [FONT.island],
        "text-size": 12,
        "text-allow-overlap": true,
      },
      paint: { "text-color": "#161616" },
    });
    tambahLayer(map, {
      id: L_TITIK,
      type: "symbol",
      source: SUMBER,
      filter: ["!", ["has", "point_count"]],
      layout: { "icon-image": ["get", "ikon"], "icon-allow-overlap": true, "icon-ignore-placement": true },
    });
    tambahLayer(map, {
      id: L_LABEL,
      type: "symbol",
      source: SUMBER,
      filter: ["all", ["!", ["has", "point_count"]], ["get", "penting"]],
      layout: {
        "text-field": ["get", "nama"],
        "text-font": [FONT.island],
        "text-size": 12.5,
        "text-anchor": "left",
        "text-offset": [1.5, 0],
        "text-optional": true,
      },
      paint: { "text-color": "#161616", "text-halo-color": "#FFFFFF", "text-halo-width": 1.5 },
    });
    const klikTitik = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") onPilihRef.current(id);
    };
    const klikKlaster = async (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      if (!f) return;
      const zoom = await (map.getSource(SUMBER) as GeoJSONSource).getClusterExpansionZoom(f.properties?.cluster_id);
      map.easeTo({ center: (f.geometry as GeoJSON.Point).coordinates as [number, number], zoom, animate: !gerakTenang() });
    };
    const kursor = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const lepas = () => {
      map.getCanvas().style.cursor = "";
    };
    map.on("click", L_TITIK, klikTitik);
    map.on("click", L_KLASTER, klikKlaster);
    for (const l of [L_TITIK, L_KLASTER]) {
      map.on("mouseenter", l, kursor);
      map.on("mouseleave", l, lepas);
    }
    return () => {
      map.off("styleimagemissing", hilang);
      map.off("click", L_TITIK, klikTitik);
      map.off("click", L_KLASTER, klikKlaster);
      for (const l of [L_TITIK, L_KLASTER]) {
        map.off("mouseenter", l, kursor);
        map.off("mouseleave", l, lepas);
      }
      for (const l of [L_LABEL, L_TITIK, L_ANGKA, L_KLASTER]) if (map.getLayer(l)) map.removeLayer(l);
      if (map.getSource(SUMBER)) map.removeSource(SUMBER);
    };
  }, [map]);

  useEffect(() => {
    for (const f of fitur) muatGambar(map, namaGambar(f.glyph, f.warna, f.perkiraan));
    (map.getSource(SUMBER) as GeoJSONSource | undefined)?.setData(data);
  }, [map, data, fitur]);

  useEffect(() => {
    if (!map.getLayer(L_LABEL)) return;
    map.setFilter(L_LABEL, [
      "all",
      ["!", ["has", "point_count"]],
      ["any", ["get", "penting"], ["==", ["get", "id"], pilihId ?? ""]],
    ]);
  }, [map, pilihId]);
  return null;
}
