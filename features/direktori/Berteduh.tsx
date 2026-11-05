"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { EchoSummary } from "@/features/langit-laut/lib/api-types";
import { kecTable } from "@/features/langit-laut/lib/status";
import type { BarisIndeks } from "./data";

const JENIS = new Set(["kopitiam", "cafe"]);
const MAKS = 3;

/** Kopitiam dan kafe di kecamatan yang sedang hujan. Murni supaya bisa dites. */
export function pilihBerteduh(baris: BarisIndeks[], kecamatanHujan: string[]): BarisIndeks[] {
  const hujan = new Set(kecamatanHujan.map((k) => k.toLowerCase()));
  return baris
    .filter((b) => b.k === "kuliner" && JENIS.has(b.s ?? "") && b.c && hujan.has(b.c.toLowerCase()))
    .slice(0, MAKS);
}

// Kedai kopi untuk berteduh di detail hujan. Indeks hanya dimuat kalau radar memang melihat hujan di Batam.
export default function Berteduh({ echo, segar }: { echo: EchoSummary | null; segar: boolean }) {
  const [baris, setBaris] = useState<BarisIndeks[] | null>(null);
  const kecamatan = useMemo(
    () =>
      segar
        ? kecTable(echo, "batam")
            .flatMap((g) => g.rows)
            .filter((r) => r.level)
            .map((r) => r.name)
        : [],
    [echo, segar],
  );
  const adaHujan = kecamatan.length > 0;

  useEffect(() => {
    if (!adaHujan) return;
    let hidup = true;
    fetch("/info/direktori/indeks.json")
      .then((r) => (r.ok ? (r.json() as Promise<BarisIndeks[]>) : null))
      .then((d) => {
        if (hidup && d) setBaris(d);
      })
      .catch(() => {});
    return () => {
      hidup = false;
    };
  }, [adaHujan]);

  const isi = baris ? pilihBerteduh(baris, kecamatan) : [];
  if (isi.length === 0) return null;

  return (
    <section className="bch-berteduh" aria-label="Tempat berteduh">
      <h3>Tempat Berteduh</h3>
      <ul>
        {isi.map((b) => (
          <li key={b.id}>
            <Link href={`/makan/tempat/${b.id}`} prefetch={false}>
              {b.nama}
            </Link>{" "}
            <span>{b.c}</span>
          </li>
        ))}
      </ul>
      <p>
        <em>Kopitiam</em> dan kafe di kecamatan yang sedang hujan menurut perkiraan radar.
      </p>
    </section>
  );
}
