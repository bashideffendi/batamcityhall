import Image from "next/image";
import type { ReactNode } from "react";

/** Kepala halaman di dalam bagian: judul, keterangan, ilustrasi kecil. */
export default function PembukaHalaman({ judul, gambar, children }: { judul: string; gambar: string; children?: ReactNode }) {
  return (
    <header className="bch-pembuka">
      <div>
        <h1>{judul}</h1>
        {children}
      </div>
      <Image className="bch-grafis" src={`/grafis/bagian/${gambar}.webp`} alt="" width={320} height={320} priority unoptimized />
    </header>
  );
}
