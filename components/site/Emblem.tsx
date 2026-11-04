import { MawarAnginGaris } from "@/components/site/MawarAngin";
import { SITE_NAME } from "@/lib/site";

// Emblem stempel bulat (research/05): lingkaran garis ganda seperti cap arsip, satu warna,
// mawar angin di tengah. Bukan perisai, tanpa motif lambang resmi.
export default function Emblem({ ukuran = 112 }: { ukuran?: number }) {
  return (
    <svg
      className="bch-emblem"
      viewBox="0 0 120 120"
      width={ukuran}
      height={ukuran}
      role="img"
      aria-label={`Emblem ${SITE_NAME}`}
    >
      <g fill="none" stroke="currentColor">
        <circle cx={60} cy={60} r={58.5} strokeWidth={1} />
        <circle cx={60} cy={60} r={55.5} strokeWidth={0.5} />
        <circle cx={60} cy={60} r={35} strokeWidth={0.5} />
      </g>
      <defs>
        <path id="emblem-lingkar" d="M60 60m-41.5 0a41.5 41.5 0 1 1 83 0a41.5 41.5 0 1 1-83 0" />
      </defs>
      <text fill="currentColor" fontFamily="var(--bch-font-serif)" fontSize={9.5} fontWeight={600}>
        <textPath href="#emblem-lingkar" textLength={254} lengthAdjust="spacing">
          BATAM CITY HALL · BALAI WARGA ·
        </textPath>
      </text>
      <g transform="translate(60 60)">
        <MawarAnginGaris r={28} />
      </g>
    </svg>
  );
}
