// Angka Batam dari data/budaya/fakta_infografis.json dan data/statistik/angka_resmi.json. Catatan untuk penyusun
// disaring di sini. Yang berubah dari data mentah: lihat UBAHAN_FAKTA dan docs/DATA_DECISIONS.md.
import fakta from "@/data/budaya/fakta_infografis.json";
import resmi from "@/data/statistik/angka_resmi.json";
import { keSumber, type Sumber } from "./data";
import { rapiTeks } from "./rapi";

type Fakta = (typeof fakta.angka)[number];

export type BarisFakta = {
  id: string;
  topik: string;
  indikator: string;
  angka: string;
  tahun: string;
  /** Satu label sesuai pedoman 3.7. Kosong bila data tidak memberi status: tidak ada label yang ditampilkan. */
  status: string | null;
  catatan: string | null;
};

// "Mungkin usang" di data selalu baris versi lain, jadi labelnya Berbeda versi. Angka turunan tidak diberi label:
// catatannya sudah menulis cara menghitungnya.
const STATUS_KATA: Record<string, string> = {
  Tercatat: "Tercatat",
  "Berbeda versi": "Berbeda versi",
  "Mungkin usang": "Berbeda versi",
};

const ANGKA_KOSONG = "Belum ada angka";

const CATATAN_DATABOKS =
  "Angka agregator. Jauh di atas proyeksi BPS 1.296.960 (pertengahan 2025) dan registrasi Disdukcapil 1.394.459 (Semester II 2025). Tidak kami pakai di grafik.";

// Laporan 15 melarang 1,79 juta sebagai patokan, laporan 13 mencatatnya, dan prompt meminta semua item tampil.
// Jalan tengah yang aman: tetap tampil, berlabel, dan tidak dipakai di grafik atau judul infografis.
const UBAHAN_FAKTA: Record<string, Partial<BarisFakta>> = {
  "fi-001": { status: "Berbeda versi", catatan: CATATAN_DATABOKS },
  "fi-002": { status: "Berbeda versi", catatan: "Dari artikel Databoks yang sama. Tidak kami pakai di grafik." },
  "fi-003": {
    status: "Berbeda versi",
    catatan: CATATAN_DATABOKS.replace(
      "Jauh di atas proyeksi BPS 1.296.960 (pertengahan 2025) dan registrasi Disdukcapil 1.394.459 (Semester II 2025)",
      "Jauh di atas proyeksi BPS 1.276.930 (Juni 2024) dan registrasi Disdukcapil 1.294.548 (Semester I 2024)",
    ),
  },
  "fi-004": { status: "Berbeda versi", catatan: "Dari artikel Databoks yang sama. Tidak kami pakai di grafik." },
  "fi-005": { catatan: "Ciri kota pekerja." },
  "fi-009": { indikator: "Penduduk per kecamatan: Sagulung (terbanyak)" },
  "fi-012": { indikator: "Penduduk per kecamatan: Galang (paling sedikit)" },
  "fi-014": {
    status: "Belum terverifikasi",
    catatan:
      "Dihitung dari angka Databoks. BPS menghitung penduduk yang benar-benar tinggal, sedangkan Dukcapil hanya yang ber-KTP/KK Batam. Ini interpretasi, bukan klaim resmi. Angka BPS pertengahan 2025 lewat Wikipedia (1.296.960) justru di bawah Dukcapil, jadi selisih ini belum tentu berlaku.",
  },
  // Dua baris tanpa angka tidak tampil (pedoman prinsip 7). Tetap ada di SEMUA_FAKTA.
  "fi-023": { angka: ANGKA_KOSONG, catatan: null },
  "fi-024": { angka: ANGKA_KOSONG, catatan: null },
  "fi-025": {
    catatan:
      "Melampaui target 1,5 juta versi Batam Pos/Disbudpar, belum mencapai target 1,7 juta versi Tempo dan Diskominfo.",
  },
  "fi-042": { angka: "Pelabuhan Batam Centre, Nongsa Pura, HarbourBay, Sekupang, Bandara Hang Nadim", catatan: null },
  "fi-043": {
    catatan:
      "Tempo dan rilis Diskominfo Batam menulis 1,7 juta. Kalau patokannya 1,7 juta, realisasi 1.613.202 belum mencapai target.",
  },
  "fi-044": {
    catatan:
      "Kutipan Sekda Jefridin: “Di tahun 2025, Pemerintah Kota Batam menargetkan kunjungan wisatawan mancanegara sebesar 1,7 juta.”",
  },
  "fi-045": { catatan: "Dihitung dari 1.613.202 ÷ 365." },
  "fi-053": { catatan: "Versi lain." },
  "fi-054": { catatan: "Lebih dari 400 pulau." },
  "fi-064": { angka: "Antara lain Nipah, Pelampong, Batu Berhenti, Nongsa", catatan: null },
  // Laporan 04 mengoreksi laporan 13: 37 bukan angka Perda 2/2004.
  "fi-065": {
    angka: "37 titik",
    tahun: "Angka yang dipakai sejak 2019",
    catatan: "Sumber lain menyebut angka berbeda. Rinciannya ada di halaman Kampung Tua.",
  },
  "fi-068": { catatan: "“115% luas Singapura”." },
};

