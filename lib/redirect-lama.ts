// Peta alamat situs lama ke situs baru. Dipakai sebagai acuan deploy/situs-lama/ dan dites.
// Eksekusinya menunggu izin pemilik: berkas ini sendiri tidak mengalihkan apa pun.

const BITES: [RegExp, string][] = [
  [/^\/$/, "/makan"],
  [/^\/tempat\/([^/]+)\/?$/, "/makan/tempat/$1"],
  [/^\/jalur\/?$/, "/makan/panduan"],
  [/^\/jalur\/([^/]+)\/?$/, "/makan/panduan/$1"],
  [/^\/peta\/?$/, "/makan/peta"],
  [/^\/daftar\/?$/, "/makan/peta"],
  [/^\/kategori\/?$/, "/makan/hidangan"],
  [/^\/saved\/?$/, "/makan/simpanan"],
  [/^\/about\/?$/, "/makan/cara-memilih"],
];

const MODE_CUACA: Record<string, string> = { hujan: "/cuaca/hujan", ombak: "/cuaca/gelombang", cctv: "/cctv" };

/** hujandibatam hanya punya satu halaman; ?mode= menentukan halaman barunya, ?view= dan ?cam= ikut terbawa. */
export function alamatBaruHujan(_path: string, query = ""): string {
  const p = new URLSearchParams(query);
  const mode = p.get("mode") ?? "";
  p.delete("mode");
  const sisa = p.toString();
  const dasar = p.get("cam") ? "/cctv" : (MODE_CUACA[mode] ?? "/cuaca/hujan");
  return sisa ? `${dasar}?${sisa}` : dasar;
}

export function alamatBaruBites(path: string, query = ""): string | null {
  for (const [pola, tujuan] of BITES) {
    if (pola.test(path)) return path.replace(pola, tujuan) + query;
  }
  return null;
}
