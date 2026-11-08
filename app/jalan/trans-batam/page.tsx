import type { Metadata } from "next";
import TautanKirim from "@/components/site/TautanKirim";
import Link from "next/link";
import PetaBus from "@/features/jalan/peta-bus/PetaBus";
import { kapital } from "@/features/jalan/feri-terakhir";
import InfoPraktisTrans from "@/features/jalan/InfoPraktisTrans";
import {
  CATATAN_DAFTAR_HALTE,
  gayaKoridor,
  KORIDOR,
  lencanaKoridor,
  slugKoridor,
  teksJam,
} from "@/features/jalan/trans-data";

export const metadata: Metadata = {
  title: "Trans Batam",
  description:
    "Sembilan koridor beroperasi, satu direncanakan. Peta bus, urutan halte, jam operasi, tarif, dan cara bayar Trans Batam.",
};

export default function TransBatam() {
  return (
    <div className="bch-page">
      <h1 className="m-0">Trans Batam</h1>
      <p className="bch-lede">
        Sembilan koridor beroperasi, satu direncanakan. Tarif Rp5.000, pelajar Rp2.500, nontunai.
      </p>

      <h2 className="mt-7 mb-4">Peta Bus</h2>
      <PetaBus />
      <p className="jl-catatan-kecil pb-kredit">
        Garis disederhanakan; letak halte tidak sesuai peta. Tata letak dan sebagian nama halte mengikuti{" "}
        <Link href="/kolofon" prefetch={false}>
          Peta Bus Batam karya Farhan S. Fadhillah
        </Link>
        .
      </p>

      <h2 className="mt-7 mb-3">Posisi Bus</h2>
      <p>Lihat di aplikasi SIP TB. Situs ini tidak melacak bus.</p>

      <h2 className="mt-7 mb-4">Semua Koridor</h2>
      <ul className="bch-grid jl-grid-koridor">
        {KORIDOR.map((k) => {
          const jam = teksJam(k);
          const lencana = lencanaKoridor(k);
          return (
            <li key={k.id}>
              <Link
                href={`/jalan/trans-batam/${slugKoridor(k.id)}`}
                prefetch={false}
                className="bch-card h-full jl-k jl-kartu-koridor"
                style={gayaKoridor(k)}
                data-koridor={k.id}
                data-rencana={k.status === "rencana" ? "" : undefined}
              >
                <span className="jl-chip">
                  <span className="jl-chip-warna" aria-hidden="true" />
                  <span className="bch-data">{k.id}</span>
                </span>
                <h3>{k.nama}</h3>
                {jam && <span className="bch-card-meta">{jam}</span>}
                {lencana.length > 0 && (
                  <span className="bch-badges mt-2">
                    {lencana.map((l) => (
                      <span key={l.teks} className="bch-badge" data-tone={l.nada}>
                        {kapital(l.teks)}
                      </span>
                    ))}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-7">
        <InfoPraktisTrans />
      </div>

      <p className="jl-catatan-kecil mt-7">
        {CATATAN_DAFTAR_HALTE}{" "}
        <TautanKirim href="/koreksi" prefetch={false}>
          Kirim Koreksi
        </TautanKirim>
      </p>
    </div>
  );
}
