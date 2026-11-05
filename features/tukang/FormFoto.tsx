"use client";

import { useRef, useState, type FormEvent } from "react";
import { CekPersetujuan, kirimJson, Kolom, KolomMadu, type JawabanKirim } from "./Kolom";

// Keterangan dan izin saja. Berkas fotonya belum bisa diunggah sampai ada bucket penyimpanan.
export default function FormFoto() {
  const [hasil, setHasil] = useState<JawabanKirim | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const ringkasan = useRef<HTMLParagraphElement>(null);
  const galat = hasil?.galat ?? {};

  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setMengirim(true);
    const j = await kirimJson("/api/kiriman-foto", {
      judul: d.get("judul"),
      lokasi: d.get("lokasi"),
      perkiraan_tahun: d.get("perkiraan_tahun"),
      cerita: d.get("cerita"),
      kredit: d.get("kredit"),
      kontak: d.get("kontak"),
      punya_hak: d.get("punya_hak") === "on",
      izin_tampil: d.get("izin_tampil") === "on",
      situs_web: d.get("situs_web"),
    });
    setMengirim(false);
    setHasil(j);
    if (!j.ok) ringkasan.current?.focus();
  }

  if (hasil?.ok) {
    return (
      <p className="bch-note" role="status">
        Terima kasih. Moderator akan menghubungi kontakmu untuk mengambil fotonya.
      </p>
    );
  }

  return (
    <form className="bch-tk-form" onSubmit={kirim} noValidate>
      <p ref={ringkasan} tabIndex={-1} className="bch-tk-galat" role="alert">
        {hasil && !hasil.ok ? hasil.pesan : ""}
      </p>
      <KolomMadu />
      <Kolom nama="judul" label="Judul atau isi foto" galat={galat.judul}>
        {(a) => <input {...a} className="bch-input" name="judul" maxLength={120} />}
      </Kolom>
      <Kolom nama="lokasi" label="Lokasi foto" petunjuk="Perkiraan juga boleh." galat={galat.lokasi}>
        {(a) => <input {...a} className="bch-input" name="lokasi" maxLength={120} />}
      </Kolom>
      <Kolom nama="perkiraan_tahun" label="Tahun atau perkiraan tahun" galat={galat.perkiraan_tahun}>
        {(a) => <input {...a} className="bch-input" name="perkiraan_tahun" maxLength={40} />}
      </Kolom>
      <Kolom nama="cerita" label="Cerita (boleh dikosongkan)" galat={galat.cerita}>
        {(a) => <textarea {...a} className="bch-textarea" name="cerita" rows={4} maxLength={800} />}
      </Kolom>
      <Kolom nama="kredit" label="Nama untuk kredit foto" galat={galat.kredit}>
        {(a) => <input {...a} className="bch-input" name="kredit" maxLength={80} />}
      </Kolom>
      <Kolom nama="kontak" label="Nomor ponsel atau surel" petunjuk="Tidak pernah ditampilkan." galat={galat.kontak}>
        {(a) => <input {...a} className="bch-input" name="kontak" maxLength={120} autoComplete="off" />}
      </Kolom>
      <CekPersetujuan nama="punya_hak" galat={galat.punya_hak}>
        Foto ini milik saya, atau saya berhak membagikannya.
      </CekPersetujuan>
      <CekPersetujuan nama="izin_tampil" galat={galat.izin_tampil}>
        Saya mengizinkan foto ini tampil di situs dengan kredit nama di atas.
      </CekPersetujuan>
      <div>
        <button type="submit" className="bch-btn" disabled={mengirim}>
          {mengirim ? "Mengirim" : "Kirim keterangan foto"}
        </button>
      </div>
    </form>
  );
}
