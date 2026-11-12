"use client";

import Link from "next/link";
import TautanSelengkapnya from "@/components/site/TautanSelengkapnya";
import { useMemo } from "react";
import {
  catatanJadwalLama,
  jamTitik,
  keberangkatanBerikutnya,
  tanggalDataTertua,
} from "@/features/jalan/feri-terakhir";
import { useEntriFeri } from "@/features/jalan/useFeri";
import { useNow } from "@/features/langit-laut/hooks/useBrowser";

const TICK_MS = 30 * 1000;

/**
 * Tiga keberangkatan berikutnya ke Singapura per pelabuhan. Jadwal diambil di peramban dan dihitung dengan jam
 * pengguna, jadi halaman statis tidak membawa jam saat build. Sebelum data tiba, yang tampil hanya "Memuat jadwal".
 */
export default function ModulFeri() {
  const now = useNow(TICK_MS);
  const feri = useEntriFeri();
  const baris = useMemo(() => (feri.data ? keberangkatanBerikutnya(feri.data, new Date(now)) : null), [feri.data, now]);

  return (
    <section className="br-modul" aria-labelledby="br-feri">
      <h2 id="br-feri">Feri ke Singapura</h2>
      {feri.gagal ? (
        <p className="br-memuat">Jadwal belum dapat dimuat.</p>
      ) : !baris ? (
        <p className="br-memuat">Memuat jadwal</p>
      ) : !baris.length ? (
        <p className="br-memuat">Jadwal feri ke Singapura belum tersedia.</p>
      ) : (
        <>
          <ul className="br-baris br-feri">
            {baris.map((b) => (
              <li key={`${b.asal}|${b.tujuan}`} data-feri={b.ruteId}>
                <Link href={`/jalan/feri#${b.ruteId}`} prefetch={false}>
                  <span>
                    {b.asal}—{b.tujuan}
                  </span>
                  <span className="ket">
                    {b.jam.length
                      ? b.jam.map(jamTitik).join(" · ")
                      : b.besok
                        ? `Habis, besok ${jamTitik(b.besok)}`
                        : "Habis hari ini"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="br-catatan-modul">Jam WIB. {catatanJadwalLama(tanggalDataTertua(baris))}</p>
        </>
      )}
      <TautanSelengkapnya href="/jalan/feri" tentang="Jadwal Feri" className="bch-aksi br-selengkapnya" />
    </section>
  );
}
