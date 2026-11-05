import type { Metadata } from "next";
import Link from "next/link";
import PembukaLoket from "@/components/site/PembukaLoket";
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
    description:
      "Penjahit, tukang servis, dan penyedia jasa lain yang direkomendasikan warga Batam. Tidak ada yang membayar untuk masuk daftar ini.",
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
  const tautanJasa = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("jasa", slug);
    if (kecamatan) p.set("kecamatan", kecamatan);
    const kueri = p.toString();
    return kueri ? `/tukang?${kueri}` : "/tukang";
  };

  return (
    <div className="bch-page bch-tk-halaman" data-mode-tukang={mode}>
      <PembukaLoket
        nomor="03"
        lede="Bagian ini memuat penjahit, tukang servis, dan penyedia jasa lain yang direkomendasikan warga Batam. Setiap nama tampil setelah direkomendasikan oleh sekurang-kurangnya dua orang."
      >
        <p className="bch-measure">Tidak ada yang membayar untuk masuk daftar ini.</p>
        {mode === "contoh" && <CatatanMode mode={mode} />}
        {mode !== "mati" && (
          <p className="mt-4 mb-0">
            <Link href="/tukang/rekomendasi" className="bch-btn" prefetch={false}>
              Kirim rekomendasi
            </Link>
          </p>
        )}
      </PembukaLoket>

      <h2 className="mt-6 mb-3">Jenis jasa</h2>
      <nav aria-label="Jenis jasa" className="bch-sub-nav">
        <Link href={tautanJasa()} prefetch={false}>
          Semua
        </Link>
        {KATEGORI_JASA.map((k) => (
          <Link
            key={k.slug}
            href={tautanJasa(k.slug)}
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
          Daftar tukang tidak dapat dimuat. Coba muat ulang dalam beberapa saat.
        </p>
      ) : hasil.length ? (
        <>
          <p className="bch-data" data-jumlah={hasil.length}>
            {hasil.length} tukang
          </p>
          <ul className="bch-daftar-baris mt-3" data-kolom="2">
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
              ? "Belum ada nama yang cocok dengan saringan ini. Coba hapus saringan."
              : "Belum ada nama di daftar ini. Rekomendasi pertama akan tampil setelah diperiksa dan didukung oleh dua warga."}
          </p>
        </div>
      )}
    </div>
  );
}
