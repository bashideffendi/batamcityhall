# Pedoman Batam City Hall

Versi 1.1, 5 November 2026. Acuan tunggal untuk bahasa, teks, tampilan, dan peta situs Batam City Hall.

Versi 1.1 mengganti arah tampilan menjadi editorial dengan grafis Riso (bagian 4 dan 5), menambah panel Tempat di peta (5.3), dan menyesuaikan naskah beranda serta Loket 01 (3.2 dan 3.3).

> **Koreksi pemilik, 5 November 2026. Menang atas isi di bawah bila bertentangan.**
>
> 1. Istilah "loket" tidak dipakai di teks yang tampil. Bagian situs disebut dengan namanya. "Loket ini memuat" menjadi "Bagian ini memuat", dan "ISI LOKET INI" menjadi "ISI BAGIAN INI". Loket sungguhan di kantor atau pelabuhan tetap ditulis loket.
> 2. Nomor kecil 01—07 di menu dan di daftar bagian beranda tetap dipakai. Nomor besar di halaman pembuka dihapus.
> 3. Penanda di atas judul halaman pembuka berisi isi bagiannya, misalnya RADAR HUJAN · GELOMBANG · CCTV (`lib/site.ts`, `penanda`). Halaman di dalam bagian memakai nama bagian sebagai penanda.
> 4. Judul daftar bagian di beranda: "Jelajahi Batam", tanpa penanda.
> 5. Route dan nama bagian tidak berubah. Nama `LOKET` di kode dan nama berkas `loket-*.webp` tidak tampil, jadi tetap.

> **Koreksi pemilik, 5 November 2026. Menang atas semua isi di bawah dan atas koreksi di atas bila bertentangan.**
>
> 1. **Teks singkat, di seluruh situs.** Orang malas membaca. Setiap kalimat harus efektif: buang kata dan kalimat yang tidak menambah informasi. Kalimat panjang hanya boleh bila memang perlu untuk menjelaskan sesuatu. Naskah bagian 3 tidak lagi wajib dipakai persis; yang menang adalah teks yang lebih singkat dengan fakta yang sama. Aturan bahasa di bagian 2 tetap berlaku. Isi faktual tidak boleh berubah, terutama legalitas, Rempang, sejarah, kesehatan, darurat, dan hukum.
> 2. **Makan didesain ulang** mengikuti riset platform makanan (November 2026). Menu baru: Hidangan · Kawasan · Panduan · Dekat feri · Peta · Simpanan, ditambah Cara Kami Memilih. Alamat `/makan/daftar`, `/makan/kategori`, `/makan/jalur`, `/makan/tersimpan`, dan `/makan/tentang` dialihkan ke alamat baru. Bagian 3.4 di bawah hanya berlaku untuk hal yang tidak diubah desain baru.
> 3. **Nama hidangan, nama kategori, menu andalan, dan semua teks yang tampil sebagai judul memakai Title Case** (kaidah 2.3 untuk judul): Martabak dan Prata, bukan Martabak dan prata. Tabel kategori di 3.4 dan aturan "nama kategori kapital awal" di 2.3 tidak berlaku lagi. `lib/judul.ts` menyediakan `kaidahJudul`. Pengecualian: entri kamus mengikuti cara penulisan kamus. Tombol, saringan, dan label status tetap kapital awal.
> 4. **Galeri foto di detail tempat.** Bingkai kosong boleh tampil sampai foto tersedia, atas permintaan pemilik. Prinsip 1.7 tidak berlaku untuk galeri ini. Foto ditaruh di `public/foto/makan/<id-tempat>/`.

> **Koreksi pemilik, rombak menu, November 2026. Menang atas semua isi di bawah dan atas dua koreksi di atas bila bertentangan.**
>
> 1. **Menu tanpa nomor** (`BAGIAN` di `lib/site.ts`), urutan sejak 9 Nov 2026 menurut keperluan pembaca: Beranda di depan (tautan tersendiri di `components/site/SiteNav.tsx`, bukan anggota `BAGIAN`; ikon rumah di menu lebar supaya semua bagian muat satu baris, teks di menu ponsel), kebutuhan saat ini (Cuaca · CCTV · Transportasi), layanan (Layanan Warga), jalan-jalan (Makanan · Things to Do), bacaan (Berita · Jurnal · Infografik · Dataset · Sejarah dan Budaya), lalu warga (Komunitas · Tukang Langganan · Info Loker bila aktif). Tujuh loket di bagian 3 dibaca sebagai bagian-bagian ini. Nomor kecil dan penanda di atas judul dihapus. Alamat lama dialihkan di `next.config.ts`.
> 2. **Ruang Main dihapus.** Kartu Pos pindah ke `/kartu-pos` dengan enam desain siap cetak. Kalkulator Singapura atau Nagoya dan Vibe dihapus karena tidak fungsional.
> 3. **Hanya Bahasa Indonesia yang tampil.** Tombol ID, EN, dan 中 dihapus. Terjemahan tetap di kode untuk nanti. Bagian 2.10 tidak berlaku selama itu.
> 4. **Title Case untuk semua label pendek:** menu, submenu, tab, saringan, tombol, judul kolom, label status, jenis jasa. Kalimat tetap kapital awal. Entri kamus mengikuti kamus. Ini menggantikan kalimat terakhir butir 3 koreksi sebelumnya.
> 5. **Teks tidak penting dihapus.** Slogan di kepala dan kaki halaman hilang. Baris darurat (112, 110, 113, 115, 119) tampil di puncak setiap halaman.
> 6. **Beranda adalah dasbor:** cuaca dan laut hari ini, berita, Things to Do, transportasi, peta, makanan, CCTV, layanan warga, Jurnal, kartu pos. Setiap modul punya tautan Selengkapnya.
> 7. **Halaman bagian rapat:** judul, keterangan bila perlu, lalu isi. Tidak ada ruang kosong besar.
> 8. **Peta tanpa klaster.** Titik tidak pernah digabung dan tidak ada angka gabungan. Saat jauh tampil titik kecil supaya sebarannya terlihat, ikon mulai zoom 13. Kamera di koordinat yang sama dikipas di layar, datanya tidak berubah. Ini menggantikan aturan klaster di bagian 5. Peta selalu di dalam wadah halaman, kecuali di ponsel.
> 9. **Jurnal terpisah dari Berita.** Tulisan memakai judul, nama penulis, tanggal, dan narasi rata kanan-kiri, bukan poin-poin.
> 10. **Things to Do** menggantikan Kalender: tempat untuk dikunjungi, agenda bertanggal (konser, festival, pameran), dan acara sepanjang tahun. Agenda hanya tampil bila ada datanya, tidak dikarang.
> 11. **Dashboard `/admin`** untuk Jurnal, foto makanan, data makanan, dan agenda. Foto tetap boleh ditaruh di `public/foto/makan/<id-tempat>/`.
> 15. **Paragraf rata kanan-kiri** di desktop dan ponsel, di seluruh situs. Label, alamat, dan teks di kolom sempit tetap rata kiri.
> 14. **Info Loker** (`/loker`) adalah bagian baru, diisi lewat dashboard. Menunya tampil setelah basis data tersambung. Lowongan yang lewat batas lamaran tidak tampil.
> 13. **Kategori Makanan** diganti dengan 32 kategori pemilik, persis dan seurut daftarnya, di `data/makan/categories.json`. Ejaan pemilik yang dipakai: Mie, Sop, Seafood, Dimsum, Chinese Food, Coffee Shop, Bakery, Ice Cream, AYCE. Tempat boleh masuk lebih dari satu kategori lewat `kategori_lain`. Tabel kategori di 3.4 tidak berlaku lagi.
> 16. **Garis judul seksi menempel pada judulnya, isi diberi jarak di bawah garis** (7 Nov 2026). Tidak ada tombol, kolom, atau teks yang menempel di garis. Judul kecil ke paragraf juga diberi napas.
> 17. **Warna gelombang lebih tegas** (7 Nov 2026): kepekatan 0,65, menggantikan peredaman 0,4 di 5.2. Laut tetap tidak boleh biru pekat.
> 18. **Kaki situs berisi Tentang Situs, Kebijakan, dan Newsletter**, bukan menu (7 Nov 2026). Newsletter hanya menyimpan email dan tanggal, belum dibuka sampai basis data tersambung.
> 19. **Akun Instagram tampil sebagai logo dan nama akun**, tanpa kata "Instagram" (7 Nov 2026). Pembaca layar tetap mendengar "Instagram".
> 20. **Infografik** (`/infografik`) adalah bagian baru sesudah Jurnal, berupa kisi poster tegak seperti majalah (7 Nov 2026). Poster bawaan digambar dari data situs yang sudah terverifikasi, tidak ada angka baru. Infografik unggahan dashboard wajib menyertakan isinya dalam teks.
> 21. **Terjemahan Inggris untuk seluruh situs** menyusul setelah semua bagian selesai (7 Nov 2026). Sampai itu, butir 3 tetap berlaku.
> 12. **Food Court** adalah halaman baru di Makanan (`/makan/food-court`), per kecamatan. Datanya di `data/makan/foodcourt.json`, wajib bersumber, tanpa rating. Peta muncul otomatis setelah koordinatnya diisi.

> **Purwarupa sampul beranda, 9 Nov 2026 (belum final, menunggu pemilik).** Pemilik meminta posisi gambar dan menu seperti majalah Cultura, memakai peta isometrik buatannya. Yang ditiru hanya posisinya; huruf dan warna tetap bagian 4 supaya selaras ("tiru posisi, kalo font ... ngikut yg sebelumnya").
>
> 1. **Beranda dibuka dengan sampul selebar layar** (`components/site/SampulBeranda.tsx`): peta isometrik pemilik, nama situs di kiri atas, tanggal, cari, dan tema di kanan atas, label dan judul tulisan Jurnal terbaru di tengah bawah dengan latar kertas per baris, dan pita menu di dasar layar. Menu yang diklik membuka halaman dengan kepala normal. Gambarnya dibuat `node tools/grafis/sampul.mjs "<berkas peta>"`.
> 2. **Kepala normal di halaman lain:** nama situs di tengah, menu di bawahnya (posisi kepala beranda yang lama).
> 3. **Ilustrasi AI diberi keterangan di sampulnya** (Standar Redaksi), bersama atribusi OpenStreetMap yang wajib.
> 4. Periksa tampilan dengan `node tools/grafis/tangkap-layar.mjs <url> <folder> [alamat ...]`: semua `/api/*` ditiru, jadi tidak memanggil MSS atau BMKG.
> 5. **Peta sampul interaktif** (`components/site/PetaSampul.tsx`, OpenSeadragon; contoh pemilik: yadongxie.com/lab/san-francisco). Di layar bertetikus peta dimuat setelah halaman tenang dan bisa digeser; gulir biasa tetap menggulir halaman, Ctrl/Cmd+gulir memperbesar (mode kooperatif). Di layar sentuh sampul tetap gambar dan peta baru dimuat lewat tombol Jelajahi Peta. Jelajahi: layar penuh, peta kecil di kiri bawah, posisi di alamat `#x,y,zoom` (piksel gambar), Esc menutup. Ubin peta isometrik Barelang (sementara) di Cloudflare Pages proyek `barelang-peta`, ubin 2048 px dari `tools/peta/ubin_publik.py`; alamat, versi, bingkai sampul, dan data lapisan di `lib/peta-sampul.ts` (keputusan pemilik 11 Nov 2026). Dummy Harbour Bay di `public/grafis/sampul/harbourbay-zoom/` tidak dipakai lagi.

> **Nama situs, 11 Nov 2026 (keputusan pemilik). Menang atas semua penyebutan Batam City Hall di pedoman ini.** Nama situs dan *wordmark* ditulis Barelang.co (`SITE_NAME` di `lib/site.ts`). Nama penulis redaksi: Redaksi Barelang.co. Logo tetap tanpa siluet Jembatan Barelang (lambang resmi Kota Batam memuatnya).

## Cara Memakai Pedoman Ini

**Untuk Claude Code:**

1. Salin file ini ke repo sebagai `docs/PEDOMAN.md`.
2. Tambahkan baris berikut di bagian atas `CLAUDE.md`: "Baca `docs/PEDOMAN.md` sebelum mengubah teks, tampilan, atau peta. Jalankan pemeriksaan di bagian 7 sebelum menyatakan pekerjaan selesai."
3. Pedoman ini **menang atas semua dokumen lain** bila bertentangan:
   - `CLAUDE_CODE_PROMPT.md`;
   - `research/00` bagian 2 (nada) dan bagian 3 (nama loket);
   - `research/05` (nada, contoh *microcopy*, daftar hindari);
   - `data/design/microcopy.json`;
   - arah tampilan lama di `research/05` dan di `data/design/` (`palet_ui.json`, `tipografi_skala.json`, `tinta_riso.json`, `boleh_jangan.md`, `moodboard.md`): kertas krem, Source Serif 4, dan gaya peta laut tidak dipakai lagi;
   - bagian B lama di `04-AUDIT-DAN-KOREKSI.md`.
4. **Paket tampilan** (`paket-tampilan-editorial.zip`). Ekstrak ke akar repo. Isinya langsung masuk ke tempatnya:
   - `public/grafis/`: grafis Riso (4.7);
   - `data/design/design_tokens.css`: token warna baru, menimpa yang lama (4.2);
   - `tools/grafis/`: skrip grafis dan `ikon.json` (4.7, 5.4);
   - `docs/tampilan/contoh-tampilan/`: contoh tampilan, buka `index.html` (4.1).
5. **Teks di bagian 3 dipakai persis seperti tertulis.** Teks yang tidak tercantum di sana ditulis sendiri dengan mengikuti bagian 2. Jangan mengarang fakta. Kalimat yang memerlukan data diisi dari data yang ada.
6. Kerjakan sesuai urutan di bagian 8.

**Daftar isi**

1. Prinsip
2. Bahasa
3. Naskah situs
4. Tampilan
5. Peta
6. Yang disembunyikan sampai siap
7. Pemeriksaan sebelum selesai
8. Urutan kerja dan perbaikan per halaman

---

## 1. Prinsip

1. **Informasi dulu.** Setiap halaman menjawab tiga hal di layar pertama: ini apa, untuk siapa, dan kapan datanya.
2. **Bahasa Indonesia yang benar dan rapi.** Mengikuti EYD edisi V dan KBBI. Nada santai datang dari kalimat yang sederhana, bukan dari bahasa gaul atau lelucon.
3. **Tampilan editorial yang bersih dan artistik.** Kertas putih, judul besar yang tertata, grafis cetak Riso, dan ruang kosong yang lega. Hiasan hanya datang dari grafis yang membawa makna.
4. **Tidak menyebut pemerintah dan tidak mengarahkan ke situs pemerintah.** Pengecualian ada di 2.9.
5. **Tidak menampilkan tautan sumber.** Kredit data cukup di halaman Kolofon.
6. **Catatan kerja tidak tampil ke pembaca.** Ketidakpastian ditulis sekali, singkat, di tempat yang tepat.
7. **Yang belum siap disembunyikan, bukan ditampilkan sebagai *placeholder*.**

---

## 2. Bahasa

### 2.1 Nada dan Sapaan

