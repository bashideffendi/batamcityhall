import { existsSync } from "node:fs";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Rombak: slogan dan kalimat "bukan situs resmi" dihapus dari kaki halaman (PEDOMAN 2.9). Tersisa satu baris.
const KAKI = "Proyek independen warga Batam. Tanpa iklan.";
const ADA_TILE = existsSync(join(process.cwd(), "public", "tiles", "batam.pmtiles"));

const petaSiap = (page: Page) => expect(page.locator(".ll-peta .maplibregl-canvas")).toBeVisible({ timeout: 45_000 });

// Kotak Hari Ini memanggil route yang menarik data MSS dan BMKG. Tes tidak boleh membebani server mereka.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/berita", (r) => r.fulfill({ json: { item: [], sumber: [] } }));
  await page.route("**/api/frames", (r) => r.fulfill({ json: { frames: [], stale: true, echo: null } }));
  await page.route("**/api/ofs-frame", (r) =>
    r.fulfill({
      json: { baserun: "", frames: [], nowIndex: 0, fallback: true, source: "blind", ageH: 0, expired: false },
    }),
  );
  await page.route("**/api/perairan", (r) =>
    r.fulfill({ json: { code: "P.R.02", name: "", issued: "", current: null, upcoming: false, warns: [], slots: [] } }),
  );
});

test.beforeEach(async ({ page }) => {
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
});

test.describe("teks wajib", () => {
  for (const path of ["/", "/tentang", "/kolofon", "/tidak-ada"]) {
    test(`kaki halaman dan atribusi ada di ${path}`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator("footer");
      await expect(footer).toContainText(KAKI);
      await expect(footer.locator(".bch-footer-atas")).toBeVisible();
      // Kaki situs berisi tentang situs, kebijakan, dan newsletter, bukan menu.
      await expect(footer.getByRole("link", { name: "Radar Hujan" })).toHaveCount(0);
      await expect(footer.getByText("Newsletter", { exact: true })).toBeVisible();
      await expect(footer.locator(".bch-footer-bawah")).toBeVisible();
      for (const t of ["Tentang", "Kolofon", "Kirim Koreksi", "Privasi", "Syarat Penggunaan"]) {
        await expect(footer.getByRole("link", { name: t })).toBeVisible();
      }
    });
  }

  test("atribusi peta ada di peta beranda dan di Kolofon", async ({ page }) => {
    await page.goto("/kolofon");
    await expect(page.locator("main")).toContainText("OpenStreetMap");
    await expect(page.locator("main")).toContainText("Protomaps");
    await page.goto("/");
    await expect(page.locator("#isi")).toContainText("OpenStreetMap");
    await expect(page.locator("#isi")).toContainText("Protomaps");
  });
});

test.describe("halaman", () => {
  test("404 bernada kalem, berstatus 404, dan memberi jalan keluar", async ({ page }) => {
    const res = await page.goto("/tidak-ada");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Halaman Tidak Ditemukan");
    await expect(page.getByRole("link", { name: "Nomor Darurat" }).last()).toHaveAttribute("href", "/info/darurat");
    await expect(page.locator("#isi").getByRole("link", { name: /Cari/ })).toHaveAttribute("href", "/cari");
  });

  test("Tentang menyatakan tanpa iklan dan tanpa pelacak", async ({ page }) => {
    await page.goto("/tentang");
    await expect(page.getByRole("heading", { level: 1, name: "Tentang Barelang.co" })).toBeVisible();
    await expect(page.locator("main")).toContainText("tidak memasang iklan, tidak memakai pelacak");
  });

  test("Kolofon mencatat ketiga huruf", async ({ page }) => {
    await page.goto("/kolofon");
    for (const f of ["Newsreader", "Plus Jakarta Sans", "IBM Plex Mono"]) {
      await expect(page.locator("main")).toContainText(f);
    }
  });

  test("font situs benar-benar terpasang, bukan fallback", async ({ page }) => {
    await page.goto("/tentang");
    const serif = await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily);
    expect(serif).toMatch(/Newsreader/);
    const sans = await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily);
    expect(sans).toMatch(/Plus_Jakarta_Sans|Plus Jakarta Sans/);
  });
});

