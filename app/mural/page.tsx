import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DASAR_TILE, JADWAL_MURAL, KARTU, PERHENTIAN, QUEST_AKTIF, RUTE_TAK_DIGAMBAR } from "@/features/mural/data";
import MuralHalaman from "@/features/mural/MuralHalaman";

type Props = { searchParams: Promise<{ spot?: string | string[] }> };

const satu = (v: string | string[] | undefined) => (typeof v === "string" ? v : null);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const spot = satu((await searchParams).spot);
  const k = KARTU.find((x) => x.id === spot);
  if (!k) {
    return {
      title: "Mode Mural",
      description:
        "Pesisir Batam sebagai mural yang hidup oleh data. Satu segmen berjalan, ilustrasinya masih placeholder.",
    };
  }
  return {
    title: `${k.judul}: Mode Mural`,
    description: k.isi[0],
    openGraph: { images: [{ url: `/mural/og/${k.id}`, width: 1200, height: 630 }] },
  };
}

// Nama kecamatan di bingkai segmen, dari keluaran scripts/buat-mural-placeholder.mjs.
const namaKecamatan = (): string[] => {
  const meta = JSON.parse(readFileSync(join(process.cwd(), "public", DASAR_TILE, "meta.json"), "utf8")) as {
    kecamatan: { nama: string }[];
  };
  return meta.kecamatan.map((k) => k.nama);
};

export default async function Mural({ searchParams }: Props) {
  const spot = satu((await searchParams).spot);
  return (
    <>
      <div className="bch-page mural-kepala">
        <p className="bch-kicker m-0">Segmen 2 dari 8</p>
        <h1 className="mt-2">Mode Mural: Harbour Bay, Nagoya, Jodoh</h1>
        <p className="bch-lede">
          Pesisir Batam sebagai satu gambar panjang. Hujan, ombak, feri, dan cahayanya mengikuti data. Tekan pin untuk
          membuka kartu.
        </p>
      </div>
      <noscript>
        <p className="bch-note">Mural butuh JavaScript. Semua tempatnya tetap ada di direktori Layanan Warga.</p>
      </noscript>
      <MuralHalaman
        dasar={DASAR_TILE}
        kartu={KARTU}
        perhentian={PERHENTIAN}
        quest={QUEST_AKTIF}
        jadwal={JADWAL_MURAL}
        ruteTakDigambar={RUTE_TAK_DIGAMBAR}
        namaKecamatan={namaKecamatan()}
        spotAwal={spot}
      />
    </>
  );
}
