import type { Metadata } from "next";
import { KIRIMAN_AKTIF } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Batam City Hall",
  description: "Situs informasi kota yang dibuat secara independen oleh warga Batam.",
};

export default function Tentang() {
  return (
    <div className="bch-page bch-baca">
      <h1>Tentang Batam City Hall</h1>
      <div className="bch-prose">
        <p>
          Batam City Hall adalah situs informasi kota, dibuat secara independen oleh warga Batam untuk kota yang kami
          tinggali. Isinya cuaca dan laut, tempat makan, transportasi, cerita kota, dan direktori layanan.
        </p>
        <p>Kami tidak memasang iklan, tidak memakai pelacak, dan tidak menerima bayaran untuk mencantumkan tempat.</p>
        <p>
          Data dihimpun dari sumber terbuka dan pengamatan warga, lalu diperbarui secara berkala. Lokasi yang masih
          perkiraan diberi tanda di peta.
        </p>
        <p>
          Cara kami memilih, memeriksa, dan memperbaiki isi dijelaskan di{" "}
          <Link href="/standar-redaksi">Standar Redaksi</Link>. Perbaikan atas fakta penting dicatat di{" "}
          <Link href="/log-koreksi">Log Koreksi</Link>.
        </p>
        {KIRIMAN_AKTIF && (
          <p>
            Ada data yang keliru? <Link href="/koreksi">Kirim Koreksi</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
