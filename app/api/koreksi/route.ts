import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaKoreksi } from "@/features/tukang/skema";

export const POST = buatRouteKiriman({
  skema: SkemaKoreksi,
  maksPerJendela: 5,
  simpan: (store, data) => store.kirimKoreksi(data),
});
