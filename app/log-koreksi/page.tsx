import type { Metadata } from "next";
import Link from "next/link";
import log from "@/data/redaksi/log-koreksi.json";
import { tanggalTulisan } from "@/features/jurnal/data";

export const metadata: Metadata = {
  title: "Log Koreksi",
  description: "Perbaikan atas fakta penting di situs ini, bertanggal dan terbaru di atas.",
};

type Entri = { tanggal: string; halaman: string; judul: string; uraian: string };

// Data divalidasi saat prebuild (lib/data/schema.ts, logKoreksiSchema): tanggal, alamat internal, urutan terbaru.
const ENTRI = log as Entri[];

export default function LogKoreksi() {
  return (
    <div className="bch-page bch-baca">
      <h1>Log Koreksi</h1>
      <p className="bch-lede">Perbaikan atas fakta penting di situs ini, terbaru di atas.</p>
      <ol className="bch-log-koreksi">
        {ENTRI.map((e) => (
          <li key={`${e.tanggal}-${e.halaman}-${e.uraian.slice(0, 24)}`}>
            <p className="bch-log-kepala">
              <time dateTime={e.tanggal}>{tanggalTulisan(e.tanggal)}</time>
              <Link href={e.halaman} prefetch={false}>
                {e.judul}
              </Link>
            </p>
            <p>{e.uraian}</p>
          </li>
        ))}
      </ol>
      <p className="bch-note">
        Cara kami menangani kesalahan dijelaskan di <Link href="/standar-redaksi#koreksi">Standar Redaksi</Link>.
      </p>
    </div>
  );
}
