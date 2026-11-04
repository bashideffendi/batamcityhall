# Paket handoff: Batam City Hall

Bahan lengkap untuk Claude Code membangun **Batam City Hall**, website kota indie dan non-komersial untuk Batam. Isinya 17 file riset, dataset yang sudah dirapikan, dan prompt kerja.

**Mulai dari sini:** buka Claude Code di folder paket ini (atau salin paket ini ke repo baru), lalu beri perintah:

> Baca `CLAUDE_CODE_PROMPT.md` dan ikuti seluruh instruksinya. Mulai dengan membaca semua file riset dan membuat `docs/COVERAGE.md` serta `docs/PLAN.md` sebelum menulis kode.

Disusun 4 November 2026.

---

## Isi paket

| Lokasi | Isi |
|---|---|
| `CLAUDE_CODE_PROMPT.md` | Prompt utama: cara kerja, peleburan hujandibatam & batam-bites (4.0), fitur wajib dengan kriteria selesai, stack, pipeline data, topik sensitif, privasi, fase, definisi selesai |
| `docs/COVERAGE_TEMPLATE.md` | Checklist 459 butir: peleburan situs lama, setiap judul bagian di 17 file riset, dan setiap file data. Disalin Claude Code menjadi `docs/COVERAGE.md` dan harus habis tercentang |
| `research/00-keputusan-percakapan.md` | Keputusan pemilik proyek (menang bila konflik dengan riset) + riset kecil di chat |
| `research/01…16-*.md` | 16 laporan riset, verbatim, lengkap dengan daftar sumber |
| `data/` | Dataset siap pakai (rincian di bawah) |
| `tools/` | Skrip penggabungan & impor koordinat |

### Laporan riset

| No | File | Topik |
|---|---|---|
| 00 | `00-keputusan-percakapan.md` | Identitas, nada, menu Loket, aturan Tukang Langganan, kategori direktori wajib, hal yang ditunda |
| 01 | `01-inspirasi-konsep.md` | Contoh situs kota & direktori hyperlocal, konsep lengkap, roadmap |
| 02 | `02-teknik-mural-peta.md` | Mural interaktif (OpenSeadragon, tile, TPS), peta artsy, GEBCO, arsitektur |
| 03 | `03-landmark-jalur-mural.md` | 8 segmen mural, 44 landmark, ikon prioritas, topik sensitif |
| 04 | `04-kampung-tua.md` | 56 entri kampung tua, profil, kronologi legalitas netral, etika |
| 05 | `05-panduan-gaya.md` | Style guide, token desain, tipografi, warna Riso, microcopy, logo |
| 06 | `06-direktori-taksonomi.md` | Taksonomi direktori, tag OSM, skema SQL, query Overpass, angka resmi |
| 07 | `07-direktori-layanan-publik.md` | Kecamatan/kelurahan, puskesmas, RS, kantor, polsek, damkar |
| 08 | `08-ppat-notaris-hukum.md` | Urusan tanah ke mana, PPAT/notaris, bantuan hukum, KJPP |
| 09 | `09-direktori-celah.md` | KUA, pos, dinas, klinik/lab/apotek, ibadah non-masjid, SPBU/SPKLU, pompong |
| 10 | `10-trans-batam.md` | 10 koridor, 191 halte, info praktis, desain peta transit |
| 11 | `11-geoportal.md` | Hang Jebat, Geoportal BP Batam, Ina-Geoportal: data yang bisa diambil |
| 12 | `12-ruang-publik-olahraga-jasa.md` | Taman, pantai, wisata, olahraga (padel/badminton/futsal/gym), belanja, jasa |
| 13 | `13-budaya-kalender-kamus.md` | Kalender acara, budaya Melayu, kamus, komunitas, fakta infografis |
| 14 | `14-feri-pompong.md` | 23 terminal/pelantar, rute, 47 jadwal, info menyeberang |
| 15 | `15-sejarah-arsip.md` | 49 peristiwa garis waktu, asal nama, perubahan fisik, arsip foto |
| 16 | `16-tokoh-nama-jalan.md` | 46 tokoh, 61 penamaan tempat, relasi antartokoh |

### Data utama: tempat

