"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { kirimJson } from "../Kolom";
import type { AksiModerasi } from "../skema";

function useAksi() {
  const router = useRouter();
  const [galat, setGalat] = useState("");
  const [sibuk, mulai] = useTransition();
  const jalankan = (aksi: AksiModerasi) =>
    mulai(async () => {
      const j = await kirimJson("/api/admin/moderasi", aksi);
      setGalat(j.ok ? "" : (j.pesan ?? "Tindakan gagal."));
      if (j.ok) router.refresh();
    });
  return { galat, sibuk, jalankan };
}

export function TombolAksi({
  aksi,
  label,
  tanya,
  ghost = true,
}: {
  aksi: AksiModerasi;
  label: string;
  /** Pertanyaan konfirmasi untuk tindakan yang tidak bisa dibatalkan. */
  tanya?: string;
  ghost?: boolean;
}) {
  const { galat, sibuk, jalankan } = useAksi();
  return (
    <>
      <button
        type="button"
        className="bch-btn"
        data-variant={ghost ? "ghost" : undefined}
        disabled={sibuk}
        onClick={() => {
          if (!tanya || window.confirm(tanya)) jalankan(aksi);
        }}
      >
        {label}
      </button>
      {galat && (
        <span className="bch-tk-galat" role="alert">
          {galat}
        </span>
      )}
    </>
  );
}

/** Mencatat persetujuan tukang, biasanya setelah WA singkat. Catatan masuk consent_log, jangan menulis nomor. */
export function FormIzin({ id }: { id: string }) {
  const { galat, sibuk, jalankan } = useAksi();
  function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    jalankan({
      aksi: "catat_izin",
      id,
      kontak_boleh_tampil: d.get("kontak") === "on",
      catatan: String(d.get("catatan") ?? ""),
    });
  }
  return (
    <form className="bch-adm-form" onSubmit={kirim}>
      <label className="bch-field">
        Catatan izin, tanpa nomor
        <input className="bch-input" name="catatan" maxLength={300} placeholder="Lewat WA singkat" />
      </label>
      <label className="bch-tk-cek">
        <input type="checkbox" name="kontak" />
        <span>Kontak boleh tampil</span>
      </label>
      <button type="submit" className="bch-btn" data-variant="ghost" disabled={sibuk}>
        Catat izin tukang
      </button>
      {galat && (
        <span className="bch-tk-galat" role="alert">
          {galat}
        </span>
      )}
    </form>
  );
}

export function FormGabung({ id, pilihan }: { id: string; pilihan: { id: string; nama: string }[] }) {
  const { galat, sibuk, jalankan } = useAksi();
  if (!pilihan.length) return null;
  function kirim(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ke = String(new FormData(e.currentTarget).get("ke") ?? "");
    if (ke) jalankan({ aksi: "gabungkan", id, ke });
  }
  return (
    <form className="bch-adm-form" onSubmit={kirim}>
      <label className="bch-field">
        Tukang yang sama dengan
        <select className="bch-select" name="ke" defaultValue="">
          <option value="" disabled>
            Pilih entri
          </option>
          {pilihan.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="bch-btn" data-variant="ghost" disabled={sibuk}>
        Gabungkan
      </button>
      {galat && (
        <span className="bch-tk-galat" role="alert">
          {galat}
        </span>
      )}
    </form>
  );
}
