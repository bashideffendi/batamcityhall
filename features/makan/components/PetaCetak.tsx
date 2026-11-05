"use client";

import { ferries, places } from "../lib/data";
import { useI18n } from "../lib/i18n";

// Peta pajangan: dasar Riso yang sama dengan Peta Hari Ini, dengan titik tempat makan di atasnya.
// Bingkai harus sama dengan `DESKTOP` di features/hari-ini/HariIni.tsx karena memakai gambar yang sama.
const W = 760;
const H = 780;
const LON: [number, number] = [103.8, 104.26];
const LAT: [number, number] = [0.7703, 1.2424];
// Dipotong ke Pulau Batam. Semua tempat dan terminal masuk bingkai ini (dites di tests/unit/makan.test.ts).
export const POTONGAN = { x: 165, y: 50, w: 450, h: 340 };

export const titik = (lat: number, lng: number) => ({
  x: ((lng - LON[0]) / (LON[1] - LON[0])) * W,
  y: ((LAT[1] - lat) / (LAT[1] - LAT[0])) * H,
});

export default function PetaCetak({ jumlah = places.length }: { jumlah?: number }) {
  const { t } = useI18n();
  return (
    <svg
      className="mk-peta-cetak"
      viewBox={`${POTONGAN.x} ${POTONGAN.y} ${POTONGAN.w} ${POTONGAN.h}`}
      role="img"
      aria-label={t("map_print_alt", { n: jumlah })}
    >
      <image href="/grafis/peta-hari-ini-dasar.webp" width={W} height={H} />
      <g className="mk-peta-cetak-titik">
        {places.map((p) => {
          const { x, y } = titik(p.lat, p.lng);
          return <circle key={p.id} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.2" />;
        })}
      </g>
      <g className="mk-peta-cetak-feri">
        {ferries.map((f) => {
          const { x, y } = titik(f.lat, f.lng);
          return (
            <g key={f.id} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <rect x="-4" y="-4" width="8" height="8" transform="rotate(45)" />
              <text x="9" y="4">
                {f.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
