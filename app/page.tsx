import Image from "next/image";
import Link from "next/link";
import ceritaPilihan from "@/data/beranda/cerita_pilihan.json";
import BeritaWidget from "@/features/berita/BeritaWidget";
import { TEMPAT } from "@/features/direktori/data";
import HariIniMuat from "@/features/hari-ini/HariIniMuat";
import { jenisDari } from "@/features/peta/jenis-tempat";
import PetaMuat from "@/features/peta/PetaMuat";
import { LOKET } from "@/lib/site";
import "@/features/hari-ini/beranda.css";

// Jumlah dihitung dari data saat build (PEDOMAN 5.3).
const JUMLAH_BERTITIK = TEMPAT.filter((p) => p.lat != null && p.lng != null && jenisDari(p.kategori, p.subkategori)).length;
const JUMLAH_HOTEL = TEMPAT.filter((p) => p.kategori === "akomodasi").length;

export default function Beranda() {
  return (
    <div className="br-halaman">
      <HariIniMuat />

      <section className="br-seksi" aria-labelledby="br-tempat">
        <div className="bch-kepala-bagian">
          <div>
            <p className="bch-kicker bch-penanda-biru m-0">Peta</p>
            <h2 id="br-tempat">Cari Tempat di Batam</h2>
          </div>
          <p>Sebanyak {JUMLAH_BERTITIK} tempat sudah punya titik lokasi; sisanya sedang dilengkapi.</p>
        </div>
        <PetaMuat jumlahTanpaTitik={{ hotel: JUMLAH_HOTEL }} />
      </section>

      <section className="br-seksi" aria-labelledby="br-loket">
        <div className="bch-kepala-bagian">
          <h2 id="br-loket">Jelajahi Batam</h2>
          <p>Mulai dari yang paling sering dicari: cuaca, laut, dan tempat makan.</p>
        </div>
        <ol className="br-indeks">
          {LOKET.map((l) => (
            <li key={l.nomor}>
              <Link href={l.href} className="butir">
                <Image className="gambar" src={l.grafis} alt="" width={420} height={420} unoptimized loading="lazy" />
                <span className="no">{l.nomor}</span>
                <span className="nama">{l.nama}</span>
                <span className="ket">{l.lede}.</span>
              </Link>
            </li>
          ))}
          <li className="bch-ajakan">
            <h3>Ada yang keliru atau sudah berubah?</h3>
            <p>Laporkan jam buka, alamat, atau nama tempat yang sudah tidak sesuai.</p>
            <Link href="/koreksi" className="bch-aksi">
              Kirim koreksi →
            </Link>
          </li>
        </ol>
      </section>

      <section className="br-seksi br-cerita" aria-labelledby="br-cerita">
        <figure>
          <Image className="bch-grafis" src={ceritaPilihan.gambar.src} alt="" width={1200} height={800} unoptimized loading="lazy" />
          <figcaption>{ceritaPilihan.gambar.keterangan}</figcaption>
        </figure>
        <div>
          <p className="bch-kicker br-cerita-penanda m-0">{ceritaPilihan.penanda}</p>
          <h2 id="br-cerita">{ceritaPilihan.judul}</h2>
          {ceritaPilihan.paragraf.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <Link href={ceritaPilihan.tautan.href} className="bch-aksi">
            {ceritaPilihan.tautan.label} →
          </Link>
        </div>
      </section>

      <div className="br-seksi br-berita">
        <BeritaWidget />
      </div>
    </div>
  );
}
