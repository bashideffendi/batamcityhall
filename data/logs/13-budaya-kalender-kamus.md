# Log migrasi: 13-budaya-kalender-kamus

- task_id: `wf-692a439f-b2e1-8844-aad7-de6f1e59de43`
- Judul laporan: Loket Cerita dan Budaya Batam: Kalender Acara, Budaya Melayu, Kamus Mini, Komunitas, dan Fakta Infografis (Riset per November 2026)
- Laporan diambil utuh (`truncated: false`). Daftar sumber: 98 item, semuanya disalin.

## Ringkasan angka

| Item | Jumlah |
|---|---|
| Blok ```json di laporan | 2 (acara: 30 entri, kamus: 65 entri) |
| Blok JSON yang perlu diperbaiki | 0 (keduanya valid apa adanya) |
| Tempat (`data/places/13-budaya-kalender-kamus.json`) | 2 |
| Tabel di laporan | 15 (10 tabel kalender per bagian bulan, 1 tradisi Melayu, 1 komunitas, 1 linimasa, 1 wisman, 1 geografi); semuanya dikonversi ke JSON |
| Baris tabel kalender | 37 |
| Entri `acara.json` | 34 (30 dari JSON + 4 dari baris tabel yang tidak punya versi JSON) |
| Entri `kamus.json` | 65 (30 bertanda [S], 35 bertanda [P]) |
| Entri `komunitas.json` | 12 |
| Entri `fakta_infografis.json` | 68 angka, 12 linimasa sejarah, 5 ide infografis |
| Entri `tradisi_melayu.json` | 15 |

## File yang dibuat

- `research/13-budaya-kalender-kamus.md`: salinan verbatim + `## Daftar sumber` (98 item).
- `data/raw/13-budaya-kalender-kamus__1.json`: blok JSON acara (verbatim).
- `data/raw/13-budaya-kalender-kamus__2.json`: blok JSON kamus (verbatim).
- `data/places/13-budaya-kalender-kamus.json`: 2 tempat kategori `budaya`.
- `data/budaya/acara.json`: kalender acara.
- `data/budaya/kamus.json`: kamus mini (isi identik dengan raw __2, diformat ulang/indentasi saja).
- `data/budaya/komunitas.json`: komunitas kreatif & budaya.
- `data/budaya/fakta_infografis.json`: angka infografis + linimasa + ide infografis.
- `data/budaya/budaya_melayu.md`: bagian "## 2. Budaya Melayu Kepri untuk Warga Batam" verbatim (tanpa garis pemisah `---` penutup).
- `data/budaya/tradisi_melayu.json` (**tambahan, di luar mapping tugas**): tabel tradisi/unsur budaya Melayu di bagian 2 dikonversi ke JSON sesuai aturan spesifikasi soal tabel terstruktur. Isi sama dengan tabel di `budaya_melayu.md`; boleh diabaikan kalau tidak dipakai.

## Struktur file domain

### acara.json (array)
- 30 entri JSON asli disalin tanpa perubahan nilai, lalu ditambah:
  - `asal_data`: `"json+tabel"` / `"json"` / `"tabel"`.
  - `tabel`: array baris tabel kalender yang cocok, kolom persis seperti tabel (`bagian_kalender`, `acara`, `tanggal`, `lokasi`, `penyelenggara`, `status`, `sumber`).
  - `catatan_laporan`: paragraf catatan dari laporan yang relevan, disalin verbatim (Catatan BWR → ev-006; Konteks ogoh-ogoh/lampu colok → ev-008 & ev-009; Catatan KSM → ev-011; Catatan Mandi Safar → ev-014; "Batam 10K pindah..." → ev-018; Catatan Pawai Budaya HJB → ev-029; caveat "Acara batal/tidak rutin" → ev-021, ev-025, ev-028, ev-t01).
- Satu entri JSON bisa punya >1 baris tabel: ev-011 (KSM 2025 dan KSM 2026), ev-018 (Batam 10K 2025 dan 2026), ev-027 (istighasah/ziarah 12 Des dan Batam Bersepeda 14 Des).
- 4 entri baru dari baris tabel tanpa versi JSON: `ev-t01` Batam Light Festival, `ev-t02` Tahun Baru Islam (1 Muharram), `ev-t03` Kita Indonesia (Jilid II), `ev-t04` Natal. Untuk entri ini `kategori`, `deskripsi`, `status` = `null` (kosakata JSON tidak tersedia di laporan; status asli ada di `tabel[0].status`). `bulan` diambil dari judul bagian kalender bila satu bulan; untuk Tahun Baru Islam (bagian "Juni–Juli") `bulan` = `null`. `sumber_url` = `null` bila tabel menulis "—".

