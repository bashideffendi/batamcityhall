# Direktori Profesi dan Jasa Administrasi Kota Batam: Seed Data PPAT, Notaris, Lahan, Bantuan Hukum, dan Jasa Dokumen
> task_id: wf-306cd9c5-0488-8f2f-89b3-675ce767e1e0

# Direktori Profesi & Jasa Administrasi Kota Batam: Seed Data PPAT, Notaris, Lahan, Bantuan Hukum, dan Jasa Dokumen

Belum ada daftar PPAT atau notaris Batam yang lengkap, resmi, dan bisa diunduh publik. Jadi seed data paling aman adalah: (1) simpul layanan resmi yang alamat dan kontaknya jelas, yaitu Kantah BPN Kota Batam, BP Batam (LMS dan PTSP di MPP), MPP, DPMPTSP, PLUT-KUMKM, Posbakum PN/PA, serta LBH dan organisasi profesi; lalu (2) sampel kantor PPAT/notaris yang ditandai "perlu_cek_ulang", ditambah tombol "cara verifikasi". Jumlahnya sendiri cukup jelas: Kanwil Kemenkum Kepri menyebut ada 139 notaris di Batam (April 2025), dan Ketua Pengda IPPAT Batam menyebut 125 anggota PPAT di Batam (BatamToday, September 2022); data HUT IPPAT ke-38 (BatamInfo, September 2025) menyebut keanggotaan IPPAT "sekitar 140 orang", meski tidak tegas apakah itu angka Batam atau Kepri.

## TL;DR

- **Urusan tanah di Batam terbagi ke tiga loket.** BP Batam memegang hak pengelolaan (HPL) atas sebagian besar lahan Pulau Batam. Lembaga ini mengurus alokasi lahan, UWT (dulu disebut UWTO), izin peralihan hak, dan perpanjangan alokasi. BPN (Kantor Pertanahan Kota Batam di Sekupang) mengurus sertifikat, balik nama, dan hak tanggungan. PPAT membuat akta jual beli dan APHT, sedangkan notaris membuat PPJB, perjanjian, dan akta pendirian usaha.
- **Skala profesinya besar, tapi data resminya tertutup.** Ada 139 notaris (Kanwil Kemenkum Kepri, April 2025) dan 125 anggota IPPAT Batam (2022; data 2025 menyebut sekitar 140, wilayahnya belum tegas). Formasi notaris Kota Batam tahun 2025 tercatat penuh (0 kursi) di AHU. Daftar nama per kantor hanya ada di sistem internal ATR/BPN, AHU, dan MPD. Karena itu semua entri PPAT/notaris di seed ini berstatus "perlu_cek_ulang", dan sebagian besar sumbernya sekunder (blog atau agregator, sebagian dari 2019).
- **Bantuan hukum gratis paling pasti ada di Posbakum.** Posbakum tersedia di PN Batam (Batam Centre) dan PA Batam (Sekupang). LBH di luar itu antara lain LBH Mawar Saron Batam (Sukajadi) dan PBH Peradi Batam. Untuk OBH terakreditasi BPHN periode 2025–2027, daftar resmi untuk Batam belum berhasil saya baca. Yang terkonfirmasi hanya bahwa Kanwil Kemenkum Kepri meneken kontrak dengan 9 OBH terakreditasi se-Kepri pada April 2025.

---

## Ringkasan praktis: urusan tanah/rumah di Batam, ke mana untuk apa?

Batam berbeda dari kota lain. Di atas sebagian besar tanah Pulau Batam ada **Hak Pengelolaan (HPL) BP Batam**. Akibatnya, sertifikat HGB warga "menumpang" di atas HPL itu, dan warga wajib membayar **UWT (Uang Wajib Tahunan, dulu UWTO)** ke BP Batam. UWT dibayar di muka untuk seluruh masa alokasi, bukan per tahun: **30 tahun** untuk alokasi awal, **20 tahun** untuk perpanjangan, dan **30 tahun** untuk pembaruan. Kalau faktur tidak dilunasi sampai masa alokasi berakhir, lahan kembali dikuasai BP Batam.

| Kebutuhan warga | Ke mana | Catatan |
|---|---|---|
| Cek/bayar UWT, perpanjangan alokasi lahan, simulasi biaya | **BP Batam – LMS Online** (lms.bpbatam.go.id) dan loket **PTSP BP Batam di MPP** | Perpanjangan diajukan lewat layanan "Perpanjangan Hak Atas Tanah" di LMS. Syaratnya: identitas, PBB tahun terakhir, sertifikat atau dokumen lahan (SKPL, SPPL, gambar lokasi, faktur UWT). |
| Izin Peralihan Hak (IPH) sebelum jual-beli, alokasi tanah, persetujuan hak tanggungan, pecah PL, salinan arsip dokumen alokasi | **BP Batam** (LMS / PTSP di MPP / B-CARE untuk pengaduan) | Katalog B-CARE menyebut layanan "Izin Peralihan Hak, Pengalokasian Tanah, Perpanjang Hak Atas Tanah dan Pelayanan Hak Tanggungan". |
| Sertifikat (HGB/HM), balik nama, pengecekan sertifikat, pendaftaran dan roya hak tanggungan, PTSL | **Kantor Pertanahan (BPN) Kota Batam**, Jl. Jaksa Agung R. Soeprapto, Sungai Harapan, Sekupang. Ada juga loket BPN di MPP. | WA pengaduan resmi: 0851 5000 0722. |
| Akta Jual Beli (AJB), Akta Pemberian Hak Tanggungan (APHT), hibah, tukar-menukar, inbreng tanah | **PPAT** (umumnya notaris yang merangkap PPAT) | PPAT berwenang hanya di wilayah kerjanya (Kota Batam). |
| PPJB (sebelum AJB), perjanjian sewa, kuasa, wasiat, pendirian PT/CV/yayasan/koperasi | **Notaris** | Notaris yang punya sertifikasi NPAK bisa membuat akta koperasi. |
| BPHTB (pajak pembeli) dan PBB | **Bapenda Kota Batam** (mitra IPPAT) | Alamat Bapenda tidak tercakup riset ini, jadi perlu ditambahkan dari riset kantor pemerintahan sebelumnya. |
| PPh final penjual, NPWP | **KPP Pratama** atau loket pajak di MPP | KPP Pratama Batam Selatan melayani di MPP secara bergiliran (jadwal yang pernah diumumkan: Senin–Selasa). |
| Rumah lelang (bank/negara) | **KPKNL Batam** atau **Pejabat Lelang Kelas II** | Daftar resmi Pejabat Lelang Kelas II per 26 November 2025 memuat 4 nama dengan wilayah jabatan Batam. |

**Urutan umum jual-beli rumah di lahan HPL BP Batam** (gambaran praktis saja; detail wajib dicek ke PPAT atau BP Batam): cek status UWT dan sisa masa alokasi di BP Batam → urus Izin Peralihan Hak di BP Batam → PPAT cek sertifikat di BPN, lalu pajak dibayar (BPHTB oleh pembeli, PPh oleh penjual) → tanda tangan AJB di PPAT → PPAT mendaftarkan balik nama ke BPN.

---

## Key Findings

