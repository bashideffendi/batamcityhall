import Link from "next/link";
import { connection } from "next/server";
import { teksBulan, teksTerakhirDicek } from "@/features/tukang/aturan";
import { aksesAdmin } from "@/features/tukang/admin-auth";
import { FormGabung, FormIzin, TombolAksi } from "@/features/tukang/admin/AksiAdmin";
import GerbangAdmin from "@/features/tukang/admin/GerbangAdmin";
import NavAdmin from "@/features/tukang/admin/NavAdmin";
import CatatanMode from "@/features/tukang/CatatanMode";
import { JENIS_KOREKSI, namaJasa } from "@/features/tukang/kategori";
import { modeKiriman } from "@/features/tukang/mode";
import { ambilStore, type TukangAdmin } from "@/features/tukang/store";

const NAMA_STATUS = { menunggu: "Menunggu", disetujui: "Disetujui", ditolak: "Ditolak" } as const;
const NADA_STATUS = { menunggu: "caution", disetujui: "ok", ditolak: "danger" } as const;
const namaKoreksi = (j: string) => JENIS_KOREKSI.find((x) => x.nilai === j)?.nama ?? j;

function KartuAntrean({ t, semua }: { t: TukangAdmin; semua: TukangAdmin[] }) {
  return (
    <li>
      <article className="bch-card" data-antrean={t.nama}>
        <p className="bch-kicker m-0">{namaJasa(t.jasa)}</p>
        <h3>{t.nama}</h3>
        <p className="bch-card-loc">
          {t.areaKecamatan.join(", ")}
          {t.areaCatatan ? `, ${t.areaCatatan}` : ""}
          {t.panggilan ? ". Bisa dipanggil." : ""}
        </p>
        <p className="m-0">Cara menghubungi: {t.caraHubungi}</p>
        <div className="bch-badges mt-2">
          <span className="bch-badge" data-tone={NADA_STATUS[t.statusModerasi]}>
            {NAMA_STATUS[t.statusModerasi]}
          </span>
          <span className="bch-badge" data-tone={t.syarat.boleh ? "ok" : "caution"}>
            {t.syarat.boleh ? "Tampil publik" : "Belum tampil"}
          </span>
          <span className="bch-badge">{t.syarat.jumlah} warga berbeda disetujui</span>
          {t.disembunyikan && (
            <span className="bch-badge" data-tone="danger">
              Disembunyikan
            </span>
          )}
          {t.izinTukangAt && (
            <span className="bch-badge" data-tone="ok">
              {t.kontakBolehTampil ? "Izin tukang dan kontak" : "Izin tukang, kontak tidak tampil"}
            </span>
          )}
        </div>
        {t.syarat.kurang.length > 0 && <p className="bch-card-meta mt-2 mb-0">Kurang: {t.syarat.kurang.join(". ")}.</p>}
        <p className="bch-card-meta m-0">{teksTerakhirDicek(t.terakhirDicek)}</p>

        {t.rekomendasi.map((r) => (
          <div key={r.id} className="bch-adm-rek" data-rekomendasi={r.id}>
            <p className="m-0">{r.cerita}</p>
            <p className="bch-card-meta m-0">
              {NAMA_STATUS[r.statusModerasi]}. Dipakai {teksBulan(r.kapanDipakai)}. Kontak: {r.kontakSamaran}.
              {r.tag.length > 0 ? ` Tag: ${r.tag.join(", ")}.` : ""}
            </p>
            <div className="bch-adm-aksi">
              {r.statusModerasi !== "disetujui" && (
                <TombolAksi aksi={{ aksi: "setujui_rekomendasi", id: r.id }} label="Setujui cerita" />
              )}
              {r.statusModerasi !== "ditolak" && (
                <TombolAksi aksi={{ aksi: "tolak_rekomendasi", id: r.id }} label="Tolak cerita" />
              )}
              <TombolAksi
                aksi={{ aksi: "hapus_rekomendasi", id: r.id }}
                label="Hapus cerita"
                tanya="Hapus rekomendasi ini beserta kontaknya?"
              />
            </div>
          </div>
        ))}

        {t.izinTukangAt ? (
          <div className="bch-adm-aksi">
            <TombolAksi aksi={{ aksi: "cabut_izin", id: t.id }} label="Cabut izin tukang" />
          </div>
        ) : (
          <FormIzin id={t.id} />
        )}
        <div className="bch-adm-aksi">
          {t.statusModerasi !== "disetujui" && (
            <TombolAksi aksi={{ aksi: "setujui_tukang", id: t.id }} label="Setujui entri" ghost={false} />
          )}
          <TombolAksi aksi={{ aksi: "tandai_dicek", id: t.id }} label="Sudah dicek hari ini" />
          <TombolAksi aksi={{ aksi: "tolak_tukang", id: t.id }} label="Tolak entri" />
          <TombolAksi
            aksi={{ aksi: "hapus_tukang", id: t.id }}
            label="Hapus entri"
            tanya="Hapus entri ini beserta semua rekomendasinya?"
          />
        </div>
        <FormGabung
          id={t.id}
          pilihan={semua.filter((x) => x.id !== t.id && x.jasa === t.jasa).map((x) => ({ id: x.id, nama: x.nama }))}
        />
      </article>
    </li>
  );
}

