import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

// Spek ini memilih sendiri berdasarkan server yang diuji:
// - mode contoh: alur penuh. Server harus jalan dengan NEXT_PUBLIC_MODE_CONTOH=1 dan ADMIN_MODE_CONTOH, dan
//   nilai ADMIN_MODE_CONTOH yang sama diberikan ke proses Playwright.
// - mode mati (build produksi tanpa Supabase): kejujuran formulir dan admin tertutup.
// Data fiktif hidup di memori server. Tiap tes memakai nama unik, jadi tidak bergantung pada urutan.

const SANDI = process.env.ADMIN_MODE_CONTOH ?? "";

async function modeServer(request: APIRequestContext): Promise<string | null> {
  const html = await (await request.get("/tukang")).text();
  return /data-mode-tukang="(\w+)"/.exec(html)?.[1] ?? null;
}

let nomor = 0;
const unik = (dasar: string) => `${dasar} ${Date.now().toString(36)}${(nomor += 1)}${Math.floor(Math.random() * 1e4)}`;

/** Isi lewat formulir sungguhan. */
async function kirimLewatForm(page: Page, nama: string, kontak: string) {
  await page.goto("/tukang/rekomendasi");
  await page.getByLabel("Nama tukang atau usahanya").fill(nama);
  await page.getByLabel("Jasa", { exact: true }).selectOption("laundry");
  await page.getByRole("checkbox", { name: "Sekupang" }).check();
  await page.getByLabel("Cara menghubungi tukangnya").fill(`Kios ${nama}`);
  await page.getByLabel("Kapan terakhir memakai jasanya").fill("2026-10");
  await page.getByLabel("Cerita singkat").fill(`Cerita rekaan untuk menguji alur ${nama}.`);
  await page.getByRole("checkbox", { name: "rapi", exact: true }).check();
  await page.getByLabel("Nomor HP atau surel Anda").fill(kontak);
  await page.getByRole("checkbox", { name: /bukan pemilik/ }).check();
  await page.getByRole("checkbox", { name: /setuju kontak saya disimpan/ }).check();
  await page.getByRole("button", { name: "Kirim rekomendasi" }).click();
  await expect(page.getByRole("status")).toContainText("masuk antrean moderator");
}

async function kirimLewatApi(request: APIRequestContext, nama: string, kontak: string) {
  const r = await request.post("/api/tukang/rekomendasi", {
    data: {
      nama_tukang: nama,
      jasa: "laundry",
      area_kecamatan: ["Sekupang"],
      cara_hubungi: `Kios ${nama}`,
      kapan_dipakai: "2026-10",
      cerita: `Cerita rekaan untuk menguji alur ${nama}.`,
      tag: ["rapi"],
      kontak_perekomendasi: kontak,
      bukan_pemilik: true,
      setuju: true,
    },
  });
  expect(r.status()).toBe(200);
}

async function masukAdmin(page: Page) {
  await page.goto("/admin");
  await page.getByLabel("Kata sandi").fill(SANDI);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page.locator("[data-admin-masuk]")).toBeVisible();
}

const kartuAntrean = (page: Page, nama: string) => page.locator(`[data-antrean*="${nama}"]`);

/** Setujui dua rekomendasi, catat izin, setujui entri. */
async function loloskan(page: Page, nama: string) {
  const kartu = kartuAntrean(page, nama);
  await expect(kartu.locator("[data-rekomendasi]")).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    await kartu.getByRole("button", { name: "Setujui cerita" }).first().click();
    await expect(kartu.getByRole("button", { name: "Setujui cerita" })).toHaveCount(1 - i);
  }
  await kartu.getByRole("button", { name: "Catat izin tukang" }).click();
  await expect(kartu.getByRole("button", { name: "Cabut izin tukang" })).toBeVisible();
  await kartu.getByRole("button", { name: "Setujui entri" }).click();
  await expect(kartu.getByText("Tampil publik")).toBeVisible();
}

