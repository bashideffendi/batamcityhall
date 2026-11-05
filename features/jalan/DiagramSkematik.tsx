import Link from "next/link";
import type { CSSProperties } from "react";
import { keJalur, susunDiagram, type Diagram, type GarisKoridor, type SumberSkema } from "./skema";
import {
  hitungGap,
  kelompokDariHalte,
  KORIDOR,
  namaKelompok,
  POLA,
  slugKoridor,
  warnaMalam,
  type Koridor,
} from "./trans-data";

const POLA_GAP: Record<string, string> = { K3: "K3_pergi", K8: "K8_ke_jodoh", K9: "K9_pergi" };

export const SUMBER_SKEMA: SumberSkema = {
  koridor: KORIDOR.map((k) => ({ id: k.id, status: k.status, jumlah_halte_sumber: k.jumlah_halte_sumber })),
  pola: POLA,
  kelompokDari: kelompokDariHalte,
  namaDari: namaKelompok,
  labelGapDari: (id) => {
    const p = POLA.find((x) => x.id === POLA_GAP[id]);
    if (!p) return null;
    const n = hitungGap(p);
    return n === null ? null : `sekitar ${n} halte belum tercatat`;
  },
};

const LEBAR = susunDiagram(SUMBER_SKEMA, { orientasi: "lebar" });
const HP = susunDiagram(SUMBER_SKEMA, { orientasi: "hp" });

export const gayaKoridor = (k: Pick<Koridor, "warna">) =>
  ({ "--k": k.warna, "--k-malam": warnaMalam(k.warna) }) as CSSProperties;

const perId = new Map(KORIDOR.map((k) => [k.id, k]));

// Jangkar dan pesawat, garis tinta, digambar di sekitar titik (0,0).
function Ikon({ jenis, x, y }: { jenis: "pelabuhan" | "bandara"; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="jl-ikon" aria-hidden="true">
      {jenis === "pelabuhan" ? (
        <path d="M0 -5.5a1.6 1.6 0 1 0 0.01 0M0 -2.5V6M-3 -1H3M-5.5 2.2C-5 4.8 -2.6 6 0 6S5 4.8 5.5 2.2" />
      ) : (
        <path d="M6 -0.5C6.6 -1 6.6 -2 6 -2.4S4.4 -2.4 3.8 -1.8L1.6 -0.2L-4 -2.2L-5 -1.2L-0.8 1.2L-2.4 2.6L-4.2 2.2L-5 3L-2.6 4.2L-1.4 6.6L-0.6 5.8L-1 4L0.4 2.4L2.8 6.6L3.8 5.6L1.8 0Z" />
      )}
    </g>
  );
}

function Garis({ g, d, sorot }: { g: GarisKoridor; d: Diagram; sorot?: string }) {
  const k = perId.get(g.id) as Koridor;
  const redup = sorot && sorot !== g.id;
  return (
    <Link
      href={`/jalan/trans-batam/${slugKoridor(g.id)}`}
      prefetch={false}
      className="jl-k jl-garis"
      style={gayaKoridor(k)}
      data-koridor={g.id}
      data-redup={redup ? "" : undefined}
      aria-label={`${g.id} ${k.nama}, buka halaman koridor`}
    >
      {g.segmen.map((s, i) => (
        <path key={`a${i}`} d={keJalur(s.titik)} className="jl-garis-sentuh" />
      ))}
      {g.segmen.map((s, i) =>
        s.putus ? null : (
          <path key={`c${i}`} d={keJalur(s.titik)} className="jl-garis-casing" strokeWidth={d.lebarGaris + 2.5} />
        ),
      )}
      {g.segmen.map((s, i) => (
        <path
          key={`w${i}`}
          d={keJalur(s.titik)}
          className="jl-garis-warna"
          data-putus={s.putus ? "" : undefined}
          strokeWidth={s.putus ? d.lebarGaris - 1 : d.lebarGaris}
        />
      ))}
      {g.stub && <path d={keJalur(g.stub)} className="jl-garis-warna" data-putus="" strokeWidth={d.lebarGaris - 1} />}
      {g.tick.map(([a, b], i) => (
        <path key={`t${i}`} d={keJalur([a, b])} className="jl-tick" />
      ))}
      <g transform={`translate(${g.lencana[0]} ${g.lencana[1]})`} className="jl-lencana">
        <rect x="-13" y="-9" width="26" height="18" rx="9" />
        <text textAnchor="middle" y="4" fontSize={d.fontBiasa - 1}>
          {g.id}
        </text>
      </g>
    </Link>
  );
}

