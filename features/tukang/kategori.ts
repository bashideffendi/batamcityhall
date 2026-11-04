// Kategori jasa harian. Daftar pemilik proyek (research/00 bagian 4) menang; kolom taksonomi menunjuk baris
// "Jasa" di data/taksonomi/taksonomi.json supaya bisa dicocokkan. Money changer dan bank sengaja tidak ada:
// itu usaha berizin yang datanya di direktori, bukan rekomendasi warga.
export type KategoriJasa = { slug: string; nama: string; taksonomi: string | null };

export const KATEGORI_JASA: KategoriJasa[] = [
  { slug: "jahit-permak", nama: "Jahit & permak", taksonomi: "Tukang kunci, jahit & permak" },
  { slug: "tukang-kunci", nama: "Tukang kunci", taksonomi: "Tukang kunci, jahit & permak" },
  { slug: "sol-sepatu", nama: "Sol sepatu", taksonomi: null },
  { slug: "mebel", nama: "Mebel & furnitur", taksonomi: null },
  { slug: "servis-ac", nama: "Servis & cuci AC", taksonomi: "Servis AC, elektronik, HP, laptop, mesin cuci, kulkas" },
  {
    slug: "servis-elektronik",
    nama: "Servis HP, laptop, elektronik, mesin cuci, kulkas",
    taksonomi: "Servis AC, elektronik, HP, laptop, mesin cuci, kulkas",
  },
  { slug: "bengkel", nama: "Bengkel motor & mobil", taksonomi: "Bengkel, ban, cuci kendaraan" },
  { slug: "bangunan", nama: "Tukang bangunan, listrik, ledeng", taksonomi: "Tukang bangunan, listrik, ledeng" },
  { slug: "sedot-wc", nama: "Sedot WC", taksonomi: "Tukang bangunan, listrik, ledeng" },
  { slug: "laundry", nama: "Laundry", taksonomi: "Laundry, salon, barbershop" },
  { slug: "salon-barbershop", nama: "Salon & barbershop", taksonomi: "Laundry, salon, barbershop" },
  { slug: "pijat-refleksi", nama: "Pijat & refleksi", taksonomi: "Pijat, refleksi, pijat panggilan" },
  { slug: "pijat-panggilan", nama: "Pijat panggilan", taksonomi: "Pijat, refleksi, pijat panggilan" },
  { slug: "fotokopi-percetakan", nama: "Fotokopi & percetakan", taksonomi: "Fotokopi, percetakan, ekspedisi" },
  { slug: "dokter", nama: "Dokter per spesialis", taksonomi: null },
  { slug: "kos", nama: "Kos", taksonomi: null },
  { slug: "jastip-singapura", nama: "Jastip Singapura", taksonomi: null },
  { slug: "lainnya", nama: "Lainnya", taksonomi: null },
];

const NAMA = new Map(KATEGORI_JASA.map((k) => [k.slug, k.nama]));
export const namaJasa = (slug: string) => NAMA.get(slug) ?? "Lainnya";
export const SLUG_JASA = KATEGORI_JASA.map((k) => k.slug);

/** Tanpa rating bintang. Tag dipilih dari daftar, bukan ditulis bebas, supaya tidak perlu dimoderasi. */
export const TAG_REKOMENDASI = ["rapi", "on time", "harga jujur", "ramah", "cepat", "ada garansi"] as const;

export const JENIS_KOREKSI = [
  { nilai: "data_salah", nama: "Datanya salah" },
  { nilai: "tutup_pindah", nama: "Sudah tutup atau pindah" },
  { nilai: "lokasi", nama: "Titik lokasinya salah atau belum ada" },
  { nilai: "hapus_data", nama: "Minta data saya dihapus" },
  { nilai: "koreksi_data_pribadi", nama: "Minta data saya dikoreksi" },
  { nilai: "lainnya", nama: "Lainnya" },
] as const;
