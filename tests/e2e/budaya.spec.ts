import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import acara from "../../data/budaya/acara.json" with { type: "json" };
import kamus from "../../data/budaya/kamus.json" with { type: "json" };
import komunitas from "../../data/budaya/komunitas.json" with { type: "json" };
import tradisi from "../../data/budaya/tradisi_melayu.json" with { type: "json" };

const HALAMAN = ["/things-to-do", "/cerita/kamus", "/cerita/budaya", "/komunitas"];

// Halaman ini tidak butuh API. Kalau ada komponen situs yang memanggil, jangan sampai ke sumber luar.
async function tiruApi(page: Page) {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
}

test.beforeEach(async ({ page }) => {
  await tiruApi(page);
});

/** Daftar hanya memuat tiga bulan pertama sampai tombol ditekan. Tunggu hidrasi, lalu buka semuanya. */
async function bukaSemuaBulan(page: Page) {
  await expect(page.locator(".bud-kontrol")).toBeVisible();
  const tombol = page.locator("[data-semua-bulan]");
  if (await tombol.count()) await tombol.click();
  await expect(tombol).toHaveCount(0);
}

const idTampil = (page: Page, atribut: string) =>
  page.locator(`[${atribut}]`).evaluateAll((el, a) => el.map((e) => e.getAttribute(a) ?? ""), atribut);

const samaDengan = (tampil: string[], data: { id: string }[]) =>
  expect([...tampil].sort()).toEqual(data.map((d) => d.id).sort());

test.describe("semua item file data tampil", () => {
  test("kalender: jumlah kartu sama dengan acara.json", async ({ page }) => {
    await page.goto("/things-to-do");
    await bukaSemuaBulan(page);
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
    await page.goto("/komunitas");
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
    await expect(page.getByLabel("Cari Kata, Arti, atau Contoh")).toBeHidden();
    await page.goto("/things-to-do");
    await expect(page.locator("[data-acara]")).toHaveCount(acara.length);
    await expect(page.getByLabel("Kategori")).toBeHidden();
  });
});

test.describe("kalender", () => {
  test("filter kategori dan status menyaring lalu bisa dihapus", async ({ page }) => {
    await page.goto("/things-to-do");
    const pameran = acara.filter((a) => a.kategori === "MICE").length;
    await page.getByLabel("Kategori").selectOption({ label: "Pameran Dagang" });
    await expect(page.locator("[data-acara]")).toHaveCount(pameran);
    await expect(page).toHaveURL(/kategori=pameran/);
    await page.getByRole("button", { name: "Hapus Saringan" }).click();
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(acara.length));
    await bukaSemuaBulan(page);
    await expect(page.locator("[data-acara]")).toHaveCount(acara.length);

    await page.getByLabel("Status").selectOption({ label: "Dibatalkan" });
    await expect(page.locator("[data-acara]")).toHaveCount(1);
    await expect(page.locator('[data-acara="ev-025"]')).toContainText("Dibatalkan");
  });

  test("tampilan per bulan menampilkan acara sesuai kolom bulan", async ({ page }) => {
    await page.goto("/things-to-do");
    await page.getByRole("button", { name: "Per Bulan" }).click();
    const februari = acara.filter((a) => a.bulan === 2);
    await page.getByRole("button", { name: /^Februari/ }).click();
    await expect(page.getByRole("heading", { level: 3, name: "Februari" })).toBeVisible();
    samaDengan(await idTampil(page, "data-acara"), februari);
    await expect(page).toHaveURL(/tampilan=bulan/);

    await page.getByRole("button", { name: /^Bulan Tidak Tetap/ }).click();
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
    await page.goto("/things-to-do?tampilan=bulan");
    await expect(page.getByRole("button", { name: /^November/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /^November/ })).toContainText("bulan ini");
  });

  test("tanggal tidak dikarang: acara tidak pasti tertulis tidak pasti", async ({ page }) => {
    await page.goto("/things-to-do");
    await bukaSemuaBulan(page);
    const safar = page.locator('[data-acara="ev-014"]');
    await expect(safar).toContainText("Tanggal belum pasti");
    await expect(safar).toContainText("Rabu terakhir bulan Safar");
    await expect(safar).toContainText("Mengikuti kalender Hijriah");
    await expect(page.locator('[data-acara="ev-t02"]')).toContainText("Belum Pasti");
    await expect(page.locator('[data-acara="ev-011"]')).toContainText("16—18 Mei 2025");
    await expect(page.locator('[data-acara="ev-011"]')).not.toContainText("belum pasti");
  });

  test("catatan penyusun dan ikon tidak sampai ke halaman", async ({ page }) => {
    await page.goto("/things-to-do");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/[⚠✅❌⌛]/);
    expect(teks).not.toMatch(/jangan dimasukkan|jangan kunci|pakai versi disbudpar/i);
    expect(teks).not.toMatch(/tahunan/i);
    expect(teks).not.toMatch(/Sumber:|Sumber sekunder|Terakhir dicek|\.go\.id/);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });

  test("kartu menaut ke tempat di direktori", async ({ page }) => {
    await page.goto("/things-to-do");
    await bukaSemuaBulan(page);
    const tautan = page.locator('[data-acara="ev-006"]').getByRole("link", { name: "Taman Dang Anom" });
    await expect(tautan).toHaveAttribute("href", "/info/tempat/pub-taman-dang-anom");
  });
});

