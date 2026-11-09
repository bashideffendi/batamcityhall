import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Tempat dari data terbuka Overture: halamannya dibuat saat pertama dibuka. Semua /api/* ditiru supaya tes tidak
// memanggil MSS, BMKG, Open-Meteo, atau feed berita.

type Mentah = { id: string; nama: string; kategori: string; sub: string; telepon: string | null };
const DATA = JSON.parse(readFileSync(join(process.cwd(), "data/tempat-terbuka.json"), "utf8")).tempat as Mentah[];
const HOTEL = DATA.find((t) => t.kategori === "akomodasi" && t.telepon) as Mentah;
const MAKAN = DATA.find((t) => t.kategori === "kuliner") as Mentah;

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test.describe("halaman tempat dari data terbuka", () => {
  test("dibuat saat dibuka: nama, titik perkiraan, telepon tetap", async ({ page }) => {
    const res = await page.goto(`/info/tempat/${HOTEL.id}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: HOTEL.nama })).toBeVisible();
    await expect(page.locator("main")).toContainText("Titik ini perkiraan area.");
    await expect(page.locator("main")).toContainText(HOTEL.telepon as string);
    await expect(page.locator("main")).not.toContainText(/\bAnda\b/);
  });

  test("tempat makan dari data terbuka tidak menaut ke bagian Makanan", async ({ page }) => {
    await page.goto(`/info/tempat/${MAKAN.id}`);
    await expect(page.getByRole("heading", { level: 1, name: MAKAN.nama })).toBeVisible();
    await expect(page.getByRole("link", { name: "Lihat di Makanan" })).toHaveCount(0);
  });

  test("kartu bagikan dibuat saat diminta", async ({ request }) => {
    const r = await request.get(`/info/tempat/${HOTEL.id}/opengraph-image`);
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain("image/png");
  });

  test("id yang tidak ada tetap 404", async ({ page }) => {
    const res = await page.goto("/info/tempat/ov-000000000000");
    expect(res?.status()).toBe(404);
  });

  test("lolos axe", async ({ page }) => {
    await page.goto(`/info/tempat/${HOTEL.id}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});

test.describe("direktori dan kredit", () => {
  test("kategori Kesehatan memuat jenis baru dari data terbuka", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    const saring = page.getByRole("navigation", { name: "Saringan" });
    await expect(saring.getByRole("link", { name: /^Klinik \d+/ })).toBeVisible();
    await expect(saring.getByRole("link", { name: /^Apotek \d+/ })).toBeVisible();
  });

  test("Kolofon dan Standar Redaksi menyebut Overture", async ({ page }) => {
    await page.goto("/kolofon");
    await expect(page.locator("main")).toContainText("Overture Maps Foundation (CDLA-Permissive-2.0)");
    await page.goto("/standar-redaksi");
    await expect(page.locator("main")).toContainText("data terbuka Overture Maps");
  });
});
