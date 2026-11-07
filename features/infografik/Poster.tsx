// Poster infografik bawaan. Ukurannya mengikuti lebar wadah (satuan cqi), jadi poster yang sama tajam di kisi
// maupun di halaman detail. Teksnya teks sungguhan, terbaca pembaca layar dan mesin pencari.
import type { CSSProperties, ReactNode } from "react";
import nasional from "@/data/darurat/nomor_darurat_09.json";
import { categories, categoryCounts, kawasanBerisi, places } from "@/features/makan/lib/data";
import { faktaInfografik } from "@/features/sejarah/angka";
import { kaidahJudul } from "@/lib/judul";
import type { IdPoster } from "./data";

const angkaKe = (s: string) => Number(s.replace(/[^\d,]/g, "").replace(",", "."));
const ribuan = (n: number) => n.toLocaleString("id-ID");

function Bingkai({ tema = "kertas", kicker, judul, kaki, children }: { tema?: "kertas" | "kuning"; kicker: string; judul: string; kaki: string; children: ReactNode }) {
  return (
    <div className="ig-poster" data-tema={tema}>
      <span className="ig-hias" aria-hidden="true" />
      <div className="ig-dalam">
        <p className="ig-kicker">{kicker}</p>
        <p className="ig-judul">{judul}</p>
        {children}
        <p className="ig-kaki">
          <span>Batam City Hall</span>
          <span>{kaki}</span>
        </p>
      </div>
    </div>
  );
}

function Batang({ baris, warna = "biru" }: { baris: { nama: string; nilai: number; ket?: string }[]; warna?: "biru" | "merah" | "hitam" }) {
  const maks = Math.max(...baris.map((b) => b.nilai));
  return (
    <ul className="ig-batang" data-warna={warna}>
      {baris.map((b) => (
        <li key={b.nama} style={{ "--p": `${(b.nilai / maks) * 100}%` } as CSSProperties}>
          <span className="ig-batang-nama">{b.nama}</span>
          <span className="ig-batang-nilai">{b.ket ?? ribuan(b.nilai)}</span>
          <span className="ig-batang-bilah" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

function Penduduk() {
  const f = faktaInfografik();
  return (
    <Bingkai kicker="Penduduk" judul="Dari Sekitar 6.000 Jiwa pada 1965" kaki="Data BP Batam, Disdukcapil, BPS">
      <div className="ig-dua">
        <div>
          <p className="ig-angka">6.000</p>
          <p className="ig-ket">1965, versi BP Batam</p>
        </div>
        <p className="ig-panah" aria-hidden="true">
          →
        </p>
        <div>
          <p className="ig-angka" data-warna="merah">
            {f.dukcapil}
          </p>
          <p className="ig-ket">Semester II 2025, registrasi Disdukcapil</p>
        </div>
      </div>
      <p className="ig-teks">Metodenya berbeda, jadi ini gambaran besar, bukan satu garis.</p>
      <div className="ig-kotak">
        <p className="ig-sub">Penduduk 2025 Tergantung Siapa yang Menghitung</p>
        <ul className="ig-daftar">
          <li>
            <b>{f.dukcapil}</b> Disdukcapil, Semester II
          </li>
          <li>
            <b>{f.bps}</b> BPS, dikutip Wikipedia
          </li>
          <li>
            <b>1,79 juta</b> Databoks, tidak kami pakai
          </li>
        </ul>
      </div>
    </Bingkai>
  );
}

function Laut() {
  const f = faktaInfografik();
  const persen = Math.round((angkaKe(f.perairan) / (angkaKe(f.perairan) + angkaKe(f.daratan))) * 100);
  return (
    <Bingkai kicker="Geografi" judul="Hampir 3 dari 4 Bagian Batam Adalah Laut" kaki="Luas wilayah Kota Batam">
      <p className="ig-angka ig-angka-besar" data-warna="biru">
        ±{persen}%
      </p>
      <div className="ig-wafel" role="img" aria-label={`${persen} dari 100 kotak perairan, ${100 - persen} daratan`}>
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} data-jenis={i < persen ? "laut" : "darat"} />
        ))}
      </div>
      <ul className="ig-legenda">
        <li data-jenis="laut">Perairan {f.perairan}</li>
        <li data-jenis="darat">Daratan {f.daratan}</li>
      </ul>
    </Bingkai>
  );
}

function Wisman() {
  const f = faktaInfografik();
  const total = angkaKe(f.wisman);
  const sg = angkaKe(f.singapura);
  const my = angkaKe(f.malaysia);
  return (
    <Bingkai kicker="Wisatawan Mancanegara" judul="Hampir 1 dari 2 Kunjungan Wisman 2025 dari Singapura" kaki="Kunjungan wisman 2025">
      <div>
        <p className="ig-angka">{f.wisman}</p>
        <p className="ig-ket">kunjungan wisman ke Batam, 2025</p>
      </div>
      <Batang
        baris={[
          { nama: "Singapura", nilai: sg, ket: `${f.singapura} · ${Math.round((sg / total) * 100)}%` },
          { nama: "Malaysia", nilai: my, ket: `${f.malaysia} · ${Math.round((my / total) * 100)}%` },
          { nama: "Negara lain, selisih dari total", nilai: total - sg - my, ket: ribuan(total - sg - my) },
        ]}
      />
      <p className="ig-teks">Rata-rata {f.perHari} wisman per hari: {f.wisman} ÷ 365, angka turunan.</p>
    </Bingkai>
  );
}

function Darurat() {
  const nomor = (nasional as { nama: string; kontak: string }[]).filter((n) => /^\d{3}$/.test(n.kontak));
  return (
    <Bingkai kicker="Layanan Warga" judul="Lima Nomor Darurat" kaki="Simpan di ponsel">
      <ul className="ig-darurat">
        {nomor.map((n) => (
          <li key={n.kontak}>
            <span className="ig-angka" data-warna="merah">
              {n.kontak}
            </span>
            <span className="ig-ket">{kaidahJudul(n.nama)}</span>
          </li>
        ))}
      </ul>
    </Bingkai>
  );
}

function Makan() {
  const teratas = [...categories]
    .map((c) => ({ nama: kaidahJudul(c.name_id), nilai: categoryCounts[c.id] ?? 0 }))
    .filter((c) => c.nilai > 0)
    .sort((a, b) => b.nilai - a.nilai || a.nama.localeCompare(b.nama, "id"))
    .slice(0, 6);
  return (
    <Bingkai tema="kuning" kicker="Makanan" judul="Peta Rasa Batam" kaki="Data Makanan Batam City Hall">
      <ul className="ig-tiga">
        <li>
          <span className="ig-angka">{places.length}</span>
          <span className="ig-ket">Tempat</span>
        </li>
        <li>
          <span className="ig-angka">{categories.length}</span>
          <span className="ig-ket">Kategori</span>
        </li>
        <li>
          <span className="ig-angka">{kawasanBerisi.length}</span>
          <span className="ig-ket">Kawasan</span>
        </li>
      </ul>
      <p className="ig-sub">Kategori dengan Tempat Terbanyak</p>
      <Batang baris={teratas} warna="hitam" />
    </Bingkai>
  );
}

const POSTER: Record<IdPoster, () => ReactNode> = { penduduk: Penduduk, laut: Laut, wisman: Wisman, darurat: Darurat, makan: Makan };

export default function Poster({ id }: { id: IdPoster }) {
  const Isi = POSTER[id];
  return <Isi />;
}
