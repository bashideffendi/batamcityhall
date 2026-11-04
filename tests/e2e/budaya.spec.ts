import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import acara from "../../data/budaya/acara.json" with { type: "json" };
import kamus from "../../data/budaya/kamus.json" with { type: "json" };
import komunitas from "../../data/budaya/komunitas.json" with { type: "json" };
import tradisi from "../../data/budaya/tradisi_melayu.json" with { type: "json" };

const HALAMAN = ["/cerita/kalender", "/cerita/kamus", "/cerita/budaya", "/cerita/komunitas"];

// Halaman ini tidak butuh API. Kalau ada komponen situs yang memanggil, jangan sampai ke sumber luar.
async function tiruApi(page: Page) {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
}

test.beforeEach(async ({ page }) => {
  await tiruApi(page);
});

const idTampil = (page: Page, atribut: string) =>
  page.locator(`[${atribut}]`).evaluateAll((el, a) => el.map((e) => e.getAttribute(a) ?? ""), atribut);

const samaDengan = (tampil: string[], data: { id: string }[]) =>
  expect([...tampil].sort()).toEqual(data.map((d) => d.id).sort());

test.describe("semua item file data tampil", () => {
  test("kalender: jumlah kartu sama dengan acara.json", async ({ page }) => {
    await page.goto("/cerita/kalender");
    samaDengan(await idTampil(page, "data-acara"), acara);
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(acara.length));
  });

  test("kamus: jumlah entri sama dengan kamus.json", async ({ page }) => {
    await page.goto("/cerita/kamus");
    samaDengan(await idTampil(page, "data-kata"), kamus);
  });

  test("budaya: jumlah kartu sama dengan tradisi_melayu.json", async ({ page }) => {
    await page.goto("/cerita/budaya");
    samaDengan(await idTampil(page, "data-tradisi"), tradisi);
  });

  test("komunitas: jumlah kartu sama dengan komunitas.json, anggota ikut tampil", async ({ page }) => {
    await page.goto("/cerita/komunitas");
    samaDengan(await idTampil(page, "data-komunitas"), komunitas);
    for (const k of komunitas) {
      for (const a of k.anggota ?? []) await expect(page.getByText(a, { exact: true })).toBeVisible();
    }
  });
});

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("kamus dan kalender tetap menampilkan daftar penuh di HTML", async ({ page }) => {
    await page.goto("/cerita/kamus");
    await expect(page.locator("[data-kata]")).toHaveCount(kamus.length);
    await expect(page.getByLabel("Cari kata, arti, atau contoh")).toBeHidden();
    await page.goto("/cerita/kalender");
    await expect(page.locator("[data-acara]")).toHaveCount(acara.length);
    await expect(page.getByLabel("Kategori")).toBeHidden();
  });
});

test.describe("kalender", () => {
  test("filter kategori dan status menyaring lalu bisa dihapus", async ({ page }) => {
    await page.goto("/cerita/kalender");
    const pameran = acara.filter((a) => a.kategori === "MICE").length;
    await page.getByLabel("Kategori").selectOption({ label: "Pameran dagang" });
    await expect(page.locator("[data-acara]")).toHaveCount(pameran);
    await expect(page).toHaveURL(/kategori=pameran/);
    await page.getByRole("button", { name: "Hapus filter" }).click();
    await expect(page.locator("[data-acara]")).toHaveCount(acara.length);

    await page.getByLabel("Status").selectOption({ label: "Dibatalkan" });
    await expect(page.locator("[data-acara]")).toHaveCount(1);
    await expect(page.locator('[data-acara="ev-025"]')).toContainText("Dibatalkan");
  });

  test("tampilan per bulan menampilkan acara sesuai kolom bulan", async ({ page }) => {
    await page.goto("/cerita/kalender");
    await page.getByRole("button", { name: "Per bulan" }).click();
    const februari = acara.filter((a) => a.bulan === 2);
    await page.getByRole("button", { name: /^Februari/ }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Februari" })).toBeVisible();
    samaDengan(await idTampil(page, "data-acara"), februari);
    await expect(page).toHaveURL(/tampilan=bulan/);

    await page.getByRole("button", { name: /^Bulan tidak tetap/ }).click();
    samaDengan(
      await idTampil(page, "data-acara"),
      acara.filter((a) => a.bulan === null),
    );

    // Semua bulan bila dijumlah kembali ke total: tidak ada acara yang hilang di tampilan ini.
    let total = 0;
    for (const b of await page.locator(".bud-bulan .bch-data").allTextContents()) total += parseInt(b, 10);
    expect(total).toBe(acara.length);
  });

  test("bulan ini mengikuti WIB dan tersorot saat tampilan per bulan dibuka", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-31T17:30:00Z"));
    await page.goto("/cerita/kalender?tampilan=bulan");
    await expect(page.getByRole("button", { name: /^November/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /^November/ })).toContainText("bulan ini");
  });

  test("tanggal tidak dikarang: acara tidak pasti tertulis tidak pasti", async ({ page }) => {
    await page.goto("/cerita/kalender");
    const safar = page.locator('[data-acara="ev-014"]');
    await expect(safar).toContainText("Tanggal tidak pasti");
    await expect(safar).toContainText("Rabu terakhir bulan Safar");
    await expect(safar).toContainText("Mengikuti kalender Hijriah");
    await expect(page.locator('[data-acara="ev-t02"]')).toContainText("Tanggal tidak pasti");
    await expect(page.locator('[data-acara="ev-011"]')).toContainText("16–18 Mei 2025");
    await expect(page.locator('[data-acara="ev-011"]')).not.toContainText("Tanggal tidak pasti");
  });

  test("catatan penyusun dan ikon tidak sampai ke halaman", async ({ page }) => {
    await page.goto("/cerita/kalender");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/[⚠✅❌⌛]/);
    expect(teks).not.toMatch(/jangan dimasukkan|jangan kunci|pakai versi disbudpar/i);
    expect(teks).not.toMatch(/tahunan/i);
  });

  test("kartu menaut ke tempat di direktori", async ({ page }) => {
    await page.goto("/cerita/kalender");
    const tautan = page.locator('[data-acara="ev-006"]').getByRole("link", { name: "Taman Dang Anom" });
    await expect(tautan).toHaveAttribute("href", "/info/tempat/pub-taman-dang-anom");
  });
});

