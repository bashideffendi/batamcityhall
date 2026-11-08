// Gambar dasar peta Hari Ini. Terpisah dari HariIni.tsx (komponen klien) supaya beranda di server bisa
// memuatnya lebih dulu: Hari Ini baru dirender di peramban, jadi tanpa ini gambarnya baru ditemukan belakangan.
export const BATAS_PONSEL = "(max-width: 700px)";
export const GAMBAR_DESKTOP = "/grafis/peta-hari-ini-dasar.webp";
export const GAMBAR_PONSEL = "/grafis/peta-hari-ini-ponsel-dasar.webp";
