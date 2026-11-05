// Gambar penanda gaya A untuk semua peta kerja (PEDOMAN 5.4). Nama gambar memuat ikon, warna, dan tanda perkiraan,
// jadi lapisan cukup menyebut namanya dan peta memuat gambarnya saat diperlukan lewat styleimagemissing.
import type { Map as MapLibre } from "maplibre-gl";
import { SKALA_PENANDA, svgPenanda } from "@/components/map/icons";

/** Warna kelompok yang dipakai peta loket. */
export const WARNA = { makan: "#E85A1F", transportasi: "#0078BF", cerita: "#914E72", putih: "#FFFFFF", tinta: "#161616" } as const;

export const namaGambar = (glyph: string, warna: string, perkiraan: boolean) =>
  `mk~${glyph}~${warna.replace("#", "")}${perkiraan ? "~p" : ""}`;

export function muatGambar(map: MapLibre, nama: string) {
  const [awal, glyph, warna, p] = nama.split("~");
  if (awal !== "mk" || !glyph || !warna || map.hasImage(nama)) return;
  const img = new Image();
  img.onload = () => {
    if (!map.hasImage(nama)) map.addImage(nama, img, { pixelRatio: SKALA_PENANDA });
  };
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgPenanda(glyph, `#${warna}`, p === "p"))}`;
}
