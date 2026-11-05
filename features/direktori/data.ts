import { kaidahJudul } from "@/lib/judul";
// Direktori Informasi Warga dari data/places.json. Fungsi di sini murni dan hanya dipakai di server, kecuali
// lewat route indeks.json dan pin.json yang mengirim versi ringkasnya ke browser.
//
// places.json berisi catatan penyusun di banyak kolom (alamat, jam, atribut). Datanya tidak diubah di sini:
// fungsi *Publik membersihkannya saat tampil supaya catatan kerja tidak sampai ke pembaca (pedoman 2.9).
import raw from "@/data/places.json";
import { KECAMATAN, type Place } from "@/lib/data/schema";

export type { Place };
export const TEMPAT = raw as unknown as Place[];
export const tempatPerId = new Map(TEMPAT.map((p) => [p.id, p]));

// Panduan dan nomor darurat merujuk id sumber lama; id_alias memetakannya ke entri gabungan.
const perAlias = new Map(TEMPAT.flatMap((p) => p.id_alias.map((a) => [a, p] as const)));
export const cariTempat = (id: string) => tempatPerId.get(id) ?? perAlias.get(id);

const kapital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export { kaidahJudul };

export type InfoKategori = {
  /** Kunci kategori tampilan, sekaligus dasar slug URL. */
  kategori: Place["kategori"];
  nama: string;
  keterangan: string;
  /** Kategori data yang masuk ke kategori tampilan ini. Data sumbernya tidak berubah. */
  sumber: Place["kategori"][];
};

const kat = (
  kategori: Place["kategori"],
  nama: string,
  keterangan: string,
  sumber: Place["kategori"][] = [kategori],
): InfoKategori => ({ kategori, nama, keterangan, sumber });

// Tabel 3.8. Keterangan hanya menyebut jenis tempat yang ada di data, jadi ambulans, madrasah, kelenteng, dan
// futsal belum disebut. Tambahkan bila jenisnya sudah masuk. Slug URL = kategori dengan garis bawah menjadi
// tanda hubung.
export const DAFTAR_KATEGORI: InfoKategori[] = [
  kat("keamanan_darurat", "Darurat dan keamanan", "Polisi, pemadam kebakaran, dan SAR"),
  kat("kesehatan", "Kesehatan", "Rumah sakit, puskesmas, dan donor darah"),
  kat(
    "pemerintahan",
    "Kantor dan layanan publik",
    "Kantor camat dan lurah, kantor pos, listrik, air, BPJS, dan KUA",
    ["pemerintahan", "layanan_publik"],
  ),
  kat("pendidikan", "Pendidikan", "Sekolah dan perguruan tinggi"),
  kat("perpustakaan", "Perpustakaan", "Perpustakaan umum dan komunitas"),
  kat("ibadah", "Tempat ibadah", "Masjid, gereja, pura, dan wihara"),
  kat("pemakaman", "Pemakaman", "Taman pemakaman umum dan makam menurut agama"),
  kat("transportasi", "Transportasi", "Pelabuhan, pelantar pompong, bandara, halte, dan pengisian kendaraan listrik"),
  kat("belanja", "Belanja", "Pasar, mal, pasar swalayan, toko bahan bangunan, dan toko alat tulis"),
  kat("ruang_publik", "Ruang publik", "Taman, alun-alun, dan bumi perkemahan"),
  kat("wisata", "Wisata", "Pantai, pulau, museum, dan taman hiburan"),
  kat("olahraga", "Olahraga", "Lapangan padel, bulu tangkis, pusat kebugaran, dan stadion"),
  kat("akomodasi", "Hotel dan penginapan", "Hotel berbintang dan nonbintang"),
  kat("jasa", "Jasa", "Penukaran valuta asing, pusat servis, dan ekspedisi"),
  kat("pertanahan_hukum", "Pertanahan dan hukum", "PPAT, notaris, bantuan hukum, pengadilan, dan penilai properti"),
  kat("kuliner", "Kuliner", "Tempat makan dari bagian Makan"),
  kat("kampung_tua", "Kampung tua", "Permukiman lama sebelum Batam dibangun"),
  kat("landmark", "Penanda kota", "Jembatan, monumen, dan bangunan penanda"),
  kat("budaya", "Budaya", "Museum, cagar budaya, dan lembaga adat"),
  kat("khas_batam", "Khas Batam", "Hal yang hanya ada di Batam"),
  kat("lainnya", "Lain-lain", "Waduk, kawasan, dan tempat lain"),
];

export const slugKategori = (k: string) => k.replace(/_/g, "-");
export const kategoriDariSlug = (s: string) => DAFTAR_KATEGORI.find((k) => slugKategori(k.kategori) === s);

