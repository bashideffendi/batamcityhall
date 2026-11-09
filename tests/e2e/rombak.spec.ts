import { expect, test, type Page } from "@playwright/test";

// Tes untuk rombak situs, November 2026: menu 11 bagian, pencarian, Food Court, Jurnal, Kartu Pos,
// peta tanpa klaster, dan alur admin Jurnal. Semua /api/* ditiru supaya tidak memanggil MSS, BMKG, atau feed berita.

const SANDI = process.env.ADMIN_MODE_CONTOH ?? "";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", (r) => {
    const url = r.request().url();
    // Alur admin memakai API sendiri; selebihnya ditiru.
    if (/\/api\/(admin|konten|tukang|unggah|newsletter)/.test(url)) return r.fallback();
    if (url.includes("/api/frames")) return r.fulfill({ json: { frames: [], stale: true, echo: null } });
    if (url.includes("/api/ofs-frame"))
      return r.fulfill({ json: { baserun: "", frames: [], nowIndex: 0, fallback: true, source: "blind", ageH: 0, expired: false } });
    if (url.includes("/api/perairan")) return r.fulfill({ json: { warns: [] } });
    if (url.includes("/api/gempa")) return r.fulfill({ json: { status: "ok", diambil: "", gempa: [] } });
    if (url.includes("/api/peringatan-cuaca")) return r.fulfill({ json: { status: "ok", diambil: "", peringatan: [] } });
    if (url.includes("/api/radar-citra")) return r.fulfill({ status: 404, body: "" });
    if (url.includes("/api/berita")) return r.fulfill({ json: { item: [], sumber: [] } });
    return r.fulfill({ status: 503, json: {} });
  });
});

// Urutan menurut keperluan pembaca (keputusan pemilik 9 Nov 2026): kebutuhan saat ini, layanan, jalan-jalan,
// bacaan, lalu warga.
const BAGIAN_URUT = [
  "Cuaca",
  "CCTV",
  "Transportasi",
  "Layanan Warga",
  "Makanan",
  "Things to Do",
  "Berita",
  "Jurnal",
  "Infografik",
  "Dataset",
  "Sejarah dan Budaya",
  "Komunitas",
  "Tukang Langganan",
];