- **Nada:** santai tetapi profesional, seperti petugas informasi yang ramah dan tahu jawabannya. Jelas, sopan, tidak menggurui, tidak bercanda.
- **Sapaan pembaca:** *kamu*, dengan huruf kecil. Gunakan hanya bila perlu. Kalimat tanpa sapaan lebih rapi.
  - Benar: "Simpan tempat favorit untuk dibuka lagi nanti."
  - Kurang rapi: "Kamu bisa menyimpan tempat favoritmu supaya kamu bisa membukanya lagi nanti."
- **Sapaan untuk tim:** *kami*.
- **Jangan memakai:** *Anda*, *lo*, *gue*, *kalian*, *teman-teman*, *guys*, atau sapaan khusus lain.
- **Lelucon tidak dipakai** di label, judul, status, pesan memuat, pesan galat, tombol, formulir, informasi darurat, kesehatan, hukum, tanah, maupun sejarah. Halaman Tentang boleh memuat satu kalimat yang hangat, tetapi tetap faktual.

### 2.2 Kalimat

- **Satu gagasan per kalimat.** Paling panjang sekitar 25 kata.
- **Kalimat pertama di setiap bagian menjelaskan isinya.**
- **Gunakan kalimat aktif bila pelakunya jelas.**
  - "Feri terakhir berangkat pukul 20.30 WIB", bukan "Keberangkatan terakhir dilakukan oleh feri pada pukul 20.30 WIB".
- **Hindari kata dan pola yang mubazir:**

| Hindari | Gunakan |
|---|---|
| adalah merupakan | adalah *atau* merupakan |
| sangat … sekali | sangat … |
| para … -para (para warga-warga) | para warga |
| dalam rangka, guna, sehubungan dengan | untuk, karena |
| yang mana, di mana (sebagai penghubung) | yang, tempat |
| mulai dari … hingga … (untuk daftar biasa) | sebutkan saja daftarnya |
| bagi para | bagi, untuk |
| melakukan pengecekan | memeriksa |
| terkait (berulang) | tentang, mengenai |

- **Jangan memakai pola "bukan X, melainkan Y" di luar tagline.** Pola penegas "X, bukan Y" hanya boleh untuk meluruskan arti (misalnya "panduan umum, bukan nasihat hukum"), paling banyak satu kali per halaman. Jangan pula memakai pola tiga serangkai yang dipaksakan, atau kalimat pendek beruntun untuk efek dramatis ("Tanpa iklan. Tanpa sponsor. Tanpa drama.").
- **Jangan memakai kalimat yang bisa dipindah ke situs kota mana pun tanpa diubah.** Setiap kalimat harus menyebut hal yang spesifik: nama tempat, jam, angka, atau jenis layanan.

### 2.3 Huruf Kapital

| Bagian | Aturan | Contoh |
|---|---|---|
| Judul halaman (H1) dan judul bagian (H2, H3) | Kapital di awal setiap kata, kecuali kata tugas yang tidak berada di awal (*di, ke, dari, dan, yang, untuk, pada, dengan, atau, bagi, tentang, oleh, sebagai, dalam, per*). Mengikuti kaidah judul EYD. | Radar Hujan · Siapa di Balik Nama Jalan · Urusan Tanah dan Rumah · Feri Terakhir Hari Ini · Kartu Pos dari Batam |
| Menu, tab, tombol, label, judul kolom tabel, nama kategori, label status | Kapital hanya di awal (dan pada nama diri). | Radar hujan · Kirim rekomendasi · Jam buka · Makanan laut dan gonggong · Buka sekarang |
| Nama geografis | Kapital bila diikuti nama diri. Huruf kecil bila umum. | Pulau Rempang, Selat Singapura, Kecamatan Sekupang, Kota Batam · *menyeberang ke pulau*, *di kecamatan ini* |
| Nama geografis sebagai penjelas jenis | Huruf kecil. | nasi padang, nasi ayam hainan |
| Nama suku dan bahasa | Kapital. | Melayu, Bugis, Tionghoa, masakan Sunda |
| Nama lembaga | Kapital di setiap kata kecuali kata tugas. Singkatan resmi boleh. | Badan Informasi Geospasial · BMKG |
| Hari, bulan, hari raya | Kapital. | Jumat, November, Imlek, Idulfitri |
| Arah mata angin | Huruf kecil, kecuali bagian nama diri. | angin dari barat laut · Kampung Tua Tanjung Riau |
| Nama loket | Kapital di awal setiap kata, kecuali kata tugas yang tidak di awal. | Loket 01 · Cuaca dan Laut |
| Huruf kapital semua | Hanya untuk singkatan (WIB, KTP, SAR), penanda kecil (LOKET 01, HARI INI DI BATAM, PETA), dan nama kecamatan di peta. Tidak untuk penekanan. *Wordmark* ditulis Barelang.co. | |

### 2.4 Huruf Miring

- **Dimiringkan:** kata asing dan kata daerah yang belum diserap, bila muncul di dalam kalimat. Contoh: *kopitiam*, *dim sum*, *jastip*, *check-in*. *Pompong* dan *gonggong* juga dimiringkan di dalam kalimat, kecuali KBBI daring terbaru sudah memuat arti 'perahu' dan 'siput laut'. Periksa sekali, lalu terapkan konsisten.
- **Tidak dimiringkan:**
  - nama tempat dan nama usaha (Kopitiam Ameng, Harbour Bay);
  - kata di menu, tombol, label, atau judul;
  - kata yang sudah ada di KBBI (feri, halte, kafe, kelong).
- **Bila ada padanan Indonesia yang lazim, gunakan padanannya** (lihat 2.8).

### 2.5 Penulisan Kata

| Kaidah | Benar | Salah |
|---|---|---|
| *di-* dan *ke-* sebagai awalan ditulis serangkai | diperbarui, dicek, ketahui | di perbarui, di cek |
| *di* dan *ke* sebagai kata depan ditulis terpisah | di Batam, ke Singapura, ke mana, di mana | diBatam, kemana, dimana |
| Partikel *pun* terpisah, kecuali bentuk padu | apa pun, siapa pun · meskipun, walaupun, adapun | apapun, siapapun |
| *per* terpisah | Rp5.000 per orang, per 1 November | perorang |
| Unsur terikat ditulis serangkai | antarkota, antarpulau, nonhalal, nontunai, pascakonflik, swadaya | antar kota, non-halal, non tunai |
| Kata ulang memakai tanda hubung | oleh-oleh, gado-gado, kupu-kupu | oleh2 |
| Bentuk singkat tidak dipakai di teks | dan lain-lain *atau* sebutkan semuanya | dll., dsb., yg, dgn |

### 2.6 Angka, Waktu, Uang, dan Satuan

| Hal | Aturan | Contoh |
|---|---|---|
| Angka di teks | Bilangan yang dapat ditulis dengan satu atau dua kata ditulis dengan huruf, kecuali untuk ukuran, uang, waktu, nomor, atau rincian. Aturan rumah: hitungan yang dihasilkan data otomatis (jumlah tempat, halte, karakter) boleh memakai angka. | dua kali seminggu · sembilan koridor · 892 tempat |
| Angka di awal kalimat | Ditulis dengan huruf, atau kalimatnya disusun ulang supaya tidak diawali angka. | Sebanyak 892 tempat … · Sembilan koridor … (bukan "892 tempat …" di awal kalimat) |
| Ribuan dan desimal | Titik untuk ribuan, koma untuk desimal. | 1.394.459 jiwa · 0,5 m · 2,5 jam |
| Jam | Kata *pukul* di dalam kalimat. Titik sebagai pemisah jam dan menit. Selalu 24 jam dan selalu diikuti zona waktu. | pukul 09.40 WIB · Terakhir 20.30 WIB |
| Zona waktu | Jam Singapura dan Malaysia ditulis dengan zona masing-masing. | 21.40 waktu Singapura |
| Tanggal | Hari, tanggal, nama bulan lengkap, tahun. Tanpa angka nol di depan. | Kamis, 5 November 2026 · 5 November 2026 |
| Rentang (bilangan, waktu, tanggal, tempat) | Tanda pisah (—) tanpa spasi. Di dalam kalimat, boleh *sampai*. | 0,5—1,25 m · 08.00—14.00 WIB · 5—10 April · Sekupang—Batam Centre · buka pukul 08.00 sampai 14.00 WIB |
| Uang | Rp langsung diikuti angka, tanpa spasi dan tanpa titik. Di antarmuka tanpa ,00. Angka besar boleh memakai *ribu*, *juta*, *miliar*. | Rp5.000 · Rp30.000—Rp35.000 · Rp150 ribu · Rp1,2 juta |
| Mata uang asing | Kode ISO diikuti spasi (aturan rumah). Lambang tanpa spasi. | SGD 76 · USD 500 · S$76 |
| Satuan | Spasi di antara angka dan satuan. Lambang satuan ditulis sesuai bentuk bakunya (km, m, mm, MB, °C). | 6 km · 0,5 m · 4 km/jam · 15 knot · 20 mm/jam · 28 °C |
| Persen | Tanpa spasi. | 73% |
| Bilangan tingkat | ke- dengan tanda hubung bila memakai angka. Dengan huruf, serangkai. | ke-2 · kedua · Koridor 1 |
| Durasi | Angka diikuti satuan waktu lengkap. | 25 menit · 2,5 jam |

### 2.7 Tanda Baca

| Tanda | Aturan |
|---|---|
| Titik (.) | Di akhir kalimat lengkap (paragraf, keterangan, lede). Lede selalu ditulis sebagai kalimat lengkap. **Tidak dipakai** di akhir judul, label, tombol, menu, nama kategori, keterangan satu baris di daftar, atau isi sel tabel yang bukan kalimat. |
| Titik dua (:) | Untuk label diikuti nilai, dan sebelum rincian. Huruf sesudahnya kecil bila yang mengikuti berupa rincian atau nilai. Huruf kapital bila yang mengikuti adalah kalimat lengkap atau nama diri. |
| Koma (,) | Sebelum *tetapi*, *melainkan*, *sedangkan*. Tidak dipakai sebelum anak kalimat yang mengikuti induk kalimat (*sehingga*, *karena*, *jika*). Pada rincian tiga unsur atau lebih, koma sebelum *dan* dipakai secara konsisten. |
| Tanda pisah (—) | Untuk rentang (2.6). Tidak dipakai untuk menyisipkan kalimat di antarmuka. |
| Tanda hubung (-) | Untuk kata ulang, *ke-* dengan angka (ke-2), *se-* atau unsur terikat dengan huruf kapital (se-Batam, non-Indonesia), dan angka dengan *-an* (1970-an). Bukan untuk rentang. |
| Tanda petik | Petik ganda tipografis “…” untuk kutipan. Petik tunggal ‘…’ untuk arti kata di kamus. |
| Tanda seru (!) | **Tidak dipakai.** |
| Elipsis (…) | Hanya untuk kutipan yang dipotong. Status memuat ditulis tanpa elipsis dan disertai indikator visual. |
| Garis miring (/) | Hanya untuk satuan (km/jam) dan pilihan yang memang setara. Jangan untuk menggabungkan kata ("tukang/jasa"). |
| Tanda & | Tidak dipakai di teks. Gunakan *dan*. |
| Titik tengah (·) | Hanya sebagai pemisah visual di baris metadata kecil (misalnya "Sekupang · Puskesmas · Buka 24 jam"). Tidak dipakai di kalimat atau judul. |
| Emoji | Tidak dipakai. |

### 2.8 Kata Baku dan Padanan

**Ejaan baku (KBBI):**

| Tidak baku | Baku |
|---|---|
| silahkan | silakan |
| himbau, menghimbau | imbau, mengimbau |
| resiko | risiko |
| praktek | praktik |
| apotik | apotek |
| nasehat | nasihat |
| ijin | izin |
| jadual | jadwal |
| aktifitas | aktivitas |
| analisa | analisis |
| sekedar | sekadar |
| merubah | mengubah |
| obyek | objek |
| sistim | sistem |
| kadaluarsa | kedaluwarsa |
| antri | antre |
| handal | andal |
| cabe | cabai |
| mie | mi (nama usaha tetap seperti aslinya) |
| sop | sup |
| klenteng | kelenteng |
| sholat, mushola | salat, musala |
| Jum'at | Jumat |
| Ramadhan | Ramadan |
| ferry (di kalimat Indonesia) | feri |
| cafe | kafe |
| non-halal, non halal | nonhalal |
| non-tunai | nontunai |

**Padanan istilah asing:**

| Asing | Padanan |
|---|---|
| update, updated | pembaruan, diperbarui |
| download | unduh |
| upload | unggah |
| online, offline | daring, luring (untuk status situs: "tersambung", "tidak tersambung") |
| link | tautan |
| website, site | situs |
| browser | peramban |
| share | bagikan |
| search | cari |
| filter (tombol) | saring |
| map | peta |
| loading | memuat |
| error | galat *atau* jelaskan masalahnya |
| booking | pemesanan |
| refresh | muat ulang |
| review | ulasan |
| rating | penilaian (tidak ditampilkan di situs ini) |
| headway | selang keberangkatan |
| seafood | makanan laut |
| supermarket | pasar swalayan |
| badminton | bulu tangkis |
| gym | pusat kebugaran |
| money changer | penukaran valuta asing |
| landmark | penanda kota |
| check-in | lapor masuk (*check-in*) |
| handphone, HP | ponsel |

**Nama resmi tetap dipakai apa adanya:** Batam Centre (kawasan dan pelabuhan; nama halte mengikuti nama resminya, misalnya Transferpoint Batam Center), Harbour Bay, Nongsapura, HarbourFront, Transferpoint Sekupang, Trans Batam, QRIS, BRIZZI.

### 2.9 Kata, Pola, dan Isi yang Dilarang

**Pemerintah dan sumber:**
- Tidak ada kalimat "bukan situs resmi", "untuk layanan resmi", atau nama situs pemerintah.
- Tidak ada ajakan "cek langsung ke BMKG/kantor/situs …".
- Tidak ada tautan ke situs pemerintah.
- Tidak ada "Sumber: …", "Menurut: …" bertautan, atau daftar tautan sumber.

**Pengecualian (tanpa tautan):**
- Nama kantor sebagai isi direktori.
- Nama lembaga sebagai pelaku dalam sejarah, legalitas kampung tua, dan Rempang ("Ombudsman mencatat …"). Ini inti kenetralan, jadi tetap ditulis.
- Kredit data di halaman Kolofon. Beberapa lisensi data mewajibkannya.
- Atribusi kecil di pojok peta karena diwajibkan lisensi OpenStreetMap.
- Tautan judul berita ke artikel aslinya. Itu fungsi halaman berita, bukan rujukan sumber.
- Menu Dataset (keputusan pemilik 9 Nov 2026): nama penyedia dan produsen data ditulis sebagai teks biasa, tanpa tautan dan tanpa alamat situs. Kolom tautan, foto, dan rujukan sumber di dalam data dibuang saat diterbitkan (`scripts/dataset/terbitkan.mjs`).

