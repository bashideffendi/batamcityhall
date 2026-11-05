import { petaFoto } from "@/features/konten/baca";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await petaFoto(), {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
