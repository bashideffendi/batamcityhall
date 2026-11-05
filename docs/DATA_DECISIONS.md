# DATA_DECISIONS

Keputusan soal data, dengan alasan. Pemilik proyek bisa mengubah semuanya. Butir "usulan" berasal dari pembacaan riset dan belum dicek ulang ke sumber aslinya; periksa `research/NN` dan `docs/brief/NN.md` saat menerapkannya.

## Diputuskan

| Hal | Keputusan | Alasan |
|---|---|---|
| Rating Google makan | Disimpan, tidak ditampilkan | Prinsip tanpa rating bintang (prompt 4.0) |
| Footer | Teks lengkap dari research/00 | 00 menang atas versi pendek laporan 05 |
| Warna peta | `data/design/` menang atas hex laporan 02 dan 10 | Token sudah dihitung kontrasnya |
| Bbox peta | `103.55,0.45,104.75,1.5` dari 00 | Bbox laporan 02 memotong siluet Singapura dan Bintan |
| Luas lahan Rempang (7.572 ha, 17.000 ha, 8.142 ha) | Tidak ditampilkan | Prompt bagian 6 melarang batas dan luas lahan |
| Lisensi IBM Plex Mono | OFL-1.1, dicatat di Kolofon | Metadata paket resmi `@ibm/plex-mono` di npm, dicek 4 Nov 2026 |
| Mawar angin di emblem | Dipakai | Laporan 05 menulis "bukan di logo" di bagian 1, tetapi bagian logo merinci emblem berisi mawar angin. Bagian logo lebih khusus |
| Favicon | Bingkai tunggal, huruf di grid 16 px | Bingkai ganda dan huruf vektor tidak terbaca di 16 px saat diuji. Versi bingkai ganda ada di `public/logo/monogram.svg` dan ikon iOS |
| Polygon `LUAR_FOKUS` di `features/peta/style.ts` | Efek gambar, bukan batas wilayah | Hanya untuk menjadikan Singapura-Johor dan Bintan siluet. Jangan dipakai untuk data atau hitungan apa pun |
| Teks `/tentang` dan `/kolofon` | Draf, perlu dibaca pemilik | Termasuk kalimat bantuan AI dan rencana merilis token terbuka |

| Mask daratan Ombak | `earth` peta dasar, bukan CircleGeo | Menyimpang dari prompt 4.0 butir 4. CircleGeo terbaca satu tingkat lebih kasar di MapLibre; yang ini lebih tajam dan tanpa server luar |
| Peringatan dini saat `Kep. Riau` tidak ada di `warnings.json` | Status "Belum Tersedia", tidak pernah "aman" | File itu tidak memuat semua provinsi |
| Gempa di kotak Hari Ini | Hanya gempa 24 jam terakhir yang dirasakan di Kepri, berpusat dalam 300 km dari Batam, M 6 ke atas dalam 1.000 km, atau disebut BMKG berpotensi tsunami | Prompt hanya menulis "bila relevan". Ambang ini pilihan saya, bukan angka BMKG dan bukan penilaian bahaya: 300 km kira-kira mencakup Kepri, Riau, Johor, dan Singapura; 1.000 km mencakup hampir seluruh Sumatra. Bisa diubah di `features/langit-laut/lib/gempa.ts` |
| Titik acuan jarak gempa | Titik label Kec. Batam Kota di `kecamatan-geo.json` (BIG) | Tidak menebak koordinat. Jarak ditulis dibulatkan 10 km dan diberi keterangan dihitung situs ini |
| Tanpa peta di halaman gempa | Daftar dengan jarak dan arah, plus tautan peta guncangan BMKG | Peta dasar hanya mencakup area Batam, gempa tersebar se-Indonesia |
| Kecamatan Batam pada peringatan cuaca | Disebut di teks BMKG, atau titik labelnya di dalam poligon | Nama kecamatan hanya ada di teks. Poligon ikut dicek supaya teks yang terpotong tidak menghilangkan Batam. Dua peringatan asli 5 Nov 2026 memberi hasil sama dari kedua cara |
| Peringatan cuaca di kotak Hari Ini | Tampil bila mengenai Batam atau datanya gagal. Selain itu baris hilang, tidak pernah ditulis aman | Prompt 4.1 "bila ada". Peringatan di Kepri lain ada di `/langit-laut/peringatan` |
| Label baris lama "Peringatan" di kotak Hari Ini | Jadi "Peringatan laut" | Sekarang ada dua jenis peringatan, baris lama hanya soal gelombang. "Gelombang" saja terbaca sama dengan baris Ombak |
| Istilah CAP (severity, urgency, certainty) | Disalin apa adanya dalam bahasa Inggris, dengan tautan rujukan BMKG | Tidak menerjemahkan sendiri istilah resmi |
| Kuliner di `koordinat_perlu_diisi.csv` | Prioritas 3 | Pilihan saat port, pemilik bisa mengubah |
| Koordinat terminal feri di Makan | Dari `places.json` kanonik | Nongsapura bergeser ±6,8 km dari batam-bites, jadi hasil "dekat terminal" berubah |
| Kecamatan kuliner | 30 dari 117 kosong, dicatat di `catatan` | Tidak tertulis di alamat atau nama area, tidak ditebak |
| `status_data` kuliner | Dari field `verified` batam-bites (18 terverifikasi) | Arti field itu tidak didefinisikan di sumber |
| `sumber_url` kuliner | Kosong | batam-bites tidak punya URL sumber per tempat |
| "Buka sekarang" di Makan | Dihitung menurut WIB, jam yang tidak jelas dijawab tidak tahu | Berbeda dari situs lama |
| Rating Google | Tetap ada di `atribut` dan JSON, tidak ditampilkan | Direktori fase 3 juga tidak boleh menampilkannya |

