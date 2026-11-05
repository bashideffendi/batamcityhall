import { describe, expect, it } from "vitest";
import {
  gabungBerita,
  MAKS_PER_SUMBER,
  MAKS_TOTAL,
  muatBerita,
  rapikanItem,
  type Ingatan,
} from "@/features/berita/muat";
import { bacaFeed, bacaWaktu, bersihkanJudul, FeedRusak, tautanAman } from "@/features/berita/rss";
import { tentangBatam } from "@/features/berita/saring";
import { SUMBER_BERITA, type SumberBerita } from "@/features/berita/sumber";

const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<!-- komentar berisi <item> yang harus diabaikan -->
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Media Contoh</title>
    <link>https://contoh.id/</link>
    <atom:link href="https://contoh.id/feed/" rel="self" type="application/rss+xml" />
    <item>
      <title><![CDATA[Jembatan <b>Barelang</b> &amp; Tol]]></title>
      <link>https://contoh.id/satu/?a=1&amp;b=2</link>
      <pubDate>Wed, 04 Nov 2026 14:39:37 +0000</pubDate>
      <description><![CDATA[Ringkasan yang tidak boleh ikut.]]></description>
      <content:encoded><![CDATA[<p>Isi lengkap yang tidak boleh ikut.</p><item><title>palsu</title></item>]]></content:encoded>
    </item>
    <item>
      <title>Harga cabai naik &#8211; pedagang &#x2018;pasrah&#x2019;</title>
      <link><![CDATA[https://contoh.id/dua/]]></link>
      <pubDate>Rabu, 4 Nov 2026 20:24:51 WIB</pubDate>
    </item>
    <item>
      <title>Waktunya rusak</title>
      <link>https://contoh.id/tiga/</link>
      <pubDate>kemarin sore</pubDate>
    </item>
    <item>
      <title>Tautan berbahaya</title>
      <link>javascript:alert(1)</link>
    </item>
    <item>
      <title>Tanpa link, guid permalink</title>
      <guid isPermaLink="true">https://contoh.id/empat/</guid>
    </item>
    <item>
      <title>Guid bukan permalink</title>
      <guid isPermaLink="false">https://contoh.id/?p=5</guid>
    </item>
    <item>
      <title></title>
      <link>https://contoh.id/tanpa-judul/</link>
    </item>
  </channel>
</rss>`;

const ATOM = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Contoh Atom</title>
  <updated>2026-11-04T10:00:00Z</updated>
  <entry>
    <title type="html">&lt;em&gt;Feri&lt;/em&gt; Sekupang ditambah</title>
    <link rel="self" href="https://contoh.id/atom/1.xml"/>
    <link rel="alternate" type="text/html" href="https://contoh.id/feri?a=1&amp;b=2"/>
    <published>2026-11-04T09:00:00+07:00</published>
    <updated>2026-11-04T11:00:00+07:00</updated>
    <summary>Ringkasan yang tidak boleh ikut.</summary>
    <content type="html">&lt;p&gt;Isi lengkap yang tidak boleh ikut.&lt;/p&gt;</content>
  </entry>
  <entry>
    <title>Link tanpa rel, hanya updated</title>
    <link href="https://contoh.id/kedua"/>
    <updated>2026-11-04T01:30:00Z</updated>
  </entry>
  <entry>
    <title>Link data</title>
    <link rel="alternate" href="data:text/html,hai"/>
  </entry>
</feed>`;

describe("bacaFeed RSS", () => {
  const hasil = bacaFeed(RSS);

  it("mengenali format dan membuang item tanpa tautan aman atau judul", () => {
    expect(hasil.format).toBe("rss");
    expect(hasil.item.map((i) => i.tautan)).toEqual([
      "https://contoh.id/satu/?a=1&b=2",
      "https://contoh.id/dua/",
      "https://contoh.id/tiga/",
      "https://contoh.id/empat/",
    ]);
  });

  it("CDATA: tag HTML dibersihkan, entitas di dalamnya didekode", () => {
    expect(hasil.item[0].judul).toBe("Jembatan Barelang & Tol");
  });

  it("entitas numerik desimal dan heksadesimal", () => {
    expect(hasil.item[1].judul).toBe("Harga cabai naik – pedagang ‘pasrah’");
  });

  it("waktu RFC 822 jadi ISO, termasuk WIB dan nama hari Indonesia", () => {
    expect(hasil.item[0].waktu).toBe("2026-11-04T14:39:37.000Z");
    expect(hasil.item[1].waktu).toBe("2026-11-04T13:24:51.000Z");
  });

  it("tanggal tak terbaca jadi null, itemnya tetap ada", () => {
    expect(hasil.item[2]).toMatchObject({ judul: "Waktunya rusak", waktu: null });
  });

  it("isi dan ringkasan tidak keluar dari parser, termasuk item palsu di dalam CDATA", () => {
    const teks = JSON.stringify(hasil);
    expect(teks).not.toContain("tidak boleh ikut");
    expect(teks).not.toContain("palsu");
    expect(Object.keys(hasil.item[0]).sort()).toEqual(["judul", "tautan", "waktu"]);
  });
});

describe("bacaFeed Atom", () => {
  const hasil = bacaFeed(ATOM);

  it("mengambil link alternate, published lebih dulu dari updated", () => {
    expect(hasil.format).toBe("atom");
    expect(hasil.item[0]).toEqual({
      judul: "Feri Sekupang ditambah",
      tautan: "https://contoh.id/feri?a=1&b=2",
      waktu: "2026-11-04T02:00:00.000Z",
    });
  });

  it("link tanpa rel dianggap alternate, updated jadi cadangan waktu", () => {
    expect(hasil.item[1]).toEqual({
      judul: "Link tanpa rel, hanya updated",
      tautan: "https://contoh.id/kedua",
      waktu: "2026-11-04T01:30:00.000Z",
    });
  });

  it("skema selain http dan https dibuang, isi tidak ikut", () => {
    expect(hasil.item).toHaveLength(2);
    expect(JSON.stringify(hasil)).not.toContain("tidak boleh ikut");
  });
});

describe("feed rusak", () => {
  const rusak: [string, string][] = [
    ["kosong", ""],
    ["teks biasa", "Bad gateway"],
    ["halaman HTML", '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>hai</body></html>'],
    ["HTML rapi", "<html><head><title>x</title></head><body></body></html>"],
    ["terpotong", "<rss><channel><item><title>a</title>"],
    ["tag silang", "<rss><channel><item></channel></item></rss>"],
    ["CDATA tidak tertutup", "<rss><channel><title><![CDATA[x</title></channel></rss>"],
    ["rss tanpa channel", "<rss></rss>"],
    ["JSON", '{"error":"Only HTML requests are supported here"}'],
    ["tanda kurang lepas", "<rss><channel><title>a < b</title></channel></rss>"],
  ];
  for (const [nama, xml] of rusak) {
    it(nama, () => expect(() => bacaFeed(xml)).toThrow(FeedRusak));
  }

  it("feed utuh tanpa item bukan kerusakan", () => {
    expect(bacaFeed("<rss><channel><title>a</title></channel></rss>").item).toEqual([]);
  });

  it("BOM di awal dan DOCTYPE tidak merusak", () => {
    const xml = '﻿<?xml version="1.0"?><!DOCTYPE rss [<!ENTITY x "y">]><rss><channel></channel></rss>';
    expect(bacaFeed(xml).format).toBe("rss");
  });

  it("entitas buatan feed tidak diperluas", () => {
    const xml = `<!DOCTYPE rss [<!ENTITY x "ledakan">]><rss><channel><item><title>a &x;</title><link>https://c.id/</link></item></channel></rss>`;
    expect(bacaFeed(xml).item[0].judul).toBe("a &x;");
  });

  it("RDF: item di samping channel", () => {
    const xml = `<rdf:RDF><channel><title>k</title></channel><item><title>a</title><link>https://c.id/a</link><dc:date>2026-11-04T01:00:00Z</dc:date></item></rdf:RDF>`;
    expect(bacaFeed(xml).item).toEqual([{ judul: "a", tautan: "https://c.id/a", waktu: "2026-11-04T01:00:00.000Z" }]);
  });
});

describe("bersihkanJudul", () => {
  it("menghapus tag, skrip, dan gaya beserta isinya", () => {
    expect(bersihkanJudul('Awal<script>alert("x")</script> <style>b{}</style><b class="a">Akhir</b>')).toBe(
      "Awal Akhir",
    );
  });
  it("entitas dua kali dan tag yang disandikan", () => {
    expect(bersihkanJudul("Tom &amp;amp; Jerry")).toBe("Tom & Jerry");
    expect(bersihkanJudul("&lt;img src=x onerror=alert(1)&gt;Judul")).toBe("Judul");
  });
  it("tanda kurang di judul biasa tetap utuh", () => {
    expect(bersihkanJudul("Suhu &lt; 30 derajat")).toBe("Suhu < 30 derajat");
  });
  it("spasi, nbsp, karakter kontrol, dan pembalik arah", () => {
    expect(bersihkanJudul("  a&nbsp;&nbsp;b\n\tc\u0007d‮e ")).toBe("a b cde");
  });
  it("entitas tak dikenal dan kode titik rusak dibiarkan", () => {
    expect(bersihkanJudul("a &tidakada; b &#xD800; c &#99999999;")).toBe("a &tidakada; b &#xD800; c &#99999999;");
  });
  it("judul sangat panjang dipotong", () => {
    const j = bersihkanJudul("x".repeat(500));
    expect(j.length).toBeLessThanOrEqual(241);
    expect(j.endsWith("…")).toBe(true);
  });
  it("judul yang isinya hanya tag jadi kosong", () => {
    expect(bersihkanJudul("<b></b>")).toBe("");
  });
});

describe("tautanAman", () => {
  it("hanya http dan https", () => {
    expect(tautanAman("https://a.id/x")).toBe("https://a.id/x");
    expect(tautanAman(" http://a.id/ ")).toBe("http://a.id/");
    for (const s of [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(1)",
      "java\nscript:alert(1)",
      "data:text/html,x",
      "vbscript:x",
      "ftp://a.id/",
      "file:///etc/passwd",
      "/relatif",
      "//a.id/x",
      "",
      null,
      undefined,
    ]) {
      expect(tautanAman(s), String(s)).toBeNull();
    }
  });
  it("entitas di tautan didekode sebelum diperiksa", () => {
    expect(tautanAman("javascript&#58;alert(1)")).toBeNull();
  });
  it("tautan dengan kredensial ditolak", () => {
    expect(tautanAman("https://u:p@a.id/")).toBeNull();
  });
});

describe("bacaWaktu", () => {
  it("bentuk yang terbaca", () => {
    expect(bacaWaktu("Wed, 04 Nov 2026 20:24:51 +0700")).toBe("2026-11-04T13:24:51.000Z");
    expect(bacaWaktu("04 Nov 26 13:24 GMT")).toBe("2026-11-04T13:24:00.000Z");
    expect(bacaWaktu("4 Agu 2026 07.05 WIB")).toBe("2026-08-04T00:05:00.000Z");
    expect(bacaWaktu("2026-11-04T09:00:00+07:00")).toBe("2026-11-04T02:00:00.000Z");
    expect(bacaWaktu("2026-11-04T02:00:00.123Z")).toBe("2026-11-04T02:00:00.000Z");
  });
  it("yang tak terbaca jadi null, bukan tebakan", () => {
    for (const s of [
      "foo 1",
      "kemarin",
      "",
      null,
      undefined,
      "32 Nov 2026 10:00:00 +0700",
      "04 Bln 2026 10:00:00 +0700",
      "04 Nov 2026 25:00:00 +0700",
      "04 Nov 2026 10:00:00",
      "04 Nov 2026 10:00:00 XYZ",
      "2026-11-04",
      "2026-11-04T09:00:00",
      "2026-13-04T09:00:00Z",
    ]) {
      expect(bacaWaktu(s), String(s)).toBeNull();
    }
  });
});

const NOW = Date.parse("2026-11-05T03:00:00Z");
const sumber = (id: string): SumberBerita => ({
  id,
  nama: id.toUpperCase(),
  situs: `https://${id}.id/`,
  feed: `https://${id}.id/feed/`,
});
const rssDari = (id: string, n: number) =>
  `<rss><channel>${Array.from(
    { length: n },
    (_, i) =>
      `<item><title>Batam ${id} ${i}</title><link>https://${id}.id/${i}</link><pubDate>Wed, 04 Nov 2026 ${String(i % 24).padStart(2, "0")}:00:00 +0000</pubDate></item>`,
  ).join("")}</channel></rss>`;

describe("batas dan urutan", () => {
  it("per sumber: terbaru dulu, dibatasi, yang tanpa waktu di belakang", () => {
    const item = [
      { judul: "tanpa", tautan: "https://a.id/t", waktu: null },
      ...Array.from({ length: 20 }, (_, i) => ({
        judul: `j${i}`,
        tautan: `https://a.id/${i}`,
        waktu: new Date(NOW - i * 3600_000).toISOString(),
      })),
    ];
    const hasil = rapikanItem(item, NOW);
    expect(hasil).toHaveLength(MAKS_PER_SUMBER);
    expect(hasil[0].judul).toBe("j0");
    expect(hasil.map((i) => i.judul)).not.toContain("tanpa");
    expect(rapikanItem(item.slice(0, 3), NOW).at(-1)?.judul).toBe("tanpa");
  });

  it("waktu dari masa depan dianggap tak terbaca, supaya tidak menempel di puncak", () => {
    const hasil = rapikanItem(
      [
        { judul: "masa depan", tautan: "https://a.id/1", waktu: "2030-01-01T00:00:00.000Z" },
        { judul: "biasa", tautan: "https://a.id/2", waktu: "2026-11-04T00:00:00.000Z" },
      ],
      NOW,
    );
    expect(hasil.map((i) => [i.judul, i.waktu])).toEqual([
      ["biasa", "2026-11-04T00:00:00.000Z"],
      ["masa depan", null],
    ]);
  });

  it("gabungan: urut waktu, tautan kembar sekali, total dibatasi", () => {
    const per = Array.from({ length: 10 }, (_, s) => ({
      sumber: sumber(`s${s}`),
      item: Array.from({ length: MAKS_PER_SUMBER }, (_, i) => ({
        judul: `${s}-${i}`,
        tautan: `https://s.id/${s}/${i}`,
        waktu: new Date(NOW - (s * 10 + i) * 60_000).toISOString(),
      })),
    }));
    per[1].item[0].tautan = per[0].item[0].tautan;
    const hasil = gabungBerita(per);
    expect(hasil).toHaveLength(MAKS_TOTAL);
    expect(new Set(hasil.map((b) => b.tautan)).size).toBe(MAKS_TOTAL);
    const waktu = hasil.map((b) => b.waktu as string);
    expect(waktu).toEqual([...waktu].sort().reverse());
  });
});

