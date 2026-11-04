import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaFoto } from "@/features/tukang/skema";

// Hanya metadata dan izin. Berkas foto menyusul setelah ada bucket penyimpanan.
export const POST = buatRouteKiriman({
  skema: SkemaFoto,
  maksPerJendela: 5,
  simpan: (store, data) => store.kirimFoto(data),
});