/** Kategori data ke kategori tampilannya: "layanan_publik" masuk ke "Kantor dan layanan publik". */
export const kategoriTampil = (k: string) => DAFTAR_KATEGORI.find((d) => (d.sumber as string[]).includes(k));
export const kunciTampil = (k: string) => kategoriTampil(k)?.kategori ?? k;
export const namaKategori = (k: string) => kategoriTampil(k)?.nama ?? k;

// Slug kategori yang sudah digabung tetap hidup dan dialihkan, supaya tautan lama tidak mati.
const SLUG_LAMA: Record<string, string> = { "layanan-publik": "pemerintahan" };
export const SLUG_KATEGORI_LAMA = Object.keys(SLUG_LAMA);
export const slugBaru = (s: string) => (Object.hasOwn(SLUG_LAMA, s) ? SLUG_LAMA[s] : null);

/** Lede halaman kategori. Keterangan yang sudah menyebut Batam tidak diberi "di Batam" lagi. */
export const ledeKategori = (k: InfoKategori, jumlah: number) =>
  `${k.keterangan}${k.keterangan.includes("Batam") ? "" : " di Batam"}. Ada ${jumlah.toLocaleString("id-ID")} tempat.`;

export const slugKecamatan = (k: string) => k.toLowerCase().replace(/\s+/g, "-");
export const kecamatanDariSlug = (s: string) => KECAMATAN.find((k) => slugKecamatan(k) === s);

const LABEL_SUB: Record<string, string> = {
  // Kesehatan
  rs_tipe_b: "RS Tipe B",
  rs_tipe_c: "RS Tipe C",
  rs_tipe_d: "RS Tipe D",
  rs_khusus: "RS khusus",
  rsia_tipe_b: "RSIA Tipe B",
  rsia_tipe_c: "RSIA Tipe C",
  puskesmas_non_rawat_inap: "Puskesmas nonrawat inap",
  // Kantor dan layanan publik
  kua: "KUA",
  bpjs_kes: "BPJS Kesehatan",
  bpjs_tk: "BPJS Ketenagakerjaan",
  mpp: "Mal Pelayanan Publik",
  bp_batam: "BP Batam",
  bea_cukai: "Bea Cukai",
  disdukcapil: "Disdukcapil",
  dukcapil: "Dukcapil",
  disnaker: "Disnaker",
  kemenag: "Kemenag",
  kantor_pemkot: "Kantor Pemkot",
  layanan_lahan_online: "Layanan lahan daring",
  ptsp_lahan_perizinan: "PTSP lahan dan perizinan",
  umkm: "UMKM",
  // Darurat dan keamanan
  damkar: "Pemadam kebakaran",
  polres: "Polres",
  polsek: "Polsek",
  sar: "SAR",
  militer_tni_ad: "TNI AD",
  militer_tni_al: "TNI AL",
  militer_tni_au: "TNI AU",
  // Pendidikan
  sd: "SD",
  smp: "SMP",
  sma: "SMA",
  smk: "SMK",
  // Tempat ibadah dan pemakaman
  gereja_katolik: "Gereja Katolik",
  vihara: "Wihara",
  tpu: "TPU",
  tpu_kristen: "TPU Kristen",
  tpu_multiagama: "TPU Multiagama",
  makam_tionghoa: "Makam Tionghoa",
  // Transportasi
  spklu: "SPKLU",
  halte_trans_batam: "Halte Trans Batam",
  pelabuhan_pelni: "Pelabuhan Pelni",
  // Belanja
  buku_atk: "Buku dan ATK",
  supermarket: "Pasar swalayan",
  hypermarket: "Hipermarket",
  pasar_pemko: "Pasar Pemko",
  // Olahraga
  badminton: "Bulu tangkis",
  gor: "GOR",
  stadion_gor: "Stadion dan GOR",
  gym_independen: "Pusat kebugaran independen",
  gym_jaringan: "Pusat kebugaran jaringan",
  // Hotel
  hotel_bintang: "Hotel berbintang",
  hotel_non_bintang: "Hotel nonbintang",
  // Jasa
  money_changer: "Penukaran valuta asing",
  service_center: "Pusat servis",
  service_center_ac_tv: "Pusat servis AC dan TV",
  // Pertanahan dan hukum
  ppat: "PPAT",
  notaris_ppat: "Notaris dan PPAT",
  pejabat_lelang_kelas_ii: "Pejabat lelang kelas II",
  kjpp: "KJPP",
  lbh: "LBH",
  posbakum: "Posbakum",
  // Ruang publik, budaya, penanda kota, kampung tua
  alun_alun: "Alun-alun",
  pulau_sejarah_melayu: "Pulau sejarah Melayu",
  batam_yang_hilang: "Batam yang hilang",
  landmark_viewpoint: "Titik pandang",
  kampung_tua_mainland: "Kampung tua Pulau Batam",
  kampung_tua_rempang_galang: "Kampung tua Rempang dan Galang",
  kampung_tua_rujukan: "Kampung tua lainnya",
  situs_kampung_lama_hinterland: "Situs kampung lama",
  // Kuliner: mengikuti tabel kategori Loket Makan (3.4)
  "seafood-gonggong": "Makanan laut dan gonggong",
  "sup-ikan": "Sup ikan",
  "mie-tarempa": "Mi tarempa dan luti gendang",
  "nasi-ayam-hainan": "Nasi ayam hainan",
  "martabak-prata": "Martabak dan prata",
  "mie-bakmi": "Mi dan bakmi",
  "nasi-padang": "Nasi padang",
  "sunda-jawa": "Masakan Sunda dan Jawa",
  "sate-kambing": "Sate kambing",
  "dimsum-chinese": "Dim sum dan masakan Tionghoa",
  "ayam-penyet": "Ayam penyet dan lalapan",
  "pecel-gado": "Pecel dan gado-gado",
  "oleh-oleh": "Oleh-oleh dan kue",
  cafe: "Kafe dan kedai kopi",
  kuliner_seafood: "Kuliner makanan laut",
};

