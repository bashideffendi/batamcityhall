import TautanKirim from "@/components/site/TautanKirim";

// Catatan data di bawah halaman (pedoman 3.1), menggantikan catatan per kartu.
export default function CatatanData() {
  return (
    <p className="bch-note mt-7" data-catatan-data>
      Data dihimpun pada November 2026. Sebagian lokasi masih perkiraan. <TautanKirim href="/koreksi">Kirim Koreksi</TautanKirim>
    </p>
  );
}
