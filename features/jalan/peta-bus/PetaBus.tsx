// Peta Bus Trans Batam: SVG digambar di server, geser, perbesar, dan sorot koridor di PetaBusInteraktif.
import type { CSSProperties } from "react";
import { INFO_KORIDOR, PETA } from "./data";
import PetaBusInteraktif from "./PetaBusInteraktif";
import { BANDARA, DARAT, LANDASAN, LEBAR_KANVAS, TINGGI_KANVAS } from "./siluet";
import { UKURAN, type Label } from "./susun";

const warnaKoridor = new Map(INFO_KORIDOR.map((k) => [k.id, k]));
const gaya = (id: string) => {
  const k = warnaKoridor.get(id);
  return { "--k": k?.warna, "--k-malam": k?.malam } as CSSProperties;
};

function Teks({ l, kelas }: { l: Label; kelas: string }) {
  return (
    <text
      x={l.x}
      y={l.y}
      textAnchor={l.anchor}
      fontSize={l.ukuran}
      fontWeight={l.tebal ? 700 : 400}
      className={kelas}
      data-k={l.koridor.join(" ") || undefined}
    >
      {l.baris.map((b, i) => (
        <tspan key={i} x={l.x} dy={i === 0 ? 0 : l.ukuran * 1.13}>
          {b}
        </tspan>
      ))}
    </text>
  );
}

// Jangkar dan pesawat, garis tinta, di sekitar titik (0,0).
function Ikon({ jenis, x, y }: { jenis: "pelabuhan" | "bandara"; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(1.25)`} className="pb-ikon" aria-hidden="true">
      {jenis === "pelabuhan" ? (
        <path d="M0 -5.5a1.6 1.6 0 1 0 0.01 0M0 -2.5V6M-3 -1H3M-5.5 2.2C-5 4.8 -2.6 6 0 6S5 4.8 5.5 2.2" />
      ) : (
        <path d="M6 -0.5C6.6 -1 6.6 -2 6 -2.4S4.4 -2.4 3.8 -1.8L1.6 -0.2L-4 -2.2L-5 -1.2L-0.8 1.2L-2.4 2.6L-4.2 2.2L-5 3L-2.6 4.2L-1.4 6.6L-0.6 5.8L-1 4L0.4 2.4L2.8 6.6L3.8 5.6L1.8 0Z" />
      )}
    </g>
  );
}

const garisLurus = (a: [number, number], b: [number, number]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;

/** Deret nomor koridor di bawah label terminal. */
function Lencana({ l }: { l: Label }) {
  const ukuran = 15;
  const sela = 2;
  const kor = l.koridor;
  const lebar = kor.length * ukuran + (kor.length - 1) * sela;
  const x0 = l.anchor === "start" ? l.kotak[0] : l.anchor === "end" ? l.kotak[2] - lebar : (l.kotak[0] + l.kotak[2]) / 2 - lebar / 2;
  const y0 = l.deret === "atas" ? l.kotak[1] : l.kotak[3] - ukuran;
  return (
    <g className="pb-lencana" aria-hidden="true">
      {kor.map((k, i) => (
        <g key={k} className="jl-k" style={gaya(k)} data-k={k} transform={`translate(${x0 + i * (ukuran + sela)} ${y0})`}>
          <rect width={ukuran} height={ukuran} rx={3} />
          <text x={ukuran / 2} y={ukuran / 2 + 4} textAnchor="middle" fontSize={10.5} fontWeight={700}>
            {k.replace("K", "")}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function PetaBus({ sorot }: { sorot?: string }) {
  const p = PETA;
  const labelSimpul = new Map(p.label.filter((l) => /^[A-Z0-9]+$/.test(l.id)).map((l) => [l.id, l]));
  return (
    <PetaBusInteraktif
      lebar={LEBAR_KANVAS}
      tinggi={TINGGI_KANVAS}
      batas={p.batas}
      koridor={INFO_KORIDOR}
      sorotAwal={sorot}
    >
      <g className="pb-dasar" aria-hidden="true">
        <path d={DARAT} className="pb-pantai" />
        <path d={DARAT} className="pb-darat" />
        <path d={BANDARA} className="pb-bandara" />
        <path d={LANDASAN} className="pb-landasan" />
      </g>
      <g className="pb-feri" aria-hidden="true">
        {p.feri.map((f) => (
          <g key={f.label.id}>
            <path d={f.d} />
            <Teks l={f.label} kelas="pb-l-feri" />
          </g>
        ))}
      </g>
      {p.rencana.map((r) => (
        <g key={r.id} className="pb-rencana pb-sorotan" data-k={r.id}>
          <path d={r.d} />
          <Teks l={r.label} kelas="pb-l-feri" />
        </g>
      ))}
      <g className="pb-garis">
        {p.garis.map((g) => (
          <g key={g.id} className="jl-k pb-sorotan" style={gaya(g.id)} data-k={g.id} data-garis={g.id}>
            {g.d.map((d, i) => (
              <g key={i}>
                <path d={d} className="pb-sentuh" />
                <path d={d} className="pb-selubung" strokeWidth={UKURAN.garis + 3.2} />
                <path d={d} className="pb-warna" strokeWidth={UKURAN.garis} />
              </g>
            ))}
          </g>
        ))}
      </g>
      <g className="pb-halte" aria-hidden="true">
        {p.halte.map((h) =>
          h.jenis === "tick" ? (
            <path
              key={`${h.ruas}-${h.id}`}
              d={garisLurus(h.a, h.b)}
              className="jl-k pb-tick pb-sorotan"
              style={gaya(h.koridor[0])}
              data-k={h.koridor.join(" ")}
            />
          ) : (
            <g key={`${h.ruas}-${h.id}`} className="pb-batang pb-sorotan" data-k={h.koridor.join(" ")}>
              <path d={garisLurus(h.a, h.b)} className="pb-batang-luar" />
              <path d={garisLurus(h.a, h.b)} className="pb-batang-dalam" />
            </g>
          ),
        )}
      </g>
      <g className="pb-simpul" aria-hidden="true">
        {p.simpul.map((s) => (
          <g key={s.id} className="pb-sorotan" data-k={s.koridor.join(" ")} data-utama={s.utama ? "" : undefined}>
            <path d={garisLurus(s.a, s.b)} className="pb-simpul-luar" />
            <path d={garisLurus(s.a, s.b)} className="pb-simpul-dalam" />
            {s.ikon && s.ikonDi && <Ikon jenis={s.ikon} x={s.ikonDi[0]} y={s.ikonDi[1]} />}
          </g>
        ))}
      </g>
      <g className="pb-label">
        {p.label.map((l) => {
          const simpul = labelSimpul.get(l.id) === l;
          const utama = simpul && l.tebal && l.ukuran > UKURAN.font;
          return (
            <g key={`${l.id}-${l.x}-${l.y}`} className="pb-sorotan" data-k={l.koridor.join(" ") || undefined}>
              <Teks l={l} kelas={utama ? "pb-l-utama" : simpul ? "pb-l-simpul" : "pb-l-halte"} />
              {utama && <Lencana l={l} />}
            </g>
          );
        })}
      </g>
    </PetaBusInteraktif>
  );
}
