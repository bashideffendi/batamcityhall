import { Fragment } from "react";
import type { KunciStatus } from "./data";

// Label status sejarah, satu per butir (pedoman 3.7). Selalu kata dan ikon garis, tidak pernah warna saja atau emoji.
export const LABEL_STATUS: Record<KunciStatus, string> = {
  terverifikasi: "Tercatat",
  perbedaan_versi: "Berbeda versi",
  belum_terverifikasi: "Belum terverifikasi",
  cerita_rakyat: "Cerita rakyat",
};

const NADA: Record<KunciStatus, "ok" | "caution" | "info" | undefined> = {
  terverifikasi: "ok",
  perbedaan_versi: "caution",
  belum_terverifikasi: undefined,
  cerita_rakyat: "info",
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
