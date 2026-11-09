"use client";

import { useSyncExternalStore } from "react";
import { bacaDiperbarui, subscribeDiperbarui } from "@/lib/diperbarui";

const tanggalHariIni = () =>
  new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(Date.now());
const tanpaLangganan = () => () => {};

/** Tanggal di beranda. Hanya dirender di klien: halaman statis tidak boleh membawa tanggal saat build. */
export default function Tanggal({ className }: { className: string }) {
  const tanggal = useSyncExternalStore(tanpaLangganan, tanggalHariIni, () => "");
  const jam = useSyncExternalStore(subscribeDiperbarui, bacaDiperbarui, () => "");
  return (
    <div className={className}>
      <span>{tanggal}</span>
      {jam && <span className="bch-data">Diperbarui {jam} WIB</span>}
    </div>
  );
}
