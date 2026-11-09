import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Purwarupa sampul beranda (9 Nov 2026): gambar selebar layar dan menu di pita bawah; menu yang diklik membuka
// halaman dengan kepala normal. Semua /api/* ditiru supaya tes tidak memanggil MSS, BMKG, atau feed berita.

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test.describe("sampul beranda", () => {
  test("gambar selebar layar, judul Jurnal, keterangan AI dan OpenStreetMap, tanpa kepala biasa", async ({ page }) => {
    await page.goto("/");
    const sampul = page.getByRole("region", { name: "Sampul" });
    await expect(sampul.locator("img")).toHaveAttribute("alt", /Peta isometrik/);
    const kotak = await sampul.boundingBox();
    expect(Math.round(kotak?.width ?? 0)).toBe(page.viewportSize()?.width);
    // Judul sampul adalah tulisan Jurnal terbaru (di mode uji bisa tulisan buatan tes admin).
    await expect(sampul.getByRole("heading", { level: 2 }).getByRole("link")).toHaveAttribute("href", /^\/jurnal\/.+/);
    await expect(sampul).toContainText("Ilustrasi dibuat dengan AI dari data peta © kontributor OpenStreetMap");
    // Kepala biasa tidak tampil di beranda; menunya ada di pita bawah sampul.
    await expect(page.locator("header.bch-kepala")).toHaveCount(0);
    await expect(page.locator('nav[aria-label="Bagian situs"]')).toHaveCount(1);
  });

  test("pita menu di dasar sampul, dan menu membuka halaman berkepala normal", async ({ page }, info) => {
    test.skip(info.project.name === "hp", "menu lebar hanya di layar lebar");
    await page.goto("/");
    const sampul = page.getByRole("region", { name: "Sampul" });
    const pita = page.locator(".bch-sampul-pita");
    const [s, p] = [await sampul.boundingBox(), await pita.boundingBox()];
    expect(Math.round((p?.y ?? 0) + (p?.height ?? 0))).toBe(Math.round((s?.y ?? 0) + (s?.height ?? 0)));
    await pita.getByRole("link", { name: "Cuaca", exact: true }).click();
    await expect(page).toHaveURL(/\/cuaca$/);
    await expect(page.locator("header.bch-kepala .bch-wordmark")).toBeVisible();
    await expect(page.getByRole("region", { name: "Sampul" })).toHaveCount(0);
  });

  test("di ponsel tombol Menu membuka menu layar penuh", async ({ page }, info) => {
    test.skip(info.project.name !== "hp", "tombol Menu hanya di layar sempit");
    await page.goto("/");
    await page.getByRole("button", { name: "Buka menu" }).click();
    await expect(page.locator("#bch-toc")).toBeVisible();
    await expect(page.locator("#bch-toc .bch-toc-bagian").first()).toHaveText("Beranda");
  });

  test("desktop: peta interaktif menggantikan gambar, gulir biasa tetap menggulir halaman", async ({ page }, info) => {
    test.skip(info.project.name === "hp", "peta langsung dimuat hanya di layar bertetikus");
    await page.goto("/");
    const peta = page.locator(".bch-peta-sampul");
    await expect(peta).toHaveAttribute("data-keadaan", "siap", { timeout: 30_000 });
    await expect(page.locator(".bch-sampul picture")).toHaveCSS("opacity", "0");
    await page.mouse.move(600, 400);
    await page.mouse.wheel(0, 300);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });

  test("Jelajahi: layar penuh, posisi di alamat, Esc menutup dan fokus kembali", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jelajahi Peta" }).click();
    const dialog = page.getByRole("dialog", { name: "Jelajahi Peta" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Tutup" })).toBeFocused();
    await expect(page.locator(".bch-peta-sampul .openseadragon-canvas").first()).toBeAttached({ timeout: 30_000 });
    await dialog.getByRole("button", { name: "Perbesar peta isometrik" }).click();
    await expect.poll(() => page.evaluate(() => location.hash), { timeout: 10_000 }).toMatch(/^#\d+,\d+,\d*\.?\d+$/);
    await expect(dialog).toContainText("Ilustrasi dibuat dengan AI");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate(() => location.hash)).toBe("");
    await expect(page.getByRole("button", { name: "Jelajahi Peta" })).toBeFocused();
  });

  test("alamat berposisi langsung membuka Jelajahi", async ({ page }) => {
    await page.goto("/#7400,2600,1.5000");
    await expect(page.getByRole("dialog", { name: "Jelajahi Peta" })).toBeVisible({ timeout: 15_000 });
  });

  test("ponsel: peta baru dimuat setelah Jelajahi ditekan", async ({ page }, info) => {
    test.skip(info.project.name !== "hp", "hanya layar sentuh");
    await page.goto("/");
    await page.waitForTimeout(1500);
    await expect(page.locator(".openseadragon-canvas")).toHaveCount(0);
    await page.getByRole("button", { name: "Jelajahi Peta" }).click();
    await expect(page.locator(".bch-peta-sampul .openseadragon-canvas").first()).toBeAttached({ timeout: 30_000 });
  });

  test("Jelajahi lolos axe", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Jelajahi Peta" }).click();
    await expect(page.locator(".bch-peta-sampul .openseadragon-canvas").first()).toBeAttached({ timeout: 30_000 });
    const { violations } = await new AxeBuilder({ page }).include(".bch-peta-sampul").analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

  test("sampul lolos axe di dua tema", async ({ page }) => {
    for (const tema of ["light", "dark"] as const) {
      await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
      await page.goto("/");
      const { violations } = await new AxeBuilder({ page }).include(".bch-sampul").analyze();
      expect(violations.map((v) => `${tema} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    }
  });
});
