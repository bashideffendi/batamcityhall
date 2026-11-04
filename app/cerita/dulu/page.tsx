import type { Metadata } from "next";
import CatatanMode from "@/features/tukang/CatatanMode";
import FormFoto from "@/features/tukang/FormFoto";
import { modeKiriman } from "@/features/tukang/mode";
import "@/features/tukang/tukang.css";
import Link from "next/link";
import { DaftarSumber } from "@/features/sejarah/Status";
import { ARSIP, KARTU_DULU, TAHUN_KINI, TITIK_DULU } from "@/features/sejarah/dulu";
import DuluVsSekarang from "@/features/sejarah/DuluVsSekarang";
import "@/features/sejarah/sejarah.css";

export const metadata: Metadata = {
  title: "Batam Dulu vs Sekarang",
  description:
    "Empat belas lokasi di Batam, dulu dan sekarang, dengan slider tahun dan sumber arsip yang lisensinya jelas.",
};

export default function BatamDulu() {
  const modeFoto = modeKiriman();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita" prefetch={false}>
          Loket 05
        </Link>
      </p>
      <h1 className="mt-2">Batam Dulu vs Sekarang</h1>
      <p className="bch-lede">
        Geser tahun, lihat apa yang sedang berubah. Tahun pembangunan sering berbeda antarsumber, jadi versinya ikut
        ditulis.
      </p>
      <p className="bch-note" data-catatan-foto>
        Belum ada foto lama di halaman ini. Kami belum menemukan foto per lokasi yang label lisensinya sudah dicek, jadi
        yang ada baru tautan ke arsip asli di bagian Sumber arsip.
      </p>

      <div className="mt-5">
        <DuluVsSekarang kartu={KARTU_DULU} titik={TITIK_DULU} kini={TAHUN_KINI} />
      </div>

      <section id="arsip" className="sj-jangkar mt-8" aria-labelledby="judul-arsip">
        <h2 id="judul-arsip" className="mb-2">
          Sumber arsip
        </h2>
        <p className="bch-measure mt-0">
          {ARSIP.length} lembaga. Gambar hanya boleh dipakai ulang kalau label itemnya terbuka, dan selalu dikredit
          dengan format lembaganya. Peta 1847 dan 1882 pasti ada, tetapi tautan item dan label lisensinya di Leiden
          belum kami temukan.
        </p>
        <ul className="sj-versi" data-arsip={ARSIP.length}>
          {ARSIP.map((a) => (
            <li key={a.id} className="bch-card" data-sa={a.id}>
              <h3>{a.lembaga}</h3>
              <p className="sj-kecil mt-0 mb-2">{a.koleksi}</p>
              <p className="mt-0 mb-2">{a.isi}</p>
              <div className="bch-badges">
                <span className="bch-badge" data-tone={a.pakaiUlang.nada}>
                  {a.pakaiUlang.teks}
                </span>
              </div>
              <dl className="bch-kartu-atribut">
                <div>
                  <dt>Lisensi</dt>
                  <dd>{a.lisensi}</dd>
                </div>
                <div>
                  <dt>Cara kredit</dt>
                  <dd>{a.kredit}</dd>
                </div>
              </dl>
              <DaftarSumber sumber={a.tautan} kosong="Belum ada tautan: kontak langsung ke lembaganya." />
            </li>
          ))}
        </ul>
      </section>

      <section id="kirim-foto" className="sj-jangkar mt-8" aria-labelledby="judul-kirim">
        <h2 id="judul-kirim" className="mb-2">
          Punya foto lama Batam?
        </h2>
        {modeFoto === "mati" ? (
          <>
            <p className="bch-note" data-tone="caution" data-form-tutup>
              Formulir ini belum dibuka. Belum ada yang bisa terkirim dari sini, dan tidak ada data yang disimpan.
            </p>
            <p className="bch-measure">
              Nanti warga bisa mengirim foto keluarga, dengan izin dan kredit nama, berlisensi CC BY. Sementara itu,
              ceritakan fotonya lewat{" "}
              <Link href="/kontribusi" prefetch={false}>
                Cara Berkontribusi
              </Link>
              .
            </p>
            <fieldset className="sj-form-tutup" disabled>
              <legend>Kirim foto lama (belum dibuka)</legend>
              <label className="bch-field">
                Tahun atau perkiraan tahun
                <input className="bch-input" type="text" name="tahun" />
              </label>
              <label className="bch-field">
                Lokasi di foto
                <input className="bch-input" type="text" name="lokasi" />
              </label>
              <label className="bch-field">
                Nama untuk kredit
                <input className="bch-input" type="text" name="kredit" />
              </label>
              <label className="bch-field">
                Berkas foto
                <input className="bch-input" type="file" name="foto" />
              </label>
              <label className="sj-centang">
                <input type="checkbox" name="izin" />
                Foto ini milik saya atau keluarga saya, dan saya izinkan tayang dengan lisensi CC BY.
              </label>
              <button type="button" className="bch-btn">
                Belum bisa dikirim
              </button>
            </fieldset>
          </>
        ) : (
          <>
            <CatatanMode mode={modeFoto} />
            <p className="bch-measure">
              Berlisensi CC BY, dengan kredit nama Anda. Berkas fotonya kami minta setelah moderator menghubungi Anda.
            </p>
            <FormFoto />
          </>
        )}
      </section>
    </div>
  );
}
