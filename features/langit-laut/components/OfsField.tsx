"use client";

import type { ErrorEvent, MapSourceDataEvent } from "maplibre-gl";
import { useEffect, useRef } from "react";
import { OFS_TILE } from "@/features/langit-laut/lib/radar";
import { tambahLayer, usePeta } from "./PetaLangit";

// Field gelombang OFS (TMS tile contourf BMKG) dengan DOUBLE-BUFFER: tiap frame jadi sumber baru yang
// disembunyikan sampai tile-nya siap, baru menggantikan yang lama, jadi laut tidak berkedip kosong.
//
// Sekalian mendeteksi tile ditolak: ≥3 galat tanpa satu pun tile berhasil → onTilesDown(true), supaya
// panel bisa jujur "tile gagal dimuat".
type Props = {
  baserun: string;
  valid: string;
  opacity: number;
  onTilesDown?: (down: boolean) => void;
};

const SAFETY_MS = 4000;
let nomor = 0;

export default function OfsField({ baserun, valid, opacity, onTilesDown }: Props) {
  const map = usePeta();
  const aktif = useRef<string[]>([]);
  const opacityRef = useRef(opacity);
  const onDownRef = useRef(onTilesDown);

  useEffect(() => {
    opacityRef.current = opacity;
    onDownRef.current = onTilesDown;
  });

  useEffect(() => {
    const id = `ll-ofs-${++nomor}`;
    const adaYangLama = aktif.current.length > 0;
    map.addSource(id, {
      type: "raster",
      tiles: [OFS_TILE(baserun, valid)],
      scheme: "tms",
      tileSize: 256,
      maxzoom: 8,
    });
    // Frame pertama langsung tampil. Frame berikutnya menunggu tile-nya siap.
    tambahLayer(map, {
      id,
      type: "raster",
      source: id,
      paint: { "raster-opacity": adaYangLama ? 0 : opacityRef.current, "raster-fade-duration": 0 },
    });
    aktif.current.push(id);

    let errors = 0;
    let loads = 0;
    let selesai = false;
    const tampilkan = () => {
      if (selesai) return;
      selesai = true;
      if (map.getLayer(id)) map.setPaintProperty(id, "raster-opacity", opacityRef.current);
      for (const lama of aktif.current) {
        if (lama === id) continue;
        if (map.getLayer(lama)) map.removeLayer(lama);
        if (map.getSource(lama)) map.removeSource(lama);
      }
      aktif.current = [id];
    };
    const onError = (e: ErrorEvent & { sourceId?: string }) => {
      if (e.sourceId !== id) return;
      errors++;
      if (errors >= 3 && loads === 0) onDownRef.current?.(true);
    };
    const onData = (e: MapSourceDataEvent) => {
      if (e.sourceId !== id) return;
      if (e.tile) {
        loads++;
        if (loads === 1) onDownRef.current?.(false);
      }
      if (map.isSourceLoaded(id)) tampilkan();
    };
    map.on("error", onError);
    map.on("sourcedata", onData);
    // Kalau tile tidak pernah selesai (semua galat), jangan biarkan sumber menumpuk.
    const t = window.setTimeout(tampilkan, SAFETY_MS);
    return () => {
      window.clearTimeout(t);
      map.off("error", onError);
      map.off("sourcedata", onData);
    };
  }, [map, baserun, valid]);

  // Keluar mode OMBAK: lepas semua sumber.
  useEffect(
    () => () => {
      for (const id of aktif.current) {
        if (map.getLayer(id)) map.removeLayer(id);
        if (map.getSource(id)) map.removeSource(id);
      }
      aktif.current = [];
    },
    [map],
  );

  useEffect(() => {
    const ids = aktif.current;
    const id = ids[ids.length - 1];
    if (id && map.getLayer(id)) map.setPaintProperty(id, "raster-opacity", opacity);
  }, [map, opacity]);

  return null;
}
