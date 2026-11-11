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
| Loket 01 sampai 07, halaman pendukung, admin | Semua jalan. Skor per halaman dan galeri rombak ada di `docs/KOREKSI.md`. Skor pemeriksaan bagian 7 per tahap ada di `docs/tampilan/skor/`, ringkasannya di `docs/KOREKSI.md` |
| Supabase | Migrasi dan store tertulis, belum pernah dijalankan sungguhan |
| Mural | Satu segmen placeholder, sisanya "segera" |
| Redirect situs lama | Siap di `deploy/situs-lama/`, belum dijalankan |
| `public/tiles/batam.pmtiles` | Di-gitignore, 46 MB. Kalau hilang: `node scripts/siapkan-peta.mjs` (unduh dari cabang `aset-peta`, cepat) atau `node scripts/extract-basemap.mjs` (kurang dari 30 menit) |
| Pratinjau | Tayang di https://batam.masbash.id, layanan Railway dari cabang `fase-1-fondasi`. Push ke cabang itu langsung men-deploy. `SITE_PRATINJAU=1`, jadi `robots.txt` menutup situs dari mesin pencari |
| Nama situs | Barelang.co sejak 11 Nov 2026 (sebelumnya Batam City Hall). Domain barelang.co belum dibeli; alamat situs tetap dari `NEXT_PUBLIC_SITE_URL`. Ikon situs huruf B dalam bingkai (`app/icon.svg`, `public/logo/monogram.svg`, PNG dari `node scripts/build-aset.mjs`) |
| Cabang lain | `paket-review` (bahan audit Claude Research), `aset-peta` (hanya `batam.pmtiles`). Keduanya orphan, jangan di-merge |
| Sesi cloud | Node di cloud butuh `NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` untuk menjangkau sumber data. Browser Playwright versi proyek tidak ada di cloud: pakai `executablePath: "/opt/pw-browsers/chromium"` lewat config lokal yang tidak di-commit |
| Tes | `npm test`; `npm run build` lalu `npx playwright test --workers=3 --timeout=90000`. Matikan dulu `next start` lama di port 3100. Di Windows, menghentikan tugas latar tidak ikut mematikan proses `node` anaknya: cek port dan matikan prosesnya sebelum build, karena server lama yang masih hidup saat build bisa menyajikan halaman versi lama |
| Gempa dan peringatan dini CAP | Jalan dengan data BMKG asli. `/api/gempa`, `/api/peringatan-cuaca`, `/cuaca/gempa`, `/cuaca/peringatan`, baris di kotak Hari Ini, poligon di radar |
| `docs/COVERAGE.md` | Tanpa `[ ]`. Butir `[-] ditunda` menyimpan syaratnya |
| `scripts/dev/build-coverage.mjs` | Jangan dijalankan lagi: akan menimpa centang |

## Langkah berikutnya

