# LANJUTKAN: titik henti 5 November 2026, akhir fase 3

Untuk sesi Claude Code berikutnya. Semua yang perlu diketahui ada di repo. Komunikasi dengan pemilik proyek dalam Bahasa Indonesia.

Pemilik proyek ingin cukup memberikan file, tanpa langkah teknis. Kerjakan sendiri persiapannya dan jangan memintanya mengetik perintah. Ajukan pertanyaan yang benar-benar perlu saja, satu daftar pendek.

## Baca dulu, urut

1. `docs/LANJUTKAN.md` (ini)
2. `CLAUDE_CODE_PROMPT.md`: spesifikasi lengkap
3. `research/00-keputusan-percakapan.md`: keputusan pemilik, menang bila konflik
4. `docs/PLAN.md`, `docs/DATA_DECISIONS.md`, `docs/PARITAS.md`
5. `docs/brief/NN.md`: baca brief yang relevan sebelum mengerjakan fasenya

Brief ditulis subagen yang membaca laporan sampai habis. Isinya ringkasan, bukan bukti: untuk angka, tanggal, dan topik sensitif, cek ke `research/NN`.

## Keadaan repo

Folder `Desktop\batam-city-hall`, cabang `fase-1-fondasi`, belum ada remote dan belum di-push. Git di PC ini belum punya identitas global; commit memakai `bashideffendi <bashide@gmail.com>` lewat `git -c`. Node.js 26.13, Git 2.56, Python 3.13, dan Chromium Playwright terpasang di PC pemilik.

| Bagian | Keadaan |
|---|---|
| `/`, `/tentang`, `/kolofon`, 404, PWA, galat | Selesai. Hari Ini belum punya feri terakhir (fase 4) |
| `/langit-laut` | Port selesai, jalan dengan sumber asli. Rincian bukti di `PARITAS.md` |
| `/makan` | Port selesai. Satu butir ◐: tombol bahasa situs belum ada |
| `/info`, direktori, kartu tempat, darurat, urusan tanah, bantuan hukum | Selesai untuk data yang ada. Sisa di `PLAN.md` |
| Pin dan radar di peta beranda | Selesai. Lapisan dibangun di `features/peta/lapisan.ts` |
| `public/tiles/batam.pmtiles` | Di-gitignore, 46 MB. Kalau hilang, jalankan `node scripts/extract-basemap.mjs` (kurang dari 30 menit) |
| Tes | `npm test`; `npm run build` lalu `npm run test:e2e` |
| `docs/COVERAGE.md` | Baru sebagian dicentang. Sisa F1 dan F2 ada di `PLAN.md` |
| `scripts/dev/build-coverage.mjs` | Jangan dijalankan lagi: COVERAGE sudah mulai dicentang |

## Langkah berikutnya: fase 4

1. Baca brief `09` dan `10`: Trans Batam, feri, pompong.
2. Sambungkan feri terakhir ke Hari Ini dan detail Makan.
3. Perbarui `COVERAGE.md`, `PARITAS.md`, `CHANGELOG.md` di akhir fase. Build dan tes harus lulus.

## Yang perlu diingat

- **Header BMKG harus tetap jujur** (`BMKG_HEADERS`). Permintaan yang menyamar sebagai browser ditolak auto mode Claude Code (`Bot Check Circumvention`); jangan mengakalinya. `tests/unit/langit-laut.test.ts` menjaganya. Belum terbukti dari IP Vercel: kalau ditolak, ambil langsung dari browser.
- **Situs lama mati:** hujandibatam dan batam-bites membalas HTTP 402 sejak setidaknya 4 Nov 2026. Clone repo dan jalankan lokal untuk perbandingan; ganti dulu header BMKG di clone.
- **Jangan biarkan tes memanggil MSS atau BMKG:** tiru `/api/*` di e2e.
- **Unduhan `pmtiles.exe` juga ditolak** auto mode, tanpa alasan tertulis. Karena itu ada `scripts/extract-basemap.mjs`.
- **Situs lama jangan disentuh:** tidak ada push, deploy, DNS, atau Vercel tanpa izin eksplisit.
- **Commit dan push hanya bila pemilik meminta.**
- **Jangan menebak koordinat, jangan mengarang data, jangan ada data pajak.**
- Kode lama bisa di-clone ulang untuk referensi dan uji paritas: `github.com/bashideffendi/hujandibatam` dan `github.com/bashideffendi/batam-bites`.
- Next.js 16 berbeda dari ingatan lama (mis. `proxy.md` di samping `middleware.md`). Baca `node_modules/next/dist/docs/` sebelum menulis fitur baru.
- CSS MapLibre dimuat belakangan dan bisa menimpa gaya wadah peta; naikkan spesifisitas bila perlu.
- Lapisan fitur di peta berawalan `ll-` supaya bertahan saat tema berganti (`lib/peta-lapisan.ts`). Peta beranda memakai `lp-` dan membangun ulang seluruh gaya (`features/peta/lapisan.ts`).
- **`places.json` tidak aman ditampilkan mentah:** `catatan` dan `atribut` memuat catatan kerja dan rating. Lewat `catatanPublik` dan `atributPublik`.
- Tiruan `/api/prakiraan` di e2e harus 503, bukan `{}`: Langit & Laut menganggap respons 200 berbentuk lengkap.
- Satu tes tema di `situs.spec.ts` pernah gagal sekali saat seluruh suite jalan dengan 4 worker, lalu lulus sendirian 3 kali dan lulus di suite penuh dengan 3 worker. Pakai `--workers=3`.
- Di Windows, backslash dalam heredoc Bash bisa berubah. Tulis skrip dengan alat tulis file. Path zip bisa melewati batas 260 karakter kalau diekstrak ke folder sementara yang dalam.
