import Link from "next/link";
import type { Mode } from "@/features/langit-laut/lib/radar";

const TAB: { mode: Mode; href: string; label: string }[] = [
  { mode: "hujan", href: "/cuaca/hujan", label: "Radar hujan" },
  { mode: "ombak", href: "/cuaca/gelombang", label: "Tinggi gelombang" },
  { mode: "cctv", href: "/cuaca/cctv", label: "CCTV lalu lintas" },
];

/** Baris tab halaman cuaca dengan remah roti di kanan (PEDOMAN 3.3). */
export default function TabCuaca({ aktif, tanpaRemah = false }: { aktif?: Mode; tanpaRemah?: boolean }) {
  return (
    <nav className="bch-tab" aria-label="Halaman Cuaca dan Laut">
      {TAB.map((t) => (
        <Link key={t.mode} href={t.href} prefetch={false} aria-current={t.mode === aktif ? "page" : undefined}>
          {t.label}
        </Link>
      ))}
      {!tanpaRemah && (
        <Link href="/cuaca" prefetch={false} className="remah">
          Cuaca dan Laut
        </Link>
      )}
    </nav>
  );
}