**Catatan kerja internal, dilarang tampil:**
- "Belum dicek ulang sejak riset", "lokasi belum diisi" di setiap kartu
- "perlu cek ulang", "data lama", "sumber sekunder", "jam dari berita"
- "kami tidak menebak", "tautan belum tercatat"
- "Isi butir ini menyangkut status lahan"
- "draf", "Beta" di setiap kartu
- "placeholder", "segera hadir"

**Promosi dan klise:** *hidden gem, hits, wajib coba, wajib dikunjungi, surga tersembunyi, instagramable, healing, kekinian, premium, legendaris banget, mantap, recommended, best, terbaik se-Batam*. Kata *legendaris* hanya sebagai label kurasi di Loket Makan.

**Gaya yang dilarang:**
- lelucon atau metafora di label, status, dan galat ("Itik sedang berbaris", "Halaman ini tenggelam");
- tanda seru;
- emoji;
- huruf kapital untuk penekanan;
- bahasa gaul;
- campuran bahasa dalam satu kalimat ("update terbaru", "spot kece").

### 2.10 Bahasa Inggris (Loket Makan)

- Ejaan Inggris Britania karena pembacanya banyak dari Singapura dan Malaysia: *centre*, *harbour*, *colour*.
- Kapital di awal saja untuk label dan judul (*sentence case*).
- Padanan label: Halal · Muslim-friendly · Non-halal · Legendary · Curator's pick · Popular now · Little known.
- Nada sama dengan versi Indonesia. Tanpa tanda seru dan tanpa kata promosi.

---

## 3. Naskah Situs

Teks di bawah ini dipakai persis. Tanda {…} adalah isian dari data. Teks di dalam [ … ] adalah tombol atau tautan.

### 3.1 Bagian Global

**Kepala halaman (desktop)**
- **Beranda:**
  - baris paling atas: "Kamis, 5 November 2026" di kiri, "Diperbarui pukul 09.40 WIB" di kanan;
  - di bawahnya: kalimat "Panduan harian Kota Batam, disusun oleh warga." di kiri, *wordmark* Batam City Hall di tengah, tombol cari dan tema di kanan.
- **Halaman lain:** *wordmark* di kiri, tombol cari dan tema di kanan.
- **Menu loket** (satu baris di bawahnya): 01 Cuaca dan Laut · 02 Makan · 03 Tukang Langganan · 04 Transportasi · 05 Cerita dan Budaya · 06 Informasi Warga · 07 Ruang Main
- **Label aksesibilitas:** tombol tema "Ganti ke tampilan gelap" / "Ganti ke tampilan terang"; tombol cari "Cari".

**Catatan nama loket.** Tiga nama diganti supaya isinya jelas dan memakai bentuk baku:

| Lama | Baru |
|---|---|
| Langit & Laut | Cuaca dan Laut |
| Jalan-jalan | Transportasi |
| Main-main | Ruang Main |

Route boleh tetap. Ganti labelnya saja. Disetujui pemilik pada 5 November 2026.

**Menu ponsel (layar penuh, seperti daftar isi majalah)**

| No | Judul | Keterangan |
|---|---|---|
| 01 | Cuaca dan Laut | Radar hujan, tinggi gelombang, dan kamera lalu lintas |
| 02 | Makan | Tempat makan pilihan, dari kopitiam sampai gonggong |
| 03 | Tukang Langganan | Jasa yang direkomendasikan warga |
| 04 | Transportasi | Trans Batam, feri, dan pompong |
| 05 | Cerita dan Budaya | Sejarah, kampung tua, tokoh, dan kamus |
| 06 | Informasi Warga | Direktori, nomor darurat, dan panduan |
| 07 | Ruang Main | Kartu pos dan kalkulator belanja |

**Kaki halaman**
- Baris 1: Batam City Hall · Proyek independen warga Batam · Tanpa iklan
- Baris 2 (tautan): Tentang · Kolofon · Kirim koreksi · Privasi · Syarat penggunaan
- Baris 3 (tombol): Animasi: aktif / Animasi: nonaktif
- Di atasnya ada pita gelombang biru (4.5).
- Tidak ada teks lain. Kredit data pindah ke Kolofon.

**Status umum**

| Keadaan | Teks |
|---|---|
| Memuat peta | Memuat peta |
| Memuat data | Memuat data |
| Tidak tersambung | Perangkat tidak tersambung ke internet. Data yang tampil adalah data terakhir yang tersimpan. |
| Galat umum (judul) | Halaman Ini Tidak Dapat Dimuat |
| Galat umum (isi) | Terjadi masalah saat memuat halaman. Coba muat ulang dalam beberapa saat. [Muat ulang] [Ke beranda] |
| 404 (judul) | Halaman Tidak Ditemukan |
| 404 (isi) | Alamatnya mungkin salah ketik atau halamannya sudah dipindahkan. [Ke beranda] [Cari tempat] |
| Hasil pencarian kosong | Tidak ada hasil untuk “{kata}”. Coba kata lain atau hapus saringan. |
| Kategori kosong | Belum ada tempat di kategori ini. Kalau kamu tahu tempatnya, [kirim usulan]. |
| Tempat tanpa titik di peta | (tidak ada teks; tombol "Lihat di peta" tidak ditampilkan) |
| Catatan data di bawah halaman | Data dihimpun pada November 2026. Sebagian lokasi masih perkiraan. [Kirim koreksi] |

### 3.2 Beranda

**Judul halaman (tag title):** Batam City Hall: Informasi Kota Batam

**Hari Ini** (kiri; Peta Hari Ini di kanan):

```
HARI INI DI BATAM · PUKUL 09.40 WIB                      ← penanda

Hujan ringan di Bulang dan Belakang Padang.              ← judul utama (3.11)
Gelombang rendah.

Gelombang di perairan Batam setinggi 0,5 meter dan       ← paragraf pembuka (3.11)
angin bertiup 4 km/jam dari barat laut. Feri terakhir
ke Singapura berangkat pukul 20.30 WIB.

Hujan                                           Ringan
Bulang dan Belakang Padang
Gelombang                                        0,5 m
Rendah, berlaku sampai pukul 10.00 WIB
Angin                                         4 km/jam
Dari barat laut
Feri terakhir ke Singapura                       20.30
Batam Centre dan Harbour Bay

Peringatan gelombang: tidak ada untuk perairan Batam.
[Buka Cuaca dan Laut →]
```

- Bila status peringatan tidak dapat dibaca: "Peringatan gelombang: status belum dapat dimuat."
- Bila tidak ada hujan: baris Hujan berisi "Tidak ada" dengan keterangan "Radar pukul {09.40} WIB".
- Bila feri hari ini sudah habis: baris Feri berisi "Habis" dengan keterangan "Keberangkatan pertama besok pukul {07.30} WIB".

**Peta Hari Ini** (peta pajangan, 5.1)
- Catatan berbingkai untuk setiap kecamatan yang hujan, paling banyak tiga: "Hujan ringan" (baris pertama), lalu "{Bulang} · pukul {09.40} WIB". Bila lebih dari tiga kecamatan, cukup satu catatan: "Hujan di {4} kecamatan".
- Catatan feri: "Feri ke Singapura" lalu "terakhir pukul {20.30} WIB".
- Keterangan di bawah peta: PETA · Arsiran biru menandai kecamatan yang sedang hujan menurut radar pukul {09.40} WIB. Garis merah putus-putus adalah rute feri ke Singapura, digambar skematis.

**Peta Tempat** (peta kerja, 5.2)
- Penanda: PETA
- Judul: Cari tempat di Batam
- Keterangan: Pilih jenis tempat yang ingin ditampilkan. Setiap jenis punya ikon sendiri. Saat ini {216} tempat sudah punya titik lokasi; sisanya sedang dilengkapi.
- Tombol: [Tempat] [Cuaca dan laut] [Di sekitar saya]
- Kolom cari: "Cari tempat atau kecamatan"
- Panel Tempat: 5.3.
- Legenda di bawah peta: Lokasi pasti · Lokasi perkiraan · Beberapa tempat berdekatan; perbesar peta untuk melihatnya · © OpenStreetMap · Protomaps

**Loket**
- Penanda: LOKET
- Judul: Tujuh loket informasi kota
- Keterangan: Setiap loket mengumpulkan satu jenis informasi. Mulai dari yang paling sering dicari: cuaca, laut, dan tempat makan.
- Isi: tujuh ilustrasi loket. Setiap butir memuat nomor, nama, dan keterangan dari tabel menu ponsel (3.1), ditutup titik.
- Butir kedelapan, kotak ajakan koreksi:
  - Judul: Ada yang keliru atau sudah berubah?
  - Isi: Jam buka, alamat, atau nama tempat yang sudah tidak sesuai bisa kamu laporkan.
  - Tautan: [Kirim koreksi →]

**Cerita Pilihan**
- Satu cerita dari Loket Cerita dan Budaya. Pilihannya diatur manual di data dan boleh diganti kapan saja.
- Isi hanya dari data yang sudah terverifikasi.
- Contoh:
  - Penanda: CERITA DAN BUDAYA · KAMPUNG TUA
  - Judul: Nongsa dan mandat 18 Desember 1829
  - Paragraf 1: Nama Nongsa berasal dari Nong Isa, nama timang Raja Isa bin Raja Ali. Pada 18 Desember 1829 ia menerima mandat untuk memegang perintah atas Nongsa dan rantau sekitarnya. Tanggal itu kini diperingati sebagai Hari Jadi Kota Batam.
  - Paragraf 2: Di kampung tua ini masih ada kompleks makam zuriat Raja Isa. Letak makam Nong Isa sendiri belum diketahui.
  - Tautan: [Baca cerita Kampung Tua Nongsa →]
  - Keterangan ilustrasi: Ilustrasi: rumah panggung di kampung pesisir.

**Berita Batam (cuplikan)**
- Judul: Berita Batam
- Isi: tiga judul terbaru. Tiap judul diikuti "{nama media} · pukul {jam} WIB" untuk berita hari ini, atau "{nama media} · {tanggal}" untuk berita lebih lama.
- Tautan: [Semua berita →]

### 3.3 Loket 01: Cuaca dan Laut

**Halaman pembuka (/cuaca)**
- Penanda: LOKET 01
- Judul: Cuaca dan Laut
- Lede: Loket ini memuat radar hujan, tinggi gelombang, dan kamera lalu lintas untuk Batam dan perairan sekitarnya. Datanya diperbarui otomatis.
- Blok SAAT INI: {kalimat hujan} {kalimat gelombang} (3.11), lalu baris kecil "Radar pukul {09.40} WIB · prakiraan berlaku sampai pukul {10.00} WIB".
- Bagian ISI LOKET INI (tiga entri berilustrasi):

| No | Judul | Keterangan | Baris status |
|---|---|---|---|
| 01 | Radar Hujan | Hujan dalam 2,5 jam terakhir, diperbarui setiap 5 menit. | Langsung · citra pukul {09.40} WIB |
| 02 | Tinggi Gelombang | Prakiraan gelombang dan angin di perairan Batam. | Prakiraan berlaku sampai pukul {10.00} WIB |
| 03 | CCTV Lalu Lintas | Kamera lalu lintas di 28 titik jalan utama Batam. | {28} titik kamera |

- Tautan tambahan: Jadwal feri dan pompong ada di [Transportasi].

**Tab di setiap halaman cuaca:** Radar hujan · Tinggi gelombang · CCTV lalu lintas. Di kanan baris tab ada remah roti (*breadcrumb*) "Loket 01 · Cuaca dan Laut".

**Sakelar "Tampilkan juga di peta"** (di panel kiri setiap halaman cuaca, sesuai permintaan pemilik agar tiap halaman tetap bisa menampilkan lapisan lain):
- Radar Hujan: Batas kecamatan · Tinggi gelombang · Kamera lalu lintas
- Tinggi Gelombang: Radar hujan · Kamera lalu lintas · Batas kecamatan
- CCTV Lalu Lintas: Radar hujan · Tinggi gelombang

**Radar Hujan (/cuaca/hujan)**
- Judul: Radar Hujan
- Penjelas: Peta ini menunjukkan hujan dari radar cuaca dalam 2,5 jam terakhir. Citra diperbarui setiap 5 menit.
- Ringkasan: {kalimat hujan, 3.11}
- Baris waktu: Citra pukul {09.40} WIB · {Langsung | Tertunda | Terputus}
- Legenda: Intensitas hujan · Ringan · Sedang · Lebat
- Kendali:
  - [Putar] / [Jeda]
  - Penggeser: "2,5 jam lalu" — "Terbaru"
  - Cakupan: Batam · Kepulauan Riau · Luas
- Bagian: **Hujan per Kecamatan**
  - Kecamatan yang hujan tampil lebih dulu: {Kecamatan} · {Hujan ringan | Hujan sedang | Hujan lebat}
  - Sisanya diringkas: "Tidak hujan di {10} kecamatan lain. [Lihat semua]"
- Bagian: **Prakiraan Cuaca Batam Kota**
  - Kolom: Pukul (WIB) · Cuaca · Suhu
  - Contoh baris: 13.00 · Hujan petir · 33 °C
- Bagian: **Kondisi Saat Ini**
  - Label: Prakiraan 2 jam · Hujan terdekat · Kualitas udara (PSI) · Indeks UV · Angin
- Catatan akurasi (di bawah legenda): Radar berpusat di Singapura sehingga pulau-pulau di selatan Batam terpantau kurang akurat. Bercak yang diam di satu tempat kadang bukan hujan.
- Arti status:
  - Langsung: umur citra kurang dari 15 menit.
  - Tertunda: umur citra 15 sampai 30 menit.
  - Terputus: umur citra lebih dari 30 menit. Peta hujan tidak ditampilkan.

**Tinggi Gelombang (/cuaca/gelombang)**
- Judul: Tinggi Gelombang
- Penjelas: Peta ini menunjukkan prakiraan tinggi gelombang di perairan Batam dan sekitarnya. Prakiraan diperbarui setiap 3 jam.
- Ringkasan: {kalimat gelombang, 3.11}
- Legenda: Tinggi gelombang (m) · 0 · 0,5 · 1,25 · 2,5 · 4 · 6
- Kendali:
  - [Putar] / [Jeda]
  - Penggeser: "Pukul {jam} WIB"
  - Cakupan: Batam · Kepulauan Riau · Luas · Natuna
- Bagian: **Prakiraan Perairan Batam**
  - Label: Tinggi gelombang · 12 jam ke depan · Angin · Embusan · Arus · Cuaca · Peringatan · Berlaku · Diterbitkan
- Bagian: **Kategori Gelombang** (tabel kecil)

| Kategori | Tinggi |
|---|---|
| Tenang | 0—0,5 m |
| Rendah | 0,5—1,25 m |
| Sedang | 1,25—2,5 m |
| Tinggi | 2,5—4 m |
| Sangat tinggi | 4—6 m |
| Ekstrem | lebih dari 6 m |

- Catatan di bawah tabel: Sebagai gambaran, gelombang di atas 1,25 m mulai berisiko bagi perahu kecil, dan di atas 2,5 m bagi kapal feri.

