import { connection } from "next/server";
import AdminAgenda from "@/features/konten/admin/AdminAgenda";
import { ambilKonten } from "@/features/konten/store";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";

export default async function AgendaAdmin() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;
  const store = await ambilKonten();
  const baris = (await store?.agenda(true)) ?? [];

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <h1 className="m-0">Agenda</h1>
      <NavAdmin />
      <AdminAgenda baris={baris} />
    </div>
  );
}