export const slugSub = (s: string) => s.replace(/_/g, "-");

/** "kantor_pos_cabang" menjadi "Kantor pos cabang". Yang perlu ejaan khusus ada di LABEL_SUB. */
export function labelSub(sub: string | null): string {
  if (!sub) return "Lainnya";
  if (Object.hasOwn(LABEL_SUB, sub)) return LABEL_SUB[sub];
  return kapital(sub.replace(/[_-]+/g, " "));
}

// Jenis yang diminta warga tetapi belum punya satu pun data (research/00 bagian 5, brief 06, 07, 12). Halamannya
// tetap ada, tetapi tidak ditautkan dari saringan kecuali ada daftar nama dari OpenStreetMap.
export const SUB_KOSONG: Partial<Record<Place["kategori"], { slug: string; nama: string }[]>> = {
  kesehatan: [
    { slug: "klinik", nama: "Klinik" },
    { slug: "apotek", nama: "Apotek" },
    { slug: "laboratorium", nama: "Laboratorium" },
    { slug: "dokter-umum", nama: "Dokter umum" },
    { slug: "dokter-gigi", nama: "Dokter gigi" },
    { slug: "dokter-kandungan", nama: "Dokter kandungan" },
    { slug: "dokter-anak", nama: "Dokter anak" },
    { slug: "dokter-kulit", nama: "Dokter kulit" },
    { slug: "dokter-tht", nama: "Dokter THT" },
    { slug: "dokter-mata", nama: "Dokter mata" },
    { slug: "penyakit-dalam", nama: "Penyakit dalam" },
    { slug: "psikolog-psikiater", nama: "Psikolog dan psikiater" },
    { slug: "fisioterapi", nama: "Fisioterapi" },
    { slug: "bidan", nama: "Bidan" },
    { slug: "dokter-hewan", nama: "Dokter hewan" },
  ],
  pendidikan: [
    { slug: "paud", nama: "PAUD" },
    { slug: "playgroup", nama: "Kelompok bermain" },
    { slug: "tk", nama: "TK" },
    { slug: "daycare", nama: "Penitipan anak" },
    { slug: "mi-mts-ma", nama: "MI, MTs, dan MA" },
  ],
  olahraga: [
    { slug: "futsal", nama: "Futsal" },
    { slug: "mini-soccer", nama: "Sepak bola mini" },
    { slug: "basket", nama: "Basket" },
    { slug: "tenis", nama: "Tenis" },
    { slug: "voli", nama: "Voli" },
  ],
  belanja: [{ slug: "minimarket", nama: "Minimarket" }],
  ibadah: [{ slug: "klenteng", nama: "Kelenteng" }],
  transportasi: [
    { slug: "spbu", nama: "SPBU" },
    { slug: "terminal-bus", nama: "Terminal bus" },
  ],
  jasa: [
    { slug: "bengkel", nama: "Bengkel" },
    { slug: "laundry", nama: "Binatu" },
    { slug: "servis-elektronik", nama: "Servis elektronik" },
    { slug: "pijat-refleksi", nama: "Pijat dan refleksi" },
    { slug: "pijat-panggilan", nama: "Pijat panggilan" },
    { slug: "salon-barbershop", nama: "Salon dan pangkas rambut" },
    { slug: "percetakan", nama: "Fotokopi dan percetakan" },
  ],
  akomodasi: [{ slug: "kos", nama: "Kos" }],
};

/** Kategori tampilan ke kategori datanya. Kunci data yang bukan kunci tampilan berdiri sendiri. */
const sumberKategori = (k: string): string[] => DAFTAR_KATEGORI.find((d) => d.kategori === k)?.sumber ?? [k];

