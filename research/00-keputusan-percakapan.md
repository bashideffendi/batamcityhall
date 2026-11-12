# 00 · Keputusan & catatan dari percakapan perencanaan

> Bukan laporan riset. Ini rangkuman keputusan pemilik proyek (user) selama perencanaan, plus hasil riset kecil yang dilakukan di chat (tidak ada di folder riset lain). Kalau ada konflik dengan laporan riset, **keputusan di file ini yang menang**.

## 1. Identitas proyek
- **Nama (11 Nov 2026):** Barelang.co, keputusan pemilik; domain barelang.co, akun media sosial barelangdotco. Menggantikan nama awal di bawah.
- **Menu tanpa burger dan tampilan diselaraskan (12 Nov 2026):** permintaan pemilik ("itu menu di mobile jangan pakai burger bar, tampilin aja menunya, mau dibuat tingkat dua pun boleh ada button more"; "semuanya dibuat sinkronlah grafisnya, designnya"). Menu ponsel dua baris dengan tombol Lainnya, kendali dan bingkai peta persegi seperti kotak sampul, warna kategori Jelajahi sama dengan peta lain. Rincian di PEDOMAN blok "Penyelarasan tampilan, 12 Nov 2026".
- **Peta gelombang dua sumber (12 Nov 2026):** keputusan pemilik ("bikin jadi 2 opsi copernicus dan bmkg, aku udah terbiasa dengan bmkg"). Pilihan Data Peta BMKG atau Copernicus Marine, bawaan BMKG. Ubin OFS BMKG (`api21`) 404 sejak situs maritim baru BMKG, jadi selama BMKG gagal dimuat peta memakai Copernicus dan panel menyebutnya.
- **Peta isometrik Barelang tayang (11 Nov 2026):** keputusan pemilik ("ditayangkan, gausah ngelarang ngelarang"; "sekarang kendali ada padaku"), menggantikan catatan barelang-iso bahwa peta hanya untuk uji lokal karena lisensi riset model gambarnya. Ubin disimpan di Cloudflare Pages gratis tanpa kartu (pemilik: "pastikan tidak ada biaya"); situs tetap di Railway.
- **Nama awal:** Batam City Hall. Dipilih user. Disertai tagline yang menegaskan ini bukan situs resmi, misalnya "Balai warga, bukan balai kota".
- **Footer wajib:** "Proyek independen warga Batam, bukan situs resmi Pemerintah Kota Batam atau BP Batam. Untuk layanan resmi: batam.go.id."
- **Sifat:** indie, non-komersial. Tanpa iklan, tanpa listing berbayar, tanpa artikel sponsor. Dana dari donasi (Saweria/Trakteer) dan mungkin merch kecil.
- **Pembuat:** developer solo dari Batam. Sudah punya:
  - `hujandibatam.masbash.id`: radar hujan realtime, tab Ombak, tab CCTV Batam. **Jangan bangun ulang API cuaca/BMKG/ombak/CCTV**; ambil dari situs/repo ini (minta akses repo atau endpoint ke user).
  - `batam-bites.vercel.app`: direktori tempat makan, termasuk kopitiam dan seafood. **Makanan tidak diriset ulang**; integrasikan sebagai Loket Makan (minta repo/data ke user).
- **Domain:** `.id` sedang dipertimbangkan (misalnya batamcityhall.id). Sementara bisa subdomain masbash.id.

## 2. Nada & estetika (keputusan user, tegas)
- Premium, elegan, artsy, kalcer, indie. Seperti situs museum atau majalah seni, **bukan** portal pemerintah atau situs wisata.
- "Jangan norak." Lucu boleh, tapi jenaka yang kalem. **Informasi dulu, lucu jadi bumbu.**
- Ditolak user: nama/konsep norak (contoh yang ditolak: "Gonggong", "Teh Obeng"), maskot kartun di semua halaman, plesetan di setiap judul, bahasa gaul dipaksakan, "SK lucu-lucuan" sebagai konten utama. Main-main dengan bahasa birokrasi cukup di nama menu ("Loket").
- Arah visual final: **peta laut (nautical chart)**, kertas gading, tinta hampir hitam, biru-abu, satu aksen terakota senja Barelang, serif berkarakter + sans bersih + mono untuk data, banyak ruang kosong, gerak pelan. Detail lengkap di `research/05-panduan-gaya.md` dan `data/design/`.
- Contoh nada: "Sekupang kering. Batam Centre tidak."

## 3. Struktur menu "Loket"
Loket bernomor seperti bab majalah:
- Beranda: peta + widget "Hari Ini" (hujan, ombak, feri terakhir, gempa terakhir bila relevan)
- Loket 01 · Langit & Laut: hujan, ombak, CCTV, feri & pompong
- Loket 02 · Makan: batam-bites
- Loket 03 · Tukang Langganan: rekomendasi tulus warga
- Loket 04 · Jalan-jalan: Trans Batam (peta geografis + skematik), feri, pelabuhan, CCTV
- Loket 05 · Cerita & Budaya: sejarah, Batam Dulu vs Sekarang, Kampung Tua, Siapa di Balik Nama Jalan, kamus, kalender acara
- Loket 06 · Info Warga: direktori lengkap, urusan tanah ke mana, bantuan hukum, layanan publik, nomor darurat, berita (RSS)
- Loket 07 · Main-main: quest, kartu pos, vibe map (kategori aman), fase akhir

