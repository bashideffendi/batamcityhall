import { MawarAnginGaris } from "@/components/site/MawarAngin";
import {
  batang,
  formatAngka,
  meterPerPiksel,
  METER_PER_KM,
  METER_PER_MIL_LAUT,
  penyebutSkala,
  type Batang,
} from "./skala";
import type { Pandangan } from "./usePandangan";

const LEBAR_BATANG_MAKS = 120;

export function Kartusis({ pandangan }: { pandangan: Pandangan }) {
  const penyebut = penyebutSkala(meterPerPiksel(pandangan.lintang, pandangan.zoom));
  return (
    <div className="peta-kartusis">
      <p className="peta-kartusis-judul">Batam dan perairannya</p>
      <p className="peta-kartusis-sub">Rempang, Galang, dan pulau sekitar</p>
      <p className="peta-kartusis-skala">Skala 1 : {formatAngka(penyebut)}</p>
      <p className="peta-kartusis-catatan">Bukan untuk navigasi</p>
    </div>
  );
}

export function Mawar() {
  return (
    <svg className="peta-mawar" viewBox="-30 -36 60 66" role="img" aria-label="Utara di atas">
      <text
        x={0}
        y={-27}
        textAnchor="middle"
        fontFamily="var(--bch-font-serif)"
        fontSize={11}
        fontWeight={600}
        fill="currentColor"
      >
        U
      </text>
      <MawarAnginGaris />
    </svg>
  );
}

function BarisBatang({ b, satuan }: { b: Batang; satuan: string }) {
  const lebar = b.px / b.segmen;
  return (
    <div className="peta-skala-baris">
      <svg width={b.px} height={6} aria-hidden="true">
        {Array.from({ length: b.segmen }, (_, i) => (
          <rect
            key={i}
            x={i * lebar}
            y={0}
            width={lebar}
            height={6}
            className={i % 2 === 0 ? "peta-tepi-gelap" : "peta-tepi-terang"}
          />
        ))}
        <rect x={0.5} y={0.5} width={b.px - 1} height={5} className="peta-tepi-garis" />
      </svg>
      <span>
        {formatAngka(b.nilai)} {satuan}
      </span>
    </div>
  );
}

export function SkalaBatang({ pandangan }: { pandangan: Pandangan }) {
  const mPerPx = meterPerPiksel(pandangan.lintang, pandangan.zoom);
  const km = batang(mPerPx, LEBAR_BATANG_MAKS, METER_PER_KM);
  const mil = batang(mPerPx, LEBAR_BATANG_MAKS, METER_PER_MIL_LAUT);
  return (
    <div
      className="peta-skala"
      role="img"
      aria-label={`Skala batang: ${formatAngka(km.nilai)} kilometer, ${formatAngka(mil.nilai)} mil laut`}
    >
      <BarisBatang b={km} satuan="km" />
      <BarisBatang b={mil} satuan="mil laut" />
    </div>
  );
}
