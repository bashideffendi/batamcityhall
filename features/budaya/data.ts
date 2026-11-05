import acara from "@/data/budaya/acara.json";
import kamus from "@/data/budaya/kamus.json";
import komunitas from "@/data/budaya/komunitas.json";
import tradisi from "@/data/budaya/tradisi_melayu.json";
import { rapiAtauKosong, rapiTeks } from "@/features/sejarah/rapi";
import type { AcaraPublik, KataPublik, KelompokAcara, KelompokKata, RagamKata, StatusAcara } from "./label";

// Pintu keluar data budaya. File JSON mentah memuat catatan penyusun (`catatan_laporan`, kolom `tabel`), jadi halaman
// hanya boleh memakai bentuk publik dari sini. Komponen klien hanya mengimpor tipenya.

export const DATA_DIHIMPUN = "Data dihimpun pada November 2026.";

// ---------- Kalender ----------

type AcaraMentah = (typeof acara)[number];

const KELOMPOK_DARI_KATEGORI: Record<string, KelompokAcara> = {
  keagamaan: "keagamaan",
  religi: "keagamaan",
  "tradisi-melayu": "melayu",
  "budaya-melayu": "melayu",
  "festival-budaya": "melayu",
  museum: "melayu",
  "budaya-komunitas": "komunitas",
  "budaya-tionghoa": "komunitas",
  "komunitas-suku": "komunitas",
  "hari-jadi": "kota",
  "pawai-budaya": "kota",
  "tahun-baru": "kota",
  "pasar-ramadan": "kota",
  olahraga: "olahraga",
  "lomba-perahu": "olahraga",
  "festival-laut": "olahraga",
  musik: "seni",
  "musik-independen": "seni",
  hiburan: "seni",
  kreatif: "seni",
  MICE: "pameran",
};

// Empat acara dari tabel laporan tidak punya kategori di data.
const KELOMPOK_TANPA_KATEGORI: Record<string, KelompokAcara> = {
  "ev-t01": "seni",
  "ev-t02": "keagamaan",
  "ev-t03": "seni",
  "ev-t04": "keagamaan",
};

export function kelompokAcara(a: Pick<AcaraMentah, "id" | "kategori">): KelompokAcara {
  const k = a.kategori ? KELOMPOK_DARI_KATEGORI[a.kategori] : KELOMPOK_TANPA_KATEGORI[a.id];
  if (!k) throw new Error(`Acara ${a.id} belum punya kelompok`);
  return k;
}

/** Status dari data. Untuk ev-t01..t04 status asli ada di tabel; Tour de Batam ditulis batal di tabel. */
export function statusAcara(a: Pick<AcaraMentah, "status" | "tabel">): StatusAcara {
  const teks = a.tabel.map((t) => t.status).join(" ");
  if (/Dibatalkan/.test(teks)) return "dibatalkan";
  if (a.status === "rutin" || a.status === "pernah") return a.status;
  if (a.status) return "belum pasti";
  return /pernah/i.test(teks) ? "pernah" : "belum pasti";
}

const BULAN_PENDEK = /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|Mei|Jun|Jul|Agu|Sep|Okt|Nov|Des)/;

/** Tidak pasti bila data tidak menyebut hari dan bulan Masehi, atau menulisnya sebagai perkiraan. */
export function tanggalTidakPasti(a: Pick<AcaraMentah, "tabel">): boolean {
  return a.tabel.every((t) => !BULAN_PENDEK.test(t.tanggal) || /^(≈|Biasanya)/.test(t.tanggal));
}

const POLA: Record<string, string> = {
  "ev-005": "Mengikuti kalender Imlek, tanggalnya bergeser tiap tahun.",
  "ev-006": "Mengikuti Ramadan, tanggalnya bergeser tiap tahun.",
  "ev-007": "Mengikuti kalender Imlek: hari ke-15 Imlek.",
  "ev-008": "Mengikuti kalender Saka: malam sebelum Nyepi.",
  "ev-009": "Mengikuti kalender Hijriah.",
  "ev-010": "Mengikuti kalender lunar: Hari Waisak, biasanya April atau Mei.",
  "ev-014": "Mengikuti kalender Hijriah, bulan Masehinya bergeser tiap tahun.",
  "ev-t02": "Mengikuti kalender Hijriah, bulan Masehinya bergeser tiap tahun.",
};