**CCTV Lalu Lintas (/cuaca/cctv)**
- Judul: CCTV Lalu Lintas
- Penjelas: Kamera lalu lintas di 28 titik jalan utama Batam. Pilih kamera di peta atau di daftar untuk melihat siaran langsung.
- Petunjuk: Ketuk titik di peta untuk memilih kamera.
- Daftar: Semua kamera, dikelompokkan per kecamatan.
- Info pemakaian data: Siaran memakai sekitar 20 MB per menit. Siaran berhenti saat tab ditutup atau disembunyikan.
- Status kamera:
  - Siaran langsung
  - Kamera tidak aktif
  - Gambar tidak diperbarui sejak pukul {jam} WIB
- Bagian: **Terakhir Dibuka** (tiga kamera)

### 3.4 Loket 02: Makan

**Beranda Makan (/makan)**
- Penanda: LOKET 02
- Judul: Makan
- Lede: Loket ini memuat 117 tempat makan pilihan di Batam: *kopitiam*, makanan laut, mi, dan warung lama. Tidak ada tempat yang membayar untuk masuk daftar ini.
- Kolom cari: "Cari tempat, menu, atau kategori"
- Saringan cepat: Halal · Makanan laut dan gonggong · Sup ikan · Mi tarempa dan luti gendang · Kopitiam · Oleh-oleh dan kue
- Bagian: **Dekat Terminal Feri**
  - Penjelas: Tempat makan dalam radius sekitar 6 km dari terminal feri.
  - Daftar baris: Batam Centre · Harbour Bay · Sekupang · Nongsapura
- Bagian: **Pilihan**
  - Tautan: [Lihat semua]

**Menu Makan:** Beranda · Peta · Daftar · Kategori · Jalur · Tersimpan · Tentang

**Kategori (17).** Nama kategori adalah label, jadi ditulis dengan kapital awal saja:

| Kode data | Nama |
|---|---|
| seafood-gonggong | Makanan laut dan gonggong |
| sup-ikan | Sup ikan |
| mie-tarempa | Mi tarempa dan luti gendang |
| nasi-ayam-hainan | Nasi ayam hainan |
| kopitiam | Kopitiam |
| martabak-prata | Martabak dan prata |
| mie-bakmi | Mi dan bakmi |
| bubur | Bubur |
| nasi-padang | Nasi padang |
| sunda-jawa | Masakan Sunda dan Jawa |
| sate-kambing | Sate kambing |
| bakso | Bakso |
| dimsum-chinese | Dim sum dan masakan Tionghoa |
| ayam-penyet | Ayam penyet dan lalapan |
| pecel-gado | Pecel dan gado-gado |
| oleh-oleh | Oleh-oleh dan kue |
| cafe | Kafe dan kedai kopi |

**Label (satu per tempat):**
- Status halal: Halal · Ramah muslim · Nonhalal
- Label kurasi: Legendaris · Pilihan kurator · Sedang populer · Jarang diketahui (disetujui pemilik pada 5 November 2026)
- Status buka: Buka sekarang · Tutup sekarang · Jam buka tidak diketahui

**Harga:** tulis kisaran dari data, misalnya "Rp30.000—Rp35.000 per orang". Simbol $, $$, $$$ dan kata "Hemat", "Sedang", "Premium" tidak dipakai.

**Detail tempat**
- Remah roti: Makan / {kategori} / {nama tempat}
- Penanda: {KATEGORI} · {AREA}
- Judul: {nama tempat}
- Label: {status halal} (titik hijau) dan {satu label kurasi} (Newsreader miring)
- Deskripsi: dari data, setelah dibersihkan dari kata promosi (2.9). Jangan menambah fakta.
- Tombol: [Petunjuk arah] [Bagikan] [Simpan]
- Tabel:
  - Menu andalan
  - Jam buka (+ "Buka sekarang" / "Tutup sekarang")
  - Kisaran harga
  - Pembayaran (Tunai, QRIS)
  - Alamat
  - Terminal feri terdekat ("Sekitar {2,8} km dari Pelabuhan Feri Internasional Nongsapura")
- Peta kecil, dengan keterangan: Titik di peta adalah perkiraan area. Gunakan [Petunjuk arah] untuk lokasi persisnya.
- Bagian: **Feri Terakhir dari {terminal} Hari Ini**
  - Isi baris: {Nongsapura}—{Tanah Merah} · {BatamFast} · Pukul {20.00} WIB
  - Catatan: Jadwal dapat berubah. Tanyakan kepada operator sebelum berangkat.
- Bagian: **Hujan di Sekitar Sini** (bila ada hujan): Hujan ringan di Kecamatan {Nongsa} saat ini.
- Tautan: [Laporkan data yang salah] · Data diperiksa pada {Juni 2026}. (dari `last_verified`)
- Terminal feri terdekat: bila `ferry_km` kosong, jarak dihitung dari titik tempat dan titik terminal, dibulatkan satu angka desimal, dan selalu diawali "Sekitar".

**Jalur Kuliner (/makan/jalur)**
- Judul: Jalur Kuliner
- Lede: Jalur kuliner adalah rute makan bertema yang bisa diikuti dalam setengah hari atau sehari.
- Isi tiap baris: {judul jalur} · {jumlah perhentian} perhentian · {durasi}

**Tempat Tersimpan (/makan/tersimpan)**
- Judul: Tempat Tersimpan
- Lede: Daftar ini hanya tersimpan di peramban perangkat ini.
- Kosong: Belum ada tempat tersimpan. Tekan [Simpan] di halaman tempat makan untuk menyimpannya.
- Bagian: **Pindahkan ke Perangkat Lain**
  - Isi: Salin tautan berikut, lalu buka di perangkat lain.
  - Tombol: [Salin tautan] [Tempel tautan]

**Tentang Loket Makan (/makan/tentang)**
- Judul: Tentang Loket Makan
- **Cara Memilih:** Tempat dipilih dan dikunjungi oleh penyusun. Tidak ada tempat yang membayar untuk masuk daftar ini, dan urutan tidak dapat dibeli.
- **Arti Label:**
  - Legendaris: sudah buka puluhan tahun dan tetap ramai.
  - Pilihan kurator: tempat yang paling kami sarankan.
  - Sedang populer: banyak dibicarakan belakangan ini.
  - Jarang diketahui: bagus, tetapi tidak mudah ditemukan.
- **Status Halal:** Status halal adalah hasil kurasi, bukan sertifikasi. Ramah muslim berarti tempat ini umumnya dapat dikunjungi muslim, tetapi juga dapat menyajikan menu nonhalal. Bila ragu, tanyakan langsung kepada pengelolanya.
- **Lokasi di Peta:** Titik di peta menunjukkan perkiraan area. Gunakan tombol Petunjuk arah untuk lokasi yang tepat.
- **Tanpa Penilaian Bintang:** Situs ini tidak menampilkan penilaian bintang. Urutan tempat disusun berdasarkan kurasi.

### 3.5 Loket 03: Tukang Langganan

**Halaman utama (/tukang)**
- Penanda: LOKET 03
- Judul: Tukang Langganan
- Lede: Loket ini memuat penjahit, tukang servis, dan penyedia jasa lain yang direkomendasikan warga Batam. Setiap nama tampil setelah direkomendasikan oleh sekurang-kurangnya dua orang.
- Kalimat prinsip: Tidak ada yang membayar untuk masuk daftar ini.
- Tombol: [Kirim rekomendasi]
- Saringan: Jenis jasa · Kecamatan
- Jenis jasa:
  - Jahit dan permak
  - Mebel
  - Servis dan cuci AC
  - Bengkel motor dan mobil
  - Tukang kunci
  - Binatu
  - Sol sepatu
  - Servis ponsel, laptop, dan elektronik
  - Tukang bangunan, listrik, dan ledeng
  - Pijat dan refleksi
  - Pijat panggilan
  - Salon dan pangkas rambut
  - Fotokopi dan percetakan
  - Indekos
  - Jasa titip Singapura
  - Lainnya
- Kosong: Belum ada nama di daftar ini. Rekomendasi pertama akan tampil setelah diperiksa dan didukung oleh dua warga.

**Kartu tukang**
- Judul: {nama}
- Baris bawah judul: {jenis jasa} · {kecamatan}
- Isi: {cerita singkat dari perekomendasi}
- Kata yang dipilih warga (teks biasa, bukan label warna): Rapi · Tepat waktu · Harga jujur
- Baris kecil: Direkomendasikan {3} warga · Terakhir diperiksa {Oktober 2026}
- Tombol: [Hubungi] (hanya bila tukang sudah memberi izin)
- Tautan kecil: Masih buka? [Ya] [Sudah pindah atau tutup] · [Laporkan]

**Formulir (/tukang/rekomendasi)**
- Judul: Kirim Rekomendasi
- Lede: Rekomendasikan tukang atau jasa yang pernah kamu pakai sendiri. Tukang tidak dapat mendaftarkan diri.

| Label | Petunjuk |
|---|---|
| Nama tukang atau usaha | Contoh: Pak Amin Jahit |
| Jenis jasa | (pilihan) |
| Kecamatan | (pilihan) |
| Cara menghubungi | Nomor telepon atau alamat tempat usaha |
| Terakhir memakai jasa | Bulan dan tahun |
| Cerita singkat | Apa yang dikerjakan dan mengapa kamu merekomendasikannya. Paling banyak 300 karakter. |
| Kata yang paling sesuai | Rapi · Tepat waktu · Harga jujur · Ramah · Cepat |
| Kontakmu | Hanya untuk memeriksa rekomendasi. Tidak pernah ditampilkan. |

- Persetujuan: Saya pernah memakai jasa ini sendiri dan tidak memiliki hubungan usaha dengan tukang tersebut.
- Tombol: [Kirim rekomendasi]
- Berhasil: Terima kasih. Rekomendasimu akan kami periksa sebelum tampil.
- Validasi:
  - Isi nama tukang atau nama usahanya.
  - Pilih jenis jasa.
  - Ceritakan pengalamanmu secara singkat.
  - Centang persetujuan untuk mengirim.
- Formulir belum aktif: Formulir ini belum aktif. Rekomendasi dapat dikirim setelah sistemnya dibuka.

### 3.6 Loket 04: Transportasi

**Halaman pembuka (/jalan)**
- Penanda: LOKET 04
- Judul: Transportasi
- Lede: Loket ini memuat bus Trans Batam, feri ke Singapura dan Malaysia, dan *pompong* antarpulau.
- Daftar:
  1. Trans Batam: sembilan koridor, tarif Rp5.000
  2. Peta Transportasi: koridor bus, terminal feri, dan pelabuhan rakyat
  3. Feri: jadwal ke Singapura, Johor, dan pulau sekitar
  4. Pompong: perahu ke pulau-pulau di sekitar Batam
  5. Panduan Menyeberang: paspor, lapor masuk, dan barang bawaan
- Bagian: **Feri Terakhir Hari Ini**
  - Tabel: Rute · Operator · Terakhir hari ini
  - Catatan: Jadwal dapat berubah. Tanyakan kepada operator sebelum berangkat.

**Trans Batam (/jalan/trans-batam)**
- Judul: Trans Batam
- Lede: Sembilan koridor beroperasi dan satu koridor direncanakan. Tarif Rp5.000 untuk umum dan Rp2.500 untuk pelajar, mahasiswa, serta anak di bawah 12 tahun. Pembayaran nontunai.
- Bagian: **Peta Bus**
  - Peta skematik di atas bentuk pulau Batam. Tata letak dan bentuk pulau mengikuti Peta Bus Batam karya Farhan S. Fadhillah (CC BY 4.0), atas permintaan pemilik pada 8 November 2026, dengan gaya situs ini.
  - Garis 0, 45, dan 90 derajat. Garis sejajar membelok dengan lengkung sepusat. Halte satu koridor bertanda garis pendek, halte beberapa koridor bertanda batang putih bergaris tinta, terminal dan transit bertanda kapsul. Terminal diberi deret nomor koridor.
  - Bisa digeser, diperbesar (tombol, Ctrl dan gulir, cubit dua jari), dan dibuka layar penuh. Nama halte biasa disembunyikan saat peta diperkecil.
  - Sorot: tombol di legenda atau ketuk garis. Koridor lain diredam, peta memuat koridor itu. Di halaman koridor, koridornya langsung disorot.
  - Keterangan: Garis disederhanakan; letak halte tidak sesuai peta. Tata letak dan sebagian nama halte mengikuti [Peta Bus Batam karya Farhan S. Fadhillah] (tautan ke Kolofon).
  - Legenda: Sorot Koridor (sepuluh tombol) · Halte · Halte Beberapa Koridor · Halte Transit atau Ujung · Pelabuhan · Koridor Rencana
- Bagian: **Posisi Bus**. Isi: Posisi bus dapat dilihat di aplikasi SIP TB. Situs ini tidak melacak bus.
- Bagian: **Semua Koridor**
  - Isi tiap baris: {K1} {Sekupang—Batam Centre} · {05.45—19.00 WIB}
- Catatan di bawah halaman: Daftar halte dihimpun pada November 2026 dan mungkin belum lengkap. [Kirim koreksi]

**Halaman koridor (/jalan/trans-batam/{k1})**
- Judul: Koridor {1}: {Sekupang—Batam Centre}
- Tabel:
  - Rute: {Transferpoint Sekupang—Transferpoint Batam Center}
  - Melewati: {…}
  - Jam operasi: {05.45—19.00 WIB}, setiap hari
  - Selang keberangkatan: sekitar {20—35} menit
  - Tarif: Rp5.000, pelajar Rp2.500
  - Cara bayar: nontunai (BRIZZI, QRIS, dan aplikasi bank)
  - Jumlah halte: {56}
- Bagian: **Urutan Halte**
  - Isi: diagram garis koridor. Halte transit ditandai: Transit ke {K3}.
  - Celah daftar: ditulis "Beberapa halte di antaranya belum tercatat."

**Feri (/jalan/feri)**
- Judul: Feri
- Lede: Jadwal feri dari Batam ke Singapura, Johor, dan pulau sekitar. Jam keberangkatan mengikuti waktu setempat di pelabuhan asal.
- Tab: Feri terakhir · Internasional · Domestik · Jadwal operator
- Tabel: Rute · Operator · Jam berangkat · Lama perjalanan
- Catatan jadwal lama (satu baris di bawah rute): Jadwal per {Mei 2026}. Tanyakan kepada operator.

**Pompong (/jalan/pompong)**
- Judul: Pompong
- Lede: Perahu kayu bermesin untuk menyeberang ke pulau-pulau di sekitar Batam. Tarifnya ditentukan pemilik perahu dan dapat ditawar.
- Tabel: Dari · Tujuan · Jadwal · Tarif · Lama perjalanan
- Catatan: Tarif dapat berubah. Tanyakan kepada pengemudi perahu sebelum berangkat.

**Panduan Menyeberang (/jalan/feri/panduan)**
- Judul: Panduan Menyeberang
- Lede: Halaman ini merangkum hal yang perlu disiapkan sebelum naik feri ke Singapura atau Malaysia.
- Bagian:
  - Paspor dan Imigrasi
  - Waktu Lapor Masuk
  - Feri Terakhir untuk Pulang Hari
  - Barang Bawaan dari Singapura
- Catatan di bawah halaman: Aturan imigrasi dan bea cukai dapat berubah. Pastikan aturannya sebelum berangkat.

### 3.7 Loket 05: Cerita dan Budaya