| File | Isi |
|---|---|
| `data/places.json` | **775 tempat** (dari 887 entri sebelum digabung), skema seragam, sumber utama direktori & peta |
| `data/places_stats.json` | Statistik per kategori, status koordinat, kecamatan, laporan; masalah validasi (saat ini 0) |
| `data/places_konflik.json` | 63 konflik antarsumber (koordinat beda >300 m, alamat/kecamatan beda) untuk diputuskan |
| `data/places_id_index.json` | Peta id apa pun → id kanonik (dipakai file domain yang menyimpan id asli laporan) |
| `data/koordinat_perlu_diisi.csv` | 763 tempat yang koordinatnya belum pasti, urut prioritas, dengan tautan Google Maps |
| `data/koordinat_user.json` | Koordinat yang sudah diisi pemilik proyek (kosong sekarang) |
| `data/places/*.json` | Tempat per laporan sebelum digabung (17 file) |

Per kategori: akomodasi 243 · pemerintahan 103 · kampung_tua 59 · transportasi 50 · kesehatan 45 · olahraga 39 · belanja 33 · layanan_publik 32 · keamanan_darurat 29 · pertanahan_hukum 28 · ibadah 20 · jasa 16 · landmark 15 · lainnya 13 · pendidikan 12 · wisata 9 · pemakaman 8 · ruang_publik 8 · budaya 6 · perpustakaan 4 · khas_batam 3.

Status koordinat: 9 terverifikasi · 110 perlu cek ulang · 656 perlu diisi.

### Data domain

| Folder | File (jumlah entri) |
|---|---|
| `design/` | `design_tokens.css`/`.json`, `tipografi_skala.json` (11), `tinta_riso.json` (13), `palet_ui.json`, `layer_peta_warna.json` (14 layer), `microcopy.json`, `boleh_jangan.md`, `moodboard.md` |
| `mural/` | `segmen.json` (8), `landmarks.json` (44), `ikon_prioritas.json` (30), `elemen_tabel_tanpa_seed.json`, `topik_sensitif.md` |
| `kampung_tua/` | `kampung_tua.json` (56), `sumber_jumlah.json`, `kronologi_legalitas.json` (20), `panduan_etika.md`, `narasumber_arsip.md` |
| `trans_batam/` | `koridor.json` (10), `halte.json` (191 halte, 13 pola, 11 titik transit), `info_praktis.json`, `desain_peta.md`, `halte_koordinat_perlu_diisi.csv` (191) |
| `feri/` | `terminal.json` (23), `rute.json` (23 + 10 tambahan), `jadwal.json` (47), `info_praktis.md` |
| `sejarah/` | `garis_waktu.json` (49), `sumber_arsip.json` (11), `data_penduduk.json` (11), `perubahan_fisik.json` (14), `data_wisman.json`, `asal_usul_nama.md`, `bacaan_lanjutan.md` |
| `tokoh/` | `tokoh.json` (46), `penamaan.json` (61), `relasi.json` (23), `profil_tokoh.md` |
| `budaya/` | `acara.json` (34), `kamus.json` (65), `komunitas.json` (12), `tradisi_melayu.json` (15), `fakta_infografis.json` (68 angka), `budaya_melayu.md` |
| `taksonomi/` | `taksonomi.json` (59 kategori), `skema_profesi.json`, `12-sumber_dan_tag_osm.json` |
| `panduan/` | `urusan_tanah.json`/`.md`, `cara_verifikasi_profesi.md`, `09-rute_pompong.json`, `09-nomor_darurat.json` |
| `darurat/` | `nomor_darurat.json`, `nomor_darurat_09.json` |
| `sumber_data/` | `geoportal.json` (44 dataset), `endpoint.json` (98 endpoint) |
| `statistik/` | `angka_resmi.json` (42 angka) |
| `wilayah/` | `kelurahan.json` (12 kecamatan dan kelurahannya) |
| `osm/overpass/` | 11 query Overpass (direktori, halte & rute bus, terminal & jalur feri) |
| `schema/` | `tempat.sql` (dasar skema Supabase/PostGIS) |
| `akomodasi/` | `hotel.csv` (nama, kelas, alamat, status; tanpa data pajak) |
| `referensi/` | situs inspirasi, direktori hyperlocal, perbandingan library mural, temuan kunci mural |
| `komunitas/` | `sumber_rekomendasi_warga.json` (sengaja kosong; Tukang Langganan diisi warga) |
| `snippets/` | potongan kode dari laporan 02 dan 11 |
| `raw/` | 18 blok JSON verbatim dari laporan |
| `logs/` | catatan pemindahan per laporan (termasuk hal yang tidak bisa dipetakan) |

