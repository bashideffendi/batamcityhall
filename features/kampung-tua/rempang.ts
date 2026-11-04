// Kronologi Rempang dari research/03 (Topik Sensitif) dan research/04 bagian 4. Ini draf: pemilik proyek belum
// meninjaunya. Tiap butir bertanggal dan beratribusi, tanpa komentar redaksi.
// Sengaja tidak dimuat: luas lahan versi mana pun, status sertifikat (SHM), dan nilai investasi yang belum bertanggal.
// Sumber tanpa url berarti riset menyebut medianya tanpa mencatat tautan; kami tidak menebak alamatnya.
export type Pihak = "pemerintah" | "ombudsman" | "warga" | "media";

export const LABEL_PIHAK: Record<Pihak, string> = {
  pemerintah: "Pemerintah atau BP Batam",
  ombudsman: "Ombudsman",
  warga: "Warga atau Walhi",
  media: "Laporan media",
};

export type ButirRempang = {
  tanggal: string;
  pihak: Pihak;
  teks: string;
  sumber: { label: string; url?: string }[];
};

const BISNIS_2023 = {
  label: "Bisnis",
  url: "https://sumatra.bisnis.com/read/20230907/533/1692638/polemik-proyek-eco-city-aparat-bentrok-dengan-warga-rempang-di-jembatan-iv-barelang",
};
const MONGABAY_2023 = {
  label: "Mongabay",
  url: "https://mongabay.co.id/2023/09/11/kala-proyek-rempang-eco-city-melaju-warga-menolak-berhadapan-dengan-aparat/",
};

export const KRONOLOGI_REMPANG: ButirRempang[] = [
  {
    tanggal: "Agustus–September 2023",
    pihak: "pemerintah",
    teks: "Pemerintah mengumumkan Rempang Eco-City, kerja sama BP Batam dan PT Makmur Elok Graha, berstatus Proyek Strategis Nasional.",
    sumber: [
      { label: "Tirto", url: "https://tirto.id/apa-itu-rempang-eco-city-yang-jadi-pemicu-bentrok-warga-aparat-gPSy" },
    ],
  },
  {
    tanggal: "28 Agustus 2023",
    pihak: "pemerintah",
    teks: "Permenko Perekonomian No. 7/2023 menetapkannya sebagai Proyek Strategis Nasional.",
    sumber: [
      { label: "Tirto", url: "https://tirto.id/apa-itu-rempang-eco-city-yang-jadi-pemicu-bentrok-warga-aparat-gPSy" },
    ],
  },
  {
    tanggal: "7 September 2023",
    pihak: "media",
    teks: "Mongabay dan Bisnis melaporkan bentrok aparat gabungan dengan warga di Jembatan IV Barelang, termasuk gas air mata yang mengenai murid sekolah.",
    sumber: [MONGABAY_2023, BISNIS_2023],
  },
  {
    tanggal: "September 2023",
    pihak: "media",
    teks: "Tempo melaporkan 43 warga ditetapkan tersangka terkait kericuhan 7 dan 11 September 2023.",
    sumber: [{ label: "Tempo" }],
  },
  {
    tanggal: "13 September 2023",
    pihak: "warga",
    teks: 'Koordinator Riset Walhi Riau, Umi Ma\'rufah, menyebut "perlawanan masyarakat di 16 Kampung Melayu Tua di Rempang Galang".',
    sumber: [{ label: "Walhi Riau" }],
  },
  {
    tanggal: "Januari 2024",
    pihak: "ombudsman",
    teks: 'Ombudsman RI, dari investigasi September 2023 sampai Januari 2024, menemukan malaadministrasi, antara lain pemerintah "belum mengakui keberadaan kampung tua di Rempang". Ombudsman juga mencatat warga 10 kampung mendukung investasi tetapi menolak relokasi.',
    sumber: [
      {
        label: "Kompas.id",
        url: "https://www.kompas.id/baca/nusantara/2024/01/29/ombudsman-ri-kampung-tua-rempang-harus-dihormati-dan-dilindungi",
      },
    ],
  },
  {
    tanggal: "10 Februari 2025",
    pihak: "pemerintah",
    teks: "Perpres 12/2025 (RPJMN 2025–2029) tidak mencantumkan Rempang Eco-City di daftar 77 Proyek Strategis Nasional. Ketua Komisi VI DPR membenarkannya pada 28 April 2025.",
    sumber: [
      {
        label: "Tempo",
        url: "https://www.tempo.co/ekonomi/dpr-buktikan-proyek-rempang-eco-city-tak-masuk-daftar-77-psn-prabowo-1284270",
      },
    ],
  },
  {
    tanggal: "27 Februari 2025",
    pihak: "media",
    teks: 'Tempo menulis "setidaknya terdapat 60 kepala keluarga" sudah pindah ke Tanjung Banon.',
    sumber: [{ label: "Tempo" }],
  },
  {
    tanggal: "Maret 2025",
    pihak: "pemerintah",
    teks: "BP Batam (Ariastuty Sirait) menyatakan proyek ini masih ada di Lampiran IV Perpres 12/2025, bagian arah pembangunan kewilayahan.",
    sumber: [
      {
        label: "Tempo",
        url: "https://www.tempo.co/ekonomi/dpr-buktikan-proyek-rempang-eco-city-tak-masuk-daftar-77-psn-prabowo-1284270",
      },
    ],
  },
  {
    tanggal: "20 Juli 2025",
    pihak: "pemerintah",
    teks: "Menurut BP Batam via Bisnis, 125 KK atau 436 jiwa menempati hunian di Tanjung Banon.",
    sumber: [
      {
        label: "Bisnis",
        url: "https://sumatra.bisnis.com/read/20250721/533/1894791/update-proyek-rempang-eco-city-436-warga-tempati-tanjung-banon",
      },
    ],
  },
  {
    tanggal: "September 2025",
    pihak: "pemerintah",
    teks: "Menurut Kompas, Menteri Transmigrasi meminta maaf kepada warga dan berjanji tidak ada penggusuran paksa.",
    sumber: [
      {
        label: "Kompas",
        url: "https://www.kompas.com/properti/read/2025/09/29/130000221/warga-rempang-dipindahkan-ke-tanjung-banon-dapat-ganti-rugi-apa-saja-",
      },
    ],
  },
  {
    tanggal: "September 2025",
    pihak: "media",
    teks: "Tempo melaporkan konflik baru soal penetapan Taman Buru di Sungai Raya.",
    sumber: [{ label: "Tempo" }],
  },
  {
    tanggal: "12 Mei 2026",
    pihak: "pemerintah",
    teks: 'Ketik.com mengutip Deputi Pelayanan Umum BP Batam Ariastuty Sirait: total penghuni Tanjung Banon "kini mencapai 242 KK atau sebanyak 842 jiwa".',
    sumber: [{ label: "Ketik.com" }],
  },
  {
    tanggal: "15 Juni 2026",
    pihak: "warga",
    teks: "Walhi Riau dan LBH Pekanbaru mengecam pematokan di Pantai Melayu untuk Sekolah Merah Putih. Tanggapan BP Batam soal ini belum kami peroleh.",
    sumber: [
      {
        label: "Wanaloka",
        url: "https://wanaloka.com/usai-proyek-eco-city-pulau-rempang-dipatok-sepihak-untuk-sekolah-merah-putih/",
      },
    ],
  },
];