1. **Jumlah profesi.** Kakanwil Kemenkum Kepri, Edison Manik, menyebut "jumlah Notaris di Provinsi Kepulauan Riau mencapai 268 orang, dengan 139 di antaranya berada di Kota Batam" (Konferda INI Batam, 24 April 2025). Ketua Pengda IPPAT Batam menyebut "Batam merupakan anggota terbanyak yakni 125 orang" dari sekitar 220 anggota se-Kepri (BatamToday, September 2022). Data resmi Pemprov Kepri dari rakor 13 September 2022 menyebut anggota IPPAT Kepri 237 orang, dengan Batam 125 orang. Data lebih baru dari HUT IPPAT ke-38 (BatamInfo, September 2025) menyebut keanggotaan IPPAT "sekitar 140 orang", tetapi tidak tegas apakah untuk Batam atau Kepri, jadi tandai angka PPAT sebagai "mungkin usang". Data formasi notaris AHU untuk Kota Batam tahun 2025 menunjukkan 0 kursi tersedia ("Penuh"). Artinya jumlah notaris relatif stabil dan daftar lama masih cukup relevan, tetapi tetap perlu dicek perpindahan kantor dan notaris yang pensiun.
2. **Tidak ada daftar PPAT/notaris resmi yang terbuka untuk Batam.** Daftar per orang ada di aplikasi internal ATR/BPN, sistem notariat Ditjen AHU, dan MPD Notaris Kota Batam, dan belum ada yang dipublikasikan sebagai dataset. Sumber publik yang memuat alamat dan nomor kantor secara resmi hanyalah **Daftar Pejabat Lelang Kelas II DJKN Kemenkeu per 26 November 2025**. Banyak pejabat lelang kelas II adalah notaris/PPAT. Sisanya berasal dari blog direktori (2019) dan agregator, sehingga **harus diverifikasi**. Di blog 2019 itu, banyak PPAT tercantum dengan nomor SK yang sama ("9-XVII-PPAT-2008"). Ini kemungkinan besar kesalahan templat, jadi **jangan pakai nomor SK dari sumber tersebut**.
3. **PPAT Sementara (camat).** Saya tidak menemukan sumber yang menyebut camat di Batam (termasuk Belakang Padang, Bulang, dan Galang) sedang menjabat PPAT Sementara. Secara hukum hal ini dimungkinkan (PP 37/1998) di wilayah yang kekurangan PPAT. Di seed data, tandai kolom ini "tidak diketahui" dan konfirmasikan ke Kantah Kota Batam.
4. **OBH terakreditasi.** BPHN menetapkan OBH terakreditasi untuk periode 2025–2027. Secara nasional, BPHN mencatat 597 PBH (dari 619 yang aktif pada 2022–2024) mendaftar perpanjangan, ditambah 190 PBH baru yang disetujui untuk periode 2025–2027. Kanwil Kemenkum Kepri meneken kontrak bantuan hukum dengan **9 OBH terakreditasi** pada 14 April 2025, dan kontrak TA 2026 ditandatangani pada 6 Maret 2026, dipimpin Kakanwil Edison Manik (Batam Pos). Nama dan kelas akreditasi OBH yang berbasis Batam untuk 2025–2027 **belum bisa saya verifikasi**, karena halaman BPHN dan Kanwil tidak bisa diakses. Mitra Batam yang tercatat di periode sebelumnya (2023) adalah LBH Mawar Saron, LBH Peduli dan Harapan Bangsa, dan LBH Yayasan Suara Keadilan.
5. **Satu gedung untuk banyak urusan.** MPP Kota Batam di Lantai Dasar Gedung Sumatera Convention Center, Jl. Engku Putri, Batam Centre, memuat loket Pemko, BP Batam (PTSP), BPN, pajak, dan DPMPTSP (lantai 2). Di peta, MPP layak jadi pin "hub" utama.

---

## Details per kategori

> **Status koordinat:** saya **tidak** memasukkan koordinat tebakan. Semua lat/lng di bawah bernilai `null` dengan status `perlu_diisi_user`. Cara tercepat mengisinya: buka openstreetmap.org, cari gedung atau komplek ruko yang dimaksud, klik kanan "Show address", lalu salin lat/lng. Bisa juga lewat Nominatim, dengan mencocokkan nama komplek ruko.
> **Status data:** ✅ = dari sumber resmi atau situs resmi lembaga; ⚠️ = sumber sekunder atau berpotensi usang, jadi perlu cek ulang.

### A. Pertanahan, lahan, dan perizinan (simpul resmi)

| Nama kantor | Subkategori | Kecamatan | Kelurahan | Alamat | Kontak kantor | lat | lng | Status koordinat | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| ✅ Kantor Pertanahan (BPN) Kota Batam | kantor_pertanahan | Sekupang | Sungai Harapan | Jl. Jaksa Agung R. Soeprapto, Sungai Harapan, Sekupang, Batam 29428 | WA pengaduan 0851 5000 0722; kot-batam@atrbpn.go.id | null | null | perlu_diisi_user | https://kot-batam.atrbpn.go.id/ ; https://www.facebook.com/KantahKotaBatam/ |
| ✅ BP Batam – Kantor Pusat | pengelola_lahan_hpl | Batam Kota | perlu cek | Jl. Ibnu Sutowo No. 1, Batam Centre 29400 | (0778) 462047 / 462048; humas@bpbatam.go.id | null | null | perlu_diisi_user | https://e-ppid.bpbatam.go.id/profil/alamat/ |
| ✅ BP Batam – Land Management System (LMS) | layanan_lahan_online | Batam Kota | perlu cek | Jl. Ibnu Sutowo No. 1, Batam Centre (layanan daring) | +62 811-7048-000 (konsultasi), +62 811-7704-770 (penataan), +62 811-7704-771 (KSB); lms-online@bpbatam.go.id | null | null | perlu_diisi_user | https://lms.bpbatam.go.id/portal/bantuan/kontak-kami |
| ✅ PTSP BP Batam (loket di MPP) | ptsp_lahan_perizinan | Batam Kota | Belian (perlu cek) | MPP Kota Batam, Lt. Dasar Gedung Sumatera Convention Center, Batam Centre | WA info perizinan +62 855-6670-011; pengaduan +62 855-6670-009; tuptsp@bpbatam.go.id | null | null | perlu_diisi_user | https://ptsp.bpbatam.go.id/en/ |
| ✅ Mal Pelayanan Publik (MPP) Kota Batam | mal_pelayanan_publik | Batam Kota | Belian (perlu cek) | Lt. Dasar, Gedung Sumatera Convention Center, Jl. Engku Putri, Batam Centre | Call center (0778) 468278 | null | null | perlu_diisi_user | https://mpp.batam.go.id/ |
| ✅ DPMPTSP Kota Batam | perizinan_usaha_daerah | Batam Kota | Belian (perlu cek) | Lt. 2 MPP, Gedung Sumatera Convention Centre, Jl. Engku Putri, Batam 29461 | (0778) 473228; dpmptsp@batam.go.id | null | null | perlu_diisi_user | https://easy.batam.go.id/web/ |
| ✅ KPKNL Batam | lelang_negara | Batam Kota | perlu cek | Jl. Engku Putri (depan Gedung Pusat Informasi Haji), Batam Centre 29444 | (0778) 469825; kpknlbatam@kemenkeu.go.id | null | null | perlu_diisi_user | https://www.djkn.kemenkeu.go.id/kpknl-batam |

Catatan: Nomor WA PTSP BP Batam berbeda antarhalaman. Halaman pengaduan lama mencantumkan +62 811-7676-666, sedangkan beranda terbaru mencantumkan +62 855-6670-011. Pakai yang terbaru dan tandai "perlu_cek_ulang". Jam layanan PTSP BP Batam di MPP: **08.00–16.30 WIB, antrean tutup 15.00**.

### B. PPAT dan Notaris (sampel, semua perlu cek ulang)

Pola yang disarankan: satu entri per **kantor**, dengan atribut `ppat: true/false`, `notaris: true/false`, dan `pejabat_lelang_kelas_ii: true/false`.

