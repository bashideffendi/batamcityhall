"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSiteTheme } from "@/components/site/useSiteTheme";
import type { FiturPin } from "@/features/peta/LapisanTempat";

export type PinKategori = { id: string; nama: string; lat: number; lng: number; perkiraan: boolean };

// MapLibre cukup besar, jadi dimuat terpisah dan hanya di klien.
const Isi = dynamic(() => import("./PetaKategoriIsi"), {
  ssr: false,
  loading: () => <div className="bch-kategori-peta-kosong" aria-hidden="true" />,
});

/** Peta kecil di halaman kategori (PEDOMAN 4.6): semua penanda memakai ikon kategorinya. */
export default function PetaKategori({
  pins,
  glyph,
  warna,
  pusat,
}: {
  pins: PinKategori[];
  glyph: string;
  warna: string;
  /** detail tempat: peta dipusatkan ke titik ini */
  pusat?: [number, number];
}) {
  const theme = useSiteTheme();
  const router = useRouter();
  const fitur = useMemo<FiturPin[]>(
    () => pins.map((p) => ({ ...p, glyph, warna, idx: 0, penting: pins.length <= 3 })),
    [pins, glyph, warna],
  );
  return (
    <Isi
      fitur={fitur}
      warna={warna}
      pusat={pusat}
      theme={theme === "dark" ? "dark" : "light"}
      onPilih={(id) => {
        if (id) router.push(`/info/tempat/${id}`);
      }}
    />
  );
}
