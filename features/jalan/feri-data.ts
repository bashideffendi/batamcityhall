// Data feri untuk halaman Loket 04. Hanya dipakai di server: berkas mentah memuat catatan penyusun, jadi yang
// keluar dari sini sudah disaring. Teks untuk warga ditulis di sini, bukan disalin dari kolom catatan.
import "server-only";
import ferriesMakan from "@/data/makan/ferries.json";
import ruteRaw from "@/data/feri/rute.json";
import jadwalRaw from "@/data/feri/jadwal.json";
import terminalRaw from "@/data/feri/terminal.json";
import pompong09 from "@/data/panduan/09-rute_pompong.json";
import indeksTempat from "@/data/places_id_index.json";
import { tempatPerId } from "@/features/direktori/data";
import {
  hariPublik,
  jamTitik,
  normalisasi,
  operatorEntri,
  pecahArah,
  singkatanZona,
  tautanPublik,
  teksInterval,
  zonaSah,
  type JadwalMentah,
  type RuteMentah,
} from "./feri-terakhir";

type DariTabel = Record<string, string | number | undefined>;
export type RuteData = RuteMentah & {
  durasi_menit?: number | null;
  harga_kisaran?: string | null;
  status_data?: string | null;
  status_data_asli?: string | null;
  dari_tabel?: DariTabel[];
};
type TerminalData = {
  id: string;
  nama: string;
  jenis: string;
  kecamatan: string | null;
  alamat: string | null;
};

const RUTE_UTAMA = ruteRaw.rute as unknown as RuteData[];
const RUTE_TAMBAHAN = ruteRaw.rute_tambahan as unknown as RuteData[];
export const SEMUA_RUTE: RuteData[] = [...RUTE_UTAMA, ...RUTE_TAMBAHAN];
export const JADWAL = jadwalRaw.jadwal as unknown as JadwalMentah[];
export const TERMINAL = terminalRaw.terminal as unknown as TerminalData[];
export const DATA_PER = ruteRaw.meta.data_per;

/** Nama pendek terminal asal: warga menyebut "Batam Centre", bukan nama resmi yang panjang. */
export const NAMA_ASAL: Record<string, string> = {
  btc: "Batam Centre",
  skp: "Sekupang",
  hb: "Harbour Bay",
  nsp: "Nongsapura",
  gcb: "Gold Coast Bengkong",
  wfc: "Waterfront City",
  tpg: "Telaga Punggur",
  b99: "Bintang 99 Persada",
  bta: "Batu Ampar",
  ...Object.fromEntries(TERMINAL.filter((t) => t.id.startsWith("pr-")).map((t) => [t.id, t.nama])),
};

export const ENTRI_FERI = normalisasi(JADWAL, SEMUA_RUTE, NAMA_ASAL);

// ---------- Teks publik ----------

/** Istilah kerja dibuang atau menjadi kata biasa. Dipakai untuk kolom yang boleh tampil apa adanya. */
export const teksWarga = (t: string) =>
  t
    .replace(/\*\*/g, "")
    .replace(/\s*\(?perlu_cek_ulang\)?/g, "")
    .replace(/perlu_diisi_user|perlu_diisi/g, "belum tercatat");

/** Catatan per rute, ditulis ulang dari research/14. Kolom catatan mentah memuat catatan migrasi dan tidak ditampilkan. */
const CATATAN_RUTE: Record<string, string> = {
  "skp-hfc":
    "Keberangkatan terakhir lebih awal daripada terminal lain: pukul 17.40 WIB (BatamFast) atau 18.00 WIB (Majestic). Jadwal Sindo mencantumkan pukul 20.30 WIB, jadi tanyakan kepada operator.",
  "btc-hfc":
    "Jadwal Sindo tampil dalam dua versi. Sebagian keberangkatan Majestic hanya pada akhir pekan atau hari libur.",
  "btc-stl": "Dari Stulang: mulai MYR 123 sekali jalan, berlaku sejak 1 Januari 2026.",
  "hb-ph": "Jam di tabel dari satu contoh hari.",
  "wfc-hfc": "Hanya pada akhir pekan.",
  "tpg-tgu-roro":
    "Tiket hanya dijual daring lewat Ferizy. Lapor masuk minimal 2 jam sebelum berangkat. Motor golongan II, mobil golongan IVA. KMP Barau sedang naik dok. Jadwal pernah dijarangkan menjadi setiap 1 jam 15 menit pada Januari 2026 karena cuaca.",
  "tpg-trp": "Bergantung pada cuaca.",
  "skp-dumai": "Tarif ke Kuala Enok dan Kuala Tungkal sampai Rp600.000.",
  "b99-pelni":
    "Bukan jadwal harian. Kapal Pelni sandar di Bintang 99 Persada, Batu Ampar, sejak Desember 2024. Tiket dijual lewat PELNI Mobile, pelni.co.id, atau loket cabang Pelni Batam. Jadwal terbaru ada di aplikasi PELNI.",
  "tpg-roro-mengkapan-kualatungkal": "Layanan ada, jamnya belum tercatat.",
  "hb-domestik-tbk-moro": "Layanan ada, jamnya belum tercatat.",
};

