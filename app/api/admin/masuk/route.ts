import { cookies } from "next/headers";
import {
  asalSama,
  klienAuth,
  KUKI_CONTOH,
  nilaiKukiContoh,
  peranModerator,
  sandiContohBenar,
} from "@/features/tukang/admin-auth";
import { buatBatasLaju, ipDari } from "@/features/tukang/batas-laju";
import { jawab, tolak } from "@/features/tukang/http";
import { modeKiriman } from "@/features/tukang/mode";
import { SkemaMasuk } from "@/features/tukang/skema";

const batas = buatBatasLaju(10, 10 * 60 * 1000);
const batasContoh = buatBatasLaju(5000, 10 * 60 * 1000);
const GAGAL = "Gagal masuk. Periksa isian Anda.";

export async function POST(req: Request) {
  const mode = modeKiriman();
  if (mode === "mati" || !asalSama(req)) return tolak(403, "Admin tertutup.");
  if (!(mode === "contoh" ? batasContoh : batas)(ipDari(req))) return tolak(429, "Terlalu banyak percobaan.");

  const hasil = SkemaMasuk.safeParse(await req.json().catch(() => null));
  if (!hasil.success) return tolak(400, GAGAL);

  if (mode === "contoh") {
    if (!process.env.ADMIN_MODE_CONTOH) return tolak(403, "Admin tertutup.");
    if (!sandiContohBenar(hasil.data.kata_sandi)) return tolak(401, GAGAL);
    const kuki = await cookies();
    kuki.set(KUKI_CONTOH, nilaiKukiContoh(), {
      httpOnly: true,
      sameSite: "strict",
      secure: new URL(req.url).protocol === "https:",
      path: "/",
      maxAge: 8 * 3600,
    });
    return jawab(200, { ok: true });
  }

  if (!hasil.data.email) return tolak(400, GAGAL);
  const auth = await klienAuth();
  const { data, error } = await auth.auth.signInWithPassword({
    email: hasil.data.email,
    password: hasil.data.kata_sandi,
  });
  if (error) return tolak(401, GAGAL);
  if (!peranModerator(data.user)) {
    await auth.auth.signOut();
    return tolak(403, GAGAL);
  }
  return jawab(200, { ok: true });
}

export async function DELETE(req: Request) {
  if (!asalSama(req)) return tolak(403, "Ditolak.");
  const mode = modeKiriman();
  if (mode === "contoh") (await cookies()).delete(KUKI_CONTOH);
  if (mode === "supabase") await (await klienAuth()).auth.signOut();
  return jawab(200, { ok: true });
}
