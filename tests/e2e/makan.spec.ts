import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import places from "../../data/makan/places.json";

// Bahasa Makan ikut browser kalau belum dipilih: tes berjalan dalam bahasa Indonesia.
test.use({ locale: "id-ID" });

const petaSiap = (page: Page) =>
  expect(page.locator(".mk-peta")).toHaveAttribute("data-status", "siap", { timeout: 60_000 });
const jumlah = (page: Page, n: number) => expect(page.getByRole("status").first()).toHaveText(`${n} tempat`);

const ROUTE = [
  "/makan",
  "/makan/daftar",
  "/makan/peta",
  "/makan/kategori",
  "/makan/tempat/golden-prawn-933",
  "/makan/jalur",
  "/makan/jalur/halal-nagoya",
  "/makan/tersimpan",
  "/makan/tentang",
];

test.describe("kerangka situs", () => {
  for (const path of ROUTE) {
    test(`${path} memakai layout situs dan footer wajib`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("header.bch-nav")).toBeVisible();
      await expect(page.locator("footer")).toContainText("Proyek independen warga Batam");
      await expect(page.locator("footer")).not.toContainText("batam.go.id");
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }

  test("slug tidak dikenal berstatus 404", async ({ page }) => {
    expect((await page.goto("/makan/tempat/tidak-ada"))?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Halaman Tidak Ditemukan");
    expect((await page.goto("/makan/jalur/tidak-ada"))?.status()).toBe(404);
  });
});

test.describe("daftar dan filter", () => {
  test("117 tempat, filter halal dan pencarian mempersempit", async ({ page }) => {
    await page.goto("/makan/daftar");
    await jumlah(page, 117);
    await expect(page.locator(".mk-kartu")).toHaveCount(117);

    await page.getByRole("button", { name: "Halal", exact: true }).first().click();
    await jumlah(page, 80);
    await page.getByRole("searchbox").fill("golden prawn");
    await jumlah(page, 0);
    await expect(page.getByText("Tidak ada hasil untuk “golden prawn”. Coba kata lain atau hapus saringan.")).toBeVisible();
    await page.getByRole("button", { name: "Hapus pencarian" }).click();
    await jumlah(page, 80);
  });

  test("lembar saringan: 17 kategori, 15 area, harga, terminal, label", async ({ page }) => {
    await page.goto("/makan/daftar");
    await page.getByRole("button", { name: "Saring", exact: true }).click();
    const lembar = page.getByRole("dialog");
    await expect(lembar).toBeVisible();
    const grup = (nama: string) => lembar.getByRole("group", { name: nama }).getByRole("button");
    await expect(grup("Kategori")).toHaveCount(17);
    await expect(grup("Area")).toHaveCount(15);
    await expect(grup("Harga")).toHaveCount(3);
    await expect(grup("Terminal feri")).toHaveCount(4);
    await expect(grup("Label")).toHaveCount(4);
    await expect(grup("Status halal")).toHaveCount(3);

    await expect(lembar.getByText(/\$|Hemat|Premium/)).toHaveCount(0);
    await grup("Harga").filter({ hasText: "Harga tinggi" }).click();
    await expect(lembar.getByRole("button", { name: /Terapkan · 10 tempat/ })).toBeVisible();
    await lembar.getByRole("button", { name: /Terapkan/ }).click();
    await expect(lembar).toBeHidden();
    await jumlah(page, 10);
  });

  test("buka sekarang tidak menambah hasil", async ({ page }) => {
    await page.goto("/makan/daftar");
    await page.getByRole("button", { name: "Buka sekarang" }).first().click();
    const teks = await page.getByRole("status").first().textContent();
    expect(Number(teks?.split(" ")[0])).toBeLessThanOrEqual(68);
  });

  test("filter tersinkron dari daftar ke peta lalu kembali", async ({ page }) => {
    await page.goto("/makan/daftar");
    await page.getByRole("button", { name: "Halal", exact: true }).first().click();
    await jumlah(page, 80);
    await page.getByRole("link", { name: "Lihat peta" }).click();
    await page.waitForURL("**/makan/peta");
    await expect(page.locator(".mk-peta-halaman")).toHaveAttribute("data-jumlah-pin", "80");
    await expect(page.locator(".mk-peta-daftar li")).toHaveCount(80);
    await page.getByRole("button", { name: "Halal", exact: true }).first().click();
    await expect(page.locator(".mk-peta-halaman")).toHaveAttribute("data-jumlah-pin", "117");
    await page.getByRole("button", { name: "Halal", exact: true }).first().click();
    await page.getByRole("link", { name: "Lihat daftar" }).click();
    await page.waitForURL("**/makan/daftar");
    await jumlah(page, 80);
  });

  test("pintasan Dekat Terminal Feri membuka peta tersaring", async ({ page }) => {
    await page.goto("/makan");
    await expect(page.getByRole("heading", { name: "Dekat Terminal Feri" })).toBeVisible();
    await page.getByRole("button", { name: /Harbour Bay/ }).click();
    await page.waitForURL("**/makan/peta");
    const n = Number(await page.locator(".mk-peta-halaman").getAttribute("data-jumlah-pin"));
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(117);
  });
});

test.describe("detail tempat", () => {
  test("menu, jam, harga dan kurs, pembayaran, peta, petunjuk arah", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Golden Prawn 933");
    await expect(page.getByText("Menu andalan")).toBeVisible();
    await expect(page.getByText(/Kepiting saus padang/)).toBeVisible();
    await expect(page.getByText("09.30—23.00 WIB")).toBeVisible();
    await expect(page.getByText(/Rp150\.000—Rp350\.000/)).toBeVisible();
    await expect(page.getByText("Tunai, QRIS, Kartu")).toBeVisible();
    await expect(page.locator(".mk-detail").getByText(/(Buka|Tutup) sekarang, (sampai|buka lagi) pukul/)).toBeVisible();
    // Satu label kurasi, walau data menyimpan dua. Harga tanpa simbol $ dan tanpa kata "Premium".
    await expect(page.locator(".mk-label")).toHaveCount(1);
    await expect(page.locator(".mk-label")).toHaveText("Legendaris");
    await expect(page.locator(".mk-detail-lencana .bch-badge")).toHaveCount(1);
    expect(await page.locator("main").innerText()).not.toMatch(/\$\$|Premium|Info terverifikasi/);
    await expect(page.getByRole("link", { name: "Laporkan data yang salah" })).toHaveAttribute(
      "href",
      "/koreksi?tempat=golden-prawn-933",
    );
    await expect(page.getByText("Data diperiksa pada Juni 2026.")).toBeVisible();

    const nav = page.getByRole("link", { name: "Petunjuk arah" }).first();
    await expect(nav).toHaveAttribute("href", /google\.com\/maps\/search.*Golden\+Prawn/);
    await expect(page.getByRole("link", { name: "Telepon" })).toBeVisible();

    await page.getByLabel("Mata uang").selectOption("SGD");
    await expect(page.getByText("~S$13—S$29")).toBeVisible();
    await expect(page.getByText(/kurs perkiraan/)).toBeVisible();
    await page.getByLabel("Mata uang").selectOption("MYR");
    await expect(page.getByText("~RM42—RM99")).toBeVisible();
    await page.getByLabel("Mata uang").selectOption("IDR");

    await petaSiap(page);
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap");
  });

  test("nomor ponsel disembunyikan, tombol petunjuk arah tetap ada", async ({ page }) => {
    const ponsel = places.find((p) => /^\+62 8/.test(p.phone))!;
    await page.goto(`/makan/tempat/${ponsel.id}`);
    await expect(page.getByRole("link", { name: "Petunjuk arah" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Telepon" })).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toContain(ponsel.phone);
  });

  test("rating dan jumlah ulasan tidak tampil, di layar maupun di HTML", async ({ page }) => {
    const rated = places.find((p) => p.id === "golden-prawn-933")!;
    expect(rated.rating).not.toBeNull();
    const res = await page.goto("/makan/tempat/golden-prawn-933");
    const html = (await res?.text()) ?? "";
    expect(html).not.toContain(`"rating"`);
    expect(html).not.toContain(`"reviews"`);
    const teks = await page.locator("main").innerText();
    expect(teks).not.toContain(String(rated.reviews));
    expect(teks).not.toMatch(/ulasan|rating\s*\d/i);

    await page.goto("/makan/daftar");
    const daftar = await page.locator("main").innerText();
    expect(daftar).not.toContain(String(rated.reviews));
    expect(daftar).not.toMatch(/ulasan/i);
    await expect(page.getByRole("combobox", { name: "Urutkan" }).locator("option")).toHaveText([
      "Pilihan",
      "Terdekat dari feri",
      "Nama A—Z",
    ]);
  });

  test("koordinat tampil sebagai perkiraan area", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.getByText(/Titik di peta adalah perkiraan area\. Gunakan Petunjuk arah untuk lokasi persisnya\./)).toBeVisible();
    await expect(page.getByText(/Sekitar \d+,\d km dari Pelabuhan Feri/)).toBeVisible();
    // Halaman statis tidak boleh mencetak status buka: jam build bukan jam pembaca.
    const html = await (await page.request.get("/makan/tempat/golden-prawn-933")).text();
    expect(html).not.toMatch(/>(Buka|Tutup) sekarang</);
  });
});

test.describe("peta", () => {
  test("di layar lebar peta berdampingan dengan daftar, dan tampak tanpa menggulir", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/makan/peta");
    await petaSiap(page);
    const peta = await page.locator(".mk-peta").boundingBox();
    const daftar = await page.locator(".mk-peta-sisi").boundingBox();
    if (!peta || !daftar) throw new Error("tata letak tidak ditemukan");
    expect(peta.x).toBeGreaterThanOrEqual(daftar.x + daftar.width - 1);
    expect(peta.y).toBeLessThan(120);
    expect(peta.height).toBeGreaterThan(500);
  });

  test("legenda perkiraan, pin berkelompok, dan daftar keyboard membuka kartu", async ({ page }) => {
    await page.goto("/makan/peta");
    await petaSiap(page);
    await expect(page.getByText("Lingkaran berongga menunjukkan perkiraan area.")).toBeVisible();
    await expect(page.locator(".mk-peta-halaman")).toHaveAttribute("data-jumlah-pin", "117");
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("Protomaps");
    await expect(page.locator("body")).toHaveClass(/bch-no-grain/);

    const baris = page.locator(".mk-peta-baris").filter({ hasText: "Golden Prawn 933" });
    await baris.focus();
    await page.keyboard.press("Enter");
    await expect(baris).toHaveAttribute("aria-pressed", "true");
    const kartu = page.locator(".mk-kartu-mini");
    await expect(kartu.getByRole("heading", { name: "Golden Prawn 933" })).toBeVisible();
    await expect(kartu.locator(".bch-badge")).toHaveCount(1);
    await kartu.getByRole("button", { name: "Tutup" }).click();
    await expect(kartu).toHaveCount(0);
  });

  test("tema berganti tanpa kehilangan pin", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("bch-theme", "light"));
    await page.goto("/makan/peta");
    await petaSiap(page);
    await page.getByRole("button", { name: "Ganti ke tampilan gelap" }).click();
    await expect(page.locator(".mk-peta")).toHaveAttribute("data-tema", "dark");
    await page.waitForTimeout(1500);
    // Filter sesudah ganti tema tetap memperbarui sumber pin yang sama, tanpa galat.
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.getByRole("button", { name: "Halal", exact: true }).first().click();
    await expect(page.locator(".mk-peta-halaman")).toHaveAttribute("data-jumlah-pin", "80");
    await page.waitForTimeout(500);
    expect(galat).toEqual([]);
  });

  test("berpindah antarhalaman peta tidak memunculkan galat", async ({ page }) => {
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.goto("/makan/peta");
    await petaSiap(page);
    await page.getByRole("link", { name: "Jalur", exact: true }).click();
    await page.waitForURL("**/makan/jalur");
    await expect(page.locator("body")).not.toHaveClass(/bch-no-grain/);
    expect(galat).toEqual([]);
  });
});

