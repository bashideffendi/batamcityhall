// Ekstrak area Batam dari build harian Protomaps menjadi satu berkas PMTiles, memakai library
// npm `pmtiles` (tanpa binary tambahan). Padanan perintah resmi:
//   pmtiles extract https://build.protomaps.com/<YYYYMMDD>.pmtiles batam.pmtiles \
//     --bbox=103.55,0.45,104.75,1.5 --maxzoom=15
//
// Pakai:  node scripts/extract-basemap.mjs [YYYYMMDD] [maxzoom] [berkas-keluaran]
// Keluaran: public/tiles/batam.pmtiles (di-gitignore; produksi diunggah ke R2).
import { createWriteStream, mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { finished } from "node:stream/promises";
import { gzipSync } from "node:zlib";
import { PMTiles, zxyToTileId } from "pmtiles";

const ROOT = join(import.meta.dirname, "..");
const OUT = process.argv[4] ? resolve(process.argv[4]) : join(ROOT, "public", "tiles", "batam.pmtiles");
// research/00 bagian 9.2: bbox kunci peta.
const BBOX = { w: 103.55, s: 0.45, e: 104.75, n: 1.5 };
const CONCURRENCY = 12;

const pad = (n) => String(n).padStart(2, "0");
const twoDaysAgo = new Date(Date.now() - 2 * 864e5);
const BUILD =
  process.argv[2] ??
  `${twoDaysAgo.getUTCFullYear()}${pad(twoDaysAgo.getUTCMonth() + 1)}${pad(twoDaysAgo.getUTCDate())}`;
const MAX_ZOOM = Number(process.argv[3] ?? 15);

const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const lat2y = (lat, z) => {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
};

const coords = [];
for (let z = 0; z <= MAX_ZOOM; z++) {
  const [x0, x1] = [lon2x(BBOX.w, z), lon2x(BBOX.e, z)];
  const [y0, y1] = [lat2y(BBOX.n, z), lat2y(BBOX.s, z)];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) coords.push({ z, x, y, id: zxyToTileId(z, x, y) });
}
coords.sort((a, b) => a.id - b.id);
console.log(`build ${BUILD}, z0-${MAX_ZOOM}, ${coords.length} kandidat tile`);

const src = new PMTiles(`https://build.protomaps.com/${BUILD}.pmtiles`);
const header = await src.getHeader();
const metadata = await src.getMetadata();

// Tile ditulis ke berkas sementara sesuai urutan id (clustered), jadi unduhan paralel disangga
// dulu dan dilepas berurutan.
mkdirSync(dirname(OUT), { recursive: true });
const tmpData = `${OUT}.data.tmp`;
const stream = createWriteStream(tmpData);
const entries = [];
const ready = new Map();
let nextIdx = 0;
let offset = 0;
let done = 0;
let empty = 0;

function flush() {
  while (ready.has(nextIdx)) {
    const buf = ready.get(nextIdx);
    ready.delete(nextIdx);
    if (buf) {
      entries.push({ tileId: coords[nextIdx].id, offset, length: buf.length, runLength: 1 });
      offset += buf.length;
      stream.write(buf);
    } else empty++;
    nextIdx++;
  }
}

async function fetchTile(c) {
  for (let attempt = 1; ; attempt++) {
    try {
      const r = await src.getZxy(c.z, c.x, c.y);
      return r ? gzipSync(Buffer.from(r.data), { level: 9 }) : null;
    } catch (e) {
      if (attempt >= 6) throw e;
      await new Promise((res) => setTimeout(res, 1500 * attempt));
    }
  }
}

