"use client";

import { useState } from "react";
import { buatSlug } from "../skema";
import type { BarisInfografik } from "../store";
import { KolomArea, KolomTeks, Pesan, TombolUnggah, useKirim } from "./Bersama";

type Isian = Omit<BarisInfografik, "id" | "lebar" | "tinggi"> & { id: string | null; lebar: number | null; tinggi: number | null };

const kosong = (tanggal: string): Isian => ({
  id: null,
  slug: "",
  judul: "",
  ringkasan: "",
  rubrik: "",
  tanggal,
  gambar: "",
  lebar: null,
  tinggi: null,
  deskripsi: "",
  terbit: false,
});

/** Infografik unggahan: gambar tegak, judul, dan isinya dalam teks untuk pembaca layar. */
export default function AdminInfografik({ baris, tanggal }: { baris: BarisInfografik[]; tanggal: string }) {
  const [f, setF] = useState<Isian>(() => kosong(tanggal));
  const [slugManual, setSlugManual] = useState(false);
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (k: Partial<Isian>) => setF((x) => ({ ...x, ...k }));

  return (
    <>
      <form
        className="bch-adm-lembar"
        aria-labelledby="adm-ig-judul"
        onSubmit={(e) => {
          e.preventDefault();
          kirim({ aksi: "simpan_infografik", data: f }, f.terbit ? "Infografik terbit." : "Draf tersimpan.", () => {
            setF(kosong(tanggal));
            setSlugManual(false);
          });
        }}
      >
        <h2 id="adm-ig-judul" className="bch-judul-seksi">
          {f.id ? "Ubah Infografik" : "Infografik Baru"}
        </h2>
        <KolomTeks
          nama="judul"
          label="Judul"
          nilai={f.judul}
          wajib
          galat={galat.judul}
          ubah={(v) => atur(slugManual || f.id ? { judul: v } : { judul: v, slug: buatSlug(v) })}
        />
        <div className="bch-adm-dua">
          <KolomTeks nama="rubrik" label="Rubrik" nilai={f.rubrik} wajib petunjuk="Misalnya Penduduk atau Transportasi" galat={galat.rubrik} ubah={(v) => atur({ rubrik: v })} />
          <KolomTeks nama="tanggal" label="Tanggal" tipe="date" nilai={f.tanggal} wajib galat={galat.tanggal} ubah={(v) => atur({ tanggal: v })} />
          <KolomTeks
            nama="slug"
            label="Alamat"
            nilai={f.slug}
            wajib
            petunjuk={`/infografik/${f.slug || "…"}`}
            galat={galat.slug}
            ubah={(v) => {
              setSlugManual(true);
              atur({ slug: v });
            }}
          />
        </div>
        <KolomArea nama="ringkasan" label="Ringkasan" nilai={f.ringkasan} baris={2} wajib petunjuk="Satu kalimat di bawah gambar" galat={galat.ringkasan} ubah={(v) => atur({ ringkasan: v })} />
        <TombolUnggah folder="infografik" label={f.gambar ? "Ganti Gambar" : "Unggah Gambar"} hasil={(h) => atur({ gambar: h.src, lebar: h.w, tinggi: h.h })}>
          {f.gambar && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bch-adm-pratinjau" src={f.gambar} alt="" />
              <button type="button" className="bch-tk-tautan" onClick={() => atur({ gambar: "", lebar: null, tinggi: null })}>
                Hapus Gambar
              </button>
            </>
          )}
        </TombolUnggah>
        {galat.gambar && <p className="bch-tk-galat">{galat.gambar}</p>}
        <KolomArea
          nama="deskripsi"
          label="Isi dalam Teks"
          nilai={f.deskripsi}
          baris={6}
          wajib
          petunjuk="Tulis ulang angka dan pesan di gambar, untuk pembaca layar dan mesin pencari"
          galat={galat.deskripsi}
          ubah={(v) => atur({ deskripsi: v })}
        />
        <label className="bch-adm-cek">
          <input type="checkbox" checked={f.terbit} onChange={(e) => atur({ terbit: e.target.checked })} />
          Terbitkan
        </label>
        <div className="bch-adm-aksi">
          <button type="submit" className="bch-btn" disabled={sibuk}>
            {f.terbit ? "Simpan dan Terbitkan" : "Simpan Draf"}
          </button>
          {f.id && (
            <button
              type="button"
              className="bch-btn"
              data-variant="ghost"
              onClick={() => {
                setF(kosong(tanggal));
                setSlugManual(false);
              }}
            >
              Batal
            </button>
          )}
        </div>
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat" aria-labelledby="adm-ig-semua">
        <h2 id="adm-ig-semua" className="bch-judul-seksi">
          Semua Infografik
        </h2>
        {baris.length === 0 && <p>Belum ada infografik dari dashboard. Lima poster bawaan tetap tampil.</p>}
        <ul className="bch-adm-baris">
          {baris.map((b) => (
            <li key={b.id}>
              <div>
                <strong>{b.judul}</strong>
                <span className="bch-data">
                  {b.rubrik} · {b.tanggal} · {b.terbit ? "Terbit" : "Draf"}
                </span>
              </div>
              <div className="bch-adm-aksi">
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  onClick={() => {
                    setF({ ...b });
                    setSlugManual(true);
                    window.scrollTo({ top: 0 });
                  }}
                >
                  Ubah
                </button>
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  disabled={sibuk}
                  onClick={() => {
                    if (window.confirm(`Hapus "${b.judul}"? Tidak bisa dibatalkan.`)) kirim({ aksi: "hapus_infografik", id: b.id }, "Infografik dihapus.");
                  }}
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