export default async function Admin() {
  await connection();
  const akses = await aksesAdmin();
  if (akses !== "masuk") return <GerbangAdmin akses={akses} />;

  const store = ambilStore();
  const antrean = await store?.antrean();
  const tukang = antrean?.tukang ?? [];
  // Yang butuh tindakan di atas, yang sudah tampil di bawah.
  const urut = [...tukang].sort((a, b) => Number(a.syarat.boleh) - Number(b.syarat.boleh));

  return (
    <div className="bch-page bch-tk-halaman" data-admin-masuk>
      <p className="bch-kicker m-0">Admin</p>
      <h1 className="mt-2">Antrean moderasi</h1>
      <NavAdmin />
      <CatatanMode mode={modeKiriman()} />
      <p className="bch-note">
        Layar ini hanya menampilkan kontak perekomendasi yang tersamar. Kontak lengkap hanya bisa dibaca langsung di
        basis data.
      </p>

      <h2 className="mt-6 mb-3">Laporan warga ({antrean?.laporan.length ?? 0})</h2>
      {antrean?.laporan.length ? (
        <ul className="bch-adm-daftar">
          {antrean.laporan.map((l) => (
            <li key={l.id} className="bch-card" data-laporan={l.tukangNama}>
              <p className="m-0">
                <strong>{l.tukangNama}</strong>:{" "}
                {l.jenis === "masalah" ? "dilaporkan bermasalah" : "sudah pindah atau tutup"}
              </p>
              {l.alasan && <p className="m-0">{l.alasan}</p>}
              <div className="bch-adm-aksi">
                {l.jenis === "masalah" && (
                  <TombolAksi
                    aksi={{ aksi: "tinjau_laporan", id: l.id, tampilkan_lagi: true }}
                    label="Tampilkan Lagi"
                  />
                )}
                <TombolAksi
                  aksi={{ aksi: "tinjau_laporan", id: l.id, tampilkan_lagi: false }}
                  label={l.jenis === "masalah" ? "Tinjau, tetap sembunyikan" : "Sudah ditinjau"}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada laporan baru.</p>
      )}

      <h2 className="mt-6 mb-3">Tukang ({tukang.length})</h2>
      {urut.length ? (
        <ul className="bch-adm-daftar">
          {urut.map((t) => (
            <KartuAntrean key={t.id} t={t} semua={tukang} />
          ))}
        </ul>
      ) : (
        <p>Belum ada kiriman.</p>
      )}

      <h2 className="mt-6 mb-3">Koreksi data ({antrean?.koreksi.length ?? 0})</h2>
      {antrean?.koreksi.length ? (
        <ul className="bch-adm-daftar">
          {antrean.koreksi.map((k) => (
            <li key={k.id} className="bch-card" data-koreksi={k.id}>
              <p className="bch-kicker m-0">{namaKoreksi(k.jenis)}</p>
              {k.tempatId && (
                <p className="m-0">
                  Tempat:{" "}
                  <Link href={`/info/tempat/${k.tempatId}`} prefetch={false}>
                    {k.tempatId}
                  </Link>
                </p>
              )}
              {k.tukangId && <p className="m-0">Entri tukang: {k.tukangId}</p>}
              <p className="m-0">{k.isi}</p>
              <p className="bch-card-meta m-0">
                Kontak: {k.kontakSamaran ?? "tidak ada"}. Rekomendasi dari kontak yang sama: {k.cocokRekomendasi}.
              </p>
              <div className="bch-adm-aksi">
                <TombolAksi aksi={{ aksi: "selesai_koreksi", id: k.id }} label="Selesai" />
                {k.kontakSamaran && (
                  <TombolAksi
                    aksi={{ aksi: "hapus_data_pengirim", id: k.id }}
                    label="Hapus data pengirim"
                    tanya="Hapus semua rekomendasi dari kontak ini, lalu hapus kontaknya dari permintaan ini?"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada koreksi baru.</p>
      )}

      <h2 className="mt-6 mb-3">Kiriman foto lama ({antrean?.foto.length ?? 0})</h2>
      {antrean?.foto.length ? (
        <ul className="bch-adm-daftar">
          {antrean.foto.map((f) => (
            <li key={f.id} className="bch-card">
              <p className="m-0">
                <strong>{f.judul}</strong>, {f.lokasi}, {f.perkiraanTahun}
              </p>
              {f.cerita && <p className="m-0">{f.cerita}</p>}
              <p className="bch-card-meta m-0">
                Kredit: {f.kredit}. Kontak: {f.kontakSamaran}. Berkas belum diterima lewat situs.
              </p>
              <div className="bch-adm-aksi">
                <TombolAksi aksi={{ aksi: "selesai_foto", id: f.id }} label="Selesai" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Tidak ada kiriman foto baru.</p>
      )}
    </div>
  );
}
