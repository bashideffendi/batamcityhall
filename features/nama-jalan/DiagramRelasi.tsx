import Link from "next/link";
import { RELASI, type Relasi, tokohPerId } from "./data";

// Diagram silsilah buatan sendiri, tanpa pustaka graf. Posisi diletakkan tangan supaya terbaca di lebar 360 px.
// Margin kiri dan kanan untuk garis lengkung yang melewati simpul. Tes menjaga setiap relasi ada di satu gugus.
export const LEBAR = 378;
export const W = 120;
export const H = 50;
const KIRI = 94;
const KANAN = 284;
const TENGAH = 189;

type Simpul = { id: string; nama: string; x: number; y: number };
/** ujung: garis dari sisi ke sisi, label menempel di kotak tujuan. lengkung: lewat margin luar, -1 kiri, 1 kanan. */
type Tepi = { relasi: string; label: string; lengkung?: -1 | 1; ujung?: boolean };
type Gugus = { id: string; judul: string; tinggi: number; simpul: Simpul[]; tepi: Tepi[] };

export const GUGUS: Gugus[] = [
  {
    id: "bugis-riau",
    judul: "Silsilah Bugis dan Riau",
    tinggi: 560,
    simpul: [
      { id: "raja_kecik", nama: "Raja Kecik", x: KIRI, y: 30 },
      { id: "raja_haji_fisabilillah", nama: "Raja Haji", x: KIRI, y: 130 },
      { id: "engku_haji_tua", nama: "Engku Haji Tua", x: KIRI, y: 230 },
      { id: "engku_putri", nama: "Engku Putri", x: KANAN, y: 230 },
      { id: "raja_ali_haji", nama: "Raja Ali Haji", x: KIRI, y: 330 },
      { id: "sultan_mahmud_riayat_syah", nama: "Sultan Mahmud", x: KANAN, y: 330 },
      { id: "sultan_abdul_rahman_1", nama: "Abdul Rahman I", x: KANAN, y: 430 },
      { id: "nong_isa", nama: "Nong Isa", x: KANAN, y: 530 },
    ],
    tepi: [
      { relasi: "raja_kecik>raja_haji_fisabilillah", label: "latar 1722" },
      { relasi: "raja_haji_fisabilillah>engku_haji_tua", label: "ayah-anak" },
      { relasi: "raja_haji_fisabilillah>engku_putri", label: "ayah-anak" },
      { relasi: "engku_haji_tua>raja_ali_haji", label: "ayah-anak" },
      { relasi: "raja_haji_fisabilillah>raja_ali_haji", label: "kakek-cucu", lengkung: -1 },
      { relasi: "engku_putri>engku_haji_tua", label: "saudara" },
      { relasi: "engku_putri>sultan_mahmud_riayat_syah", label: "suami-istri" },
      { relasi: "sultan_mahmud_riayat_syah>sultan_abdul_rahman_1", label: "ayah-anak" },
      { relasi: "engku_putri>sultan_abdul_rahman_1", label: "regalia 1812", lengkung: 1 },
      { relasi: "sultan_abdul_rahman_1>nong_isa", label: "mandat 1829" },
    ],
  },
  {
    id: "hikayat",
    judul: "Hang Tuah (hikayat)",
    tinggi: 470,
    simpul: [
      { id: "dang_merdu", nama: "Dang Merdu", x: KIRI, y: 60 },
      { id: "hang_tuah", nama: "Hang Tuah", x: KIRI, y: 240 },
      { id: "hang_lekir", nama: "Hang Lekir", x: KANAN, y: 30 },
      { id: "hang_lekiu", nama: "Hang Lekiu", x: KANAN, y: 110 },
      { id: "hang_kasturi", nama: "Hang Kasturi", x: KANAN, y: 190 },
      { id: "hang_jebat", nama: "Hang Jebat", x: KANAN, y: 270 },
      { id: "hang_nadim", nama: "Hang Nadim", x: KANAN, y: 350 },
      { id: "laksamana_bintan", nama: "Laksamana", x: KANAN, y: 440 },
    ],
    tepi: [
      { relasi: "dang_merdu>hang_tuah", label: "ibu-anak" },
      { relasi: "hang_tuah>hang_lekir", label: "seperguruan", ujung: true },
      { relasi: "hang_tuah>hang_lekiu", label: "seperguruan", ujung: true },
      { relasi: "hang_tuah>hang_kasturi", label: "sahabat", ujung: true },
      { relasi: "hang_tuah>hang_jebat", label: "sahabat", ujung: true },
      { relasi: "hang_tuah>hang_nadim", label: "ayah angkat", ujung: true },
      { relasi: "hang_tuah>laksamana_bintan", label: "gelar", ujung: true },
      { relasi: "hang_jebat>hang_nadim", label: "ayah-anak" },
    ],
  },
  {
    id: "riau-lingga-akhir",
    judul: "Generasi Akhir Riau-Lingga",
    tinggi: 260,
    simpul: [
      { id: "batin_limat", nama: "Batin Limat", x: TENGAH, y: 30 },
      { id: "embung_fatimah", nama: "Embung Fatimah", x: TENGAH, y: 130 },
      { id: "raja_ali_kelana", nama: "Raja Ali Kelana", x: TENGAH, y: 230 },
    ],
    tepi: [
      { relasi: "batin_limat>embung_fatimah", label: "setia 1911" },
      { relasi: "embung_fatimah>raja_ali_kelana", label: "ibu tiri" },
    ],
  },
  {
    id: "temenggung",
    judul: "Keluarga Temenggung di Bulang",
    tinggi: 60,
    simpul: [
      { id: "temenggung_abdul_jamal", nama: "Abdul Jamal", x: KIRI, y: 30 },
      { id: "raja_maimunah", nama: "Raja Maimunah", x: KANAN, y: 30 },
    ],
    tepi: [{ relasi: "temenggung_abdul_jamal>raja_maimunah", label: "suami-istri" }],
  },
  {
    id: "rokan",
    judul: "Riau Daratan",
    tinggi: 60,
    simpul: [
      { id: "tuanku_tambusai", nama: "Tuanku Tambusai", x: KIRI, y: 30 },
      { id: "sultan_zainal_abidin_rokan", nama: "Zainal Abidin", x: KANAN, y: 30 },
    ],
    tepi: [{ relasi: "tuanku_tambusai>sultan_zainal_abidin_rokan", label: "sama-sama" }],
  },
  {
    id: "otorita",
    judul: "Otorita Batam",
    tinggi: 60,
    simpul: [
      { id: "ibnu_sutowo", nama: "Ibnu Sutowo", x: KIRI, y: 30 },
      { id: "bj_habibie", nama: "B.J. Habibie", x: KANAN, y: 30 },
    ],
    tepi: [{ relasi: "ibnu_sutowo>bj_habibie", label: "pendahulu" }],
  },
];

