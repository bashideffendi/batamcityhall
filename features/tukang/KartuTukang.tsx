import Link from "next/link";
import { LABEL_CONTOH, tautanTelepon, teksBulan, teksTerakhirDiperiksa, type TukangPublik } from "./aturan";
import { namaJasa, teksTag } from "./kategori";
import TombolKartu from "./TombolKartu";

// Kartu tukang mengikuti PEDOMAN 3.5. Pola sama dengan features/direktori/KartuTempat.tsx. Tanpa rating bintang.
export default function KartuTukang({ t, contoh }: { t: TukangPublik; contoh: boolean }) {
  const diperiksa = teksTerakhirDiperiksa(t.terakhirDicek);
  const telepon = t.kontak ? tautanTelepon(t.kontak) : null;

  return (
    <article className="bch-card h-full" data-tukang={t.id}>
      <h3>{t.nama}</h3>
      <p className="bch-card-loc">
        {namaJasa(t.jasa)} · {t.areaKecamatan.join(", ")}
        {t.areaCatatan ? `, ${t.areaCatatan}` : ""}
      </p>
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />

      <ul className="bch-tk-cerita">
        {t.cerita.map((c, i) => (
          <li key={i}>
            <p className="m-0">{c.teks}</p>
            <p className="bch-card-meta m-0">Warga, dipakai {teksBulan(c.kapanDipakai)}</p>
          </li>
        ))}
      </ul>

      {t.tag.length > 0 && <p className="m-0 mt-2">{t.tag.map((g) => teksTag(g.teks)).join(" · ")}</p>}
      {t.panggilan && <p className="m-0 mt-2">Bisa dipanggil ke rumah</p>}

      {contoh && (
        <div className="bch-badges mt-2">
          <span className="bch-badge" data-tone="caution">
            {LABEL_CONTOH}
          </span>
        </div>
      )}

      <p className="bch-card-meta mt-2 mb-0" data-jumlah-rekomendasi={t.jumlahRekomendasi}>
        Direkomendasikan {t.jumlahRekomendasi} warga
        {diperiksa ? ` · ${diperiksa}` : ""}
        {t.masihBuka + t.sudahPindah > 0 && (
          <>
            <br />
            Kata warga: {t.masihBuka} masih buka, {t.sudahPindah} sudah pindah atau tutup
          </>
        )}
      </p>

      {t.kontak &&
        (telepon ? (
          <p className="m-0 mt-2">
            <a href={telepon} className="bch-btn" aria-label={`Hubungi ${t.nama}`}>
              Hubungi
            </a>{" "}
            <span className="bch-data">{t.kontak}</span>
          </p>
        ) : (
          <p className="m-0 mt-2">{t.kontak}</p>
        ))}

      <TombolKartu id={t.id} nama={t.nama} />

      <p className="bch-card-meta mt-2 mb-0">
        <Link href={`/koreksi?tukang=${t.id}&jenis=hapus_data`} prefetch={false}>
          Minta hapus atau koreksi
        </Link>
      </p>
    </article>
  );
}
