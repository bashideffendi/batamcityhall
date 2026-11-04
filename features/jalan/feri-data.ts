// Data feri untuk halaman Loket 04. Hanya dipakai di server: berkas mentah memuat catatan penyusun, jadi yang
// keluar dari sini sudah disaring. Teks untuk warga ditulis di sini, bukan disalin dari kolom catatan.
import ferriesMakan from "@/data/makan/ferries.json";
import ruteRaw from "@/data/feri/rute.json";
import jadwalRaw from "@/data/feri/jadwal.json";
import terminalRaw from "@/data/feri/terminal.json";
import pompong09 from "@/data/panduan/09-rute_pompong.json";
import indeksTempat from "@/data/places_id_index.json";
import { tempatPerId } from "@/features/direktori/data";
import { normalisasi, type JadwalMentah, type RuteMentah } from "./feri-terakhir";

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

/** Istilah kerja menjadi kata biasa. Dipakai untuk kolom yang boleh tampil apa adanya. */
export const teksWarga = (t: string) =>
  t
    .replace(/\*\*/g, "")
    .replace(/perlu_cek_ulang/g, "perlu cek ulang")
    .replace(/perlu_diisi_user|perlu_diisi/g, "belum diketahui");

/** Status data menjadi kata, untuk lencana. */
export function kataStatus(s: string | null | undefined): { teks: string; nada?: "caution" | "danger" } | null {
  if (!s) return null;
  if (/perlu_cek_ulang/.test(s)) return { teks: "perlu cek ulang", nada: "caution" };
  if (/usang|data lama/.test(s)) return { teks: "mungkin usang", nada: "caution" };
  if (/lemah/.test(s)) return { teks: "data lemah", nada: "caution" };
  if (/perlu_diisi/.test(s)) return { teks: "belum diketahui", nada: "caution" };
  return null;
}

/** Catatan per rute, ditulis ulang dari research/14. Kolom catatan mentah memuat catatan migrasi dan tidak ditampilkan. */
const CATATAN_RUTE: Record<string, string> = {
  "skp-hfc":
    "Sekupang paling cepat tutup. Terakhir 17:40 (BatamFast) atau 18:00 (Majestic). Situs Sindo mencantumkan 20:30, angka ini perlu dicek ulang.",
  "btc-hfc":
    "Dua halaman jadwal Sindo menampilkan versi yang berbeda. Sebagian trip Majestic hanya akhir pekan atau hari libur.",
  "btc-stl": "Dari Stulang: mulai MYR 123 sekali jalan. Tarif berlaku mulai 1 Januari 2026 menurut Indomas.",
  "hb-ph": "Jam dari satu contoh hari, bukan jadwal tetap.",
  "wfc-hfc": "Akhir pekan saja.",
  "tpg-tpi": "Beroperasi 07:30 sampai 17:30, tiap sekitar 30 menit. Jam di tabel hanya contoh akhir Juli 2026.",
  "tpg-tgu": "Beroperasi 07:00 sampai 18:00, tiap sekitar 30 menit.",
  "tpg-tgu-roro":
    "Tiket hanya online lewat Ferizy, tidak dijual di loket. Check-in minimal 2 jam sebelum berangkat. Motor Gol. II, mobil Gol. IVA. KMP Barau sedang docking. Jadwal pernah dijarangkan menjadi tiap 1 jam 15 menit pada Januari 2026 karena cuaca.",
  "tpg-trp": "Tergantung cuaca.",
  "skp-tbk": "Jadwal lama Dumai Express sudah tidak dipakai sebagai acuan.",
  "skp-dumai": "Yang ada hanya jadwal lama. Tarif Kuala Enok dan Kuala Tungkal sampai Rp600.000.",
  "skp-kundur-penyalai": "Yang ada hanya jadwal lama.",
  "b99-pelni":
    "Bukan jadwal harian. Kapal Pelni sandar di Bintang 99 Persada, Batu Ampar, sejak Desember 2024. Tiket lewat PELNI Mobile, pelni.co.id, atau loket cabang Pelni Batam. Jadwal final ada di aplikasi PELNI.",
  "batam-pasirgudang": "Belum ada jadwal resmi yang terverifikasi.",
  "tpg-roro-mengkapan-kualatungkal": "Ada layanan, jamnya belum terverifikasi.",
  "hb-domestik-tbk-moro": "Ada layanan, jamnya belum terverifikasi.",
  "hb-nirup": "Sekitar 45 menit. Jenis rute belum jelas di sumber.",
};

export const BANNER_TERGANGGU: Record<string, string> = {
  "gcb-hfc":
    "Terganggu. Di jadwal BatamFast per 1 Nov 2026 sebagian besar trip bertanda ditangguhkan sampai ada pemberitahuan. Yang tersisa: HarbourFront ke Gold Coast 09:35 (Sindo) dan 10:30, Gold Coast ke HarbourFront 15:30 (Sindo) dan 19:00.",
};

// ---------- Kartu rute ----------

export type BarisJadwal = {
  arah: string;
  jam: { jam: string; tanda: string | null }[];
  zona: string | null;
  hari: string | null;
  operasi: string | null;
  tanggal: string | null;
  lencana: { teks: string; nada?: "caution" | "danger" }[];
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
  status: { teks: string; nada?: "caution" | "danger" } | null;
  jadwal: BarisJadwal[];
};

const ZONA_SINGKAT: Record<string, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Singapore": "SGT",
  "Asia/Kuala_Lumpur": "MYT",
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
  return r.durasi_menit >= 120 ? `±${Math.round(r.durasi_menit / 60)} jam` : `±${r.durasi_menit} menit`;
}

