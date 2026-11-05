import { JENIS_AGENDA } from "./skema";
import type { BarisAgenda } from "./store";

const tanggalPanjang = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));

const namaJenis = (slug: string) => JENIS_AGENDA.find((j) => j.slug === slug)?.nama ?? "Lainnya";

/** Acara bertanggal dari dashboard: konser, festival, pameran. Selama kosong, seksi ini tidak tampil. */
export default function AgendaMendatang({ agenda }: { agenda: BarisAgenda[] }) {
  if (!agenda.length) return null;
  return (
    <section aria-labelledby="ttd-agenda" className="bch-seksi-rapat">
      <h2 id="ttd-agenda" className="bch-judul-seksi">
        Agenda Mendatang
      </h2>
      <ul className="bud-daftar">
        {agenda.map((a) => (
          <li key={a.id} className="bud-baris" data-agenda={a.id}>
            <div>
              <p className="bud-bidang bud-kelompok">{namaJenis(a.jenis)}</p>
              <h3 className="bud-nama">{a.nama}</h3>
              <p className="bud-bidang">{a.lokasi}</p>
              {a.keterangan && <p className="bud-uraian">{a.keterangan}</p>}
            </div>
            <div className="bud-samping">
              <dl className="bud-fakta">
                <div>
                  <dt>Tanggal</dt>
                  <dd>
                    <span className="bch-data">
                      {tanggalPanjang(a.mulai)}
                      {a.selesai && a.selesai !== a.mulai ? ` sampai ${tanggalPanjang(a.selesai)}` : ""}
                    </span>
                    {a.jam && <span className="bch-sel-kecil">{a.jam}</span>}
                  </dd>
                </div>
                {a.harga && (
                  <div>
                    <dt>Harga Tiket</dt>
                    <dd>{a.harga}</dd>
                  </div>
                )}
                {a.penyelenggara && (
                  <div>
                    <dt>Penyelenggara</dt>
                    <dd>{a.penyelenggara}</dd>
                  </div>
                )}
              </dl>
              {a.tautan && (
                <a href={a.tautan} target="_blank" rel="noopener noreferrer">
                  Sumber dan Tiket
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
