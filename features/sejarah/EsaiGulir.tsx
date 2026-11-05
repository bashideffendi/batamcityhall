"use client";

import { kaidahJudul } from "@/lib/judul";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LangkahEsai } from "./esai";

const LEBAR = 320;
const KIRI = 12;
const AWAL = 1750;
const AKHIR = 2026;
const x = (t: number) => KIRI + ((t - AWAL) / (AKHIR - AWAL)) * (LEBAR - KIRI * 2);

// Panel tetap di samping esai: dua garis, satu penanda. Tanpa parallax. Teks esai tidak bergantung pada panel,
// dan panel disembunyikan di layar sempit. Perpindahan penanda tanpa animasi saat gerak tenang (CSS).
function PanelPoros({ langkah }: { langkah: LangkahEsai }) {
  return (
    <div className="sj-panel" aria-hidden="true">
      <p className="sj-panel-tahun bch-data">{langkah.label}</p>
      <svg viewBox={`0 0 ${LEBAR} 150`} width="100%" focusable="false">
        <text x={x(1829)} y={34} className="sj-g-teks">
          Pemerintahan lokal, sejak 1829
        </text>
        <line x1={x(1829)} x2={x(AKHIR)} y1={46} y2={46} className="sj-poros" data-poros="lokal" />
        <text x={x(1829)} y={84} className="sj-g-teks">
          Proyek negara, sejak 1969
        </text>
        <line x1={x(1969)} x2={x(AKHIR)} y1={96} y2={96} className="sj-poros" data-poros="negara" />
        <line x1={x(1750)} x2={x(AKHIR)} y1={128} y2={128} className="sj-sumbu" />
        {[1800, 1900, 2000].map((t) => (
          <text key={t} x={x(t)} y={144} textAnchor="middle" className="sj-g-teks">
            {t}
          </text>
        ))}
        <line x1={x(langkah.tahun)} x2={x(langkah.tahun)} y1={40} y2={128} className="sj-penanda" />
        <circle cx={x(langkah.tahun)} cy={128} r={5} className="sj-penanda-titik" />
      </svg>
    </div>
  );
}

export default function EsaiGulir({ langkah, judul }: { langkah: LangkahEsai[]; judul: Record<string, string> }) {
  const [aktif, setAktif] = useState(0);
  const wadah = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wadah.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (masuk) => {
        for (const m of masuk) if (m.isIntersecting) setAktif(Number((m.target as HTMLElement).dataset.indeks));
      },
      { rootMargin: "-20% 0px -40% 0px" },
    );
    el.querySelectorAll("[data-indeks]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sj-esai" ref={wadah}>
      <PanelPoros langkah={langkah[aktif]} />
      <div className="sj-esai-teks">
        {langkah.map((l, i) => (
          <section key={l.id} data-indeks={i} data-aktif={aktif === i || undefined} className="sj-langkah">
            <p className="bch-kicker m-0">{l.label}</p>
            <h3 className="mt-1">{kaidahJudul(l.judul)}</h3>
            {l.paragraf.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {l.tautan && (
              <p>
                <Link href={l.tautan.href} prefetch={false}>
                  {l.tautan.label}
                </Link>
              </p>
            )}
            <p className="sj-kecil m-0">
              Lihat di garis waktu:{" "}
              {l.rujukan.map((id, j) => (
                <span key={id}>
                  {j > 0 && ", "}
                  <a href={`#${id}`}>{judul[id]}</a>
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
