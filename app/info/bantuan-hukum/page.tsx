import type { Metadata } from "next";
import Link from "next/link";
import { angkaResmi } from "@/features/direktori/angka";
import { LABEL_BETA, TEMPAT, type Place } from "@/features/direktori/data";
import KartuTempat from "@/features/direktori/KartuTempat";

export const metadata: Metadata = {
  title: "Bantuan hukum",
  description: "Posbakum gratis, LBH, organisasi advokat, PPAT, dan notaris di Batam, dengan cara mengecek statusnya.",
};

const disub = (...sub: string[]) => TEMPAT.filter((p) => sub.includes(p.subkategori ?? ""));

function Daftar({ isi }: { isi: Place[] }) {
  return (
    <ul className="bch-grid">
      {isi.map((p) => (
        <li key={p.id}>
          <KartuTempat p={p} />
        </li>
      ))}
    </ul>
  );
}

export default function BantuanHukum() {
  const notaris = angkaResmi("notaris_batam");
  const ppat = angkaResmi("anggota_ppat_batam");
  const obh = angkaResmi("obh_terakreditasi_kepri");
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/info">Info Warga</Link>
      </p>
      <h1 className="mt-2">Bantuan hukum</h1>
      <p className="bch-lede">Mulai dari yang gratis dan pasti ada: Posbakum di pengadilan.</p>
      <p className="bch-note">Halaman ini panduan arah, bukan nasihat hukum.</p>

      <section>
        <h2 className="mt-7 mb-3">Posbakum: gratis, di dalam pengadilan</h2>
        <p className="bch-measure">
          Memberi informasi hukum, konsultasi, advis, dan bantuan membuat dokumen seperti surat gugatan (PERMA 1/2014).
          Posbakum umumnya tidak mendampingi di sidang.
        </p>
        <Daftar isi={disub("posbakum")} />
      </section>

      <section>
        <h2 className="mt-7 mb-3">LBH dan OBH: kalau perlu didampingi di sidang</h2>
        <p className="bch-measure">
          OBH terakreditasi BPHN mendampingi perkara dan memberi konsultasi, gratis bagi warga miskin. Syaratnya umumnya
          surat keterangan tidak mampu dan dokumen perkara. Penerima bantuan tidak boleh dimintai &ldquo;uang
          rokok&rdquo; atau &ldquo;uang makan&rdquo;.
          {obh && ` Se-Kepri ada ${obh.nilai} OBH terakreditasi (${obh.tahun}).`} Status akreditasi tiap lembaga di
          bawah belum kami cek. Cek sendiri di sidbankum.bphn.go.id.
        </p>
        <Daftar isi={disub("lbh")} />
      </section>

      <section>
        <h2 className="mt-7 mb-3">Organisasi advokat</h2>
        <p className="bch-measure">
          Kami tidak membuat daftar advokat perorangan. Minta rujukan ke organisasinya, cek status advokat di situs
          resmi organisasinya berdasarkan nomor KTA, dan pastikan sudah disumpah di Pengadilan Tinggi. Peradi di Batam
          terpecah, jadi keduanya kami tampilkan terpisah.
        </p>
        <Daftar isi={disub("organisasi_advokat")} />
      </section>

      <section id="profesi">
        <h2 className="mt-7 mb-3">PPAT, notaris, pejabat lelang</h2>
        <p className="bch-note" data-tone="caution" data-label-beta>
          {LABEL_BETA}. Tidak ada daftar resmi terbuka yang bisa kami ambil, jadi daftar ini tidak lengkap dan bisa
          keliru. Pemilik kantor bisa <Link href="/koreksi">mengirim koreksi</Link>.
        </p>
        <p className="bch-measure mt-3">
          {notaris && `Batam punya ${notaris.nilai} notaris menurut ${notaris.sumber} (${notaris.tahun}). `}
          {ppat && `Anggota PPAT Batam tercatat ${ppat.nilai} menurut ${ppat.sumber} (${ppat.tahun}). `}
          Yang terdata di sini jauh lebih sedikit.
        </p>
        <Daftar isi={disub("ppat", "notaris_ppat", "pejabat_lelang_kelas_ii")} />
      </section>

      <section id="cek-status" className="bch-prose">
        <h2>Cek status</h2>
        <p>Sebelum memakai jasanya, pastikan statusnya sendiri:</p>
        <ul>
          <li>
            <strong>PPAT:</strong> tanyakan ke <Link href="/info/urusan-tanah">Kantor Pertanahan Kota Batam</Link>, atau
            cek lewat aplikasi atau portal resmi ATR/BPN. Pastikan wilayah kerjanya Kota Batam.
          </li>
          <li>
            <strong>Notaris:</strong> cek ke Ditjen AHU (ahu.go.id), MPD Notaris Kota Batam, atau Pengda INI Kota Batam.
          </li>
          <li>
            <strong>Pejabat lelang kelas II:</strong> lihat daftar resmi DJKN.
          </li>
          <li>
            <strong>Advokat:</strong> cek nomor KTA di situs resmi organisasinya.
          </li>
        </ul>
        <p>
          Tempat berkantor belum tentu sama dengan wilayah kerja. PPAT Sementara di kecamatan pulau belum kami ketahui,
          jadi tanyakan langsung ke Kantor Pertanahan.
        </p>
      </section>
    </div>
  );
}
