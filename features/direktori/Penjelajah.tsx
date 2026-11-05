"use client";

import MiniSearch from "minisearch";
import TautanKirim from "@/components/site/TautanKirim";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { isOpenNow } from "@/features/makan/lib/format";
import { useSekarang } from "@/features/makan/lib/waktu";
import { KECAMATAN } from "@/lib/data/schema";
import type { BarisIndeks } from "./data";

const LANGKAH = 40;

type Filter = { q: string; k: string; c: string; buka: boolean; igd: boolean };
const KOSONG: Filter = { q: "", k: "", c: "", buka: false, igd: false };

// Kategori yang sudah digabung: tautan lama dengan ?kategori=layanan_publik tetap berfungsi.
const KATEGORI_LAMA: Record<string, string> = { layanan_publik: "pemerintahan" };

function filterDariUrl(): Filter {
  const p = new URLSearchParams(window.location.search);
  const k = p.get("kategori") ?? "";
  return {
    q: p.get("q") ?? "",
    k: Object.hasOwn(KATEGORI_LAMA, k) ? KATEGORI_LAMA[k] : k,
    c: p.get("kecamatan") ?? "",
    buka: p.get("buka") === "1",
    igd: p.get("igd") === "1",
  };
}

function tulisUrl(f: Filter) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.k) p.set("kategori", f.k);
  if (f.c) p.set("kecamatan", f.c);
  if (f.buka) p.set("buka", "1");
  if (f.igd) p.set("igd", "1");
  const q = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}`);
}

const bukaSekarang = (b: BarisIndeks, sekarang: number | null) =>
  sekarang !== null && !!b.j && isOpenNow(b.j, new Date(sekarang)) === true;

/** Status di kanan baris: Buka sekarang, IGD 24 jam, atau jam buka (PEDOMAN 3.8). */
const statusIndeks = (b: BarisIndeks, sekarang: number | null) =>
  bukaSekarang(b, sekarang) ? "Buka Sekarang" : b.i ? "IGD 24 Jam" : b.jt;

type Props = { kategori: { kategori: string; nama: string }[]; kepala: ReactNode; ilustrasi: ReactNode; children?: ReactNode };

// Pencarian dan saringan seluruh direktori di browser. Indeks ringkas dimuat sekali dari route statis. Kolom cari
// ada di atas daftar kategori (children), dan daftar kategori disembunyikan selama hasil pencarian tampil.
export default function Penjelajah({ kategori, kepala, ilustrasi, children }: Props) {
  const [baris, setBaris] = useState<BarisIndeks[] | null>(null);
  const [gagal, setGagal] = useState(false);
  const [f, setF] = useState<Filter>(KOSONG);
  const [tampil, setTampil] = useState(LANGKAH);
  const sekarang = useSekarang();

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
        setF(filterDariUrl());
      })
      .catch(() => hidup && setGagal(true));
    return () => {
      hidup = false;
    };
  }, []);

  const mesin = useMemo(() => {
    if (!baris) return null;
    const m = new MiniSearch<BarisIndeks>({
      fields: ["nama", "alt", "sl", "c", "l", "kk"],
      storeFields: [],
      searchOptions: { prefix: true, fuzzy: 0.15, combineWith: "AND", boost: { nama: 3, alt: 2 } },
      extractField: (doc, field) => {
        const v = doc[field as keyof BarisIndeks];
        return Array.isArray(v) ? v.join(" ") : String(v ?? "");
      },
    });
    m.addAll(baris);
    return m;
  }, [baris]);

  const ubah = (bagian: Partial<Filter>) => {
    const baru = { ...f, ...bagian };
    setF(baru);
    setTampil(LANGKAH);
    tulisUrl(baru);
  };

  const hasil = useMemo(() => {
    if (!baris) return [];
    let urut = baris;
    if (f.q.trim() && mesin) {
      const perId = new Map(baris.map((b) => [b.id, b]));
      urut = mesin.search(f.q.trim()).flatMap((r) => perId.get(String(r.id)) ?? []);
    }
    return urut.filter(
      (b) =>
        (!f.k || b.k === f.k) &&
        (!f.c || b.c === f.c) &&
        (!f.igd || b.i) &&
        (!f.buka || bukaSekarang(b, sekarang)),
    );
  }, [baris, mesin, f, sekarang]);

  if (gagal) {
    return (
      <>
        <div className="bch-pembuka-cari">
          <div>{kepala}</div>
          {ilustrasi}
        </div>
        <p className="bch-catatan-halaman">Data tidak dapat dimuat. Coba muat ulang.</p>
        {children}
      </>
    );
  }

  const ada = f.q || f.k || f.c || f.buka || f.igd;
  const kata = f.q.trim();

  return (
    <>
      <div className="bch-pembuka-cari">
        <div>
          {kepala}
          <div className="bch-cari-baris bch-penjelajah-cari" role="search">
            <label className="sr-only" htmlFor="dir-cari">
              Cari nama tempat, jenis, atau kecamatan
            </label>
            <input
              id="dir-cari"
              className="bch-input bch-cari-besar"
              type="search"
              placeholder="Cari nama tempat, jenis, atau kecamatan"
              value={f.q}
              onChange={(e) => ubah({ q: e.target.value })}
            />
            <button type="button" className="bch-btn" onClick={() => document.getElementById("dir-hasil")?.scrollIntoView()}>
              Cari
            </button>
          </div>
          <div className="bch-saring-baris">
            <label className="bch-pilih-pil">
              <span className="sr-only">Kategori</span>
              <select value={f.k} onChange={(e) => ubah({ k: e.target.value, igd: false })}>
                <option value="">Kategori</option>
                {kategori.map((k) => (
                  <option key={k.kategori} value={k.kategori}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </label>
            <label className="bch-pilih-pil">
              <span className="sr-only">Kecamatan</span>
              <select value={f.c} onChange={(e) => ubah({ c: e.target.value })}>
                <option value="">Kecamatan</option>
                {KECAMATAN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label className="bch-cek-pil">
              <input type="checkbox" checked={f.buka} onChange={(e) => ubah({ buka: e.target.checked })} />
              <span>Buka Sekarang</span>
            </label>
            {f.k === "kesehatan" && (
              <label className="bch-cek-pil">
                <input type="checkbox" checked={f.igd} onChange={(e) => ubah({ igd: e.target.checked })} />
                <span>IGD 24 Jam</span>
              </label>
            )}
            <p className="bch-data bch-saring-jumlah m-0" role="status" data-jumlah={baris ? hasil.length : undefined}>
              {baris ? `${hasil.length.toLocaleString("id-ID")} tempat` : "Memuat data"}
              {ada && (
                <button
                  type="button"
                  className="bch-tautan-tombol"
                  onClick={() => {
                    setF(KOSONG);
                    setTampil(LANGKAH);
                    tulisUrl(KOSONG);
                  }}
                >
                  Hapus Saringan
                </button>
              )}
            </p>
          </div>
        </div>
        {ilustrasi}
      </div>

      {!ada && children}

      {ada && (
        <div id="dir-hasil" className="bch-seksi bch-penjelajah-hasil">
          {baris && hasil.length === 0 && (
            <p>
              {kata ? (
                <>
                  Tidak ada hasil untuk “{kata}”. Coba kata lain, <Link href={`/cari?q=${encodeURIComponent(kata)}`}>cari di seluruh situs</Link>, atau buka{" "}
                  <Link href="/info/darurat">Nomor Darurat</Link>.
                </>
              ) : (
                <>
                  Belum ada tempat di kategori ini. <TautanKirim href="/koreksi">Kirim Usulan</TautanKirim>
                </>
              )}
            </p>
          )}
          <ul className="bch-daftar-baris" data-kolom="2">
            {hasil.slice(0, tampil).map((b) => {
              const s = statusIndeks(b, sekarang);
              return (
                <li key={b.id} className="bch-baris">
                  {b.h ? (
                    <Link className="nama" href={`/info/tempat/${b.id}`} prefetch={false}>
                      {b.nama}
                    </Link>
                  ) : (
                    <span className="nama">{b.nama}</span>
                  )}
                  {s && (
                    <span className="bch-status" data-tone={s === "Buka Sekarang" || s === "IGD 24 Jam" ? "ok" : undefined}>
                      {s}
                    </span>
                  )}
                  <span className="meta">{[b.sl, [b.l, b.c].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}</span>
                </li>
              );
            })}
          </ul>
          {hasil.length > tampil && (
            <button type="button" className="bch-btn mt-4" data-variant="ghost" onClick={() => setTampil(tampil + LANGKAH)}>
              Tampilkan {Math.min(LANGKAH, hasil.length - tampil)} Tempat Lagi
            </button>
          )}
        </div>
      )}
    </>
  );
}
