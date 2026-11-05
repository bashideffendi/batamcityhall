import { LABEL_CONTOH } from "./aturan";
import { PESAN_MATI, type ModeKiriman } from "./mode";

/** Pemberitahuan jujur soal keadaan penyimpanan. Mode supabase tidak butuh catatan. */
export default function CatatanMode({ mode, pesanMati = PESAN_MATI }: { mode: ModeKiriman; pesanMati?: string }) {
  if (mode === "contoh") {
    return (
      <p className="bch-note" data-tone="caution" data-mode-contoh>
        <strong>{LABEL_CONTOH}.</strong> Semua entri rekaan. Kiriman hanya disimpan sementara dan hilang saat server
        dimatikan.
      </p>
    );
  }
  if (mode === "mati") {
    return (
      <p className="bch-note" data-tone="caution" data-mode-mati>
        {pesanMati}
      </p>
    );
  }
  return null;
}