test.describe("menu", () => {
  test("bagian tampil berurutan, tanpa nomor", async ({ page }, info) => {
    await page.goto("/");
    // Menu lebar disembunyikan di ponsel; di sana daftar yang sama ada di menu geser.
    if (info.project.name === "hp") await page.getByRole("button", { name: "Buka menu" }).click();
    const nav = info.project.name === "hp" ? page.locator("#bch-toc .bch-toc-bagian") : page.locator('nav[aria-label="Bagian situs"] a');
    await expect(nav.first()).toBeAttached();
    // Info Loker hanya tampil bila basis data tersambung.
    const label = (await nav.allTextContents()).map((t) => t.trim());
    // Beranda di depan, terpisah dari bagian (permintaan pemilik 9 Nov 2026).
    expect(label.filter((t) => t !== "Info Loker")).toEqual(["Beranda", ...BAGIAN_URUT]);
    expect(label.length).toBeLessThanOrEqual(BAGIAN_URUT.length + 2);
    // Menu lebar tidak boleh meluap keluar wadahnya, termasuk saat Info Loker tampil.
    if (info.project.name !== "hp") {
      const luap = await page.locator("nav.bch-menu").evaluate((m) => m.scrollWidth - m.clientWidth);
      expect(luap).toBeLessThanOrEqual(0);
    }
  });

  test("Beranda aktif hanya di beranda", async ({ page }, info) => {
    const beranda = async () => {
      if (info.project.name === "hp") {
        await page.getByRole("button", { name: "Buka menu" }).click();
        return page.locator("#bch-toc").getByRole("link", { name: "Beranda", exact: true });
      }
      return page.locator('nav[aria-label="Bagian situs"]').getByRole("link", { name: "Beranda", exact: true });
    };
    await page.goto("/");
    await expect(await beranda()).toHaveAttribute("aria-current", "page");
    await page.goto("/cuaca");
    const tautan = await beranda();
    await expect(tautan).toHaveAttribute("href", "/");
    await expect(tautan).not.toHaveAttribute("aria-current", "page");
  });

  test("peta transportasi di ujung submenu, bukan di antara Trans Batam dan Feri", async ({ page }) => {
    await page.goto("/jalan/trans-batam");
    const sub = page.locator('nav.bch-submenu[aria-label="Transportasi"] a');
    const label = (await sub.allTextContents()).map((t) => t.trim());
    expect(label).toEqual(["Trans Batam", "Feri", "Pompong", "Panduan Menyeberang", "Peta Transportasi"]);
    expect(label.at(-1)).toBe("Peta Transportasi");
    expect(label.indexOf("Peta Transportasi")).not.toBe(label.indexOf("Trans Batam") + 1);
    await expect(sub.last()).toHaveAttribute("href", "/jalan/peta");
  });

  test("tidak ada istilah loket, nomor menu, atau bch-tab di beranda dan bagian utama", async ({ page }) => {
    for (const h of ["/", "/jalan", "/info", "/cerita", "/makan"]) {
      await page.goto(h);
      await expect(page.locator(".bch-tab")).toHaveCount(0);
      const teks = await page.locator("body").innerText();
      expect(teks, h).not.toMatch(/\bLoket 0\d\b|ISI LOKET|Loket ini memuat/i);
    }
  });

  test("baris darurat 112 110 113 115 119 ada di puncak halaman", async ({ page }) => {
    for (const h of ["/", "/tentang", "/jalan/peta"]) {
      await page.goto(h);
      const baris = page.locator(".bch-darurat");
      await expect(baris).toBeVisible();
      const nomor = (await baris.locator("li b").allTextContents()).map((t) => t.trim());
      expect(nomor).toEqual(["112", "110", "113", "115", "119"]);
    }
  });

  test("ikon cari di kepala menuju /cari", async ({ page }) => {
    await page.goto("/tentang");
    await page.getByRole("link", { name: "Cari", exact: true }).click();
    await expect(page).toHaveURL(/\/cari$/);
    await expect(page.getByRole("searchbox", { name: "Cari di Batam City Hall" })).toBeFocused();
  });
});

test.describe("pencarian /cari", () => {
  async function cari(page: Page, kata: string) {
    await page.goto("/cari");
    const kotak = page.getByRole("searchbox", { name: "Cari di Batam City Hall" });
    // Indeks tempat dimuat setelah halaman terbuka; ketik ulang bila baru siap.
    await expect(page.locator(".bch-cari")).toBeVisible();
    await kotak.fill(kata);
    return page.locator(".bch-cari-hasil");
  }

  test('"igd" menemukan rumah sakit', async ({ page }) => {
    const hasil = await cari(page, "igd");
    await expect(hasil).toContainText(/Rumah Sakit|RSUD|RS /i, { timeout: 15_000 });
    await expect(hasil.locator("a").first()).toBeVisible();
  });

  test('"pujasera" menemukan Food Court', async ({ page }) => {
    const hasil = await cari(page, "pujasera");
    await expect(hasil.locator('a[href="/makan/food-court"]')).toBeVisible();
  });

  test('"food court" menemukan halamannya', async ({ page }) => {
    const hasil = await cari(page, "food court");
    await expect(hasil.locator('a[href="/makan/food-court"]')).toBeVisible();
  });

  test("kata yang tidak ada tidak menghasilkan tautan palsu", async ({ page }) => {
    const hasil = await cari(page, "zzqxkvw");
    await expect(hasil.locator("a")).toHaveCount(0);
  });
});