Penomoran dan nama boleh disesuaikan Claude Code asal konsisten. Isi tiap loket wajib ada.

## 4. Tukang Langganan (keputusan user)
- **Rekomendasi tulus, non-komersial.** Tidak ada listing berbayar/unggulan/sponsor.
- Tukang **tidak bisa** mempromosikan diri. Baru tampil setelah **minimal 2 rekomendasi dari warga berbeda**. Satu rekomendasi → tampil sebagai "Baru direkomendasikan 1 orang" (atau disembunyikan sampai 2, pilih yang paling aman; default: sembunyikan dari publik sampai 2).
- Setiap kartu menampilkan **tanggal terakhir dicek**. Tombol "Masih buka?" / "Sudah pindah/tutup".
- **Tanpa rating bintang.** Pakai cerita singkat + tag ("rapi", "on time", "harga jujur").
- Minta izin tukang (WA singkat) sebelum dicantumkan. Nomor HP tukang dan kontak perekomendasi = data pribadi: simpan dengan consent, nomor perekomendasi **tidak pernah** tampil publik.
- Moderasi manual di awal, jalur "laporkan masalah" yang menyembunyikan entri sementara.
- Kalimat prinsip di halaman: "Tidak ada yang bayar untuk masuk daftar ini. Semua rekomendasi datang dari warga yang pernah pakai jasanya."
- Kategori jasa yang disebut user (wajib tersedia sebagai kategori): tukang jahit & permak, mebel/furnitur, servis AC & cuci AC, bengkel motor/mobil, tukang kunci, laundry, sol sepatu, servis HP/laptop/elektronik/mesin cuci/kulkas, tukang bangunan/listrik/ledeng, pijat & refleksi, pijat panggilan, salon/barbershop, fotokopi/percetakan, dokter per spesialis (rekomendasi warga melengkapi data resmi), kos, jastip Singapura.

## 5. Direktori: kategori yang diminta user (semua wajib ada)
Pasar, mal, supermarket/minimarket, toko bahan bangunan, toko ATK, taman, perpustakaan, kantor pemerintahan, tempat ibadah (semua agama), kuburan/TPU per agama, pelabuhan, halte, tempat wisata, pantai, rumah sakit, klinik, puskesmas, apotek, lab, **dokter dirinci per spesialis** (gigi, kandungan/obgyn, anak, kulit, THT, mata, penyakit dalam, psikolog/psikiater, fisioterapi, bidan, hewan), sekolah negeri & swasta (PAUD, playgroup, TK, daycare, SD, SMP, SMA/SMK, MI/MTs/MA), universitas, hotel & penginapan, berbagai servis, tempat pijat, pijat panggilan, lapangan **dirinci** (padel, badminton, futsal, mini soccer, basket, tenis, voli), gym, PPAT, notaris, money changer, ekspedisi, SPBU. Prinsip user: "untuk seluruh yang dibutuhkan manusia".

## 6. Data hotel dari user
- Sumber: file rekap pajak hotel milik user. **Hanya** nama, kelas bintang, alamat, dan status aktif yang diambil (243 hotel aktif: 2 bintang 5, 32 bintang 4, 30 bintang 3, 18 bintang 2, 16 bintang 1, 145 non bintang).
- **NPWPD, NOP, nilai pajak, dan nomor SSPD/SPTPD tidak disertakan dan tidak boleh muncul di website.** File asli tidak ada di paket ini.
- File: `data/places/00-data-hotel-user.json`, `data/akomodasi/hotel.csv`. Kecamatan disimpulkan dari teks alamat (lihat `catatan` per entri); 34 hotel belum punya kecamatan.

## 7. Koordinat
- User akan **mengisi sendiri** koordinat yang belum pasti. Daftarnya ada di `data/koordinat_perlu_diisi.csv`.
- Claude Code **dilarang menebak koordinat**. Entri dengan `lat/lng = null` tidak dirender di peta, cukup tampil di daftar dengan badge "lokasi belum diisi".
- Claude Code wajib membuat skrip impor balik CSV yang sudah diisi user (lihat prompt).

## 8. Hal yang ditunda / belum diriset
- **Aspek hukum & etika data** (UU PDP, PSE, UU ITE, lisensi data, hak cipta foto/AI, CCTV): ditunda atas permintaan user. Riset sempat dimulai lalu dihentikan; **tidak ada laporannya**. Sementara itu, terapkan default yang konservatif (lihat prompt bagian Privasi).
- **RSS berita Batam:** diminta user tapi belum diriset. Claude Code mengerjakan sendiri (lihat prompt).
- **Panduan warga baru/pendatang** (urus KTP pindahan, kos, kerja di kawasan industri): belum diriset; buat struktur halaman dan isi dari data yang sudah ada, tandai TODO.

## 9. Hasil riset kecil di chat (tidak ada di laporan lain)

