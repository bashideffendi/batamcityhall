// Skema zod untuk data/. Dipakai scripts/validate-data.ts saat prebuild: build gagal kalau
// data tidak valid. Skema dibuat longgar pada field naratif dan ketat pada aturan yang tidak
// boleh dilanggar (enum, koordinat, larangan data pajak, larangan menebak koordinat).
import { z } from "zod";
import { KATEGORI, KECAMATAN, STATUS_DATA, STATUS_KOORDINAT } from "./konstanta";

export { KATEGORI, KECAMATAN, STATUS_DATA, STATUS_KOORDINAT };

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

// Tiga bentuk jumlah_halte_sumber: angka, {nilai: angka, catatan}, {nilai: [a, b], status} (brief 10).
const jumlahHalteSchema = z.union([
  z.number(),
  z.looseObject({ nilai: z.union([z.number(), z.array(z.number())]) }),
]);

export const koridorSchema = z.looseObject({
  koridor: z.array(
    z.looseObject({
      id: z.string(),
      nama: z.string(),
      warna: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      status: z.enum(["aktif", "rencana"]),
      headway_menit: z.looseObject({ pagi_sibuk: z.number(), siang_sore: z.number() }).nullable().optional(),
      jumlah_halte_sumber: jumlahHalteSchema.optional(),
    }),
  ),
});
export const halteSchema = z.looseObject({
  halte: z.array(
    z.looseObject({
      id: z.string(),
      nama: z.string(),
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      status_koordinat: z.enum(STATUS_KOORDINAT),
      kelompok: z.string(),
      koridor: z.array(z.string()),
    }),
  ),
  // Item pola ada dua jenis: halte, dan gap ("…", ada halte yang tidak tercantum di sumber).
  pola: z.array(
    z.looseObject({
      id: z.string(),
      koridor: z.string(),
      arah: z.string(),
      jumlah_halte_sumber: jumlahHalteSchema.nullable(),
      halte: z.array(
        z.union([
          z.looseObject({ jenis: z.literal("halte"), halte_id: z.string(), nama_di_sumber: z.string() }),
          z.looseObject({ jenis: z.literal("gap") }),
        ]),
      ),
    }),
  ),
  halte_transit: z.array(z.looseObject({})),
});

export const terminalSchema = z.looseObject({
  terminal: z.array(
    z.looseObject({
      id: z.string(),
      nama: z.string(),
      jenis: z.string(),
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      status_koordinat: z.enum(STATUS_KOORDINAT),
    }),
  ),
});
const ruteFeriSchema = z.looseObject({
  id: z.string(),
  asal_id: z.string().nullable(),
  tujuan: z.string(),
  operator: z.array(z.string()),
  jenis: z.enum(["internasional", "domestik", "pompong"]).nullable(),
});
export const ruteSchema = z.looseObject({
  rute: z.array(ruteFeriSchema),
  rute_tambahan: z.array(ruteFeriSchema),
});
const jamSchema = z.string().regex(/^\d{2}:\d{2}$/);
// Jam selalu waktu lokal pelabuhan asal. zona_waktu null berarti jam itu tidak boleh dipakai widget (brief 14).
export const jadwalSchema = z.looseObject({
  jadwal: z.array(
    z.looseObject({
      rute_id: z.string(),
      arah: z.string(),
      jam_berangkat: z.array(jamSchema),
      zona_waktu: z.enum(["Asia/Jakarta", "Asia/Singapore", "Asia/Kuala_Lumpur"]).nullable(),
      tanggal_data: z.string().nullable(),
    }),
  ),
});

export const segmenSchema = z.array(z.looseObject({ id: z.string(), urutan: z.number(), label: z.string() }));
export const landmarkSchema = z.array(z.looseObject({ id: z.string(), nama: z.string() }));

export const taksonomiSchema = z.looseObject({
  taksonomi: z.array(z.looseObject({ kategori: z.string(), subkategori: z.string() })),
});

/** Terminal Makan, hasil scripts/konversi-makan.mjs --feri dari data situs. */
export const makanFerrySchema = z.array(
  z.object({
    id: z.string(),
    id_kanonik: z.string(),
    label: z.string(),
    nama: z.string(),
    lat: z.number(),
    lng: z.number(),
    status_koordinat: z.enum(STATUS_KOORDINAT),
  }),
);

/** Food court: alamat dan sumber wajib, koordinat kosong sampai diisi pemilik. Tidak ada kolom rating. */
export const foodCourtSchema = z.object({
  meta: z.object({ dihimpun: z.string(), catatan: z.string() }),
  tempat: z
    .strictObject({
      id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
      nama: z.string().min(1),
      kecamatan: z.enum(KECAMATAN),
      alamat: z.string().min(1),
      jam: z.string(),
      isi: z.string(),
      tingkat: z.enum(["dibaca", "daftar"]),
      sumber_url: z.url().array().min(1),
      lat: z.number().min(0.3).max(1.6).nullable(),
      lng: z.number().min(103.4).max(104.9).nullable(),
    })
    .array(),
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
