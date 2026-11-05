import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { PeringatanCuaca, PeringatanResponse } from "@/features/langit-laut/lib/api-types";
import {
  aktifPada,
  butirKepri,
  daftarNama,
  kalimatPeringatan,
  KECAMATAN_BATAM,
  kecamatanBatam,
  keGeoJson,
  statusUntukBatam,
  susunPeringatan,
  uraiCap,
  uraiPoligon,
  uraiRss,
  waktuWib,
} from "@/features/langit-laut/lib/peringatan-cuaca";
import { KECAMATAN } from "@/lib/data/schema";

// Bentuk berkas disalin dari respons BMKG 5 Nov 2026; poligon dipendekkan.
const RSS = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Peringatan Dini Cuaca BMKG</title>
    <link>https://www.bmkg.go.id/alerts/nowcast/id/rss.xml</link>
    <item>
      <title>Hujan Lebat disertai Petir di Kep. Riau</title>
      <link>https://www.bmkg.go.id/alerts/nowcast/id/CKR20261105002_alert.xml</link>
    </item>
    <item>
      <title>Hujan Lebat disertai Petir di Riau</title>
      <link>https://www.bmkg.go.id/alerts/nowcast/id/CRU20261105001_alert.xml</link>
    </item>
    <item>
      <title>Kode aneh</title>
      <link>https://contoh.test/../../rahasia_alert.xml</link>
    </item>
  </channel>
</rss>`;

const DESKRIPSI = `Hujan lebat disertai petir akan terjadi pada 05 November 2026, 08:05 WIB di sebagian wilayah Kep. Riau, khususnya di BATU AJI, BINTAN UTARA, KARIMUN, SAGULUNG, SENAYANG, SINGKEP BARAT, TELOK SEBONG.
 Kondisi ini berpotensi menimbulkan dampak berupa jarak pandang berkurang, angin kencang, dan banjir lokal.
 Kondisi diperkirakan dapat berlangsung hingga 05 November 2026, 10:10 WIB.`;

function cap(
  o: {
    msgType?: string;
    status?: string;
    deskripsi?: string;
    expires?: string;
    effective?: string;
    web?: string;
    references?: string;
    polygon?: string;
    id?: string;
  } = {},
): string {
  return `<?xml version="1.0" ?>
<?xml-stylesheet type="text/xsl" href="/cap/nowcast-cap-style.xsl"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${o.id ?? "2.49.0.1.360.0.2026.11.05.03.21.001"}</identifier>
  <sender>cuaca.ekstrem@bmkg.go.id</sender>
  <sent>2026-11-05T07:55:00+07:00</sent>
  <status>${o.status ?? "Actual"}</status>
  <msgType>${o.msgType ?? "Alert"}</msgType>
  <scope>Public</scope>
  ${o.references ? `<references>${o.references}</references>` : ""}
  <info>
    <language>id</language>
    <category>Met</category>
    <event>Hujan Lebat dan Petir</event>
    <urgency>Immediate</urgency>
    <severity>Moderate</severity>
    <certainty>Observed</certainty>
    <effective>${o.effective ?? "2026-11-05T08:05:00+07:00"}</effective>
    ${o.expires === "" ? "" : `<expires>${o.expires ?? "2026-11-05T10:10:00+07:00"}</expires>`}
    <senderName>Badan Meteorologi Klimatologi dan Geofisika</senderName>
    <headline>Hujan Lebat disertai Petir di Kep. Riau</headline>
    <description>${o.deskripsi ?? DESKRIPSI}</description>
    <web>${o.web ?? "https://nowcasting.bmkg.go.id/infografis/CKR/2026/11/05/infografis.jpg"}</web>
    <area>
      <areaDesc>Kep. Riau</areaDesc>
      <polygon>${o.polygon ?? "1.124,104.267 1.108,104.275 1.101,104.287 1.124,104.267"}</polygon>
      <polygon>0.962,103.445 0.959,103.463 0.948,103.475 0.962,103.445</polygon>
    </area>
  </info>
