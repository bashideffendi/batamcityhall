import type { Metadata } from "next";
import Link from "next/link";
import { saringPublik, type TukangPublik } from "@/features/tukang/aturan";
import CatatanMode from "@/features/tukang/CatatanMode";
import { KATEGORI_JASA } from "@/features/tukang/kategori";
import KartuTukang from "@/features/tukang/KartuTukang";
import { modeKiriman } from "@/features/tukang/mode";
import { ambilStore } from "@/features/tukang/store";
import { KECAMATAN } from "@/lib/data/schema";

type Props = { searchParams: Promise<{ jasa?: string; kecamatan?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tukang Langganan",
    description: "Rekomendasi tukang dari warga Batam yang pernah pakai jasanya. Tidak ada yang bayar untuk masuk.",
    // Data fiktif mode contoh tidak boleh terindeks.
    robots: modeKiriman() === "contoh" ? { index: false, follow: false } : undefined,
  };
}

async function muat(): Promise<{ daftar: TukangPublik[]; gagal: boolean }> {
  try {
    return { daftar: (await ambilStore()?.daftarPublik()) ?? [], gagal: false };
  } catch (e) {
    console.error("Daftar tukang gagal dimuat:", e instanceof Error ? e.message : "galat tidak dikenal");
    return { daftar: [], gagal: true };
  }
}

export default async function Tukang({ searchParams }: Props) {
  const q = await searchParams;
  const mode = modeKiriman();
  const jasa = KATEGORI_JASA.find((k) => k.slug === q.jasa)?.slug;
  const kecamatan = KECAMATAN.find((k) => k === q.kecamatan);

  const { daftar, gagal } = await muat();
  const hasil = saringPublik(daftar, { jasa, kecamatan });
  const jumlahPerJasa = new Map<string, number>();
  for (const t of saringPublik(daftar, { kecamatan })) {
    jumlahPerJasa.set(t.jasa, (jumlahPerJasa.get(t.jasa) ?? 0) + 1);
  }
  const akhiran = kecamatan ? `&kecamatan=${encodeURIComponent(kecamatan)}` : "";

  return (
    <div className="bch-page bch-tk-halaman" data-mode-tukang={mode}>
      <p className="bch-kicker m-0">Loket 03</p>
      <h1 className="mt-2">Tukang Langganan</h1>
      <p className="bch-lede">
        Tidak ada yang bayar untuk masuk daftar ini. Semua rekomendasi datang dari warga yang pernah pakai jasanya.
      </p>
      <CatatanMode mode={mode} />
      <p className="bch-note">
        Rekomendasi warga, bukan endorsement. Selalu sepakati harga di awal. Entri baru tampil setelah direkomendasikan
        minimal dua warga berbeda, tukangnya mengizinkan, dan moderator menyetujui.
      </p>
      {mode !== "mati" && (
        <p className="mt-4">
          <Link href="/tukang/rekomendasi" className="bch-btn" prefetch={false}>
            Kirim rekomendasi
          </Link>
        </p>
      )}

      <h2 className="mt-6 mb-3">Jasa</h2>
      <nav aria-label="Jenis jasa" className="bch-sub-nav">
        <Link href={kecamatan ? `/tukang?kecamatan=${encodeURIComponent(kecamatan)}` : "/tukang"} prefetch={false}>
          Semua
        </Link>
        {KATEGORI_JASA.map((k) => (
          <Link
            key={k.slug}
            href={`/tukang?jasa=${k.slug}${akhiran}`}
            prefetch={false}
            aria-current={k.slug === jasa ? "page" : undefined}
            data-kosong={jumlahPerJasa.get(k.slug) ? undefined : ""}
          >
            {k.nama}
          </Link>
        ))}
      </nav>

      <form method="get" action="/tukang" className="bch-tk-saring">
        {jasa && <input type="hidden" name="jasa" value={jasa} />}
        <label className="bch-field">
          Kecamatan
          <select className="bch-select" name="kecamatan" defaultValue={kecamatan ?? ""}>
            <option value="">Semua kecamatan</option>
            {KECAMATAN.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="bch-btn" data-variant="ghost">
          Saring
        </button>
      </form>

      {gagal ? (
        <p className="bch-note" data-tone="caution">
          Daftarnya gagal dimuat. Laut masih ada, kami saja yang belum. Coba lagi nanti.
        </p>
      ) : hasil.length ? (
        <>
          <p className="bch-data" data-jumlah={hasil.length}>
            {hasil.length} tukang
          </p>
          <ul className="bch-grid mt-3">
            {hasil.map((t) => (
              <li key={t.id}>
                <KartuTukang t={t} contoh={mode === "contoh"} />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="bch-note" data-kosong-tukang>
          <p className="m-0">
            {daftar.length
              ? "Belum ada tukang yang cocok dengan saringan ini."
              : "Belum ada tukang di daftar ini. Kami tidak mengisinya sendiri: daftar ini menunggu rekomendasi warga."}
          </p>
          {mode !== "mati" && (
            <p className="mt-2 mb-0">
              Kenal yang bagus? <Link href="/tukang/rekomendasi">Kirim rekomendasi</Link>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
