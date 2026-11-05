// Jenis jasa. Nama dan urutan mengikuti PEDOMAN 3.5; slug tetap supaya alamat dan data lama tidak berubah.
// Kolom taksonomi menunjuk baris "Jasa" di data/taksonomi/taksonomi.json, dengan "&" ditulis "dan".
// Money changer dan bank sengaja tidak ada: itu usaha berizin yang datanya di direktori, bukan rekomendasi warga.
export type KategoriJasa = { slug: string; nama: string; taksonomi: string | null };

export const KATEGORI_JASA: KategoriJasa[] = [
  { slug: "jahit-permak", nama: "Jahit dan permak", taksonomi: "Tukang kunci, jahit dan permak" },
  { slug: "mebel", nama: "Mebel", taksonomi: null },
  { slug: "servis-ac", nama: "Servis dan cuci AC", taksonomi: "Servis AC, elektronik, HP, laptop, mesin cuci, kulkas" },
  { slug: "bengkel", nama: "Bengkel motor dan mobil", taksonomi: "Bengkel, ban, cuci kendaraan" },
  { slug: "tukang-kunci", nama: "Tukang kunci", taksonomi: "Tukang kunci, jahit dan permak" },
  { slug: "laundry", nama: "Binatu", taksonomi: "Laundry, salon, barbershop" },
  { slug: "sol-sepatu", nama: "Sol sepatu", taksonomi: null },
  {
    slug: "servis-elektronik",
    nama: "Servis ponsel, laptop, dan elektronik",
    taksonomi: "Servis AC, elektronik, HP, laptop, mesin cuci, kulkas",
  },
  { slug: "bangunan", nama: "Tukang bangunan, listrik, dan ledeng", taksonomi: "Tukang bangunan, listrik, ledeng" },
  { slug: "pijat-refleksi", nama: "Pijat dan refleksi", taksonomi: "Pijat, refleksi, pijat panggilan" },
  { slug: "pijat-panggilan", nama: "Pijat panggilan", taksonomi: "Pijat, refleksi, pijat panggilan" },
  { slug: "salon-barbershop", nama: "Salon dan pangkas rambut", taksonomi: "Laundry, salon, barbershop" },
  { slug: "fotokopi-percetakan", nama: "Fotokopi dan percetakan", taksonomi: "Fotokopi, percetakan, ekspedisi" },
  { slug: "kos", nama: "Indekos", taksonomi: null },
  { slug: "jastip-singapura", nama: "Jasa titip Singapura", taksonomi: null },
  { slug: "lainnya", nama: "Lainnya", taksonomi: null },
];

const NAMA = new Map(KATEGORI_JASA.map((k) => [k.slug, k.nama]));
export const namaJasa = (slug: string) => NAMA.get(slug) ?? "Lainnya";
export const SLUG_JASA = KATEGORI_JASA.map((k) => k.slug);

/** Tanpa rating bintang. Kata dipilih dari daftar, bukan ditulis bebas, supaya tidak perlu dimoderasi. */
export const TAG_REKOMENDASI = ["rapi", "tepat waktu", "harga jujur", "ramah", "cepat"] as const;

/** Nilai tersimpan berhuruf kecil. Yang tampil berkapital di awal: Rapi, Tepat waktu. */
export const teksTag = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);

export const JENIS_KOREKSI = [
  { nilai: "data_salah", nama: "Datanya salah" },
  { nilai: "tutup_pindah", nama: "Sudah tutup atau pindah" },
  { nilai: "lokasi", nama: "Titik lokasinya salah atau belum ada" },
  { nilai: "hapus_data", nama: "Minta data saya dihapus" },
  { nilai: "koreksi_data_pribadi", nama: "Minta data saya dikoreksi" },
  { nilai: "lainnya", nama: "Lainnya" },
] as const;