function Svg({ d, sorot, judul }: { d: Diagram; sorot?: string; judul: string }) {
  return (
    <svg
      viewBox={`0 0 ${d.lebar} ${d.tinggi}`}
      className="jl-skema-svg"
      data-orientasi={d.orientasi}
      role="group"
      aria-label={judul}
      fontFamily="var(--bch-font-sans)"
    >
      {d.feri.map((f, i) => (
        <g key={i} className="jl-feri-garis" data-redup={sorot ? "" : undefined}>
          <path d={keJalur(f.titik)} />
          <text x={f.label.x} y={f.label.y} textAnchor={f.label.anchor} fontSize={d.fontBiasa - 1}>
            {f.label.teks}
          </text>
        </g>
      ))}
      <g className="jl-rencana" data-redup={sorot && sorot !== "K10" ? "" : undefined}>
        <Link href="/jalan/trans-batam/k10" prefetch={false}>
          <path d={keJalur(d.rencana.titik)} className="jl-garis-sentuh" />
          <path d={keJalur(d.rencana.titik)} className="jl-rencana-garis" />
          <text
            x={d.rencana.labelMulai.x}
            y={d.rencana.labelMulai.y}
            textAnchor={d.rencana.labelMulai.anchor}
            fontSize={d.fontBiasa - 1}
          >
            {d.rencana.labelMulai.teks}
          </text>
          <text
            x={d.rencana.labelUjung.x}
            y={d.rencana.labelUjung.y}
            textAnchor={d.rencana.labelUjung.anchor}
            fontSize={d.fontBiasa - 1}
          >
            {d.rencana.labelUjung.teks}
          </text>
        </Link>
      </g>
      {d.garis.map((g) => (
        <Garis key={g.id} g={g} d={d} sorot={sorot} />
      ))}
      {d.simpul.map((s) => {
        const redup = sorot && !s.koridor.includes(sorot);
        return (
          <g
            key={s.id}
            className="jl-simpul"
            data-transfer={s.transfer ? "" : undefined}
            data-redup={redup ? "" : undefined}
          >
            <path
              d={keJalur(s.kapsul)}
              className="jl-kapsul-luar"
              strokeWidth={s.utama || s.transfer ? (d.orientasi === "hp" ? 9 : 11) : d.orientasi === "hp" ? 7 : 8.5}
            />
            <path
              d={keJalur(s.kapsul)}
              className="jl-kapsul-dalam"
              strokeWidth={s.utama || s.transfer ? (d.orientasi === "hp" ? 5 : 6) : d.orientasi === "hp" ? 3.5 : 4.5}
            />
            {s.label && (
              <text
                x={s.label.x}
                y={s.label.y}
                textAnchor={s.label.anchor}
                fontSize={s.utama ? d.fontUtama : d.fontBiasa}
                fontWeight={s.utama ? 600 : 400}
                className="jl-simpul-label"
              >
                {s.label.baris.map((b, i) => (
                  <tspan key={i} x={s.label?.x} dy={i === 0 ? 0 : d.orientasi === "hp" ? 16 : 14}>
                    {b}
                  </tspan>
                ))}
              </text>
            )}
            {s.ikon && s.ikonDi && <Ikon jenis={s.ikon} x={s.ikonDi[0]} y={s.ikonDi[1]} />}
          </g>
        );
      })}
      {d.garis.map((g) =>
        g.labelGap ? (
          <text
            key={`gap-${g.id}`}
            x={g.labelGap.x}
            y={g.labelGap.y}
            textAnchor={g.labelGap.anchor}
            fontSize={d.fontBiasa - 1.5}
            className="jl-label-gap"
            data-redup={sorot && sorot !== g.id ? "" : undefined}
          >
            {g.labelGap.teks.map((b, i) => (
              <tspan key={i} x={g.labelGap?.x} dy={i === 0 ? 0 : 13}>
                {b}
              </tspan>
            ))}
          </text>
        ) : null,
      )}
      {d.garis.map((g) =>
        g.labelStub ? (
          <text
            key={`stub-${g.id}`}
            x={g.labelStub.x}
            y={g.labelStub.y}
            textAnchor={g.labelStub.anchor}
            fontSize={d.fontBiasa - 1}
            className="jl-label-gap"
            data-redup={sorot && sorot !== g.id ? "" : undefined}
          >
            {g.labelStub.teks}
          </text>
        ) : null,
      )}
    </svg>
  );
}

