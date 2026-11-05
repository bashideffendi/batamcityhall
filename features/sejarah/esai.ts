// Esai dua poros (brief 15). Semua fakta berasal dari entri garis waktu yang disebut di `rujukan`.
import { TEKS_REMPANG } from "./data";

export type LangkahEsai = {
  id: string;
  tahun: number;
  label: string;
  poros: "sebelum" | "lokal" | "negara" | "bersama" | null;
  judul: string;
  paragraf: string[];
  rujukan: string[];
  tautan?: { href: string; label: string };
};

export const ESAI: LangkahEsai[] = [
  {
    id: "laut",
    tahun: 1757,
    label: "Sebelum 1829",
    poros: "sebelum",
    judul: "Dari Prasejarah ke Bulang",
    paragraf: [
      "Belum ada situs prasejarah terkonfirmasi di Pulau Batam. Situs terdekat yang diteliti adalah Bukit Kerang Kawal Darat di Bintan. Klaim “dihuni sejak 231 Masehi” sering dikutip, tetapi sumber primernya belum ada.",
      "Yang lebih terang adalah Bulang. Pejabat Temenggung ditempatkan di sana pada masa Kesultanan Johor-Riau, dan Temenggung Abdul Jamal berkedudukan serta dimakamkan di Bulang. Kedudukan itu pindah ke Singapura pada 1811 atau 1818, tergantung sumbernya.",
    ],
    rujukan: ["gw-001", "gw-002", "gw-t03", "gw-004", "gw-005"],
  },
  {
    id: "mandat",
    tahun: 1829,
    label: "18 Desember 1829",
    poros: "lokal",
    judul: "Poros Pertama: Pemerintahan Lokal",
    paragraf: [
      "Traktat London, 17 Maret 1824, memberi Singapura kepada Inggris dan Riau-Lingga, termasuk Batam, kepada Belanda.",
      "Lima tahun kemudian Raja Isa, putra Raja Ali, dikukuhkan memegang perintah atas Nongsa dan rantaunya. Suratnya ditandai Residen Riouw Letkol C.P.J. Elout. Perda 4/2009 menjadikan tanggal itu Hari Jadi Kota Batam.",
      "Setelah itu kapal dari Tanjungpinang dan Penyengat singgah dulu di Nongsa sebelum menyeberang ke Singapura.",
    ],
    rujukan: ["gw-006", "gw-007", "gw-t04", "gw-t14"],
  },
  {
    id: "peta-lama",
    tahun: 1882,
    label: "1847 sampai 1898",
    poros: "lokal",
    judul: "Batam di Peta Lama",
    paragraf: [
      "Peta 1847 menulisnya Bantang. Peta dan artikel J.G. Schot 1882 menulisnya Battam, dengan tiga wakilschap: Nongsa, Bulang, dan Sulit.",
      "Menjelang 1900 Raja Ali Kelana dan pengusaha Singapura Ong Sam Leong menjalankan pabrik bata. Tahun dan letaknya berbeda antarsumber.",
    ],
    rujukan: ["gw-009", "gw-010", "gw-011"],
  },
  {
    id: "rempang-galang-1945",
    tahun: 1945,
    label: "Oktober 1945 sampai Juli 1946",
    poros: null,
    judul: "Rempang dan Galang Setelah Perang",
    paragraf: [
      "Catatan tentang pendudukan Jepang di Pulau Batam masih sedikit.",
      "Menurut BiblioAsia (NLB, 2026), orang Jepang tinggal di Rempang antara Oktober 1945 dan Juli 1946. Repatriasi pertama dimulai 24 April 1946, tercatat dalam laporan British Liaison Staff Rempang (WO 203/2460).",
      "Jumlahnya ada dua versi. Tugu Jepang di Sembulang (Rempang Friendship Association, 1981) mencatat 112.708 serdadu, 128 di antaranya meninggal. BiblioAsia menyebut sekitar 68.000 orang diinternir di Rempang, dan lebih dari 150 orang meninggal di Rempang dan Galang.",
    ],
    rujukan: ["gw-t06", "gw-012"],
  },
  {
    id: "proyek-negara",
    tahun: 1969,
    label: "1965 sampai 1973",
    poros: "negara",
    judul: "Poros Kedua: Kota Proyek Negara",
    paragraf: [
      "Tahun 1965 BP Batam mencatat Batam sebagai desa kecil, sekitar 6.000 jiwa. Pusat kecamatan saat itu ada di Belakang Padang, bukan di Pulau Batam.",
      "Tahun 1969 Pertamina di bawah Ibnu Sutowo menjadikan Batam basis logistik migas. Keppres 74/1971, 26 Oktober 1971, menetapkannya sebagai daerah industri. Keppres 41/1973 menyusul dan menyebut Otorita Batam sebagai pengelola.",
      "Kota ini sering diceritakan mulai dari sini. Mandat Nongsa sudah berumur 140 tahun saat Pertamina datang.",
    ],
    rujukan: ["gw-t08", "gw-013", "gw-014", "gw-015", "gw-016"],
  },
  {
    id: "galang",
    tahun: 1979,
    label: "1979 sampai 1996",
    poros: null,
    judul: "Galang",
    paragraf: [
      "Pulau Galang menjadi tempat penampungan pengungsi Indochina dari 1979 sampai 1996. Bekasnya kini Wisata Sejarah Galang.",
    ],
    rujukan: ["gw-019"],
  },
  {
    id: "jembatan",
    tahun: 1992,
    label: "1978 sampai 1998",
    poros: "negara",
    judul: "Jembatan dan Wilayah Kerja",
    paragraf: [
      "Era B.J. Habibie, 1978 sampai 1998, membangun prasarana dan memindahkan kantor pusat Otorita ke Batam. Keppres 28/1992 memperluas wilayah kerja ke Rempang dan Galang.",
      "Enam jembatan Barelang dibangun 1992 sampai 1998, senilai Rp400 miliar. Bandara Hang Nadim, dengan landasan 4.025 meter, diresmikan 1995. Tahun mulai bandara itu berbeda antarsumber.",
    ],
    rujukan: ["gw-018", "gw-022", "gw-023", "gw-021"],
  },
  {
    id: "bertemu",
    tahun: 2019,
    label: "1999 sampai 2025",
    poros: "bersama",
    judul: "Dua Poros dalam Satu Jabatan",
    paragraf: [
      "UU 53/1999 menjadikan Batam kota otonom. UU 44/2007 dan PP 46/2007 menetapkannya kawasan perdagangan bebas untuk 70 tahun, dan Otorita berubah menjadi BP Batam.",
      "PP 62/2019 menjadikan Wali Kota ex-officio Kepala BP Batam. Sejak 20 Februari 2025 Amsakar Achmad dan Li Claudia Chandra memimpin Kota dan BP Batam sekaligus.",
    ],
    rujukan: ["gw-024", "gw-025", "gw-026", "gw-029"],
  },
  {
    id: "rempang-2023",
    tahun: 2023,
    label: "28 Agustus 2023",
    poros: null,
    judul: "Rempang Eco City",
    paragraf: [TEKS_REMPANG],
    rujukan: ["gw-t16"],
  },
];
