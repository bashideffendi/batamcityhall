import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import fakta from "../../data/budaya/fakta_infografis.json" with { type: "json" };
import garis from "../../data/sejarah/garis_waktu.json" with { type: "json" };
import perubahan from "../../data/sejarah/perubahan_fisik.json" with { type: "json" };
import arsip from "../../data/sejarah/sumber_arsip.json" with { type: "json" };

// Halaman Loket 05 tidak memanggil API. Peta memakai tile lokal.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

async function aturTema(page: Page, tema: "light" | "dark") {
  await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
}

const tanpaGeserSamping = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

test.describe("landing", () => {
  test("menaut ke enam sub-halaman dan Kartu Pos, Batam Dulu disembunyikan", async ({ page }) => {
    await page.goto("/cerita");
    await expect(page.locator("main")).not.toContainText(/LOKET/i);
    await expect(page.getByRole("heading", { level: 1, name: "Sejarah dan Budaya" })).toBeVisible();
    for (const h of ["sejarah", "kampung-tua", "nama-jalan", "budaya", "kamus", "angka"]) {
      await expect(page.locator(`main a[href="/cerita/${h}"]`)).toHaveCount(1);
    }
    await expect(page.locator('main a[href="/kartu-pos"]')).toHaveCount(1);
    // Kalender dan Komunitas pindah ke bagian sendiri.
    for (const h of ["/cerita/kalender", "/cerita/komunitas"]) {
      await expect(page.locator(`main a[href="${h}"]`)).toHaveCount(0);
    }
    await expect(page.locator('main a[href="/cerita/dulu"]')).toHaveCount(0);
  });
});

test.describe("sejarah", () => {
  test("semua item garis waktu tampil", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    await expect(page.locator("[data-gw]")).toHaveCount(garis.length);
    for (const e of garis) await expect(page.locator(`[data-gw="${e.id}"]`)).toHaveCount(1);
  });

  test("filter status bekerja dan bisa dibatalkan", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    await page.locator('[data-filter-status="belum_terverifikasi"]').click();
    await expect(page.locator("[data-gw]")).toHaveCount(5);
    await expect(page.locator('[data-filter-status="belum_terverifikasi"]')).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Tampilkan semua" }).click();
    await expect(page.locator("[data-gw]")).toHaveCount(garis.length);
  });

  test("filter kategori bekerja", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    await page.getByLabel("Kategori").selectOption("kartografi");
    await expect(page.locator('[data-gw="gw-009"]')).toBeVisible();
    await expect(page.locator('[data-gw="gw-007"]')).toHaveCount(0);
  });

  test("Rempang bertanggal, beratribusi, tanpa luas", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    const r = page.locator('[data-gw="gw-t16"]');
    await expect(r.locator("time")).toHaveAttribute("datetime", "2023-08-28");
    await expect(r).toContainText("Terakhir diperbarui");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/8\.142|7\.572|17\.000 ha/);
  });

  test("label cerita rakyat dan catatan penyusun", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    await expect(page.locator('[data-versi-nama] [data-status="cerita_rakyat"]')).toHaveCount(5);
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/Jangan tampilkan|Sajikan|task_id|Disalin|zaman batu/i);
    expect(teks).not.toMatch(/Sumber:|Rincian status|Baca sumbernya|Campuran/);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });

  test("grafik penduduk memakai SVG dan semua titik ada di tabel", async ({ page }) => {
    await page.goto("/cerita/sejarah");
    await expect(page.locator("[data-tabel-penduduk] tbody tr")).toHaveCount(11);
    await expect(page.locator("[data-tabel-wisman] tbody tr")).toHaveCount(4);
    await expect(page.locator(".sj-grafik:visible").first()).toBeVisible();
    expect(await page.locator("main").innerText()).not.toContain("1,79 juta");
  });
});

