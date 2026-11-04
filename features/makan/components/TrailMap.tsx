"use client";

import { useEffect, useRef } from "react";
import { fiturPerhentian, garisJalur, koleksi, kotakTitik, lapisanJalur, SUMBER } from "../lib/peta";
import type { PlaceWithGeo } from "../lib/types";
import PetaMakan, { pasangLapisan, usePeta } from "./PetaMakan";

function LapisanJalur({ stops }: { stops: PlaceWithGeo[] }) {
  const { map, tema } = usePeta();
  const temaAwal = useRef(tema);
  useEffect(() => {
    const lepas = pasangLapisan(
      map,
      {
        [SUMBER.jalur]: { type: "geojson", data: garisJalur(stops) },
        [SUMBER.jalurTitik]: { type: "geojson", data: koleksi(stops.map(fiturPerhentian)) },
      },
      lapisanJalur(temaAwal.current),
    );
    const kotak = kotakTitik(stops);
    if (kotak) map.fitBounds(kotak, { padding: 48, maxZoom: 14, animate: false });
    return lepas;
  }, [map, stops]);
  return null;
}

// Peta jalur. Daftar perhentian bernomor di bawah peta adalah alternatif untuk keyboard.
export default function TrailMap({ stops }: { stops: PlaceWithGeo[] }) {
  if (stops.length === 0) return null;
  return (
    <PetaMakan judul="map_trail_title" center={[stops[0].lng, stops[0].lat]} kooperatif className="mk-peta-jalur">
      <LapisanJalur stops={stops} />
    </PetaMakan>
  );
}
