import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import katalog from "@/data/dataset/katalog.json";

// Menu Dataset (keputusan pemilik 9 Nov 2026): penyedia sebagai teks tanpa tautan, tanpa data pribadi dan pajak.
const DIR = join(process.cwd(), "data", "dataset", "pratinjau");
const K = katalog as {
  tema: { id: string; nama: string }[];
  dataset: { slug: string; judul: string; tema: string; penyedia: string; jumlah: number; kolom: number }[];
};
const pratinjau = readdirSync(DIR).map((f) => ({ f, isi: readFileSync(join(DIR, f), "utf8") }));

describe("katalog Dataset", () => {
  it("slug unik, tiap dataset punya tema dikenal dan berkas pratinjau", () => {
    const slug = K.dataset.map((d) => d.slug);
    expect(new Set(slug).size).toBe(slug.length);
    const tema = new Set(K.tema.map((t) => t.id));
    for (const d of K.dataset) {
      expect(tema.has(d.tema), d.slug).toBe(true);
      expect(existsSync(join(DIR, `${d.slug}.json`)), d.slug).toBe(true);
      expect(d.jumlah, d.slug).toBeGreaterThan(0);
    }
    expect(pratinjau).toHaveLength(K.dataset.length);
  });

  it("tidak ada tautan, alamat situs pemerintah, atau tag HTML di katalog dan pratinjau", () => {
    const pola = /https?:\/\/|\.go\.id\b|<[a-z][^>]*>/i;
    expect(JSON.stringify(K)).not.toMatch(pola);
    expect(pratinjau.filter((p) => pola.test(p.isi)).map((p) => p.f)).toEqual([]);
  });

  it("tidak ada kolom data pribadi atau pajak", () => {
    const pribadi = /^(nik|nip|no_?kk|kk|ktp|no_?ktp|nama_?kk|kepala_?kel|no_?hp|hp|telp|telepon|email|no_?kontak|kontak|pemilik)$/i;
    const pajak = /pajak|pbjt|retribusi|npwpd|sspd|sptpd/i;
    for (const p of pratinjau) {
      const { kolom } = JSON.parse(p.isi) as { kolom: string[] };
      expect(kolom.filter((k) => pribadi.test(k) || pajak.test(k)), p.f).toEqual([]);
    }
    expect(K.dataset.filter((d) => /pajak|pbjt|retribusi/i.test(d.judul)).map((d) => d.judul)).toEqual([]);
  });

  it("dataset yang sensitif secara sosial tidak diterbitkan", () => {
    expect(K.dataset.filter((d) => /pekerja liar|penertiban|unjuk rasa|ruli|bnba/i.test(d.judul)).map((d) => d.judul)).toEqual([]);
  });

  it("pratinjau paling banyak 50 baris dan lebar baris sama dengan jumlah kolom", () => {
    for (const p of pratinjau) {
      const { kolom, baris } = JSON.parse(p.isi) as { kolom: string[]; baris: string[][] };
      expect(baris.length, p.f).toBeLessThanOrEqual(50);
      expect(baris.every((b) => b.length === kolom.length), p.f).toBe(true);
    }
  });
});