test.describe("kamus", () => {
  test("pencarian menyaring, tersimpan di URL, dan punya keadaan kosong", async ({ page }) => {
    await page.goto("/cerita/kamus");
    const kotak = page.getByLabel("Cari Kata, Arti, atau Contoh");
    await kotak.fill("pompong");
    await expect(page.locator('[data-kata="k-003"]')).toBeVisible();
    await expect(page.locator('[data-kata="k-050"]')).toHaveCount(0);
    await expect(page).toHaveURL(/q=pompong/);
    await page.reload();
    await expect(kotak).toHaveValue("pompong");
    await kotak.fill("xyzzy");
    await expect(page.locator("[data-kata]")).toHaveCount(0);
    await expect(page.getByText("Tidak ada hasil untuk “xyzzy”. Coba kata lain atau hapus saringan.")).toBeVisible();
    await kotak.fill("");
    await expect(page.locator("[data-kata]")).toHaveCount(kamus.length);
  });

  test("filter kelompok menyaring", async ({ page }) => {
    await page.goto("/cerita/kamus");
    await page.getByLabel("Kelompok").selectOption({ label: "Dunia Kerja Industri" });
    await expect(page.locator("[data-kata]")).toHaveCount(4);
    await expect(page.locator('[data-kata="k-055"]')).toBeVisible();
  });

  test("per huruf, label asal, tanda bintang, dan arti berpetik tunggal", async ({ page }) => {
    await page.goto("/cerita/kamus");
    await expect(page.locator("[data-keterangan-bintang]")).toHaveText(
      "Kata bertanda * masih menunggu pemeriksaan penutur.",
    );
    await expect(page.getByRole("heading", { level: 2, name: "P", exact: true })).toBeVisible();
    await page
      .getByRole("navigation", { name: "Lompat ke huruf" })
      .getByRole("link", { name: "P", exact: true })
      .click();
    await expect(page).toHaveURL(/#huruf-P$/);
    const pompong = page.locator('[data-kata="k-003"]');
    await expect(pompong).toContainText("Melayu Kepri");
    await expect(pompong).toContainText("Pompong terakhir jam lima.");
    await expect(pompong.getByRole("heading", { level: 3 })).toHaveText("pompong");
    await expect(page.locator('[data-kata="k-001"]')).toContainText("‘rumah liar’");
    const nak = page.locator('[data-kata="k-026"]');
    await expect(nak.getByRole("heading", { level: 3 })).toHaveText("nak*");
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });
});

test.describe("budaya", () => {
  test("instruksi penyusun tersaring, tanpa tautan sumber", async ({ page }) => {
    await page.goto("/cerita/budaya");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/Rekomendasi konten|Buat seri|[⚠✅❌⌛]/);
    expect(teks.replace("bukan asli Batam", "")).not.toMatch(/asli Batam/);
    await expect(page.locator('[data-tradisi="tr-001"]')).toContainText("Tercatat");
    await expect(page.locator('[data-tradisi="tr-014"]')).toContainText("Belum Terverifikasi");
    expect(teks).not.toMatch(/Sumber:|Belum ada sumber tertulis|Perlu sumber/);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });
});

