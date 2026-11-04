// Peta alamat situs lama ke situs baru. Dipakai sebagai acuan deploy/situs-lama/ dan dites.
// Eksekusinya menunggu izin pemilik: berkas ini sendiri tidak mengalihkan apa pun.

const BITES: [RegExp, string][] = [
  [/^\/$/, "/makan"],
  [/^\/tempat\/([^/]+)\/?$/, "/makan/tempat/$1"],
  [/^\/jalur\/?$/, "/makan/jalur"],
  [/^\/jalur\/([^/]+)\/?$/, "/makan/jalur/$1"],
  [/^\/peta\/?$/, "/makan/peta"],
  [/^\/daftar\/?$/, "/makan/daftar"],
  [/^\/kategori\/?$/, "/makan/kategori"],
  [/^\/saved\/?$/, "/makan/tersimpan"],
  [/^\/about\/?$/, "/makan/tentang"],
];

/** hujandibatam hanya punya satu halaman; parameter ?mode=&view=&cam= ikut terbawa. */
export function alamatBaruHujan(path: string, query = ""): string {
  return `${path === "/" ? "/langit-laut" : "/langit-laut"}${query}`;
}

export function alamatBaruBites(path: string, query = ""): string | null {
  for (const [pola, tujuan] of BITES) {
    if (pola.test(path)) return path.replace(pola, tujuan) + query;
  }
  return null;
}
