import Link from "next/link";

// Catatan data di bawah halaman (pedoman 3.1), menggantikan catatan per kartu.
export default function CatatanData() {
  return (
    <p className="bch-note mt-7" data-catatan-data>
      Data dihimpun pada November 2026. Sebagian lokasi masih perkiraan. <Link href="/koreksi">Kirim koreksi</Link>
    </p>
  );
}
