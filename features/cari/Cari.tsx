"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { BarisIndeks } from "@/features/direktori/data";
import { BAGIAN } from "@/lib/site";
import { cariDi, HASIL_MAKS, halamanSitus } from "./cocok";

const HALAMAN = halamanSitus(BAGIAN);

// Pencarian di peramban: halaman situs dan seluruh direktori. Indeksnya berkas statis, jadi tidak ada yang dikirim ke server.
const tanpaLangganan = () => () => {};
const kataDariUrl = () => new URLSearchParams(window.location.search).get("q") ?? "";

export default function Cari() {
  // Kata awal dari ?q= dibaca lewat useSyncExternalStore: kosong saat render server, langsung terisi di klien
  // tanpa menunggu indeks tempat. Setelah pengunjung mengetik, ketikannya yang dipakai.
  const awal = useSyncExternalStore(tanpaLangganan, kataDariUrl, () => "");
  const [ketik, setKata] = useState<string | null>(null);
  const kata = ketik ?? awal;
  const [baris, setBaris] = useState<BarisIndeks[] | null>(null);
  const [gagal, setGagal] = useState(false);

  useEffect(() => {
    let hidup = true;
    fetch("/info/direktori/indeks.json")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json() as Promise<BarisIndeks[]>;
      })
      .then((d) => {
        if (!hidup) return;
        setBaris(d);
      })
      .catch(() => hidup && setGagal(true));
    return () => {
      hidup = false;
    };
  }, []);

  const q = kata.trim();
  const halaman = useMemo(() => (q ? cariDi(HALAMAN, q, (h) => [h.nama, h.bagian, h.kata ?? ""]) : []), [q]);
  const tempat = useMemo(() => (q && baris ? cariDi(baris, q, (b) => [b.nama, (b.alt ?? []).join(" "), b.sl ?? "", b.c ?? "", b.l ?? "", b.kk ?? ""]) : []), [q, baris]);

  return (
    <div className="bch-cari">
      <div className="bch-cari-baris" role="search">
        <input
          className="bch-input bch-cari-besar"
          type="search"
          value={kata}
          autoFocus
          onChange={(e) => setKata(e.target.value)}
          placeholder="Tempat, jalan, kecamatan, atau halaman"
          aria-label="Cari di Batam City Hall"
        />
      </div>
      {gagal && <p className="bch-note">Daftar tempat tidak dapat dimuat. Halaman situs tetap bisa dicari.</p>}
      {q && (
        <div className="bch-cari-hasil" aria-live="polite">
          {halaman.length > 0 && (
            <section aria-label="Halaman">
              <h2 className="bch-judul-seksi">Halaman</h2>
              <ul className="bch-cari-daftar">
                {halaman.slice(0, HASIL_MAKS).map((h) => (
                  <li key={h.href}>
                    <Link href={h.href} prefetch={false}>
                      <span>{h.nama}</span>
                      <span className="ket">{h.bagian}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {tempat.length > 0 && (
            <section aria-label="Tempat">
              <h2 className="bch-judul-seksi">
                Tempat <span className="bch-data">{tempat.length.toLocaleString("id-ID")}</span>
              </h2>
              <ul className="bch-cari-daftar">
                {tempat.slice(0, HASIL_MAKS).map((b) => (
                  <li key={b.id}>
                    {b.h ? (
                      <Link href={`/info/tempat/${b.id}`} prefetch={false}>
                        <span>{b.nama}</span>
                        <span className="ket">{[b.sl, b.c].filter(Boolean).join(" · ")}</span>
                      </Link>
                    ) : (
                      <span className="polos">
                        <span>{b.nama}</span>
                        <span className="ket">{[b.sl, b.c].filter(Boolean).join(" · ")}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {tempat.length > HASIL_MAKS && <p className="bch-catatan-halaman">Sebanyak {HASIL_MAKS} hasil pertama. Tambah kata untuk mempersempit.</p>}
            </section>
          )}
          {baris && !halaman.length && !tempat.length && <p>Tidak ada hasil untuk “{q}”. Coba kata lain.</p>}
        </div>
      )}
    </div>
  );
}
