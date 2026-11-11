"use client";

import Image from "next/image";
import { useState } from "react";
import { KECAMATAN } from "@/lib/data/konstanta";
import { DESAIN, gambarLayar, salamDari } from "./desain";

// Kartu pos A6 dua sisi. Semua terjadi di peramban: tidak ada yang dikirim ke server.
function Depan({ gambar, tempat }: { gambar: string; tempat: string }) {
  return (
    <div className="kp-depan">
      <Image src={gambar} alt="" width={1748} height={1240} unoptimized priority />
      <p className="kp-salam">
        <span>Salam dari</span>
        {tempat}
      </p>
    </div>
  );
}

function Belakang({ pesan, dari, untuk, alamat }: { pesan: string; dari: string; untuk: string; alamat: string }) {
  const barisAlamat = alamat.split("\n").slice(0, 3);
  return (
    <div className="kp-belakang">
      <div className="kp-pesan">
        <p>{pesan}</p>
        {dari && <p className="kp-dari">{dari}</p>}
      </div>
      <div className="kp-alamat">
        <div className="kp-perangko" aria-hidden="true" />
        <p>{untuk}</p>
        {[0, 1, 2].map((i) => (
          <p key={i}>{barisAlamat[i] ?? ""}</p>
        ))}
      </div>
      <p className="kp-merek">Barelang.co</p>
    </div>
  );
}

export default function KartuPos() {
  const [desain, setDesain] = useState<string>(DESAIN[0].id);
  const [tempat, setTempat] = useState("Batam");
  const [pesan, setPesan] = useState("");
  const [dari, setDari] = useState("");
  const [untuk, setUntuk] = useState("");
  const [alamat, setAlamat] = useState("");
  const pilih = DESAIN.find((d) => d.id === desain) ?? DESAIN[0];
  const salam = salamDari(tempat);

  return (
    <>
      <div className="kp-tata">
        <div className="kp-pratinjau">
          <Depan gambar={pilih.gambar} tempat={salam} />
          <Belakang pesan={pesan} dari={dari} untuk={untuk} alamat={alamat} />
        </div>

        <div className="kp-isian">
          <fieldset className="kp-desain">
            <legend>Desain</legend>
            <div>
              {DESAIN.map((d) => (
                <label key={d.id} data-pilih={d.id === desain || undefined}>
                  <input type="radio" name="desain" value={d.id} checked={d.id === desain} onChange={() => setDesain(d.id)} />
                  <Image src={gambarLayar(d.gambar)} alt="" width={437} height={310} unoptimized loading="lazy" />
                  <span>{d.nama}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="bch-field">
            Salam Dari
            <select className="bch-select" value={tempat} onChange={(e) => setTempat(e.target.value)}>
              <option value="Batam">Batam</option>
              {KECAMATAN.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
          <label className="bch-field">
            Pesan
            <textarea className="bch-input" rows={4} maxLength={240} value={pesan} onChange={(e) => setPesan(e.target.value)} />
          </label>
          <label className="bch-field">
            Dari
            <input className="bch-input" maxLength={40} value={dari} onChange={(e) => setDari(e.target.value)} />
          </label>
          <label className="bch-field">
            Untuk
            <input className="bch-input" maxLength={60} value={untuk} onChange={(e) => setUntuk(e.target.value)} />
          </label>
          <label className="bch-field">
            Alamat
            <textarea className="bch-input" rows={3} maxLength={160} value={alamat} onChange={(e) => setAlamat(e.target.value)} />
          </label>
          <button type="button" className="bch-btn" onClick={() => window.print()}>
            Cetak
          </button>
          <p className="kp-catatan">Kertas A6 (105 × 148 mm), dua sisi. Isi kartu tidak dikirim ke mana pun.</p>
        </div>
      </div>

      {/* Hanya tampil saat dicetak: satu sisi per halaman. */}
      <div className="kp-cetak" aria-hidden="true">
        <section>
          <Depan gambar={pilih.gambar} tempat={salam} />
        </section>
        <section>
          <Belakang pesan={pesan} dari={dari} untuk={untuk} alamat={alamat} />
        </section>
      </div>
    </>
  );
}
