import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Tes tidak boleh memanggil MSS atau BMKG: semua /api/* ditiru. Stempel radar memakai waktu Singapura.
const tsDari = (ms: number) => {
  const d = new Date(ms + 8 * 3600 * 1000 - 5 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
};

type Tiruan = { hujan?: boolean; radarGagal?: boolean; ombakGagal?: boolean; saat?: number };

async function tiruApi(
  page: Page,
  { hujan = false, radarGagal = false, ombakGagal = false, saat = Date.now() }: Tiruan = {},
) {
  const ts = tsDari(saat);
  await page.route("**/api/frames", (r) =>
    radarGagal
      ? r.fulfill({ status: 503, json: {} })
      : r.fulfill({
          json: {
            frames: [{ ts, url: "", time: "12.00", date: "" }],
            count: 1,
            stale: false,
            ageMinutes: 5,
            source: "mss",
            echo: {
              near: hujan,
              coverage: 0.1,
              level: hujan ? "sedang" : null,
              lastTs: ts,
              lookbackMin: 60,
              kec: hujan
                ? [
                    {
                      code: "21.71.99",
                      name: "Lubuk Baja",
                      kab: "Batam",
                      land: 10,
                      rain: 8,
                      ringan: 2,
                      sedang: 6,
                      lebat: 0,
                    },
                  ]
                : [],
            },
          },
        }),
  );
  await page.route("**/api/perairan", (r) =>
    ombakGagal
      ? r.fulfill({ status: 503, json: {} })
      : r.fulfill({
          json: {
            code: "P.R.02",
            name: "Perairan Kep. Batam",
            issued: "",
            current: null,
            upcoming: false,
            warns: [],
            slots: [
              {
                validFrom: new Date(saat - 3600e3).toISOString(),
                validTo: new Date(saat + 3600e3).toISOString(),
                waveCat: "Sedang",
                waveM: 1.2,
              },
            ],
          },
        }),
  );
  await page.route("**/api/ofs-frame", (r) => r.fulfill({ json: { frames: [], nowIndex: 0 } }));
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
  await page.route("**/api/radar-citra/**", (r) => r.fulfill({ status: 404, body: "" }));
}

const penampil = (page: Page) => page.locator(".mural-penampil");
const siap = (page: Page) => expect(penampil(page)).toHaveAttribute("data-keadaan", "siap", { timeout: 60_000 });

async function buka(page: Page, url = "/mural") {
  await page.goto(url);
  await siap(page);
}

const META = JSON.parse(
  readFileSync(join(process.cwd(), "public/mural/harbourbay-nagoya-jodoh/meta.json"), "utf8"),
) as { lebar: number; tinggi: number; titik: { id: string; x: number; y: number }[] };

test.describe("penampil dan strip", () => {
  test("tile placeholder tampil dan labelnya wajib ada", async ({ page }) => {
    await tiruApi(page);
    const tile: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/mural/harbourbay-nagoya-jodoh/segmen_files/") && r.ok()) tile.push(r.url());
    });
    await buka(page);
    await expect.poll(() => tile.length, { timeout: 30_000 }).toBeGreaterThan(0);
    await expect(page.locator(".mural-label-atas")).toHaveText("Ilustrasi placeholder, bukan posisi tepat");
    await expect(page.locator(".mural-label-feri")).toContainText("posisi perkiraan, bukan AIS");
  });

  test("8 perhentian: satu aktif, tujuh segera", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    const nav = page.getByRole("navigation", { name: "Perhentian mural" });
    await expect(nav.getByRole("button")).toHaveCount(8);
    await expect(nav.locator('[aria-current="true"]')).toHaveCount(1);
    await expect(nav.locator('[aria-current="true"]')).toContainText("Harbour Bay");
    await expect(nav.locator("text=segera")).toHaveCount(7);
    await nav.locator('[data-perhentian="rempang"]').click();
    const panel = page.locator('[data-segera="rempang"]');
    await expect(panel).toContainText("segera");
    await expect(panel).toContainText("Dari Jembatan IV sampai Jembatan V");
    await expect(panel).not.toContainText(/quest|Cari!|poin/i);
  });

  test("keyboard bawaan penampil memperbesar", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    await expect(penampil(page)).toHaveAttribute("data-zoom", /.+/);
    const sebelum = Number(await penampil(page).getAttribute("data-zoom"));
    await page.locator(".openseadragon-canvas").focus();
    await page.keyboard.press("=");
    await page.keyboard.press("+");
    await expect.poll(async () => Number(await penampil(page).getAttribute("data-zoom"))).toBeGreaterThan(sebelum);
  });
});

