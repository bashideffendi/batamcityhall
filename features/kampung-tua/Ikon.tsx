// Ikon garis untuk Loket 05. Warna mengikuti teks di sekitarnya, jadi cukup diatur lewat token.

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
