import { buatRouteKiriman } from "@/features/tukang/http";
import { SkemaNewsletter } from "@/features/tukang/skema";

export const POST = buatRouteKiriman({
  skema: SkemaNewsletter,
  maksPerJendela: 3,
  simpan: (store, data) => store.langganan(data.email),
});
