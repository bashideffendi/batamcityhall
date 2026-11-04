// Skema zod untuk data/. Dipakai scripts/validate-data.ts saat prebuild: build gagal kalau
// data tidak valid. Skema dibuat longgar pada field naratif dan ketat pada aturan yang tidak
// boleh dilanggar (enum, koordinat, larangan data pajak, larangan menebak koordinat).
import { z } from "zod";

export const KECAMATAN = [
  "Batam Kota",
  "Batu Aji",
  "Batu Ampar",
  "Belakang Padang",
  "Bengkong",
  "Bulang",
  "Galang",
  "Lubuk Baja",
  "Nongsa",
  "Sagulung",
  "Sei Beduk",
  "Sekupang",
] as const;

export const KATEGORI = [
  "pemerintahan",
  "layanan_publik",
  "keamanan_darurat",
  "kesehatan",
  "pendidikan",
  "perpustakaan",
  "ibadah",
  "pemakaman",
  "transportasi",
  "belanja",
  "ruang_publik",
  "wisata",
  "olahraga",
  "akomodasi",
  "jasa",
  "pertanahan_hukum",
  "landmark",
  "kampung_tua",
  "budaya",
  "khas_batam",
  "kuliner",
  "lainnya",
] as const;

export const STATUS_KOORDINAT = ["terverifikasi", "perlu_cek_ulang", "perlu_diisi_user"] as const;
export const STATUS_DATA = ["terverifikasi", "perlu_cek_ulang", "sumber_tunggal", "cerita_rakyat", "usang", "rencana"] as const;

/** Kolom yang sengaja tidak ada di paket dan tidak boleh muncul (research/00 bagian 6). */
const KUNCI_PAJAK = /^(npwpd|nop|nilai_pajak|sspd|sptpd|no_sspd|no_sptpd|nomor_sspd|nomor_sptpd|pajak)$/i;

export const placeSchema = z
  .object({
    id: z.string().min(1),
    nama: z.string().min(1),
    nama_alternatif: z.array(z.string()),
    kategori: z.enum(KATEGORI),
    subkategori: z.string().nullable(),
    kecamatan: z.enum(KECAMATAN).nullable(),
    kelurahan: z.string().nullable(),
    alamat: z.string().nullable(),
    lat: z.number().nullable(),
    lng: z.number().nullable(),
    status_koordinat: z.enum(STATUS_KOORDINAT),
    catatan_koordinat: z.string().nullable().optional(),
    jam_layanan: z.string().nullable(),
    kontak: z.record(z.string(), z.unknown()),
    atribut: z.record(z.string(), z.unknown()),
    status_data: z.string().nullable(),
    catatan: z.string().nullable(),
    tag_osm: z.string().nullable(),
    sumber_url: z.array(z.string()),
    sumber_riset: z.array(z.string()),
    id_alias: z.array(z.string()),
  })
  .superRefine((p, ctx) => {
    if ((p.lat === null) !== (p.lng === null)) {
      ctx.addIssue({ code: "custom", message: `${p.id}: lat dan lng harus sama-sama terisi atau sama-sama null` });
    }
    if (p.lat === null && p.status_koordinat !== "perlu_diisi_user") {
      ctx.addIssue({ code: "custom", message: `${p.id}: tanpa koordinat, status harus perlu_diisi_user` });
    }
    if (p.lat !== null && p.status_koordinat === "perlu_diisi_user") {
      ctx.addIssue({ code: "custom", message: `${p.id}: punya koordinat tetapi status perlu_diisi_user` });
    }
    for (const k of Object.keys(p.atribut)) {
      if (KUNCI_PAJAK.test(k)) ctx.addIssue({ code: "custom", message: `${p.id}: atribut pajak dilarang (${k})` });
    }
  });

export type Place = z.infer<typeof placeSchema>;

const urlList = z.array(z.string()).nullable().optional();

export const statsSchema = z.object({
  total_tempat: z.number(),
  per_kategori: z.record(z.string(), z.number()),
  per_status_koordinat: z.record(z.string(), z.number()),
  per_kecamatan: z.record(z.string(), z.number()),
  jumlah_konflik: z.number(),
  masalah_validasi: z.array(z.string()),
});

export const kampungTuaSchema = z.array(
  z.looseObject({
    id: z.string(),
    nama: z.string(),
    kecamatan: z.string().nullable().optional(),
    sumber_url: urlList,
  }),
);

export const garisWaktuSchema = z.array(
  z.looseObject({ id: z.string(), status_verifikasi: z.string().nullable().optional(), sumber_url: urlList }),
);

export const tokohSchema = z.array(z.looseObject({ id: z.string(), nama: z.string(), sumber_url: urlList }));
export const penamaanSchema = z.array(z.looseObject({ id: z.string(), nama_tempat: z.string() }));
export const relasiSchema = z.array(z.looseObject({ tokoh_a: z.string(), tokoh_b: z.string() }));
export const acaraSchema = z.array(z.looseObject({ id: z.string(), nama: z.string() }));
export const kamusSchema = z.array(z.looseObject({ id: z.string(), kata: z.string(), arti: z.string() }));
export const komunitasSchema = z.array(z.looseObject({ id: z.string(), nama: z.string() }));
export const tradisiSchema = z.array(z.looseObject({ id: z.string(), nama: z.string() }));
export const faktaSchema = z.looseObject({ angka: z.array(z.looseObject({ id: z.string() })) });

export const koridorSchema = z.looseObject({
  koridor: z.array(z.looseObject({ id: z.string(), nama: z.string() })),
});
export const halteSchema = z.looseObject({
  halte: z.array(
    z.looseObject({
      id: z.string(),
      nama: z.string(),
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      status_koordinat: z.enum(STATUS_KOORDINAT),
    }),
  ),
  pola: z.array(z.looseObject({ id: z.string(), koridor: z.string(), halte: z.array(z.unknown()) })),
  halte_transit: z.array(z.looseObject({})),
});

export const terminalSchema = z.looseObject({ terminal: z.array(z.looseObject({ id: z.string(), nama: z.string() })) });
export const ruteSchema = z.looseObject({
  rute: z.array(z.looseObject({ id: z.string() })),
  rute_tambahan: z.array(z.looseObject({ id: z.string() })),
});
export const jadwalSchema = z.looseObject({ jadwal: z.array(z.looseObject({ rute_id: z.string() })) });

export const segmenSchema = z.array(z.looseObject({ id: z.string(), urutan: z.number(), label: z.string() }));
export const landmarkSchema = z.array(z.looseObject({ id: z.string(), nama: z.string() }));

export const taksonomiSchema = z.looseObject({
  taksonomi: z.array(z.looseObject({ kategori: z.string(), subkategori: z.string() })),
});

/** Skema data makan asli batam-bites (features/makan/lib/types.ts). */
export const makanPlaceSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  halal: z.enum(["halal", "non-halal", "muslim-friendly"]),
  price_tier: z.enum(["$", "$$", "$$$"]),
  lat: z.number(),
  lng: z.number(),
  coord_approx: z.boolean(),
  gmaps: z.string(),
});
