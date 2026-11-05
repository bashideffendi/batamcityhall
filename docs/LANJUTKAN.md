# LANJUTKAN: titik henti 5 November 2026, pedoman diterapkan

Untuk sesi Claude Code berikutnya. Semua yang perlu diketahui ada di repo. Komunikasi dengan pemilik proyek dalam Bahasa Indonesia.

Pemilik proyek ingin cukup memberikan file, tanpa langkah teknis. Kerjakan sendiri persiapannya dan jangan memintanya mengetik perintah. Ajukan pertanyaan yang benar-benar perlu saja, satu daftar pendek.

## Baca dulu, urut

1. `docs/LANJUTKAN.md` (ini)
2. `docs/PEDOMAN.md`: bahasa, naskah, tampilan, dan peta. Menang atas semua dokumen lain
3. `CLAUDE_CODE_PROMPT.md`: spesifikasi lengkap
4. `research/00-keputusan-percakapan.md`: keputusan pemilik, menang bila konflik selain dengan pedoman
5. `docs/PLAN.md`, `docs/DATA_DECISIONS.md`, `docs/PARITAS.md`
6. `docs/brief/NN.md`: baca brief yang relevan sebelum mengerjakan fasenya

Brief ditulis subagen yang membaca laporan sampai habis. Isinya ringkasan, bukan bukti: untuk angka, tanggal, dan topik sensitif, cek ke `research/NN`.

## Keadaan repo

Folder `C:\proyek\batamcityhall` (salinan lama `Desktop\batam-city-hall` tertinggal di `e30ba62`, jangan dipakai), cabang `fase-1-fondasi`, remote `origin` = `github.com/bashideffendi/batamcityhall` (publik atas pilihan pemilik, 5 Nov 2026). Tayang di Railway. Git di PC ini belum punya identitas global; commit memakai `bashideffendi <bashide@gmail.com>` lewat `git -c`. Node.js 26.13, Git 2.56, Python 3.13, dan Chromium Playwright terpasang di PC pemilik.

| Bagian | Keadaan |
|---|---|
| Loket 01 sampai 07, halaman pendukung, admin | Semua jalan. Skor pemeriksaan bagian 7 per tahap ada di `docs/tampilan/skor/`, ringkasannya di `docs/KOREKSI.md` |
| Supabase | Migrasi dan store tertulis, belum pernah dijalankan sungguhan |
| Mural | Satu segmen placeholder, sisanya "segera" |
| Redirect situs lama | Siap di `deploy/situs-lama/`, belum dijalankan |
| `public/tiles/batam.pmtiles` | Di-gitignore, 46 MB. Kalau hilang: `node scripts/siapkan-peta.mjs` (unduh dari cabang `aset-peta`, cepat) atau `node scripts/extract-basemap.mjs` (kurang dari 30 menit) |
| Pratinjau | Tayang di https://batam.masbash.id, layanan Railway dari cabang `fase-1-fondasi`. Push ke cabang itu langsung men-deploy. `SITE_PRATINJAU=1`, jadi `robots.txt` menutup situs dari mesin pencari |
| Cabang lain | `paket-review` (bahan audit Claude Research), `aset-peta` (hanya `batam.pmtiles`). Keduanya orphan, jangan di-merge |
| Sesi cloud | Node di cloud butuh `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` untuk menjangkau sumber data. Browser Playwright versi proyek tidak ada di cloud: pakai `executablePath: "/opt/pw-browsers/chromium"` lewat config lokal yang tidak di-commit |
| Tes | `npm test`; `npm run build` lalu `npx playwright test --workers=3 --timeout=90000`. Matikan dulu `next start` lama di port 3100 |
| Gempa dan peringatan dini CAP | Jalan dengan data BMKG asli. `/api/gempa`, `/api/peringatan-cuaca`, `/cuaca/gempa`, `/cuaca/peringatan`, baris di kotak Hari Ini, poligon di radar |
| `docs/COVERAGE.md` | Tanpa `[ ]`. Butir `[-] ditunda` menyimpan syaratnya |
| `scripts/dev/build-coverage.mjs` | Jangan dijalankan lagi: akan menimpa centang |

## Langkah berikutnya

Urutan mengikuti bagian 8 `docs/PEDOMAN.md`. Pemilik meminta skor bagian 7 per halaman dilaporkan setelah tiap tahap. Skor tercatat di `docs/tampilan/skor/`, terakhir `07-tahap7`: 53 halaman, 53 lolos.

**Tayang vs lokal.** Situs tayang memakai commit `aa7026f` (koreksi "loket" dan Tahap 7), di-push atas izin pemilik pada 5 Nov 2026. Commit sesudahnya hanya ada di lokal sampai pemilik meminta push lagi. Izin deploy tidak berlaku untuk deploy berikutnya.

Sisa pekerjaan:

