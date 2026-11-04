# Log migrasi: 01-inspirasi-konsep

- task_id: `wf-2c6ba93f-8eb5-55a3-8f98-dea793d8ad5d`
- Judul laporan: Batam City Hall: Riset Contoh Website Kota, Direktori Hyperlocal dan Konsep Lengkap
- Laporan `truncated: false` (utuh).

## File yang dibuat
| File | Isi |
|---|---|
| `research/01-inspirasi-konsep.md` | Salinan verbatim + `## Daftar sumber` (68 sumber) |
| `data/places/01-inspirasi-konsep.json` | 7 tempat |
| `data/referensi/website_inspirasi.json` | 10 item, tabel "1. Contoh website kota/area yang bagus" (diminta pemanggil) |
| `data/referensi/direktori_hyperlocal.json` | 11 item, tabel "2. Contoh direktori rekomendasi layanan hyperlocal" (tambahan sesuai aturan tabel di spesifikasi) |
| `data/raw/01-inspirasi-konsep__*.json` | Tidak ada; laporan tidak punya blok kode berpagar |

## Ringkasan angka
- Blok JSON: **0**. Laporan tidak punya blok kode berpagar sama sekali. Endpoint BMKG ditulis sebagai inline code dan tetap ada di salinan md.
- Tempat: **7**
  - `jembatan-barelang` (landmark)
  - `singapore-cruise-centre`, `terminal-feri-batam-centre`, `terminal-feri-sekupang`, `terminal-feri-harbour-bay`, `terminal-feri-nongsapura`, `terminal-feri-tanah-merah` (transportasi / terminal_feri)
  - Semua koordinat `null` → `status_koordinat: perlu_diisi_user`. Semua kecamatan `null` karena laporan tidak menyebutnya.

## Aturan pemilihan tempat
Entri tempat hanya dibuat untuk lokasi fisik yang diberi data di laporan (fakta, rute/operator, alamat, tahun). Tempat yang cuma disebut namanya sebagai ide/ikon dicatat di bawah, tidak dijadikan entri.

## Masalah / perbaikan / keputusan
- Ada dua H1 di md: baris 1 memakai `title` laporan ("... dan Konsep Lengkap"), lalu teks laporan diawali H1 sendiri ("... & Konsep Lengkap"). Ini memang mengikuti spesifikasi.
- Escape JSON dari tool (`&`, `\"`, dan sejenisnya) didekode ke karakter aslinya. Tidak ada teks yang diubah.
- `sumber_url` di places: teks laporan tidak memberi sitasi inline per klaim (kecuali URL jadwal Singapore Cruise Centre). Jadi URL dipilih dari Daftar sumber laporan berdasarkan topik URL (halaman Barelang untuk jembatan; batam.com/Tempo/redBus/singaporecruise untuk feri). Tidak ada URL baru di luar daftar sumber.
- "HarbourFront" di nama rute dipetakan ke `singapore-cruise-centre` (sebagai `nama_alternatif`), karena laporan menyebut semua feri Batam dari HarbourFront berangkat dari Singapore Cruise Centre sejak Juli 2026.
- Terminal feri dinamai persis seperti di laporan ("Batam Centre", "Sekupang", "Harbour Bay", "Nongsapura", "Tanah Merah"). Laporan tidak menyebut nama resmi terminal; ini dicatat di `catatan` tiap entri. Saat digabung dengan laporan lain, kemungkinan perlu deduplikasi dengan entri pelabuhan yang bernama resmi.
- `status_data: perlu_cek_ulang` untuk semua entri feri, karena laporan sendiri bilang jadwal antarsumber sering beda dan perpindahan ke Singapore Cruise Centre bersumber dari situs panduan (batam.com), bukan operator.
- `tag_osm` diisi sebagai petunjuk pencarian OSM (`amenity=ferry_terminal`, `man_made=bridge`). Ini bukan data dari laporan.
- Tabel website: baris The Pudding berisi dua karya dan dua URL dalam satu sel. Disimpan sebagai satu item dengan `url` berisi 2 elemen, dan sel aslinya ada di `sel_asli_nama_url`.

## Hal yang tidak bisa dipetakan ke places
- **Kampung Tua (umum)**: laporan memberi jumlah (37 titik pada 2019, 37 titik sekitar 1.600 ha, 134 termasuk hinterland, 33 di mainland, 36 menurut sumber lain) tetapi tidak menyebut satu pun nama kampung. Datanya tetap ada di md.
- **Disebut hanya sebagai ide/ikon/area tanpa data**: Masjid Agung dan Welcome to Batam (ikon doodle), gapura kampung tua, pelantar kayu, papan nama ruko lama Nagoya, Nagoya (kalkulator "Ke Singapura atau Ke Nagoya?"), Tiban, Pulau Abang/Galang ("Aman nyebrang?"), Rempang, Galang, Bintan, Selat Singapura, serta Batam Centre/Sekupang sebagai area ("Hujan Bingo").
- **Tempat di luar Batam pada tabel referensi** (Repair Café, Repair Kopitiam, kios hawker center NEA, dll.) masuk ke `data/referensi/`, bukan places.
- **Konten non-tabel** (struktur loket, daftar fitur, maskot, konsep visual, crowdsourcing, model keberlanjutan, tech stack, daftar sumber data terbuka BMKG/Bapanas/feri, roadmap fase 0–4) hanya ada di md. Tidak ada mapping domain yang diminta dan bentuknya bukan tabel.
