// Menerapkan ubahan data makanan dari admin ke data/makan/places.json, saat build di Railway saja.
// Berkas di repo tidak berubah. Bila basis data bermasalah, build tetap jalan memakai data repo.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { terapkanUbahan, type BarisUbahan } from "../features/konten/ubahan";
import type { Place } from "../features/makan/lib/types";

const URL_DB = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KUNCI = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  // Jangan pernah menulis berkas di komputer pengembang, walau variabel Supabase terisi.
  if (!process.env.RAILWAY_ENVIRONMENT_ID || !URL_DB || !KUNCI) return;
  const r = await fetch(`${URL_DB}/rest/v1/makan_ubahan?select=tempat_id,baru,data`, {
    headers: { apikey: KUNCI, Authorization: `Bearer ${KUNCI}` },
  });
  if (!r.ok) throw new Error(`status ${r.status}`);
  const ubahan = (await r.json()) as BarisUbahan[];
  if (!ubahan.length) return;
  const jalur = join(process.cwd(), "data", "makan", "places.json");
  const tempat = JSON.parse(readFileSync(jalur, "utf8")) as Place[];
  const hasil = terapkanUbahan(tempat, ubahan, new Date().toISOString().slice(0, 10));
  writeFileSync(jalur, JSON.stringify(hasil.tempat, null, 1));
  console.log(`ubahan-makan: ${ubahan.length - hasil.dilewati.length} diterapkan, ${hasil.dilewati.length} dilewati.`);
}

main().catch((e) => {
  console.warn("ubahan-makan: dilewati,", e instanceof Error ? e.message : "galat tidak dikenal");
});