1. **Tahap 7:** selesai. `lib/cache-respons.ts` di 8 route, ikon situs, dan CSS tak terpakai sudah tayang. Skor `07-tahap7` sudah dilaporkan. Butir 9 di `/` berasal dari kolom cari Peta Tempat yang memang di bawah Hari Ini sesuai 3.2.
2. **Aksesibilitas:** selesai di lokal. Axe 56 halaman, dua tema, dua lebar: 0 temuan. Penyebab utamanya token status tanpa versi tema gelap.
3. **Tes e2e:** banyak selektor dan teks tes masih milik tampilan lama. Putaran desktop yang dihentikan di tengah: 245 lulus, 94 gagal, dan itu sebelum koreksi "loket". Yang perlu ditulis ulang antara lain:
   - `tests/e2e/jalan.spec.ts`: Feri Terakhir kini tabel; `.jl-feri-rute` dan "Sekarang" tidak ada lagi; kotak `.bch-hari-ini` tidak ada lagi.
   - `tests/e2e/direktori.spec.ts`: `.bch-grid .bch-card` menjadi `.bch-baris`, `.bch-sub-nav` menjadi `.bch-saring-baris`, jumlah kategori kini hanya angka.
   - `tests/e2e/makan.spec.ts`: `a.bch-card` untuk jalur dan beranda Makan.
   - `tests/e2e/kampung-tua.spec.ts`, `berita.spec.ts`, `situs.spec.ts`, `langit-laut.spec.ts`: judul lama, ornamen peta, alamat `/langit-laut`, teks "Loket".
   - Tes mural boleh dilewati (pedoman 8.5).
   - Jalankan dengan `npx playwright test --workers=4 --timeout=60000`. Satu pekerja terlalu lambat.
4. **Tahap 8:** galeri screenshot desktop dan ponsel, skor semua halaman, `docs/KOREKSI.md` (halaman, skor sebelum, skor sesudah, perubahan utama), lalu periksa syarat selesai 8.1.
5. **Keputusan pemilik:** daftarnya di `docs/TODO_PEMILIK.md`.

Catatan tentang skor: butir 9 di `/cuaca/gelombang` dan `/cuaca/cctv` salah deteksi. Judulnya terlihat di lembar bawah ponsel, tetapi panel sempat terbuka saat skrip mengukur.

## Yang perlu diingat

- **Header BMKG harus tetap jujur** (`BMKG_HEADERS`). Permintaan yang menyamar sebagai browser ditolak auto mode Claude Code (`Bot Check Circumvention`); jangan mengakalinya. `tests/unit/langit-laut.test.ts` menjaganya. Belum terbukti dari IP Vercel: kalau ditolak, ambil langsung dari browser.
- **Gempa dan CAP belum pernah melihat kasus langka di data asli:** pesan CAP `Update` dan `Cancel`, dan kalimat `Potensi` yang benar-benar menyebut tsunami. Aturannya mengikuti standar CAP dan kata yang dipakai BMKG; cek ulang saat pertama kali muncul.
- **`data.bmkg.go.id` gagal lewat curl di Windows** (galat TLS schannel) tetapi lolos lewat Node. Uji sumber itu dengan Node.
- **Clone di folder yang dalam** butuh `git clone -c core.longpaths=true`. Di folder sesi Claude desktop, clone biasa gagal "Filename too long".
- **Situs lama mati:** hujandibatam dan batam-bites membalas HTTP 402 sejak setidaknya 4 Nov 2026. Clone repo dan jalankan lokal untuk perbandingan; ganti dulu header BMKG di clone.
- **Jangan biarkan tes memanggil MSS atau BMKG:** tiru `/api/*` di e2e.
- **Unduhan `pmtiles.exe` juga ditolak** auto mode, tanpa alasan tertulis. Karena itu ada `scripts/extract-basemap.mjs`.
- **Situs lama jangan disentuh:** tidak ada push, deploy, DNS, atau Vercel tanpa izin eksplisit.
- **Push hanya bila pemilik meminta.** Pemilik mengizinkan commit lokal tanpa bertanya (5 Nov 2026). Push, deploy, dan situs lama tetap perlu izin yang menyebutnya langsung.
- **Jangan menebak koordinat, jangan mengarang data, jangan ada data pajak.**
- Kode lama bisa di-clone ulang untuk referensi dan uji paritas: `github.com/bashideffendi/hujandibatam` dan `github.com/bashideffendi/batam-bites`.
- Next.js 16 berbeda dari ingatan lama (mis. `proxy.md` di samping `middleware.md`). Baca `node_modules/next/dist/docs/` sebelum menulis fitur baru.
- CSS MapLibre dimuat belakangan dan bisa menimpa gaya wadah peta; naikkan spesifisitas bila perlu.
- Lapisan fitur di peta berawalan `ll-` supaya bertahan saat tema berganti (`features/langit-laut/lib/peta-lapisan.ts`). Penanda gaya A ada di `features/peta/LapisanTempat.tsx` dan `gambar-penanda.ts`, gambarnya dimuat lewat `styleimagemissing`.
- **`places.json` tidak aman ditampilkan mentah:** `catatan` dan `atribut` memuat catatan kerja dan rating. Lewat `catatanPublik` dan `atributPublik`.
- Tiruan `/api/prakiraan` di e2e harus 503, bukan `{}`: Langit & Laut menganggap respons 200 berbentuk lengkap.
- Balapan tema (`situs.spec.ts`, mengikuti prefers-color-scheme) sudah dibetulkan: `followSystemTheme` menyamakan tema sekali saat dipasang.
- Di Windows, backslash dalam heredoc Bash bisa berubah. Tulis skrip dengan alat tulis file. Path zip bisa melewati batas 260 karakter kalau diekstrak ke folder sementara yang dalam.
