// Arsip Portal Satu Data BP Batam (data.bpbatam.go.id, CKAN 2.11).
//   node scripts/dataset/bpbatam-data.mjs
// robots.txt melarang /api/, /dataset/rate/, /revision/, /dataset/*/history, dengan Crawl-Delay 10.
// Yang dipakai hanya halaman katalog HTML dan tautan "Unduh" resmi (/datastore/dump/{id} atau berkas unggahan).
// Jeda 10,5 detik per permintaan. Kolom maintainer/author tidak disimpan.
import { ada, ambil, baca, hariIni, simpan, terlarang } from "./sopan.mjs";

const HOST = "https://data.bpbatam.go.id";
const DIR = "bpbatam-data";
const JEDA = 10500;
const MAKS_BYTE = 25 * 1024 * 1024;
// Kolom yang menandakan data pribadi. Isi berkas seperti ini tidak disimpan.
const KOLOM_PRIBADI = /\b(nik|nip|no_?ktp|no_?hp|telepon|telp|email|nama_?pegawai|nama_?pasien)\b/i;

const teks = async (url) => {
  const r = await ambil(url, { jedaMs: JEDA });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.text();
};
const hapusTag = (s) =>
  s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function daftarSlug() {
  const slug = new Set();
  for (let hal = 1; hal <= 20; hal++) {
    const html = await teks(`${HOST}/dataset/?page=${hal}`);
    const baru = [...html.matchAll(/href="\/dataset\/([a-z0-9][a-z0-9_-]*)"/g)].map((m) => m[1]);
    const sebelum = slug.size;
    for (const s of baru) slug.add(s);
    if (slug.size === sebelum) break;
  }
  return [...slug];
}

function uraiDataset(html, slug) {
  const judul = hapusTag(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? slug);
  const organisasi =
    hapusTag(
      /<section class="module module-narrow[^"]*">[\s\S]*?<h1 class="heading">([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "",
    ) || null;
  const resource = [];
  for (const m of html.matchAll(/\/dataset\/[^"]+\/resource\/([0-9a-f-]{36})/g))
    if (!resource.includes(m[1])) resource.push(m[1]);
  const dump = new Set([...html.matchAll(/\/datastore\/dump\/([0-9a-f-]{36})/g)].map((m) => m[1]));
  const unggahan = [
    ...html.matchAll(
      /href="(https?:\/\/data\.bpbatam\.go\.id\/dataset\/[^"]+\/resource\/[0-9a-f-]{36}\/download\/[^"]+)"/g,
    ),
  ].map((m) => m[1]);
  const lisensi = /No License Provided/i.test(html) ? "No License Provided" : null;
  return { judul, organisasi, resource, dump: [...dump], unggahan: [...new Set(unggahan)], lisensi };
}

const slugs = await daftarSlug();
console.log(`katalog: ${slugs.length} dataset`);
const manifest = [];
for (const slug of slugs) {
  let info;
  try {
    info = uraiDataset(await teks(`${HOST}/dataset/${slug}`), slug);
  } catch (e) {
    manifest.push({ slug, status: `galat_halaman ${e.message}` });
    continue;
  }
  const dasar = {
    slug,
    judul: info.judul,
    organisasi: info.organisasi,
    lisensi: info.lisensi,
    halaman: `${HOST}/dataset/${slug}`,
  };
  if (terlarang(info.judul)) {
    manifest.push({ ...dasar, status: "disaring_pajak" });
    continue;
  }
  const sumber = [
    ...info.dump.map((id) => ({ id, url: `${HOST}/datastore/dump/${id}`, nama: `${id}.csv` })),
    ...info.unggahan
      .filter((u) => !info.dump.some((id) => u.includes(id)))
      .map((u) => ({
        id: /resource\/([0-9a-f-]{36})/.exec(u)[1],
        url: u,
        nama: decodeURIComponent(u.split("/").pop()),
      })),
  ];
  for (const s of sumber) {
    const berkas = `${DIR}/${slug}/${s.nama}`;
    if (ada(berkas)) {
      manifest.push({ ...dasar, resource_id: s.id, url: s.url, status: "sudah_ada", berkas });
      continue;
    }
    const r = await ambil(s.url, { jedaMs: JEDA, batasMs: 120000 }).catch(() => null);
    if (!r?.ok) {
      manifest.push({ ...dasar, resource_id: s.id, url: s.url, status: `http_${r?.status ?? "galat"}` });
      continue;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > MAKS_BYTE) {
      manifest.push({ ...dasar, resource_id: s.id, url: s.url, status: "terlalu_besar", byte: buf.length });
      continue;
    }
    const kepala = buf.subarray(0, 4096).toString("utf8").split(/\r?\n/)[0] ?? "";
    if (KOLOM_PRIBADI.test(kepala)) {
      manifest.push({
        ...dasar,
        resource_id: s.id,
        url: s.url,
        status: "disaring_data_pribadi",
        kolom: kepala.slice(0, 300),
      });
      continue;
    }
    manifest.push({
      ...dasar,
      resource_id: s.id,
      url: s.url,
      status: "diunduh",
      diakses: hariIni(),
      ...simpan(berkas, buf),
    });
  }
  if (!sumber.length) manifest.push({ ...dasar, status: "tanpa_unduhan" });
}
const lama = ada(`${DIR}/_manifest.json`) ? JSON.parse(baca(`${DIR}/_manifest.json`)) : [];
const aksesLama = new Map(lama.map((m) => [m.resource_id, m.diakses]));
for (const m of manifest) if (!m.diakses && m.resource_id) m.diakses = aksesLama.get(m.resource_id) ?? null;
simpan(`${DIR}/_manifest.json`, JSON.stringify(manifest, null, 1));
console.log(
  "selesai",
  manifest.reduce((a, m) => ((a[m.status.split(" ")[0]] = (a[m.status.split(" ")[0]] ?? 0) + 1), a), {}),
);
