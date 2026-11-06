# PARITAS situs lama

Setiap butir harus ✔ di Batam City Hall sebelum situs lama dialihkan. ◐ = sebagian, ☐ = belum. Daftar berasal dari bagian 4.0 prompt dan kode yang dibaca saat port. `components/panel/*` dan `lib/status.ts` dipindah tanpa perubahan dan belum dibaca baris demi baris, jadi perilaku kecil di sana belum tentu punya butir sendiri.

Bukti: `e2e` = tests/e2e/langit-laut.spec.ts dan makan.spec.ts dengan build produksi; `live` = dicoba manual di browser dengan sumber asli, 4–5 Nov 2026; `kode` = logika lib/hook dipindah tanpa perubahan, belum diuji sendiri.

**Situs lama saat ini mati:** hujandibatam.masbash.id dan batam-bites.vercel.app membalas HTTP 402 (dicek 4 Nov 2026). Perbandingan dilakukan terhadap kode lama yang dijalankan lokal dari commit asal.

Asal kode: hujandibatam `45281a64de5fe068de9d95b9bbc73ba4eb5af4db`, batam-bites `85905410a7a1f1e42e0b43f19e72b144cf384249`.

Sejak rombak menu November 2026: CCTV pindah ke `/cctv`, klaster kamera diganti titik berdiri sendiri, dan tombol bahasa Makan disembunyikan. Terjemahan tetap ada di kode. Alamat lama dialihkan di `next.config.ts`, redirect situs lama di `deploy/situs-lama/` sudah menunjuk alamat baru.

## hujandibatam → /cuaca

### Fitur
- ✔ Tiga mode: hujan, ombak, CCTV; deep link `?mode=`, `?view=`, `?cam=`; URL mencerminkan state (`replaceState`), param lain dipertahankan — e2e, live
- ✔ Radar 30 frame × 5 menit, animasi, penggeser waktu, tombol "ke sekarang" — animasi dan penggeser live; tombol ke sekarang kode
- ✔ Jawaban echo ±20 km; hujan per kecamatan dari mask piksel; lingkup jawaban per view (`scopeOf`) — live; arsiran dan label kecamatan e2e
- ✔ Prakiraan BMKG 3-jaman (Teluk Tering), strip kondisi NEA: nowcast, hujan terdekat, PSI, UV, angin — route 200 live; tampilan kode
- ✔ Legenda hujan 3 tingkat palet asli MSS (ringan, sedang, lebat), opacity radar — live; penggeser opacity kode
- ✔ Label kota `PLACES` di mode hujan; batas 52 kecamatan; kecamatan hujan: arsiran + label bertulisan, tabrakan label disaring — live; arsiran dan pil e2e; penyaringan tabrakan kode
- ✔ Ombak 25 frame × 3 jam, double-buffer (tanpa kedip), legenda 14 stop hard-stop, kategori BMKG, prakiraan teks, peringatan dini — live, sumber dan jam sama dengan kode lama; double-buffer belum diamati saat jaringan lambat
- ✔ Mask daratan CircleGeo dengan tile sentinel z7; panel jujur bila mask gagal — **diubah:** mask memakai `earth` peta dasar sendiri, CircleGeo terlalu kasar di MapLibre. Tanpa server luar; panel tetap jujur bila peta dasar gagal
- ✔ CCTV pin berkelompok (unit per koordinat, 28 px), pin kembar dikipas 24 px dengan garis rambut, kelompok ≤9 jadi daftar panel, >9 memperbesar peta — live, e2e. Ambang zoom dikurangi 1 karena tile 512 px
- ✔ Direktori kamera, kamera terakhir dibuka (3), status abu untuk kamera gagal, petunjuk pertama kali — live; status abu e2e
- ✔ Preset `VIEWS` (batam, regional, kepri, natuna, kamera) dan batas zoom per mode; fit ulang saat rotasi, bukan tiap resize — live, e2e deep link; fit saat rotasi kode
- ✔ Tema otomatis jam WIB + toggle, flip ditunda saat animasi atau kamera aktif — tombol tema pindah ke strip navigasi situs; flip tertunda kode
- ✔ Panel bottom-sheet ringkas di HP, Detail satu ketuk, sidebar ≥900 px, side-sheet HP landscape; fokus berpindah benar saat dilipat — live desktop dan HP; landscape e2e tanpa overflow; urutan fokus kode
- ✔ Tombol Bagikan (Web Share API, fallback salin), `aria-live` hanya keadaan terbaru — fallback salin e2e; Web Share API belum diuji di HP
- ✔ PWA: manifest, `sw.js` (realtime network-only, static cache-first dipangkas 60 entri), petunjuk pasang iOS, tombol Pasang — manifest dan sw.js e2e; tombol Pasang dan petunjuk iOS belum diuji di HP nyata
- ✔ Preferensi tersimpan, halaman galat, global error, sitemap, robots, kredit sumber — halaman galat ditulis ulang di app/error.tsx, belum dipicu
- ✔ Pemulihan saat tab kembali terlihat atau sinyal balik (`useRevisit`) — kode