test.describe("hotspot dan kartu", () => {
  test("daftar: fokus masuk ke kartu, Esc menutup, fokus kembali", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    const tombol = page.locator('[data-spot="harbour-bay"]');
    await tombol.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toHaveText("Gerbang kuliner laut");
    await expect(dialog).toContainText("Ilustrasi placeholder, bukan posisi tepat");
    await expect(dialog).toContainText("Terminal feri internasional ke Singapura");
    const labelled = await dialog.getAttribute("aria-labelledby");
    expect(labelled).toBeTruthy();
    await expect(page.locator(`[id="${labelled}"]`)).toHaveText("Gerbang kuliner laut");
    await expect.poll(() => page.evaluate(() => !!document.activeElement?.closest("dialog"))).toBe(true);
    await expect(page).toHaveURL(/spot=harbour-bay/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(tombol).toBeFocused();
    await expect(page).not.toHaveURL(/spot=/);
  });

  test("klik pin di kanvas membuka kartu yang sama", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    await expect(penampil(page)).toHaveAttribute("data-skala", /.+/);
    await page.waitForTimeout(1000);
    await page.locator(".mural-panggung").evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top));
    const h = META.titik.find((t) => t.id === "harbour-bay")!;
    const kotak = (await penampil(page).boundingBox())!;
    const d = await penampil(page).evaluate((e) => ({ ...(e as HTMLElement).dataset }));
    await page.mouse.click(
      kotak.x + Number(d.ox) + h.x * Number(d.skala),
      kotak.y + Number(d.oy) + h.y * Number(d.skala),
    );
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog").getByRole("heading", { level: 2 })).toHaveText("Gerbang kuliner laut");
  });

  test("tautan ?spot= membuka kartu, dan titik tak dikenal diabaikan", async ({ page }) => {
    await tiruApi(page);
    await buka(page, "/mural?spot=kopi-harum-manis");
    await expect(page.getByRole("dialog").getByRole("heading", { level: 2 })).toHaveText("Kopitiam sejak 1985");
    await buka(page, "/mural?spot=tidak-ada");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("kartu kampung tua: penanda dan rujukan, tanpa quest", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    await page.locator('[data-spot="tanjung-uma"]').click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("link", { name: "Baca di modul Kampung Tua" })).toHaveAttribute(
      "href",
      "/cerita/kampung-tua",
    );
    await expect(dialog.locator("[data-catatan-quest]")).toHaveCount(0);
    await expect(dialog).not.toContainText(/hektare|status lahan|batas wilayah/i);
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-progres-quest]")).toContainText("0 dari 5");
  });

  test("tidak ada instruksi penyusun di halaman", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    const teks = await page.locator("main, body").first().innerText();
    expect(teks).not.toMatch(/PERLU-CEK|ESTIMASI-KASAR|wajib cek|Kartu netral|ide_hotspot|🧭|⚠️/);
  });
});

test.describe("quest", () => {
  test("progres bertambah, tersimpan, dan bisa diulang", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    const progres = page.locator("[data-progres-quest]");
    await expect(progres).toHaveAttribute("aria-live", "polite");
    await expect(progres).toContainText("0 dari 5");
    await page.locator('[data-spot="kawasan-nagoya"]').click();
    await expect(page.getByRole("dialog").locator("[data-catatan-quest]")).toContainText("1 dari 5");
    await page.keyboard.press("Escape");
    await expect(progres).toContainText("1 dari 5");
    await expect(page.locator("[data-lencana-quest]")).toHaveText("Cari! 1/5");
    await expect(page.locator('[data-target-quest="kawasan-nagoya"]')).toContainText("Ditemukan");
    const simpanan = await page.evaluate(() => localStorage.getItem("bch-mural-quest"));
    expect(simpanan).toContain("kawasan-nagoya");
    await buka(page);
    await expect(page.locator("[data-progres-quest]")).toContainText("1 dari 5");
    await page.getByRole("button", { name: "Mulai lagi" }).click();
    await expect(page.locator("[data-progres-quest]")).toContainText("0 dari 5");
  });

  test("localStorage ditolak: halaman tetap jalan", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new Error("ditolak");
        },
      });
    });
    await tiruApi(page);
    await buka(page);
    await page.locator('[data-spot="harbour-bay"]').click();
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-progres-quest]")).toContainText("1 dari 5");
  });

  test("petunjuk menunjuk target berikutnya tanpa menghitung temuan", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    await page.getByRole("button", { name: "Tunjukkan petunjuk" }).click();
    await expect(page.locator("[data-progres-quest]")).toContainText("0 dari 5");
  });
});

