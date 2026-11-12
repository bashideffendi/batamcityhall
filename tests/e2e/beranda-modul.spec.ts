import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Modul beranda: Feri ke Singapura, Batam dalam Angka, Kata Hari Ini. Semua /api/* ditiru supaya tidak memanggil MSS,
// BMKG, atau feed berita. Jadwal feri diambil dari /jalan/feri/terakhir.json milik situs sendiri.

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => {
    const url = r.request().url();
    if (url.includes("/api/frames")) return r.fulfill({ json: { frames: [], stale: true, echo: null } });
    if (url.includes("/api/perairan")) return r.fulfill({ json: { warns: [] } });
    if (url.includes("/api/gempa")) return r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } });
    if (url.includes("/api/peringatan-cuaca")) return r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } });
    if (url.includes("/api/berita")) return r.fulfill({ json: { item: [], sumber: [] } });
    return r.fulfill({ status: 503, json: {} });
  });
});

/** Jam dinding WIB. 9 November 2026 hari Senin. */
const pada = (page: Page, tgl: string, jam: string) => page.clock.setFixedTime(new Date(`${tgl}T${jam}:00+07:00`));
const modul = (page: Page, id: string) => page.locator(`section[aria-labelledby="${id}"]`);

test.describe("Feri ke Singapura", () => {
  test("tiga jam berikutnya per pelabuhan, dari jadwal yang tidak diragukan", async ({ page }) => {
    await pada(page, "2026-11-09", "14:00");
    await page.goto("/");
    const feri = modul(page, "br-feri");
    await expect(feri.getByRole("heading", { name: "Feri ke Singapura" })).toBeVisible();
    const btc = feri.locator('li[data-feri="btc-hfc"]');
    await expect(btc).toContainText("Batam Centre—HarbourFront");
    await expect(btc).toContainText("14.10 · 15.20 · 16.30");
    await expect(feri.locator('li[data-feri="btc-tmft"]')).toContainText("Habis, besok 08.00");
    // Jam yang tepat sekarang masih dihitung berikutnya.
    await expect(feri.locator('li[data-feri="hb-hfc"]')).toContainText("14.00 · 15.30 · 16.30");
    // Rute akhir pekan tidak tampil di hari Senin.
    await expect(feri.locator('li[data-feri="wfc-hfc"]')).toHaveCount(0);
    await expect(feri).toContainText("Jam WIB. Jadwal per");
    await expect(btc.getByRole("link")).toHaveAttribute("href", "/jalan/feri#btc-hfc");
  });

  test("lewat jam terakhir: semua habis, dengan jam pertama besok", async ({ page }) => {
    await pada(page, "2026-11-09", "21:30");
    await page.goto("/");
    const baris = modul(page, "br-feri").locator("li[data-feri]");
    await expect(baris.first()).toBeVisible();
    for (const t of await baris.allTextContents()) expect(t).toMatch(/Habis, besok \d{2}\.\d{2}/);
  });

  test("rute Waterfront tampil di akhir pekan", async ({ page }) => {
    await pada(page, "2026-11-07", "09:00");
    await page.goto("/");
    await expect(modul(page, "br-feri").locator('li[data-feri="wfc-hfc"]')).toContainText("13.20 · 14.50");
  });
});

test.describe("Batam dalam Angka", () => {
  test("empat angka menaut ke Infografik dan halaman angka", async ({ page }) => {
    await page.goto("/");
    const m = modul(page, "br-bilangan");
    await expect(m.locator(".br-bilangan li")).toHaveCount(4);
    await expect(m.getByRole("link", { name: /1,30—1,39 juta/ })).toHaveAttribute("href", "/infografik/penduduk-batam-dari-1965");
    await expect(m.getByRole("link", { name: /±73%/ })).toHaveAttribute("href", "/infografik/batam-sebagian-besar-laut");
    await expect(m.getByRole("link", { name: /1\.613\.202/ })).toHaveAttribute("href", "/infografik/wisman-batam-2025");
    await expect(m.getByRole("link", { name: /Kecamatan/ })).toContainText("64 kelurahan");
    await expect(m.getByRole("link", { name: /\d+ Dataset/ })).toHaveAttribute("href", "/dataset");
  });
});

test.describe("Kata Hari Ini", () => {
  test("satu kata per hari, berganti besoknya, menaut ke kamus", async ({ page }) => {
    await pada(page, "2026-11-09", "08:00");
    await page.goto("/");
    const kata = modul(page, "br-kata").locator("[data-kata]");
    await expect(kata).toBeVisible();
    const hariIni = await kata.getAttribute("data-kata");
    await expect(kata.locator(".kata")).not.toBeEmpty();
    await expect(kata.locator(".arti")).not.toBeEmpty();
    const keKamus = modul(page, "br-kata").getByRole("link", { name: /^Selengkapnya tentang .+ di Kamus$/ });
    await expect(keKamus).toHaveAttribute("href", `/cerita/kamus#${hariIni}`);
    await expect(keKamus.locator(".sr-only")).toHaveText(` tentang ${await kata.locator(".kata").textContent()} di Kamus`);

    await pada(page, "2026-11-10", "08:00");
    await page.reload();
    await expect(kata).toBeVisible();
    expect(await kata.getAttribute("data-kata")).not.toBe(hariIni);
  });
});

test.describe("tautan Selengkapnya", () => {
  test("tampil Selengkapnya, pembaca layar mendengar tujuannya", async ({ page }) => {
    await page.goto("/");
    const tujuan = [
      ["Transportasi", "/jalan"],
      ["Layanan Warga", "/info"],
      ["Things to Do", "/things-to-do"],
      ["Batam dalam Angka", "/cerita/angka"],
      ["Berita", "/berita"],
      ["Jadwal Feri", "/jalan/feri"],
    ];
    for (const [nama, href] of tujuan) {
      const a = page.getByRole("link", { name: `Selengkapnya tentang ${nama}`, exact: true });
      await expect(a).toHaveAttribute("href", href);
      // Yang terlihat tetap "Selengkapnya →" (keputusan pemilik); tujuannya hanya untuk pembaca layar.
      await expect(a.locator(".sr-only")).toHaveText(` tentang ${nama}`);
      await expect(a.locator("[aria-hidden='true']")).toHaveText("→");
    }
  });
});

test.describe("aksesibilitas", () => {
  for (const tema of ["light", "dark"] as const) {
    test(`tiga modul lolos axe, tema ${tema}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
      await pada(page, "2026-11-09", "14:00");
      await page.goto("/");
      await expect(modul(page, "br-feri").locator("li[data-feri]").first()).toBeVisible();
      await expect(modul(page, "br-kata").locator("[data-kata]")).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .include('section[aria-labelledby="br-feri"]')
        .include('section[aria-labelledby="br-bilangan"]')
        .include('section[aria-labelledby="br-kata"]')
        .analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});
