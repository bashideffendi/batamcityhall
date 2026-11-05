import type { Metadata } from "next";
import Link from "next/link";
import JalanNav from "@/features/jalan/JalanNav";

export const metadata: Metadata = {
  title: "Panduan Menyeberang",
  description: "Halaman ini merangkum hal yang perlu disiapkan sebelum naik feri ke Singapura atau Malaysia.",
};

// Ditulis ulang dari data/feri/info_praktis.md, tanpa bagian yang ditujukan untuk penyusun.
export default function Panduan() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">
        <Link href="/jalan/feri" prefetch={false}>
          Feri
        </Link>{" "}
        · Panduan
      </p>
      <h1 className="mt-2">Panduan Menyeberang</h1>
      <p className="bch-lede">
        Halaman ini merangkum hal yang perlu disiapkan sebelum naik feri ke Singapura atau Malaysia.
      </p>
      <JalanNav aktif="/jalan/feri/panduan" />

      <div className="bch-prose mt-5">
        <h2 id="paspor">Paspor dan Imigrasi</h2>
        <ul>
          <li>Paspor sebaiknya berlaku minimal 6 bulan.</li>
          <li>Warga negara asing yang masuk Batam mengisi All Indonesia e-Arrival Card dalam 72 jam sebelum tiba.</li>
          <li>Warga Singapura dan ASEAN bebas visa 30 hari. Kebanyakan negara lain memakai VoA USD 35 atau e-VOA.</li>
          <li>Warga Batam yang ke Singapura perlu mengisi SG Arrival Card.</li>
        </ul>

        <h2 id="check-in">Waktu Lapor Masuk</h2>
        <ul>
          <li>Datang minimal 45 menit sebelum berangkat, atau 60 menit pada Jumat sore, Sabtu pagi, dan hari libur.</li>
          <li>
            Majestic mensyaratkan lapor masuk (<em>check-in</em>) di konter 60 menit sebelum berangkat.
          </li>
          <li>
            Horizon menutup lapor masuk 20 menit sebelum berangkat di HarbourFront dan 30 menit di Harbour Bay. Tanyakan
            kepada operator sebelum berangkat.
          </li>
          <li>RoRo ASDP meminta penumpang datang minimal 2 jam sebelum berangkat.</li>
        </ul>

        <h2 id="terakhir">Feri Terakhir untuk Pulang Hari</h2>
        <p>
          Feri terakhir dari Singapura ke Batam Centre berangkat pukul 21.40 (BatamFast) dan 21.50 (Sindo) waktu
          Singapura. Ke Harbour Bay pukul 21.35 waktu Singapura. Ke Sekupang pukul 19.30 (BatamFast) dan 20.40
          (Majestic) waktu Singapura. Waktu Singapura satu jam lebih cepat daripada WIB, jadi pukul 21.40 di sana sama
          dengan pukul 20.40 WIB. Jadwal hari ini ada di{" "}
          <Link href="/jalan/feri#terakhir" prefetch={false}>
            Feri Terakhir Hari Ini
          </Link>
          .
        </p>

        <h2 id="barang">Barang Bawaan dari Singapura</h2>
        <p>Aturan barang bawaan mengikuti PMK 203/PMK.04/2017:</p>
        <ul>
          <li>Barang pribadi sampai FOB USD 500 per orang per kedatangan bebas bea masuk dan pajak.</li>
          <li>
            Kelebihannya dikenai bea masuk tetap 10% ditambah PPN, dan PPh 0,5 sampai 10% bila punya NPWP, atau 1 sampai
            20% bila tidak.
          </li>
          <li>
            Bebas cukai: 200 batang sigaret, 25 batang cerutu, atau 100 gram tembakau iris, dan atau 1 liter minuman
            mengandung etil alkohol. Alkohol hanya untuk usia 21 tahun ke atas.
          </li>
          <li>PMK 92/2025 yang berlaku 1 April 2026 tidak mengubah angka USD 500.</li>
          <li>Uang tunai di atas Rp100 juta atau setara wajib dilaporkan.</li>
        </ul>

        <h2 id="kesehatan">Kartu Kesehatan</h2>
        <p>
          Per November 2026, belum ada kewajiban kartu kesehatan khusus yang tercatat untuk rute Batam ke Singapura dan
          Malaysia. BatamFast memuat dokumen Quick Travel Requirement di situsnya.
        </p>

        <h2 id="biaya">Biaya Tambahan</h2>
        <ul>
          <li>
            <strong>Sindo:</strong> tarif dasar mulai SGD 28. Keberangkatan dari Singapura ditambah Singapore Passenger
            Departure Fee SGD 10. Keberangkatan dari Batam ditambah Batam Terminal Fee Rp100.000.
          </li>
          <li>
            <strong>BatamFast:</strong> mulai SGD 43 sekali jalan dan SGD 76 pulang pergi, sudah termasuk biaya.
          </li>
          <li>
            <strong>Biaya tambahan bahan bakar:</strong> SGD 6 dari Singapura ke Batam dan Rp65.000 dari Batam ke
            Singapura, berlaku sejak Maret 2026.
          </li>
          <li>Penumpang Horizon yang membeli tiket lewat pihak ketiga mungkin harus membayar biaya ini di konter.</li>
        </ul>

        <h2 id="beli">Cara Membeli Tiket</h2>
        <p>
          Tiket dijual di situs atau aplikasi operator dan di konter terminal. Klook, KKday, dan Traveloka hanya menjual
          ulang. Untuk Jumat sore, Sabtu pagi, dan libur nasional Singapura, sebaiknya pesan 2 sampai 3 hari sebelumnya.
          Tiket RoRo Telaga Punggur ke Tanjung Uban hanya dijual daring lewat{" "}
          <a href="https://trip.ferizy.com" target="_blank" rel="noopener">
            trip.ferizy.com
          </a>
          , tidak di loket. Daftar lengkapnya ada di{" "}
          <Link href="/jalan/feri#operator" prefetch={false}>
            Jadwal Operator
          </Link>
          .
        </p>

        <h2 id="angin-utara">Musim Angin Utara</h2>
        <p>
          Musim angin utara berlangsung November sampai Februari, dengan puncak pada Desember dan Januari. Gelombang di
          perairan Batam, Bintan, Karimun, dan Lingga dapat mencapai 1,25 sampai 2,5 m. Di Natuna dan Anambas dapat
          mencapai 2,5 sampai 4 m atau lebih, karena kedua wilayah itu langsung menghadap utara.
        </p>
        <p>
          Feri Dumai Line sempat dihantam ombak 2 sampai 3 m pada 4 Januari 2026. Jadwal RoRo Punggur ke Tanjung Uban
          pernah dijarangkan menjadi setiap 1 jam 15 menit pada Januari 2026 karena cuaca.
        </p>
        <p>
          Pada musim ini, siapkan obat antimabuk, pilih kursi di tengah atau belakang kapal, sediakan waktu cadangan,
          dan pantau pengumuman pembatalan. Kondisi ombak sekarang ada di{" "}
          <Link href="/cuaca/gelombang" prefetch={false}>
            Cuaca dan Laut
          </Link>
          .
        </p>

        <h2 id="pompong">Keselamatan di Pompong</h2>
        <ul>
          <li>Minta dan pakai pelampung sebelum perahu berangkat, terutama untuk anak-anak.</li>
          <li>
            Jangan naik bila perahu sudah kelebihan muatan. Satu <em>pompong</em> PPMS memuat 12 penumpang dan satu
            pengemudi.
          </li>
          <li>Simpan ponsel dan dokumen di kantong kedap air. Siapkan uang tunai pecahan kecil.</li>
          <li>
            Hindari menyeberang saat hujan badai atau angin kencang. Periksa{" "}
            <Link href="/cuaca" prefetch={false}>
              radar hujan
            </Link>{" "}
            sebelum berangkat. Rute malam hanya lewat pesanan.
          </li>
          <li>
            Untuk pulau yang jauh seperti Kasu, Terong, dan Abang, sepakati jam jemput balik dengan pengemudi perahu.
          </li>
        </ul>
        <p>
          Rute dan tarif ada di halaman{" "}
          <Link href="/jalan/pompong" prefetch={false}>
            Pompong
          </Link>
          .
        </p>

        <p className="jl-catatan-kecil">
          Aturan imigrasi dan bea cukai dapat berubah. Pastikan aturannya sebelum berangkat.
        </p>
      </div>
    </div>
  );
}