**Tayang vs lokal.** Situs tayang memakai commit `4343525`: nama Barelang.co dan ikon huruf B tayang sejak commit itu (11 Nov 2026). Domain barelang.co dibeli pemilik 11 Nov 2026 (DNS di Hostinger) dan sudah tersambung ke Railway dengan HTTPS. Pengalihan batam.masbash.id ke barelang.co ada di `next.config.ts`. www.barelang.co belum jalan karena batas domain paket Railway. `NEXT_PUBLIC_SITE_URL` di Railway harus `https://barelang.co`. Sebelumnya rombak menu, food court lewat dashboard, masukan 7 November (spasi, gelombang, kaki situs, Instagram, Infografik), titik wakil wilayah, koordinat 28 CCTV dan 12 food court dari pemilik, perbaikan legenda CCTV, penghapusan empat food court (kini 12, semuanya bertitik), serta titik tiga terminal luar Batam dan Batamindo sudah tayang. Peta Bus Trans Batam baru (`features/jalan/peta-bus`, mengikuti Peta Bus Batam CC BY 4.0) juga sudah tayang, begitu pula urutan halte koridor yang dilengkapi darinya; siluetnya dibuat ulang dengan `tools/grafis/siluet-peta-bus.py` dari PDF yang tidak disimpan di repo. Perbaikan hasil audit 8 November dan perbaikan CCTV di ponsel juga sudah tayang sejak `61b4f7d` (CCTV belum diuji di iPhone asli). Lapisan kepercayaan dari dokumen Batam Almanac (Standar Redaksi, Log Koreksi, Aksesibilitas, JSON-LD, RSS, `npm run check:rules`) sudah tayang sejak `7818d9f`; status per butir dan yang menunggu pemilik ada di `docs/ALMANAC.md`. Urutan menu baru (9 Nov) dan menu Dataset (`/dataset`, 938 dataset, data di `data/dataset/`) sudah tayang sejak `76b7e86`. Menu Beranda (ikon rumah di menu lebar, teks di menu ponsel) dan tiga modul beranda baru (Feri ke Singapura, Batam dalam Angka, Kata Hari Ini) sudah tayang sejak `8143b2c`. Kualitas Udara (`/cuaca/udara`, data Open-Meteo/CAMS) sudah tayang sejak `312d271`. Direktori diperbesar 3.423 tempat dari Overture (`data/tempat-terbuka.json`, `tools/overture/impor.py`) sudah tayang sejak `cb42695`. Purwarupa sampul beranda (peta isometrik selebar layar, menu di pita bawah, kepala normal nama situs di tengah; huruf dan warna tetap) juga sudah tayang sejak `cb42695` atas persetujuan pemilik, tetapi desainnya belum final; alatnya di PEDOMAN blok purwarupa. Peta sampulnya interaktif (geser, zoom, Jelajahi layar penuh) memakai ubin dummy Harbour Bay; peta final Barelang perlu penyimpanan ubin terpisah. Perbandingan dengan batam.co.id dan fitur yang layak ditiru: `research/18-batam-co-id.md`. Riset enam portal data dan arsip `dataset-arsip/` (tidak ikut repo) dijelaskan di `docs/DATASET.md`, termasuk keputusan yang masih menunggu pemilik (izin pakai ulang, kunci BPS, temuan privasi HANG JEBAT). Yang menyusul: terjemahan Inggris dan penyambungan Supabase. Push ke `fase-1-fondasi` langsung men-deploy.

Rencana dan statusnya: `docs/RENCANA-ROMBAK.md`. Temuan audit: `docs/AUDIT.md`. Yang menunggu pemilik: `docs/TODO_PEMILIK.md`.

Yang tersisa:

1. **Koordinat.** Pemilik mengisi `data/koordinat_perlu_diisi.xlsx`. Masukkan dengan `python tools/impor_lembar_koordinat.py <berkas>`, butuh `pip install openpyxl`. Coba dulu dengan `--coba`. Buat ulang lembarnya dengan `tools/buat_lembar_koordinat.py`, butuh `xlsxwriter`.
2. **Dashboard.** Kode `/admin` teruji di mode contoh. Perlu proyek Supabase (menunggu izin pemilik), migrasi di `supabase/migrations/`, tiga variabel di Railway, dan satu akun dengan `app_metadata.peran = moderator`. Sesudah itu uji `features/konten/store-supabase.ts` melawan basis data sungguhan, karena belum pernah dijalankan.
3. **Kategori Makanan kosong:** Makanan Sulawesi, Pempek, Makanan Jepang, Makanan Korea, Western dan Steak, Ice Cream, Vegetarian. Tempat ditambah lewat `/admin/makanan`, jangan dikarang.
4. **Data ganda:** `rs-bpbatam` dan `kes-rs-bp-batam` tampaknya rumah sakit yang sama. Belum digabung, menunggu pemilik.
5. **Mode uji lokal:** tes e2e butuh build dengan `NEXT_PUBLIC_MODE_CONTOH=1`, karena tautan formulir hanya tampil bila `KIRIMAN_AKTIF`. Server juga dijalankan dengan `NEXT_PUBLIC_MODE_CONTOH=1 ADMIN_MODE_CONTOH=uji-e2e`, karena mode kiriman dibaca saat jalan. Arahkan tes ke server itu dengan `E2E_URL=http://localhost:<port> ADMIN_MODE_CONTOH=uji-e2e npx playwright test`. Variabel `PORT` tidak dibaca: tanpa `E2E_URL`, Playwright menyalakan server sendiri di 3100 tanpa mode contoh, dan tes Newsletter gagal dengan Formulir ini belum aktif.

Jalankan e2e dengan `npx playwright test --workers=4 --timeout=60000`. Satu pekerja terlalu lambat.

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
