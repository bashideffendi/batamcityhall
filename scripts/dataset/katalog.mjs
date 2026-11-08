// Gabungkan manifest semua sumber di dataset-arsip/ menjadi satu katalog:
//   dataset-arsip/katalog.json dan dataset-arsip/KATALOG.csv
//   node scripts/dataset/katalog.mjs
import { ada, baca, simpan } from "./sopan.mjs";

const SUMBER = [
  { id: "satudata-batam", portal: "Satu Data Kota Batam", lisensi: "Tidak dinyatakan (UU KIP, © Hak Cipta)" },
  { id: "satudata-kepri", portal: "Satu Data Provinsi Kepulauan Riau", lisensi: "License not specified" },
  { id: "bpbatam-data", portal: "Portal Satu Data BP Batam", lisensi: "No License Provided" },
  {
    id: "bpbatam-geoportal",
    portal: "Geoportal BP Batam (ArcGIS)",
    lisensi: "Tidak dinyatakan (© BP Batam, All Rights Reserved)",
  },
  { id: "hangjebat", portal: "HANG JEBAT Geoportal (Disperkimtan Kota Batam)", lisensi: "Tidak dinyatakan" },
];

const baris = [];
for (const s of SUMBER) {
  const f = `${s.id}/_manifest.json`;
  if (!ada(f)) continue;
  for (const m of JSON.parse(baca(f))) {
    if (!["diunduh", "sudah_ada"].includes(m.status)) continue;
    baris.push({
      sumber: s.id,
      portal: s.portal,
      judul: m.judul,
      bagian: m.sumber_daya ?? null,
      tema: m.tema ?? m.grup?.join("; ") ?? m.organisasi ?? null,
      produsen: m.produsen ?? m.organisasi ?? null,
      berkas: m.berkas,
      byte: m.byte ?? null,
      jumlah_fitur: m.jumlah_fitur ?? null,
      memuat_batam: m.memuat_batam ?? null,
      halaman: m.halaman ?? m.layanan ?? m.url ?? null,
      diakses: m.diakses ?? null,
      lisensi: m.lisensi ?? s.lisensi,
    });
  }
}
simpan("katalog.json", JSON.stringify(baris, null, 1));
const kolom = Object.keys(baris[0] ?? { sumber: "" });
const sel = (v) =>
  v === null || v === undefined ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
simpan(
  "KATALOG.csv",
  // BOM supaya Excel membaca UTF-8.
  String.fromCharCode(0xfeff) +
    [kolom.join(","), ...baris.map((b) => kolom.map((k) => sel(b[k])).join(","))].join("\n") +
    "\n",
);
const per = baris.reduce((a, b) => ((a[b.sumber] = (a[b.sumber] ?? 0) + 1), a), {});
const total = baris.reduce((a, b) => a + (b.byte ?? 0), 0);
console.log(`katalog: ${baris.length} berkas, ${(total / 1e6).toFixed(1)} MB`, per);
