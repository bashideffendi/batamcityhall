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
  await page.route("**/api/gempa", (r) => r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } }));
  await page.route("**/api/peringatan-cuaca**", (r) =>
    r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } }),
  );
  await page.route("**/api/conditions", (r) => r.fulfill({ json: {} }));
  await page.route("**/api/prakiraan", (r) => r.fulfill({ status: 503, json: {} }));
}

test.beforeEach(async ({ page }) => {
  await tiruApi(page);
});

test.describe("beranda dan menu", () => {
  test("Loket 06 terbuka dan menuju Informasi Warga", async ({ page }) => {
    await page.goto("/info");
    await expect(page.getByRole("heading", { level: 1, name: "Informasi Warga" })).toBeVisible();
    await expect(page.locator(".bch-lede")).toHaveText(
      "Loket ini memuat direktori tempat, nomor darurat, panduan urusan tanah dan rumah, bantuan hukum, dan berita Batam.",
    );
    await expect(page.getByRole("heading", { level: 2, name: "Menurut Kecamatan" })).toBeVisible();
    await expect(page.locator('a[href="/info/warga-baru"]')).toHaveCount(0);
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
    await expect(page.locator(".bch-lede")).toContainText(
      `Direktori ini memuat ${stats.total_tempat} tempat di Batam yang dikelompokkan menurut keperluan.`,
    );
    const per = stats.per_kategori as Record<string, number>;
    await expect(page.locator("[data-kategori]")).toHaveCount(21);
    await expect(page.locator('[data-kategori="kesehatan"]')).toHaveText(`${per.kesehatan} tempat`);
    // Dua kategori data digabung menjadi satu kategori tampilan.
    await expect(page.locator('[data-kategori="pemerintahan"]')).toHaveText(
      `${per.pemerintahan + per.layanan_publik} tempat`,
    );
    await expect(page.locator('[data-kategori="layanan_publik"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Kantor dan layanan publik" })).toBeVisible();
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
  });

  test("pencarian menemukan tempat dan tersimpan di URL", async ({ page }) => {
    await page.goto("/info/direktori");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
    await page.getByLabel("Cari nama tempat, jenis, atau kecamatan").fill("mal pelayanan");
    await expect(page.getByRole("link", { name: "Mal Pelayanan Publik Kota Batam" })).toBeVisible();
    await expect(page).toHaveURL(/q=mal/);
    await page.reload();
    await expect(page.getByLabel("Cari nama tempat, jenis, atau kecamatan")).toHaveValue("mal pelayanan");
    await expect(page.getByRole("link", { name: "Mal Pelayanan Publik Kota Batam" })).toBeVisible();
  });

  test("saringan: kategori, kecamatan, buka sekarang, dan hapus saringan", async ({ page }) => {
    await page.goto("/info/direktori?kategori=kesehatan");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.per_kategori.kesehatan));
    // Daftar kategori disembunyikan selama saringan aktif.
    await expect(page.locator("[data-kategori-grid]")).toHaveCount(0);
    await page.getByRole("button", { name: "Hapus saringan" }).click();
    await expect(page.locator("[data-jumlah]")).toHaveAttribute("data-jumlah", String(stats.total_tempat));
    await expect(page.locator("[data-kategori-grid]")).toBeVisible();
    await expect(page.getByLabel("Buka sekarang")).toBeVisible();
    for (const lama of ["Subkategori", "Kelurahan", "Status data", "Lokasi di peta"]) {
      await expect(page.getByLabel(lama)).toHaveCount(0);
    }
    await page.locator('label:has-text("Kecamatan") select').first().selectOption("Galang");
    await expect(page.locator("[data-jumlah]")).toHaveAttribute(
      "data-jumlah",
      String((stats.per_kecamatan as Record<string, number>).Galang),
    );
  });

  test("pencarian kosong memakai kalimat pedoman", async ({ page }) => {
    await page.goto("/info/direktori?q=zzzzzzzzzz");
    await expect(page.getByText("Tidak ada hasil untuk “zzzzzzzzzz”. Coba kata lain atau hapus saringan.")).toBeVisible();
  });

  test("halaman kategori: remah roti, judul, lede, dan saringan", async ({ page }) => {
    await page.goto("/info/direktori/keamanan-darurat");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Darurat dan Keamanan");
    await expect(page.locator(".bch-kicker").first()).toHaveText("Informasi Warga / Direktori / Darurat dan keamanan");
    await expect(page.locator(".bch-lede")).toHaveText(
      `Polisi, pemadam kebakaran, dan SAR di Batam. Ada ${stats.per_kategori.keamanan_darurat} tempat di kategori ini.`,
    );
    await expect(page.locator(".bch-sub-nav a").first()).toContainText("Semua");
    await expect(page.locator(".bch-sub-nav")).toContainText("Kecamatan");
  });

  test("daftar panjang dibuka bertahap", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    await expect(page.locator(".bch-grid .bch-card")).toHaveCount(12);
    await page.getByRole("button", { name: /^Tampilkan 33 tempat lagi$/ }).click();
    await expect(page.locator(".bch-grid .bch-card")).toHaveCount(stats.per_kategori.kesehatan);
  });

  test("kategori gabungan: slug lama dialihkan", async ({ page }) => {
    await page.goto("/info/direktori/layanan-publik");
    await expect(page).toHaveURL(/\/info\/direktori\/pemerintahan$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kantor dan Layanan Publik");
    await page.goto("/info/direktori/layanan-publik/bpjs-kes");
    await expect(page).toHaveURL(/\/info\/direktori\/pemerintahan\/bpjs-kes$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("BPJS Kesehatan");
  });

  test("jenis tanpa data tidak ditautkan, halamannya memakai kalimat kategori kosong", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    await expect(page.getByRole("link", { name: /Dokter kandungan/ })).toHaveCount(0);
    await page.goto("/info/direktori/kesehatan/dokter-kandungan");
    await expect(page.locator(".bch-lede")).toContainText(
      "Belum ada tempat di kategori ini. Kalau kamu tahu tempatnya, kirim usulan.",
    );
  });

  test("angka pembanding tampil tanpa sumber", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    await expect(page.locator(".bch-kelengkapan")).toContainText("831");
    await expect(page.locator(".bch-kelengkapan")).not.toContainText("Sumber");
  });

  test("subkategori kosong menampilkan daftar OSM terpisah, tanpa tautan sumber", async ({ page }) => {
    await page.goto("/info/direktori/kesehatan");
    await page.getByRole("link", { name: /Apotek/ }).click();
    await expect(page).toHaveURL(/\/kesehatan\/apotek$/);
    await expect(page.locator(".bch-lede")).toContainText("Belum ada tempat di kategori ini");
    const osm = page.locator("[data-daftar-osm]");
    await expect(osm).toContainText("OpenStreetMap");
    await expect(osm).toContainText("belum masuk hitungan direktori");
    expect(await osm.locator("li").count()).toBeGreaterThan(5);
    await expect(osm.locator("a")).toHaveCount(0);
  });

  test("kartu dan daftar bebas catatan kerja", async ({ page }) => {
    for (const h of ["/info/direktori/kesehatan", "/info/direktori/pertanahan-hukum", "/info/direktori/pemerintahan"]) {
      await page.goto(h);
      await expect(page.locator("main")).not.toContainText(
        /Belum dicek ulang|Lokasi belum diisi|Perlu cek ulang|\bBeta\b|Sumber angka|Kecamatan belum diketahui/i,
      );
    }
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
    await expect(kartu).not.toContainText(/dicek|sumber/i);
    await expect(page.locator("main")).not.toContainText("Sumber");
    await expect(page.getByRole("link", { name: "Petunjuk arah" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bagikan" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Laporkan data yang salah" })).toHaveAttribute(
      "href",
      "/koreksi?tempat=mpp-batam",
    );
  });

  test("tempat tanpa koordinat: tanpa tombol peta dan tanpa teks pengganti", async ({ page }) => {
    await page.goto("/info/tempat/ppat-yulianti");
    await expect(page.locator("main")).not.toContainText(/menebak|Lokasi belum diisi/);
    await expect(page.getByRole("link", { name: "Lihat di peta" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Petunjuk arah" })).toBeVisible();
  });

  test("PPAT tanpa label Beta, dengan satu kalimat pengingat", async ({ page }) => {
    await page.goto("/info/tempat/ppat-yulianti");
    await expect(page.locator("main")).not.toContainText("Beta");
    await expect(page.getByText("Pastikan status praktiknya sebelum memakai jasanya.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cek status" })).toHaveCount(0);
  });

  test("tempat yang hanya punya nama tidak punya halaman, cukup baris di daftar", async ({ page }) => {
    await page.goto("/info/tempat/pura-sekupang");
    await expect(page).toHaveURL(/\/info\/direktori\?q=Pura/);
    const baris = page.locator(".bch-penjelajah-daftar li").filter({ hasText: "Pura Sekupang" });
    await expect(baris).toBeVisible();
    await expect(baris.getByRole("link")).toHaveCount(0);
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
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText("Hujan ringan di Kecamatan Batam Kota.");
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText("Perkiraan radar");
    await expect(page.locator("[data-hujan-kecamatan]")).not.toContainText("MSS");
  });
});

test.describe("panduan", () => {
  test("nomor darurat sesuai pedoman, tanpa catatan dan tanpa peta", async ({ page }) => {
    await page.goto("/info/darurat");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nomor Darurat");
    await expect(page.locator(".bch-lede")).toHaveText("Dalam keadaan darurat, hubungi 112.");
    for (const n of ["112", "110", "113", "115", "119"]) {
      await expect(page.locator(".bch-nomor", { hasText: new RegExp(`^${n}$`) })).toHaveAttribute("href", `tel:${n}`);
    }
    await expect(page.locator(".bch-nomor-daftar h2")).toHaveText([
      "Panggilan darurat",
      "Polisi",
      "Pemadam kebakaran",
      "SAR",
      "Ambulans",
    ]);
    await expect(page.getByRole("heading", { name: "Pos Pemadam Kebakaran" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Layanan Pengaduan" })).toBeVisible();
    await expect(page.locator("[data-tabel-pengaduan] thead th")).toHaveText(["Layanan", "Telepon"]);
    await expect(page.locator("main")).not.toContainText(/bukan situs resmi|BMKG|belum kami verifikasi|damkarbatam/);
    await expect(page.locator('main a[href*=".go.id"]')).toHaveCount(0);
    await expect(page.locator(".peta")).toHaveCount(0);
  });

  test("urusan tanah: delapan baris, lima langkah, bebas catatan kerja dan tautan situs pemerintah", async ({ page }) => {
    await page.goto("/info/urusan-tanah");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Urusan Tanah dan Rumah");
    await expect(page.getByRole("heading", { name: "Keperluan yang Paling Sering Diurus" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Urutan Jual Beli Rumah" })).toBeVisible();
    await expect(page.locator("[data-tabel-tanah] tbody tr")).toHaveCount(8);
    await expect(page.locator("[data-tabel-tanah] thead th")).toHaveText(["Keperluan", "Tempat mengurus", "Catatan"]);
    await expect(page.locator("[data-langkah-jual-beli] li")).toHaveCount(5);
    await expect(page.locator("[data-catatan-hukum]")).toHaveText("Halaman ini adalah panduan umum, bukan nasihat hukum.");
    await expect(page.locator("main")).not.toContainText(/riset|Beta|go\.id|wajib dicek/);
    await expect(page.locator('main a[href*=".go.id"]')).toHaveCount(0);
  });

  test("bantuan hukum: urutan bagian sesuai pedoman, tanpa Beta", async ({ page }) => {
    await page.goto("/info/bantuan-hukum");
    const judul = await page.locator("main h2").allTextContents();
    expect(judul.slice(0, 4)).toEqual([
      "Pos Bantuan Hukum di Pengadilan",
      "Lembaga Bantuan Hukum",
      "Organisasi Advokat",
      "PPAT dan Notaris",
    ]);
    await expect(page.locator("#profesi")).toContainText(
      "Daftar ini belum lengkap. Pastikan status praktiknya sebelum memakai jasanya.",
    );
    await expect(page.locator("#profesi .bch-card").first()).toBeVisible();
    await expect(page.locator("main")).not.toContainText(/Beta|Cek status|go\.id|belum kami cek/);
    await expect(page.locator("[data-catatan-hukum]")).toHaveText("Halaman ini adalah panduan umum, bukan nasihat hukum.");
  });

  test("jasa dokumen: judul dan lede sesuai pedoman", async ({ page }) => {
    await page.goto("/info/jasa-dokumen");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Jasa Dokumen dan Usaha");
    await expect(page.locator(".bch-lede")).toHaveText(
      "Halaman ini memuat konsultan pajak, penilai properti, dan layanan izin usaha di Batam.",
    );
    await expect(page.locator("main")).not.toContainText(/go\.id|riset|belum memverifikasi/);
  });

  test("halaman kecamatan: lede sesuai pedoman, bagian kosong disembunyikan", async ({ page }) => {
    await page.goto("/info/kecamatan/batam-kota");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kecamatan Batam Kota");
    await expect(page.locator(".bch-lede")).toHaveText(
      `Ada ${(stats.per_kecamatan as Record<string, number>)["Batam Kota"]} tempat yang tercatat di kecamatan ini.`,
    );
    await expect(page.locator("main")).not.toContainText("Belum ada data");
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
  test("tempat berteduh di Cuaca dan Laut hanya saat hujan di Batam", async ({ page }) => {
    await page.unrouteAll();
    await tiruApi(page, "Lubuk Baja");
    await page.goto("/langit-laut?mode=hujan");
    if (test.info().project.name === "hp") await page.getByRole("button", { name: /^Detail/ }).click();
    await expect(page.getByRole("heading", { name: "Tempat Berteduh" })).toBeVisible();
  });

  test("Makan menampilkan hujan di kecamatannya", async ({ page }) => {
    const p = (tempat as { id: string; kategori: string; kecamatan: string | null }[]).find(
      (x) => x.kategori === "kuliner" && x.kecamatan,
    );
    await page.unrouteAll();
    await tiruApi(page, p?.kecamatan as string);
    await page.goto(`/makan/tempat/${p?.id}`);
    await expect(page.locator("[data-hujan-kecamatan]")).toContainText(`di Kecamatan ${p?.kecamatan}`);
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
