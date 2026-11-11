import { describe, expect, it } from "vitest";
import log from "@/data/redaksi/log-koreksi.json";
import places from "@/data/places.json";
import { umpanRss } from "@/features/konten/rss";
import { logKoreksiSchema } from "@/lib/data/schema";
import { artikel, ID_ORGANISASI, organisasi, teksLd, tempatMakan } from "@/lib/data-terstruktur";

const MAKAN = {
  id: "uji",
  name: "Warung Uji",
  desc_id: "Bubur ayam.",
  address: "Jl. Satu",
  lat: 1.1,
  lng: 104.05,
  coord_approx: false,
  price_tier: "$",
};

describe("data terstruktur", () => {
  it("organisasi mengumumkan kebijakan redaksi lewat alamat internal", () => {
    const o = organisasi();
    expect(o["@id"]).toBe(ID_ORGANISASI);
    for (const k of ["publishingPrinciples", "correctionsPolicy", "actionableFeedbackPolicy", "ownershipFundingInfo"]) {
      expect(new URL(o[k] as string).pathname).toMatch(/^\/(standar-redaksi|tentang)$/);
    }
  });

  it("penulis Redaksi adalah organisasi, penulis lain orang; gambar boleh kosong", () => {
    const a = artikel({ judul: "J", ringkasan: "R", tanggal: "2026-11-05", alamat: "/jurnal/j", penulis: "Redaksi Barelang.co" });
    expect(a.author).toEqual({ "@id": ID_ORGANISASI });
    expect(a).not.toHaveProperty("image");
    const b = artikel({ judul: "J", ringkasan: "R", tanggal: "2026-11-05", alamat: "/jurnal/j", penulis: "Sari", gambar: "/g.webp" });
    expect(b.author).toEqual({ "@type": "Person", name: "Sari" });
    expect(String(b.image)).toMatch(/\/g\.webp$/);
  });

  it("tempat makan: titik perkiraan tidak ikut, nomor dan rating tidak pernah ikut", () => {
    expect(tempatMakan(MAKAN, "Bubur")).toMatchObject({ geo: { latitude: 1.1, longitude: 104.05 }, servesCuisine: "Bubur" });
    expect(tempatMakan({ ...MAKAN, coord_approx: true })).not.toHaveProperty("geo");
    const teks = JSON.stringify(tempatMakan({ ...MAKAN, phone: "0811", rating: 4.5 } as typeof MAKAN));
    expect(teks).not.toMatch(/0811|telephone|rating/);
  });

  it("teks JSON-LD tidak bisa menutup tag script", () => {
    expect(teksLd({ a: "</script><script>alert(1)</script>" })).not.toContain("<");
  });
});

describe("RSS", () => {
  it("terbaru di atas, karakter khusus disandikan, alamat lengkap", () => {
    const xml = umpanRss({
      judul: "Situs & Kota",
      deskripsi: "D",
      situs: "https://contoh.test",
      alamatUmpan: "/rss.xml",
      item: [
        { judul: "Lama", ringkasan: "a < b", tanggal: "2026-01-01", alamat: "/jurnal/lama" },
        { judul: "Baru", ringkasan: "R", tanggal: "2026-11-05", alamat: "/jurnal/baru", rubrik: "Sejarah" },
      ],
    });
    expect(xml).toContain("<title>Situs &amp; Kota</title>");
    expect(xml).toContain("a &lt; b");
    expect(xml.indexOf("Baru")).toBeLessThan(xml.indexOf("Lama"));
    expect(xml).toContain("<link>https://contoh.test/jurnal/baru</link>");
    expect(xml).toContain("<pubDate>Thu, 05 Nov 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<category>Sejarah</category>");
  });
});

describe("Log Koreksi", () => {
  it("lolos skema dan tempat yang dirujuk ada di direktori", () => {
    expect(logKoreksiSchema.safeParse(log).success).toBe(true);
    const id = new Set((places as { id: string }[]).map((p) => p.id));
    for (const e of log) {
      const m = /^\/info\/tempat\/(.+)$/.exec(e.halaman);
      if (m) expect(id.has(m[1]), e.halaman).toBe(true);
    }
  });

  it("skema menolak tautan ke situs lain dan urutan terbalik", () => {
    const e = { tanggal: "2026-11-08", halaman: "/cctv", judul: "CCTV", uraian: "Titik diperbaiki di peta." };
    expect(logKoreksiSchema.safeParse([{ ...e, halaman: "//jahat.test" }]).success).toBe(false);
    expect(logKoreksiSchema.safeParse([{ ...e, tanggal: "2026-01-01" }, e]).success).toBe(false);
  });
});
