// Jaringan Peta Bus Trans Batam: simpul, ruas dengan halte, dan rantai simpul tiap koridor.
//
// Halte dari data/trans_batam/halte.json: daftar November 2026, dilengkapi Peta Bus Batam karya Farhan S.
// Fadhillah (akurat per 24 Oktober 2024, lisensi CC BY 4.0; halte itu bersumber_url s.id/TransitMapBTM). Bila
// keduanya berbeda, data November 2026 yang dipakai, misalnya K7 yang lewat bandara.
//
// Tata letak dan bentuk pulau mengikuti Peta Bus Batam yang sama, atas permintaan pemilik. Posisi x,y adalah
// posisi diagram, bukan koordinat halte.

import type { DefFeri, DefRuas, DefSimpul, Titik } from "./susun";

/** Koordinat di bawah dalam satuan PDF Peta Bus Batam (pt); kanvas = (x + 50, y - 95) x 1,5. */
export const KANVAS = { skala: 1.5, gx: 50, gy: -95 };

/** Pemecah baris label yang panjang ("|" = baris baru). Nama halte tidak diubah. */
export const PECAH: Record<string, string> = {
  "masjid-agung-sultan-riayat-syah": "Masjid|Agung|Sultan|Riayat|Syah",
  "tanjung-uncang-tp": "TP|Tanjung|Uncang",
  "kantor-camat-batam-kota": "Kantor Camat|Batam Kota",
};

export const SIMPUL: Record<string, DefSimpul> = {
  // Sekupang, Tiban, Batu Aji
  SKP: { x: 105, y: 600, halte: "tp-sekupang", pos: "nw", teks: "Sekupang", ikon: "pelabuhan", utama: true },
  JK4: { x: 185, y: 680, halte: "sei-harapan", pos: "sw" },
  JKT: { x: 200, y: 695 },
  UIBC: { x: 460, y: 695 },
  UIB: { x: 460, y: 650, halte: "uib", pos: "w" },
  BSC: { x: 283, y: 990, halte: "basecamp", pos: "e" },
  HDY: { x: 20, y: 990, halte: "hidayatullah", pos: "n", teks: "Hidaya-|tullah", utama: true },
  SGL: { x: 20, y: 1065, halte: "pelabuhan-sagulung", pos: "e", teks: "Pelabuhan|Sagulung", ikon: "pelabuhan", utama: true },
  TMB: { x: 547, y: 1033, halte: "simpang-tembesi", pos: "se" },
  // Nagoya, Jodoh, Batu Ampar
  NGY: { x: 460, y: 455, halte: "nagoya-hill", pos: "ne" },
  JDH: { x: 220, y: 455, halte: "tp-jodoh", pos: "w", teks: "Terminal Jodoh", utama: true },
  HBY: { x: 220, y: 414, halte: "harbourbay", pos: "e", teks: "Harbour Bay", ikon: "pelabuhan" },
  TGU: { x: 220, y: 585, halte: "tanjunguma", pos: "s" },
  GRM: { x: 450, y: 393, halte: "bengkong-garama", pos: "ne" },
  XK: { x: 460, y: 585 },
  PLB: { x: 557, y: 585, halte: "polsek-lubuk-baja", pos: "ne" },
  // Baloi sampai Batam Centre
  CSB: { x: 557, y: 650, halte: "casablanca", pos: "sw", jarak: 9 },
  RAF: { x: 630, y: 650, halte: "raflesia", pos: "s" },
  KWS: { x: 674, y: 650, halte: "kawasaki", pos: "s" },
  MDN: { x: 720, y: 604, halte: "bundaran-madani", pos: "n" },
  KDN: { x: 757, y: 641 },
  X2: { x: 850, y: 667 },
  X4: { x: 940, y: 667 },
  BC: { x: 870, y: 617, halte: "tp-batam-center", pos: "ne", jarak: 24, teks: "Batam Centre", ikon: "pelabuhan", utama: true },
  MSJ: { x: 850, y: 700, halte: "masjid-agung", pos: "e" },
  // Muka Kuning dan Piayu
  KPR: { x: 708, y: 872, halte: "kepri-mall", pos: "w" },
  PNB: { x: 635, y: 945, halte: "panbil", pos: "ne", teks: "Panbil" },
  PIA: { x: 827, y: 1137, halte: "tanjung-piayu-laut", pos: "s", teks: "Tanjung Piayu Laut", utama: true },
  // Kabil, Punggur, Nongsa
  KBL: { x: 1290, y: 900, halte: "kabil-raya", pos: "nw" },
  KBC: { x: 1380, y: 900 },
  PGR: { x: 1380, y: 1110, halte: "tp-punggur", pos: "e", teks: "Punggur", ikon: "pelabuhan", utama: true },
  JNB: { x: 1508, y: 413 },
  K7N: { x: 1360, y: 265 },
  SMB: { x: 1290, y: 265, halte: "kampung-sambau", pos: "s" },
  NGS: { x: 1360, y: 176, halte: "pelabuhan-nongsa", pos: "w", teks: "Pelabuhan Nongsa", ikon: "pelabuhan" },
  TMI: { x: 1430, y: 176, halte: "teluk-mata-ikan", pos: "e", teks: "Teluk|Mata Ikan", utama: true },
  SBD: { x: 1290, y: 631, halte: "simpang-bandara", pos: "w" },
  BDR: { x: 1340, y: 681, halte: "bandara-hang-nadim", pos: "e", teks: "Bandara|Hang Nadim", ikon: "bandara", utama: true },
  DTM: { x: 1133, y: 788, halte: "dotamana", pos: "e" },
};

