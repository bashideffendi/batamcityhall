// Ikon garis untuk Loket 05. Warna mengikuti teks di sekitarnya, jadi cukup diatur lewat token.

/** Gapura kampung: dua tiang, atap lengkung, garis halus. */
export function IkonGapura({ ukuran = 20 }: { ukuran?: number }) {
  return (
    <svg
      className="kt-ikon"
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
      <path d="M3 8.5C7 8 9.5 6.5 12 3.5c2.5 3 5 4.5 9 5" />
      <path d="M6 8v12.5M18 8v12.5M3.5 20.5h5M15.5 20.5h5M6 12h12" />
    </svg>
  );
}

/** Bintang empat garis untuk cerita rakyat dan hikayat. Bukan emoji (research/05). */
export function IkonCeritaRakyat({ ukuran = 14 }: { ukuran?: number }) {
  return (
    <svg
      className="kt-ikon"
      data-ikon="cerita-rakyat"
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.5c1 6 3.5 8.5 9.5 9.5-6 1-8.5 3.5-9.5 9.5-1-6-3.5-8.5-9.5-9.5 6-1 8.5-3.5 9.5-9.5Z" />
    </svg>
  );
}

/** Contoh penanda perkiraan di legenda dan daftar: lingkaran berongga, tidak pernah terisi. */
export function IkonPerkiraan({ ukuran = 16 }: { ukuran?: number }) {
  return (
    <svg
      className="kt-ikon"
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}
