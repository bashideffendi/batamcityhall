import { catatanJadwalLama, dataSudahLama, kapital } from "./feri-terakhir";
import type { KartuRute } from "./feri-data";

const JENIS = { internasional: "Internasional", domestik: "Domestik", lainnya: "Rute lain" };

// Waktu build dipakai untuk catatan jadwal lama di tabel statis; widget menghitung ulang dari jam pengguna.
const SEKARANG = new Date();
const BELUM = "Belum tercatat";

export default function KartuRuteFeri({ r }: { r: KartuRute }) {
  const adaJadwal = r.jadwal.length > 0;
  // Operator dan lama perjalanan pindah ke kolom tabel bila ada jadwal.
  const operatorDiDaftar = !adaJadwal && r.operator;
  const durasiDiDaftar = !adaJadwal && r.durasi;
  return (
    <article className="bch-card jl-kartu-rute" data-rute={r.id}>
      <p className="bch-kicker m-0">{JENIS[r.jenis]}</p>
      <h3>{r.judul}</h3>
      {r.terganggu && (
        <p className="bch-note" data-tone="danger">
          {r.terganggu}
        </p>
      )}
      {(operatorDiDaftar || durasiDiDaftar || r.harga) && (
        <dl className="bch-daftar jl-kartu-fakta">
          {operatorDiDaftar && (
            <>
              <dt>Operator</dt>
              <dd>{r.operator}</dd>
            </>
          )}
          {durasiDiDaftar && (
            <>
              <dt>Lama perjalanan</dt>
              <dd className="bch-data">{r.durasi}</dd>
            </>
          )}
          {r.harga && (
            <>
              <dt>Harga mulai dari</dt>
              <dd>
                <span className="bch-data">{r.harga}</span>
              </dd>
            </>
          )}
        </dl>
      )}
      {r.catatan && <p className="jl-kartu-catatan">{r.catatan}</p>}
      {adaJadwal ? (
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk jl-tabel-jadwal">
            <caption className="jl-caption">Jadwal keberangkatan, waktu setempat di pelabuhan asal</caption>
            <thead>
              <tr>
                <th scope="col">Rute</th>
                <th scope="col">Operator</th>
                <th scope="col">Jam berangkat</th>
                <th scope="col">Lama perjalanan</th>
              </tr>
            </thead>
            <tbody>
              {r.jadwal.map((j, i) => (
                <tr key={`${j.rute}-${i}`}>
                  <td data-label="Rute">
                    {j.rute}
                    {(j.perluCek || dataSudahLama(j.tanggal, SEKARANG)) && (
                      <span className="jl-catatan-kecil jl-blok">{catatanJadwalLama(j.tanggal)}</span>
                    )}
                  </td>
                  <td data-label="Operator">{j.operator ?? r.operator ?? BELUM}</td>
                  <td data-label="Jam berangkat">
                    {j.operasi && <span className="bch-data">{j.operasi}</span>}
                    <span className="jl-jam-daftar bch-data">
                      {j.jam.map((t) => (
                        <span key={`${t.jam}-${t.tanda}`} data-tanda={t.tanda ? "" : undefined}>
                          {t.jam}
                          {t.tanda && <small> {t.tanda}</small>}
                        </span>
                      ))}
                    </span>
                    {j.jam.length > 0 && <span className="jl-zona"> {j.zona ?? "waktu setempat"}</span>}
                    {j.hari && <span className="jl-catatan-kecil jl-blok">{kapital(j.hari)}</span>}
                  </td>
                  <td data-label="Lama perjalanan" className="bch-data">
                    {r.durasi ?? BELUM}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="jl-jadwal-kosong">Jadwal belum tersedia.</p>
      )}
      {r.link && (
        <p className="m-0 mt-3">
          <a href={r.link} target="_blank" rel="noopener" className="bch-btn" data-variant="ghost">
            Jadwal operator
          </a>
        </p>
      )}
    </article>
  );
}