let cursor = 0;
async function worker() {
  while (cursor < coords.length) {
    const i = cursor++;
    ready.set(i, await fetchTile(coords[i]));
    flush();
    if (++done % 500 === 0) console.log(`${done}/${coords.length} (${(offset / 1e6).toFixed(1)} MB)`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
stream.end();
await finished(stream);

// ---- Serialisasi PMTiles v3 ----
function varint(arr, n) {
  while (n >= 128) {
    arr.push((n % 128) | 128);
    n = Math.floor(n / 128);
  }
  arr.push(n);
}
function serializeDir(list) {
  const out = [];
  varint(out, list.length);
  let last = 0;
  for (const e of list) {
    varint(out, e.tileId - last);
    last = e.tileId;
  }
  for (const e of list) varint(out, e.runLength);
  for (const e of list) varint(out, e.length);
  list.forEach((e, i) => {
    const contiguous = i > 0 && e.offset === list[i - 1].offset + list[i - 1].length;
    varint(out, contiguous ? 0 : e.offset + 1);
  });
  return gzipSync(Buffer.from(out), { level: 9 });
}

const HEADER_LEN = 127;
const ROOT_MAX = 16384 - HEADER_LEN;
let rootDir = serializeDir(entries);
let leaves = Buffer.alloc(0);
if (rootDir.length > ROOT_MAX) {
  for (let leafSize = 4096; ; leafSize *= 2) {
    const parts = [];
    const rootEntries = [];
    let pos = 0;
    for (let i = 0; i < entries.length; i += leafSize) {
      const chunk = entries.slice(i, i + leafSize);
      const ser = serializeDir(chunk);
      rootEntries.push({ tileId: chunk[0].tileId, offset: pos, length: ser.length, runLength: 0 });
      parts.push(ser);
      pos += ser.length;
    }
    const r = serializeDir(rootEntries);
    if (r.length <= ROOT_MAX) {
      rootDir = r;
      leaves = Buffer.concat(parts);
      break;
    }
  }
}

const meta = gzipSync(Buffer.from(JSON.stringify({ ...metadata, description: `Batam dari Protomaps ${BUILD}` })));
const rootOff = HEADER_LEN;
const metaOff = rootOff + rootDir.length;
const leafOff = metaOff + meta.length;
const dataOff = leafOff + leaves.length;

const h = Buffer.alloc(HEADER_LEN);
h.write("PMTiles", 0, "ascii");
h.writeUInt8(3, 7);
const u64 = (o, v) => h.writeBigUInt64LE(BigInt(v), o);
u64(8, rootOff);
u64(16, rootDir.length);
u64(24, metaOff);
u64(32, meta.length);
u64(40, leafOff);
u64(48, leaves.length);
u64(56, dataOff);
u64(64, offset);
u64(72, entries.length);
u64(80, entries.length);
u64(88, entries.length);
h.writeUInt8(1, 96); // clustered
h.writeUInt8(2, 97); // internal: gzip
h.writeUInt8(2, 98); // tile: gzip
h.writeUInt8(1, 99); // mvt
h.writeUInt8(0, 100);
h.writeUInt8(MAX_ZOOM, 101);
const e7 = (o, v) => h.writeInt32LE(Math.round(v * 1e7), o);
e7(102, BBOX.w);
e7(106, BBOX.s);
e7(110, BBOX.e);
e7(114, BBOX.n);
h.writeUInt8(10, 118);
e7(119, 104.03);
e7(123, 1.05);

// Gabung: kepala + direktori + metadata + daun + data tile.
const { createReadStream } = await import("node:fs");
const finalTmp = `${OUT}.tmp`;
const final = createWriteStream(finalTmp);
for (const b of [h, rootDir, meta, leaves]) final.write(b);
await new Promise((res, rej) => createReadStream(tmpData).on("error", rej).on("end", res).pipe(final, { end: false }));
final.end();
await finished(final);
renameSync(finalTmp, OUT);
const { rmSync } = await import("node:fs");
rmSync(tmpData);
writeFileSync(join(dirname(OUT), "BUILD.txt"), `${BUILD}\n`);
console.log(
  `selesai: ${entries.length} tile, ${empty} kosong, ${((dataOff + offset) / 1e6).toFixed(1)} MB, sumber header z${header.minZoom}-${header.maxZoom}`,
);