// Zona jam Gold Coast tidak tercatat di data, jadi ditulis "waktu setempat" tanpa menebak WIB atau waktu Singapura.
export const BANNER_TERGANGGU: Record<string, string> = {
  "gcb-hfc":
    "Terganggu. Per 1 November 2026 sebagian besar keberangkatan BatamFast ditangguhkan sampai ada pemberitahuan. Sisanya, waktu setempat: HarbourFront ke Gold Coast pukul 09.35 (Sindo) dan 10.30, Gold Coast ke HarbourFront pukul 15.30 (Sindo) dan 19.00.",
};

// ---------- Kartu rute ----------

export type BarisJadwal = {
  rute: string;
  operator: string | null;
  jam: { jam: string; tanda: string | null }[];
  zona: string | null;
  hari: string | null;
  operasi: string | null;
  tanggal: string | null;
  /** Jadwal yang masih diragukan mendapat catatan yang sama dengan jadwal lama. */
  perluCek: boolean;
};

export type KartuRute = {
  id: string;
  jenis: "internasional" | "domestik" | "lainnya";
  judul: string;
  operator: string | null;
  durasi: string | null;
  harga: string | null;
  link: string | null;
  catatan: string | null;
  terganggu: string | null;
  jadwal: BarisJadwal[];
};

function tujuanPublik(t: string) {
  return t.replace(/^Stulang Laut \(Johor Bahru\)$/, "Stulang Laut / Berjaya Waterfront (Johor Bahru)");
}

/** Harga selalu "mulai dari" (brief 14): kata "mulai" dari data dibuang supaya tidak dobel. */
export function hargaMulaiDari(r: RuteData): string | null {
  const dariTabel = r.dari_tabel?.[0];
  const mentah =
    r.harga_kisaran ??
    (dariTabel?.["Harga"] as string | undefined) ??
    (dariTabel?.["Harga (sekali jalan)"] as string | undefined);
  if (!mentah || mentah === "–" || mentah === "-") return null;
  return mentah.replace(/\bmulai\s+/gi, "").trim();
}

function durasiPublik(r: RuteData): string | null {
  const dariTabel = r.dari_tabel?.[0]?.["Durasi"];
  if (typeof dariTabel === "string" && dariTabel !== "–") return teksWarga(dariTabel);
  if (!r.durasi_menit) return null;
  return r.durasi_menit >= 120 ? `sekitar ${Math.round(r.durasi_menit / 60)} jam` : `sekitar ${r.durasi_menit} menit`;
}

/** Tanda per jam: hari ditulis penuh, penanda keraguan dibuang. Isinya bisa nama kapal atau operator. */
const tandaPublik = (keterangan: string | null | undefined) =>
  keterangan ? hariPublik(keterangan.replace(/^\d{2}:\d{2}\s*/, "")) : null;

function barisJadwal(j: JadwalMentah, r: RuteData): BarisJadwal {
  const dasar: { jam: string; keterangan?: string | null }[] = j.trips?.length
    ? j.trips
    : j.per_kapal?.length
      ? j.per_kapal
          .flatMap((k) => k.jam_berangkat.map((jam) => ({ jam, keterangan: k.kapal })))
          .sort((a, b) => a.jam.localeCompare(b.jam))
      : j.jam_berangkat.map((jam) => ({ jam }));
  const zonaSahih = zonaSah(j.zona_waktu);
  const zona = zonaSahih ? singkatanZona(zonaSahih) : null;
  const { asal, tujuan } = pecahArah(j.arah);
  const operasi = j.jam_operasi
    ? `${jamTitik(j.jam_operasi).replace(/\s*[–-]\s*/, "—")}${zona ? ` ${zona}` : ""}${j.interval ? `, ${teksInterval(j.interval)}` : ""}`
    : null;
  return {
    rute: tujuan ? `${asal} → ${tujuan}` : asal,
    operator: operatorEntri(j, r),
    jam: dasar.map((t) => ({ jam: jamTitik(t.jam), tanda: tandaPublik(t.keterangan) })),
    zona,
    hari: hariPublik(j.hari, zonaSahih),
    operasi,
    tanggal: j.tanggal_data ?? null,
    perluCek: /majestic/i.test(j.arah) || /perlu_cek/.test(`${j.status_data ?? ""} ${j.hari ?? ""} ${j.catatan ?? ""}`),
  };
}

