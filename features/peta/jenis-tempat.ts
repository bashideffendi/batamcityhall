// Pemetaan tempat ke jenis di panel Tempat (PEDOMAN 5.4). Murni supaya bisa dites.
// Kategori pemerintahan, layanan publik, pemakaman, pertanahan, jasa, dan lain-lain tidak tampil di panel ini;
// semuanya tetap ada di Direktori.

const MI = new Set(["mie-bakmi", "bakso", "mie-tarempa", "sup-ikan"]);
const DIMSUM = new Set(["dimsum-chinese", "bubur"]);
const KOPI = new Set(["kopitiam", "cafe", "kedai_kopi"]);
const TEMPAT_MAKAN_LAIN = "nasi";

/** Jenis tempat untuk satu pin, atau null kalau tidak tampil di panel Tempat. */
export function jenisDari(kategori: string, sub: string | null | undefined): string | null {
  const s = sub ?? "";
  switch (kategori) {
    case "kuliner":
      if (s === "seafood-gonggong" || s === "kuliner_seafood") return "seafood";
      if (KOPI.has(s)) return "kopi";
      if (MI.has(s)) return "mi";
      if (DIMSUM.has(s)) return "dimsum";
      if (s === "oleh-oleh") return "oleh";
      return TEMPAT_MAKAN_LAIN;
    case "khas_batam":
      if (s === "kuliner_seafood") return "seafood";
      if (s === "kedai_kopi") return "kopi";
      return null;
    case "akomodasi":
      return "hotel";
    case "ibadah":
      if (s.startsWith("masjid")) return "masjid";
      if (s.startsWith("gereja")) return "gereja";
      if (s === "vihara" || s === "wihara" || s === "klenteng" || s === "kelenteng") return "wihara";
      if (s === "pura") return "pura";
      return null;
    case "kesehatan":
      return s === "rumah_sakit" ? "rs" : null;
    case "transportasi":
      if (s === "terminal_feri" || s === "pelabuhan_internasional" || s === "pelabuhan_domestik") return "feri";
      if (s === "bandara") return "bandara";
      if (s === "halte_bus" || s === "halte_transfer_bus") return "halte";
      return null;
    case "belanja":
      if (s === "pasar_barang_seken") return "bekas";
      if (s === "mal" || s === "hypermarket" || s === "grosir" || s === "kawasan_ruko") return "mal";
      return null;
    case "kampung_tua":
      return "kampung";
    case "landmark":
      return s === "jembatan" ? "jembatan" : "sejarah";
    case "budaya":
      return "sejarah";
    case "wisata":
      if (s === "pantai") return "pantai";
      if (s === "museum") return "sejarah";
      return null;
    case "ruang_publik":
      return "taman";
    case "olahraga":
      return "olahraga";
    default:
      return null;
  }
}

/** Tempat penting yang selalu berlabel nama (PEDOMAN 5.4). */
export const jenisPenting = (jenis: string) => jenis === "feri" || jenis === "bandara";

const KUNCI = "bch-tempat";

export function bacaPilihan(semua: string[], awal: string[]): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(KUNCI) ?? "null");
    if (Array.isArray(raw)) return new Set(raw.filter((x) => semua.includes(x)));
  } catch {
    /* abaikan */
  }
  return new Set(awal);
}

export function simpanPilihan(pilihan: ReadonlySet<string>) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify([...pilihan]));
  } catch {
    /* abaikan */
  }
}
