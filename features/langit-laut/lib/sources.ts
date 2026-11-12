// ---------------------------------------------------------------------------
// SATU tempat untuk semua host/URL eksternal (tanpa secret). Kalau sumber pindah
// host (BMKG pernah: peta-maritim → maritim, 2026-09), cukup ubah di sini —
// probe di server dan tile di klien dijamin pakai path yang SAMA.
// ---------------------------------------------------------------------------

import { SITE_URL } from "@/lib/site";

// MSS (Meteorological Service Singapore) — citra radar 240 km, PNG per 5 menit.
export const MSS_FILE_BASE = "https://www.weather.gov.sg/files/rainarea/240km";
export const MSS_HOST = "https://www.weather.gov.sg";

// NEA (National Environment Agency, Singapura) lewat data.gov.sg.
// v1 masih hidup (dicek 2026-09-26, tanpa header deprecation); angin & nowcast di v2.
export const NEA = {
  psi: "https://api.data.gov.sg/v1/environment/psi",
  uv: "https://api.data.gov.sg/v1/environment/uv-index",
  rain: "https://api.data.gov.sg/v1/environment/rainfall",
  windSpeed: "https://api-open.data.gov.sg/v2/real-time/api/wind-speed",
  windDir: "https://api-open.data.gov.sg/v2/real-time/api/wind-direction",
  nowcast: "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast",
} as const;

// BMKG OFS (Ocean Forecast System). Host LAMA peta-maritim.bmkg.go.id sekarang
// 301 → maritim.bmkg.go.id (dicek 2026-09-26) — pakai host baru langsung supaya
// tiap tile nggak bayar satu round-trip redirect.
// 12 Nov 2026: situs maritim baru BMKG menjawab 404 untuk api21 (modelrun dan ubin), dan peta-maritim kini
// mengalihkan ke maritim. Selama itu peta gelombang memakai Copernicus (lib/copernicus.ts).
export const OFS_HOST = "https://maritim.bmkg.go.id";
export const OFS_MODELRUN = `${OFS_HOST}/api21/modelrun`;
/**
 * Identitas permintaan server ke BMKG: jujur, tanpa menyamar sebagai browser dan tanpa Referer.
 * Diuji 4 Nov 2026 dari PC pemilik: perairan, warnings, dan modelrun semuanya 200 (PLAN butir 1).
 */
export const BMKG_HEADERS = { "User-Agent": `BatamCityHall/0.1 (+${SITE_URL})`, Accept: "application/json" };
/**
 * Prakiraan perairan "Perairan Kep. Batam" (P.R.02) + peringatan dini gelombang per provinsi,
 * API maritim BMKG baru marine2026-data (dok: maritim.bmkg.go.id/apidoc). Jalur lama
 * public_api/perairan/E.02.json sudah 404 (dicek 29 Sep 2026).
 */
export const OFS_PERAIRAN = `${OFS_HOST}/marine2026-data/perairan/P.R.02.json`;
export const OFS_WARNINGS = `${OFS_HOST}/marine2026-data/warning/warnings.json`;
/** Template tile TMS (y-flip) pre-colored contourf swh. z/x/y boleh angka atau placeholder {z}/{x}/{y}. */
export const ofsTilePath = (
  baserun: string,
  valid: string,
  z: number | string,
  x: number | string,
  y: number | string,
) =>
  `${OFS_HOST}/api21/mpl_req/w3g_hires/swh/0/${baserun}/${valid}/${z}/${x}/${y}.png?ci=1&overlays=,contourf&conc=snow`;

/**
 * Copernicus Marine (Uni Eropa): prakiraan tinggi gelombang signifikan (VHM0) global 1/12 derajat, per 3 jam,
 * lewat WMTS publik tanpa akun (CORS *). Pilihan kedua di peta gelombang, dan cadangan otomatis saat ubin OFS
 * BMKG tidak bisa dimuat (12 Nov 2026: jalur api21 BMKG 404 sejak situs maritim baru). Ubin diminta dalam skala
 * abu-abu 0 sampai 7 m lalu diwarnai ulang di peramban dengan skala warna BMKG (lib/copernicus.ts).
 */