// `catatan_laporan` ditulis untuk penyusun dan sebagian salah tempel antar-acara. Fakta di dalamnya
// disalin di sini per acara, tanpa instruksi. Tes memastikan setiap acara bercatatan punya entri.
const CATATAN: Record<string, string[]> = {
  "ev-006": [
    "Indonesia.travel menulis 18 Februari—8 Maret 2026. Tanggal di kartu ini versi Disbudpar, penyelenggaranya.",
    "Edisi 2025 diikuti 75 UMKM lokal, dengan lomba busana muslim dan tahfidz.",
  ],
  "ev-008": [
    "Tahun 2026 pawai dimulai setelah berbuka puasa karena berdekatan dengan Ramadan.",
    "Wakil Ketua PHDI Batam, Gusti Sudiana, memperkirakan umat Hindu di Batam sekitar 700 jiwa, sekitar 150 kepala keluarga. Ini perkiraan pengurus, bukan data resmi.",
  ],
  "ev-009": [
    "Yang tercatat di Batam baru Batam Lampu Colok Festival #1. Belum terbukti rutin.",
    "Festival lampu colok yang rutin dan besar di kawasan ini ada di Karimun (46 peserta, total hadiah Rp135 juta pada 2025) dan Bengkalis.",
  ],
  "ev-011": [
    "Menurut Kadisbudpar Ardiwinata (ANTARA, 4 Juli 2026), edisi 2026 menampilkan sekitar 60 pertunjukan seni, termasuk Tari Jogi, silat Melayu, dan Joget Kenangan Manis. Pesertanya dari Johor, Sabah, Singapura, Brunei, dan Thailand.",
    "Katalog Karisma Event Nusantara 2025 menulis 19—21 Juli 2025, realisasinya 16—18 Mei 2025. Edisi 2024 dan 2025 sama-sama disebut “ke-26”, edisi 2026 disebut “ke-27”.",
  ],
  "ev-014": [
    "Tempo menulis Mandi Safar masuk agenda Juni 2025, padahal Safar 1447 H jatuh sekitar akhir Juli—Agustus 2025. Kartu ini mengikuti kalender Hijriah.",
  ],
  "ev-018": ["Pindah dari Juli (2025) ke September (2026), jadi bulannya belum tetap."],
  "ev-021": ["Edisi perdana. Belum terbukti rutin."],
  "ev-025": ["Bukan agenda rutin."],
  "ev-028": ["Upacaranya rutin. Airshow belum terbukti rutin."],
  "ev-029": [
    "InfoPublik menulis 19 Desember dengan ±5.000 peserta. Laporan penutupan menulis >8.000 peserta pada 20 Desember.",
  ],
  "ev-t01": ["Belum terbukti rutin."],
};

const DESKRIPSI_GANTI: Record<string, string> = {
  "ev-011": "Festival seni Melayu serumpun sejak 1999; masuk Karisma Event Nusantara.",
};

const PENYELENGGARA_GANTI: Record<string, string> = {
  "ev-t01": "Swasta (penyelenggara belum pasti)",
};

// Data tidak menyebut lokasinya: baris lokasi tidak tampil.
const LOKASI_GANTI: Record<string, string> = {
  "ev-017": "",
};

// Lokasi acara yang sudah ada di direktori, dicocokkan dengan nama dan alias di places.json. Tes memastikan id-nya ada.
const TEMPAT_ACARA: Record<string, { id: string; nama: string }[]> = {
  "ev-001": [{ id: "jembatan-barelang", nama: "Jembatan Barelang" }],
  "ev-003": [{ id: "blj-mega-mall", nama: "Mega Mall Batam Centre" }],
  "ev-006": [{ id: "pub-taman-dang-anom", nama: "Taman Dang Anom" }],
  "ev-007": [{ id: "maha-vihara-duta-maitreya", nama: "Maha Vihara Duta Maitreya" }],
  "ev-008": [{ id: "pura-amertabhuana", nama: "Pura Agung Amerta Bhuana" }],
  "ev-009": [{ id: "rp-003", nama: "Dataran Engku Hamidah" }],
  "ev-010": [{ id: "maha-vihara-duta-maitreya", nama: "Maha Vihara Duta Maitreya" }],
  "ev-011": [{ id: "dataran-engku-putri", nama: "Dataran Engku Putri" }],
  "ev-013": [{ id: "kt-teluk-mata-ikan", nama: "Kampung Tua Teluk Mata Ikan" }],
  "ev-014": [{ id: "kt-tereh", nama: "Kampung Tua Tereh" }],
  "ev-022": [
    { id: "gedung-lam-kota-batam", nama: "Gedung LAM Kota Batam" },
    { id: "dataran-engku-putri", nama: "Dataran Engku Putri" },
  ],
  "ev-023": [{ id: "dataran-engku-putri", nama: "Dataran Engku Putri" }],
  "ev-027": [{ id: "kt-nongsa-pantai", nama: "Kampung Tua Nongsa Pantai" }],
  "ev-028": [{ id: "dataran-engku-putri", nama: "Dataran Engku Putri" }],
  "ev-030": [{ id: "dataran-engku-putri", nama: "Dataran Engku Putri" }],
  "ev-t03": [{ id: "blj-mega-mall", nama: "Mega Mall Batam Centre" }],
};