function barisJadwal(j: JadwalMentah): BarisJadwal {
  const dasar: { jam: string; keterangan?: string | null }[] = j.trips?.length
    ? j.trips
    : j.per_kapal?.length
      ? j.per_kapal
          .flatMap((k) => k.jam_berangkat.map((jam) => ({ jam, keterangan: k.kapal })))
          .sort((a, b) => a.jam.localeCompare(b.jam))
      : j.jam_berangkat.map((jam) => ({ jam }));
  const lencana: BarisJadwal["lencana"] = [];
  const perluCek =
    /majestic/i.test(j.arah) || /perlu_cek/.test(`${j.status_data ?? ""} ${j.hari ?? ""} ${j.catatan ?? ""}`);
  if (j.status_data === "usang") lencana.push({ teks: "jadwal lama, usang", nada: "danger" });
  else if (perluCek) lencana.push({ teks: "perlu cek ulang", nada: "caution" });
  if (/contoh/i.test(j.hari ?? "")) lencana.push({ teks: "contoh" });
  const hari = j.hari
    ?.replace(/\s*\(tanda tidak terbaca[^)]*\)/i, "")
    .replace(/\s*\(?perlu_cek_ulang\)?/gi, "")
    .trim();
  return {
    arah: j.arah
      .replace(/\s*->\s*/g, " → ")
      .replace(/\s*<->\s*/g, " ⇄ ")
      .replace(/,\s*(WIB|SGT|MYT)\)/, ")")
      .replace(/\s*\((WIB|SGT|MYT)\)/, ""),
    jam: dasar.map((t) => ({
      jam: t.jam,
      tanda: t.keterangan ? teksWarga(t.keterangan).replace(/^\d{2}:\d{2}\s*/, "") : null,
    })),
    zona: j.zona_waktu ? (ZONA_SINGKAT[j.zona_waktu] ?? null) : null,
    hari: hari || null,
    operasi: j.jam_operasi ? `${j.jam_operasi}${j.interval ? `, ${j.interval}` : ""}` : null,
    tanggal: j.tanggal_data ?? null,
    lencana,
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
    judul: `${asal} ⇄ ${tujuanPublik(r.tujuan)}`,
    operator,
    durasi: durasiPublik(r),
    harga: hargaMulaiDari(r),
    link: r.link_jadwal_resmi ?? null,
    catatan: CATATAN_RUTE[r.id] ?? null,
    terganggu: BANNER_TERGANGGU[r.id] ?? null,
    status: kataStatus(r.status_data),
    jadwal: JADWAL.filter((j) => j.rute_id === r.id && (j.jam_berangkat.length > 0 || j.jam_operasi)).map(barisJadwal),
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
  status: { teks: string; nada?: "caution" | "danger" } | null;
  catatan: string | null;
  tegas: boolean;
};

const nilai = (v: unknown) => (typeof v === "string" && v !== "–" ? teksWarga(v) : null);

// Keterangan tambahan dari laporan 09, yang menyebut tahun dan sumber berbeda dari tabel laporan 14.
const TAMBAHAN_09: Record<string, string> = {
  "sgl-buluh": "Sumber lain mencatat Rp20.000 untuk pulau dekat sampai Rp25.000 untuk pulau jauh (data 2022).",
  "skp-blp":
    "Naik dari Rp18.000 pada September 2022 karena harga BBM. Satu pompong standarnya 12 penumpang dan 1 pengemudi.",
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
    status: kataStatus(r.status_data_asli) ?? kataStatus(r.status_data),
    catatan: TAMBAHAN_09[r.id] ?? null,
    tegas: r.id === "skp-blp",
  };
});

/** Rute di laporan 09 yang tidak ada di tabel laporan 14. Titik asalnya tidak disebut sumber. */
export const POMPONG_TANPA_ASAL = (
  pompong09.rute as unknown as { id: string; tujuan: unknown; keterangan_tabel?: string }[]
)
  .filter((r) => r.id === "trp-rutepemping")
  .map((r) => ({
    tujuan: (Array.isArray(r.tujuan) ? r.tujuan : [String(r.tujuan)]).join(", "),
    keterangan: "Pompong reguler sekali sehari, carter mahal. Data riset lama, titik asal tidak disebut.",
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
    catatan: "Jadwal PDF Mei 2026",
  },
  { nama: "Sindo Ferry", url: "https://www.sindoferry.com.sg/schedules" },
  { nama: "Horizon Fast Ferry", url: "https://horizonfastferry.com.sg/" },
  { nama: "Indomas Ferry", url: "https://www.indomasferry.com/", catatan: "Johor Bahru" },
  { nama: "Ferry Global Group", url: "https://ferryglobalgroup.com/schedule", catatan: "Puteri Harbour" },
  { nama: "Ferizy (ASDP)", url: "https://trip.ferizy.com", catatan: "tiket RoRo, hanya online" },
  { nama: "PELNI", url: "https://www.pelni.co.id" },
  {
    nama: "BP Batam, Telaga Punggur",
    url: "https://batamport.bpbatam.go.id/telaga-punggur/",
    catatan: "harga resmi domestik",
  },
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

const CATATAN_TERMINAL: Record<string, string> = {
  skp: "Sumber memberi beberapa titik yang berbeda sampai sekitar 1,8 km. Tunggu cek lapangan.",
};

/**
 * Koordinat hanya dari places.json (prompt 4.5). Terverifikasi = pin penuh, perlu cek = berongga, kosong = daftar
 * "lokasi belum diisi". Terminal Singapura dan Malaysia hanya konteks rute, bukan pin direktori (brief 14).
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
        catatan: perkiraan
          ? (CATATAN_TERMINAL[t.id] ?? "Lokasi perkiraan, belum dicek di lapangan.")
          : "Koordinat cocok di dua sumber independen, belum dicek langsung di lapangan.",
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