const TANPA_TAHUN = "Tahun tidak disebut";

const tahunFakta = (f: Fakta) => {
  const p = f.periode;
  if (p && /\d{4}/.test(p)) return p;
  if (p && f.tahun) return `${f.tahun}, ${p}`;
  if (p) return p;
  return f.tahun ? String(f.tahun) : TANPA_TAHUN;
};

function keBaris(f: Fakta): BarisFakta {
  const baris: BarisFakta = {
    id: f.id,
    topik: f.topik,
    indikator: f.indikator,
    angka: f.angka ?? ANGKA_KOSONG,
    tahun: tahunFakta(f),
    status: f.status ? (STATUS_KATA[f.status] ?? null) : null,
    catatan: f.catatan,
    ...UBAHAN_FAKTA[f.id],
  };
  return {
    ...baris,
    indikator: rapiTeks(baris.indikator).replace(" vs ", " dibanding "),
    angka: rapiTeks(baris.angka),
    tahun: rapiTeks(baris.tahun),
    catatan: baris.catatan ? rapiTeks(baris.catatan) : null,
  };
}

export const SEMUA_FAKTA: BarisFakta[] = fakta.angka.map(keBaris);

const ID_COLLATOR = new Intl.Collator("id");

export const KELOMPOK_FAKTA: { topik: string; judul: string; lede?: string; baris: BarisFakta[] }[] = [
  { topik: "penduduk", judul: "Penduduk" },
  {
    topik: "agama",
    judul: "Agama",
    lede: "Data Dukcapil, 31 Desember 2024. Urut abjad, bukan peringkat.",
  },
  { topik: "tenaga_kerja", judul: "Tenaga Kerja" },
  { topik: "wisman", judul: "Wisatawan Mancanegara" },
  { topik: "geografi", judul: "Geografi" },
  { topik: "sejarah", judul: "Angka Sejarah" },
].map((k) => {
  const baris = SEMUA_FAKTA.filter((f) => f.topik === k.topik && f.angka !== ANGKA_KOSONG);
  return {
    ...k,
    baris: k.topik === "agama" ? [...baris].sort((a, b) => ID_COLLATOR.compare(a.indikator, b.indikator)) : baris,
  };
});

export const LINIMASA = fakta.linimasa_sejarah.map((l) => ({
  id: l.id,
  tahun: rapiTeks(l.tahun),
  peristiwa: rapiTeks(l.peristiwa),
}));

// ---------- Luas dan investasi (brief 15: celah, tidak ada di file data; angka dari research/15 bagian 6) ----------

const URL_BP = "https://bpbatam.go.id/sejarah-bp-batam/";
const URL_RPJPD =
  "https://bappeda.batam.go.id/wp-content/uploads/sites/50/2024/12/PERDA-KOTA-BATAM-NOMOR-6-TAHUN-2024-TENTANG-RPJPD-KOTA-BATAM-TAHUN-2025-2045.pdf";
const URL_INEWS =
  "https://www.inews.id/regional/regional/profil-bandara-hang-nadim-tempat-dengan-nama-laksamana-hebat-dari-kerajaan-malaka";
const URL_EKON = "https://www.ekon.go.id/publikasi/detail/3067/menko-airlangga-kek-batam-dapat-menjadi-contoh-dan-";
const URL_GOLAW = "https://golaw.id/blog/kek-batam-pusat-pertumbuhan-baru-untuk-digital-data-center-dan-aviasi/";
const URL_MI =
  "https://mediaindonesia.com/ekonomi/749426/dewan-kawasan-batam-lantik-wali-kota-dan-wakil-wali-kota-batam-sebagai-kepala-bp-batamdan-wakil-kepala-bp-batam";

