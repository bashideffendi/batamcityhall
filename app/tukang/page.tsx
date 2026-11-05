import type { Metadata } from "next";
import Link from "next/link";
import KisiPintu from "@/components/site/KisiPintu";
import PembukaBagian from "@/components/site/PembukaBagian";
import { saringPublik, type TukangPublik } from "@/features/tukang/aturan";
import CatatanMode from "@/features/tukang/CatatanMode";
import { KATEGORI_JASA } from "@/features/tukang/kategori";
import KartuTukang from "@/features/tukang/KartuTukang";
import { modeKiriman } from "@/features/tukang/mode";
import { ambilStore } from "@/features/tukang/store";
import { KECAMATAN } from "@/lib/data/schema";
import { kaidahJudul } from "@/lib/judul";

type Props = { searchParams: Promise<{ jasa?: string; kecamatan?: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tukang Langganan",
    description:
      "Penjahit, tukang servis, dan jasa lain yang direkomendasikan warga Batam. Tidak ada yang membayar untuk masuk daftar ini.",
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
      <PembukaBagian id="tukang" lede="Direkomendasikan minimal dua warga. Tidak ada yang membayar.">
        {mode === "contoh" && <CatatanMode mode={mode} />}
      </PembukaBagian>

      {!gagal && daftar.length === 0 ? (
        <section className="bch-seksi-rapat" data-kosong-tukang>
          <p className="bch-measure m-0 mb-5">Daftar sedang dikumpulkan. Nama tampil setelah diperiksa dan didukung dua warga.</p>
          <h2 className="bch-judul-seksi">Sementara Ini</h2>
          <KisiPintu
            kolom={2}
            isi={[
              { href: "/info/direktori/jasa", nama: "Jasa di Direktori", ket: "Pusat servis, ekspedisi, dan penukaran uang" },
              { href: "/info/direktori/belanja", nama: "Toko dan Pasar", ket: "Bahan bangunan, pasar, dan pusat belanja" },
            ]}
          />
        </section>
      ) : (
        <>
      <h2 className="bch-judul-seksi bch-seksi-rapat">Jenis Jasa</h2>
      <nav aria-label="Jenis Jasa" className="bch-saring-baris">
        <Link href={tautanJasa()} prefetch={false} className="bch-pil" aria-current={jasa ? undefined : "page"}>
          Semua
        </Link>
        {KATEGORI_JASA.map((k) => (
          <Link
            key={k.slug}
            href={tautanJasa(k.slug)}
            prefetch={false}
            aria-current={k.slug === jasa ? "page" : undefined}
            data-kosong={jumlahPerJasa.get(k.slug) ? undefined : ""}
            className="bch-pil"
          >
            {kaidahJudul(k.nama)}
          </Link>
        ))}
      </nav>

      <form method="get" action="/tukang" className="bch-tk-saring">
        {jasa && <input type="hidden" name="jasa" value={jasa} />}
        <label className="bch-field">
          Kecamatan
          <select className="bch-select" name="kecamatan" defaultValue={kecamatan ?? ""}>
            <option value="">Semua Kecamatan</option>
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
          Daftar tukang tidak dapat dimuat. Coba muat ulang.
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
          <p className="m-0">Belum ada nama yang cocok. Coba hapus saringan.</p>
        </div>
      )}
        </>
      )}
    </div>
  );
}
