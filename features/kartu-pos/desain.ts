// Desain kartu pos. Tambah desain: taruh gambar 1748 x 1240 px (A6 300 dpi) di public/kartu-pos/, jalankan
// node scripts/buat-varian-gambar.mjs untuk versi layarnya, lalu daftarkan di sini.
export const DESAIN = [
  { id: "selat", nama: "Selat", gambar: "/kartu-pos/selat.webp" },
  { id: "kelong", nama: "Kelong", gambar: "/kartu-pos/kelong.webp" },
  { id: "gonggong", nama: "Gonggong", gambar: "/kartu-pos/gonggong.webp" },
  { id: "kopitiam", nama: "Kopitiam", gambar: "/kartu-pos/kopitiam.webp" },
  { id: "hujan", nama: "Hujan", gambar: "/kartu-pos/hujan.webp" },
  { id: "pulau", nama: "Pulau", gambar: "/kartu-pos/pulau.webp" },
] as const;

/** Versi 874 x 620 untuk pilihan desain dan beranda. Berkas aslinya dipakai untuk kartu besar dan cetak. */
export const gambarLayar = (gambar: string) => gambar.replace("/kartu-pos/", "/kartu-pos/layar/");

/** Judul kartu. Nama kecamatan datang dari data, huruf kapitalnya sudah benar. */
export const salamDari = (tempat: string) => tempat.trim() || "Batam";
