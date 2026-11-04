import { barisIndeks, TEMPAT } from "@/features/direktori/data";

// Indeks ringkas untuk pencarian di browser, dibuat saat build.
export const dynamic = "force-static";

export function GET() {
  return Response.json(TEMPAT.map(barisIndeks));
}
