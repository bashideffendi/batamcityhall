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

const tandaContoh = (sandi: string) => createHmac("sha256", sandi).update("bch-admin-contoh").digest("hex");

function sama(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Dibandingkan lewat HMAC supaya panjangnya sama dan panjang sandi tidak terbaca dari waktu. */
export function sandiContohBenar(masukan: string, env: Env = process.env): boolean {
  const sandi = env.ADMIN_MODE_CONTOH;
  return Boolean(sandi) && sama(tandaContoh(sandi as string), tandaContoh(masukan));
}

export function kukiContohBenar(nilai: string | undefined, env: Env = process.env): boolean {
  const sandi = env.ADMIN_MODE_CONTOH;
  return Boolean(sandi && nilai) && sama(nilai as string, tandaContoh(sandi as string));
}

export const nilaiKukiContoh = (env: Env = process.env) => tandaContoh(env.ADMIN_MODE_CONTOH as string);

export const peranModerator = (u: { app_metadata?: Record<string, unknown> } | null | undefined) =>
  u?.app_metadata?.peran === PERAN_MODERATOR;

/** Klien Supabase Auth berbasis kuki. Di Server Component kuki tidak bisa ditulis, dan itu tidak apa-apa. */
export async function klienAuth(env: Env = process.env) {
  const kuki = await cookies();
  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL as string, env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string, {
    cookies: {
      getAll: () => kuki.getAll(),
      setAll: (daftar) => {
        try {
          for (const { name, value, options } of daftar) kuki.set(name, value, options);
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
    if (!env.ADMIN_MODE_CONTOH) return "tertutup";
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
