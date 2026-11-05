import { LABEL_METODE, type MetodePenduduk, type TitikPenduduk, type TitikWisman } from "./data";
import { jalurBatang, seriPenduduk, skalaLinear, titikLepas } from "./hitung-grafik";

const ribu = (n: number) => n.toLocaleString("id-ID");

function Penanda({ metode, x, y }: { metode: MetodePenduduk; x: number; y: number }) {
  if (metode === "registrasi_disdukcapil")
    return <rect x={x - 5} y={y - 5} width={10} height={10} className="sj-m" data-m={metode} />;
  if (metode === "proyeksi_bps") return <path d={`M${x} ${y - 6}l6 11h-12z`} className="sj-m" data-m={metode} />;
  if (metode === "perkiraan_populer") return <circle cx={x} cy={y} r={5} className="sj-m" data-m={metode} />;
  return <path d={`M${x} ${y - 6}l6 6-6 6-6-6z`} className="sj-m" data-m={metode} />;
}

function BidangPenduduk({ data, ringkas }: { data: TitikPenduduk[]; ringkas: boolean }) {
  const lebar = ringkas ? 340 : 720;
  const tinggi = ringkas ? 320 : 400;
  const m = ringkas ? { a: 16, k: 48, b: 28, n: 66 } : { a: 16, k: 72, b: 28, n: 96 };
  const fx = skalaLinear(1965, 2025, m.k, lebar - m.n);
  const fy = skalaLinear(0, 1_500_000, tinggi - m.b, m.a);
  const sumbuY = [0, 500_000, 1_000_000, 1_500_000];
  const sumbuX = ringkas ? [1965, 1990, 2010, 2025] : [1965, 1980, 1990, 2000, 2010, 2025];
  const akhirReg = data.filter((d) => d.metode === "registrasi_disdukcapil").at(-1)!;
  const akhirPro = data.filter((d) => d.metode === "proyeksi_bps").at(-1)!;
  const juta = (n: number) =>
    `${(n / 1_000_000).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} jt`;

  return (
    <svg
      viewBox={`0 0 ${lebar} ${tinggi}`}
      className={ringkas ? "sj-grafik sj-grafik-hp" : "sj-grafik sj-grafik-lebar"}
      role="img"
      aria-label="Grafik jumlah penduduk Batam 1965 sampai 2025, dipisah menurut metode. Angka lengkapnya ada di tabel di bawah grafik."
    >
      {sumbuY.map((v) => (
        <g key={v}>
          <line x1={m.k} x2={lebar - m.n} y1={fy(v)} y2={fy(v)} className="sj-kisi" />
          <text x={m.k - 8} y={fy(v) + 4} textAnchor="end" className="sj-g-teks">
            {v === 0 ? "0" : `${(v / 1_000_000).toLocaleString("id-ID")} ${ringkas ? "jt" : "juta"}`}
          </text>
        </g>
      ))}
      {sumbuX.map((t) => (
        <text key={t} x={fx(t)} y={tinggi - 8} textAnchor="middle" className="sj-g-teks">
          {t}
        </text>
      ))}
      {seriPenduduk(data).map((s) => (
        <polyline
          key={s.metode}
          points={s.titik.map((t) => `${fx(t.tahun)},${fy(t.jumlah)}`).join(" ")}
          className="sj-garis-data"
          data-m={s.metode}
        />
      ))}
      {[...seriPenduduk(data).flatMap((s) => s.titik), ...titikLepas(data)].map((t) => (
        <g key={t.kunci} data-titik-penduduk={t.kunci}>
          <title>{`${t.periode}: ${t.jumlahTeks} jiwa. ${LABEL_METODE[t.metode]}.`}</title>
          <circle cx={fx(t.tahun)} cy={fy(t.jumlah)} r={14} className="sj-area" />
          <Penanda metode={t.metode} x={fx(t.tahun)} y={fy(t.jumlah)} />
        </g>
      ))}
      <text x={fx(1965) + 10} y={fy(6000) - (ringkas ? 34 : 10)} className="sj-g-teks">
        sekitar 6.000
      </text>
      <text x={lebar - m.n + 10} y={fy(akhirReg.jumlah) + 4} className="sj-g-nilai">
        {ringkas ? juta(akhirReg.jumlah) : ribu(akhirReg.jumlah)}
      </text>
      <text x={lebar - m.n + 10} y={fy(akhirPro.jumlah) + 4} className="sj-g-nilai">
        {ringkas ? juta(akhirPro.jumlah) : ribu(akhirPro.jumlah)}
      </text>
    </svg>
  );
}

