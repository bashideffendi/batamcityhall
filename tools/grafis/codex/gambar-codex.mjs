// Buat gambar lewat Codex CLI (permintaan pemilik 16 Nov 2026: gambar kartu dan ikon dirancang dengan Codex).
//   GAYA_FILE=tools/grafis/codex/gaya-sketsa.txt node tools/grafis/codex/gambar-codex.mjs <manifes.json> <folder-keluar> [jumlah-bersamaan]
// Berhenti dengan pesan "usage limit" di berkas .log berarti kuota Codex habis: ulangi setelah kuota pulih.
// Manifest: [{ nama, rasio: "1:1" | "3:2" | "16:10", isi }]. Hasil: <folder-keluar>/<nama>.png. Yang sudah ada dilewati.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [manifes, keluar, bersamaan = "3"] = process.argv.slice(2);
const daftar = JSON.parse(readFileSync(manifes, "utf8"));
mkdirSync(keluar, { recursive: true });

const UKURAN = { "1:1": "square 1:1, about 1024x1024", "3:2": "landscape 3:2, about 1536x1024", "16:10": "landscape 3:2, about 1536x1024" };

// Gaya mengikuti contoh pemilik (16 Nov 2026): ilustrasi lukis tangan yang detail, objek berdiri sendiri di latar polos.
const GAYA_BAWAAN = [
  "Style: a richly detailed hand-drawn editorial illustration, like high-quality anime food and background art:",
  "fine dark-brown ink linework with delicate hatching, painted with watercolour and gouache, warm natural light,",
  "crisp small highlights, appetising saturated colours, lots of small believable detail, slightly top-down three-quarter view.",
  "The subject stands alone, centred, with generous empty margin around it, on a plain pure white background (#FFFFFF) with only a faint soft contact shadow.",
  "Strictly no text, no letters, no numbers, no captions, no watermark, no signature, no logos, no flags, no people, no faces, no hands.",
  "No frame, no border, no background scenery beyond what the subject description asks for.",
  "The entire subject must fit fully inside the frame with clear empty white margin on all four sides; nothing may touch or be cut off by the image edge.",
].join(" ");
// GAYA_FILE: berkas teks berisi uraian gaya pengganti.
const GAYA = process.env.GAYA_FILE ? readFileSync(process.env.GAYA_FILE, "utf8").trim() : GAYA_BAWAAN;

function perintah(b) {
  return [
    `Generate ONE image with your built-in image generation tool and save it in the current directory as ${b.nama}.png (PNG, ${UKURAN[b.rasio] ?? UKURAN["1:1"]}).`,
    `Subject: ${b.isi}`,
    GAYA,
    "Do not use any fallback script or API CLI; use only the built-in image generation tool. Do not create or modify any other file. When done, print only the saved file path.",
  ].join("\n\n");
}

function jalankan(b) {
  return new Promise((selesai) => {
    const tujuan = join(keluar, `${b.nama}.png`);
    if (existsSync(tujuan)) return selesai({ nama: b.nama, ok: true, lewat: true });
    const mulai = Date.now();
    const p = spawn("codex", ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", `"${keluar}"`, "-"], {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let log = "";
    p.stdout.on("data", (d) => (log += d));
    p.stderr.on("data", (d) => (log += d));
    const batas = setTimeout(() => p.kill(), 9 * 60 * 1000);
    p.on("close", (kode) => {
      clearTimeout(batas);
      writeFileSync(join(keluar, `${b.nama}.log`), log);
      const ok = existsSync(tujuan);
      console.log(`${ok ? "ok   " : "GAGAL"} ${b.nama} (${Math.round((Date.now() - mulai) / 1000)} dtk, kode ${kode})`);
      selesai({ nama: b.nama, ok });
    });
    p.stdin.end(perintah(b));
  });
}

const antre = [...daftar];
const hasil = [];
await Promise.all(
  Array.from({ length: Number(bersamaan) }, async () => {
    while (antre.length) hasil.push(await jalankan(antre.shift()));
  }),
);
const gagal = hasil.filter((h) => !h.ok).map((h) => h.nama);
console.log(`selesai: ${hasil.length - gagal.length} dari ${hasil.length}${gagal.length ? `, gagal: ${gagal.join(", ")}` : ""}`);
