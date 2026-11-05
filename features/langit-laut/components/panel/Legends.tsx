import { OFS_MAX_M, OFS_SWH_COLORS } from "@/features/langit-laut/lib/radar";

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
];

/** Legenda radar: tiga kelas sesuai warna di peta (PEDOMAN 3.3, 5.2). */
export function LegendaHujan() {
  return (
    <section className="cu-legenda" aria-labelledby="cu-legenda-hujan">
      <h2 id="cu-legenda-hujan" className="cu-sub">
        Intensitas hujan
      </h2>
      <ul className="cu-legenda-hujan">
        <li>
          <i data-kelas="ringan" aria-hidden />
          Ringan
        </li>
        <li>
          <i data-kelas="sedang" aria-hidden />
          Sedang
        </li>
        <li>
          <i data-kelas="lebat" aria-hidden />
          Lebat
        </li>
      </ul>
      <p className="cu-catatan">
        Radar berpusat di Singapura sehingga pulau-pulau di selatan Batam terpantau kurang akurat. Bercak yang diam di satu
        tempat kadang bukan hujan.
      </p>
    </section>
  );
}

/** Legenda tinggi gelombang (m). */
export function LegendaGelombang() {
  return (
    <section className="cu-legenda" aria-labelledby="cu-legenda-gelombang">
      <h2 id="cu-legenda-gelombang" className="cu-sub">
        Tinggi gelombang (m)
      </h2>
      <div className="cu-skala" role="img" aria-label="Skala tinggi gelombang, 0 sampai 6 meter">
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
  ["Sangat tinggi", "4—6 m"],
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