### 9.1 Situs indie kota lain yang disebut (inspirasi, selain laporan 01)
Burrito Justice (SF, peta "Islands of San Francisco", "Bikes to Books"), Spacing (Toronto, pin subway), Untapped New York, Saigoneer, Zolima CityMag (Hong Kong), Solo Kota Kita (Mini Atlas, Indonesia), Jill Hubley (NYC street trees, peta bahasa), Toronto Kiss Map, My Gainesville Map, You Are Here ATL, Remember Singapore, Spotted by Locals, Tokyo Cheapo, BandungBergerak.id, Manual Jakarta, NEONSIGNS.HK, OldNYC, Fortepan, Hoodmaps (Pieter Levels, Belanda, dibuat solo; hati-hati stereotip), The Pudding, Kontinentalist, Front Porch Forum.
Ide yang disukai user: **Peta Kampung Tua**, mural interaktif seperti "Mural Jakarta" (jakarta.oyenza.com) tapi lebih bagus, hidup oleh data, dan premium.

### 9.2 Konsep peta (disepakati sebelum riset gaya)
1. Peta asli OSM yang di-style seperti ilustrasi; landmark sebagai sketsa garis.
2. Cakupan: Batam, Rempang, Galang, Belakang Padang, Bulang, pulau sekitar; Singapura dan Bintan sebagai siluet pucat. Peta dikunci di area ini (usulan bbox kasar `103.55,0.45,104.75,1.5`, sesuaikan).
3. Zoom jauh: siluet pulau + landmark + nama kecamatan. Menengah: kelurahan + titik layer aktif. Dekat: jalan, nama tempat.
4. Layer per loket dengan tombol chip/legenda chart; default: hujan + landmark.
5. Pin berbentuk konsisten per layer; cluster saat padat.
6. Klik pin → kartu bergaya label museum (bottom sheet di HP, panel samping di desktop).
7. Pencarian kelurahan/tempat, tombol "Di sekitarku" (opsional, izin lokasi), link per pin yang bisa dibagikan ke WhatsApp, kotak "Hari ini".
8. Satu tabel "tempat" untuk semua layer.
9. HP dulu, layer dimuat saat dinyalakan, hormati reduced motion, atribusi OSM/Protomaps/BMKG.

### 9.3 Konsep mural (disepakati)
- Jalur cerita: Selat Singapura/pesisir utara → kawasan industri → Barelang 1–6 → Rempang → Galang. Strip navigasi perhentian di bawah.
- Mural hidup oleh data: hujan hanya di bagian yang sedang hujan (data hujandibatam), ombak mengikuti tinggi gelombang, feri bergerak sesuai jadwal (label "posisi perkiraan"), cahaya mengikuti jam Batam (pagi/senja/malam, lampu ruko menyala).
- Setiap bangunan bisa diklik → kartu museum. Quest edukatif ("Temukan 6 jembatan Barelang", "Temukan kampung tua"). Tanpa quest di titik memorial/konflik.
- Gaya: garis halus, palet terbatas, tekstur risograph. Ilustrasi idealnya kolaborasi ilustrator lokal; hibrida AI hanya untuk latar dan diumumkan terbuka.
- Dua mode: "Mural" untuk menjelajah, "Peta" chart laut untuk mencari.

### 9.4 Catatan riset sumber data yang dilakukan di chat (pelengkap; jangan bangun ulang fitur cuaca)
- BMKG prakiraan per kelurahan: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode}` (3 hari, per 3 jam, update 2x sehari, 60 req/menit/IP, **wajib atribusi BMKG**). Kode Kota Batam `21.71`.
- BMKG peringatan dini (CAP/XML, sampai kecamatan, dengan poligon): `https://www.bmkg.go.id/alerts/nowcast/id` dan `.../nowcast/id/{kode}_alert.xml`.
- BMKG gempa: `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json` (dan gempaterkini, gempadirasakan).
- Maritim: wilayah "Perairan Kep. Batam"; prakiraan per perairan Kepri dari Stamet Hang Nadim (PDF). Untuk ombak, pakai yang sudah dipakai hujandibatam.
- Protomaps: `pmtiles extract https://build.protomaps.com/<YYYYMMDD>.pmtiles batam.pmtiles --bbox=... --maxzoom=15`.
- GEBCO grid terbaru bisa diunduh per area (GeoTIFF/netCDF), ±450 m, "kedalaman indikatif, bukan untuk navigasi".
- Trans Batam: tidak ada GTFS resmi. Satu Data Batam berisi PDF kompilasi statistik, bukan API.
- Domain batam.com: milik pihak lain sejak 1997 (expire 17 Nov 2026 per WHOIS yang dilihat user). Bukan prioritas.

### 9.5 Sumber geoportal yang diberikan user
- https://www.hangjebat-geoportal.com (Disperkimtan Kota Batam: perumahan, fasos/RTH, jalan lingkungan, rawan bencana, rusunawa)
- https://geoportal.bpbatam.go.id/publication/basis-data/ (Geoportal BP Batam)
- https://tanahair.indonesia.go.id/portal-web/ (Ina-Geoportal BIG)
Hasil analisis lengkap: `research/11-geoportal.md`.