describe("muatBerita", () => {
  const daftar = [sumber("hidup"), sumber("mati"), sumber("html"), sumber("kosong")];
  const ambilTeks = async (url: string) => {
    if (url.includes("hidup")) return rssDari("hidup", 3);
    if (url.includes("mati")) throw new Error("http 403");
    if (url.includes("html")) return "<html><body>maaf</body></html>";
    return "<rss><channel></channel></rss>";
  };

  it("feed mati dan rusak tidak menjatuhkan yang lain", async () => {
    const gagal: string[] = [];
    const hasil = await muatBerita({
      sumber: daftar,
      ambilTeks,
      ingatan: new Map(),
      now: NOW,
      saatGagal: (s) => gagal.push(s.id),
    });
    expect(hasil.item).toHaveLength(3);
    expect(hasil.item[0].sumber).toBe("HIDUP");
    expect(gagal.sort()).toEqual(["html", "mati"]);
    expect(Object.fromEntries(hasil.sumber.map((s) => [s.id, [s.status, s.jumlah]]))).toEqual({
      hidup: ["ok", 3],
      mati: ["gagal", 0],
      html: ["gagal", 0],
      kosong: ["kosong", 0],
    });
  });

  it("gagal tanpa riwayat tidak mengarang waktu berhasil", async () => {
    const hasil = await muatBerita({ sumber: daftar, ambilTeks, ingatan: new Map(), now: NOW });
    expect(hasil.sumber.find((s) => s.id === "mati")?.terakhirBerhasil).toBeNull();
    expect(hasil.sumber.find((s) => s.id === "hidup")?.terakhirBerhasil).toBe(new Date(NOW).toISOString());
  });

  it("gagal setelah pernah berhasil: judul lama tetap ada, status tetap gagal, waktu berhasil yang lama", async () => {
    const ingatan: Ingatan = new Map();
    const s = [sumber("a")];
    await muatBerita({ sumber: s, ambilTeks: async () => rssDari("a", 2), ingatan, now: NOW });
    const nanti = NOW + 3600_000;
    const hasil = await muatBerita({
      sumber: s,
      ambilTeks: async () => {
        throw new Error("waktu habis");
      },
      ingatan,
      now: nanti,
    });
    expect(hasil.item).toHaveLength(2);
    expect(hasil.sumber[0]).toMatchObject({
      status: "gagal",
      jumlah: 2,
      terakhirBerhasil: new Date(NOW).toISOString(),
    });
  });

  it("judul yang diingat dibuang setelah 24 jam, catatan waktunya tetap jujur", async () => {
    const ingatan: Ingatan = new Map();
    const s = [sumber("a")];
    await muatBerita({ sumber: s, ambilTeks: async () => rssDari("a", 2), ingatan, now: NOW });
    const hasil = await muatBerita({
      sumber: s,
      ambilTeks: async () => {
        throw new Error("mati");
      },
      ingatan,
      now: NOW + 25 * 3600_000,
    });
    expect(hasil.item).toEqual([]);
    expect(hasil.sumber[0]).toMatchObject({ status: "gagal", terakhirBerhasil: new Date(NOW).toISOString() });
  });

  it("semua gagal tetap mengembalikan status tiap sumber, bukan melempar", async () => {
    const hasil = await muatBerita({
      sumber: daftar,
      ambilTeks: async () => {
        throw new Error("jaringan");
      },
      ingatan: new Map(),
      now: NOW,
    });
    expect(hasil.item).toEqual([]);
    expect(hasil.sumber.every((s) => s.status === "gagal")).toBe(true);
  });
});

