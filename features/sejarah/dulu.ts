// Batam Dulu vs Sekarang: rentang tahun untuk slider, titik yang berkoordinat, dan status arsip.
import perubahan from "@/data/sejarah/perubahan_fisik.json";
import arsip from "@/data/sejarah/sumber_arsip.json";
import { cariTempat } from "@/features/direktori/data";
import { keSumber, type KunciStatus, type Sumber } from "./data";
import type { KartuDulu, TitikDulu } from "./dulu-slider";

// Acuan slider menurut laporan 15: versi BP Batam bila ada. Kalau tidak ada, dipakai rentang terlebar dari
// `tahun_kunci`. Dekade ("1970-an") dibaca 1970 sampai 1979. Tes memastikan angkanya berasal dari tahun_kunci.
export const RENTANG: Record<string, { mulai: number; selesai: number; versi?: string }> = {
  "pf-01": {
    mulai: 1970,
    selesai: 2007,
    versi: "Sebutan Nagoya sendiri: sejak survei 1960-an (Maaz Ismail, 2007) atau sekitar 1978 (Machmur Ismail).",
  },
  "pf-02": { mulai: 1990, selesai: 1999 },
  "pf-03": { mulai: 1970, selesai: 1979 },
  "pf-04": { mulai: 1969, selesai: 1979 },
  "pf-05": {
    mulai: 1975,
    selesai: 1978,
    versi: "Sumber menyebut 1975 atau 1978. Slider memakai keduanya sebagai rentang.",
  },
  "pf-06": {
    mulai: 1981,
    selesai: 1986,
    versi: "Sumber menyebut 1981–1982 atau 1985–1986. Slider memakai rentang terlebar.",
  },
  "pf-07": { mulai: 1989, selesai: 1991, versi: "Mulai 1989 atau 1990, selesai 1991." },
  "pf-08": {
    mulai: 1990,
    selesai: 2001,
    versi: "Slider memakai versi BP Batam: dibangun 1990, operasi 2001. Versi lain: 1986/1992 dan 1991/1995.",
  },
  "pf-09": {
    mulai: 1974,
    selesai: 1995,
    versi:
      "Mulai dibangun 1974, 1980, atau 1984 menurut sumber berbeda; diresmikan 1995. Slider memakai rentang terlebar.",
  },
  "pf-10": { mulai: 1992, selesai: 1998 },
  "pf-11": { mulai: 1979, selesai: 1996 },
  "pf-12": { mulai: 1945, selesai: 1946 },
  "pf-13": { mulai: 2021, selesai: 2021 },
  "pf-14": { mulai: 1847, selesai: 1847 },
};

export const TAHUN_KINI = 2026;

export const KARTU_DULU: KartuDulu[] = perubahan
  .map((p) => {
    const r = RENTANG[p.id];
    return {
      id: p.id,
      lokasi: p.lokasi,
      dulu: p.dulu,
      sekarang: p.sekarang,
      tahunKunci: p.tahun_kunci,
      status: p.status_verifikasi as KunciStatus,
      mulai: r.mulai,
      selesai: r.selesai,
      versi: r.versi ?? null,
      catatan: p.catatan,
      sumber: keSumber(p.sumber_url),
    };
  })
  .sort((a, b) => a.mulai - b.mulai || a.selesai - b.selesai);

// Titik hanya dari places.json, dan hanya yang koordinatnya terisi. Tidak ada koordinat yang ditebak.
export const TITIK_DULU: TitikDulu[] = perubahan.flatMap((p) =>
  p.place_ids.flatMap((id) => {
    const t = cariTempat(id);
    if (!t || t.lat == null || t.lng == null || t.status_koordinat === "perlu_diisi_user") return [];
    return [
      {
        pf: p.id,
        id: t.id,
        nama: t.nama,
        lat: t.lat,
        lng: t.lng,
        perkiraan: t.status_koordinat !== "terverifikasi",
      },
    ];
  }),
);

export const LABEL_PAKAI_ULANG: Record<string, { teks: string; nada: "ok" | "caution" | "danger" | "info" }> = {
  ya: { teks: "Boleh, untuk item berlabel CC0", nada: "ok" },
  ya_jika_label_terbuka: { teks: "Boleh, kalau label itemnya terbuka", nada: "ok" },
  ya_sesuai_label: { teks: "Boleh, sesuai label berkas", nada: "ok" },
  minta_izin: { teks: "Harus minta izin", nada: "caution" },
  tidak_tanpa_izin: { teks: "Tidak tanpa izin", nada: "danger" },
  tautkan_saja: { teks: "Tautan saja", nada: "info" },
  petunjuk_saja: { teks: "Petunjuk saja, lacak item aslinya", nada: "info" },
};

export type Arsip = {
  id: string;
  lembaga: string;
  koleksi: string;
  isi: string;
  lisensi: string;
  kredit: string;
  pakaiUlang: { teks: string; nada: "ok" | "caution" | "danger" | "info" };
  tautan: Sumber[];
};

export const ARSIP: Arsip[] = arsip.map((a) => ({
  id: a.id,
  lembaga: a.nama_lembaga,
  koleksi: a.koleksi,
  isi: a.isi_relevan.replace(/\*/g, ""),
  lisensi: a.lisensi,
  kredit: a.cara_kredit_tabel.replace(/"/g, ""),
  pakaiUlang: LABEL_PAKAI_ULANG[a.boleh_dipakai_ulang],
  tautan: keSumber(a.titik_masuk_url),
}));
