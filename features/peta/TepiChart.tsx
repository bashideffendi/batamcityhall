"use client";

import type { Map as MapLibre } from "maplibre-gl";
import { formatBujur, formatLintang, tepiSumbu, type Strip } from "./graticule";
import type { Pandangan } from "./usePandangan";

const TEBAL = 6;
const JARAK_TEPI = 48;
// Area kiri atas dan kiri bawah yang tertutup kartusis dan skala batang: label di sana dilewati
// supaya tidak terpotong setengah.
const KIRI_ATAS_KOSONG = 140;
const KIRI_BAWAH_KOSONG = 88;

function StripDatar({ strip, y, lebar }: { strip: Strip[]; y: number; lebar: number }) {
  return (
    <g>
      {strip.map((s) => (
        <rect
          key={s.dari}
          x={s.dari}
          y={y}
          width={s.ke - s.dari}
          height={TEBAL}
          className={s.gelap ? "peta-tepi-gelap" : "peta-tepi-terang"}
        />
      ))}
      <rect x={0} y={y} width={lebar} height={TEBAL} className="peta-tepi-garis" />
    </g>
  );
}

function StripTegak({ strip, x, tinggi }: { strip: Strip[]; x: number; tinggi: number }) {
  return (
    <g>
      {strip.map((s) => (
        <rect
          key={s.dari}
          x={x}
          y={s.dari}
          width={TEBAL}
          height={s.ke - s.dari}
          className={s.gelap ? "peta-tepi-gelap" : "peta-tepi-terang"}
        />
      ))}
      <rect x={x} y={0} width={TEBAL} height={tinggi} className="peta-tepi-garis" />
    </g>
  );
}

/** Bingkai chart: strip berselang tiap menit busur dan label derajat-menit di sisi atas dan kiri. */
export default function TepiChart({ map, pandangan }: { map: MapLibre; pandangan: Pandangan }) {
  const { batas, lebar, tinggi } = pandangan;
  const tengahLng = (batas.west + batas.east) / 2;
  const tengahLat = (batas.south + batas.north) / 2;
  const datar = tepiSumbu(batas.west, batas.east, lebar, (lng) => map.project([lng, tengahLat]).x, formatBujur);
  const tegak = tepiSumbu(batas.south, batas.north, tinggi, (lat) => map.project([tengahLng, lat]).y, formatLintang);

  return (
    <svg className="peta-tepi" width={lebar} height={tinggi} aria-hidden="true">
      <StripDatar strip={datar.strip} y={0} lebar={lebar} />
      <StripDatar strip={datar.strip} y={tinggi - TEBAL} lebar={lebar} />
      <StripTegak strip={tegak.strip} x={0} tinggi={tinggi} />
      <StripTegak strip={tegak.strip} x={lebar - TEBAL} tinggi={tinggi} />
      {datar.label
        .filter((l) => l.posisi > JARAK_TEPI && l.posisi < lebar - JARAK_TEPI)
        .map((l) => (
          <text key={l.teks} x={l.posisi} y={TEBAL + 13} textAnchor="middle" className="peta-tepi-label">
            {l.teks}
          </text>
        ))}
      {tegak.label
        .filter((l) => l.posisi > KIRI_ATAS_KOSONG && l.posisi < tinggi - KIRI_BAWAH_KOSONG)
        .map((l) => (
          <text key={l.teks} x={TEBAL + 5} y={l.posisi + 4} className="peta-tepi-label">
            {l.teks}
          </text>
        ))}
    </svg>
  );
}
