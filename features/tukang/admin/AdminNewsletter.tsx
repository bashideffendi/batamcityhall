"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { kirimJson } from "@/features/tukang/Kolom";
import type { Pelanggan } from "@/features/tukang/store";

const tanggal = (iso: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "Asia/Jakarta" }).format(new Date(iso));

/** Daftar pelanggan newsletter: unduh CSV untuk layanan kirim email, atau hapus atas permintaan. */
export default function AdminNewsletter({ pelanggan }: { pelanggan: Pelanggan[] }) {
  const router = useRouter();
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, mulai] = useTransition();

  function unduh() {
    const isi = ["email,tanggal", ...pelanggan.map((p) => `${p.email},${p.dibuatAt.slice(0, 10)}`)].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([isi], { type: "text/csv;charset=utf-8" }));
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <section className="bch-seksi-rapat" aria-labelledby="adm-nl-judul">
      <h2 id="adm-nl-judul" className="bch-judul-seksi">
        {pelanggan.length.toLocaleString("id-ID")} Pelanggan
      </h2>
      {pelanggan.length === 0 ? (
        <p>Belum ada pelanggan.</p>
      ) : (
        <>
          <div className="bch-adm-aksi">
            <button type="button" className="bch-btn" onClick={unduh}>
              Unduh CSV
            </button>
          </div>
          <ul className="bch-adm-baris">
            {pelanggan.map((p) => (
              <li key={p.email}>
                <div>
                  <strong>{p.email}</strong>
                  <span className="bch-data">{tanggal(p.dibuatAt)}</span>
                </div>
                <div className="bch-adm-aksi">
                  <button
                    type="button"
                    className="bch-btn"
                    data-variant="ghost"
                    disabled={sibuk}
                    onClick={() => {
                      if (!window.confirm(`Hapus ${p.email} dari newsletter?`)) return;
                      mulai(async () => {
                        const j = await kirimJson("/api/admin/newsletter", { aksi: "hapus", email: p.email });
                        setPesan(j.ok ? "Pelanggan dihapus." : (j.pesan ?? "Gagal dihapus."));
                        if (j.ok) router.refresh();
                      });
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {pesan && (
        <p className="bch-adm-pesan" role="status">
          {pesan}
        </p>
      )}
      <p className="bch-catatan-halaman">Pengiriman newsletter memakai layanan email terpisah. Unggah berkas CSV ke layanan itu.</p>
    </section>
  );
}