| Nama kantor | Subkategori | Kecamatan | Kelurahan | Alamat | Kontak kantor | lat | lng | Status koordinat | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| ⚠️ Kantor Notaris & PPAT Wirlisman, S.H., Sp.N. | notaris_ppat | Batu Ampar | Sungai Jodoh | Komplek Jaya Putra Blok B-5, Jl. Raja Ali Haji, Sungai Jodoh 29453 | (0778) 431931 | null | null | perlu_diisi_user | https://notarisppat.or.id/ ; http://notarisbatamwirlisman.blogspot.com/p/alamat-kantor.html |
| ⚠️ Kantor Notaris/PPAT Wany Thamrin, S.H., M.Kn. | notaris_ppat; pejabat_lelang_kelas_ii | Batam Kota | perlu cek | Komplek Ruko Bintang Raya A No. 12, Jl. Regata, Batam Centre | (0778) 7483660 | null | null | perlu_diisi_user | https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf |
| ⚠️ Kantor Juli Cristie, S.H., S.E., M.Kn. | pejabat_lelang_kelas_ii (status notaris/PPAT perlu cek) | Batam Kota | Teluk Tering (perlu cek) | Komplek Ruko Rafflesia Business Center Blok B No. 10, Batam Centre | (0778) 472785 | null | null | perlu_diisi_user | https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf |
| ⚠️ Kantor Analis Wida Delima Pandjaitan, S.H., M.Kn. | pejabat_lelang_kelas_ii (status notaris/PPAT perlu cek) | Batam Kota | perlu cek | Ruko Royal Sincom Blok E No. 05, Batam Center | (0778) 422555 | null | null | perlu_diisi_user | https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf |
| ⚠️ Kantor PPAT Yondri Darto | ppat (notaris perlu cek) | Lubuk Baja | Lubuk Baja Kota (perlu cek) | Jl. Sultan Abdul Rachman, Komplek Sulaiman Blok A No. 10–12, Nagoya | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Titik Sulistyowati | ppat | Batam Kota | perlu cek | Jl. Engku Putri, Ruko Taman Mediterania Blok KK4 No. 3A | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Najemah | ppat | Batam Kota | perlu cek | Ruko Purimas, Jl. Engku Putri Blok B No. 37 | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Rian Sugito, S.H., M.Kn. | notaris_ppat | Batam Kota | Teluk Tering (perlu cek) | Komplek Accelence Blok A No. 16, Jl. Pasir Putih | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Bambang Purwanto | ppat | Batam Kota | Taman Baloi (perlu cek) | Town House Palm View Blok B No. 2 | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Yulianti | ppat | Batam Kota | Belian (perlu cek) | Lt. 3 Gedung Sumatera Convention Centre, Jl. Engku Putri Kav. 1 | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor PPAT Bambang Muchsinanto | ppat | perlu cek | perlu cek | Komplek Tanah Mas Blok E No. 3, Lt. 2 | tidak dipublikasikan resmi | null | null | perlu_diisi_user | https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html |
| ⚠️ Kantor Notaris & PPAT Kiki, S.H., M.Kn. | notaris_ppat | Batam Kota | Teluk Tering | Komplek Ruko Mahkota Raya Blok G No. 7, Teluk Tering 29461 | tidak dipublikasikan | null | null | perlu_diisi_user | https://jashalegal.com/notaris/kota-batam/profil/kantor-notaris-dan-ppat-kiki-batam-kota |

Sebaran sampel ini (dan agregator seperti masuksini) menunjukkan kantor notaris/PPAT menumpuk di **Batam Kota** (Batam Centre, Teluk Tering, Belian, Baloi), **Lubuk Baja** (Nagoya, Jl. Imam Bonjol, Raden Patah), dan **Batu Ampar** (Sei Jodoh), lalu sebagian kecil di Sekupang (Tiban), Batu Aji, Bengkong, dan Sagulung. Di kecamatan pulau (Belakang Padang, Bulang, Galang) praktis tidak ada kantor. Di peta, kecamatan tersebut sebaiknya diberi kartu info "PPAT terdekat ada di Batam Kota/Lubuk Baja; tanyakan PPAT Sementara ke Kantah".

**Cara verifikasi PPAT/notaris (untuk tombol "cek status" di kartu):**
- PPAT: tanyakan ke Kantor Pertanahan Kota Batam (WA pengaduan resmi), atau cek lewat aplikasi/portal resmi ATR/BPN yang memuat data PPAT terdaftar. Pastikan **wilayah kerja = Kota Batam**.
- Notaris: cek ke Ditjen AHU (ahu.go.id), MPD Notaris Kota Batam (di bawah Kanwil Kemenkum Kepri), atau Pengda INI Kota Batam.
- Pejabat Lelang Kelas II: daftar resmi DJKN (PDF per 26 November 2025).

### C. Bantuan hukum dan profesi hukum

| Nama kantor | Subkategori | Kecamatan | Kelurahan | Alamat | Kontak kantor | lat | lng | Status koordinat | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| ✅ Posbakum Pengadilan Negeri Batam | posbakum | Batam Kota | perlu cek | Gedung PN Batam, Jl. Engku Putri, Batam Centre | (0778) 468828 (telp/fax PN) | null | null | perlu_diisi_user | https://pn-batam.go.id/index.php/pos-bantuan-hukum/ |
| ✅ Posbakum Pengadilan Agama Batam | posbakum | Sekupang | Sungai Harapan | Jl. R.E. Martadinata No. 5, Sungai Harapan, Sekupang | (0778) 323308 | null | null | perlu_diisi_user | https://pa-batam.go.id/tentang-pengadian/profile-pengadilan/alamat-pengadilan ; https://ptsp.pa-batam.go.id/syarat-pengajuan-perkara |
| ⚠️ LBH Mawar Saron Batam | lbh (mitra Kemenkumham Kepri 2023; akreditasi 2025–2027 perlu cek) | Batam Kota | Sukajadi | Ruko Permata Niaga Blok D No. 3–4, Komplek Sukajadi | (0778) 430990; contact@lbhmawarsaron.or.id | null | null | perlu_diisi_user | https://lbhmawarsaron.or.id/contact-us/ ; https://kepri.antaranews.com/berita/148707/kemenkumham-kepri-rangkul-tujuh-lbh-beri-bantuan-hukum-gratis |
| ⚠️ LBH Peduli dan Harapan Bangsa | lbh (mitra 2023) | perlu cek | perlu cek | belum ditemukan | belum ditemukan | null | null | perlu_diisi_user | https://kepri.antaranews.com/berita/148707/kemenkumham-kepri-rangkul-tujuh-lbh-beri-bantuan-hukum-gratis |
| ⚠️ LBH Yayasan Suara Keadilan | lbh (mitra 2023) | perlu cek | perlu cek | belum ditemukan | belum ditemukan | null | null | perlu_diisi_user | https://gokepri.com/tujuh-lbh-di-kepri-berikan-bantuan-hukum-gratis-bagi-warga-miskin/ |
| ⚠️ DPC Peradi Batam & Pusat Bantuan Hukum (PBH) Peradi Batam | organisasi_advokat; bantuan_hukum | Batam Kota | Teluk Tering / Belian (perlu cek) | Daftar DPN Peradi (Maret 2025): Kantor Hukum Mustari & Partners, Jl. Engku Puteri, Komplek Batam Centre Square Blok C No. 3. Alamat sekretariat lama (2022–2024): Ruko KBC Blok A5 No. 5, Batam Centre, Kel. Belian | belum ada telepon kantor resmi | null | null | perlu_diisi_user | https://www.peradi.or.id/files/Alamat%20DPC%20PERADI%20_-_%20Update%20Maret%202025.pdf ; https://www.matakepri.com/detail-news/2022/07/28/25712/www.matakepri.com |
| ⚠️ DPC Peradi Batam Raya | organisasi_advokat | Lubuk Baja | perlu cek | Komplek Nagoya Newton Blok A No. 10, Nagoya | WA resmi organisasi +62 812-7779-977; dpc.batamraya@gmail.com | null | null | perlu_diisi_user | https://peradi.id/dpc/ |

**Yang perlu dicatat:**
- **Posbakum** di PN dan PA memberi layanan **gratis**: informasi hukum, konsultasi, advis, dan bantuan membuat dokumen seperti surat gugatan atau permohonan (dasar hukumnya PERMA 1/2014). Di PA Batam, gugatan harta bersama, hadhanah, dan nafkah bisa "dibantu dibuatkan di LOKET POSBAKUM". Posbakum umumnya **tidak** mendampingi di persidangan. Untuk pendampingan sidang, warga dirujuk ke OBH.
- **OBH terakreditasi BPHN** memberi bantuan **litigasi** (pendampingan perkara pidana, perdata, dan TUN) serta **non-litigasi** (konsultasi, mediasi, penyuluhan) gratis bagi warga miskin. Syaratnya umumnya surat keterangan tidak mampu dan dokumen perkara. Mitra Kemenkumham Kepri dilarang meminta "uang rokok" atau "uang makan" dari penerima bantuan.
- **Peradi terpecah.** Ada DPC Peradi Batam (peradi.or.id) dan DPC Peradi Batam Raya (peradi.id). Tampilkan keduanya sebagai entri terpisah dengan atribut `afiliasi_dpn`.
- **Advokat perorangan:** jangan dibuat daftarnya. Arahkan warga untuk (a) minta rujukan ke DPC organisasi advokat, (b) cek status advokat di situs resmi organisasinya (Peradi dan lainnya) berdasarkan nomor KTA, dan (c) pastikan advokat sudah disumpah di Pengadilan Tinggi (berita acara sumpah).

