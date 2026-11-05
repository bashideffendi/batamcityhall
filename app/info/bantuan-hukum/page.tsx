import type { Metadata } from "next";
import Link from "next/link";
import { angkaResmi } from "@/features/direktori/angka";
import { TEMPAT, type Place } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export const metadata: Metadata = {
  title: "Bantuan Hukum",
  description: "Pos bantuan hukum di pengadilan, lembaga bantuan hukum, organisasi advokat, PPAT, dan notaris di Batam.",
};

const disub = (...sub: string[]) => TEMPAT.filter((p) => sub.includes(p.subkategori ?? ""));

function Daftar({ isi }: { isi: Place[] }) {
  return (
    <ul className="bch-daftar-baris" data-kolom="2">
      {isi.map((p) => (
        <li key={p.id}>
          <KartuTempat p={p} />
        </li>
      ))}
    </ul>
  );
}

export default function BantuanHukum() {
  const obh = angkaResmi("obh_terakreditasi_kepri");
  return (
    <div className="bch-page">
      <nav className="bch-remah" aria-label="Remah roti">
        <Link href="/info">Informasi Warga</Link>
      </nav>
      <h1 className="mt-2">Bantuan Hukum</h1>
      <p className="bch-lede">Bantuan hukum gratis ada di pos bantuan hukum pengadilan dan lembaga bantuan hukum.</p>

      <section>
        <h2 className="mt-7 mb-3">Pos Bantuan Hukum di Pengadilan</h2>
        <p className="bch-measure">
          Posbakum memberi informasi hukum, konsultasi, advis, dan bantuan membuat dokumen seperti surat gugatan (PERMA
          1/2014). Umumnya tidak mendampingi di sidang.
        </p>
        <Daftar isi={disub("posbakum")} />
      </section>

      <section>
        <h2 className="mt-7 mb-3">Lembaga Bantuan Hukum</h2>
        <p className="bch-measure">
          OBH terakreditasi BPHN mendampingi perkara dan memberi konsultasi, gratis bagi warga miskin. Syaratnya umumnya
          surat keterangan tidak mampu dan dokumen perkara. Penerima bantuan tidak boleh dimintai “uang rokok” atau “uang
          makan”.
          {obh && ` Se-Kepri ada ${obh.nilai} OBH terakreditasi (${obh.tahun}).`}
        </p>
        <Daftar isi={disub("lbh")} />
      </section>

      <section>
        <h2 className="mt-7 mb-3">Organisasi Advokat</h2>
        <p className="bch-measure">
          Daftar ini hanya memuat organisasi. Minta rujukan ke organisasinya, lalu pastikan advokatnya punya nomor KTA dan
          sudah disumpah di Pengadilan Tinggi. Peradi di Batam terpecah sehingga keduanya ditampilkan terpisah.
        </p>
        <Daftar isi={disub("organisasi_advokat")} />
      </section>

      <section id="profesi">
        <h2 className="mt-7 mb-3">PPAT dan Notaris</h2>
        <p className="bch-measure">Daftar ini belum lengkap. Pastikan status praktiknya sebelum memakai jasanya.</p>
        <Daftar isi={disub("ppat", "notaris_ppat", "pejabat_lelang_kelas_ii")} />
      </section>

      <p className="bch-note mt-7" data-catatan-hukum>
        Halaman ini adalah panduan umum, bukan nasihat hukum.
      </p>
    </div>
  );
}
