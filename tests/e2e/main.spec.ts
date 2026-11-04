import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test("kalkulator tidak menebak kurs", async ({ page }) => {
  await page.goto("/main/singapura-atau-nagoya");
  await expect(page.getByRole("status")).toContainText("Kami tidak menebak kurs");
  await page.getByLabel(/Kurs 1 dolar/).fill("12000");
  await expect(page.getByRole("status")).toContainText("Rp1.049.000");
  await expect(page.getByRole("status")).toContainText("Rp10.000");
});

test("kartu pos menggambar dan bisa diunduh", async ({ page }) => {
  await page.goto("/main/kartu-pos");
  const kanvas = page.locator("canvas");
  await expect(kanvas).toBeVisible();
  const terisi = await kanvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext("2d")?.getImageData(600, 400, 1, 1).data;
    return !!d && d[3] > 0;
  });
  expect(terisi).toBe(true);
  await page.getByRole("textbox", { name: "Pesan" }).fill("Ombak tenang, feri jalan.");
  const [unduhan] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Unduh kartu pos" }).click(),
  ]);
  expect(unduhan.suggestedFilename()).toBe("kartu-pos-batam.png");
});

test("peta vibe punya daftar dan tanpa kategori kelompok", async ({ page }) => {
  await page.goto("/main/vibe");
  await expect(page.getByRole("heading", { name: "Ngopi", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Macet", level: 2 })).toBeVisible();
  const label = await page.locator(".mm-vibe-saring label").allTextContents();
  expect(label.join(" ")).not.toMatch(/etnis|suku|agama|kelas/i);
  expect(await page.locator(".mm-vibe-daftar li").count()).toBeGreaterThan(10);
});

for (const tema of ["light", "dark"] as const) {
  for (const h of ["/main", "/main/kartu-pos", "/main/singapura-atau-nagoya", "/main/vibe"]) {
    test(`${h} (${tema}) tanpa pelanggaran axe dan tanpa scroll horizontal`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: tema });
      await page.goto(h);
      await expect(page.locator("main")).toBeVisible();
      const hasil = await new AxeBuilder({ page }).analyze();
      expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
      await page.setViewportSize({ width: 360, height: 740 });
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih).toBeLessThanOrEqual(0);
    });
  }
}
