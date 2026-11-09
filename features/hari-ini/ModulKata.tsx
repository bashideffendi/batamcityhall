"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { indeksKata, tanggalWib, type KataRingkas } from "./kata-hari-ini";

// Dicek tiap menit supaya kata berganti tepat setelah tengah malam WIB bila halaman dibiarkan terbuka.
const langganMenit = (ubah: () => void) => {
  const t = setInterval(ubah, 60 * 1000);
  return () => clearInterval(t);
};
const tanggalSekarang = () => tanggalWib(new Date());
const tanpaTanggal = () => "";

/**
 * Satu kata kamus per hari. Dipilih di peramban, bukan saat build: beranda dibangun ulang berkala, jadi tanggal di
 * server bisa tertinggal setelah tengah malam.
 */
export default function ModulKata({ daftar }: { daftar: KataRingkas[] }) {
  const tanggal = useSyncExternalStore(langganMenit, tanggalSekarang, tanpaTanggal);
  const k = tanggal && daftar.length ? daftar[indeksKata(tanggal, daftar.length)] : null;

  return (
    <section className="br-modul" aria-labelledby="br-kata">
      <h2 id="br-kata">Kata Hari Ini</h2>
      {k ? (
        <div className="br-kata" data-kata={k.id}>
          <p className="kata">{k.kata}</p>
          <p className="ragam">{k.labelRagam}</p>
          <p className="arti">‘{k.arti}’</p>
          {k.contoh && <p className="contoh">{k.contoh}</p>}
          {k.konteks && <p className="rinci">{k.konteks}</p>}
          {k.belumDiperiksa && <p className="rinci">Masih menunggu pemeriksaan penutur.</p>}
        </div>
      ) : (
        <div className="br-kata">
          <p className="br-memuat">Memuat kata</p>
        </div>
      )}
      <Link href={k ? `/cerita/kamus#${k.id}` : "/cerita/kamus"} className="bch-aksi br-selengkapnya" prefetch={false}>
        Selengkapnya →
      </Link>
    </section>
  );
}
