"use client";

import { useState } from "react";
import { buatSlug, pecahParagraf } from "../skema";
import type { BarisJurnal } from "../store";
import { KolomArea, KolomTeks, Pesan, TombolUnggah, useKirim } from "./Bersama";

type Isian = Omit<BarisJurnal, "id" | "gambar"> & { id: string | null; gambar: string };

const kosong = (tanggal: string, penulis: string): Isian => ({
  id: null,
  slug: "",
  judul: "",
  penulis,
  tanggal,
  rubrik: "",
  ringkasan: "",
  gambar: "",
  isi: "",
  terbit: false,
});

export default function AdminJurnal({ baris, tanggal, penulis }: { baris: BarisJurnal[]; tanggal: string; penulis: string }) {
  const [f, setF] = useState<Isian>(() => kosong(tanggal, penulis));
  const [slugManual, setSlugManual] = useState(false);
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (kunci: Partial<Isian>) => setF((x) => ({ ...x, ...kunci }));
  const jumlahParagraf = pecahParagraf(f.isi).length;

  return (
    <>
      <form
        className="bch-adm-lembar"
        onSubmit={(e) => {
          e.preventDefault();
          kirim(
            { aksi: "simpan_jurnal", data: { ...f, gambar: f.gambar || null } },
            f.terbit ? "Tulisan terbit." : "Draf tersimpan.",
            () => {
              setF(kosong(tanggal, penulis));
              setSlugManual(false);
            },
          );
        }}
      >
        <h2 className="bch-judul-seksi">{f.id ? "Ubah Tulisan" : "Tulisan Baru"}</h2>
        <KolomTeks
          nama="judul"
          label="Judul"
          nilai={f.judul}
          wajib
          galat={galat.judul}
          ubah={(v) => atur(slugManual || f.id ? { judul: v } : { judul: v, slug: buatSlug(v) })}
        />
        <div className="bch-adm-dua">
          <KolomTeks nama="penulis" label="Penulis" nilai={f.penulis} wajib galat={galat.penulis} ubah={(v) => atur({ penulis: v })} />
          <KolomTeks nama="tanggal" label="Tanggal" tipe="date" nilai={f.tanggal} wajib galat={galat.tanggal} ubah={(v) => atur({ tanggal: v })} />
          <KolomTeks nama="rubrik" label="Rubrik" nilai={f.rubrik} wajib petunjuk="Misalnya Sejarah atau Kuliner" galat={galat.rubrik} ubah={(v) => atur({ rubrik: v })} />
          <KolomTeks
            nama="slug"
            label="Alamat"
            nilai={f.slug}
            wajib
            petunjuk={`/jurnal/${f.slug || "…"}`}
            galat={galat.slug}
            ubah={(v) => {
              setSlugManual(true);
              atur({ slug: v });
            }}
          />
        </div>
        <KolomArea nama="ringkasan" label="Ringkasan" nilai={f.ringkasan} baris={2} wajib petunjuk="Satu atau dua kalimat di bawah judul" galat={galat.ringkasan} ubah={(v) => atur({ ringkasan: v })} />
        <KolomArea
          nama="isi"
          label="Isi"
          nilai={f.isi}
          baris={14}
          wajib
          petunjuk={`Pisahkan paragraf dengan satu baris kosong. Sekarang ${jumlahParagraf} paragraf.`}
          galat={galat.isi}
          ubah={(v) => atur({ isi: v })}
        />
        <TombolUnggah folder="jurnal" label={f.gambar ? "Ganti Gambar" : "Unggah Gambar"} hasil={(h) => atur({ gambar: h.src })}>
          {f.gambar && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bch-adm-pratinjau" src={f.gambar} alt="" />
              <button type="button" className="bch-tk-tautan" onClick={() => atur({ gambar: "" })}>
                Hapus Gambar
              </button>
            </>
          )}
        </TombolUnggah>
        {galat.gambar && <p className="bch-tk-galat">{galat.gambar}</p>}
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
                setF(kosong(tanggal, penulis));
                setSlugManual(false);
              }}
            >
              Batal
            </button>
          )}
        </div>
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Semua Tulisan</h2>
        {baris.length === 0 && <p>Belum ada tulisan dari dashboard.</p>}
        <ul className="bch-adm-baris">
          {baris.map((b) => (
            <li key={b.id}>
              <div>
                <strong>{b.judul}</strong>
                <span className="bch-data">
                  {b.penulis} · {b.tanggal} · {b.terbit ? "Terbit" : "Draf"}
                </span>
              </div>
              <div className="bch-adm-aksi">
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  onClick={() => {
                    setF({ ...b, gambar: b.gambar ?? "" });
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
                    if (window.confirm(`Hapus "${b.judul}"? Tidak bisa dibatalkan.`)) kirim({ aksi: "hapus_jurnal", id: b.id }, "Tulisan dihapus.");
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
