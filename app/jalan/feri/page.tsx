import type { Metadata } from "next";
import Link from "next/link";
import { DATA_PER, KARTU_FERI, PAPAN_SCC, TAUTAN_OPERATOR } from "@/features/jalan/feri-data";
import FeriTerakhirMuat from "@/features/jalan/FeriTerakhirMuat";
import { teksTanggal } from "@/features/jalan/feri-terakhir";
import JalanNav from "@/features/jalan/JalanNav";
import KartuRuteFeri from "@/features/jalan/KartuRuteFeri";

export const metadata: Metadata = {
  title: "Feri",
  description:
    "Rute feri Batam ke Singapura, Malaysia, dan domestik. Jadwal bertanggal, harga mulai dari, tautan operator.",
};

const internasional = KARTU_FERI.filter((k) => k.jenis === "internasional");
const domestik = KARTU_FERI.filter((k) => k.jenis === "domestik");
const lainnya = KARTU_FERI.filter((k) => k.jenis === "lainnya");

export default function Feri() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 04 · Jalan-jalan</p>
      <h1 className="mt-2">Feri</h1>
      <p className="bch-lede">Ke Singapura, Malaysia, dan pulau-pulau. Jam selalu waktu lokal pelabuhan asal.</p>
      <JalanNav aktif="/jalan/feri" />

      <p className="bch-note mt-5" data-tone="caution">
        Jadwal bisa berubah, cek operator. Data per {teksTanggal(DATA_PER)}, tanggal tiap jadwal tertulis di barisnya.
        Harga adalah &quot;mulai dari&quot;, belum tentu termasuk fee dan fuel surcharge.
      </p>

      <nav aria-label="Bagian halaman feri" className="bch-sub-nav jl-nav-halaman">
        <a href="#terakhir">Feri terakhir</a>
        <a href="#internasional">Internasional</a>
        <a href="#domestik">Domestik</a>
        <a href="#operator">Tautan resmi</a>
      </nav>

      <div className="mt-6" id="terakhir">
        <FeriTerakhirMuat />
      </div>

      <h2 className="mt-7 mb-3" id="internasional">
        Internasional
      </h2>
      <p className="bch-note">
        Sejak Juli 2026 semua feri HarbourFront memakai Singapore Cruise Centre, 5 HarbourFront Avenue. Rute dan jadwal
        tidak berubah, gedung barunya sekitar 70 m dari yang lama. Status per trip ada di{" "}
        <a href={PAPAN_SCC} target="_blank" rel="noopener">
          papan Singapore Cruise Centre
        </a>
        .
      </p>
      <p className="mt-3">
        Fee dan surcharge ada di{" "}
        <Link href="/jalan/feri/panduan#biaya" prefetch={false}>
          panduan menyeberang
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
      <p className="bch-note">
        Tiket RoRo Telaga Punggur ke Tanjung Uban hanya online lewat Ferizy, tidak dijual di loket. Natuna: belum ada
        rute reguler dari Batam yang terverifikasi.
      </p>
      <div className="jl-daftar-rute">
        {domestik.map((r) => (
          <KartuRuteFeri key={r.id} r={r} />
        ))}
      </div>

      {lainnya.length > 0 && (
        <>
          <h2 className="mt-7 mb-3" id="lainnya">
            Rute lain
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
        Rute rakyat ke pulau ada di halaman{" "}
        <Link href="/jalan/pompong" prefetch={false}>
          Pompong
        </Link>
        .
      </p>

      <h2 className="mt-7 mb-3" id="operator">
        Tautan resmi
      </h2>
      <p>Klook, KKday, dan Traveloka hanya agregator. Rujukan jadwal tetap situs operator.</p>
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
    </div>
  );
}
