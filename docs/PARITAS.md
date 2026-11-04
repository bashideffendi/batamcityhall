# PARITAS situs lama

Setiap butir harus ✔ di Batam City Hall sebelum situs lama dialihkan. Semua masih ☐. Daftar awal dari bagian 4.0 prompt, dilengkapi dari kode yang sudah dibaca. **Lengkapi lagi** saat membaca sisa kode (`features/langit-laut/components/CctvPlayer.tsx`, `lib/status.ts`, `components/panel/*`, `hooks/*`, dan seluruh komponen `features/makan/`).

Status fase 1: tidak ada butir berubah. Peta bersama sudah jalan, tetapi belum ada fitur situs lama yang di-port.

Asal kode: hujandibatam `45281a64de5fe068de9d95b9bbc73ba4eb5af4db`, batam-bites `85905410a7a1f1e42e0b43f19e72b144cf384249`.

## hujandibatam → /langit-laut

### Fitur
- ☐ Tiga mode: hujan, ombak, CCTV; deep link `?mode=`, `?view=`, `?cam=`; URL mencerminkan state (`replaceState`), param lain dipertahankan
- ☐ Radar 30 frame × 5 menit, animasi, penggeser waktu, tombol "ke sekarang"
- ☐ Jawaban echo ±20 km; hujan per kecamatan dari mask piksel; lingkup jawaban per view (`scopeOf`)
- ☐ Prakiraan BMKG 3-jaman (Teluk Tering), strip kondisi NEA: nowcast, hujan terdekat, PSI, UV, angin
- ☐ Legenda hujan 3 tingkat palet asli MSS (ringan, sedang, lebat), opacity radar
- ☐ Label kota `PLACES` di mode hujan; batas 52 kecamatan; kecamatan hujan: arsiran + label bertulisan, tabrakan label disaring
- ☐ Ombak 25 frame × 3 jam, double-buffer (tanpa kedip), legenda 14 stop hard-stop, kategori BMKG, prakiraan teks, peringatan dini
- ☐ Mask daratan CircleGeo dengan tile sentinel z7; panel jujur bila mask gagal
- ☐ CCTV pin berkelompok (unit per koordinat, 28 px), pin kembar dikipas 24 px dengan garis rambut, kelompok ≤9 jadi daftar panel, >9 memperbesar peta
- ☐ Direktori kamera, kamera terakhir dibuka (3), status abu untuk kamera gagal, petunjuk pertama kali
- ☐ Preset `VIEWS` (batam, regional, kepri, natuna, kamera) dan batas zoom per mode; fit ulang saat rotasi, bukan tiap resize
- ☐ Tema otomatis jam WIB + toggle, flip ditunda saat animasi atau kamera aktif
- ☐ Panel bottom-sheet ringkas di HP, Detail satu ketuk, sidebar ≥900 px, side-sheet HP landscape; fokus berpindah benar saat dilipat
- ☐ Tombol Bagikan (Web Share API, fallback salin), `aria-live` hanya keadaan terbaru
- ☐ PWA: manifest, `sw.js` (realtime network-only, static cache-first dipangkas 60 entri), petunjuk pasang iOS, tombol Pasang
- ☐ Preferensi tersimpan, halaman galat, global error, sitemap, robots, kredit sumber
- ☐ Pemulihan saat tab kembali terlihat atau sinyal balik (`useRevisit`)

### Aturan kejujuran
- ☐ Data asal Singapura ditandai sebagai proksi
- ☐ Label Langsung/Tertunda/Terputus dihitung di klien dari umur citra
- ☐ Frame 404 dilewati, tidak pernah tampil sebagai "tidak hujan"
- ☐ Run OFS basi/kedaluwarsa ditandai (`source`, `ageH`, `expired`)
- ☐ CCTV: playlist dicek dulu (`#EXT-X-ENDLIST` = mati, `Last-Modified` tua = beku), nol byte video sebelum dipilih
- ☐ Satu stream saja, tanpa grid dan autoplay massal, berhenti saat tab disembunyikan, perkiraan konsumsi data tampil
- ☐ hls.js build penuh, bukan `light` (ada kamera H.265)
- ☐ Route realtime `force-dynamic` + `s-maxage` 30–60 detik, tanpa ISR/prerender
- ☐ Function region `sin1`, header keamanan, semua URL eksternal di `lib/sources.ts`, tanpa pelacak
- ☐ Kalimat "ditarik langsung ke perangkat pengguna" disesuaikan bila radar lewat route sendiri

### Uji visual
- ☐ Radar: waktu dan zoom sama, situs lama vs baru, garis pantai sejajar
- ☐ Ombak: idem

## batam-bites → /makan

- ☐ Peta ⟷ daftar dengan filter tersinkron; pencarian
- ☐ Filter halal, 17 kategori, 15 area, harga, terminal feri, label, buka sekarang; shortcut "Dekat Terminal Ferry"
- ☐ Detail: menu andalan, jam + buka sekarang, harga IDR + kurs SGD/MYR/USD, pembayaran, mini-map, tombol Navigasi (kueri `gmaps`)
- ☐ 5 jalur kuliner dengan peta jalur
- ☐ Favorit localStorage + ekspor/impor atau tautan daftar slug
- ☐ ID/EN (+ 中文 bila ada isinya), ikut tombol bahasa situs
- ☐ About: prinsip tanpa listing berbayar, penafian halal "kurasi best-effort, verifikasi langsung bila ragu"
- ☐ PWA
- ☐ Label kurasi bergaya label museum; emoji kategori diganti ikon garis
- ☐ `rating`/`reviews` tidak ditampilkan, data disimpan
- ☐ 117 koordinat `coord_approx` tampil "perkiraan area" dan masuk CSV koordinat
- ☐ `ferries.json` diganti data feri situs; alias `batam-centre`, `sekupang`, `nongsapura` ditambahkan ke indeks (`harbour-bay` sudah ada)
- ☐ Route: `/makan`, `/makan/daftar`, `/makan/peta`, `/makan/kategori`, `/makan/tempat/[slug]`, `/makan/jalur`, `/makan/jalur/[slug]`, `/makan/tersimpan`, `/makan/tentang`

## Pengalihan (hanya setelah semua ✔ dan izin pemilik)

- ☐ Peta redirect 301 per path untuk kedua situs
- ☐ `sw.js` pengganti: bersihkan cache, arahkan ke situs baru
- ☐ Situs lama tetap hidup selama transisi. Jangan push, deploy, atau mengubah DNS/Vercel situs lama tanpa persetujuan eksplisit
