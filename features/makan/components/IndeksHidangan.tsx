"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryMap } from "../lib/acuan";
import { grafisHidangan, RUMPUN, slugHidangan } from "../lib/hidangan";
import { catName, useI18n } from "../lib/i18n";

// Indeks hidangan: tiga baris enam ubin, dikelompokkan per rumpun. Angkanya diterima sebagai props, jadi berkas ini
// tidak mengimpor daftar tempat dan halaman indeks Hidangan tidak mengunduhnya.
export default function IndeksHidangan({
  jumlah,
  total,
  tanpaSemua = false,
}: {
  /** Jumlah tempat per kategori, dihitung pemanggil dari daftar tempat. */
  jumlah: Record<string, number>;
  /** Jumlah semua tempat, untuk ubin Semua. */
  total: number;
  tanpaSemua?: boolean;
}) {
  const { lang, t } = useI18n();
  return (
    <div className="mk-indeks">
      {RUMPUN.map((r) => (
        <div key={r.id} className="mk-rumpun" data-n={r.kategori.length} data-rumpun={r.id}>
          <p className="mk-rumpun-nama">{r.nama[lang]}</p>
          <ul>
            {r.kategori.map((id) => (
              <li key={id}>
                {jumlah[id] ? (
                  <Link href={`/makan/hidangan/${slugHidangan(id)}`} className="mk-ubin">
                    <Image src={grafisHidangan(id)} alt="" width={480} height={480} loading="lazy" unoptimized />
                    <span className="mk-ubin-nama">{catName(lang, categoryMap[id])}</span>
                    <span className="mk-ubin-n">{jumlah[id]}</span>
                  </Link>
                ) : (
                  <span className="mk-ubin" data-kosong>
                    <Image src={grafisHidangan(id)} alt="" width={480} height={480} loading="lazy" unoptimized />
                    <span className="mk-ubin-nama">{catName(lang, categoryMap[id])}</span>
                    <span className="mk-ubin-n">Belum Ada</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!tanpaSemua && (
        <div className="mk-rumpun mk-rumpun-semua" data-n={1}>
          <p className="mk-rumpun-nama" aria-hidden="true">
            {" "}
          </p>
          <Link href="/makan/peta" className="mk-ubin-semua">
            <span className="mk-ubin-nama">{t("idx_all")}</span>
            <span className="mk-ubin-n">{total}</span>
            <span className="mk-panah" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
