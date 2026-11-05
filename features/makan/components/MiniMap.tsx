"use client";

import { useEffect } from "react";
import { ferryMap } from "../lib/data";
import { fiturFeri, fiturTempat, koleksi, lapisanMini, SUMBER } from "../lib/peta";
import type { PlaceWithGeo } from "../lib/types";
import PetaMakan, { pasangLapisan, usePeta } from "./PetaMakan";

function PinMini({ place }: { place: PlaceWithGeo }) {
  const { map } = usePeta();
  useEffect(
    () =>
      pasangLapisan(
        map,
        {
          [SUMBER.mini]: {
            type: "geojson",
            data: koleksi(ferryMap[place.nearestFerryId] ? [fiturFeri(ferryMap[place.nearestFerryId]), fiturTempat(place)] : [fiturTempat(place)]),
          },
        },
        lapisanMini(),
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
