// Batam dalam Angka di beranda: empat angka dari baris data yang sama dengan Infografik dan halaman Batam dalam Angka,
// jadi angkanya tidak pernah berbeda antarhalaman. Gagal keras bila barisnya hilang.
import { INFOGRAFIK_REPO, type IdPoster } from "@/features/infografik/data";
import { ANGKA_RESMI, faktaInfografik } from "@/features/sejarah/angka";

export type AngkaBeranda = { nilai: string; label: string; ket: string; href: string };

/** "2.791,09 km²" menjadi 2791.09, "1.394.459" menjadi 1394459. */
export const keAngka = (t: string) => Number(t.replace(/[^\d,]/g, "").replace(",", "."));

const juta = (n: number) => (n / 1e6).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function infografik(poster: IdPoster) {
  const i = INFOGRAFIK_REPO.find((x) => x.poster === poster);
  if (!i) throw new Error(`Infografik ${poster} tidak ada`);
  return `/infografik/${i.slug}`;
}

function wilayah(indikator: string) {
  const b = ANGKA_RESMI.find((k) => k.judul === "Wilayah")?.baris.find((x) => x.indikator === indikator);
  if (!b) throw new Error(`Angka wilayah ${indikator} tidak ada`);
  return b.angka;
}

export function angkaBeranda(): AngkaBeranda[] {
  const f = faktaInfografik();
  const [kecil, besar] = [keAngka(f.bps), keAngka(f.dukcapil)].sort((a, b) => a - b);
  const laut = keAngka(f.perairan);
  const darat = keAngka(f.daratan);
  const kecamatan = wilayah("jumlah_kecamatan");
  return [
    {
      nilai: `${juta(kecil)}—${juta(besar)} juta`,
      label: "Penduduk 2025",
      ket: "Tergantung siapa yang menghitung",
      href: infografik("penduduk"),
    },
    {
      nilai: `±${Math.round((laut / (laut + darat)) * 100)}%`,
      label: "Wilayah Berupa Laut",
      ket: `Laut ${f.perairan}, darat ${f.daratan}`,
      href: infografik("laut"),
    },
    {
      nilai: f.wisman,
      label: "Kunjungan Wisman 2025",
      ket: `${f.singapura} dari Singapura`,
      href: infografik("wisman"),
    },
    {
      nilai: kecamatan.replace(/\D+$/, "").trim(),
      label: "Kecamatan",
      ket: wilayah("jumlah_kelurahan"),
      href: "/cerita/angka#resmi-Wilayah",
    },
  ];
}
