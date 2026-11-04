"use client";

import { useState, type FormEvent } from "react";
import { kirimJson } from "./Kolom";

// Tombol di kartu tukang. Laporan masalah langsung menyembunyikan entri di server; kartunya hilang saat halaman
// dimuat ulang, jadi warga masih sempat membaca konfirmasinya di sini.
export default function TombolKartu({ id, nama }: { id: string; nama: string }) {
  const [pesan, setPesan] = useState("");
  const [sinyalTerkirim, setSinyalTerkirim] = useState(false);
  const [lapor, setLapor] = useState(false);
  const [dilaporkan, setDilaporkan] = useState(false);
  const [galat, setGalat] = useState("");

  async function sinyal(jenis: "masih_buka" | "sudah_pindah") {
    const j = await kirimJson("/api/tukang/sinyal", { tukang_id: id, jenis });
    if (j.ok) {
      setSinyalTerkirim(true);
      setPesan(
        jenis === "masih_buka"
          ? "Dicatat: masih buka. Terima kasih."
          : "Dicatat: sudah pindah atau tutup. Moderator akan memeriksanya.",
      );
    } else setPesan(j.pesan ?? "Belum tercatat. Coba lagi.");
  }

  async function kirimLaporan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const j = await kirimJson("/api/tukang/laporkan", { tukang_id: id, alasan: d.get("alasan") });
    if (j.ok) {
      setDilaporkan(true);
      setGalat("");
    } else setGalat(j.galat?.alasan ?? j.pesan ?? "Laporan belum masuk. Coba lagi.");
  }

  if (dilaporkan) {
    return (
      <p className="bch-note mt-3 mb-0" role="status">
        Laporan masuk. Entri ini disembunyikan sementara sampai ditinjau moderator.
      </p>
    );
  }

  return (
    <div className="bch-tk-tombol">
      <div className="bch-tk-tombol-baris">
        <button
          type="button"
          className="bch-btn"
          data-variant="ghost"
          disabled={sinyalTerkirim}
          onClick={() => sinyal("masih_buka")}
        >
          Masih buka?
        </button>
        <button
          type="button"
          className="bch-btn"
          data-variant="ghost"
          disabled={sinyalTerkirim}
          onClick={() => sinyal("sudah_pindah")}
        >
          Sudah pindah/tutup
        </button>
      </div>
      <p className="bch-card-meta m-0" role="status">
        {pesan}
      </p>
      {lapor ? (
        <form className="bch-tk-form-kecil" onSubmit={kirimLaporan} noValidate>
          <label className="bch-field">
            Apa masalahnya?
            <textarea className="bch-textarea" name="alasan" rows={3} maxLength={500} />
          </label>
          <p className="bch-card-meta m-0">Entri ini disembunyikan sementara sampai ditinjau moderator.</p>
          {galat && (
            <p className="bch-tk-galat m-0" role="alert">
              {galat}
            </p>
          )}
          <div className="bch-tk-tombol-baris">
            <button type="submit" className="bch-btn">
              Kirim laporan
            </button>
            <button type="button" className="bch-btn" data-variant="ghost" onClick={() => setLapor(false)}>
              Batal
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="bch-tk-tautan"
          aria-label={`Laporkan masalah: ${nama}`}
          onClick={() => setLapor(true)}
        >
          Laporkan masalah
        </button>
      )}
    </div>
  );
}
