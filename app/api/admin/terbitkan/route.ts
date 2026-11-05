import { aksesAdmin, asalSama } from "@/features/tukang/admin-auth";
import { jawab, tolak } from "@/features/tukang/http";

// Data makanan masuk ke halaman saat build, jadi perlu deploy ulang. BELUM PERNAH DIJALANKAN melawan Railway:
// butuh RAILWAY_API_TOKEN. RAILWAY_SERVICE_ID dan RAILWAY_ENVIRONMENT_ID disediakan Railway sendiri.
const API = "https://backboard.railway.com/graphql/v2";

export async function POST(req: Request) {
  if (!asalSama(req) || (await aksesAdmin()) !== "masuk") return tolak(403, "Harus masuk sebagai admin.");
  const { RAILWAY_API_TOKEN: token, RAILWAY_SERVICE_ID: serviceId, RAILWAY_ENVIRONMENT_ID: environmentId } = process.env;
  if (!token || !serviceId || !environmentId) return tolak(503, "Tombol ini belum tersambung ke Railway.");

  const r = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      query: "mutation($s: String!, $e: String!) { serviceInstanceRedeploy(serviceId: $s, environmentId: $e) }",
      variables: { s: serviceId, e: environmentId },
    }),
  }).catch(() => null);
  const isi = r?.ok ? ((await r.json()) as { errors?: unknown[] }) : null;
  if (!isi || isi.errors?.length) return tolak(502, "Railway menolak. Coba lagi nanti.");
  return jawab(200, { ok: true });
}
