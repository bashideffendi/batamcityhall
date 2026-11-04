import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { cariTempat } from "@/features/direktori/data";
import CatatanMode from "@/features/tukang/CatatanMode";
import FormKoreksi from "@/features/tukang/FormKoreksi";
import { modeKiriman } from "@/features/tukang/mode";
import { JENIS_KOREKSI } from "@/features/tukang/kategori";
import "@/features/tukang/tukang.css";

export const metadata: Metadata = {
  title: "Koreksi data",
  description: "Cara mengoreksi data di Batam City Hall, dan meminta data pribadi dihapus.",
};

type Props = { searchParams: Promise<{ tempat?: string; tukang?: string; jenis?: string }> };

export default async function Koreksi({ searchParams }: Props) {
  const q = await searchParams;
  const mode = modeKiriman();
  const tempat = q.tempat ? cariTempat(q.tempat) : undefined;
  const tukangId = z.uuid().safeParse(q.tukang).data ?? null;
  const jenisAwal = JENIS_KOREKSI.find((j) => j.nilai === q.jenis)?.nilai ?? "data_salah";

  return (
    <div className="bch-page bch-tk-halaman">
      <p className="bch-kicker m-0">Koreksi data</p>
      <h1 className="mt-2">Ada yang salah?</h1>
      <p className="bch-lede">Pasti ada. Sebagian besar data di sini belum dicek ulang di lapangan.</p>

      {tempat && (
        <p className="bch-note" data-koreksi-tempat={tempat.id}>
          Koreksi untuk: <Link href={`/info/tempat/${tempat.id}`}>{tempat.nama}</Link>
        </p>
      )}
      {q.tempat && !tempat && (
        <p className="bch-note" data-tone="caution">
          Kode tempat di tautan ini tidak kami kenal. Tulis nama tempatnya di kolom isi.
        </p>
      )}
      {tukangId && <p className="bch-note">Koreksi untuk satu entri Tukang Langganan.</p>}

      <CatatanMode mode={mode} />
      {mode !== "mati" && <FormKoreksi tempatId={tempat?.id ?? null} tukangId={tukangId} jenisAwal={jenisAwal} />}

      <div className="bch-prose mt-6">
        <h2>Yang akan paling membantu</h2>
        <ul>
          <li>Tempat yang sudah tutup, pindah, atau ganti nomor.</li>
          <li>Titik lokasi tempat yang belum ada di peta.</li>
          <li>Pemilik kantor PPAT atau notaris yang ingin data kantornya diperbaiki atau dihapus.</li>
          <li>
            Tukang atau perekomendasi yang ingin datanya dikoreksi atau dihapus. Soal apa saja yang kami simpan, lihat{" "}
            <Link href="/privasi">Privasi</Link>.
          </li>
        </ul>
        <p>
          Cara kerja data kami ada di <Link href="/tentang">Tentang</Link>.
        </p>
      </div>
    </div>
  );
}