export const daftarTempatAcara = () => Object.values(TEMPAT_ACARA).flat();

function statusRinci(a: AcaraMentah, status: StatusAcara): string | null {
  const isi = a.tabel.map((t) => t.status).filter(Boolean);
  const unik = [...new Set(isi)].filter((t) => t.toLowerCase() !== status && t.toLowerCase() !== "pernah");
  return rapiAtauKosong(unik[0]);
}

/** Teks acara untuk pembaca: singkatan dipanjangkan, tanda "+" dari tabel riset menjadi kata. */
const teksAcara = (t: string) => rapiTeks(panjangkanSingkatan(t)).replaceAll(" + ", " dan ");

function bentukPublik(a: AcaraMentah): AcaraPublik {
  const status = statusAcara(a);
  const satuBaris = a.tabel.length === 1;
  // Baris tabel sering lebih rinci: "Pantai Senja, Batu Besar, Nongsa" lawan "Pantai Senja, Nongsa".
  const lokasiTabel = satuBaris ? a.tabel[0].lokasi : "";
  const lokasi = LOKASI_GANTI[a.id] ?? (lokasiTabel.length > a.lokasi.length ? lokasiTabel : a.lokasi);
  return {
    id: a.id,
    nama: teksAcara(a.nama),
    bulan: a.bulan,
    lokasi: rapiTeks(lokasi),
    penyelenggara: rapiTeks(PENYELENGGARA_GANTI[a.id] ?? a.penyelenggara),
    deskripsi: DESKRIPSI_GANTI[a.id] ?? (a.deskripsi && teksAcara(a.deskripsi)),
    kelompok: kelompokAcara(a),
    status,
    statusRinci: statusRinci(a, status),
    pola: POLA[a.id] ?? null,
    tanggalTidakPasti: tanggalTidakPasti(a),
    edisi: a.tabel.map((t) => ({
      judul: satuBaris ? null : teksAcara(t.acara.replace(" (KSM)", "")),
      tanggal: rapiTeks(t.tanggal),
      lokasi: satuBaris ? null : rapiAtauKosong(t.lokasi),
    })),
    catatan: CATATAN[a.id] ?? [],
    tempat: TEMPAT_ACARA[a.id] ?? [],
  };
}

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Hari awal edisi yang jatuh di bulan kartu ini, dibaca dari data mentah. Hanya untuk urutan dalam satu bulan. */
const hariAwal = (a: AcaraMentah) => {
  if (tanggalTidakPasti(a) || !a.bulan) return 99;
  const pola = new RegExp(`(\\d{1,2})(?:–\\d{1,2})?\\s+${BULAN_SINGKAT[a.bulan - 1]}`);
  const m = a.tabel
    .map((t) => t.tanggal)
    .join("; ")
    .match(pola);
  return m ? Number(m[1]) : 99;
};

/**
 * Semua acara, urut berdasarkan `bulan`, lalu tanggal awal edisi pertama. Urutan array di data tidak bisa dipercaya
 * (ev-011 bulan 7 ada sebelum ev-012 bulan 6). Acara tanpa bulan di paling akhir.
 */
