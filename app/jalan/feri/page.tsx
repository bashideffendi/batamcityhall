import type { Metadata } from "next";
import TautanKirim from "@/components/site/TautanKirim";
import Link from "next/link";
import { DATA_PER, KARTU_FERI, PAPAN_SCC, TAUTAN_OPERATOR } from "@/features/jalan/feri-data";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";
import { teksTanggal } from "@/features/jalan/feri-terakhir";
import KartuRuteFeri from "@/features/jalan/KartuRuteFeri";

export const metadata: Metadata = {
  title: "Feri",
  description: "Jadwal feri dari Batam ke Singapura, Johor, dan pulau sekitar, memakai waktu setempat pelabuhan asal.",
};

const internasional = KARTU_FERI.filter((k) => k.jenis === "internasional");
const domestik = KARTU_FERI.filter((k) => k.jenis === "domestik");
const lainnya = KARTU_FERI.filter((k) => k.jenis === "lainnya");

export default function Feri() {
  return (
    <div className="bch-page">
      <h1 className="m-0">Feri</h1>
      <p className="bch-lede">Jadwal ke Singapura, Johor, dan pulau sekitar memakai waktu setempat pelabuhan asal.</p>

      <nav aria-label="Bagian halaman feri" className="bch-sub-nav jl-nav-halaman">
        <a href="#terakhir">Feri Terakhir</a>
        <a href="#internasional">Internasional</a>
        <a href="#domestik">Domestik</a>
        <a href="#operator">Jadwal Operator</a>
      </nav>

      <div className="mt-6" id="terakhir">
        <FeriTerakhirMuat />
      </div>

      <h2 className="mt-7 mb-3" id="internasional">
        Internasional
      </h2>
      <p className="bch-note">
        Sejak Juli 2026 semua feri HarbourFront memakai Singapore Cruise Centre, 5 HarbourFront Avenue, sekitar 70 m
        dari gedung lama. Rute dan jadwal tidak berubah. Status keberangkatan ada di{" "}
        <a href={PAPAN_SCC} target="_blank" rel="noopener">
          papan Singapore Cruise Centre
        </a>
        .
      </p>
      <p className="mt-3">
        Harga belum tentu termasuk biaya terminal dan bahan bakar. Rinciannya ada di{" "}
        <Link href="/jalan/feri/panduan#biaya" prefetch={false}>
          Panduan Menyeberang
        </Link>
        .
      </p>
      <div className="jl-daftar-rute">
        {internasional.map((r) => (
          <KartuRuteFeri key={r.id} r={r} />
        ))}
      </div>

      <h2 className="mt-7 mb-3" id="domestik">
        Domestik
      </h2>
      <p className="bch-note">Rute reguler Batam—Natuna belum tercatat.</p>
      <div className="jl-daftar-rute">
        {domestik.map((r) => (
          <KartuRuteFeri key={r.id} r={r} />
        ))}
      </div>

      {lainnya.length > 0 && (
        <>
          <h2 className="mt-7 mb-3" id="lainnya">
            Rute Lain
          </h2>
          <div className="jl-daftar-rute">
            {lainnya.map((r) => (
              <KartuRuteFeri key={r.id} r={r} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-7 mb-3" id="pompong">
        Pompong
      </h2>
      <p>
        Perahu ke pulau sekitar Batam ada di halaman{" "}
        <Link href="/jalan/pompong" prefetch={false}>
          Pompong
        </Link>
        .
      </p>

      <h2 className="mt-7 mb-3" id="operator">
        Jadwal Operator
      </h2>
      <p>Klook, KKday, dan Traveloka hanya menjual ulang tiket. Jadwal terbaru ada di situs operator.</p>
      <ul className="jl-tautan-operator">
        {TAUTAN_OPERATOR.map((o) => (
          <li key={o.url}>
            <a href={o.url} target="_blank" rel="noopener" className="jl-tautan-resmi">
              {o.nama}
            </a>
            {o.catatan && <span className="bch-card-meta"> {o.catatan}</span>}
          </li>
        ))}
      </ul>

      <p className="jl-catatan-kecil mt-7">
        Data dihimpun pada {teksTanggal(DATA_PER.slice(0, 7))}.{" "}
        <TautanKirim href="/koreksi" prefetch={false}>
          Kirim Koreksi
        </TautanKirim>
      </p>
    </div>
  );
}
