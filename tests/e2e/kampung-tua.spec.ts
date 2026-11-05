import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import kampung from "../../data/kampung_tua/kampung_tua.json" with { type: "json" };
import penamaan from "../../data/tokoh/penamaan.json" with { type: "json" };
import relasi from "../../data/tokoh/relasi.json" with { type: "json" };
import tokoh from "../../data/tokoh/tokoh.json" with { type: "json" };

// Luas, status sertifikat, dan hak atas tanah. Halaman ini boleh menyebut bahwa hal itu tidak ditampilkan,
// jadi yang dilarang adalah angka dan istilahnya, bukan kata "status lahan".
const LAHAN = /\d\s*ha\b|±1\.600|1\.450|1\.456|hektar|sertifikat|\bSHM\b|\bHPL\b|hak pengelolaan|hak milik/i;

test.beforeEach(async ({ page }) => {
  // Halaman ini tidak memanggil API. Kalau suatu saat memanggil, jangan sampai ke sumber luar.
  await page.route("**/api/**", (r) => r.fulfill({ status: 503, json: {} }));
});

test.describe("Kampung Tua", () => {
  test("daftar memuat semua 56 entri dan bisa dinavigasi keyboard", async ({ page }) => {
    await page.goto("/cerita/kampung-tua");
    await expect(page.getByRole("heading", { level: 1, name: "Kampung Tua" })).toBeVisible();
    await expect(page.locator("main")).toContainText(
      "Halaman ini tidak memuat batas wilayah, luas, atau status lahan.",
    );
    for (const k of kampung) {
      await expect(page.locator(`#daftar [data-kampung="${k.id}"] a`)).toHaveAttribute(
        "href",
        `/cerita/kampung-tua/${k.id}`,
      );
    }
    await expect(page.locator("#daftar [data-lapisan-daftar='daratan'] [data-kampung]")).toHaveCount(37);
    await expect(page.locator("#daftar [data-lapisan-daftar='rempang'] [data-kampung]")).toHaveCount(16);
    await expect(page.locator("#daftar [data-lapisan-daftar='hinterland'] [data-kampung]")).toHaveCount(3);
    const pertama = page.locator("#daftar [data-kampung] a").first();
    await pertama.focus();
    await expect(pertama).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/cerita\/kampung-tua\/kt-/);
  });

  test("peta: lapisan bisa dinyalakan, penanda berongga, kartu terbuka lewat keyboard", async ({ page }) => {
    await page.goto("/cerita/kampung-tua");
    const peta = page.locator('.peta[data-peta="kampung-tua"]');
    await expect(peta).toHaveAttribute("data-status", "siap", { timeout: 60_000 });
    await expect(peta).toHaveAttribute("data-penanda-tampil", "35");
    await expect(peta.locator(".kt-penanda")).toHaveCount(35);
    await expect(peta.locator('.kt-penanda[data-jenis="perkiraan"] svg')).toHaveCount(35);

    await page.getByRole("checkbox", { name: /Rempang dan Galang/ }).check();
    await expect(peta).toHaveAttribute("data-penanda-tampil", "47");
    await page.getByRole("checkbox", { name: /Situs dan kampung lama/ }).check();
    await expect(peta).toHaveAttribute("data-penanda-tampil", "50");
    await page.getByRole("checkbox", { name: /Daratan Batam/ }).uncheck();
    await expect(peta).toHaveAttribute("data-penanda-tampil", "15");
    await expect(peta.locator('.kt-penanda[data-kampung="kt-jabi"]')).toHaveCount(0);

    const penanda = peta.locator('.kt-penanda[data-kampung="rg-sembulang"]');
    await expect(penanda).toHaveAttribute("aria-label", /lokasi perkiraan/);
    await penanda.focus();
    await page.keyboard.press("Enter");
    const kartu = page.getByRole("complementary", { name: "Kartu Sembulang" });
    await expect(kartu).toBeVisible();
    await expect(kartu).toContainText("Lokasi perkiraan");
    await expect(page.getByRole("button", { name: "Tutup kartu" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(kartu).toHaveCount(0);
  });

  test("angka jumlah beratribusi, tanpa diktum lahan", async ({ page }) => {
    await page.goto("/cerita/kampung-tua");
    const baris = page.locator("[data-tabel-jumlah] tbody tr");
    await expect(baris).toHaveCount(9);
    await expect(page.locator("[data-tabel-jumlah]")).toContainText("Surat RKWB ke Presiden");
    await expect(page.locator("[data-tabel-jumlah]")).toContainText("Berbeda versi");
    await expect(page.locator("[data-satu-data]")).toContainText("24 lokasi");
    await expect(page.locator("[data-pegangan] li")).toHaveCount(3);
    await expect(page.locator("[data-kisah-nama] > div")).toHaveCount(3);
    await expect(
      page.locator('#daftar a[href^="http"], #jumlah a[href^="http"], #kisah-nama a[href^="http"]'),
    ).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(LAHAN);
  });

  test("label kartu sesuai pedoman", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/kt-nongsa-pantai");
    const kartu = page.locator(".bch-kartu-museum");
    await expect(kartu).toContainText("Asal-usul nama");
    await expect(kartu).toContainText("Berdiri sejak");
    await expect(page.getByRole("heading", { level: 2, name: "Yang bisa dilihat" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Etika berkunjung" })).toBeVisible();
  });

  test("kartu museum lengkap: etika, cerita rakyat berikon, hak koreksi, tanpa tautan sumber", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/kt-tanjung-bemban");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kampung Tua Tanjung Bemban");
    const kartu = page.locator(".bch-kartu-museum");
    await expect(kartu).toContainText("Melayu");
    await expect(kartu).toContainText("Lokasi perkiraan");
    await expect(kartu.locator("[data-baris-museum]")).toContainText("Lokasi perkiraan");
    await expect(kartu).toContainText("Penduduk awal");
    await expect(page.locator("[data-yang-dilihat] li")).toHaveCount(2);
    const cerita = page.locator("[data-cerita-rakyat]");
    await expect(cerita).toContainText("Cerita rakyat, bukan catatan sejarah");
    await expect(cerita.locator('[data-ikon="cerita-rakyat"]')).toHaveCount(1);
    await expect(page.locator("[data-etika] li")).toHaveCount(6);
    await expect(page.locator("[data-profil]")).toContainText("bukan bukti arkeologis");
    await expect(page.getByRole("link", { name: "Kirim koreksi" })).toHaveAttribute(
      "href",
      "/koreksi?tempat=kt-tanjung-bemban",
    );
    await expect(page.locator('main a[href*=".go.id"]')).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(/belum dicek|perlu dicek|Sumber:/i);
  });

  test("kartu tanpa koordinat tanpa teks lokasi, dan tidak ada tautan peta", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/kt-seranggong");
    await expect(page.locator(".bch-kartu-museum [data-baris-museum]")).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(/Lokasi belum diisi|tidak menebak/i);
    await expect(page.getByRole("link", { name: "Lihat di peta" })).toHaveCount(0);
  });

  test("istilah etnis lama tidak tampil di Panau", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/kt-panau");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/keling/i);
    expect(teks).not.toMatch(/parafrase/i);
    await expect(page.locator("[data-cerita-rakyat]")).toContainText("panau");
  });

  test("kartu Rempang memakai kalimat persis, tanpa tautan", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/rg-pantai-melayu");
    const blok = page.locator("[data-kalimat-rempang]");
    await expect(blok).toContainText("Status dan pandangan para pihak masih berkembang; lihat sumber bertanggal.");
    await expect(blok.getByRole("link")).toHaveCount(0);
  });

  test("situs lama diberi label bukan kampung tua resmi", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/hl-belakang-padang");
    await expect(page.locator("main")).toContainText("bukan klaim kampung tua resmi");
  });

  test("id yang tidak ada 404", async ({ page }) => {
    expect((await page.goto("/cerita/kampung-tua/tidak-ada"))?.status()).toBe(404);
    expect((await page.goto("/cerita/nama-jalan/tidak-ada"))?.status()).toBe(404);
  });

  test("kartu direktori menaut ke cerita bila id cocok, lewat alias juga", async ({ page }) => {
    await page.goto("/info/tempat/tanjung-uma");
    await expect(page.getByRole("link", { name: /Baca ceritanya/ })).toHaveAttribute(
      "href",
      "/cerita/kampung-tua/kt-tanjung-uma",
    );
    await page.goto("/info/tempat/kampung-tua-nongsa");
    await expect(page.getByRole("link", { name: /Baca ceritanya/ })).toHaveCount(0);
  });

  test("tidak ada kampung tua yang membawa angka lahan di kartu", async ({ page }) => {
    for (const id of ["kt-tanjung-uma", "kt-tanjung-riau", "kt-teluk-mata-ikan", "rg-tanjung-banon", "kt-setengar"]) {
      await page.goto(`/cerita/kampung-tua/${id}`);
      const teks = await page.locator("main").innerText();
      expect(teks, id).not.toMatch(LAHAN);
      expect(teks, id).not.toMatch(/legalitas/i);
    }
  });
});

