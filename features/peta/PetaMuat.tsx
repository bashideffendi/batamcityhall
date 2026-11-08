"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ItikBerbaris from "./ItikBerbaris";

const Penampung = () => (
  <div className="br-peta-muat">
    <ItikBerbaris />
  </div>
);

// MapLibre butuh WebGL dan cukup besar, jadi hanya dimuat di klien dan terpisah dari bundel halaman.
const PetaTempat = dynamic(() => import("./PetaTempat"), { ssr: false, loading: Penampung });

const tanpaLangganan = () => () => {};
// Tautan ?tempat= langsung membuka kartu di peta, jadi petanya tidak menunggu digulir.
const adaTempatDiUrl = () => new URLSearchParams(window.location.search).has("tempat");

/**
 * Peta di beranda berada jauh di bawah. MapLibre, arsip peta, dan pin baru diunduh saat peta hampir terlihat,
 * supaya pembaca yang berhenti di Hari Ini tidak ikut membayar beberapa ratus KB.
 */
export default function PetaMuat({ jumlahTanpaTitik }: { jumlahTanpaTitik: Record<string, number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const langsung = useSyncExternalStore(tanpaLangganan, adaTempatDiUrl, () => false);
  const [dekat, setDekat] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (langsung || !el) return;
    const io = new IntersectionObserver(
      (entri) => {
        if (!entri.some((e) => e.isIntersecting)) return;
        setDekat(true);
        io.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [langsung]);

  if (langsung || dekat) return <PetaTempat jumlahTanpaTitik={jumlahTanpaTitik} />;
  return (
    <div ref={ref}>
      <Penampung />
    </div>
  );
}
