/** Logo Instagram garis, mengikuti warna teks. */
export function IkonInstagram({ ukuran = 18 }: { ukuran?: number }) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      focusable="false"
      className="bch-ig-ikon"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Akun Instagram tampil sebagai logo dan nama akun, tanpa kata "Instagram". Pembaca layar tetap mendengarnya. */
export default function TautanInstagram({ akun, href }: { akun: string; href?: string }) {
  const nama = akun.replace(/^@/, "");
  return (
    <a
      href={href ?? `https://www.instagram.com/${nama}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="bch-ig"
      aria-label={`Instagram @${nama}`}
    >
      <IkonInstagram />
      <span>@{nama}</span>
    </a>
  );
}
