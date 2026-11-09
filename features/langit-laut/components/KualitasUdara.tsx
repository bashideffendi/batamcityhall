"use client";

import { useResource } from "@/features/langit-laut/hooks/useResource";
import {
  jamDari,
  kategoriUdara,
  tanggalDari,
  teksPartikel,
  type UdaraResponse,
} from "@/features/langit-laut/lib/udara";

const POLL_MS = 15 * 60 * 1000;

/** Bagian halaman Kualitas Udara yang bergantung data: angka sekarang dan 24 jam ke depan. */
export default function KualitasUdara() {
  const { data, error, load } = useResource<UdaraResponse>("/api/kualitas-udara", POLL_MS, true, false);
  const kini = data?.status === "ok" ? data.sekarang : null;

  if (!kini) {
    return error ? (
      <p className="mt-5" data-status="gagal">
        Data kualitas udara belum dapat dimuat.{" "}
        <button type="button" className="bch-tautan-tombol" onClick={() => void load()}>
          Muat Ulang
        </button>
      </p>
    ) : (
      <p className="mt-5">Memuat data</p>
    );
  }

  const k = kategoriUdara(kini.aqi);
  const hariIni = tanggalDari(kini.waktu);
  return (
    <div data-udara>
      <section aria-labelledby="udara-sekarang" className="bch-card mt-5" data-udara-sekarang={k.kode}>
        <h2 id="udara-sekarang" className="bch-kicker m-0">
          Pukul {jamDari(kini.waktu)} WIB
        </h2>
        <p className="bch-gempa-angka mt-2 mb-0">AQI {kini.aqi}</p>
        <p className="mt-2 mb-0">
          <span className="bch-status" data-tone={k.nada}>
            {k.label}
          </span>
        </p>
        <p className="mt-3 mb-0">{k.saran}</p>
        <hr className="bch-card-rule" />
        <dl className="bch-daftar m-0">
          <dt>PM2.5</dt>
          <dd className="bch-data">{teksPartikel(kini.pm25)}</dd>
          <dt>PM10</dt>
          <dd className="bch-data">{teksPartikel(kini.pm10)}</dd>
          {data?.lalu && (
            <>
              <dt>24 Jam Terakhir</dt>
              <dd className="bch-data">
                {data.lalu.min === data.lalu.max ? `AQI ${data.lalu.min}` : `AQI ${data.lalu.min}—${data.lalu.max}`}
              </dd>
            </>
          )}
        </dl>
      </section>

      {data && data.depan.length > 0 && (
        <section aria-labelledby="udara-depan">
          <h2 id="udara-depan" className="mt-7 mb-3">
            24 Jam ke Depan
          </h2>
          <div className="bch-table-wrap">
            <table className="bch-table">
              <caption className="sr-only">Perkiraan kualitas udara setiap 3 jam</caption>
              <thead>
                <tr>
                  <th scope="col">Pukul</th>
                  <th scope="col">AQI</th>
                  <th scope="col">Kategori</th>
                </tr>
              </thead>
              <tbody>
                {data.depan.map((j) => {
                  const kj = kategoriUdara(j.aqi);
                  return (
                    <tr key={j.waktu} data-udara-jam={j.waktu}>
                      <td className="bch-data">
                        {jamDari(j.waktu)}
                        {tanggalDari(j.waktu) !== hariIni && " besok"}
                      </td>
                      <td className="bch-data">{j.aqi}</td>
                      <td>{kj.label}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
