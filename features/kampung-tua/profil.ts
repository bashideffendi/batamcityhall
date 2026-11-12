// Profil panjang 12 kampung paling terdokumentasi, dari research/04 bagian 3. Tiap butir punya label sendiri.
// Sengaja dikeluarkan: topik lahan (Tanjung Uma, Tanjung Riau, Teluk Mata Ikan), nama narasumber yang tidak perlu,
// dan alamat rumah pribadi. Konteks Rempang diarahkan ke halaman bertanggal.
export type LabelButir = "terverifikasi" | "sumber_tunggal" | "cerita_rakyat" | "perlu_cek_ulang" | "beda_versi";

export type ButirProfil = { teks: string; label?: LabelButir; sumber?: string };

export type Profil = { judul: string; kampung: string[]; butir: ButirProfil[] };

const DISBUD = "https://disbud.kepriprov.go.id";
const ANTARA_OPINI = "https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam";
const BLOG_YULIA = "https://www.yuliamarza.com/2016/08/mengenal-sejarah-kampung-tua-yang-ada.html";
const STPN =
  "http://repository.stpn.ac.id/133/1/3%20menata%20tanah%20kota%20batam%20jalan%20penyelesaian%20penguasaan%20tanah%20kampung%20tua.pdf";
const KRONOLOGI_UNP = "http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564";
const BPNB_BATU_BESAR = "https://kebudayaan.kemdikbud.go.id/bpnbkepri/meneroka-batu-besar-di-batam/";
const DETIK_LIMAS =
  "https://www.detik.com/sumut/berita/d-8088809/cagar-budaya-rumah-limas-potong-batam-memprihatinkan-ini-kata-disparbud";
const SWARAKEPRI = "https://swarakepri.com/sejarah-kampung-sembulang-pulau-rempang/";

