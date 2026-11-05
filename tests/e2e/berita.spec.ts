import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import type { BeritaResponse } from "../../features/berita/sumber";

// Tes tidak pernah memanggil feed asli: /api/berita selalu ditiru, kalau tidak, route-nya akan menarik situs media.
const ISI: BeritaResponse = {
  diperbarui: "2026-11-05T01:00:00.000Z",
  sumber: [
    {
      id: "a",
      nama: "Media A",
      situs: "https://media-a.example/",
      status: "ok",
      jumlah: 3,
      terakhirBerhasil: "2026-11-05T01:00:00.000Z",
    },
    {
      id: "b",
      nama: "Media B",
      situs: "https://media-b.example/",
      status: "gagal",
      jumlah: 1,
      terakhirBerhasil: "2026-11-04T22:30:00.000Z",
    },
    {
      id: "c",
      nama: "Media C",
      situs: "https://media-c.example/",
      status: "gagal",
      jumlah: 0,
      terakhirBerhasil: null,
    },
    {
      id: "d",
      nama: "Media D",
      situs: "https://media-d.example/",
      status: "kosong",
      jumlah: 0,
      terakhirBerhasil: "2026-11-05T01:00:00.000Z",
    },
  ],
  item: [
    {
      judul: "Judul pertama dari A",
      tautan: "https://media-a.example/1",
      sumberId: "a",
      sumber: "Media A",
      // 01.00 UTC = 08.00 WIB
      waktu: "2026-11-05T01:00:00.000Z",
    },
    {
      judul: "Judul lintas tengah malam dari B",
      tautan: "https://media-b.example/1",
      sumberId: "b",
      sumber: "Media B",
      // 18.30 UTC 4 Nov = 01.30 WIB 5 Nov: hari WIB, bukan hari UTC
      waktu: "2026-11-04T18:30:00.000Z",
    },
    {
      judul: "Judul hari sebelumnya dari A",
      tautan: "https://media-a.example/2",
      sumberId: "a",
      sumber: "Media A",
      waktu: "2026-11-04T03:15:00.000Z",
    },
    {
      judul: "Judul tanpa waktu dari A",
      tautan: "https://media-a.example/3",
      sumberId: "a",
      sumber: "Media A",
      waktu: null,
    },
  ],
};

async function tiruApi(page: Page, berita: Parameters<Page["route"]>[1]) {
  await page.route("**/api/berita", berita);
  await page.route("**/api/frames", (r) => r.fulfill({ json: { frames: [], stale: true, echo: null } }));
  await page.route("**/api/radar-citra/**", (r) => r.fulfill({ status: 404, body: "" }));
  await page.route("**/api/ofs-frame", (r) => r.fulfill({ json: { frames: [], nowIndex: 0 } }));
  await page.route("**/api/perairan", (r) => r.fulfill({ json: { warns: [] } }));
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
}

const tiruIsi = (page: Page, isi: BeritaResponse = ISI) => tiruApi(page, (r) => r.fulfill({ json: isi }));

