# Log pemindahan: 04-kampung-tua

- task_id: `wf-53f818cd-96c6-5733-bd7f-b2fab18bdc30`
- Judul: Peta Kampung Tua Batam: Riset Konten dan Seed Data untuk Batam City Hall
- Laporan `truncated: false`; 53 item `sources`, semuanya masuk `## Daftar sumber`.

## File yang dibuat
| File | Isi |
|---|---|
| `research/04-kampung-tua.md` | Teks laporan verbatim (§TL;DR, §1–§7, Caveats) + Daftar sumber (53) |
| `data/raw/04-kampung-tua__1.json` | Satu-satunya blok ```json di laporan (seed), verbatim, 56 objek |
| `data/places/04-kampung-tua.json` | 56 tempat, kategori `kampung_tua` |
| `data/kampung_tua/kampung_tua.json` | Salinan byte-identik `data/raw/04-kampung-tua__1.json` |
| `data/kampung_tua/sumber_jumlah.json` | Tabel §1 "Kenapa jumlahnya beda-beda?", 9 baris (`angka`, `sumber`, `konteks`) |
| `data/kampung_tua/kronologi_legalitas.json` | Tabel kronologi §4, 20 baris (`tanggal`, `peristiwa`, `siapa_bilang`) |
| `data/kampung_tua/narasumber_arsip.md` | §5 verbatim (identik dengan bagian itu di research md) |
| `data/kampung_tua/panduan_etika.md` | §6 verbatim, termasuk badge ketidakpastian |

## Jumlah
- Blok JSON: 1 (valid tanpa perbaikan).
- Tempat: 56 = 37 mainland (`kt-*`) + 16 Rempang–Galang (`rg-*`) + 3 hinterland (`hl-*`).
  - `status_koordinat`: 50 `perlu_cek_ulang` (ada angka, estimasi kasar), 6 `perlu_diisi_user` (kt-air-raja, kt-seranggong, rg-sijantung, rg-air-lingka, rg-kampung-baru, rg-tanjung-pengapit).
  - `status_data`: 38 perlu_cek_ulang, 9 terverifikasi, 6 sumber_tunggal, 3 cerita_rakyat.
  - Tidak ada satu pun koordinat `terverifikasi`.

## Masalah dan keputusan
1. **Jumlah seed tidak cocok dengan teks laporan.** §7 menyebut "55 entri: 36 entri lapisan mainland…", tetapi blok JSON berisi **56** objek (37 `kt-*`). Isi blok cocok dengan tabel §2 (36 baris kecamatan + Seranggong = 37). Jadi yang salah hitung adalah teks laporannya. Blok disalin verbatim (56). Teks §7 di research md tidak diubah.
2. **`status_data` dari status campuran.** Untuk 11 entri, `status_verifikasi` berisi beberapa label, misalnya "terverifikasi (sejarah); tahun wafat Nong Isa perlu_cek_ulang". `status_data` diambil dari label pertama. String aslinya disimpan di `atribut.status_verifikasi_asli` dan dikutip di `catatan`.
3. **Kecamatan di luar enum → `null`.** Ini berlaku untuk kt-air-raja (asli "Batu Ampar (menurut daftar, janggal)", disimpan di `atribut.kecamatan_asli`) dan kt-seranggong (null di laporan).
4. **Kelurahan yang diragukan.** Anotasi "(perlu dicek)" dibuang dari nama kelurahan. Nilai "perlu dicek" atau yang dinilai janggal menjadi `null`. Nilai asli disimpan di `atribut.kelurahan_asli` dan keraguannya ditulis di `catatan`. Ada 14 entri yang terdampak.
5. **Pelengkap dari tabel §2 / profil §3** (hanya mengisi yang kosong di JSON, nilai verbatim):
   - `atribut.asal_usul_nama` diisi dari tabel untuk kt-panglong, kt-teluk-nipah, kt-tembesi, kt-dapur-12, dan kt-patam-lestari. Semuanya berlabel "dugaan"/"tak jelas" dan ditandai `atribut.diisi_dari_tabel`.
   - URL tambahan di `sumber_url`:
     - S1 (Tribun) untuk kt-teluk-mata-ikan dan kt-kampung-melayu-batu-besar;
     - GoWest (Rumah Limas Potong) untuk kt-kampung-melayu-batu-besar;
     - Batam Pos 2021 untuk kt-tanjung-riau;
     - BKKBN untuk kt-bagan;
     - STPN untuk kt-setengar.
   - `atribut.lokasi_profil` dan `atribut.profil_laporan` diisi untuk 14 entri yang punya profil di §3. Isinya teks "Lokasi:" verbatim, termasuk petunjuk arah Tanjung Riau.
6. **Isi tabel yang sengaja tidak dimasukkan ke field tampilan:**
   - Sel "Yang bisa dilihat" Setengar ("STPN menyebut warga Setenga pernah direlokasi masa Otorita") adalah topik relokasi/lahan. Sel ini dipindah ke `catatan` sebagai catatan internal, bukan untuk kartu.
   - Sel Telaga Punggur ("Dekat Pelabuhan Telaga Punggur") sudah tercakup di `ringkasan`.
   - Placeholder tabel ("Belum ditemukan", "Perlu dicek", "Perlu cek lapangan", "–") tidak dipakai untuk mengisi null.
7. **`catatan` di semua 56 entri diawali** "Jangan tampilkan batas, luas, atau status lahan." Untuk `rg-*` ditambahkan kalimat netral Rempang yang disarankan laporan (§4) beserta anjuran menautkan Ombudsman dan BP Batam.
8. **Format angka.** Koordinat di places ditulis ulang oleh serializer JSON, sehingga nol di belakang koma hilang (1.190 → 1.19). Nilainya identik. File raw dan `kampung_tua.json` tetap mempertahankan teks aslinya.
9. **Sel tabel yang memuat markdown.** Sel di `sumber_jumlah.json` dan `kronologi_legalitas.json` disalin persis, termasuk penanda `**tebal**` dan URL yang ada di dalam sel `konteks`. Tidak ada field URL terpisah yang ditambahkan.
10. **`subkategori`** diturunkan dari tiga lapisan yang didefinisikan laporan: `kampung_tua_mainland`, `kampung_tua_rempang_galang`, dan `situs_kampung_lama_hinterland`. Tiga entri hinterland tetap berkategori `kampung_tua` sesuai instruksi, walaupun laporan menyebut status kampung tuanya perlu dicek.
11. Koordinat Rempang tidak diberi klaim "±1–3 km", karena klaim itu hanya disebut untuk tabel §2. Koordinat Rempang hanya muncul di JSON §7.

## Hal di laporan yang tidak dipetakan sebagai tempat terpisah
- **Sub-situs di dalam kampung.** Laporan menyebutnya di `yang_bisa_dilihat`/profil tanpa koordinat sendiri:
  - Kompleks Makam Zuriat Raja Isa; Rumah Limas Potong; Masjid At Taubah; Masjid Baitussyakur dan Bukit Kubur;
  - Makam Temenggung Abdul Jamal dan Makam Raja Maimunah; Perigi Batu Pulau Buluh;
  - Gapura Adat Tanjung Bemban; pelantar lingkar/taman atas laut Tanjung Riau;
  - Kantor Camat, Gedung Nasional, dan Kompleks Angkatan Laut lama di Belakang Padang;
  - monumen eks tentara Jepang di Sembulang.

  Beberapa di antaranya cagar budaya (SK 483/2022). Kandidat untuk dataset budaya/landmark kalau nanti ada riset koordinatnya.
- **Tempat yang hanya disebut sebagai rujukan:** Bandara Hang Nadim, Pelabuhan Telaga Punggur, Jembatan Barelang, Pulau Putri, Stadion Temenggung Abdul Jamal, Museum Raja Ali Haji, Hotel AP Premier, dan bekas kamp pengungsi Vietnam di Galang (laporan menegaskan kamp ini bukan kampung tua).
- **Toponim "Kisah Nama Tempat"** (Jodoh, Sekupang, Batu Aji, Kabil, Muka Kuning). Laporan menyatakan ini bukan pin kampung tua. Teksnya ada di research md §3.
- **Kampung yang "sudah berkurang"**, yaitu Sungai Kasam dan Ketapang (§1). Tidak masuk seed.
- **Rincian Sembulang** (Sembulang Hulu, Tanjung Gemuk, Air Lingseng, Sembulang Tanjung, Pasir Merah). Hanya ada di profil §3 no. 12 dan `ringkasan` rg-sembulang.
- **Kriteria kampung tua dan definisi Perda 2/2004** (§1) berupa daftar/prosa, bukan tabel. Hanya ada di research md.
- **Daftar 37 resmi belum lengkap:** 1–2 entri gagal dipulihkan menurut laporan, dan lampiran SK 105/2004 / SK 89/2006 tidak ditemukan daring.
