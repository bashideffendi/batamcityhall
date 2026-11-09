// Tangkap layar halaman situs dengan semua /api/* ditiru, supaya pemeriksaan tampilan tidak memanggil MSS, BMKG,
// Open-Meteo, atau feed berita. Jalankan saat server uji hidup:
//   node tools/grafis/tangkap-layar.mjs <url-dasar> <folder-keluaran> [alamat ...]
// Hasil: <folder>/<nama>-desktop.png (1440x900) dan <nama>-ponsel.png (390x844), layar pertama saja.
import { chromium, devices } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const [dasar = "http://localhost:3102", keluar = "tangkapan", ...alamat] = process.argv.slice(2);
const daftar = alamat.length ? alamat : ["/", "/cuaca", "/info/direktori/kuliner"];
mkdirSync(keluar, { recursive: true });

const tiru = (route) => {
  const url = route.request().url();
  if (url.includes("/api/frames")) return route.fulfill({ json: { frames: [], stale: true, echo: null } });
  if (url.includes("/api/perairan")) return route.fulfill({ json: { warns: [] } });
  if (url.includes("/api/gempa")) return route.fulfill({ json: { status: "ok", diambil: "", gempa: [] } });
  if (url.includes("/api/peringatan-cuaca")) return route.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } });
  if (url.includes("/api/berita")) return route.fulfill({ json: { item: [], sumber: [] } });
  return route.fulfill({ status: 503, json: {} });
};

const browser = await chromium.launch();
for (const [jenis, opsi] of [
  ["desktop", { viewport: { width: 1440, height: 900 } }],
  ["ponsel", { ...devices["iPhone 13"] }],
]) {
  const ctx = await browser.newContext(opsi);
  await ctx.route("**/api/**", tiru);
  const page = await ctx.newPage();
  for (const a of daftar) {
    await page.goto(dasar + a, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const nama = a === "/" ? "beranda" : a.replace(/^\//, "").replace(/\//g, "-");
    const berkas = join(keluar, `${nama}-${jenis}.png`);
    await page.screenshot({ path: berkas });
    console.log(berkas);
  }
  await ctx.close();
}
await browser.close();
