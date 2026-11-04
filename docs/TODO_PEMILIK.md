# Yang perlu pemilik lakukan

Disusun 5 November 2026, akhir fase 10. Situs jalan di komputer ini, tetapi **belum di-deploy dan belum di-push**. Tidak ada satu pun yang menyentuh situs lama, DNS, atau Vercel.

## Supaya bisa tayang

1. **Remote Git dan Vercel.** Repo belum punya remote. Beri tahu nama repo dan proyek Vercel, atau izinkan membuatnya.
2. **Bucket aset** (Cloudflare R2 atau lain) untuk `public/tiles/batam.pmtiles` (46 MB, tidak ikut Git), lalu isi `NEXT_PUBLIC_PMTILES_URL`.
3. **Domain**, lalu isi `NEXT_PUBLIC_SITE_URL`.
4. **Uji sumber BMKG dari IP Vercel.** Header jujur sudah lolos dari PC ini, belum dari server Vercel. Kalau ditolak, ambil dari browser (CORS terbuka).
5. **URL donasi** bila sudah ada (`NEXT_PUBLIC_DONASI_URL`).

## Supaya formulir jalan

Tanpa Supabase, semua formulir (rekomendasi tukang, koreksi, foto lama) jujur menyatakan belum menerima kiriman.

1. Buat proyek Supabase dan jalankan `supabase/migrations/`. **Migrasi ini belum pernah dijalankan di Postgres sungguhan**, baru diuji dengan klien tiruan. Perkirakan ada yang perlu dibetulkan.
2. Matikan pendaftaran terbuka, buat akun moderator, isi `app_metadata.peran="moderator"`.
3. Isi tiga variabel Supabase di Vercel. Jangan isi sebagian: situs akan menutup formulir.
4. Isi tukang dari rekomendasi warga. Sengaja tidak ada data awal.

## Keputusan yang saya ambil dan bisa Anda ubah

| Hal | Sementara | Tempat mengubah |
|---|---|---|
| Tanggal "terakhir dicek" | "Belum dicek ulang sejak riset Nov 2026". Tidak ada tanggal yang dikarang | `teksDicek`, `features/direktori/data.ts` |
| Nama notaris dan PPAT | Tampil dalam kartu berlabel Beta | `features/direktori/KartuTempat.tsx` |
| Rating Google | Tidak tampil | `DATA_DECISIONS.md` |
| Kartu Rempang Eco-City di direktori | Minimal, tanpa label status | `kartuMinimal` |
| `/cerita/rempang` dan `/cerita/kampung-tua/legalitas` | Tayang berlabel draf | **Mohon dibaca dulu sebelum situs tayang** |
| Angka ±1.600 ha dan 1.450 sertifikat | Tidak tampil, dicatat di daftar butir yang disaring | `features/kampung-tua/` |
| Indikator "Aman nyebrang?" | **Tidak dibuat.** Soal keselamatan butuh ambang yang sah dan penafian syahbandar | - |
| Segmen mural pertama | Harbour Bay–Nagoya–Jodoh, bukan Barelang (alasan di `docs/MURAL.md`) | `docs/MURAL.md` |
| Quest 6 jembatan | Belum jalan: Jembatan IV, V, VI ada di segmen lain atau lokasinya bentrok | `docs/MURAL.md` |
| Tombol bahasa | Hanya di Makan, satu-satunya loket yang punya terjemahan | `features/makan/` |
| Label Makan | "Hits" jadi "Ramai", "Wajib Coba" jadi "Layak dikejar", "Hidden Gem" jadi "Agak tersembunyi", sesuai daftar hindari | `features/makan/lib/i18n.tsx` |

## Mohon dibaca sendiri

- `/cerita/rempang`, `/cerita/kampung-tua/legalitas`: topik paling sensitif.
- `/tentang`, `/kolofon`, `/privasi`, `/syarat`: privasi dan syarat berlabel draf, belum ditinjau ahli hukum.
- Dua kontak berbentuk nomor HP yang tidak jelas apakah kantor atau pribadi: `pub-kodaeral4` dan `perpus-jabalarafah`. Hapus kalau pribadi. Nomor HP kuliner dan jasa berasal dari listing usaha.
- Teks 中文 di Makan belum dibaca penutur. Label 中文 yang bernada promosi belum saya ubah.

## Boleh menyusul

1. **Koordinat.** `data/koordinat_perlu_diisi.csv` (urut prioritas) dan `data/trans_batam/halte_koordinat_perlu_diisi.csv`. Mulai dari halte: `data/trans_batam/halte_usulan_osm.csv` berisi 43 usulan dari OSM yang namanya cocok. Tinjau dulu, jangan langsung impor. Bisa juga lewat `/admin/koordinat`.
2. **Ilustrasi mural dan landmark**, kartu pos, ilustrator dan honornya. Keputusan soal AI untuk latar. Mural sekarang placeholder berlabel.
3. **Izin foto lama** (BP Batam, Museum). Belum ada foto yang tampil, semua lewat tautan arsip.
4. **Survei lapangan:** koordinat halte, pelantar, dan 16 terminal yang kosong. Konfirmasi ke UPT Trans Batam: daftar halte, headway, aturan transfer.
5. **Validasi kamus:** 35 entri berlabel belum divalidasi, dan sumber LAM atau Disbud untuk 6 tradisi.
6. **Duplikat kuliner:** `kedai-kopi-ameng` dan `kopi-ameng`, `kedai-kopi-harum-manis` dan `kopi-harum-manis`.
7. **Konflik data:** 63 konflik di `docs/KONFLIK_DATA.md`. Situs memakai nilai hasil penggabungan.
8. **Uji di HP Android dan iOS asli:** PWA, Web Share, "Di sekitarku", performa mural dan peta.
9. **Situs lama:** keduanya membalas HTTP 402 saat dicek 4 Nov 2026, cek akun Vercel. Paket pengalihan sudah siap di `deploy/situs-lama/`, dijalankan hanya atas izin Anda.
10. **Fitur yang ditunda** (alasan di `COVERAGE.md`): gempa, peringatan dini CAP, harga pangan Bapanas, panduan KTP pindahan, kontur GEBCO, notifikasi hujan, halaman "Batam yang hilang", Barelang scrollytelling, kuis tokoh.
