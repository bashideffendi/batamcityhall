import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { modeKiriman } from "@/features/tukang/mode";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Data yang disimpan Batam City Hall, kegunaannya, dan cara meminta penghapusannya.",
};

const KEADAAN = {
  supabase: "Formulir kiriman sedang aktif dan isinya tersimpan di basis data kami di Supabase.",
  contoh: "Situs ini sedang memakai data contoh. Kiriman hanya disimpan sementara di memori server.",
  mati: "Formulir kiriman belum aktif. Saat ini kami belum menyimpan kiriman apa pun.",
} as const;

export default async function Privasi() {
  await connection();
  return (
    <div className="bch-page bch-baca">
      <h1>Kebijakan Privasi</h1>
      <p className="bch-note">{KEADAAN[modeKiriman()]}</p>
      <div className="bch-prose">
        <h2>Berlaku untuk Semua Pengunjung</h2>
        <ul>
          <li>Situs ini tidak memasang iklan dan pelacak iklan.</li>
          <li>Warga tidak perlu memiliki akun. Akun hanya dipakai moderator.</li>
          <li>Pilihan tampilan disimpan di peramban, tidak di server kami.</li>
          <li>
            Radar, cuaca, peringatan, dan data gempa diambil server kami dari sumber resminya. Peta gelombang dan video
            CCTV dimuat langsung dari server sumbernya sehingga server itu menerima alamat IP perangkatmu.
          </li>
          <li>
            Tombol “Di sekitarku” di peta meminta lokasi dari peramban. Lokasi itu hanya dipakai di layarmu dan tidak
            dikirim ke server kami.
          </li>
          <li>
            Penyedia <em>hosting</em> dapat mencatat log teknis, seperti alamat IP, untuk menjalankan situs.
          </li>
        </ul>

        <h2>Pengirim Rekomendasi Tukang</h2>
        <ul>
          <li>
            Yang disimpan: nama tukang, jenis jasa, area, cara menghubungi tukang, waktu terakhir memakai jasa, cerita,
            kata yang dipilih, kontakmu, dan catatan persetujuanmu beserta waktunya.
          </li>
          <li>
            Kontakmu dipakai untuk memastikan rekomendasi datang dari warga yang berbeda. Kontak itu tidak pernah
            ditampilkan ke publik, dan layar moderator hanya menampilkan versi tersamar.
          </li>
          <li>Cerita, kata yang dipilih, dan bulan pemakaian tampil tanpa nama setelah lolos moderasi.</li>
        </ul>

        <h2>Tukang yang Direkomendasikan</h2>
        <ul>
          <li>Entri baru tampil setelah kami meminta izinmu, dan persetujuannya dicatat beserta tanggalnya.</li>
          <li>Kontakmu hanya tampil bila kamu mengizinkannya.</li>
          <li>Kamu dapat mencabut izin atau meminta entri dihapus kapan saja.</li>
        </ul>

        <h2>Pengirim Koreksi atau Foto Lama</h2>
        <ul>
          <li>Koreksi boleh dikirim tanpa kontak, kecuali permintaan tentang data pribadimu sendiri.</li>
          <li>
            Kiriman foto lama menyimpan judul, lokasi, perkiraan tahun, cerita, nama untuk kredit, kontakmu, dan izin
            yang kamu berikan. Berkas fotonya belum diterima lewat situs ini.
          </li>
        </ul>

        <h2>Pelanggan Newsletter</h2>
        <ul>
          <li>Yang disimpan hanya alamat email dan tanggal berlangganan.</li>
          <li>Email hanya dipakai untuk mengirim newsletter Batam City Hall. Tidak dijual dan tidak dibagikan.</li>
          <li>
            Untuk berhenti, balas newsletternya atau kirim permintaan lewat{" "}
            <Link href="/koreksi?jenis=hapus_data">halaman koreksi</Link>, dan alamatmu dihapus.
          </li>
        </ul>

        <h2>Menghapus atau Mengoreksi Data</h2>
        <p>
          Kirim permintaan lewat <Link href="/koreksi?jenis=hapus_data">halaman koreksi</Link> dan tulis kontak yang
          dulu kamu pakai supaya kami dapat memastikan data itu milikmu. Moderator mengerjakannya secara manual sehingga
          permintaan tidak langsung selesai. Setelah data dihapus, yang tersisa hanya catatan bahwa pernah ada persetujuan
          dan penghapusan, tanpa kontak.
        </p>

        <h2>Lama Penyimpanan</h2>
        <p>
          Data disimpan selama entrinya masih ada atau sampai kamu meminta penghapusan. Kami belum memiliki jadwal
          penghapusan otomatis. Tidak ada data yang dijual atau dibagikan untuk iklan.
        </p>

        <p>Halaman ini akan diperbarui bila cara kerjanya berubah.</p>
      </div>
    </div>
  );
}
