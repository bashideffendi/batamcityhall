import { connection } from "next/server";
import AdminJurnal from "@/features/konten/admin/AdminJurnal";
import { ambilKonten } from "@/features/konten/store";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";
import { hariIni } from "@/features/tukang/aturan";

export default async function JurnalAdmin() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;
  const store = await ambilKonten();
  const baris = (await store?.jurnal(true)) ?? [];

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <h1 className="m-0">Jurnal</h1>
      <NavAdmin />
      <AdminJurnal baris={baris} tanggal={hariIni()} penulis="Redaksi Barelang.co" />
    </div>
  );
}
