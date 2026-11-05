import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import places from "../../data/makan/places.json";

// Bahasa Makan ikut browser kalau belum dipilih: tes berjalan dalam bahasa Indonesia.
test.use({ locale: "id-ID" });

const petaSiap = (page: Page) =>
  expect(page.locator(".mk-peta").first()).toHaveAttribute("data-status", "siap", { timeout: 60_000 });
const jumlah = (page: Page, teks: string) => expect(page.locator(".mk-hasil-n")).toHaveText(teks);

const ROUTE = [
  "/makan",
  "/makan/hidangan",
  "/makan/hidangan/sup-ikan",
  "/makan/kawasan",
  "/makan/kawasan/bengkong",
  "/makan/panduan",
  "/makan/panduan/halal-nagoya",
  "/makan/panduan/sarapan",
  "/makan/dekat-feri",
  "/makan/peta",
  "/makan/tempat/golden-prawn-933",
  "/makan/simpanan",
  "/makan/cara-memilih",
];

test.beforeEach(async ({ page }) => {
  // Tes tidak boleh memanggil MSS atau BMKG.
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test.describe("kerangka situs", () => {
  for (const path of ROUTE) {
    test(`${path} memakai layout situs dan satu H1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.locator("footer")).toContainText("Proyek independen warga Batam");
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }

  test("slug tidak dikenal berstatus 404", async ({ page }) => {
    for (const path of [
      "/makan/tempat/tidak-ada",
      "/makan/panduan/tidak-ada",
      "/makan/hidangan/tidak-ada",
      "/makan/kawasan/tidak-ada",
    ]) {
      expect((await page.goto(path))?.status(), path).toBe(404);
    }
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Halaman Tidak Ditemukan");
  });

  test("alamat lama dialihkan ke nama baru", async ({ page }) => {
    const peta: [string, RegExp][] = [
      ["/makan/daftar", /\/makan\/peta$/],
      ["/makan/kategori", /\/makan\/hidangan$/],
      ["/makan/jalur", /\/makan\/panduan$/],
      ["/makan/jalur/halal-nagoya", /\/makan\/panduan\/halal-nagoya$/],
      ["/makan/tersimpan", /\/makan\/simpanan$/],
      ["/makan/tentang", /\/makan\/cara-memilih$/],
    ];
    for (const [lama, baru] of peta) {
      await page.goto(lama);
      await expect(page).toHaveURL(baru);
    }
    await page.goto("/makan/tersimpan?simpan=golden-prawn-933");
    await expect(page).toHaveURL(/\/makan\/simpanan\?simpan=golden-prawn-933$/);
  });

  test("menu Makan menandai halaman yang dibuka", async ({ page }) => {
    await page.goto("/makan/hidangan/sup-ikan");
    const menu = page.locator('nav.bch-submenu[aria-label="Makanan"]');
    await expect(menu.getByRole("link", { name: "Hidangan" })).toHaveAttribute("aria-current", "page");
    for (const nama of ["Kawasan", "Food Court", "Panduan", "Dekat Feri", "Peta", "Simpanan"]) {
      await expect(menu.getByRole("link", { name: nama })).toBeVisible();
    }
  });
});

test.describe("beranda", () => {
  test("indeks 32 kategori pemilik, enam rumpun, dan tautan langsung ke hidangan", async ({ page }) => {
    await page.goto("/makan");
    await expect(page.locator(".mk-ubin")).toHaveCount(32);
    await expect(page.locator(".mk-rumpun-nama:visible").filter({ hasText: /\S/ })).toHaveCount(6);
    await page.locator(".mk-ubin").filter({ hasText: "Sop Ikan" }).click();
    await page.waitForURL("**/makan/hidangan/sop-ikan");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sop Ikan");
  });

  test("pintu cepat membuka peta dengan saringan aktif", async ({ page }) => {
    await page.goto("/makan");
    await page.getByRole("link", { name: "Halal", exact: true }).click();
    await page.waitForURL("**/makan/peta?halal=halal");
    await jumlah(page, "80/117 tempat");
    await expect(page.getByRole("button", { name: /^Halal/ }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("Sebelum Feri Pulang berganti terminal", async ({ page }) => {
    await page.goto("/makan");
    const modul = page.locator(".mk-feri");
    await expect(modul.getByRole("heading", { name: "Sebelum Feri Pulang" })).toBeVisible();
    await expect(modul.locator(".mk-baris")).toHaveCount(5);
    const terminal = modul.locator(".mk-terminal").getByRole("button", { name: /Harbour Bay/ });
    await terminal.click();
    await expect(terminal).toHaveAttribute("aria-pressed", "true");
    await expect(modul.getByRole("link", { name: /Semua Dekat Harbour Bay/ })).toHaveAttribute(
      "href",
      "/makan/dekat-feri?terminal=harbour-bay",
    );
  });

  test("pencarian mengganti isi halaman dengan hasil", async ({ page }) => {
    await page.goto("/makan");
    await page.getByRole("searchbox").fill("golden prawn");
    await expect(page.locator(".mk-baris")).toHaveCount(1);
    await expect(page).toHaveURL(/q=golden/);
    await page.getByRole("button", { name: "Hapus pencarian" }).click();
    await expect(page.locator(".mk-ubin")).toHaveCount(32);
  });

  test("satu tempat acak membuka halaman tempat", async ({ page }) => {
    await page.goto("/makan");
    await page.getByRole("button", { name: "Satu Tempat Acak" }).click();
    await page.waitForURL("**/makan/tempat/**");
  });

  test("gambar panduan dan hidangan semuanya termuat", async ({ page }) => {
    const gagal: string[] = [];
    page.on("response", (r) => {
      if (r.url().includes("/grafis/") && !r.ok()) gagal.push(r.url());
    });
    for (const path of ["/makan", "/makan/panduan", "/makan/dekat-feri"]) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForLoadState("networkidle");
    }
    expect(gagal).toEqual([]);
  });
});

test.describe("saringan", () => {
  test("angka di tombol sama dengan hasil, dan saringan tersimpan di alamat", async ({ page }) => {
    await page.goto("/makan/peta");
    await jumlah(page, "117 tempat");
    await expect(page.locator(".mk-baris")).toHaveCount(117);

    const halal = page.getByRole("button", { name: /^Halal/ }).first();
    await expect(halal.locator(".mk-chip-n")).toHaveText("80");
    await halal.click();
    await jumlah(page, "80/117 tempat");
    await expect(page).toHaveURL(/halal=halal/);

    await page.reload();
    await jumlah(page, "80/117 tempat");
    await expect(page.getByRole("button", { name: /^Halal/ }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("pencarian dengan saringan, lalu pesan kosong", async ({ page }) => {
    await page.goto("/makan/peta?halal=halal");
    await page.getByRole("searchbox").fill("golden prawn");
    await jumlah(page, "0/117 tempat");
    await expect(page.getByText("Tidak ada hasil untuk “golden prawn”. Coba kata lain atau hapus saringan.")).toBeVisible();
    await page.getByRole("button", { name: "Hapus pencarian" }).click();
    await jumlah(page, "80/117 tempat");
  });

  test("lembar saringan lengkap dan tombolnya menyebut jumlah", async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto("/makan/peta");
    await page.getByRole("button", { name: /^Saring/ }).click();
    const lembar = page.getByRole("dialog");
    await expect(lembar).toBeVisible();
    const grup = (nama: string) => lembar.getByRole("group", { name: nama }).getByRole("button");
    await expect(grup("Hidangan")).toHaveCount(32);
    await expect(grup("Kawasan")).toHaveCount(15);
    await expect(grup("Harga")).toHaveCount(4);
    await expect(grup("Terminal Feri")).toHaveCount(4);
    await expect(grup("Label")).toHaveCount(4);
    await expect(grup("Status Halal")).toHaveCount(3);
    await expect(grup("Waktu")).toHaveCount(2);
    await expect(grup("Pembayaran")).toHaveCount(2);

    // Simbol harga lama tidak tampil.
    await expect(lembar.getByText(/\$|Hemat|Premium/)).toHaveCount(0);
    await grup("Harga").filter({ hasText: "Harga Tinggi" }).click();
    await expect(lembar.getByRole("button", { name: "Tampilkan 10 tempat" })).toBeVisible();
    await lembar.getByRole("button", { name: "Tampilkan 10 tempat" }).click();
    await expect(lembar).toBeHidden();
    await jumlah(page, "10/117 tempat");
    await expect(page).toHaveURL(/harga=tinggi/);
  });

  test("pilihan tanpa hasil dinonaktifkan", async ({ page }) => {
    await page.goto("/makan/kawasan/kabil");
    await page.getByRole("button", { name: /^Saring/ }).click();
    const nonaktif = page.getByRole("dialog").locator(".mk-chip:disabled");
    expect(await nonaktif.count()).toBeGreaterThan(0);
    await expect(nonaktif.first().locator(".mk-chip-n")).toHaveText("0");
  });

  test("buka sekarang tidak menambah hasil", async ({ page }) => {
    await page.goto("/makan/peta?buka=1");
    await expect(page.getByRole("button", { name: /^Buka Sekarang/ })).toHaveAttribute("aria-pressed", "true");
    const teks = await page.locator(".mk-hasil-n").textContent();
    expect(parseInt(teks ?? "", 10)).toBeLessThanOrEqual(68);
  });

  test("urutan bertahan di alamat, dan rating tidak bisa jadi urutan", async ({ page }) => {
    await page.goto("/makan/peta");
    await expect(page.getByLabel("Urutkan").locator("option")).toHaveText([
      "Pilihan",
      "Terdekat dari Feri",
      "Buka Paling Larut",
      "Harga Terendah",
      "Nama A—Z",
    ]);
    // Pilihan sebelum hidrasi belum didengar React: ulangi sampai alamatnya berubah.
    await expect(async () => {
      await page.getByLabel("Urutkan").selectOption("az");
      await expect(page).toHaveURL(/urut=az/, { timeout: 1_000 });
    }).toPass({ timeout: 15_000 });
    await page.reload();
    await expect(page.getByLabel("Urutkan")).toHaveValue("az");
  });
});

test.describe("hidangan, kawasan, dekat feri", () => {
  test("halaman hidangan hanya memuat hidangan itu, dan kelompoknya tidak ada di saringan", async ({ page }) => {
    await page.goto("/makan/hidangan/sup-ikan");
    await jumlah(page, "5 tempat");
    await expect(page.locator(".mk-baris")).toHaveCount(5);
    await page.getByRole("button", { name: /^Saring/ }).click();
    await expect(page.getByRole("dialog").getByRole("group", { name: "Hidangan" })).toHaveCount(0);
    await expect(page.getByRole("dialog").getByRole("group", { name: "Kawasan" })).toHaveCount(1);
  });

  test("indeks kawasan hanya menyebut kawasan yang berisi", async ({ page }) => {
    await page.goto("/makan/kawasan");
    await expect(page.locator(".mk-tautan-daftar a")).toHaveCount(14);
    await expect(page.getByRole("link", { name: /Nagoya, Lubuk Baja/ })).toContainText("31");
    await expect(page.locator(".mk-peta-cetak circle")).toHaveCount(117);
    await page.goto("/makan/kawasan/bengkong");
    await jumlah(page, "12 tempat");
  });

  test("dekat feri: terminal lewat alamat, urut terdekat", async ({ page }) => {
    await page.goto("/makan/dekat-feri?terminal=harbour-bay");
    const terminal = page.locator(".mk-terminal");
    await expect(terminal.getByRole("button", { name: "Harbour Bay" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByLabel("Urutkan")).toHaveValue("ferry");
    const jarak = await page.locator(".mk-baris-data").allInnerTexts();
    expect(jarak.every((t) => t.includes("ke Harbour Bay"))).toBe(true);
    await terminal.getByRole("button", { name: "Sekupang" }).click();
    await expect(page).toHaveURL(/terminal=sekupang/);
    await expect(page.locator(".mk-baris-data").first()).toContainText("ke Sekupang");
    await expect(page.getByRole("heading", { name: /Feri Terakhir/ })).toBeVisible();
  });
});

test.describe("detail tempat", () => {
  test("fakta, harga dengan perkiraan, jam WIB dan SGT, menu, dan peta", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Golden Prawn 933");
    const fakta = page.locator(".mk-fakta");
    await expect(fakta.getByText("09.30—23.00 WIB")).toBeVisible();
    await expect(fakta.getByText("10.30—00.00 SGT")).toBeVisible();
    await expect(fakta.getByText("Rp150—350 ribu")).toBeVisible();
    await expect(fakta.getByText("≈ S$11—25")).toBeVisible();
    await expect(fakta.getByText("Tunai · QRIS · Kartu")).toBeVisible();
    await expect(fakta.getByText(/Sekitar \d+,\d km ke Harbour Bay/)).toBeVisible();
    // Plus code di depan alamat dibuang.
    await expect(fakta.getByText(/^Jl\. Golden City Jaya/)).toBeVisible();
    await expect(fakta.getByRole("link", { name: "Artinya" })).toHaveAttribute("href", "/makan/cara-memilih#status-halal");

    await expect(page.locator(".mk-menu li").first()).toHaveText("Kepiting Saus Padang");
    await expect(page.locator(".mk-detail-lencana .mk-status")).toContainText(/(Buka sampai|Tutup, buka) \d\d\.\d\d WIB \(\d\d\.\d\d SGT\)/);
    await expect(page.locator(".mk-detail-lencana .mk-label")).toHaveText("Legendaris");

    // Pemilih mata uang dihapus pada rombak; perkiraan dolar Singapura tetap tampil di samping rupiah.
    await expect(page.getByLabel("Perkiraan harga")).toHaveCount(0);

    await expect(page.locator(".mk-detail").getByRole("link", { name: "Kirim Koreksi" })).toHaveAttribute("href", "/koreksi?tempat=golden-prawn-933");
    await expect(page.getByText(/Data per Juni 2026/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Petunjuk Arah" })).toHaveAttribute("href", /google\.com\/maps\/search.*Golden\+Prawn/);
    await petaSiap(page);
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("OpenStreetMap");
  });

  test("galeri: ilustrasi hidangan dan empat bingkai selama belum ada foto", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    const galeri = page.locator(".mk-galeri");
    await expect(galeri).toHaveAttribute("data-pola", "kosong");
    await expect(galeri.locator(".mk-bingkai")).toHaveCount(4);
    await expect(galeri.locator("img")).toHaveAttribute("src", /grafis\/hidangan\/seafood/);
    await expect(galeri.getByText("Foto menyusul")).toBeVisible();
  });

  test("di dekat sini dan panduan yang memuat tempat ini", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.locator(".mk-detail-bawah .mk-baris")).toHaveCount(3);
    await expect(page.locator(".mk-detail-bawah").getByRole("link", { name: /Makanan Laut dan Gonggong/ })).toHaveAttribute(
      "href",
      "/makan/panduan/seafood-classics",
    );
  });

  test("nomor ponsel disembunyikan, petunjuk arah tetap ada", async ({ page }) => {
    const ponsel = places.find((p) => /^\+62 8/.test(p.phone))!;
    await page.goto(`/makan/tempat/${ponsel.id}`);
    await expect(page.getByRole("link", { name: "Petunjuk Arah" })).toBeVisible();
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
  });

  test("halaman statis tidak mencetak status buka: jam build bukan jam pembaca", async ({ page }) => {
    const html = await (await page.request.get("/makan/tempat/golden-prawn-933")).text();
    expect(html).not.toMatch(/>(Buka sampai|Tutup, buka|Buka sekarang|Tutup sekarang)/);
  });
});

test.describe("peta", () => {
  test("di layar lebar peta berdampingan dengan daftar", async ({ page }, info) => {
    test.skip(info.project.name === "hp", "khusus layar lebar");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/makan/peta");
    await petaSiap(page);
    const peta = await page.locator(".mk-tata-peta").boundingBox();
    const daftar = await page.locator(".mk-tata-daftar").boundingBox();
    if (!peta || !daftar) throw new Error("tata letak tidak ditemukan");
    expect(peta.x).toBeGreaterThanOrEqual(daftar.x + daftar.width - 1);
    expect(peta.height).toBeGreaterThan(500);
  });

  test("di ponsel daftar lebih dulu, peta baru dimuat saat dibuka", async ({ page }, info) => {
    test.skip(info.project.name !== "hp", "khusus ponsel");
    test.setTimeout(120_000);
    await page.goto("/makan/peta");
    await expect(page.locator(".mk-baris").first()).toBeVisible();
    await expect(page.locator(".mk-peta")).toHaveCount(0);
    await page.getByRole("button", { name: "Peta", exact: true }).click();
    await petaSiap(page);
    await page.getByRole("button", { name: "Daftar", exact: true }).click();
    await expect(page.locator(".mk-baris").first()).toBeVisible();
  });

  test("memilih tempat dari daftar membuka kartu di peta", async ({ page }, info) => {
    test.skip(info.project.name === "hp", "khusus layar lebar");
    await page.goto("/makan/peta");
    await petaSiap(page);
    await expect(page.locator(".maplibregl-ctrl-attrib")).toContainText("Protomaps");
    await page.getByRole("button", { name: "Tampilkan di peta: Golden Prawn 933" }).click();
    const kartu = page.locator(".mk-kartu-mini");
    await expect(kartu.getByRole("heading", { name: "Golden Prawn 933" })).toBeVisible();
    await kartu.getByRole("button", { name: "Tutup" }).click();
    await expect(kartu).toHaveCount(0);
  });

  test("tema berganti tanpa kehilangan pin", async ({ page }, info) => {
    test.skip(info.project.name === "hp", "khusus layar lebar");
    await page.addInitScript(() => localStorage.setItem("bch-theme", "light"));
    await page.goto("/makan/peta");
    await petaSiap(page);
    await page.getByRole("button", { name: "Ganti ke tampilan gelap" }).click();
    await expect(page.locator(".mk-peta")).toHaveAttribute("data-tema", "dark");
    await page.waitForTimeout(1500);
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.getByRole("button", { name: /^Halal/ }).first().click();
    await expect(page.locator(".mk-tata")).toHaveAttribute("data-jumlah-pin", "80");
    await page.waitForTimeout(500);
    expect(galat).toEqual([]);
  });

  test("berpindah halaman dari peta tidak memunculkan galat", async ({ page }) => {
    const galat: string[] = [];
    page.on("pageerror", (e) => galat.push(e.message));
    await page.goto("/makan/peta");
    await page.locator('nav.bch-submenu[aria-label="Makanan"]').getByRole("link", { name: "Panduan" }).click();
    await page.waitForURL("**/makan/panduan");
    expect(galat).toEqual([]);
  });
});

test.describe("panduan", () => {
  test("sembilan panduan, jalur berurut dengan peta dan catatan garis", async ({ page }) => {
    await page.goto("/makan/panduan");
    await expect(page.locator(".mk-entri")).toHaveCount(9);
    await page.getByRole("link", { name: /Jejak Halal Nagoya/ }).click();
    await page.waitForURL("**/makan/panduan/halal-nagoya");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jejak Halal Nagoya");
    await expect(page.locator(".mk-baris")).toHaveCount(5);
    await expect(page.locator(".mk-baris-no").first()).toHaveText("01");
    await expect(page.getByText("Garis menunjukkan urutan, bukan rute jalan.")).toBeVisible();
    await petaSiap(page);
  });

  test("panduan hitungan hanya memuat tempat yang sesuai dan bisa disaring", async ({ page }) => {
    await page.goto("/makan/panduan/lewat-pukul-22");
    const n = await page.locator(".mk-baris").count();
    expect(n).toBeGreaterThan(5);
    await expect(page.getByRole("button", { name: /^Saring/ })).toBeVisible();
  });
});

test.describe("simpanan", () => {
  test("bertahan setelah muat ulang, dan tautan membawanya ke perangkat lain", async ({ page, context }) => {
    await page.goto("/makan/peta");
    await page.getByRole("button", { name: "Simpan: Golden Prawn 933" }).click();
    await expect(page.getByRole("button", { name: "Hapus dari simpanan: Golden Prawn 933" })).toHaveAttribute("aria-pressed", "true");
    await page.goto("/makan/simpanan");
    await expect(page.locator(".mk-baris")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(".mk-baris")).toHaveCount(1);
    const tautan = await page.getByLabel("Tautan daftar").inputValue();
    expect(tautan).toContain("/makan/simpanan?simpan=golden-prawn-933");

    // Perangkat lain: penyimpanan kosong.
    await context.clearCookies();
    await page.evaluate(() => localStorage.removeItem("bch-makan-tersimpan"));
    await page.goto(`${tautan},slug-asing`);
    await expect(page.getByText("Tautan ini berisi 1 tempat. Sebanyak 1 tempat tidak dikenal.")).toBeVisible();
    await page.getByRole("button", { name: "Tambahkan ke simpanan" }).click();
    await expect(page.locator(".mk-baris")).toHaveCount(1);

    // Tempel manual.
    await page.locator(".mk-ekspor summary").click();
    await page.getByLabel("Tempel Tautan dari Perangkat Lain").fill("sei-enam-seafood, slug-asing");
    await page.getByRole("button", { name: "Tambahkan", exact: true }).click();
    await expect(page.locator(".mk-baris")).toHaveCount(2);
  });

  test("kosong menunjuk ke semua tempat", async ({ page }) => {
    await page.goto("/makan/simpanan");
    await expect(page.getByText("Belum ada. Tekan ikon hati pada tempat mana pun.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Semua tempat" })).toHaveAttribute("href", "/makan/peta");
  });
});

test.describe("bahasa", () => {
  test("hanya Bahasa Indonesia: tombol ID, EN, dan 中文 tidak ada", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    await expect(page.getByRole("button", { name: "English" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "中文" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Petunjuk Arah" }).first()).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
  });
});

test.describe("cara memilih", () => {
  test("label, status halal, dan kurs bertanggal, tanpa sebutan sumber", async ({ page }) => {
    await page.goto("/makan/cara-memilih");
    await expect(page.getByText(/Tidak ada tempat yang membayar untuk masuk daftar ini/)).toBeVisible();
    await expect(page.getByText("buka puluhan tahun dan tetap ramai.")).toBeVisible();
    await expect(page.getByText(/Status ini hasil kurasi, bukan sertifikasi/)).toBeVisible();
    await expect(page.getByText(/Titik di peta adalah perkiraan/)).toBeVisible();
    await expect(page.getByText(/Kurs 4 November 2026: S\$1 = Rp14\.187/)).toBeVisible();
    await expect(page.locator("#status-halal")).toBeVisible();
    expect(await page.locator("main").innerText()).not.toMatch(/TripAdvisor|Google Maps|Sumber:/);
  });
});

test.describe("gaya", () => {
  test("nama hidangan dan rumpun memakai Title Case", async ({ page }) => {
    await page.goto("/makan/hidangan");
    const nama = await page.locator(".mk-ubin-nama").allInnerTexts();
    expect(nama).toContain("Martabak dan Prata");
    expect(nama).toContain("Kue, Jajanan Pasar, dan Gorengan");
    expect(nama).toContain("Nasi Goreng, Mie Goreng, Bakmie, dan Kwetiau");
    await expect(page.locator(".mk-rumpun-nama").first()).toHaveText("Laut dan Pesisir");
  });

  test("tidak ada emoji dan label kurasi berhuruf miring tanpa lencana", async ({ page }) => {
    await page.goto("/makan/tempat/golden-prawn-933");
    expect(await page.locator("main").innerText()).not.toMatch(/\p{Extended_Pictographic}/u);
    const gaya = await page
      .locator(".mk-detail-lencana .mk-label")
      .evaluate((el) => {
        const s = getComputedStyle(el);
        return { miring: s.fontStyle, latar: s.backgroundColor };
      });
    expect(gaya.miring).toBe("italic");
    expect(gaya.latar).toBe("rgba(0, 0, 0, 0)");
  });

  test("halaman ponsel tidak melebar keluar layar", async ({ page }, info) => {
    test.skip(info.project.name !== "hp", "khusus ponsel");
    for (const path of ROUTE) {
      await page.goto(path);
      const luber = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(luber, path).toBe(false);
    }
  });
});

test.describe("aksesibilitas", () => {
  for (const path of ROUTE) {
    for (const tema of ["light", "dark"] as const) {
      test(`axe ${path} tema ${tema}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
        await page.goto(path);
        await page.waitForTimeout(800);
        // nextjs-portal hanya ada di server dev.
        const { violations } = await new AxeBuilder({ page }).exclude(".maplibregl-canvas").exclude("nextjs-portal").analyze();
        expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
      });
    }
  }

  test("axe lembar saringan terbuka", async ({ page }) => {
    await page.goto("/makan/peta");
    await page.getByRole("button", { name: /^Saring/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).exclude(".maplibregl-canvas").exclude("nextjs-portal").analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });
});
