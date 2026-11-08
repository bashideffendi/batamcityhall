import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Lapisan kepercayaan: Standar Redaksi, Log Koreksi, Aksesibilitas, data terstruktur, dan RSS.
// Sumber data cuaca tidak boleh terpanggil dari tes.
test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

const HALAMAN = [
  ["/standar-redaksi", "Standar Redaksi"],
  ["/log-koreksi", "Log Koreksi"],
  ["/aksesibilitas", "Aksesibilitas"],
] as const;

const ambilLd = async (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
      const d = JSON.parse(s.textContent ?? "{}");
      return (d["@graph"] ?? [d]) as Record<string, unknown>[];
    }),
  );

test.describe("halaman kebijakan", () => {
  for (const [alamat, judul] of HALAMAN) {
    for (const tema of ["light", "dark"] as const) {
      test(`${alamat} tampil dan lolos axe, tema ${tema}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
        await page.goto(alamat);
        await expect(page.getByRole("heading", { level: 1, name: judul })).toBeVisible();
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }

  test("kaki situs menautkan ketiganya", async ({ page }) => {
    await page.goto("/tentang");
    const kaki = page.locator("footer");
    for (const [alamat, judul] of HALAMAN) await expect(kaki.getByRole("link", { name: judul })).toHaveAttribute("href", alamat);
  });

  test("setiap entri Log Koreksi bertanggal dan menaut ke halaman yang ada", async ({ page, request }) => {
    await page.goto("/log-koreksi");
    const entri = page.locator(".bch-log-koreksi li");
    expect(await entri.count()).toBeGreaterThan(0);
    await expect(entri.first().locator("time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
    const tautan = await entri.locator("a").evaluateAll((a) => [...new Set(a.map((x) => x.getAttribute("href")))]);
    for (const href of tautan) expect((await request.get(href as string)).status(), href as string).toBe(200);
  });

  test("Standar Redaksi tidak menyebut pemerintah", async ({ page }) => {
    await page.goto("/standar-redaksi");
    await expect(page.locator("main")).not.toContainText(/pemerintah|\.go\.id/i);
  });
});

test.describe("data terstruktur", () => {
  test("beranda: organisasi dengan kebijakan redaksi dan situs web", async ({ page }) => {
    await page.goto("/");
    const ld = await ambilLd(page);
    const org = ld.find((n) => n["@type"] === "Organization");
    expect(org?.publishingPrinciples).toMatch(/\/standar-redaksi$/);
    expect(org?.correctionsPolicy).toMatch(/\/standar-redaksi#koreksi$/);
    expect(ld.some((n) => n["@type"] === "WebSite")).toBe(true);
  });

  test("Jurnal: artikel dengan tanggal dan penerbit", async ({ page }) => {
    await page.goto("/jurnal/nongsa-dan-mandat-1829");
    const art = (await ambilLd(page)).find((n) => n["@type"] === "Article");
    expect(art?.datePublished).toBe("2026-11-05");
    expect(art?.publisher).toEqual({ "@id": expect.stringMatching(/#organisasi$/) });
  });

  test("tempat makan: tanpa nomor telepon dan rating", async ({ page }) => {
    await page.goto("/makan/peta");
    const href = await page.locator('a[href^="/makan/tempat/"]').first().getAttribute("href");
    await page.goto(href as string);
    const tempat = (await ambilLd(page)).find((n) => n["@type"] === "FoodEstablishment");
    expect(tempat?.name).toBeTruthy();
    expect(JSON.stringify(tempat)).not.toMatch(/telephone|aggregateRating/);
  });
});

test("RSS memuat Jurnal dan Infografik", async ({ request }) => {
  const r = await request.get("/rss.xml");
  expect(r.status()).toBe(200);
  expect(r.headers()["content-type"]).toContain("application/rss+xml");
  const isi = await r.text();
  expect(isi).toContain("<rss version=\"2.0\"");
  expect(isi).toContain("/jurnal/nongsa-dan-mandat-1829</link>");
  expect(isi).toContain("/infografik/");
});