export function daftarAcara(): AcaraPublik[] {
  return [...acara]
    .sort(
      (a, b) =>
        (a.bulan ?? 13) - (b.bulan ?? 13) ||
        hariAwal(a) - hariAwal(b) ||
        panjangkanSingkatan(a.nama).localeCompare(panjangkanSingkatan(b.nama), "id"),
    )
    .map(bentukPublik);
}

export const adaCatatanPublik = (id: string) => id in CATATAN;

// ---------- Kamus ----------

type KataMentah = (typeof kamus)[number];

const ANGGOTA_KELOMPOK: Record<KelompokKata, string[]> = {
  kota: ["ruli", "UWTO", "UWT", "kampung tua", "Otorita", "FTZ", "Barelang", "BBK", "dataran", "ruko", "ojol"],
  laut: ["pancung", "pompong", "tekong", "hinterland", "mainland", "pelantar", "kelong", "jong"],
  dialek: [
    "aok",
    "awak",
    "tak",
    "tak nak",
    "menyemak",
    "saye",
    "ape",
    "kite",
    "cakap",
    "nak",
    "macam mane",
    "tengok",
    "dah",
    "budak",
    "bini",
    "laki",
    "mak cik",
    "pak cik",
    "cik",
    "kedai",
    "balik kampong",
    "makan angin",
    "pening",
    "kereta",
  ],
  serapan: [
    "teh obeng",
    "lah",
    "alamak",
    "tapau",
    "tauke",
    "angpau",
    "kamsia",
    "kopitiam",
    "kopi O",
    "teh tarik",
    "boleh tahan",
    "jom",
    "sing dollar",
  ],
  kerja: ["kerja PT", "operator", "mess", "shift"],
  budaya: ["tepuk tepung tawar", "tujuh likur", "makan berhidang", "kenduri", "tanjak"],
};

export function kelompokKata(kata: string): KelompokKata {
  for (const [k, isi] of Object.entries(ANGGOTA_KELOMPOK)) if (isi.includes(kata)) return k as KelompokKata;
  throw new Error(`Kata ${kata} belum punya kelompok`);
}

export const ragamKata = (asal: string): RagamKata => (asal.startsWith("Melayu") ? "Melayu" : "Bahasa Batam");

/** Tanda [P] di data berarti pengamatan yang belum divalidasi: istilahnya, atau artinya saja. */
export const belumDiperiksaPenutur = (catatan: string) => catatan.includes("[P]");

// Konteks untuk kata yang bisa salah terbaca. Kamus saat ini tidak memuat istilah etnis lama yang merendahkan.
// Kalau kelak ada, tes `ISTILAH_ETNIS_LAMA` gagal sampai entrinya diberi konteks di sini.
const KONTEKS_KATA: Record<string, string> = {
  "k-008": "Istilah lama. Sebutan sekarang UWT.",
  "k-030": "Dalam bahasa Indonesia baku kata ini juga berarti hamba sahaya. Di sini artinya anak.",
  "k-031": "Ragam kasual. Di situasi resmi pakai istri.",
  "k-032": "Ragam kasual. Di situasi resmi pakai suami.",
};

export const ISTILAH_ETNIS_LAMA = /\b(keling|cina|cino|apek|amoi|bule|negro|kafir|mamak|jawir)\b/i;

export const adaKonteksKata = (id: string) => id in KONTEKS_KATA;

function kataPublik(k: KataMentah): KataPublik {
  const ragam = ragamKata(k.asal);
  return {
    id: k.id,
    kata: k.kata,
    arti: k.arti,
    contoh: k.contoh || null,
    asal: k.asal,
    ragam,
    labelRagam: k.asal === "Melayu Kepri" ? "Melayu Kepri" : ragam,
    kelompok: kelompokKata(k.kata),
    belumDiperiksa: belumDiperiksaPenutur(k.catatan),
    konteks: KONTEKS_KATA[k.id] ?? null,
  };
}

export function daftarKata(): KataPublik[] {
  return kamus.map(kataPublik).sort((a, b) => a.kata.localeCompare(b.kata, "id", { sensitivity: "base" }));
}

// ---------- Budaya Melayu ----------

export const PENGANTAR_BUDAYA = {
  // Dua kalimat pertama diambil dari budaya_melayu.md, tes mencocokkannya. "Rekomendasi konten" di berkas itu
  // adalah instruksi penyusun dan tidak ikut tampil.
  tuanRumah: "Batam memang kota pendatang, tetapi “tuan rumah” budayanya Melayu.",
  panggung: "Pemko menjadikan festival Melayu (KSM, Kenduri WBTb, Mandi Safar) sebagai panggung utama kota.",
};

