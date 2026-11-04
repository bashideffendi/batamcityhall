import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import tempat from "../../data/places.json" with { type: "json" };
import stats from "../../data/places_stats.json" with { type: "json" };

// Tes tidak boleh memanggil MSS atau BMKG. Stempel frame radar memakai waktu Singapura.
const SEKARANG_TS = () => {
  const d = new Date(Date.now() + 8 * 3600 * 1000 - 5 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}`;
};

async function tiruApi(page: Page, hujanDi: string | null = null) {
  const ts = SEKARANG_TS();
  const kec = hujanDi
    ? [{ code: "21.71.99", name: hujanDi, kab: "Batam", land: 50, rain: 30, ringan: 30, sedang: 0, lebat: 0 }]
    : [];
  await page.route("**/api/frames", (r) =>
    r.fulfill({
      json: {
        frames: [{ ts, url: "", time: "12.00", day: "" }],
        echo: hujanDi
          ? { near: true, within: true, ringan: 30, sedang: 0, lebat: 0, maxLevel: "ringan", kec, lastTs: ts }
          : null,
      },
    }),
  );
  await page.route("**/api/berita", (r) => r.fulfill({ status: 503, json: {} }));
  await page.route("**/api/radar-citra/**", (r) => r.fulfill({ status: 404, body: "" }));
  await page.route("**/api/ofs-frame", (r) => r.fulfill({ json: { frames: [], nowIndex: 0 } }));
  await page.route("**/api/perairan", (r) => r.fulfill({ json: { warns: [] } }));
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
}

test.beforeEach(async ({ page }) => {
  await tiruApi(page);
});

test.describe("beranda dan menu", () => {
  test("Loket 06 terbuka dan menuju Info Warga", async ({ page }) => {
    await page.goto("/info");
    await expect(page.getByRole("heading", { level: 1, name: "Info Warga" })).toBeVisible();
    await page.getByRole("link", { name: /^Direktori/ }).click();
    await expect(page).toHaveURL(/\/info\/direktori$/);
  });

  test("alamat pendek /darurat dialihkan", async ({ page }) => {
    await page.goto("/darurat");
    await expect(page).toHaveURL(/\/info\/darurat$/);
  });
});

test.describe("direktori", () => {
  test("jumlah total dan per kategori cocok dengan statistik", async ({ page }) => {
    await page.goto("/info/direktori");
    await expect(page.locator(".bch-lede")).toContainText(`${stats.total_tempat} tempat`);
    for (const [k, n] of Object.entries(stats.per_kategori)) {
      await expect(page.locator(`[data-kategori="${k}"]`)).toHaveText(`${n} tempat`);
    }
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
  });

  test("pencarian menemukan tempat dan tersimpan di URL", async ({ page }) => {
    await page.goto("/info/direktori");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
    await page.getByLabel("Cari tempat").fill("mal pelayanan");
    await expect(page.getByRole("link", { name: "Mal Pelayanan Publik Kota Batam" })).toBeVisible();
    await expect(page).toHaveURL(/q=mal/);
    await page.reload();
    await expect(page.getByLabel("Cari tempat")).toHaveValue("mal pelayanan");
    await expect(page.getByRole("link", { name: "Mal Pelayanan Publik Kota Batam" })).toBeVisible();
  });

  test("filter kecamatan, kategori, lokasi, dan hapus filter", async ({ page }) => {
    await page.goto("/info/direktori?kategori=kesehatan");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.per_kategori.kesehatan));
    await page.getByRole("button", { name: "Hapus filter" }).click();
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
    await page.getByLabel("Lokasi di peta").selectOption("perlu_diisi_user");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute(
      "data-jumlah",
      String(stats.per_status_koordinat.perlu_diisi_user),
    );
    await page.getByLabel("Lokasi di peta").selectOption("");
    await page.locator('label:has-text("Kecamatan") select').first().selectOption("Galang");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute(
      "data-jumlah",
      String((stats.per_kecamatan as Record<string, number>).Galang),
    );
    await expect(page.getByLabel("Kelurahan")).toBeEnabled();
  });

  test("subkategori kosong jujur, bukan 404", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    await expect(page.locator(".bch-kelengkapan")).toContainText("831");
    await page.getByRole("link", { name: /Dokter gigi/ }).click();
    await expect(page.locator(".bch-lede")).toContainText("Belum ada data. Kenal tempatnya?");
  });

  test("subkategori kosong menampilkan daftar OSM terpisah dan berlabel", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan/apotek");
    await expect(page.locator(".bch-lede")).toContainText("Belum ada data");
    const osm = page.locator("[data-daftar-osm]");
    await expect(osm).toContainText("OpenStreetMap");
    await expect(osm).toContainText("belum kami cek");
    expect(await osm.locator("li").count()).toBeGreaterThan(5);
  });

  test("kategori dan tempat yang tidak ada 404", async ({ page }) => {
    expect((await page.goto("/info/direktori/tidak-ada"))?.status()).toBe(404);
    expect((await page.goto("/info/tempat/tidak-ada"))?.status()).toBe(404);
  });

  test("kuliner tidak menampilkan rating", async ({ page }) => {
    await page.goto("/info/direktori/kuliner");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/rating|ulasan|\d[.,]\d\s*★/i);
  });
});

test.describe("kartu tempat", () => {
  test("kartu lengkap dengan koordinat terverifikasi", async ({ page }) => {
    await page.goto("/info/tempat/mpp-batam");
    const kartu = page.locator(".bch-kartu-museum");
    await expect(kartu.getByRole("heading", { level: 1 })).toHaveText("Mal Pelayanan Publik Kota Batam");
    await expect(kartu.locator("[data-baris-museum]")).toContainText("BELUM DICEK ULANG");
  });

  test("tempat tanpa koordinat jujur soal peta", async ({ page }) => {
    await page.goto("/info/tempat/ppat-yulianti");
    await expect(page.getByText("Kami tidak menebak koordinat.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Lihat di peta" })).toHaveCount(0);
  });

  test("PPAT berlabel Beta dan punya Cek status", async ({ page }) => {
    await page.goto("/info/tempat/ppat-yulianti");
    await expect(page.getByText("Beta, data komunitas, verifikasi sendiri").first()).toBeVisible();
    await page.getByRole("link", { name: "Cek status" }).click();
    await expect(page).toHaveURL(/bantuan-hukum#cek-status/);
    await expect(page.getByRole("heading", { name: "Cek status" })).toBeVisible();
  });

  test("kampung tua hanya kartu minimal", async ({ page }) => {
    await page.goto("/info/direktori/kampung-tua");
    const href = await page.locator(".bch-card h3 a").first().getAttribute("href");
    await page.goto(href as string);
    const teks = await page.locator(".bch-kartu-museum").innerText();
    expect(teks).toContain("Batas, luas, dan status lahan tidak kami tampilkan");
    expect(page.url()).toContain("/info/tempat/");
  });

  test("gambar OG tiap tempat ada", async ({ page, request }) => {
    await page.goto("/info/tempat/mpp-batam");
    const url = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(url as string).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("hujan di kecamatan muncul hanya kalau radar melihat hujan", async ({ page }) => {
    await page.goto("/info/tempat/mpp-batam");
    await expect(page.locator("[data-hujan-kecamatan]")).toHaveCount(0);
    await page.unrouteAll();
    await tiruApi(page, "Batam Kota");
    await page.goto("/info/tempat/mpp-batam");
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText("Lagi hujan di Batam Kota");
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText("Perkiraan radar MSS");
  });
});

test.describe("panduan", () => {
  test("nomor darurat lengkap dengan peringatan situs palsu dan tanpa peta", async ({ page }) => {
    await page.goto("/info/darurat");
    for (const n of ["112", "110", "113", "115", "119"]) {
      await expect(page.locator(".bch-nomor", { hasText: new RegExp(`^${n}$`) })).toHaveAttribute("href", `tel:${n}`);
    }
    await expect(page.locator("[data-peringatan-situs]")).toContainText("bukan situs resmi");
    await expect(page.locator('a[href*="damkarbatam"]')).toHaveCount(0);
    await expect(page.locator(".peta")).toHaveCount(0);
  });

  test("urusan tanah: delapan baris, lima langkah, bebas catatan kerja", async ({ page }) => {
    await page.goto("/info/urusan-tanah");
    await expect(page.locator("[data-tabel-tanah] tbody tr")).toHaveCount(8);
    await expect(page.locator("[data-langkah-jual-beli] li")).toHaveCount(5);
    await expect(page.getByText("wajib dicek ke PPAT atau BP Batam")).toBeVisible();
    await expect(page.locator("main")).not.toContainText("riset");
  });

  test("bantuan hukum: Posbakum didahulukan, profesi Beta", async ({ page }) => {
    await page.goto("/info/bantuan-hukum");
    const judul = await page.locator("main h2").allTextContents();
    expect(judul[0]).toContain("Posbakum");
    await expect(page.locator("[data-label-beta]")).toContainText("Beta, data komunitas, verifikasi sendiri");
    await expect(page.locator("#profesi .bch-card").first()).toContainText("Cek status");
  });

  test("kecamatan pulau menjelaskan soal PPAT", async ({ page }) => {
    await page.goto("/info/kecamatan/galang");
    await expect(page.getByText("PPAT terdekat ada di Batam Kota atau Lubuk Baja")).toBeVisible();
    await page.goto("/info/kecamatan/batam-kota");
    await expect(page.getByText("PPAT terdekat")).toHaveCount(0);
  });

  test("draf privasi dan syarat berlabel draf", async ({ page }) => {
    for (const h of ["/privasi", "/syarat"]) {
      await page.goto(h);
      await expect(page.getByText(/Draf, belum ditinjau ahli hukum/)).toBeVisible();
    }
  });
});

test.describe("pin di peta beranda", () => {
  test("default hanya landmark, toggle menambah pin", async ({ page }) => {
    await page.goto("/");
    const peta = page.locator(".peta");
    await expect(peta).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    await expect(peta).toHaveAttribute("data-pin-tampil", /^\d+$/);
    const awal = Number(await peta.getAttribute("data-pin-tampil"));
    expect(awal).toBeGreaterThan(0);
    await page.getByRole("checkbox", { name: /Kuliner/ }).check();
    await expect.poll(async () => Number(await peta.getAttribute("data-pin-tampil"))).toBeGreaterThan(awal);
    await page.getByRole("checkbox", { name: /Landmark/ }).uncheck();
    await page.getByRole("checkbox", { name: /Kuliner/ }).uncheck();
    await expect(peta).toHaveAttribute("data-pin-tampil", "0");
  });

  test("radar tampil dan bisa dimatikan", async ({ page }) => {
    await page.goto("/");
    const peta = page.locator(".peta");
    await expect(peta).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    await expect(peta).toHaveAttribute("data-radar", /^\d{12}$/);
    await page.getByRole("checkbox", { name: /Hujan/ }).uncheck();
    await expect(peta).not.toHaveAttribute("data-radar", /.+/);
  });

  test("tautan ?tempat= membuka kartu, tutup menghapus parameter", async ({ page }) => {
    await page.goto("/?tempat=masjid-agung-raja-hamidah");
    await expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    const kartu = page.getByRole("complementary", { name: /Kartu/ });
    await expect(kartu).toBeVisible();
    await expect(kartu.getByRole("link", { name: "Buka kartu lengkap" })).toHaveAttribute(
      "href",
      "/info/tempat/masjid-agung-raja-hamidah",
    );
    await expect(page.locator(".peta")).toHaveAttribute("data-pin-tampil", /^\d+$/);
    await page.getByRole("button", { name: "Tutup kartu" }).click();
    await expect(kartu).toHaveCount(0);
    expect(page.url()).not.toContain("tempat=");
  });

  test("?tempat= tanpa koordinat tidak membuka apa pun", async ({ page }) => {
    await page.goto("/?tempat=ppat-yulianti");
    await expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    await expect(page.locator(".peta")).toHaveAttribute("data-pin-tampil", /^\d+$/);
    await expect(page.getByRole("complementary", { name: /Kartu/ })).toHaveCount(0);
  });

  test("cari tempat membuka kartunya", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    await page.getByLabel("Cari tempat di peta").fill("masjid agung raja");
    await page.getByRole("button", { name: /Masjid Agung Raja Hamidah/ }).click();
    await expect(page.getByRole("complementary", { name: /Kartu Masjid Agung Raja Hamidah/ })).toBeVisible();
    expect(page.url()).toContain("tempat=masjid-agung-raja-hamidah");
  });

  test("di sekitarku: di luar Batam dikatakan terus terang", async ({ page, context }) => {
    await context.grantPermissions(["geolocation"]);
    await context.setGeolocation({ latitude: -6.2, longitude: 106.8 });
    await page.goto("/");
    await expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 30_000 });
    await page.getByRole("button", { name: "Di sekitarku" }).click();
    await expect(page.locator(".peta-cari-pesan")).toContainText("di luar peta Batam");
    await context.setGeolocation({ latitude: 1.13, longitude: 104.05 });
    await page.getByRole("button", { name: "Di sekitarku" }).click();
    await expect(page.locator(".peta-cari-pesan")).toContainText("tidak dikirim ke mana pun");
  });

  test("ada jalan keluar keyboard ke daftar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Lihat semua sebagai daftar" })).toHaveAttribute(
      "href",
      "/info/direktori",
    );
  });
});

test.describe("widget silang", () => {
  test("berteduh di Langit & Laut hanya saat hujan di Batam", async ({ page }) => {
    await page.unrouteAll();
    await tiruApi(page, "Lubuk Baja");
    await page.goto("/langit-laut?mode=hujan");
    if (test.info().project.name === "hp") await page.getByRole("button", { name: /^Detail/ }).click();
    await expect(page.getByRole("heading", { name: "Buat berteduh" })).toBeVisible();
  });

  test("Makan menampilkan hujan di kecamatannya", async ({ page }) => {
    const p = (tempat as { id: string; kategori: string; kecamatan: string | null }[]).find(
      (x) => x.kategori === "kuliner" && x.kecamatan,
    );
    await page.unrouteAll();
    await tiruApi(page, p?.kecamatan as string);
    await page.goto(`/makan/tempat/${p?.id}`);
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText(`Lagi hujan di ${p?.kecamatan}`);
  });
});

test.describe("aksesibilitas", () => {
  for (const tema of ["light", "dark"] as const) {
    for (const h of [
      "/info",
      "/info/direktori",
      "/info/direktori/pertanahan-hukum",
      "/info/direktori/kesehatan/dokter-gigi",
      "/info/tempat/mpp-batam",
      "/info/kecamatan/galang",
      "/info/darurat",
      "/info/urusan-tanah",
      "/info/bantuan-hukum",
      "/info/jasa-dokumen",
      "/info/warga-baru",
      "/koreksi",
      "/privasi",
    ]) {
      test(`${h} (${tema}) tanpa pelanggaran axe`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.goto(h);
        await expect(page.locator("main")).toBeVisible();
        const hasil = await new AxeBuilder({ page }).analyze();
        expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
      });
    }
  }

  test("tidak ada scroll horizontal di HP", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    for (const h of ["/info/direktori", "/info/urusan-tanah", "/info/darurat", "/info/tempat/mpp-batam"]) {
      await page.goto(h);
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih, h).toBeLessThanOrEqual(0);
    }
  });
});
