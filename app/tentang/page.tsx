import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang Batam City Hall",
  description: "Batam City Hall adalah situs informasi kota yang dibuat secara independen oleh warga Batam.",
};

export default function Tentang() {
  return (
    <div className="bch-page">
      <h1>Tentang Batam City Hall</h1>
      <div className="bch-prose">
        <p>
          Batam City Hall adalah situs informasi kota yang dibuat secara independen oleh warga Batam. Situs ini memuat
          informasi cuaca dan laut, tempat makan, transportasi, cerita kota, dan direktori layanan.
        </p>
        <p>Situs ini tidak memasang iklan, tidak menerima bayaran untuk mencantumkan tempat, dan tidak memakai pelacak.</p>
        <p>
          Data dihimpun dari sumber terbuka dan pengamatan warga. Tempat yang lokasinya masih perkiraan diberi tanda di
          peta. Seluruh data diperbarui secara berkala.
        </p>
        <p>
          Ada data yang keliru? <Link href="/koreksi">Kirim koreksi</Link>.
        </p>
      </div>
    </div>
  );
}
