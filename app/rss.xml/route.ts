import { semuaInfografik, semuaTulisan } from "@/features/konten/baca";
import { umpanRss } from "@/features/konten/rss";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Tulisan dari dashboard ikut masuk, jadi umpan disusun ulang paling lama tiap 5 menit, sama dengan halaman Jurnal.
export const revalidate = 300;

export async function GET() {
  const [tulisan, infografik] = await Promise.all([semuaTulisan(), semuaInfografik()]);
  const isi = umpanRss({
    judul: `${SITE_NAME}: Jurnal dan Infografik`,
    deskripsi: "Tulisan dan infografik terbaru tentang Kota Batam.",
    situs: SITE_URL,
    alamatUmpan: "/rss.xml",
    item: [
      ...tulisan.map((t) => ({
        judul: t.judul,
        ringkasan: t.ringkasan,
        tanggal: t.tanggal,
        alamat: `/jurnal/${t.slug}`,
        rubrik: t.rubrik,
      })),
      ...infografik.map((i) => ({
        judul: i.judul,
        ringkasan: i.ringkasan,
        tanggal: i.tanggal,
        alamat: `/infografik/${i.slug}`,
        rubrik: "Infografik",
      })),
    ],
  });
  return new Response(isi, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
