import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaLaporan } from "@/features/tukang/skema";

export const POST = buatRouteKiriman({
  skema: SkemaLaporan,
  maksPerJendela: 5,
  simpan: (store, data) => store.laporkanMasalah(data.tukang_id, data.alasan),
});