// `kode` dipakai CSS untuk bingkai simpul. `teks` adalah label yang tampil.
const statusPendek = (id: string) => {
  const t = tokohPerId.get(id)?.status;
  if (t?.hikayat) return { kode: t.grup === "hikayat" ? "hikayat" : "semi-historis", teks: t.teks.toLowerCase() };
  return { kode: "sejarah", teks: (t?.teks ?? "Tercatat").toLowerCase() };
};

/** Titik potong garis dari pusat simpul ke tepi kotaknya, supaya panah tidak tertutup kotak. */
function tepiKotak(dari: Simpul, ke: Simpul) {
  const dx = ke.x - dari.x;
  const dy = ke.y - dari.y;
  if (dx === 0 && dy === 0) return { x: dari.x, y: dari.y };
  const skala = Math.min(dx ? W / 2 / Math.abs(dx) : Infinity, dy ? H / 2 / Math.abs(dy) : Infinity);
  return { x: dari.x + dx * skala, y: dari.y + dy * skala };
}

function Garis({ gugus, tepi, relasi }: { gugus: Gugus; tepi: Tepi; relasi: Relasi }) {
  const a = gugus.simpul.find((s) => s.id === relasi.a);
  const b = gugus.simpul.find((s) => s.id === relasi.b);
  if (!a || !b) return null;
  if (tepi.lengkung) {
    // Keluar dari sisi kotak lewat margin luar: garis lurus akan menimpa simpul di tengahnya.
    const sisi = tepi.lengkung;
    const x = a.x + (sisi * W) / 2;
    const cx = x + sisi * 52;
    const cy = (a.y + b.y) / 2;
    const lx = x + sisi * 12;
    return (
      <g data-relasi={relasi.id}>
        <path className="nj-garis" d={`M${x} ${a.y} Q${cx} ${cy} ${x} ${b.y}`} data-perlu-dicek={relasi.perluDicek} />
        <text className="nj-label" x={lx} y={cy} textAnchor="middle" transform={`rotate(-90 ${lx} ${cy})`}>
          {tepi.label}
        </text>
      </g>
    );
  }
  if (tepi.ujung) {
    const x1 = a.x + W / 2;
    const x2 = b.x - W / 2;
    return (
      <g data-relasi={relasi.id}>
        <line className="nj-garis" x1={x1} y1={a.y} x2={x2} y2={b.y} data-perlu-dicek={relasi.perluDicek} />
        <text className="nj-label" x={x2 - 3} y={b.y < a.y ? b.y - 5 : b.y + 14} textAnchor="end">
          {tepi.label}
        </text>
      </g>
    );
  }
  const p = tepiKotak(a, b);
  const q = tepiKotak(b, a);
  return (
    <g data-relasi={relasi.id}>
      <line className="nj-garis" x1={p.x} y1={p.y} x2={q.x} y2={q.y} data-perlu-dicek={relasi.perluDicek} />
      <text className="nj-label" x={(p.x + q.x) / 2} y={(p.y + q.y) / 2 + 4} textAnchor="middle">
        {tepi.label}
      </text>
    </g>
  );
}

