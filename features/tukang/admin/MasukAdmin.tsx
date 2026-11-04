"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { kirimJson } from "../Kolom";

export default function MasukAdmin({ pakaiEmail }: { pakaiEmail: boolean }) {
  const router = useRouter();
  const [galat, setGalat] = useState("");
  const [mengirim, setMengirim] = useState(false);

  async function masuk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setMengirim(true);
    const j = await kirimJson("/api/admin/masuk", {
      email: pakaiEmail ? d.get("email") : undefined,
      kata_sandi: d.get("kata_sandi"),
    });
    setMengirim(false);
    if (j.ok) router.refresh();
    else setGalat(j.pesan ?? "Gagal masuk.");
  }

  return (
    <form className="bch-tk-form" onSubmit={masuk}>
      {pakaiEmail && (
        <label className="bch-field">
          Surel
          <input className="bch-input" type="email" name="email" autoComplete="username" required />
        </label>
      )}
      <label className="bch-field">
        Kata sandi
        <input className="bch-input" type="password" name="kata_sandi" autoComplete="current-password" required />
      </label>
      <p className="bch-tk-galat m-0" role="alert">
        {galat}
      </p>
      <div>
        <button type="submit" className="bch-btn" disabled={mengirim}>
          Masuk
        </button>
      </div>
    </form>
  );
}
