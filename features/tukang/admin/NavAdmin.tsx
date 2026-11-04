"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { kirimJson } from "../Kolom";

const MENU = [
  { href: "/admin", label: "Antrean" },
  { href: "/admin/cek-ulang", label: "Perlu dicek ulang" },
  { href: "/admin/koordinat", label: "Isi koordinat" },
];

export default function NavAdmin() {
  const router = useRouter();
  const lokasi = usePathname();
  return (
    <nav aria-label="Menu admin" className="bch-adm-nav">
      {MENU.map((m) => (
        <Link key={m.href} href={m.href} prefetch={false} aria-current={lokasi === m.href ? "page" : undefined}>
          {m.label}
        </Link>
      ))}
      <button
        type="button"
        className="bch-tk-tautan"
        onClick={async () => {
          await kirimJson("/api/admin/masuk", {}, "DELETE");
          router.refresh();
        }}
      >
        Keluar
      </button>
    </nav>
  );
}