const KUNCI: { metode: MetodePenduduk; teks: string }[] = [
  { metode: "registrasi_disdukcapil", teks: "Registrasi Disdukcapil (KTP/KK)" },
  { metode: "proyeksi_bps", teks: "Proyeksi BPS (sensus)" },
  { metode: "perkiraan_populer", teks: "Perkiraan, satu sumber populer" },
  { metode: "catatan_bp_batam", teks: "Titik lepas: BP Batam 1965, skripsi 2012" },
];

export function GrafikPenduduk({ data }: { data: TitikPenduduk[] }) {
  return (
    <figure className="sj-figure">
      <ul className="sj-kunci">
        {KUNCI.map((k) => (
          <li key={k.metode}>
            <svg viewBox="0 0 28 14" width="28" height="14" aria-hidden="true">
              {k.metode !== "catatan_bp_batam" && (
                <line x1={0} x2={28} y1={7} y2={7} className="sj-garis-data" data-m={k.metode} />
              )}
              <Penanda metode={k.metode} x={14} y={7} />
            </svg>
            {k.teks}
          </li>
        ))}
      </ul>
      <BidangPenduduk data={data} ringkas={false} />
      <BidangPenduduk data={data} ringkas />
      <figcaption className="sj-kecil">
        Garis tidak disambung antarmetode: registrasi menghitung yang ber-KTP/KK Batam, proyeksi BPS berangkat dari
        sensus. Angka 1980 sampai 2010 berasal dari satu sumber populer tanpa rujukan primer.
      </figcaption>
    </figure>
  );
}

// Dua lebar: label angka di atas batang, jadi tidak perlu ruang di kanan batang terpanjang.
function BidangWisman({ data, lebar, kelas }: { data: TitikWisman[]; lebar: number; kelas: string }) {
  const baris = 58;
  const tinggi = baris * data.length + 8;
  const kiri = 48;
  const fx = skalaLinear(0, 1_700_000, 0, lebar - kiri - 4);
  return (
    <svg
      viewBox={`0 0 ${lebar} ${tinggi}`}
      className={`sj-grafik ${kelas}`}
      role="img"
      aria-label="Grafik batang kunjungan wisatawan mancanegara ke Batam. Angka lengkapnya ada di tabel di bawah grafik."
    >
      {data.map((d, i) => {
        const y = i * baris;
        const utama = d.jumlah ?? d.rentang?.[0] ?? 0;
        const tepi = d.rentang?.[1];
        return (
          <g key={d.tahun} data-wisman={d.tahun}>
            <title>{`${d.tahun}: ${d.teks}`}</title>
            <text x={0} y={y + 40} className="sj-g-nilai">
              {d.tahun}
            </text>
            <text x={kiri} y={y + 18} className="sj-g-teks">
              {d.jumlah != null ? ribu(d.jumlah) : "sekitar 1,1—1,19 juta (berbeda sumber)"}
            </text>
            <path d={jalurBatang(kiri, y + 26, Math.max(fx(utama), 2), 20)} className="sj-batang" />
            {tepi && (
              <rect
                x={kiri + fx(utama) + 2}
                y={y + 26}
                width={fx(tepi) - fx(utama)}
                height={20}
                className="sj-batang-rentang"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function GrafikWisman({ data }: { data: TitikWisman[] }) {
  return (
    <figure className="sj-figure">
      <BidangWisman data={data} lebar={720} kelas="sj-grafik-lebar" />
      <BidangWisman data={data} lebar={340} kelas="sj-grafik-hp" />
      <figcaption className="sj-kecil">
        Tahun 2022 tidak ada di data. Batang 2023 berarsir di ujung: dua sumber berbeda, jadi ditulis sebagai rentang.
      </figcaption>
    </figure>
  );
}
