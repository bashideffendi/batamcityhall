"use client";

import { useRef, useState, type FormEvent } from "react";
import { JENIS_KOREKSI } from "./kategori";
import { CekPersetujuan, kirimJson, Kolom, KolomMadu, type JawabanKirim } from "./Kolom";

export default function FormKoreksi({
  tempatId,
  tukangId,
  jenisAwal,
}: {
  tempatId: string | null;
  tukangId: string | null;
  jenisAwal: string;
}) {
  const [hasil, setHasil] = useState<JawabanKirim | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const ringkasan = useRef<HTMLParagraphElement>(null);
  const galat = hasil?.galat ?? {};

  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setMengirim(true);
    const j = await kirimJson("/api/koreksi", {
      jenis: d.get("jenis"),
      tempat_id: tempatId ?? undefined,
      tukang_id: tukangId ?? undefined,
      isi: d.get("isi"),
      kontak: d.get("kontak"),
      setuju: d.get("setuju") === "on",
      situs_web: d.get("situs_web"),
    });
    setMengirim(false);
    setHasil(j);
    if (!j.ok) ringkasan.current?.focus();
  }

  if (hasil?.ok) {
    return (
      <p className="bch-note" role="status">
        Terima kasih, koreksinya masuk. Moderator meninjau satu per satu, jadi perubahan tidak langsung terlihat.
      </p>
    );
  }

  return (
    <form className="bch-tk-form" onSubmit={kirim} noValidate>
      <p ref={ringkasan} tabIndex={-1} className="bch-tk-galat" role="alert">
        {hasil && !hasil.ok ? hasil.pesan : ""}
      </p>
      <KolomMadu />

      <Kolom nama="jenis" label="Jenis Koreksi" galat={galat.jenis}>
        {(a) => (
          <select {...a} className="bch-select" name="jenis" defaultValue={jenisAwal}>
            {JENIS_KOREKSI.map((j) => (
              <option key={j.nilai} value={j.nilai}>
                {j.nama}
              </option>
            ))}
          </select>
        )}
      </Kolom>

      <Kolom
        nama="isi"
        label="Yang Perlu Diperbaiki"
        petunjuk="Sebutkan nama tempatnya bila belum tertulis di atas, juga asal informasinya bila ada."
        galat={galat.isi}
      >
        {(a) => <textarea {...a} className="bch-textarea" name="isi" rows={5} maxLength={1500} />}
      </Kolom>

      <Kolom
        nama="kontak"
        label="Nomor ponsel atau surel (boleh dikosongkan)"
        petunjuk="Tidak pernah ditampilkan. Wajib untuk permintaan data pribadi supaya kami dapat memastikan pemiliknya."
        galat={galat.kontak}
      >
        {(a) => <input {...a} className="bch-input" name="kontak" maxLength={120} autoComplete="off" />}
      </Kolom>

      <CekPersetujuan nama="setuju" galat={galat.setuju} required={false}>
        Kalau saya meninggalkan kontak, saya setuju kontak itu disimpan untuk menindaklanjuti koreksi ini.
      </CekPersetujuan>

      <div>
        <button type="submit" className="bch-btn" disabled={mengirim}>
          {mengirim ? "Mengirim" : "Kirim Koreksi"}
        </button>
      </div>
    </form>
  );
}
