// Siapa di Balik Nama Jalan, dari data/tokoh/. Hanya untuk server, kecuali baris ringkas untuk filter.
// tokoh.json dan penamaan.json memuat catatan penyusun: yang tampil ke warga lewat fungsi di sini.
import { readFileSync } from "node:fs";
import path from "node:path";
import penamaanRaw from "@/data/tokoh/penamaan.json";
import relasiRaw from "@/data/tokoh/relasi.json";
import tokohRaw from "@/data/tokoh/tokoh.json";
import { tautanAman, TEMPAT, type Nada } from "@/features/direktori/data";
import { rapiAtauKosong, rapiTeks } from "@/features/sejarah/rapi";

export const KELOMPOK: { id: string; nama: string }[] = [
  { id: "a", nama: "Melayu Riau-Lingga, Johor, Malaka, dan Riau daratan" },
  { id: "b", nama: "Hikayat dan legenda" },
  { id: "c", nama: "Tokoh nasional" },
  { id: "d", nama: "Pembangunan Batam" },
  { id: "e", nama: "Tokoh lokal dan adat" },
];

export type GrupStatus = "terverifikasi" | "beda_versi" | "belum_terverifikasi" | "hikayat";

export const GRUP_STATUS: { id: GrupStatus; nama: string }[] = [
  { id: "terverifikasi", nama: "Tercatat" },
  { id: "beda_versi", nama: "Berbeda versi" },
  { id: "belum_terverifikasi", nama: "Belum terverifikasi" },
  { id: "hikayat", nama: "Cerita rakyat" },
];

export type StatusTokoh = { grup: GrupStatus; teks: string; nada: Nada; hikayat: boolean };

const BEDA_VERSI: StatusTokoh = { grup: "beda_versi", teks: "Berbeda versi", nada: "caution", hikayat: false };

// Label status satu per kartu (pedoman 3.7). `hikayat` menentukan bingkai kartu, bukan labelnya: Hang Nadim tetap
// berbingkai hikayat, tetapi perlawanannya tercatat, jadi labelnya bukan Cerita rakyat.
const STATUS: Record<string, StatusTokoh> = {
  terverifikasi: { grup: "terverifikasi", teks: "Tercatat", nada: "ok", hikayat: false },
  terverifikasi_beda_versi: BEDA_VERSI,
  beda_versi: BEDA_VERSI,
  terverifikasi_asal_usul_hikayat: BEDA_VERSI,
  hikayat: { grup: "hikayat", teks: "Cerita rakyat", nada: "info", hikayat: true },
  semi_historis: { grup: "belum_terverifikasi", teks: "Belum terverifikasi", nada: "info", hikayat: true },
  perlu_dicek: { grup: "belum_terverifikasi", teks: "Belum terverifikasi", nada: "caution", hikayat: false },
};
const STATUS_RINGKAS: StatusTokoh = {
  grup: "belum_terverifikasi",
  teks: "Belum terverifikasi",
  nada: undefined,
  hikayat: false,
};

export const statusTokoh = (s: string | null): StatusTokoh => (s ? (STATUS[s] ?? STATUS_RINGKAS) : STATUS_RINGKAS);

const kapital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Ringkasan yang di data masih berbunyi instruksi untuk penyusun.
const GANTI_RINGKASAN: Record<string, string> = {
  laksamana_bintan:
    "Laksamana adalah jabatan panglima laut, bukan nama satu orang. Tokoh tertentu di balik nama jalan ini belum teridentifikasi.",
  dang_anom:
    'Belum ditemukan sumber kredibel tentang tokoh bernama Dang Anom. "Dang" adalah sebutan bagi perempuan istana atau dayang dalam hikayat Melayu.',
};

function ringkasanTokoh(id: string, teks: string): string {
  if (GANTI_RINGKASAN[id]) return rapiTeks(GANTI_RINGKASAN[id]);
  return rapiTeks(
    kapital(teks.replace(" Rincian masing-masing bisa merujuk ke daftar Pahlawan Nasional Kemensos.", "")),
  );
}