function Graf({ g }: { g: Gugus }) {
  const perId = new Map(RELASI.map((r) => [r.id, r]));
  return (
    <figure className="nj-graf" data-gugus={g.id}>
      <figcaption>{g.judul}</figcaption>
      <svg viewBox={`0 0 ${LEBAR} ${g.tinggi}`} role="group" aria-label={`Diagram ${g.judul}`}>
        {g.tepi.map((t) => {
          const r = perId.get(t.relasi);
          return r ? <Garis key={t.relasi} gugus={g} tepi={t} relasi={r} /> : null;
        })}
        {g.simpul.map((s) => {
          const status = statusPendek(s.id);
          return (
            <a key={s.id} href={`/cerita/nama-jalan/${s.id}`} className="nj-simpul" data-status={status.kode}>
              <rect x={s.x - W / 2} y={s.y - H / 2} width={W} height={H} rx={2} />
              <text x={s.x} y={s.y - 3} textAnchor="middle" className="nj-simpul-nama">
                {s.nama}
              </text>
              <text x={s.x} y={s.y + 14} textAnchor="middle" className="nj-simpul-status">
                {status.teks}
              </text>
            </a>
          );
        })}
      </svg>
    </figure>
  );
}

export default function DiagramRelasi() {
  return (
    <>
      <div className="nj-graf-kisi">
        {GUGUS.map((g) => (
          <Graf key={g.id} g={g} />
        ))}
      </div>
      <h3 id="relasi-teks">Hubungan yang Sama dalam Teks</h3>
      <ol className="nj-relasi" data-relasi-teks>
        {RELASI.map((r) => (
          <li key={r.id}>
            <Link href={`/cerita/nama-jalan/${r.a}`} prefetch={false}>
              {r.namaA}
            </Link>{" "}
            dan{" "}
            <Link href={`/cerita/nama-jalan/${r.b}`} prefetch={false}>
              {r.namaB}
            </Link>
            : {r.jenis}.
            {r.perluDicek && (
              <>
                {" "}
                <span className="bch-badge" data-tone="caution">
                  Belum Terverifikasi
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </>
  );
}
