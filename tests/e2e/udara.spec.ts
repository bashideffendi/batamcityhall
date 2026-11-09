import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Kualitas udara. /api/kualitas-udara ditiru, jadi tes tidak memanggil Open-Meteo. /api lain juga ditiru supaya
// tidak memanggil MSS, BMKG, atau feed berita.

const DEPAN = ["21:00", "00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00"].map((j, i) => ({
  waktu: `${i === 0 ? "2026-11-09" : "2026-11-10"}T${j}`,
  aqi: [57, 57, 56, 55, 58, 62, 104, 59][i],
  pm25: 12,
  pm10: 14,
}));

const CONTOH = {
  status: "ok",
  diambil: "2026-11-09T12:05:00.000Z",
  sekarang: { waktu: "2026-11-09T19:00", aqi: 57, pm25: 11.2, pm10: 12.9 },
  lalu: { min: 54, max: 57 },
  depan: DEPAN,
};

async function tiru(page: Page, udara: "ok" | "gagal") {
  await page.route("**/api/**", (r) => {
    const url = r.request().url();
    if (url.includes("/api/kualitas-udara"))
      return udara === "ok"
        ? r.fulfill({ json: CONTOH })
        : r.fulfill({ status: 503, json: { status: "gagal", diambil: null, sekarang: null, lalu: null, depan: [] } });
    if (url.includes("/api/frames")) return r.fulfill({ json: { frames: [], stale: true, echo: null } });
    if (url.includes("/api/perairan")) return r.fulfill({ json: { warns: [] } });
    if (url.includes("/api/gempa")) return r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } });
    if (url.includes("/api/peringatan-cuaca")) return r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } });
    if (url.includes("/api/berita")) return r.fulfill({ json: { item: [], sumber: [] } });
    return r.fulfill({ status: 503, json: {} });
  });
}

test.describe("halaman Kualitas Udara", () => {
  test("angka sekarang, kategori, saran, partikel, dan 24 jam ke depan", async ({ page }) => {
    await tiru(page, "ok");
    await page.goto("/cuaca/udara");
    await expect(page.getByRole("heading", { level: 1, name: "Kualitas Udara" })).toBeVisible();
    const kartu = page.locator("[data-udara-sekarang]");
    await expect(kartu).toHaveAttribute("data-udara-sekarang", "sedang");
    await expect(kartu).toContainText("Pukul 19.00 WIB");
    await expect(kartu).toContainText("AQI 57");
    await expect(kartu).toContainText("Sedang");
    await expect(kartu).toContainText("11,2 µg/m³");
    await expect(kartu).toContainText("AQI 54—57");
    const baris = page.locator("[data-udara-jam]");
    await expect(baris).toHaveCount(8);
    await expect(baris.nth(0)).toContainText("21.00");
    await expect(baris.nth(1)).toContainText("00.00 besok");
    await expect(baris.nth(6)).toContainText("Tidak Sehat bagi Kelompok Sensitif");
    // Arti angka tampil tanpa menunggu data.
    await expect(page.locator('section[aria-labelledby="udara-arti"] tbody tr')).toHaveCount(6);
    await expect(page.locator("body")).not.toContainText(/\bAnda\b/);
  });

  test("data gagal dimuat: jujur, tanpa angka, ada tombol muat ulang", async ({ page }) => {
    await tiru(page, "gagal");
    await page.goto("/cuaca/udara");
    await expect(page.locator('[data-status="gagal"]')).toContainText("belum dapat dimuat");
    await expect(page.getByRole("button", { name: "Muat Ulang" })).toBeVisible();
    await expect(page.locator("[data-udara-sekarang]")).toHaveCount(0);
  });

  for (const tema of ["light", "dark"] as const) {
    test(`lolos axe, tema ${tema}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
      await tiru(page, "ok");
      await page.goto("/cuaca/udara");
      await expect(page.locator("[data-udara-sekarang]")).toBeVisible();
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("jalan masuk", () => {
  test("baris Kualitas Udara di Hari Ini", async ({ page }) => {
    await tiru(page, "ok");
    await page.goto("/");
    const baris = page.locator('.br-pertama [data-baris="udara"]');
    await expect(baris).toContainText("AQI 57");
    await expect(baris).toContainText("Sedang, pukul 19.00 WIB");
    await expect(baris.getByRole("link", { name: "Kualitas Udara" })).toHaveAttribute("href", "/cuaca/udara");
  });

  test("baris Hari Ini saat data gagal", async ({ page }) => {
    await tiru(page, "gagal");
    await page.goto("/");
    await expect(page.locator('.br-pertama [data-baris="udara"]')).toContainText("Belum ada");
  });

  test("halaman Cuaca dan Kolofon", async ({ page }) => {
    await tiru(page, "ok");
    await page.goto("/cuaca");
    await expect(page.getByRole("link", { name: /Kualitas Udara/ }).first()).toBeVisible();
    await page.goto("/kolofon");
    await expect(page.locator("main")).toContainText("Kualitas udara: Open-Meteo");
  });
});
