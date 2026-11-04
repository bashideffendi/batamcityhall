import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { alamatBaruBites, alamatBaruHujan } from "@/lib/redirect-lama";

const baca = (p: string) => readFileSync(join(process.cwd(), "deploy/situs-lama", p), "utf8");

describe("peta redirect", () => {
  it("hujandibatam membawa parameter", () => {
    expect(alamatBaruHujan("/", "?mode=ombak&view=kepri")).toBe("/langit-laut?mode=ombak&view=kepri");
  });

  it("batam-bites per path", () => {
    expect(alamatBaruBites("/")).toBe("/makan");
    expect(alamatBaruBites("/tempat/kopi-ameng")).toBe("/makan/tempat/kopi-ameng");
    expect(alamatBaruBites("/jalur/nagoya")).toBe("/makan/jalur/nagoya");
    expect(alamatBaruBites("/saved")).toBe("/makan/tersimpan");
    expect(alamatBaruBites("/about")).toBe("/makan/tentang");
    expect(alamatBaruBites("/tidak-ada")).toBeNull();
  });

  it("semua tujuan di vercel.json punya route di situs baru", () => {
    const { redirects } = JSON.parse(baca("batam-bites/vercel.json")) as { redirects: { destination: string }[] };
    for (const r of redirects) {
      const path = r.destination.replace("https://DOMAIN-BARU", "").replace(/:slug/, "[slug]");
      expect(existsSync(join(process.cwd(), "app", path, "page.tsx")), path).toBe(true);
    }
  });
});

describe("paket pengalihan", () => {
  it("belum menyebut domain sungguhan, jadi tidak bisa terpakai tanpa sengaja", () => {
    for (const f of ["hujandibatam/vercel.json", "hujandibatam/public/sw.js", "batam-bites/public/sw.js"]) {
      expect(baca(f)).toContain("DOMAIN-BARU");
    }
  });

  it("service worker pengganti menghapus cache dan melepas diri", () => {
    for (const f of ["hujandibatam/public/sw.js", "batam-bites/public/sw.js"]) {
      const s = baca(f);
      expect(s).toContain("caches.delete");
      expect(s).toContain("registration.unregister");
    }
  });

  it("halaman pindah favorit memakai kunci dan parameter yang benar", () => {
    const s = baca("batam-bites/public/saved.html");
    expect(s).toContain("bb_favorites");
    expect(s).toContain("?simpan=");
  });
});
