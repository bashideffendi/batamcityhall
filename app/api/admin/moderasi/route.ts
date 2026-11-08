import { aksesAdmin, asalSama } from "@/features/tukang/admin-auth";
import { GalatTidakAda } from "@/features/tukang/galat";
import { bacaJsonTerbatas, jawab, tolak } from "@/features/tukang/http";
import { SkemaAksi } from "@/features/tukang/skema";
import { ambilStore } from "@/features/tukang/store";

export async function POST(req: Request) {
  if (!asalSama(req) || (await aksesAdmin()) !== "masuk") return tolak(403, "Harus masuk sebagai moderator.");
  const store = ambilStore();
  if (!store) return tolak(503, "Basis data belum tersambung.");

  const hasil = SkemaAksi.safeParse(await bacaJsonTerbatas(req, 16 * 1024));
  if (!hasil.success) return tolak(400, "Tindakan tidak dikenal.");

  try {
    await store.moderasi(hasil.data);
  } catch (e) {
    if (e instanceof GalatTidakAda) return tolak(404, "Entri sudah tidak ada.");
    console.error("Moderasi gagal:", e instanceof Error ? e.message : "galat tidak dikenal");
    return tolak(500, "Tindakan gagal disimpan.");
  }
  return jawab(200, { ok: true });
}
