import Link from "next/link";
import type { ComponentProps } from "react";
import { KIRIMAN_AKTIF } from "@/lib/site";

/** Tautan ke formulir warga. Tidak tampil selama formulirnya belum aktif. */
export default function TautanKirim(props: ComponentProps<typeof Link>) {
  return KIRIMAN_AKTIF ? <Link {...props} /> : null;
}
