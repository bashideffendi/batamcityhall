import type { Metadata } from "next";
import { ROBOTS_TERSEMBUNYI } from "@/lib/site";
import Link from "next/link";
import { NavKampungTua, PitaBertanggal } from "@/features/kampung-tua/Bagian";
import { KAMPUNG } from "@/features/kampung-tua/data";
import { KRONOLOGI_REMPANG, LABEL_PIHAK, TANPA_TANGGAL, type ButirRempang } from "@/features/kampung-tua/rempang";
import { rapiTeks } from "@/features/sejarah/rapi";
import "@/features/kampung-tua/kampung-tua.css";

const LEDE =
  "Peristiwa di Pulau Rempang sejak 2023 disusun menurut tanggal, lengkap dengan keterangan pihak yang menyampaikannya.";

export const metadata: Metadata = {
  title: "Kronologi Rempang",
  robots: ROBOTS_TERSEMBUNYI,
  description: LEDE,
};

function Butir({ b }: { b: ButirRempang }) {
  return (
    <li data-pihak={b.pihak}>
      <span className="kt-kronologi-tgl">{rapiTeks(b.tanggal)}</span>
      <p>
        <span className="bch-badge">{LABEL_PIHAK[b.pihak]}</span>
      </p>
      <p className="kt-kronologi-isi">{rapiTeks(b.teks)}</p>
      <p className="kt-kronologi-siapa">Dicatat oleh {b.sumber.map((s) => s.label).join(", ")}</p>
    </li>
  );
}

export default function Rempang() {
  const kampung = KAMPUNG.filter((k) => k.lapisan === "rempang");
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/cerita/kampung-tua">Kampung Tua</Link> · Rempang
      </p>
      <h1 className="mt-2">Kronologi Rempang</h1>
      <PitaBertanggal />
      <p className="bch-lede">{LEDE}</p>
      <NavKampungTua aktif="rempang" />

      <p className="bch-measure mt-5">
        Halaman ini mencatat siapa mengatakan apa dan kapan. Kami tidak menyimpulkan siapa yang benar. Halaman ini tidak
        memuat batas wilayah, luas, atau status lahan.
      </p>

      <section className="kt-bagian" aria-labelledby="judul-kronologi">
        <h2 id="judul-kronologi">Peristiwa Bertanggal</h2>
        <ol className="kt-kronologi" data-kronologi-rempang>
          {KRONOLOGI_REMPANG.map((b) => (
            <Butir key={`${b.tanggal}-${b.teks}`} b={b} />
          ))}
        </ol>
      </section>

      <section className="kt-bagian" aria-labelledby="judul-tanpa-tanggal">
        <h2 id="judul-tanpa-tanggal">Pernyataan Tanpa Tanggal</h2>
        <p className="bch-measure">Tiap pihak menyebut angka berbeda tentang skala dampak.</p>
        <ul className="kt-kronologi" data-tanpa-tanggal>
          {TANPA_TANGGAL.map((b) => (
            <Butir key={b.teks} b={b} />
          ))}
        </ul>
      </section>

      <section className="kt-bagian bch-prose" aria-labelledby="judul-kampung">
        <h2 id="judul-kampung">Enam Belas Kampung Versi Ombudsman RI</h2>
        <p>Kartunya hanya memuat sejarah dan budaya.</p>
        <ul data-kampung-rempang>
          {kampung.map((k) => (
            <li key={k.id}>
              <Link href={`/cerita/kampung-tua/${k.id}`} prefetch={false}>
                {k.nama}
              </Link>
            </li>
          ))}
        </ul>
        <p>
          <Link href="/koreksi">Kirim koreksi</Link>
        </p>
      </section>
    </div>
  );
}