test.describe("jalur", () => {
  test("lima jalur, detail berurutan dengan peta", async ({ page }) => {
    await page.goto("/makan/jalur");
    await expect(page.locator("a.bch-card")).toHaveCount(5);
    await page.getByRole("link", { name: /Jejak Halal Nagoya/ }).click();
    await page.waitForURL("**/makan/jalur/halal-nagoya");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jejak Halal Nagoya");
    await expect(page.locator(".mk-perhentian li")).toHaveCount(5);
    await expect(page.getByText(/bukan rute jalan/)).toBeVisible();
    await petaSiap(page);
  });
});

test.describe("tersimpan", () => {
  test("favorit bertahan setelah muat ulang, tautan membawanya ke tempat lain", async ({ page, context }) => {
    await page.goto("/makan/daftar");
    await page.getByRole("button", { name: "Simpan: Golden Prawn 933" }).click();
    await expect(page.getByRole("button", { name: "Hapus dari tersimpan: Golden Prawn 933" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.goto("/makan/tersimpan");
    await expect(page.locator(".mk-kartu")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".mk-kartu")).toHaveCount(1);
    const tautan = await page.getByLabel("Tautan daftar").inputValue();
    expect(tautan).toContain("/makan/tersimpan?simpan=golden-prawn-933");

    // Perangkat lain: penyimpanan kosong.
    await context.clearCookies();
    await page.evaluate(() => localStorage.removeItem("bch-makan-tersimpan"));
    await page.goto(`${tautan},slug-asing`);
    await expect(page.getByText("Tautan ini berisi 1 tempat. Sebanyak 1 tempat tidak dikenal dan dilewati.")).toBeVisible();
    await page.getByRole("button", { name: "Tambahkan ke tersimpan" }).click();
    await expect(page.locator(".mk-kartu")).toHaveCount(1);

    // Tempel manual.
    await page.getByLabel("Tautan dari perangkat lain").fill("sei-enam-seafood, slug-asing");
    await page.getByRole("button", { name: "Tempel tautan", exact: true }).click();
    await expect(page.getByText(/Sebanyak 1 tempat tidak dikenal dan dilewati/).last()).toBeVisible();
  });
});

test.describe("bahasa", () => {
  test("ID, EN, dan 中文 mengganti teks dan atribut lang", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.locator(".mk-akar")).toHaveAttribute("lang", "id");
    await page.getByRole("button", { name: "English" }).click();
    await expect(page.locator(".mk-akar")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "Directions" }).first()).toBeVisible();
    await expect(page.getByText(/stilted seafood restaurant/)).toBeVisible();
    await expect(page.locator(".mk-label")).toHaveText("Legendary");
    await page.getByRole("button", { name: "中文" }).click();
    await expect(page.locator(".mk-akar")).toHaveAttribute("lang", "zh-Hans");
    await expect(page.getByRole("link", { name: "导航" }).first()).toBeVisible();
    await page.reload();
    await expect(page.locator(".mk-akar")).toHaveAttribute("lang", "zh-Hans");
  });
});