</alert>`;
}

const NOW = Date.parse("2026-11-05T09:00:00+07:00");

function peringatan(o: Partial<PeringatanCuaca> = {}): PeringatanCuaca {
  return {
    id: "a",
    kode: "CKR20261105001",
    kejadian: "Hujan Lebat dan Petir",
    judul: "Hujan Lebat disertai Petir di Kep. Riau",
    deskripsi: DESKRIPSI,
    terbit: "2026-11-05T00:55:00.000Z",
    mulai: "2026-11-05T01:05:00.000Z",
    sampai: "2026-11-05T03:10:00.000Z",
    keparahan: "Moderate",
    urgensi: "Immediate",
    kepastian: "Observed",
    wilayah: "Kep. Riau",
    batam: ["Batu Aji", "Sagulung"],
    web: "",
    ...o,
  };
}

const respons = (daftar: PeringatanCuaca[], status: PeringatanResponse["status"] = "ok"): PeringatanResponse => ({
  status,
  diambil: "",
  peringatan: daftar,
});

describe("KECAMATAN_BATAM", () => {
  it("sama dengan daftar kecamatan proyek", () => {
    expect(KECAMATAN_BATAM.map((k) => k.nama)).toEqual([...KECAMATAN]);
  });

  it("titiknya sama dengan titik label di data BIG", () => {
    const geo = JSON.parse(
      readFileSync(join(process.cwd(), "features/langit-laut/lib/kecamatan-geo.json"), "utf8"),
    ) as {
      features: { properties: { name: string; kab: string; label: [number, number] } }[];
    };
    for (const k of KECAMATAN_BATAM) {
      const f = geo.features.find((x) => x.properties.kab === "Batam" && x.properties.name === k.nama);
      expect(f?.properties.label, k.nama).toEqual([k.lat, k.lon]);
    }
  });
});

describe("uraiRss", () => {
  it("mengambil kode yang sah saja", () => {
    expect(uraiRss(RSS)?.map((b) => b.kode)).toEqual(["CKR20261105002", "CRU20261105001"]);
  });

  it("bukan RSS: null, bukan daftar kosong", () => {
    expect(uraiRss("<html><body>Bad gateway</body></html>")).toBeNull();
    expect(uraiRss("")).toBeNull();
  });

  it("RSS sah tanpa butir: daftar kosong", () => {
    expect(uraiRss(`<rss version="2.0"><channel><title>x</title></channel></rss>`)).toEqual([]);
  });

  it("Kep. Riau bukan Riau", () => {
    expect(butirKepri({ kode: "CKR20261105001", judul: "" })).toBe(true);
    expect(butirKepri({ kode: "XXX20261105001", judul: "Hujan di Kep. Riau" })).toBe(true);
    expect(butirKepri({ kode: "XXX20261105001", judul: "Hujan di Kepulauan Riau" })).toBe(true);
    expect(butirKepri({ kode: "CRU20261105001", judul: "Hujan Lebat disertai Petir di Riau" })).toBe(false);
  });
});

describe("uraiPoligon", () => {
  it("lintang,bujur menjadi [bujur, lintang]", () => {
    expect(uraiPoligon("1,104 2,105 3,106 1,104")).toEqual([
      [104, 1],
      [105, 2],
      [106, 3],
      [104, 1],
    ]);
  });

  it("rusak atau kurang titik: null", () => {
    expect(uraiPoligon("1,104 2,105 1,104")).toBeNull();
    expect(uraiPoligon("a,b 2,105 3,106 1,104")).toBeNull();
    expect(uraiPoligon("91,104 2,105 3,106 1,104")).toBeNull();
  });
});

describe("uraiCap", () => {
  it("mengurai kolom dan waktu menjadi UTC", () => {
    const h = uraiCap(cap(), "CKR20261105001");
    const p = h?.peringatan;
    expect(p?.id).toBe("2.49.0.1.360.0.2026.11.05.03.21.001");
    expect(p?.kode).toBe("CKR20261105001");
    expect(p?.kejadian).toBe("Hujan Lebat dan Petir");
    expect(p?.judul).toBe("Hujan Lebat disertai Petir di Kep. Riau");
    expect(p?.mulai).toBe("2026-11-05T01:05:00.000Z");
    expect(p?.sampai).toBe("2026-11-05T03:10:00.000Z");
    expect(p?.terbit).toBe("2026-11-05T00:55:00.000Z");
    expect(p?.keparahan).toBe("Moderate");
    expect(p?.wilayah).toBe("Kep. Riau");
    expect(p?.batam).toEqual(["Batu Aji", "Sagulung"]);
    expect(p?.poligon).toHaveLength(2);
    expect(p?.poligon?.[0][0]).toEqual([104.267, 1.124]);
    expect(p?.web).toContain("nowcasting.bmkg.go.id");
    expect(h?.merujuk).toEqual([]);
  });

  it("teks disalin apa adanya dan entitas dipulihkan", () => {
    const p = uraiCap(cap({ deskripsi: "Hujan &amp; petir di NONGSA" }), "CKR1")?.peringatan;
    expect(p?.deskripsi).toBe("Hujan & petir di NONGSA");
  });

  it("bukan CAP atau kolom waktu hilang: null", () => {
    expect(uraiCap("<html></html>", "CKR1")).toBeNull();
    expect(uraiCap(cap({ expires: "" }), "CKR1")).toBeNull();
  });

  it("pembatalan tidak tampil dan menyebut yang dibatalkan", () => {
    const h = uraiCap(
      cap({
        msgType: "Cancel",
        references: "cuaca.ekstrem@bmkg.go.id,2.49.0.1.360.0.2026.11.05.03.21.001,2026-11-05T07:55:00+07:00",
      }),
      "CKR2",
    );
    expect(h?.peringatan).toBeNull();
    expect(h?.merujuk).toEqual(["2.49.0.1.360.0.2026.11.05.03.21.001"]);
  });

  it("latihan tidak tampil", () => {
    expect(uraiCap(cap({ status: "Exercise" }), "CKR1")?.peringatan).toBeNull();
    expect(uraiCap(cap({ status: "Test" }), "CKR1")?.peringatan).toBeNull();
  });

  it("tautan web selain BMKG dibuang", () => {
    expect(uraiCap(cap({ web: "https://contoh.test/x.jpg" }), "CKR1")?.peringatan?.web).toBe("");
    expect(uraiCap(cap({ web: "javascript:alert(1)" }), "CKR1")?.peringatan?.web).toBe("");
  });
});

describe("kecamatanBatam", () => {
  it("disebut di teks, huruf besar, kata utuh", () => {
    expect(kecamatanBatam("khususnya di BATU AJI, KARIMUN, SAGULUNG.", [])).toEqual(["Batu Aji", "Sagulung"]);
    expect(kecamatanBatam("khususnya di BINTAN UTARA, KARIMUN.", [])).toEqual([]);
    expect(kecamatanBatam("khususnya di GALANGAN KAPAL.", [])).toEqual([]);
  });

  it("ejaan lain Sei Beduk", () => {
    expect(kecamatanBatam("khususnya di SUNGAI BEDUK.", [])).toEqual(["Sei Beduk"]);
    expect(kecamatanBatam("khususnya di SEI BEDUK.", [])).toEqual(["Sei Beduk"]);
  });

  it("teks tidak menyebut, tetapi titik kecamatan ada di dalam poligon", () => {
    const batuAji: [number, number][] = [
      [103.97, 1.04],
      [104.0, 1.04],
      [104.0, 1.07],
      [103.97, 1.07],
      [103.97, 1.04],
    ];
    expect(kecamatanBatam("sebagian wilayah Kep. Riau dan sekitarnya.", [batuAji])).toEqual(["Batu Aji"]);
  });

  it("hanya menyebut Batam tanpa kecamatan", () => {
    expect(kecamatanBatam("di sebagian Kota Batam.", [])).toEqual(["Kota Batam"]);
  });

  it("poligon di luar Batam tidak terhitung", () => {
    const karimun: [number, number][] = [
      [103.4, 0.9],
      [103.5, 0.9],
      [103.5, 1.0],
      [103.4, 0.9],
    ];
    expect(kecamatanBatam("khususnya di KARIMUN.", [karimun])).toEqual([]);
  });
});

describe("susunPeringatan", () => {
  const hasil = (p: PeringatanCuaca, merujuk: string[] = []) => ({ peringatan: p, merujuk });

  it("yang sudah lewat dibuang: RSS BMKG masih memuatnya", () => {
    const lewat = peringatan({ id: "lewat", sampai: "2026-11-05T01:59:00.000Z" });
    const berlaku = peringatan({ id: "berlaku" });
    expect(susunPeringatan([hasil(lewat), hasil(berlaku)], NOW).map((p) => p.id)).toEqual(["berlaku"]);
  });

  it("yang kena Batam di atas, lalu yang mulainya paling baru", () => {
    const a = peringatan({ id: "a", batam: [], mulai: "2026-11-05T02:00:00.000Z" });
    const b = peringatan({ id: "b", batam: ["Nongsa"], mulai: "2026-11-05T01:00:00.000Z" });
    const c = peringatan({ id: "c", batam: [], mulai: "2026-11-05T01:30:00.000Z" });
    expect(susunPeringatan([hasil(a), hasil(b), hasil(c)], NOW).map((p) => p.id)).toEqual(["b", "a", "c"]);
  });

  it("yang dirujuk pesan lain tidak tampil", () => {
    const lama = peringatan({ id: "lama" });
    const baru = peringatan({ id: "baru" });
    expect(susunPeringatan([hasil(lama), hasil(baru, ["lama"])], NOW).map((p) => p.id)).toEqual(["baru"]);
    expect(susunPeringatan([hasil(lama), { peringatan: null, merujuk: ["lama"] }], NOW)).toEqual([]);
  });
});

describe("teks", () => {
  it("jam WIB, tanggal hanya kalau bukan hari ini", () => {
    expect(waktuWib("2026-11-05T03:10:00.000Z", NOW)).toBe("10.10 WIB");
    expect(waktuWib("2026-11-06T03:10:00.000Z", NOW)).toBe("6 Nov, 10.10 WIB");
    expect(waktuWib("bukan", NOW)).toBe("");
  });

  it("daftar nama", () => {
    expect(daftarNama(["Nongsa"])).toBe("Nongsa");
    expect(daftarNama(["Batu Aji", "Sagulung"])).toBe("Batu Aji dan Sagulung");
    expect(daftarNama(["Batu Aji", "Sagulung", "Sekupang"])).toBe("Batu Aji, Sagulung, dan Sekupang");
  });

  it("kalimat untuk Batam menyebut kecamatan", () => {
    expect(kalimatPeringatan(peringatan(), NOW)).toBe(
      "Hujan Lebat dan Petir di Batu Aji dan Sagulung sampai 10.10 WIB.",
    );
  });

  it("kalimat di luar Batam menyebut provinsi", () => {
    expect(kalimatPeringatan(peringatan({ batam: [] }), NOW)).toBe(
      "Hujan Lebat dan Petir di Kep. Riau sampai 10.10 WIB.",
    );
  });

  it("belum mulai ditulis jamnya", () => {
    const p = peringatan({ mulai: "2026-11-05T03:20:00.000Z", sampai: "2026-11-05T05:30:00.000Z" });
    expect(kalimatPeringatan(p, NOW)).toBe(
      "Hujan Lebat dan Petir di Batu Aji dan Sagulung, mulai 10.20 WIB sampai 12.30 WIB.",
    );
  });
});

describe("statusUntukBatam", () => {
  it("memuat dan gagal tidak terbaca sebagai aman", () => {
    expect(statusUntukBatam(null, false, NOW).jenis).toBe("memuat");
    expect(statusUntukBatam(null, true, NOW)).toEqual({ jenis: "gagal", teks: "Peringatan cuaca belum dapat dimuat." });
  });

  it("ada untuk Batam", () => {
    const s = statusUntukBatam(respons([peringatan()]), false, NOW);
    expect(s.jenis).toBe("aktif");
    if (s.jenis === "aktif") expect(s.teks).toContain("Batu Aji dan Sagulung");
  });

  it("lebih dari satu disebut jumlahnya", () => {
    const s = statusUntukBatam(respons([peringatan({ id: "1" }), peringatan({ id: "2" })]), false, NOW);
    if (s.jenis === "aktif") expect(s.teks).toContain("Ada 1 peringatan lain untuk Batam.");
    expect(s.jenis).toBe("aktif");
  });

  it("hanya di luar Batam: tidak disebut", () => {
    expect(statusUntukBatam(respons([peringatan({ batam: [] })]), false, NOW).jenis).toBe("tidak-ada");
  });

  it("sudah lewat menurut jam pengguna: tidak disebut", () => {
    expect(statusUntukBatam(respons([peringatan()]), false, Date.parse("2026-11-05T03:11:00.000Z")).jenis).toBe(
      "tidak-ada",
    );
  });

  it("sebagian gagal atau basi tanpa peringatan Batam: ditulis tidak pasti", () => {
    expect(statusUntukBatam(respons([], "sebagian"), false, NOW).jenis).toBe("gagal");
    expect(statusUntukBatam(respons([], "basi"), false, NOW).jenis).toBe("gagal");
  });

  it("gagal memperbarui saat data lama masih menyebut Batam: peringatannya tetap tampil", () => {
    expect(statusUntukBatam(respons([peringatan()]), true, NOW).jenis).toBe("aktif");
  });

  it("gagal memperbarui tanpa peringatan Batam: ditulis tidak pasti", () => {
    expect(statusUntukBatam(respons([]), true, NOW).jenis).toBe("gagal");
  });
});

describe("aktifPada dan keGeoJson", () => {
  it("batas waktu tepat", () => {
    const p = peringatan();
    expect(aktifPada([p], Date.parse(p.sampai) - 1)).toHaveLength(1);
    expect(aktifPada([p], Date.parse(p.sampai))).toHaveLength(0);
    expect(aktifPada(undefined, NOW)).toEqual([]);
  });

  it("satu peringatan menjadi satu MultiPolygon; tanpa poligon dilewati", () => {
    const cincin: [number, number][] = [
      [104, 1],
      [105, 1],
      [105, 2],
      [104, 1],
    ];
    const g = keGeoJson([peringatan({ poligon: [cincin, cincin] }), peringatan({ id: "b" })]);
    expect(g.features).toHaveLength(1);
    expect(g.features[0].geometry).toEqual({ type: "MultiPolygon", coordinates: [[cincin], [cincin]] });
  });
});