### D. Jasa dokumen, pajak, penilai, dan usaha

| Nama kantor | Subkategori | Kecamatan | Kelurahan | Alamat | Kontak kantor | lat | lng | Status koordinat | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| ⚠️ IKPI Cabang Batam (sekretariat) | asosiasi_konsultan_pajak | perlu cek | perlu cek | Komplek Ruko Royal Sincom Blok C No. 12, Batam | (0778) 461325 | null | null | perlu_diisi_user | https://ikpikepri.org/ ; https://ikpi.or.id/en/ikpi-kepri-fokuspenguatan-edukasi-pajak-dan-perluasan-anggota/ |
| ⚠️ AKP2I Pengda Kepri | asosiasi_konsultan_pajak | perlu cek | perlu cek | Komplek Ruko Buana Bukit Permata Blok Goldstone II No. 26, Batam | sekretariat@akp2ikepri.org | null | null | perlu_diisi_user | https://www.facebook.com/akp2ikepri/ |
| ✅ KJPP Muttaqin Bambang Purwanto Rozak Uswatun & Rekan (MBPRU) – Cabang Batam | kjpp | Batam Kota | Baloi Permai | Komp. Ruko Taman Duta Mas Blok B No. 18, Baloi Permai 29431 | (0778) 4801492 | null | null | perlu_diisi_user | https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4 ; https://www.kjpp-mbpru.com/contact |
| ✅ KJPP Aksa, Nelson & Rekan (ANR) – Cabang Batam | kjpp | Batam Kota | Sukajadi | Komp. Ruko Permata Niaga Blok E No. 25, Sukajadi 29432 | (0778) 37220003 (situs ANR) / 0778-3720002 (MAPPI) | null | null | perlu_diisi_user | https://kjpp-anr.com/contact/ ; https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4 |
| ✅ KJPP Damianus Ambur & Rekan – Cabang Batam | kjpp | Sekupang | Tiban (perlu cek) | Perumahan Taman Sari Blok H No. 24 RT 03 RW 04, Tiban | 0778-8011205 | null | null | perlu_diisi_user | https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4 |
| ✅ UPTD PLUT-KUMKM Kota Batam | pendampingan_umkm | Bengkong | Tanjung Buntung | Komplek Golden Prima/Golden City, Tanjung Buntung, Bengkong 29432 | belum ada telepon resmi | null | null | perlu_diisi_user | https://www.plutkumkm-kotabatam.com/ ; https://mediacenter.batam.go.id/2022/04/01/gedung-pusat-layanan-umum-terpadu-diresmikan-rudi-tegaskan-pemko-batam-terus-berupaya-perkuat-umkm/ |
| ✅ Dinas Koperasi dan Usaha Mikro Kota Batam | dinas_umkm | Sekupang | Sungai Harapan | Jl. Pramuka No. 1, Sungai Harapan, Sekupang 29424 | (0778) 321670; ukmbatam@gmail.com | null | null | perlu_diisi_user | https://diskum.batam.go.id/kontak/ |

**Catatan per subkategori:**
- **Konsultan pajak:** IKPI Cabang Batam dipimpin Bunandi (periode 2024–2029). Untuk mencari konsultan pajak perorangan, warga bisa memakai direktori anggota IKPI dan memastikan konsultan punya izin praktik dari DJP. Situs ikpikepri.org tampaknya situs turunan pihak ketiga, jadi alamat sekretariat ditandai ⚠️.
- **KJPP:** Direktori MAPPI (e-directory.mappi.or.id) adalah sumber terbaik. Di direktori itu juga ada cabang Batam lain, yaitu KJPP Syarif, Endang & Rekan dan KJPP Toto Suharto & Rekan, serta alamat cabang di Orchid Park (Taman Baloi), Mega Legenda (Baloi Permai), dan Orchid Point (Sungai Jodoh). Nama-nama itu belum bisa saya cocokkan dengan alamatnya, jadi minta Claude Code mengambilnya langsung dari direktori MAPPI. KJPP dibutuhkan warga untuk penilaian rumah (KPR, waris, lelang, sengketa).
- **Kantor Jasa Akuntan (KJA) / KAP:** belum diriset tuntas. Sumber terbaik adalah direktori resmi PPPK Kemenkeu (KAP/KJA terdaftar) dan IAPI. Tandai sebagai "TODO".
- **Penerjemah tersumpah:** saya **tidak** memasukkan entri. Hasil pencarian untuk Batam didominasi situs pemasaran yang mengklaim "terdaftar Kemenkumham" tanpa nomor SK yang bisa dicek. Kartu kategori sebaiknya berisi panduan verifikasi: minta nomor SK pengangkatan penerjemah tersumpah (format AHU-xx.AH.03.07.tahun), cocokkan pasangan bahasanya, dan konfirmasikan ke instansi penerima (misalnya kedutaan). Untuk dokumen Singapura atau Malaysia, warga biasanya butuh terjemahan Inggris–Indonesia.
- **Legalisasi dokumen:** Indonesia memakai **Apostille** yang diurus online lewat Ditjen AHU, untuk dokumen yang dipakai di negara anggota Konvensi Apostille. Untuk negara non-anggota, berlaku jalur legalisasi Kemenkum, lalu Kemenlu, lalu kedutaan. Status keanggotaan Singapura dan Malaysia dalam Konvensi Apostille harus dicek di situs AHU atau HCCH sebelum ditampilkan, dan tidak diverifikasi dalam riset ini.
- **Biro jasa (STNK, paspor):** tidak ada daftar "terpercaya" resmi yang ditemukan. Sebaiknya jangan dibuat daftar biro jasa. Arahkan warga ke kanal resmi: Samsat, Kantor Imigrasi Batam (Jl. Engku Putri No. 3, telp (0778) 462069), dan MPP.
- **Izin usaha:** NIB lewat OSS (oss.go.id). Di Batam, perizinan berusaha di kawasan FTZ diurus PTSP BP Batam (OSS dan IBOSS), sedangkan izin daerah diurus DPMPTSP Kota Batam (easy.batam.go.id). PLUT-KUMKM membantu fasilitasi pembuatan NIB dan pendampingan UMKM.

---

## Skema data per kategori (usulan)