test.describe("halaman bertanggal", () => {
  test("kronologi legalitas: 15 butir, tanggal, label pelaku, tanpa lahan dan tautan", async ({ page }) => {
    await page.goto("/cerita/kampung-tua/legalitas");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kronologi Legalitas Kampung Tua");
    await expect(page.locator("[data-kronologi-legalitas] > li")).toHaveCount(15);
    await expect(page.locator("[data-pita-bertanggal]")).toHaveText("Terakhir diperbarui 5 November 2026");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(LAHAN);
    expect(teks).not.toMatch(/Draf|Isi butir ini menyangkut|Sebagian isi disaring|Menurut:|\.go\.id/);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });

  test("Rempang: bertanggal, tiap pihak beratribusi, tanpa lahan, tautan, dan ilustrasi", async ({ page }) => {
    await page.goto("/cerita/rempang");
    await expect(page.locator("[data-pita-bertanggal]")).toHaveText("Terakhir diperbarui 5 November 2026");
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
    for (const pihak of ["pemerintah", "bp_batam", "ombudsman", "media", "walhi"]) {
      expect(await page.locator(`[data-kronologi-rempang] li[data-pihak="${pihak}"]`).count(), pihak).toBeGreaterThan(
        0,
      );
    }
    await expect(page.locator("[data-kampung-rempang] li")).toHaveCount(16);
    const main = page.locator("main");
    const teks = await main.innerText();
    expect(teks).not.toMatch(LAHAN);
    expect(teks).not.toMatch(/menggusur|merampas/i);
    expect(teks).not.toMatch(/Draf|Sumber:|tautan belum tercatat|Belum dicek ulang/);
    await expect(main.locator("img")).toHaveCount(0);
    await expect(main.locator(".peta")).toHaveCount(0);
    await expect(main).toContainText("Tanggapan BP Batam soal ini belum kami peroleh");
  });
});

