import { z } from "zod";
import { aksesAdmin, asalSama } from "@/features/tukang/admin-auth";
import { jawab, tolak } from "@/features/tukang/http";
import { ambilStore } from "@/features/tukang/store";

const Skema = z.object({ aksi: z.literal("hapus"), email: z.string().min(3).max(254) });

/** Menghapus satu pelanggan, misalnya atas permintaannya. */
export async function POST(req: Request) {
  if (!asalSama(req) || (await aksesAdmin()) !== "masuk") return tolak(403, "Harus masuk sebagai admin.");
  const store = ambilStore();
  if (!store) return tolak(503, "Basis data belum tersambung.");
  const hasil = Skema.safeParse(await req.json().catch(() => null));
  if (!hasil.success) return tolak(400, "Permintaan tidak terbaca.");
  try {
    await store.hapusPelanggan(hasil.data.email);
  } catch (e) {
    console.error("Pelanggan gagal dihapus:", e instanceof Error ? e.message : "galat tidak dikenal");
    return tolak(500, "Gagal dihapus. Coba lagi.");
  }
  return jawab(200, { ok: true });
}
