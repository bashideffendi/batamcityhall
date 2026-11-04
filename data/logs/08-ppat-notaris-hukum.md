# Log pemindahan: 08-ppat-notaris-hukum

- task_id: `wf-306cd9c5-0488-8f2f-89b3-675ce767e1e0`
- Judul: Direktori Profesi dan Jasa Administrasi Kota Batam: Seed Data PPAT, Notaris, Lahan, Bantuan Hukum, dan Jasa Dokumen
- Laporan `truncated: false`; 61 item `sources`, semuanya masuk `## Daftar sumber`.

## File yang dibuat
| File | Isi |
|---|---|
| `research/08-ppat-notaris-hukum.md` | Teks laporan verbatim + Daftar sumber (61) |
| `data/raw/08-ppat-notaris-hukum__1.json` | Satu-satunya blok ```json (seed), verbatim, 33 objek |
| `data/places/08-ppat-notaris-hukum.json` | 34 tempat (33 dari JSON + 1 dari teks) |
| `data/panduan/urusan_tanah.json` | Tabel "Kebutuhan warga → Ke mana → Catatan" (8 baris, nilai persis) + `urutan_jual_beli_rumah.langkah` (5 langkah) + `pengantar` + `masa_uwt_tahun` |
| `data/panduan/urusan_tanah.md` | Bagian "Ringkasan praktis: urusan tanah/rumah di Batam…" verbatim (pengantar, tabel, urutan jual-beli) |
| `data/taksonomi/skema_profesi.json` | Tabel "Skema data per kategori (usulan)", 11 baris (`kategori`, `atribut_khusus`, `tag_osm`, `sumber_terbaik`) |
| `data/panduan/cara_verifikasi_profesi.md` | Tiga blok verbatim: "Cara verifikasi PPAT/notaris" (bag. B), "Yang perlu dicatat" (bantuan hukum, bag. C), "Catatan per subkategori" (jasa dokumen, bag. D) |

## Jumlah
- Blok JSON: 1, valid tanpa perbaikan, 33 objek (cocok dengan teks laporan "Semua 33 entri").
- Tempat: 34.
  - kategori: 24 `pertanahan_hukum`, 10 `pemerintahan`.
  - `status_koordinat`: semua 34 `perlu_diisi_user`. Laporan sengaja mengosongkan semua koordinat.
  - `status_data`: 12 `terverifikasi`, 21 `perlu_cek_ulang`, 1 `null` (Kantor Imigrasi, tanpa label di laporan).
- Tabel tempat A–D: 33 baris. Urutan dan isinya sama dengan 33 objek JSON, jadi dipasangkan satu per satu (sudah dicek nama per nama).

## Masalah dan keputusan
1. **Kategori** mengikuti pemetaan tugas. Kategori laporan disimpan di `atribut.kategori_asli`.
   - PPAT, notaris, pejabat lelang kelas II, LBH, Posbakum, organisasi advokat, asosiasi konsultan pajak, dan KJPP → `pertanahan_hukum`.
   - BPN, BP Batam (pusat, LMS, PTSP), MPP, DPMPTSP, dan KPKNL → `pemerintahan`.
   - PLUT-KUMKM dan Diskum → `pemerintahan` dengan subkategori `umkm`. Subkategori aslinya disimpan di `atribut.subkategori_asli` (`pendampingan_umkm`, `dinas_umkm`).
2. **Kontak.** JSON memakai kunci tak standar (`wa_pengaduan`, `wa_konsultasi`, `wa_penataan`, `wa_ksb`, `wa_info_perizinan`, `wa_resmi_organisasi`, `call_center`, `telepon_pn`, `telepon_pa`).
   - Kunci itu dilebur ke `telepon`/`whatsapp` dengan label dalam kurung. Kalau ada beberapa nomor, dipisah dengan "; ".
   - Format nomor mengikuti JSON (`+62…`), bukan tabel.
   - Kontak tabel yang hanya berupa keterangan ("tidak dipublikasikan resmi", "belum ada telepon resmi", "belum ditemukan", dll.) disimpan di `atribut.catatan_kontak`.
3. **Field dipindah** dari `atribut`:
   - `status_data` → `status_data`;
   - `osm` → `tag_osm`;
   - `catatan` dan `catatan_kelurahan` → `catatan`.
4. **JSON diutamakan daripada tabel.** Ada konflik label: PTSP BP Batam dan KJPP ANR bertanda ✅ di tabel, tetapi `perlu_cek_ulang` di JSON. Yang dipakai label JSON.
5. **Wilayah yang diragukan:**
   - Kelurahan bertanda "(perlu cek)" di tabel: nilai JSON dipertahankan, dan keraguannya ditulis di `catatan` (23 entri).
   - Kecamatan `null`: Bambang Muchsinanto, LBH Peduli dan Harapan Bangsa, LBH Yayasan Suara Keadilan, IKPI, AKP2I, dan Kantor Imigrasi. Keterangannya ada di `catatan`.
6. **Pelengkap lain:**
   - `nama_alternatif` diisi dari nama tabel yang berbeda (8 entri).
   - `catatan_koordinat` diisi dari "Daftar entri yang koordinatnya belum pasti", misalnya "pin sama dengan MPP", "gedung MPP, Lt. 2/Lt. 3", dan "dua kandidat alamat".
   - Peringatan blog 2019 ("jangan pakai nomor SK") ditulis di `catatan` 7 entri PPAT yang `atribut.usang = "sumber 2019"`.
7. **Tempat tambahan dari teks.** Kantor Imigrasi Batam (`imigrasi-batam`; Jl. Engku Putri No. 3, (0778) 462069) hanya disebut di catatan biro jasa.
   - Kecamatannya `null` karena laporan tidak menyebutnya. `sumber_url` kosong.
   - Ditandai kemungkinan duplikat dengan riset kantor pemerintahan.
8. **`urusan_tanah.json`:**
   - Nilai disalin persis dari tabel, termasuk penanda `**tebal**` markdown (lihat `format_nilai`).
   - `tempat_terkait` dan `subkategori_terkait` adalah tautan tambahan dari saya, bukan isi laporan.
   - Baris Bapenda ditautkan ke `pub-bapenda` di `data/places/09-direktori-celah.json`, karena laporan 08 sendiri menyatakan alamat Bapenda tidak tercakup.
9. **`skema_profesi.json`:**
   - `atribut_kunci` diekstrak otomatis dari nama-nama ber-backtick.
   - `kategori_situs` adalah pemetaan saya ke enum situs, bukan isi laporan. Penerjemah tersumpah diberi `pertanahan_hukum` mengikuti kelompok bagian D. Pejabat lelang/KPKNL diberi dua kategori.
10. **`cara_verifikasi_profesi.md`:**
    - Blok "Catatan per subkategori" disalin utuh, termasuk konsultan pajak, KJPP, dan KJA, bukan hanya penerjemah/apostille/biro jasa/izin usaha. Tujuannya supaya tidak ada yang terpotong.
    - Judul H1/H2 penanda bagian ditambahkan, tetapi isinya verbatim.

## Hal di laporan yang tidak dipetakan ke file data (tetap ada di research md)
- **Angka profesi:** 139 notaris Batam (dari 268 se-Kepri, April 2025); 125 anggota IPPAT Batam (2022; 237 se-Kepri); "sekitar 140" (2025, wilayah tidak jelas); formasi notaris AHU 2025 = 0 kursi; 9 OBH terakreditasi Kepri; 597 + 190 PBH nasional. Tidak ada file statistik khusus untuk angka-angka ini.
- **PPAT Sementara (camat):** statusnya tidak diketahui, jadi tidak ada entri.
- **Pejabat Lelang Kelas II:** laporan menyebut 4 nama di daftar DJKN wilayah Batam, tetapi hanya 3 yang muncul di data (Wany Thamrin, Juli Cristie, Wida Delima Pandjaitan). Nama keempat tidak disebut.
- **Nama tanpa alamat:** KJPP Syarif, Endang & Rekan dan KJPP Toto Suharto & Rekan; ada juga alamat cabang Orchid Park, Mega Legenda, dan Orchid Point yang belum dicocokkan dengan nama. Laporan menyarankan mengambilnya langsung dari e-directory.mappi.or.id.
- **Disebut tanpa alamat**, jadi tidak dibuat entri: Bapenda (ada di laporan 09), KPP Pratama Batam Selatan (melayani bergiliran di MPP), dan Samsat.
- **KJA/KAP:** bertanda "TODO" di laporan.
- **Sengaja tidak dibuatkan daftar** oleh laporan: penerjemah tersumpah, biro jasa, dan advokat perorangan.
- **Rekomendasi UI:** MPP sebagai pin hub, label "Beta" untuk PPAT/notaris, badge BPHN setelah cek Sidbankum, kartu info untuk kecamatan pulau (Belakang Padang, Bulang, Galang), dan validasi ulang tiap 6 bulan. Semua ini ada di research md.
