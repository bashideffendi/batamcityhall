"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { BAGIAN, bagianDiAlamat } from "@/lib/site";

const RUMAH = "M3 11 12 4l9 7M5.5 9.5V20h5v-6h3v6h5V9.5";
const PANAH = "m6 9 6 6 6-6";

/**
 * Bagian yang tampil langsung di ponsel (pemilik 12 Nov 2026: "jangan pakai burger bar, tampilin aja menunya", dengan
 * tombol Lainnya). Sejak 16 Nov 2026 tujuh bagian ini satu baris yang bisa digeser, bukan dua baris: bersama submenu,
 * dua baris menu ditambah satu baris submenu terbaca sebagai tiga menu bertumpuk (pemilik: "membingungkan"). Urutan
 * tetap urutan BAGIAN. Bagian lain ada di Lainnya, yang selalu terlihat di ujung kanan.
 */
const PONSEL = new Set(["cuaca", "cctv", "transportasi", "layanan", "makanan", "kegiatan", "berita"]);

const Ikon = ({ d, ukuran = 20 }: { d: string; ukuran?: number }) => (
  <svg
    width={ukuran}
    height={ukuran}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

/**
 * Menu bagian situs, dipakai di kepala halaman dan di pita bawah sampul beranda supaya isinya tidak pernah berbeda.
 * Beranda bukan anggota BAGIAN: alamat "/" adalah awalan semua halaman. Di menu lebar tampil sebagai ikon; di ponsel
 * nama situs di kepala menjadi jalan ke beranda.
 *
 * Layar lebar: satu baris. Layar sedang: semua bagian dalam dua baris. Ponsel: tujuh bagian dalam satu baris yang bisa
 * digeser dan tombol Lainnya yang membuka sisanya beserta isinya. `arah` menentukan arah panel Lainnya: ke bawah di
 * kepala halaman, ke atas di pita sampul yang menempel di dasar layar.
 */
export default function MenuBagian({
  path,
  className,
  arah = "bawah",
}: {
  path: string;
  className: string;
  arah?: "atas" | "bawah";
}) {
  const beranda = path === "/";
  const aktif = bagianDiAlamat(path)?.id;
  const idPanel = useId();
  const nav = useRef<HTMLElement>(null);
  const gulir = useRef<HTMLDivElement>(null);
  // Panel terbuka hanya untuk alamat tempat ia dibuka, jadi pindah halaman otomatis menutupnya.
  const [bukaDi, setBukaDi] = useState<string | null>(null);
  const buka = bukaDi === path;
  const lain = BAGIAN.filter((b) => !PONSEL.has(b.id));
  const lainAktif = lain.some((b) => b.id === aktif);

  useEffect(() => {
    if (!buka) return;
    const tutup = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !nav.current?.contains(e.target as Node)) setBukaDi(null);
    };
    document.addEventListener("keydown", tutup);
    document.addEventListener("pointerdown", tutup);
    return () => {
      document.removeEventListener("keydown", tutup);
      document.removeEventListener("pointerdown", tutup);
    };
  }, [buka]);

  // Di ponsel barisnya bisa lebih lebar dari layar: bagian yang sedang dibuka digeser ke dalam layar.
  useEffect(() => {
    const wadah = gulir.current;
    const el = wadah?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!wadah || !el || wadah.scrollWidth <= wadah.clientWidth) return;
    wadah.scrollLeft = el.offsetLeft - wadah.offsetLeft - (wadah.clientWidth - el.offsetWidth) / 2;
  }, [aktif]);

  return (
    <nav ref={nav} className={className} aria-label="Bagian situs">
      {/* Di layar lebar pembungkus ini tidak membentuk kotak (display: contents); di ponsel ia baris yang digeser. */}
      <div ref={gulir} className="bch-menu-gulir">
        <Link href="/" className="bch-menu-beranda" aria-current={beranda ? "page" : undefined} title="Beranda">
          <Ikon d={RUMAH} />
          <span className="sr-only">Beranda</span>
        </Link>
        {BAGIAN.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            aria-current={b.id === aktif ? "page" : undefined}
            data-lain={PONSEL.has(b.id) ? undefined : ""}
          >
            {b.nama}
          </Link>
        ))}
      </div>
      <button
        type="button"
        className="bch-menu-lainnya"
        aria-expanded={buka}
        aria-controls={idPanel}
        data-aktif={lainAktif ? "" : undefined}
        onClick={() => setBukaDi(buka ? null : path)}
      >
        Lainnya
        <Ikon d={PANAH} ukuran={16} />
      </button>
      {/* Selalu ada di halaman supaya aria-controls menunjuk elemen yang ada; isinya hanya tampil saat dibuka. */}
      <div
        id={idPanel}
        className="bch-menu-panel"
        data-arah={arah}
        hidden={!buka}
        onClick={(e) => {
          if ((e.target as Element).closest("a")) setBukaDi(null);
        }}
      >
        <ul>
          {lain.map((b) => (
            <li key={b.id}>
              <Link href={b.href} className="bch-menu-panel-bagian" aria-current={b.id === aktif ? "page" : undefined}>
                {b.nama}
              </Link>
              {b.isi.length > 0 && (
                <div className="bch-menu-panel-isi">
                  {b.isi.map((s) => (
                    <Link key={s.href} href={s.href} prefetch={false}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