**Halaman pembuka (/cerita)**
- Penanda: LOKET 05
- Judul: Cerita dan Budaya
- Lede: Loket ini memuat sejarah Batam, kampung tua, tokoh di balik nama jalan, budaya Melayu, dan kamus bahasa sehari-hari.
- Daftar:
  1. Sejarah Batam
  2. Kampung Tua
  3. Siapa di Balik Nama Jalan
  4. Budaya Melayu
  5. Kalender Acara
  6. Kamus Melayu Kepri dan Bahasa Batam
  7. Komunitas
  8. Batam dalam Angka
  - (Batam Dulu dan Sekarang disembunyikan sampai ada foto berizin; lihat bagian 6.)

**Label status sejarah (satu per butir):** Tercatat · Berbeda versi · Belum terverifikasi · Cerita rakyat

**Halaman-halaman:**

| Halaman | Judul | Lede |
|---|---|---|
| /cerita/sejarah | Sejarah Batam | Halaman ini menelusuri perjalanan Batam dari pulau di pesisir Selat Singapura menjadi kota berpenduduk lebih dari satu juta jiwa. Peristiwa yang versinya berbeda antarsumber diberi tanda. |
| /cerita/kampung-tua | Kampung Tua | Kampung tua adalah permukiman yang sudah ada sebelum Batam dibangun sebagai kawasan industri. Halaman ini memuat asal-usul, penduduk awal, dan etika berkunjung. |
| /cerita/kampung-tua/legalitas | Kronologi Legalitas Kampung Tua | Keputusan dan peristiwa penting tentang kampung tua disusun menurut tanggal. |
| /cerita/rempang | Kronologi Rempang | Peristiwa di Pulau Rempang sejak 2023 disusun menurut tanggal, lengkap dengan keterangan pihak yang menyampaikannya. |
| /cerita/nama-jalan | Siapa di Balik Nama Jalan | Halaman ini mengenalkan tokoh yang namanya dipakai untuk jalan, jembatan, dan gedung di Batam. |
| /cerita/budaya | Budaya Melayu | Halaman ini merangkum tradisi Melayu yang masih dijalankan di Batam dan Kepulauan Riau. |
| /cerita/kalender | Kalender Acara | Kalender ini memuat acara budaya dan komunitas di Batam sepanjang tahun. Tanggal dapat berubah. Tanyakan kepada penyelenggara sebelum datang. |
| /cerita/kamus | Kamus Melayu Kepri dan Bahasa Batam | Kamus ini memuat 65 kata yang sering terdengar di Batam: kata Melayu Kepri, serapan dari Singapura dan Malaysia, dan istilah kawasan industri. |
| /cerita/komunitas | Komunitas | Halaman ini memuat komunitas kreatif, olahraga, dan budaya di Batam. |
| /cerita/angka | Batam dalam Angka | Halaman ini memuat angka penting tentang Batam beserta tahunnya. Bila sumber berbeda, semua versi ditampilkan. |

**Catatan khusus per halaman:**

- **Kampung Tua.** Kalimat ini tetap ada di bawah lede karena merupakan janji isi, bukan catatan kerja: "Halaman ini tidak memuat batas wilayah, luas, atau status lahan."
- **Kampung Tua, peta.** Legenda: "○ Lokasi perkiraan".
- **Kampung Tua, kartu.** Label: Asal-usul nama · Penduduk awal · Berdiri sejak · Yang bisa dilihat · Etika berkunjung.
- **Kronologi Rempang dan legalitas:**
  - Tulis "Terakhir diperbarui {5 November 2026}" di bawah judul.
  - Label pelaku dipisah: Pemerintah · BP Batam · Ombudsman · Media · Warga · Walhi.
  - Butir yang isinya disaring tidak ditampilkan sama sekali.
- **Kamus:**
  - Entri yang belum diperiksa penutur diberi tanda bintang (*).
  - Keterangan di atas daftar: "Kata bertanda * masih menunggu pemeriksaan penutur."
  - Arti kata ditulis dengan petik tunggal: ‘rumah liar’.
- **Kalender, label status:** Rutin · Pernah diadakan · Belum pasti · Dibatalkan.

### 3.8 Loket 06: Informasi Warga

**Halaman pembuka (/info)**
- Penanda: LOKET 06
- Judul: Informasi Warga
- Lede: Loket ini memuat direktori tempat, nomor darurat, panduan urusan tanah dan rumah, bantuan hukum, dan berita Batam.
- Daftar:
  1. Direktori
  2. Nomor Darurat
  3. Urusan Tanah dan Rumah
  4. Bantuan Hukum
  5. Jasa Dokumen dan Usaha
  6. Berita Batam
- Bagian: **Menurut Kecamatan**
  - Isi: 12 nama kecamatan sebagai tautan teks.

**Direktori (/info/direktori)**
- Judul: Direktori
- Lede: Direktori ini memuat {892} tempat di Batam yang dikelompokkan menurut keperluan. Tidak ada tempat yang membayar untuk masuk daftar ini.
- Kolom cari (di atas, sebelum daftar kategori): "Cari nama tempat, jenis, atau kecamatan"
- Saringan: Kategori · Kecamatan · Buka sekarang
- Jumlah hasil: {892} tempat

**Kategori tampilan.** Dua kategori data, *pemerintahan* dan *layanan_publik*, digabung menjadi satu kategori tampilan:

Nama kategori adalah label, jadi ditulis dengan kapital di awal saja. Di halaman kategorinya sendiri, nama itu menjadi judul dan mengikuti kaidah judul (misalnya "Darurat dan Keamanan").

| Nama | Keterangan |
|---|---|
| Darurat dan keamanan | Polisi, pemadam kebakaran, SAR, dan ambulans |
| Kesehatan | Rumah sakit, puskesmas, dan donor darah |
| Kantor dan layanan publik | Kantor camat dan lurah, kantor pos, listrik, air, BPJS, dan KUA |
| Pendidikan | Sekolah, madrasah, dan perguruan tinggi |
| Perpustakaan | Perpustakaan umum dan komunitas |
| Tempat ibadah | Masjid, gereja, pura, wihara, dan kelenteng |
| Pemakaman | Taman pemakaman umum dan makam menurut agama |
| Transportasi | Pelabuhan, pelantar pompong, bandara, halte, dan pengisian kendaraan listrik |
| Belanja | Pasar, mal, pasar swalayan, toko bahan bangunan, dan toko alat tulis |
| Ruang publik | Taman, alun-alun, dan bumi perkemahan |
| Wisata | Pantai, pulau, museum, dan taman hiburan |
| Olahraga | Lapangan padel, bulu tangkis, futsal, pusat kebugaran, dan stadion |
| Hotel dan penginapan | Hotel berbintang dan nonbintang |
| Jasa | Penukaran valuta asing, pusat servis, dan ekspedisi |
| Pertanahan dan hukum | PPAT, notaris, bantuan hukum, pengadilan, dan penilai properti |
| Kuliner | Tempat makan dari Loket Makan |
| Kampung tua | Permukiman lama sebelum Batam dibangun |
| Penanda kota | Jembatan, monumen, dan bangunan penanda |
| Budaya | Museum, cagar budaya, dan lembaga adat |
| Khas Batam | Hal yang hanya ada di Batam |
| Lain-lain | Waduk, kawasan, dan tempat lain |

Keterangan kategori hanya menyebut jenis tempat yang benar-benar ada di data. Bila jenis baru masuk (misalnya klinik atau apotek), keterangannya ditambah.

**Halaman kategori (/info/direktori/{kategori})**
- Remah roti: Informasi Warga / Direktori / {Kategori}
- Judul: {Kategori} (kaidah judul), dengan ikon kategori di sampingnya
- Lede: {keterangan kategori} di Batam. Ada {45} tempat di kategori ini.
- Saringan: Semua {45} · {jenis} {jumlah} · … · Kecamatan · {saringan khusus, misalnya IGD 24 jam}
- Bila hanya sebagian tempat punya titik: "Baru {1} dari {45} tempat di kategori ini yang punya titik di peta. Titik lainnya menyusul setelah lokasinya diperiksa."
- Tombol di bawah daftar: [Tampilkan {33} tempat lagi]

**Baris tempat di daftar:** {nama} · {jenis} · {kelurahan}, {kecamatan} · {Buka sekarang | IGD 24 jam | jam buka}

**Kartu tempat (/info/tempat/{id})**
- Judul: {nama}
- Baris bawah judul: {jenis} · {kelurahan}, {kecamatan}
- Tabel: Alamat · Jam buka · Telepon · Rawat inap · Melayani BPJS · Tipe rumah sakit · NPSN
  - Hanya baris yang ada isinya yang ditampilkan.
- Tombol: [Lihat di peta] (bila ada titik) [Petunjuk arah] [Bagikan]
- Tautan kecil: [Laporkan data yang salah]
- Tempat yang hanya memiliki nama tidak mendapat halaman sendiri. Cukup tampil sebagai baris di daftar.

**Halaman kecamatan:**
- Judul: Kecamatan {Batam Kota}
- Lede: Ada {171} tempat yang tercatat di kecamatan ini.

**Nomor Darurat (/info/darurat)**
- Judul: Nomor Darurat
- Lede: Dalam keadaan darurat, hubungi 112.
- Angka besar:
  - 112: Panggilan darurat
  - 110: Polisi
  - 113: Pemadam kebakaran
  - 115: SAR
  - 119: Ambulans
- Bagian: **Pos Pemadam Kebakaran**
  - Tabel: Pos · Kecamatan · Telepon · Jam layanan
- Bagian: **Layanan Pengaduan**
  - Tabel: Layanan · Telepon
- Peringatan situs palsu dan catatan panjang dihapus.

**Urusan Tanah dan Rumah (/info/urusan-tanah)**
- Judul: Urusan Tanah dan Rumah
- Lede: Halaman ini menjelaskan tempat mengurus tanah dan rumah di Batam: pembayaran UWT, sertifikat, dan jual beli.
- Bagian: **Keperluan yang Paling Sering Diurus**
  - Tabel: Keperluan · Tempat mengurus · Catatan
  - Nama kantor ditulis sebagai isi, tanpa tautan.
- Bagian: **Urutan Jual Beli Rumah**
- Catatan di bawah halaman: Halaman ini adalah panduan umum, bukan nasihat hukum.

**Bantuan Hukum (/info/bantuan-hukum)**
- Judul: Bantuan Hukum
- Lede: Bantuan hukum gratis tersedia di pos bantuan hukum pengadilan dan di lembaga bantuan hukum.
- Bagian:
  - Pos Bantuan Hukum di Pengadilan
  - Lembaga Bantuan Hukum
  - Organisasi Advokat
  - PPAT dan Notaris
- Kalimat di atas daftar PPAT dan notaris: Daftar ini belum lengkap. Pastikan status praktiknya sebelum memakai jasanya.
- Catatan di bawah halaman: Halaman ini adalah panduan umum, bukan nasihat hukum.

**Jasa Dokumen dan Usaha (/info/jasa-dokumen)**
- Judul: Jasa Dokumen dan Usaha
- Lede: Halaman ini memuat konsultan pajak, penilai properti, dan layanan izin usaha di Batam.

**Berita Batam (/info/berita)**
- Judul: Berita Batam
- Lede: Judul berita terbaru tentang Batam dari media lokal. Setiap judul membuka artikel di situs medianya.
- Saringan: Semua media · {nama media}
- Isi tiap baris: {judul} · {nama media} · {tanggal}, pukul {jam} WIB
- Kosong: Belum ada berita baru tentang Batam hari ini.
- Hanya berita tentang Batam dan sekitarnya yang ditampilkan (lihat 8.4).

**Warga Baru:** disembunyikan sampai isinya lengkap (bagian 6).

### 3.9 Loket 07: Ruang Main

**Halaman pembuka (/main)**
- Penanda: LOKET 07
- Judul: Ruang Main
- Lede: Loket ini memuat kartu pos digital dari Batam dan kalkulator ongkos belanja ke Singapura.
- Daftar:
  1. Kartu Pos dari Batam
  2. Belanja di Singapura atau di Nagoya?

**Kartu Pos dari Batam (/main/kartu-pos)**
- Judul: Kartu Pos dari Batam
- Lede: Pilih gambar, tulis pesan, lalu unduh sebagai gambar untuk dikirim.
- Label: Gambar · Salam dari · Pesan · Dari (boleh dikosongkan)
- Tombol: [Unduh kartu pos]
- Catatan: Kartu pos dibuat di perangkatmu dan tidak dikirim ke mana pun.

**Belanja di Singapura atau di Nagoya? (/main/singapura-atau-nagoya)**
- Judul: Belanja di Singapura atau di Nagoya?
- Lede: Hitung ongkos menyeberang ke Singapura sebelum memutuskan tempat belanja.
- Label: Kurs 1 dolar Singapura (dalam rupiah) · Jumlah orang
- Hasil: Ongkos pulang-pergi untuk {2} orang sekitar {Rp1,6 juta}, termasuk tiket feri dan biaya tambahan.
- Catatan: Perhitungan memakai tarif feri per {4 November 2026}. Ongkos sebenarnya dapat berbeda.

### 3.10 Halaman Pendukung

**Tentang (/tentang)**
- Judul: Tentang Batam City Hall
- Isi:
  - Batam City Hall adalah situs informasi kota yang dibuat secara independen oleh warga Batam. Situs ini memuat informasi cuaca dan laut, tempat makan, transportasi, cerita kota, dan direktori layanan.
  - Situs ini tidak memasang iklan, tidak menerima bayaran untuk mencantumkan tempat, dan tidak memakai pelacak.
  - Data dihimpun dari sumber terbuka dan pengamatan warga. Tempat yang lokasinya masih perkiraan diberi tanda di peta. Seluruh data diperbarui secara berkala.
  - Ada data yang keliru? [Kirim koreksi].

**Kolofon (/kolofon)**
- Judul: Kolofon
- Bagian:
  - **Huruf:** Newsreader, Plus Jakarta Sans, dan IBM Plex Mono (SIL Open Font License).
  - **Peta:** Peta dasar dari kontributor OpenStreetMap, diolah dengan Protomaps dan MapLibre.
  - **Grafis:** Ilustrasi bergaya cetak Riso dibuat khusus untuk situs ini.
  - **Data:**
    - Radar hujan: Meteorological Service Singapore.
    - Kondisi cuaca: National Environment Agency.
    - Prakiraan gelombang dan cuaca: BMKG.
    - Kualitas udara: Open-Meteo (CC BY 4.0), dari model Copernicus Atmosphere Monitoring Service.
    - Sebagian tempat di Direktori: Overture Maps Foundation (CDLA-Permissive-2.0), yang menghimpun data Meta, Microsoft, Foursquare, dan AllThePlaces.
    - Batas kecamatan: Badan Informasi Geospasial.
    - Kamera lalu lintas: Pemerintah Kota Batam.
    - Data OpenStreetMap berlisensi ODbL.
- Ini satu-satunya halaman yang memuat kredit data. Ditulis sebagai teks, tanpa tautan.

**Kirim Koreksi (/koreksi)**
- Judul: Kirim Koreksi
- Lede: Bantu kami memperbaiki data: tempat yang sudah tutup, pindah, berganti nomor, atau titik yang keliru di peta.
- Formulir belum aktif: Formulir ini belum aktif.

