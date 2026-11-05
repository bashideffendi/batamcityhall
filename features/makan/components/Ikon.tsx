// Ikon garis Makan: grid 24 px, goresan 1,25 px, tanpa isi (data/design/boleh_jangan.md). Menggantikan
// emoji kategori batam-bites. Semua dekoratif: arti selalu ada di teks di sebelahnya.
const IKON = {
  // Umum
  cari: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4",
  saring: "M3 6h18M6.5 12h11M10 18h4",
  tutup: "M6 6l12 12M18 6 6 18",
  hati: "M12 20s-7.2-4.4-9-9C1.8 7.9 3.8 5 6.7 5c2.2 0 4 1.3 5.3 3.2C13.3 6.3 15.1 5 17.3 5c2.9 0 4.9 2.9 3.7 6-1.8 4.6-9 9-9 9Z",
  peta: "m9 4-5.5 2v14l5.5-2 6 2 5.5-2V4L15 6 9 4Zm0 0v14m6-12v14",
  daftar: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  kiri: "M15 5l-7 7 7 7",
  kanan: "M9 5l7 7-7 7",
  navigasi: "M3 11 21 3l-8 18-2-8-8-2Z",
  bagikan: "M12 15V4m0 0L8 8m4-4 4 4M5 13v6.5h14V13",
  feri: "M4 15h16l-2 5H6l-2-5Zm3 0V9h10v6M12 9V4m-3 2h3M3 21.5c1.5 0 1.5-.8 3-.8s1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8 1.5-.8 3-.8 1.5.8 3 .8",
  lokasi: "M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  jam: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17ZM12 7v5l3.5 2",
  jalur:
    "M6 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm12-11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8.5 17.5H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5",
  telepon:
    "M6 3.5h3l1.5 5-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.7a2 2 0 0 1 2-2.2Z",
  tautan: "M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1.5-1.5",

  "makanan-sunda": "M4 18C4 10 10 5 20 5c0 9-6 15-14 15H4v-2Zm2 2L16 9",
  "makanan-sulawesi": "M3 12c3-4 7-6 11-6 3 0 5 2 7 6-2 4-4 6-7 6-4 0-8-2-11-6Zm0 0-1-4m1 4-1 4m14-5.5h.01",
  "lapo-batak": "M4 8h16v3a8 8 0 0 1-16 0V8Zm4 12h8M12 4v4M8 5v3m8-3v3",
  pempek: "M3 13c2-5 6-7 9-7s7 2 9 7c-2 3-6 5-9 5s-7-2-9-5Zm5-1h8",
  soto: "M3 11h18c0 5-4 9-9 9s-9-4-9-9Zm6-4c0-2 2-2 2-4m3 4c0-2 2-2 2-4",
  "chinese-food": "M4 11h16c0 5-3.5 8.5-8 8.5S4 16 4 11Zm3-7 6 7m3-7-2 7",
  "makanan-jepang": "M5 9a7 3 0 0 1 14 0v6a7 3 0 0 1-14 0V9Zm0 0a7 3 0 0 0 14 0m-7 0h.01",
  "makanan-korea": "M3 12h18c0 5-4 8.5-9 8.5S3 17 3 12Zm9-3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  "makanan-india": "M12 3c5 5 7 8.5 7 11.5a7 7 0 0 1-14 0C5 11.5 7 8 12 3Zm-3 12h6",
  "western-steak": "M7 3v7a2 2 0 0 0 2 2v9M5 3v5m4-5v5m7-5c2 1 3 4 3 8h-3v10",
  bakery: "M5 20V10a4 4 0 0 1 3-6.5h8A4 4 0 0 1 19 10v10H5Zm5-11v6m4-6v6",
  "ice-cream": "M7 10a5 5 0 1 1 10 0l-5 11-5-11Zm0 0h10",
  "sarapan-pagi": "M3 18h18M7 18a5 5 0 0 1 10 0M12 5v3M4.5 9.5l2 2m13-2-2 2",
  ayce: "M6.5 8.5a3.5 3.5 0 1 0 0 7c3.5 0 7.5-7 11-7a3.5 3.5 0 1 1 0 7c-3.5 0-7.5-7-11-7Z",
  vegetarian: "M5 19C5 10 11 4 20 4c0 9-6 15-14 15H5Zm0 0 9-9",
  // Tiap kategori punya ikon sendiri.
  "seafood":
    "M4 17C4 10.5 8.8 5.5 15 5.5c3 0 5 2 5 4.5s-2 4.5-4.5 4.5S12 13 12 11.5 13 9 14.5 9M4 17c2 2 5 3 8 3 4 0 7-1.8 8-5",
  "sop-ikan": "M3 12h18c0 4.5-3.5 8.5-9 8.5S3 16.5 3 12ZM6 8c2-3 4.5-4 7-4 2 0 3.5 1 4.5 2.5L20 5v6l-2.5-1.5",
  "mie-tarempa": "M3 12h18c0 4.5-3.5 8.5-9 8.5S3 16.5 3 12Zm8 0L18 3m-4 9 6.5-7M6.5 12c0-2 1.5-2 1.5-4M10 9.5V8",
  "nasi-ayam-hainan":
    "M13.5 14.8 8.8 19.5a2 2 0 1 1-2.8-.5 2 2 0 1 1-.5-2.8l4.7-4.7c-1-3 .4-6 3.1-7.3 3.4-1.6 7 .7 7.3 4.1.3 3.6-2.1 5.9-4.1 6.7-1 .4-1.8.5-2.5.5",
  kopitiam:
    "M4 10h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-5Zm13 1.5h1.5a2.5 2.5 0 0 1 0 5H17M8 3.5c-1 1.5 1 2 0 3.5m4.5-3.5c-1 1.5 1 2 0 3.5",
  "martabak-prata": "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM7.5 12 12 7.5l4.5 4.5-4.5 4.5L7.5 12Zm2.5 0h4",
  "nasi-mie-goreng":
    "M6 3v7a2.5 2.5 0 0 0 5 0V3M8.5 3v18M14.5 6c2 0 2 2.5 5 2.5M14.5 11c2 0 2 2.5 5 2.5M14.5 16c2 0 2 2.5 5 2.5",
  bubur: "M3 11h18c0 5-3.5 9.5-9 9.5S3 16 3 11Zm11 0c0-3 1.8-6 4.5-8M7 14.5c1.5 1 3 1 4.5.5",
  "makanan-padang":
    "M3 16h18c0 2.5-2 4.5-4.5 4.5h-9C5 20.5 3 18.5 3 16Zm2.5 0a6.5 6.5 0 0 1 13 0M9 12.5h.01M12 10.5h.01M15 12.5h.01",
  "makanan-jawa": "M12 3 5.5 16h13L12 3Zm-9 13h18c0 2.5-2 4.5-4.5 4.5h-9C5 20.5 3 18.5 3 16Zm6.5-5h5",
  "sate": "M3.5 20.5 21 3M7 13l4 4-2 2-4-4 2-2Zm4-4 4 4-2 2-4-4 2-2Zm4-4 4 4-2 2-4-4 2-2Z",
  "bakso-mie-ayam":
    "M3 12h18c0 4.5-3.5 8.5-9 8.5S3 16.5 3 12Zm5.5-3a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  "dimsum": "M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6Zm0 4h16M5 11c1-4 4-6.5 7-6.5S18 7 19 11M12 4.5V3",
  "penyetan":
    "M5 19.5c6.5 1 12-2.5 14-9.5.4-1.6-.4-3-2-3.2-1.6-.2-2.6.8-3 2-1 3-4 6-9 7.6-1.2.4-1 2.9 0 3.1ZM17 6.8c0-1.5.5-2.6 2-3.3",
  "gado-pecel": "M5 19C5 10.5 11 4.5 20 4.5 20 13 14 19 5.5 19H5Zm0 0 9-9m-5 1v4m3-6.5V11.5",
  "kue-jajanan":
    "M4 9h16v3.5H4V9Zm1.5 3.5v8h13v-8M12 9v11.5M12 9C10.5 4.5 6 3.8 6 6.5 6 8 8.5 9 12 9Zm0 0c1.5-4.5 6-5.2 6-2.5C18 8 15.5 9 12 9Z",
  "coffee-shop": "M6.5 8h11l-1.3 12.5H7.8L6.5 8ZM5 8h14V5.5H5V8Zm4-2.5L9.5 3h5l.5 2.5M7 13h10",
} as const;

export type NamaIkon = keyof typeof IKON;

const adaIkon = (n: string): n is NamaIkon => Object.hasOwn(IKON, n);

/** Ikon garis. Id kategori yang tidak dikenal memakai ikon peta supaya tidak pernah kosong. */
export default function Ikon({ nama, ukuran = 20 }: { nama: string; ukuran?: number }) {
  return (
    <svg
      className="mk-ikon"
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={IKON[adaIkon(nama) ? nama : "peta"]} />
    </svg>
  );
}
