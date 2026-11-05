# Audit Situs, November 2026

Laporan mentah dari audit visual. Halaman dan ukuran mengacu pada build sebelum rombak menu, jadi sebagian sudah terbawa perbaikan. Status akhir ada di bagian Hasil.

## Hasil

Audit mesin pada build produksi terakhir, 130 halaman di dua lebar: nol tautan rusak, nol galat konsol, nol gagal muat, nol luber mendatar. Axe: 256 pemeriksaan, nol temuan. Skor pedoman: 60 dari 60 halaman lolos, rinciannya di `KOREKSI.md`.

**Selesai:** peta di dalam wadah, klaster dan angka gabungan dihapus, ruang kosong pembuka, hierarki judul, Title Case, tautan formulir mati, saringan Tukang saat kosong, pencarian seluruh situs dan sinonim, ikon direktori, kartu menjadi baris di Budaya, Komunitas, dan Acara, Kamus ringkas, tabel angka, jadwal feri dilipat, tombol sebelum galeri, target sentuh ponsel, gulir saat pindah halaman, kunci gulir dan Escape pada menu ponsel, cetak Kartu Pos tepat dua lembar A6.

**Sengaja tidak diubah:**
- Teks mentah BMKG di gempa dan peringatan, karena isi BMKG tidak boleh berubah. Nama wilayah cuaca berbahasa Inggris juga datang langsung dari NEA.
- Catatan sumber di Acara dan Kampung Tua. Atribusinya bagian dari kejujuran isi.
- "Makanan 120" di peta beranda berbeda dari 117 tempat Makanan, karena kelompok peta juga memuat tiga tempat Khas Batam.

**Temuan terakhir dari galeri, sudah dibetulkan:** tinggi peta Cuaca di ponsel masih memakai kepala situs lama sehingga judul panel terdorong ke tepi layar, jarak judul Sementara Ini di Tukang hilang, paragraf di kolom sempit samping ilustrasi renggang, dan pilihan urutan Makanan hanya setinggi 20 px.

**Bukan kesalahan, tetap:** beranda menulis status peringatan gelombang belum dapat dimuat saat buletin BMKG tidak memuat Kepulauan Riau, karena status itu tidak boleh diklaim aman. Halaman peta Cuaca mengikuti jam, jadi malam hari tampil gelap selama pengunjung belum memilih tema.

**Menunggu data atau keputusan pemilik:**
- Nomor telepon rumah sakit tidak ada di data, dan banyak tempat tanpa titik. Lihat lembar koordinat.
- `RS BP Batam (RS Otorita)` dan `RS Badan Pengusahaan Batam` tampaknya rumah sakit yang sama.
- Formulir warga aktif setelah Supabase tersambung.
- Narasi Kampung Asal Hari Jadi Batam di detail Nongsa masih per butir dengan label status. Narasi utuhnya ada di Jurnal.

## Temuan: Tukang sampai Halaman Pendukung

