import acara from "@/data/budaya/acara.json";
import kamus from "@/data/budaya/kamus.json";
import komunitas from "@/data/budaya/komunitas.json";
import tradisi from "@/data/budaya/tradisi_melayu.json";
import type { AcaraPublik, KataPublik, KelompokAcara, KelompokKata, RagamKata, StatusAcara, Tautan } from "./label";

// Pintu keluar data budaya. File JSON mentah memuat catatan penyusun (`catatan_laporan`, kolom `tabel`, ikon
// status), jadi halaman hanya boleh memakai bentuk publik dari sini. Komponen klien hanya mengimpor tipenya.

export const TERAKHIR_DICEK = "November 2026";

export const hostDari = (url: string) => new URL(url).hostname.replace(/^(www|m)\./, "");

const tautan = (url: unknown): Tautan | null =>
  typeof url === "string" && /^https?:\/\//.test(url) ? { href: url, label: hostDari(url) } : null;

/** Mengganti ikon status dari riset dengan kata. Status tidak boleh hanya berupa ikon. */
export function ikonJadiKata(teks: string): string {
  return teks
    .replace(/(\S+) ⚠️?/g, "$1 perlu dicek")
    .replace(/⚠️? */g, "")
    .replace(/[✅❌⌛] */g, "")
    .trim();
}

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
  if (a.status) return a.status as StatusAcara;
  return /pernah/i.test(teks) ? "pernah" : "tidak pasti";
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
    "Indonesia.travel menulis 18 Feb–8 Mar 2026. Tanggal di kartu ini versi Disbudpar, penyelenggaranya.",
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
    "Menurut Kadisbudpar Ardiwinata (ANTARA, 4 Jul 2026), edisi 2026 menampilkan sekitar 60 pertunjukan seni, termasuk Tari Jogi, silat Melayu, dan Joget Kenangan Manis. Pesertanya dari Johor, Sabah, Singapura, Brunei, dan Thailand.",
    'Data tidak cocok: katalog Karisma Event Nusantara 2025 menulis 19–21 Juli 2025, realisasinya 16–18 Mei 2025. Edisi 2024 dan 2025 sama-sama disebut "ke-26", edisi 2026 disebut "ke-27".',
  ],
  "ev-014": [
    "Tempo menulis Mandi Safar masuk agenda Juni 2025, padahal Safar 1447 H jatuh sekitar akhir Juli–Agustus 2025. Kartu ini mengikuti kalender Hijriah.",
  ],
  "ev-018": ["Pindah dari Juli (2025) ke September (2026), jadi bulannya belum tetap."],
  "ev-021": ["Edisi perdana. Belum terbukti rutin."],
  "ev-025": ["Bukan agenda rutin."],
  "ev-028": ["Upacaranya rutin. Airshow belum terbukti rutin."],
  "ev-029": ["InfoPublik menulis 19 Des dengan ±5.000 peserta. Laporan penutupan menulis >8.000 peserta pada 20 Des."],
  "ev-t01": ["Belum terbukti rutin."],
};

const DESKRIPSI_GANTI: Record<string, string> = {
  "ev-011": "Festival seni Melayu serumpun sejak 1999; masuk Karisma Event Nusantara.",
};

const PENYELENGGARA_GANTI: Record<string, string> = {
  "ev-t01": "Swasta (penyelenggara belum pasti)",
};

const LOKASI_GANTI: Record<string, string> = {
  "ev-017": "Lokasi belum jelas",
};

/** Sumber sekunder hanya untuk acara tanpa sumber primer dan selalu ditandai (brief 13). */
const SUMBER_SEKUNDER = /helloswag\.id|seniberjalan\.com|jadwallari\.id/;

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
  const isi = a.tabel.map((t) => ikonJadiKata(t.status)).filter(Boolean);
  const unik = [...new Set(isi)].filter((t) => t.toLowerCase() !== status && t.toLowerCase() !== "pernah");
  return unik[0] ?? null;
}