export const CMEMS_WMTS = "https://wmts.marine.copernicus.eu/teroWmts";
export const CMEMS_LAYER = "GLOBAL_ANALYSISFORECAST_WAV_001_027/cmems_mod_glo_wav_anfc_0.083deg_PT3H-i_202411/VHM0";
/** Skala abu-abu cmocean, rentang 0 sampai 7 m (sama dengan OFS_MAX_M). Tabel warnanya dibaca dari GetLegend. */
export const CMEMS_GAYA = "cmap:gray,range:0/7";
const cmemsParam = (p: Record<string, string>) =>
  new URLSearchParams({ SERVICE: "WMTS", VERSION: "1.0.0", LAYER: CMEMS_LAYER, STYLE: CMEMS_GAYA, ...p }).toString();
/** Satu ubin 256 px skema XYZ (EPSG:3857). `waktu` ISO UTC, mis. "2026-11-12T03:00:00Z". */
export const cmemsUbin = (waktu: string, z: number | string, x: number | string, y: number | string) =>
  `${CMEMS_WMTS}?${cmemsParam({
    REQUEST: "GetTile",
    TILEMATRIXSET: "EPSG:3857",
    TILEMATRIX: String(z),
    TILEROW: String(y),
    TILECOL: String(x),
    FORMAT: "image/png",
    TIME: waktu,
  })}`;
/** Tabel 256 warna skala abu-abu di atas, untuk membalik warna piksel menjadi meter. */
export const CMEMS_LEGENDA = `${CMEMS_WMTS}?${cmemsParam({ REQUEST: "GetLegend", FORMAT: "application/json" })}`;

// BMKG prakiraan cuaca per kelurahan (kode wilayah tingkat IV). 21.71.10.1003 = Teluk
// Tering, Kec. Batam Kota (Batam Center) — dipakai sebagai wakil pusat kota. CORS *, tapi
// app menariknya lewat server (lihat app/api/prakiraan).
/**
 * Kualitas udara: Open-Meteo, model Copernicus CAMS global (CC BY 4.0, gratis untuk situs non-komersial, kredit di
 * Kolofon). Titiknya titik kisi model terdekat dengan Pulau Batam seperti yang dijawab Open-Meteo, bukan koordinat
 * tempat. Satu kisi selebar sekitar 45 km, jadi angkanya berlaku untuk seluruh wilayah, bukan per kecamatan.
 */
export const OPEN_METEO_UDARA =
  "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=1.1&longitude=104.1" +
  "&current=us_aqi,pm2_5,pm10&hourly=us_aqi,pm2_5,pm10&timezone=Asia%2FJakarta&past_days=1&forecast_days=2";

export const BMKG_FORECAST ="https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=21.71.10.1003";
export const BMKG_FORECAST_PLACE = "Batam Kota";

// BMKG gempa (dok: data.bmkg.go.id/gempabumi). Batas 60 permintaan per menit per IP, wajib atribusi.
// Diuji 5 Nov 2026 dari PC pemilik dengan BMKG_HEADERS: ketiganya 200, CORS *, max-age=60.
const BMKG_TEWS = "https://data.bmkg.go.id/DataMKG/TEWS";
export const BMKG_GEMPA = {
  terbaru: `${BMKG_TEWS}/autogempa.json`,
  m5: `${BMKG_TEWS}/gempaterkini.json`,
  dirasakan: `${BMKG_TEWS}/gempadirasakan.json`,
} as const;
export const BMKG_GEMPA_DOK = "https://data.bmkg.go.id/gempabumi/";
/** Peta guncangan: nama berkas dari kolom Shakemap autogempa. */
export const bmkgShakemapUrl = (berkas: string) => `https://static.bmkg.go.id/${berkas}`;

// BMKG peringatan dini cuaca, format CAP (dok: data.bmkg.go.id/peringatan-dini-cuaca). Batas dan
// kewajiban atribusi sama. RSS = daftar per provinsi; tiap butir punya satu XML CAP berisi poligon.
// Diuji 5 Nov 2026 dari PC pemilik dengan BMKG_HEADERS: RSS dan XML Kep. Riau 200.
export const BMKG_CAP_RSS = "https://www.bmkg.go.id/alerts/nowcast/id";
export const BMKG_CAP_DOK = "https://data.bmkg.go.id/peringatan-dini-cuaca/";
export const BMKG_CAP_ISTILAH =
  "https://github.com/infoBMKG/data-cap/blob/main/urgency%2C%20severity%2C%20and%20certainty%20-%20(en-id).pdf";
export const bmkgCapUrl = (kode: string) => `${BMKG_CAP_RSS}/${kode}_alert.xml`;

// CCTV Pemko Batam (HLS publik). Hostname tetap kelihatan di tab Network — nggak bisa disembunyikan.
export const CCTV_HOST = "https://matanya.batam.go.id";
