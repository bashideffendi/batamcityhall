import { existsSync } from "node:fs";
import { join } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { PNG } from "pngjs";

const DISCLAIMER =
  "Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id.";
const ADA_TILE = existsSync(join(process.cwd(), "public", "tiles", "batam.pmtiles"));

const petaSiap = (page: Page) =>
  expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 45_000 });

/** Porsi piksel peta yang persis berwarna `hex`. Tidak bergantung pada titik tertentu di layar. */
async function porsiWarna(page: Page, hex: string) {
  const png = PNG.sync.read(await page.locator(".peta").screenshot());
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  let cocok = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i] === r && png.data[i + 1] === g && png.data[i + 2] === b) cocok++;
  }
  return cocok / (png.width * png.height);
}

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
    test(`disclaimer dan atribusi ada di ${path}`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator("footer");
      await expect(footer).toContainText(DISCLAIMER);
      await expect(footer).toContainText("Peta dasar © OpenStreetMap contributors, Protomaps");
    });
  }
});

test.describe("halaman", () => {
  test("404 bernada kalem dan berstatus 404", async ({ page }) => {
    const res = await page.goto("/tidak-ada");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Halaman ini tenggelam.");
    await expect(page.getByText("Kemungkinan di sekitar 1°N.")).toBeVisible();
  });

  test("Tentang memuat angka dari statistik data", async ({ page }) => {
    await page.goto("/tentang");
    await expect(page.getByText("Direktori saat ini memuat 892 tempat")).toBeVisible();
  });

  test("Kolofon mencatat ketiga huruf", async ({ page }) => {
    await page.goto("/kolofon");
    for (const f of ["Source Serif 4", "Plus Jakarta Sans", "IBM Plex Mono"]) {
      await expect(page.getByText(f, { exact: true })).toBeVisible();
    }
  });

  test("font situs benar-benar terpasang, bukan fallback", async ({ page }) => {
    await page.goto("/tentang");
    const serif = await page.locator("h1").evaluate((el) => getComputedStyle(el).fontFamily);
    expect(serif).toMatch(/Source_Serif_4|Source Serif 4/);
    const sans = await page.locator("body").evaluate((el) => getComputedStyle(el).fontFamily);
    expect(sans).toMatch(/Plus_Jakarta_Sans|Plus Jakarta Sans/);
  });
});

test.describe("peta", () => {
  test.skip(!ADA_TILE, "public/tiles/batam.pmtiles belum ada: jalankan scripts/extract-basemap.mjs");

  test("tampil di dua tema dengan warna token", async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/");
    await petaSiap(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.waitForTimeout(800);
    expect(await porsiWarna(page, "#DCE3E1"), "laut siang").toBeGreaterThan(0.1);
    expect(await porsiWarna(page, "#F4EFE4"), "darat siang").toBeGreaterThan(0.1);
    await page.locator(".peta").screenshot({ path: info.outputPath("peta-siang.png") });

    await page.getByRole("button", { name: "Ganti ke chart malam" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator(".peta")).toHaveAttribute("data-tema", "dark");
    await page.waitForTimeout(800);
    expect(await porsiWarna(page, "#0F1B2A"), "laut malam").toBeGreaterThan(0.1);
    expect(await porsiWarna(page, "#16263A"), "darat malam").toBeGreaterThan(0.1);
    expect(await porsiWarna(page, "#DCE3E1"), "sisa warna siang").toBe(0);
    await page.locator(".peta").screenshot({ path: info.outputPath("peta-malam.png") });

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

  test("ornamen chart lengkap dan koordinat berformat Indonesia", async ({ page }) => {
    await page.goto("/");
    await petaSiap(page);
    await expect(page.locator(".peta-kartusis")).toContainText("Bukan untuk navigasi");
    await expect(page.locator(".peta-kartusis")).toContainText(/Skala 1 : [\d.]+/);
    await expect(page.locator(".peta-mawar")).toBeVisible();
    await expect(page.locator(".peta-skala")).toContainText("km");
    await expect(page.locator(".peta-skala")).toContainText("mil laut");
    expect(await page.locator(".peta-tepi-label").count()).toBeGreaterThan(0);
    await expect(
      page
        .locator(".peta-tepi-label")
        .filter({ hasText: /°\d{2}′ T$/ })
        .first(),
    ).toBeAttached();
    await expect(
      page
        .locator(".peta-tepi-label")
        .filter({ hasText: /°\d{2}′ U$/ })
        .first(),
    ).toBeAttached();
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap");
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("Protomaps");
  });

  test("tombol zoom mengubah skala", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await petaSiap(page);
    const skala = page.locator(".peta-kartusis-skala");
    const awal = await skala.textContent();
    await page.getByRole("button", { name: "Perbesar peta" }).click();
    await expect(skala).not.toHaveText(awal ?? "");
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
    expect(galat).toEqual([]);
    expect(luar).toEqual([]);
  });

  test("tile disajikan dengan byte range", async ({ request }) => {
    const res = await request.get("/tiles/batam.pmtiles", { headers: { Range: "bytes=0-126" } });
    expect(res.status()).toBe(206);
    expect((await res.body()).subarray(0, 7).toString()).toBe("PMTiles");
  });

  test("tekstur kertas mati di atas peta dan hidup di halaman lain", async ({ page }) => {
    await page.goto("/");
    await petaSiap(page);
    await expect(page.locator("body")).toHaveClass(/bch-no-grain/);
    await page.goto("/tentang");
    await expect(page.locator("body")).not.toHaveClass(/bch-no-grain/);
    const res = await page.request.get("/tex/grain-256.webp");
    expect(res.status()).toBe(200);
  });
});

test.describe("peta gagal", () => {
  test("pesan jujur saat berkas tile tidak bisa dimuat", async ({ page }) => {
    await page.route("**/tiles/batam.pmtiles", (route) => route.fulfill({ status: 404, body: "" }));
    await page.goto("/");
    await expect(page.locator(".peta")).toHaveAttribute("data-status", "gagal", { timeout: 45_000 });
    await expect(page.getByText("Peta gagal dimuat. Laut masih ada, kami saja yang belum.")).toBeVisible();
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
    "/main/vibe",
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

  for (const h of ["/", "/cerita", "/info", "/main", "/cerita/sejarah", "/cerita/kampung-tua"]) {
    test(`${h} tidak menautkannya`, async ({ page }) => {
      await page.goto(h);
      const href = await page.locator("a[href]").evaluateAll((a) => a.map((x) => x.getAttribute("href") ?? ""));
      for (const t of [...TERSEMBUNYI, "/mural/gcp", "/admin"]) {
        expect(href.filter((x) => x === t || x.startsWith(`${t}#`) || x.startsWith(`${t}?`))).toEqual([]);
      }
    });
  }
});
