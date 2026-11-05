import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Ruang Main dihapus pada rombak November 2026. Tersisa Kartu Pos di /kartu-pos (isi diuji di rombak.spec.ts).

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test("Kalkulator Singapura atau Nagoya dan Vibe tidak ada lagi", async ({ request }) => {
  for (const h of ["/main/singapura-atau-nagoya", "/main/vibe"]) {
    const r = await request.get(h);
    // Dialihkan ke halaman yang ada, atau 404. Yang penting bukan halaman lama.
    expect([200, 404], h).toContain(r.status());
    const teks = await r.text();
    expect(teks, h).not.toMatch(/Kurs 1 dolar|Peta Suasana|mm-vibe/);
  }
});

test("kartu pos memilih desain dan menulis pesan di pratinjau", async ({ page }) => {
  await page.goto("/kartu-pos");
  await expect(page.locator('input[name="desain"]')).toHaveCount(6);
  await page.getByRole("textbox", { name: "Pesan" }).fill("Ombak tenang, feri jalan.");
  await expect(page.locator(".kp-pratinjau")).toContainText("Ombak tenang, feri jalan.");
  await expect(page.getByRole("button", { name: "Cetak" })).toBeVisible();
});

for (const tema of ["light", "dark"] as const) {
  for (const h of ["/kartu-pos", "/cari"]) {
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