function kartu(r: RuteData): KartuRute {
  const asal = (r.asal_ids ?? (r.asal_id ? [r.asal_id] : [])).map((id) => NAMA_ASAL[id] ?? id).join(" / ");
  const operator = r.operator.length
    ? r.operator.join(", ").replace(/,\s*lainnya$/, " dan lainnya")
    : ((r.dari_tabel?.[0]?.["Operator / kapal"] as string | undefined)?.replace(/^–$/, "") ?? "") || null;
  return {
    id: r.id,
    jenis: r.jenis === "internasional" || r.jenis === "domestik" ? r.jenis : "lainnya",
    judul: `${asal}—${tujuanPublik(r.tujuan)}`,
    operator,
    durasi: durasiPublik(r),
    harga: hargaMulaiDari(r),
    link: tautanPublik(r.link_jadwal_resmi),
    catatan: CATATAN_RUTE[r.id] ?? null,
    terganggu: BANNER_TERGANGGU[r.id] ?? null,
    // Jadwal berstatus usang tanpa tanggal tidak ditampilkan: tidak ada yang bisa ditulis sebagai "Jadwal per".
    jadwal: JADWAL.filter(
      (j) => j.rute_id === r.id && j.status_data !== "usang" && (j.jam_berangkat.length > 0 || j.jam_operasi),
    ).map((j) => barisJadwal(j, r)),
  };
}

export const KARTU_FERI: KartuRute[] = SEMUA_RUTE.filter((r) => r.jenis !== "pompong").map(kartu);

// ---------- Pompong ----------

export type BarisPompong = {
  id: string;
  dari: string;
  kecamatan: string | null;
  tujuan: string;
  jam: string | null;
  tarif: string | null;
  durasi: string | null;
  catatan: string | null;
  tegas: boolean;
};

const nilai = (v: unknown) => (typeof v === "string" && v !== "–" ? teksWarga(v) : null);

// Keterangan tambahan dari riset 09, yang menyebut tahun berbeda dari tabel riset 14.
const TAMBAHAN_09: Record<string, string> = {
  "sgl-buluh": "Tahun 2022 tercatat Rp20.000 untuk pulau dekat dan Rp25.000 untuk pulau jauh.",
  "skp-blp":
    "Tarif naik dari Rp18.000 pada September 2022 karena harga BBM. Satu perahu memuat 12 penumpang dan satu pengemudi.",
};

export const BARIS_POMPONG: BarisPompong[] = SEMUA_RUTE.filter((r) => r.jenis === "pompong").map((r) => {
  const t = r.dari_tabel?.[0] ?? {};
  return {
    id: r.id,
    dari: nilai(t["Pelantar"]) ?? r.id,
    kecamatan: nilai(t["Kecamatan"]),
    tujuan: nilai(t["Tujuan"]) ?? r.tujuan,
    jam: nilai(t["Jam operasi"]),
    tarif: nilai(t["Tarif"]),
    durasi: nilai(t["Durasi"]),
    catatan: TAMBAHAN_09[r.id] ?? null,
    tegas: r.id === "skp-blp",
  };
});

/** Rute di riset 09 yang tidak ada di tabel riset 14. Titik asalnya tidak tercatat. */
export const POMPONG_TANPA_ASAL = (
  pompong09.rute as unknown as { id: string; tujuan: unknown; keterangan_tabel?: string }[]
)
  .filter((r) => r.id === "trp-rutepemping")
  .map((r) => ({
    tujuan: (Array.isArray(r.tujuan) ? r.tujuan : [String(r.tujuan)]).join(", "),
    keterangan: "Carter mahal",
  }));