### komunitas.json (array)
Kolom: `id`, `nama`, `jenis` (kolom "Bidang"), `kontak_publik` (kolom "Kanal publik", persis), `status`, `sumber_url` (array; baris media dipecah di " ; "). Dua baris yang berisi beberapa komunitas sekaligus (kom-003 klub lari, kom-012 media lokal) diberi `anggota` (array nama dari sel yang sama).

### fakta_infografis.json (object)
- `angka[]`: `id`, `topik`, `indikator`, `angka` (teks persis dari laporan, termasuk ±, >, %), `nilai` (angka numerik hasil parse teks tsb: koma desimal → titik, titik ribuan dibuang; `null` bila bukan angka tunggal, mis. ">400 pulau"), `satuan`, `tahun`, `periode`, `status`, `catatan`, `sumber_url[]`, dan `kecamatan` untuk angka per kecamatan.
- `linimasa_sejarah[]`: tabel "Sejarah pembangunan (timeline)" (kolom `tahun` tetap teks persis, mis. "Awal 1970-an", "18 Des").
- `ide_infografis[]`: 5 ide dari laporan, verbatim.
- `catatan_laporan[]`: caveat etnis dan agama.

## Masalah, keputusan, dan perbaikan

1. **Escape karakter**: `&` → `&`, `>` → `>` saat menyalin (bawaan format JSON tool, bukan isi laporan).
2. **Markdown di sel tabel**: penanda tebal/miring (`**...**`, `*PIN*`) dihapus saat sel dikonversi ke JSON. Teks lain persis.
3. **"idem" di tabel wisman** diganti URL baris di atasnya: baris 2–4 → URL Batam Pos (1,6 juta), baris "5 negara teratas" → URL Tempo.
4. **Kecamatan "Sungai Beduk"** pada jumlah pulau dinormalisasi jadi `Sei Beduk` di kolom `kecamatan`; teks `angka`/`indikator` tetap "Sungai Beduk".
5. **Tanda ⌛ pada baris "Versi lain" jumlah pulau** posisinya di akhir baris, jadi diterapkan ke ketiga angka (373, >400, 329). Bisa jadi hanya dimaksudkan untuk versi RTRW.
6. **Target wisman 2025 versi 1,7 juta**: laporan tidak mencantumkan URL untuk angka itu (hanya menyebut Tempo dan rilis Diskominfo Batam); `sumber_url` = `[]`.
7. **Ketidakkonsistenan di JSON acara asli (tidak diubah)**:
   - `bulan` tidak selalu cocok dengan tanggal: ev-011 KSM `bulan: 7` padahal edisi 2025 Mei; ev-018 Batam 10K `bulan: 9` padahal 2025 Juli; ev-007 Cap Go Meh `bulan: 3` padahal salah satu titik 27 Feb 2026.
   - Urutan ev-011 (bulan 7) ada sebelum ev-012 (bulan 6). Urutkan berdasarkan `bulan` di frontend.
   - Kosakata `kategori` tidak seragam (mis. `keagamaan` vs `religi`, `tradisi-melayu` vs `budaya-melayu`, `MICE` huruf besar).
   - `sumber_url` di JSON berupa string tunggal (bukan array).
8. **Konflik antarsumber yang ditandai laporan** (ada di `catatan_laporan`/`tabel`): tanggal BWR 2026 (Disbudpar vs Indonesia.travel); KSM (katalog KEN 2025 19–21 Juli vs realisasi 16–18 Mei; nomor edisi "ke-26" dua kali); bulan Mandi Safar (Tempo: Juni vs kalender Hijriah); Pawai Budaya HJB (19 Des ±5.000 vs 20 Des >8.000 peserta); target wisman 2025 (1,5 vs 1,7 juta); jumlah pulau (371 vs 373 vs >400).
9. **URL di isi laporan yang tidak ada di daftar `sources`** (disalin apa adanya): 7 URL sumber kamus (bpiw.pu.go.id ruli, antaranews foto perahu, rri pompong, tribunnews UWT 2025/08/25, indonesia.travel Dataran Engku Putri, batamnews berita-98543, jurnal.idebahasa.or.id); 3 beranda media (batamnews.co.id, gokepri.com, kalapena.id); URL Khitong di tabel tanpa parameter `&gsessionid=...` (di daftar sumber ada versi dengan parameter).
10. **kamus.json**: 35 entri [P] punya `sumber_url: ""` (string kosong, sesuai aslinya). Laporan meminta entri [P] divalidasi warga/ahli bahasa sebelum terbit.
11. **komunitas.json**: laporan menegaskan "Jangan publikasikan akun yang belum dicek langsung". Hanya `@sukalaribatam` dan `@batam_10k` yang berstatus ✅; sisanya ⚠️/⌛.
12. **Topik sensitif**: data agama ada di `fakta_infografis.json`. Laporan meminta angka resmi + bahasa deskriptif, tanpa meranking/melabeli komunitas. Komposisi suku dan jumlah pekerja industri belum ada angkanya (entri dengan `angka: null`, status ⚠️).

