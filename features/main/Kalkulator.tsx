"use client";

import { useState } from "react";
import { hitungOngkos, TARIF } from "./ongkos";

const rp = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;

export default function Kalkulator() {
  const [kurs, setKurs] = useState("");
  const [orang, setOrang] = useState("1");
  const hasil = hitungOngkos(Number(kurs.replace(/\./g, "").replace(",", ".")), Number(orang));

  return (
    <div className="mm-kalkulator">
      <label className="bch-field">
        Kurs 1 dolar Singapura, dalam rupiah
        <input
          className="bch-input"
          inputMode="decimal"
          value={kurs}
          onChange={(e) => setKurs(e.target.value)}
          placeholder="Lihat kurs hari ini, lalu isi di sini"
        />
      </label>
      <label className="bch-field">
        Berapa orang
        <input
          className="bch-input"
          type="number"
          min={1}
          max={50}
          value={orang}
          onChange={(e) => setOrang(e.target.value)}
        />
      </label>

      <div role="status" className="mm-hasil">
        {hasil ? (
          <>
            <p className="m-0">
              Ke Singapura pulang-pergi, mulai dari: <strong className="bch-data">{rp(hasil.singapura)}</strong>
            </p>
            <p className="m-0">
              Ke Nagoya naik Trans Batam, pulang-pergi: <strong className="bch-data">{rp(hasil.nagoya)}</strong>
            </p>
            <p className="mt-3 mb-0">
              Barang di Singapura harus lebih murah setidaknya <strong className="bch-data">{rp(hasil.selisih)}</strong>{" "}
              supaya ongkosnya balik. Belum termasuk makan, dan waktu Anda.
            </p>
          </>
        ) : (
          <p className="m-0">Isi kurs dulu. Kami tidak menebak kurs.</p>
        )}
      </div>

      <p className="bch-card-meta mt-4 mb-0">
        Dihitung dari: feri SGD {TARIF.feriPpSgd} PP (BatamFast, sudah termasuk fee), fuel surcharge SGD{" "}
        {TARIF.surchargeSgd} dan {rp(TARIF.surchargeRp)}, Trans Batam {rp(TARIF.busRp)} sekali naik. Data per 4 Nov
        2026, bisa berubah. Asumsi Nagoya: satu kali naik bus tiap jalan.
      </p>
    </div>
  );
}