// Tanda "perlu dicek" di data adalah catatan kerja (pedoman 2.9), jadi tidak ikut tampil.
const tanpaCatatan = (s: string) =>
  s
    .replace(/,\s*perlu dicek\)/gi, ")")
    .replace(/\s*\((?:lokasi |tahun pasti |tahun lahir dan wafat )?perlu dicek\)/gi, "")
    .trim();

const nilai = (s: string | null | undefined) => {
  if (!s || s === "-") return null;
  const t = tanpaCatatan(s);
  return !t || /^perlu dicek$/i.test(t) ? null : rapiTeks(t);
};

// Kaitan yang di data masih berbunyi catatan penyusun.
const GANTI_KAITAN: Record<string, string> = {
  sultan_abdul_rahman_1: "Kemungkinan rujukan Jl. Sultan Abdul Rachman, bisa juga Abdul Rahman II.",
};
const awalKapital = (s: string | null) => (s ? kapital(s) : null);

type ProfilMd = {
  gelar?: string;
  masaHidup?: string;
  kisah?: string;
  kaitan?: string;
  tempat?: string;
  status?: string;
  sumber?: string[];
};

// Judul profil di profil_tokoh.md ke id di tokoh.json. Satu judul bisa untuk empat tokoh.
const JUDUL_KE_ID: Record<string, string[]> = {
  "Nong Isa / Raja Isa bin Raja Ali": ["nong_isa"],
  "Temenggung Abdul Jamal (Tun Abdul Jamal bin Tun Abbas)": ["temenggung_abdul_jamal"],
  "Raja Haji Fisabilillah (Marhum Teluk Ketapang)": ["raja_haji_fisabilillah"],
  "Engku Putri Raja Hamidah": ["engku_putri"],
  "Raja Ali Haji": ["raja_ali_haji"],
  "Sultan Mahmud Riayat Syah (Sultan Mahmud Syah III)": ["sultan_mahmud_riayat_syah"],
  "Sultan Abdul Rahman Muazzam Syah": ["sultan_abdul_rahman_1"],
  "Raja Ali Kelana (Raja Ali ibni Raja Muhammad Yusuf al-Ahmadi)": ["raja_ali_kelana"],
  "Tengku Embung Fatimah": ["embung_fatimah"],
  "Tengku Sulung (Panglima Besar Reteh)": ["tengku_sulung"],
  'Raja Narasinga II ("Nara Singa")': ["narasinga_2"],
  "Sultan Zainal Abidin Syah (Tambusai/Rokan)": ["sultan_zainal_abidin_rokan"],
  "Raja Kecik (Sultan Abdul Jalil Rahmat Syah)": ["raja_kecik"],
  "Laksamana Bintan": ["laksamana_bintan"],
  "Hang Tuah": ["hang_tuah"],
  "Hang Jebat, Hang Kasturi, Hang Lekir, Hang Lekiu": ["hang_jebat", "hang_kasturi", "hang_lekir", "hang_lekiu"],
  "Hang Nadim": ["hang_nadim"],
  "Dang Merdu (Dang Merdu Wati)": ["dang_merdu"],
  "Dang Anom": ["dang_anom"],
  "Ibnu Sutowo": ["ibnu_sutowo"],
  "B.J. Habibie": ["bj_habibie"],
  "Engku Haji Tua (Raja Ahmad bin Raja Haji)": ["engku_haji_tua"],
  "Batin Limat bin Limbang": ["batin_limat"],
  "Raja Maimunah": ["raja_maimunah"],
};

// Kalimat di profil_tokoh.md yang ditujukan ke penyusun kartu, bukan ke warga.
function bersihkanStatus(s: string): string {
  return s
    .replace(/\*\*/g, "")
    .replace(/; sebaiknya dicocokkan dengan Tuhfat al-Nafis/, "")
    .replace(/\s*Untuk sementara kartu[^.]*\./, "")
    .replace(/, jadi perlu catatan[^.]*\./, ".")
    .trim();
}