**Cara Berkontribusi (/kontribusi)**
- Judul: Cara Berkontribusi
- Lede: Tiga cara membantu Batam City Hall: merekomendasikan tukang, mengirim koreksi data, dan mengirim foto lama Batam.

**Privasi dan Syarat Penggunaan**
- Judul: dua halaman terpisah, "Kebijakan Privasi" dan "Syarat Penggunaan"
- Isi tetap. Rapikan bahasanya mengikuti bagian 2.
- Label "draf" tidak ditampilkan di halaman publik. Pemilik meninjau isinya sebelum situs diumumkan.

### 3.11 Templat Kalimat Data

**Hujan**

| Keadaan | Kalimat |
|---|---|
| Tidak ada hujan | Belum ada hujan yang terpantau di Batam. |
| Hujan di 1 kecamatan | Hujan {ringan} di Kecamatan {Sekupang}. |
| Hujan di 2 kecamatan | Hujan {ringan} di Kecamatan {Bulang} dan {Belakang Padang}. |
| Hujan di 3 kecamatan | Hujan {ringan} di Kecamatan {Bulang}, {Belakang Padang}, dan {Galang}. |
| Hujan di 4 atau lebih kecamatan | Hujan di {4} dari 12 kecamatan, paling deras di {Galang} ({sedang}). |
| Hujan di sekitar, belum di Batam | Ada hujan sekitar {15} km dari Batam, belum masuk wilayah kota. |
| Radar terputus | Data radar belum diperbarui sejak pukul {09.10} WIB sehingga peta hujan tidak ditampilkan. |

**Judul utama beranda** (dua kalimat pendek; kecamatan ditulis tanpa kata "Kecamatan")

| Keadaan | Judul |
|---|---|
| Hujan di 1—3 kecamatan | Hujan {ringan} di {Bulang} dan {Belakang Padang}. {Kalimat laut} |
| Hujan di 4 kecamatan atau lebih | Hujan di {4} kecamatan, paling deras di {Galang}. {Kalimat laut} |
| Tidak ada hujan | Belum ada hujan di Batam. {Kalimat laut} |
| Peringatan gelombang aktif | Peringatan gelombang {tinggi} di perairan Batam. (Judul ini menggantikan semua judul lain.) |
| Radar terputus | Data radar belum diperbarui. {Kalimat laut} |

Kalimat laut: Tenang → "Laut tenang." · Rendah → "Gelombang rendah." · Sedang → "Gelombang sedang." · Data gelombang tidak ada → kalimat laut dihapus.

**Paragraf pembuka beranda**
- Bentuk: "Gelombang di perairan Batam setinggi {0,5} meter dan angin bertiup {4} km/jam dari {barat laut}. Feri terakhir ke {Singapura} berangkat pukul {20.30} WIB."
- Bila feri sudah habis, kalimat kedua memakai bentuk "sudah lewat" di bagian Feri.

**Gelombang**
- Bentuk: "Gelombang {rendah}, sekitar {0,5} m, di perairan Batam. Angin {4} km/jam dari {barat laut}."
- Bila ada peringatan: "Peringatan gelombang {tinggi} untuk perairan Batam sampai pukul {18.00} WIB." Ditulis lurus, tanpa candaan.

**Feri**
- Bentuk: "Feri terakhir ke {Singapura} hari ini: pukul {20.30} WIB dari {Batam Centre}."
- Bila sudah lewat: "Tidak ada lagi keberangkatan ke {Singapura} hari ini. Keberangkatan pertama besok pukul {07.30} WIB."

**Jam buka**
- "Buka sekarang, sampai pukul {14.00} WIB"
- "Tutup sekarang, buka lagi pukul {08.00} WIB"
- "Jam buka tidak diketahui"

**Jumlah**
- "{892} tempat"
- "{3} perhentian"
- "Direkomendasikan {2} warga"

---

## 4. Tampilan

### 4.1 Arah

Situs ini tampil seperti majalah kota yang dicetak di kertas putih: judul besar, kolom yang tertata, garis tegas, dan grafis cetak Riso yang berwarna. Arah ini disetujui pemilik pada 5 November 2026. Contohnya ada di `docs/tampilan/contoh-tampilan/` (buka `index.html`). Data di contoh itu hanya contoh. Bila contoh dan pedoman berbeda, pedoman yang menang.

Kesan bersih datang dari:
- latar putih dan ruang kosong yang lega;
- satu jenis huruf isi dan satu jenis huruf judul;
- tidak ada kotak, bayangan, atau gradien yang tidak membawa informasi.

Kesan artistik datang dari:
- judul serif berukuran besar, termasuk judul utama beranda yang ditulis seperti judul berita;
- grafis Riso: tinta biru, merah, dan kuning yang saling menimpa, titik raster, dan cetakan yang sedikit bergeser (4.7);
- peta yang diberi catatan seperti grafik di majalah (5.1).

**Rujukan semangat** (untuk dibuka sendiri, tidak untuk disalin): esai data Kontinentalist dan The Pudding, majalah kota Saigoneer dan Zolima CityMag.

**Dilarang:**
- gradien dekoratif, efek kaca, *blur*, dan bayangan pada kartu;
- tekstur *grain* di latar halaman (butiran hanya ada di dalam grafis Riso);
- grid kartu berbingkai untuk daftar;
- ikon dekoratif yang tidak membawa makna;
- warna di luar 4.2;
- gaya lama: kertas krem, ornamen peta laut, mawar angin, garis koordinat, dan bingkai hias bergaya peta lama.

### 4.2 Warna

Token ada di `data/design/design_tokens.css` dari paket tampilan, termasuk token tampilan gelap.

| Peran | Token | Nilai | Aturan |
|---|---|---|---|
| Latar | `--bch-paper` | #FFFFFF | Putih polos di semua halaman |
| Bidang kedua | `--bch-paper-2` | #F6F4EF | Hanya untuk kotak ajakan koreksi dan alas grafis di tampilan gelap |
| Teks utama | `--bch-ink` | #161616 | |
| Teks pendukung | `--bch-ink-muted` | #5B5B5B | Paragraf pembuka, metadata, keterangan |
| Nomor kecil | `--bch-ink-faint` | #767676 | Hanya nomor di menu dan indeks loket |
| Garis tipis | `--bch-rule` | #E8E6E1 | Pemisah antarbaris 1 px |
| Garis tegas | `--bch-rule-strong` | #161616 | Garis 2 px di atas menu, kepala bagian, dan tabel |
| Tautan | `--bch-link` | #0067A5 | Tautan di dalam kalimat bergaris bawah tipis. Tautan aksi (diakhiri →) tebal 700 tanpa garis bawah. |
| Tinta Riso | `--bch-riso-blue`, `--bch-riso-red`, `--bch-riso-yellow` | #0078BF, #F15060, #FFB511 | Hanya untuk grafis, nomor loket besar (biru), garis menu aktif (biru), rute feri (merah), dan pita kaki halaman (biru) |
| Status | `--bch-status-ok`, `-caution`, `-danger` | #1E7A4F, #9A6400, #B42318 | Titik 7 px di depan teks status |
| Kategori tempat | `--bch-kat-*` | lihat 5.4 | Hanya untuk ikon kategori dan penanda peta |

- Teks berwarna kategori memakai versi teks: makan `#B5461A`, cerita `#914E72`.
- Semua warna teks di atas sudah memenuhi kontras 4,5 : 1 di atas putih. Warna penanda peta memenuhi 3 : 1 terhadap ikon putihnya.

### 4.3 Tipografi

Tiga huruf dari Google Fonts, dimuat dengan `next/font`: **Newsreader** (judul dan angka besar), **Plus Jakarta Sans** (isi dan antarmuka), dan **IBM Plex Mono** (data dan jam).

| Peran | Huruf | Desktop / ponsel | Catatan |
|---|---|---|---|
| *Wordmark* beranda | Newsreader 600 | 60 / 27 px | Jarak huruf −0,025 em |
| *Wordmark* halaman lain | Newsreader 600 | 32 / 27 px | |
| Judul utama beranda | Newsreader 500 | 58 / 36 px | Tinggi baris 1,03; jarak huruf −0,022 em |
| Nomor loket besar | Newsreader 400 | 168 / 96 px | Biru Riso, hanya di pembuka loket |
| Judul halaman (H1) | Newsreader 500 | 76—84 / 40 px | Satu per halaman |
| Judul bagian (H2) | Newsreader 500 | 44 / 30 px | Disertai garis tegas 2 px |
| Nama tempat, nama loket | Newsreader 500 | 23—27 / 21 px | |
| Angka besar | Newsreader 500 | 30 / 24 px | Angka Hari Ini dan jam feri; angka tabular |
| Deskripsi tempat | Newsreader 400 | 25 / 20 px | Hanya di detail tempat |
| Paragraf pembuka | Plus Jakarta Sans 400 | 18,5—20 / 16 px | Warna teks pendukung |
| Teks isi | Plus Jakarta Sans 400 | 17 / 16 px | Tinggi baris 1,6; lebar baris paling banyak 72 karakter |
| Menu, tombol, label | Plus Jakarta Sans 600 | 14—15 px | |
| Penanda (HARI INI DI BATAM) | Plus Jakarta Sans 800 | 12 / 11 px | Kapital, jarak huruf 0,14 em |
| Data, jam, jumlah | IBM Plex Mono 400—500 | 12,5—14 px | Angka tabular |
| Keterangan gambar dan peta | Plus Jakarta Sans 400 | 13—14 px | |

**Aturan tambahan:**
- Teks kecil berhuruf kapital hanya untuk penanda dan nama kecamatan di peta.
- Isi penting **tidak pernah** di ukuran keterangan.
- Huruf miring hanya untuk kaidah 2.4, nama perairan di peta, label kurasi Makan, dan judul kotak ajakan koreksi.

### 4.4 Ruang dan Grid

- Lebar wadah 1248 px dengan tepi 24 px, jadi lebar isi 1200 px. Kolom teks paling lebar 680 px.
- Grid 12 kolom dengan jarak antarkolom 48 px. Pembagian utama:
  - 5/7: Hari Ini dan Peta Hari Ini;
  - 7/5: detail tempat, kategori, cerita pilihan, pembuka loket;
  - 8/4: direktori.
- Ponsel: satu kolom dengan tepi 16 px. Indeks loket dua kolom.
- Jarak antarbagian 88—112 px di desktop dan 56 px di ponsel.
- **Kepala bagian:** penanda dan H2 di kiri, keterangan satu atau dua kalimat di kanan, garis tegas 2 px di bawahnya.

### 4.5 Komponen

**Kepala halaman** (isi di 3.1)
- *Wordmark*, lalu menu loket satu baris.
- Garis tegas 2 px di atas menu dan garis 1 px tinta di bawahnya.
- Nomor loket di menu memakai IBM Plex Mono 11,5 px warna nomor kecil.
- Loket yang sedang dibuka: garis bawah 3 px biru Riso dan `aria-current="page"`.

**Judul utama beranda.** Kalimat data dari 3.11, bukan slogan. Selalu diikuti paragraf pembuka.

**Baris angka** (Hari Ini)
- Label tebal 14 px di kiri, angka Newsreader 30 px di kanan, keterangan 13,5 px di bawah.
- Garis tegas di atas kelompok, garis tipis antarbaris.

**Indeks loket**
- Ilustrasi persegi (4.7), nomor mono, nama Newsreader, keterangan satu kalimat.
- Tanpa bingkai dan tanpa bayangan. Empat kolom di desktop, dua di ponsel.
- Seluruh butir dapat diklik. Saat disorot, nama berubah ke warna tautan.

**Baris tempat** (direktori, kategori, Makan, Tukang)

```
RS Santa Elisabeth Batam Kota                        ● IGD 24 jam
Rumah sakit tipe C · Belian, Batam Kota
──────────────────────────────────────────────────────────────────
```

- Nama Newsreader 23 px.
- Metadata sans 14,5 px: {jenis} · {kelurahan}, {kecamatan}.
- Status di kanan, paling banyak satu.

**Tabel informasi** (detail tempat)
- Label 15 px warna teks pendukung, lebar 200 px. Nilai 16 px.
- Garis tegas di atas tabel, garis tipis antarbaris, tanpa latar.

**Tombol**
- Bentuk pil (sudut penuh), tinggi 42 px. Di ponsel 40 px dengan area sentuh 44 px.
- Utama: latar tinta, teks putih. Kedua: garis 1,5 px tinta, latar putih.
- Paling banyak satu tombol utama per layar. Tombol saringan yang aktif tidak dihitung.

**Saringan.** Tombol pil 38 px. Yang aktif berlatar tinta. Jumlah ditulis dengan mono kecil di dalam tombol.

**Sakelar.** 38 × 22 px. Aktif berwarna tinta. Selalu berlabel teks di kirinya. Memakai `role="switch"` dan `aria-checked`.

**Pilihan segmen** (Cakupan di halaman cuaca). Garis 1,5 px tinta. Pilihan aktif berlatar tinta.

**Tab** (halaman cuaca). Teks 15 px tebal 600. Tab aktif berwarna tinta dengan garis bawah 3 px biru Riso.

**Label status**
- Titik 7 px dan teks 13—14 px, tanpa latar dan tanpa bingkai.
- Hijau: Buka sekarang, Langsung, IGD 24 jam. Kuning tua: Tertunda. Merah: Terputus dan peringatan.
- Makna tidak pernah hanya lewat warna. Teksnya selalu ada.

**Catatan berbingkai di peta**
- Latar putih, garis 1,5 px tinta (merah Riso untuk catatan feri), teks 12,5 px tebal 600.
- Baris pertama berwarna tautan.
- Garis penunjuk 1,2 px tinta dengan titik 3 px di ujungnya.

**Kotak ajakan koreksi.** Latar bidang kedua tanpa garis. Judul Newsreader miring 27 px, satu kalimat, lalu tautan aksi. Hanya di indeks loket beranda.

**Kaki halaman.** Pita gelombang biru Riso setinggi 30 px (dua lapis, 85% dan 50%), lalu *wordmark* Newsreader 34 px, satu baris keterangan, dan tautan.

**Catatan halaman.** Satu kalimat abu di bawah daftar. Kotak berwarna hanya untuk peringatan cuaca aktif: garis kiri 3 px warna status bahaya, paling banyak satu per halaman.

### 4.6 Templat Halaman

**Beranda** (contoh: `beranda.html`, `beranda-ponsel.html`)
1. Baris tanggal, kepala beranda, dan menu loket.
2. Hari Ini (5 kolom) dan Peta Hari Ini (7 kolom). Judul utama dan angka Hari Ini terlihat tanpa menggulir di 1440 px.
3. Peta Tempat selebar wadah, dengan panel Tempat (5.3).
4. Indeks loket.
5. Cerita pilihan: ilustrasi 7 kolom, teks 5 kolom, diapit garis tegas dan garis tipis.
6. Berita Batam, tiga kolom.
7. Ponsel: Hari Ini, Peta Hari Ini selebar layar, angka, Peta Tempat, indeks loket, cerita, berita.

