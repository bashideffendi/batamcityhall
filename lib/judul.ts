// Kaidah judul (PEDOMAN 2.3): kapital di awal setiap kata, kecuali kata tugas yang tidak berada di awal.
const KATA_TUGAS = new Set([
  "di",
  "ke",
  "dari",
  "dan",
  "yang",
  "untuk",
  "pada",
  "dengan",
  "atau",
  "bagi",
  "tentang",
  "oleh",
  "sebagai",
  "dalam",
  "per",
  // Bagian nama diri yang ditulis kecil.
  "bin",
  "binti",
  "ibni",
  "de",
]);

export const KATA_TUGAS_EN = new Set(["a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);

const kapitalAwal = (s: string) => s.replace(/^([("“‘]*)(\p{L})/u, (_, depan: string, huruf: string) => depan + huruf.toUpperCase());

/** "Darurat dan keamanan" menjadi "Darurat dan Keamanan". Huruf kapital yang sudah ada tidak diubah. */
export function kaidahJudul(teks: string, tugas: ReadonlySet<string> = KATA_TUGAS): string {
  return teks
    .split(" ")
    .map((kata, i) => {
      const polos = kata.replace(/^[("“‘]+|[),.;:"”’]+$/g, "").toLowerCase();
      if (i > 0 && tugas.has(polos)) return kata;
      // Bilangan tingkat tetap kecil: Abad ke-20.
      if (/^ke-\d/i.test(kata)) return kata;
      return kata
        .split("/")
        .map((bagian) => bagian.split("-").map(kapitalAwal).join("-"))
        .join("/");
    })
    .join(" ");
}