test.describe("Food Court", () => {
  test("12 baris, tiap baris punya Petunjuk Arah ke Google Maps, Lubuk Baja lebih dulu", async ({ page }) => {
    await page.goto("/makan/food-court");
    const baris = page.locator("[data-food-court]");
    await expect(baris).toHaveCount(12);
    for (const el of await baris.all()) {
      const tautan = el.getByRole("link", { name: "Petunjuk Arah" });
      await expect(tautan).toHaveCount(1);
      await expect(tautan).toHaveAttribute("href", /^https:\/\/(www\.)?google\.com\/maps|^https:\/\/maps\.google\.com|^https:\/\/maps\.app\.goo\.gl/);
      await expect(tautan).toHaveAttribute("rel", /noopener/);
    }
    const kelompok = await page.locator("h2.bch-judul-seksi").allTextContents();
    expect(kelompok[0]).toContain("Lubuk Baja");
  });

  test("windsor-foodcourt berlabel Alamat Perlu Dicek, tanpa rating", async ({ page }) => {
    await page.goto("/makan/food-court");
    await expect(page.locator('[data-food-court="windsor-foodcourt"]')).toContainText("Alamat Perlu Dicek");
    const teks = await page.locator("main").innerText();
    expect(teks).not.toMatch(/★|bintang|rating|ulasan/i);
    await expect(page.locator("main")).toContainText("Belum kami datangi satu per satu");
  });
});

test.describe("Jurnal", () => {
  test("tulisan punya judul, penulis, tanggal, dan paragraf rata kanan-kiri", async ({ page }) => {
    await page.goto("/jurnal/nongsa-dan-mandat-1829");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nongsa dan Mandat 18 Desember 1829");
    await expect(page.locator(".bch-tulisan-byline")).toContainText("Redaksi Batam City Hall");
    await expect(page.locator(".bch-tulisan-byline time")).toHaveAttribute("datetime", "2026-11-05");
    await expect(page.locator(".bch-tulisan-byline time")).toContainText("5 November 2026");
    const p = page.locator(".bch-tulisan-isi p");
    expect(await p.count()).toBeGreaterThan(1);
    expect(await p.first().evaluate((el) => getComputedStyle(el).textAlign)).toBe("justify");
    // Narasi, bukan poin-poin.
    await expect(page.locator(".bch-tulisan-isi li")).toHaveCount(0);
  });
});

test.describe("Kartu Pos", () => {
  test("enam desain dan tombol Cetak", async ({ page }) => {
    await page.goto("/kartu-pos");
    await expect(page.getByRole("heading", { level: 1, name: "Kartu Pos" })).toBeVisible();
    await expect(page.locator('input[name="desain"]')).toHaveCount(6);
    await expect(page.getByRole("button", { name: "Cetak" })).toBeVisible();
  });

  test("pesan tampil di pratinjau dan memilih desain berpindah pilihan", async ({ page }) => {
    await page.goto("/kartu-pos");
    await page.getByRole("textbox", { name: "Pesan" }).fill("Ombak tenang, feri jalan.");
    await expect(page.locator(".kp-pratinjau")).toContainText("Ombak tenang, feri jalan.");
    const kedua = page.locator('input[name="desain"]').nth(1);
    await kedua.check();
    await expect(kedua).toBeChecked();
  });
});

test.describe("beranda dan peta", () => {
  test("tidak ada klaster berangka, panel Tempat tertutup saat awal", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".peta, .maplibregl-map").first()).toBeAttached({ timeout: 45_000 });
    await expect(page.locator('[class*="cluster"], [class*="klaster"]')).toHaveCount(0);
    await expect(page.locator("[data-panel-tempat]")).toHaveCount(0);
    const tombol = page.getByRole("button", { name: /^Tempat/ }).first();
    await expect(tombol).toHaveAttribute("aria-expanded", "false");
    await tombol.click();
    await expect(tombol).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-panel-tempat]")).toBeVisible();
  });

  test("peta tidak memakai sumber atau lapisan klaster", async ({ page }) => {
    await page.goto("/");
    const berkas = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((e) => e.name),
    );
    expect(berkas.filter((n) => /cluster|klaster/i.test(n))).toEqual([]);
  });
});