export const RUAS: DefRuas[] = [
  // Sekupang
  {
    dari: "SKP",
    ke: "JK4",
    halte: ["taman-palapa", "telkom-sekupang", "shangrila", "lampu-merah-patam-lestari", "pci", "kartini"],
    label: "w",
  },
  { dari: "JK4", ke: "JKT", halte: [], label: "w" },
  {
    dari: "JKT",
    ke: "UIBC",
    halte: [
      "stc",
      "gor-sekupang",
      "mutiara-view+cipta-puri",
      "tiban-iii+tiban-raya",
      "taman-sari+tiban-mas",
      "tiban-center+mekar-sari",
      "tiban-ayu+tiban-kampung",
    ],
    label: ["n", "s", "n", "n", "n", "n", "n"],
  },
  { dari: "UIBC", ke: "UIB", halte: [], label: "w" },
  // K4 lewat pantai barat
  {
    dari: "JK4",
    ke: "BSC",
    lewat: [
      [185, 737],
      [82, 737],
      [121, 776],
      [199, 776],
      [230, 807],
      [183, 854],
      [283, 954],
    ],
    halte: [
      "sunbread",
      "sdn-008",
      "sman-24",
      "baitul-hikmah",
      "tanjung-riau",
      "subdit-agribisnis",
      "jambu-marina",
      "harris-resort",
      "marina-waterfront",
      "balai-pelatihan-kesehatan",
      "pratama-residence",
      "mitra-marina-mas",
      "jupiter",
      "permata-laguna",
      "prima-garden",
      "d-merlion-hotel",
      "smpn-47",
    ],
    perPotongan: [1, 3, 2, 0, 1, 3, 6, 1],
    label: ["e", "n", "s", "n", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "e"],
  },
  {
    dari: "BSC",
    ke: "HDY",
    halte: [
      "smpn-9-batam",
      "taman-carina",
      "jpo-pjb",
      "mts",
      "fanindo+top-100-regency",
      "tanjung-uncang-tp+tunas-b",
      "masjid-agung-sultan-riayat-syah+tunas",
    ],
    rentang: [0, 0.95],
    label: ["n", "s", "n", "s", "n", "n", "n"],
  },
  { dari: "HDY", ke: "SGL", halte: ["latrade"], label: "e" },
  // K2 Batu Aji
  {
    dari: "TMB",
    ke: "BSC",
    lewat: [[283, 1033]],
    halte: [
      "stm+villa-mukakuning",
      "jpo-plaza-sp+putri-tujuh",
      "pandawa+putri-hijau",
      "planet-futsal+kavling-baru",
      "puskopkar+buana-raya",
      "classic",
      "kavling-lama",
      "gor-batuaji",
    ],
    label: ["n", "n", "n", "n", "n", "s", "n", "w"],
  },
  {
    dari: "PNB",
    ke: "TMB",
    halte: ["batamindo", "rusun-muka-kuning", "cipta-buana", "tembesi-sayur", "top-100-batuaji", "sei-kasam"],
    label: ["w", "w", "w", "w", "w", "e"],
  },
  // K6 Piayu
  {
    dari: "PNB",
    ke: "PIA",
    halte: [
      "pintu-2-mukakuning",
      "pintu-3-mukakuning",
      "pintu-4-mukakuning",
      "bukit-sentosa",
      "nusa-indah",
      "bidadari",
      "smpn-16",
      "bidaayu-pintu",
      "bidaayu-pintu-3",
      "simpang-atb",
      "simpang-bagan",
      "pasar-pancur",
      "simpang-pancur",
      "smpn-40",
      "masjid-jami",
      "rhabayu-asri",
      "bukit-barelang",
      "oleana",
      "laguna",
      "kampung-jawa",
    ],
    label: ["e", "e", "e", "e", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
  },
  // Masjid Agung sampai Panbil
  {
    dari: "MSJ",
    ke: "KPR",
    lewat: [[850, 730]],
    halte: [
      "sekolah-global+centro-coffee",
      "politeknik",
      "amtek+simpang-frangky",
      "anggrek-sari",
      "simpang-kara",
      "plamo",
    ],
    label: ["w", "e", "w", "e", "e", "e"],
  },
  {
    dari: "KPR",
    ke: "PNB",
    halte: ["taman-niaga", "damkar-temenggung", "stadion-temenggung", "best-western-panbil"],
    label: "w",
  },
  // Nagoya dan Jodoh
  {
    dari: "UIB",
    ke: "NGY",
    halte: [
      "taman-kota",
      "pantai-permata",
      "baloi-mas",
      "grand-mall+penuin",
      "pantai-harapan+vihara",
      "harmoni-suites+windsor",
    ],
    label: "w",
  },
  {
    dari: "NGY",
    ke: "JDH",
    halte: ["bri-nagoya", "bank-mandiri", "dana-graha", "bpjs-ketenagakerjaan", "hotel-harmoni", "bri-jodoh+bca-jodoh"],
    label: ["n", "s", "s", "n", "s", "n"],
  },
  {
    dari: "JDH",
    ke: "TGU",
    halte: ["pacific-hotel", "top-100-jodoh+pasar-induk", "pasar-angkasa", "dc-mall+dc-mall-sw"],
    label: ["w", "e", "e", "e"],
  },
  { dari: "JDH", ke: "HBY", halte: ["rusun-lancang-kuning"], label: "w" },
  { dari: "HBY", ke: "GRM", lewat: [[220, 393]], halte: ["polsek-batu-ampar", "monte-siena"], label: ["n", "s"] },
  { dari: "GRM", ke: "RAF", lewat: [[630, 573]], halte: ["damkar-sei-panas", "bank-riau"], label: "e" },
  { dari: "TGU", ke: "XK", halte: ["oto-medika", "baloi-centre"], label: ["s", "n"] },
  { dari: "XK", ke: "PLB", halte: ["bcs-sdn-007", "baloi-persero"], label: ["n", "s"] },
  { dari: "PLB", ke: "CSB", halte: ["indomobil"], label: "e" },
  // Baloi sampai Batam Centre
  { dari: "UIB", ke: "CSB", halte: ["baloi-view"], label: "n" },
  { dari: "CSB", ke: "RAF", halte: ["rs-awal-bros", "orchid", "gelael"], label: ["n", "s", "n"] },
  { dari: "RAF", ke: "KWS", halte: [], label: "n", urutan: ["K5", "K1"] },
  { dari: "KWS", ke: "MDN", halte: ["royal-grande"], label: "w", urutan: ["K5", "K1"] },
  { dari: "MDN", ke: "KDN", halte: ["kadin"], label: "w", urutan: ["K5", "K1"] },
  { dari: "KDN", ke: "X2", lewat: [[783, 667]], halte: ["ikan-daun", "inko"], rentang: [0.3, 1], label: "s", urutan: ["K5", "K1", "K2"] },
  { dari: "X2", ke: "X4", halte: ["engku-putri", "imigrasi"], label: "n", urutan: ["K5", "K1", "K6"] },
  { dari: "X4", ke: "BC", lewat: [[940, 617]], halte: ["mega-mall"], perPotongan: [1, 0], label: "e", urutan: ["K5", "K1", "K6", "K7"] },
  { dari: "BC", ke: "KDN", lewat: [[781, 617]], halte: ["kantor-pos", "harmoni-one"], rentang: [0.25, 0.85], label: ["n", "s"], urutan: ["K2", "K1", "K5"] },
  { dari: "KDN", ke: "KWS", lewat: [[711, 687]], halte: ["green-land", "yos-sudarso"], label: ["e", "s"] },
  { dari: "X2", ke: "MSJ", halte: [], label: "e", urutan: ["K6", "K2"] },
  // K8 Baloi ke Kepri Mall
  {
    dari: "CSB",
    ke: "KPR",
    lewat: [
      [557, 713],
      [708, 864],
    ],
    halte: ["lapas-perempuan", "osella", "imperium", "sukajadi", "anggrek-mas", "kepri-mall-pintu-2"],
    label: ["w", "w", "e", "e", "e", "w"],
  },
  // K8 ke Kabil
  {
    dari: "KPR",
    ke: "KBL",
    lewat: [[736, 900]],
    halte: [
      "simpang-kepri",
      "dutamas",
      "legenda-malaka",
      "legenda-bali",
      "mega-legenda",
      "pasar-legenda",
      "mediterania-baru",
      "mediterania-lama",
      "simpang-kda",
      "cendana",
      "simpang-raya",
    ],
    label: "s",
  },
  { dari: "KBL", ke: "KBC", halte: ["kantor-camat-kabil+purna-yudha-indah"], label: "n" },
  {
    dari: "KBC",
    ke: "PGR",
    halte: [
      "simpang-ptk",
      "kaliban",
      "taman-jasinta+bumi-perkemahan",
      "pasar-top-one",
      "polsek-nongsa",
      "tunas-kabil",
      "tpa",
      "pltu-tanjung-kasam",
      "smpn-17",
      "labroy",
      "teluk-nipah",
    ],
    label: ["e", "e", "e", "e", "e", "e", "e", "e", "w", "e", "w"],
  },
  // K9 ke Batu Besar
  {
    dari: "KBL",
    ke: "JNB",
    lewat: [
      [1290, 870],
      [1600, 560],
      [1600, 505],
    ],
    halte: [
      "simpang-taiwan",
      "rusun-kabil",
      "kawasan-kabil",
      "rs-soedarsono",
      "sdn-010-nongsa",
      "kua-nongsa",
      "miftahul-hasanah",
      "pasar-tuah",
      "simpang-besar",
    ],
    label: "e",
  },
  {
    dari: "JNB",
    ke: "K7N",
    halte: ["al-munawaroh", "bri-batu-besar", "kampung-tengah", "kampung-mangga", "citra-mas", "bandoeng-resto", "polda-kepri"],
    label: ["e", "w", "e", "e", "e", "e", "e"],
  },
  { dari: "K7N", ke: "SMB", halte: [], label: "s" },
  { dari: "K7N", ke: "NGS", halte: ["turi-beach"], label: "e" },
  { dari: "NGS", ke: "TMI", halte: [], label: "s" },
  // K7 ke bandara dan Batam Centre
  {
    dari: "JNB",
    ke: "SBD",
    halte: ["simpang-ojek", "darul-falah", "pura-asri", "family-garden", "permata-bandara", "pasar-mtc"],
    label: "w",
  },
  { dari: "SBD", ke: "BDR", halte: [], label: "e" },
  { dari: "BDR", ke: "DTM", lewat: [[1240, 681]], halte: [], label: "e" },
  {
    dari: "DTM",
    ke: "X4",
    lewat: [
      [1133, 857],
      [963, 857],
      [940, 834],
    ],
    halte: [
      "hawai-garden",
      "bida-asri-2",
      "kapita-plaza",
      "botania-2",
      "uniba",
      "mustafa-plaza",
      "kantor-camat-batam-kota",
      "kda",
      "tunas-kda",
      "puri-legenda",
      "grand-mas",
      "purimas",
      "gedung-lam",
      "bpk-pgn",
    ],
    label: ["e", "e", "s", "n", "s", "n", "s", "n", "w", "e", "e", "e", "e", "e"],
  },
];

export const JALUR: Record<string, string[][]> = {
  K1: [
    ["SKP", "JK4", "JKT", "UIBC", "UIB", "CSB", "RAF", "KWS", "MDN", "KDN", "X2", "X4", "BC"],
    ["BC", "KDN", "KWS"],
  ],
  K2: [["BC", "KDN", "X2", "MSJ", "KPR", "PNB", "TMB", "BSC", "HDY"]],
  K3: [["SKP", "JK4", "JKT", "UIBC", "UIB", "NGY", "JDH", "TGU"]],
  K4: [["SGL", "HDY", "BSC", "JK4", "SKP"]],
  K5: [
    ["TGU", "JDH", "HBY", "GRM", "RAF", "KWS", "MDN", "KDN", "X2", "X4", "BC"],
    ["BC", "KDN"],
  ],
  K6: [["PIA", "PNB", "KPR", "MSJ", "X2", "X4", "BC"]],
  K7: [["TMI", "NGS", "K7N", "JNB", "SBD", "BDR", "DTM", "X4", "BC"]],
  K8: [["PGR", "KBC", "KBL", "KPR", "CSB", "PLB", "XK", "TGU", "JDH"]],
  K9: [["PGR", "KBC", "KBL", "JNB", "K7N", "SMB"]],
};

/** Feri: garis tipis ke laut, tidak menunjukkan lintasan. */
export const FERI: DefFeri[] = [
  { dari: "SKP", ke: [60, 560], teks: "ke Singapura", pos: "n" },
  { dari: "HBY", ke: [180, 414], teks: "ke Singapura", pos: "w" },
  { dari: "BC", ke: [870, 545], teks: "ke Singapura, Johor", pos: "n" },
  { dari: "NGS", ke: [1360, 110], teks: "ke Tanah Merah", pos: "e" },
  { dari: "PGR", ke: [1500, 1110], teks: "ke Tanjungpinang, Tanjung Uban", pos: "s" },
];

export const RENCANA = [
  {
    id: "K10",
    titik: [
      [547, 1033],
      [547, 1150],
    ] as Titik[],
    teks: "K10 rencana: Tembesi—Barelang/Galang",
    pos: "e" as const,
  },
];

/** Urutan koridor pada ruas berimpit, dari kiri ke kanan arah tempuh. */
export const URUTAN = ["K1", "K3", "K5", "K2", "K4", "K6", "K7", "K8", "K9"];
