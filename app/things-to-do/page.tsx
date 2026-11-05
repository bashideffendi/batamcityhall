import type { Metadata } from "next";
import KisiPintu from "@/components/site/KisiPintu";
import PembukaBagian from "@/components/site/PembukaBagian";
import { daftarAcara } from "@/features/budaya/data";
import Kalender from "@/features/budaya/Kalender";
import { LABEL_STATUS } from "@/features/budaya/label";
import { slugKategori, tempatDiKategori } from "@/features/direktori/data";
import AgendaMendatang from "@/features/konten/AgendaMendatang";
import { agendaMendatang } from "@/features/konten/baca";
import "@/features/budaya/budaya.css";

export const metadata: Metadata = {
  title: "Things to Do",
  description: "Acara di Batam sepanjang tahun dan tempat untuk dikunjungi.",
};

const ARTI_STATUS = [
  ["rutin", "Sudah beberapa kali diadakan."],
  ["pernah", "Pernah diadakan, belum tentu berulang."],
  ["belum pasti", "Tanggal atau agendanya belum pasti."],
  ["dibatalkan", "Dijadwalkan, lalu dibatalkan."],
] as const;

const TEMPAT = [
  { kategori: "wisata", nama: "Wisata" },
  { kategori: "ruang_publik", nama: "Ruang Publik" },
  { kategori: "budaya", nama: "Museum dan Budaya" },
  { kategori: "landmark", nama: "Penanda Kota" },
  { kategori: "olahraga", nama: "Olahraga" },
  { kategori: "belanja", nama: "Belanja" },
] as const;

export const revalidate = 300;

export default async function ThingsToDo() {
  const agenda = await agendaMendatang();
  return (
    <div className="bch-page">
      <PembukaBagian id="kegiatan" />

      <AgendaMendatang agenda={agenda} />

      <section aria-labelledby="ttd-tempat" className="bch-seksi-rapat">
        <h2 id="ttd-tempat" className="bch-judul-seksi">
          Tempat untuk Dikunjungi
        </h2>
        <KisiPintu
          isi={TEMPAT.map((t) => ({
            href: `/info/direktori/${slugKategori(t.kategori)}`,
            nama: t.nama,
            ket: `${tempatDiKategori(t.kategori).length.toLocaleString("id-ID")} tempat`,
          }))}
        />
      </section>

      <section aria-labelledby="ttd-acara" className="bch-seksi-rapat">
        <h2 id="ttd-acara" className="bch-judul-seksi">
          Acara Sepanjang Tahun
        </h2>
        <Kalender acara={daftarAcara()} />
        <dl className="bud-legenda">
          {ARTI_STATUS.map(([s, arti]) => (
            <div key={s}>
              <dt>
                <span className="bch-badge" data-tone={LABEL_STATUS[s].nada}>
                  {LABEL_STATUS[s].teks}
                </span>
              </dt>
              <dd>{arti}</dd>
            </div>
          ))}
        </dl>
        <p className="bch-catatan-halaman">Tanggal dapat berubah. Tanyakan penyelenggara sebelum datang.</p>
      </section>
    </div>
  );
}
