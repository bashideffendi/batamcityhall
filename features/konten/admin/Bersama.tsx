"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type ChangeEvent, type ReactNode } from "react";
import { kirimJson, Kolom } from "@/features/tukang/Kolom";
import type { AksiKonten } from "../skema";

export type HasilUnggah = { src: string; w: number; h: number };

/** Satu alur kirim untuk semua formulir admin: status, galat per kolom, dan segarkan daftar. */
export function useKirim() {
  const router = useRouter();
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<{ teks: string; nada: "ok" | "gagal" } | null>(null);
  const [sibuk, mulai] = useTransition();

  // Masukan formulir belum tervalidasi di sini: server yang memeriksa dengan skema yang sama.
  const kirim = (aksi: { aksi: AksiKonten["aksi"]; [k: string]: unknown }, berhasil: string, lalu?: () => void) =>
    mulai(async () => {
      const j = await kirimJson("/api/admin/konten", aksi);
      setGalat(j.galat ?? {});
      setPesan(j.ok ? { teks: berhasil, nada: "ok" } : { teks: j.pesan ?? "Gagal disimpan.", nada: "gagal" });
      if (j.ok) {
        lalu?.();
        router.refresh();
      }
    });
  return { galat, pesan, sibuk, kirim };
}

export function Pesan({ pesan }: { pesan: { teks: string; nada: "ok" | "gagal" } | null }) {
  if (!pesan) return null;
  return pesan.nada === "ok" ? (
    <p className="bch-adm-pesan" role="status">
      {pesan.teks}
    </p>
  ) : (
    <p className="bch-tk-galat" role="alert">
      {pesan.teks}
    </p>
  );
}

export function KolomTeks({
  nama,
  label,
  nilai,
  ubah,
  galat,
  petunjuk,
  tipe = "text",
  wajib,
}: {
  nama: string;
  label: string;
  nilai: string;
  ubah: (v: string) => void;
  galat?: string;
  petunjuk?: string;
  tipe?: "text" | "date" | "url" | "number";
  wajib?: boolean;
}) {
  return (
    <Kolom nama={nama} label={label} galat={galat} petunjuk={petunjuk}>
      {(a11y) => (
        <input
          {...a11y}
          className="bch-input"
          type={tipe}
          step={tipe === "number" ? "any" : undefined}
          value={nilai}
          required={wajib}
          onChange={(e) => ubah(e.target.value)}
        />
      )}
    </Kolom>
  );
}

export function KolomArea({
  nama,
  label,
  nilai,
  ubah,
  galat,
  petunjuk,
  baris = 3,
  wajib,
}: {
  nama: string;
  label: string;
  nilai: string;
  ubah: (v: string) => void;
  galat?: string;
  petunjuk?: string;
  baris?: number;
  wajib?: boolean;
}) {
  return (
    <Kolom nama={nama} label={label} galat={galat} petunjuk={petunjuk}>
      {(a11y) => <textarea {...a11y} className="bch-textarea" rows={baris} value={nilai} required={wajib} onChange={(e) => ubah(e.target.value)} />}
    </Kolom>
  );
}

export function KolomPilih({
  nama,
  label,
  nilai,
  ubah,
  galat,
  pilihan,
  kosong,
}: {
  nama: string;
  label: string;
  nilai: string;
  ubah: (v: string) => void;
  galat?: string;
  pilihan: { nilai: string; nama: string }[];
  kosong?: string;
}) {
  return (
    <Kolom nama={nama} label={label} galat={galat}>
      {(a11y) => (
        <select {...a11y} className="bch-select" value={nilai} onChange={(e) => ubah(e.target.value)}>
          {kosong !== undefined && <option value="">{kosong}</option>}
          {pilihan.map((p) => (
            <option key={p.nilai} value={p.nilai}>
              {p.nama}
            </option>
          ))}
        </select>
      )}
    </Kolom>
  );
}

/** Mengunggah satu foto ke server. Server yang memperkecil dan mengubah ke WebP. */
export function TombolUnggah({
  folder,
  label,
  hasil,
  children,
}: {
  folder: "jurnal" | "makan";
  label: string;
  hasil: (h: HasilUnggah) => void;
  children?: ReactNode;
}) {
  const masukan = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [sibuk, setSibuk] = useState(false);

  async function pilih(e: ChangeEvent<HTMLInputElement>) {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    setSibuk(true);
    setStatus("Mengunggah…");
    const form = new FormData();
    form.append("berkas", berkas);
    form.append("folder", folder);
    try {
      const r = await fetch("/api/admin/unggah", { method: "POST", body: form });
      const j = (await r.json()) as Partial<HasilUnggah> & { ok: boolean; pesan?: string };
      if (j.ok && j.src && j.w && j.h) {
        hasil({ src: j.src, w: j.w, h: j.h });
        setStatus("");
      } else {
        setStatus(j.pesan ?? "Foto gagal diunggah.");
      }
    } catch {
      setStatus("Foto gagal diunggah. Periksa jaringan.");
    }
    setSibuk(false);
    if (masukan.current) masukan.current.value = "";
  }

  return (
    <div className="bch-adm-unggah">
      <label className="bch-btn" data-variant="ghost" aria-disabled={sibuk || undefined}>
        {label}
        <input ref={masukan} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={sibuk} onChange={pilih} />
      </label>
      {children}
      {status && <span role="status">{status}</span>}
    </div>
  );
}