test.describe("Siapa di Balik Nama Jalan", () => {
  test("semua tokoh, nama tempat, dan relasi tampil", async ({ page }) => {
    await page.goto("/cerita/nama-jalan");
    await expect(page.locator("[data-jumlah-tokoh]")).toHaveAttribute("data-jumlah-tokoh", String(tokoh.length));
    for (const t of tokoh) {
      await expect(page.locator(`[data-tokoh="${t.id}"] h4 a`)).toHaveAttribute("href", `/cerita/nama-jalan/${t.id}`);
    }
    await expect(page.locator("[data-tabel-penamaan] tbody tr")).toHaveCount(penamaan.length);
    for (const p of penamaan) await expect(page.locator(`[data-penamaan="${p.id}"]`)).toContainText(p.nama_tempat);
    await expect(page.locator("[data-relasi-teks] li")).toHaveCount(relasi.length);
    for (const r of relasi) {
      await expect(page.locator(`[data-relasi="${r.tokoh_a}>${r.tokoh_b}"]`)).toHaveCount(1);
    }
    await expect(page.locator("[data-tautan-tempat]")).toHaveCount(18);
  });

  test("filter kelompok dan status, hapus filter, kartu hikayat berbeda", async ({ page }) => {
    await page.goto("/cerita/nama-jalan");
    const jumlah = page.locator("[data-jumlah-tokoh]");
    await page.getByLabel("Kelompok").selectOption("b");
    await expect(jumlah).toHaveAttribute("data-jumlah-tokoh", "8");
    await expect(page.locator("[data-catatan-hikayat]")).toContainText("Hang Kasturi");
    await page.getByLabel("Status").selectOption("hikayat");
    await expect(jumlah).toHaveAttribute("data-jumlah-tokoh", "6");
    await expect(page.locator('[data-tokoh="hang_tuah"] .nj-kartu')).toHaveAttribute("data-hikayat", "true");
    await expect(page.locator('[data-tokoh="hang_tuah"]')).toContainText("Cerita rakyat");
    await page.getByRole("button", { name: "Hapus saringan" }).click();
    await expect(jumlah).toHaveAttribute("data-jumlah-tokoh", String(tokoh.length));
    await expect(page.locator('[data-tokoh="nong_isa"] .nj-kartu')).toHaveAttribute("data-hikayat", "false");
  });

  test("catatan Raja Ali, garis tanpa kartu, penamaan resmi, bacaan", async ({ page }) => {
    await page.goto("/cerita/nama-jalan");
    await expect(page.locator("[data-catatan-raja-ali]")).toContainText("berbeda orang dari Raja Ali Haji");
    await expect(page.locator("[data-garis-tanpa-kartu]")).toContainText("1811 atau 1818, berbeda versi");
    await expect(page.locator("[data-penamaan-resmi] > div")).toHaveCount(4);
    await expect(page.locator("[data-bacaan] li")).toHaveCount(10);
  });

  test("kartu tokoh lengkap dan menaut ke tempat", async ({ page }) => {
    await page.goto("/cerita/nama-jalan/hang_nadim");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hang Nadim");
    await expect(page.locator("[data-status-tokoh]")).toContainText("Belum terverifikasi");
    await expect(page.locator("[data-catatan-hikayat]")).toBeVisible();
    await expect(page.locator("main")).toContainText("3 Januari 1995");
    await expect(page.locator("[data-tempat-tokoh]").getByRole("link")).toHaveAttribute(
      "href",
      "/info/tempat/bandara-hang-nadim",
    );
    await expect(page.locator("[data-nama-dipakai]")).toContainText("Jl. Hang Nadim");
    await expect(page.locator("[data-hubungan] li")).toHaveCount(2);
  });

  test("kartu ringkas tanpa biografi dan tanpa catatan kerja", async ({ page }) => {
    await page.goto("/cerita/nama-jalan/katamso");
    await expect(page.locator("[data-status-tokoh]")).toContainText("Belum terverifikasi");
    await expect(page.getByText("Kami belum punya sumber biografi")).toHaveCount(0);
    await expect(page.getByText("Sumber belum tercatat.")).toHaveCount(0);
    await expect(page.locator('main a[href^="http"]')).toHaveCount(0);
  });

  test("simpul diagram bisa dicapai keyboard", async ({ page }) => {
    await page.goto("/cerita/nama-jalan");
    const simpul = page.locator('[data-gugus="bugis-riau"] a').first();
    await simpul.focus();
    await expect(simpul).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/cerita\/nama-jalan\/raja_kecik$/);
  });
});

test.describe("aksesibilitas", () => {
  const HALAMAN = [
    "/cerita/kampung-tua",
    "/cerita/kampung-tua/kt-nongsa-pantai",
    "/cerita/kampung-tua/rg-sembulang",
    "/cerita/kampung-tua/legalitas",
    "/cerita/rempang",
    "/cerita/nama-jalan",
    "/cerita/nama-jalan/hang_tuah",
    "/cerita/nama-jalan/katamso",
  ];

  for (const tema of ["light", "dark"] as const) {
    for (const h of HALAMAN) {
      test(`${h} (${tema}) tanpa pelanggaran axe`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: tema });
        await page.goto(h);
        await expect(page.locator("main")).toBeVisible();
        if (h === "/cerita/kampung-tua") {
          await expect(page.locator(".peta")).toHaveAttribute("data-status", "siap", { timeout: 60_000 });
        }
        const hasil = await new AxeBuilder({ page }).analyze();
        expect(hasil.violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
      });
    }
  }

  test("tidak ada scroll horizontal di HP", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    for (const h of HALAMAN) {
      await page.goto(h);
      const lebih = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(lebih, h).toBeLessThanOrEqual(0);
    }
  });
});