const KUNCI: Record<string, keyof ProfilMd> = {
  Gelar: "gelar",
  "Masa hidup": "masaHidup",
  Kisah: "kisah",
  Ringkas: "kisah",
  "Kaitan dengan Batam": "kaitan",
  Tempat: "tempat",
  Status: "status",
};

/** Mengurai profil_tokoh.md yang berformat kartu. Murni, supaya bisa dites. */
export function uraiProfil(md: string): { judul: string[]; peta: Map<string, ProfilMd> } {
  const peta = new Map<string, ProfilMd>();
  const judul: string[] = [];
  let ids: string[] = [];
  for (const baris of md.split(/\r?\n/)) {
    const j = /^\*\*(.+)\*\*\s*$/.exec(baris);
    if (j) {
      ids = JUDUL_KE_ID[j[1]] ?? [];
      judul.push(j[1]);
      for (const id of ids) peta.set(id, {});
      continue;
    }
    if (baris.startsWith("#")) {
      ids = [];
      continue;
    }
    const k = /^- ([^:*]+): (.*)$/.exec(baris);
    if (!k) continue;
    if (k[1] === "Sumber") {
      for (const id of ids) peta.get(id)!.sumber = k[2].split(" ; ").map((u) => u.trim());
      continue;
    }
    const kunci = KUNCI[k[1]];
    if (!kunci) continue;
    for (const id of ids) {
      (peta.get(id) as Record<string, string>)[kunci] = kunci === "status" ? bersihkanStatus(k[2]) : k[2];
    }
  }
  return { judul, peta };
}

const PROFIL = uraiProfil(readFileSync(path.join(process.cwd(), "data/tokoh/profil_tokoh.md"), "utf8")).peta;

// Yang tidak ada di kedua berkas data tetapi wajib tampil menurut brief 16. Bersumber dari research/15 dan 16.
const TAMBAHAN: Record<string, { catatan: string[]; sumber?: string[] }> = {
  raja_ali_kelana: {
    catatan: [
      'Lokasi dan tahun pabrik berbeda versi. Batam Pos menyebut Batam Brick Works sekitar 1898, dengan bata bertulisan "Batam Brick works" yang masih ada di Perigi Batu Pulau Buluh. Kami tidak memilih salah satunya.',
    ],
    sumber: ["https://metro.batampos.co.id/pemko-batam-tetapkan-4-benda-peninggalan-sejarah-baru/"],
  },
  sultan_abdul_rahman_1: {
    catatan: ["Jl. Sultan Abdul Rachman merujuk Sultan Abdul Rahman Muazzam Syah I atau II, belum dipastikan."],
  },
  tuanku_tambusai: {
    catatan: ['Dijuluki "Harimau Padri dari Rokan".'],
  },
  embung_fatimah: {
    catatan: ["Kaitan nama RSUD Embung Fatimah masih asumsi."],
  },
  engku_putri: {
    catatan: ["Kaitan nama Masjid di Dataran Engku Putri belum dipastikan."],
  },
  hang_nadim: {
    catatan: ["Perlawanannya terhadap Portugis tercatat, tetapi silsilahnya hanya berasal dari Sejarah Melayu."],
  },
  hang_tuah: {
    catatan: [
      "Dua versi soal siapa yang memberontak dan dibunuh Hang Tuah: Hang Jebat menurut Hikayat Hang Tuah, Hang Kasturi menurut Sejarah Melayu.",
    ],
  },
  laksamana_bintan: {
    catatan: [
      "Hang Tuah dan Hang Nadim sama-sama bergelar Laksamana dan berkaitan dengan Bintan. Ini bukan klaim bahwa jalan ini dinamai menurut salah satunya.",
    ],
  },
  narasinga_2: {
    catatan: [
      'BP Batam menyebut nama jembatan diambil dari "Panglima Raja Indragiri Hulu", sedangkan sumber sejarah menyebut Narasinga II rajanya sendiri. Penjelasan nama ini hanya dari advertorial BP Batam.',
    ],
  },
  sultan_zainal_abidin_rokan: {
    catatan: [
      "Penjelasan nama Jembatan IV hanya dari advertorial BP Batam dan situs Pemkab Rokan Hulu. Klaim bahwa ia sultan Riau-Lingga tidak bersumber.",
    ],
  },
};

