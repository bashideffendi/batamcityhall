"use client";

import { useState } from "react";
import { buatSlug } from "../skema";
import type { BarisUbahanFoodCourt, DataFoodCourt } from "../ubahan";
import { KolomArea, KolomPilih, KolomTeks, Pesan, useKirim } from "./Bersama";

export type FoodCourtForm = DataFoodCourt & { id: string };

type Isian = Omit<DataFoodCourt, "sumber_url"> & { sumber: string };

const KOSONG: Isian = { nama: "", kecamatan: "", alamat: "", jam: "", isi: "", tingkat: "dibaca", sumber: "" };
const BARU = "__baru";

/** Tambah dan ubah food court. Koordinat tidak diubah di sini: titik di peta diisi lewat lembar koordinat. */
export default function AdminFoodCourt({
  foodCourt,
  kecamatan,
  ubahan,
}: {
  foodCourt: FoodCourtForm[];
  kecamatan: readonly string[];
  ubahan: BarisUbahanFoodCourt[];
}) {
  const [pilih, setPilih] = useState("");
  const [f, setF] = useState<Isian>(KOSONG);
  const { galat, pesan, sibuk, kirim } = useKirim();
  const atur = (k: Partial<Isian>) => setF((x) => ({ ...x, ...k }));

  // Food court baru yang sudah disimpan tetap bisa dibuka lagi dan diubah sebelum terbit.
  const tertunda = ubahan.find((u) => u.foodcourt_id === pilih);
  const baru = pilih === BARU || !!tertunda?.baru;
  const daftar = [
    { nilai: BARU, nama: "Food Court Baru" },
    ...ubahan.filter((u) => u.baru).map((u) => ({ nilai: u.foodcourt_id, nama: `${u.data.nama} (Baru)` })),
    ...foodCourt.map((x) => ({ nilai: x.id, nama: x.nama })),
  ];

  function gantiPilihan(v: string) {
    setPilih(v);
    const d = ubahan.find((u) => u.foodcourt_id === v)?.data ?? foodCourt.find((x) => x.id === v);
    setF(
      d
        ? { nama: d.nama, kecamatan: d.kecamatan, alamat: d.alamat, jam: d.jam, isi: d.isi, tingkat: d.tingkat, sumber: d.sumber_url.join("\n") }
        : KOSONG,
    );
  }

  return (
    <>
      <form
        className="bch-adm-lembar"
        aria-labelledby="adm-fc-judul"
        onSubmit={(e) => {
          e.preventDefault();
          const { sumber, ...kolom } = f;
          const data = {
            baru,
            foodcourt_id: pilih === BARU ? buatSlug(f.nama) : pilih,
            ...kolom,
            sumber_url: sumber.split(/\s+/).filter(Boolean),
          };
          kirim({ aksi: "simpan_foodcourt", data }, "Tersimpan. Tayang setelah Terbitkan Perubahan.", () => {
            setPilih("");
            setF(KOSONG);
          });
        }}
      >
        <h2 id="adm-fc-judul" className="bch-judul-seksi">
          Tambah atau Ubah Food Court
        </h2>
        <KolomPilih nama="pilih_fc" label="Daftar Food Court" nilai={pilih} kosong="Pilih Food Court" galat={galat.foodcourt_id} pilihan={daftar} ubah={gantiPilihan} />
        {pilih && (
          <>
            <KolomTeks nama="fc_nama" label="Nama" nilai={f.nama} wajib galat={galat.nama} ubah={(v) => atur({ nama: v })} />
            <div className="bch-adm-dua">
              <KolomPilih
                nama="fc_kecamatan"
                label="Kecamatan"
                nilai={f.kecamatan}
                kosong="Pilih Kecamatan"
                galat={galat.kecamatan}
                pilihan={kecamatan.map((k) => ({ nilai: k, nama: k }))}
                ubah={(v) => atur({ kecamatan: v })}
              />
              <KolomPilih
                nama="fc_tingkat"
                label="Status Alamat"
                nilai={f.tingkat}
                galat={galat.tingkat}
                pilihan={[
                  { nilai: "dibaca", nama: "Sudah Dicek" },
                  { nilai: "daftar", nama: "Perlu Dicek" },
                ]}
                ubah={(v) => atur({ tingkat: v as Isian["tingkat"] })}
              />
            </div>
            <KolomTeks nama="fc_alamat" label="Alamat" nilai={f.alamat} wajib galat={galat.alamat} ubah={(v) => atur({ alamat: v })} />
            <KolomTeks nama="fc_jam" label="Jam Buka" nilai={f.jam} petunjuk="Misalnya 17.00–01.00" galat={galat.jam} ubah={(v) => atur({ jam: v })} />
            <KolomArea nama="fc_isi" label="Keterangan" nilai={f.isi} baris={5} wajib galat={galat.isi} ubah={(v) => atur({ isi: v })} />
            <KolomArea
              nama="fc_sumber"
              label="Tautan Sumber"
              nilai={f.sumber}
              wajib
              petunjuk="Satu tautan per baris, misalnya Google Maps atau Instagram tempatnya"
              galat={galat.sumber_url}
              ubah={(v) => atur({ sumber: v })}
            />
            <div className="bch-adm-aksi">
              <button type="submit" className="bch-btn" disabled={sibuk}>
                Simpan Food Court
              </button>
            </div>
          </>
        )}
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat" aria-labelledby="adm-fc-ubahan">
        <h2 id="adm-fc-ubahan" className="bch-judul-seksi">
          Perubahan Food Court
        </h2>
        {ubahan.length === 0 && <p>Belum ada perubahan.</p>}
        <ul className="bch-adm-baris">
          {ubahan.map((u) => (
            <li key={u.foodcourt_id}>
              <div>
                <strong>{u.data.nama}</strong>
                <span className="bch-data">{u.baru ? "Food Court Baru" : "Ubahan"}</span>
              </div>
              <div className="bch-adm-aksi">
                <button
                  type="button"
                  className="bch-btn"
                  data-variant="ghost"
                  disabled={sibuk}
                  onClick={() => {
                    if (window.confirm(`Buang perubahan "${u.data.nama}"?`)) kirim({ aksi: "hapus_foodcourt", foodcourt_id: u.foodcourt_id }, "Perubahan dibuang.");
                  }}
                >
                  Buang
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="bch-catatan-halaman">Titik food court di peta diisi lewat lembar koordinat.</p>
      </section>
    </>
  );
}
