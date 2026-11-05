"use client";

import { useState } from "react";
import { hitungOngkos, TARIF_PER, teksRupiahSekitar } from "./ongkos";

export default function Kalkulator() {
  const [kurs, setKurs] = useState("");
  const [orang, setOrang] = useState("1");
  const jumlah = Number(orang);
  const hasil = hitungOngkos(Number(kurs.replace(/\./g, "").replace(",", ".")), jumlah);

  return (
    <div className="mm-kalkulator">
      <label className="bch-field">
        Kurs 1 dolar Singapura (dalam rupiah)
        <input
          className="bch-input"
          inputMode="decimal"
          value={kurs}
          onChange={(e) => setKurs(e.target.value)}
          placeholder="Isi kurs hari ini"
        />
      </label>
      <label className="bch-field">
        Jumlah orang
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
          <p className="m-0">
            Ongkos pulang-pergi untuk {jumlah} orang sekitar{" "}
            <strong className="bch-data">{teksRupiahSekitar(hasil.singapura)}</strong>, termasuk tiket feri dan biaya
            tambahan.
          </p>
        ) : (
          <p className="m-0">Isi kurs dan jumlah orang.</p>
        )}
      </div>

      <p className="bch-card-meta mt-4 mb-0">Memakai tarif feri per {TARIF_PER}. Ongkos sebenarnya dapat berbeda.</p>
    </div>
  );
}