function bentukPublik(a: AcaraMentah): AcaraPublik {
  const status = statusAcara(a);
  const satuBaris = a.tabel.length === 1;
  // Baris tabel sering lebih rinci: "Pantai Senja, Batu Besar, Nongsa" lawan "Pantai Senja, Nongsa".
  const lokasiTabel = satuBaris ? ikonJadiKata(a.tabel[0].lokasi) : "";
  const lokasi = LOKASI_GANTI[a.id] ?? (lokasiTabel.length > a.lokasi.length ? lokasiTabel : a.lokasi);
  const url = tautan(a.sumber_url);
  return {
    id: a.id,
    nama: panjangkanSingkatan(a.nama),
    bulan: a.bulan,
    lokasi,
    penyelenggara: PENYELENGGARA_GANTI[a.id] ?? a.penyelenggara,
    deskripsi: DESKRIPSI_GANTI[a.id] ?? (a.deskripsi && panjangkanSingkatan(a.deskripsi)),
    kelompok: kelompokAcara(a),
    status,
    statusRinci: statusRinci(a, status),
    pola: POLA[a.id] ?? null,
    tanggalTidakPasti: tanggalTidakPasti(a),
    edisi: a.tabel.map((t) => ({
      judul: satuBaris ? null : panjangkanSingkatan(t.acara.replace(" (KSM)", "")),
      tanggal: t.tanggal,
      lokasi: satuBaris ? null : ikonJadiKata(t.lokasi),
    })),
    catatan: CATATAN[a.id] ?? [],
    sumber: url && { ...url, sekunder: SUMBER_SEKUNDER.test(url.href) },
    tempat: TEMPAT_ACARA[a.id] ?? [],
  };
}

const BULAN_SINGKAT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** Hari awal edisi yang jatuh di bulan kartu ini. Hanya untuk urutan dalam satu bulan. */
const hariAwal = (a: AcaraPublik) => {
  if (a.tanggalTidakPasti || !a.bulan) return 99;
  const pola = new RegExp(`(\\d{1,2})(?:–\\d{1,2})?\\s+${BULAN_SINGKAT[a.bulan - 1]}`);
  const m = a.edisi
    .map((e) => e.tanggal)
    .join("; ")
    .match(pola);
  return m ? Number(m[1]) : 99;
};

/**
 * Semua acara, urut berdasarkan `bulan`, lalu tanggal awal edisi pertama. Urutan array di data tidak bisa dipercaya
 * (ev-011 bulan 7 ada sebelum ev-012 bulan 6). Acara tanpa bulan di paling akhir.
 */
export function daftarAcara(): AcaraPublik[] {
  return acara
    .map(bentukPublik)
    .sort(
      (a, b) => (a.bulan ?? 13) - (b.bulan ?? 13) || hariAwal(a) - hariAwal(b) || a.nama.localeCompare(b.nama, "id"),
    );
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

export function labelSumberKata(catatan: string): { bersumber: boolean; label: string } {
  if (catatan.includes("arti [P]")) return { bersumber: true, label: "Istilah bersumber, arti pengamatan" };
  if (catatan.startsWith("[S]")) return { bersumber: true, label: "Bersumber" };
  return { bersumber: false, label: "Pengamatan, belum divalidasi" };
}

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
  const { bersumber, label } = labelSumberKata(k.catatan);
  return {
    id: k.id,
    kata: k.kata,
    arti: k.arti,
    contoh: k.contoh || null,
    asal: k.asal,
    ragam,
    labelRagam: k.asal === "Melayu Kepri" ? "Melayu Kepri" : ragam,
    kelompok: kelompokKata(k.kata),
    bersumber,
    labelSumber: label,
    konteks: KONTEKS_KATA[k.id] ?? null,
    sumber: tautan(k.sumber_url),
  };
}

export function daftarKata(): KataPublik[] {
  return kamus.map(kataPublik).sort((a, b) => a.kata.localeCompare(b.kata, "id", { sensitivity: "base" }));
}