export const PROFIL: Profil[] = [
  {
    judul: "Kampung Asal Hari Jadi Batam",
    kampung: ["kt-nongsa-pantai"],
    butir: [
      {
        teks: "Raja Isa bin Raja Ali (Nong Isa) adalah putra Yang Dipertuan Muda Riau V. Sultan Abdulrahman Syah dan YDM Riau VI Raja Jakfar memberinya mandat memegang perintah atas Nongsa dan rantau sekitarnya. Mandat itu bertanggal 22 Jumadil Akhir 1245 H atau 18 Desember 1829.",
        label: "terverifikasi",
        sumber: `${DISBUD}/asal-usul-nama-kampung-tua-nongsa/`,
      },
      {
        teks: "Tanggal itu dijadikan Hari Jadi Kota Batam lewat Perda No. 4/2009. Nama Nongsa berasal dari Nong Isa.",
        label: "terverifikasi",
        sumber: `${DISBUD}/asal-usul-nama-kampung-tua-nongsa/`,
      },
      {
        teks: '"Kampong Nongsa" tercatat di peta Belanda 1847 (KITLV Leiden), menurut jurnal Kronologi UNP 2025.',
        label: "terverifikasi",
        sumber: KRONOLOGI_UNP,
      },
      {
        teks: 'Tahun wafat masih diperdebatkan. Sejumlah media menyebut 1831, sedangkan catatan Belanda 1833 yang dikutip sejarawan Aswandi Syahri menyebut ia "berusia sekitar 50 tahun" pada 1833. Makam Nong Isa sendiri belum diketahui. Yang ada di Nongsa adalah makam zuriatnya.',
        label: "beda_versi",
      },
      {
        teks: "Kompleks Makam Zuriat Raja Isa ada di atas bukit kecil (59 anak tangga menurut satu laporan), cagar budaya lewat SK Wali Kota No. 483/2022.",
        label: "sumber_tunggal",
        sumber:
          "https://kepri.antaranews.com/berita/149763/pemkot-batam-tetapkan-empat-peninggalan-sejarah-jadi-cagar-budaya",
      },
      {
        teks: "Tradisi yang disebut Ketua Kampung Tua Nongsa Pantai dalam wawancara di jurnal Kronologi: tepuk tepung tawar, kenduri arwah atau haul jama', mandi Safar, bubur Asyura, khatam Al-Qur'an.",
        label: "sumber_tunggal",
        sumber: KRONOLOGI_UNP,
      },
    ],
  },
  {
    judul: "Dari “Lagorap” ke Kopra",
    kampung: ["kt-batu-besar", "kt-kampung-melayu-batu-besar"],
    butir: [
      {
        teks: "Nama Batu Besar berasal dari sebuah batu besar dekat bibir pantai. Nama lamanya Labong Gorap, dari kerang kecil di tepi pantai.",
        label: "terverifikasi",
        sumber: BPNB_BATU_BESAR,
      },
      {
        teks: "Penghuni awal menurut Balai Pelestarian Nilai Budaya Kepri, sebagian dari tutur lisan: M. Akib dari Malaka pada akhir abad ke-19, pendatang Tionghoa sejak sekitar 1870, lalu orang Melayu dan Bugis. Kampung ini penghasil kopra yang dijual ke Singapura.",
        label: "cerita_rakyat",
        sumber: BPNB_BATU_BESAR,
      },
      {
        teks: "Sekolah Rakyat pertama 1957 disebut blog dan GoWest. GoWest juga menyebut SD 001 Nongsa sebagai yang tertua.",
        label: "perlu_cek_ulang",
        sumber: "https://gowest.id/batu-besar-lagorap-penghasil-kopra-di-lintasan-waktu/",
      },
      {
        teks: "Rumah Limas Potong dibangun keluarga Haji Muhammad Sain dan berdiri sejak 1959. Ditetapkan cagar budaya lewat SK 483/2022.",
        label: "terverifikasi",
        sumber: DETIK_LIMAS,
      },
      {
        teks: 'Kadisbudpar Ardiwinata (Agustus 2025) menyebut kondisinya "memprihatinkan". Sumber berbeda soal bentuknya: ada yang menyebut rumah panggung kayu, ada kutipan keluarga yang menyebut "bukan rumah panggung".',
        label: "beda_versi",
        sumber: "https://gowest.id/kondisi-rumah-haji-sain-yang-dijadikan-cagar-budaya-memprihatinkan/",
      },
      {
        teks: "Ini rumah pribadi. Jangan masuk tanpa izin keluarga.",
      },
    ],
  },
  {
    judul: "Kampung Legenda",
    kampung: ["kt-tanjung-bemban"],
    butir: [
      {
        teks: 'Asal nama dari pohon "beremban" atau bemban, menurut Dinas Kebudayaan Kepri.',
        label: "terverifikasi",
        sumber: `${DISBUD}/tanjung-bemban/`,
      },
      {
        teks: "Menurut Sejarah Melayu, Sang Nila Utama atau Sri Tri Buana pernah berburu pelanduk di sini. Ini teks hikayat, bukan bukti arkeologis.",
        label: "cerita_rakyat",
        sumber: `${DISBUD}/tanjung-bemban/`,
      },
      {
        teks: 'Kisah anak durhaka yang dikutuk jadi batu "Malang Orang", di tepi pantai antara Jabi dan Tanjung Buton.',
        label: "cerita_rakyat",
        sumber: `${DISBUD}/tanjung-bemban/`,
      },
      {
        teks: "Setelah kemerdekaan, banyak warga pindah ke Batu Besar.",
        label: "terverifikasi",
        sumber: `${DISBUD}/tanjung-bemban/`,
      },
    ],
  },
  {
    judul: "Tanah Bertuah di Depan Jodoh",
    kampung: ["kt-tanjung-uma"],
    butir: [
      {
        teks: 'Tiga versi asal nama. Dinas Kebudayaan Kepri, mengutip buku Nong Isa, Tonggak Awal Pemerintahan Batam: "uma" berarti rumah, merujuk rumah panggung di antara Tanjung Pangkal Lepu dan Tanjung Kubur. Versi lain: dari kata Inggris "home". Versi Antara: dari kerang "tuma".',
        label: "beda_versi",
        sumber: `${DISBUD}/tanjung-uma/`,
      },
      {
        teks: "Penghuni awal orang Melayu dan Bugis dari keluarga diraja Riau-Lingga, hidup sebagai nelayan dan pekebun kelapa.",
        label: "terverifikasi",
        sumber: `${DISBUD}/tanjung-uma/`,
      },
      {
        teks: 'Di Bukit Kubur ada makam yang "diperkirakan berusia ratusan tahun". Di sini warga menggelar tradisi jejak tanah bagi bayi.',
        label: "terverifikasi",
        sumber: `${DISBUD}/tanjung-uma/`,
      },
      {
        teks: "Makam di samping Masjid Baitussyakur disebut makam saudara Habib Nuh (Singapura).",
        label: "cerita_rakyat",
        sumber: `${DISBUD}/tanjung-uma/`,
      },
      {
        teks: "Pantun lokal: Pokok kurma di bawah lembah / Tanam senduduk bercabang due / Tanjung ume tanah bertuah / Semoge kekal selame-lamenye.",
        label: "cerita_rakyat",
      },
    ],
  },
  {
    judul: "Pelantar yang Jadi Ruang Publik",
    kampung: ["kt-tanjung-riau"],
    butir: [
      {
        teks: 'Tempat persinggahan raja-raja Johor, Riau, Lingga, hingga Indragiri, dengan banyak "Perigi Raja", menurut tutur tokoh masyarakat via KKN Undip.',
        label: "cerita_rakyat",
        sumber: "https://kkn.undip.ac.id/?p=324467",
      },
      {
        teks: "Proyek percontohan Kotaku Kementerian PUPR: pelantar lingkar, plaza, taman atas laut, gapura. Dananya Rp15 miliar APBN dan Rp1,562 miliar APBD, ditargetkan selesai Juni 2021.",
        label: "terverifikasi",
        sumber: "https://kepri.bpk.go.id/taman-atas-laut-tanjungriau-selesai-ikon-baru-wisata-batam/",
      },
      {
        teks: "Rumah panggung Melayu pesisir di atas air. Kolong rumahnya dipakai untuk kebutuhan ekonomi, menurut jurnal arsitektur UIB.",
        label: "terverifikasi",
        sumber: "https://journal.uib.ac.id/index.php/jad/article/download/5952/2166/9353",
      },
      {
        teks: "Dari lampu merah Sekupang, ambil arah Sungai Harapan. Sore hari bisa melihat matahari terbenam, lalu lintas kapal, dan galangan.",
        label: "sumber_tunggal",
      },
    ],
  },
  {
    judul: "Masjid Tua dan Makam Tetua",
    kampung: ["kt-bagan"],
    butir: [
      {
        teks: "Satu dari tiga kampung tua di Kelurahan Tanjung Piayu menurut BKKBN, bersama Piayu Laut dan Setengar.",
        label: "sumber_tunggal",
        sumber: "https://kampungkb.bkkbn.go.id/kampung/1798/kampung-kb-tanjung-piayu",
      },
      {
        teks: '"Tanjung Bagan" berarti tanjung tempat "bebagan" atau berkemah saat membuka hutan untuk kebun.',
        label: "sumber_tunggal",
        sumber: BLOG_YULIA,
      },
      {
        teks: "Blog yang sama menyebut kampung ini dibuka 1879 oleh Nong Isa. Tahun itu tidak cocok dengan masa hidup Nong Isa.",
        label: "perlu_cek_ulang",
        sumber: BLOG_YULIA,
      },
      {
        teks: 'Tim STPN 2016 mencatat makam keluarga tetua adat Raja Mahmud. Keterangan fotonya menulis "Raja Muhammad". Tim yang sama mencatat kompleks makam warga, pohon kelapa berumur lebih dari 80 tahun, dan tugu kampung tua.',
        label: "terverifikasi",
        sumber: STPN,
      },
      {
        teks: 'Masjid tua At Taubah, menurut cerita berdiri di lahan tempat "bebagan". Sebuah blog juga menyebutnya markas KKO pada 1965.',
        label: "perlu_cek_ulang",
        sumber: BLOG_YULIA,
      },
    ],
  },
  {
    judul: "Ujung Selatan, Wisata Kuliner Laut",
    kampung: ["kt-tanjung-piayu-laut"],
    butir: [
      {
        teks: 'Jurnal Historia UNRIKA meneliti perubahan sosial-ekonomi warga setelah tumbuhnya wisata kuliner (2010–2022). Kampung pesisir berumah kayu ini disebut "masih teguh memegang adat budaya leluhur".',
        label: "terverifikasi",
        sumber: "https://www.journal.unrika.ac.id/index.php/journalhistoria/article/download/5487/3607/",
      },
      {
        teks: "Cerita jalur penyamaran Sultan Sulaiman.",
        label: "cerita_rakyat",
      },
      {
        teks: "BP Batam merencanakan jaringan pipa air baru ke sini (Batam Pos, 2025).",
        label: "sumber_tunggal",
      },
    ],
  },
  {
    judul: "Pantai Kelapa di Nongsa",
    kampung: ["kt-teluk-mata-ikan"],
    butir: [
      {
        teks: "Gapura kuning bergaya Melayu, pantai pasir putih, deretan kelapa, menurut Batamnews.",
        label: "sumber_tunggal",
        sumber:
          "https://www.batamnews.co.id/berita-98675-menikmati-suasana-kampung-tua-batam-yang-alami-dan-kental-budaya-melayu.html",
      },
    ],
  },
  {
    judul: "Nama dari Panau",
    kampung: ["kt-panau"],
    butir: [
      {
        teks: "Penghuni pertamanya disebut sepasang suami istri, dan nama kampung ini dikaitkan dengan penyakit kulit panau sang istri.",
        label: "cerita_rakyat",
        sumber: ANTARA_OPINI,
      },
      {
        teks: "Penduduk bertambah pada 1949–1953 dengan pendatang Bugis, Buton, dan Flores di samping Melayu. Sumbernya artikel opini di Antara yang ditulis pejabat KPPN, bukan sejarawan.",
        label: "sumber_tunggal",
        sumber: ANTARA_OPINI,
      },
    ],
  },
  {
    judul: "Melcem",
    kampung: ["kt-batu-merah", "kt-sei-tering"],
    butir: [
      {
        teks: "Tahun 1949 masih kampung nelayan kecil dengan kelong milik orang Tionghoa. Sekitar 1960-an, muara sungai dihuni orang Tionghoa dan hulunya orang Jawa. Kawasan ini dikenal sebagai Melcem.",
        label: "cerita_rakyat",
        sumber: ANTARA_OPINI,
      },
      {
        teks: 'Batu Merah dibuka orang Bugis, Daeng Tambak, lalu diteruskan Pak Merah, seorang pengumpul batu. Dari namanya muncul "Batu Merah", dan kawasan ramai pada 1976.',
        label: "cerita_rakyat",
        sumber: ANTARA_OPINI,
      },
      {
        teks: "Semua ini cerita lokal dari artikel opini.",
        label: "perlu_cek_ulang",
      },
    ],
  },
  {
    judul: "Pusat Temenggung",
    kampung: ["hl-bulang-lintang"],
    butir: [
      {
        teks: 'Pulau Bulang menjadi "markas besar" keluarga Temenggung Riau-Johor sejak 1722. Tun Abdul Jamal (lahir sekitar 1720) bergelar Temenggung sejak 1757 dan wafat sekitar 1802. Ayahnya, Bendahara Tun Abbas, juga dimakamkan di sini (Trocki, via Dinas Kebudayaan Kepri).',
        label: "terverifikasi",
        sumber: `${DISBUD}/kompleks-makam-temenggung-abdul-jamal/`,
      },
      {
        teks: "Kompleks makam adalah cagar budaya SK 483/2022, bersama makam istrinya, Raja Maimunah. Ada juga masjid.",
        label: "terverifikasi",
        sumber: `${DISBUD}/kompleks-makam-temenggung-abdul-jamal/`,
      },
      {
        teks: "Benda pusaka (tombak, tongkat, keris) ada di rumah ahli waris dan hanya bisa dilihat atas izin.",
        label: "sumber_tunggal",
        sumber: "https://mediacenter.batam.go.id/2022/03/01/ardi-dan-asppi-napak-tilas-amir-pulau-buluh/",
      },
      {
        teks: "Namanya diabadikan sebagai Stadion Temenggung Abdul Jamal. Antara (2014) mencatat minimnya informasi tertulis di lokasi.",
        label: "sumber_tunggal",
      },
    ],
  },
  {
    judul: "Sembulang",
    kampung: ["rg-sembulang"],
    butir: [
      {
        teks: "Gabungan kampung kecil: Sembulang Hulu, Tanjung Gemuk, Air Lingseng, Sembulang Tanjung, Pasir Merah, Dapur Enam, Tanjung Banon, dan lainnya.",
        label: "sumber_tunggal",
        sumber: SWARAKEPRI,
      },
      {
        teks: "Tokoh pembuka yang disebut antara lain Muse dan Langking. Nipis, istri Langking, wafat 1958 dan dimakamkan di pemakaman umum Al Fajri. Ini tulisan warga.",
        label: "cerita_rakyat",
        sumber: SWARAKEPRI,
      },
    ],
  },
];

export const profilUntuk = (id: string) => PROFIL.find((p) => p.kampung.includes(id)) ?? null;

// Label status satu per butir (pedoman 3.7). Sumber tunggal dan yang belum dipastikan sama-sama belum terverifikasi.
export const LABEL_BUTIR: Record<LabelButir, { teks: string; nada: "ok" | "caution" | "info" }> = {
  terverifikasi: { teks: "Tercatat", nada: "ok" },
  sumber_tunggal: { teks: "Belum Terverifikasi", nada: "caution" },
  cerita_rakyat: { teks: "Cerita Rakyat", nada: "info" },
  perlu_cek_ulang: { teks: "Belum Terverifikasi", nada: "caution" },
  beda_versi: { teks: "Berbeda Versi", nada: "caution" },
};