export type Tokoh = {
  id: string;
  nama: string;
  gelar: string | null;
  masaHidup: string | null;
  kelompok: string;
  ringkasan: string;
  kisah: string | null;
  kaitan: string | null;
  tempatTeks: string | null;
  statusTeks: string | null;
  status: StatusTokoh;
  sumber: string[];
  catatan: string[];
  ringkas: boolean;
  gelarPendek: string | null;
  masaPendek: string | null;
};

export const TOKOH: Tokoh[] = tokohRaw.map((t) => {
  const p = PROFIL.get(t.id);
  const tambah = TAMBAHAN[t.id];
  const sumber = [...new Set([...t.sumber_url, ...(p?.sumber ?? []), ...(tambah?.sumber ?? [])])].filter(tautanAman);
  const status = statusTokoh(t.status_verifikasi);
  return {
    id: t.id,
    nama: t.nama,
    gelar: awalKapital(nilai(p?.gelar) ?? nilai(t.gelar)),
    masaHidup: awalKapital(nilai(p?.masaHidup) ?? nilai(t.masa_hidup)),
    gelarPendek: awalKapital(nilai(t.gelar)),
    masaPendek: awalKapital(nilai(t.masa_hidup)),
    kelompok: t.kelompok,
    ringkasan: ringkasanTokoh(t.id, t.ringkasan),
    kisah: nilai(p?.kisah),
    kaitan: GANTI_KAITAN[t.id] ?? awalKapital(nilai(p?.kaitan) ?? nilai(t.kaitan_batam)),
    tempatTeks: nilai(p?.tempat),
    statusTeks: awalKapital(p?.status ?? null),
    status,
    sumber,
    catatan: (tambah?.catatan ?? []).map(rapiTeks),
    ringkas: t.status_verifikasi === null,
  };
});
export const tokohPerId = new Map(TOKOH.map((t) => [t.id, t]));

export type BarisTokoh = Pick<Tokoh, "id" | "nama" | "kelompok" | "ringkasan" | "status"> & {
  gelar: string | null;
  masaHidup: string | null;
};
export const barisTokoh = (t: Tokoh): BarisTokoh => ({
  id: t.id,
  nama: t.nama,
  gelar: t.gelarPendek,
  masaHidup: t.masaPendek,
  kelompok: t.kelompok,
  ringkasan: t.ringkasan,
  status: t.status,
});

/** Catatan umum di atas kartu hikayat (profil_tokoh.md, kelompok b). */
export const CATATAN_HIKAYAT = [
  "Kisah mereka berasal dari Hikayat Hang Tuah dan Sejarah Melayu (Sulalatus Salatin). Versi tertua kedua teks itu ditulis sekitar abad ke-17; naskah Hikayat Hang Tuah tertua yang diketahui berasal dari sekitar 1758.",
  "Para peneliti menilai hikayat ini menggabungkan peristiwa dari beberapa masa pemerintahan ke dalam satu raja dan membesar-besarkan peran Hang Tuah.",
  "Kedua teks saling berbeda: dalam Sejarah Melayu yang memberontak adalah Hang Kasturi, sedangkan dalam Hikayat Hang Tuah pemberontaknya Hang Jebat.",
  "Sumber Portugis dan Ryukyu mencatat seorang “laksamana” Malaka, tetapi belum bisa dipastikan bahwa itu Hang Tuah.",
];

const CATATAN_GABUNGAN =
  "Kecamatan per jalan belum dirinci. Yang tercatat gabungan: Lubuk Baja, Batu Ampar, Sekupang, dan Nongsa.";

