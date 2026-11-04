import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Emblem from "@/components/site/Emblem";
import { ATTRIBUTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kolofon",
  description: "Huruf, warna, peta, lisensi, dan atribusi Batam City Hall.",
};

/** Tanggal build Protomaps yang diekstrak scripts/extract-basemap.mjs. Dibaca saat build. */
function tanggalPetaDasar(): string | null {
  try {
    const raw = readFileSync(join(process.cwd(), "public", "tiles", "BUILD.txt"), "utf8").trim();
    const m = /^(\d{4})(\d{2})(\d{2})$/.exec(raw);
    if (!m) return null;
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return null;
  }
}

const Tautan = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener">
    {children}
  </a>
);

export default function Kolofon() {
  const tanggal = tanggalPetaDasar();
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Kolofon</p>
      <h1 className="mt-2">Dari apa situs ini dibuat</h1>
      <p className="bch-lede">Huruf, warna, peta, dan siapa yang berhak disebut.</p>
      <Emblem />

      <div className="bch-prose">
        <h2>Huruf</h2>
        <dl className="bch-daftar">
          <dt>Source Serif 4</dt>
          <dd>Judul, label peta. Frank Grießhammer, Adobe. SIL Open Font License 1.1.</dd>
          <dt>Plus Jakarta Sans</dt>
          <dd>Isi. Gumpita Rahayu, Tokotype. SIL Open Font License 1.1.</dd>
          <dt>IBM Plex Mono</dt>
          <dd>Data dan koordinat. IBM. SIL Open Font License 1.1.</dd>
        </dl>
        <p>
          Huruf disajikan dari situs ini sendiri, tidak ada permintaan ke layanan huruf pihak lain dari peramban Anda.
        </p>

        <h2>Warna</h2>
        <p>
          Palet turun dari tinta risograph, satu keluarga untuk halaman dan peta. Nilai heksadesimal tinta Riso adalah
          perkiraan dari stencil.wiki, karena warna tinta sebenarnya tidak punya padanan layar yang pasti.
        </p>
        <p>Token warna, huruf, dan jarak akan dirilis terbuka begitu repositori situs ini publik.</p>

        <h2>Peta</h2>
        <p>
          Peta dasar © <Tautan href="https://openstreetmap.org/copyright">OpenStreetMap contributors</Tautan>, lewat{" "}
          <Tautan href="https://protomaps.com">Protomaps</Tautan>
          {tanggal ? `, cuplikan ${tanggal}` : ""}. Digambar dengan{" "}
          <Tautan href="https://maplibre.org">MapLibre GL JS</Tautan> dan{" "}
          <Tautan href="https://github.com/protomaps/PMTiles">PMTiles</Tautan>, keduanya berlisensi BSD-3-Clause.
        </p>
        <p>Peta ini gayanya saja yang chart laut. Bukan untuk navigasi.</p>
        <p>
          Kartusis, mawar angin, skala batang, dan waterlining meminjam konvensi dua peta lama:{" "}
          <em>Straits of Singapore, Durian and Rhio</em> (Hydrographic Office of the Admiralty, 1840, koleksi National
          Library Board Singapura, domain publik) dan{" "}
          <em>Kaart van de Noordkust van het Eiland Bantang [i.e. Batam]</em> (E.H. Boom, 1847, koleksi KITLV, Leiden
          University Libraries). Semua digambar ulang. Belum ada gambar dari kedua peta itu yang dipakai di situs ini.
        </p>

        <h2>Tekstur</h2>
        <p>
          Butiran kertas dibuat oleh skrip dari bilangan acak, bukan dari foto, jadi tidak ada lisensi yang perlu
          dicatat. Tekstur dimatikan di atas peta dan saat mode hemat data aktif.
        </p>

        <h2>Sumber data</h2>
        <ul>
          {ATTRIBUTION.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <p>Sebagian sumber di atas baru dipakai saat loketnya dibuka.</p>

        <h2>Bantuan AI</h2>
        <p>
          Kode situs ini ditulis dengan bantuan AI (Claude Code). Belum ada ilustrasi di situs ini. Kalau nanti AI
          dipakai untuk latar ilustrasi, bagiannya akan diumumkan di sini.
        </p>
      </div>
    </div>
  );
}
