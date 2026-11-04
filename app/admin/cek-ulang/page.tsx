import Link from "next/link";
import { connection } from "next/server";
import { namaKategori, TEMPAT, tautanAman } from "@/features/direktori/data";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";
import { teksTerakhirDicek } from "@/features/tukang/aturan";
import { alasanCekUlang, lewatEnamBulan, NAMA_ALASAN, type AlasanCek } from "@/features/tukang/cek-ulang";
import { ambilStore } from "@/features/tukang/store";

type Props = { searchParams: Promise<{ alasan?: string }> };

const SEMUA_ALASAN = Object.keys(NAMA_ALASAN) as AlasanCek[];

export default async function CekUlang({ searchParams }: Props) {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;

  const { alasan } = await searchParams;
  const sekarang = new Date();
  const baris = TEMPAT.flatMap((p) => {
    const a = alasanCekUlang(p, sekarang);
    return a.length ? [{ p, alasan: a }] : [];
  });
  const pilihan = SEMUA_ALASAN.find((a) => a === alasan);
  const tampil = pilihan ? baris.filter((b) => b.alasan.includes(pilihan)) : baris;

  const tukang = (await ambilStore()?.antrean())?.tukang ?? [];
  const tukangLama = tukang.filter((t) => t.syarat.boleh && lewatEnamBulan(t.terakhirDicek, sekarang));

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <p className="bch-kicker m-0">Admin</p>
      <h1 className="mt-2">Data yang perlu dicek ulang</h1>
      <NavAdmin />
      <p className="bch-lede">
        Tempat berstatus perlu cek ulang atau usang, atau yang lebih dari 6 bulan sejak dicek. Entri tanpa tanggal
        dihitung sejak riset, November 2026.
      </p>

      <nav aria-label="Saring alasan" className="bch-sub-nav">
        <Link href="/admin/cek-ulang" prefetch={false} aria-current={pilihan ? undefined : "page"}>
          Semua ({baris.length})
        </Link>
        {SEMUA_ALASAN.map((a) => (
          <Link
            key={a}
            href={`/admin/cek-ulang?alasan=${a}`}
            prefetch={false}
            aria-current={pilihan === a ? "page" : undefined}
          >
            {NAMA_ALASAN[a]} ({baris.filter((b) => b.alasan.includes(a)).length})
          </Link>
        ))}
      </nav>

      <p className="bch-data mt-4" data-jumlah-cek={tampil.length}>
        {tampil.length} tempat
      </p>
      {tampil.length > 0 && (
        <div className="bch-table-wrap mt-3">
          <table className="bch-table">
            <thead>
              <tr>
                <th scope="col">Tempat</th>
                <th scope="col">Kategori</th>
                <th scope="col">Kecamatan</th>
                <th scope="col">Alasan</th>
                <th scope="col">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map(({ p, alasan: a }) => (
                <tr key={p.id} data-cek={p.id}>
                  <td>
                    <Link href={`/info/tempat/${p.id}`} prefetch={false}>
                      {p.nama}
                    </Link>
                  </td>
                  <td>{namaKategori(p.kategori)}</td>
                  <td>{p.kecamatan ?? "Belum diketahui"}</td>
                  <td>{a.map((x) => NAMA_ALASAN[x]).join("; ")}</td>
                  <td>
                    {tautanAman(p.sumber_url[0]) ? (
                      <a href={p.sumber_url[0]} rel="noreferrer noopener" target="_blank">
                        Sumber
                      </a>
                    ) : (
                      "Tidak ada"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-6 mb-3">Tukang lebih dari 6 bulan ({tukangLama.length})</h2>
      {tukangLama.length ? (
        <ul>
          {tukangLama.map((t) => (
            <li key={t.id}>
              {t.nama}. {teksTerakhirDicek(t.terakhirDicek)}.
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada.</p>
      )}
    </div>
  );
}