test.describe("peta", () => {
  test.skip(!ADA_TILE, "public/tiles/batam.pmtiles belum ada: jalankan scripts/extract-basemap.mjs");

  test("peta beranda tampil di dua tema", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/");
    await petaSiap(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.getByRole("button", { name: "Ganti ke tampilan gelap" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".ll-peta .maplibregl-canvas")).toBeVisible();
    // Pilihan tersimpan menang atas preferensi sistem setelah dimuat ulang.
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("mengikuti prefers-color-scheme tanpa pilihan tersimpan", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.emulateMedia({ colorScheme: "light" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("atribusi dan tombol zoom ada", async ({ page }) => {
    await page.goto("/");
    await petaSiap(page);
    await expect(page.locator("#isi")).toContainText("OpenStreetMap");
    await expect(page.getByRole("button", { name: "Perbesar peta" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Perkecil peta" })).toBeVisible();
  });

  test("tidak ada galat konsol dan tidak ada permintaan ke luar situs", async ({ page, baseURL }) => {
    const galat: string[] = [];
    const luar: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !m.text().startsWith("Failed to load resource")) galat.push(m.text());
    });
    page.on("pageerror", (e) => galat.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) galat.push(`${r.status()} ${r.url()}`);
    });
    page.on("request", (r) => {
      const url = new URL(r.url());
      if (url.protocol.startsWith("http") && url.origin !== baseURL) luar.push(r.url());
    });
    await page.goto("/");
    await petaSiap(page);
    await page.waitForTimeout(1500);
    // /api/* ditiru dengan 503 di beforeEach lain; yang dihitung galat hanya yang bukan tiruan.
    expect(galat.filter((g) => !g.includes("/api/"))).toEqual([]);
    expect(luar).toEqual([]);
  });

  test("tile disajikan dengan byte range", async ({ request }) => {
    const res = await request.get("/tiles/batam.pmtiles", { headers: { Range: "bytes=0-126" } });
    expect(res.status()).toBe(206);
    expect((await res.body()).subarray(0, 7).toString()).toBe("PMTiles");
  });
});

test.describe("peta gagal", () => {
  test("berkas tile yang tidak bisa dimuat tidak membuat halaman rusak", async ({ page }) => {
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.route("**/tiles/batam.pmtiles", (route) => route.fulfill({ status: 404, body: "" }));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.waitForTimeout(2000);
    expect(galat).toEqual([]);
  });
});

test.describe("aksesibilitas", () => {
  for (const path of ["/", "/tentang", "/kolofon", "/tidak-ada"]) {
    for (const tema of ["light", "dark"] as const) {
      test(`axe ${path} tema ${tema}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
        await page.goto(path);
        if (path === "/" && ADA_TILE) await petaSiap(page);
        const { violations } = await new AxeBuilder({ page }).exclude(".maplibregl-canvas").analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }

  test("tautan lompat ke isi berfungsi", async ({ page }) => {
    test.skip(test.info().project.name === "hp", "tidak ada keyboard fisik di profil HP");
    await page.goto("/tentang");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Langsung ke isi" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#isi")).toBeFocused();
  });
});

// PEDOMAN bagian 6: tetap ada di kode, tetapi noindex dan tidak ditautkan.
test.describe("halaman tersembunyi", () => {
  const TERSEMBUNYI = [
    "/mural",
    "/mural/cara-dibuat",
    "/cerita/dulu",
    "/info/warga-baru",
    "/cerita/rempang",
    "/cerita/kampung-tua/legalitas",
  ];

  for (const h of TERSEMBUNYI) {
    test(`${h} noindex`, async ({ page }) => {
      await page.goto(h);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    });
  }

  test("tidak ada di sitemap", async ({ request }) => {
    const peta = await (await request.get("/sitemap.xml")).text();
    for (const h of [...TERSEMBUNYI, "/mural/gcp", "/admin"]) expect(peta).not.toContain(`${h}<`);
  });

  for (const h of ["/", "/cerita", "/info", "/cerita/sejarah", "/cerita/kampung-tua", "/komunitas", "/kartu-pos"]) {
    test(`${h} tidak menautkannya`, async ({ page }) => {
      await page.goto(h);
      const href = await page.locator("a[href]").evaluateAll((a) => a.map((x) => x.getAttribute("href") ?? ""));
      for (const t of [...TERSEMBUNYI, "/mural/gcp", "/admin"]) {
        expect(href.filter((x) => x === t || x.startsWith(`${t}#`) || x.startsWith(`${t}?`))).toEqual([]);
      }
    });
  }
});
