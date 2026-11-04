"use client";

import Link from "next/link";
import "./berita.css";
import { useBerita, waktuWib } from "./klien";

const JUMLAH = 5;

// Dimuat lewat klien supaya beranda tetap statis. Gagal cukup satu kalimat pendek.
export default function BeritaWidget() {
  const keadaan = useBerita();
  const item = keadaan.fase === "siap" ? keadaan.data.item.slice(0, JUMLAH) : [];
  return (
    <section className="bch-berita-widget" aria-labelledby="berita-terbaru" data-fase={keadaan.fase}>
      <h2 id="berita-terbaru">Berita Batam</h2>
      {keadaan.fase === "memuat" && <p className="bch-berita-pesan">Memuat judul…</p>}
      {keadaan.fase !== "memuat" && !item.length && <p className="bch-berita-pesan">Judul berita belum bisa dimuat.</p>}
      {item.length > 0 && (
        <ol className="bch-berita-daftar">
          {item.map((b) => (
            <li key={b.tautan}>
              <a href={b.tautan} target="_blank" rel="noopener noreferrer">
                {b.judul}
              </a>
              <span className="bch-berita-meta">
                {b.sumber} · {b.waktu ? waktuWib(b.waktu) : "Waktu tidak terbaca"}
              </span>
            </li>
          ))}
        </ol>
      )}
      <Link href="/info/berita" prefetch={false} className="bch-berita-semua">
        Semua judul dan status sumber
      </Link>
    </section>
  );
}