test.describe("tanpa luber horizontal", () => {
  for (const h of ["/cuaca/hujan", "/jalan/peta", "/cctv", "/makan/peta"]) {
    test(`${h} tidak meluber ke samping`, async ({ page }) => {
      await page.goto(h);
      await expect(page.locator("main")).toBeVisible();
      await page.waitForTimeout(1500);
      const { lebar, jendela } = await page.evaluate(() => ({
        lebar: document.documentElement.scrollWidth,
        jendela: window.innerWidth,
      }));
      expect(lebar, `scrollWidth ${lebar} > innerWidth ${jendela}`).toBeLessThanOrEqual(jendela);
    });
  }
});

test.describe("alamat lama dialihkan", () => {
  const PETA: [string, RegExp][] = [
    ["/cuaca/cctv", /\/cctv$/],
    ["/info/berita", /\/berita$/],
    ["/cerita/kalender", /\/things-to-do$/],
    ["/cerita/komunitas", /\/komunitas$/],
    ["/main/kartu-pos", /\/kartu-pos$/],
  ];
  for (const [dari, ke] of PETA) {
    test(`${dari} dialihkan`, async ({ page }) => {
      await page.goto(dari);
      await expect(page).toHaveURL(ke);
    });
  }

  test("/main, Vibe, dan Singapura atau Nagoya tidak ada lagi", async ({ request }) => {
    for (const h of ["/main/vibe", "/main/singapura-atau-nagoya"]) {
      const r = await request.get(h, { maxRedirects: 0 });
      expect([404, 307, 308], h).toContain(r.status());
      if (r.status() !== 404) {
        const t = await request.get(h);
        expect(t.url(), h).not.toMatch(/vibe|singapura/);
      }
    }
  });
});

test.describe("admin Jurnal", () => {
  test.skip(!SANDI, "Butuh ADMIN_MODE_CONTOH");

  test("masuk, buat tulisan, terbitkan, tampil di /jurnal/<alamat>", async ({ page }, info) => {
    const akhiran = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}${info.project.name}`;
    const slug = `uji-e2e-${akhiran}`;
    const judul = `Tulisan Uji ${akhiran}`;
    const kalimat = `Paragraf pertama untuk ${akhiran}.`;

    await page.goto("/admin/jurnal");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.locator("[data-admin-masuk]")).toBeVisible();

    await page.getByLabel("Judul", { exact: true }).fill(judul);
    await page.getByLabel("Alamat", { exact: true }).fill(slug);
    await page.getByLabel("Rubrik").fill("Uji");
    await page.getByLabel("Ringkasan").fill("Ringkasan uji otomatis.");
    await page.getByLabel("Isi", { exact: true }).fill(`${kalimat}\n\nParagraf kedua.`);
    await page.getByLabel("Terbitkan").check();
    await page.getByRole("button", { name: "Simpan dan Terbitkan" }).click();
    await expect(page.getByText("Tulisan terbit.")).toBeVisible({ timeout: 20_000 });

    await page.goto(`/jurnal/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(judul);
    await expect(page.locator(".bch-tulisan-isi")).toContainText(kalimat);
    await page.goto("/jurnal");
    await expect(page.getByText(judul)).toBeVisible();
  });
});

