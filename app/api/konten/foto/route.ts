import { KUNCI_CACHE_FOTO, petaFoto } from "@/features/konten/baca";
import { cacheRespons } from "@/lib/cache-respons";

export const dynamic = "force-dynamic";

// Railway tidak punya CDN, jadi s-maxage di sini menjadi lama simpan di memori server (lib/cache-respons.ts).
export async function GET() {
  return cacheRespons(KUNCI_CACHE_FOTO, async () =>
    Response.json(await petaFoto(), {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    }),
  );
}