describe("saringan judul tentang Batam (pedoman 8.4)", () => {
  it("kata kunci wilayah, 12 kecamatan, dan kawasan utama lolos", () => {
    for (const judul of [
      "Banjir rob di Batam meluas",
      "BATAM: harga cabai naik",
      "Gubernur Kepri meninjau pelabuhan",
      "Nelayan Kepulauan Riau melaut lagi",
      "Jembatan Barelang ditutup sementara",
      "Warga Rempang menggelar musyawarah",
      "Pulau Galang kedatangan wisatawan",
      "Kantor Camat Bulang pindah",
      "Feri ke Belakang Padang ditambah",
      "Nongsa jadi tuan rumah lomba",
      "Bintan buka rute baru",
      "Tanjungpinang gelar festival",
      "Hujan di Tanjung Pinang",
      "Kemacetan di Sei Beduk",
      "Sagulung menggelar bazar",
      "Pasar Lubuk Baja direnovasi",
      "Batu Ampar kembali banjir",
      "Pembangunan di Batam Kota",
      "Macet panjang di Nagoya",
      "Pasar Jodoh ditata ulang",
      "Halte baru di Tiban",
      "Perbaikan jalan Batu Aji",
      "Batuaji dilanda hujan",
      "Kecelakaan di Sekupang",
      "Feri Harbour Bay tertunda",
      "Bengkong kekurangan air",
      "Galangan di Tanjung Uncang sepi",
      "Kawasan Muka Kuning ramai",
    ]) {
      expect(tentangBatam(judul), judul).toBe(true);
    }
  });

  it("judul nasional dan internasional tidak lolos", () => {
    for (const judul of [
      "Presiden meresmikan bendungan di Jawa Tengah",
      "Harga emas dunia naik lagi",
      "Banjir besar melanda Jakarta",
      "Pemilu Amerika Serikat memasuki babak akhir",
    ]) {
      expect(tentangBatam(judul), judul).toBe(false);
    }
  });

  it("kata umum yang mirip nama tempat tidak lolos", () => {
    for (const judul of [
      "Warga galang dana untuk korban banjir",
      "Galang Dana untuk Korban Gempa",
      "Menggalang kekuatan menjelang pemilu",
      "Kisah artis menemukan jodoh",
      "Rezeki tiban bagi petani kopi",
      "Batamnews berganti alamat",
    ]) {
      expect(tentangBatam(judul), judul).toBe(false);
    }
  });

  it("muatBerita membuang judul di luar Batam sebelum dibatasi per sumber", async () => {
    const nasional = Array.from(
      { length: 15 },
      (_, i) =>
        `<item><title>Berita nasional ${i}</title><link>https://a.id/n${i}</link><pubDate>Wed, 04 Nov 2026 20:00:00 +0000</pubDate></item>`,
    ).join("");
    const lokal =
      "<item><title>Batam menggelar festival</title><link>https://a.id/b</link><pubDate>Wed, 04 Nov 2026 01:00:00 +0000</pubDate></item>";
    const hasil = await muatBerita({
      sumber: [sumber("a")],
      ambilTeks: async () => `<rss><channel>${nasional}${lokal}</channel></rss>`,
      ingatan: new Map(),
      now: NOW,
    });
    expect(hasil.item.map((i) => i.judul)).toEqual(["Batam menggelar festival"]);
    expect(hasil.sumber[0]).toMatchObject({ status: "ok", jumlah: 1 });
  });

  it("feed yang isinya berita nasional semua tercatat kosong, tidak diisi berita lain", async () => {
    const hasil = await muatBerita({
      sumber: [sumber("a")],
      ambilTeks: async () =>
        "<rss><channel><item><title>Harga emas naik</title><link>https://a.id/1</link></item></channel></rss>",
      ingatan: new Map(),
      now: NOW,
    });
    expect(hasil.item).toEqual([]);
    expect(hasil.sumber[0]).toMatchObject({ status: "kosong", jumlah: 0 });
  });
});

describe("daftar sumber", () => {
  it("minimal tiga feed, semua https, id unik", () => {
    expect(SUMBER_BERITA.length).toBeGreaterThanOrEqual(3);
    expect(new Set(SUMBER_BERITA.map((s) => s.id)).size).toBe(SUMBER_BERITA.length);
    for (const s of SUMBER_BERITA) expect(s.feed.startsWith("https://"), s.id).toBe(true);
  });
});