function Contoh({ children, lebar = 40 }: { children: React.ReactNode; lebar?: number }) {
  return (
    <svg width={lebar} height="20" viewBox={`0 0 ${lebar} 20`} aria-hidden="true" className="jl-legenda-simbol">
      {children}
    </svg>
  );
}

export function LegendaSkema() {
  return (
    <div className="jl-legenda">
      <h3 className="bch-kicker">Legenda</h3>
      <ul className="jl-legenda-koridor">
        {KORIDOR.map((k) => (
          <li key={k.id}>
            <Link
              href={`/jalan/trans-batam/${slugKoridor(k.id)}`}
              prefetch={false}
              className="jl-k jl-chip-tautan"
              style={gayaKoridor(k)}
              data-rencana={k.status === "rencana" ? "" : undefined}
            >
              <span className="jl-chip-warna" aria-hidden="true" />
              <span className="bch-data">{k.id}</span> {k.nama}
              {k.status === "rencana" && <span className="jl-chip-rencana">Rencana</span>}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="jl-legenda-simbol-daftar">
        <li>
          <Contoh lebar={24}>
            <path d="M12 3V17" className="jl-kapsul-luar" strokeWidth="9" />
            <path d="M12 3V17" className="jl-kapsul-dalam" strokeWidth="4.5" />
          </Contoh>
          Halte transit
        </li>
        <li>
          <Contoh lebar={24}>
            <path d="M12 10V10.01" className="jl-kapsul-luar" strokeWidth="11" />
            <path d="M12 10V10.01" className="jl-kapsul-dalam" strokeWidth="6" />
          </Contoh>
          Ujung koridor
        </li>
        <li>
          <Contoh lebar={24}>
            <Ikon jenis="pelabuhan" x={12} y={10} />
          </Contoh>
          Pelabuhan
        </li>
        <li>
          <Contoh lebar={24}>
            <Ikon jenis="bandara" x={12} y={9} />
          </Contoh>
          Bandara
        </li>
        <li>
          <Contoh>
            <path d="M2 10H38" className="jl-rencana-garis" />
          </Contoh>
          Koridor rencana
        </li>
      </ul>
    </div>
  );
}

// Dua tata letak dari data yang sama: lebar untuk layar besar, tegak untuk HP (sumbu ditukar, sudut tetap
// 0/45/90). CSS memilih salah satu, jadi tanpa JavaScript pun tampil.
export default function DiagramSkematik({ sorot, legenda = true }: { sorot?: string; legenda?: boolean }) {
  const judul = sorot
    ? `Diagram koridor Trans Batam, ${sorot} ditebalkan. Rute disederhanakan, jarak dan arah tidak sesuai peta.`
    : "Diagram koridor Trans Batam: sembilan koridor beroperasi, satu direncanakan. Rute disederhanakan, jarak dan arah tidak sesuai peta.";
  return (
    <figure className="jl-skema" data-sorot={sorot}>
      <div className="jl-skema-kanvas">
        <Svg d={LEBAR} sorot={sorot} judul={judul} />
        <Svg d={HP} sorot={sorot} judul={judul} />
      </div>
      <figcaption className="jl-catatan-kecil">Rute disederhanakan, jarak dan arah tidak sesuai peta.</figcaption>
      {legenda && <LegendaSkema />}
    </figure>
  );
}