test.describe("halaman berita", () => {
  test("daftar terbaru dulu, tiap baris memuat media, tanggal, dan jam WIB", async ({ page }) => {
    await tiruIsi(page);
    await page.goto("/berita");
    await expect(page.getByRole("heading", { level: 1, name: "Berita" })).toBeVisible();
    await expect(page.locator(".bch-berita-daftar a")).toHaveText([
      "Judul pertama dari A",
      "Judul lintas tengah malam dari B",
      "Judul hari sebelumnya dari A",
      "Judul tanpa waktu dari A",
    ]);
    // 18.30 UTC 4 Nov = 01.30 WIB 5 Nov: hari WIB, bukan hari UTC
    await expect(page.locator('li[data-sumber="b"] .bch-berita-meta')).toHaveText(
      "Media B · 5 November 2026, pukul 01.30 WIB",
    );
    await expect(page.locator(".bch-berita-meta").filter({ hasText: "4 November 2026" })).toHaveText(
      "Media A · 4 November 2026, pukul 10.15 WIB",
    );
    // Berita tanpa waktu cukup menampilkan medianya.
    await expect(page.locator(".bch-berita-daftar li").last().locator(".bch-berita-meta")).toHaveText("Media A");
  });

  test("hanya tautan ke artikel asli, dengan rel yang benar", async ({ page }) => {
    await tiruIsi(page);
    await page.goto("/berita");
    // Halaman berita tanpa keterangan panjang; setiap judul membuka artikel di situs medianya.
    await expect(page.locator(".bch-berita-daftar a").first()).toBeVisible();
    const tautan = page.getByRole("link", { name: "Judul pertama dari A" });
    await expect(tautan).toHaveAttribute("href", "https://media-a.example/1");
    await expect(tautan).toHaveAttribute("rel", "noopener noreferrer");
    const rel = await page
      .locator('.bch-berita-hari a[href^="http"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("rel")));
    expect(new Set(rel)).toEqual(new Set(["noopener noreferrer"]));
  });

  test("saringan media: Semua media dan media yang ada judulnya", async ({ page }) => {
    await tiruIsi(page);
    await page.goto("/berita");
    const pilih = page.getByLabel("Media");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", "4");
    await expect(pilih.locator("option")).toHaveText(["Semua Media", "Media A", "Media B"]);
    await pilih.selectOption("b");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", "1");
    await expect(page.locator(".bch-berita-daftar a")).toHaveText(["Judul lintas tengah malam dari B"]);
    await pilih.selectOption("");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", "4");
  });

  test("status sumber dan tautan situs media tidak tampil", async ({ page }) => {
    await tiruIsi(page);
    await page.goto("/berita");
    await expect(page.locator(".bch-berita-daftar a").first()).toBeVisible();
    await expect(page.locator("main")).not.toContainText("Status sumber");
    await expect(page.locator("main")).not.toContainText("Terakhir berhasil");
    await expect(page.locator("main")).not.toContainText("feed");
    await expect(page.locator("tr[data-sumber]")).toHaveCount(0);
  });

  test("semua feed gagal: 503 menampilkan kalimat kosong", async ({ page }) => {
    const gagal: BeritaResponse = {
      diperbarui: ISI.diperbarui,
      item: [],
      sumber: ISI.sumber.map((s) => ({ ...s, status: "gagal", jumlah: 0, terakhirBerhasil: null })),
    };
    await tiruApi(page, (r) => r.fulfill({ status: 503, json: gagal }));
    await page.goto("/berita");
    await expect(page.getByText("Belum ada berita baru hari ini.")).toBeVisible();
  });

  test("route tidak terjangkau: pesan gagal, halaman tetap berdiri", async ({ page }) => {
    await tiruApi(page, (r) => r.abort());
    await page.goto("/berita");
    await expect(page.getByText("Data tidak dapat dimuat. Coba muat ulang.")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Berita" })).toBeVisible();
  });

  test("balasan bukan bentuk yang dikenal tidak dianggap berhasil", async ({ page }) => {
    await tiruApi(page, (r) => r.fulfill({ json: { apa: "ini" } }));
    await page.goto("/berita");
    await expect(page.getByText("Data tidak dapat dimuat. Coba muat ulang.")).toBeVisible();
  });

  test("judul sangat panjang tidak membuat scroll horizontal di 360 px", async ({ page }) => {
    const panjang: BeritaResponse = {
      ...ISI,
      item: [{ ...ISI.item[0], judul: `Panjang${"x".repeat(230)}` }, ...ISI.item.slice(1)],
    };
    await tiruIsi(page, panjang);
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/berita");
    await expect(page.locator(".bch-berita-daftar a").first()).toBeVisible();
    const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(lebih).toBeLessThanOrEqual(0);
  });

  test("target sentuh tautan judul minimal 44 px", async ({ page }) => {
    await tiruIsi(page);
    await page.goto("/berita");
    const kotak = await page.locator(".bch-berita-daftar a").first().boundingBox();
    expect(kotak?.height).toBeGreaterThanOrEqual(44);
  });

  for (const tema of ["light", "dark"] as const) {
    test(`axe bersih, tema ${tema}`, async ({ page }) => {
      await tiruIsi(page);
      await page.emulateMedia({ colorScheme: tema });
      await page.goto("/berita");
      await expect(page.locator(".bch-berita-daftar a").first()).toBeVisible();
      const hasil = await new AxeBuilder({ page }).analyze();
      expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});

test.describe("widget beranda", () => {
  const banyak: BeritaResponse = {
    ...ISI,
    item: Array.from({ length: 12 }, (_, i) => ({
      judul: `Judul nomor ${i + 1}`,
      tautan: `https://media-a.example/${i}`,
      sumberId: "a",
      sumber: "Media A",
      waktu: new Date(Date.parse(ISI.diperbarui) - i * 3600_000).toISOString(),
    })),
  };
  const widget = (page: Page) => page.locator(".bch-berita-widget");

  test("tiga judul, media, waktu, dan tautan ke halaman berita", async ({ page }) => {
    await tiruIsi(page, banyak);
    await page.goto("/");
    await expect(widget(page).locator("li")).toHaveCount(3);
    await expect(widget(page).locator("li a").first()).toHaveText("Judul nomor 1");
    await expect(widget(page).locator("li a").first()).toHaveAttribute("rel", "noopener noreferrer");
    // Hari ini ditulis jamnya, hari lain ditulis tanggalnya (3.2). Tes berjalan setelah tanggal contoh.
    await expect(widget(page).locator(".bch-berita-meta").first()).toHaveText(
      /^Media A · (pukul 08\.00 WIB|5 November 2026)$/,
    );
    await widget(page).getByRole("link", { name: "Selengkapnya →" }).click();
    await expect(page).toHaveURL(/\/berita$/);
  });

  test("HTML beranda tidak memuat judul: widget murni dari klien", async ({ page }) => {
    await tiruIsi(page, banyak);
    const res = await page.goto("/");
    const html = (await res?.text()) ?? "";
    expect(html).not.toContain("Judul nomor 1");
    expect(html).toContain("Memuat data");
  });

  test("gagal berarti satu kalimat pendek, beranda tetap utuh", async ({ page }) => {
    await tiruApi(page, (r) => r.abort());
    await page.goto("/");
    await expect(widget(page)).toContainText("Berita tidak dapat dimuat.");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".br-pertama")).toBeVisible();
  });

  test("tidak ada berita tentang Batam: kalimat kosong dari pedoman", async ({ page }) => {
    await tiruIsi(page, { ...ISI, item: [] });
    await page.goto("/");
    await expect(widget(page)).toContainText("Belum ada berita baru hari ini.");
  });

  test("tidak ada scroll horizontal di 360 px", async ({ page }) => {
    await tiruIsi(page, {
      ...banyak,
      item: [{ ...banyak.item[0], judul: `Panjang${"x".repeat(230)}` }],
    });
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    await expect(widget(page).locator("li")).toHaveCount(1);
    const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(lebih).toBeLessThanOrEqual(0);
  });

  for (const tema of ["light", "dark"] as const) {
    test(`axe bersih pada widget, tema ${tema}`, async ({ page }) => {
      await tiruIsi(page, banyak);
      await page.emulateMedia({ colorScheme: tema });
      await page.goto("/");
      await expect(widget(page).locator("li")).toHaveCount(3);
      const hasil = await new AxeBuilder({ page }).include(".bch-berita-widget").analyze();
      expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
    });
  }
});