test.describe("Batam Dulu", () => {
  test("slider mengubah keadaan kartu", async ({ page }) => {
    await page.goto("/cerita/dulu");
    await expect(page.locator("[data-pf]")).toHaveCount(perubahan.length);
    const barelang = page.locator('[data-pf="pf-10"]');
    await expect(barelang).toHaveAttribute("data-keadaan", "dalam");

    const slider = page.getByLabel("Geser tahun");
    await slider.focus();
    await page.keyboard.press("Home");
    await expect(page.locator("[data-tahun]")).toHaveAttribute("data-tahun", "1847");
    await expect(barelang).toHaveAttribute("data-keadaan", "sebelum");
    await expect(barelang.locator("[data-sj-keadaan]")).toContainText("Belum sampai rentang ini");

    await page.keyboard.press("End");
    await expect(page.locator("[data-tahun]")).toHaveAttribute("data-tahun", "2026");
    await expect(barelang).toHaveAttribute("data-keadaan", "sesudah");
  });

  test("saringan tahun berjalan menyisakan yang berlangsung", async ({ page }) => {
    await page.goto("/cerita/dulu");
    await page.getByLabel("Hanya yang berlangsung di tahun ini").check();
    await page.getByLabel("Geser tahun").focus();
    await page.keyboard.press("End");
    await expect(page.locator("[data-pf]")).toHaveCount(0);
    await page.keyboard.press("Home");
    await expect(page.locator("[data-pf]")).toHaveCount(1);
    await expect(page.locator('[data-pf="pf-14"]')).toBeVisible();
  });

  test("tidak ada foto, formulir tertutup jujur, arsip lengkap", async ({ page }) => {
    await page.goto("/cerita/dulu");
    await expect(page.locator("main img")).toHaveCount(0);
    await expect(page.locator("main")).toContainText("Belum ada foto lama");
    // Formulir hanya menerima keterangan foto, bukan berkas foto.
    await expect(page.getByRole("button", { name: "Kirim keterangan foto" })).toBeVisible();
    await expect(page.locator('main input[type="file"]')).toHaveCount(0);
    await expect(page.locator("[data-sa]")).toHaveCount(arsip.length);
  });

  test("peta hanya untuk yang berkoordinat", async ({ page }) => {
    await page.goto("/cerita/dulu");
    await expect(page.locator(".sj-peta[data-titik]")).toHaveAttribute("data-titik", "5");
    await expect(page.locator(".sj-peta canvas")).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-pf="pf-04"]').getByRole("button", { name: "Tunjukkan di peta" })).toHaveCount(0);
    await expect(page.locator('[data-pf="pf-09"]').getByRole("button", { name: "Tunjukkan di peta" })).toBeVisible();
  });
});

test.describe("Angka", () => {
  test("semua fakta berangka dan linimasa tampil dengan tahun, tanpa tautan sumber", async ({ page }) => {
    await page.goto("/cerita/angka");
    await expect(page.getByRole("heading", { level: 1, name: "Batam dalam Angka" })).toBeVisible();
    await expect(page.locator("[data-fi]")).toHaveCount(fakta.angka.length - 2);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
    await expect(page.locator("[data-linimasa] li")).toHaveCount(fakta.linimasa_sejarah.length);
    await expect(page.locator("[data-ide] > li")).toHaveCount(fakta.ide_infografis.length);
    await expect(page.locator('[data-fi="fi-023"]')).toHaveCount(0);
    await expect(page.locator('[data-fi="fi-001"]')).toContainText("Tidak kami pakai");
    await expect(page.locator('[data-resmi="jumlah_kecamatan"]')).toContainText("12");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/⚠|✅|⌛|di laporan|Perda 2\/2004|Belum dinilai|Dikutip sekunder/);
  });
});

for (const tema of ["light", "dark"] as const) {
  for (const url of ["/cerita", "/cerita/sejarah", "/cerita/dulu", "/cerita/angka"]) {
    test(`axe ${url} tema ${tema}`, async ({ page }) => {
      await aturTema(page, tema);
      await page.goto(url);
      await expect(page.locator("main")).toBeVisible();
      if (url.endsWith("/dulu")) await expect(page.locator(".sj-peta canvas")).toBeVisible({ timeout: 30_000 });
      await expect(page.locator("html")).toHaveAttribute("data-theme", tema);
      const hasil = await new AxeBuilder({ page }).exclude(".maplibregl-canvas").analyze();
      expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    });
  }
}

for (const url of ["/cerita", "/cerita/sejarah", "/cerita/dulu", "/cerita/angka"]) {
  test(`tanpa geser samping di 360 px: ${url}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    await page.goto(url);
    expect(await tanpaGeserSamping(page)).toBe(true);
  });
}

test("gerak tenang tidak merusak esai", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cerita/sejarah");
  await expect(page.locator(".sj-langkah")).toHaveCount(9);
  const durasi = await page
    .locator(".sj-langkah")
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(durasi).toBe("0s");
});