// Catatan di penamaan.json sebagian catatan kerja. Hanya versi ini yang tampil.
const CATATAN_PENAMAAN: Record<string, string> = {
  p16: 'Ada perbedaan versi. BP Batam menyebut "Panglima Raja Indragiri Hulu"; sumber sejarah menyebut rajanya sendiri.',
  p20: "Ada perbedaan versi. Penjelasannya hanya dari advertorial BP Batam dan situs Pemkab Rokan Hulu.",
  p24: "Merujuk Sultan Abdul Rahman Muazzam Syah I atau II, belum dipastikan.",
  p27: "Kaitan penamaan masih asumsi.",
  pt02: "Nama resmi masjid dan kaitannya dengan Engku Putri belum dipastikan.",
  pt03: "Tokohnya bergelar Laksamana, belum dipastikan.",
  pt04: "Sebutan populer, tidak resmi. Nama resmi keenam jembatan memakai nama tokoh Melayu.",
  ...Object.fromEntries(Array.from({ length: 9 }, (_, i) => [`pt${13 + i}`, CATATAN_GABUNGAN])),
};

const LABEL_JENIS: Record<string, string> = {
  bandara: "Bandara",
  jalan: "Jalan",
  stadion: "Stadion",
  makam: "Makam",
  kawasan: "Kawasan",
  gedung: "Gedung",
  "alun-alun": "Alun-alun",
  jembatan: "Jembatan",
  museum: "Museum",
  masjid: "Masjid",
  rumah_sakit: "Rumah sakit",
  julukan: "Julukan",
};

const tempatPerPenamaan = new Map(TEMPAT.filter((p) => p.atribut.penamaan_id).map((p) => [p.atribut.penamaan_id, p]));

export type Penamaan = {
  id: string;
  nama: string;
  jenis: string;
  letak: string;
  lokasiPerluDicek: boolean;
  tokohId: string;
  tokohNama: string;
  sumber: string | null;
  catatan: string | null;
  tempat: { id: string; nama: string; lat: number | null } | null;
};

export const PENAMAAN: Penamaan[] = penamaanRaw.map((p) => {
  const tempat = tempatPerPenamaan.get(p.id);
  const letak = p.kecamatan_tabel && p.kecamatan_tabel !== "perlu dicek" ? p.kecamatan_tabel : p.kecamatan;
  const sumber = [p.sumber_url, p.sumber_tabel].find(tautanAman) ?? null;
  return {
    id: p.id,
    nama: p.nama_tempat,
    jenis: LABEL_JENIS[p.jenis] ?? kapital(p.jenis),
    letak: nilai(letak) ?? "Belum diketahui",
    lokasiPerluDicek: p.kecamatan === null || /perlu dicek/.test(p.kecamatan),
    tokohId: p.tokoh_id,
    tokohNama: tokohPerId.get(p.tokoh_id)?.nama ?? p.tokoh_id,
    sumber,
    catatan: rapiAtauKosong(CATATAN_PENAMAAN[p.id]),
    tempat: tempat ? { id: tempat.id, nama: tempat.nama, lat: tempat.lat } : null,
  };
});

export const penamaanTokoh = (id: string) => PENAMAAN.filter((p) => p.tokohId === id);

/** Tempat di direktori yang dikaitkan dengan tokoh ini. Yang tanpa koordinat tetap punya kartu. */
export const tempatTokoh = (id: string) =>
  TEMPAT.filter((p) => p.atribut.tokoh_id === id).map((p) => ({ id: p.id, nama: p.nama }));

export type Relasi = {
  id: string;
  a: string;
  b: string;
  namaA: string;
  namaB: string;
  jenis: string;
  sumber: string | null;
  perluDicek: boolean;
};

// Brief 16 celah 8: dua relasi yang bunyinya tidak didukung penuh oleh profil. Tetap tampil, ditandai.
const RELASI_PERLU_DICEK = new Set(["batin_limat>embung_fatimah", "embung_fatimah>raja_ali_kelana"]);
const JENIS_DIGANTI: Record<string, string> = {
  "batin_limat>embung_fatimah": "setia kepada putra Embung Fatimah, Sultan Abdul Rahman II, saat pemakzulan 1911",
};

