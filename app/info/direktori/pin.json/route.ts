import { daftarPin } from "@/features/direktori/data";

// Pin peta beranda, dibuat saat build.
export const dynamic = "force-static";

export function GET() {
  return Response.json(daftarPin());
}