### Aturan kejujuran
- ✔ Data asal Singapura ditandai sebagai proksi — live: "Radar MSS Singapura", dan kotak Hari Ini menulis proksi
- ✔ Label Langsung/Tertunda/Terputus dihitung di klien dari umur citra — kode
- ✔ Frame 404 dilewati, tidak pernah tampil sebagai "tidak hujan" — e2e
- ✔ Run OFS basi/kedaluwarsa ditandai (`source`, `ageH`, `expired`) — kode, ikut `source` dari route
- ✔ CCTV: playlist dicek dulu (`#EXT-X-ENDLIST` = mati, `Last-Modified` tua = beku), nol byte video sebelum dipilih — live: 0 permintaan ke server kamera sebelum pin dipilih, e2e juga
- ✔ Satu stream saja, tanpa grid dan autoplay massal, berhenti saat tab disembunyikan, perkiraan konsumsi data tampil — live: tampil "Sekitar 20 MB per Menit"; berhenti saat tab disembunyikan kode
- ✔ hls.js build penuh, bukan `light` (ada kamera H.265) — `lib/cctv.ts`
- ✔ Route realtime `force-dynamic` + `s-maxage` 30–60 detik, tanpa ISR/prerender — tambahan `/api/radar-citra/[ts]` cache panjang karena PNG per timestamp tidak berubah
- ✔ Function region `sin1`, header keamanan, semua URL eksternal di `lib/sources.ts`, tanpa pelacak — e2e beranda: nol permintaan ke luar situs
- ✔ Kalimat "ditarik langsung ke perangkat pengguna" disesuaikan bila radar lewat route sendiri — kalimat itu tidak ada di kode yang dipindah

### Uji visual
- ✔ Radar: waktu dan zoom sama, situs lama vs baru, garis pantai sejajar — frame dan jawaban sama; jarak Singapura–Lingga dan Lingga–echo berskala sama (1,9×). Garis pantai CARTO tidak bisa dibandingkan: situs lama mati dan kunci CARTO tidak ada
- ✔ Ombak: idem — run, jam, dan set tile sama (7/98–102/62–66), pola pita sama, pantai dibandingkan dengan mask CircleGeo kode lama secara visual. Skala kedua tangkapan berbeda karena Leaflet membulatkan zoom

## batam-bites → /makan

