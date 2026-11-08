// Arsip Satu Data Provinsi Kepulauan Riau: katalog dan isi tabel dataset yang dirinci per kabupaten/kota.
//   node scripts/dataset/satudata-kepri.mjs
// robots.txt portal melarang semua path /data (termasuk unduhan XLSX). Yang dipakai hanya API di /api:
//   GET /api/3/action/package_search   katalog
//   GET /api/datastore/{resource_id}   isi tabel sebagai JSON
// Batas server 120 permintaan per menit; skrip memakai jeda 1,5 detik.
import { ada, ambil, baca, hariIni, simpan, terlarang } from "./sopan.mjs";

const HOST = "https://satudata.kepriprov.go.id";
const DIR = "satudata-kepri";
const JEDA = 1500;
// Judul yang menyebut rincian per kabupaten/kota atau Batam. Indikator tingkat provinsi tidak berguna untuk situs kota.
const PER_KOTA = /kabupaten|kab\/kota|kabkota|kab\.\/kota|kota batam|\bbatam\b/i;

async function katalog() {
  const semua = [];
  for (let start = 0; ; start += 1000) {
    const r = await ambil(`${HOST}/api/3/action/package_search?q=&rows=1000&start=${start}`, { jedaMs: JEDA });
    if (!r.ok) throw new Error(`katalog: HTTP ${r.status}`);
    const j = await r.json();
    semua.push(...j.result.results);
    if (semua.length >= j.result.count || !j.result.results.length) break;
  }
  const bersih = semua.filter((p) => !terlarang(p.title));
  simpan(`${DIR}/_katalog.json`, JSON.stringify(bersih));
  return bersih;
}

const paket = await katalog();
const pilih = paket.filter((p) => PER_KOTA.test(`${p.title} ${p.notes ?? ""}`));
console.log(`katalog: ${paket.length} dataset, ${pilih.length} dirinci per kabupaten/kota atau menyebut Batam`);

const manifest = [];
for (const p of pilih) {
  for (const res of p.resources ?? []) {
    const dasar = {
      judul: p.title,
      sumber_daya: res.name ?? null,
      produsen: p.organization?.title ?? null,
      grup: (p.groups ?? []).map((g) => g.title),
      diperbarui: p.metadata_modified ?? null,
      lisensi: p.license_title ?? null,
      halaman: `${HOST}/katalogdata/rincian?id=${p.name}`,
      resource_id: res.id,
    };
    const berkas = `${DIR}/tabel/${p.name}--${res.id}.json`;
    if (!res.datastore_active) {
      manifest.push({ ...dasar, status: "tanpa_datastore" });
      continue;
    }
    if (ada(berkas)) {
      manifest.push({ ...dasar, status: "sudah_ada", berkas });
      continue;
    }
    const r = await ambil(`${HOST}/api/datastore/${res.id}`, { jedaMs: JEDA }).catch(() => null);
    if (!r?.ok) {
      manifest.push({ ...dasar, status: `http_${r?.status ?? "galat"}` });
      continue;
    }
    const teks = await r.text();
    const batam = /batam|21\.71/i.test(teks);
    manifest.push({ ...dasar, status: "diunduh", memuat_batam: batam, diakses: hariIni(), ...simpan(berkas, teks) });
  }
}
const lama = ada(`${DIR}/_manifest.json`) ? JSON.parse(baca(`${DIR}/_manifest.json`)) : [];
const aksesLama = new Map(lama.map((m) => [m.resource_id, m.diakses]));
for (const m of manifest) if (!m.diakses) m.diakses = aksesLama.get(m.resource_id) ?? null;
simpan(`${DIR}/_manifest.json`, JSON.stringify(manifest, null, 1));
const hitung = manifest.reduce((a, m) => ((a[m.status] = (a[m.status] ?? 0) + 1), a), {});
console.log("selesai", hitung, "memuat Batam:", manifest.filter((m) => m.memuat_batam).length);
