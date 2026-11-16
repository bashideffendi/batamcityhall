import { useId } from "react";
import { LEGEND, OFS_MAX_M, OFS_SWH_COLORS } from "@/features/langit-laut/lib/radar";

// Warna band mengikuti tile gelombang yang diredam di peta (PEDOMAN 5.2), jadi batangnya ikut diredam.
const OFS_GRADIENT = `linear-gradient(to right, ${OFS_SWH_COLORS.map((s, i) => {
  const from = ((s.m / OFS_MAX_M) * 100).toFixed(1);
  const to = (((OFS_SWH_COLORS[i + 1]?.m ?? OFS_MAX_M) / OFS_MAX_M) * 100).toFixed(1);
  return `${s.c} ${from}% ${to}%`;
}).join(", ")})`;
const TITIK_SKALA: { m: number; label: string }[] = [
  { m: 0, label: "0" },
  { m: 0.5, label: "0,5" },
  { m: 1.25, label: "1,25" },
  { m: 2.5, label: "2,5" },
  { m: 4, label: "4" },
  { m: 6, label: "6" },
  { m: 7, label: "7" },
];

/** Ketebalan warna tanpa mengubah kelas intensitas. */
export function RainOpacity({ opacity, onOpacity }: { opacity: number; onOpacity: (value: number) => void }) {
  return <section className="cu-opacity">
    <h2 className="cu-sub">Ketebalan Warna Radar</h2>
    <label className="cu-opacity-row">
      <span>Tipis</span>
      <input className="cu-rng" type="range" min={0.3} max={1} step={0.05}
        value={opacity} onChange={(e) => onOpacity(Number(e.target.value))}
        aria-label="Ketebalan Warna Radar" aria-valuetext={Math.round(opacity * 100) + "%"} />
      <span>Tebal</span>
    </label>
  </section>;
}

// Batas kelas sama dengan echo.ts: r=0, lalu g>=128, lalu g<128.
const RAIN_GRADIENT = "linear-gradient(to right, " + LEGEND.map((c, i) =>
  c + " " + i / LEGEND.length * 100 + "% " + (i + 1) / LEGEND.length * 100 + "%").join(", ") + ")";

export function LegendaHujan({ compact = false }: { compact?: boolean }) {
  const id = useId();
  return (
    <section className="cu-legenda" aria-labelledby={id}>
      <h2 id={id} className="cu-sub">Intensitas Hujan</h2>
      <div className="cu-rain-bar" style={{ background: RAIN_GRADIENT }} aria-hidden />
      <div className="cu-rain-classes"><span>Ringan</span><span>Sedang</span><span>Lebat</span></div>
      <p className="cu-warning-key"><i aria-hidden /> Batas Peringatan Dini</p>
      {!compact && <p className="cu-catatan">
        Radar berpusat di Singapura sehingga pulau di selatan Batam terpantau kurang akurat. Bercak yang diam kadang bukan
        hujan.
      </p>}
    </section>
  );
}

/** Legenda tinggi gelombang (m). */
export function LegendaGelombang() {
  const id = useId();
  return (
    <section className="cu-legenda" aria-labelledby={id}>
      <h2 id={id} className="cu-sub">
        Tinggi Gelombang (m)
      </h2>
      <div className="cu-skala" role="img" aria-label="Skala tinggi gelombang, 0 sampai 7 meter">
        <div className="cu-skala-batang" style={{ background: OFS_GRADIENT }} />
        <div className="cu-skala-titik" aria-hidden>
          {TITIK_SKALA.map((t) => (
            <span key={t.m} style={{ left: `${(t.m / OFS_MAX_M) * 100}%` }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const KATEGORI = [
  ["Tenang", "0—0,5 m"],
  ["Rendah", "0,5—1,25 m"],
  ["Sedang", "1,25—2,5 m"],
  ["Tinggi", "2,5—4 m"],
  ["Sangat Tinggi", "4—6 m"],
  ["Ekstrem", "lebih dari 6 m"],
];

/** Tabel Kategori Gelombang (PEDOMAN 3.3). */
export function KategoriGelombang() {
  return (
    <section aria-labelledby="cu-kategori">
      <h2 id="cu-kategori">Kategori Gelombang</h2>
      <table className="bch-table">
        <thead>
          <tr>
            <th scope="col">Kategori</th>
            <th scope="col">Tinggi</th>
          </tr>
        </thead>
        <tbody>
          {KATEGORI.map(([k, t]) => (
            <tr key={k}>
              <td>{k}</td>
              <td className="bch-data">{t}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="cu-catatan">Sebagai gambaran, gelombang di atas 1,25 m mulai berisiko bagi perahu kecil, dan di atas 2,5 m bagi kapal feri.</p>
    </section>
  );
}