- ✔ Peta ⟷ daftar dengan filter tersinkron; pencarian — e2e
- ✔ Filter halal, 17 kategori, 15 area, harga, terminal feri, label, buka sekarang; shortcut "Dekat Terminal Ferry" — e2e
- ✔ Detail: menu andalan, jam + buka sekarang, harga IDR + kurs SGD/MYR/USD, pembayaran, mini-map, tombol Navigasi (kueri `gmaps`) — e2e; opsi USD dan kursnya kode
- ✔ 5 jalur kuliner dengan peta jalur — e2e, live
- ✔ Favorit localStorage + ekspor/impor atau tautan daftar slug — e2e simpan, muat ulang, tautan `?simpan=`, impor
- ✔ ID/EN (+ 中文 bila ada isinya) — e2e. Menyimpang dari prompt: tombol bahasa hanya di Makan, karena hanya loket ini yang punya terjemahan; tombol di header akan menjanjikan bahasa yang tidak ada (DATA_DECISIONS). Teks 中文 untuk UI baru belum dibaca penutur
- ✔ About: prinsip tanpa listing berbayar, penafian halal "kurasi best-effort, verifikasi langsung bila ragu" — e2e
- ✔ PWA — manifest dan sw.js situs yang sama; pemasangan belum diuji di HP nyata
- ✔ Label kurasi bergaya label museum; emoji kategori diganti ikon garis — e2e
- ✔ `rating`/`reviews` tidak ditampilkan, data disimpan — e2e; tidak dipakai mengurutkan, data tetap ada di JSON
- ✔ 117 koordinat `coord_approx` tampil "perkiraan area" dan masuk CSV koordinat — e2e, live; CSV +117 baris. Koordinat yang nanti diisi pemilik belum mengalir ke `data/makan/` (PLAN)
- ✔ `ferries.json` diganti data feri situs; alias `batam-centre`, `sekupang`, `nongsapura` ditambahkan ke indeks (`harbour-bay` sudah ada) — alias lewat `tools/merge_aliases.json`. Nongsapura bergeser ±6,8 km, jadi hasil "dekat terminal" berubah dari situs lama
- ✔ Route (sejak 5 Nov 2026, alamat lama dialihkan 308): `/makan`, `/makan/peta`, `/makan/hidangan`, `/makan/kawasan`, `/makan/dekat-feri`, `/makan/tempat/[slug]`, `/makan/panduan`, `/makan/panduan/[slug]`, `/makan/tersimpan`, `/makan/tentang` — e2e, termasuk 404 slug

## Pengalihan (hanya setelah semua ✔ dan izin pemilik)

- ✔ Peta redirect 301 per path untuk kedua situs: siap di `deploy/situs-lama/`, dites `tests/unit/redirect-lama.test.ts`, **belum dijalankan**
- ✔ `sw.js` pengganti: bersihkan cache, arahkan ke situs baru: siap, **belum dijalankan dan belum pernah dicoba di browser dengan service worker lama**. Favorit batam-bites pindah lewat `saved.html`
- ☐ Eksekusi pengalihan: menunggu izin eksplisit pemilik. Situs lama tidak disentuh

## Tambahan fase 3 (tidak ada di situs lama)

- ✔ Koordinat dari `tools/import_koordinat.py` sampai ke `/makan` — tes unit
- ✔ "Lagi hujan di {kecamatan}" di detail Makan, "Buat berteduh" di detail hujan — e2e
- ✔ Rating tetap tidak tampil, termasuk di direktori — tes unit dan e2e
- ✔ Feri terakhir di detail Makan — fase 4, e2e

## Baru, tidak ada di situs lama

Bukan syarat pengalihan, dicatat supaya perbandingan tidak salah baca.

- Peringatan dini cuaca BMKG di panel Hujan (label, bagian Detail, poligon di peta) dan `/cuaca/peringatan` — e2e, live 5 Nov 2026
- Gempa BMKG di `/cuaca/gempa` dan baris bila relevan di kotak Hari Ini — e2e, live 5 Nov 2026

## Tambahan Rombak November 2026

Bukan syarat pengalihan situs lama, dicatat supaya perbandingan tidak salah baca.

- Kategori Makanan: 32 kategori pemilik menggantikan 17 hidangan. Alamat kategori lama dialihkan ke alamat barunya — e2e, belum tayang
- Food Court di `/makan/food-court` dan tautan dua arah dengan tempat makan — e2e, belum tayang
- Info Loker di `/loker`: menu tampil setelah basis data tersambung — e2e mode contoh, belum tayang
- Dashboard Makanan, Jurnal, agenda, dan Info Loker di `/admin` — e2e mode contoh, belum diuji dengan Supabase sungguhan
