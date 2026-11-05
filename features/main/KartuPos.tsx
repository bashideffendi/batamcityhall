"use client";

import { useEffect, useRef, useState } from "react";
import { KECAMATAN } from "@/lib/data/schema";
import { gambarKartuPos, LATAR, type Latar } from "./gambar-kartu";

const LEBAR = 1200;
const TINGGI = 800;

// Kartu pos digambar di browser. Tidak ada yang dikirim ke server.
export default function KartuPos() {
  const kanvas = useRef<HTMLCanvasElement>(null);
  const [latar, setLatar] = useState<Latar>("peta");
  const [tempat, setTempat] = useState("Batam");
  const [pesan, setPesan] = useState("Sampai jumpa di Batam.");
  const [dari, setDari] = useState("");

  useEffect(() => {
    const c = kanvas.current?.getContext("2d");
    if (!c) return;
    let hidup = true;
    const gambar = () => {
      if (hidup) gambarKartuPos(c, LEBAR, TINGGI, { latar, tempat, pesan, dari });
    };
    gambar();
    void document.fonts?.ready.then(gambar);
    return () => {
      hidup = false;
    };
  }, [latar, tempat, pesan, dari]);

  const unduh = () => {
    kanvas.current?.toBlob((b) => {
      if (!b) return;
      const url = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kartu-pos-${tempat.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="mm-kartu-pos">
      <canvas
        ref={kanvas}
        width={LEBAR}
        height={TINGGI}
        role="img"
        aria-label={`Pratinjau kartu pos dari ${tempat}. Pesan: ${pesan}`}
      />
      <div className="mm-kartu-isian">
        <label className="bch-field">
          Gambar
          <select className="bch-select" value={latar} onChange={(e) => setLatar(e.target.value as Latar)}>
            {Object.entries(LATAR).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="bch-field">
          Salam dari
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
          <textarea
            className="bch-input"
            rows={3}
            maxLength={120}
            value={pesan}
            onChange={(e) => setPesan(e.target.value)}
          />
        </label>
        <label className="bch-field">
          Dari (boleh dikosongkan)
          <input className="bch-input" maxLength={40} value={dari} onChange={(e) => setDari(e.target.value)} />
        </label>
        <button type="button" className="bch-btn" onClick={unduh}>
          Unduh kartu pos
        </button>
        <p className="bch-card-meta m-0">Dibuat di perangkatmu dan tidak dikirim ke mana pun.</p>
      </div>
    </div>
  );
}
