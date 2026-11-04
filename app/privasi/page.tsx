import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { modeKiriman } from "@/features/tukang/mode";

export const metadata: Metadata = {
  title: "Privasi",
  description: "Draf kebijakan privasi Batam City Hall.",
};

const KEADAAN = {
  supabase: "Formulir kiriman sedang aktif, dan isinya tersimpan di basis data kami di Supabase.",
  contoh: "Situs ini sedang memakai data contoh. Kiriman hanya disimpan sementara di memori server.",
  mati: "Formulir kiriman belum aktif. Saat ini kami belum menyimpan kiriman apa pun.",
} as const;

export default async function Privasi() {
  await connection();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Privasi</p>
      <h1 className="mt-2">Privasi</h1>
      <p className="bch-note" data-tone="caution">
        Draf, belum ditinjau ahli hukum. Ditulis mengikuti keadaan situs sekarang.
      </p>
      <p className="bch-note">{KEADAAN[modeKiriman()]}</p>
      <div className="bch-prose">
        <h2>Yang berlaku untuk semua pengunjung</h2>
        <ul>
          <li>Situs ini tidak memasang iklan dan pelacak iklan.</li>
          <li>Warga tidak perlu punya akun. Akun hanya dipakai moderator.</li>
          <li>Pilihan tampilan dan bahasa disimpan di browser Anda, bukan di server kami.</li>
          <li>
            Radar, cuaca, dan peringatan perairan diambil server kami dari sumber resminya. Peta ombak dan video CCTV
            dimuat langsung dari server sumbernya, sehingga server itu menerima alamat IP Anda.
          </li>
          <li>
            Tombol &ldquo;Di sekitarku&rdquo; di peta meminta lokasi dari browser Anda. Lokasi itu hanya dipakai di
            layar Anda, dan tidak dikirim ke server kami.
          </li>
          <li>Penyedia hosting bisa mencatat log teknis, seperti alamat IP, untuk menjalankan situs.</li>
        </ul>

        <h2>Kalau Anda mengirim rekomendasi tukang</h2>
        <ul>
          <li>
            Yang disimpan: nama tukang, jasa, area, cara menghubungi tukang, kapan dipakai, cerita, tag, kontak Anda,
            dan catatan bahwa Anda setuju beserta waktunya.
          </li>
          <li>
            Kontak Anda dipakai untuk memastikan rekomendasi datang dari warga yang berbeda. Kontak itu tidak pernah
            ditampilkan ke publik, dan layar moderator hanya menampilkan versi tersamar.
          </li>
          <li>Cerita, tag, dan bulan pemakaian tampil tanpa nama setelah lolos moderasi.</li>
        </ul>

        <h2>Kalau Anda tukang yang direkomendasikan</h2>
        <ul>
          <li>Entri baru tampil setelah kami minta izin Anda, dan persetujuannya dicatat beserta tanggalnya.</li>
          <li>Kontak Anda hanya tampil kalau Anda mengizinkannya tampil.</li>
          <li>Anda bisa mencabut izin atau meminta entri dihapus kapan saja.</li>
        </ul>

        <h2>Kalau Anda mengirim koreksi atau foto lama</h2>
        <ul>
          <li>Koreksi boleh tanpa kontak, kecuali permintaan soal data pribadi Anda sendiri.</li>
          <li>
            Kiriman foto lama menyimpan judul, lokasi, perkiraan tahun, cerita, nama untuk kredit, kontak Anda, dan izin
            yang Anda berikan. Berkas fotonya belum diterima lewat situs ini.
          </li>
        </ul>

        <h2>Menghapus atau mengoreksi data</h2>
        <p>
          Kirim permintaan lewat <Link href="/koreksi?jenis=hapus_data">halaman koreksi</Link> dan tulis kontak yang
          dulu Anda pakai, supaya kami bisa memastikan itu data Anda. Moderator mengerjakannya dengan tangan, jadi tidak
          langsung saat itu juga. Yang tersisa setelah dihapus hanya catatan bahwa ada persetujuan dan penghapusan,
          tanpa kontak.
        </p>

        <h2>Berapa lama disimpan</h2>
        <p>
          Selama entrinya masih ada, atau sampai Anda minta dihapus. Kami belum punya jadwal penghapusan otomatis. Tidak
          ada data yang dijual atau dibagikan untuk iklan.
        </p>

        <p>Halaman ini akan diperbarui kalau cara kerjanya berubah.</p>
      </div>
    </div>
  );
}
