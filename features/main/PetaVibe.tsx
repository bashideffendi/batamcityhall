"use client";

import { Map as MapLibre, type MapLayerMouseEvent, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, MAP_BOUNDS, PALET, TAMPILAN_AWAL, type MapTheme } from "@/features/peta/style";

export type TitikVibe = {
  id: string;
  jenis: "ngopi" | "macet";
  nama: string;
  lokasi: string;
  href: string;
  lat: number;
  lng: number;
  perkiraan: boolean;
};

const JENIS = { ngopi: "Ngopi", macet: "Macet" } as const;
const KETERANGAN = {
  ngopi: "Kopitiam dan kafe dari Loket Makan. Titiknya perkiraan.",
  macet: "Kamera CCTV Pemko. Kami tidak menilai macet atau tidak: lihat sendiri.",
};

function gaya(base: StyleSpecification, theme: MapTheme, titik: TitikVibe[]): StyleSpecification {
  const c = PALET[theme];
  return {
    ...base,
    sources: {
      ...base.sources,
      "mm-titik": {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: titik.map((t) => ({
            type: "Feature",
            geometry: { type: "Point", coordinates: [t.lng, t.lat] },
            properties: { id: t.id, jenis: t.jenis },
          })),
        },
      },
    },
    layers: [
      ...base.layers,
      {
        id: "mm-titik",
        type: "circle",
        source: "mm-titik",
        paint: {
          "circle-radius": 6,
          "circle-color": ["match", ["get", "jenis"], "macet", c.accent, c.land],
          "circle-stroke-color": c.accent,
          "circle-stroke-width": 2,
        },
      },
      { id: "mm-klik", type: "circle", source: "mm-titik", paint: { "circle-radius": 16, "circle-opacity": 0 } },
    ],
  };
}

// Vibe map: hanya cuaca, macet, ngopi. Tidak ada kategori etnis atau kelas, dan belum ada label kiriman warga.
export default function PetaVibe({ titik }: { titik: TitikVibe[] }) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [aktif, setAktif] = useState<ReadonlySet<string>>(() => new Set(["ngopi", "macet"]));
  const [pilihId, setPilihId] = useState<string | null>(null);
  const theme = useSiteTheme();
  const tampil = useMemo(() => titik.filter((t) => aktif.has(t.jenis)), [titik, aktif]);
  const pilih = titik.find((t) => t.id === pilihId);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !webglAda()) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle("day", window.location.origin),
      bounds: TAMPILAN_AWAL,
      fitBoundsOptions: { padding: 16 },
      maxBounds: MAP_BOUNDS,
      minZoom: 7,
      maxZoom: 16,
      dragRotate: false,
      pitchWithRotate: false,
      renderWorldCopies: false,
      cooperativeGestures: true,
    });
    m.once("load", () => setMap(m));
    const klik = (e: MapLayerMouseEvent) => {
      const id = e.features?.[0]?.properties?.id;
      if (typeof id === "string") setPilihId(id);
    };
    m.on("click", "mm-klik", klik);
    return () => m.remove();
  }, []);

  useEffect(() => {
    map?.setStyle(gaya(baseStyle(theme, window.location.origin), theme, tampil));
  }, [map, theme, tampil]);

  return (
    <div className="mm-vibe">
      <div
        ref={wadah}
        className="mm-vibe-peta"
        aria-label="Peta vibe Batam. Daftar yang sama ada di bawah peta."
        role="region"
      />
      <fieldset className="mm-vibe-saring">
        <legend>Tampilkan</legend>
        {(Object.keys(JENIS) as (keyof typeof JENIS)[]).map((j) => (
          <label key={j}>
            <input
              type="checkbox"
              checked={aktif.has(j)}
              onChange={(e) => {
                const baru = new Set(aktif);
                if (e.target.checked) baru.add(j);
                else baru.delete(j);
                setAktif(baru);
              }}
            />
            {JENIS[j]} <span className="bch-data">{titik.filter((t) => t.jenis === j).length}</span>
          </label>
        ))}
      </fieldset>
      {pilih && (
        <article className="bch-card mm-vibe-kartu" aria-live="polite">
          <p className="bch-kicker m-0">{JENIS[pilih.jenis]}</p>
          <h3>{pilih.nama}</h3>
          <p className="bch-card-loc">{pilih.lokasi}</p>
          <p className="mb-0">
            <Link href={pilih.href} prefetch={false}>
              Buka
            </Link>
          </p>
        </article>
      )}
      {(Object.keys(JENIS) as (keyof typeof JENIS)[]).map((j) => (
        <section key={j}>
          <h2 className="mt-7 mb-2">{JENIS[j]}</h2>
          <p className="bch-measure">{KETERANGAN[j]}</p>
          <ul className="mm-vibe-daftar">
            {titik
              .filter((t) => t.jenis === j)
              .map((t) => (
                <li key={t.id}>
                  <Link href={t.href} prefetch={false}>
                    {t.nama}
                  </Link>{" "}
                  <span className="bch-sel-kecil">{t.lokasi}</span>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
