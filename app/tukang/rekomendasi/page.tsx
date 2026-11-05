import type { Metadata } from "next";
import { connection } from "next/server";
import CatatanMode from "@/features/tukang/CatatanMode";
import { hariIni } from "@/features/tukang/aturan";
import FormRekomendasi from "@/features/tukang/FormRekomendasi";
import { modeKiriman, PESAN_MATI_REKOMENDASI } from "@/features/tukang/mode";
import { KECAMATAN } from "@/lib/data/schema";

export const metadata: Metadata = {
  title: "Kirim Rekomendasi",
  description: "Rekomendasikan tukang atau jasa di Batam yang pernah kamu pakai sendiri.",
};

export default async function KirimRekomendasi() {
  // Mode dibaca saat jalan, bukan dibekukan saat build.
  await connection();
  const mode = modeKiriman();
  return (
    <div className="bch-page bch-tk-halaman">
      <p className="bch-kicker m-0">Tukang Langganan</p>
      <h1 className="mt-2">Kirim Rekomendasi</h1>
      <p className="bch-lede">
        Rekomendasikan tukang atau jasa yang pernah kamu pakai sendiri. Tukang tidak dapat mendaftarkan diri.
      </p>
      <CatatanMode mode={mode} pesanMati={PESAN_MATI_REKOMENDASI} />
      {mode !== "mati" && <FormRekomendasi bulanIni={hariIni().slice(0, 7)} kecamatan={KECAMATAN} />}
    </div>
  );
}
