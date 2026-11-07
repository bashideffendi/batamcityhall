# Yang perlu pemilik lakukan

Diperbarui 5 November 2026 setelah pedoman diterapkan. Situs tayang sebagai pratinjau. Kode sudah di repo publik `bashideffendi/batamcityhall`. Tidak ada satu pun yang menyentuh situs lama, DNS, atau Vercel.

## Pratinjau

Tayang di https://batam.masbash.id (Railway, cabang `fase-1-fondasi`). Selama `SITE_PRATINJAU=1`, mesin pencari tidak mengindeks situs. Hapus variabel itu saat situs diumumkan.

## Rombak menu: yang perlu Anda lakukan

1. **Isi koordinat.** File: `data/koordinat_perlu_diisi.xlsx`, 1.101 lokasi urut prioritas, termasuk 16 food court. Isi kolom kuning saja, boleh bertahap, lalu kirim kembali. Saya masukkan dengan `tools/impor_lembar_koordinat.py`.
2. **Sambungkan dashboard.** Kode `/admin` untuk Jurnal, foto, data makanan, food court, agenda, dan Info Loker sudah ada, tetapi baru teruji di mode contoh. Yang dibutuhkan: izin membuat proyek Supabase (paket gratis cukup), lalu tiga variabel di Railway, satu akun admin, dan migrasi di `supabase/migrations/`. Tukang Langganan ikut aktif dengan proyek yang sama.
3. **Tombol Terbitkan Perubahan** di Data Makanan butuh `RAILWAY_API_TOKEN` di Railway. Foto, Jurnal, dan agenda tidak butuh tombol ini: langsung tampil. Tombol ini belum pernah diuji melawan Railway.
4. **Food Court:** 16 tempat dihimpun dari media dan panduan perjalanan, belum didatangi. Enam di antaranya bertanda Alamat Perlu Dicek karena hanya tercatat di daftar pihak ketiga. Tambahkan atau koreksi kalau ada yang Anda tahu.
5. **Data ganda:** `RS BP Batam (RS Otorita)` dan `RS Badan Pengusahaan Batam` tampaknya rumah sakit yang sama. Belum saya gabung, karena alamat keduanya berbeda tingkat kepastian. Mohon konfirmasi.
6. **Newsletter:** formulir di kaki situs sudah ada dan menyimpan email setelah Supabase tersambung. Pengiriman newsletter butuh layanan email terpisah (misalnya Buttondown atau Resend), lalu unggah CSV dari dashboard Newsletter. Mohon baca paragraf Pelanggan Newsletter di Privasi sebelum dibuka.
7. **Info Loker:** menu dan halamannya sudah ada, diisi dari dashboard. Menunya muncul setelah Supabase tersambung, supaya pengunjung tidak mendarat di halaman kosong.
8. **Konser dan event bertanggal** belum ada datanya. Seksi Agenda Mendatang muncul otomatis setelah Anda mengisi acara pertama. Saya tidak mengarang acara.

## Keputusan baru (desain ulang Makan, November 2026)

1. **"Dikunjungi penyusun" dihapus** dari Cara Kami Memilih, karena `verified` hanya 18 dari 117. Bila memang semua dikunjungi, kalimatnya bisa dikembalikan.
2. **Status halal:** riset menyarankan "Halal" berarti bersertifikat. Data tidak menyatakan itu, jadi tetap tertulis "hasil kurasi, bukan sertifikasi".
3. **Waktu tempuh ke terminal** tidak ditampilkan karena tidak ada data jalan. Yang tampil jarak garis lurus dari titik perkiraan.
4. **Tentang vs Privasi:** Tentang menulis "tidak memakai pelacak", Privasi menulis "tidak memasang iklan dan pelacak iklan". Pilih satu.
5. **Kalimat hangat di Tentang** kini "...dibuat secara independen oleh warga Batam untuk kota yang kami tinggali." Mohon diperiksa.
6. **Kurs** perlu diperbarui sesekali di `data/makan/kurs.json`.
7. **Ilustrasi baru** (pedoman 4.7): lembar kontak ada di `docs/tampilan/sebelum-sesudah/makan-ulang/ilustrasi.png`.

## Keputusan yang menunggu jawaban (penerapan pedoman, 5 Nov 2026)

