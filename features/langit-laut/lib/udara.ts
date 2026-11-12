// Kualitas udara Batam dari Open-Meteo (model Copernicus CAMS global, kisi sekitar 45 km, diperbarui dua kali sehari).
// Modul murni: tanpa React dan tanpa fetch, supaya bisa diuji dengan data contoh. Skala: AQI Amerika Serikat, yang
// di Open-Meteo adalah nilai tertinggi dari indeks tiap polutan (PM2.5, PM10, ozon, NO2, SO2, CO).

export type NadaUdara = "ok" | "caution" | "danger" | undefined;

export type KategoriUdara = { batas: number; kode: string; label: string; nada: NadaUdara; saran: string };

/** Batas atas tiap kategori, urut naik. Saran bersifat umum, mengikuti panduan skala AQI yang sama. */
export const KATEGORI_UDARA: KategoriUdara[] = [
  { batas: 50, kode: "baik", label: "Baik", nada: "ok", saran: "Udara bersih. Aman untuk kegiatan di luar ruangan." },
  {
    batas: 100,
    kode: "sedang",
    label: "Sedang",
    nada: undefined,
    saran: "Umumnya aman. Orang yang sangat peka terhadap polusi sebaiknya membatasi kegiatan berat yang lama di luar ruangan.",
  },
  {
    batas: 150,
    kode: "sensitif",
    label: "Tidak Sehat bagi Kelompok Sensitif",
    nada: "caution",
    saran:
      "Anak-anak, lansia, dan orang dengan asma, penyakit jantung, atau penyakit paru sebaiknya membatasi kegiatan berat yang lama di luar ruangan.",
  },
  {
    batas: 200,
    kode: "tidak-sehat",
    label: "Tidak Sehat",
    nada: "danger",
    saran: "Semua orang sebaiknya membatasi kegiatan berat yang lama di luar ruangan. Kelompok peka sebaiknya menghindarinya.",
  },
  {
    batas: 300,
    kode: "sangat-tidak-sehat",
    label: "Sangat Tidak Sehat",
    nada: "danger",
    saran: "Semua orang sebaiknya menghindari kegiatan berat di luar ruangan. Kelompok peka sebaiknya tetap di dalam ruangan.",
  },
  {
    batas: Infinity,
    kode: "berbahaya",
    label: "Berbahaya",
    nada: "danger",
    saran: "Semua orang sebaiknya menghindari kegiatan di luar ruangan.",
  },
];

export function kategoriUdara(aqi: number): KategoriUdara {
  return KATEGORI_UDARA.find((k) => aqi <= k.batas) ?? KATEGORI_UDARA[KATEGORI_UDARA.length - 1];
}

/** "0—50", "51—100", ..., "301 ke atas". */
export function rentangKategori(i: number): string {
  const bawah = i === 0 ? 0 : KATEGORI_UDARA[i - 1].batas + 1;
  const atas = KATEGORI_UDARA[i].batas;
  return Number.isFinite(atas) ? `${bawah}—${atas}` : `${bawah} ke atas`;
}

// ---------- Bentuk data ----------

/** Satu jam data. `waktu` adalah jam dinding WIB "2026-11-09T19:00" seperti yang dikirim Open-Meteo. */
export type JamUdara = { waktu: string; aqi: number; pm25: number | null; pm10: number | null };

export type UdaraResponse = {
  status: "ok" | "gagal";
  /** Kapan server mengambil data, ISO. */
  diambil: string | null;
  sekarang: JamUdara | null;
  /** AQI terendah dan tertinggi 24 jam terakhir. */
  lalu: { min: number; max: number } | null;
  /** Setiap 3 jam, 24 jam ke depan. */
  depan: JamUdara[];
};

export const UDARA_KOSONG: UdaraResponse = { status: "gagal", diambil: null, sekarang: null, lalu: null, depan: [] };

type Raw = Record<string, unknown>;

const angka = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? v : null);
const POLA_WAKTU = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

/** Jam dinding "2026-11-09T19:00" digeser n jam, tetap jam dinding. */
function geserJam(waktu: string, jam: number): string {
  const ms = Date.parse(`${waktu}:00Z`) + jam * 3600 * 1000;
  return new Date(ms).toISOString().slice(0, 16);
}

/**
 * Jawaban Open-Meteo menjadi bentuk yang dikirim ke peramban. Meminta `timezone=Asia/Jakarta`, jadi semua waktu sudah
 * WIB. Gagal keras bila AQI saat ini tidak ada, supaya route menjawab 503 dan tidak mengarang angka.
 */
export function bentukUdara(j: Raw, diambil: Date): UdaraResponse {
  const kini = (j.current ?? {}) as Raw;
  const waktuKini = typeof kini.time === "string" && POLA_WAKTU.test(kini.time) ? kini.time : null;
  const aqiKini = angka(kini.us_aqi);
  if (!waktuKini || aqiKini === null) throw new Error("schema: AQI saat ini tidak ada");

  const h = (j.hourly ?? {}) as Raw;
  const waktu = Array.isArray(h.time) ? (h.time as unknown[]) : [];
  const aqi = Array.isArray(h.us_aqi) ? (h.us_aqi as unknown[]) : [];
  const pm25 = Array.isArray(h.pm2_5) ? (h.pm2_5 as unknown[]) : [];
  const pm10 = Array.isArray(h.pm10) ? (h.pm10 as unknown[]) : [];
  const jam: JamUdara[] = [];
  waktu.forEach((w, i) => {
    const a = angka(aqi[i]);
    if (typeof w === "string" && POLA_WAKTU.test(w) && a !== null) {
      jam.push({ waktu: w, aqi: Math.round(a), pm25: angka(pm25[i]), pm10: angka(pm10[i]) });
    }
  });

  const awalLalu = geserJam(waktuKini, -24);
  const akhirDepan = geserJam(waktuKini, 24);
  const lalu = jam.filter((x) => x.waktu > awalLalu && x.waktu <= waktuKini).map((x) => x.aqi);
  // Model CAMS global bernilai tiap 3 jam; jam di antaranya hanya hasil sisipan, jadi yang ditampilkan jam kelipatan 3.
  const depan = jam.filter((x) => x.waktu > waktuKini && x.waktu <= akhirDepan && Number(x.waktu.slice(11, 13)) % 3 === 0);

  return {
    status: "ok",
    diambil: diambil.toISOString(),
    sekarang: { waktu: waktuKini, aqi: Math.round(aqiKini), pm25: angka(kini.pm2_5), pm10: angka(kini.pm10) },
    lalu: lalu.length ? { min: Math.min(...lalu), max: Math.max(...lalu) } : null,
    depan,
  };
}

// ---------- Teks ----------

/** "2026-11-09T19:00" menjadi "19.00". */
export const jamDari = (waktu: string) => waktu.slice(11, 16).replace(":", ".");

/** Tanggal jam dinding, untuk menandai "besok". */
export const tanggalDari = (waktu: string) => waktu.slice(0, 10);

/** 11.2 menjadi "11,2 µg/m³". */
export const teksPartikel = (n: number | null) =>
  n === null ? "—" : `${n.toLocaleString("id-ID", { maximumFractionDigits: 1 })} µg/m³`;
