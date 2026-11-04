# LANJUTKAN: titik henti 4 November 2026, akhir fase 1

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

Folder `Desktop\batam-city-hall`, cabang `fase-1-fondasi`, belum ada commit. Node.js 26.13, Git 2.56, Python 3.13, dan Chromium Playwright terpasang di PC pemilik.

| Bagian | Keadaan |
|---|---|
| `features/peta/`, `app/page.tsx`, `/tentang`, `/kolofon`, 404, `public/tex/`, ikon, emblem | Selesai dan teruji di dua tema, desktop dan HP |
| `public/tiles/batam.pmtiles` | Di-gitignore. Kalau hilang, jalankan `node scripts/extract-basemap.mjs` (sekitar 30 menit, hasil 39 MB) |
| `tests/unit`, `tests/e2e` | `npm test`; `npm run build` lalu `npm run test:e2e` |
| `lib/data/schema.ts`, `scripts/validate-data.ts`, `public/glyphs/` | Jalan |
| `docs/COVERAGE.md` | 61 butir `[x]`, 22 `[-]`. 108 butir `{F1}` masih `[ ]`, kelompoknya di `PLAN.md` |
| `docs/PARITAS.md` | Semua masih ☐. Perlu dilengkapi dari sisa kode lama |
| `features/langit-laut/`, `features/makan/`, `app/api/` | Disalin, import ditulis ulang, belum di-port. Dikeluarkan dari ESLint dan sebagian dari tsconfig; lihat `PLAN.md` |
| `features/makan/pages-asal/` | Halaman asli batam-bites sebagai bahan port. Hapus setelah `/makan` selesai |
| `scripts/build-kecamatan.mjs` | Path masih path lama (`data/kecamatan-kepri.geojson`, `lib/...`). Sesuaikan ke `data/wilayah/` dan `features/langit-laut/lib/` |
| `scripts/dev/build-coverage.mjs` | Jangan dijalankan lagi: COVERAGE sudah mulai dicentang |

## Langkah berikutnya: fase 2

1. Tanyakan PLAN butir 1 (header BMKG) sebelum menyentuh `/api/ofs-frame` dan `/api/perairan`.
2. Lengkapi `PARITAS.md` dari kode lama.
3. Port komponen yang terikat Leaflet ke MapLibre: `RadarMap`, `MapController`, `OfsField`, `LandMask`, `KecamatanLayer`, `CctvLayer`, dan di Makan `MapCanvas`, `TrailMap`, `MiniMap`. Juga selektor `.leaflet-*` di `langit-laut.css` dan paket `leaflet.vectorgrid`. Sisanya (`lib/`, `hooks/`, `components/panel/`, `CctvPlayer`) mestinya bisa dipakai hampir apa adanya. Lihat tabel CORS di `PLAN.md`.
4. Saat modul pindah: keluarkan dari ignore ESLint dan exclude tsconfig, lalu tambahkan nomornya ke `LOKET_DIBUKA` di `lib/site.ts`. Prefetch dan tautan beranda mengikuti daftar itu. Lint `features/makan/lib` sudah diketahui punya 3 galat `set-state-in-effect`.
5. Perbarui `COVERAGE.md`, `PARITAS.md`, `CHANGELOG.md` di akhir tiap fase. Build dan tes harus lulus.

## Yang perlu diingat

- **Dua route BMKG belum boleh dijalankan.** `app/api/ofs-frame/route.ts` dan `app/api/perairan/route.ts` masih membawa header dari situs lama: User-Agent Chrome dan Referer BMKG. Saat dicoba dari shell, permintaan seperti itu ditolak auto mode Claude Code (`Bot Check Circumvention`). Menunggu jawaban pemilik (PLAN butir 1). Jangan mengakalinya; uji dengan data tiruan. Tile OFS boleh dicek dari browser saat aplikasi jalan, karena itu permintaan browser biasa seperti situs lama.
- **Unduhan `pmtiles.exe` juga ditolak** auto mode, tanpa alasan tertulis. Karena itu ada `scripts/extract-basemap.mjs`.
- **Situs lama jangan disentuh:** tidak ada push, deploy, DNS, atau Vercel tanpa izin eksplisit.
- **Commit dan push hanya bila pemilik meminta.**
- **Jangan menebak koordinat, jangan mengarang data, jangan ada data pajak.**
- Kode lama bisa di-clone ulang untuk referensi dan uji paritas: `github.com/bashideffendi/hujandibatam` dan `github.com/bashideffendi/batam-bites`.
- Next.js 16 berbeda dari ingatan lama (mis. `proxy.md` di samping `middleware.md`). Baca `node_modules/next/dist/docs/` sebelum menulis fitur baru.
- CSS MapLibre dimuat belakangan dan bisa menimpa gaya wadah peta; naikkan spesifisitas bila perlu.
- Di Windows, backslash dalam heredoc Bash bisa berubah. Tulis skrip dengan alat tulis file. Path zip bisa melewati batas 260 karakter kalau diekstrak ke folder sementara yang dalam.
