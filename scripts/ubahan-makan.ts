// Menerapkan ubahan data makanan dan food court dari admin ke data/makan/, saat build di Railway saja.
// Berkas di repo tidak berubah. Bila basis data bermasalah, build tetap jalan memakai data repo.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { terapkanUbahan, terapkanUbahanFoodCourt, type BarisUbahan, type BarisUbahanFoodCourt } from "../features/konten/ubahan";
import type { FoodCourt } from "../features/makan/lib/foodcourt";
import type { Place } from "../features/makan/lib/types";
import { foodCourtSchema } from "../lib/data/schema";

const URL_DB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KUNCI = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function ambil<T>(tabel: string, kolom: string): Promise<T[]> {
  const r = await fetch(`${URL_DB}/rest/v1/${tabel}?select=${kolom}`, {
    headers: { apikey: KUNCI as string, Authorization: `Bearer ${KUNCI}` },
  });
  if (!r.ok) throw new Error(`${tabel}: status ${r.status}`);
  return (await r.json()) as T[];
}

const lewati = (bagian: string) => (e: unknown) => {
  console.warn(`ubahan-makan: ${bagian} dilewati,`, e instanceof Error ? e.message : "galat tidak dikenal");
  return [];
};

async function main() {
  // Jangan pernah menulis berkas di komputer pengembang, walau variabel Supabase terisi.
  if (!process.env.RAILWAY_ENVIRONMENT_ID || !URL_DB || !KUNCI) return;
  const [ubahan, ubahanFc] = await Promise.all([
    ambil<BarisUbahan>("makan_ubahan", "tempat_id,baru,data").catch(lewati("tempat makan")),
    ambil<BarisUbahanFoodCourt>("foodcourt_ubahan", "foodcourt_id,baru,data").catch(lewati("food court")),
  ]);

  const jalurFc = join(process.cwd(), "data", "makan", "foodcourt.json");
  const berkasFc = JSON.parse(readFileSync(jalurFc, "utf8")) as { meta: unknown; tempat: FoodCourt[] };
  let idFc = new Set(berkasFc.tempat.map((f) => f.id));
  if (ubahanFc.length) {
    const hasil = terapkanUbahanFoodCourt(berkasFc.tempat, ubahanFc);
    const baru = { ...berkasFc, tempat: hasil.daftar };
    // Data yang lolos dashboard tetap diperiksa skema data sebelum ditulis.
    if (foodCourtSchema.safeParse(baru).success) {
      writeFileSync(jalurFc, JSON.stringify(baru, null, 1));
      idFc = new Set(hasil.daftar.map((f) => f.id));
      console.log(`ubahan-makan: food court ${ubahanFc.length - hasil.dilewati.length} diterapkan, ${hasil.dilewati.length} dilewati.`);
    } else console.warn("ubahan-makan: food court dilewati, data tidak lolos skema.");
  }

  if (!ubahan.length) return;
  const jalur = join(process.cwd(), "data", "makan", "places.json");
  const tempat = JSON.parse(readFileSync(jalur, "utf8")) as Place[];
  const hasil = terapkanUbahan(tempat, ubahan, new Date().toISOString().slice(0, 10));
  // Food court yang sudah dibuang dari dashboard tidak boleh tersisa sebagai tautan mati.
  for (const p of hasil.tempat) if (p.food_court && !idFc.has(p.food_court)) p.food_court = null;
  writeFileSync(jalur, JSON.stringify(hasil.tempat, null, 1));
  console.log(`ubahan-makan: ${ubahan.length - hasil.dilewati.length} diterapkan, ${hasil.dilewati.length} dilewati.`);
}

main().catch(lewati("semua"));
