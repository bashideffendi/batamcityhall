// Gerbang admin. Hanya di server. Tiga keadaan:
// - supabase: Supabase Auth, dan penggunanya harus berperan moderator di app_metadata. Pengguna biasa tidak
//   cukup, karena app_metadata hanya bisa diubah lewat service role.
// - contoh: kata sandi dari ADMIN_MODE_CONTOH. Kosong = tertutup.
// - mati: selalu tertutup.
import { createHmac, timingSafeEqual } from "node:crypto";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { modeKiriman, type Env } from "./mode";

export type AksesAdmin = "tertutup" | "perlu_masuk" | "masuk";

export const KUKI_CONTOH = "bch_admin_contoh";
export const PERAN_MODERATOR = "moderator";
/** Sesi admin berakhir 8 jam setelah masuk, di kedua mode. */
export const SESI_ADMIN_DETIK = 8 * 3600;

const tandaContoh = (sandi: string, isi = "bch-admin-contoh") => createHmac("sha256", sandi).update(isi).digest("hex");

/**
 * Sandi mode contoh yang berlaku, atau null bila tertutup. Di Railway (situs tayang) mode contoh hanya terjadi bila
 * NEXT_PUBLIC_MODE_CONTOH=1 terpasang. Di sana sandi pendek dianggap salah pasang dan admin tetap tertutup.
 */
export function sandiContoh(env: Env = process.env): string | null {
  const sandi = env.ADMIN_MODE_CONTOH;
  if (!sandi) return null;
  if (diRailway(env) && sandi.length < 16) return null;
  return sandi;
}

export const diRailway = (env: Env = process.env) => Boolean(env.RAILWAY_ENVIRONMENT_ID);

function sama(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Dibandingkan lewat HMAC supaya panjangnya sama dan panjang sandi tidak terbaca dari waktu. */
export function sandiContohBenar(masukan: string, env: Env = process.env): boolean {
  const sandi = sandiContoh(env);
  return Boolean(sandi) && sama(tandaContoh(sandi as string), tandaContoh(masukan));
}

/** Nilai kuki: waktu kedaluwarsa (detik) dan tanda HMAC atasnya. Kuki lama tidak berlaku lagi setelah 8 jam. */
export function kukiContohBenar(nilai: string | undefined, env: Env = process.env, sekarang = Date.now()): boolean {
  const sandi = sandiContoh(env);
  const [sampai, tanda] = nilai?.split(".") ?? [];
  if (!sandi || !sampai || !tanda || !/^\d+$/.test(sampai)) return false;
  if (Number(sampai) * 1000 <= sekarang) return false;
  return sama(tanda, tandaContoh(sandi, `bch-admin-contoh:${sampai}`));
}

export function nilaiKukiContoh(env: Env = process.env, sekarang = Date.now()): string {
  const sampai = String(Math.floor(sekarang / 1000) + SESI_ADMIN_DETIK);
  return `${sampai}.${tandaContoh(sandiContoh(env) as string, `bch-admin-contoh:${sampai}`)}`;
}

export const peranModerator = (u: { app_metadata?: Record<string, unknown> } | null | undefined) =>
  u?.app_metadata?.peran === PERAN_MODERATOR;

/**
 * Klien Supabase Auth berbasis kuki. Di Server Component kuki tidak bisa ditulis, dan itu tidak apa-apa.
 * Sesi hanya dibaca di server, jadi kukinya httpOnly. Supabase selalu memasang umur 400 hari; di sini dipotong.
 */
export async function klienAuth(env: Env = process.env) {
  const kuki = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL as string, env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
    cookieOptions: { httpOnly: true, sameSite: "strict", secure: env.NODE_ENV === "production", path: "/" },
    cookies: {
      getAll: () => kuki.getAll(),
      setAll: (daftar) => {
        try {
          for (const { name, value, options } of daftar) {
            const umur = options.maxAge === undefined ? undefined : Math.min(options.maxAge, SESI_ADMIN_DETIK);
            kuki.set(name, value, { ...options, maxAge: umur });
          }
        } catch {
          // Dipanggil dari Server Component. Sesi disegarkan pada permintaan route handler berikutnya.
        }
      },
    },
  });
}

/** Wajib dipanggil di tiap halaman dan route admin, bukan hanya di layout. */
export async function aksesAdmin(env: Env = process.env): Promise<AksesAdmin> {
  const mode = modeKiriman(env);
  if (mode === "mati") return "tertutup";
  if (mode === "contoh") {
    if (!sandiContoh(env)) return "tertutup";
    const kuki = await cookies();
    return kukiContohBenar(kuki.get(KUKI_CONTOH)?.value, env) ? "masuk" : "perlu_masuk";
  }
  const auth = await klienAuth(env);
  const { data, error } = await auth.auth.getUser();
  return !error && peranModerator(data.user) ? "masuk" : "perlu_masuk";
}

/** Permintaan tulis admin harus datang dari situs ini sendiri. Kuki sameSite adalah lapis pertama. */
export function asalSama(req: Request): boolean {
  const asal = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!asal || !host) return false;
  try {
    return new URL(asal).host === host;
  } catch {
    return false;
  }
}
