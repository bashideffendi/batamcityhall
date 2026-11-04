# CHANGELOG

## 2026-11-04 · Fase 1 selesai menurut kriteria PLAN (build lulus, peta tampil di dua tema)

- Lingkungan: Node.js 26.13 LTS, Git 2.56, Python 3.13 dipasang lewat winget di PC pemilik. Repo di `Desktop\batam-city-hall`, cabang `fase-1-fondasi`, belum ada commit.
- `features/peta/`: `PetaLaut` (MapLibre + protokol pmtiles, terkunci di bbox, gestur kooperatif), `style.ts` (siang/malam, hanya warna token), `graticule.ts` + `TepiChart` (graticule 1′/5′, strip koordinat, garis 1°N), `skala.ts` + `OrnamenChart` (kartusis, mawar angin, skala batang km dan mil laut), `ItikBerbaris`.
- Singapura-Johor dan Bintan tampil sebagai siluet: selubung warna darat di atas jalan, di bawah air (`LUAR_FOKUS`).
- Halaman: `/` (peta + daftar loket), `/tentang`, `/kolofon`, 404. Beranda hanya menautkan loket di `LOKET_DIBUKA`, yang saat ini kosong.
- Aset: `scripts/build-aset.mjs` membuat `public/tex/grain-256*.webp` (prosedural, 14,9 KB) dan `app/apple-icon.png`. `app/icon.svg` digambar di grid 16 px supaya terbaca; `public/logo/monogram.svg` versi vektor. `components/site/Emblem.tsx`.
- Tes: Vitest (`tests/unit`) dan Playwright + axe (`tests/e2e`, profil desktop dan HP).
- Perbaikan yang baru ketahuan setelah dijalankan: worker MapLibre 6 tidak ketemu setelah dibundel (`setWorkerUrl`), wadah peta bertinggi 0 karena CSS MapLibre, tautan loket pertama terpotong (`safe center`), prefetch ke route yang belum ada, tanda siap yang menunggu `idle` sehingga ornamen tertahan saat peta digeser, offset waterlining terbalik, warna flavor Protomaps yang lolos dari token, ikon sprite yang tidak ada.
- `scripts/extract-basemap.mjs` terbukti jalan dan menerima argumen keluaran. Tema membaca dari `<html>` lewat `useSyncExternalStore`.
- Sementara: `features/makan` dan `features/langit-laut/components` dikeluarkan dari tsconfig dan ESLint sampai di-port di fase 2.
- Route BMKG (`/api/ofs-frame`, `/api/perairan`) hanya dikompilasi, tidak pernah dijalankan.

## 2026-11-04 · Persiapan dan awal fase 1 (belum selesai, belum pernah di-build)

- Paket handoff dipasang sebagai repo. README paket dipindah ke `docs/PAKET_HANDOFF.md`.
- Riset 01–16 dibaca lima subagen; hasilnya `docs/brief/` dan `docs/coverage-parts/`, dirakit menjadi `docs/COVERAGE.md`.
- `docs/PLAN.md`, `docs/PARITAS.md`, `docs/DATA_DECISIONS.md` ditulis.
- Kode lama disalin dan import-nya ditulis ulang, belum di-port:
  - hujandibatam `45281a64de5fe068de9d95b9bbc73ba4eb5af4db` → `features/langit-laut/`, `app/api/`, `data/wilayah/kecamatan-kepri.geojson`, `scripts/build-kecamatan.mjs`, `scripts/cctv-audit.sh`
  - batam-bites `85905410a7a1f1e42e0b43f19e72b144cf384249` → `features/makan/`, `data/makan/`
- Konfigurasi Next.js 16, TypeScript, ESLint, Prettier, Tailwind 4.
- Layout, strip navigasi, menu HP, footer wajib, tema siang/malam, tombol Gerak.
- Validasi data zod: lulus untuk 21 berkas dan 775 tempat.
- Glyph peta dibangun ke `public/glyphs/`.
- `features/peta/style.ts` dan `scripts/extract-basemap.mjs` ditulis, belum diuji.
