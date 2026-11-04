import type { Metadata } from "next";
import Link from "next/link";
import JalanNav from "@/features/jalan/JalanNav";

export const metadata: Metadata = {
  title: "Panduan menyeberang",
  description: "Paspor, check-in, barang bawaan, biaya tambahan, musim angin utara, dan keselamatan pompong.",
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
      <h1 className="mt-2">Panduan menyeberang</h1>
      <p className="bch-lede">Yang perlu disiapkan sebelum naik kapal. Data per November 2026.</p>
      <JalanNav aktif="/jalan/feri/panduan" />

      <div className="bch-prose mt-5">
        <p className="bch-note" data-tone="caution">
          Aturan imigrasi dan bea cukai bisa berubah. Untuk urusan yang menentukan, cek ke instansinya.
        </p>

        <h2 id="paspor">Paspor dan imigrasi</h2>
        <ul>
          <li>Paspor sebaiknya berlaku minimal 6 bulan.</li>
          <li>Warga negara asing yang masuk Batam mengisi All Indonesia e-Arrival Card dalam 72 jam sebelum tiba.</li>
          <li>Warga Singapura dan ASEAN bebas visa 30 hari. Kebanyakan negara lain memakai VoA USD 35 atau e-VOA.</li>
          <li>
            Warga Batam yang ke Singapura perlu mengisi SG Arrival Card.{" "}
            <span className="bch-badge" data-tone="caution">
              perlu cek ulang
            </span>{" "}
            Pastikan di{" "}
            <a href="https://www.ica.gov.sg" target="_blank" rel="noopener">
              ica.gov.sg
            </a>
            .
          </li>
        </ul>

        <h2 id="check-in">Check-in</h2>
        <ul>
          <li>Datang minimal 45 menit sebelum berangkat. 60 menit pada Jumat sore, Sabtu pagi, atau hari libur.</li>
          <li>Majestic mensyaratkan check-in di konter 60 menit sebelum berangkat.</li>
          <li>
            Horizon menutup check-in 20 menit sebelum berangkat di HarbourFront dan 30 menit di Harbour Bay, menurut
            sumber pihak ketiga.{" "}
            <span className="bch-badge" data-tone="caution">
              perlu cek ulang
            </span>
          </li>
          <li>RoRo ASDP minta datang minimal 2 jam sebelumnya.</li>
        </ul>

        <h2 id="terakhir">Feri terakhir untuk pulang hari</h2>
        <p>
          Terakhir dari Singapura ke Batam Centre 21:40 (BatamFast) dan 21:50 (Sindo) waktu Singapura. Ke Harbour Bay
          21:35. Ke Sekupang 19:30 (BatamFast) dan 20:40 (Majestic, perlu cek ulang). Singapura satu jam di depan WIB,
          jadi 21:40 di sana sama dengan 20:40 di Batam. Yang berlaku hari ini ada di{" "}
          <Link href="/jalan/feri" prefetch={false}>
            widget feri terakhir
          </Link>
          .
        </p>

        <h2 id="barang">Barang bawaan pulang dari Singapura</h2>
        <p>Menurut PMK 203/PMK.04/2017:</p>
        <ul>
          <li>Barang pribadi sampai FOB USD 500 per orang per kedatangan bebas bea masuk dan pajak.</li>
          <li>
            Kelebihannya kena bea masuk flat 10% ditambah PPN, dan PPh 0,5 sampai 10% bila punya NPWP, atau 1 sampai 20%
            bila tidak.
          </li>
          <li>
            Bebas cukai: 200 batang sigaret, 25 batang cerutu, atau 100 gram tembakau iris, dan atau 1 liter minuman
            mengandung etil alkohol. Alkohol untuk usia 21 tahun ke atas.
          </li>
          <li>PMK 92/2025 yang berlaku 1 April 2026 tidak mengubah angka USD 500.</li>
          <li>Uang tunai di atas Rp100 juta atau setara wajib dilaporkan.</li>
        </ul>

        <h2 id="kesehatan">Kartu kesehatan</h2>
        <p>
          Tidak ditemukan kewajiban kartu kesehatan khusus untuk rute Batam ke Singapura dan Malaysia per November 2026.
          BatamFast menautkan dokumen Quick Travel Requirement untuk panduan terbaru.
        </p>

        <h2 id="biaya">Biaya tambahan</h2>
        <ul>
          <li>
            <strong>Sindo:</strong> tarif dasar mulai SGD 28. Berangkat dari Singapura ditambah Singapore Passenger
            Departure Fee SGD 10. Berangkat dari Batam ditambah Batam Terminal Fee Rp100.000.
          </li>
          <li>
            <strong>BatamFast:</strong> mulai SGD 43 sekali jalan dan SGD 76 pulang pergi, sudah termasuk fee.
          </li>
          <li>
            <strong>Fuel surcharge:</strong> SGD 6 dari Singapura ke Batam, Rp65.000 dari Batam ke Singapura. Berlaku 12
            Maret 2026 menurut Sindo dan Mothership. Judul berita di situs BatamFast menulis 14 Maret 2026.
          </li>
          <li>Penumpang Horizon yang beli lewat pihak ketiga dilaporkan harus membayar surcharge di konter.</li>
        </ul>

        <h2 id="beli">Cara beli resmi</h2>
        <p>
          Situs atau aplikasi operator, atau konter di terminal. Klook, KKday, dan Traveloka hanya agregator. Untuk
          Jumat sore, Sabtu pagi, dan libur nasional Singapura, sebaiknya pesan 2 sampai 3 hari sebelumnya. Tiket RoRo
          Telaga Punggur ke Tanjung Uban hanya lewat{" "}
          <a href="https://trip.ferizy.com" target="_blank" rel="noopener">
            trip.ferizy.com
          </a>
          , tidak di loket. Daftar lengkap ada di{" "}
          <Link href="/jalan/feri#operator" prefetch={false}>
            tautan resmi
          </Link>
          .
        </p>

        <h2 id="angin-utara">Musim angin utara</h2>
        <p>
          November sampai Februari, puncaknya Desember dan Januari. Gelombang di perairan Batam, Bintan, Karimun, dan
          Lingga bisa 1,25 sampai 2,5 m. Di Natuna dan Anambas 2,5 sampai 4 m, bahkan bisa lebih. BMKG Hang Nadim
          (ANTARA, Januari 2023) menyebut Anambas dan Natuna paling terdampak karena langsung menghadap utara.
        </p>
        <p>
          Feri Dumai Line sempat dihantam ombak 2 sampai 3 m pada 4 Januari 2026. Jadwal RoRo Punggur ke Tanjung Uban
          pernah dijarangkan menjadi tiap 1 jam 15 menit pada Januari 2026 karena cuaca.
        </p>
        <p>
          Di musim ini, siapkan obat antimabuk, pilih kursi di tengah atau belakang kapal, beri waktu cadangan, dan
          pantau pengumuman pembatalan. Kondisi ombak sekarang ada di{" "}
          <Link href="/langit-laut?mode=ombak" prefetch={false}>
            Langit &amp; Laut
          </Link>
          .
        </p>

        <h2 id="pompong">Keselamatan di pompong</h2>
        <ul>
          <li>Minta dan pakai pelampung sebelum pompong jalan, terutama untuk anak-anak.</li>
          <li>
            Jangan naik kalau pompong sudah kelebihan muatan. Satu pompong PPMS standarnya 12 penumpang dan 1 pengemudi.
          </li>
          <li>Simpan HP dan dokumen di kantong kedap air. Siapkan uang tunai pecahan kecil.</li>
          <li>
            Hindari menyeberang saat hujan badai atau angin kencang. Cek{" "}
            <Link href="/langit-laut" prefetch={false}>
              radar hujan
            </Link>{" "}
            sebelum berangkat. Rute malam hanya lewat pesanan.
          </li>
          <li>Untuk pulau yang jauh seperti Kasu, Terong, dan Abang, sepakati jam jemput balik dengan tekong.</li>
        </ul>
        <p>
          Rute dan tarif ada di halaman{" "}
          <Link href="/jalan/pompong" prefetch={false}>
            Pompong
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
