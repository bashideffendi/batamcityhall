import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Menu Dataset. Sumber cuaca tidak boleh terpanggil dari tes.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

const tanpaPelanggaran = async (page: import("@playwright/test").Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
};

test("halaman Dataset: tema, penyedia tanpa tautan, dan lolos axe", async ({ page }) => {
  await page.goto("/dataset");
  await expect(page.getByRole("heading", { level: 1, name: "Dataset" })).toBeVisible();
  const kartu = page.locator(".ds-tema a");
  expect(await kartu.count()).toBeGreaterThan(5);
  await expect(page.getByRole("heading", { name: "Penyedia" })).toBeVisible();
  // Penyedia disebut sebagai teks; tidak ada tautan keluar situs di isi halaman.
  expect(await page.locator('main a[href^="http"]').count()).toBe(0);
  await tanpaPelanggaran(page);
});

test("tema menuju halaman dataset dengan keterangan, catatan, dan pratinjau yang bisa digulir", async ({ page }) => {
  await page.goto("/dataset/tema/transportasi");
  await expect(page.getByRole("heading", { level: 1, name: "Transportasi dan Pelabuhan" })).toBeVisible();
  await page.getByRole("link", { name: "Rekapitulasi Kunjungan Kapal Penumpang" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Rekapitulasi Kunjungan Kapal Penumpang" })).toBeVisible();
  const info = page.locator(".bch-tabel-info");
  await expect(info).toContainText("Penyedia");
  await expect(info).toContainText("Portal Satu Data BP Batam");
  await expect(info).toContainText("Tidak dinyatakan oleh penyedia");
  await expect(page.locator(".ds-catatan")).toContainText("GT");
  const wadah = page.getByRole("region", { name: "Tabel Pratinjau" });
  await expect(wadah).toHaveAttribute("tabindex", "0");
  expect(await wadah.locator("tbody tr").count()).toBeGreaterThan(0);
  expect(await page.locator('main a[href^="http"]').count()).toBe(0);
  await tanpaPelanggaran(page);
});

test("data peta tampil sebagai atribut, tanpa kolom tautan foto", async ({ page }) => {
  await page.goto("/dataset/sebaran-bangunan-niaga");
  await expect(page.locator(".bch-tabel-info")).toContainText("Peta titik");
  await expect(page.locator("main")).toContainText("tanpa bentuk petanya");
  await expect(page.locator("main thead")).not.toContainText(/img_link|foto|gambar/i);
});

test("alamat dataset yang tidak ada menjawab 404", async ({ request }) => {
  expect((await request.get("/dataset/tidak-ada-dataset-ini")).status()).toBe(404);
  expect((await request.get("/dataset/tema/tidak-ada")).status()).toBe(404);
});
