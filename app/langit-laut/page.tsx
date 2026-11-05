import { permanentRedirect } from "next/navigation";

// Alamat lama (PEDOMAN 8.1 butir 4): ?mode= dialihkan ke halaman barunya, view dan cam dipertahankan.
const TUJUAN: Record<string, string> = { hujan: "/cuaca/hujan", ombak: "/cuaca/gelombang", cctv: "/cuaca/cctv" };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function LangitLautLama({ searchParams }: Props) {
  const p = await searchParams;
  const satu = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : null);
  const mode = satu("mode");
  const view = satu("view");
  const cam = satu("cam");
  const sisa = new URLSearchParams();
  if (view) sisa.set("view", view);
  if (cam) sisa.set("cam", cam);
  const q = sisa.toString();
  const dasar = cam ? "/cuaca/cctv" : mode && TUJUAN[mode] ? TUJUAN[mode] : q ? "/cuaca/hujan" : "/cuaca";
  permanentRedirect(q ? `${dasar}?${q}` : dasar);
}
