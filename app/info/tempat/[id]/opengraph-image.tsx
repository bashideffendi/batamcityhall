import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  adalahTerbuka,
  labelSub,
  lokasiTeks,
  namaKategori,
  punyaHalaman,
  TEMPAT,
  tempatPerId,
} from "@/features/direktori/data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = "Kartu tempat Barelang.co";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Kartu tempat dari data terbuka dibuat saat pertama dibagikan, bukan saat build. Id yang tidak dikenal mendapat
// kartu bernama situs (lihat p?.nama di bawah).
export const dynamicParams = true;

export function generateStaticParams() {
  return TEMPAT.filter((p) => punyaHalaman(p) && !adalahTerbuka(p)).map((p) => ({ id: p.id }));
}

const huruf = (paket: string, berkas: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", paket, "files", berkas));

// Kartu label museum yang muncul saat tautan dibagikan ke WhatsApp. Warna dari token siang.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const p = tempatPerId.get((await params).id);
  const [serif, sans] = await Promise.all([
    huruf("newsreader", "newsreader-latin-600-normal.woff"),
    huruf("plus-jakarta-sans", "plus-jakarta-sans-latin-500-normal.woff"),
  ]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#FFFFFF",
        color: "#161616",
        fontFamily: "Plus Jakarta Sans",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#5A564E" }}>
        <span>{p ? namaKategori(p.kategori) : ""}</span>
        <span>{p ? labelSub(p.subkategori) : ""}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "Newsreader", fontSize: 76, lineHeight: 1.1 }}>{p?.nama ?? SITE_NAME}</div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#4E6A7A" }}>{p ? lokasiTeks(p) : ""}</div>
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #161616",
          paddingTop: 20,
          fontSize: 26,
          justifyContent: "space-between",
        }}
      >
        <span>{SITE_NAME}</span>
        <span>{SITE_TAGLINE}</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, weight: 600, style: "normal" },
        { name: "Plus Jakarta Sans", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
