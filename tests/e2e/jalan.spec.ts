import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import koridor from "../../data/trans_batam/koridor.json" with { type: "json" };

// Tes tidak boleh memanggil MSS atau BMKG.
async function tiruApi(page: Page) {
  await page.route("**/api/frames", (r) => r.fulfill({ json: { frames: [], echo: null } }));
  await page.route("**/api/radar-citra/**", (r) => r.fulfill({ status: 404, body: "" }));
  await page.route("**/api/ofs-frame", (r) => r.fulfill({ json: { frames: [], nowIndex: 0 } }));
  await page.route("**/api/perairan", (r) => r.fulfill({ json: { warns: [] } }));
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
  await page.route("**/api/berita**", (r) => r.fulfill({ status: 503, json: {} }));
}

/** Jam browser dibekukan pada jam WIB tertentu, 5 Nov 2026 (Kamis). */
const bekukan = (page: Page, jam: string, tgl = "2026-11-05") =>
  page.clock.setFixedTime(new Date(`${tgl}T${jam}:00+07:00`));

test.beforeEach(async ({ page }) => {
  await page.route("**/api/berita", (r) => r.fulfill({ status: 503, json: {} }));
  await tiruApi(page);
});

test.describe("Trans Batam", () => {
  test("indeks memuat 10 koridor, K10 berlabel rencana, tanpa angka armada total", async ({ page }) => {
    await page.goto("/jalan/trans-batam");
    await expect(page.getByRole("heading", { level: 1, name: "Trans Batam" })).toBeVisible();
    await expect(page.locator(".jl-kartu-koridor")).toHaveCount(10);
    const k10 = page.locator('.jl-kartu-koridor[data-koridor="K10"]');
    await expect(k10).toContainText("Rencana, belum beroperasi");
    await expect(k10).toHaveAttribute("data-rencana", "");
    await expect(page.locator(".bch-page")).toContainText("Daftar halte dihimpun pada November 2026");
    await expect(page.locator(".bch-page")).toContainText(
      "Lihat di aplikasi SIP TB. Situs ini tidak melacak bus.",
    );
    await expect(page.locator('.jl-kartu-koridor[data-koridor="K1"]')).toContainText("05.45—19.00 WIB");
    const teks = await page.locator(".bch-page").innerText();
    expect(teks).not.toMatch(/tunai di dalam bus|120 halte|65 unit|2\.350\.305/);
    expect(teks).not.toMatch(/sumber sekunder|media sekunder|jam dari berita|perlu cek ulang|Headway/i);
  });

  test("peta bus menggambar sembilan koridor, bisa disorot dan diperbesar", async ({ page }) => {
    await page.goto("/jalan/trans-batam");
    await expect(page.getByRole("heading", { level: 2, name: "Peta Bus" })).toBeVisible();
    const svg = page.locator(".pb-svg");
    await expect(svg).toHaveCount(1);
    for (const id of ["K1", "K2", "K3", "K4", "K5", "K6", "K7", "K8", "K9"]) {
      await expect(svg.locator(`[data-garis="${id}"]`)).toHaveCount(1);
    }
    await expect(svg.locator('.pb-rencana[data-k="K10"]')).toHaveCount(1);
    const legenda = page.locator(".pb-legenda");
    for (const kata of ["Halte", "Halte Beberapa Koridor", "Halte Transit atau Ujung", "Pelabuhan", "Koridor Rencana"]) {
      await expect(legenda).toContainText(kata);
    }
    await expect(legenda.locator(".pb-chip")).toHaveCount(10);
    const k3 = legenda.getByRole("button", { name: /K3/ });
    await k3.click();
    await expect(svg).toHaveAttribute("data-sorot", "K3");
    await expect(k3).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: /Tampilkan Semua/ }).click();
    await expect(svg).not.toHaveAttribute("data-sorot", /.+/);
    const awal = await svg.getAttribute("viewBox");
    await page.getByRole("button", { name: "Perbesar peta" }).click();
    await expect(svg).not.toHaveAttribute("viewBox", awal ?? "");
    await expect(page.locator(".bch-page")).toContainText("Peta Bus Batam karya Farhan S. Fadhillah");
  });

  test("halaman koridor membuka peta dengan koridornya disorot", async ({ page }) => {
    await page.goto("/jalan/trans-batam/k7");
    await expect(page.locator(".pb-svg")).toHaveAttribute("data-sorot", "K7");
  });

  test("tiap koridor punya halaman", async ({ page }) => {
    for (const k of koridor.koridor) {
      await page.goto(`/jalan/trans-batam/${k.id.toLowerCase()}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(`Koridor ${k.id.slice(1)}: ${k.nama}`);
    }
    const r = await page.goto("/jalan/trans-batam/k11");
    expect(r?.status()).toBe(404);
  });

  test("K1: dua arah berbeda, tab bisa dengan keyboard, tanpa nomor urut", async ({ page }) => {
    await page.goto("/jalan/trans-batam/k1");
    const tab = page.getByRole("tab");
    await expect(tab).toHaveCount(2);
    const panel = page.getByRole("tabpanel");
    await expect(panel).toContainText("31 dari 56 halte tercatat.");
    await expect(panel).toContainText("Tiban Center");
    await expect(panel.locator(".jl-strip-gap")).toHaveCount(0);
    await expect(panel).not.toContainText("lokasi belum diisi");
    await expect(panel).not.toContainText("Sumber:");

    await tab.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(panel).toContainText("Green Land");
    await expect(panel.locator(".jl-strip-gap")).toHaveCount(2);
    await expect(panel.locator(".jl-strip-gap").first()).toHaveText("Beberapa halte di antaranya belum tercatat.");
    await expect(panel).not.toContainText("halte ke-");

    const fakta = page.locator(".bch-daftar").first();
    await expect(fakta).toContainText("05.45—19.00 WIB, setiap hari");
    await expect(fakta).toContainText("sekitar 20—35 menit");
    await expect(fakta).toContainText("Rp5.000, pelajar Rp2.500");
    await expect(fakta).toContainText("nontunai (BRIZZI, QRIS, dan aplikasi bank)");
    await expect(fakta).toContainText("Jeda Jumat");
    await expect(fakta).not.toContainText("Sumber");
    await expect(page.locator(".bch-page")).not.toContainText(/butuh line-offset|patterns per arah|Status data/);
  });

  test("K8: gap berangka bisa dihitung, halte di kedua sisi tidak tersambung", async ({ page }) => {
    await page.goto("/jalan/trans-batam/k8");
    const daftar = page.locator('.jl-strip-daftar[data-arah="K8_ke_jodoh"] > li');
    await expect(daftar.nth(5)).toContainText("Kabil Raya");
    await expect(daftar.nth(6)).toHaveText("Beberapa halte di antaranya belum tercatat.");
    await expect(daftar.nth(6)).toHaveAttribute("data-gap", "");
    await expect(daftar.nth(7)).toContainText("Pasar Angkasa");
    await expect(page.locator(".bch-page")).toContainText("Pelabuhan Telaga Punggur");
  });

  test("K10 halaman minimal tanpa halte dan jam", async ({ page }) => {
    await page.goto("/jalan/trans-batam/k10");
    await expect(page.locator(".bch-lede")).toContainText("Daftar halte, jam, dan tarifnya belum ada.");
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.locator(".jl-strip")).toHaveCount(0);
  });
});

test.describe("peta transportasi", () => {
  test("hanya titik, tanpa garis rute; yang kosong masuk daftar", async ({ page }) => {
    await page.goto("/jalan/peta");
    const peta = page.locator(".jl-peta");
    await expect(peta).toHaveAttribute("data-rute", /^[1-9]\d*$/, { timeout: 30_000 });
    expect(Number(await peta.getAttribute("data-titik"))).toBeGreaterThanOrEqual(10);
    const kosong = page.getByTestId("lokasi-belum-diisi");
    await expect(kosong).toContainText("Transferpoint Terminal Jodoh");
    await expect(kosong).toContainText("Gold Coast");
    await expect(kosong).not.toContainText("lokasi belum diisi");
    await expect(page.locator(".bch-prose")).toContainText("Singapore Cruise Centre");

    await page.getByRole("checkbox", { name: /Feri/ }).uncheck();
    await expect(peta).toHaveAttribute("data-titik", "3");
  });
});

test.describe("feri terakhir", () => {
  test("siang hari: per operator, jam lokal, dan konversi WIB", async ({ page }) => {
    await bekukan(page, "12:00");
    await page.goto("/jalan/feri");
    const w = page.locator(".jl-feri");
    await expect(w.getByRole("heading", { level: 2, name: "Feri Terakhir Hari Ini" })).toBeVisible();
    await expect(w.getByRole("heading", { level: 3, name: "Dari Batam" })).toBeVisible();
    await expect(w.getByRole("heading", { level: 3, name: "Ke Batam" })).toBeVisible();
    for (const kolom of ["Rute", "Operator", "Terakhir Hari Ini"]) {
      await expect(w.getByRole("columnheader", { name: kolom }).first()).toBeVisible();
    }
    const btc = w.locator(".jl-feri-baris", { hasText: "Batam Centre—HarbourFront" });
    const batamFast = btc.filter({ hasText: "BatamFast" });
    await expect(batamFast).toContainText("20.30 WIB");
    await expect(batamFast).toContainText("Masih ada");
    const majestic = btc.filter({ hasText: "Majestic" });
    await expect(majestic).toContainText("20.35 WIB");
    await expect(majestic).toContainText("Jadwal per Mei 2026.");
    await expect(w).toContainText("Jadwal dapat berubah. Tanyakan kepada operator sebelum berangkat.");
    await expect(majestic).not.toContainText("perlu cek ulang");
    await expect(majestic).not.toContainText("data lama");
    await expect(majestic.locator(".bch-status")).toHaveCount(1);

    const dariSg = w.locator(".jl-feri-baris", { hasText: "HarbourFront—Batam Centre" }).filter({ hasText: "BatamFast" });
    await expect(dariSg).toContainText("21.40 waktu Singapura");
    await expect(dariSg).toContainText("20.40 WIB");

    await expect(w.locator('[data-rute="tpg-tpi"]')).toContainText("sekitar 17.30");
    await expect(w.locator('[data-rute="skp-tbk"]')).toContainText("07.20");
    await expect(w.locator('[data-rute="skp-tbk"]')).toContainText("Sudah lewat");
    await expect(w.locator('[data-rute="b99-pelni"]').first()).toContainText("Bukan jadwal harian");
    await expect(w.locator('[data-rute="wfc-hfc"]').first()).toContainText("Tidak berlayar hari ini");
    await expect(w).toContainText("Jadwal dapat berubah. Tanyakan kepada operator sebelum berangkat.");

    await w.locator(".jl-feri-kosong summary").click();
    await expect(w.locator('.jl-feri-kosong [data-rute="hb-nirup"]')).toContainText("jadwal belum tersedia");
  });

  test("batas zona waktu: 20:45 WIB, Singapura sudah 21:45", async ({ page }) => {
    await bekukan(page, "20:45");
    await page.goto("/jalan/feri");
    const dariSg = page.locator(".jl-feri-baris", { hasText: "HarbourFront—Batam Centre" });
    await expect(dariSg.filter({ hasText: "BatamFast" })).toContainText("Sudah lewat");
    await expect(dariSg.filter({ hasText: "Sindo" })).toContainText("Masih ada");
  });

  test("kotak Hari Ini memuat feri, dengan catatan jadwal", async ({ page }) => {
    await bekukan(page, "12:00");
    await page.goto("/");
    const baris = page.locator('.br-pertama [data-baris="feri"]');
    await expect(baris).toContainText("Feri Terakhir ke Singapura");
    await expect(baris).toContainText("20.30");
    await expect(baris).toContainText("Batam Centre dan Harbour Bay");
    await expect(page.locator(".br-pembuka")).toContainText("Feri terakhir ke Singapura pukul 20.30 WIB.");
  });

  test("malam: tidak ada lagi keberangkatan ke Singapura", async ({ page }) => {
    await bekukan(page, "21:00");
    await page.goto("/");
    const baris = page.locator('.br-pertama [data-baris="feri"]');
    await expect(baris).toContainText("Habis");
    await expect(baris).toContainText("Besok mulai pukul 06.00 WIB");
    await expect(page.locator(".br-pembuka")).toContainText("Tidak ada lagi keberangkatan ke Singapura hari ini.");
  });

  test("detail Makan menampilkan feri terakhir dari terminal terdekat", async ({ page }) => {
    await bekukan(page, "12:00");
    await page.goto("/makan/tempat/abun-cha-kue");
    const w = page.locator(".jl-feri");
    await expect(w).toContainText("Harbour Bay", { timeout: 30_000 });
    await expect(w).toContainText("20.30 WIB");
    await expect(w.locator('[data-rute="hb-hfc"]')).toContainText("Horizon");
  });
});

test.describe("halaman feri dan pompong", () => {
  test("kartu rute: kolom naskah, jadwal lama satu baris, tautan operator, banner Gold Coast", async ({ page }) => {
    await page.goto("/jalan/feri");
    const btc = page.locator('.jl-kartu-rute[data-rute="btc-hfc"]');
    await expect(btc).toContainText("Harga Mulai dari");
    // Jadwal per rute dilipat: dibuka dulu.
    await btc.getByText("Lihat Jadwal").click();
    for (const kolom of ["Rute", "Operator", "Jam Berangkat", "Lama Perjalanan"]) {
      await expect(btc.getByRole("columnheader", { name: kolom })).toBeVisible();
    }
    await expect(btc).toContainText("Jadwal per Mei 2026. Tanyakan kepada operator.");
    await expect(btc).not.toContainText("data lama");
    await expect(btc.getByRole("link", { name: "Jadwal Operator" })).toHaveAttribute("href", /batamfast\.com/);
    await expect(page.locator('.jl-kartu-rute[data-rute="gcb-hfc"]')).toContainText("Terganggu");
    await expect(page.locator('.jl-kartu-rute[data-rute="tpg-tgu-roro"]')).toContainText("hanya dijual daring");
    await expect(page.locator('.jl-kartu-rute[data-rute="btc-stl"]')).toContainText("Berjaya Waterfront");
    await expect(page.locator(".bch-page")).toContainText("Natuna");
    await expect(page.locator(".bch-page")).not.toContainText(/Catatan migrasi|Catatan untuk Claude|1 Maritime Square/);
    await expect(page.locator('.bch-page a[href*=".go.id"]')).toHaveCount(0);
  });

  test("panduan bersih dari instruksi penyusun", async ({ page }) => {
    await page.goto("/jalan/feri/panduan");
    const isi = page.locator(".bch-prose");
    for (const kata of [
      "Paspor dan Imigrasi",
      "Waktu Lapor Masuk",
      "Feri Terakhir untuk Pulang Hari",
      "Barang Bawaan dari Singapura",
      "FOB USD 500",
      "45 menit",
      "Musim Angin Utara",
      "pelampung",
      "Biaya tambahan bahan bakar",
      "Rp100 juta",
      "Aturan imigrasi dan bea cukai dapat berubah. Pastikan sebelum berangkat.",
    ]) {
      await expect(isi).toContainText(kata);
    }
    await expect(isi).not.toContainText(/Overpass|GeoJSON|turf\.along|perlu_cek|perlu cek ulang/);
    await expect(isi.locator('a[href*=".gov"], a[href*=".go.id"]')).toHaveCount(0);
  });

  test("pompong: catatan naskah, kolom naskah, tombol koreksi", async ({ page }) => {
    await page.goto("/jalan/pompong");
    await expect(page.locator(".bch-page")).toContainText(
      "Tarif dapat berubah. Tanyakan kepada pengemudi perahu sebelum berangkat.",
    );
    await expect(page.locator('[data-rute="skp-blp"]')).toContainText("Rp20.000 per orang");
    await expect(page.locator('tr[data-rute="sbd-abang"]')).toContainText("Tidak ada kapal rutin");
    for (const kolom of ["Dari", "Tujuan", "Jadwal", "Tarif", "Lama Perjalanan"]) {
      await expect(page.getByRole("columnheader", { name: kolom })).toBeVisible();
    }
    await expect(page.locator("#isi").getByRole("link", { name: "Kirim Koreksi" })).toHaveAttribute("href", "/koreksi");
    await expect(page.locator(".bch-page")).not.toContainText(/R7W6|perlu_diisi|Status data|data lemah|mungkin usang/);
  });
});

test.describe("halaman pembuka", () => {
  test("label Transportasi, daftar naskah, feri terakhir", async ({ page }) => {
    await page.goto("/jalan");
    await expect(page.getByRole("heading", { level: 1, name: "Transportasi" })).toBeVisible();
    await expect(page.locator("#isi .bch-pintu > li")).toHaveCount(5);
    await expect(page.locator(".bch-page")).toContainText("Panduan Menyeberang");
    await expect(page.getByRole("heading", { level: 2, name: "Feri Terakhir Hari Ini" })).toBeVisible();
    await expect(page.locator(".bch-page")).not.toContainText("Jalan-jalan");
  });
});

test.describe("aksesibilitas dan tata letak", () => {
  const HALAMAN = [
    "/jalan",
    "/jalan/trans-batam",
    "/jalan/trans-batam/k5",
    "/jalan/trans-batam/k10",
    "/jalan/peta",
    "/jalan/feri",
    "/jalan/feri/panduan",
    "/jalan/pompong",
  ];
  for (const h of HALAMAN) {
    for (const tema of ["light", "dark"] as const) {
      test(`${h} (${tema}) tanpa pelanggaran axe`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.goto(h);
        await expect(page.locator("main")).toBeVisible();
        const hasil = await new AxeBuilder({ page }).analyze();
        expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
      });
    }
  }

  test("tidak ada scroll horizontal di 360 px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    for (const h of HALAMAN) {
      await page.goto(h);
      await expect(page.locator("main")).toBeVisible();
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih, h).toBeLessThanOrEqual(0);
    }
  });
});