| Kategori | Atribut khusus (objek `atribut`) | Tag OSM yang cocok | Sumber data terbaik |
|---|---|---|---|
| PPAT | `ppat`, `notaris`, `wilayah_kerja`, `nomor_sk_ppat` (hanya jika dari sumber resmi), `ppat_sementara` (bool, untuk camat), `pejabat_lelang_kelas_ii` | `office=notary` (lazim di OSM untuk notaris/PPAT); opsional `notary:type=ppat` sebagai tag kustom (usulan, bukan standar) | Kantah Kota Batam / aplikasi resmi ATR/BPN; Pengda IPPAT Batam |
| Notaris | `notaris`, `ppat`, `npak` (bool), `wilayah_jabatan` | `office=notary` | Ditjen AHU; MPD Notaris Kota Batam; Pengda INI Batam |
| Pertanahan/lahan | `jenis_layanan` (array), `loket_mpp` (bool), `kanal_online` | `office=government` + `government=cadaster` (BPN) / `government=administrative` (BP Batam) | kot-batam.atrbpn.go.id; lms.bpbatam.go.id; ptsp.bpbatam.go.id |
| Posbakum | `instansi_induk`, `layanan_gratis` (array), `pendampingan_sidang` (bool), `syarat` | tetap di node `amenity=courthouse`; Posbakum cukup jadi atribut, bukan node terpisah | situs PN/PA Batam |
| OBH/LBH | `akreditasi_bphn` (A/B/C/tidak), `periode_akreditasi`, `layanan_gratis` (litigasi/non-litigasi), `mitra_kanwil_tahun` | `office=lawyer` + `lawyer=legal_aid` (usulan) atau `office=ngo` | bphn.go.id/layanan/bantuan-hukum/obh; sidbankum.bphn.go.id; kepri.kemenkum.go.id |
| Organisasi advokat | `afiliasi_dpn`, `layanan_pbh` (bool) | `office=association` | peradi.or.id; peradi.id |
| Konsultan pajak | `asosiasi` (IKPI/AKP2I), `izin_praktik_djp` | `office=tax_advisor` | ikpi.or.id |
| KJPP | `nomor_izin_kjpp`, `kantor_pusat`, `bidang` (properti/bisnis) | `office=consulting` + `consulting=valuation` (usulan) | e-directory.mappi.or.id |
| Penerjemah tersumpah | `nomor_sk`, `pasangan_bahasa` | `office=translator` | Ditjen AHU (database penerjemah tersumpah) |
| Pejabat lelang / KPKNL | `wilayah_jabatan`, `kelas` | `office=government` (KPKNL) / `office=notary` (jika notaris) | DJKN Kemenkeu |
| Izin usaha/UMKM | `layanan` (NIB, OSS, konsultasi), `jam_layanan` | `office=government` | ptsp.bpbatam.go.id; easy.batam.go.id; diskum.batam.go.id |

---

## Recommendations

1. **Tampilkan MPP sebagai pin "hub"** dengan sub-daftar loket (BP Batam/PTSP, BPN, pajak, DPMPTSP), lalu tautkan kartu "Urusan tanah: ke mana untuk apa" ke pin BP Batam, BPN, dan MPP.
2. **Rilis kategori PPAT/notaris dengan label "Beta – data komunitas, verifikasi sendiri"**, lalu buka formulir koreksi untuk pemilik kantor. Jangan tampilkan nomor SK dari blog 2019.
3. **Jadikan Posbakum PN dan PA sebagai entri bantuan hukum utama**, karena pasti ada dan gratis. Entri LBH baru diberi badge "terakreditasi BPHN 2025–2027" setelah dicek di Sidbankum.
4. **Untuk kecamatan pulau** (Belakang Padang, Bulang, Galang), tambahkan kartu informasi alih-alih pin kosong.
5. **Jadwalkan validasi ulang tiap 6 bulan**, terutama untuk nomor WA layanan BP Batam yang sering berganti dan alamat DPC organisasi advokat yang berpindah.

## Caveats

- Semua koordinat sengaja dikosongkan (`null`). Tidak ada koordinat yang terverifikasi dalam riset ini.
- Daftar PPAT dari blog direktori bertanggal 2019. Kantor bisa sudah pindah, PPAT bisa sudah pensiun atau meninggal, dan nomor SK di sana tidak bisa dipercaya.
- Jumlah PPAT (125) adalah data 2022; angka 2025 "sekitar 140" belum jelas wilayahnya. Jumlah notaris (139) adalah data April 2025.
- Daftar OBH terakreditasi 2025–2027 untuk Batam belum terbaca langsung dari BPHN. Status LBH di tabel C merujuk ke kemitraan 2023.
- Ada konflik data yang perlu dicek: nomor WA PTSP BP Batam (dua versi), telepon KJPP ANR (dua versi), dan alamat DPC Peradi Batam (KBC vs Batam Centre Square).
- Kelurahan untuk sejumlah alamat di Batam Centre (Teluk Tering vs Belian vs Baloi Permai) diisi berdasarkan petunjuk sumber dan harus dicek ulang.

---

## Data JSON (seed)

