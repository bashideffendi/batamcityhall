"use client";

import { useState } from "react";
import { JENIS_AGENDA } from "../skema";
import type { BarisAgenda } from "../store";
import { KolomArea, KolomPilih, KolomTeks, Pesan, useKirim } from "./Bersama";

type Isian = {
  id: string | null;
  nama: string;
  jenis: string;
  mulai: string;
  selesai: string;
  jam: string;
  lokasi: string;
  penyelenggara: string;
  harga: string;
  tautan: string;
  keterangan: string;
  terbit: boolean;
};

const KOSONG: Isian = {
  id: null,
  nama: "",
  jenis: "konser",
  mulai: "",
  selesai: "",
  jam: "",
  lokasi: "",
  penyelenggara: "",
  harga: "",
  tautan: "",
  keterangan: "",
  terbit: true,
};

const keIsian = (b: BarisAgenda): Isian => ({
  id: b.id,
  nama: b.nama,
  jenis: b.jenis,
  mulai: b.mulai,
  selesai: b.selesai ?? "",
  jam: b.jam ?? "",
  lokasi: b.lokasi,
  penyelenggara: b.penyelenggara ?? "",
  harga: b.harga ?? "",
  tautan: b.tautan ?? "",
  keterangan: b.keterangan ?? "",
  terbit: b.terbit,
});

export default function AdminAgenda({ baris }: { baris: BarisAgenda[] }) {
  const [f, setF] = useState<Isian>(KOSONG);
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (k: Partial<Isian>) => setF((x) => ({ ...x, ...k }));

  return (
    <>
      <form
        className="bch-adm-lembar"
        onSubmit={(e) => {
          e.preventDefault();
          kirim({ aksi: "simpan_agenda", data: f }, f.terbit ? "Acara tampil di Things to Do." : "Draf tersimpan.", () => setF(KOSONG));
        }}
      >
        <h2 className="bch-judul-seksi">{f.id ? "Ubah Acara" : "Acara Baru"}</h2>
        <KolomTeks nama="nama" label="Nama Acara" nilai={f.nama} wajib galat={galat.nama} ubah={(v) => atur({ nama: v })} />
        <div className="bch-adm-dua">
          <KolomPilih
            nama="jenis"
            label="Jenis"
            nilai={f.jenis}
            galat={galat.jenis}
            pilihan={JENIS_AGENDA.map((j) => ({ nilai: j.slug, nama: j.nama }))}
            ubah={(v) => atur({ jenis: v })}
          />
          <KolomTeks nama="lokasi" label="Lokasi" nilai={f.lokasi} wajib galat={galat.lokasi} ubah={(v) => atur({ lokasi: v })} />
          <KolomTeks nama="mulai" label="Tanggal Mulai" tipe="date" nilai={f.mulai} wajib galat={galat.mulai} ubah={(v) => atur({ mulai: v })} />
          <KolomTeks nama="selesai" label="Tanggal Selesai" tipe="date" nilai={f.selesai} petunjuk="Kosongkan bila satu hari" galat={galat.selesai} ubah={(v) => atur({ selesai: v })} />
          <KolomTeks nama="jam" label="Jam" nilai={f.jam} petunjuk="Misalnya 19.00 WIB" galat={galat.jam} ubah={(v) => atur({ jam: v })} />
          <KolomTeks nama="harga" label="Harga Tiket" nilai={f.harga} petunjuk="Misalnya Rp150.000 atau Gratis" galat={galat.harga} ubah={(v) => atur({ harga: v })} />
          <KolomTeks nama="penyelenggara" label="Penyelenggara" nilai={f.penyelenggara} galat={galat.penyelenggara} ubah={(v) => atur({ penyelenggara: v })} />
          <KolomTeks nama="tautan" label="Tautan Sumber atau Tiket" tipe="url" nilai={f.tautan} galat={galat.tautan} ubah={(v) => atur({ tautan: v })} />
        </div>
        <KolomArea nama="keterangan" label="Keterangan" nilai={f.keterangan} galat={galat.keterangan} ubah={(v) => atur({ keterangan: v })} />
        <label className="bch-adm-cek">
          <input type="checkbox" checked={f.terbit} onChange={(e) => atur({ terbit: e.target.checked })} />
          Tampilkan di Situs
        </label>
        <div className="bch-adm-aksi">
          <button type="submit" className="bch-btn" disabled={sibuk}>
            Simpan
          </button>
          {f.id && (
            <button type="button" className="bch-btn" data-variant="ghost" onClick={() => setF(KOSONG)}>
              Batal
            </button>
          )}
        </div>
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">Semua Acara</h2>
        {baris.length === 0 && <p>Belum ada acara dari dashboard.</p>}
        <ul className="bch-adm-baris">
          {baris.map((b) => (
            <li key={b.id}>
              <div>
                <strong>{b.nama}</strong>
                <span className="bch-data">
                  {b.mulai}
                  {b.selesai ? ` sampai ${b.selesai}` : ""} · {b.lokasi} · {b.terbit ? "Tampil" : "Draf"}
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
                    if (window.confirm(`Hapus "${b.nama}"? Tidak bisa dibatalkan.`)) kirim({ aksi: "hapus_agenda", id: b.id }, "Acara dihapus.");
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
