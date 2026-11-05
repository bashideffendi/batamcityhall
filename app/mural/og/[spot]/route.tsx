import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { KARTU } from "@/features/mural/data";
import { SITE_NAME } from "@/lib/site";

const huruf = (paket: string, berkas: string) =>
  readFile(join(process.cwd(), "node_modules/@fontsource", paket, "files", berkas));

// Kartu yang muncul saat tautan ?spot= dibagikan ke WhatsApp. Warna dari token siang.
export async function GET(_permintaan: Request, { params }: { params: Promise<{ spot: string }> }) {
  const { spot } = await params;
  const k = KARTU.find((x) => x.id === spot);
  if (!k) return new Response("Tidak ditemukan", { status: 404 });
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
        padding: 72,
        background: "#FFFFFF",
        color: "#161616",
        fontFamily: "Jakarta",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 3, color: "#5A564E" }}>
        {`MODE MURAL, ${k.kicker.toUpperCase()}`}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontFamily: "Serif", fontSize: 72, lineHeight: 1.1 }}>{k.judul}</div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "#4E6A7A" }}>{k.nama}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#5A564E" }}>
        <span>{SITE_NAME}</span>
        <span>Ilustrasi placeholder, bukan posisi tepat</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Serif", data: serif, weight: 600, style: "normal" },
        { name: "Jakarta", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
