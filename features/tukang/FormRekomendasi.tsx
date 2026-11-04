"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { KATEGORI_JASA, TAG_REKOMENDASI } from "./kategori";
import { CekPersetujuan, kirimJson, Kolom, KolomMadu, type JawabanKirim } from "./Kolom";

const pilihan = (data: FormData, nama: string) => data.getAll(nama).map(String);

// Daftar kecamatan lewat prop supaya modul skema (dan zod) tidak ikut ke browser.
export default function FormRekomendasi({ bulanIni, kecamatan }: { bulanIni: string; kecamatan: readonly string[] }) {
  const [hasil, setHasil] = useState<JawabanKirim | null>(null);
  const [mengirim, setMengirim] = useState(false);
  const ringkasan = useRef<HTMLParagraphElement>(null);
  const galat = hasil?.galat ?? {};

  async function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setMengirim(true);
    const j = await kirimJson("/api/tukang/rekomendasi", {
      nama_tukang: d.get("nama_tukang"),
      jasa: d.get("jasa"),
      area_kecamatan: pilihan(d, "area_kecamatan"),
      area_catatan: d.get("area_catatan"),
      panggilan: d.get("panggilan") === "on",
      cara_hubungi: d.get("cara_hubungi"),
      kapan_dipakai: d.get("kapan_dipakai"),
      cerita: d.get("cerita"),
      tag: pilihan(d, "tag"),
      kontak_perekomendasi: d.get("kontak_perekomendasi"),
      bukan_pemilik: d.get("bukan_pemilik") === "on",
      setuju: d.get("setuju") === "on",
      situs_web: d.get("situs_web"),
    });
    setMengirim(false);
    setHasil(j);
    if (!j.ok) ringkasan.current?.focus();
  }

  if (hasil?.ok) {
    return (
      <div className="bch-note" role="status">
        <p className="m-0">
          Terima kasih. Rekomendasi Anda masuk antrean moderator. Entri baru tampil setelah ada dua warga berbeda,
          tukangnya mengizinkan, dan moderator menyetujui.
        </p>
        <p className="mt-2 mb-0">
          <Link href="/tukang">Kembali ke daftar</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="bch-tk-form" onSubmit={kirim} noValidate>
      <p ref={ringkasan} tabIndex={-1} className="bch-tk-galat" role="alert">
        {hasil && !hasil.ok ? hasil.pesan : ""}
      </p>
      <KolomMadu />

      <Kolom nama="nama_tukang" label="Nama tukang atau usahanya" galat={galat.nama_tukang}>
        {(a) => <input {...a} className="bch-input" name="nama_tukang" maxLength={80} autoComplete="off" />}
      </Kolom>

      <Kolom nama="jasa" label="Jasa" galat={galat.jasa}>
        {(a) => (
          <select {...a} className="bch-select" name="jasa" defaultValue="">
            <option value="" disabled>
              Pilih jasa
            </option>
            {KATEGORI_JASA.map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.nama}
              </option>
            ))}
          </select>
        )}
      </Kolom>

      <fieldset className="bch-tk-pilihan">
        <legend>Area, boleh lebih dari satu kecamatan</legend>
        <div className="bch-tk-pilihan-isi">
          {kecamatan.map((k) => (
            <label key={k} className="bch-tk-cek">
              <input type="checkbox" name="area_kecamatan" value={k} />
              <span>{k}</span>
            </label>
          ))}
        </div>
        {galat.area_kecamatan && <span className="bch-tk-galat">{galat.area_kecamatan}</span>}
      </fieldset>

      <Kolom
        nama="area_catatan"
        label="Kelurahan atau kawasan (boleh kosong)"
        petunjuk="Cukup nama kawasannya. Jangan alamat rumah."
        galat={galat.area_catatan}
      >
        {(a) => <input {...a} className="bch-input" name="area_catatan" maxLength={120} autoComplete="off" />}
      </Kolom>

      <label className="bch-tk-cek">
        <input type="checkbox" name="panggilan" />
        <span>Bisa dipanggil ke rumah</span>
      </label>

      <Kolom
        nama="cara_hubungi"
        label="Cara menghubungi tukangnya"
        petunjuk="Tidak tampil sebelum tukangnya mengizinkan. Kami minta izinnya dulu lewat pesan singkat."
        galat={galat.cara_hubungi}
      >
        {(a) => <input {...a} className="bch-input" name="cara_hubungi" maxLength={120} autoComplete="off" />}
      </Kolom>

      <Kolom
        nama="kapan_dipakai"
        label="Kapan terakhir memakai jasanya"
        petunjuk="Bulan dan tahun. Contoh penulisan: 2026-10."
        galat={galat.kapan_dipakai}
      >
        {(a) => <input {...a} className="bch-input" type="month" name="kapan_dipakai" max={bulanIni} />}
      </Kolom>

      <Kolom
        nama="cerita"
        label="Cerita singkat"
        petunjuk="Apa yang dikerjakan dan kenapa Anda balik lagi. Tanpa nomor HP."
        galat={galat.cerita}
      >
        {(a) => <textarea {...a} className="bch-textarea" name="cerita" rows={4} maxLength={600} />}
      </Kolom>

      <fieldset className="bch-tk-pilihan">
        <legend>Tag (boleh kosong)</legend>
        <div className="bch-tk-pilihan-isi">
          {TAG_REKOMENDASI.map((t) => (
            <label key={t} className="bch-tk-cek">
              <input type="checkbox" name="tag" value={t} />
              <span>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Kolom
        nama="kontak_perekomendasi"
        label="Nomor HP atau surel Anda"
        petunjuk="Tidak pernah ditampilkan. Dipakai untuk memastikan rekomendasi datang dari warga yang berbeda."
        galat={galat.kontak_perekomendasi}
      >
        {(a) => <input {...a} className="bch-input" name="kontak_perekomendasi" maxLength={120} autoComplete="off" />}
      </Kolom>

      <CekPersetujuan nama="bukan_pemilik" galat={galat.bukan_pemilik}>
        Saya pernah memakai jasanya, dan saya bukan pemilik, keluarga, atau rekan usahanya.
      </CekPersetujuan>
      <CekPersetujuan nama="setuju" galat={galat.setuju}>
        Saya setuju kontak saya disimpan untuk keperluan di atas, dan saya bisa memintanya dihapus kapan saja lewat
        halaman <Link href="/koreksi">koreksi data</Link>. Rincian ada di <Link href="/privasi">Privasi</Link>.
      </CekPersetujuan>

      <div>
        <button type="submit" className="bch-btn" disabled={mengirim}>
          {mengirim ? "Mengirim…" : "Kirim rekomendasi"}
        </button>
      </div>
    </form>
  );
}
