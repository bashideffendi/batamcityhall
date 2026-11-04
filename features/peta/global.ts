import { addProtocol, setWorkerUrl } from "maplibre-gl";
import { Protocol } from "pmtiles";

// Worker dan protokol bersifat global di MapLibre, jadi cukup dipasang sekali per halaman.
// MapLibre 6 mencari worker di sebelah modulnya sendiri, dan setelah dibundel berkas itu tidak ada di
// sana. Pola new URL(..., import.meta.url) membuat bundler menyalinnya sebagai aset statis.
let terpasang = false;
export function pasangGlobalPeta() {
  if (terpasang) return;
  setWorkerUrl(new URL("../../node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);
  addProtocol("pmtiles", new Protocol().tile);
  terpasang = true;
}

export const webglAda = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};