const panjangkanSingkatan = (teks: string) =>
  teks
    .replace(/\bHJB\b/g, "Hari Jadi Batam")
    .replace(/\bKSM\b/g, "Kenduri Seni Melayu")
    .replace(/\bBWR\b/g, "Batam Wonderfood & Art Ramadhan")
    .replace(/\bTBUM\b/g, "Trans Barelang Ultra Marathon");

export const pengantarPublik = (teks: string) => panjangkanSingkatan(teks);

/** Satu label per kartu. Tari Jogi: keberadaannya tercatat, sejarahnya belum, jadi labelnya yang lebih hati-hati. */
function labelStatusTradisi(status: string): { teks: string; nada: "ok" | "caution" } {
  if (status.startsWith("Tercatat") && !status.includes("sejarahnya")) return { teks: "Tercatat", nada: "ok" };
  return { teks: "Belum terverifikasi", nada: "caution" };
}

const TRADISI_DI_KALENDER: Record<string, string> = {
  "tr-002": "ev-014",
  "tr-008": "ev-022",
  "tr-009": "ev-009",
};

export type TradisiPublik = {
  id: string;
  nama: string;
  penjelasan: string;
  status: { teks: string; nada: "ok" | "caution" };
  kalender: string | null;
};

export function daftarTradisi(): TradisiPublik[] {
  return tradisi.map((t) => ({
    id: t.id,
    nama: t.nama,
    penjelasan: rapiTeks(panjangkanSingkatan(t.penjelasan)),
    status: labelStatusTradisi(t.status),
    kalender: TRADISI_DI_KALENDER[t.id] ?? null,
  }));
}

// ---------- Komunitas ----------

/** Satu label per kartu. "Tercatat, keberadaan saja" tetap Tercatat; yang mungkin usang belum terverifikasi. */
function labelStatusKomunitas(status: string): { teks: string; nada: "ok" | "caution" } {
  return status.startsWith("Tercatat")
    ? { teks: "Tercatat", nada: "ok" }
    : { teks: "Belum terverifikasi", nada: "caution" };
}

/**
 * Kanal hanya tampil bila status entri persis Tercatat. Sisanya tanpa akun: riset belum mengecek akunnya langsung.
 * Nilai yang boleh tampil adalah akun atau kanal lembaga, bukan nomor pribadi. Situs pemerintah tidak ditautkan
 * (pedoman 2.9), termasuk rujukan ke kanal dinas.
 */
export function kanalKomunitas(k: {
  kontak_publik: string;
  status: string;
}): { teks: string; href: string | null } | null {
  if (k.status !== "Tercatat") return null;
  if (/\.go\.id|Disbudpar/i.test(k.kontak_publik)) return null;
  const ig = k.kontak_publik.match(/^IG @([\w.]+)$/);
  if (ig) return { teks: `Instagram @${ig[1]}`, href: `https://www.instagram.com/${ig[1]}/` };
  if (/^[\w.-]+\.[a-z]{2,}(\/\S*)?$/i.test(k.kontak_publik)) {
    return { teks: k.kontak_publik, href: `https://${k.kontak_publik}` };
  }
  return { teks: k.kontak_publik, href: null };
}

export type KomunitasPublik = {
  id: string;
  nama: string;
  bidang: string;
  anggota: string[];
  kanal: { teks: string; href: string | null } | null;
  status: { teks: string; nada: "ok" | "caution" };
};

export function daftarKomunitas(): KomunitasPublik[] {
  return komunitas.map((k) => ({
    id: k.id,
    // Entri gabungan: nama anggotanya tampil sebagai daftar, jadi judulnya tidak mengulang.
    nama: k.anggota ? judulGabungan(k.id, k.nama) : k.nama,
    bidang: rapiTeks(panjangkanSingkatan(k.jenis)),
    anggota: k.anggota ?? [],
    kanal: kanalKomunitas(k),
    status: labelStatusKomunitas(k.status),
  }));
}

function judulGabungan(id: string, nama: string) {
  if (id === "kom-003") return "Empat Klub Lari";
  if (id === "kom-012") return "Media Lokal Daring";
  return nama;
}