test.describe("overlay hidup", () => {
  test("hujan per kecamatan tertulis, dan gagal radar jujur", async ({ page }) => {
    await tiruApi(page, { hujan: true });
    await buka(page);
    await expect(page.locator('[data-keadaan-hujan="tersedia"] dd')).toContainText("Lubuk Baja: hujan sedang");
    await expect(page.locator('[data-keadaan-hujan="tersedia"] dd')).toContainText("Perkiraan radar");
  });

  test("radar dan ombak gagal: tertulis tidak tersedia", async ({ page }) => {
    await tiruApi(page, { radarGagal: true, ombakGagal: true });
    await buka(page);
    await expect(page.locator('[data-keadaan-hujan="tidak-tersedia"] dd')).toContainText("bukan berarti cerah");
    await expect(page.locator('[data-keadaan-ombak="tidak-tersedia"] dd')).toContainText("bukan berarti laut tenang");
  });

  test("ombak tertulis dari BMKG, tanpa kata real-time", async ({ page }) => {
    await tiruApi(page);
    await buka(page);
    await expect(page.locator('[data-keadaan-ombak="tersedia"] dd')).toContainText("1,2 m");
    const teks = await page.locator(".mural-keadaan").innerText();
    expect(teks.toLowerCase()).not.toMatch(/real-?time|langsung dari kapal|live/);
  });

  test("feri dari jadwal: zona asal benar dan label wajib", async ({ page }) => {
    // 08:30 WIB: feri Harbour Bay 08:30 WIB berangkat; feri HarbourFront 08:15 SGT = 07:15 WIB masih di jalan sampai 08:05.
    const saat = Date.parse("2026-11-05T08:40:00+07:00");
    await page.clock.setFixedTime(saat);
    await tiruApi(page, { saat });
    await buka(page);
    const feri = page.locator("[data-keadaan-feri]");
    await expect(feri).toContainText("Posisi perkiraan, bukan AIS");
    await expect(feri).toContainText("Harbour Bay ke HarbourFront");
    await expect(feri).toContainText("08.30 WIB");
    await expect(feri).toContainText("Jadwal Horizon per 4 November 2026");
    await expect(feri).toContainText("Puteri Harbour");
    await expect(penampil(page)).toHaveAttribute("data-kapal", /[1-9]/);
  });

  test("feri dari Singapura ditulis SGT dan WIB", async ({ page }) => {
    const saat = Date.parse("2026-11-05T07:40:00+07:00");
    await page.clock.setFixedTime(saat);
    await tiruApi(page, { saat });
    await buka(page);
    const feri = page.locator("[data-keadaan-feri]");
    await expect(feri).toContainText("HarbourFront ke Harbour Bay");
    await expect(feri).toContainText("08.15 SGT");
    await expect(feri).toContainText("07.15 WIB");
  });

  test("cahaya mengikuti matahari", async ({ page }) => {
    const saat = Date.parse("2026-11-05T23:00:00+07:00");
    await page.clock.setFixedTime(saat);
    await tiruApi(page, { saat });
    await buka(page);
    await expect(page.locator('[data-keadaan-cahaya="malam"] dd')).toContainText("23.00 WIB");
    await expect(page.locator(".mural-cahaya")).toHaveAttribute("data-fase", "malam");
  });

  test("hidup: loop jalan. Tombol tenang: loop berhenti", async ({ page }) => {
    await tiruApi(page, { hujan: true });
    await buka(page);
    await expect(penampil(page)).toHaveAttribute("data-overlay", "hidup");
    const baca = async () => Number(await penampil(page).getAttribute("data-gambar"));
    const a = await baca();
    await expect.poll(baca, { timeout: 5000 }).toBeGreaterThan(a + 3);
    await page.locator(".mural-keadaan").getByRole("button").first().click();
    await expect(penampil(page)).toHaveAttribute("data-overlay", "diam");
    const b = await baca();
    await page.waitForTimeout(800);
    expect(await baca()).toBeLessThanOrEqual(b + 1);
  });

  test("prefers-reduced-motion: overlay diam sejak awal", async ({ browser, baseURL }) => {
    const konteks = await browser.newContext({ reducedMotion: "reduce", baseURL });
    const page = await konteks.newPage();
    await tiruApi(page, { hujan: true });
    await buka(page);
    await expect(penampil(page)).toHaveAttribute("data-overlay", "diam");
    // Gambar ulang hanya saat tile masuk atau pandangan berubah. Setelah tile selesai, tidak ada loop.
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
    const a = await penampil(page).getAttribute("data-gambar");
    await page.waitForTimeout(1000);
    expect(await penampil(page).getAttribute("data-gambar")).toBe(a);
    await konteks.close();
  });
});

