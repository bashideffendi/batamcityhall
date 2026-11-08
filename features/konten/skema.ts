// Validasi konten admin. Pesan galat ditulis untuk pemilik, dan dipetakan ke kolom formulir.
import { z } from "zod";
import kawasanMakan from "@/data/makan/areas.json";
import kategoriMakan from "@/data/makan/categories.json";
import foodCourtMakan from "@/data/makan/foodcourt.json";
import { KECAMATAN } from "@/lib/data/schema";

const TANGGAL = /^\d{4}-\d{2}-\d{2}$/;
const POLA_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const wajib = (max: number, pesan: string) =>
  z
    .string({ error: pesan })
    .trim()
    .min(1, { error: pesan })
    .max(max, { error: `Paling banyak ${max} karakter.` });

const opsional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Paling banyak ${max} karakter.` })
    .nullish()
    .transform((v) => v || null);

const tanggal = (pesan: string) => z.string({ error: pesan }).regex(TANGGAL, { error: pesan });

const tautan = z
  .string()
  .trim()
  .max(1000)
  // "//host" dan "/\host" dibaca peramban sebagai situs lain, jadi bukan tautan internal.
  .refine((s) => !s || /^https:\/\//.test(s) || /^\/(?![/\\])/.test(s), {
    error: "Tautan harus diawali https://",
  })
  .nullish()
  .transform((v) => v || null);

/** "Nongsa dan Mandat 1829" menjadi "nongsa-dan-mandat-1829". */
export const buatSlug = (judul: string) =>
  judul
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

/** Paragraf dipisah baris kosong. Baris tunggal di dalam paragraf disambung. */
export const pecahParagraf = (isi: string) =>
  isi
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

/** Alamat gambar hasil unggah. Di mode contoh gambarnya ikut di alamat, jadi batasnya longgar. */
const gambar = z
  .string()
  .trim()
  .max(1_500_000)
  .refine((s) => !s || /^https:\/\//.test(s) || s.startsWith("/") || s.startsWith("data:image/"), { error: "Alamat gambar tidak dikenal." })
  .nullish()
  .transform((v) => v || null);

export const SkemaJurnal = z.object({
  id: z.uuid().nullish(),
  slug: z.string({ error: "Alamat wajib diisi." }).regex(POLA_SLUG, { error: "Hanya huruf kecil, angka, dan tanda hubung." }).max(80),
  judul: wajib(160, "Judul wajib diisi."),
  penulis: wajib(80, "Nama penulis wajib diisi."),
  tanggal: tanggal("Tanggal wajib diisi."),
  rubrik: wajib(40, "Rubrik wajib diisi."),
  ringkasan: wajib(300, "Ringkasan wajib diisi."),
  gambar,
  isi: wajib(60000, "Isi tulisan wajib diisi."),
  terbit: z.boolean(),
});
export type InputJurnal = z.output<typeof SkemaJurnal>;

export const SkemaFoto = z.object({
  tempat_id: wajib(80, "Pilih tempatnya."),
  src: wajib(1_500_000, "Foto belum diunggah."),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  alt: opsional(200),
  kredit: opsional(120),
});
export type InputFoto = z.output<typeof SkemaFoto>;

export const JENIS_AGENDA = [
  { slug: "konser", nama: "Konser" },
  { slug: "festival", nama: "Festival" },
  { slug: "pameran", nama: "Pameran" },
  { slug: "olahraga", nama: "Olahraga" },
  { slug: "komunitas", nama: "Komunitas" },
  { slug: "lainnya", nama: "Lainnya" },
] as const;
const SLUG_JENIS = JENIS_AGENDA.map((j) => j.slug) as [string, ...string[]];

export const SkemaAgenda = z
  .object({
    id: z.uuid().nullish(),
    nama: wajib(160, "Nama acara wajib diisi."),
    jenis: z.enum(SLUG_JENIS, { error: "Pilih jenis acara." }),
    mulai: tanggal("Tanggal mulai wajib diisi."),
    selesai: z
      .string()
      .regex(TANGGAL)
      .or(z.literal(""))
      .nullish()
      .transform((v) => v || null),
    jam: opsional(60),
    lokasi: wajib(160, "Lokasi wajib diisi."),
    penyelenggara: opsional(120),
    harga: opsional(80),
    tautan,
    keterangan: opsional(600),
    terbit: z.boolean(),
  })
  .refine((a) => !a.selesai || a.selesai >= a.mulai, { error: "Tanggal selesai sebelum tanggal mulai.", path: ["selesai"] });
export type InputAgenda = z.output<typeof SkemaAgenda>;

const ID_KATEGORI = new Set((kategoriMakan as { id: string }[]).map((c) => c.id));
const ID_KAWASAN = new Set((kawasanMakan as { id: string }[]).map((a) => a.id));
/** Food court di berkas repo. Food court baru dari dashboard diperiksa di API, karena tersimpan di basis data. */
export const ID_FOOD_COURT = new Set(foodCourtMakan.tempat.map((f) => f.id));

export const JENIS_LOKER = [
  { slug: "penuh-waktu", nama: "Penuh Waktu" },
  { slug: "paruh-waktu", nama: "Paruh Waktu" },
  { slug: "kontrak", nama: "Kontrak" },
  { slug: "magang", nama: "Magang" },
] as const;
const SLUG_LOKER = JENIS_LOKER.map((j) => j.slug) as [string, ...string[]];

export const SkemaLoker = z
  .object({
    id: z.uuid().nullish(),
    posisi: wajib(120, "Posisi wajib diisi."),
    perusahaan: wajib(120, "Perusahaan wajib diisi."),
    jenis: z.enum(SLUG_LOKER, { error: "Pilih jenis pekerjaan." }),
    lokasi: wajib(120, "Lokasi wajib diisi."),
    gaji: opsional(80),
    syarat: opsional(1000),
    cara_melamar: wajib(400, "Cara melamar wajib diisi."),
    tautan,
    tanggal: tanggal("Tanggal posting wajib diisi."),
    batas: z
      .string()
      .regex(TANGGAL)
      .or(z.literal(""))
      .nullish()
      .transform((v) => v || null),
    terbit: z.boolean(),
  })
  .refine((l) => !l.batas || l.batas >= l.tanggal, { error: "Batas lamaran sebelum tanggal posting.", path: ["batas"] });
export type InputLoker = z.output<typeof SkemaLoker>;

const HALAL = ["halal", "muslim-friendly", "non-halal"] as const;
const HARGA = ["$", "$$", "$$$"] as const;

/** Kolom data makanan yang boleh diubah lewat admin. Koordinat tempat lama diisi lewat lembar koordinat. */
const kolomMakan = {
  name: wajib(120, "Nama wajib diisi."),
  category: wajib(40, "Pilih kategori.").refine((k) => ID_KATEGORI.has(k), { error: "Pilih kategori." }),
  kategori_lain: z
    .string()
    .refine((k) => ID_KATEGORI.has(k), { error: "Kategori tidak dikenal." })
    .array()
    .max(6, { error: "Paling banyak 6 kategori lain." })
    .default([]),
  food_court: z
    .string()
    .nullish()
    .refine((k) => !k || POLA_SLUG.test(k), { error: "Food court tidak dikenal." })
    .transform((k) => k || null),
  area: wajib(40, "Pilih kawasan.").refine((k) => ID_KAWASAN.has(k), { error: "Pilih kawasan." }),
  halal: z.enum(HALAL, { error: "Pilih status halal." }),
  desc_id: wajib(600, "Keterangan wajib diisi."),
  signature: opsional(240).transform((v) => v ?? ""),
  price_tier: z.enum(HARGA, { error: "Pilih tingkat harga." }),
  price_idr: opsional(60).transform((v) => v ?? ""),
  address: wajib(240, "Alamat wajib diisi."),
  hours: opsional(120).transform((v) => v ?? ""),
  phone: opsional(40).transform((v) => v ?? ""),
  instagram: opsional(120).transform((v) => v ?? ""),
  gmaps: tautan.transform((v) => v ?? ""),
};

export const SkemaUbahanMakan = z.discriminatedUnion("baru", [
  z.object({ baru: z.literal(false), tempat_id: wajib(80, "Pilih tempatnya."), ...kolomMakan }),
  z.object({
    baru: z.literal(true),
    tempat_id: z.string({ error: "Alamat wajib diisi." }).regex(POLA_SLUG, { error: "Hanya huruf kecil, angka, dan tanda hubung." }).max(80),
    ...kolomMakan,
    lat: z.number({ error: "Lintang wajib diisi." }).min(0.3, { error: "Di luar Batam." }).max(1.6, { error: "Di luar Batam." }),
    lng: z.number({ error: "Bujur wajib diisi." }).min(103.4, { error: "Di luar Batam." }).max(104.9, { error: "Di luar Batam." }),
  }),
]);
export type InputUbahanMakan = z.output<typeof SkemaUbahanMakan>;

const tautanSumber = z
  .string()
  .trim()
  .refine(
    (s) => {
      try {
        return new URL(s).protocol === "https:";
      } catch {
        return false;
      }
    },
    { error: "Tautan harus diawali https://" },
  );

/** Kolom food court yang boleh diubah lewat admin. Koordinat diisi lewat lembar koordinat. */
const kolomFoodCourt = {
  nama: wajib(120, "Nama wajib diisi."),
  kecamatan: z.enum(KECAMATAN, { error: "Pilih kecamatan." }),
  alamat: wajib(240, "Alamat wajib diisi."),
  jam: opsional(160).transform((v) => v ?? ""),
  isi: wajib(600, "Keterangan wajib diisi."),
  tingkat: z.enum(["dibaca", "daftar"], { error: "Pilih status alamat." }),
  sumber_url: tautanSumber
    .array()
    .min(1, { error: "Isi paling sedikit satu tautan sumber." })
    .max(6, { error: "Paling banyak 6 tautan." }),
};

export const SkemaInfografik = z.object({
  id: z.uuid().nullish(),
  slug: z.string({ error: "Alamat wajib diisi." }).regex(POLA_SLUG, { error: "Hanya huruf kecil, angka, dan tanda hubung." }).max(80),
  judul: wajib(160, "Judul wajib diisi."),
  ringkasan: wajib(300, "Ringkasan wajib diisi."),
  rubrik: wajib(40, "Rubrik wajib diisi."),
  tanggal: tanggal("Tanggal wajib diisi."),
  gambar: gambar.refine((v) => !!v, { error: "Unggah gambar infografiknya." }).transform((v) => v as string),
  lebar: z.number({ error: "Unggah gambar infografiknya." }).int().positive(),
  tinggi: z.number({ error: "Unggah gambar infografiknya." }).int().positive(),
  deskripsi: wajib(6000, "Tulis isi infografik dalam teks, untuk pembaca layar."),
  terbit: z.boolean(),
});
export type InputInfografik = z.output<typeof SkemaInfografik>;

export const SkemaUbahanFoodCourt = z.discriminatedUnion("baru", [
  z.object({
    baru: z.literal(false),
    foodcourt_id: z.string().refine((k) => ID_FOOD_COURT.has(k), { error: "Pilih food court." }),
    ...kolomFoodCourt,
  }),
  z.object({
    baru: z.literal(true),
    foodcourt_id: z
      .string({ error: "Nama wajib diisi." })
      .regex(POLA_SLUG, { error: "Nama wajib diisi." })
      .max(80)
      .refine((k) => !ID_FOOD_COURT.has(k), { error: "Nama ini sudah dipakai food court lain." }),
    ...kolomFoodCourt,
  }),
]);
export type InputUbahanFoodCourt = z.output<typeof SkemaUbahanFoodCourt>;

const id = z.uuid({ error: "Entri tidak dikenal." });

export const SkemaAksiKonten = z.discriminatedUnion("aksi", [
  z.object({ aksi: z.literal("simpan_jurnal"), data: SkemaJurnal }),
  z.object({ aksi: z.literal("hapus_jurnal"), id }),
  z.object({ aksi: z.literal("tambah_foto"), data: SkemaFoto }),
  z.object({ aksi: z.literal("hapus_foto"), id }),
  z.object({ aksi: z.literal("simpan_agenda"), data: SkemaAgenda }),
  z.object({ aksi: z.literal("hapus_agenda"), id }),
  z.object({ aksi: z.literal("simpan_loker"), data: SkemaLoker }),
  z.object({ aksi: z.literal("hapus_loker"), id }),
  z.object({ aksi: z.literal("simpan_makan"), data: SkemaUbahanMakan }),
  z.object({ aksi: z.literal("hapus_makan"), tempat_id: z.string().min(1) }),
  z.object({ aksi: z.literal("simpan_foodcourt"), data: SkemaUbahanFoodCourt }),
  z.object({ aksi: z.literal("hapus_foodcourt"), foodcourt_id: z.string().min(1) }),
  z.object({ aksi: z.literal("simpan_infografik"), data: SkemaInfografik }),
  z.object({ aksi: z.literal("hapus_infografik"), id }),
]);
export type AksiKonten = z.output<typeof SkemaAksiKonten>;