/** Pernyataan yang tercatat di riset tanpa tanggal pasti. Dipisah, bukan diberi tanggal kira-kira. */
export const TANPA_TANGGAL: ButirRempang[] = [
  {
    tanggal: "Tanggal belum tercatat",
    pihak: "pemerintah",
    teks: 'Kepala BP Batam saat itu, Muhammad Rudi, menyatakan "hanya ada 3 kampung": Sembulang Hulu, Sembulang Tanjung, Pasir Panjang. BP Batam di kesempatan lain menyebut empat kampung.',
    sumber: [{ label: "BP Batam" }],
  },
  {
    tanggal: "Tanggal belum tercatat",
    pihak: "ombudsman",
    teks: 'Lagat Parroha Patar Siadari dari Ombudsman Perwakilan Kepri, dikutip Kompas.id, menyebut "lebih dari 70 persen warga di lima kampung menolak relokasi atau penggeseran".',
    sumber: [{ label: "Kompas.id" }],
  },
  {
    tanggal: "Tanggal belum tercatat",
    pihak: "warga",
    teks: 'Eko Yunanda dari Walhi Riau, mengutip kajian Kronik PSN Rempang Eco-City (via Betahita): "hanya 20% masyarakat di lima kampung tua" yang menerima relokasi, yaitu Sembulang Pasir Merah, Sembulang Hulu, Sembulang Tanjung, Pasir Panjang, dan Belongkeng.',
    sumber: [
      {
        label: "Kajian Walhi Riau",
        url: "https://www.walhiriau.or.id/wp-content/uploads/2024/07/Kronik-PSN-Rempang-Eco-City-Kontroversi-Investasi-Tiongkok-dan-resistensi-Masyarakat-Rempang-FINAL-1.pdf",
      },
    ],
  },
];
