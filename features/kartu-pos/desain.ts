// Desain kartu pos. Tambah desain: taruh gambar 1748 x 1240 px (A6 300 dpi) di public/kartu-pos/, lalu daftarkan di sini.
export const DESAIN = [
  { id: "selat", nama: "Selat", gambar: "/kartu-pos/selat.webp" },
  { id: "kelong", nama: "Kelong", gambar: "/kartu-pos/kelong.webp" },
  { id: "gonggong", nama: "Gonggong", gambar: "/kartu-pos/gonggong.webp" },
  { id: "kopitiam", nama: "Kopitiam", gambar: "/kartu-pos/kopitiam.webp" },
  { id: "hujan", nama: "Hujan", gambar: "/kartu-pos/hujan.webp" },
  { id: "pulau", nama: "Pulau", gambar: "/kartu-pos/pulau.webp" },
] as const;

/** Judul kartu. Nama kecamatan datang dari data, huruf kapitalnya sudah benar. */
export const salamDari = (tempat: string) => tempat.trim() || "Batam";