export const RELASI: Relasi[] = relasiRaw.map((r) => {
  const id = `${r.tokoh_a}>${r.tokoh_b}`;
  return {
    id,
    a: r.tokoh_a,
    b: r.tokoh_b,
    namaA: tokohPerId.get(r.tokoh_a)?.nama ?? r.tokoh_a,
    namaB: tokohPerId.get(r.tokoh_b)?.nama ?? r.tokoh_b,
    jenis: rapiTeks(JENIS_DIGANTI[id] ?? r.jenis_hubungan),
    sumber: tautanAman(r.sumber_url) ? r.sumber_url : null,
    perluDicek: RELASI_PERLU_DICEK.has(id),
  };
});

export const relasiTokoh = (id: string) => RELASI.filter((r) => r.a === id || r.b === id);

/** Garis keluarga di research/16 yang tokohnya belum punya kartu. Teks saja: kami tidak menambah entri tokoh. */
export const GARIS_TANPA_KARTU: { judul: string; isi: string; sumber?: string }[] = [
  {
    judul: "Bugis dan Riau",
    isi: "Daeng Celak (YDM II) adalah ayah Raja Haji Fisabilillah. Raja Haji juga ayah Raja Jaafar (YDM VI), yang bersama Sultan Abdul Rahman memberi mandat kepada Nong Isa pada 1829. Nong Isa putra Raja Ali, YDM V.",
  },
  {
    judul: "Generasi akhir Riau-Lingga",
    isi: "Embung Fatimah istri YDM X Raja Muhammad Yusuf dan ibu Sultan Abdul Rahman Muazzam Syah II. Raja Ali Kelana putra Raja Muhammad Yusuf, jadi saudara seayah Abdul Rahman II. Batin Limat menyatakan kesetiaan kepada Abdul Rahman II saat pemakzulan 1911. Tengku Sulung panglima yang setia kepada Sultan Mahmud Muzaffar Syah, ayah Embung Fatimah, setelah sultan itu dimakzulkan pada 1857.",
  },
  {
    judul: "Temenggung: Bulang, Johor, Singapura",
    isi: "Bendahara Tun Abbas ayah Temenggung Abdul Jamal. Abdul Jamal ayah Tun Abdul Hamid, ayah Temenggung Abdul Rahman, yang pindah ke Singapura (1811 atau 1818, berbeda versi) dan bersama Sultan Hussein menandatangani perjanjian dengan Raffles pada 6 Februari 1819. Abdul Rahman ayah Temenggung Daeng Ibrahim (lahir di Pulau Bulang, 1810), ayah Abu Bakar, pendiri Kesultanan Johor modern.",
    sumber: "https://en.wikipedia.org/wiki/Temenggong_Abdul_Rahman",
  },
  {
    judul: "Johor, Siak, dan Bugis",
    isi: "Raja Kecik merebut Johor (1718), lalu dikalahkan Bugis (1722). Bugis mengangkat Sultan Sulaiman dan mendapat jabatan YDM. Raja Kecik mengaku putra Sultan Mahmud Syah II, sultan yang dibunuh pada 1699 (versi Hikayat Siak).",
  },
  {
    judul: "Hang Tuah (hikayat)",
    isi: "Hang Mahmud dan Dang Merdu orang tua Hang Tuah. Hang Jebat dan Dang Wangi orang tua Hang Nadim (versi Sejarah Melayu). Hang Tuah dan Hang Nadim sama-sama bergelar Laksamana.",
  },
  {
    judul: "Riau daratan",
    isi: "Tuanku Tambusai dan Sultan Zainal Abidin sama-sama berasal dari Tambusai, Rokan Hulu. Narasinga II dari Indragiri melawan Portugis pada masa yang sama dengan perang Hang Nadim.",
  },
];

