import Image from "next/image";
import { LOKET } from "@/lib/site";

/** Kepala pembuka loket (PEDOMAN 4.6): penanda berisi isi bagian, H1, paragraf pembuka, dan ilustrasi. */
export default function PembukaLoket({ nomor, lede, children }: { nomor: string; lede: React.ReactNode; children?: React.ReactNode }) {
  const l = LOKET.find((x) => x.nomor === nomor);
  if (!l) return null;
  return (
    <div className="bch-pembuka">
      <div>
        <p className="bch-kicker bch-penanda-biru m-0">{l.penanda}</p>
        <h1>{l.nama}</h1>
        <p className="bch-lede">{lede}</p>
        {children}
      </div>
      <Image className="bch-grafis" src={l.grafis} alt="" width={720} height={720} priority unoptimized />
    </div>
  );
}
