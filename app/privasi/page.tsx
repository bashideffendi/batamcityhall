import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privasi",
  description: "Draf kebijakan privasi Batam City Hall.",
};

export default function Privasi() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Privasi</p>
      <h1 className="mt-2">Privasi</h1>
      <p className="bch-note" data-tone="caution">
        Draf, belum ditinjau ahli hukum. Ditulis mengikuti keadaan situs sekarang.
      </p>
      <div className="bch-prose">
        <ul>
          <li>Situs ini tidak memasang iklan dan pelacak iklan.</li>
          <li>Belum ada akun dan belum ada formulir, jadi kami belum mengumpulkan data pribadi lewat situs.</li>
          <li>Pilihan tampilan dan bahasa disimpan di browser Anda, bukan di server kami.</li>
          <li>
            Radar, cuaca, dan peringatan perairan diambil server kami dari sumber resminya. Peta ombak dan video CCTV
            dimuat langsung dari server sumbernya, sehingga server itu menerima alamat IP Anda.
          </li>
          <li>Penyedia hosting bisa mencatat log teknis, seperti alamat IP, untuk menjalankan situs.</li>
        </ul>
        <p>Halaman ini akan diperbarui sebelum ada formulir atau akun.</p>
      </div>
    </div>
  );
}
