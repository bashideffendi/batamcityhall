"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

type Acara = { id: string; nama: string; bulan: number | null; lokasi: string | null };

const BULAN_PENDEK = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const tanpaLangganan = () => () => {};
const bulanWib = () => new Date(Date.now() + 7 * 3_600_000).getUTCMonth() + 1;

/** Urutan acara mulai bulan ini. Acara tanpa bulan tetap dilewati. Dipisah supaya bisa dites. */
export function acaraTerdekat<T extends { bulan: number | null }>(acara: T[], bulanIni: number, jumlah: number): T[] {
  return acara
    .filter((a) => a.bulan !== null)
    .map((a) => ({ a, jarak: ((a.bulan as number) - bulanIni + 12) % 12 }))
    .sort((x, y) => x.jarak - y.jarak)
    .slice(0, jumlah)
    .map(({ a }) => a);
}

// Bulan dihitung di browser: halaman statis tidak boleh membawa bulan saat build.
export default function ModulAcara({ acara }: { acara: Acara[] }) {
  const bulan = useSyncExternalStore(tanpaLangganan, bulanWib, () => null);
  if (bulan === null) return <p className="br-memuat">Memuat data</p>;
  return (
    <ul className="br-baris">
      {acaraTerdekat(acara, bulan, 5).map((a) => (
        <li key={a.id}>
          <Link href={`/things-to-do#${a.id}`} prefetch={false}>
            <span>{a.nama}</span>
            <span className="bch-data ket">{BULAN_PENDEK[(a.bulan as number) - 1]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