test.describe("tentang", () => {
  test("cara memilih, arti label, dan status halal tertulis, tanpa sebutan sumber", async ({ page }) => {
    await page.goto("/makan/tentang");
    await expect(page.getByText(/Tidak ada tempat yang membayar untuk masuk daftar ini/)).toBeVisible();
    await expect(page.getByText("sudah buka puluhan tahun dan tetap ramai.")).toBeVisible();
    await expect(page.getByText("tempat yang paling kami sarankan.")).toBeVisible();
    await expect(page.getByText("banyak dibicarakan belakangan ini.")).toBeVisible();
    await expect(page.getByText("bagus, tetapi tidak mudah ditemukan.")).toBeVisible();
    await expect(page.getByText(/Status halal adalah hasil kurasi, bukan sertifikasi/)).toBeVisible();
    await expect(page.getByText(/Titik di peta menunjukkan perkiraan area/)).toBeVisible();
    expect(await page.locator("main").innerText()).not.toMatch(/TripAdvisor|Google Maps|Sumber:/);
  });
});

test.describe("gaya", () => {
  test("kategori memakai ikon garis tanpa isi, bukan emoji", async ({ page }) => {
    await page.goto("/makan/kategori");
    await expect(page.locator("a.bch-card")).toHaveCount(17);
    const ikon = page.locator("a.bch-card .mk-ikon").first();
    await expect(ikon).toHaveAttribute("fill", "none");
    await expect(ikon).toHaveAttribute("stroke-width", "1.25");
    expect(await page.locator("main").innerText()).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  test("label kurasi bergaya label museum", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    const label = page.locator(".mk-label").first();
    const gaya = await label.evaluate((el) => {
      const s = getComputedStyle(el);
      return { caps: s.fontVariantCaps, radius: s.borderTopLeftRadius };
    });
    expect(gaya.caps).toBe("all-small-caps");
    expect(gaya.radius).toBe("0px");
  });
});

test.describe("aksesibilitas", () => {
  for (const path of ROUTE) {
    for (const tema of ["light", "dark"] as const) {
      test(`axe ${path} tema ${tema}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
        await page.goto(path);
        if (path.includes("peta") || path.includes("tempat/") || path.includes("jalur/")) await petaSiap(page);
        // nextjs-portal hanya ada di server dev.
        const { violations } = await new AxeBuilder({ page })
          .exclude(".maplibregl-canvas")
          .exclude("nextjs-portal")
          .analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }

  test("axe lembar saringan terbuka", async ({ page }) => {
    await page.goto("/makan/daftar");
    await page.getByRole("button", { name: "Saring", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).exclude("nextjs-portal").analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});
