import { Fragment } from "react";
import type { KunciStatus, Sumber } from "./data";

// Empat status laporan 15 plus satu campuran. Selalu kata dan ikon garis, tidak pernah warna saja, tidak pernah emoji.
export const LABEL_STATUS: Record<KunciStatus, string> = {
  terverifikasi: "Terverifikasi",
  perbedaan_versi: "Beda versi",
  belum_terverifikasi: "Belum terverifikasi",
  cerita_rakyat: "Cerita rakyat",
  campuran: "Konteks umum terverifikasi; detail lokal belum",
};

const NADA: Record<KunciStatus, "ok" | "caution" | "info" | undefined> = {
  terverifikasi: "ok",
  perbedaan_versi: "caution",
  belum_terverifikasi: undefined,
  cerita_rakyat: "info",
  campuran: "info",
};

const GARIS: Record<KunciStatus, React.ReactNode> = {
  terverifikasi: <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />,
  perbedaan_versi: <path d="M8 13.5V9M8 9 4 5M8 9l4-4M4 5V2.5M12 5V2.5" />,
  belum_terverifikasi: (
    <>
      <path d="M5.5 6a2.5 2.5 0 1 1 3.7 2.2C8.4 8.7 8 9.2 8 10" />
      <path d="M8 12.6v.4" />
    </>
  ),
  cerita_rakyat: (
    <path d="M8 4.5C6.5 3.2 4.5 3 2.5 3.3v9c2-.3 4-.1 5.5 1.2 1.5-1.3 3.5-1.5 5.5-1.2v-9C11.5 3 9.5 3.2 8 4.5Zm0 0v9" />
  ),
  campuran: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 2.5v11" />
    </>
  ),
};

export function IkonStatus({ status }: { status: KunciStatus }) {
  return (
    <svg className="sj-ikon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      {GARIS[status]}
    </svg>
  );
}

export function LencanaStatus({ status }: { status: KunciStatus }) {
  return (
    <span className="bch-badge sj-lencana" data-tone={NADA[status]} data-status={status}>
      <IkonStatus status={status} />
      {LABEL_STATUS[status]}
    </span>
  );
}

export function DaftarSumber({ sumber, kosong }: { sumber: Sumber[]; kosong?: string }) {
  if (!sumber.length) return <p className="sj-sumber">{kosong ?? "Sumber: belum ada yang bisa dicek."}</p>;
  return (
    <p className="sj-sumber">
      Sumber:{" "}
      {sumber.map((s, i) => (
        <Fragment key={s.url}>
          {i > 0 && ", "}
          <a href={s.url} rel="noopener noreferrer">
            {s.nama}
          </a>
        </Fragment>
      ))}
    </p>
  );
}

/** Markdown sebaris dari data riset: hanya *miring*. */
export function TeksMiring({ isi }: { isi: string }) {
  return (
    <>
      {isi.split("*").map((bagian, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <em>{bagian}</em> : bagian}</Fragment>
      ))}
    </>
  );
}