test.describe("alat GCP", () => {
  test("noindex dan bukan bagian sitemap", async ({ page, request }) => {
    await tiruApi(page);
    await page.goto("/mural/gcp");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const peta = await request.get("/sitemap.xml");
    expect(await peta.text()).not.toContain("/mural/gcp");
  });

  test("klik gambar dan peta menghasilkan JSON, lalu unduhan berkas", async ({ page }) => {
    await tiruApi(page);
    await page.goto("/mural/gcp");
    const panggung = page.locator(".gcp-panggung");
    await expect(panggung).toHaveAttribute("data-siap-gambar", "true", { timeout: 60_000 });
    await expect(panggung).toHaveAttribute("data-siap-peta", "true", { timeout: 60_000 });
    await page.waitForTimeout(800);
    const tombol = page.locator("[data-pasangkan]");
    const posisi = [
      [0.3, 0.3],
      [0.7, 0.4],
      [0.5, 0.7],
    ];
    for (const [fx, fy] of posisi) {
      await page.locator("[data-gcp-gambar]").scrollIntoViewIfNeeded();
      const g = (await page.locator("[data-gcp-gambar]").boundingBox())!;
      await page.mouse.click(g.x + g.width * fx, g.y + g.height * fy);
      await expect(page.locator("[data-tunda]")).not.toContainText("Gambar: belum diklik");
      await page.locator("[data-gcp-peta]").scrollIntoViewIfNeeded();
      const m = (await page.locator("[data-gcp-peta]").boundingBox())!;
      await page.mouse.click(m.x + m.width * fx, m.y + m.height * fy);
      await expect(tombol).toBeEnabled();
      await tombol.click();
      await page.locator("[data-gcp-gambar]").scrollIntoViewIfNeeded();
    }
    await expect(page.locator("[data-gcp-baris]")).toHaveCount(3);
    const json = JSON.parse(await page.locator("[data-keluaran]").inputValue()) as {
      segmen: string;
      transformasi: string;
      gcps: { resource: number[]; geo: number[] }[];
    };
    expect(json.segmen).toBe("harbourbay-nagoya-jodoh");
    expect(json.transformasi).toBe("thinPlateSpline");
    expect(json.gcps).toHaveLength(3);
    expect(json.gcps[0].geo[0]).toBeGreaterThan(103);
    const [unduhan] = await Promise.all([page.waitForEvent("download"), page.locator("[data-unduh]").click()]);
    expect(unduhan.suggestedFilename()).toBe("harbourbay-nagoya-jodoh.gcps.json");

    // Uji transformasi dua arah memakai @allmaps/transform.
    await page.getByLabel("Mode klik").selectOption("uji");
    await page.locator("[data-gcp-gambar]").scrollIntoViewIfNeeded();
    const g = (await page.locator("[data-gcp-gambar]").boundingBox())!;
    await page.mouse.click(g.x + g.width * 0.5, g.y + g.height * 0.5);
    await expect(page.locator("[data-hasil-uji]")).toContainText("lng");
  });
});

test.describe("aksesibilitas dan tata letak", () => {
  for (const tema of ["light", "dark"] as const) {
    test(`axe bersih, tema ${tema}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
      await tiruApi(page, { hujan: true });
      await buka(page);
      const hasil = await new AxeBuilder({ page }).analyze();
      expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
      await page.locator('[data-spot="harbour-bay"]').click();
      const kartu = await new AxeBuilder({ page }).include("dialog").analyze();
      expect(kartu.violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
    });

    test(`halaman cara dibuat, tema ${tema}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
      await page.goto("/mural/cara-dibuat");
      const hasil = await new AxeBuilder({ page }).analyze();
      expect(hasil.violations.map((v) => v.id)).toEqual([]);
    });
  }

  test("tanpa scroll horizontal di 360 px", async ({ browser, baseURL }) => {
    const konteks = await browser.newContext({ viewport: { width: 360, height: 740 }, baseURL });
    const page = await konteks.newPage();
    await tiruApi(page);
    await buka(page);
    const lebar = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(lebar).toBeLessThanOrEqual(360);
    // Target sentuh tombol strip dan daftar minimal 44 px.
    const tinggi = await page
      .locator(".mural-strip button, .mural-daftar button, .mural-kontrol button")
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(Math.min(...tinggi)).toBeGreaterThanOrEqual(44);
    await konteks.close();
  });

  test("OG per titik tersedia, titik tak dikenal 404", async ({ request }) => {
    const ok = await request.get("/mural/og/harbour-bay");
    expect(ok.status()).toBe(200);
    expect(ok.headers()["content-type"]).toContain("image/png");
    expect((await request.get("/mural/og/tidak-ada")).status()).toBe(404);
  });
});
