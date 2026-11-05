"use client";

import type { GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { ferries, placeMap } from "../lib/data";
import { useFilters } from "../lib/filters";
import {
  fiturFeri,
  fiturTempat,
  koleksi,
  kotakTitik,
  LAYER_KLIK_PIN,
  LAYER_KLUSTER,
  lapisanFeri,
  lapisanPin,
  lapisanSaya,
  SUMBER,
} from "../lib/peta";
import PetaMakan, { gerakTenang, pasangLapisan, usePeta } from "./PetaMakan";

const sumberKosong = () => ({ type: "geojson" as const, data: koleksi([]) });

// Pin Makan: GeoJSON dengan clustering. Peta dan daftar membaca hasil filter yang sama.
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
        [SUMBER.pin]: {
          ...sumberKosong(),
          cluster: true,
          clusterRadius: 40,
          // Di atas ini pin berdiri sendiri, jadi tempat yang dipilih dari daftar selalu terlihat.
          clusterMaxZoom: 14,
        },
        [SUMBER.pilih]: sumberKosong(),
        [SUMBER.saya]: sumberKosong(),
      },
      [...lapisanFeri(temaAwal.current), ...lapisanPin(temaAwal.current), ...lapisanSaya(temaAwal.current)],
    );

    const klikPin = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") pilih.current(id);
    };
    const klikKluster = (e: MapLayerMouseEvent) => {
      const f = e.features?.[0];
      const clusterId = f?.properties?.cluster_id;
      if (!f || f.geometry.type !== "Point" || clusterId === undefined) return;
      const [lng, lat] = f.geometry.coordinates;
      (map.getSource(SUMBER.pin) as GeoJSONSource).getClusterExpansionZoom(clusterId).then((zoom) => {
        map.easeTo({ center: [lng, lat], zoom, animate: !gerakTenang() });
      });
    };
    const tunjuk = () => (map.getCanvas().style.cursor = "pointer");
    const lepasTunjuk = () => (map.getCanvas().style.cursor = "");
    map.on("click", LAYER_KLIK_PIN, klikPin);
    map.on("click", LAYER_KLUSTER, klikKluster);
    for (const id of [LAYER_KLIK_PIN, LAYER_KLUSTER]) {
      map.on("mouseenter", id, tunjuk);
      map.on("mouseleave", id, lepasTunjuk);
    }
    return () => {
      map.off("click", LAYER_KLIK_PIN, klikPin);
      map.off("click", LAYER_KLUSTER, klikKluster);
      for (const id of [LAYER_KLIK_PIN, LAYER_KLUSTER]) {
        map.off("mouseenter", id, tunjuk);
        map.off("mouseleave", id, lepasTunjuk);
      }
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
  // Di HP satu jari harus tetap menggulir halaman menuju daftar dan footer.
  const [sentuh] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  return (
    <PetaMakan judul="map_title" kooperatif={sentuh}>
      <LapisanPin />
    </PetaMakan>
  );
}
