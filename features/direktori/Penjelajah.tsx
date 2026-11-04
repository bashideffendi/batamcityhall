"use client";

import MiniSearch from "minisearch";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { isOpenNow } from "@/features/makan/lib/format";
import { useSekarang } from "@/features/makan/lib/waktu";
import { KECAMATAN } from "@/lib/data/schema";
import type { BarisIndeks } from "./data";

const LANGKAH = 40;

type Filter = { q: string; k: string; s: string; c: string; l: string; d: string; lokasi: string; buka: boolean };
const KOSONG: Filter = { q: "", k: "", s: "", c: "", l: "", d: "", lokasi: "", buka: false };

const STATUS_DATA: [string, string][] = [
  ["terverifikasi", "Terverifikasi"],
  ["perlu_cek_ulang", "Perlu cek ulang"],
  ["usang", "Mungkin usang"],
  ["sumber_tunggal", "Sumber tunggal"],
  ["rencana", "Rencana"],
  ["cerita_rakyat", "Cerita rakyat"],
];
const STATUS_LOKASI: [string, string][] = [
  ["terverifikasi", "Lokasi terverifikasi"],
  ["perlu_cek_ulang", "Lokasi perkiraan"],
  ["perlu_diisi_user", "Lokasi belum diisi"],
];

function filterDariUrl(): Filter {
  const p = new URLSearchParams(window.location.search);
  return {
    q: p.get("q") ?? "",
    k: p.get("kategori") ?? "",
    s: p.get("sub") ?? "",
    c: p.get("kecamatan") ?? "",
    l: p.get("kelurahan") ?? "",
    d: p.get("status") ?? "",
    lokasi: p.get("lokasi") ?? "",
    buka: p.get("buka") === "1",
  };
}

function tulisUrl(f: Filter) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.k) p.set("kategori", f.k);
  if (f.s) p.set("sub", f.s);
  if (f.c) p.set("kecamatan", f.c);
  if (f.l) p.set("kelurahan", f.l);
  if (f.d) p.set("status", f.d);
  if (f.lokasi) p.set("lokasi", f.lokasi);
  if (f.buka) p.set("buka", "1");
  const q = p.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${q ? `?${q}` : ""}`);
}

const LABEL_LOKASI: Record<string, string> = {
  perlu_diisi_user: "Lokasi belum diisi",
  perlu_cek_ulang: "Lokasi perkiraan",
};

type Props = { kategori: { kategori: string; nama: string }[]; kelurahan: Record<string, string[]> };

// Pencarian dan filter seluruh direktori di browser. Indeks ringkas dimuat sekali dari route statis.
export default function Penjelajah({ kategori, kelurahan }: Props) {
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
      fields: ["nama", "alt", "sl", "c", "l"],
      storeFields: [],
      searchOptions: { prefix: true, fuzzy: 0.15, combineWith: "AND" },
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

  const subTersedia = useMemo(() => {
    if (!baris || !f.k) return [];
    const m = new Map<string, string>();
    for (const b of baris) if (b.k === f.k && b.s) m.set(b.s, b.sl);
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1], "id"));
  }, [baris, f.k]);

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
        (!f.s || b.s === f.s) &&
        (!f.c || b.c === f.c) &&
        (!f.l || b.l === f.l) &&
        (!f.d || b.d === f.d) &&
        (!f.lokasi || b.t === f.lokasi) &&
        (!f.buka || (sekarang !== null && !!b.j && isOpenNow(b.j, new Date(sekarang)) === true)),
    );
  }, [baris, mesin, f, sekarang]);

  if (gagal) return <p className="bch-note">Daftar gagal dimuat. Coba muat ulang halaman ini.</p>;

  const ada = f.q || f.k || f.s || f.c || f.l || f.d || f.lokasi || f.buka;

  return (
    <div className="bch-penjelajah">
      <div className="bch-penjelajah-filter">
        <label className="bch-field bch-penjelajah-cari">
          Cari tempat
          <input
            className="bch-input"
            type="search"
            value={f.q}
            onChange={(e) => ubah({ q: e.target.value })}
            placeholder="Nama, kelurahan, atau jenis tempat"
          />
        </label>
        <label className="bch-field">
          Kategori
          <select className="bch-select" value={f.k} onChange={(e) => ubah({ k: e.target.value, s: "" })}>
            <option value="">Semua kategori</option>
            {kategori.map((k) => (
              <option key={k.kategori} value={k.kategori}>
                {k.nama}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Subkategori
          <select className="bch-select" value={f.s} disabled={!f.k} onChange={(e) => ubah({ s: e.target.value })}>
            <option value="">{f.k ? "Semua subkategori" : "Pilih kategori dulu"}</option>
            {subTersedia.map(([s, l]) => (
              <option key={s} value={s}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Kecamatan
          <select className="bch-select" value={f.c} onChange={(e) => ubah({ c: e.target.value, l: "" })}>
            <option value="">Semua kecamatan</option>
            {KECAMATAN.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Kelurahan
          <select className="bch-select" value={f.l} disabled={!f.c} onChange={(e) => ubah({ l: e.target.value })}>
            <option value="">{f.c ? "Semua kelurahan" : "Pilih kecamatan dulu"}</option>
            {(kelurahan[f.c] ?? []).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Status data
          <select className="bch-select" value={f.d} onChange={(e) => ubah({ d: e.target.value })}>
            <option value="">Semua status</option>
            {STATUS_DATA.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Lokasi di peta
          <select className="bch-select" value={f.lokasi} onChange={(e) => ubah({ lokasi: e.target.value })}>
            <option value="">Semua</option>
            {STATUS_LOKASI.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-penjelajah-cek">
          <input type="checkbox" checked={f.buka} onChange={(e) => ubah({ buka: e.target.checked })} />
          Buka sekarang (hanya yang jamnya jelas)
        </label>
      </div>

      <div className="bch-penjelajah-hasil">
        <p className="bch-data" role="status" data-jumlah={baris ? hasil.length : undefined}>
          {baris ? `${hasil.length.toLocaleString("id-ID")} tempat` : "Itik sedang berbaris…"}
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
              Hapus filter
            </button>
          )}
        </p>
        {baris && hasil.length === 0 && (
          <p>
            Belum ada data yang cocok. Kenal tempatnya? <Link href="/koreksi">Kabari kami</Link>.
          </p>
        )}
        <ul className="bch-penjelajah-daftar">
          {hasil.slice(0, tampil).map((b) => (
            <li key={b.id}>
              <Link href={`/info/tempat/${b.id}`} prefetch={false}>
                {b.nama}
              </Link>
              <span className="bch-card-loc">
                {b.sl}
                {b.c ? ` · ${b.c}` : " · Kecamatan belum diketahui"}
              </span>
              {LABEL_LOKASI[b.t] && (
                <span className="bch-badge" data-tone="info">
                  {LABEL_LOKASI[b.t]}
                </span>
              )}
              {b.b && (
                <span className="bch-badge" data-tone="caution">
                  Beta
                </span>
              )}
            </li>
          ))}
        </ul>
        {hasil.length > tampil && (
          <button type="button" className="bch-btn" data-variant="ghost" onClick={() => setTampil(tampil + LANGKAH)}>
            Tampilkan {Math.min(LANGKAH, hasil.length - tampil)} lagi
          </button>
        )}
      </div>
    </div>
  );
}