| Catatan `places.json` di kartu | Disaring, kategori kampung tua, lainnya, kuliner, dan akomodasi tidak menampilkan catatan | Sebagian besar catatan kerja penyusun |
| Atribut `places.json` di kartu | Daftar putih di `features/direktori/data.ts` | Rating, luas lahan, dan id internal ada di kolom yang sama |
| Catatan urusan tanah yang menyebut riset | Diganti "Belum ada catatan." | Baris BPHTB berisi catatan kerja, data tidak diubah |
| `cara_verifikasi_profesi.md` | Ditulis ulang di halaman, tidak ditampilkan mentah | Berisi instruksi untuk penyusun dan nama ketua IKPI |
| Rempang Eco-City di direktori | Kartu minimal, tanpa label "rencana" | Prompt bagian 6 meminta teks bertanggal dan beratribusi; menunggu PLAN butir 13 |
| Pin di titik yang sama | Satu pin, sisanya tertulis di kartu | Kompleks kamp Galang dan Masjid Agung punya beberapa entri di satu titik |
| Angka notaris, PPAT, OBH | Ditambahkan ke `angka_resmi.json` dari brief 08 | Brief meminta disimpan di sana; cocok dengan `research/08` (dicek 5 Nov 2026) |

| Data OSM | Lapisan terpisah berlabel, tidak masuk hitungan direktori dan tidak mengubah `halte.json` | Prompt bagian 5 butir 4 |
| Tiga koordinat cocok OSM di bawah 50 m | Naik ke terverifikasi | Aturan brief 12. TMP dan paroki dikecualikan brief 09 |
| Warna malam koridor | Warna data dicampur putih sampai kontras 3:1 | Laporan tidak menyediakan varian malam |
| `tanggal_data` berbentuk bulan | Dihitung dari awal bulan; kosong dianggap lama | Lebih aman untuk peringatan 60 hari |
| Jadwal berstatus usang | Tidak pernah jadi "terakhir" | Brief 14 |
| 1,79 juta penduduk (Databoks) | Tampil berlabel beda versi di `/cerita/angka`, tidak masuk grafik | Brief melarang, prompt minta semua item tampil |
| `gw-008`, `gw-011` | Status diturunkan ke beda versi | Laporan 04, 15, 16 berbeda |
| Lima butir legalitas kampung tua | Tanggal dan sumber tampil, isi soal luas dan status lahan tidak | Prompt bagian 6 |
| Enam kutipan Rempang | Berlabel "tautan belum tercatat" | Riset tidak menyimpan URL-nya |
| `sumber_rekomendasi_warga.json` | Tidak ditampilkan | Catatan riset, bukan data untuk warga |
| Status Tour de Batam | "Dibatalkan", mengikuti kolom tabel | `catatan_laporan` memuat salah tempel antar-acara |
| Kanal komunitas | Hanya yang berstatus terverifikasi dan bukan kanal pemerintah, 3 entri | Kontak lain belum pasti. PEDOMAN 2.9 melarang tautan ke situs pemerintah |
| Izin tukang | Syarat tampil, kontak tampil hanya dengan izin | Prompt bagian 7 |
| Layar admin | Kontak perekomendasi tersamar | Prompt bagian 7 |
| Segmen mural pertama | Harbour Bay–Nagoya–Jodoh | Barelang tanpa jadwal feri, quest 6 jembatan tidak bisa tuntas di satu segmen |
| Cache berita | Memori 20 menit dan `s-maxage`, bukan `revalidate` | Cache fetch menyajikan salinan lama saat feed mati, jadi status tidak jujur |
| Berita nasional | Tidak disaring kata kunci, ditulis di halaman | Penyaringan bisa salah buang |
| Tombol bahasa | Hanya di Makan | Loket lain tidak punya terjemahan |
| Indikator "Aman nyebrang?" | Tidak dibuat | Keselamatan, butuh ambang sah dan penafian syahbandar |
| Konflik `places_konflik.json` | Nilai hasil penggabungan dipakai, daftar di `KONFLIK_DATA.md` | Tidak ditebak |

## Perlu keputusan pemilik

- Kemungkinan duplikat kuliner, belum digabung: `kedai-kopi-ameng` ↔ `kopi-ameng`, `kedai-kopi-harum-manis` ↔ `kopi-harum-manis`.
- 14 tempat beralamat beberapa cabang, tetapi hanya punya satu pin.
- Sekupang: catatan `places.json` menyebut layanan internasional berhenti sejak 2021 dan perlu dicek. UI hanya menulis "cek ke operator".