// ---------- Budaya Melayu ----------

export const PENGANTAR_BUDAYA = {
  // Dua kalimat pertama diambil dari budaya_melayu.md, tes mencocokkannya. "Rekomendasi konten" di berkas itu
  // adalah instruksi penyusun dan tidak ikut tampil.
  tuanRumah: 'Batam memang kota pendatang, tapi "tuan rumah" budayanya Melayu.',
  panggung: "Pemko menjadikan festival Melayu (KSM, Kenduri WBTb, Mandi Safar) sebagai panggung utama kota.",
};

const panjangkanSingkatan = (teks: string) =>
  teks
    .replace(/\bHJB\b/g, "Hari Jadi Batam")
    .replace(/\bKSM\b/g, "Kenduri Seni Melayu")
    .replace(/\bBWR\b/g, "Batam Wonderfood & Art Ramadhan")
    .replace(/\bTBUM\b/g, "Trans Barelang Ultra Marathon");

export const pengantarPublik = (teks: string) => panjangkanSingkatan(teks);

function labelStatusTradisi(status: string): { teks: string; nada: "ok" | "caution" } {
  if (status === "✅") return { teks: "Bersumber", nada: "ok" };
  if (status === "✅ / ⚠️") return { teks: "Bersumber, sebagian belum terkonfirmasi", nada: "caution" };
  if (status === "✅ (sejarah ⚠️)") return { teks: "Bersumber, sejarahnya perlu dicek", nada: "caution" };
  return { teks: ikonJadiKata(status), nada: "caution" };
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
  sumber: Tautan[];
  kalender: string | null;
};

export function daftarTradisi(): TradisiPublik[] {
  return tradisi.map((t) => ({
    id: t.id,
    nama: t.nama,
    penjelasan: panjangkanSingkatan(t.penjelasan.replace(/⚠️? /g, "")),
    status: labelStatusTradisi(t.status),
    sumber: t.sumber_url.flatMap((u) => tautan(u) ?? []),
    kalender: TRADISI_DI_KALENDER[t.id] ?? null,
  }));
}

// ---------- Komunitas ----------

const LABEL_STATUS_KOMUNITAS: Record<string, { teks: string; nada: "ok" | "caution" | "info" }> = {
  "✅": { teks: "Terverifikasi", nada: "ok" },
  "✅ keberadaan": { teks: "Keberadaan terkonfirmasi", nada: "info" },
  "⚠️": { teks: "Perlu dicek", nada: "caution" },
  "⌛": { teks: "Mungkin usang", nada: "caution" },
};

/**
 * Kanal hanya tampil bila status entri persis ✅. Sisanya tanpa akun: riset belum mengecek akunnya langsung.
 * Nilai yang boleh tampil adalah akun atau kanal lembaga, bukan nomor pribadi.
 */
export function kanalKomunitas(k: {
  kontak_publik: string;
  status: string;
}): { teks: string; href: string | null } | null {
  if (k.status !== "✅") return null;
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
  status: { teks: string; nada: "ok" | "caution" | "info" };
  sumber: Tautan[];
};

export function daftarKomunitas(): KomunitasPublik[] {
  return komunitas.map((k) => ({
    id: k.id,
    // Entri gabungan: nama anggotanya tampil sebagai daftar, jadi judulnya tidak mengulang.
    nama: k.anggota ? judulGabungan(k.id, k.nama) : k.nama,
    bidang: panjangkanSingkatan(k.jenis),
    anggota: k.anggota ?? [],
    kanal: kanalKomunitas(k),
    status: LABEL_STATUS_KOMUNITAS[k.status] ?? { teks: ikonJadiKata(k.status), nada: "caution" },
    sumber: k.sumber_url.flatMap((u) => tautan(u) ?? []),
  }));
}

function judulGabungan(id: string, nama: string) {
  if (id === "kom-003") return "Empat klub lari";
  if (id === "kom-012") return "Media lokal online";
  return nama;
}
