"use client";

import { Map as MapLibre, Marker, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import { pasangGlobalPeta, webglAda } from "@/features/peta/global";
import { baseStyle, MAP_BOUNDS, TAMPILAN_AWAL } from "@/features/peta/style";
import { readTheme } from "@/lib/theme";
import { bulatkan, type TitikKoordinat } from "../koordinat";

/** Di bawah zoom ini klik tidak dicatat: satu piksel sudah puluhan meter, dan itu sama saja dengan menebak. */
export const ZOOM_MIN_KLIK = 14;

const penanda = (jenis: "lama" | "baru") => {
  const el = document.createElement("div");
  el.className = "bch-adm-pin";
  el.dataset.jenis = jenis;
  return el;
};

export default function PetaKoordinat({
  terpilih,
  nilai,
  onKlik,
}: {
  terpilih: TitikKoordinat | null;
  nilai: { lat: number; lng: number } | null;
  onKlik: (lat: number, lng: number) => void;
}) {
  const wadah = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<MapLibre | null>(null);
  const [adaWebgl] = useState(webglAda);
  const [terlaluJauh, setTerlaluJauh] = useState(false);
  const tema = useSiteTheme();
  const klik = useRef(onKlik);
  useEffect(() => {
    klik.current = onKlik;
  }, [onKlik]);

  useEffect(() => {
    const el = wadah.current;
    if (!el || !adaWebgl) return;
    pasangGlobalPeta();
    const m = new MapLibre({
      container: el,
      style: baseStyle(readTheme(), window.location.origin, { chart: false }),
      bounds: TAMPILAN_AWAL,
      fitBoundsOptions: { padding: 24 },
      maxBounds: MAP_BOUNDS,
      minZoom: 7,
      maxZoom: 18,
      maxPitch: 0,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
      locale: {
        "Map.Title": "Peta untuk mengisi koordinat. Klik titik lokasinya, atau tempel angkanya di bawah peta.",
      },
    });
    m.addControl(new NavigationControl({ showCompass: false }), "top-right");
    m.on("click", (e) => {
      const jauh = m.getZoom() < ZOOM_MIN_KLIK;
      setTerlaluJauh(jauh);
      if (!jauh) klik.current(bulatkan(e.lngLat.lat), bulatkan(e.lngLat.lng));
    });
    // Dipakai tes e2e untuk memastikan peta sudah siap sebelum diklik.
    m.once("load", () => {
      el.dataset.siap = "1";
    });
    setMap(m);
    return () => {
      setMap(null);
      m.remove();
    };
  }, [adaWebgl]);

  const temaPeta = useRef(tema);
  useEffect(() => {
    if (!map || temaPeta.current === tema) return;
    temaPeta.current = tema;
    map.setStyle(baseStyle(tema, window.location.origin, { chart: false }));
  }, [map, tema]);

  // Titik lama (perkiraan) bergaris putus-putus, isian baru penuh. Status juga tertulis di bawah peta.
  useEffect(() => {
    if (!map || terpilih?.lat == null || terpilih.lng == null) return;
    const lama = new Marker({ element: penanda("lama") }).setLngLat([terpilih.lng, terpilih.lat]).addTo(map);
    map.jumpTo({ center: [terpilih.lng, terpilih.lat], zoom: Math.max(map.getZoom(), 14) });
    return () => {
      lama.remove();
    };
  }, [map, terpilih]);

  useEffect(() => {
    if (!map || !nilai) return;
    const baru = new Marker({ element: penanda("baru") }).setLngLat([nilai.lng, nilai.lat]).addTo(map);
    return () => {
      baru.remove();
    };
  }, [map, nilai]);

  if (!adaWebgl) {
    return (
      <p className="bch-note" data-tone="caution">
        Peta tidak bisa dimuat di browser ini. Laut masih ada, kami saja yang belum. Koordinat tetap bisa ditempel di
        bawah.
      </p>
    );
  }
  return (
    <>
      <div ref={wadah} className="bch-adm-peta" data-peta-koordinat />
      <p className="bch-card-meta mt-2 mb-0" role="status" data-peta-pesan>
        {terlaluJauh ? "Belum tercatat. Perbesar peta dulu sampai jalannya terlihat, lalu klik lagi." : ""}
      </p>
    </>
  );
}
