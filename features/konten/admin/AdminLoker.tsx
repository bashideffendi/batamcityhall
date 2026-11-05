"use client";

import { useState } from "react";
import { JENIS_LOKER } from "../skema";
import type { BarisLoker } from "../store";
import { KolomArea, KolomPilih, KolomTeks, Pesan, useKirim } from "./Bersama";

type Isian = {
  id: string | null;
  posisi: string;
  perusahaan: string;
  jenis: string;
  lokasi: string;
  gaji: string;
  syarat: string;
  cara_melamar: string;
  tautan: string;
  tanggal: string;
  batas: string;
  terbit: boolean;
};

const kosong = (tanggal: string): Isian => ({
  id: null,
  posisi: "",
  perusahaan: "",
  jenis: "penuh-waktu",
  lokasi: "",
  gaji: "",
  syarat: "",
  cara_melamar: "",
  tautan: "",
  tanggal,
  batas: "",
  terbit: true,
});

const keIsian = (b: BarisLoker): Isian => ({
  id: b.id,
  posisi: b.posisi,
  perusahaan: b.perusahaan,
  jenis: b.jenis,
  lokasi: b.lokasi,
  gaji: b.gaji ?? "",
  syarat: b.syarat ?? "",
  cara_melamar: b.cara_melamar,
  tautan: b.tautan ?? "",
  tanggal: b.tanggal,
  batas: b.batas ?? "",
  terbit: b.terbit,
});

export default function AdminLoker({ baris, tanggal }: { baris: BarisLoker[]; tanggal: string }) {
  const [f, setF] = useState<Isian>(() => kosong(tanggal));
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (k: Partial<Isian>) => setF((x) => ({ ...x, ...k }));

  return (
    <>
      <form
        className="bch-adm-lembar"
        onSubmit={(e) => {
          e.preventDefault();
          kirim({ aksi: "simpan_loker", data: f }, f.terbit ? "Lowongan tampil di Info Loker." : "Draf tersimpan.", () => setF(kosong(tanggal)));
        }}
      >
        <h2 className="bch-judul-seksi">{f.id ? "Ubah Lowongan" : "Lowongan Baru"}</h2>
        <div className="bch-adm-dua">
          <KolomTeks nama="posisi" label="Posisi" nilai={f.posisi} wajib galat={galat.posisi} ubah={(v) => atur({ posisi: v })} />
          <KolomTeks nama="perusahaan" label="Perusahaan" nilai={f.perusahaan} wajib galat={galat.perusahaan} ubah={(v) => atur({ perusahaan: v })} />
          <KolomPilih
            nama="jenis"
            label="Jenis"
            nilai={f.jenis}
            galat={galat.jenis}
            pilihan={JENIS_LOKER.map((j) => ({ nilai: j.slug, nama: j.nama }))}
            ubah={(v) => atur({ jenis: v })}
          />
          <KolomTeks nama="lokasi" label="Lokasi" nilai={f.lokasi} wajib petunjuk="Misalnya Batamindo, Muka Kuning" galat={galat.lokasi} ubah={(v) => atur({ lokasi: v })} />
          <KolomTeks nama="gaji" label="Gaji" nilai={f.gaji} petunjuk="Kosongkan bila tidak disebut" galat={galat.gaji} ubah={(v) => atur({ gaji: v })} />
          <KolomTeks nama="tautan" label="Tautan Sumber" tipe="url" nilai={f.tautan} galat={galat.tautan} ubah={(v) => atur({ tautan: v })} />
          <KolomTeks nama="tanggal" label="Tanggal Posting" tipe="date" nilai={f.tanggal} wajib galat={galat.tanggal} ubah={(v) => atur({ tanggal: v })} />
          <KolomTeks nama="batas" label="Batas Lamaran" tipe="date" nilai={f.batas} petunjuk="Lewat tanggal ini, lowongan tidak tampil" galat={galat.batas} ubah={(v) => atur({ batas: v })} />
        </div>
        <KolomArea nama="syarat" label="Syarat" nilai={f.syarat} galat={galat.syarat} ubah={(v) => atur({ syarat: v })} />
        <KolomArea nama="cara_melamar" label="Cara Melamar" nilai={f.cara_melamar} wajib baris={2} galat={galat.cara_melamar} ubah={(v) => atur({ cara_melamar: v })} />
        <label className="bch-adm-cek">
          <input type="checkbox" checked={f.terbit} onChange={(e) => atur({ terbit: e.target.checked })} />
          Tampilkan di Situs
        </label>
        <div className="bch-adm-aksi">
          <button type="submit" className="bch-btn" disabled={sibuk}>
            Simpan Lowongan
          </button>
          {f.id && (
            <button type="button" className="bch-btn" data-variant="ghost" onClick={() => setF(kosong(tanggal))}>
              Batal
            </button>
          )}
        </div>
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Semua Lowongan</h2>
        {baris.length === 0 && <p>Belum ada lowongan.</p>}
        <ul className="bch-adm-baris">
          {baris.map((b) => (
            <li key={b.id}>
              <div>
                <strong>
                  {b.posisi}, {b.perusahaan}
                </strong>
                <span className="bch-data">
                  {b.tanggal}
                  {b.batas ? ` sampai ${b.batas}` : ""} · {b.terbit ? "Tampil" : "Draf"}
                </span>
              </div>
              <div className="bch-adm-aksi">
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  onClick={() => {
                    setF(keIsian(b));
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
                    if (window.confirm(`Hapus "${b.posisi}"? Tidak bisa dibatalkan.`)) kirim({ aksi: "hapus_loker", id: b.id }, "Lowongan dihapus.");
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