1. **`KALIMAT_REMPANG`** masih berbunyi "lihat sumber bertanggal", padahal sumber tidak lagi tampil. Komentar kode melarang menyuntingnya tanpa pemilik. Perlu kalimat pengganti.
2. **Media Center Pemko** masih jadi sumber berita dan menaut ke situs .go.id. Pedoman melarang tautan pemerintah, kecuali di Kolofon dan Berita, jadi saat ini lolos pemeriksaan. Diteruskan atau dibuang?
3. **Tukang:** "Sedot WC" dan "Dokter per spesialis" hilang dari jenis jasa karena mengikuti naskah 3.5, padahal `research/00` mewajibkannya. Mana yang menang?
4. **Makan:**
   - Nomor ponsel yang disembunyikan 24, bukan 25 seperti ditulis pedoman.
   - "Dikunjungi penyusun" dan "Data diperiksa" kurang didukung data: `verified` hanya 18 dari 117.
   - "Per orang" tidak ada di data harga.
   - Bagian QRIS dan kiat di Tentang Makan tidak ada di naskah, tetapi dipertahankan.
1. **Transportasi:** contoh pedoman {07.30} berbeda dengan data 06.00, dan 8.2 menyebut enam kotak sedangkan 3.6 menyebut lima. Info Praktis Trans Batam dipertahankan walau di luar naskah.
2. **Cerita:** label pelaku legalitas adalah penilaian saat menerapkan pedoman, mohon diperiksa. Rempang tidak punya butir berlabel Warga. Kanal komunitas berkurang dari 5 menjadi 3.
3. **Gempa dan peringatan dini** tidak ada di naskah pedoman. Dipertahankan di `/cuaca/gempa`, `/cuaca/peringatan`, dan Hari Ini, tanpa tautan dan tanpa "Sumber:". Kredit BMKG ada di Kolofon. Kondisi Saat Ini memuat satu kalimat bahwa datanya diukur di Singapura.
4. **Direktori:** "Baru N dari M terdata" masih tampil sebagai catatan di bawah daftar, walau tidak ada di naskah.

## Uji yang hanya bisa pemilik lakukan

- **Ponsel Android dan iPhone asli** (pedoman 8.5). Yang sudah diuji baru emulasi.
- **Peta terasa lambat di ponsel?** Berkas peta 46 MB dilayani dari server aplikasi. Bila lambat, pindahkan ke penyimpanan dengan CDN dan isi `NEXT_PUBLIC_PMTILES_URL`.

## Supaya bisa tayang

1. **Vercel.** Beri tahu nama proyek Vercel, atau izinkan membuatnya. Repo GitHub sudah ada.
2. **Bucket aset** (Cloudflare R2 atau lain) untuk `public/tiles/batam.pmtiles` (46 MB, tidak ikut Git), lalu isi `NEXT_PUBLIC_PMTILES_URL`.
3. **Domain final**, lalu isi `NEXT_PUBLIC_SITE_URL`. Sekarang terisi `https://batam.masbash.id`.
4. **Uji sumber BMKG dari IP Vercel** bila nanti pindah ke Vercel. Dari Railway sudah lolos (5 Nov 2026).
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
| Warna status di tampilan gelap | Pedoman 4.2 hanya memberi warna untuk tampilan terang, dan warna itu tidak terbaca di latar gelap. Sementara hijau `#46B886`, kuning `#E0A93F`, merah `#F28B82` | `data/design/design_tokens.css` |
| Tanggal "terakhir dicek" | "Belum dicek ulang sejak riset Nov 2026". Tidak ada tanggal yang dikarang | `teksDicek`, `features/direktori/data.ts` |
| Nama notaris dan PPAT | Tampil dalam kartu berlabel Beta | `features/direktori/KartuTempat.tsx` |
| Rating Google | Tidak tampil | `DATA_DECISIONS.md` |
| Kartu Rempang Eco-City di direktori | Minimal, tanpa label status | `kartuMinimal` |
| `/cerita/rempang` dan `/cerita/kampung-tua/legalitas` | Tayang berlabel draf | **Mohon dibaca dulu sebelum situs tayang** |
| Angka ±1.600 ha dan 1.450 sertifikat | Tidak tampil, dicatat di daftar butir yang disaring | `features/kampung-tua/` |
| Gempa di kotak Hari Ini | Hanya gempa 24 jam terakhir yang dirasakan di Kepri, dalam 300 km, M 6 ke atas dalam 1.000 km, atau disebut BMKG berpotensi tsunami | `features/langit-laut/lib/gempa.ts` |
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
10. **Fitur yang ditunda** (alasan di `COVERAGE.md`): harga pangan Bapanas, panduan KTP pindahan, kontur GEBCO, notifikasi hujan, halaman "Batam yang hilang", Barelang scrollytelling, kuis tokoh.