export type BarisLuas = { indikator: string; angka: string; tahun: string; catatan: string | null; sumber: Sumber[] };

export const LUAS_INVESTASI: BarisLuas[] = [
  {
    indikator: "Pulau Batam",
    angka: "415 km²",
    tahun: TANPA_TAHUN,
    catatan: "Versi BP Batam.",
    sumber: keSumber([URL_BP]),
  },
  {
    indikator: "Konsep Barelang",
    angka: "715 km²",
    tahun: TANPA_TAHUN,
    catatan: "Versi BP Batam.",
    sumber: keSumber([URL_BP]),
  },
  {
    indikator: "Kota Batam, daratan",
    angka: "1.034,73 km²",
    tahun: "RPJPD 2025—2045",
    catatan: null,
    sumber: keSumber([URL_RPJPD]),
  },
  {
    indikator: "Bandara Hang Nadim",
    angka: "1.762 hektare, sekitar 40 persen terpakai",
    tahun: TANPA_TAHUN,
    catatan: "Menurut profil iNews.id, yang juga menyebut bandara dibangun 1974. Sumber lain menyebut 1980 atau 1984.",
    sumber: keSumber([URL_INEWS]),
  },
  {
    indikator: "KEK Batam Aero Technic",
    angka: "30 ha, target Rp7,2 triliun, 9.976 tenaga kerja",
    tahun: "PP 67/2021",
    catatan: "Target, bukan realisasi.",
    sumber: keSumber([URL_EKON]),
  },
  {
    indikator: "KEK Nongsa",
    angka: "166,45 ha, target Rp16 triliun, 16.500 tenaga kerja",
    tahun: "PP 68/2021",
    catatan: "Target, bukan realisasi.",
    sumber: keSumber([URL_EKON]),
  },
  {
    indikator: "KEK Tanjung Sauh",
    angka: "840,67 ha",
    tahun: "PP 24/2024",
    catatan: null,
    sumber: keSumber([URL_GOLAW]),
  },
  {
    indikator: "KEK Pariwisata dan Kesehatan Internasional",
    angka: "Sekitar 47 ha",
    tahun: "PP 39/2024",
    catatan: null,
    sumber: keSumber([URL_GOLAW]),
  },
  {
    indikator: "Realisasi investasi",
    angka: "Rp38,97 triliun",
    tahun: "Semester I 2026",
    catatan: "Klaim BP Batam lewat Media Indonesia.",
    sumber: keSumber([URL_MI]),
  },
];

// ---------- Angka resmi pilihan ----------

type Resmi = (typeof resmi.data)[number];
const perIndikator = new Map<string, Resmi>(resmi.data.map((d) => [d.indikator, d]));

export type BarisResmi = {
  indikator: string;
  label: string;
  angka: string;
  tahun: string;
  catatan: string | null;
};

const angkaTeks = (n: unknown) => (typeof n === "number" ? n.toLocaleString("id-ID") : String(n ?? ""));

function pilih(indikator: string, label: string, angka?: string, catatan?: string): BarisResmi {
  const d = perIndikator.get(indikator);
  if (!d) throw new Error(`Indikator tidak ada di angka_resmi.json: ${indikator}`);
  return {
    indikator,
    label,
    angka: rapiTeks(angka ?? [angkaTeks(d.nilai), d.satuan].filter(Boolean).join(" ")),
    tahun: rapiTeks(d.tahun ?? TANPA_TAHUN),
    catatan: catatan ? rapiTeks(catatan) : null,
  };
}

