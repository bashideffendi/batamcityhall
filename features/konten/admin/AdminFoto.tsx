"use client";

import { useMemo, useState } from "react";
import type { BarisFoto } from "../store";
import { KolomPilih, KolomTeks, Pesan, TombolUnggah, useKirim, type HasilUnggah } from "./Bersama";

/** Foto tempat makan. Dengan tempatTetap, foto langsung milik tempat yang sedang diubah. */
export default function AdminFoto({
  tempat,
  baris,
  tempatTetap,
}: {
  tempat: { id: string; nama: string }[];
  baris: BarisFoto[];
  tempatTetap?: string;
}) {
  const [pilihan, setPilihan] = useState("");
  const tempatId = tempatTetap ?? pilihan;
  const [foto, setFoto] = useState<HasilUnggah | null>(null);
  const [alt, setAlt] = useState("");
  const [kredit, setKredit] = useState("");
  const { galat, pesan, sibuk, kirim } = useKirim();
  const nama = useMemo(() => new Map(tempat.map((t) => [t.id, t.nama])), [tempat]);
  const tampil = tempatId ? baris.filter((b) => b.tempat_id === tempatId) : baris;

  return (
    <>
      <form
        className="bch-adm-lembar"
        onSubmit={(e) => {
          e.preventDefault();
          if (!foto) return;
          kirim({ aksi: "tambah_foto", data: { tempat_id: tempatId, ...foto, alt, kredit } }, "Foto tersimpan dan langsung tampil.", () => {
            setFoto(null);
            setAlt("");
          });
        }}
      >
        <h2 className="bch-judul-seksi">Tambah Foto</h2>
        {!tempatTetap && (
          <KolomPilih
            nama="tempat_id"
            label="Tempat"
            nilai={pilihan}
            kosong="Pilih Tempat"
            galat={galat.tempat_id}
            pilihan={tempat.map((t) => ({ nilai: t.id, nama: t.nama }))}
            ubah={setPilihan}
          />
        )}
        <TombolUnggah folder="makan" label={foto ? "Ganti Foto" : "Pilih Foto"} hasil={setFoto}>
          {foto && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="bch-adm-pratinjau" src={foto.src} alt="" />
            </>
          )}
        </TombolUnggah>
        <div className="bch-adm-dua">
          <KolomTeks nama="alt" label="Keterangan Foto" nilai={alt} petunjuk="Misalnya Sup ikan dengan kuah bening" galat={galat.alt} ubah={setAlt} />
          <KolomTeks nama="kredit" label="Kredit" nilai={kredit} petunjuk="Kosongkan bila foto sendiri" galat={galat.kredit} ubah={setKredit} />
        </div>
        <div className="bch-adm-aksi">
          <button type="submit" className="bch-btn" disabled={sibuk || !foto || !tempatId}>
            Simpan Foto
          </button>
        </div>
        <Pesan pesan={pesan} />
      </form>

      <section className="bch-seksi-rapat">
        <h2 className="bch-judul-seksi">{tempatId ? `Foto ${nama.get(tempatId) ?? ""}` : "Semua Foto"}</h2>
        {tampil.length === 0 && <p>Belum ada foto dari dashboard.</p>}
        <ul className="bch-adm-kisi">
          {tampil.map((b) => (
            <li key={b.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.src} alt={b.alt ?? ""} loading="lazy" />
              <span>{nama.get(b.tempat_id) ?? b.tempat_id}</span>
              {b.alt && <span className="bch-data">{b.alt}</span>}
              <button
                type="button"
                className="bch-tk-tautan"
                disabled={sibuk}
                onClick={() => {
                  if (window.confirm("Hapus foto ini? Tidak bisa dibatalkan.")) kirim({ aksi: "hapus_foto", id: b.id }, "Foto dihapus.");
                }}
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
