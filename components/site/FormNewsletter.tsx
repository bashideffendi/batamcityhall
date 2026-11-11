"use client";

import { useId, useState, useTransition } from "react";
import { kirimJson, KolomMadu } from "@/features/tukang/Kolom";

/** Langganan newsletter di kaki situs. Selama basis data belum tersambung, formulirnya jujur belum dibuka. */
export default function FormNewsletter({ aktif }: { aktif: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState<{ teks: string; nada: "ok" | "gagal" } | null>(null);
  const [sibuk, mulai] = useTransition();

  return (
    <form
      className="bch-footer-newsletter"
      aria-labelledby={`${id}-judul`}
      onSubmit={(e) => {
        e.preventDefault();
        const situs = new FormData(e.currentTarget).get("situs_web");
        mulai(async () => {
          const j = await kirimJson("/api/newsletter", { email, situs_web: situs });
          if (j.ok) setEmail("");
          setPesan(
            j.ok
              ? { teks: "Terima kasih. Alamat email tercatat.", nada: "ok" }
              : { teks: j.galat?.email ?? j.pesan ?? "Belum tercatat. Coba lagi.", nada: "gagal" },
          );
        });
      }}
    >
      <p id={`${id}-judul`} className="bch-footer-judul">
        Newsletter
      </p>
      <p>Rangkuman Barelang.co, sesekali saja.</p>
      <div className="bch-footer-isian">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email
        </label>
        <input
          id={`${id}-email`}
          className="bch-input"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Alamat email"
          required
          disabled={!aktif || sibuk}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="bch-btn" disabled={!aktif || sibuk}>
          Langganan
        </button>
      </div>
      <KolomMadu />
      {aktif ? (
        <p className="bch-footer-kecil">Email hanya dipakai untuk newsletter.</p>
      ) : (
        <p className="bch-footer-kecil">Belum dibuka.</p>
      )}
      {pesan && (
        <p className={pesan.nada === "ok" ? "bch-adm-pesan" : "bch-tk-galat"} role={pesan.nada === "ok" ? "status" : "alert"}>
          {pesan.teks}
        </p>
      )}
    </form>
  );
}
