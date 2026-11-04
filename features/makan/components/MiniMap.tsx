"use client";

import { useEffect, useRef } from "react";
import { fiturTempat, koleksi, lapisanMini, SUMBER } from "../lib/peta";
import type { PlaceWithGeo } from "../lib/types";
import PetaMakan, { pasangLapisan, usePeta } from "./PetaMakan";

function PinMini({ place }: { place: PlaceWithGeo }) {
  const { map, tema } = usePeta();
  const temaAwal = useRef(tema);
  useEffect(
    () =>
      pasangLapisan(
        map,
        { [SUMBER.mini]: { type: "geojson", data: koleksi([fiturTempat(place)]) } },
        lapisanMini(temaAwal.current),
      ),
    [map, place],
  );
  return null;
}

// Mini-map detail. Koordinat perkiraan digambar pada zoom lebih jauh supaya tidak tampak seperti alamat.
export default function MiniMap({ place }: { place: PlaceWithGeo }) {
  return (
    <PetaMakan
      judul="map_mini_title"
      center={[place.lng, place.lat]}
      zoom={place.coord_approx ? 12.5 : 15}
      interaktif={false}
      className="mk-peta-mini"
    >
      <PinMini place={place} />
    </PetaMakan>
  );
}
