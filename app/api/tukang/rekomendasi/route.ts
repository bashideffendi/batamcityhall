import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaRekomendasi } from "@/features/tukang/skema";

export const POST = buatRouteKiriman({
  skema: SkemaRekomendasi,
  maksPerJendela: 5,
  simpan: (store, data) => store.kirimRekomendasi(data),
});
