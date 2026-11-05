"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { MAPPED_CAMS, type Cam } from "@/features/langit-laut/lib/cctv";
import { CAM_PATH_A, CAM_PATH_B } from "./icons";
import { usePeta } from "./PetaLangit";
import PetaMarker from "./PetaMarker";

// Pin kamera di peta. Stream baru jalan pas kamera dipilih (lihat CctvPlayer).
//
// Setiap kamera berdiri sendiri (koreksi pemilik, 5 November 2026): tidak ada pengelompokan berangka.
// Varian visual: biasa · perkiraan (ring putus-putus; koordinatnya bisa meleset ratusan meter) ·
// gagal diputar tadi (abu; dari sesi ini, bukan hardcode). Area sentuh 44×44 walau visualnya lebih kecil.

// Beberapa kamera duduk di satu titik yang sama (dua kamera satu simpang, beda arah hadap). Dikipas di
// RUANG LAYAR saat render (bukan mengarang koordinat di data): tiap anggota digeser mengelilingi titik
// aslinya, dengan garis rambut ke titik asli.
const FAN_PX = 16;

/** Di bawah zoom ini pin mengecil, supaya sebaran kamera terlihat. */
const ZOOM_PENUH = 13;

type Placed = { cam: Cam; pos: [number, number]; off: [number, number] };

function fanOut(cams: Cam[]): Placed[] {
  const groups = new Map<string, Cam[]>();
  for (const c of cams) {
    const key = `${c.lat!.toFixed(5)},${c.lng!.toFixed(5)}`;
    const g = groups.get(key);
    if (g) g.push(c);
    else groups.set(key, [c]);
  }
  const out: Placed[] = [];
  for (const g of groups.values()) {
    g.forEach((c, i) => {
      const pos: [number, number] = [c.lat as number, c.lng as number];
      if (g.length === 1) {
        out.push({ cam: c, pos, off: [0, 0] });
        return;
      }
      const a = (2 * Math.PI * i) / g.length - Math.PI / 2; // mulai dari atas
      out.push({ cam: c, pos, off: [FAN_PX * Math.cos(a), FAN_PX * Math.sin(a)] });
    });
  }
  return out;
}

const PinIkon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={CAM_PATH_A} />
    <path d={CAM_PATH_B} />
  </svg>
);

type Props = {
  onPick: (cam: Cam) => void;
  /** slug → lastSeen (ms) kamera yang gagal diputar di sesi ini. */
  dead: ReadonlyMap<string, number | null>;
};

const onKey = (e: KeyboardEvent, activate: () => void) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
    activate();
  }
};

export default function CctvLayer({ onPick, dead }: Props) {
  const map = usePeta();
  const [kecil, setKecil] = useState(() => map.getZoom() < ZOOM_PENUH);

  useEffect(() => {
    const onZoom = () => setKecil(map.getZoom() < ZOOM_PENUH);
    map.on("zoomend", onZoom);
    return () => {
      map.off("zoomend", onZoom);
    };
  }, [map]);

  const placed = useMemo(() => fanOut(MAPPED_CAMS), []);

  return (
    <>
      {placed.map(({ cam, pos, off }) => {
        const failed = dead.has(cam.slug);
        const [dx, dy] = off;
        const cls = ["cam-pin", cam.approx ? "is-approx" : "", failed ? "is-mati" : ""].filter(Boolean).join(" ");
        return (
          <PetaMarker key={cam.slug} posisi={pos} geser={off} className={kecil ? "cam-marker cam-kecil" : "cam-marker"}>
            <button
              type="button"
              className="cam-hit"
              data-cam-key={cam.slug}
              aria-label={`Kamera ${cam.name}${cam.approx ? ", lokasi perkiraan" : ""}${failed ? ", gagal diputar tadi" : ""}`}
              onClick={() => onPick(cam)}
              onKeyDown={(e) => onKey(e, () => onPick(cam))}
            >
              {/* Pin terkipas: garis rambut dari pusat pin ke titik asli kamera. */}
              {(dx !== 0 || dy !== 0) && (
                <i
                  className="cam-fan-line"
                  style={{
                    width: `${Math.hypot(dx, dy).toFixed(1)}px`,
                    transform: `rotate(${Math.atan2(-dy, -dx).toFixed(4)}rad)`,
                  }}
                />
              )}
              <span className={cls}>
                <PinIkon />
              </span>
              <span className="cam-label">
                {cam.name}
                {cam.approx ? " · Lokasi perkiraan" : ""}
                {failed ? " · Gagal diputar tadi" : ""}
              </span>
            </button>
          </PetaMarker>
        );
      })}
    </>
  );
}