test.describe("koreksi terakhir", () => {
  test("paragraf rata kanan-kiri, label tetap rata kiri", async ({ page }) => {
    await page.goto("/jurnal/nongsa-dan-mandat-1829");
    const rata = (sel: string) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).textAlign);
    expect(await rata(".bch-tulisan-isi p")).toBe("justify");
    expect(await rata(".bch-tulisan-byline")).not.toBe("justify");
  });

  test("judul peta Cuaca terlihat di layar pertama", async ({ page }) => {
    for (const alamat of ["/cuaca/hujan", "/cuaca/gelombang", "/cctv"]) {
      await page.goto(alamat);
      const bawah = await page.locator("h1").first().evaluate((e) => e.getBoundingClientRect().bottom);
      expect(bawah).toBeLessThanOrEqual(page.viewportSize()?.height ?? 0);
    }
  });

  test("peta dasar gagal: ada pesan, bukan kosong", async ({ page }) => {
    await page.route("**/tiles/batam.pmtiles", (r) => r.fulfill({ status: 404, body: "" }));
    await page.goto("/cuaca/hujan");
    await expect(page.locator(".ll-peta-gagal")).toBeVisible({ timeout: 20_000 });
  });

  test("alamat lama Cuaca dialihkan", async ({ page }) => {
    for (const [lama, baru] of [
      ["/langit-laut/gempa", "/cuaca/gempa"],
      ["/langit-laut/peringatan", "/cuaca/peringatan"],
    ]) {
      await page.goto(lama);
      await expect(page).toHaveURL(new RegExp(`${baru}$`));
    }
  });

  test("satu tombol Saring di setiap lebar", async ({ page }) => {
    await page.goto("/makan/peta");
    await expect(page.getByRole("button", { name: /^Saring/ })).toHaveCount(1);
  });

  test("food court dan tempat makan saling tertaut", async ({ page }) => {
    await page.goto("/makan/tempat/nomnom-seafood");
    await expect(page.locator("[data-food-court-tautan]")).toHaveAttribute("href", "/makan/food-court#168-food-court");
    await page.goto("/makan/food-court");
    await expect(page.locator('[data-food-court="168-food-court"] a[href="/makan/tempat/nomnom-seafood"]')).toHaveCount(1);
  });
});

