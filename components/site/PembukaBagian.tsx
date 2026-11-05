import Image from "next/image";
import { bagianDari } from "@/lib/site";

/** Kepala halaman bagian: judul, satu baris keterangan, ilustrasi kecil. Padat, supaya isi langsung terlihat. */
export default function PembukaBagian({ id, lede, children }: { id: string; lede?: React.ReactNode; children?: React.ReactNode }) {
  const b = bagianDari(id);
  return (
    <header className="bch-pembuka">
      <div>
        <h1>{b.nama}</h1>
        {lede && <p className="bch-lede">{lede}</p>}
        {children}
      </div>
      <Image className="bch-grafis" src={b.grafis} alt="" width={320} height={320} priority unoptimized />
    </header>
  );
}