**Catatan pengujian**
- Server 3100 menjalankan build lebih lama dari kode kerja. `/berita`, `/komunitas`, `/things-to-do`, `/kartu-pos`, dan `/cctv` memberi 404 di sana, padahal berkasnya ada di working tree. Temuan memakai alamat yang berlaku di 3100.
- Potongan layar berhenti di 16.000 px. Halaman ponsel yang panjang (sejarah, nama jalan, kalender, kamus, angka, kampung tua) hanya saya contoh per lembar, lalu saya lengkapi dengan ukuran DOM dan tangkapan per bagian.
- Tombol "Bagikan", "Unduh kartu pos", dan "Hapus saringan" belum saya klik.
- Berkas repo tidak diubah. Skrip dan gambar ada di `C:\Users\user\AppData\Local\Temp\claude\e68c5d42f708b782\24d8a384-19c3-41dc-869b-3dd239c34205\scratchpad\audit-b\`.

Format baris: alamat · lebar · tingkat · masalah → saran.

## Lintas Halaman
- 30 halaman · 1440+390 · Berat · "Kirim koreksi" dan "Laporkan data yang salah" selalu berujung di formulir "belum aktif". → Sediakan kanal sementara (surel/WA) atau sembunyikan semua tautannya sampai formulir hidup.
- `/cerita/sejarah`, `/cerita/kampung-tua`, detail kampung, `/cerita/nama-jalan`, `/cerita/kalender`, `/cerita/kamus`, `/cerita/budaya`, `/cerita/komunitas`, `/cerita/angka` · 1440+390 · Sedang · Tidak ada satu pun gambar, padahal bagian ini menjual cerita. → Pasang ilustrasi Riso atau foto, minimal satu di tiap halaman.
- `/info/bantuan-hukum`, `/info/kecamatan/batam-kota`, `/info/darurat`, `/cerita/angka`, `/cerita/kalender` · 1440 · Sedang · Jarak di atas H2 hanya 28 px, sedangkan pedoman meminta 88—112 px, jadi bagian menempel. `/kolofon` memakai 48 px. → Samakan satu token jarak antarbagian.
- `/info/bantuan-hukum`, `/info/jasa-dokumen`, `/cerita/sejarah`, `/cerita/angka` (Hotel, Agama) · 1440+390 · Sedang · Paragraf pengantar menempel pada garis tegas 2 px di bawahnya. → Beri jarak 16—24 px di atas garis.
- `/tukang`, `/info/urusan-tanah`, `/cerita/sejarah` (Asal Nama) · 1440+390 · Ringan · Paragraf pembuka dan teks isi berurutan tanpa jarak, dengan ukuran dan warna berbeda. → Beri jarak atau gabungkan.
- `/info/tempat/*`, `/tentang`, `/kolofon`, `/koreksi`, `/kontribusi`, `/privasi`, `/syarat`, `/tukang/rekomendasi`, detail kampung · 1440 · Sedang · Isi hanya di kolom kiri 680 px dan separuh kanan kosong. → Isi kolom kanan (peta, ilustrasi, daftar isi, kontak) atau susun ulang.
- `/info`, `/info/direktori`, `/cerita/angka`, `/cerita/komunitas`, `/info/darurat`, `/cerita/sejarah` · 1440+390 · Sedang · Hierarki judul kacau: H2 tampil 12 px, 25 px, dan 44 px; H3 tampil 17 px dan 25 px di halaman yang sama. → Tetapkan satu skala per tingkat dan pakai tag sesuai peran.
- `/cerita/budaya`, `/cerita/komunitas`, `/cerita/kalender`, `/cerita/kamus`, `/main/kartu-pos` · 1440+390 · Ringan · Kalimat biasa memakai huruf mono ("Data dihimpun…", "Dibuat di perangkatmu…"), sedangkan `/info/*` memakai sans. → Mono hanya untuk angka dan jam.
- `/cerita/sejarah`, `/cerita/kampung-tua`, `/cerita/nama-jalan` · 1440+390 · Sedang · Label status memakai titik, ikon kecil (✓, ᛉ, ?, bintang, buku), dan teks. Halaman lain hanya titik dan teks. "Belum terverifikasi" kadang kuning, kadang abu tanpa titik. → Satu gaya: titik 7 px dan teks, warna tetap per status.
- `/cerita/sejarah`, `/cerita/kalender`, `/cerita/kamus` · 1440+390 · Ringan · Kontrol persegi berbingkai (saringan status, Daftar/Per bulan, huruf A—U) bercampur dengan pil. → Samakan ke pil.
- `/cerita/*` vs `/info/*` · 1440+390 · Ringan · Halaman Cerita memakai penanda kapital, halaman Info memakai remah roti, halaman Tentang dan sejenisnya tanpa keduanya, detail tempat memakai dua-duanya. → Tetapkan satu pola.
- Banyak halaman · 1440+390 · Sedang · Label belum Title Case: "Jam buka", "Tipe rumah sakit", "Asal-usul nama", "Penduduk awal", "Berdiri sejak", "Edisi tercatat", "Tempat mengurus", "Jam layanan", "Lapisan peta", "Riau daratan", "Semua titik data wisman", "Hikayat dan legenda, bukan catatan sejarah", "Pertanahan dan hukum" di remah, "Daftar Pejabat lelang kelas II". → Terapkan `kaidahJudul`.
- Kaki halaman · 390 · Sedang · Tautan kaki hanya 30 px tingginya dan remah roti 18 px, di bawah 44 px. "Animasi: aktif" tampak seperti tautan. → Besarkan area sentuh dan ubah menjadi sakelar berlabel.
- Pindah halaman lewat tautan · 1440+390 · Ringan · Halaman baru terbuka tergulir (`/info/direktori/pertanahan-hukum/ppat` 122 px, kepala halaman terpotong; `/info/darurat` 33 px). → Reset gulir ke 0.

## `/tukang`
- 1440+390 · Berat · Teks pil saringan aktif tidak terlihat, tema terang dan gelap. Warna teks sama dengan latar: #161616 di atas #161616, #F2F0EB di atas #F2F0EB. → Perbaiki warna teks `aria-current`.
- 1440+390 · Berat · Halaman berisi 17 pil, pilihan kecamatan, dan tombol Saring, tetapi semua hasilnya kosong ("Belum ada nama di daftar ini"). → Sesuai prinsip 1.7, sembunyikan saringan sampai ada data.
- 1440+390 · Berat · Penanda biru "KIRIM REKOMENDASI" tampak tautan tetapi bukan, dan halaman tidak punya ajakan atau jalan keluar. → Jadikan tautan dan tambahkan rujukan ke kategori Jasa di direktori.
- 1440 · Sedang · Ruang kosong sekitar 230 px di atas penanda. Pil baru muncul di bawah, "Kecamatan" terpotong di tepi layar pertama. → Rata atas dan kecilkan ilustrasi.
- 390 · Sedang · Ilustrasi 358×358 mendorong pil pertama ke sekitar y=795. → Sembunyikan atau kecilkan di ponsel.
- 1440+390 · Ringan · "Jenis Jasa" tampil H2 44 px padahal hanya label saringan; "Semua" tetap berbingkai tegas saat pil lain aktif; pil tidak berubah saat disorot. → Jadikan label kecil dan rapikan status pil.
- 1440+390 · Ringan · Pil langsung menyaring tetapi kecamatan butuh tombol Saring. → Samakan perilakunya.

## `/tukang/rekomendasi`
- 1440+390 · Berat · Halaman buntu: hanya judul dan "Formulir ini belum aktif", ruang di bawahnya kosong, dan hanya ditautkan dari `/kontribusi`. → Sembunyikan sampai formulir siap.

## `/cerita`
- 1440 · Berat · Ruang kosong sekitar 340 px di atas penanda; daftar baru tampak satu baris di layar pertama. → Rata atas dan rapatkan pembuka.
- 390 · Sedang · Ilustrasi mendorong baris pertama ke y=753. → Kecilkan atau pindahkan.
- 1440+390 · Sedang · Delapan baris hanya judul dan panah (63 kata sehalaman), padahal pedoman 4.6 mencontohkan satu kalimat keterangan. → Tambahkan keterangan per baris.
- 1440+390 · Sedang · Dua garis tegas bertumpuk di bawah "ISI BAGIAN INI", berjarak sekitar 18 px. → Hapus satu.
- 390 gelap · Ringan · Alas terang ilustrasi 358×358 mendominasi layar gelap. → Kecilkan di ponsel.

## `/cerita/sejarah`
- 1440+390 · Berat · Halaman terlalu panjang (19.037 px dan 28.520 px). Garis Waktu 49 butir berformat kartu poin dan mengulang isi esai. → Jadikan narasi utama, ringkas linimasa menjadi tonggak, dan lipat sisanya.
- 1440+390 · Sedang · Paragraf esai tanpa jarak antarparagraf sehingga terbaca seperti tembok teks. → Beri jarak paragraf.
- 1440+390 · Sedang · Baris "Lihat di garis waktu: …" muncul 9 kali dan memecah bacaan. → Hapus atau ubah menjadi satu tautan per bagian.
- 1440+390 · Sedang · Judul butir berupa nomor aturan ("PP 5/2011", "PP 36/2000", "Keppres 33/1974", "Perda 4/2009"). → Pakai judul yang menjelaskan peristiwanya.
- 1440+390 · Sedang · "Perubahan Fisik Kota" hanya Lokasi, Tahun, dan Status, tanpa menyebut apa yang berubah. → Tambah kolom perubahan atau hapus tabelnya.
- 390 · Berat · Tabel Perubahan Fisik bertumpuk tiga label per baris sehingga 14 lokasi menghabiskan beberapa layar. → Ringkas menjadi satu baris: nama, tahun, status.
- 1440 · Ringan · Bagan kecil berbingkai 320×215 dengan label sekitar 11 px sulit dibaca, dan kartu berbingkai dilarang pedoman 4.1. → Buang bingkai dan besarkan, atau hapus.
- 1440 · Ringan · Grafik dan tabel Penduduk/Wisman menyisakan bagian kanan kosong; tabel 3 kolom melebar 1200 px untuk isi pendek. → Batasi lebar tabel atau letakkan bersebelahan dengan grafik.

## `/cerita/kampung-tua`
- 1440+390 · Sedang · "Lokasi perkiraan" diulang 51 kali di daftar. → Cukup satu kalimat di atas daftar.
- 1440+390 · Sedang · "Apa Itu Kampung Tua" justru terletak di bawah daftar panjang. → Pindahkan ke atas.
- 1440+390 · Sedang · "Mengapa Jumlahnya Berbeda" berisi tabel nomor surat dan sumber yang terbaca seperti catatan riset ("Artikel opini di e-paper…", "kajian Trend Asia"). → Tulis ulang menjadi dua atau tiga kalimat, tanpa mengubah fakta.
- 1440+390 · Sedang · Kotak putus-putus "Cerita rakyat, bukan catatan sejarah" dan bintang kecil adalah sisa hiasan. → Ganti dengan H3 dan paragraf biasa.
- 1440+390 · Sedang · Penanda peta bertumpuk dan menutupi label ("KAMPUNG JABI", "NONGSA PANTAI"), paling parah di ponsel. → Kelompokkan penanda saat zoom kecil.
- 390 · Sedang · Kotak centang lapisan 13×13 px; "35 dari 37 di peta" membingungkan. → Perbesar target dan buat keterangan lebih sederhana.
- 1440+390 · Ringan · "(Pesan soal sampah juga pernah disampaikan Wali Kota di Tanjung Riau.)" tidak perlu. → Hapus.
- 1440 · Ringan · Direktori menulis Kampung Tua 59, halaman ini menulis 56 kampung. → Selaraskan atau jelaskan.

## `/cerita/kampung-tua/kt-nongsa-pantai`
- 1440+390 · Berat · "Kampung Asal Hari Jadi Batam" berupa enam potongan berlabel dan bergaris, bukan narasi, dan fakta makam serta Perda terulang. → Tulis satu narasi; ketidakpastian cukup disebut dalam kalimat.
- 1440+390 · Sedang · H1 dan semua H2 sama-sama 44 px, sehingga judul halaman tidak menonjol. → Besarkan H1 ke skala halaman lain.
- 1440+390 · Sedang · Dua penanda bertumpuk ("KAMPUNG TUA · DARATAN BATAM" dan "KAMPUNG TUA, DAFTAR 37"), dan "DAFTAR 37" tidak bermakna bagi pembaca. → Sisakan satu.
- 1440+390 · Sedang · Tidak ada peta atau gambar. Koordinat mentah "1.199, 104.095" ditampilkan, "Lihat di peta" berada di dasar halaman, dan `cerita-nongsa.webp` yang disebut pedoman tidak dipakai. → Pasang gambar dan peta kecil, buang koordinat.
- 1440+390 · Ringan · "Tokoh yang Berkaitan" memakai H2 besar untuk satu tautan berpoin. → Jadikan satu baris info.

## `/cerita/nama-jalan`
- 390 · Berat · Halaman 33.152 px: 46 tokoh satu kolom dan tabel 61 baris bertumpuk empat label. Tombol lompat dan saringan hanya di atas. → Buat baris ringkas dan saringan menempel.
- 1440+390 · Berat · Garis hubungan silsilah menembus teks ("latar 1722", "ayah-anak", "ibu-anak", "seperguruan", "ayah angkat"). → Beri latar pada label dan atur ulang garis.
- 1440+390 · Sedang · Keterangan awal menyebut kartu berbingkai putus-putus, padahal kartu tokoh hikayat tidak berbingkai. → Hapus kalimat itu.
- 1440+390 · Sedang · Kalimat kembar: "Tokoh nasional yang namanya dipakai…" 9 kali dan "Kecamatan per jalan belum dirinci…" 9 kali. → Satukan di kepala kelompok.
- 1440+390 · Sedang · Label "Belum terverifikasi" pada Sudirman, Kartini, Diponegoro, dan lainnya memberi kesan keliru, karena yang belum pasti adalah kaitan namanya. → Ubah label atau tempatkan di tabel nama tempat.
- 1440+390 · Sedang · Nama tokoh hanya 17 px, sama dengan isi, dan keterangannya berupa potongan bertitik koma. → Nama 23 px dan kalimat utuh.
- 1440+390 · Sedang · "Hubungan yang Sama dalam Teks" mengulang isi bagan sepanjang satu layar lebih. → Lipat.
- 1440 · Ringan · Bagan "Riau daratan" hampir menempel pada judul di bawahnya. → Beri jarak.
- 1440+390 · Sedang · Lima tautan tempat tidak punya halaman detail dan dialihkan ke pencarian direktori (`gedung-nong-isa`, `makam-zuriat-nong-isa`, `masjid-temenggung-abdul-jamal`, `bumi-perkemahan-raja-ali-kelana`; juga `gedung-lam-kota-batam` dari kalender). → Buat detailnya atau jangan jadikan tautan.

## `/cerita/kalender`
- 1440+390 · Berat · Daftar selalu mulai Januari. November baru di y=7.326 (desktop) dan y=12.168 (ponsel). → Mulai dari bulan berjalan.
- 1440+390 · Berat · "2 acara, bulan ini" berisi tanggal November 2025, padahal sekarang November 2026, dan statusnya tetap "Rutin". → Beri label "Edisi terakhir 2025, tanggal 2026 belum ada".
- 390 · Berat · Setelah menekan "Per bulan", kotak bulan dan hasilnya tetap di bawah layar sehingga tampak tidak terjadi apa-apa. → Ringkas pembuka dan gulir otomatis ke hasil.
- 1440+390 · Sedang · Keterangan empat status makan empat baris sebelum kontrol. → Ringkas menjadi satu baris atau keterangan lipat.
- 1440+390 · Sedang · Kartu memuat catatan sumber ("Menurut Kadisbudpar…", "Katalog Karisma… menulis…", "Tempo menulis…", "InfoPublik menulis…"). → Pindahkan atau hapus.
- 1440+390 · Ringan · Label "JANUARI" di tiap kartu mengulang H2 bulan. → Hapus.
- 1440 · Sedang · Bulan dengan 1—2 acara menyisakan kolom kosong besar (Mei, Juni), dan tinggi kartu tak seragam. → Pakai baris ringkas, bukan kartu tiga kolom.
- 1440+390 · Ringan · Kotak bulan berbingkai, termasuk "April 0 acara". → Buang bingkai dan sembunyikan yang kosong.

## `/cerita/kamus`
- 1440+390 · Sedang · Satu kata memakan 5—6 baris sehingga 65 kata menjadi 16.343 px dan 18.484 px; "Arti" dan "Contoh" diulang 65 kali. → Format ringkas: kata, arti, contoh di dua baris, keterangan di kanan.
- 1440+390 · Sedang · Contoh bercetak biru miring tampak seperti tautan, padahal bukan. → Pakai warna teks biasa.
- 1440+390 · Sedang · Tanda * muncul pada 37 dari 65 kata, dan dua baris keterangan asal saling mengulang. → Pakai satu keterangan singkat.
- 1440+390 · Sedang · Lompat huruf hanya di atas, tidak menempel. → Buat menempel.
- 1440 · Ringan · Kolom kanan sekitar 370 px kosong. → Manfaatkan untuk keterangan asal dan kelompok.
- 1440+390 · Ringan · Kolom cari 44 px tanpa placeholder dan didahului dua paragraf; pedoman meminta 58 px. → Pindahkan cari ke atas.
- 390 · Ringan · Entri pertama baru di y=1.159, huruf A—U di layar kedua. → Ringkas pembuka dan saringan.

## `/cerita/budaya`
- 1440+390 · Berat · 15 tradisi ditulis sebagai potongan kartu, padahal ini artikel budaya. → Tulis narasi singkat per tradisi, dengan foto bila ada.
- 1440+390 · Sedang · "TRADISI 01—15" di tiap kartu adalah sisa hiasan, dan ada garis antara judul dan isi. → Hapus.
- 1440+390 · Sedang · "WBTb" dipakai berulang dan butuh kalimat penjelas khusus. → Tulis lengkap sekali di tiap penyebutan pertama dan hapus catatannya.
- 1440 · Ringan · Tiga paragraf pembuka menunda daftar. → Pangkas.
- 1440 · Ringan · Kartu tiga kolom meninggalkan rongga di bawah kartu pendek. → Satu kolom teks 680 px atau baris.

## `/cerita/komunitas`
- 1440+390 · Sedang · Isi tipis ("Pembawa acara", "Lari", "Media") dan hanya dua yang punya kontak Instagram. → Tambah kegiatan dan cara bergabung, atau kurangi entri.
- 1440+390 · Sedang · "Belum Ada di Daftar" menyebut hal yang tidak ada dan "kirim usulan" berujung di halaman tanpa formulir. → Hapus atau sediakan kanal.
- 1440+390 · Ringan · Status "Tercatat" tidak berguna di daftar komunitas. → Hapus.
- 1440 · Ringan · H2 kartu 25 px bercampur H2 44 px, dan ada garis di tengah kartu. → Jadikan H3 dan buang garis.

## `/cerita/angka`
- 1440+390 · Berat · Tabel "Tenaga Kerja" kosong, hanya kepala kolom. → Isi atau sembunyikan.
- 1440 · Berat · Kolom Angka hanya 80 px sehingga "1.722.9/27" dan "1.394.4/59" patah di tengah angka. → Larang patah dan lebarkan kolom.
- 390 · Berat · Tabel bertumpuk "Indikator/Angka/Tahun" diulang tiap butir, total 26.443 px. → Baris dua kolom: nama di kiri, angka di kanan.
- 1440+390 · Sedang · Baris pertama tabel Penduduk adalah angka yang ditolak situs sendiri ("1,79 juta… Tidak kami pakai di grafik") dan berlabel "BPS". → Dahulukan angka terpakai; pindahkan atau hapus catatannya.
- 1440+390 · Sedang · "Tahun tidak disebut" 30 kali; ada catatan sumber seperti "dikutip Sekda… kepada Bisnis.com". → Kosongkan atau pakai tanda hubung, pindahkan kredit ke Kolofon.
- 1440 · Sedang · Lebar kolom berubah di tiap tabel (984/80/136, 485/370/345, 265/729/207). → Satu lebar kolom untuk semua tabel.
- 1440+390 · Sedang · 14 tabel berderet tanpa grafik di bawah kartu pembuka. Lima kartu pertama memakai H2 25 px. → Tambah daftar isi dan grafik, lipat rincian.
- 1440+390 · Ringan · "Linimasa Singkat" mengulang Garis Waktu. → Hapus.
- 1440 · Ringan · Kartu kelima sendirian dengan separuh baris kosong; angka besar memakai mono, bukan Newsreader; "3 angka, 1 kota" bukan angka. → Rapikan kisi dan huruf.

## `/info`
- 1440 · Berat · Ruang kosong sekitar 370 px di atas penanda. Hanya satu baris daftar terlihat di layar pertama. → Rata atas dan ringkas pembuka.
- 390 · Sedang · Ilustrasi mendorong "Nomor Darurat" ke tepi bawah layar pertama. → Kecilkan.
- 1440+390 · Sedang · Enam baris tanpa keterangan, dan nomor darurat tidak langsung tampak di halaman ini. → Tambah keterangan dan satu baris 112/110/113/115/119.
- 1440+390 · Sedang · Dua garis tegas bertumpuk di bawah "ISI BAGIAN INI". → Hapus satu.

## `/info/direktori`
- 1440+390 · Berat · Pencarian hanya cocok ke nama: "igd", "ambulans", "polisi", dan "sertifikat" memberi 0 hasil, dan "rumah sakit" hanya 8 dari RS yang ada (RS Camatha, Graha Hermine, dan lainnya luput). → Tambah kata kunci dan sinonim, serta cari juga di panduan.
- 1440+390 · Berat · Hasil kosong buntu: tak ada usulan atau tautan, dan kalimatnya menempel di atas garis. → Tampilkan tautan terkait (Urusan Tanah, Nomor Darurat, kategori).
- 1440 · Sedang · Setelah mencari, pembuka dan ilustrasi tetap ada dan hasil baru di y=615. → Ringkas kepala saat ada `q`.
- 1440+390 · Ringan · Jarak judul-keterangan kategori tidak seragam (baris 1 kalimat vs 2 kalimat). → Rata atas.
- 1440+390 · Ringan · "892 tempat" mono mengambang di kanan. → Letakkan di dekat kolom cari.
- 390 · Ringan · Placeholder terpotong ("…atau kecam"), dan tombol Cari tidak tampak. → Persingkat dan tampilkan ikon cari.
- 1440+390 · Ringan · Rumah sakit berstatus "Buka sekarang" di pencarian, tetapi "IGD 24 jam" di kategori. → Samakan.

## `/info/direktori/kesehatan`
- 1440+390 · Berat · RS terdekat tak bisa dicari: tidak ada urut jarak atau "Di sekitarku". Peta besar hanya berisi 1 titik ("Baru 1 dari 45"). → Tambah koordinat dan urut jarak; sembunyikan peta sampai datanya cukup.
- 390 · Berat · 20 pil dan peta mendorong baris pertama ke y=1.118. → Sederhanakan saringan dan pindahkan peta di bawah daftar atau jadikan tombol.
- 1440+390 · Berat · Saringan tumpang tindih: "Rumah sakit 8" tidak memuat "RS Tipe B/C/D" (RS Camatha dan lainnya tidak masuk). → Satu saringan "Rumah Sakit"; tipe jadi keterangan.
- 1440+390 · Sedang · "RS Badan Pengusahaan Batam" (pencarian) dan "RS BP Batam (RS Otorita)" (daftar) tampak dobel, keduanya di Sekupang. → Periksa dan gabungkan.
- 1440+390 · Sedang · Pil abu (Klinik, Apotek, dan lain-lain) tampak mati, padahal bisa diklik. "Kecamatan" dan "IGD 24 jam" ternyata keluar ke `/info/direktori`. → Bedakan pil kategori dan saringan, dan biarkan tetap di halaman.
- 1440+390 · Sedang · Daftar tidak memuat nomor telepon. → Tambah tombol telepon di baris.
- `/info/direktori/kesehatan/apotek` · 1440 · Sedang · "Belum ada tempat di kategori ini", lalu 15 nama OSM tanpa alamat atau tautan, ejaan mentah dan berulang ("Apotic Najmi", "Apotik Kimia Farma", "Kimia Farma"). H2 "Menurut OpenStreetMap" terasa teknis. → Sembunyikan sampai rapi, atau normalkan dan beri alamat.

## `/info/tempat/kes-rs-awal-bros`
- 1440+390 · Berat · Tidak ada nomor telepon dan 12 dari 12 RS di daftar awal juga tanpa `tel:`. → Isi nomor IGD sebagai tombol utama.
- 1440+390 · Berat · Tidak ada peta atau ilustrasi, padahal pedoman 4.6 memintanya; kolom kanan kosong. → Pasang peta kecil atau keterangan lokasi.
- 1440 · Ringan · H1 80 px patah menjadi dua baris karena kolom sempit, meski kanan kosong. → Lebarkan judul.
- 1440+390 · Ringan · "Tipe rumah sakit: A atau B" dan "Jam buka: IGD 24 jam" membingungkan. → Rapikan label dan datanya.

## `/info/kecamatan/batam-kota`
- 1440+390 · Sedang · "Ada 171 tempat tercatat" tetapi hanya 5 baris, tanpa peta, alamat, atau telepon. → Tambah peta dan kontak layanan utama.
- 1440+390 · Sedang · Lima H2 44 px masing-masing hanya berisi 1—2 baris, dengan separuh baris kosong. → Satu daftar dikelompokkan dengan judul kecil.
- 1440+390 · Ringan · Kelurahan hanya poin tanpa tautan; "Ada di peta" tebal tak berguna; "Lihat semua tempat" menempel pada lead. → Jadikan tautan dan rapikan.

## `/info/darurat`
- 390 · Berat · Nomor pos Damkar hanya 13 px dengan area sentuh 101×17 px, padahal ini halaman darurat. → Tombol telepon minimal 44 px.
- 390 · Sedang · Tabel bertumpuk empat label per pos, sekitar tiga layar. → Satu baris: nama, kecamatan, tombol telepon.
- 1440+390 · Sedang · Hanya Damkar dan pengaduan; tidak ada tautan ke RS/IGD, Polsek, atau kategori Darurat (29 tempat). → Tambah bagian atau tautan.
- 1440 · Sedang · Lima nomor di kisi 4 kolom sehingga 119 Ambulans terpisah sendirian. → Lima kolom.
- 1440+390 · Ringan · Kolom "Jam layanan" hampir seragam 24 jam, dan call center Damkar ditulis dua kali. → Hapus kolom dan duplikatnya.

## `/info/urusan-tanah`
- 1440+390 · Berat · Sertifikat tersembunyi di baris ketiga (y=858 dan y=1.339), bercampur 4—5 layanan, tanpa tautan ke BPN, jam, atau langkah. → Buat bagian "Mengurus Sertifikat" berisi narasi singkat dan tautan detail.
- 1440+390 · Sedang · Paragraf pembuka padat dengan banyak tebal. → Pecah dua kalimat pendek dan kurangi tebal.
- 390 · Sedang · Tabel bertumpuk panjang, dan baris BPHTB menampilkan label "Catatan" tanpa isi. → Baris ringkas, sembunyikan label kosong.
- 1440+390 · Ringan · Kalimat tak perlu ("Katalog B-CARE menyebut layanan…"); "Daftar PPAT" dan "Daftar Notaris dan PPAT" berdampingan; "Kantor PPAT Yulianti" nyasar di bagian MPP. → Pangkas dan pindahkan.

## `/info/bantuan-hukum`
- 390 · Berat · Baris Wirlisman rusak: nama satu kata per baris dan jam menimpa teks "PPAT". Posbakum juga menyempit. → Status jam pindah ke bawah nama, jangan sekolom.
- 1440 · Sedang · Teks jam panjang memecah nama menjadi 3 baris dan membuat rongga di baris sebelahnya. → Sama seperti di atas.
- 1440+390 · Sedang · Baris tanpa telepon, sebagian tanpa lokasi ("LBH Peduli dan Harapan Bangsa", "LBH"). → Tambah kontak atau kecamatan.
- 1440 · Ringan · "Se-Kepri" patah di ujung baris. → Pakai tanda hubung tak-patah.

## `/info/jasa-dokumen`
- 1440+390 · Sedang · Menyuruh memakai "direktori anggota IKPI" dan "direktori MAPPI" tanpa cara mencapainya; baris asosiasi tanpa kontak. → Beri kontak atau cara mencarinya.
- 1440+390 · Ringan · Judul "Biro Jasa STNK dan Paspor" diikuti "Direktori ini tidak memuat biro jasa". → Ganti judul menjadi "Mengurus STNK dan Paspor".
- 1440 · Sedang · Baris dua kolom menyisakan sel kosong dan judul 44 px untuk 2—3 baris. → Satu kolom atau judul lebih kecil.

## `/info/berita`
- 1440+390 · Sedang · Berjudul "Berita Batam" tetapi memuat berita Tanjungpinang, Bintan, dan Natuna. → Saring Batam atau ubah judul.
- 1440+390 · Ringan · Semua baris mengulang tanggal yang sama; di ponsel "WIB" patah sendirian. → Kelompokkan per hari, tampilkan jam saja.
- 1440+390 · Ringan · Kapitalisasi judul campur antarmedia. → Normalkan dengan `kaidahJudul`.

## `/main/kartu-pos`
- 1440+390 · Berat · Gambar bawaan "Peta laut" memakai garis koordinat, "1°00' U", bingkai ganda, dan kotak krem, semuanya gaya lama yang dilarang 4.1. → Ganti dengan grafis Riso.
- 390 · Sedang · Teks di pratinjau sangat kecil, hampir tak terbaca. → Besarkan teks di kanvas.
- 1440+390 · Ringan · Sekitar 60% kartu kosong dan tampak hambar. → Komposisi ulang.

## `/tentang`
- 1440+390 · Sedang · Tipis, tanpa kontak, pengelola, atau tanggal; "diperbarui secara berkala" terlalu umum. → Tambah kontak dan jadwal nyata.

## `/kolofon`
- 1440+390 · Berat · Stempel kompas/mawar angin "BATAM CITY HALL · BALAI WARGA" adalah sisa gaya lama yang dilarang 4.1. → Hapus.
- 1440+390 · Ringan · H2 44 px untuk isi satu baris, dan daftar Data berpoin. → Tabel dua kolom ringkas.

## `/koreksi`
- 1440+390 · Berat · "Formulir ini belum aktif" hanya 14 px abu; tidak ada kanal lain. Bahkan "Koreksi untuk: RS Awal Bros Batam" pun buntu. → Sediakan kanal sementara.
- 1440+390 · Ringan · "Yang Paling Membantu" dan "Cara data dihimpun…" tak perlu saat formulir mati. → Hapus untuk sementara.

## `/kontribusi`
- 1440+390 · Berat · Ketiga cara membantu berujung pada formulir mati; halaman hanya ditautkan dari `/cerita/komunitas`. → Sembunyikan atau buka satu kanal nyata.

## `/privasi`
- 1440+390 · Sedang · Hampir seluruhnya poin dan membahas fitur yang belum aktif (moderator, rekomendasi, foto lama). → Narasi singkat untuk yang berlaku sekarang.
- 1440+390 · Ringan · Menyebut "pilihan bahasa", padahal tidak terlihat pemilih bahasa. → Hapus.

## `/syarat`
- 1440+390 · Ringan · Daftar poin pendek dan kalimat umum di awal. → Narasi ringkas dan buang kalimat pertama.

## `/tidak-ada`
- 1440+390 · Ringan · Hanya dua tombol, tanpa tujuan umum (Nomor Darurat, Direktori, Makan). → Tambah 3—4 tautan.

## Alur
- `/` → nomor darurat · 1440 · Berat · "Nomor darurat" hanya berupa keterangan kartu di y=2.609; dua klik sampai nomornya. → Tampilkan 112 dan tautan darurat di layar pertama beranda.
- `/` → nomor darurat · 390 · Berat · Penyebutan di y=3.077; dari menu perlu buka Informasi Warga lalu gulir. → Sama seperti di atas.
- `/` → sertifikat tanah · 1440+390 · Berat · Beranda tak menyebut tanah; ikon cari hanya ke direktori dan "sertifikat tanah" memberi 0 hasil. "BPN" berhasil hanya kalau pengguna tahu singkatannya. → Pencarian seluruh situs dan sinonim.
- `/tukang` → servis AC · 1440+390 · Berat · Pil aktif tak terbaca, lalu kosong, tanpa jalan keluar. Satu-satunya hasil ada di direktori ("Samsung Service Center"), tidak ditautkan. → Tautkan ke kategori Jasa.
- `/cerita/kalender` → acara bulan ini · 1440+390 · Berat · Beranda tidak menawarkan acara, dan perlu menekan "Per bulan" agar November tampil, berisi tanggal 2025. → Tampilkan "Acara Bulan Ini" di atas kalender dan beranda.
- Direktori → RS → detail · 1440+390 · Berat · Tiga langkah berakhir tanpa telepon dan peta, hanya tautan Google Maps. → Telepon dan peta di detail.
- Menu ponsel · 390 · Sedang · Saat menu terbuka, halaman di belakangnya tetap bisa digulir (tidak ada kunci gulir; `scrollY` berubah ke 500). → Kunci gulir `body`.

## Temuan: Beranda sampai Makanan

Pemeriksaan dihentikan atas permintaan koordinator, jadi audit ini belum lengkap (lihat bagian akhir). Semua temuan berasal dari build lama di port 3100, ditangkap 5 November 2026 pukul 21.40—21.55 WIB. Cek ulang di build baru sebelum dikerjakan.

Format: alamat | lebar | tingkat | masalah | saran. "Keduanya" berarti 1440 dan 390.

## Beranda
- `/` | 1440 | Berat | Peta Tempat penuh gugus berangka (47, 54, 14, 10, 9). Ini keluhan pemilik. | Tampilkan titik satuan berikon kategori; gabungkan hanya pada zoom sangat jauh, tanpa angka.
- `/` | 390 | Berat | Gugus 71 dan 55 serta ikon menimpa label "Batam". | Sama dengan di atas; sembunyikan label kota saat tertimpa.
- `/` | keduanya | Sedang | Baris Hujan, Gelombang, Angin, dan Feri terakhir bukan tautan (dicek di DOM). | Tautkan ke `/cuaca/hujan`, `/cuaca/gelombang`, dan `/jalan/feri`.
- `/` | keduanya | Sedang | "Feri terakhir ke Singapura: Habis" tidak menyebut jam atau pelabuhannya. | Tampilkan jam terakhir dan pelabuhannya, lalu keberangkatan besok.
- `/` | keduanya | Sedang | "Peringatan gelombang: status belum dapat dimuat." tampil di layar pertama. | Perbaiki sumber datanya; bila gagal, beri tautan ke sumber resmi.
- `/` | keduanya | Sedang | Paragraf pembuka mengulang baris angka di bawahnya (0,8 m, angin 7 km/jam, keberangkatan habis). | Buang paragraf, atau isi dengan fakta yang belum ada di baris angka.
- `/` | keduanya | Sedang | Laut penuh arsiran titik biru, padahal keterangan berbunyi "Arsiran biru: kecamatan yang hujan" dan status hujan "Tidak ada". Di 1440 keterangan ada di bawah lipatan. | Ganti pola laut atau warna penanda hujan; letakkan keterangan di dalam bingkai peta.
- `/` | 1440 | Sedang | Panel Tempat terbuka menutup kira-kira 310 px sisi kiri peta dan menggulir sendiri (tinggi 513 px, isi 1064 px). | Tutup secara bawaan, atau pindahkan saringan ke atas peta.
- `/` | 1440 | Sedang | Roda tetikus di atas peta tidak menggulir halaman (scrollY tetap 1100 setelah 6 putaran; di luar peta bergulir normal). Peta setinggi 718 px sehingga pengguna tertahan. | Samakan dengan `/jalan/peta`: roda menggulir halaman, zoom butuh Ctrl.
- `/` | 1440 | Sedang | Panel menulis Makan 120, sedangkan `/makan` dan menu ponsel menulis 117 tempat. | Pakai satu sumber hitungan.
- `/` | 1440 | Sedang | Kategori belum Title Case ("Makanan laut dan gonggong", "Mi, bakso, dan sup", "Nasi dan lauk") dan pembagiannya berbeda dari 17 hidangan di Makan. | Pakai `kaidahJudul` dan satu daftar kategori.
- `/` | 390 | Sedang | Angka baru muncul di bawah Peta Hari Ini (Hujan y≈964, Feri y=1129). | Letakkan angka sebelum peta.
- `/` | 390 | Sedang | Sepertiga atas Peta Tempat hanya laut dan label Singapura, sementara titik Batam berdesakan di bawah. | Paskan tampilan awal ke Pulau Batam.
- `/` | 390 | Sedang | Kotak koreksi sempit, kalimatnya pecah kira-kira 6 baris dan judulnya 4 baris. | Buat selebar layar di bawah daftar bagian.
- `/` | 1440 | Ringan | "Sebanyak 220 tempat sudah punya titik lokasi; sisanya sedang dilengkapi." dan keterangan "Ilustrasi: rumah panggung..." tidak perlu. | Hapus.
- `/` | 1440 | Ringan | Label kampung tertimpa penanda (Tanjung Bemban, Nongsa Pantai, Tiangwangkang). | Atur prioritas label atau sembunyikan saat bertabrakan.
- `/` | 1440 | Ringan | H1 terukur 52 px; pedoman 58 px. | Samakan.
- `/` | 390 | Ringan | Tanggal dan "Diperbarui pukul 21.40 WIB" masing-masing pecah dua baris. | Singkatkan atau susun satu kolom.
- `/` | 390 | Ringan | Titik bandara di Peta Hari Ini tanpa label. | Tambah label atau hapus titiknya.

## Cuaca
- `/cuaca` | 1440 | Sedang | Ruang kosong kira-kira 190 px di atas penanda karena kolom kiri dipusatkan terhadap ilustrasi. | Ratakan ke atas.
- `/cuaca` | 1440 | Sedang | Judul Radar Hujan baru di y≈1079 karena ilustrasi setinggi kira-kira 370 px, jadi isi utama di bawah lipatan. | Perkecil ilustrasi atau pakai baris daftar.
- `/cuaca` | 1440 | Ringan | Garis entri CCTV (y≈157) tidak sejajar dengan dua entri lain (y≈184). | Samakan tinggi blok keterangan.
- `/cuaca` | 1440 | Ringan | Lima entri memakai dua gaya, dan penanda hanya menyebut tiga isi. | Satukan gaya; tambah Peringatan dan Gempa.
- `/cuaca` | keduanya | Ringan | "Data untuk Batam dan perairan sekitarnya diperbarui otomatis." dan "28 titik kamera" (mengulang "Kamera di 28 titik") tidak menambah informasi. | Hapus.
- `/cuaca` | 390 | Sedang | Ilustrasi besar memisahkan ringkasan dan isi; ISI BAGIAN INI baru di y≈945. | Sembunyikan atau perkecil ilustrasi di ponsel.
- `/cuaca/hujan`, `/cuaca/gelombang`, `/cuaca/cctv` | 1440 | Berat | Peta menempel tepi kanan layar (x=560..1440), padahal wadah berakhir di x=1320. Ini keluhan pemilik. | Batasi ke wadah dengan bingkai seperti `/makan/kawasan/bengkong` (x=838..1319).
- `/cuaca/hujan` | 1440 | Berat | Tombol Putar di y=962, di bawah lipatan 900 px; Bagikan juga terpotong. | Letakkan kontrol waktu di dalam area peta yang terlihat; pendekkan panel kiri.
- `/cuaca/hujan` | 390 | Berat | Tombol Putar tersembunyi sampai panel dibuka; panel terbuka menyisakan peta y=74..213 dan tetap terbuka setelah Putar. | Letakkan Putar di lembar tertutup; tutup panel saat animasi jalan.
- `/cuaca/hujan` | 1440 | Sedang | Roda tetikus di atas peta diserap peta (5 dari 5 kejadian), halaman tidak bergulir, padahal data ada di bawah peta. | Aktifkan `cooperativeGestures`.
- `/cuaca/hujan` | keduanya | Sedang | Tabel menulis angin "4 km/jam dari timur" (diukur di Singapura), sedangkan ringkasan situs "7 km/jam dari timur laut". | Tampilkan satu angka untuk Batam, atau pisahkan jelas sebagai data Singapura.
- `/cuaca/hujan` | keduanya | Ringan | "Berawan, Southern Islands" memakai nama wilayah Inggris; "12 kecamatan ." ada spasi sebelum titik. | Terjemahkan dan rapikan.
- `/cuaca/hujan` | keduanya | Ringan | Bintik biru tersebar di peta saat teks menyebut belum ada hujan; catatan penjelasnya hanya ada di panel kiri (tertutup di ponsel). | Saring bercak diam, atau pindahkan catatan ke peta.
- `/cuaca/hujan` | 390 | Ringan | Label "Singapura" tampil dua kali bertumpuk. | Hapus salah satu.
- `/cuaca/gelombang` | keduanya | Sedang | Tabel menulis "Cuaca: Hujan ringan" dan "Peringatan: Status belum dapat dimuat", sedangkan ringkasan cuaca menyebut belum ada hujan. | Beri sumber dan waktu pada baris itu, atau hapus.
- `/cuaca/gelombang` | keduanya | Sedang | Laut satu warna biru yang tampak sama dengan ujung 0 pada legenda, padahal teks menyebut 0,8 m. Di 390 legenda tidak terlihat saat panel tertutup. | Periksa pemetaan warna; tampilkan legenda ringkas di atas peta.
- `/cuaca/gelombang` | 1440 | Ringan | Ringkasan memecah "0,8 / m" ke dua baris; ada singkatan "Kam 21.00" dan "Rab 4 Nov". | Pakai spasi tak terputus dan tanggal utuh.
- `/cuaca/cctv` | 1440 | Berat | Kaki halaman selesai di y=1313 tetapi halaman setinggi 2564 px, jadi ada kira-kira 1250 px kosong di bawah kaki. Isi `.cu-isi` meluap keluar panel. | Batasi tinggi isi atau pakai `overflow` pada wadah yang tepat.
- `/cuaca/cctv` | keduanya | Berat | Gugus berangka (5, 3, 2 di 1440; 8, 8, 2 di 390) menyembunyikan kamera dan menimpa label Batam. Ini keluhan pemilik. | Tampilkan semua 28 kamera sebagai titik.
- `/cuaca/cctv` | 1440 | Sedang | Daftar kamera menggulir sendiri di dalam panel (879 px, isi 2412 px). | Pindahkan daftar ke bawah peta atau jadikan satu aliran halaman.
- `/cuaca/hujan`, `/cuaca/gelombang`, `/cuaca/cctv` | keduanya | Sedang | Baris tab tidak memuat Peringatan dan Gempa (tidak ada tautan ke keduanya dari `/cuaca/hujan`). | Tambah dua tab itu.
- `/cuaca/*` | 1440 | Ringan | Tab memakai "Radar hujan", sedangkan H1 "Radar Hujan" dan tab Makan Title Case; tautan "Cuaca dan Laut" di kanan tab tidak jelas fungsinya. | Samakan penulisan; ganti dengan remah roti.
- `/cuaca/*` | 390 | Ringan | Pegangan panel hanya 28 px; pedoman 44 px. | Perbesar area sentuh.
- `/cuaca/peringatan` | 1440 | Sedang | Tidak ada waktu data, jadi "Tidak ada peringatan" tidak bisa dinilai kebaruannya. | Tampilkan "Diperiksa pukul ...".
- `/cuaca/peringatan` | keduanya | Sedang | Tidak ada tab aktif di halaman ini, sehingga posisi pengguna tidak jelas. | Tambah tab aktif.
- `/cuaca/peringatan` | 1440 | Sedang | Dua H2 44 px masing-masing hanya berisi satu kalimat dan rapat ke paragraf (kira-kira 25 px). | Gabungkan jadi satu status; beri jarak sesuai pedoman.
- `/cuaca/peringatan` | keduanya | Ringan | "Peringatan untuk Batam tampil paling atas, disusul Kepulauan Riau lainnya." hanya menjelaskan tata letak. | Hapus.
- `/cuaca/gempa` | 1440 | Sedang | "GEMPA TERBARU" adalah H2 25 px sans kapital, berbeda dari H2 lain (44 px Newsreader). | Jadikan penanda biasa atau samakan.
- `/cuaca/gempa` | keduanya | Sedang | Tinggi 11513 px di 390. Daftar panjang tanpa batas, dengan label mono dan sans bercampur. | Tampilkan 10 terbaru plus tombol "Lihat lagi"; satu gaya label.
- `/cuaca/gempa` | keduanya | Sedang | "Gempa ini dirasakan untuk diteruskan pada masyarakat" adalah teks mentah sumber dan tidak jelas. | Ganti dengan kalimat ringkas tanpa mengubah fakta.
- `/cuaca/gempa` | keduanya | Ringan | "Pusat gempa berada di" berulang di tiap baris padahal kolomnya sudah berjudul Pusat Gempa; "BaratLaut" dan "Timur Laut" tidak seragam. | Buang awalan; normalkan arah.
- `/cuaca/gempa` | keduanya | Ringan | Jam ditulis "14:56:34" dan bulan "Nov", berbeda dari format situs (21.40 WIB). | Pakai format pedoman.
- `/cuaca/gempa` | keduanya | Ringan | Paragraf "Batam relatif jarang terdampak, tetapi banyak warganya punya keluarga..." tidak perlu. | Singkatkan.
- `/cuaca/gempa`, `/cuaca/peringatan` | 390 | Ringan | Tab meluap (lebar 358 px, isi 500 px) dan terpotong "CCTV lalu lint". | Perpendek atau beri penanda gulir.

## Transportasi
- `/jalan` | 1440 | Sedang | Ruang kosong kira-kira 340 px di atas penanda. | Ratakan ke atas.
- `/jalan` | keduanya | Sedang | Feri Terakhir baru di y=1367 (1440) dan lebih jauh di 390. | Letakkan sebelum daftar isi.
- `/jalan` | keduanya | Sedang | Tabel kira-kira 26 baris urut per rute, dan pada pukul 21.45 hampir semua "Sudah lewat". | Kelompokkan per tujuan; urutkan yang masih tersedia di atas; tampilkan keberangkatan berikutnya.
- `/jalan` | keduanya | Berat | Baris Gold Coast berisi "Lihat jadwal lengkap" yang bukan tautan (SPAN) dan menempel titik merah "Terganggu". | Jadikan tautan dan beri jarak.
- `/jalan` | keduanya | Sedang | Catatan "Jadwal per ... Tanyakan kepada operator." berulang di banyak baris; "Contoh Jumat, 9 Oktober 2026. KMP Trisakti Adinda." tidak jelas. | Satu catatan di bawah tabel, tanggal di kolom kecil; tulis ulang contoh.
- `/jalan` | 1440 | Ringan | Sel Operator kosong di tiga baris; garis ganda di bawah ISI BAGIAN INI; tabel berisi data yang sama dengan awal `/jalan/feri`. | Tulis "Belum tercatat"; hapus satu garis; pertimbangkan ringkasan saja.
- `/jalan/trans-batam` | keduanya | Sedang | H2 rapat ke pil (kira-kira 25 px) dan ke legenda (kira-kira 20 px), jauh di bawah jarak pedoman. | Terapkan jarak antarbagian yang sama.
- `/jalan/trans-batam` | keduanya | Sedang | H2 44 px "Posisi Bus" hanya berisi satu kalimat. | Jadikan catatan di bawah diagram.
- `/jalan/trans-batam` | 390 | Sedang | Legenda dan Semua Koridor mengulang K1—K10 berurutan; label diagram sangat kecil. | Gabungkan keduanya; beri opsi perbesar diagram.
- `/jalan/trans-batam` | keduanya | Ringan | H3 "LEGENDA" 12 px sans, H3 lain 25 px Newsreader. | Jadikan penanda, bukan H3.
- `/jalan/trans-batam` | keduanya | Ringan | Harga mono muncul di tengah kalimat ("Rp5.000 umum"); ejaan "Batam Center" dan "Batam Centre" bercampur. | Pakai huruf isi dan satu ejaan.
- `/jalan/trans-batam/k1` | keduanya | Sedang | Data transit tampil tiga kali: daftar halte ("Transit ke K3" berulang), Titik Transit, dan tabel Halte. | Pertahankan daftar halte plus tabel ringkas.
- `/jalan/trans-batam/k1` | 1440 | Sedang | Penanda warna duduk sebaris dengan H1 dan judul pecah sehingga "Centre" sendirian. | Pindahkan penanda warna ke penanda atas; perkecil judul.
- `/jalan/trans-batam/k1` | keduanya | Ringan | Pasangan label dan nilai tanpa garis; label "Jam operasi", "Selang keberangkatan", dan "Cara bayar" belum Title Case; tarif mono bercampur sans. | Terapkan tabel informasi pedoman.
- `/jalan/peta` | 1440 | Berat | Peta selebar layar (x=0..1440), sedangkan isi halaman di x=120..1320. Ini keluhan pemilik. | Batasi ke wadah.
- `/jalan/peta` | 1440 | Berat | Peta mulai y=414 dengan tinggi 683 px, jadi tombol + (y≈975) dan − (y≈1050) di bawah lipatan. | Pendekkan kepala halaman; letakkan tombol di kanan atas.
- `/jalan/peta` | 1440 | Sedang | Batam hanya kira-kira seperempat lebar peta, separuh kanan berisi Bintan. | Paskan tampilan awal ke Pulau Batam.
- `/jalan/peta` | keduanya | Sedang | Ikon Harbour Bay dan Sekupang bertumpuk; label "Tanjung Uban" dan "Tanjungpinang" tertimpa garis feri. | Geser ikon berdekatan; atur urutan lapisan.
- `/jalan/peta` | keduanya | Sedang | Daftar "Belum Ada di Peta" (14 baris) dan "Tentang Garis di Peta" tidak membantu pengguna. | Hapus, atau ringkas jadi satu catatan.
- `/jalan/peta` | keduanya | Ringan | Kotak centang 13×13 px; Lapisan peta di x=16, tidak sejajar wadah; teks "Lokasi perkiraan." menyambung dengan catatan panjang. | Perbesar area sentuh, sejajarkan, pisahkan teks.
- `/jalan/peta` | 390 | Ringan | Tombol zoom kotak hitam besar, berbeda gaya dari peta lain. | Satukan gaya.
- `/jalan/peta` | 1440 gelap | Ringan | Halo label peta tampak kabur ("Harbour Bay", "Transferpoint Sekupang"). | Perhalus halo untuk tema gelap.
- `/jalan/feri` | keduanya | Berat | Tinggi 13860 px (1440) dan 26348 px (390), dengan navigasi lompat hanya di puncak. Rute jam pertama baru sesudah y=3636. | Saringan asal dan tujuan yang menempel; rute dilipat secara bawaan.
- `/jalan/feri` | 390 | Berat | "Waktu setempat di pelabuhan asal" pecah satu kata per baris, dan catatan rute menempel garis tabel. | Perbaiki lebar elemen dan beri jarak.
- `/jalan/feri` | keduanya | Sedang | Arah dalam satu rute berselang-seling tanpa urutan (Batam ke HarbourFront, balik, lalu Batam lagi). | Kelompokkan per arah, lalu per operator.
- `/jalan/feri` | 1440 | Sedang | "WIB" dan "waktu Singapura" jatuh ke baris baru sendirian; kolom antartabel tidak sejajar. | Tulis zona waktu di kepala kolom; tetapkan lebar kolom.
- `/jalan/feri` | keduanya | Sedang | Rute tanpa data tampil sebagai blok penuh ("Layanan ada, jamnya belum tercatat." lalu "Jadwal belum tersedia."). | Satukan dalam satu daftar pendek di akhir.
- `/jalan/feri` | keduanya | Ringan | "Waktu setempat di pelabuhan asal" berulang tiap rute; penanda INTERNASIONAL dan DOMESTIK berulang di bawah H2 yang sama. | Tulis sekali saja.
- `/jalan/feri` | 390 | Ringan | Label "Lama perjalanan" mono tebal, sedangkan "Jam berangkat" sans. | Samakan.
- `/jalan/feri` | keduanya | Ringan | Paragraf pembuka hanya membahas zona waktu; dua baris pil tampak sama padahal fungsinya berbeda. | Tulis isi halaman; bedakan navigasi halaman dari lompatan.
- `/jalan/feri/panduan` | 1440 | Sedang | Kolom 680 px, separuh kanan kosong sepanjang halaman 3611 px, tanpa daftar isi. | Tambah daftar isi menempel di kanan.
- `/jalan/feri/panduan` | keduanya | Sedang | Jam feri pulang ditulis sebagai paragraf padat. | Ubah jadi tabel kecil atau tautkan ke jadwal.
- `/jalan/pompong` | keduanya | Sedang | "Belum tercatat" muncul lebih dari 15 kali, termasuk di kolom Dari; tarif tahun 2014 dan 2016 sejajar dengan data baru. | Kosongkan dengan tanda hubung; beri penanda data lama; pisahkan rute yang lengkap.
- `/jalan/pompong` | keduanya | Sedang | Tombol "Kirim koreksi" berada sebelum isi utama. | Pindahkan ke akhir halaman.
- `/jalan/pompong` | 390 | Sedang | Tinggi 5155 px; tiap rute jadi lima baris bertumpuk. | Ringkas ke tujuan, tarif, dan waktu.
- `/jalan/pompong` | 1440 | Ringan | Tarif dan Lama perjalanan mono, Jadwal sans; H2 rapat; label belum Title Case. | Satukan gaya dan jarak.

## Makan
- `/makan/*` | 390 | Berat | Tata letak melebar ke 528—619 px di layar 390 px, tinggi tata letak menjadi 1143—1340 px. Sebab terukur: `span.mk-sr` absolut lolos dari `.mk-nav-dalam`. Akibatnya bilah bawah dan panel Saring meleset. | Tambah `position: relative` pada `.mk-nav-dalam`. Uji di peramban saja: lebar kembali 390 px dan bilah pindah ke x=97..293, y=786..830.
- `/makan/peta`, `/makan/hidangan/sup-ikan`, `/makan/kawasan/bengkong`, `/makan/panduan/sarapan`, `/makan/dekat-feri` | 390 | Berat | Bilah Daftar/Peta di x=211..408 dan terpotong. Di `/makan/peta` letaknya y=1282, di luar layar 844 px, sehingga peta tidak bisa dicapai. Panel Saring juga hanya terlihat sisi kanannya. | Perbaikan yang sama, lalu uji ulang.
- `/makan/*` | 390 | Sedang | Tab Peta, Simpanan, mata uang, dan bahasa tersembunyi tanpa tanda (lebar 390 px, isi 831 px); tab aktif terpotong jadi "D" di `/makan/dekat-feri`. | Gulir tab aktif ke tengah; beri pudar di tepi; pindahkan mata uang dan bahasa.
- `/makan/*` daftar | 1440 | Sedang | Saringan terpotong tanpa tanda ("Lewat 2", "Di bawah R"). | Biarkan turun baris, atau masukkan ke panel Saring.
- `/makan/*` daftar | 390 | Sedang | Teks menu terpotong sangat pendek ("Mi tarempa…", "Martabak kambing,…"). | Izinkan dua baris.
- `/makan/*` daftar | keduanya | Ringan | Baris tanpa jam tidak punya status sehingga tinggi tidak seragam; hidangan yang sama memakai ilustrasi sama berulang. | Tulis "Jam belum tercatat"; perkecil ilustrasi atau hapus di daftar satu hidangan.
- `/makan` | 1440 | Sedang | Ruang kosong kira-kira 210 px di atas blok judul; penanda mono menempel H1. | Ratakan ke atas dan beri jarak.
- `/makan` | keduanya | Sedang | "Tidak ada yang membayar untuk masuk daftar ini." mengisi posisi paragraf pembuka, dan kalimat serupa muncul lagi di bawah. | Ganti dengan isi yang berguna; sekali saja di Cara Kami Memilih.
- `/makan` | 1440 | Sedang | Peta statis Kawasan hanya bercak merah yang menghitam saat bertumpuk, tanpa nama kawasan, dan ada ruang kosong di bawahnya. | Beri nama kawasan dan jumlah pada peta; tautkan ke halamannya.
- `/makan` | 1440 | Sedang | Kolom kiri Sebelum Feri Pulang kosong kira-kira 250 px; kolom Jarang Diketahui menyisakan kira-kira 290 px. | Seimbangkan kolom atau tambah isi.
- `/makan` | 1440 | Ringan | H1 112 px, halaman Makan lain 80 px; "Di bawah Rp50 ribu" sendirian di baris kedua; "km." sendirian di baris baru; angka hidangan tanpa satuan; sel "Semua Tempat" kosong. | Samakan H1; rapikan baris; tulis "11 tempat".
- `/makan` | 1440 | Ringan | Label "Legendaris" dan "Jarang diketahui" berulang di tiap baris pada bagian berjudul sama. | Sembunyikan di bagian itu.
- `/makan` | keduanya gelap | Sedang | Alas ilustrasi putih murni #FFFFFF (terukur), pedoman #F6F4EF; terang mencolok di tema gelap. | Pakai token alas.
- `/makan` | 1440 EN | Ringan | Alamat tetap `/makan` saat bahasa Inggris, dan "Seafood and gonggong" tidak Title Case. | Bahasa di alamat; terapkan kaidah judul.
- `/makan/hidangan` | 1440 | Ringan | H1 mepet label kelompok pertama. | Beri jarak.
- `/makan/hidangan/sup-ikan` | keduanya | Sedang | Chip bernilai 0 (Buka sekarang, Halal, Lewat 22.00) tampak mati dengan garis putus-putus. | Sembunyikan chip bernilai 0.
- `/makan/hidangan/sup-ikan` | 1440 | Berat | Lima tempat tetap digabung jadi gugus "3". Ini keluhan pemilik. | Tampilkan semua titik pada daftar pendek.
- `/makan/kawasan` | 1440 | Sedang | Gambar peta tidak bisa diklik; bercak tanpa nama kawasan, dan daftar di sebelahnya tidak terhubung dengan peta. | Tautkan bercak ke kawasan; sorot saat baris disorot.
- `/makan/kawasan/bengkong` | 1440 | Sedang | Peta 874 px mulai y=440, jadi hanya kira-kira 460 px terlihat dan titik (2, 6) terpotong di tepi bawah. | Tinggi peta sebatas sisa layar; paskan ke titik.
- `/makan/kawasan/bengkong` | 1440 | Sedang | Roda tetikus diserap peta (5 dari 5), halaman tidak bergulir saat kursor di atas peta. Sama di `/makan/peta`. | Aktifkan `cooperativeGestures`.
- `/makan/kawasan/bengkong` | keduanya | Ringan | Paragraf hanya deretan kategori, dan "Dim Sum" miring setengah. | Tulis satu kalimat ciri kawasan.
- `/makan/panduan/halal-nagoya` | keduanya | Berat | Nomor 5, 4, dan 2 bertumpuk tak terbaca. Di 1440 titik 3 ada di luar pandangan awal. | Geser nomor dan paskan peta ke semua titik.
- `/makan/panduan/halal-nagoya` | 390 | Sedang | Ilustrasi mendahului remah roti dan judul. Sama di `/makan/dekat-feri`. | Letakkan judul dulu.
- `/makan/panduan/sarapan` | 1440 | Sedang | Peta mulai y=445 dan bagian atasnya kosong, sedangkan titik berada di bawah lipatan. | Paskan peta ke titik.
- `/makan/panduan/sarapan` | 1440 | Ringan | Angka 29 ditulis tiga kali, dan saringan "Sarapan 29" tampil di panduan Sarapan. | Sembunyikan saringan yang sama dengan isi halaman.
- `/makan/dekat-feri` | keduanya | Sedang | H1 "Sebelum Feri Pulang" berbeda dari tab dan remah "Dekat Feri". | Pakai satu nama.
- `/makan/dekat-feri` | 1440 | Berat | Peta hanya menampilkan satu gugus "4" untuk 47 tempat. | Paskan peta ke semua tempat atau radius terminal.
- `/makan/dekat-feri` | 390 | Sedang | Daftar pertama di bawah lipatan; kolom cari di y≈725; Nongsapura turun baris. | Hilangkan ilustrasi; tab sebaris yang bisa digulir.
- `/makan/peta` | 1440 | Berat | Peta menempel tepi kanan (x=681..1440). Ini keluhan pemilik. | Batasi ke wadah (x≤1320).
- `/makan/peta` | 1440 | Berat | Gugus 39 dan 36; klik hanya memecah jadi gugus baru (37, 28, 12), jadi nama tempat tetap tidak terlihat. | Tampilkan titik satuan dan sorot baris daftar.
- `/makan/peta` | 390 | Berat | Layar pertama tanpa peta padahal halaman bernama Peta. | Tampilkan peta sebagai bawaan di alamat ini.
- `/makan/peta` | 1440 | Sedang | Tinggi 16718 px karena semua 117 baris dimuat. | Pakai pemuatan bertahap.
- `/makan/tempat/golden-prawn-933` | 1440 | Sedang | Tombol Petunjuk Arah di y≈1090 dan jam buka di y≈950, keduanya di bawah galeri. | Letakkan tombol, jam, dan alamat sebelum galeri.
- `/makan/tempat/golden-prawn-933` | keduanya | Sedang | Blok feri memuat "Contoh 3 November 2026." dan catatan "Nirup Island, Pasir Gudang...: jadwal belum tersedia." yang tidak terkait tempat ini. | Tampilkan jam terakhir dari terminal terdekat saja.
- `/makan/tempat/golden-prawn-933` | 1440 | Ringan | H2 feri menyisakan "Ini" sendirian; kategori ditulis dua kali (remah dan penanda); kolom kanan kosong kira-kira 250 px; label tabel belum Title Case. | Perpendek judul; buang satu kategori; rapikan kolom.
- `/makan/tempat/golden-prawn-933` | 390 | Ringan | Remah roti pecah dua baris; tombol Bagikan turun baris. | Singkatkan remah; ikon saja untuk Bagikan.
- `/makan/tempat/golden-prawn-933` | 1440 gelap | Ringan | Garis X pada bingkai foto kontras tinggi dan mencolok. | Redupkan garisnya (bingkainya sendiri diizinkan pemilik).
- `/makan/simpanan` | keduanya | Sedang | Bagian "Pindah Perangkat" tampil saat simpanan kosong, tanpa penjelasan cara mendapat tautan, dan tombol Tambahkan mati. | Sembunyikan saat kosong; beri satu kalimat penjelasan.
- `/makan/simpanan` | 1440 | Ringan | Paruh kanan kosong. | Tampilkan saran tempat, atau biarkan satu kolom lebih pendek.
- `/makan/cara-memilih` | 1440 | Ringan | Sel "Tidak Berbayar" menyisakan kira-kira 110 px kosong karena sejajar dengan Arti Label. | Susun ulang isi agar tinggi seimbang.

## Alur Nyata
- `/` ke tempat buka sekarang | keduanya | Sedang | Butuh tiga langkah: buka Makan, pilih "Buka sekarang" yang memindahkan ke `/makan/peta?buka=1`, lalu klik baris. Layar pertama beranda tidak punya jalan pintas. | Tambah tautan "Makan yang buka sekarang" di beranda.
- `/` ke tempat buka sekarang | 390 | Berat | Di `/makan/peta?buka=1` tombol Peta tidak terlihat dan tata letak melebar. | Perbaikan `.mk-nav-dalam`.
- `/` ke feri terakhir | keduanya | Sedang | Baris feri di beranda buntu karena bukan tautan. Lewat Transportasi harus menggulir ke y=1367 lalu memindai sekitar 26 baris. | Tautkan baris ke `/jalan/feri#terakhir`; ringkas per tujuan.
- `/` ke radar hujan | keduanya | Sedang | Baris Hujan buntu. Jalur nyata: "Buka Cuaca dan Laut", lalu entri radar yang judulnya di bawah lipatan, lalu Putar yang juga tersembunyi. | Tautan langsung dari baris Hujan; Putar terlihat.
- ikon cari di `/` | 1440 | Berat | Ikon memindahkan ke `/info/direktori`. "feri terakhir" dan "radar" menghasilkan 0 tempat, jadi pencarian tidak menemukan fitur situs. | Buat pencarian seluruh situs, atau ubah labelnya jadi cari tempat.
- ikon cari di `/` | 1440 | Ringan | Teks "Tidak ada hasil" menempel garis tegas, dan ada ruang kosong kira-kira 130 px di atasnya. | Rapikan jarak; beri saran tautan.
- menu ponsel di `/` | 390 | Sedang | Tombol Escape tidak menutup menu (layar tetap terbuka pada screenshot sesudahnya). | Tambah penanganan Escape.
- menu ponsel di `/` | 390 | Sedang | Saat terbuka, nama situs, ikon cari, dan ikon tema hilang. | Pertahankan kepala halaman atau masukkan cari ke menu.

## Belum Sempat Diperiksa
- **Sebagian saja:**
  - `/jalan/feri`: 1440 ikhtisar kecil plus potongan 1, 3, 5; 390 lembar 1 dan 3 dari 7.
  - `/makan/peta`: layar pertama saja.
  - `/makan/dekat-feri`: layar pertama saja.
  - `/makan/panduan/sarapan`: 1440 layar pertama, 390 lembar 1 dari 2.
  - `/cuaca/gempa`: 1440 potongan 1 dan 4, 390 lembar 1 dari 3.
  - `/jalan/trans-batam/k1`: 1440 potongan 1, 2, 4, 390 lembar 1 dari 2.
  - `/jalan/trans-batam`: 1440 potongan 1—3 dari 4, 390 lembar 1 dari 2.
  - `/jalan/feri/panduan`: 1440 potongan 1—2 dari 4, 390 lembar 1 dari 2.
  - `/jalan/pompong`: 1440 potongan 1—2 dari 3, 390 lembar 1 dari 2.
  - `/makan`: 390 lembar 1—2 dari 3.
  - `/makan/hidangan`: 1440 potongan 1 dari 2.
  - `/makan/panduan`: 1440 potongan 1 dari 2.
- **Tema gelap belum dilihat:** 390 untuk `/cuaca`, `/jalan/feri`, `/jalan/peta`, `/makan`, `/makan/peta`, dan detail tempat. `/jalan/feri` 1440 gelap hanya potongan 1.
- **Lebar 360 px:** tidak diuji, padahal pedoman memintanya.
- **Tidak dilaporkan karena catatannya tidak tersimpan:** simpanan terisi, klik gugus di beranda, pencarian "golden", dan menu Tempat di ponsel. Gambarnya ada, tetapi perlu dilihat ulang.
- **Sengaja tidak dilaporkan:** bidang peta kosong pada screenshot seluruh halaman 390 (`/cuaca/gelombang`, `/cuaca/cctv`), karena tampaknya artefak tangkapan; peta tampil normal di layar pertama.
- **Bergantung jam:** semua status "Sudah lewat" dan jumlah "Buka sekarang" terikat waktu tangkap malam hari.

Pemeriksaan otomatis tidak mendeteksi gambar rusak atau galat konsol di halaman yang dicakup. Tidak ada berkas repo yang diubah, tidak ada build, dan server tetap menyala.

Bahan ada di folder `C:\Users\user\AppData\Local\Temp\claude\e68c5d42f708b782\24d8a384-19c3-41dc-869b-3dd239c34205\scratchpad\audit-a\`:
- `gbr\metrik.json`
- `gbr\`, `pot\`, `pot2\`
- `alur\`, `alur2\`, `alur3\`
