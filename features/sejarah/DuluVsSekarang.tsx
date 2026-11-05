"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { keadaanPada, LABEL_KEADAAN, perhentian, type KartuDulu, type TitikDulu } from "./dulu-slider";
import { LencanaStatus } from "./Status";

const TAHUN_AWAL = 1992;

// MapLibre cukup besar dan butuh WebGL, jadi terpisah dari bundel halaman.
const PetaDulu = dynamic(() => import("./PetaDulu"), {
  ssr: false,
  loading: () => <div className="sj-peta" data-memuat aria-hidden="true" />,
});

export default function DuluVsSekarang({
  kartu,
  titik,
  kini,
}: {
  kartu: KartuDulu[];
  titik: TitikDulu[];
  kini: number;
}) {
  const henti = useMemo(() => perhentian(kartu, kini), [kartu, kini]);
  // Mulai di tahun yang banyak berubah supaya slider langsung terasa gunanya.
  const [indeks, setIndeks] = useState(() => Math.max(henti.indexOf(TAHUN_AWAL), 0));
  const [hanyaAktif, setHanyaAktif] = useState(false);
  const [dipilih, setDipilih] = useState<string | null>(null);
  const tahun = henti[indeks];

  const keadaan = useMemo(() => Object.fromEntries(kartu.map((k) => [k.id, keadaanPada(k, tahun)])), [kartu, tahun]);
  const tampil = hanyaAktif ? kartu.filter((k) => keadaan[k.id] === "dalam") : kartu;
  const punyaTitik = useMemo(() => new Set(titik.map((t) => t.pf)), [titik]);
  const jumlahAktif = kartu.filter((k) => keadaan[k.id] === "dalam").length;

  const gulirKe = (el: Element | null) => {
    const tenang =
      document.documentElement.dataset.gerak === "tenang" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ block: "center", behavior: tenang ? "auto" : "smooth" });
  };
  const pilihDariPeta = (pf: string) => {
    setDipilih(pf);
    setHanyaAktif(false);
    gulirKe(document.getElementById(pf));
  };
  const tunjukkanDiPeta = (pf: string) => {
    setDipilih(pf);
    gulirKe(document.querySelector(".sj-peta"));
  };

  return (
    <div className="sj-dulu">
      <div className="sj-slider">
        <label htmlFor="sj-tahun" className="sj-slider-label">
          Geser tahun
        </label>
        <output htmlFor="sj-tahun" className="bch-data sj-slider-tahun" data-tahun={tahun}>
          {tahun}
        </output>
        <input
          id="sj-tahun"
          type="range"
          min={0}
          max={henti.length - 1}
          step={1}
          value={indeks}
          aria-valuetext={`Tahun ${tahun}`}
          onChange={(e) => setIndeks(Number(e.target.value))}
        />
        <div className="sj-slider-ujung" aria-hidden="true">
          <span>{henti[0]}</span>
          <span>{kini}</span>
        </div>
        <p className="sj-kecil m-0" aria-live="polite">
          Tahun {tahun}: {jumlahAktif} dari {kartu.length} perubahan sedang berlangsung.
        </p>
        <label className="sj-centang">
          <input type="checkbox" checked={hanyaAktif} onChange={(e) => setHanyaAktif(e.target.checked)} />
          Hanya yang berlangsung di tahun ini
        </label>
      </div>

      <h2 className="mt-7 mb-2">Di Peta</h2>
      <p className="bch-measure mt-0">
        Peta memuat {titik.length} titik dari {punyaTitik.size} lokasi. Semua lokasi ada di daftar.
      </p>
      <p className="sj-kecil sj-legenda-peta">
        <span>
          <i className="sj-pin" data-jenis="pasti" aria-hidden="true" /> Koordinat terverifikasi
        </span>
        <span>
          <i className="sj-pin" data-jenis="kira" aria-hidden="true" /> Lokasi perkiraan
        </span>
        <span>
          <i className="sj-pin" data-jenis="aktif" aria-hidden="true" /> Warna tebal: berlangsung di tahun terpilih
        </span>
      </p>
      <PetaDulu titik={titik} keadaan={keadaan} dipilih={dipilih} onPilih={pilihDariPeta} />

      <h2 className="mt-7 mb-2">Pasangan Dulu dan Sekarang</h2>
      <p className="sj-kecil mt-0" data-jumlah-dulu={tampil.length}>
        Menampilkan {tampil.length} dari {kartu.length} lokasi.
      </p>
      {tampil.length === 0 && (
        <p className="bch-note">Tidak ada perubahan yang tercatat berlangsung di tahun {tahun}.</p>
      )}
      <ul className="sj-kartu-dulu">
        {tampil.map((k) => (
          <li
            key={k.id}
            id={k.id}
            data-pf={k.id}
            data-keadaan={keadaan[k.id]}
            data-dipilih={dipilih === k.id || undefined}
          >
            <article className="bch-card h-full">
              <p className="bch-kicker-row bch-kicker m-0">
                <span>{k.tahunKunci}</span>
              </p>
              <h3>{k.lokasi}</h3>
              <div className="bch-badges mt-1">
                <LencanaStatus status={k.status} />
              </div>
              <p className="sj-kecil mt-1 mb-0" data-sj-keadaan>
                {tahun}: {LABEL_KEADAAN[keadaan[k.id]]}
              </p>
              <hr className="bch-card-rule" />
              <dl className="sj-dulu-sekarang">
                <div data-sisi="dulu">
                  <dt>Dulu</dt>
                  <dd>{k.dulu}</dd>
                </div>
                <div data-sisi="sekarang">
                  <dt>Sekarang</dt>
                  <dd>{k.sekarang}</dd>
                </div>
              </dl>
              {k.versi && <p className="sj-kecil mt-2 mb-0">{k.versi}</p>}
              {k.catatan && <p className="sj-kecil mt-2 mb-0">{k.catatan}</p>}
              {punyaTitik.has(k.id) && (
                <button type="button" className="bch-btn sj-ke-peta" onClick={() => tunjukkanDiPeta(k.id)}>
                  Tunjukkan di peta
                </button>
              )}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