**Pembuka loket** (contoh: `loket-cuaca-dan-laut.html`)
- Kiri (7 kolom): penanda LOKET 01, nomor besar, H1, paragraf pembuka. Kanan (5 kolom): ilustrasi loket.
- Blok SAAT INI bila loket punya data langsung.
- Bagian ISI LOKET INI: entri berilustrasi tiga kolom. Loket yang belum punya ilustrasi submenu memakai daftar bernomor:

```
01   Radar Hujan                                         →
     Hujan dalam 2,5 jam terakhir, diperbarui setiap 5 menit.
──────────────────────────────────────────────────────────
```

**Halaman cuaca** (contoh: `radar-hujan.html`)
- Kepala halaman, lalu baris tab.
- Desktop: panel kiri 560 px (tepi kiri sejajar wadah) dan peta di kanan setinggi 880 px. Di bawahnya bagian data dua kolom.
- Ponsel: peta penuh dengan lembar bawah yang bisa ditarik. Lembar bawah tertutup memuat judul, ringkasan, dan tab.

**Direktori** (contoh: `direktori.html`)
- Kiri (8 kolom): remah roti, H1, paragraf pembuka, kolom cari besar (tinggi 58 px, garis 2 px), saringan, jumlah. Kanan (4 kolom): ilustrasi Informasi Warga.
- Menurut keperluan: tiga kolom berisi ikon kategori, nama, keterangan, dan jumlah.
- Menurut kecamatan: empat kolom.

**Kategori** (contoh: `kategori-kesehatan.html`)
- Remah roti, ikon kategori 76 px di samping H1, paragraf pembuka, baris saringan dengan jumlah per jenis.
- Daftar baris tempat (7 kolom) dan peta (5 kolom) yang menempel saat menggulir.

**Detail tempat** (contoh: `detail-makan.html`)
- Kiri (7 kolom): remah roti, penanda {kategori} · {area}, H1, label, deskripsi, tombol, tabel informasi, bagian tambahan.
- Kanan (5 kolom): ilustrasi kategori, lalu peta kecil dengan keterangan.
- Ponsel: judul, label, tombol, peta kecil, tabel, lalu bagian tambahan. Ilustrasi kategori tidak tampil di ponsel.

**Cerita**
- Satu kolom 680 px, ilustrasi lebar di atas bila ada, catatan kaki bernomor.
- Linimasa: tanggal di kiri (mono), isi di kanan, satu label status per butir.

### 4.7 Grafis Riso

**Apa itu.** Ilustrasi dan peta pajangan yang dibuat dengan skrip `tools/grafis/riso.py` dan `tools/grafis/riso2.py`. Setiap tinta digambar sebagai lapisan terpisah, ditimpakan dengan *multiply*, digeser 1—1,5 px, lalu diberi butiran statis. Hasilnya WebP dua kali ukuran tampil. Grafis dan skripnya disetujui pemilik pada 5 November 2026.

**Tinta.** Biru #0078BF, merah #F15060, kuning #FFB511, dan hitam #222226. Paling banyak tiga tinta warna per gambar.

**Yang sudah ada** (di `public/grafis/` setelah paket diekstrak):

| Berkas | Dipakai di |
|---|---|
| `peta-hari-ini-dasar.webp` | Peta Hari Ini di beranda desktop (5.1) |
| `peta-hari-ini-ponsel-dasar.webp` | Peta Hari Ini di beranda ponsel |
| `loket-cuaca.webp` | Indeks loket dan pembuka Loket 01 |
| `loket-makan.webp` | Indeks loket dan pembuka Loket 02 |
| `loket-tukang.webp` | Indeks loket dan pembuka Loket 03 |
| `loket-transportasi.webp` | Indeks loket dan pembuka Loket 04 |
| `loket-cerita.webp` | Indeks loket dan pembuka Loket 05 |
| `loket-informasi.webp` | Indeks loket, pembuka Loket 06, dan Direktori |
| `loket-main.webp` | Indeks loket dan pembuka Loket 07 |
| `sub-radar.webp`, `sub-gelombang.webp`, `sub-cctv.webp` | Entri ISI LOKET INI di pembuka Loket 01 |
| `cerita-nongsa.webp` | Cerita pilihan di beranda dan halaman Kampung Tua Nongsa |
| `ilustrasi-kepiting.webp` | Detail tempat kategori makanan laut dan gonggong |

**Kategori Makan lain** belum punya ilustrasi. Halaman detailnya memakai `loket-makan.webp` sampai ilustrasinya dibuat.

**Membuat grafis baru**
- Tambahkan entri di skrip dengan pola yang sama: bentuk sederhana seperti lingkaran, gelombang, rumah panggung, dan kapal.
- Tidak menggambar orang, logo, lambang, atau bangunan yang dikenali sebagai lambang resmi.
- Tunjukkan grafis baru kepada pemilik sebelum dipakai.

**Pemakaian**
- `<img>` dengan `alt=""` bila hanya hiasan. Tulis `width` dan `height`.
- `loading="lazy"`, kecuali grafis di layar pertama.
- Ukuran berkas paling besar 450 KB.
- Di tampilan gelap, grafis diletakkan di atas alas terang #F6F4EF bersudut 4 px karena warna *multiply* hanya benar di atas kertas terang.
- Tidak ada `feTurbulence`, butiran yang dihitung di peramban, atau animasi pada grafis.

### 4.8 Gerak, Tampilan Gelap, dan Ponsel

- **Gerak:** pudar dan geser 8 px, 240 ms. Tanpa pantulan, tanpa paralaks, tanpa animasi saat menggulir. Bila animasi dinonaktifkan atau `prefers-reduced-motion` aktif, semua gerak berhenti.
- **Tampilan gelap:** mengikuti token `[data-theme="dark"]` di `design_tokens.css`. Aturan warna sama.
- **Ponsel:**
  - Target sentuh minimal 44 px.
  - Kolom cari terlihat di layar pertama halaman daftar.
  - Tidak ada tabel yang melebar keluar layar. Tabel panjang berubah menjadi baris bertumpuk.
  - Diuji di lebar 360 dan 390 px.

---

## 5. Peta

Ada dua jenis peta. **Peta pajangan** dibaca sekali lihat dan tidak bisa digeser. **Peta kerja** dipakai untuk mencari dan bisa digeser serta diperbesar.

### 5.1 Peta Hari Ini (Peta Pajangan)

- Dipakai di beranda, desktop dan ponsel.
- **Dasar:** gambar statis dari 4.7. Isinya darat kuning Riso, laut biru dengan titik raster yang makin rapat ke pantai, garis pantai, batas kecamatan, dan rute feri skematis ke Singapura.
- **Proyeksi** (sama dengan gambar dasar):

| Versi | Ukuran bingkai | Bujur | Lintang |
|---|---|---|---|
| Desktop | 760 × 780 | 103,80—104,26 | 0,7703—1,2424 |
| Ponsel | 358 × 400 | 103,84—104,16 | 0,895—1,2525 |

  Rumus: x = (bujur − bujur_min) ÷ (bujur_max − bujur_min) × lebar; y = (lintang_max − lintang) ÷ (lintang_max − lintang_min) × tinggi.

- **Lapisan langsung** di atas gambar, dalam satu SVG dengan `viewBox` yang sama:
  - arsiran hujan: poligon kecamatan yang sedang hujan dari `data/wilayah/kecamatan-kepri.geojson`, diisi pola garis miring 45° biru Riso (lebar garis 1,7, jarak 5), dengan `mix-blend-mode: multiply`;
  - catatan berbingkai dan garis penunjuknya (4.5, isi di 3.2);
  - label tempat sebagai HTML: Batam Centre, Harbour Bay, Sekupang, Nongsapura, dan Bandara Hang Nadim (12,5 px, tebal 700, halo putih);
  - nama pulau (kapital 11 px, tebal 800) dan nama perairan (Newsreader miring 15 px, warna tautan).
- Skala 5 km di kiri bawah (9,77% lebar bingkai desktop).
- Keterangan di bawah peta (3.2).

### 5.2 Peta Kerja

Dipakai di beranda (Peta Tempat), cuaca, direktori, kategori, transportasi, kampung tua, dan detail tempat.

- **Mesin:** MapLibre dengan Protomaps.
- **Warna lapisan** (token di 4.2):
  - laut `--bch-map-sea`, darat `--bch-map-land`, pulau di luar Batam `--bch-map-land-other`;
  - garis pantai `--bch-map-coast` 0,9 px;
  - batas kecamatan `--bch-map-boundary` 0,9 px, putus-putus 2—3;
  - nama kecamatan `--bch-map-label`, kapital 11 px, tebal 700, jarak huruf 0,14 em;
  - jalan `--bch-map-road` dengan tepi `--bch-map-road-casing`, jalan utama `--bch-map-road-major`, bangunan `--bch-map-building`.
- Tanpa garis koordinat, mawar angin, atau ornamen peta laut.
- **Bingkai:** garis 1,5 px tinta, sudut 10 px.
- **Kendali:** tombol + dan − di kanan atas (kotak putih bergaris tinta). Atribusi "© OpenStreetMap · Protomaps" di bawah peta atau di pojok kanan bawah.
- **Panel di atas peta:** latar putih solid, garis 1,5 px tinta, sudut 10 px, bayangan `--bch-shadow-panel`. Ini satu-satunya bayangan yang diizinkan karena panel melayang di atas peta.
- **Peta gelombang:** warna tile diredam dengan *opacity* 0,4—0,5 dan *blend* `multiply`, atau dipetakan ulang ke gradasi biru. Laut tidak boleh berwarna biru pekat.
- **Radar:** ringan berupa titik raster biru di atas `--bch-radar-light`, sedang `--bch-radar-mid`, lebat `--bch-radar-heavy`.
- **Peta kecil di detail tempat:** penanda kategori, lingkaran putus-putus bila lokasi perkiraan, dan terminal feri terdekat bila masuk bingkai.

### 5.3 Panel Tempat

Panel ini menggantikan panel lapisan lama. Bentuknya seperti panel tempat di Hoodmaps: daftar centang per jenis tempat, dan setiap jenis punya ikon sendiri di peta.

- **Membuka:** tombol [Tempat] di atas peta.
  - Desktop: panel melayang di kiri atas peta, lebar 312 px, tinggi paling besar 560 px, bisa digulir.
  - Ponsel: lembar bawah. Di bawah peta ada deret *chip* kelompok yang sedang tampil.
- **Kepala panel:** "Tempat", tautan [Pilih semua], dan tombol tutup berlabel "Tutup daftar tempat".
- **Isi:** kelompok bercentang dengan jumlah, lalu jenis tempat dengan ikon dan jumlah (5.4).
  - Mencentang kelompok mencentang semua jenis di dalamnya.
  - Bila hanya sebagian jenis tercentang, kotak kelompok menampilkan tanda strip.
- **Awal:** semua jenis yang punya titik lokasi tercentang. Jenis yang belum punya titik (saat ini Hotel) tidak tercentang dan diberi keterangan "Lokasi sedang dilengkapi".
- Pilihan disimpan di `localStorage` dengan kunci `bch-tempat`.
- Jumlah dihitung dari data saat *build*.
- Tombol [Cuaca dan laut] di sebelahnya membuka sakelar: Radar hujan · Tinggi gelombang · Kamera lalu lintas.

### 5.4 Ikon dan Penanda Tempat

Bentuk ikon (*glyph*), warna, dan emoji ada di `tools/grafis/ikon.json`. Ubah menjadi komponen di `components/map/icons.tsx`.

| Kelompok | Warna | Jenis tempat (data) |
|---|---|---|
| Makan | #E85A1F | Makanan laut dan gonggong (`seafood-gonggong`, `kuliner_seafood`); Kopitiam dan kafe (`kopitiam`, `cafe`, `kedai_kopi`); Mi, bakso, dan sup (`mie-bakmi`, `bakso`, `mie-tarempa`, `sup-ikan`); Dim sum dan bubur (`dimsum-chinese`, `bubur`); Nasi dan lauk (kategori Makan lainnya); Oleh-oleh (`oleh-oleh`) |
| Menginap | #765BA7 | Hotel |
| Ibadah | #407060 | Masjid; Gereja; Wihara dan kelenteng; Pura |
| Kesehatan | #F15060 | Rumah sakit |
| Transportasi | #0078BF | Pelabuhan feri; Bandara; Halte Trans Batam |
| Belanja | #FFB511 (ikon tinta) | Mal dan pusat belanja; Pasar barang bekas |
| Cerita dan sejarah | #914E72 | Kampung tua; Jembatan Barelang; Museum dan situs sejarah |
| Alam dan ruang publik | #00995A | Pantai; Taman dan alun-alun; Olahraga |

Kategori data pemerintahan, layanan publik, pemakaman, pertanahan, jasa, dan lain-lain tidak tampil di panel Tempat. Kategori itu tetap ada di Direktori.

**Penanda**
- **Gaya A** (dipilih pemilik pada 5 November 2026): lingkaran 26 px berwarna kelompok dengan ikon garis putih 15 px (garis 2 px, ujung bulat). Kelompok kuning memakai ikon tinta. Cincin putih 2 px dan bayangan `0 1px 4px rgba(0, 0, 0, .28)`.
- **Gaya B** (cadangan, tidak dipakai sekarang): emoji Noto Color Emoji 21 px dengan halo putih. Fon emoji hanya dimuat untuk peta. Emoji tetap dilarang di teks (2.9 dan 7.1).
- **Lokasi perkiraan:** garis putus-putus 1,5 px berwarna kelompok, berjarak 3 px dari lingkaran.
- **Klaster:** tempat yang berjarak kurang dari 22 px digabung menjadi pil putih dengan garis 2,5 px warna kelompok pertama dan angka tebal 12 px. Mengetuk klaster memperbesar peta.
- **Label nama:** 12,5 px tebal 700 dengan halo putih, di kanan penanda. Hanya untuk penanda yang dipilih dan tempat penting (terminal feri, bandara).
- **Ikon kategori direktori:** lingkaran 40 px (76 px di judul kategori) dengan ikon 20 px. Warna dan bentuk ikonnya ada di `ikon.json` bagian `kategori_direktori`.

### 5.5 Peta Pajangan Lain

- Mode Mural, kartu pos, dan peta vibe tetap disembunyikan (bagian 6) sampai ada ilustrasi segmen.
- Grafis Riso (4.7) boleh dipakai untuk kartu pos setelah pemilik menyetujui gambarnya satu per satu.
- Ikon landmark (bangunan yang dikenali) tetap menunggu ilustrator. Bahan *brief* ada di `data/mural/ikon_prioritas.json` dan `data/mural/segmen.json`.
- Mural adalah mode, bukan loket. Pintu masuknya kelak dari beranda: [Lihat Batam sebagai Mural].

---

## 6. Yang Disembunyikan sampai Siap

Halaman di bawah ini tetap ada di kode dengan `noindex`, tetapi dihapus dari menu, beranda, peta, dan sitemap:

| Halaman | Disembunyikan sampai |
|---|---|
| /mural, /mural/cara-dibuat | Ilustrasi segmen pertama tersedia |
| /mural/gcp | Selamanya untuk publik (alat internal) |
| /main/vibe | Ada kiriman warga yang sudah dimoderasi |
| Quest mural | Mural tayang |
| /cerita/dulu (Batam Dulu dan Sekarang) | Ada foto lama yang berizin |
| /info/warga-baru | Isinya lengkap |
| /admin | Selamanya untuk publik |
| /cerita/rempang, /cerita/kampung-tua/legalitas | Pemilik selesai membaca dan menyetujui. Setelah itu tampil normal. |

