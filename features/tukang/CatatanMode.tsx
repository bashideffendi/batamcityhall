import { LABEL_CONTOH } from "./aturan";
import { PESAN_MATI, type ModeKiriman } from "./mode";

/** Pemberitahuan jujur soal keadaan penyimpanan. Mode supabase tidak butuh catatan. */
export default function CatatanMode({ mode }: { mode: ModeKiriman }) {
  if (mode === "contoh") {
    return (
      <p className="bch-note" data-tone="caution" data-mode-contoh>
        <strong>{LABEL_CONTOH}.</strong> Situs ini sedang memakai data contoh. Semua entri rekaan, kiriman hanya
        disimpan sementara di memori server, dan hilang saat server dimatikan.
      </p>
    );
  }
  if (mode === "mati") {
    return (
      <p className="bch-note" data-tone="caution" data-mode-mati>
        {PESAN_MATI}
      </p>
    );
  }
  return null;
}
