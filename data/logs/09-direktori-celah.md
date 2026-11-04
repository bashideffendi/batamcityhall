# Log pemindahan: 09-direktori-celah

- task_id: `wf-c44b0f7c-d7dc-821b-b2f4-992da004e4f7`
- Judul: Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, dan Transportasi (Riset Celah, November 2026)
- Laporan `truncated: false`; 71 item `sources`, semuanya masuk `## Daftar sumber`.

## File yang dibuat
| File | Isi |
|---|---|
| `research/09-direktori-celah.md` | Teks laporan verbatim + Daftar sumber (71) |
| `data/raw/09-direktori-celah__1.json` | Satu-satunya blok ```json, verbatim, 65 objek |
| `data/places/09-direktori-celah.json` | 65 tempat: 64 dari JSON (tanpa `trp-rutepemping`) + 1 dari teks (RS BP Batam) |
| `data/panduan/09-nomor_darurat.json` | Tabel E "Nomor Darurat dan Pengaduan" (6 entri, nilai persis) + metadata. Baris 119 dilengkapi dari tabel B |
| `data/darurat/nomor_darurat_09.json` | Entri yang sama, sebagai array polos (tiap entri punya `sumber_riset`) |
| `data/panduan/09-rute_pompong.json` | 4 rute pompong/pancung: Sekupang–Belakang Padang (tarif, tarif carter, tarif lama), Pulau Geranting–Belakang Padang, Sagulung–Pulau Buluh/Bulang, Pemping/Terong/Pecung. Berisi `keterangan_tabel` persis dari tabel D, catatan tarif swadaya, dan daftar yang belum diriset |

## Jumlah
- Blok JSON: 1, valid tanpa perbaikan, 65 objek (cocok dengan teks laporan "65 entri baru").
- Tempat: 65.
  - kategori: 21 `layanan_publik` (9 kantor pos + 12 KUA), 19 `transportasi` (5 pelabuhan/terminal + 14 SPKLU), 11 `pemerintahan`, 6 `ibadah`, 5 `keamanan_darurat`, 2 `kesehatan`, 1 `pemakaman`.
  - `status_koordinat`: 58 `perlu_diisi_user`, 7 `perlu_cek_ulang` (DPRD, Disdik, KUA Batu Aji, 3 paroki, TMP). Tidak ada yang `terverifikasi`.
  - `status_data`: 9 `usang`, 14 `perlu_cek_ulang`, 42 `null`.

## Masalah dan keputusan
1. **Kategori.** JSON memberi `layanan_publik` untuk semua kantor. Saya pilih kategori yang lebih cocok, dan kategori asli disimpan di `atribut.kategori_asli`:
   - Kantor Pemko dan instansi vertikal (Wali Kota, DPRD, Bapenda, Dishub, Dinsos, Dinkes, Disdik, Disnaker, Kemenag, KSOP, UPT Trans Batam) → `pemerintahan`. Ini sejalan dengan laporan 07 dan pemetaan laporan 08.
   - BPBD, Pos SAR, Kodim, Kodaeral IV, dan Lanud → `keamanan_darurat`.
   - TMP → `pemakaman` (aslinya `ibadah`).
   - Kantor pos dan KUA tetap `layanan_publik`.
2. **Kontak berupa string** dipecah manual ke `telepon`/`whatsapp`/`email`/`website`.
   - Nomor fax (Bapenda, Dinkes, KSOP) disimpan di `atribut.fax`.
   - Nomor 115 untuk Pos SAR disimpan di `atribut.nomor_darurat`, karena bukan kontak kantor. Telepon KPP Tanjungpinang tetap di `telepon` dengan label.
   - Kontak TMP "via Dinsos PM" → `atribut.pengelola` + `atribut.kontak_pengelola`.
   - "PLN Mobile" untuk SPKLU → `atribut.aplikasi`.
   - Website Paroki Santo Damian (santodamian.com) diambil dari tabel.
   - Telepon Kantor Pos KCU dilengkapi dari tabel menjadi "462496 / 462033".
3. **`sumber_url`** diubah dari string menjadi array, lalu ditambah URL dari kolom Sumber tabel (18 entri bertambah).
   - Semua 12 KUA diberi URL daftar Kanwil Kemenag Kepri, karena laporan menyebutnya sebagai sumber utama.
   - `sumber_url` null (Gold Coast, UPT Trans Batam) → `[]`. Untuk Gold Coast, nama sumber tanpa URL (Ulasan.co, BatamToday, BatamNow) ditulis di `catatan`.
4. **`status_data`.** Laporan tidak memberi label status data per entri; legenda ✅/⚠️/❓ hanya berlaku untuk koordinat. Aturan yang saya pakai:
   - `atribut.usang: true` → `usang`. Ini mengenai Disnaker dan 8 kantor pos cabang.
   - `usang_mungkin` dan semua KUA → `perlu_cek_ulang`, karena daftar Kanwil dibuat sekitar 2017 dan laporan menulis "tandai mungkin usang". Kata "mungkin usang" ditulis di `catatan`.
   - Selebihnya `null`.
   - Flag `usang`/`usang_mungkin` dihapus dari `atribut` karena sudah terwakili di `status_data`.
5. **Koordinat.** Tujuh entri punya angka koordinat. Angkanya disalin persis dengan status `perlu_cek_ulang`, dan asalnya ditulis di `catatan_koordinat` (idalamat.com yang dianggap kasar, Wikipedia, atau plus code yang dihitung sendiri oleh peneliti).
6. **Pelengkap dari tabel** ke `catatan`:
   - kelurahan "(perlu dicek)" (22 entri);
   - nomor telepon lama (2014/2017) atau dari direktori pihak ketiga;
   - alamat versi lain (KUA Batu Ampar No.3, KUA Sekupang Jl. Masjid Raya Baiturrahman);
   - bentrok alamat KUA Batu Aji dan KUA Sagulung;
   - peringatan situs tidak resmi (Disdik, BPBD, Dinsos);
   - perubahan Lanal Batam menjadi Kodaeral IV;
   - status Pos SAR.

   Selain itu: `nama_alternatif` diisi untuk 12 entri; `atribut` ditambah durasi, kapasitas, dan tarif pompong dari tabel D; SIMKAH (`daftar_nikah`) ditambahkan ke semua KUA.
7. **Bukan tempat.** `trp-rutepemping` ("Rute pompong Pulau Pemping / Terong / Pecung", di tabel tertulis "non-lokasi") hanya dimasukkan ke `09-rute_pompong.json`. Baris "Ambulans/gawat darurat 119" (tabel B) digabung ke entri 119 di file nomor darurat.
8. **Tempat tambahan dari teks.** RS BP Batam (`kes-rs-bp-batam`; Jl. Cipto Mangunkusumo No.1, Tj. Pinggir, Sekupang, (0778) 322121) disebut di bagian B sebagai titik awal klinik jiwa. Laporan sendiri menyebut RS ini sudah ada di data RS, jadi ditandai kemungkinan duplikat.
9. **`09-rute_pompong.json`:**
   - Rute feri internasional Gold Coast–Stulang Laut tidak dimasukkan, karena bukan pompong; datanya tetap di `atribut.rute` tempat `trp-goldcoast`.
   - Tarif carter dan tarif lama Rp18.000 diambil dari teks "Ringkasan singkat".
   - Bagian ini dan `id`/`tempat_*_id` adalah tautan dari saya.

## Hal di laporan yang tidak dipetakan ke file data (tetap ada di research md)
- **SPKLU yang hanya disebut namanya:** Kantor Disyan 1 dan 2, Taman Golf Residence, showroom BYD, Kantor PP Polri, Metro Showroom, Kongkow Driving Range, Grand Mercure. Laporan menyarankan menambahkannya lewat PLN Mobile. Total resminya 26 unit; data baru memuat 14 titik.
- **Terminal Batam Centre:** lintang di situs BP Batam (01°17'15" LU) kemungkinan salah ketik. Terminal ini bukan entri di laporan ini, jadi perlu dicek di data transportasi lain (laporan 07/10).
- **RSUD Embung Fatimah (poli jiwa):** disebut tanpa alamat. Laporan menyebutnya sudah ada di data RS.
- **Lanal Batam:** tidak dibuat entri karena sudah pindah ke Tanjung Uban sebagai Lanal Bintan. Ini dicatat di Kodaeral IV.
- **Situs tidak resmi** yang jangan dipakai sebagai sumber: disdikkotabatam.org, disdikbatampemkot.com, bpbd.damkarbatam.com.
- **Celah yang belum diriset** (daftar kerja laporan): klinik 24 jam, lab klinik (Prodia/Kimia Farma/Pramita), apotek 24 jam, klinik hewan, psikolog RS, gereja Protestan (HKBP, GBI, GPdI, GKPS, GMIM, GKI, Bethel), klenteng/vihara tambahan, masjid besar per kecamatan, terminal bus, pool travel, SPBU, UPT Trans Batam (alamat), Pulau Kasu, dan Pulau Terong (rute spesifik).
- **SIBIJAK Ngemall** (layanan jemput bola Bapenda) tetap di `atribut.jemput_bola` entri Bapenda dan tidak dibuat entri lokasi.
