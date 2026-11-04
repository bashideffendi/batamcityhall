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
        Terima kasih, koreksinya masuk. Moderator meninjaunya satu per satu, jadi perubahannya tidak langsung terlihat.
      </p>
    );
  }

  return (
    <form className="bch-tk-form" onSubmit={kirim} noValidate>
      <p ref={ringkasan} tabIndex={-1} className="bch-tk-galat" role="alert">
        {hasil && !hasil.ok ? hasil.pesan : ""}
      </p>
      <KolomMadu />

      <Kolom nama="jenis" label="Jenis koreksi" galat={galat.jenis}>
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
        label="Yang perlu dibetulkan"
        petunjuk="Sebutkan nama tempatnya kalau belum tertulis di atas. Sumbernya juga, kalau ada."
        galat={galat.isi}
      >
        {(a) => <textarea {...a} className="bch-textarea" name="isi" rows={5} maxLength={1500} />}
      </Kolom>

      <Kolom
        nama="kontak"
        label="Nomor HP atau surel (boleh kosong)"
        petunjuk="Tidak pernah ditampilkan. Wajib untuk permintaan soal data pribadi, supaya kami bisa memastikan itu data Anda."
        galat={galat.kontak}
      >
        {(a) => <input {...a} className="bch-input" name="kontak" maxLength={120} autoComplete="off" />}
      </Kolom>

      <CekPersetujuan nama="setuju" galat={galat.setuju} required={false}>
        Kalau saya meninggalkan kontak, saya setuju kontak itu disimpan untuk menindaklanjuti koreksi ini.
      </CekPersetujuan>

      <div>
        <button type="submit" className="bch-btn" disabled={mengirim}>
          {mengirim ? "Mengirim…" : "Kirim koreksi"}
        </button>
      </div>
    </form>
  );
}