---

## 7. Pemeriksaan sebelum Selesai

### 7.1 Pemeriksaan Bahasa Otomatis

Buat `scripts/cek-bahasa.mjs` yang memindai teks antarmuka (JSX, file data yang tampil, i18n) dan gagal bila menemukan:

- **Sebutan pemerintah dan sumber:** `batam.go.id`, `bukan situs resmi`, `layanan resmi`, `Cek langsung`, `Sumber:`, `Menurut:` (kecuali di Kolofon dan Berita).
- **Catatan kerja:** `Belum dicek ulang`, `lokasi belum diisi`, `perlu cek ulang`, `data lama`, `sumber sekunder`, `jam dari berita`, `tidak menebak`, `tautan belum tercatat`, `placeholder`, `segera hadir`.
- **Gaya terlarang** (cocokkan frasa utuh dan batas kata, supaya kata seperti "titik" tidak ikut tertangkap):
  - `Itik sedang berbaris`, `Halaman ini tenggelam`;
  - `hidden gem`, `hits`, `wajib coba`, `wajib dikunjungi`, `premium`, `instagramable`, `healing`, `kekinian`, `layak dikejar`, `agak tersembunyi`;
  - tanda seru di teks Indonesia;
  - emoji (kecuali kolom `emoji_gaya_b` di data ikon peta, bila pemilik memilih gaya B).
- **Kata tidak baku:** semua kata di kolom kiri tabel 2.8.
- **Pola salah:**
  - jam bertitik dua (`\b\d{1,2}:\d{2}\b`) di teks Indonesia;
  - `Rp ` dan `Rp.`;
  - angka langsung menempel pada satuan (`\d(km|m|kg)\b`);
  - `di update`, `di cek`;
  - `kemana`, `dimana`, `apapun`, `siapapun`;
  - `non-` diikuti huruf kecil di teks Indonesia;
  - `&` di teks Indonesia;
  - kata `Anda` sebagai kata utuh.

Jalankan skrip ini di `prebuild`. Daftar pengecualian (nama usaha, nama resmi) disimpan di `scripts/cek-bahasa-pengecualian.json`.

### 7.2 Skor Tampilan per Halaman

Beri 1 poin untuk setiap jawaban "ya". Skor 0—2 lolos. Skor 3 atau lebih harus direvisi.

1. Lebih dari separuh isi berada di dalam kotak atau kartu?
2. Ada lebih dari satu label status per objek?
3. Ada lebih dari satu kotak catatan?
4. Ada catatan kerja internal yang tampil?
5. Ada label satu kata tanpa waktu atau satuan di area data?
6. Ada kalimat jenaka di label, status, pesan memuat, atau galat?
7. Ada sebutan pemerintah di luar isi faktual, atau tautan sumber?
8. Ada kalimat yang bisa dipindah ke situs kota lain tanpa diubah?
9. Kolom cari atau informasi utama tidak terlihat di layar pertama ponsel?
10. Ada tombol atau legenda yang tampak bisa diklik tetapi tidak berfungsi?

### 7.3 Pemeriksaan Manual

- Baca ulang setiap halaman dengan suara pelan. Kalimat yang terasa canggung ditulis ulang.
- Pastikan semua judul mengikuti 2.3 dan semua angka mengikuti 2.6.

---

## 8. Urutan Kerja dan Perbaikan per Halaman

### 8.1 Urutan

1. **Sembunyikan** halaman di bagian 6.
2. **Bahasa:**
   - pasang `scripts/cek-bahasa.mjs`;
   - ganti semua teks dengan naskah bagian 3;
   - rapikan teks lain mengikuti bagian 2;
   - perbarui `data/design/microcopy.json` dan `features/makan/lib/i18n.tsx`.
3. **Tampilan:**
   - ekstrak paket tampilan ke akar repo (lihat Cara Memakai, butir 4);
   - pakai token dari `data/design/design_tokens.css` (4.2) dan pasang tiga huruf (4.3);
   - buang gaya lama: kertas krem, Source Serif 4, ornamen peta laut, mawar angin, garis koordinat;
   - bangun komponen 4.5 dan templat 4.6, dengan contoh tampilan sebagai acuan.
4. **Cuaca dan Laut:**
   - pecah `/langit-laut` menjadi `/cuaca/hujan`, `/cuaca/gelombang`, dan `/cuaca/cctv`;
   - alihkan alamat lama `?mode=` ke alamat baru dengan mempertahankan `view` dan `cam`;
   - redam peta gelombang.
5. **Beranda:** Hari Ini dan Peta Hari Ini di layar pertama (3.2, 5.1), lalu Peta Tempat dengan panel Tempat (5.3) dan ikon (5.4).
6. **Makan** (8.3), **Berita** (8.4), lalu halaman lain (8.2).
7. **Teknis** (8.5).
8. **Tinjau ulang:**
   - ambil ulang galeri screenshot desktop dan ponsel;
   - beri skor 7.2 untuk setiap halaman;
   - catat hasilnya di `docs/KOREKSI.md` (halaman, skor sebelum, skor sesudah, perubahan utama).

**Selesai bila:**
- `cek-bahasa` lulus.
- Semua halaman mendapat skor 0—2.
- Judul utama dan angka Hari Ini terlihat tanpa menggulir di desktop 1440 px. Di ponsel 390 px, judul utama dan paragraf pembuka terlihat tanpa menggulir.
- Tampilan setiap halaman cocok dengan contoh tampilan (4.1).
- Halaman di bagian 6 tidak muncul di menu, beranda, dan sitemap.
- Build dan semua tes lulus.

### 8.2 Perbaikan per Halaman

Nomor merujuk galeri screenshot 5 November 2026.

| No | Halaman | Perbaikan |
|---|---|---|
| 01 | Beranda | 3.2, 4.6, dan 5.1—5.4. Hari Ini dan Peta Hari Ini di layar pertama. |
| 02—04 | Cuaca dan Laut | 3.3. Panel memakai label dan kalimat baru. Peta gelombang diredam. |
| 05—13 | Makan | 3.4 dan 8.3. "Dekat Terminal Feri" menjadi daftar baris, bukan empat kotak. |
| 14—15 | Tukang Langganan | 3.5. Hapus dua kotak peringatan. |
| 16 | Transportasi | Enam kotak menjadi daftar bernomor. Feri terakhir menjadi tabel tanpa label bertumpuk. |
| 17 | Trans Batam | Diagram dipertahankan. Kotak catatan menjadi satu kalimat di bawah halaman. |
| 18 | Koridor | Hapus "lokasi belum diisi" di setiap halte. Pakai diagram garis koridor. Tabel tanpa label sumber. |
| 19 | Peta transportasi | Peta kerja 5.2 dengan ikon 5.4. Jalur geografis hanya yang ada datanya. |
| 20—22 | Feri, panduan, pompong | 3.6. Tabel pompong tanpa kolom status data. |
| 23 | Cerita dan Budaya | Sembilan kotak menjadi daftar bernomor. |
| 24 | Sejarah | Satu label per butir. Tautan sumber dihapus. |
| 25 | Batam Dulu | Disembunyikan (bagian 6). |
| 26—27 | Kampung Tua | Legenda dan label kartu sesuai 3.7. |
| 28—29 | Legalitas, Rempang | Label pelaku dipisah. Baris yang disaring dihapus. Tautan dihapus. **Isi faktual tidak diubah.** |
| 30—36 | Nama jalan, kalender, kamus, budaya, komunitas, angka | Kotak menjadi daftar. Satu label status. |
| 37—42 | Informasi Warga, direktori, kartu tempat, kecamatan | 3.8. Kolom cari di atas. Daftar baris. Kartu tempat tanpa baris kosong. |
| 43 | Nomor darurat | Angka besar. Hapus peringatan situs palsu. |
| 44—46 | Urusan tanah, bantuan hukum, jasa dokumen | Nama kantor tanpa tautan. Catatan "bukan nasihat hukum" pindah ke bawah. |
| 47 | Warga baru | Disembunyikan. |
| 48 | Berita | 8.4. |
| 49—52 | Ruang Main | 3.9. Vibe dan quest disembunyikan. |
| 53—55 | Mural | Disembunyikan. |
| 56—61 | Pendukung | 3.10. Kolofon menjadi satu-satunya tempat kredit data. |
| 62 | Admin | Disembunyikan dari publik. |
| 63 | 404 | 3.1. |

### 8.3 Loket Makan

- **Label:** satu label per tempat (3.4). Label kurasi memakai label baru yang sudah disetujui pemilik.
- **Deskripsi:**
  - Sapu `data/makan/places.json` dan i18n untuk kata terlarang dan kata tidak baku.
  - Ganti dengan fakta yang sudah ada di data: tahun berdiri, menu, jam ramai.
  - Jangan menambah fakta. Bila tidak ada pengganti, hapus kata promosinya saja.
- **Harga:** kisaran dari `price_idr`.
- **Nomor telepon:** 25 tempat bernomor ponsel disembunyikan (keputusan pemilik). Nomor ditampilkan lagi hanya setelah pemilik memastikan itu nomor usaha. Tombol Petunjuk arah tetap ada.
- **Nama usaha:** ditulis persis seperti aslinya, termasuk ejaan tidak baku di dalam nama (misalnya "Mie Terempa'K").

### 8.4 Berita

- Hanya judul yang menyebut Batam dan sekitarnya yang tampil. Kata kunci di judul:
  - Batam, Kepri, Kepulauan Riau, Barelang, Rempang, Galang, Bulang, Belakang Padang, Nongsa, Bintan, Tanjungpinang;
  - nama 12 kecamatan;
  - kawasan utama: Nagoya, Jodoh, Batam Centre, Tiban, Batu Aji, Sekupang, Harbour Bay, Bengkong, Tanjung Uncang, Muka Kuning.
- Judul nasional dan internasional tidak tampil.
- Bila hasilnya sedikit, tampilkan sedikit. Jangan diisi berita lain.
- Cuplikan di beranda tiga judul.

### 8.5 Teknis

1. **`robots.txt` di Railway masih `Disallow: /`.** Biarkan selama situs belum diumumkan. Buka saat domain final dipasang, dan isi `NEXT_PUBLIC_SITE_URL`.
2. **Peta dasar (46 MB) dilayani dari server aplikasi.** Pindahkan ke penyimpanan dengan CDN bila peta terasa lambat di ponsel.
3. **Cache data realtime.** Railway tidak memiliki CDN bawaan seperti Vercel. Pastikan route data realtime memakai cache memori di server supaya sumber radar dan gelombang tidak diminta pada setiap kunjungan.
4. **Tes mural yang gagal** boleh dilewati selama mural disembunyikan.
5. **Uji di ponsel Android dan iPhone asli.**
6. **Gambar yang tampil kecil memakai versi kecil.** Gambar hidangan baru atau desain kartu pos baru butuh `node scripts/buat-varian-gambar.mjs`; tes unit gagal bila versi kecilnya tidak ada.
7. **Data mentah hanya di server.** Modul yang membaca `data/places.json` atau data feri mentah diawali `import "server-only"`. Komponen klien menerima hasil olahannya lewat props.
8. **Badan permintaan dibaca berbatas.** Route baru memakai `bacaTeksTerbatas` atau `bacaJsonTerbatas` dari `features/tukang/http.ts`, bukan `req.text()` atau `req.json()`.
9. **Service worker** (`public/sw.js`) tidak menyimpan `/admin`, `/api`, `/tiles`, dan respons `no-store`. Naikkan nama cache bila aturannya diubah supaya simpanan lama terhapus.
10. **CCTV:** jangan kembalikan pemaksaan pemutar bawaan Safari di iPhone. Kamera Pemko menyiarkan H.265 dalam .ts dan playlist 2 potongan, dua hal yang ditolak pemutar bawaan. Audit armada: `bash scripts/cctv-audit.sh`.
11. **Log Koreksi:** setiap perbaikan atas fakta yang sudah tayang (tempat dihapus karena tutup, titik dipindah, angka salah) dicatat di `data/redaksi/log-koreksi.json`, terbaru di atas, dengan alamat internal halaman yang diperbaiki. Perbaikan tampilan dan bahasa tidak perlu dicatat.
12. **Data terstruktur:** JSON-LD hanya dibentuk lewat `lib/data-terstruktur.ts`. Jangan memasukkan nomor telepon, rating pihak lain, atau titik perkiraan. `npm run check:rules` (juga `postbuild`) memeriksa keluaran build.
13. **Direktori dari data Google Maps pemilik (keputusan pemilik 11 Nov 2026, menggantikan isi butir ini).** Pemilik menghimpun 12.044 tempat dari Google Maps (`Direktori_Batam.xlsx`, diaudit dan diperbaiki menjadi `Direktori_Batam_diperbaiki.xlsx` 11 Nov 2026) dan memutuskan datanya dipakai langsung: `python -I tools/google/impor.py <xlsx>` menulis `data/tempat-google.json`, dibaca `features/direktori/terbuka.ts`. Semua tempat masuk, termasuk nomor telepon dan ponsel yang dipasang pemilik usaha di Google Maps; baris yang bersumber dari data pajak tidak dipakai. Rating minimal 4,5 dari sedikitnya 100 ulasan di kategori Kuliner, Penginapan, Wisata, Belanja, Jasa, Olahraga, dan Khas Batam diberi tanda Rekomendasi dan tampil lebih dulu; angka rating tidak ditampilkan. Tombol arah memakai tautan Google Maps tempat itu. Kategori mengikuti jenis Google (toko di Belanja, bengkel di Jasa, makanan di Kuliner) dan saringan Kuliner memakai jenis Makanan; isi kategori Kampung Tua dari Google masuk Lainnya karena kampung tua memakai daftar kurasi. Data Overture tidak dipakai lagi. Teks lama di bawah hanya sejarah.

    Sebelumnya, **tempat dari data terbuka** (keputusan pemilik 9 Nov 2026): Direktori diperbesar dari Overture Maps lewat `python -I tools/overture/impor.py` (butuh `pip install duckdb`), ke `data/tempat-terbuka.json`. Bukan menyalin Google Maps: syarat Google melarang data Places dipakai bersama peta non-Google dan melarang penyalinan. Aturan impor: hanya jenis tempat umum, keyakinan sumber 0,7 ke atas, titik di dalam 12 kecamatan, tanpa nomor ponsel (sama dengan 8.3), tanpa media sosial dan situs pihak ketiga, tanpa kantor pemerintah dan darurat (itu data kurasi), tanpa nama perumahan dan perorangan, dan tempat yang sudah ada di `data/places.json` tidak ditambahkan. Semua titiknya berstatus perkiraan. Halamannya dibuat saat pertama dibuka, tidak saat build. Pin peta dan indeks pencarian direktori dibuat `scripts/data-direktori.ts` saat prebuild dan predev sebagai berkas statis di `public/info/direktori/`, karena Next.js tidak memampatkan jawaban route handler; jangan kembalikan menjadi route. Perbarui saat Overture merilis data baru.
