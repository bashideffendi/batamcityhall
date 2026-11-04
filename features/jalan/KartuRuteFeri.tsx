import { dataSudahLama, teksTanggal } from "./feri-terakhir";
import type { KartuRute } from "./feri-data";

const JENIS = { internasional: "Internasional", domestik: "Domestik", lainnya: "Rute lain" };

// Waktu build dipakai untuk lencana "data lama" di tabel statis; widget menghitung ulang dari jam pengguna.
const SEKARANG = new Date();

export default function KartuRuteFeri({ r }: { r: KartuRute }) {
  return (
    <article className="bch-card jl-kartu-rute" data-rute={r.id}>
      <p className="bch-kicker m-0">{JENIS[r.jenis]}</p>
      <h3>{r.judul}</h3>
      {r.terganggu && (
        <p className="bch-note" data-tone="danger">
          {r.terganggu}
        </p>
      )}
      <dl className="bch-daftar jl-kartu-fakta">
        {r.operator && (
          <>
            <dt>Operator</dt>
            <dd>{r.operator}</dd>
          </>
        )}
        {r.durasi && (
          <>
            <dt>Durasi</dt>
            <dd className="bch-data">{r.durasi}</dd>
          </>
        )}
        <dt>Harga, mulai dari</dt>
        <dd>{r.harga ? <span className="bch-data">{r.harga}</span> : "belum diketahui"}</dd>
      </dl>
      {r.status && (
        <div className="bch-badges">
          <span className="bch-badge" data-tone={r.status.nada}>
            {r.status.teks}
          </span>
        </div>
      )}
      {r.catatan && <p className="jl-kartu-catatan">{r.catatan}</p>}
      {r.jadwal.length > 0 ? (
        <div className="bch-table-wrap">
          <table className="bch-table bch-tabel-tumpuk jl-tabel-jadwal">
            <caption className="jl-caption">Jadwal, jam lokal pelabuhan asal</caption>
            <thead>
              <tr>
                <th scope="col">Arah</th>
                <th scope="col">Jam berangkat</th>
                <th scope="col">Hari</th>
                <th scope="col">Tanggal data</th>
              </tr>
            </thead>
            <tbody>
              {r.jadwal.map((j, i) => (
                <tr key={`${j.arah}-${i}`}>
                  <td data-label="Arah">
                    {j.arah}
                    {j.lencana.length > 0 && (
                      <span className="bch-badges mt-1">
                        {j.lencana.map((l) => (
                          <span key={l.teks} className="bch-badge" data-tone={l.nada}>
                            {l.teks}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
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
                    {j.zona && <span className="jl-zona"> {j.zona}</span>}
                    {!j.zona && j.jam.length > 0 && <span className="jl-zona"> zona belum jelas</span>}
                  </td>
                  <td data-label="Hari">{j.hari ?? "tidak disebut sumber"}</td>
                  <td data-label="Tanggal data">
                    <span className="bch-data">{teksTanggal(j.tanggal)}</span>
                    {dataSudahLama(j.tanggal, SEKARANG) && (
                      <span className="bch-badges mt-1">
                        <span className="bch-badge" data-tone="caution">
                          data lama
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="jl-jadwal-kosong">Jadwal belum tersedia.</p>
      )}
      {r.link ? (
        <p className="m-0 mt-3">
          <a href={r.link} target="_blank" rel="noopener" className="bch-btn" data-variant="ghost">
            Jadwal resmi
          </a>
        </p>
      ) : (
        <p className="bch-card-meta m-0 mt-3">Belum ada tautan jadwal resmi.</p>
      )}
    </article>
  );
}
