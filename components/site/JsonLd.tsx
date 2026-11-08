import { teksLd } from "@/lib/data-terstruktur";

/** Data terstruktur untuk mesin pencari (lib/data-terstruktur.ts). Tidak tampil di halaman. */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: teksLd(data) }} />;
}
