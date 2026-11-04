// Validasi kiriman warga. Pesan galat ditulis untuk warga, dan dipetakan ke kolom formulir.
import { z } from "zod";
import { KECAMATAN } from "@/lib/data/schema";
import { kontakSah, normalKontak } from "./aturan";
import { JENIS_KOREKSI, SLUG_JASA, TAG_REKOMENDASI } from "./kategori";

const teks = (min: number, max: number, pesan: string) =>
  z
    .string({ error: pesan })
    .trim()
    .min(min, { error: pesan })
    .max(max, { error: `Terlalu panjang. Paling banyak ${max} huruf.` });

const opsional = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Terlalu panjang. Paling banyak ${max} huruf.` })
    .optional()
    .transform((v) => v || null);

const adaKontakPribadi = (s: string) => /\+?\d[\d\s().-]{7,}\d/.test(s) || /[^\s@]+@[^\s@]+\.[^\s@]+/.test(s);
const PESAN_TANPA_KONTAK = "Jangan menulis nomor HP atau surel di sini. Ada kolom sendiri untuk itu.";

const kontakWarga = (pesan: string) =>
  z.string({ error: pesan }).trim().max(120, { error: pesan }).refine(kontakSah, { error: pesan });

const benar = (pesan: string) => z.literal(true, { error: pesan });

/** Honeypot: kolom tersembunyi yang hanya diisi robot. */
export const adaHoneypot = (badan: unknown) =>
  typeof badan === "object" && badan !== null && Boolean((badan as { situs_web?: unknown }).situs_web);

export const SkemaRekomendasi = z
  .object({
    nama_tukang: teks(2, 80, "Tulis nama tukang atau nama usahanya.").refine((s) => !adaKontakPribadi(s), {
      error: PESAN_TANPA_KONTAK,
    }),
    jasa: z.enum(SLUG_JASA, { error: "Pilih jenis jasanya." }),
    area_kecamatan: z
      .array(z.enum(KECAMATAN), { error: "Pilih minimal satu kecamatan." })
      .min(1, { error: "Pilih minimal satu kecamatan." })
      .max(KECAMATAN.length),
    area_catatan: opsional(120),
    panggilan: z.boolean().optional().default(false),
    cara_hubungi: teks(3, 120, "Tulis cara menghubunginya: nomor WA, kios, atau akun usaha."),
    kapan_dipakai: z
      .string({ error: "Isi kapan terakhir memakai jasanya." })
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/, { error: "Isi kapan terakhir memakai jasanya." })
      .refine((v) => v >= "1990-01" && v <= new Date(Date.now() + 864e5).toISOString().slice(0, 7), {
        error: "Bulannya belum terjadi, atau terlalu lama.",
      }),
    cerita: teks(20, 600, "Ceritakan singkat, minimal satu kalimat.").refine((s) => !adaKontakPribadi(s), {
      error: PESAN_TANPA_KONTAK,
    }),
    tag: z.array(z.enum(TAG_REKOMENDASI)).max(TAG_REKOMENDASI.length).optional().default([]),
    kontak_perekomendasi: kontakWarga("Tulis nomor HP atau surel Anda yang benar. Tidak akan ditampilkan."),
    bukan_pemilik: benar("Centang ini. Tukang tidak bisa merekomendasikan dirinya sendiri."),
    setuju: benar("Centang persetujuan dulu."),
  })
  .superRefine((v, ctx) => {
    if (normalKontak(v.kontak_perekomendasi) === normalKontak(v.cara_hubungi)) {
      ctx.addIssue({
        code: "custom",
        path: ["kontak_perekomendasi"],
        message: "Kontak Anda sama dengan kontak tukang. Tukang tidak bisa merekomendasikan dirinya sendiri.",
      });
    }
  });
export type InputRekomendasi = z.output<typeof SkemaRekomendasi>;

const idTukang = z.uuid({ error: "Entri tidak dikenal." });

export const SkemaSinyal = z.object({ tukang_id: idTukang, jenis: z.enum(["masih_buka", "sudah_pindah"]) });

export const SkemaLaporan = z.object({
  tukang_id: idTukang,
  alasan: teks(5, 500, "Tulis masalahnya, satu kalimat cukup."),
});

export const SkemaKoreksi = z
  .object({
    jenis: z.enum(JENIS_KOREKSI.map((j) => j.nilai) as [string, ...string[]], { error: "Pilih jenis koreksinya." }),
    tempat_id: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => v || null),
    tukang_id: idTukang
      .optional()
      .nullable()
      .transform((v) => v ?? null),
    isi: teks(10, 1500, "Tulis yang perlu dibetulkan, minimal satu kalimat."),
    kontak: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => v || null),
    setuju: z.boolean().optional().default(false),
  })
  .superRefine((v, ctx) => {
    const soalDataPribadi = v.jenis === "hapus_data" || v.jenis === "koreksi_data_pribadi";
    if (soalDataPribadi && !v.kontak) {
      ctx.addIssue({
        code: "custom",
        path: ["kontak"],
        message: "Permintaan soal data pribadi butuh kontak, supaya kami bisa memastikan itu memang data Anda.",
      });
    }
    if (v.kontak && !kontakSah(v.kontak)) {
      ctx.addIssue({ code: "custom", path: ["kontak"], message: "Tulis nomor HP atau surel yang benar." });
    }
    if (v.kontak && !v.setuju) {
      ctx.addIssue({ code: "custom", path: ["setuju"], message: "Centang persetujuan kalau meninggalkan kontak." });
    }
  });
export type InputKoreksi = z.output<typeof SkemaKoreksi>;

export const SkemaFoto = z.object({
  judul: teks(3, 120, "Tulis judul atau isi fotonya."),
  lokasi: teks(2, 120, "Tulis lokasi fotonya, kira-kira juga boleh."),
  perkiraan_tahun: teks(2, 40, 'Tulis perkiraan tahunnya. Boleh "sekitar 1990-an".'),
  cerita: opsional(800),
  kredit: teks(2, 80, "Tulis nama untuk kredit foto."),
  kontak: kontakWarga("Tulis nomor HP atau surel yang benar. Tidak akan ditampilkan."),
  punya_hak: benar("Centang ini kalau foto ini milik Anda atau Anda berhak membagikannya."),
  izin_tampil: benar("Centang izin tampil dulu."),
});
export type InputFoto = z.output<typeof SkemaFoto>;

const id = z.string().min(1).max(120);

/** Semua tindakan moderator. Di-parse ulang di server, jadi aksi yang tidak dikenal ditolak. */
export const SkemaAksi = z.discriminatedUnion("aksi", [
  z.object({ aksi: z.literal("setujui_rekomendasi"), id }),
  z.object({ aksi: z.literal("tolak_rekomendasi"), id }),
  z.object({ aksi: z.literal("hapus_rekomendasi"), id }),
  z.object({ aksi: z.literal("setujui_tukang"), id }),
  z.object({ aksi: z.literal("tolak_tukang"), id }),
  z.object({ aksi: z.literal("hapus_tukang"), id }),
  z.object({
    aksi: z.literal("catat_izin"),
    id,
    kontak_boleh_tampil: z.boolean(),
    catatan: z.string().trim().max(300).optional().default(""),
  }),
  z.object({ aksi: z.literal("cabut_izin"), id }),
  z.object({ aksi: z.literal("tandai_dicek"), id }),
  z.object({ aksi: z.literal("gabungkan"), id, ke: id }),
  z.object({ aksi: z.literal("tinjau_laporan"), id, tampilkan_lagi: z.boolean() }),
  z.object({ aksi: z.literal("selesai_koreksi"), id }),
  z.object({ aksi: z.literal("hapus_data_pengirim"), id }),
  z.object({ aksi: z.literal("selesai_foto"), id }),
]);
export type AksiModerasi = z.output<typeof SkemaAksi>;

export const SkemaMasuk = z.object({
  email: z.string().trim().max(200).optional(),
  kata_sandi: z.string().min(1).max(200),
});

/** { kolom: pesan pertama } untuk ditampilkan di formulir. */
export function galatPerKolom(galat: z.ZodError): Record<string, string> {
  const hasil: Record<string, string> = {};
  for (const g of galat.issues) {
    const kolom = String(g.path[0] ?? "_");
    if (!hasil[kolom]) hasil[kolom] = g.message;
  }
  return hasil;
}
