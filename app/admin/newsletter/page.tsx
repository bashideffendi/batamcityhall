import { connection } from "next/server";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import AdminNewsletter from "@/features/tukang/admin/AdminNewsletter";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";
import { ambilStore } from "@/features/tukang/store";

export default async function NewsletterAdmin() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;
  const pelanggan = (await ambilStore()?.pelanggan()) ?? [];

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <h1 className="m-0">Newsletter</h1>
      <NavAdmin />
      <AdminNewsletter pelanggan={pelanggan} />
    </div>
  );
}
