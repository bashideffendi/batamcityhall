// Ikon tempat dari tools/grafis/ikon.json (PEDOMAN 5.4). Gaya A: lingkaran warna kelompok dengan ikon garis putih;
// kelompok kuning memakai ikon tinta.
import ikon from "@/tools/grafis/ikon.json";

export type KelompokId = keyof typeof ikon.kelompok_peta;
export type JenisPeta = { id: string; kelompok: KelompokId; nama: string; glyph: string };

export const KELOMPOK_PETA = ikon.kelompok_peta as Record<KelompokId, { nama: string; warna: string }>;
export const KELOMPOK_URUT = Object.keys(ikon.kelompok_peta) as KelompokId[];
export const JENIS_PETA = ikon.jenis_peta.map(({ id, kelompok, nama, glyph }) => ({ id, kelompok, nama, glyph })) as JenisPeta[];
export const KATEGORI_DIREKTORI = ikon.kategori_direktori as { nama: string; keterangan: string; glyph: string; warna: string }[];
const GLYPH = ikon.glyph as Record<string, string>;

/** Warna ikon di atas lingkaran: kelompok kuning memakai tinta supaya kontrasnya cukup. */
export const warnaIkon = (latar: string) => (latar.toUpperCase() === "#FFB511" ? "#161616" : "#FFFFFF");

/** Ikon dalam lingkaran untuk panel, legenda, dan judul kategori. */
export function IkonLingkaran({
  glyph,
  warna,
  ukuran = 26,
  garis = false,
}: {
  glyph: string;
  warna: string;
  ukuran?: number;
  /** garis putus-putus untuk lokasi perkiraan */
  garis?: boolean;
}) {
  const isi = Math.round(ukuran * 0.58);
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: ukuran,
        height: ukuran,
        flex: "none",
        borderRadius: "50%",
        background: warna,
        color: warnaIkon(warna),
        ...(garis ? { outline: `1.5px dashed ${warna}`, outlineOffset: 3 } : {}),
      }}
    >
      <svg
        width={isi}
        height={isi}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: GLYPH[glyph] ?? "" }}
      />
    </span>
  );
}

const SKALA = 2;
const SISI = 44;

/**
 * SVG penanda gaya A untuk gambar MapLibre: lingkaran 26 px, ikon 15 px, cincin putih 2 px, bayangan halus, dan
 * garis putus-putus 3 px dari lingkaran bila lokasinya perkiraan.
 */
export function svgPenanda(glyph: string, warna: string, perkiraan: boolean): string {
  const t = SISI / 2;
  const fg = warnaIkon(warna);
  const skalaIkon = 15 / 24;
  const geser = t - 7.5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SISI * SKALA}" height="${SISI * SKALA}" viewBox="0 0 ${SISI} ${SISI}">
    <defs><filter id="b" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity=".28"/></filter></defs>
    <circle cx="${t}" cy="${t}" r="15" fill="#fff" filter="url(#b)"/>
    <circle cx="${t}" cy="${t}" r="13" fill="${warna}"/>
    ${perkiraan ? `<circle cx="${t}" cy="${t}" r="18" fill="none" stroke="${warna}" stroke-width="1.5" stroke-dasharray="3 3"/>` : ""}
    <g transform="translate(${geser} ${geser}) scale(${skalaIkon})" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${GLYPH[glyph] ?? ""}</g>
  </svg>`;
}
export const SKALA_PENANDA = SKALA;
