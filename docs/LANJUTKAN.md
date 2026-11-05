# LANJUTKAN: titik henti 5 November 2026, akhir fase 10

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

Folder `Desktop\batam-city-hall`, cabang `fase-1-fondasi`, remote `origin` = `github.com/bashideffendi/batamcityhall` (publik atas pilihan pemilik, 5 Nov 2026). Belum di-deploy. Git di PC ini belum punya identitas global; commit memakai `bashideffendi <bashide@gmail.com>` lewat `git -c`. Node.js 26.13, Git 2.56, Python 3.13, dan Chromium Playwright terpasang di PC pemilik.

| Bagian | Keadaan |
|---|---|
| Loket 01 sampai 07, halaman pendukung, admin | Semua jalan di komputer ini, belum di-deploy |
| Supabase | Migrasi dan store tertulis, belum pernah dijalankan sungguhan |
| Mural | Satu segmen placeholder, sisanya "segera" |
| Redirect situs lama | Siap di `deploy/situs-lama/`, belum dijalankan |
| `public/tiles/batam.pmtiles` | Di-gitignore, 46 MB. Kalau hilang, jalankan `node scripts/extract-basemap.mjs` |
| Tes | `npm test`; `npm run build` lalu `npx playwright test --workers=3 --timeout=90000`. Matikan dulu `next start` lama di port 3100 |
| `docs/COVERAGE.md` | Tanpa `[ ]`. Butir `[-] ditunda` menyimpan syaratnya |
| `scripts/dev/build-coverage.mjs` | Jangan dijalankan lagi: akan menimpa centang |

## Langkah berikutnya

Tergantung pemilik: lihat `docs/TODO_PEMILIK.md`. Tanpa masukan pemilik, yang bisa dikerjakan: butir `[-] ditunda` yang syaratnya hanya riset (gempa, peringatan dini CAP, halaman Batam yang hilang), dan membetulkan temuan saat Supabase mulai dijalankan.

## Yang perlu diingat

- **Header BMKG harus tetap jujur** (`BMKG_HEADERS`). Permintaan yang menyamar sebagai browser ditolak auto mode Claude Code (`Bot Check Circumvention`); jangan mengakalinya. `tests/unit/langit-laut.test.ts` menjaganya. Belum terbukti dari IP Vercel: kalau ditolak, ambil langsung dari browser.
- **Situs lama mati:** hujandibatam dan batam-bites membalas HTTP 402 sejak setidaknya 4 Nov 2026. Clone repo dan jalankan lokal untuk perbandingan; ganti dulu header BMKG di clone.
- **Jangan biarkan tes memanggil MSS atau BMKG:** tiru `/api/*` di e2e.
- **Unduhan `pmtiles.exe` juga ditolak** auto mode, tanpa alasan tertulis. Karena itu ada `scripts/extract-basemap.mjs`.
- **Situs lama jangan disentuh:** tidak ada push, deploy, DNS, atau Vercel tanpa izin eksplisit.
- **Push hanya bila pemilik meminta.** Pemilik mengizinkan commit lokal tanpa bertanya (5 Nov 2026). Push, deploy, dan situs lama tetap perlu izin yang menyebutnya langsung.
- **Jangan menebak koordinat, jangan mengarang data, jangan ada data pajak.**
- Kode lama bisa di-clone ulang untuk referensi dan uji paritas: `github.com/bashideffendi/hujandibatam` dan `github.com/bashideffendi/batam-bites`.
- Next.js 16 berbeda dari ingatan lama (mis. `proxy.md` di samping `middleware.md`). Baca `node_modules/next/dist/docs/` sebelum menulis fitur baru.
- CSS MapLibre dimuat belakangan dan bisa menimpa gaya wadah peta; naikkan spesifisitas bila perlu.
- Lapisan fitur di peta berawalan `ll-` supaya bertahan saat tema berganti (`lib/peta-lapisan.ts`). Peta beranda memakai `lp-` dan membangun ulang seluruh gaya (`features/peta/lapisan.ts`).
- **`places.json` tidak aman ditampilkan mentah:** `catatan` dan `atribut` memuat catatan kerja dan rating. Lewat `catatanPublik` dan `atributPublik`.
- Tiruan `/api/prakiraan` di e2e harus 503, bukan `{}`: Langit & Laut menganggap respons 200 berbentuk lengkap.
- Satu tes tema di `situs.spec.ts` pernah gagal sekali saat seluruh suite jalan dengan 4 worker, lalu lulus sendirian 3 kali dan lulus di suite penuh dengan 3 worker. Pakai `--workers=3`.
- Di Windows, backslash dalam heredoc Bash bisa berubah. Tulis skrip dengan alat tulis file. Path zip bisa melewati batas 260 karakter kalau diekstrak ke folder sementara yang dalam.
