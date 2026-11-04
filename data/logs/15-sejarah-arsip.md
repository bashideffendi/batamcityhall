# Log pemindahan: 15-sejarah-arsip

- task_id: `wf-fbd49390-86f6-8747-ae88-88f191e3e91d`
- Judul: Sejarah Batam: Garis Waktu, Asal Nama, Perubahan Kota, Arsip Foto, dan Data Infografis
- Tool mengembalikan `truncated: true`. Teks laporan tampak utuh: berakhir dengan blok JSON lengkap lalu paragraf *Catatan JSON*. Yang kemungkinan terpotong adalah daftar `sources`, karena isinya tepat 100 item. Semua 100 item masuk `## Daftar sumber`. Ada 22 URL yang dikutip di teks tetapi tidak ada di daftar `sources`; URL itu tetap ada di teks verbatim dan di file domain.

## File yang dibuat
| File | Isi |
|---|---|
| `research/15-sejarah-arsip.md` | Teks laporan verbatim (TL;DR, Key Findings, §1–§6, Caveats, Blok Data JSON, Catatan JSON) + Daftar sumber (100) |
| `data/raw/15-sejarah-arsip__1.json` | Satu-satunya blok ```json, verbatim: `garis_waktu` 31, `sumber_arsip` 11, `data_penduduk` 10 |
| `data/places/15-sejarah-arsip.json` | 14 tempat |
| `data/sejarah/garis_waktu.json` | 49 entri: 31 dari JSON (dilengkapi kolom tabel §1) + 18 baris yang hanya ada di tabel (`gw-t01`–`gw-t18`), urut sesuai tabel |
| `data/sejarah/sumber_arsip.json` | 11 entri JSON (`sa-01`–`sa-11`) + kolom tabel §4 |
| `data/sejarah/data_penduduk.json` | 11 entri: 10 dari JSON + 1 baris yang hanya ada di tabel (2024 Semester I, 1.294.548, Disdukcapil) |
| `data/sejarah/perubahan_fisik.json` | 14 baris tabel §3 (`pf-01`–`pf-14`): lokasi, dulu, sekarang, tahun_kunci, status, sumber_url, place_ids |
| `data/sejarah/data_wisman.json` | **Tambahan di luar mapping**: tabel wisman §6 (4 baris), karena tabel ini tidak punya versi JSON |
| `data/sejarah/asal_usul_nama.md` | §2 verbatim (tabel versi nama + daftar nama tempat penting) |
| `data/sejarah/bacaan_lanjutan.md` | §5 verbatim (tabel bacaan + *Celah*) |

## Jumlah
- Blok JSON: 1, valid tanpa perbaikan.
- Tempat: 14. Semua `lat`/`lng` null dengan `status_koordinat: perlu_diisi_user` (laporan tidak memberi koordinat). Semua `kecamatan` null.
- `status_data`: 9 `terverifikasi`, 5 `perlu_cek_ulang` (⚠️ = beda versi tahun: Waduk Nongsa, Sei Ladi, Muka Kuning, Duriangkang, Bandara Hang Nadim).

## Masalah dan keputusan
1. **Penggabungan garis waktu.** Entri JSON dicocokkan dengan baris tabel lewat kolom Tahun/Tanggal (pemetaan manual 1:1, semuanya unik). Field JSON tidak diubah. Kolom tabel ditambahkan sebagai `tahun_tabel`, `peristiwa_tabel`, `penjelasan` (teks lengkap), dan `status_tabel` (simbol asli). `sumber_url` berisi gabungan URL JSON dan URL tabel. `sumber_entri` bernilai `json+tabel` atau `tabel`.
2. **Baris yang hanya ada di tabel (18).**
   - `id` `gw-tNN` dibuat agen.
   - `deskripsi`, `tokoh`, dan `kategori` diisi `null` karena tidak ada di laporan. Untuk teks, pakai `penjelasan`.
   - `status_verifikasi` dipetakan dari legenda laporan (✅/⚠️/📜/❓) hanya kalau simbolnya tunggal. Status campuran (1942–1945: "✅ (konteks) / ❓ (detail)") → `null`.
   - ⚠️ bertanda "dikutip sekunder"/"klaim lembaga" → `perbedaan_versi`, mengikuti legenda dan konvensi JSON laporan (gw-028). Teks aslinya tetap ada di `status_tabel`.
   - `tanggal` ISO hanya diisi untuk tanggal lengkap: 1857-12-01 dan 1974-06-29.
   - Baris 1963–1966 tidak punya URL sumber ("— (perlu riset lanjutan)"), jadi `sumber_url: []` dan sumbernya dicatat di `catatan`.
3. **Penanda tebal `**` dibuang** dari nama lembaga/lokasi dan dari kolom "boleh dipakai ulang". Teks lainnya verbatim.
4. **data_penduduk.** `sumber_url` tetap string, seperti di JSON laporan. Kolom tabel ditambahkan sebagai `periode_tabel`, `jumlah_tabel`, dan `catatan`. Laporan menyarankan field `metode` ("proyeksi_bps"/"registrasi_disdukcapil"/"perkiraan_populer") "di sisi kode"; field ini tidak ditambahkan karena laporan tidak memberi nilainya per baris. Kolom `catatan` sudah memuat dasar klasifikasinya.
5. **data_wisman.** `jumlah` diambil dari angka di awal sel. Untuk 2023 nilainya `null` karena selnya berisi rentang "sekitar 1,1–1,19 juta (beda sumber)". Rincian 2024/2025 tetap di `kunjungan_tabel`.
6. **Places: kecamatan selalu null.** Laporan ini tidak pernah menyebut kecamatan untuk tempat-tempat tersebut; lokasi tekstual disimpan di `atribut.lokasi_disebut`/`catatan`. Waduk dan KEK diberi kategori `lainnya` (subkategori `waduk`/`kawasan_ekonomi_khusus`) karena tidak ada enum yang cocok.
7. **ID tempat sengaja disamakan dengan laporan lain** untuk tempat fisik yang sama, supaya penggabungan bisa dedupe per `id`:
   - `jembatan-barelang`: juga di 01 dan 05;
   - `bandara-hang-nadim`, `pelabuhan-sekupang`, `pelabuhan-batu-ampar`, `kamp-pengungsi-galang`: juga di 03;
   - `bandara-hang-nadim` dan `makam-temenggung-abdul-jamal`: juga di 16.

   Penggabung jangan menimpa entri secara buta, karena isi tiap entri berasal dari laporan berbeda (`sumber_riset`).
8. Bandara Hang Nadim: teks menyebut profil iNews.id tanpa URL. URL iNews diambil dari daftar `sources`.
9. Waduk Nongsa: `nama_alternatif` "Dam Nongsa" diambil dari baris "Lahirnya nama Nagoya" (pekerja Taisei membangun Pelabuhan Batu Ampar dan Dam Nongsa).
10. `perubahan_fisik.place_ids` menautkan ke `data/places/15-sejarah-arsip.json`. Nilainya `[]` untuk kawasan (Nagoya/Lubuk Baja, Batam Centre, Pesisir utara 1847).

## Hal yang tidak dipetakan / sengaja tidak dimasukkan
- **Tidak dijadikan tempat:**
  - kawasan Nagoya/Lubuk Baja/Teluk Jodoh, Batam Centre, dan kampung pesisir peta 1847 (Teloek Tring, Sungai Senimba, dll.);
  - Nagoya Hill, Turi Beach, dan Nongsa Point Marina (hanya disebut sebagai contoh/konteks "dulu");
  - KEK Batam Aero Technic, Tanjung Sauh, dan Pariwisata-Kesehatan (tanpa lokasi);
  - Kompleks Makam Zuriat Nong Isa dan Museum Batam Raja Ali Haji (lokasinya tidak disebut di laporan ini; keduanya ada di places 16);
  - gedung Otorita/kantor wali kota awal 1990-an (tanpa nama spesifik);
  - Bukit Kerang Kawal Darat (di Bintan, di luar Batam);
  - Rempang Eco City (rencana; laporan sengaja tidak membahas aspek lahannya).
- **Peringatan laporan yang dijalankan:**
  - reklamasi: "belum ditemukan sumber ... jangan dibuat pin sebelum ada data", sehingga tidak ada entri perubahan_fisik untuk reklamasi;
  - angka Databoks 1,79 juta (2025) "sebaiknya tidak dipakai", sehingga tidak masuk data_penduduk.
- **Hanya ada di research md, tanpa file domain:** TL;DR, Key Findings, bullet "Luas wilayah, lahan, dan investasi" (415/715/1.034,73 km², lahan Hang Nadim, KEK, investasi), Caveats, dan *Catatan JSON*.
