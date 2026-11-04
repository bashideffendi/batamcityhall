import Link from "next/link";
import { LABEL_CONTOH, teksBulan, teksTerakhirDicek, type TukangPublik } from "./aturan";
import { namaJasa } from "./kategori";
import TombolKartu from "./TombolKartu";

// Kartu label museum, pola yang sama dengan features/direktori/KartuTempat.tsx. Tanpa rating bintang.
export default function KartuTukang({ t, contoh }: { t: TukangPublik; contoh: boolean }) {
  return (
    <article className="bch-card h-full" data-tukang={t.id}>
      <p className="bch-kicker-row bch-kicker m-0">
        <span>{namaJasa(t.jasa)}</span>
      </p>
      <h3>{t.nama}</h3>
      <p className="bch-card-loc">
        {t.areaKecamatan.join(", ")}
        {t.areaCatatan ? `, ${t.areaCatatan}` : ""}
      </p>
      <hr className="bch-card-rule" />
      <div className="bch-rebung-mini" aria-hidden="true" />

      <p className="bch-tk-jumlah m-0" data-jumlah-rekomendasi={t.jumlahRekomendasi}>
        Direkomendasikan {t.jumlahRekomendasi} warga
      </p>

      <ul className="bch-tk-cerita">
        {t.cerita.map((c, i) => (
          <li key={i}>
            <p className="m-0">{c.teks}</p>
            <p className="bch-card-meta m-0">Warga, dipakai {teksBulan(c.kapanDipakai)}</p>
          </li>
        ))}
      </ul>

      {(contoh || t.panggilan || t.tag.length > 0) && (
        <div className="bch-badges mt-2">
          {contoh && (
            <span className="bch-badge" data-tone="caution">
              {LABEL_CONTOH}
            </span>
          )}
          {t.panggilan && (
            <span className="bch-badge" data-tone="info">
              Bisa dipanggil ke rumah
            </span>
          )}
          {t.tag.map((g) => (
            <span key={g.teks} className="bch-badge">
              {g.teks}
              {g.jumlah > 1 ? ` · ${g.jumlah}` : ""}
            </span>
          ))}
        </div>
      )}

      <p className="m-0 mt-2">{t.kontak ?? "Kontak belum diizinkan tampil."}</p>

      <p className="bch-card-meta mt-2 mb-0">
        {teksTerakhirDicek(t.terakhirDicek)}
        {t.masihBuka + t.sudahPindah > 0 && (
          <>
            <br />
            Kata warga: {t.masihBuka} masih buka, {t.sudahPindah} sudah pindah atau tutup
          </>
        )}
      </p>

      <TombolKartu id={t.id} nama={t.nama} />

      <p className="bch-card-meta mt-2 mb-0">
        <Link href={`/koreksi?tukang=${t.id}&jenis=hapus_data`} prefetch={false}>
          Minta hapus atau koreksi
        </Link>
      </p>
    </article>
  );
}
