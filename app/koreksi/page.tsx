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
  title: "Kirim Koreksi",
  description: "Laporkan tempat yang tutup, pindah, berganti nomor, atau salah titik di peta.",
};

type Props = { searchParams: Promise<{ tempat?: string; tukang?: string; jenis?: string }> };

export default async function Koreksi({ searchParams }: Props) {
  const q = await searchParams;
  const mode = modeKiriman();
  const tempat = q.tempat ? cariTempat(q.tempat) : undefined;
  const tukangId = z.uuid().safeParse(q.tukang).data ?? null;
  const jenisAwal = JENIS_KOREKSI.find((j) => j.nilai === q.jenis)?.nilai ?? "data_salah";

  return (
    <div className="bch-page bch-baca bch-tk-halaman">
      <h1>Kirim Koreksi</h1>
      <p className="bch-lede">Laporkan tempat yang tutup, pindah, berganti nomor, atau salah titik di peta.</p>

      {tempat && (
        <p className="bch-note" data-koreksi-tempat={tempat.id}>
          Koreksi untuk: <Link href={`/info/tempat/${tempat.id}`}>{tempat.nama}</Link>
        </p>
      )}
      {q.tempat && !tempat && (
        <p className="bch-note" data-tone="caution">
          Kode tempat tidak dikenal. Tulis nama tempatnya di kolom di bawah.
        </p>
      )}
      {tukangId && <p className="bch-note">Koreksi untuk satu entri Tukang Langganan.</p>}

      <CatatanMode mode={mode} />
      {mode !== "mati" && <FormKoreksi tempatId={tempat?.id ?? null} tukangId={tukangId} jenisAwal={jenisAwal} />}

      <div className="bch-prose mt-6">
        <h2>Yang Paling Membantu</h2>
        <ul>
          <li>Titik lokasi tempat yang belum ada di peta.</li>
          <li>Permintaan pemilik kantor PPAT atau notaris untuk memperbaiki atau menghapus data kantornya.</li>
          <li>
            Permintaan tukang atau perekomendasi untuk mengoreksi atau menghapus datanya. Data yang kami simpan
            dijelaskan di <Link href="/privasi">Kebijakan Privasi</Link>.
          </li>
        </ul>
        <p>
          Cara data dihimpun dijelaskan di <Link href="/tentang">Tentang</Link>.
        </p>
      </div>
    </div>
  );
}
