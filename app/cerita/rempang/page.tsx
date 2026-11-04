import type { Metadata } from "next";
import Link from "next/link";
import { NavKampungTua, PitaBertanggal } from "@/features/kampung-tua/Bagian";
import { KALIMAT_REMPANG, KAMPUNG, TAUTAN_REMPANG } from "@/features/kampung-tua/data";
import { KRONOLOGI_REMPANG, LABEL_PIHAK, TANPA_TANGGAL, type ButirRempang } from "@/features/kampung-tua/rempang";
import "@/features/kampung-tua/kampung-tua.css";

export const metadata: Metadata = {
  title: "Kronologi Rempang",
  description: "Fakta bertanggal soal Rempang Eco-City dengan atribusi tiap pihak. Draf, menunggu tinjauan pemilik.",
};

function Butir({ b }: { b: ButirRempang }) {
  return (
    <li data-pihak={b.pihak}>
      <span className="kt-kronologi-tgl">{b.tanggal}</span>
      <p>
        <span className="bch-badge">{LABEL_PIHAK[b.pihak]}</span>
      </p>
      <p className="kt-kronologi-isi">{b.teks}</p>
      <p className="kt-kronologi-siapa">
        Sumber:{" "}
        {b.sumber.map((s, i) => (
          <span key={s.label}>
            {i > 0 && ", "}
            {s.url ? (
              <a href={s.url} rel="noopener noreferrer">
                {s.label}
              </a>
            ) : (
              `${s.label} (tautan belum tercatat)`
            )}
          </span>
        ))}
      </p>
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
      <p className="bch-lede" data-kalimat-rempang>
        {KALIMAT_REMPANG}
      </p>
      <PitaBertanggal catatan="Peristiwa terakhir yang kami catat: 15 Juni 2026. Belum dicek ulang sejak riset November 2026." />
      <NavKampungTua aktif="rempang" />

      <p className="bch-measure mt-5">
        Halaman ini mencatat siapa mengatakan apa dan kapan. Kami tidak menyimpulkan siapa yang benar. Luas, batas, dan
        status lahan tidak kami tampilkan.
      </p>
      <p className="bch-measure">
        Baca langsung:{" "}
        {TAUTAN_REMPANG.map((t, i) => (
          <span key={t.url}>
            {i > 0 && " · "}
            <a href={t.url} rel="noopener noreferrer">
              {t.label}
            </a>
          </span>
        ))}
      </p>

      <section className="kt-bagian" aria-labelledby="judul-kronologi">
        <h2 id="judul-kronologi">Bertanggal</h2>
        <ol className="kt-kronologi" data-kronologi-rempang>
          {KRONOLOGI_REMPANG.map((b) => (
            <Butir key={`${b.tanggal}-${b.teks}`} b={b} />
          ))}
        </ol>
      </section>

      <section className="kt-bagian" aria-labelledby="judul-tanpa-tanggal">
        <h2 id="judul-tanpa-tanggal">Pernyataan yang tanggalnya belum kami catat</h2>
        <p className="bch-measure">
          Soal skala dampak, tiap pihak menyebut angka berbeda. Kami tidak mengira-ngira tanggalnya.
        </p>
        <ul className="kt-kronologi" data-tanpa-tanggal>
          {TANPA_TANGGAL.map((b) => (
            <Butir key={b.teks} b={b} />
          ))}
        </ul>
      </section>

      <section className="kt-bagian bch-prose" aria-labelledby="judul-kampung">
        <h2 id="judul-kampung">Enam belas kampung versi Ombudsman RI</h2>
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
          Ada yang keliru? <Link href="/koreksi">Kabari kami</Link>.
        </p>
      </section>
    </div>
  );
}