```json
[
  {"id":"pertanahan-kantah-bpn-batam","nama":"Kantor Pertanahan (BPN) Kota Batam","kategori":"pertanahan_lahan","subkategori":"kantor_pertanahan","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Jaksa Agung R. Soeprapto, Sungai Harapan, Sekupang, Kota Batam 29428","lat":null,"lng":null,"jam_layanan":null,"kontak":{"wa_pengaduan":"+6285150000722","email":"kot-batam@atrbpn.go.id"},"atribut":{"layanan":["sertifikat","balik_nama","pengecekan_sertifikat","hak_tanggungan","roya","PTSL"],"loket_mpp":true,"osm":"office=government; government=cadaster","status_data":"terverifikasi"},"sumber_url":["https://kot-batam.atrbpn.go.id/","https://www.facebook.com/KantahKotaBatam/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"pertanahan-bp-batam-pusat","nama":"BP Batam – Kantor Pusat","kategori":"pertanahan_lahan","subkategori":"pengelola_lahan_hpl","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Ibnu Sutowo No. 1, Batam Centre, Kota Batam 29400","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 462047 / 462048","email":"humas@bpbatam.go.id"},"atribut":{"layanan":["alokasi_lahan","UWT","izin_peralihan_hak","perpanjangan_alokasi","persetujuan_hak_tanggungan"],"osm":"office=government; government=administrative","status_data":"terverifikasi"},"sumber_url":["https://e-ppid.bpbatam.go.id/profil/alamat/","https://b-care.bpbatam.go.id/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"pertanahan-bp-batam-lms","nama":"BP Batam – Land Management System (LMS Online)","kategori":"pertanahan_lahan","subkategori":"layanan_lahan_online","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Ibnu Sutowo No. 1, Batam Centre (layanan daring: lms.bpbatam.go.id)","lat":null,"lng":null,"jam_layanan":null,"kontak":{"wa_konsultasi":"+628117048000","wa_penataan":"+628117704770","wa_ksb":"+628117704771","email":"lms-online@bpbatam.go.id"},"atribut":{"kanal_online":"https://lms.bpbatam.go.id/portal/","fitur":["kalkulator_UWT","formulir","lacak_permohonan","perpanjangan_hak_atas_tanah"],"masa_UWT_tahun":{"alokasi_awal":30,"perpanjangan":20,"pembaruan":30},"status_data":"terverifikasi"},"sumber_url":["https://lms.bpbatam.go.id/portal/bantuan/kontak-kami","https://lms.bpbatam.go.id/portal/bantuan/qna/detail/l5"],"status_koordinat":"perlu_diisi_user"},
  {"id":"pertanahan-ptsp-bp-batam-mpp","nama":"PTSP BP Batam (loket MPP)","kategori":"pertanahan_lahan","subkategori":"ptsp_lahan_perizinan","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"MPP Kota Batam, Lt. Dasar Gedung Sumatera Convention Center, Batam Centre 29400","lat":null,"lng":null,"jam_layanan":"Senin–Jumat 08.00–16.30 WIB (antrean tutup 15.00)","kontak":{"wa_info_perizinan":"+628556670011","wa_pengaduan":"+628556670009","email":"tuptsp@bpbatam.go.id"},"atribut":{"layanan":["pertanahan","OSS","IBOSS","konsultasi_pertanahan","penandatanganan_SPPT"],"catatan":"Nomor lama +628117676666 di halaman pengaduan; kelurahan perlu cek","status_data":"perlu_cek_ulang"},"sumber_url":["https://ptsp.bpbatam.go.id/en/","https://ptsp.bpbatam.go.id/en/pengaduan/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"layanan-mpp-batam","nama":"Mal Pelayanan Publik (MPP) Kota Batam","kategori":"pertanahan_lahan","subkategori":"mal_pelayanan_publik","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Lt. Dasar, Gedung Sumatera Convention Center, Jl. Engku Putri, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":{"call_center":"(0778) 468278"},"atribut":{"instansi":["Pemko Batam","BP Batam","BPN","KPP Pratama (bergiliran)","DPMPTSP (Lt. 2)","Bank BRI"],"hub":true,"osm":"office=government","status_data":"terverifikasi","catatan_kelurahan":"perlu cek (Belian vs Teluk Tering)"},"sumber_url":["https://mpp.batam.go.id/","https://pajak.go.id/en/node/105674"],"status_koordinat":"perlu_diisi_user"},
  {"id":"usaha-dpmptsp-batam","nama":"DPMPTSP Kota Batam","kategori":"perizinan_usaha","subkategori":"perizinan_usaha_daerah","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Lt. 2 MPP, Gedung Sumatera Convention Centre, Jl. Engku Putri, Batam 29461","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 473228","email":"dpmptsp@batam.go.id"},"atribut":{"kanal_online":"https://easy.batam.go.id/web/","status_data":"terverifikasi"},"sumber_url":["https://easy.batam.go.id/web/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"lelang-kpknl-batam","nama":"KPKNL Batam","kategori":"pertanahan_lahan","subkategori":"lelang_negara","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Engku Putri (depan Gedung Pusat Informasi Haji), Batam Centre 29444","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 469825","email":"kpknlbatam@kemenkeu.go.id"},"atribut":{"osm":"office=government","status_data":"terverifikasi"},"sumber_url":["https://www.djkn.kemenkeu.go.id/kpknl-batam"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-wirlisman","nama":"Kantor Notaris & PPAT Wirlisman, S.H., Sp.N.","kategori":"ppat_notaris","subkategori":"notaris_ppat","kecamatan":"Batu Ampar","kelurahan":"Sungai Jodoh","alamat":"Komplek Jaya Putra Blok B-5, Jl. Raja Ali Haji, Sungai Jodoh, Batam 29453","lat":null,"lng":null,"jam_layanan":"Senin–Jumat 07.30–17.00, Sabtu 07.30–12.00 (klaim situs kantor)","kontak":{"telepon":"(0778) 431931"},"atribut":{"ppat":true,"notaris":true,"wilayah_kerja":"Kota Batam (perlu cek)","nomor_sk_ppat":null,"osm":"office=notary","status_data":"perlu_cek_ulang"},"sumber_url":["https://notarisppat.or.id/","http://notarisbatamwirlisman.blogspot.com/p/alamat-kantor.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-wany-thamrin","nama":"Kantor Notaris/PPAT Wany Thamrin, S.H., M.Kn.","kategori":"ppat_notaris","subkategori":"notaris_ppat","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Komplek Ruko Bintang Raya A No. 12, Jl. Regata, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 7483660"},"atribut":{"ppat":true,"notaris":true,"pejabat_lelang_kelas_ii":true,"catatan":"status PPAT/notaris disimpulkan dari email kantor & daftar blog 2019","osm":"office=notary","status_data":"perlu_cek_ulang"},"sumber_url":["https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf"],"status_koordinat":"perlu_diisi_user"},
  {"id":"lelang-juli-cristie","nama":"Kantor Juli Cristie, S.H., S.E., M.Kn.","kategori":"ppat_notaris","subkategori":"pejabat_lelang_kelas_ii","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Komplek Ruko Rafflesia Business Center Blok B No. 10, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 472785"},"atribut":{"pejabat_lelang_kelas_ii":true,"ppat":null,"notaris":null,"status_data":"perlu_cek_ulang"},"sumber_url":["https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf"],"status_koordinat":"perlu_diisi_user"},
  {"id":"lelang-analis-wida","nama":"Kantor Analis Wida Delima Pandjaitan, S.H., M.Kn.","kategori":"ppat_notaris","subkategori":"pejabat_lelang_kelas_ii","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Ruko Royal Sincom Blok E No. 05, Batam Center","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 422555"},"atribut":{"pejabat_lelang_kelas_ii":true,"ppat":null,"notaris":null,"status_data":"perlu_cek_ulang"},"sumber_url":["https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-yondri-darto","nama":"Kantor PPAT Yondri Darto","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":"Lubuk Baja","kelurahan":"Lubuk Baja Kota","alamat":"Jl. Sultan Abdul Rachman, Komplek Sulaiman Blok A No. 10–12, Nagoya","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"nomor_sk_ppat":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-titik-sulistyowati","nama":"Kantor PPAT Titik Sulistyowati","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Engku Putri, Ruko Taman Mediterania Blok KK4 No. 3A","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-najemah","nama":"Kantor PPAT Najemah","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Ruko Purimas, Jl. Engku Putri Blok B No. 37","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-rian-sugito","nama":"Kantor Notaris/PPAT Rian Sugito, S.H., M.Kn.","kategori":"ppat_notaris","subkategori":"notaris_ppat","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Komplek Accelence Blok A No. 16, Jl. Pasir Putih, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":true,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html","https://masuksini.info/berita/daftar-alamat-dan-kontak-notaris-ppat-di-kota-batam"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-bambang-purwanto","nama":"Kantor PPAT Bambang Purwanto","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":"Batam Kota","kelurahan":"Taman Baloi","alamat":"Town House Palm View Blok B No. 2","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-yulianti","nama":"Kantor PPAT Yulianti","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Lt. 3 Gedung Sumatera Convention Centre, Jl. Engku Putri Kav. 1","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-bambang-muchsinanto","nama":"Kantor PPAT Bambang Muchsinanto","kategori":"ppat_notaris","subkategori":"ppat","kecamatan":null,"kelurahan":null,"alamat":"Komplek Tanah Mas Blok E No. 3, Lt. 2","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":null,"status_data":"perlu_cek_ulang","usang":"sumber 2019"},"sumber_url":["https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html"],"status_koordinat":"perlu_diisi_user"},
  {"id":"ppat-kiki","nama":"Kantor Notaris & PPAT Kiki, S.H., M.Kn.","kategori":"ppat_notaris","subkategori":"notaris_ppat","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Komplek Ruko Mahkota Raya Blok G No. 7, Teluk Tering 29461","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"ppat":true,"notaris":true,"status_data":"perlu_cek_ulang","sumber_jenis":"agregator"},"sumber_url":["https://jashalegal.com/notaris/kota-batam/profil/kantor-notaris-dan-ppat-kiki-batam-kota"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-posbakum-pn-batam","nama":"Posbakum Pengadilan Negeri Batam","kategori":"bantuan_hukum","subkategori":"posbakum","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Gedung PN Batam, Jl. Engku Putri, Batam Centre","lat":null,"lng":null,"jam_layanan":"hari dan jam kerja pengadilan","kontak":{"telepon_pn":"(0778) 468828"},"atribut":{"layanan_gratis":["informasi_hukum","konsultasi","advis","pembuatan_dokumen_hukum"],"pendampingan_sidang":false,"dasar":"PERMA 1/2014","osm":"amenity=courthouse (atribut)","status_data":"terverifikasi"},"sumber_url":["https://pn-batam.go.id/index.php/pos-bantuan-hukum/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-posbakum-pa-batam","nama":"Posbakum Pengadilan Agama Batam","kategori":"bantuan_hukum","subkategori":"posbakum","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. R.E. Martadinata No. 5, Sungai Harapan, Sekupang","lat":null,"lng":null,"jam_layanan":"hari dan jam kerja pengadilan","kontak":{"telepon_pa":"(0778) 323308"},"atribut":{"layanan_gratis":["konsultasi","pembuatan_gugatan_permohonan"],"perkara":["cerai","harta_bersama","hadhanah","nafkah"],"pendampingan_sidang":false,"status_data":"terverifikasi"},"sumber_url":["https://pa-batam.go.id/tentang-pengadian/profile-pengadilan/alamat-pengadilan","https://ptsp.pa-batam.go.id/syarat-pengajuan-perkara"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-lbh-mawar-saron-batam","nama":"LBH Mawar Saron Batam","kategori":"bantuan_hukum","subkategori":"lbh","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Ruko Permata Niaga Blok D No. 3–4, Komplek Sukajadi, Batam","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 430990","email":"contact@lbhmawarsaron.or.id"},"atribut":{"akreditasi_bphn":"perlu cek (2025–2027)","mitra_kanwil_tahun":[2023],"layanan_gratis":["litigasi","non_litigasi","konsultasi"],"osm":"office=lawyer; lawyer=legal_aid (usulan)","status_data":"perlu_cek_ulang"},"sumber_url":["https://lbhmawarsaron.or.id/contact-us/","https://kepri.antaranews.com/berita/148707/kemenkumham-kepri-rangkul-tujuh-lbh-beri-bantuan-hukum-gratis"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-lbh-peduli-harapan-bangsa","nama":"LBH Peduli dan Harapan Bangsa","kategori":"bantuan_hukum","subkategori":"lbh","kecamatan":null,"kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"akreditasi_bphn":"perlu cek","mitra_kanwil_tahun":[2023],"status_data":"perlu_cek_ulang"},"sumber_url":["https://kepri.antaranews.com/berita/148707/kemenkumham-kepri-rangkul-tujuh-lbh-beri-bantuan-hukum-gratis"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-lbh-yayasan-suara-keadilan","nama":"LBH Yayasan Suara Keadilan","kategori":"bantuan_hukum","subkategori":"lbh","kecamatan":null,"kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"akreditasi_bphn":"perlu cek","mitra_kanwil_tahun":[2023],"status_data":"perlu_cek_ulang"},"sumber_url":["https://gokepri.com/tujuh-lbh-di-kepri-berikan-bantuan-hukum-gratis-bagi-warga-miskin/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-dpc-peradi-batam","nama":"DPC Peradi Batam & PBH Peradi Batam","kategori":"bantuan_hukum","subkategori":"organisasi_advokat","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Kantor Hukum Mustari & Partners, Jl. Engku Puteri, Komplek Batam Centre Square Blok C No. 3 (daftar DPN Maret 2025); alamat sekretariat lama: Ruko KBC Blok A5 No. 5, Batam Centre, Kel. Belian","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"afiliasi_dpn":"peradi.or.id","layanan_pbh":true,"osm":"office=association","status_data":"perlu_cek_ulang"},"sumber_url":["https://www.peradi.or.id/files/Alamat%20DPC%20PERADI%20_-_%20Update%20Maret%202025.pdf","https://www.peradi.or.id/files/Alamat_DPC_PERADI_2024.pdf","https://www.matakepri.com/detail-news/2022/07/28/25712/www.matakepri.com"],"status_koordinat":"perlu_diisi_user"},
  {"id":"hukum-dpc-peradi-batam-raya","nama":"DPC Peradi Batam Raya","kategori":"bantuan_hukum","subkategori":"organisasi_advokat","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Komplek Nagoya Newton Blok A No. 10, Nagoya, Lubuk Baja","lat":null,"lng":null,"jam_layanan":null,"kontak":{"wa_resmi_organisasi":"+628127779977","email":"dpc.batamraya@gmail.com"},"atribut":{"afiliasi_dpn":"peradi.id","osm":"office=association","status_data":"perlu_cek_ulang"},"sumber_url":["https://peradi.id/dpc/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"pajak-ikpi-batam","nama":"IKPI Cabang Batam (sekretariat)","kategori":"jasa_dokumen","subkategori":"asosiasi_konsultan_pajak","kecamatan":null,"kelurahan":null,"alamat":"Komplek Ruko Royal Sincom Blok C No. 12, Batam","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 461325"},"atribut":{"ketua":"Bunandi (2024–2029)","osm":"office=association","status_data":"perlu_cek_ulang"},"sumber_url":["https://ikpikepri.org/","https://ikpi.or.id/en/ikpi-kepri-fokuspenguatan-edukasi-pajak-dan-perluasan-anggota/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"pajak-akp2i-kepri","nama":"AKP2I Pengda Kepri","kategori":"jasa_dokumen","subkategori":"asosiasi_konsultan_pajak","kecamatan":null,"kelurahan":null,"alamat":"Komplek Ruko Buana Bukit Permata Blok Goldstone II No. 26, Batam","lat":null,"lng":null,"jam_layanan":null,"kontak":{"email":"sekretariat@akp2ikepri.org"},"atribut":{"osm":"office=association","status_data":"perlu_cek_ulang"},"sumber_url":["https://www.facebook.com/akp2ikepri/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"kjpp-mbpru-batam","nama":"KJPP Muttaqin Bambang Purwanto Rozak Uswatun & Rekan – Cabang Batam","kategori":"jasa_dokumen","subkategori":"kjpp","kecamatan":"Batam Kota","kelurahan":"Baloi Permai","alamat":"Komp. Ruko Taman Duta Mas Blok B No. 18, Baloi Permai, Batam 29431","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 4801492","email":"mbpru.batam@gmail.com"},"atribut":{"bidang":["properti"],"osm":"office=consulting; consulting=valuation (usulan)","status_data":"terverifikasi"},"sumber_url":["https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4","https://www.kjpp-mbpru.com/contact"],"status_koordinat":"perlu_diisi_user"},
  {"id":"kjpp-anr-batam","nama":"KJPP Aksa, Nelson & Rekan – Cabang Batam","kategori":"jasa_dokumen","subkategori":"kjpp","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Komp. Ruko Permata Niaga Blok E No. 25, Sukajadi, Batam 29432","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 37220003","email":"batam@kjpp-anr.com"},"atribut":{"catatan":"MAPPI mencantumkan 0778-3720002","status_data":"perlu_cek_ulang"},"sumber_url":["https://kjpp-anr.com/contact/","https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4"],"status_koordinat":"perlu_diisi_user"},
  {"id":"kjpp-damianus-ambur-batam","nama":"KJPP Damianus Ambur & Rekan – Cabang Batam","kategori":"jasa_dokumen","subkategori":"kjpp","kecamatan":"Sekupang","kelurahan":null,"alamat":"Perumahan Taman Sari Blok H No. 24 RT 03 RW 04, Tiban, Sekupang","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"0778-8011205"},"atribut":{"status_data":"terverifikasi","catatan_kelurahan":"Tiban (Baru/Lama/Indah) perlu cek"},"sumber_url":["https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4"],"status_koordinat":"perlu_diisi_user"},
  {"id":"usaha-plut-kumkm-batam","nama":"UPTD PLUT-KUMKM Kota Batam","kategori":"perizinan_usaha","subkategori":"pendampingan_umkm","kecamatan":"Bengkong","kelurahan":"Tanjung Buntung","alamat":"Komplek Golden Prima/Golden City, Tanjung Buntung, Bengkong 29432","lat":null,"lng":null,"jam_layanan":null,"kontak":{},"atribut":{"layanan":["fasilitasi_NIB","konsultasi_usaha","pelatihan"],"osm":"office=government","status_data":"terverifikasi"},"sumber_url":["https://www.plutkumkm-kotabatam.com/","https://mediacenter.batam.go.id/2022/04/01/gedung-pusat-layanan-umum-terpadu-diresmikan-rudi-tegaskan-pemko-batam-terus-berupaya-perkuat-umkm/"],"status_koordinat":"perlu_diisi_user"},
  {"id":"usaha-diskum-batam","nama":"Dinas Koperasi dan Usaha Mikro Kota Batam","kategori":"perizinan_usaha","subkategori":"dinas_umkm","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Pramuka No. 1, Sungai Harapan, Sekupang 29424","lat":null,"lng":null,"jam_layanan":null,"kontak":{"telepon":"(0778) 321670","email":"ukmbatam@gmail.com"},"atribut":{"osm":"office=government","status_data":"terverifikasi"},"sumber_url":["https://diskum.batam.go.id/kontak/"],"status_koordinat":"perlu_diisi_user"}
]
```