// Yang tidak dipilih dan alasannya ada di docs: indikator kerja (ambang OSM, kode wilayah, id relasi, jumlah dataset),
// usulan yang belum berjalan (TPU, Pasar Induk Jodoh), dan tarif yang sudah ada di loketnya sendiri.
export const ANGKA_RESMI: { judul: string; lede?: string; baris: BarisResmi[] }[] = [
  {
    judul: "Wilayah",
    baris: [pilih("jumlah_kecamatan", "Kecamatan"), pilih("jumlah_kelurahan", "Kelurahan")],
  },
  {
    judul: "Pendidikan",
    baris: [
      pilih("sd_sederajat", "SD sederajat"),
      pilih("smp_sederajat", "SMP sederajat"),
      pilih("pendidikan_menengah_total", "Pendidikan menengah", "195 satuan pendidikan", "SMA 115, SMK 70, SLB 10."),
      pilih("sd_negeri", "SD negeri", "145 sekolah", "16.044 kursi disiapkan."),
      pilih("smp_negeri", "SMP negeri", "66 sekolah", "16.803 kursi disiapkan."),
      pilih("sma_negeri_ikut_spmb", "SMA negeri yang ikut SPMB"),
      pilih("lulusan_sd", "Lulusan SD", undefined, "Sekitar 6.000—7.000 siswa tidak tertampung di SMP negeri."),
    ],
  },
  {
    judul: "Kesehatan",
    baris: [
      pilih(
        "faskes_total",
        "Fasilitas kesehatan",
        "831 fasilitas",
        "RS pemerintah 3, RS swasta 18, puskesmas 21, pustu 63, klinik dan polindes 156, posyandu 570.",
      ),
      pilih(
        "klinik_polindes",
        "Klinik dan polindes",
        undefined,
        "Turun dari 183 (semester 1 2023) ke 156 (semester 1 2024), entah karena tutup atau cara pendataan berubah. Angka klinik hanya indikatif.",
      ),
    ],
  },
  {
    judul: "Tempat Ibadah",
    lede: "Urut abjad, bukan peringkat. Sumbernya berbeda, jadi jangan dibandingkan langsung.",
    baris: [
      pilih("tempat_ibadah_bps", "BPS 2022", "Masjid 912, musala 616, pura 3, vihara 38"),
      pilih(
        "gereja",
        "Gereja",
        undefined,
        "Kemungkinan baru sebagian yang terdata: FKUB 2019 mencatat 82 gereja Kristen di Kecamatan Batam Kota saja.",
      ),
      pilih("gereja_kristen_kecamatan_batam_kota", "Gereja Kristen di Kecamatan Batam Kota"),
      pilih("masjid", "Masjid", undefined, "Agung 1, besar 12, jami 849, di tempat publik 110."),
      pilih("vihara", "Vihara", undefined, "35 di antaranya di Lubuk Baja."),
    ],
  },
  {
    judul: "Hotel",
    lede: "Angka antarsumber berbeda, jadi semuanya ditulis berdampingan.",
    baris: [
      pilih("hotel_gokepri_bps", "Menurut GoKepri", "75 berbintang (9.004 kamar), 160 nonbintang (5.065 kamar)"),
      pilih("hotel_gowest_bps", "Menurut GoWest.id", "69 berbintang, 108 nonbintang"),
      pilih("hotel_disbudpar", "Menurut Disbudpar"),
      pilih("hotel_kompilasi_lain", "Kompilasi lain", "69 berbintang, 282 properti", "142 properti di Lubuk Baja."),
    ],
  },
  {
    judul: "Transportasi",
    baris: [
      pilih("trans_batam_koridor_aktif", "Koridor Trans Batam aktif"),
      pilih(
        "trans_batam_jumlah_bus",
        "Bus Trans Batam",
        "45 atau 65 bus",
        "Kepala UPT Trans Batam di Kompas.id, 13 September 2024: 45 bus untuk sembilan koridor. Wikipedia dan Traveloka: 65.",
      ),
      pilih("trans_batam_bandara", "Bus BTS baru ke Bandara Hang Nadim", undefined, "Mulai 1 Juni 2026."),
      pilih("halte_baru_dibangun", "Halte baru dibangun", undefined, "Ditambah 4 dari program CSR."),
      pilih("usulan_halte_baru", "Usulan halte baru", undefined, "Usulan. Difokuskan di Koridor 2 dan Koridor 8."),
      pilih(
        "pelabuhan_feri_ke_singapura",
        "Pelabuhan feri ke Singapura",
        undefined,
        "Batam Centre, Sekupang, Nongsapura, Harbour Bay, Gold Coast Bengkong. Jadwal terbatas di Waterfront City.",
      ),
    ],
  },
  {
    judul: "Layanan",
    baris: [
      pilih(
        "armada_damkar_bp_batam",
        "Damkar BP Batam",
        "110 personel, lebih dari 10 mobil, 6 pos aktif, 2 pos pasif",
        "Waktu tanggap maksimal 15 menit menurut rilis. Pos pasif adalah pos tanpa armada di Kantor BP Batam.",
      ),
      pilih("notaris_batam", "Notaris"),
      pilih("anggota_ppat_batam", "Anggota PPAT"),
      pilih("obh_terakreditasi_kepri", "Organisasi bantuan hukum terakreditasi, Kepri"),
    ],
  },
];