/** Pelantar yang tercatat tetapi belum punya tujuan atau tarif. */
export const PELANTAR_KOSONG = TERMINAL.filter(
  (t) => t.jenis === "pelantar_pompong" && !SEMUA_RUTE.some((r) => r.asal_id === t.id),
).map((t) => ({ id: t.id, nama: t.nama, kecamatan: t.kecamatan }));

// ---------- Terminal dan tautan ----------

const INDEKS = indeksTempat as unknown as Record<string, string>;

/** Id terminal feri (`btc`) ke entri places.json. Koordinat hanya boleh dari sana (prompt 4.5). */
export const tempatTerminal = (id: string) => tempatPerId.get(INDEKS[id] ?? id);

const terminalPerKanonik = new Map(
  TERMINAL.flatMap((t) => (INDEKS[t.id] ? ([[INDEKS[t.id], t.id]] as [string, string][]) : [])),
);

/** Id terminal di data Makan (`batam-centre`) ke id terminal feri (`btc`), lewat id kanonik places.json. */
export function terminalDariMakan(idMakan: string): string | null {
  const kanonik = (ferriesMakan as { id: string; id_kanonik?: string }[]).find((f) => f.id === idMakan)?.id_kanonik;
  return (kanonik && terminalPerKanonik.get(kanonik)) ?? null;
}

export const TAUTAN_OPERATOR: { nama: string; url: string; catatan?: string }[] = [
  { nama: "BatamFast", url: "https://www.batamfast.com/" },
  {
    nama: "Majestic Fast Ferry",
    url: "https://www.majesticfastferry.com.sg/",
    catatan: "Jadwal Mei 2026 dalam PDF",
  },
  { nama: "Sindo Ferry", url: "https://www.sindoferry.com.sg/schedules" },
  { nama: "Horizon Fast Ferry", url: "https://horizonfastferry.com.sg/" },
  { nama: "Indomas Ferry", url: "https://www.indomasferry.com/", catatan: "Johor Bahru" },
  { nama: "Ferry Global Group", url: "https://ferryglobalgroup.com/schedule", catatan: "Puteri Harbour" },
  { nama: "Ferizy (ASDP)", url: "https://trip.ferizy.com", catatan: "tiket RoRo, hanya daring" },
  { nama: "PELNI", url: "https://www.pelni.co.id" },
  { nama: "KPompong", url: "https://kpompong.com/", catatan: "PPMS Sekupang" },
];

export const PAPAN_SCC = "https://singaporecruise.com.sg/schedule/ferries/";

// ---------- Terminal di peta ----------

type TitikTerminal = {
  id: string;
  nama: string;
  jenis: "terminal";
  lat: number;
  lng: number;
  perkiraan: boolean;
  catatan: string;
  rincian: string;
  href: string;
};

const TERMINAL_LUAR = (t: TerminalData) => t.jenis === "terminal_tujuan";

/**
 * Koordinat hanya dari places.json (prompt 4.5). Terverifikasi = pin penuh, perlu cek = berongga, kosong = daftar
 * di bawah peta. Terminal Singapura dan Malaysia hanya konteks rute, bukan pin direktori (brief 14).
 */
export function titikTerminalDiPeta(): TitikTerminal[] {
  return TERMINAL.flatMap((t) => {
    if (TERMINAL_LUAR(t)) return [];
    const p = tempatTerminal(t.id);
    if (!p || p.lat === null || p.lng === null) return [];
    const perkiraan = p.status_koordinat !== "terverifikasi";
    const rute = SEMUA_RUTE.filter((r) => (r.asal_ids ?? [r.asal_id]).includes(t.id)).length;
    return [
      {
        id: t.id,
        nama: NAMA_ASAL[t.id] ?? t.nama,
        jenis: "terminal" as const,
        lat: p.lat,
        lng: p.lng,
        perkiraan,
        catatan: perkiraan ? "Titik ini perkiraan area." : "",
        rincian: rute ? `${rute} rute tercatat` : "Belum ada rute penumpang tercatat",
        href: `/info/tempat/${p.id}`,
      },
    ];
  });
}

export const TERMINAL_TANPA_TITIK = TERMINAL.filter((t) => {
  if (TERMINAL_LUAR(t)) return false;
  const p = tempatTerminal(t.id);
  return !p || p.lat === null || p.lng === null;
}).map((t) => ({ id: t.id, nama: t.nama, kecamatan: t.kecamatan }));

export const TERMINAL_LUAR_BATAM = TERMINAL.filter(TERMINAL_LUAR).map((t) => ({
  id: t.id,
  nama: t.nama,
  alamat: t.alamat,
}));
