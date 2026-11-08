import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import JsonLd from "@/components/site/JsonLd";
import BeritaWidget from "@/features/berita/BeritaWidget";
import { daftarAcara } from "@/features/budaya/data";
import { DAFTAR_KATEGORI, slugKategori, tempatDiKategori } from "@/features/direktori/data";
import HariIniMuat from "@/features/hari-ini/HariIniMuat";
import ModulAcara from "@/features/hari-ini/ModulAcara";
import { BATAS_PONSEL, GAMBAR_DESKTOP, GAMBAR_PONSEL } from "@/features/hari-ini/peta-dasar";
import { tanggalTulisan } from "@/features/jurnal/data";
import { semuaTulisan } from "@/features/konten/baca";
import { MAPPED_CAMS } from "@/features/langit-laut/lib/cctv";
import { categoryCounts, categoryMap, places } from "@/features/makan/lib/data";
import { grafisHidanganKecil, slugHidangan } from "@/features/makan/lib/hidangan";
import PetaMuat from "@/features/peta/PetaMuat";
import { grafLd, organisasi, situsWeb } from "@/lib/data-terstruktur";
import { kaidahJudul } from "@/lib/judul";
import "@/features/hari-ini/beranda.css";

// Jumlah dihitung dari data saat build (PEDOMAN 5.3).
const JUMLAH_HOTEL = tempatDiKategori("akomodasi").length;

const HIDANGAN_BERANDA = ["seafood", "sop-ikan", "kopitiam", "makanan-padang", "bakso-mie-ayam", "kue-jajanan"];

const TRANSPORTASI = [
  { href: "/jalan/trans-batam", nama: "Trans Batam", ket: "9 koridor · Rp5.000" },
  { href: "/jalan/feri", nama: "Feri", ket: "Singapura, Johor, pulau sekitar" },
  { href: "/jalan/pompong", nama: "Pompong", ket: "Ke pulau sekitar Batam" },
  { href: "/jalan/feri/panduan", nama: "Panduan Menyeberang", ket: "Paspor dan barang bawaan" },
];

const KATEGORI_LAYANAN = ["kesehatan", "keamanan_darurat", "akomodasi", "ibadah", "pendidikan", "wisata"];

// Satu kamera per kecamatan, supaya contohnya tersebar.
const KAMERA = [...new Map(MAPPED_CAMS.map((c) => [c.area, c])).values()].slice(0, 5);

function Selengkapnya({ href }: { href: string }) {
  return (
    <Link href={href} className="bch-aksi br-selengkapnya" prefetch={false}>
      Selengkapnya →
    </Link>
  );
}

export const revalidate = 300;

export default async function Beranda() {
  // Peta Hari Ini adalah gambar terbesar di layar pertama. Hanya satu yang diunduh, sesuai lebar layar.
  preload(GAMBAR_DESKTOP, { as: "image", fetchPriority: "high", media: `not all and ${BATAS_PONSEL}` });
  preload(GAMBAR_PONSEL, { as: "image", fetchPriority: "high", media: BATAS_PONSEL });
  const [jurnal] = await semuaTulisan();
  const acara = daftarAcara().map((a) => ({ id: a.id, nama: kaidahJudul(a.nama), bulan: a.bulan, lokasi: a.lokasi }));
  const layanan = DAFTAR_KATEGORI.filter((k) => KATEGORI_LAYANAN.includes(k.kategori));

  return (
    <div className="br-halaman">
      <JsonLd data={grafLd(organisasi(), situsWeb())} />
      <HariIniMuat />

      <div className="br-dasbor">
        <BeritaWidget />

        <section className="br-modul" aria-labelledby="br-acara">
          <h2 id="br-acara">Things to Do</h2>
          <ModulAcara acara={acara} />
          <Selengkapnya href="/things-to-do" />
        </section>

        <section className="br-modul" aria-labelledby="br-transportasi">
          <h2 id="br-transportasi">Transportasi</h2>
          <ul className="br-baris">
            {TRANSPORTASI.map((t) => (
              <li key={t.href}>
                <Link href={t.href} prefetch={false}>
                  <span>{t.nama}</span>
                  <span className="ket">{t.ket}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Selengkapnya href="/jalan" />
        </section>
      </div>

      <section className="br-seksi" aria-labelledby="br-tempat">
        <h2 id="br-tempat" className="bch-judul-seksi">
          Cari Tempat di Batam
        </h2>
        <PetaMuat jumlahTanpaTitik={{ hotel: JUMLAH_HOTEL }} />
      </section>

      <div className="br-dasbor">
        <section className="br-modul" aria-labelledby="br-makanan">
          <h2 id="br-makanan">Makanan</h2>
          <ul className="br-hidangan">
            {HIDANGAN_BERANDA.map((id) => (
              <li key={id}>
                <Link href={`/makan/hidangan/${slugHidangan(id)}`} prefetch={false}>
                  <Image src={grafisHidanganKecil(id)} alt="" width={160} height={160} unoptimized loading="lazy" />
                  <span>{kaidahJudul(categoryMap[id]?.name_id ?? "")}</span>
                  <span className="bch-data">{categoryCounts[id] ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/makan" className="bch-aksi br-selengkapnya" prefetch={false}>
            Semua {places.length} Tempat →
          </Link>
        </section>

        <section className="br-modul" aria-labelledby="br-cctv">
          <h2 id="br-cctv">CCTV</h2>
          <ul className="br-baris">
            {KAMERA.map((c) => (
              <li key={c.slug}>
                <Link href={`/cctv?cam=${c.slug}`} prefetch={false}>
                  <span>{c.name}</span>
                  <span className="ket">{c.area}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/cctv" className="bch-aksi br-selengkapnya" prefetch={false}>
            Semua {MAPPED_CAMS.length} Kamera →
          </Link>
        </section>

        <section className="br-modul" aria-labelledby="br-layanan">
          <h2 id="br-layanan">Layanan Warga</h2>
          <ul className="br-baris">
            {layanan.map((k) => (
              <li key={k.kategori}>
                <Link href={`/info/direktori/${slugKategori(k.kategori)}`} prefetch={false}>
                  <span>{kaidahJudul(k.nama)}</span>
                  <span className="bch-data ket">{tempatDiKategori(k.kategori).length.toLocaleString("id-ID")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Selengkapnya href="/info" />
        </section>
      </div>

      <div className="br-penutup">
        {jurnal && (
          <section className="br-jurnal" aria-labelledby="br-jurnal">
            <Link href={`/jurnal/${jurnal.slug}`} prefetch={false}>
              <Image className="bch-grafis" src={jurnal.gambar} alt="" width={720} height={480} unoptimized loading="lazy" />
              <span className="teks">
                <span className="bch-kicker">Jurnal · {jurnal.rubrik}</span>
                <span id="br-jurnal" className="judul">
                  {jurnal.judul}
                </span>
                <span className="ringkas">{jurnal.ringkasan}</span>
                <span className="bch-data">
                  {jurnal.penulis} · {tanggalTulisan(jurnal.tanggal)}
                </span>
              </span>
            </Link>
          </section>
        )}
        <section className="br-kartu-pos" aria-labelledby="br-kartu-pos">
          <Link href="/kartu-pos" prefetch={false}>
            <Image className="bch-grafis" src="/kartu-pos/layar/selat.webp" alt="" width={874} height={620} unoptimized loading="lazy" />
            <span className="judul" id="br-kartu-pos">
              Kartu Pos dari Batam
            </span>
            <span className="ringkas">Pilih desain, tulis pesan, lalu cetak.</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
