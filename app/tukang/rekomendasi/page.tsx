import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import CatatanMode from "@/features/tukang/CatatanMode";
import { hariIni } from "@/features/tukang/aturan";
import FormRekomendasi from "@/features/tukang/FormRekomendasi";
import { modeKiriman } from "@/features/tukang/mode";
import { KECAMATAN } from "@/lib/data/schema";

export const metadata: Metadata = {
  title: "Kirim rekomendasi",
  description: "Rekomendasikan tukang yang pernah Anda pakai jasanya di Batam.",
};

export default async function KirimRekomendasi() {
  // Mode dibaca saat jalan, bukan dibekukan saat build.
  await connection();
  const mode = modeKiriman();
  return (
    <div className="bch-page bch-tk-halaman">
      <p className="bch-kicker m-0">Loket 03</p>
      <h1 className="mt-2">Kirim rekomendasi</h1>
      <p className="bch-lede">
        Untuk tukang yang pernah Anda pakai sendiri. Tukang tidak bisa mendaftarkan dirinya, dan tidak ada yang bayar.
      </p>
      <CatatanMode mode={mode} />
      {mode === "mati" ? (
        <p>
          Sementara itu, <Link href="/tukang">daftarnya</Link> masih kosong. Kami tidak mengisinya sendiri.
        </p>
      ) : (
        <FormRekomendasi bulanIni={hariIni().slice(0, 7)} kecamatan={KECAMATAN} />
      )}
    </div>
  );
}