---

## Daftar entri yang koordinatnya belum pasti (semua perlu diisi user)

Semua 33 entri di JSON berstatus `perlu_diisi_user`. Isi berdasarkan alamat di JSON:

1. pertanahan-kantah-bpn-batam
2. pertanahan-bp-batam-pusat
3. pertanahan-bp-batam-lms (bisa disamakan dengan BP Batam Pusat)
4. pertanahan-ptsp-bp-batam-mpp (pin sama dengan MPP)
5. layanan-mpp-batam
6. usaha-dpmptsp-batam (gedung MPP, Lt. 2)
7. lelang-kpknl-batam
8. ppat-wirlisman
9. ppat-wany-thamrin
10. lelang-juli-cristie
11. lelang-analis-wida
12. ppat-yondri-darto
13. ppat-titik-sulistyowati
14. ppat-najemah
15. ppat-rian-sugito
16. ppat-bambang-purwanto
17. ppat-yulianti (gedung MPP, Lt. 3)
18. ppat-bambang-muchsinanto (kecamatan juga belum diketahui)
19. ppat-kiki
20. hukum-posbakum-pn-batam
21. hukum-posbakum-pa-batam
22. hukum-lbh-mawar-saron-batam
23. hukum-lbh-peduli-harapan-bangsa (alamat belum ditemukan)
24. hukum-lbh-yayasan-suara-keadilan (alamat belum ditemukan)
25. hukum-dpc-peradi-batam (dua kandidat alamat)
26. hukum-dpc-peradi-batam-raya
27. pajak-ikpi-batam
28. pajak-akp2i-kepri
29. kjpp-mbpru-batam
30. kjpp-anr-batam
31. kjpp-damianus-ambur-batam
32. usaha-plut-kumkm-batam
33. usaha-diskum-batam

