import { connection } from "next/server";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import IsiKoordinatMuat from "@/features/tukang/admin/IsiKoordinatMuat";
import NavAdmin from "@/features/tukang/admin/NavAdmin";
import { hariIni } from "@/features/tukang/aturan";
import { daftarTitik } from "@/features/tukang/titik-admin";

export default async function Koordinat() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <p className="bch-kicker m-0">Admin</p>
      <h1 className="mt-2">Isi koordinat</h1>
      <NavAdmin />
      <p className="bch-lede">
        Pilih tempat atau halte, cek lokasinya di Google Maps, lalu klik titiknya di peta. Server tidak menyimpan apa
        pun: hasilnya Anda unduh, lalu masukkan lewat <code>tools/import_koordinat.py</code>.
      </p>
      <IsiKoordinatMuat titik={daftarTitik()} tanggal={hariIni()} />
    </div>
  );
}
