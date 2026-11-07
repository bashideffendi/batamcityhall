import { revalidatePath } from "next/cache";
import { ID_FOOD_COURT, SkemaAksiKonten, type AksiKonten } from "@/features/konten/skema";
import { ambilKonten, GalatSlugGanda, type KontenStore } from "@/features/konten/store";
import { aksesAdmin, asalSama } from "@/features/tukang/admin-auth";
import { jawab, tolak } from "@/features/tukang/http";

const MAKS_BYTE = 2_000_000;

async function jalankan(store: KontenStore, a: AksiKonten) {
  switch (a.aksi) {
    case "simpan_jurnal":
      await store.simpanJurnal(a.data);
      return ["/", "/jurnal", `/jurnal/${a.data.slug}`];
    case "hapus_jurnal":
      await store.hapusJurnal(a.id);
      return ["/", "/jurnal"];
    case "tambah_foto":
      await store.tambahFoto(a.data);
      return [];
    case "hapus_foto":
      await store.hapusFoto(a.id);
      return [];
    case "simpan_agenda":
      await store.simpanAgenda(a.data);
      return ["/things-to-do"];
    case "hapus_agenda":
      await store.hapusAgenda(a.id);
      return ["/things-to-do"];
    case "simpan_loker":
      await store.simpanLoker(a.data);
      return ["/loker"];
    case "hapus_loker":
      await store.hapusLoker(a.id);
      return ["/loker"];
    case "simpan_makan":
      await store.simpanUbahanMakan(a.data);
      return [];
    case "hapus_makan":
      await store.hapusUbahanMakan(a.tempat_id);
      return [];
    case "simpan_foodcourt":
      await store.simpanUbahanFoodCourt(a.data);
      return [];
    case "hapus_foodcourt":
      await store.hapusUbahanFoodCourt(a.foodcourt_id);
      return [];
    case "simpan_infografik":
      await store.simpanInfografik(a.data);
      return ["/infografik", `/infografik/${a.data.slug}`];
    case "hapus_infografik":
      await store.hapusInfografik(a.id);
      return ["/infografik"];
  }
}

export async function POST(req: Request) {
  if (!asalSama(req) || (await aksesAdmin()) !== "masuk") return tolak(403, "Harus masuk sebagai admin.");
  const store = await ambilKonten();
  if (!store) return tolak(503, "Basis data belum tersambung.");

  const teks = await req.text();
  if (teks.length > MAKS_BYTE) return tolak(413, "Isiannya terlalu panjang.");
  let badan: unknown;
  try {
    badan = JSON.parse(teks);
  } catch {
    return tolak(400, "Isian tidak terbaca.");
  }

  const hasil = SkemaAksiKonten.safeParse(badan);
  if (!hasil.success) {
    // Kolom bersarang di bawah "data", jadi yang dipakai bagian terakhir jalurnya, sama dengan nama kolom formulir.
    const galat: Record<string, string> = {};
    // Galat di dalam daftar (misalnya tautan ke-2) dipetakan ke nama daftarnya.
    for (const g of hasil.error.issues) galat[String(g.path.findLast((p) => typeof p === "string") ?? "_")] ??= g.message;
    return tolak(400, "Ada isian yang perlu diperbaiki.", galat);
  }

  // Food court baru tersimpan di basis data, jadi rujukannya diperiksa di sini, bukan di skema.
  const fc = hasil.data.aksi === "simpan_makan" ? hasil.data.data.food_court : null;
  if (fc && !ID_FOOD_COURT.has(fc)) {
    const baru = await store.ubahanFoodCourt().catch(() => []);
    if (!baru.some((u) => u.baru && u.foodcourt_id === fc)) return tolak(400, "Ada isian yang perlu diperbaiki.", { food_court: "Food court tidak dikenal." });
  }

  try {
    const jalur = await jalankan(store, hasil.data);
    for (const p of jalur) revalidatePath(p);
  } catch (e) {
    if (e instanceof GalatSlugGanda) return tolak(409, e.message, { slug: e.message });
    console.error("Konten gagal disimpan:", e instanceof Error ? e.message : "galat tidak dikenal");
    return tolak(500, "Gagal disimpan. Coba lagi.");
  }
  return jawab(200, { ok: true });
}