async function tanpaGeserSamping(page: Page) {
  await page.setViewportSize({ width: 360, height: 800 });
  const lebih = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(lebih).toBeLessThanOrEqual(0);
}

async function axeDuaTema(page: Page, url: string, tunggu?: (p: Page) => Promise<void>) {
  for (const tema of ["day", "night"]) {
    await page.addInitScript((t) => localStorage.setItem("bch-theme", t), tema);
    await page.goto(url);
    await tunggu?.(page);
    await expect(page.locator("html")).toHaveAttribute("data-theme", tema);
    const { violations } = await new AxeBuilder({ page }).exclude(".maplibregl-map").analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.html}`)).toEqual([]);
  }
}

test.describe("mode contoh", () => {
  test.beforeAll(async ({ request }) => {
    test.skip((await modeServer(request)) !== "contoh" || !SANDI, "Butuh server mode contoh dan ADMIN_MODE_CONTOH");
  });

  test("alur kirim, moderasi, tampil lewat formulir sungguhan, dengan kontak tidak pernah bocor", async ({
    page,
    request,
  }) => {
    const nama = unik("Laundry Uji");
    const kontakA = `rahasia-a-${Date.now()}@contoh.invalid`;
    const kontakB = `rahasia-b-${Date.now()}@contoh.invalid`;

    await kirimLewatForm(page, nama, kontakA);
    await page.goto("/tukang?jasa=laundry");
    await expect(page.getByText(nama)).toHaveCount(0);

    await kirimLewatForm(page, nama, kontakB);
    await page.goto("/tukang?jasa=laundry");
    await expect(page.getByText(nama)).toHaveCount(0);

    await masukAdmin(page);
    const kartu = kartuAntrean(page, nama);
    await expect(kartu).toContainText("Butuh 2 rekomendasi lagi");
    await expect(kartu).toContainText("r***@contoh.invalid");
    expect(await page.content()).not.toContain(kontakA);
    expect(await (await page.request.get("/admin")).text()).not.toContain(kontakA);

    await loloskan(page, nama);

    await page.goto("/tukang?jasa=laundry");
    const kartuPublik = page.locator("article", { hasText: nama });
    await expect(kartuPublik).toBeVisible();
    await expect(kartuPublik).toContainText("Direkomendasikan 2 warga");
    await expect(kartuPublik).toContainText("CONTOH FIKTIF");
    await expect(kartuPublik).toContainText("rapi");
    await expect(kartuPublik).toContainText(/Terakhir dicek \d+ \w+ \d{4}/);
    // Izin dicatat tanpa izin kontak, jadi kontak tukang juga tidak tampil.
    await expect(kartuPublik).toContainText("Kontak belum diizinkan tampil");
    await expect(kartuPublik).not.toContainText(`Kios ${nama}`);

    for (const teks of [await (await request.get("/tukang?jasa=laundry")).text(), await page.content()]) {
      expect(teks).not.toContain(kontakA);
      expect(teks).not.toContain(kontakB);
      expect(teks).not.toMatch(/kontakPerekomendasi|kontak_hash|kontakHash/);
    }
  });

  test("satu orang mengirim dua kali tetap belum cukup", async ({ page, request }) => {
    const nama = unik("Satu Orang Uji");
    await kirimLewatApi(request, nama, "orang-sama@contoh.invalid");
    await kirimLewatApi(request, nama, "ORANG-SAMA@contoh.invalid");
    await masukAdmin(page);
    const kartu = kartuAntrean(page, nama);
    await expect(kartu.locator("[data-rekomendasi]")).toHaveCount(2);
    await kartu.getByRole("button", { name: "Setujui cerita" }).first().click();
    await expect(kartu.getByRole("button", { name: "Setujui cerita" })).toHaveCount(1);
    await kartu.getByRole("button", { name: "Setujui cerita" }).first().click();
    await expect(kartu.getByRole("button", { name: "Setujui cerita" })).toHaveCount(0);
    await expect(kartu).toContainText("1 warga berbeda disetujui");
    await expect(kartu).toContainText("Butuh 1 rekomendasi lagi");
  });

  test("tombol kartu dan laporan menyembunyikan sampai ditinjau", async ({ page, request }) => {
    const nama = unik("Laporan Uji");
    await kirimLewatApi(request, nama, "lapor-a@contoh.invalid");
    await kirimLewatApi(request, nama, "lapor-b@contoh.invalid");
    await masukAdmin(page);
    await loloskan(page, nama);

    await page.goto("/tukang?jasa=laundry");
    const kartu = page.locator("article", { hasText: nama });
    await kartu.getByRole("button", { name: "Masih buka?" }).click();
    await expect(kartu.getByText("Dicatat: masih buka")).toBeVisible();
    await expect(kartu.getByRole("button", { name: "Sudah pindah/tutup" })).toBeDisabled();

    await page.reload();
    await expect(kartu).toContainText("Kata warga: 1 masih buka, 0 sudah pindah");

    await kartu.getByRole("button", { name: /Laporkan masalah/ }).click();
    await kartu.getByRole("button", { name: "Kirim laporan" }).click();
    await expect(kartu.getByRole("alert")).toContainText("Tulis masalahnya");
    await kartu.getByLabel("Apa masalahnya?").fill("Rekaan untuk menguji laporan.");
    await kartu.getByRole("button", { name: "Kirim laporan" }).click();
    await expect(page.getByText("Entri ini disembunyikan sementara")).toBeVisible();

    await page.reload();
    await expect(page.getByText(nama)).toHaveCount(0);

    await page.goto("/admin");
    const laporan = page.locator(`[data-laporan*="${nama}"]`);
    await expect(laporan).toContainText("Rekaan untuk menguji laporan");
    await laporan.getByRole("button", { name: "Tampilkan lagi" }).click();
    await expect(laporan).toHaveCount(0);

    await page.goto("/tukang?jasa=laundry");
    await expect(page.locator("article", { hasText: nama })).toBeVisible();
  });

  test("formulir menunjukkan galat per kolom, dan honeypot tidak tersimpan", async ({ page, request }) => {
    await page.goto("/tukang/rekomendasi");
    await page.getByRole("button", { name: "Kirim rekomendasi" }).click();
    await expect(page.getByRole("alert").first()).toContainText("perlu dibetulkan");
    await expect(page.getByText("Tulis nama tukang atau nama usahanya.")).toBeVisible();
    await expect(page.getByText("Centang persetujuan dulu.")).toBeVisible();
    await expect(page.getByLabel("Nama tukang atau usahanya")).toHaveAttribute("aria-invalid", "true");

    const nama = unik("Robot Madu");
    const r = await request.post("/api/tukang/rekomendasi", {
      data: { nama_tukang: nama, situs_web: "http://spam.invalid" },
    });
    expect(r.status()).toBe(200);
    await masukAdmin(page);
    await expect(page.getByText(nama)).toHaveCount(0);
  });

  test("koreksi dengan ?tempat= sampai ke antrean admin", async ({ page }) => {
    const isi = unik("Kantor ini sudah pindah, kata rekaan");
    await page.goto("/koreksi?tempat=pub-bpbd");
    await expect(page.locator("[data-koreksi-tempat]")).toContainText("BPBD");
    await page.getByLabel("Yang perlu dibetulkan").fill(isi);
    await page.getByRole("button", { name: "Kirim koreksi" }).click();
    await expect(page.getByRole("status")).toContainText("koreksinya masuk");

    await masukAdmin(page);
    const k = page.locator("[data-koreksi]", { hasText: isi });
    await expect(k).toContainText("pub-bpbd");
    await k.getByRole("button", { name: "Selesai" }).click();
    await expect(k).toHaveCount(0);
  });

  test("permintaan hapus data menghapus rekomendasi pengirim", async ({ page, request }) => {
    const nama = unik("Hapus Uji");
    const kontak = `hapus-${Date.now()}@contoh.invalid`;
    await kirimLewatApi(request, nama, kontak);

    await page.goto("/koreksi?jenis=hapus_data");
    await expect(page.getByLabel("Jenis koreksi")).toHaveValue("hapus_data");
    await page.getByLabel("Yang perlu dibetulkan").fill("Tolong hapus semua rekomendasi saya, rekaan.");
    await page.getByRole("button", { name: "Kirim koreksi" }).click();
    await expect(page.getByText("Permintaan soal data pribadi butuh kontak")).toBeVisible();
    await page.getByLabel("Nomor HP atau surel (boleh kosong)").fill(kontak);
    await page.getByRole("checkbox", { name: /Kalau saya meninggalkan kontak/ }).check();
    await page.getByRole("button", { name: "Kirim koreksi" }).click();
    await expect(page.getByRole("status")).toContainText("koreksinya masuk");

    await masukAdmin(page);
    const k = page.locator("[data-koreksi]", { hasText: "Tolong hapus semua" }).last();
    await expect(k).toContainText("Rekomendasi dari kontak yang sama: 1");
    expect(await page.content()).not.toContain(kontak);
    page.once("dialog", (d) => d.accept());
    await k.getByRole("button", { name: "Hapus data pengirim" }).click();
    await expect(kartuAntrean(page, nama).locator("[data-rekomendasi]")).toHaveCount(0);
  });

  test("kiriman foto hanya menerima metadata dan izin", async ({ request }) => {
    const data = {
      judul: "Pelabuhan rekaan",
      lokasi: "Sekupang",
      perkiraan_tahun: "1990-an",
      kredit: "Warga Rekaan",
      kontak: "foto@contoh.invalid",
      punya_hak: true,
      izin_tampil: true,
    };
    expect((await request.post("/api/kiriman-foto", { data })).status()).toBe(200);
    expect((await request.post("/api/kiriman-foto", { data: { ...data, izin_tampil: false } })).status()).toBe(400);
  });

  test("admin menolak yang belum masuk, dan API moderasi juga", async ({ page, request }) => {
    await page.goto("/admin");
    await expect(page.getByLabel("Kata sandi")).toBeVisible();
    await expect(page.locator("[data-admin-masuk]")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);

    await page.getByLabel("Kata sandi").fill("kata sandi salah");
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.locator(".bch-tk-galat")).toContainText("Gagal masuk");

    for (const url of ["/admin/cek-ulang", "/admin/koordinat"]) {
      const html = await (await request.get(url)).text();
      expect(html).not.toContain("data-admin-masuk");
      expect(html).not.toContain("pub-bpbd");
    }
    const asal = new URL(page.url()).origin;
    const tanpaKuki = await request.post("/api/admin/moderasi", {
      headers: { origin: asal },
      data: { aksi: "tandai_dicek", id: "00000000-0000-4000-8000-000000000001" },
    });
    expect(tanpaKuki.status()).toBe(403);
    const asalLain = await page.request.post("/api/admin/masuk", {
      headers: { origin: "http://jahat.invalid" },
      data: { kata_sandi: SANDI },
    });
    expect(asalLain.status()).toBe(403);
  });

  test("/admin/cek-ulang menampilkan alasan dengan kata", async ({ page }) => {
    await masukAdmin(page);
    await page.goto("/admin/cek-ulang");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("perlu dicek ulang");
    const n = Number(await page.locator("[data-jumlah-cek]").getAttribute("data-jumlah-cek"));
    expect(n).toBeGreaterThan(0);
    await expect(page.locator("tbody tr").first()).toContainText(/Status|Lebih dari 6 bulan/);
    await page.getByRole("link", { name: /Status usang/ }).click();
    await expect(page).toHaveURL(/alasan=usang/);
    await expect(page.locator("tbody tr").first()).toContainText("Status usang");
  });

  test("/admin/koordinat: klik peta, unduh JSON dan CSV, server tidak menyimpan", async ({ page }, info) => {
    test.setTimeout(120_000);
    await masukAdmin(page);
    await page.goto("/admin/koordinat");
    await page.evaluate(() => localStorage.removeItem("bch-admin-koordinat"));
    await page.reload();

    const peta = page.locator("[data-peta-koordinat]");
    await expect(peta).toHaveAttribute("data-siap", "1", { timeout: 60_000 });
    await expect(page.locator("[data-jumlah-isian]")).toHaveAttribute("data-jumlah-isian", "0");

    // Tanpa titik terpilih, klik peta tidak mengisi apa-apa.
    await peta.click({ position: { x: 200, y: 160 } });
    await expect(page.locator("[data-jumlah-isian]")).toHaveAttribute("data-jumlah-isian", "0");

    await page.locator("[data-cari-titik]").fill("BPBD Kota Batam");
    await page
      .getByRole("button", { name: /BPBD Kota Batam/ })
      .first()
      .click();
    await expect(page.locator("[data-nilai-titik]")).toContainText("Belum ada isian");

    // Klik dari jauh ditolak: itu sama saja dengan menebak.
    await peta.click({ position: { x: 200, y: 160 } });
    await expect(page.locator("[data-peta-pesan]")).toContainText("Perbesar peta dulu");
    await expect(page.locator("[data-nilai-titik]")).toContainText("Belum ada isian");

    // Perbesar lewat kontrol sampai cukup dekat, lalu klik tercatat.
    const perbesar = page.locator(".maplibregl-ctrl-zoom-in");
    await expect(async () => {
      await perbesar.click();
      await page.waitForTimeout(400);
      await peta.click({ position: { x: 200, y: 160 } });
      await expect(page.locator("[data-nilai-titik]")).toHaveText(/^\d\.\d+, 10\d\.\d+$/, { timeout: 500 });
    }).toPass({ timeout: 45_000 });
    await expect(page.locator("[data-peta-pesan]")).toHaveText("");

    const [unduhan] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "JSON tempat" }).click(),
    ]);
    expect(unduhan.suggestedFilename()).toBe("koordinat_user.json");
    const jalur = info.outputPath("koordinat_user.json");
    await unduhan.saveAs(jalur);
    const fs = await import("node:fs");
    const json = JSON.parse(fs.readFileSync(jalur, "utf8"));
    expect(Object.keys(json)).toEqual(["pub-bpbd"]);
    expect(json["pub-bpbd"]).toMatchObject({ tanggal: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/) });

    const [csv] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "CSV tempat" }).click(),
    ]);
    const jalurCsv = info.outputPath("tempat.csv");
    await csv.saveAs(jalurCsv);
    const barisCsv = fs.readFileSync(jalurCsv, "utf8").trim().split("\r\n");
    expect(barisCsv[0]).toContain("prioritas,id,nama");
    expect(barisCsv).toHaveLength(2);
    expect(barisCsv[1]).toContain("pub-bpbd");
    expect(barisCsv[1]).toContain("terverifikasi");

    // Halte: tempel angka. Berkas halte memakai header sendiri.
    await page.locator("[data-cari-titik]").fill("");
    await page.locator("[data-saring-jenis]").selectOption("halte");
    await page.locator(".bch-adm-titik button").first().click();
    await page.locator("[data-tempel-titik]").fill("104.05, 1.12");
    await page.getByRole("button", { name: "Pakai" }).click();
    await expect(page.getByText("Harus berada di wilayah Batam")).toBeVisible();
    await page.locator("[data-tempel-titik]").fill("1.12, 104.05");
    await page.getByRole("button", { name: "Pakai" }).click();
    await expect(page.locator("[data-nilai-titik]")).toHaveText("1.12, 104.05");
    const [halte] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "CSV halte" }).click(),
    ]);
    const jalurHalte = info.outputPath("halte.csv");
    await halte.saveAs(jalurHalte);
    expect(fs.readFileSync(jalurHalte, "utf8").split("\r\n")[0]).toContain("kelompok");

    // Draf bertahan setelah muat ulang, hanya di browser.
    await page.reload();
    await expect(page.locator("[data-jumlah-isian]")).toHaveAttribute("data-jumlah-isian", "2");
    await page.evaluate(() => localStorage.removeItem("bch-admin-koordinat"));
  });

  test("halaman publik lolos axe di dua tema", async ({ page }) => {
    for (const url of ["/tukang", "/tukang/rekomendasi", "/koreksi?tempat=pub-bpbd", "/privasi"]) {
      await axeDuaTema(page, url);
    }
  });

  test("halaman admin lolos axe di dua tema", async ({ page }) => {
    await masukAdmin(page);
    for (const url of ["/admin", "/admin/cek-ulang", "/admin/koordinat"]) {
      await axeDuaTema(page, url);
    }
  });

  test("tanpa geser samping di 360 px", async ({ page }) => {
    await masukAdmin(page);
    for (const url of [
      "/tukang",
      "/tukang/rekomendasi",
      "/koreksi",
      "/privasi",
      "/admin",
      "/admin/cek-ulang",
      "/admin/koordinat",
    ]) {
      await page.goto(url);
      await tanpaGeserSamping(page);
    }
  });

  test("/tukang menyaring per jasa dan kecamatan, dan jujur saat kosong", async ({ page }) => {
    await page.goto("/tukang?jasa=jastip-singapura");
    await expect(page.locator("[data-kosong-tukang]")).toContainText("Belum ada tukang yang cocok");
    await page.goto("/tukang");
    await expect(page.getByRole("link", { name: "Pijat panggilan" })).toBeVisible();
    await page.getByLabel("Kecamatan").selectOption("Bulang");
    await page.getByRole("button", { name: "Saring" }).click();
    await expect(page).toHaveURL(/kecamatan=Bulang/);
    await expect(page.locator("[data-kosong-tukang]")).toBeVisible();
    await expect(page.getByText(/bintang/i)).toHaveCount(0);
  });
});

test.describe("build produksi tanpa Supabase", () => {
  test.beforeAll(async ({ request }) => {
    test.skip((await modeServer(request)) !== "mati", "Hanya untuk server mode mati");
  });

  test("/tukang jujur kosong, tanpa data fiktif", async ({ page }) => {
    await page.goto("/tukang");
    await expect(page.locator("[data-kosong-tukang]")).toContainText("Belum ada tukang");
    await expect(page.getByText("CONTOH FIKTIF")).toHaveCount(0);
    await expect(page.locator("article")).toHaveCount(0);
  });

  test("formulir menyatakan belum menerima kiriman", async ({ page, request }) => {
    for (const url of ["/tukang/rekomendasi", "/koreksi"]) {
      await page.goto(url);
      await expect(page.locator("[data-mode-mati]")).toContainText("belum menerima kiriman");
      await expect(page.locator("form")).toHaveCount(0);
    }
    for (const url of ["/api/tukang/rekomendasi", "/api/koreksi", "/api/kiriman-foto"]) {
      expect((await request.post(url, { data: {} })).status()).toBe(503);
    }
  });

  test("admin tertutup, tanpa formulir masuk", async ({ page }) => {
    for (const url of ["/admin", "/admin/cek-ulang", "/admin/koordinat"]) {
      await page.goto(url);
      await expect(page.locator("[data-admin-tertutup]")).toBeVisible();
      await expect(page.locator("form")).toHaveCount(0);
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
    }
    const r = await page.request.post("/api/admin/masuk", {
      headers: { origin: new URL(page.url()).origin },
      data: { kata_sandi: "apa saja" },
    });
    expect(r.status()).toBe(403);
  });

  test("admin tidak masuk sitemap", async ({ request }) => {
    expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/admin");
  });
});
