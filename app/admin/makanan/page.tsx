import { connection } from "next/server";
import AdminMakan from "@/features/konten/admin/AdminMakan";
import { ambilKonten } from "@/features/konten/store";
import { areas, categories, places } from "@/features/makan/lib/data";
import { FOOD_COURT } from "@/features/makan/lib/foodcourt";
import { kaidahJudul } from "@/lib/judul";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";

export default async function MakananAdmin() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;
  const store = await ambilKonten();
  const [ubahan, foto] = await Promise.all([store?.ubahanMakan() ?? [], store?.foto() ?? []]);
  const tempat = [...places]
    .sort((a, b) => a.name.localeCompare(b.name, "id"))
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      kategori_lain: p.kategori_lain ?? [],
      food_court: p.food_court ?? "",
      area: p.area,
      halal: p.halal,
      desc_id: p.desc_id,
      signature: p.signature,
      price_tier: p.price_tier,
      price_idr: p.price_idr,
      address: p.address,
      hours: p.hours,
      phone: p.phone,
      instagram: p.instagram,
      gmaps: p.gmaps,
    }));

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <h1 className="m-0">Makanan</h1>
      <NavAdmin />
      <AdminMakan
        tempat={tempat}
        hidangan={categories.map((c) => ({ nilai: c.id, nama: kaidahJudul(c.name_id) }))}
        kawasan={areas.map((a) => ({ nilai: a.id, nama: a.name }))}
        foodCourt={FOOD_COURT.map((f) => ({ nilai: f.id, nama: f.nama }))}
        ubahan={ubahan}
        foto={foto}
      />
    </div>
  );
}