## Places

Instruksi tugas: hanya tempat fisik budaya (kategori `budaya`). Yang masuk:
- `museum-batam-raja-ali-haji`: Museum Batam Raja Ali Haji (✅, punya mini teater).
- `gedung-lam-kota-batam`: Gedung LAM Kota Batam (✅, lokasi Makan Berhidang 21 Okt 2025).

Keduanya tanpa alamat/kecamatan/koordinat di laporan → `kecamatan: null`, `lat/lng: null`, `status_koordinat: perlu_diisi_user`.

**Sengaja tidak dimasukkan ke places** (lokasi acara atau tempat non-budaya; tidak ada koordinat di laporan), untuk ditautkan dari laporan lain bila perlu: Dataran/Alun-alun Engku Putri, Taman Dang Anom, Dataran Engku Hamidah, Bundaran Madani, Kantor Wali Kota (Jl. Engku Putri), Maha Vihara Duta Maitreya (Sungai Panas), Vihara Samudra Bakti (Pulau Buluh), Pura Agung Amerta Bhuana, Masjid At-Taqwa, Kampung Nongsa Pantai (makam zuriat Nong Isa), Kampung Tua Terih (Sambau, Nongsa), Kampung Tua Teluk Mata Ikan / Pantai Camar, Pantai Senja (Batu Besar, Nongsa), Perairan Elang-Elang (Belakang Padang), Jembatan 1–6 Barelang, Mega Mall Batam Centre, Ayola Signature Ocarina, Radisson Golf & Convention Centre, Green Rose Hotel Batam, CinCai Cafe (KBC Batam Centre), Ruko Papa Mama Residence, area parkir HarbourBay, Komplek Bumi Indah (Nagoya), Palm Spring, serta pintu masuk wisman (Pelabuhan Batam Centre, Nongsa Pura, HarbourBay, Sekupang, Bandara Hang Nadim). Di luar Batam: Pulau Penyengat, Sanggar Ritma Bayu (Sabah). Sanggar seni Melayu di Tanjung Riau/Belakang Padang disebut laporan sebagai **belum ditemukan**.

## Hal di laporan yang tidak dipetakan ke JSON (tetap ada di research md)

- Pengantar, TL;DR, legenda status, paragraf "Cara baca" kalender (kalender Disbudpar diperbarui tiap tiga bulan).
- "Dicari tapi tidak ditemukan sebagai agenda tahunan Batam" (Gawai Dayak, "Batam Culture Festival", Batam Marathon 42K, triathlon tahunan, festival kuliner di luar BWR).
- Pengantar bagian 3 (15 dialek Melayu di Kepri, Dialek Pecong di Kelurahan Pecong; pengelompokan kamus). Catatan: JSON kamus tidak punya kolom kelompok.
- "Belum ditemukan, perlu riset lanjutan" di bagian 4 (sanggar seni Melayu, komunitas fotografi, ilustrator/desainer, kolektif seni dan galeri, taman baca, komunitas sepeda, "Parade Bunyi'an 2025"), dan saran meminta daftar peserta KSM/BWR/Pawai Budaya HJB ke Disbudpar.
- Angka di luar bagian 5 tidak dimasukkan ke `fakta_infografis.json` (tetap ada di `acara.json` lewat `tabel`/`catatan_laporan`): ±700 umat Hindu/±150 KK, 75 UMKM BWR 2025, 2.200 pelari Batam 10K 2026, hadiah Rp164 juta Sea Eagle, ±60 pertunjukan KSM 2026, >8.000 peserta Pawai HJB, >2.000 pesepeda, 40 tatung Khitong, 46 peserta/Rp135 juta lampu colok Karimun, 16 musisi Parade Bunyi'an.
- Caveats umum (sumber sekunder, tanggal keagamaan bergeser, kamus [P]); sebagian sudah ditempel sebagai `catatan_laporan`.
