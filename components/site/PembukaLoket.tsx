import Image from "next/image";
import { LOKET } from "@/lib/site";

/** Kepala pembuka loket (PEDOMAN 4.6): penanda, nomor besar, H1, paragraf pembuka, dan ilustrasi. */
export default function PembukaLoket({ nomor, lede, children }: { nomor: string; lede: React.ReactNode; children?: React.ReactNode }) {
  const l = LOKET.find((x) => x.nomor === nomor);
  if (!l) return null;
  return (
    <div className="bch-pembuka">
      <div>
        <p className="bch-kicker bch-penanda-biru m-0">Loket {l.nomor}</p>
        <span className="bch-nomor-besar" aria-hidden="true">
          {l.nomor}
        </span>
        <h1>{l.nama}</h1>
        <p className="bch-lede">{lede}</p>
        {children}
      </div>
      <Image className="bch-grafis" src={l.grafis} alt="" width={720} height={720} priority unoptimized />
    </div>
  );
}
