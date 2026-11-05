// Bentuk pin peta. Lapisan penanda ada di PetaTempat.tsx (PEDOMAN 5.4).

/** Bentuk pin dari route /info/direktori/pin.json (features/direktori/data.ts). */
export type PinPeta = {
  id: string;
  nama: string;
  k: string;
  sl: string;
  /** subkategori mentah, untuk panel Tempat */
  s?: string | null;
  lat: number;
  lng: number;
  perkiraan: boolean;
  lokasi: string;
  alamat: string | null;
  jam: string | null;
  lencana: { teks: string; nada?: "ok" | "caution" | "danger" | "info" }[];
  lain: { id: string; nama: string }[];
};
/** Pin dipakai berulang: id dibawa ke properties untuk dicari saat diklik. */
export function pinKeGeoJson(pins: PinPeta[]): GeoJSON.FeatureCollection {
  return {
    type: "FeatureCollection",
    features: pins.map((p) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      properties: { id: p.id, perkiraan: p.perkiraan },
    })),
  };
}