test.describe("kamus", () => {
  test("pencarian menyaring, tersimpan di URL, dan punya keadaan kosong", async ({ page }) => {
    await page.goto("/cerita/kamus");
    const kotak = page.getByLabel("Cari kata, arti, atau contoh");
    await kotak.fill("pompong");
    await expect(page.locator('[data-kata="k-003"]')).toBeVisible();
    await expect(page.locator('[data-kata="k-050"]')).toHaveCount(0);
    await expect(page).toHaveURL(/q=pompong/);
    await page.reload();
    await expect(kotak).toHaveValue("pompong");
    await kotak.fill("xyzzy");
    await expect(page.locator("[data-kata]")).toHaveCount(0);
    await expect(page.getByText("Kata itu belum ada di kamus")).toBeVisible();
    await kotak.fill("");
    await expect(page.locator("[data-kata]")).toHaveCount(kamus.length);
  });

  test("filter kelompok menyaring", async ({ page }) => {
    await page.goto("/cerita/kamus");
    await page.getByLabel("Kelompok").selectOption({ label: "Dunia kerja industri" });
    await expect(page.locator("[data-kata]")).toHaveCount(4);
    await expect(page.locator('[data-kata="k-055"]')).toBeVisible();
  });

  test("per huruf dan label asal", async ({ page }) => {
    await page.goto("/cerita/kamus");
    await expect(page.getByRole("heading", { level: 2, name: "P", exact: true })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Lompat ke huruf" })
      .getByRole("link", { name: "P", exact: true })
      .click();
    await expect(page).toHaveURL(/#huruf-P$/);
    const pompong = page.locator('[data-kata="k-003"]');
    await expect(pompong).toContainText("Melayu Kepri");
    await expect(pompong).toContainText("Pompong terakhir jam lima.");
    await expect(pompong).toContainText("Bersumber");
    const nak = page.locator('[data-kata="k-026"]');
    await expect(nak).toContainText("Pengamatan, belum divalidasi");
    await expect(nak).toContainText("Arti menurut pengamatan");
  });
});

test.describe("budaya", () => {
  test("instruksi penyusun tersaring, sumber tertulis tampil", async ({ page }) => {
    await page.goto("/cerita/budaya");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/Rekomendasi konten|Buat seri|[⚠✅❌⌛]/);
    expect(teks.replace("bukan asli Batam", "")).not.toMatch(/asli Batam/);
    await expect(
      page.locator('[data-tradisi="tr-001"]').getByRole("link", { name: "repositori.kemendikdasmen.go.id" }),
    ).toBeVisible();
    await expect(page.locator('[data-tradisi="tr-014"]')).toContainText("Perlu sumber LAM");
    await expect(page.locator('[data-tradisi="tr-014"]')).toContainText("Belum ada sumber tertulis");
  });
});

test.describe("komunitas", () => {
  test("kanal hanya yang sudah dicek, referensi pemilik tidak tampil", async ({ page }) => {
    await page.goto("/cerita/komunitas");
    await expect(page.getByRole("link", { name: "Instagram @sukalaribatam" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Instagram @batam_10k" })).toBeVisible();
    await expect(page.locator('[data-komunitas="kom-005"]')).toContainText("Kanal belum dicek");
    await expect(page.locator('[data-komunitas="kom-002"]')).toContainText("Kanal belum dicek");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/BASCOM|Tukang Langganan|wa\.me|(\+62|\b08)\d{7,}/);
  });
});

test.describe("aksesibilitas", () => {
  for (const tema of ["light", "dark"] as const) {
    for (const h of HALAMAN) {
      test(`${h} (${tema}) tanpa pelanggaran axe`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.goto(h);
        await expect(page.locator("main")).toBeVisible();
        const hasil = await new AxeBuilder({ page }).analyze();
        expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
      });
    }
  }

  test("tampilan per bulan tanpa pelanggaran axe", async ({ page }) => {
    await page.goto("/cerita/kalender?tampilan=bulan");
    await expect(page.locator(".bud-tahun")).toBeVisible();
    const hasil = await new AxeBuilder({ page }).analyze();
    expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });

  test("tidak ada scroll horizontal di 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    for (const h of [...HALAMAN, "/cerita/kalender?tampilan=bulan"]) {
      await page.goto(h);
      await expect(page.locator("main")).toBeVisible();
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih, h).toBeLessThanOrEqual(0);
    }
  });

  test("target sentuh kontrol minimal 44 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    await page.goto("/cerita/kalender?tampilan=bulan");
    await expect(page.locator(".bud-bulan").first()).toBeVisible();
    for (const b of await page.locator(".bud-bulan, .bud-tombol").all()) {
      const kotak = await b.boundingBox();
      expect(kotak?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
