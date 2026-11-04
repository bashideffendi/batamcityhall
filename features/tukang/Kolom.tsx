"use client";

import type { ReactNode } from "react";

export type JawabanKirim = { ok: boolean; pesan?: string; galat?: Record<string, string> };

export async function kirimJson(url: string, isi: unknown, method = "POST"): Promise<JawabanKirim> {
  try {
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isi),
    });
    return (await r.json()) as JawabanKirim;
  } catch {
    return { ok: false, pesan: "Jaringan bermasalah. Kiriman belum masuk, coba lagi." };
  }
}

/** Kolom formulir: label, petunjuk, dan pesan galat yang terhubung lewat id. */
export function Kolom({
  nama,
  label,
  petunjuk,
  galat,
  children,
}: {
  nama: string;
  label: string;
  petunjuk?: string;
  galat?: string;
  children: (a11y: { id: string; "aria-invalid"?: true; "aria-describedby"?: string }) => ReactNode;
}) {
  const id = `kolom-${nama}`;
  const uraian = [petunjuk && `${id}-petunjuk`, galat && `${id}-galat`].filter(Boolean).join(" ");
  return (
    <div className="bch-field">
      <label htmlFor={id}>{label}</label>
      {petunjuk && (
        <span id={`${id}-petunjuk`} className="bch-tk-petunjuk">
          {petunjuk}
        </span>
      )}
      {children({ id, "aria-invalid": galat ? true : undefined, "aria-describedby": uraian || undefined })}
      {galat && (
        <span id={`${id}-galat`} className="bch-tk-galat">
          {galat}
        </span>
      )}
    </div>
  );
}

/** Kolom jebakan robot. Tidak terlihat dan tidak terjangkau keyboard; warga tidak pernah mengisinya. */
export function KolomMadu() {
  return (
    <div className="bch-tk-madu" aria-hidden="true">
      <label>
        Situs web (kosongkan)
        <input type="text" name="situs_web" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function CekPersetujuan({
  nama,
  galat,
  children,
  required = true,
}: {
  nama: string;
  galat?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="bch-tk-cek">
        <input type="checkbox" name={nama} required={required} aria-invalid={galat ? true : undefined} />
        <span>{children}</span>
      </label>
      {galat && <span className="bch-tk-galat">{galat}</span>}
    </div>
  );
}
