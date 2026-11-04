"use client";

import dynamic from "next/dynamic";

// MapLibre dan OpenSeadragon hanya dimuat di halaman alat ini.
const AlatGcp = dynamic(() => import("./AlatGcp"), {
  ssr: false,
  loading: () => <p>Itik sedang berbaris…</p>,
});

export default function AlatGcpMuat(props: { dasar: string; segmen: string; lebar: number; tinggi: number }) {
  return <AlatGcp {...props} />;
}
