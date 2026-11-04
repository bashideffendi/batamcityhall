import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaSinyal } from "@/features/tukang/skema";

// Tombol "Masih buka?" dan "Sudah pindah". Tidak mengubah tanggal terakhir dicek: itu hanya moderator,
// karena tukangnya sendiri bisa menekan tombol ini.
export const POST = buatRouteKiriman({
  skema: SkemaSinyal,
  maksPerJendela: 20,
  simpan: (store, data) => store.kirimSinyal(data.tukang_id, data.jenis),
});