export function tempatDiKategori(k: string): Place[] {
  const sumber = sumberKategori(k);
  return TEMPAT.filter((p) => sumber.includes(p.kategori)).sort((a, b) => a.nama.localeCompare(b.nama, "id"));
}

export function subDiKategori(k: string): { sub: string; jumlah: number }[] {
  const sumber = sumberKategori(k);
  const hitung = new Map<string, number>();
  for (const p of TEMPAT) {
    if (sumber.includes(p.kategori)) hitung.set(p.subkategori ?? "lainnya", (hitung.get(p.subkategori ?? "lainnya") ?? 0) + 1);
  }
  return [...hitung.entries()].map(([sub, jumlah]) => ({ sub, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
}

// Catatan di places.json sebagian besar catatan kerja penyusun ("seed", "laporan", "jangan tampilkan"),
// bukan teks untuk warga. Hanya yang lolos saringan ini yang boleh tampil.
const CATATAN_INTERNAL =
  /laporan|seed|riset|prosa|jangan|DPO|^\[|lintas|koordinat|brief|ringkasan|\bJSON\b|isi manual|disimpulkan|tabel|digabung|\b(di)?cek\b|sumber|\[V\]|\[A\]|wiki|sengaja|kapolsek|ikon|quest|topik sensitif|di UI|untuk layer|kartu hening|disebut-sebut|webarchive|\bentri\b|\(S\d+\)|agregator|pihak ketiga|usang|\bbasi\b|\bdata 20\d\d|\bsitus\b|go\.id|\bblog\b|konflik|rawan|belum pasti|belum diketahui/i;
const KATEGORI_TANPA_CATATAN = new Set(["kampung_tua", "lainnya", "kuliner", "akomodasi"]);

// Keterangan dalam kurung yang isinya asal data, bukan fakta: "(data 2018, perlu cek ulang)", "(Kompas 2024)".
const KURUNG_CATATAN =
  /\s*\((?:[^()]*(?:cek|sumber|menurut|wikipedia|agregator|pihak ketiga|klaim|situs|registri|nonresmi|presentasi|kompas|detik|sisparnas|travelspromo|media|daftar DPN|go\.id)[^()]*|(?!sejak\b)[^()]*\b(?:19|20)\d{2})\)/gi;

const bersihkanCatatan = (s: string) =>
  s
    .replace(/⚠️?/g, " ")
    .replace(KURUNG_CATATAN, "")
    .replace(/\s*;\s*(?:sumber lain|media)\b.*$/i, "")
    .replace(/\s*\(BP Batam\)\s*\/.*$/, "")
    .replace(/\s+/g, " ")
    .trim();

const HARI_PENDEK: Record<string, string> = {
  Sen: "Senin",
  Sel: "Selasa",
  Rab: "Rabu",
  Kam: "Kamis",
  Jum: "Jumat",
  Sab: "Sabtu",
  Min: "Minggu",
};
const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const BULAN_PENDEK: Record<string, string> = {
  Jan: "Januari",
  Feb: "Februari",
  Mar: "Maret",
  Apr: "April",
  Jun: "Juni",
  Jul: "Juli",
  Agu: "Agustus",
  Agt: "Agustus",
  Sep: "September",
  Okt: "Oktober",
  Nov: "November",
  Des: "Desember",
};
const NAMA_HARI = "Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu";
const RENTANG_HARI = new RegExp(`\\b(${NAMA_HARI})\\s*[-–]\\s*(${NAMA_HARI})\\b`, "g");
const JAM_TANPA_ZONA =
  /(?<![\d.,]|Rp)((?:[01]?\d|2[0-4])\.[0-5]\d(?:—(?:[01]?\d|2[0-4])\.[0-5]\d)?)(?!\d)(?![.,]\d)(?!—\d)(?! ?WIB)/g;

/** "2026-11-04" menjadi "4 November 2026". Selain bentuk itu dikembalikan apa adanya. */
export function tanggalIndonesia(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${+m[3]} ${BULAN[+m[2] - 1]} ${m[1]}` : iso;
}

/** Jam, rentang, hari, dan bulan menurut pedoman 2.6: 08.00—14.00 WIB, Senin—Jumat, 30 April 2017. */
function rapikanRentang(s: string): string {
  return tanggalIndonesia(s)
    .replace(/\b(\d{1,2}):(\d{2})\b/g, "$1.$2")
    .replace(/\bSab\/libur\b/g, "Sabtu dan hari libur")
    .replace(/\b(Sen|Sel|Rab|Kam|Jum|Sab|Min)\b/g, (m) => HARI_PENDEK[m])
    .replace(/\b(Jan|Feb|Mar|Apr|Jun|Jul|Agu|Agt|Sep|Okt|Nov|Des)\b(?=\s+\d{4})/g, (m) => BULAN_PENDEK[m])
    .replace(/Rp([\d.]+)\s*[-–]\s*(?:Rp)?([\d.]+)/g, "Rp$1—Rp$2")
    .replace(RENTANG_HARI, "$1—$2")
    .replace(/\b([Pp]agi|[Ss]ore)\s*-\s*(sore|malam)\b/g, "$1—$2")
    .replace(/(\d)\s*-\s*(\d)/g, "$1—$2")
    .replace(/\s*–\s*/g, "—")
    .replace(/\s+-\s+/g, "—")
    .replace(JAM_TANPA_ZONA, "$1 WIB");
}

/** Kata tidak baku, tanda &, dan garis miring penggabung (pedoman 2.7, 2.8). Bukan untuk nama usaha. */
const rapikanKata = (s: string) =>
  s
    .replace(/\bbooking\b/g, "pemesanan")
    .replace(/\bBooking\b/g, "Pemesanan")
    .replace(/\bvia\b/g, "lewat")
    .replace(/\bweekday\b/g, "hari kerja")
    .replace(/\bweekend\b/g, "akhir pekan")
    .replace(/\bcaf[eé](?!\p{L})/giu, "kafe")
    .replace(/\bmini gym\b/g, "pusat kebugaran mini")
    .replace(/\bgym\b/g, "pusat kebugaran")
    .replace(/\bmembership\b/g, "keanggotaan")
    .replace(/\bapp\b/g, "aplikasi")
    .replace(/\bjogging track\b/g, "jalur lari")
    .replace(/\bplayground\b/g, "taman bermain")
    .replace(/\bvilla\b/g, "vila")
    .replace(/\bpengecekan\b/g, "pemeriksaan")
    .replace(/~(\d)/g, "sekitar $1")
    .replace(/\bseafood\b/gi, "makanan laut")
    .replace(/\blegendaris\s+/gi, "")
    .replace(/\bNon Bintang\b/g, "Nonbintang")
    .replace(/\b([Nn])on[ -]([a-z])/g, "$1on$2")
    .replace(/\s*&\s*/g, " dan ")
    .replace(/\s+\/\s+/g, ", ")
    .replace(/\b([A-Za-z]{3,})\/([A-Za-z]{3,})\b/g, "$1 atau $2");

/** Teks bebas dari data: catatan dibuang, bahasanya dirapikan. Null bila yang tersisa masih catatan kerja. */
function rapikanNilai(teks: string): string | null {
  const isi = bersihkanCatatan(teks);
  if (!isi || CATATAN_INTERNAL.test(isi)) return null;
  return kapital(rapikanKata(rapikanRentang(isi)));
}

/** Jam layanan untuk pembaca. Jam mentah tetap dipakai untuk menghitung "Buka sekarang". */
export function jamPublik(p: Pick<Place, "jam_layanan">): string | null {
  const isi = p.jam_layanan ? bersihkanCatatan(p.jam_layanan) : null;
  if (!isi || /^tidak konsisten/i.test(isi)) return null;
  return kapital(rapikanKata(rapikanRentang(isi.replace(/24\/7/g, "24 jam"))));
}

/** Alamat tanpa catatan penyusun. Nama kantor di dalamnya, misalnya "Mustari & Partners", tetap utuh. */
export function alamatPublik(p: Pick<Place, "alamat">): string | null {
  if (!p.alamat) return null;
  const isi = bersihkanCatatan(p.alamat)
    .replace(/\s*;\s*alamat [^:]*lama:.*$/i, "")
    .replace(/\s*&(?!\s*Partners)\s*/g, " dan ")
    .replace(/\s+\/\s+/g, ", ")
    .replace(/\s*–\s*/g, "—");
  return isi || null;
}

// Catatan penting yang tersaring karena bercampur catatan kerja: ditulis ulang dari catatan aslinya, tanpa fakta baru.
const CATATAN_KURASI: Record<string, string> = {
  "pub-possar":
    "Masih berstatus Pos SAR di bawah KPP Basarnas Kelas A Tanjungpinang. Peluang naik status menjadi Kantor SAR Kelas B, yang disebut pada 7 Agustus 2026, belum terjadi.",
  "pln-tiban": "Kantor baru sejak 4 Agustus 2025, pindah dari Jl. RE. Martadinata, Kawasan Industri Sekupang.",
  "tpu-seitemiang":
    "Lahan makam Kristen dipindah ke lahan baru di sebelah makam Tionghoa. Pemko mengambil alih pengelolaan dan menanggung biaya gali tutup makam di Sei Temiang, Sei Panas, dan Kavling Bagan.",
  "kua-batuaji": "Alamat KUA Batu Aji dan KUA Sagulung sama-sama tercatat di Jl. R. Suprapto.",
  "kua-sagulung": "Alamat KUA Batu Aji dan KUA Sagulung sama-sama tercatat di Jl. R. Suprapto.",
  "pem-abh-bengkong": "KPP Bengkong pindah ke Baraka Business Center mulai 8 Desember 2025.",
  "or-021": "Kemungkinan sudah tutup.",
  "welcome-to-batam":
    "Pandangan bebas ke huruf Welcome to Batam tertutup ruko atau apartemen sejak 2024. Sempat terancam pengerukan bukit pada 2014.",
};

export function catatanPublik(p: Place): string | null {
  if (Object.hasOwn(CATATAN_KURASI, p.id)) return CATATAN_KURASI[p.id];
  if (!p.catatan || KATEGORI_TANPA_CATATAN.has(p.kategori)) return null;
  return rapikanNilai(p.catatan);
}

// Daftar putih atribut. Yang tidak tercantum tidak pernah tampil: rating Google, luas lahan, id internal, tautan
// ke situs pemerintah, dan catatan penyusun tetap tersimpan di data, tetapi tidak sampai ke warga. Empat baris
// pertama mengikuti urutan tabel kartu tempat (3.8).
const ATRIBUT: Record<string, string> = {
  rawat_inap: "Rawat inap",
  melayani_bpjs: "Melayani BPJS",
  tipe: "Tipe rumah sakit",
  npsn: "NPSN",
  kelas_asli: "Kelas",
  tipe_museum: "Tipe museum",
  igd_24jam: "IGD 24 jam",
  harga: "Harga",
  catatan_harga: "Catatan harga",
  booking: "Pemesanan",
  cara_booking: "Pemesanan",
  lapangan: "Lapangan",
  jumlah_lapangan: "Lapangan",
  hole: "Hole",
  par: "Par",
  pengelola: "Pengelola",
  operator: "Operator",
  layanan: "Layanan",
  layanan_gratis: "Layanan gratis",
  pendampingan_sidang: "Mendampingi di sidang",
  afiliasi_dpn: "Afiliasi DPN",
  wilayah_kerja: "Wilayah kerja",
  aplikasi: "Aplikasi",
  fasilitas: "Fasilitas",
  kapasitas: "Kapasitas",
  rute: "Rute",
  tujuan: "Tujuan",
  waktu_tempuh: "Waktu tempuh",
  koridor: "Koridor",
  jemput_bola: "Jemput bola",
  antrean_online: "Antrean daring",
  layanan_sabtu: "Layanan Sabtu",
  instansi: "Instansi di dalamnya",
  loket_mpp: "Ada loket di MPP",
  ramah_anak: "Ramah anak",
  parkir: "Parkir",
  waktu_terbaik: "Waktu terbaik",
  wahana: "Wahana",
  wahana_hari_kerja: "Wahana hari kerja",
  toilet: "Toilet",
  total_spklu_pln_batam: "Total SPKLU PLN Batam",
  pembayaran: "Pembayaran",
  agama_makam: "Agama",
  akses: "Akses",
  call_center: "Call center",
  nomor_darurat: "Nomor darurat",
  diresmikan: "Diresmikan",
  tahun_berdiri: "Berdiri",
  status_cagar_budaya: "Status",
  jadwal: "Jadwal",
  ringkasan: "Ringkasan",
};
const TANPA_ATRIBUT = new Set(["kampung_tua", "lainnya", "kuliner"]);
/** Nomor (tanda hubungnya bukan rentang) dan alamat situs organisasi ditulis apa adanya. */
const NILAI_APA_ADANYA = new Set(["npsn", "call_center", "nomor_darurat", "afiliasi_dpn"]);

function teksNilai(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "boolean") return v ? "Ya" : "Tidak";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return v;
  if (Array.isArray(v)) {
    const isi = v
      .filter((x) => typeof x === "string" || typeof x === "number")
      .map((x) => String(x).replace(/_/g, " "));
    return isi.length ? isi.join(", ") : null;
  }
  return null;
}

export function atributPublik(p: Place): { label: string; nilai: string }[] {
  if (TANPA_ATRIBUT.has(p.kategori)) return [];
  const out: { label: string; nilai: string }[] = [];
  for (const [k, labelDasar] of Object.entries(ATRIBUT)) {
    // Baris jam buka sudah menyebutnya.
    if (k === "igd_24jam" && p.jam_layanan?.includes("IGD 24 jam")) continue;
    // Data tipe yang berbeda antarsumber ditulis sebagai dua kemungkinan, bukan dipilih salah satu.
    const kandidat = k === "tipe" && Array.isArray(p.atribut.tipe_kandidat) ? p.atribut.tipe_kandidat.join(" atau ") : null;
    const mentah = teksNilai(kandidat ?? p.atribut[k]);
    if (!mentah) continue;
    const nilai = NILAI_APA_ADANYA.has(k) ? mentah : rapikanNilai(mentah);
    const label = k === "tipe" && p.kategori !== "kesehatan" ? "Tipe" : labelDasar;
    if (nilai && !out.some((o) => o.label === label)) out.push({ label, nilai });
  }
  return out;
}

/** Kartu hanya nama dan letak umum: kampung tua, dan Rempang Eco-City sampai teks netralnya disetujui (PLAN butir 13). */
export const kartuMinimal = (p: Pick<Place, "id" | "kategori">) =>
  p.kategori === "kampung_tua" || p.id === "kawasan-rempang-eco-city";

export type Nada = "ok" | "caution" | "danger" | "info" | undefined;
export type Lencana = { teks: string; nada: Nada };

const SUB_PROFESI = new Set(["ppat", "notaris_ppat", "pejabat_lelang_kelas_ii"]);
export const adalahProfesi = (p: Pick<Place, "subkategori">) => SUB_PROFESI.has(p.subkategori ?? "");

const LABEL_STATUS: Record<string, Lencana> = {
  rencana: { teks: "Rencana, belum beroperasi", nada: "info" },
  cerita_rakyat: { teks: "Cerita rakyat", nada: "info" },
};

/** Paling banyak satu label per tempat, dan hanya yang mengubah cara membaca kartunya. */
export function labelTempat(p: Pick<Place, "id" | "kategori" | "status_data" | "atribut">): Lencana[] {
  if (!kartuMinimal(p) && p.status_data && Object.hasOwn(LABEL_STATUS, p.status_data)) {
    return [LABEL_STATUS[p.status_data]];
  }
  return p.atribut.lokasi_luar_batam === true ? [{ teks: "Di luar Batam", nada: "info" }] : [];
}

/** Hanya untuk mode mural, yang membaca "Lokasi perkiraan" untuk menggambar pinnya. Direktori memakai labelTempat. */
export function lencana(p: Parameters<typeof labelTempat>[0] & Pick<Place, "status_koordinat">): Lencana[] {
  const out = labelTempat(p);
  return p.status_koordinat === "perlu_cek_ulang" ? [...out, { teks: "Lokasi perkiraan", nada: "info" }] : out;
}

/** Masih diimpor features/kampung-tua dan features/mural. Direktori tidak lagi menampilkan tanggal cek. */
export function teksDicek(p: Pick<Place, "atribut">): string {
  const t = p.atribut.last_verified;
  return typeof t === "string" && t ? `Dicek ${t}` : "";
}

const SITUS_PALSU = /damkarbatam\.com|disdikkotabatam\.org|disdikbatampemkot\.com/i;
export const tautanAman = (u: unknown): u is string =>
  typeof u === "string" && /^https?:\/\//.test(u) && !SITUS_PALSU.test(u);

/** Kosong bila kelurahan dan kecamatannya tidak tercatat: barisnya tidak ditampilkan. */
export const lokasiTeks = (p: Pick<Place, "kelurahan" | "kecamatan">) =>
  [p.kelurahan, p.kecamatan].filter(Boolean).join(", ");

/** Punya titik yang boleh tampil di peta. Tanpa titik, tombol "Lihat di peta" tidak ada dan tidak ada teks pengganti. */
export const punyaTitik = (p: Pick<Place, "lat" | "lng" | "status_koordinat" | "atribut">) =>
  p.lat != null && p.lng != null && p.status_koordinat !== "perlu_diisi_user" && p.atribut.lokasi_luar_batam !== true;

/** Baris terakhir di daftar tempat. "Buka sekarang" dihitung di browser, jadi hanya ada di Penjelajah. */
export const statusBaris = (p: Pick<Place, "atribut" | "jam_layanan">) =>
  p.atribut.igd_24jam === true ? "IGD 24 jam" : jamPublik(p);

/**
 * Tempat yang hanya punya nama tidak mendapat halaman sendiri, cukup jadi baris di daftar (3.8). Alamat lamanya
 * dialihkan ke baris itu lewat barisDaftar, karena fitur lain masih menautkan sebagian tempat ini.
 */
export const punyaHalaman = (p: Place) =>
  kartuMinimal(p) ||
  !!alamatPublik(p) ||
  punyaTitik(p) ||
  !!jamPublik(p) ||
  kontakPublik(p).length > 0 ||
  atributPublik(p).length > 0 ||
  !!catatanPublik(p);

export const barisDaftar = (p: Pick<Place, "nama">) => `/info/direktori?q=${encodeURIComponent(p.nama)}`;

/** Koordinat perkiraan tidak dipakai untuk mengarahkan orang: yang belum pasti dicari menurut namanya. */
export function tautanArah(p: Pick<Place, "nama" | "kecamatan" | "lat" | "lng" | "status_koordinat" | "atribut">): string {
  const g = p.atribut.gmaps;
  if (typeof g === "string" && g.startsWith("https://www.google.com/maps/")) return g;
  if (p.status_koordinat === "terverifikasi" && p.lat != null && p.lng != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  }
  const kata = [p.nama, p.kecamatan, "Batam"].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(kata)}`;
}

/** Baris ringkas untuk pencarian di browser. Tidak memuat atribut, jadi rating tidak ikut terkirim. */
export function barisIndeks(p: Place) {
  return {
    id: p.id,
    nama: p.nama,
    alt: p.nama_alternatif,
    /** Kategori tampilan, bukan kategori data. */
    k: kunciTampil(p.kategori),
    s: p.subkategori,
    sl: labelSub(p.subkategori),
    c: p.kecamatan,
    l: p.kelurahan,
    /** Jam mentah, untuk menghitung "Buka sekarang". */
    j: p.jam_layanan,
    /** Jam yang sudah dirapikan, untuk ditampilkan. */
    jt: jamPublik(p),
    /** IGD 24 jam. */
    i: p.atribut.igd_24jam === true,
    /** Punya halaman sendiri. */
    h: punyaHalaman(p),
  };
}
export type BarisIndeks = ReturnType<typeof barisIndeks>;

export type Pin = {
  id: string;
  nama: string;
  k: string;
  sl: string;
  s: string | null;
  lat: number;
  lng: number;
  perkiraan: boolean;
  lokasi: string;
  alamat: string | null;
  jam: string | null;
  lencana: Lencana[];
  /** tempat lain di koordinat yang persis sama */
  lain: { id: string; nama: string }[];
};

/**
 * Pin peta: hanya tempat berkoordinat, tanpa tempat di luar Batam (research/05, prompt bagian 1). Beberapa
 * tempat di satu titik, mis. kompleks kamp Galang, jadi satu pin, bukan lima pin bertumpuk.
 */
export function daftarPin(sumber: Place[] = TEMPAT): Pin[] {
  const perTitik = new Map<string, Pin>();
  for (const p of sumber) {
    if (!punyaTitik(p)) continue;
    const kunci = `${p.lat},${p.lng}`;
    const ada = perTitik.get(kunci);
    if (ada) {
      ada.lain.push({ id: p.id, nama: p.nama });
      continue;
    }
    perTitik.set(kunci, {
      id: p.id,
      nama: p.nama,
      k: p.kategori,
      sl: labelSub(p.subkategori),
      s: p.subkategori,
      lat: p.lat as number,
      lng: p.lng as number,
      perkiraan: p.status_koordinat !== "terverifikasi",
      lokasi: lokasiTeks(p),
      alamat: alamatPublik(p),
      jam: jamPublik(p),
      lencana: labelTempat(p),
      lain: [],
    });
  }
  return [...perTitik.values()];
}

const hanyaAngka = (s: string) => s.replace(/\D/g, "");
const SITUS_PEMERINTAH = /\.go\.id\b/i;
const NOMOR_PONSEL = /^(\+?62|0)\s*8/;

/**
 * Kontak tampil apa adanya; tautan hanya kalau isinya memang satu nomor atau alamat. Alamat dan situs pemerintah
 * tidak ditampilkan (2.9). Nomor ponsel di tempat makan disembunyikan sampai pemiliknya dipastikan (8.3).
 */
export function kontakPublik(p: Pick<Place, "kontak" | "kategori">): { label: string; teks: string; href: string | null }[] {
  const out: { label: string; teks: string; href: string | null }[] = [];
  const { telepon, whatsapp, email, website } = p.kontak;
  if (typeof telepon === "string" && telepon && !(p.kategori === "kuliner" && NOMOR_PONSEL.test(telepon))) {
    const teks = telepon.replace(/\s*\(halaman kontak resmi\)/i, "");
    const satu = /^[+\d\s()-]+$/.test(teks);
    out.push({ label: "Telepon", teks, href: satu ? `tel:${teks.replace(/[^+\d]/g, "")}` : null });
  }
  if (typeof whatsapp === "string" && whatsapp) {
    const satu = /^[+\d\s()-]+$/.test(whatsapp);
    const nomor = hanyaAngka(whatsapp).replace(/^0/, "62");
    out.push({ label: "WhatsApp", teks: whatsapp, href: satu ? `https://wa.me/${nomor}` : null });
  }
  if (typeof email === "string" && email && !SITUS_PEMERINTAH.test(email)) {
    out.push({ label: "Email", teks: email, href: `mailto:${email}` });
  }
  if (typeof website === "string" && website && !SITUS_PEMERINTAH.test(website)) {
    const url = /^https?:\/\//.test(website) ? website : `https://${website}`;
    if (tautanAman(url)) out.push({ label: "Situs", teks: website.replace(/^https?:\/\//, ""), href: url });
  }
  return out;
}
