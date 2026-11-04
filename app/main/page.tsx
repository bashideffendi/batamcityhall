import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Main-main",
  description: "Kartu pos, peta vibe, kalkulator feri, dan quest mural. Bagian yang tidak perlu diseriusi.",
};

const PINTU = [
  { href: "/main/kartu-pos", nama: "Kartu pos", lede: "Tulis salam dari Batam, unduh gambarnya." },
  { href: "/main/vibe", nama: "Peta vibe", lede: "Ngopi dan macet. Itu saja kategorinya, dan sengaja begitu." },
  {
    href: "/main/singapura-atau-nagoya",
    nama: "Ke Singapura atau ke Nagoya?",
    lede: "Hitung dulu ongkosnya sebelum menyeberang.",
  },
  { href: "/mural", nama: "Quest mural", lede: "Telusuri jejak pusat niaga di mural." },
];

export default function MainMain() {
  return (
    <div className="bch-page">
      <p className="bch-kicker m-0">Loket 07</p>
      <h1 className="mt-2">Main-main</h1>
      <p className="bch-lede">Bagian yang tidak perlu diseriusi.</p>
      <ul className="bch-grid mt-5">
        {PINTU.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="bch-card h-full" prefetch={false}>
              <h2>{p.nama}</h2>
              <span>{p.lede}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