## Daftar sumber

- batam — https://batam.co.id/uwto-batam/
- bpbatam — https://lms.bpbatam.go.id/portal/bantuan/qna/detail/l5
- bpbatam — https://b-care.bpbatam.go.id/
- facebook — https://www.facebook.com/KantahKotaBatam/
- atrbpn — https://kot-batam.atrbpn.go.id/
- 99 — https://www.99.co/id/panduan/kekuatan-hukum-ppat-camat/
- kemenkum — https://kepri.kemenkum.go.id/berita-utama/konferda-ini-batam-2025-kemenkumham-ajak-notaris-aktif-tingkatkan-kapasitas-dan-kebersamaan
- notarisppat — https://www.notarisppat.or.id/tanya-jawab/kantor-notaris-ppat/jasa-notaris-batam-pendirian-pt,-cv,-yayasan,-dan-koperasi.html
- batamxinwen — https://www.batamxinwen.com/rayakan-hut-ke-35-pengda-ippat-kota-batam-gelar-aneka-perlombaan-dan-bakti-sosial/
- pajak — https://pajak.go.id/en/node/105674
- kemenkeu — https://ppiddjkn.kemenkeu.go.id/storage/20251128-6391.pdf
- ahu — https://ahu.go.id/notariatv3/pendaftaranUser/formasiNotaris?page=15
- blogspot — https://carialamatlokasi.blogspot.com/2019/08/PPAT-Kepulauan-Riau-Kota-Batam.html
- locusmedia — https://jurnal.locusmedia.id/index.php/jkih/article/download/632/372/1440
- antaranews — https://kepri.antaranews.com/berita/148707/kemenkumham-kepri-rangkul-tujuh-lbh-beri-bantuan-hukum-gratis
- batam — https://easy.batam.go.id/web/
- batam — https://mpp.batam.go.id/
- bpbatam — https://e-ppid.bpbatam.go.id/sop-layanan-publik/pelayanan-terpadu-satu-pintu/
- bpbatam — https://e-ppid.bpbatam.go.id/profil/alamat/
- bpbatam — https://lms.bpbatam.go.id/portal/bantuan/kontak-kami
- bpbatam — https://ptsp.bpbatam.go.id/peraturan-pemerintah-nomor-32-tahun-2021/
- bpbatam — https://ptsp.bpbatam.go.id/en/
- kemenkeu — https://www.djkn.kemenkeu.go.id/kpknl-batam
- bpbatam — https://ptsp.bpbatam.go.id/en/pengaduan/
- blogspot — http://notarisbatamwirlisman.blogspot.com/p/alamat-kantor.html
- notarisppat — https://notarisppat.or.id/tanya-jawab/kantor-notaris-ppat/kantor-notaris-ppat-jakarta-wirlisman,-s-h.html
- masuksini — https://masuksini.info/berita/daftar-alamat-dan-kontak-notaris-ppat-di-kota-batam
- jasa — https://jasa.legal/notaris/batam/profil/kantor-notaris-dan-ppat-kiki-batam-kota
- jashalegal — https://jashalegal.com/notaris/kota-batam/profil/kantor-notaris-dan-ppat-kiki-batam-kota
- masuksini — https://www.masuksini.com/detail-blog/972727/daftar-alamat-dan-kontak-notaris-ppat-di-kota-batam/
- unsri — https://journal.fh.unsri.ac.id/index.php/repertorium/article/download/857/398
- pa-watampone — https://www.pa-watampone.go.id/tentang-pengadilan-profil-pengadilan-agama-watampone/profil-pengadilan/statistik-pengadilan/9-artikel/564-alamat-situs-pengadilan-negeri-se-indonesia
- pa-batam — https://pa-batam.go.id/tentang-pengadian/profile-pengadilan/alamat-pengadilan
- pa-batam — https://www.web.pa-batam.go.id/index.php?option=com_content&view=article&id=142:alamat&catid=25&Itemid=740
- pa-batam — https://ptsp.pa-batam.go.id/syarat-pengajuan-perkara
- lbhmawarsaron — https://lbhmawarsaron.or.id/contact-us/
- carilayanan — https://carilayanan.com/listing/lbh-mawar-saron-batam/
- gokepri — https://gokepri.com/tujuh-lbh-di-kepri-berikan-bantuan-hukum-gratis-bagi-warga-miskin/
- peradi — https://www.peradi.or.id/files/Alamat%20DPC%20PERADI%20_-_%20Update%20Maret%202025.pdf
- matakepri — https://www.matakepri.com/detail-news/2022/07/28/25712/www.matakepri.com
- peradi — https://peradi.id/dpc/
- pn-tabanan — https://pn-tabanan.go.id/layanan-hukum/posbakum/1c383cd30b7c298ab50293adfecb7b18
- pekalongan-news — https://www.pekalongan-news.com/2025/01/law-justice-hadirkan-layanan-konsultasi.html
- pn-sumbawabesar — https://pn-sumbawabesar.go.id/v2/index.php/hukum/layanan-hukum-bagi-masyarakat-kurang-mampu/prosedur-bantuan-hukum
- peradi — https://peradi.id/hubungi-peradi/
- ikpikepri — https://ikpikepri.org/
- facebook — https://www.facebook.com/akp2ikepri/
- kjpp-mbpru — https://www.kjpp-mbpru.com/contact
- bkppkutim — https://bkppkutim.com/kantor-jasa-penilai-publik-kjpp-mbpru-dan-rekan-4848206675339813679/
- mappi — https://e-directory.mappi.or.id/kjpp/cabang?dpd_id=4
- kjpp-anr — https://kjpp-anr.com/contact/
- batam — https://mediacenter.batam.go.id/2022/04/01/gedung-pusat-layanan-umum-terpadu-diresmikan-rudi-tegaskan-pemko-batam-terus-berupaya-perkuat-umkm/
- plutkumkm-kotabatam — https://www.plutkumkm-kotabatam.com/
- batam — https://diskum.batam.go.id/kontak/
- ikpi — https://ikpi.or.id/en/ikpi-batam-dukung-penuh-kebijakan-pusat-wujudkan-organisasi-konsultan-pajak-kelas-dunia/
- megapenerjemah — https://megapenerjemah.com/penerjemah-resmi-tersumpah-batam/
- megapenerjemah — https://megapenerjemah.com/penerjemah-tersumpah-di-batam/
- penerjemah-id — https://penerjemah-id.com/daftar-penerjemah-tersumpah-kemenkumham/
- penerjemahtersumpahbatam — https://penerjemahtersumpahbatam.com/
- kemenkumham — https://kanimbatam.kemenkumham.go.id/berita/2022/03/apresiasi-atas-dukungan-bpn-kota-batam-imigrasi-batam-serahkan-piagam-penghargaan
- batamtimes — https://www.batamtimes.co/2022/03/01/pemko-batam-memiliki-rumah-plut-kumkm-berada-di-kawasan-golden-city-bengkong/
