import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { PNG } from "pngjs";

// Semua sumber data ditiru supaya tes tidak bergantung pada MSS, BMKG, atau kamera Pemko yang hidup.
const png = (() => {
  const p = new PNG({ width: 4, height: 4 });
  for (let i = 0; i < p.data.length; i += 4) {
    p.data[i] = 0;
    p.data[i + 1] = 255;
    p.data[i + 2] = 0;
    p.data[i + 3] = 255;
  }
  return PNG.sync.write(p);
})();

const pad = (n: number) => String(n).padStart(2, "0");
const tsSgt = (menitLalu: number) => {
  const d = new Date(Date.now() - menitLalu * 60000 + 8 * 3600000);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes() - (d.getUTCMinutes() % 5))}`;
};

function frames(jumlah = 6) {
  const out = [];
  for (let i = jumlah - 1; i >= 0; i--) {
    const ts = tsSgt(i * 5 + 5);
    out.push({
      url: `/api/radar-citra/${ts}`,
      ts,
      time: `${ts.slice(8, 10)}.${ts.slice(10, 12)}`,
      date: "Rabu, 4 November",
    });
  }
  return out;
}

const fmtUtc = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;

// Gema nyata di dua kecamatan Batam: kode dari lib/kecamatan-geo.json.
const NONGSA = {
  code: "21.71.04",
  name: "Nongsa",
  kab: "Batam",
  land: 100,
  rain: 60,
  ringan: 10,
  sedang: 10,
  lebat: 40,
};
const SEKUPANG = {
  code: "21.71.03",
  name: "Sekupang",
  kab: "Batam",
  land: 70,
  rain: 30,
  ringan: 30,
  sedang: 0,
  lebat: 0,
};
const ECHO_HUJAN = {
  near: true,
  coverage: 0.2,
  level: "lebat",
  kec: [NONGSA, SEKUPANG],
  region: { near: true, coverage: 0.1, level: "lebat", landKm2: 1000, lastTs: null, kec: [NONGSA, SEKUPANG] },
  lastTs: null,
  lookbackMin: 60,
};

async function tiruSumber(page: Page, opsi: { citraGagal?: boolean; echo?: unknown } = {}) {
  await page.route("**/api/berita", (r) => r.fulfill({ status: 503, json: {} }));
  await page.route("**/api/frames", (r) =>
    r.fulfill({ json: { frames: frames(), stale: false, echo: opsi.echo ?? null } }),
  );
  await page.route("**/api/radar-citra/**", (r) =>
    opsi.citraGagal ? r.fulfill({ status: 404, body: "" }) : r.fulfill({ contentType: "image/png", body: png }),
  );
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
  await page.route("**/api/ofs-frame", (r) => {
    const base = new Date(Date.now() - 6 * 3600000);
    const f = [0, 3, 6, 9].map((h) => fmtUtc(new Date(base.getTime() + h * 3600000)));
    return r.fulfill({
      json: {
        baserun: fmtUtc(base),
        frames: f,
        nowIndex: 2,
        fallback: false,
        source: "modelrun",
        ageH: 6,
        expired: false,
      },
    });
  });
  await page.route("**/api/perairan", (r) =>
    r.fulfill({
      json: {
        code: "P.R.02",
        name: "Perairan Kep. Batam",
        issued: "",
        current: null,
        upcoming: false,
        warns: [],
        slots: [],
      },
    }),
  );
  await page.route("**/maritim.bmkg.go.id/**", (r) => r.fulfill({ contentType: "image/png", body: png }));
}

const petaSiap = (page: Page) => expect(page.locator(".maplibregl-canvas")).toBeVisible({ timeout: 45_000 });

test.describe("Langit & Laut", () => {
  test("tiga mode tersedia dan URL mencerminkan pilihan", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut");
    await petaSiap(page);
    await expect(page.getByRole("radio", { name: "Hujan" })).toBeChecked();
    await page.getByRole("radio", { name: "Ombak" }).click();
    await expect(page).toHaveURL(/mode=ombak/);
    await page.getByRole("radio", { name: "CCTV" }).click();
    await expect(page).toHaveURL(/mode=cctv/);
    await page.getByRole("radio", { name: "Hujan" }).click();
    await expect(page).not.toHaveURL(/mode=/);
  });

  test("deep link membuka mode dan wilayah yang diminta, param lain dipertahankan", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut?mode=ombak&view=natuna&debug=1");
    await petaSiap(page);
    await expect(page.getByRole("radio", { name: "Ombak" })).toBeChecked();
    await expect(page.getByRole("button", { name: "Natuna", pressed: true })).toBeVisible();
    await expect(page).toHaveURL(/debug=1/);
  });

  test("radar memakai route sendiri, tile ombak skema TMS langsung ke BMKG", async ({ page }) => {
    await tiruSumber(page);
    const diminta: string[] = [];
    page.on("request", (r) => diminta.push(r.url()));
    await page.goto("/langit-laut");
    await petaSiap(page);
    await expect.poll(() => diminta.some((u) => u.includes("/api/radar-citra/"))).toBe(true);
    expect(diminta.some((u) => u.includes("weather.gov.sg"))).toBe(false);
    await page.getByRole("radio", { name: "Ombak" }).click();
    await expect
      .poll(() => diminta.some((u) => u.includes("maritim.bmkg.go.id/api21/mpl_req/w3g_hires/swh")))
      .toBe(true);
  });

  test("citra 404 tidak pernah tampil sebagai tidak hujan", async ({ page }) => {
    await tiruSumber(page, { citraGagal: true });
    await page.goto("/langit-laut");
    await petaSiap(page);
    await expect(page.locator(".answer")).toBeVisible();
    await expect(page.locator(".answer")).not.toContainText("Tidak Ada Hujan");
  });

  test("peringatan yang belum diketahui tidak terbaca aman", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut?mode=ombak");
    await petaSiap(page);
    await expect(page.locator("#panel-detail")).toContainText("tidak tersedia");
    await expect(page.locator("#panel-detail")).not.toContainText("Tidak Ada Peringatan");
  });

  test("CCTV: 28 kamera di peta, nol permintaan video sebelum dipilih", async ({ page }) => {
    await tiruSumber(page);
    const video: string[] = [];
    page.on("request", (r) => {
      if (r.url().includes("matanya.batam.go.id")) video.push(r.url());
    });
    await page.goto("/langit-laut?mode=cctv");
    await petaSiap(page);
    const tombol = page.locator(".cam-marker .cam-hit");
    await expect(tombol.first()).toBeAttached();
    const jumlah = await tombol.evaluateAll((el) =>
      el.reduce((s, b) => s + (b.querySelector(".cam-cluster") ? Number(b.textContent) : 1), 0),
    );
    expect(jumlah).toBe(28);
    expect(video).toEqual([]);
  });

  test("CCTV: pin punya nama aksesibel dan bisa dibuka dengan keyboard", async ({ page }) => {
    await tiruSumber(page);
    await page.route("**/matanya.batam.go.id/**", (r) => r.fulfill({ status: 404, body: "" }));
    await page.goto("/langit-laut?mode=cctv");
    await petaSiap(page);
    const pin = page.getByRole("button", { name: /^Kamera / }).first();
    await pin.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".cctv-backdrop")).toBeVisible();
  });

  test("kecamatan yang hujan ditandai label bertulisan dan jawaban menyebut namanya", async ({ page }) => {
    await tiruSumber(page, { echo: ECHO_HUJAN });
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.goto("/langit-laut?view=batam");
    await petaSiap(page);
    await expect(page.locator(".answer")).toContainText("Hujan");
    await expect(page.locator(".kec-pill", { hasText: "Nongsa" })).toBeVisible({ timeout: 15_000 });
    await expect(page.locator(".kec-pill", { hasText: "Sekupang" })).toBeVisible();
    await expect(page.locator(".kec-pill[data-level=lebat]").first()).toBeVisible();
    // Layer arsiran memakai filter ekspresi: galat di sini hanya muncul saat dijalankan.
    expect(galat).toEqual([]);
  });

  test("kelompok kamera membuka daftar di panel, lalu kembali", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut?mode=cctv");
    await petaSiap(page);
    const kelompok = page.getByRole("button", { name: /kamera berdekatan, ketuk untuk memilih/ }).first();
    await kelompok.evaluate((el) => (el as HTMLElement).click());
    await expect(page.locator(".cam-cluster.is-selected")).toBeAttached();
    await expect(page.getByRole("button", { name: /Perbesar Peta/ })).toBeVisible();
  });

  test("kamera gagal tandai abu di sesi ini", async ({ page }) => {
    await tiruSumber(page);
    await page.route("**/matanya.batam.go.id/**", (r) => r.fulfill({ status: 404, body: "" }));
    await page.goto("/langit-laut?mode=cctv");
    await petaSiap(page);
    const pin = page.getByRole("button", { name: /^Kamera / }).first();
    await pin.evaluate((el) => (el as HTMLElement).click());
    await expect(page.locator(".cctv-backdrop")).toBeVisible();
    await expect(page.locator(".cctv-backdrop")).toContainText(/Gagal|Mati|Belum Bisa|Tidak/i, { timeout: 20_000 });
  });

  test("Bagikan menyalin tautan yang mencerminkan tampilan", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await tiruSumber(page);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    });
    await page.goto("/langit-laut?mode=ombak&view=kepri");
    await petaSiap(page);
    await page.getByRole("button", { name: "Bagikan Tampilan Ini" }).first().click();
    await expect(page.locator(".toast")).toBeVisible();
    const teks = await page.evaluate(() => navigator.clipboard.readText());
    expect(teks).toContain("/langit-laut?mode=ombak&view=kepri");
  });

  test("HP landscape: panel tidak melebihi layar", async ({ page }) => {
    await page.setViewportSize({ width: 780, height: 360 });
    await tiruSumber(page);
    await page.goto("/langit-laut");
    await petaSiap(page);
    const lebar = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(lebar).toBeLessThanOrEqual(780);
    await expect(page.locator(".panel")).toBeVisible();
  });

  test("tidak ada sisa Leaflet atau CARTO", async ({ page }) => {
    await tiruSumber(page);
    const luar: string[] = [];
    page.on("request", (r) => {
      if (/cartocdn|circlegeo|leaflet/.test(r.url())) luar.push(r.url());
    });
    await page.goto("/langit-laut");
    await petaSiap(page);
    expect(await page.locator("[class*=leaflet]").count()).toBe(0);
    expect(luar).toEqual([]);
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap");
  });

  test("tema ikut tombol situs dan tersimpan", async ({ page }) => {
    await tiruSumber(page);
    await page.addInitScript(() => localStorage.setItem("bch-theme", "light"));
    await page.goto("/langit-laut");
    await petaSiap(page);
    await page.getByRole("button", { name: "Ganti ke chart malam" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("halaman lain tidak terganggu CSS Langit & Laut setelah navigasi klien", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut");
    await petaSiap(page);
    await page.getByRole("link", { name: "Tentang" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Balai warga, bukan balai kota");
    const ukuran = await page
      .getByRole("heading", { level: 1 })
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    expect(ukuran).toBeGreaterThan(28);
    const overflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
    expect(overflow).not.toBe("hidden");
  });

  test("footer wajib bisa dicapai", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/langit-laut");
    await petaSiap(page);
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeInViewport();
    await expect(footer).toContainText("bukan situs resmi");
  });

  for (const tema of ["light", "dark"] as const) {
    for (const mode of ["hujan", "ombak", "cctv"]) {
      test(`axe ${mode} tema ${tema}`, async ({ page }) => {
        await tiruSumber(page);
        await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
        await page.goto(`/langit-laut?mode=${mode}`);
        await petaSiap(page);
        await page.waitForTimeout(800);
        const { violations } = await new AxeBuilder({ page }).exclude(".maplibregl-canvas").analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }
});

test.describe("route radar", () => {
  test("menolak timestamp yang tidak sah", async ({ request }) => {
    expect((await request.get("/api/radar-citra/abc")).status()).toBe(400);
    expect((await request.get("/api/radar-citra/..%2F..%2Fetc")).status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe("kotak Hari Ini", () => {
  test("tampil dan peringatan yang belum diketahui jujur", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/");
    const kotak = page.locator(".bch-hari-ini");
    await expect(kotak.getByRole("heading", { name: "Hari ini" })).toBeVisible();
    await expect(kotak).toContainText("Status belum tersedia");
    await expect(kotak).toContainText("proksi");
  });

  test("Langit & Laut tertaut dari beranda", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/");
    await expect(page.locator(".bch-card", { hasText: "Langit & Laut" })).toHaveAttribute("href", "/langit-laut");
  });
});

test.describe("PWA", () => {
  test("manifest dan service worker tersedia", async ({ request }) => {
    const m = await (await request.get("/manifest.webmanifest")).json();
    expect(m.short_name).toBe("Batam City Hall");
    expect((await request.get("/sw.js")).status()).toBe(200);
    expect((await request.get("/icon-192.png")).status()).toBe(200);
    expect((await request.get("/icon-512.png")).status()).toBe(200);
  });
});

// ---- Peringatan dini cuaca dan gempa. Semua ditiru: tes tidak boleh memanggil BMKG. ----
const jamLagi = (jam: number) => new Date(Date.now() + jam * 3600000).toISOString();

const PERINGATAN_BATAM = {
  id: "2.49.0.1.360.0.2026.11.05.03.21.001",
  kode: "CKR20261105001",
  kejadian: "Hujan Lebat dan Petir",
  judul: "Hujan Lebat disertai Petir di Kep. Riau",
  deskripsi:
    "Hujan lebat disertai petir akan terjadi di sebagian wilayah Kep. Riau, khususnya di BATU AJI, SAGULUNG.\n Kondisi ini berpotensi menimbulkan dampak berupa jarak pandang berkurang.",
  terbit: jamLagi(-1),
  mulai: jamLagi(-1),
  sampai: jamLagi(1),
  keparahan: "Moderate",
  urgensi: "Immediate",
  kepastian: "Observed",
  wilayah: "Kep. Riau",
  batam: ["Batu Aji", "Sagulung"],
  web: "https://nowcasting.bmkg.go.id/infografis/CKR/2026/11/05/infografis.jpg",
  poligon: [
    [
      [103.97, 1.04],
      [104.0, 1.04],
      [104.0, 1.07],
      [103.97, 1.04],
    ],
  ],
};
const PERINGATAN_LUAR = {
  ...PERINGATAN_BATAM,
  id: "2.49.0.1.360.0.2026.11.05.03.21.002",
  kode: "CKR20261105002",
  deskripsi: "Hujan lebat disertai petir akan terjadi di sebagian wilayah Kep. Riau, khususnya di KARIMUN, MORO.",
  batam: [],
};
const GEMPA_DEKAT = {
  waktu: jamLagi(-2),
  tanggal: "05 Nov 2026",
  jam: "09:00:00 WIB",
  lat: 0.5,
  lon: 101,
  magnitudo: 5.3,
  kedalamanKm: 10,
  wilayah: "Pusat gempa berada di darat 40 km utara Pekanbaru",
  potensi: "Tidak berpotensi tsunami",
  dirasakan: "III Pekanbaru",
  shakemap: "20261105090000.mmi.jpg",
  daftar: ["terbaru"],
  jarakKm: 280,
  arah: "barat",
};
const GEMPA_JAUH = {
  ...GEMPA_DEKAT,
  waktu: jamLagi(-30),
  lat: -1.14,
  lon: 120.15,
  magnitudo: 3.4,
  wilayah: "Pusat gempa berada di darat 40 km timur laut Sigi",
  dirasakan: "III Sigi, II Palu",
  potensi: "",
  shakemap: "",
  daftar: ["dirasakan"],
  jarakKm: 1796,
  arah: "timur",
};

async function tiruPeringatan(page: Page, peringatan: unknown[], status = "ok") {
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status, diambil: jamLagi(0), peringatan } }),
  );
}
async function tiruGempa(page: Page, gempa: unknown[], status = "ok") {
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status, diambil: jamLagi(0), gempa } }));
}

test.describe("peringatan cuaca di kotak Hari Ini", () => {
  test("yang mengenai Batam disebut kecamatannya", async ({ page }) => {
    await tiruSumber(page);
    await tiruPeringatan(page, [PERINGATAN_BATAM]);
    await page.goto("/");
    const baris = page.locator('.bch-hari-ini [data-baris="cuaca"]');
    await expect(baris).toContainText("Hujan Lebat dan Petir di Batu Aji dan Sagulung sampai");
    await expect(baris.locator("a")).toHaveAttribute("href", "/langit-laut/peringatan");
  });

  test("tidak ada atau hanya di luar Batam: barisnya tidak tampil", async ({ page }) => {
    await tiruSumber(page);
    await tiruPeringatan(page, [PERINGATAN_LUAR]);
    await page.goto("/");
    await expect(page.locator(".bch-hari-ini").getByRole("heading", { name: "Hari ini" })).toBeVisible();
    await expect(page.locator('.bch-hari-ini [data-baris="feri"]')).toBeVisible();
    await expect(page.locator('.bch-hari-ini [data-baris="cuaca"]')).toHaveCount(0);
  });

  test("sudah lewat menurut jam pengguna: barisnya tidak tampil", async ({ page }) => {
    await tiruSumber(page);
    await tiruPeringatan(page, [{ ...PERINGATAN_BATAM, sampai: jamLagi(-0.1) }]);
    await page.goto("/");
    await expect(page.locator('.bch-hari-ini [data-baris="feri"]')).toBeVisible();
    await expect(page.locator('.bch-hari-ini [data-baris="cuaca"]')).toHaveCount(0);
  });

  test("sumber gagal ditulis gagal, tidak diam-diam kosong", async ({ page }) => {
    await tiruSumber(page);
    await page.route("**/api/peringatan-cuaca**", (r) =>
      r.fulfill({ status: 503, json: { status: "gagal", diambil: "", peringatan: [] } }),
    );
    await page.goto("/");
    const baris = page.locator('.bch-hari-ini [data-baris="cuaca"]');
    await expect(baris).toContainText("gagal dimuat");
    await expect(baris).not.toContainText("aman");
  });
});

test.describe("jalan masuk ke halaman BMKG", () => {
  test("kotak Hari Ini selalu menaut ke peringatan dan gempa", async ({ page }) => {
    await tiruSumber(page);
    await page.goto("/");
    const tautan = page.locator(".bch-hari-ini [data-tautan-bmkg]");
    await expect(tautan.getByRole("link", { name: "Peringatan cuaca" })).toHaveAttribute(
      "href",
      "/langit-laut/peringatan",
    );
    await expect(tautan.getByRole("link", { name: "Gempa terkini" })).toHaveAttribute("href", "/langit-laut/gempa");
  });
});

test.describe("gempa di kotak Hari Ini", () => {
  test("gempa dekat disebut dengan jaraknya", async ({ page }) => {
    await tiruSumber(page);
    await tiruGempa(page, [GEMPA_DEKAT, GEMPA_JAUH]);
    await page.goto("/");
    const baris = page.locator('.bch-hari-ini [data-baris="gempa"]');
    await expect(baris).toContainText("M 5,3, ±280 km barat Batam");
    await expect(baris).toContainText("Dirasakan: III Pekanbaru");
    await expect(baris.locator("a")).toHaveAttribute("href", "/langit-laut/gempa");
  });

  test("tidak relevan: barisnya tidak tampil", async ({ page }) => {
    await tiruSumber(page);
    await tiruGempa(page, [GEMPA_JAUH]);
    await page.goto("/");
    await expect(page.locator('.bch-hari-ini [data-baris="feri"]')).toBeVisible();
    await expect(page.locator('.bch-hari-ini [data-baris="gempa"]')).toHaveCount(0);
  });
});

test.describe("halaman peringatan cuaca", () => {
  test("Batam di atas, teks BMKG disalin, atribusi ada", async ({ page }) => {
    await tiruPeringatan(page, [PERINGATAN_BATAM, PERINGATAN_LUAR]);
    await page.goto("/langit-laut/peringatan");
    await expect(page.getByRole("heading", { level: 1, name: "Peringatan dini cuaca" })).toBeVisible();
    const batam = page.locator('section[aria-labelledby="peringatan-batam"]');
    await expect(batam.locator("[data-peringatan]")).toHaveCount(1);
    await expect(batam).toContainText("Kecamatan di Batam: Batu Aji dan Sagulung");
    await expect(batam).toContainText("khususnya di BATU AJI, SAGULUNG");
    await expect(batam.getByRole("link", { name: "Infografis BMKG" })).toHaveAttribute(
      "href",
      /nowcasting\.bmkg\.go\.id/,
    );
    const lain = page.locator('section[aria-labelledby="peringatan-kepri"]');
    await expect(lain.locator("[data-peringatan]")).toHaveCount(1);
    await expect(page.locator("[data-daftar-peringatan] .bch-attrib")).toContainText("Sumber: BMKG");
    await expect(page.locator("[data-peringatan]").first().locator(".bch-badge")).toContainText("Berlaku");
  });

  test("kosong tidak ditulis aman", async ({ page }) => {
    await tiruPeringatan(page, []);
    await page.goto("/langit-laut/peringatan");
    const isi = page.locator("[data-daftar-peringatan]");
    await expect(isi).toContainText("BMKG tidak menyebut kecamatan di Batam");
    await expect(isi).toContainText("Tidak ada peringatan tidak berarti cuaca pasti baik");
  });

  test("gagal memberi jalan ke BMKG", async ({ page }) => {
    await page.route("**/api/peringatan-cuaca**", (r) =>
      r.fulfill({ status: 503, json: { status: "gagal", diambil: "", peringatan: [] } }),
    );
    await page.goto("/langit-laut/peringatan");
    const catatan = page.locator('[data-status="gagal"]');
    await expect(catatan).toContainText("gagal dimuat");
    await expect(catatan.getByRole("link", { name: "buka daftar BMKG" })).toHaveAttribute("href", /bmkg\.go\.id/);
    await expect(catatan.getByRole("button", { name: "Coba lagi" })).toBeVisible();
  });

  test("sebagian gagal diberi tahu", async ({ page }) => {
    await tiruPeringatan(page, [PERINGATAN_LUAR], "sebagian");
    await page.goto("/langit-laut/peringatan");
    await expect(page.locator('[data-status="sebagian"]')).toContainText("belum lengkap");
  });

  test("lolos axe", async ({ page }) => {
    await tiruPeringatan(page, [PERINGATAN_BATAM, PERINGATAN_LUAR]);
    await page.goto("/langit-laut/peringatan");
    await expect(page.locator("[data-peringatan]").first()).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("halaman gempa", () => {
  test("gempa terbaru dan daftar, jarak dihitung dari Batam", async ({ page }) => {
    await tiruGempa(page, [GEMPA_DEKAT, GEMPA_JAUH]);
    await page.goto("/langit-laut/gempa");
    await expect(page.getByRole("heading", { level: 1, name: "Gempa terkini" })).toBeVisible();
    const terbaru = page.locator("[data-gempa-terbaru]");
    await expect(terbaru).toContainText("M 5,3");
    await expect(terbaru).toContainText("±280 km barat Batam");
    await expect(terbaru).toContainText("Tidak berpotensi tsunami");
    await expect(terbaru.getByRole("link", { name: "Peta guncangan BMKG" })).toHaveAttribute(
      "href",
      "https://static.bmkg.go.id/20261105090000.mmi.jpg",
    );
    await expect(page.locator("[data-gempa]")).toHaveCount(1);
    await expect(page.locator("[data-gempa]")).toContainText("±1.800 km timur Batam");
    await expect(page.locator("[data-tsunami]")).toHaveCount(0);
    await expect(page.locator("[data-daftar-gempa] .bch-attrib")).toContainText("BMKG");
  });

  test("potensi tsunami dari BMKG ditampilkan dengan ikon dan kata", async ({ page }) => {
    await tiruGempa(page, [{ ...GEMPA_JAUH, waktu: jamLagi(-1), potensi: "Berpotensi tsunami" }]);
    await page.goto("/langit-laut/gempa");
    const catatan = page.locator("[data-tsunami]");
    await expect(catatan).toContainText("BMKG menyebut potensi tsunami");
    await expect(catatan).toContainText("tidak menilai apakah Batam terdampak");
    await expect(catatan.locator("svg")).toHaveCount(1);
  });

  test("gagal memberi jalan ke BMKG", async ({ page }) => {
    await page.route("**/api/gempa", (r) =>
      r.fulfill({ status: 503, json: { status: "gagal", diambil: "", gempa: [] } }),
    );
    await page.goto("/langit-laut/gempa");
    const catatan = page.locator('[data-status="gagal"]');
    await expect(catatan).toContainText("gagal dimuat");
    await expect(catatan.getByRole("link", { name: "buka data BMKG" })).toHaveAttribute("href", /bmkg\.go\.id/);
  });

  test("lolos axe", async ({ page }) => {
    await tiruGempa(page, [GEMPA_DEKAT, GEMPA_JAUH]);
    await page.goto("/langit-laut/gempa");
    await expect(page.locator("[data-gempa-terbaru]")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
  });
});

test.describe("peringatan cuaca di radar", () => {
  test("label di panel mengikuti wilayah Batam", async ({ page }) => {
    await tiruSumber(page);
    await tiruPeringatan(page, [PERINGATAN_BATAM]);
    await page.goto("/langit-laut");
    const chip = page.locator(".warn-chip");
    await expect(chip).toContainText("Peringatan dini BMKG: Hujan Lebat dan Petir di Batu Aji dan Sagulung");
    await expect(chip.getByRole("link")).toHaveAttribute("href", "/langit-laut/peringatan");
  });

  test("peringatan di luar Batam tidak memberi label pada wilayah Batam", async ({ page }) => {
    await tiruSumber(page);
    await tiruPeringatan(page, [PERINGATAN_LUAR]);
    await page.goto("/langit-laut");
    await expect(page.locator(".answer")).toBeVisible();
    await expect(page.locator(".warn-chip")).toHaveCount(0);
  });
});