## Usulan, belum diterapkan

### Konflik antarlaporan
- **Telaga Punggur, Batam Centre, Nongsapura:** koordinat BP Batam dilaporkan salah (brief 09). Telaga Punggur: laporan 07 (Wikidata) lebih kuat daripada 06. Cek OSM sebelum dirender. Tinjau bersama 63 konflik di `data/places_konflik.json`, yang belum satu pun diputuskan.
- **Wafat Nong Isa 1831:** terverifikasi di laporan 15, beda versi di 04 dan 16. Usulan: tampilkan "beda versi".
- **Batam Brickworks:** Batu Aji (16) vs Perigi Batu Pulau Buluh (15). Tampilkan keduanya beratribusi sampai ada sumber primer.
- **Jumlah kampung tua:** 37 vs 33 (SK 105/2004) vs 24. Laporan 13 menulis "37 (Perda 2/2004)", laporan 04 mengoreksinya. Tampilkan dari `data/kampung_tua/sumber_jumlah.json` dengan atribusi per angka.
- **Perda 2/2004:** bukan "2/2014" seperti salah ketik di opini Antara.

### Data yang tidak boleh tampil
- Klaim DPO direktur PT UJKM: satu sumber, menyangkut orang.
- Nomor HP di daftar KUA dan HP Ocarina. Nomor SK notaris dari blog 2019.
- Tautan ke `damkarbatam.com` dan `disdikkotabatam.org`: situs palsu.
- Depo Bangunan dan Grand Lucky tidak dimasukkan (brief 12).
- Daftar advokat perorangan, penerjemah tersumpah, biro jasa: tidak dibuat (brief 08).
- "±1.600 ha" di `kampung_tua/kronologi_legalitas.json`: disembunyikan sampai pemilik memutuskan (PLAN butir 12).
- TPU usulan tidak boleh tampil sebagai TPU beroperasi. Pasar Induk Jodoh berbadge "rencana".

### Duplikat dan label
- **Kampung tua ganda di `places.json`:** `kampung-tua-nongsa` vs `kt-nongsa-pantai`, `kampung-tua-rempang` vs 16 entri `rg-*`. Daftarkan grup di `tools/merge_aliases.json`, jangan hapus entri sumber. `kampung_tua.json` tetap 56 entri, `places.json` 59.
- **"Teh obeng" (kamus k-020):** tetap entri kamus, dilarang jadi nama fitur, judul, atau plesetan (research/00 menolaknya sebagai konsep).
- **Kamus:** 35 dari 65 entri `[P]` tampil dengan label, jangan diklaim khas Batam saja. Kolom `kelompok` (6 kelompok di laporan) belum ada di JSON.
- **Tarif pompong:** tampil sebagai tarif swadaya, bukan tarif resmi, dengan label "mungkin usang".
- **PPAT/notaris:** label "Beta – data komunitas, verifikasi sendiri" dan tombol "Cek status". Semua 34 entri tanpa koordinat.

### Celah yang harus diatasi saat membangun
- **`places.json` tidak punya "terakhir dicek",** padahal prompt mewajibkannya di tiap kartu. Perlu field baru (PLAN butir 10).
- **Kelengkapan:** direktori jauh di bawah angka resmi (5 masjid vs 972, 12 sekolah vs 437 SD). UI menampilkan "baru N dari M terdata" dari `statistik/angka_resmi.json`.
- **Feri terakhir:** jangan ambil jam maksimum dari `jam_berangkat`. `tpg-tpi` hanya memuat 6 jam pagi; yang terakhir ada di teks `hari`. Dari 33 rute hanya 19 punya jam. 4 jadwal tanpa `zona_waktu`. Pakai zona asal (WIB, SGT, MYT).
- **Warna koridor malam:** K1 (2,03:1) dan K6 (2,35:1) di atas `#0F1B2A` perlu varian. K2 `#B5532F` nyaris sama dengan warna feri `#A2482A`: bedakan lewat garis putus.
- **Dulu vs Sekarang:** tidak ada berkas gambar arsip di paket, hanya info lisensi. Dari 14 perubahan fisik, 3 tanpa `place_ids` dan hanya Hang Nadim yang terverifikasi. Bangun daftar lebih dulu, peta kemudian.
- **Nama jalan:** 41 dari 61 penamaan tidak ada di `places.json`, `osm_name_bila_ada` kosong semua. Butuh tarikan Overpass.
- **Id berubah:** 5 id landmark seed berubah di `places.json`. Selalu lewat `places_id_index.json`, kecuali id halte.
- **Hotel:** dihitung dari `places.json` pada 4 Nov 2026: 33 dari 243 tanpa kecamatan (research/00 menulis 34). Tampilkan "kecamatan belum diketahui", jangan ditebak.
- **Teks yang hanya ada di laporan:** narasi profil 12 kampung dan catatan Rempang bertanggal (04), blok luas/investasi (15), statistik pasar/KUPVA (12). Ambil dari `research/` saat menulis halamannya.