---

## Cara pakai tools

```bash
# gabungkan ulang semua data/places/*.json → data/places.json (+ konflik, statistik, indeks, CSV)
python3 tools/merge_places.py

# masukkan koordinat yang sudah diisi pemilik proyek
python3 tools/import_koordinat.py data/koordinat_perlu_diisi.csv
python3 tools/import_koordinat.py data/trans_batam/halte_koordinat_perlu_diisi.csv
```

**Mengisi koordinat (untuk pemilik proyek):** buka CSV di Google Sheets/Excel. Kerjakan dari prioritas 1 (layanan darurat, kesehatan, transportasi, pemerintahan) sampai 5 (hotel). Klik tautan `cari_di_google_maps`, klik kanan titiknya di Google Maps, salin angka koordinat, lalu tempel ke kolom `lat` (format `1.1234, 104.0567` boleh ditempel utuh di kolom `lat`). Untuk baris yang sudah punya koordinat perkiraan (`perlu_cek_ulang`) dan ternyata sudah benar, ubah kolom `status_koordinat` menjadi `terverifikasi`. Simpan sebagai CSV dengan nama yang sama.

**Duplikat:** kalau menemukan dua entri untuk tempat yang sama, tambahkan grup di `tools/merge_aliases.json`, lalu jalankan `merge_places.py` lagi.

---

## Celah yang diketahui (harus ditangani Claude Code atau dicatat sebagai TODO)

1. **Koordinat:** sebagian besar tempat (656) dan hampir semua halte (181 dari 191) belum punya koordinat. Pemilik proyek akan mengisinya. Website harus tetap berfungsi dengan daftar tanpa pin. Koordinat 10 halte yang ada adalah titik landmark, bukan posisi halte.
2. **RSS berita Batam belum diriset.** Claude Code menelusuri feed sendiri (bagian 4.8 prompt).
3. **Panduan warga baru belum diriset** (ditunda pemilik proyek).
4. **Riset hukum (privasi, UU PDP, hak cipta foto, tanggung jawab rekomendasi) ditunda.** Pakai default konservatif di bagian 7 prompt dan tandai draf kebijakan "belum ditinjau ahli hukum".
5. **Daftar sumber laporan 15 dan 16 terpotong di 100 item** oleh tool riset. Teks laporan utuh; 22 (laporan 15) dan 24 (laporan 16) URL yang dikutip di teks tidak masuk daftar sumber, tetapi tetap ada di teks dan file domain.
6. **Kamus:** 35 dari 65 entri bertanda `[P]` (pengamatan umum, perlu divalidasi warga/ahli bahasa). Tampilkan dengan label, jangan diklaim "khas Batam saja".
7. **Konflik data:** 63 konflik di `places_konflik.json`, termasuk koordinat Pelabuhan Telaga Punggur (BP Batam vs Wikidata) dan Nongsapura. Putuskan dan catat di `docs/DATA_DECISIONS.md`.
8. **Hotel:** 33 hotel belum punya kecamatan. Jangan ditebak.
9. **Data cepat usang:** padel, jadwal feri, tarif, dan daftar halte berubah cepat. Tampilkan tanggal data dan tombol koreksi.
10. **Ilustrasi mural** belum ada. Pakai placeholder berlabel sampai ilustrasi dari pemilik proyek/ilustrator tersedia.
11. **Peleburan hujandibatam & batam-bites** (bagian 4.0 prompt): kedua repo publik di `github.com/bashideffendi/hujandibatam` dan `github.com/bashideffendi/batam-bites`. Kode dipindah dan diadaptasi, bukan ditulis ulang. Situs lama dialihkan hanya setelah paritas lengkap dan izin pemilik proyek. Semua 117 koordinat batam-bites masih perkiraan area.

## Aturan data yang tidak boleh dilanggar

- Jangan menebak koordinat. Jangan mengarang data.
- Data hotel hanya nama, kelas, alamat, status. Data pajak (NPWPD, NOP, nilai pajak, nomor SSPD/SPTPD) sengaja tidak ada dan tidak boleh ditambahkan.
- Kontak yang tampil hanya kontak resmi kantor/usaha/organisasi. Tidak ada nomor HP pribadi.
- Topik sensitif (Rempang, kampung tua, kamp pengungsi Galang, cerita rakyat, agama/etnis) mengikuti bagian 6 prompt.
