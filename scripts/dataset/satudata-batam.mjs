// Arsip Satu Data Kota Batam: katalog DCAT, isi JSON setiap dataset, titik fasilitas, dan poligon kecamatan.
//   node scripts/dataset/satudata-batam.mjs            semua (lanjut dari yang belum ada)
//   node scripts/dataset/satudata-batam.mjs --katalog  hanya katalog
// Portal tidak memiliki robots.txt dan API-nya terbuka tanpa login (riset 8 Nov 2026). Jeda 3 detik per permintaan.
// Setiap unduhan menaikkan penghitung "Jumlah di Download" di portal, jadi berkas yang sudah ada tidak diambil lagi.
import { ada, ambil, baca, hariIni, simpan, terlarang } from "./sopan.mjs";

const HOST = "https://satudata.batam.go.id";
const DIR = "satudata-batam";
const hanyaKatalog = process.argv.includes("--katalog");

const slugDari = (url) => decodeURIComponent(new URL(url).pathname.split("/").pop());

// Entri pajak tidak pernah disimpan, termasuk di katalog arsip.
const tanpaPajak = (d) => ({ ...d, dataset: d.dataset.filter((x) => !terlarang(x.title)) });

async function katalog() {
  const r = await ambil(`${HOST}/data/apisplp/apinasional/splp`).catch(() => null);
  if (r?.ok) {
    const d = tanpaPajak(JSON.parse(await r.text()));
    simpan(`${DIR}/_dcat.json`, JSON.stringify(d));
    return d.dataset;
  }
  // Portal sempat masuk pemeliharaan (503, 9 Nov 2026 dini hari). Katalog lama tetap bisa dipakai.
  if (!ada(`${DIR}/_dcat.json`)) throw new Error(`katalog: HTTP ${r?.status ?? "tidak terjangkau"}`);
  console.log(`katalog: portal menjawab ${r?.status ?? "tidak terjangkau"}, memakai katalog arsip`);
  return JSON.parse(baca(`${DIR}/_dcat.json`)).dataset;
}

async function isiDataset(ds) {
  const json = (ds.distribution ?? []).find((d) => /\/data\/json\//.test(d.downloadURL ?? ""));
  if (!json) return { status: "tanpa_json" };
  const slug = slugDari(json.downloadURL);
  const berkas = `${DIR}/json/${slug}.json`;
  if (ada(berkas)) return { status: "sudah_ada", berkas, slug };
  const r = await ambil(json.downloadURL);
  if (!r.ok) return { status: `http_${r.status}`, slug };
  const teks = await r.text();
  try {
    JSON.parse(teks);
  } catch {
    return { status: "bukan_json", slug };
  }
  return { status: "diunduh", slug, ...simpan(berkas, teks) };
}

// Titik fasilitas dan poligon kecamatan: endpoint peta portal.
async function peta() {
  if (!ada(`${DIR}/peta/geospasial.json`)) {
    const r = await ambil(`${HOST}/data/home/select2-geospasial`, {
      init: { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: "searchTerm=" },
    });
    if (r.ok) simpan(`${DIR}/peta/geospasial.json`, await r.text());
  }
  if (!ada(`${DIR}/peta/kecamatan.js`)) {
    const r = await ambil(`${HOST}/data/frontend/lumia/js/kecamatan.js`);
    if (r.ok) simpan(`${DIR}/peta/kecamatan.js`, await r.text());
  }
}

const daftar = await katalog();
console.log(`katalog: ${daftar.length} dataset`);
if (!hanyaKatalog) {
  await peta();
  const manifest = [];
  let n = 0;
  for (const ds of daftar) {
    n++;
    const dasar = {
      judul: ds.title,
      tema: ds.theme ?? null,
      produsen: ds.publisher?.name ?? null,
      terbit: ds.issued ?? null,
      halaman: ds.landingPage ?? null,
      id: ds.identifier ?? null,
    };
    if (terlarang(ds.title)) {
      manifest.push({ ...dasar, status: "disaring_pajak" });
      continue;
    }
    let hasil;
    try {
      hasil = await isiDataset(ds);
    } catch (e) {
      hasil = { status: `galat_${e.name}` };
    }
    manifest.push({ ...dasar, ...hasil, diakses: hasil.status === "diunduh" ? hariIni() : undefined });
    if (n % 25 === 0) console.log(`${n}/${daftar.length}`);
  }
  // Manifest lama dipertahankan tanggal aksesnya untuk berkas yang tidak diunduh ulang.
  const lama = ada(`${DIR}/_manifest.json`) ? JSON.parse(baca(`${DIR}/_manifest.json`)) : [];
  const aksesLama = new Map(lama.map((m) => [m.slug, m.diakses]));
  for (const m of manifest) if (!m.diakses && m.slug) m.diakses = aksesLama.get(m.slug) ?? null;
  simpan(`${DIR}/_manifest.json`, JSON.stringify(manifest, null, 1));
  const hitung = manifest.reduce((a, m) => ((a[m.status] = (a[m.status] ?? 0) + 1), a), {});
  console.log("selesai", hitung);
}
