"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePeta } from "./PetaLangit";

type Props = {
  /** [lintang, bujur], sama dengan urutan data kode lama */
  posisi: [number, number];
  /** geser di ruang layar (px), mis. pin kamera yang dikipas */
  geser?: [number, number];
  className: string;
  children: ReactNode;
};

// Marker DOM MapLibre yang isinya dirender React lewat portal.
export default function PetaMarker({ posisi, geser, className, children }: Props) {
  const map = usePeta();
  const [el] = useState(() => document.createElement("div"));
  const marker = useRef<Marker | null>(null);
  const [lat, lng] = posisi;
  const [dx, dy] = geser ?? [0, 0];

  useEffect(() => {
    const m = new Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).setOffset([dx, dy]).addTo(map);
    marker.current = m;
    return () => {
      m.remove();
      marker.current = null;
    };
    // Posisi diperbarui oleh effect di bawah, tanpa membuat ulang marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, el]);

  useEffect(() => {
    marker.current?.setLngLat([lng, lat]).setOffset([dx, dy]);
  }, [lat, lng, dx, dy]);

  useEffect(() => {
    el.classList.add(...className.split(" ").filter(Boolean));
    return () => el.classList.remove(...className.split(" ").filter(Boolean));
  }, [el, className]);

  return createPortal(children, el);
}
