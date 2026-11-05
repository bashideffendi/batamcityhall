// Membuat features/hari-ini/kecamatan-peta.json: poligon 12 kecamatan Batam yang sudah diproyeksikan ke bingkai
// Peta Hari Ini (PEDOMAN 5.1), desktop dan ponsel. Sumber: features/langit-laut/lib/kecamatan-geo.json (BIG).
//   node scripts/build-peta-hari-ini.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const geo = JSON.parse(readFileSync(join(ROOT, "features/langit-laut/lib/kecamatan-geo.json"), "utf8"));

const BINGKAI = {
  desktop: { w: 760, h: 780, lon: [103.8, 104.26], lat: [0.7703, 1.2424] },
  ponsel: { w: 358, h: 400, lon: [103.84, 104.16], lat: [0.895, 1.2525] },
};
const bulat = (v) => Math.round(v * 10) / 10;

function bagi(b) {
  const hasil = {};
  const titik = ([lon, lat]) => [
    bulat(((lon - b.lon[0]) / (b.lon[1] - b.lon[0])) * b.w),
    bulat(((b.lat[1] - lat) / (b.lat[1] - b.lat[0])) * b.h),
  ];
  for (const f of geo.features.filter((x) => x.properties.kab === "Batam")) {
    const cincin = f.geometry.coordinates
      .map((poly) => poly[0].map(titik))
      // Pulau yang seluruhnya di luar bingkai tidak perlu digambar; yang lebih kecil dari satu piksel juga tidak.
      .filter((r) => r.some(([x, y]) => x >= 0 && x <= b.w && y >= 0 && y <= b.h))
      .filter((r) => {
        const xs = r.map((p) => p[0]);
        const ys = r.map((p) => p[1]);
        return Math.max(...xs) - Math.min(...xs) > 1 || Math.max(...ys) - Math.min(...ys) > 1;
      });
    const d = cincin
      .map((r) => {
        const rapi = r.filter((p, i) => i === 0 || p[0] !== r[i - 1][0] || p[1] !== r[i - 1][1]);
        return `M${rapi.map((p) => p.join(" ")).join("L")}Z`;
      })
      .join("");
    const [lat, lon] = f.properties.label;
    hasil[f.properties.name] = { d, label: titik([lon, lat]) };
  }
  return hasil;
}

const keluar = { desktop: bagi(BINGKAI.desktop), ponsel: bagi(BINGKAI.ponsel) };
const p = join(ROOT, "features/hari-ini/kecamatan-peta.json");
writeFileSync(p, `${JSON.stringify(keluar)}\n`);
console.log("ditulis", p, JSON.stringify(keluar).length, "byte");
