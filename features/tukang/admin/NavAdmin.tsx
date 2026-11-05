"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { kirimJson } from "../Kolom";

const MENU = [
  { href: "/admin", label: "Antrean" },
  { href: "/admin/jurnal", label: "Jurnal" },
  { href: "/admin/makanan", label: "Makanan" },
  { href: "/admin/agenda", label: "Agenda" },
  { href: "/admin/loker", label: "Info Loker" },
  { href: "/admin/cek-ulang", label: "Perlu Dicek Ulang" },
  { href: "/admin/koordinat", label: "Isi Koordinat" },
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