test.describe("komunitas", () => {
  test("kanal hanya yang tercatat, tanpa catatan kerja dan tautan pemerintah", async ({ page }) => {
    await page.goto("/komunitas");
    await expect(page.getByRole("link", { name: "Instagram @sukalaribatam" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Instagram @batam_10k" })).toBeVisible();
    await expect(page.locator('[data-komunitas="kom-005"] [data-kanal]')).toHaveCount(0);
    await expect(page.locator('[data-komunitas="kom-002"] [data-kanal]')).toHaveCount(0);
    await expect(page.locator('main a[href*=".go.id"]')).toHaveCount(0);
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/BASCOM|Tukang Langganan|wa\.me|(\+62|\b08)\d{7,}/);
    expect(teks).not.toMatch(/Kanal belum dicek|Sumber:|Terakhir dicek/);
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
    await page.goto("/things-to-do?tampilan=bulan");
    await expect(page.locator(".bud-tahun")).toBeVisible();
    const hasil = await new AxeBuilder({ page }).analyze();
    expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
  });

  test("tidak ada scroll horizontal di 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    for (const h of [...HALAMAN, "/things-to-do?tampilan=bulan"]) {
      await page.goto(h);
      await expect(page.locator("main")).toBeVisible();
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih, h).toBeLessThanOrEqual(0);
    }
  });

  test("target sentuh kontrol minimal 44 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 760 });
    await page.goto("/things-to-do?tampilan=bulan");
    await expect(page.locator(".bud-bulan").first()).toBeVisible();
    for (const b of await page.locator(".bud-bulan, .bud-tombol").all()) {
      const kotak = await b.boundingBox();
      expect(kotak?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("Things to Do: daftar bertahap", () => {
  test("mulai dari bulan berjalan, tiga bulan pertama, lalu Tampilkan Semua Bulan", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-05T05:00:00Z"));
    await page.goto("/things-to-do");
    await expect(page.locator(".bud-kontrol")).toBeVisible();
    const bulan = page.locator("section[id^='bulan-'] h3.bud-judul-bulan");
    await expect(bulan).toHaveCount(3);
    await expect(bulan.first()).toContainText("November");
    await expect(bulan.first()).toContainText("Bulan Ini");
    const awal = await page.locator("[data-acara]").count();
    expect(awal).toBeGreaterThan(0);
    expect(awal).toBeLessThan(acara.length);
    await page.getByRole("button", { name: "Tampilkan Semua Bulan" }).click();
    await expect(page.getByRole("button", { name: "Tampilkan Semua Bulan" })).toHaveCount(0);
    await expect(page.locator("[data-acara]")).toHaveCount(acara.length);
    expect(await bulan.count()).toBeGreaterThan(3);
  });

  test("acara berbaris (bud-baris), kartu lama tidak ada", async ({ page }) => {
    await page.goto("/things-to-do");
    await expect(page.locator(".bud-baris").first()).toBeVisible();
    await expect(page.locator(".bud-kartu")).toHaveCount(0);
  });

  test("status memakai Title Case", async ({ page }) => {
    await page.goto("/things-to-do");
    await expect(page.locator(".bud-kontrol")).toBeVisible();
    const pilihan = await page.getByLabel("Status").locator("option").allTextContents();
    expect(pilihan).toEqual(["Semua Status", "Rutin", "Pernah Diadakan", "Belum Pasti", "Dibatalkan"]);
  });
});

test.describe("Komunitas dan Budaya Melayu berbaris", () => {
  test("komunitas berbaris dan status Tercatat tidak tampil", async ({ page }) => {
    await page.goto("/komunitas");
    expect(await page.locator(".bud-baris").count()).toBe(komunitas.length);
    await expect(page.locator("main")).not.toContainText("Tercatat");
  });

  test("budaya Melayu berbaris", async ({ page }) => {
    await page.goto("/cerita/budaya");
    expect(await page.locator(".bud-baris").count()).toBe(tradisi.length);
  });

  test("kamus ringkas: tanpa label Arti dan Contoh", async ({ page }) => {
    await page.goto("/cerita/kamus");
    const entri = page.locator('[data-kata="k-003"]');
    await expect(entri).toContainText("Pompong terakhir jam lima.");
    const label = await entri.locator("dt, .bud-label, strong, b").allTextContents();
    expect(label.map((t) => t.trim())).not.toContain("Arti");
    expect(label.map((t) => t.trim())).not.toContain("Contoh");
  });
});