test.describe("dashboard Info Loker dan Makanan", () => {
  test.skip(!SANDI, "Butuh ADMIN_MODE_CONTOH");

  test("lowongan dari dashboard tampil di Info Loker", async ({ page }, info) => {
    const posisi = `Operator Uji ${Date.now().toString(36)}${info.project.name}`;
    await page.goto("/admin/loker");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.getByLabel("Posisi").fill(posisi);
    await page.getByLabel("Perusahaan").fill("PT Contoh Uji");
    await page.getByLabel("Lokasi").fill("Muka Kuning");
    await page.getByLabel("Cara Melamar").fill("Kirim surat lamaran.");
    await page.getByRole("button", { name: "Simpan Lowongan" }).click();
    await expect(page.getByText("Lowongan tampil di Info Loker.")).toBeVisible({ timeout: 20_000 });
    // Halaman publik memakai ISR: muat pertama sesudah revalidasi boleh masih basi.
    await expect(async () => {
      await page.goto("/loker");
      await expect(page.locator("[data-loker]").filter({ hasText: posisi })).toHaveCount(1, { timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
  });

  test("ubah tempat makan: kategori dan food court tersimpan, Terbitkan jujur saat belum tersambung", async ({ page }) => {
    await page.goto("/admin/makanan");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();
    await page.getByLabel("Tempat", { exact: true }).selectOption("golden-prawn-933");
    await expect(page.getByLabel("Nama", { exact: true })).toHaveValue("Golden Prawn 933");
    await page.getByLabel("Food Court", { exact: true }).selectOption("a2-food-court");
    await page.getByLabel("AYCE").check();
    await page.getByRole("button", { name: "Simpan Data" }).click();
    await expect(page.getByText("Tersimpan. Tayang setelah Terbitkan Perubahan.")).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: "Terbitkan Perubahan" }).click();
    await expect(page.getByText(/belum tersambung ke Railway/)).toBeVisible({ timeout: 20_000 });
    await page.getByLabel("Tempat", { exact: true }).selectOption("golden-prawn-933");
    await expect(page.getByLabel("Food Court", { exact: true })).toHaveValue("a2-food-court");
    await expect(page.getByLabel("AYCE")).toBeChecked();
  });

  test("food court baru dari dashboard bisa langsung dipilih tempat makan", async ({ page }, info) => {
    const nama = `Pujasera Uji ${Date.now().toString(36)} ${info.project.name}`;
    await page.goto("/admin/makanan");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();

    const fc = page.getByRole("form", { name: "Tambah atau Ubah Food Court" });
    await fc.getByLabel("Daftar Food Court").selectOption("nagoya-food-court");
    await expect(fc.getByLabel("Nama", { exact: true })).toHaveValue("Nagoya Food Court");
    await expect(fc.getByLabel("Tautan Sumber")).toHaveValue(/batamgems\.com/);

    await fc.getByLabel("Daftar Food Court").selectOption("__baru");
    await fc.getByLabel("Nama", { exact: true }).fill(nama);
    await fc.getByLabel("Kecamatan", { exact: true }).selectOption("Sekupang");
    await fc.getByLabel("Alamat", { exact: true }).fill("Jl. Uji Coba");
    await fc.getByLabel("Keterangan", { exact: true }).fill("Food court uji otomatis.");
    // Tanpa tautan sumber ditolak: data tanpa asal tidak boleh masuk.
    await fc.getByRole("button", { name: "Simpan Food Court" }).click();
    await expect(fc.getByLabel("Tautan Sumber")).toHaveJSProperty("validity.valueMissing", true);
    await fc.getByLabel("Tautan Sumber").fill("https://example.com/pujasera-uji");
    await fc.getByRole("button", { name: "Simpan Food Court" }).click();
    await expect(fc.getByText("Tersimpan. Tayang setelah Terbitkan Perubahan.")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("region", { name: "Perubahan Food Court" })).toContainText(nama);
    await expect(page.getByRole("button", { name: "Terbitkan Perubahan" })).toBeVisible();

    await page.getByLabel("Tempat", { exact: true }).selectOption("golden-prawn-933");
    await page.getByLabel("Food Court", { exact: true }).selectOption({ label: `${nama} (Baru)` });
    await page.getByRole("button", { name: "Simpan Data" }).click();
    await expect(page.getByText("Tersimpan. Tayang setelah Terbitkan Perubahan.").first()).toBeVisible({ timeout: 20_000 });
  });
});

test.describe("masukan 7 November", () => {
  test("isi tidak menempel di garis judul seksi", async ({ page }) => {
    for (const alamat of ["/", "/things-to-do", "/komunitas"]) {
      await page.goto(alamat);
      const jarak = await page.evaluate(() =>
        [...document.querySelectorAll("main .bch-judul-seksi + *, main .bch-judul-baris + *")]
          .filter((e) => e.getClientRects().length && getComputedStyle(e).borderTopWidth !== "0px")
          .map((e) => {
            const garis = e.getBoundingClientRect().top + parseFloat(getComputedStyle(e).borderTopWidth);
            // Isi pertama yang terlihat: teks atau kontrol, bukan kotak baris yang punya jarak di dalamnya.
            let atas = Infinity;
            const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
            for (let n = w.nextNode(); n; n = w.nextNode()) {
              if (n.nodeType === 3 && n.textContent?.trim()) {
                const rg = document.createRange();
                rg.selectNodeContents(n);
                for (const q of rg.getClientRects()) if (q.height) atas = Math.min(atas, q.top);
              } else if (n.nodeType === 1 && /^(INPUT|SELECT|BUTTON|IMG|svg)$/.test((n as Element).tagName) && (n as Element).getClientRects().length) {
                atas = Math.min(atas, (n as Element).getBoundingClientRect().top);
              }
            }
            return Number.isFinite(atas) ? atas - garis : 99;
          }),
      );
      expect(Math.min(...jarak), alamat).toBeGreaterThanOrEqual(6);
    }
  });

  test("Layanan Warga: tiap kategori Direktori punya logo", async ({ page }) => {
    await page.goto("/info");
    const baris = page.locator(".bch-kategori-ringkas li");
    const n = await baris.count();
    expect(n).toBeGreaterThan(5);
    await expect(page.locator(".bch-kategori-ringkas li a > span[aria-hidden='true'] svg")).toHaveCount(n);
  });

  test("newsletter di kaki situs mencatat email", async ({ page }) => {
    await page.goto("/tentang");
    const form = page.getByRole("form", { name: "Newsletter" });
    await form.getByLabel("Email").fill(`warga.${Date.now()}@contoh.id`);
    await form.getByRole("button", { name: "Langganan" }).click();
    await expect(form.getByText("Terima kasih. Alamat email tercatat.")).toBeVisible({ timeout: 20_000 });
  });

  test("Infografik: kisi poster dan halaman detail", async ({ page }) => {
    await page.goto("/infografik");
    await expect(page.getByRole("heading", { level: 1, name: "Infografik" })).toBeVisible();
    expect(await page.locator(".ig-kartu").count()).toBeGreaterThanOrEqual(5);
    await page.getByRole("link", { name: /Dari Sekitar 6\.000 Jiwa pada 1965/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Dari Sekitar 6.000 Jiwa pada 1965");
    await expect(page.locator(".ig-figur")).toContainText("1.394.459");
    await expect(page.locator(".ig-figur")).toContainText("1.296.960");
    await expect(page.getByRole("link", { name: /Batam dalam Angka/ })).toHaveAttribute("href", "/cerita/angka");
  });
});

test.describe("dashboard Infografik dan Newsletter", () => {
  test.skip(!SANDI, "Butuh ADMIN_MODE_CONTOH");

  test("infografik unggahan tampil di kisi dan punya teks alternatif", async ({ page }, info) => {
    const judul = `Infografik Uji ${Date.now().toString(36)} ${info.project.name}`;
    await page.goto("/admin/infografik");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();
    const form = page.getByRole("form", { name: "Infografik Baru" });
    await form.getByLabel("Judul", { exact: true }).fill(judul);
    await form.getByLabel("Rubrik", { exact: true }).fill("Uji");
    await form.getByLabel("Ringkasan", { exact: true }).fill("Ringkasan uji otomatis.");
    await form.locator(".bch-adm-unggah input[type=file]").setInputFiles("public/grafis/bagian/infografik.webp");
    await expect(form.locator(".bch-adm-pratinjau")).toBeVisible({ timeout: 20_000 });
    await form.getByLabel("Isi dalam Teks", { exact: true }).fill("Teks alternatif uji: tiga batang dan satu lingkaran.");
    await form.getByLabel("Terbitkan").check();
    await form.getByRole("button", { name: "Simpan dan Terbitkan" }).click();
    await expect(page.getByText("Infografik terbit.")).toBeVisible({ timeout: 20_000 });
    // Halaman detail dibangun dari data terbaru. Daftar memakai cache 5 menit, dan dua simpanan bersamaan dari
    // proyek desktop dan ponsel bisa saling mendahului, jadi tes membuka halamannya langsung.
    await page.goto(`/infografik/${judul.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(judul);
    await expect(page.locator(".ig-figur img")).toHaveAttribute("alt", "Teks alternatif uji: tiga batang dan satu lingkaran.");
  });

  test("pelanggan newsletter tampil di dashboard", async ({ page }, info) => {
    const email = `uji.${Date.now()}.${info.project.name}@contoh.id`;
    await page.goto("/kolofon");
    const form = page.getByRole("form", { name: "Newsletter" });
    await form.getByLabel("Email").fill(email);
    await form.getByRole("button", { name: "Langganan" }).click();
    await expect(form.getByText("Terima kasih. Alamat email tercatat.")).toBeVisible({ timeout: 20_000 });
    await page.goto("/admin/newsletter");
    await page.getByLabel("Kata sandi").fill(SANDI);
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.getByText(email)).toBeVisible();
    await expect(page.getByRole("button", { name: "Unduh CSV" })).toBeVisible();
  });
});
