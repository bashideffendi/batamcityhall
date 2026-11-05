// Hanya judul yang menyebut Batam dan sekitarnya yang tampil (pedoman 8.4). Bila hasilnya sedikit, tampilkan
// sedikit: tidak ada berita lain yang dipakai untuk mengisi.
import { KECAMATAN } from "@/lib/data/schema";

// Kata yang juga kata umum ("galang dana", "jodoh", "rezeki tiban") dipisah: lihat NAMA_TEMPAT_KETAT.
const KATA_UMUM = new Set(["Galang", "Jodoh", "Tiban"]);

const KATA_KUNCI = [
  "Batam",
  "Kepri",
  "Kepulauan Riau",
  "Barelang",
  "Rempang",
  "Bulang",
  "Belakang Padang",
  "Nongsa",
  "Bintan",
  "Tanjungpinang",
  "Tanjung Pinang",
  ...KECAMATAN,
  "Nagoya",
  "Batam Centre",
  "Batu Aji",
  "Sekupang",
  "Harbour Bay",
  "Bengkong",
  "Tanjung Uncang",
  "Muka Kuning",
].filter((k) => !KATA_UMUM.has(k));

const utuh = (isi: string, flag: string) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${isi})(?![\\p{L}\\p{N}])`, flag);

// "Batu Aji" juga cocok dengan "Batuaji", karena media menulis keduanya.
const NAMA_TEMPAT = utuh(KATA_KUNCI.map((k) => k.replace(/\s+/g, "\\s*")).join("|"), "iu");
const NAMA_TEMPAT_KETAT = utuh("Galang(?!\\s+Dana)|GALANG(?!\\s+DANA)|Jodoh|JODOH|Tiban|TIBAN", "u");

export const tentangBatam = (judul: string) => NAMA_TEMPAT.test(judul) || NAMA_TEMPAT_KETAT.test(judul);
