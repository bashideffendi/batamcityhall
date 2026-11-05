"use client";

import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { ferries, placeMap } from "../lib/data";
import { useFilters } from "../lib/filters";
import {
  fiturFeri,
  fiturTempat,
  koleksi,
  kotakTitik,
  LAYER_KLIK_PIN,
  lapisanFeri,
  lapisanPin,
  lapisanSaya,
  SUMBER,
} from "../lib/peta";
import PetaMakan, { gerakTenang, pasangLapisan, usePeta } from "./PetaMakan";

const sumberKosong = () => ({ type: "geojson" as const, data: koleksi([]) });

// Pin Makan: GeoJSON, setiap tempat berdiri sendiri. Peta dan daftar membaca hasil filter yang sama.
function LapisanPin() {
  const { map, tema } = usePeta();
  const { results, selectedId, setSelectedId, state } = useFilters();
  const pilih = useRef(setSelectedId);
  const temaAwal = useRef(tema);

  useEffect(() => {
    pilih.current = setSelectedId;
  });

  useEffect(() => {
    const lepas = pasangLapisan(
      map,
      {
        [SUMBER.feri]: { type: "geojson", data: koleksi(ferries.map(fiturFeri)) },
        // Setiap tempat berdiri sendiri (koreksi pemilik, 5 November 2026).
        [SUMBER.pin]: sumberKosong(),
        [SUMBER.pilih]: sumberKosong(),
        [SUMBER.saya]: sumberKosong(),
      },
      [...lapisanFeri(), ...lapisanPin(temaAwal.current), ...lapisanSaya(temaAwal.current)],
    );

    const klikPin = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") pilih.current(id);
    };
    const tunjuk = () => (map.getCanvas().style.cursor = "pointer");
    const lepasTunjuk = () => (map.getCanvas().style.cursor = "");
    map.on("click", LAYER_KLIK_PIN, klikPin);
    map.on("mouseenter", LAYER_KLIK_PIN, tunjuk);
    map.on("mouseleave", LAYER_KLIK_PIN, lepasTunjuk);
    return () => {
      map.off("click", LAYER_KLIK_PIN, klikPin);
      map.off("mouseenter", LAYER_KLIK_PIN, tunjuk);
      map.off("mouseleave", LAYER_KLIK_PIN, lepasTunjuk);
      lepas();
    };
  }, [map]);

  // Data pin mengikuti hasil filter.
  useEffect(() => {
    (map.getSource(SUMBER.pin) as GeoJSONSource).setData(koleksi(results.map(fiturTempat)));
  }, [map, results]);

  // Muat ulang tampilan hanya kalau filternya berubah, bukan tiap kali pin dipilih.
  const tandaFilter = JSON.stringify([
    state.cats,
    state.areas,
    state.halal,
    state.tiers,
    state.labels,
    state.waktu,
    state.bayar,
    state.murah,
    state.ferry,
    state.openNow,
    state.query,
  ]);
  const hasilRef = useRef(results);
  useEffect(() => {
    hasilRef.current = results;
  });
  useEffect(() => {
    const kotak = kotakTitik(hasilRef.current);
    if (!kotak) return;
    map.fitBounds(kotak, { padding: 50, maxZoom: 14, animate: !gerakTenang() });
  }, [map, tandaFilter]);

  // Tempat yang dipilih: dari pin atau dari daftar di samping peta.
  useEffect(() => {
    const p = selectedId ? placeMap[selectedId] : null;
    (map.getSource(SUMBER.pilih) as GeoJSONSource).setData(koleksi(p ? [fiturTempat(p)] : []));
    if (p) map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 15), animate: !gerakTenang() });
  }, [map, selectedId]);

  // Lokasi pengguna hanya dipakai di browser ini, tidak dikirim ke mana pun.
  const lokasi = state.userLoc;
  useEffect(() => {
    (map.getSource(SUMBER.saya) as GeoJSONSource).setData(
      koleksi(
        lokasi
          ? [
              {
                type: "Feature",
                geometry: { type: "Point", coordinates: [lokasi.lng, lokasi.lat] },
                properties: {},
              },
            ]
          : [],
      ),
    );
    if (lokasi) map.flyTo({ center: [lokasi.lng, lokasi.lat], zoom: 14, animate: !gerakTenang() });
  }, [map, lokasi]);

  return null;
}

export default function MapCanvas() {
  return (
    <PetaMakan judul="map_title" kooperatif>
      <LapisanPin />
    </PetaMakan>
  );
}