export const PENAMAAN_RESMI: { judul: string; isi: string }[] = [
  {
    judul: "Penetapan",
    isi: "Nama ruas jalan ditetapkan Pemerintah Kota Batam lewat SK Wali Kota. Tribun Batam (2011) melaporkan SK itu memuat 230 ruas jalan, 62 di antaranya sudah dirilis dengan panjang 387 km. Perda Kota Batam No. 9/2001 Pasal 11 menyebut setiap jaringan jalan yang selesai dibangun ditetapkan kinerjanya, termasuk nama.",
  },
  {
    judul: "Evaluasi 2017",
    isi: "Dinas Perhubungan mengevaluasi nama-nama jalan, misalnya usulan memperpanjang Jl. Engku Putri sampai Bundaran Madani. Hasilnya direncanakan dituangkan dalam Peraturan Wali Kota. Belum diketahui apakah peraturan itu sudah terbit.",
  },
  {
    judul: "Usulan 2026",
    isi: "Wali Kota Amsakar Achmad menyebut LAM Kepri dan Kota Batam sedang menginventarisasi usulan nama jalan, termasuk ruas baru Batam Centre ke Bandara. Menurut Riaukepri.com, surat LAM Batam No. 10/LAM-BATAM/V/2026 tertanggal 8 Mei 2026 memuat usulan final 46 nama simpang dan bundaran.",
  },
  {
    judul: "Aset BP Batam",
    isi: "Bandara dan Jembatan Barelang dibangun dan dinamai pada era Otorita Batam atau BP Batam, sehingga penjelasan nama jembatan bersumber dari BP Batam.",
  },
];

export const SUMBER_PENAMAAN_RESMI = [
  "https://batam.tribunnews.com/2011/01/11/ini-dia-nama-jalan-baru-di-kota-batam",
  "https://kepri.bpk.go.id/wp-content/uploads/2009/09/perda-no-9-th-2001-lalin-dan-ang-jalan.pdf",
  "https://jantungmelayu.co/2017/03/nama-jalan-batam-dievaluasi-berharap-unsur-budaya-lokal-lebih-ditonjolkan/",
  "https://metropolis.batampos.co.id/jalan-baru-batam-center-bandara-belum-diberi-nama-pemko-batam-siapkan-penamaan/",
];

export const BACAAN = [
  "Raja Ali Haji, Tuhfat al-Nafis. Terjemahan Inggris: Virginia Matheson dan Barbara Watson Andaya, The Precious Gift (Oxford University Press, 1982).",
  "Sulalatus Salatin/Sejarah Melayu (edisi A. Samad Ahmad, Dewan Bahasa dan Pustaka) dan Hikayat Hang Tuah (edisi Kassim Ahmad, DBP).",
  "Carl A. Trocki, Prince of Pirates: The Temenggongs and the Development of Johor and Singapore, 1784—1885 (1979).",
  "Leonard Y. Andaya, The Kingdom of Johor 1641—1728 (1975), serta Barbara Watson Andaya dan Leonard Andaya, A History of Malaysia.",
  "Virginia Matheson Hooker: kajian tentang Tuhfat al-Nafis dan penulisan sejarah Melayu.",
  "Hasan Junus, Engku Puteri Raja Hamidah: Pemegang Regalia Kerajaan Riau (UNRI Press, 2002).",
  "Aswandi Syahri: tulisan tentang sejarah Riau-Lingga dan Batam.",
  "Edi Sutrisno dan kawan-kawan, Bercermin Sejarah Menyongsong Batam Masa Depan (2007); Sabeth Muksin, Mengungkap Fakta Pembangunan Batam.",
  "Rustam S. Abrus, Sejarah Perjuangan Panglima Besar Reteh Tengku Sulung Melawan Belanda Tahun 1858; Mahidin Said, Tuanku Tambusai Berjuang; Yussuwadinata dan kawan-kawan, Riwayat Singkat Pahlawan Nasional Raja Haji Fisabilillah (2010).",
  "Lembaga: BPK Wilayah IV (eks BPNB Kepri), BPCB Sumbar, Dinas Kebudayaan Provinsi Kepri, ANRI (Arsip Riouw), serta daftar Pahlawan Nasional Kemensos dan IKPNI.",
];
