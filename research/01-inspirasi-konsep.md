# Batam City Hall: Riset Contoh Website Kota, Direktori Hyperlocal dan Konsep Lengkap
> task_id: wf-2c6ba93f-8eb5-55a3-8f98-dea793d8ad5d

# Batam City Hall: Riset Contoh Website Kota, Direktori Hyperlocal & Konsep Lengkap

Kesimpulan utamanya: Batam City Hall paling masuk akal dibangun sebagai **"almanak kota yang hidup"**. Bentuknya satu peta ilustrasi Batam sebagai pintu masuk, lalu hujan, ombak, CCTV, makan, dan "Tukang Langganan" jadi *layer* di atas peta itu. Polanya meniru gabungan tiga jenis proyek yang sudah terbukti jalan: peta crowdsourced bernuansa lucu (Hoodmaps, NEONSIGNS.HK), arsip/peta nostalgia (OldNYC), dan forum/direktori tetangga yang hidup dari sponsor lokal (Front Porch Forum). Untuk developer solo, kuncinya bukan fitur yang banyak, tapi **satu peta yang cantik plus data yang dikurasi manusia**.

## TL;DR

- **Contoh terbaik untuk ditiru:** NEONSIGNS.HK (peta crowdsourced dengan kurasi museum), OldNYC (foto lama di peta yang bisa dikoreksi warga), Hoodmaps (peta "vibe" kota yang lucu dan digambar bareng), The Pudding/Kontinentalist (esai visual dan infografis kota), plus Front Porch Forum sebagai model direktori dan bisnis lokal yang berkelanjutan.
- **"Tukang Langganan" adalah fitur pembeda paling kuat.** Aplikasi besar seperti Sejasa sudah menggarap jasa terverifikasi yang berbayar. Yang belum ada di Batam adalah daftar rekomendasi *antarwarga* yang personal, misalnya "tukang jahit langganan mamak saya di Tiban". Kumpulkan lewat form, wajibkan minimal 2 rekomendasi independen, tampilkan kapan terakhir dicek, dan biayai dengan sponsor lokal atau donasi, bukan iklan yang melacak pengguna.
- **Tech stack yang realistis:** Next.js/Astro di Vercel, MapLibre + Protomaps/PMTiles (OSM) untuk peta, Scrollama untuk scrollytelling, D3/Rough.js untuk infografis doodle, Supabase/Google Sheets sebagai database awal, dan API terbuka BMKG (cuaca per kelurahan, peringatan dini, maritim, gempa). Roadmap: MVP 6–8 minggu berupa "peta + hujan + makan + 3 kategori tukang", baru setelah itu budaya, feri, dan fitur lucu.

## Key Findings

1. **Website kota yang "artsy" dan bertahan lama hampir selalu punya satu objek sentral yang dicintai warga**, misalnya neon, foto lama, atau stereotip lingkungan. Mereka tidak mencoba jadi portal serba ada. Untuk Batam, objek sentral yang cocok adalah **peta ilustrasi pulau-pulau + Barelang + kampung tua**.
2. **Crowdsourcing berhasil kalau ada kurasi.** NEONSIGNS.HK mengumpulkan lebih dari 4.000 foto dari publik dalam 3 bulan (21 Maret–30 Juni 2014), tapi dibingkai esai kuratorial dari museum M+. OldNYC membiarkan warga mengoreksi typo dan meninggalkan komentar, sementara datanya tetap dari arsip perpustakaan.
3. **Direktori layanan yang paling dipercaya justru yang paling "manusiawi"**: daftar rekomendasi tetangga lengkap dengan nama pemberi rekomendasi (COMMUNIT-E di Washington DC), Google Doc rekomendasi tukang jahit/sol sepatu dari pembaca newsletter, atau direktori repair yang disusun komunitas (Highland Repair Directory, Repair Kopitiam).
4. **Model keberlanjutan yang terbukti untuk hyperlocal adalah iklan atau sponsor lokal yang tidak melacak pengguna.** Front Porch Forum di Vermont hidup terutama dari iklan bisnis lokal, nonprofit, dan pemerintah, dan menjangkau 235.000 dari 270.000 rumah tangga di Vermont.
5. **Data terbuka Indonesia untuk Batam ternyata cukup kaya.** BMKG punya API cuaca per kelurahan, peringatan dini (CAP), cuaca perairan, dan gempa. Panel Harga Pangan Bapanas mencakup 514 kabupaten/kota. Jadwal feri ke Singapura bisa dirujuk dari papan jadwal Singapore Cruise Centre.

## Details

### 1. Contoh website kota/area yang bagus

| Nama & URL | Kota/Negara | Kenapa bagus | Pelajaran untuk Batam City Hall |
|---|---|---|---|
| **NEONSIGNS.HK**, https://www.neonsigns.hk/?lang=en | Hong Kong | Pameran online museum M+ tentang neon yang mulai punah. Isinya Neon Map crowdsourced, esai, video pembuatan neon, timeline, dan halaman "Lost & Featured Neon". Lebih dari 4.000 foto masuk dari publik. Peta bisa difilter per jenis usaha (pegadaian, klub malam), per imagery (hewan, makanan), dan per distrik. | Pilih satu "ikon kota yang hilang/khas" lalu ajak warga memetakannya. Untuk Batam, kandidatnya: papan nama ruko lama Nagoya, gerobak kopi/teh obeng, gapura kampung tua, atau pelantar kayu. Siapkan kategori "Sudah Hilang". |
| **OldNYC**, https://www.oldnyc.org/ | New York, AS | Beranda oldnyc.org sekarang menyebut 50.000 foto lama dari koleksi Milstein New York Public Library dipetakan per lokasi (saat diluncurkan pada 2015 jumlahnya sekitar 40.000). Warga bisa berkomentar dan memperbaiki typo hasil OCR. Penciptanya, Dan Vanderkam, menulis bahwa pengguna "fixed thousands of typos". Kodenya open source. | Fitur "Batam Dulu vs Sekarang": foto lama Batam (sebelum dan awal pembangunan) di peta, dengan kolom "saya ingat ini". Warga Batam yang lama tinggal punya banyak foto keluarga. |
| **Fortepan**, https://fortepan.hu/ | Hungaria | Arsip foto keluarga yang didirikan pada 2010 oleh Miklós Tamási dan Ákos Szepessy, disusun di timeline dengan slider tahun. Publik bisa mencari, men-tag, dan mengunduh. Menurut Archivum (mitra pendiri), koleksinya kini lebih dari 200.000 foto arsip (angka 110.000 adalah capaian yang dirayakan pameran 2019). | Slider tahun cocok untuk Batam yang berubah drastis sejak 1970-an. Fitur "Geser tahun, lihat Batam berubah". |
| **Hoodmaps**, https://hoodmaps.com/ | Global (indie, Pieter Levels) | Peta crowdsourced tempat warga "mewarnai" area kota dengan kategori lucu (hipster, turis, kaya, normies, suits, kampus) dan menulis label nyeleneh. Dibuat solo, masuk longlist Information is Beautiful Awards 2017. | Bukti bahwa developer solo bisa bikin peta kota viral asal tone-nya lucu. **Peringatan:** Hoodmaps dikritik soal stereotip. Santa Monica Sun mengutip Bloomberg News: "The stereotypes speak mostly to how wealthier, white people might see a neighborhood", dan sebagian label tagging lokalnya disebut rasis. Di Batam yang multietnis, kategori harus aman, misalnya "area ngopi", "area macet jam pulang pabrik", "area angin kencang". |
| **The Pudding – A Tale of Two Cities**, https://pudding.cool/2018/03/neighborhoods/ dan **Population Mountains**, https://pudding.cool/2018/12/3d-cities-story/ | Seattle/NYC, global | Esai visual: usaha apa yang "khas" tiap lingkungan (dari data Yelp), dan kepadatan penduduk sebagai gunung 3D, termasuk perbandingan Singapura dan Kuala Lumpur. | Format "esai visual" untuk konten budaya, misalnya "Kenapa Batam penuh ruko?", "Peta asal daerah warga Batam", atau "Kecamatan mana yang paling banyak tukang jahit?". |
| **Kontinentalist**, https://kontinentalist.com/ | Singapura | Studio data storytelling soal Asia yang memakai scrollytelling, peta, dan ilustrasi. Pernah membuat infografis digital **Malay Lauk-Pauk** dan peta lipat cetak soal perumahan Singapura. | Referensi visual terdekat secara budaya (Melayu, Asia Tenggara). Gaya ilustrasi + data cocok untuk "Ensiklopedia Lauk Melayu Kepri" atau "Peta Kampung Tua". |
| **Manual Jakarta**, https://manual.co.id/ | Jakarta | Media gaya hidup independen sejak 2014 yang menggabungkan editorial (food, street, culture) dengan *Directory* (resto, kafe, bar, street food, toko). | Contoh lokal Indonesia: editorial + direktori di satu tempat. Batam-bites bisa naik kelas dengan "kolom editorial", tidak hanya daftar. |
| **Steady Hand Maps – Seattle Memories Map**, https://steadyhandmaps.com/ | AS | Peta kota tangan yang menonjolkan "the best, the weirdest, the most unique" dari sebuah kota, termasuk proyek arsip pohon kota bersama Kota Phoenix. | Inspirasi gaya peta hand-drawn: Batam yang "aneh dan khas", misalnya simpang yang selalu banjir atau pohon besar di kampung tua. |
| **Russell Shaw – Illustrated Cities**, https://russellshawdesign.com/illustrated-city-guides | Beberapa kota AS | Garis pena kasar + **satu spot color** per kota, memetakan kota berdasarkan orang dan tempat yang membuatnya berkesan, bukan navigasi. | Formula visual yang murah dan konsisten untuk solo dev: line art hitam + satu warna khas Batam (misalnya oranye senja Barelang). |
| **Kurasi Awwwards (Maps)**, https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/ | Global | Kumpulan contoh peta interaktif ilustratif, seperti peta "Misato Town" yang dinavigasi dengan scroll dan efek hujan di peta. | Ide interaksi: animasi hujan di peta ilustrasi yang terhubung ke data hujandibatam yang asli. |

### 2. Contoh direktori rekomendasi layanan hyperlocal

| Nama & URL | Lokasi | Cara kumpulkan data | Jaga kualitas | Keberlanjutan |
|---|---|---|---|---|
| **Front Porch Forum**, https://frontporchforum.com/ | Vermont, AS | Forum harian per lingkungan, business directory, dan kalender komunitas. Bisnis bikin listing gratis. | Hanya tetangga terverifikasi alamatnya yang bisa ikut. Tidak anonim. Dimoderasi profesional. Ada relawan lingkungan. | Public Benefit Corporation. Pendapatan utama dari iklan bisnis lokal, nonprofit, pemerintah, dan kandidat politik. Lebih dari 16.000 bisnis dan nonprofit punya listing, dan survei independen menyebut 48% anggota membeli dari bisnis lokal karena FPF. |
| **COMMUNIT-E "Service Providers: Your Neighbors' Recommendations"**, https://robertmaudlin.com/Tradesmen%20Recommendations%20Feb.%202013.pdf | Friendship Heights/Tenleytown, Washington DC | Kompilasi komentar warga di milis soal tukang yang pernah mereka pakai selama 4 tahun, disusun per kategori (termasuk "Tailors & Seamstresses"). | **Kontak pemberi rekomendasi dicantumkan** di setiap rekomendasi. Ini sinyal kepercayaan yang sangat kuat. | Sukarela (milis komunitas). |
| **"Repair Month Google Doc"** (Emilia Petrarca), https://emiliapetrarca.substack.com/p/the-repair-month-google-doc-is-here | NYC/LA dkk. | Pembaca newsletter mengirim tukang jahit dan sol sepatu favorit mereka, lengkap dengan cerita singkat ("the grandma at Griffith Park Cleaners"). | Setiap entri punya cerita personal dan lokasi spesifik. | Bagian dari newsletter berbayar/Substack. |
| **Put This On – A Tailoring Directory**, https://putthison.com/a-tailoring-directory/ | Kota-kota AS | Rekomendasi pembaca per kota, dengan catatan spesialisasi ("recommended for complicated work", "for denim repair"). | Menandai yang paling sering direkomendasikan. | Blog/media fashion. |
| **Highland Repair Directory** (laporan Keep Scotland Beautiful), https://www.keepscotlandbeautiful.org/media/ojzhw0yr/luct-hrd.pdf | Highlands, Skotlandia | Mitra komunitas mengumpulkan data repairer ke spreadsheet bersama, lalu dipetakan dalam **9 kategori** (sepeda, pakaian/sepatu, komputer, repair café, alat dan mesin, dll.). | Lahir dari pertanyaan nyata di toko barang bekas. | Program kemitraan pengelolaan sampah. Setelah programnya selesai, dialihkan ke Highlands & Islands Climate Hub. |
| **Repair Café (peta global)**, https://www.repaircafe.org/en/visit/ | Global | Peta **4.045** Repair Café. Ada **API lokasi** untuk ditampilkan di peta pihak lain (https://www.repaircafe.org/en/api/). | Jaringan relawan dan yayasan. | Yayasan dan donasi. |
| **Repair Kopitiam**, https://repairkopitiam.sg/about | Singapura | Meetup reparasi bulanan di lingkungan (elektronik, baju sobek, mebel rusak) bersama relawan "Repair Coach". | Relawan dilatih dulu. Situs SL2 Impact menyebut mereka telah melatih "more than 2000 volunteer repair coaches" dengan "repair success rate of ~55%". Data 2025 dari Red Hot Singapore: lebih dari 2.300 barang dibawa ke sesi Repair Kopitiam, 69% (berdasarkan berat) berhasil diperbaiki, di 10 lokasi dengan sekitar 300 coach reguler. | Dijalankan SL2 Impact (nonprofit) dengan dukungan NEA, Geneco, CDC, dan People's Association. |
| **NEA – Donation, Resale and Repair Channels**, https://www.nea.gov.sg/our-services/waste-management/donation-resale-and-repair-channels | Singapura | Daftar resmi termasuk PDF "List of Stalls Offering Repair Services at Hawker Centres". | Daftar bertanggal ("as at 15 May 2025"). | Pemerintah. |
| **Recyclopedia.sg**, https://recyclopedia.sg/resources?section=Repair | Singapura | Bagian "Repair" berisi jasa kecil seperti reparasi payung dan kios reparasi di hawker center. | Ada halaman tim dan feedback publik (detail metodologinya belum terverifikasi). | Belum terverifikasi. |
| **Bangsar Baru Community Portal**, https://www.bangsar.net.my/directory-listings/ | Kuala Lumpur | Direktori bisnis (termasuk "Car Repair"), classifieds, event, dan forum. Pengguna mendaftar untuk menambah konten. | Wajib login (tingkat moderasinya belum terverifikasi). | Tampaknya iklan (AdSense). Ini inferensi. |
| **Sejasa** (pembanding komersial), https://www.sejasa.com/ | Indonesia | Marketplace jasa rumah: lebih dari 750.000 pelanggan, lebih dari 300 kategori. | Verifikasi dokumen dan background check mitra. | Komisi/transaksi. |

**Catatan penting:** Saya *tidak* menemukan direktori tukang komunitas di Indonesia (apalagi Batam) yang terdokumentasi dan bisa dicek. Hasil pencarian Indonesia isinya listicle SEO (misalnya navi.id "10 Rekomendasi Tukang Jahit... Kota Jambi" yang diurutkan berdasarkan rating Google) atau aplikasi komersial seperti Sejasa dan Seekmi. Ini **celah pasar yang nyata**. Rekomendasi tukang di Batam sekarang tersebar di grup Facebook/WhatsApp dan Instagram info kota. Dalam siaran pers 5 September 2017, saat Seekmi menambah layanan tukang, Founder & CEO Seekmi Clarissa Leung sendiri mengakui bahwa "mayoritas masyarakat Indonesia sangat tergantung kepada jaringan seperti keluarga dan teman dekat, untuk mendapatkan teknisi."

### 3. Fitur umum dan unik di website kota (selain cuaca, ombak, CCTV, kuliner)

- **Peta crowdsourced bertema** (neon, foto lama, vibe area): NEONSIGNS.HK, OldNYC, Hoodmaps.
- **Timeline/slider tahun**: Fortepan, Neon Timeline di NEONSIGNS.HK.
- **Esai visual/scrollytelling**: The Pudding, Kontinentalist.
- **Audio walk / tur jalan kaki**: NEONSIGNS.HK menyediakan audio walk yang bisa diikuti virtual atau langsung di jalan.
- **Kalender komunitas + direktori bisnis + forum**: Front Porch Forum.
- **Peta layanan reparasi/komunitas** lewat API pihak ketiga: Repair Café API.
- **"Yang sudah hilang"**: halaman "Lost Neon" di NEONSIGNS.HK. Sangat relevan untuk Batam yang terus berubah.
- Fitur lain dari brief yang relevan untuk Batam: jadwal feri, info harga pangan, kamus dialek, layanan publik, event, cerita warga. Bagian konsep di bawah memetakan semuanya.

### 4. Konteks Batam yang bisa jadi bahan fitur

- **Kampung Tua**: permukiman penduduk asli sebelum pembangunan Batam tahun 1970, yang ditetapkan sebagai kawasan cagar budaya dalam Perda RTRW Kota Batam. Jumlahnya beda-beda tergantung sumber: Tim Penyelesaian Legalitas mengukur **37 titik** pada 2019 (Antara Kepri), RKWB menyebut 37 titik seluas sekitar 1.600 ha (Media Center Batam, 2019), dan dokumen STPN menyebut total **134 kampung tua** dengan 33 titik di mainland (sisanya di hinterland). Penghuninya dari berbagai etnis: Melayu, Bugis, orang Ladi, dan lainnya (Kepri Post). Topik ini **sensitif secara politik** karena ada sengketa lahan dan UWTO dengan BP Batam, jadi kontennya sebaiknya bernada budaya/sejarah, tidak memihak, dan tidak menyederhanakan.
- **Jembatan Barelang**: rangkaian **6 jembatan**, dibangun 1992–1998, dengan total bentang sekitar 2 km (jumlah per jembatan versi Wikipedia sekitar 2,26 km; angkanya beda tipis antarsumber).
- **Feri internasional**: sejak Juli 2026 semua feri Batam dari HarbourFront berangkat dari Singapore Cruise Centre baru (5 HarbourFront Avenue). Rute utamanya HarbourFront–Batam Centre (BatamFast, Sindo, Majestic), HarbourFront–Sekupang, HarbourFront–Harbour Bay (Horizon), dan Tanah Merah–Batam Centre/Nongsapura. Feri terakhir dari Batam Centre ke HarbourFront sekitar pukul 20:30 WIB (batam.com). Jadwal live tersedia di https://singaporecruise.com.sg/schedule/ferries/. Jadwal antarsumber sering berbeda, jadi selalu tampilkan "cek ke operator".
- **Ide khas Batam**: warga "melting pot" (pendatang dari berbagai daerah), pekerja kawasan industri (jam shift dan bus karyawan), angin dan ombak yang menentukan nasib feri ke pulau-pulau, ruko, dan budaya Melayu pesisir.

## Konsep Lengkap "Batam City Hall"

### Visi & tone

**"Balai warga online yang lucu: semua yang perlu kau tahu soal Batam hari ini, plus cerita kenapa Batam jadi begini."** Tone-nya seperti kawan lama yang tahu semua tukang, bukan seperti humas pemda. Bahasanya Indonesia santai dengan selipan Melayu Kepri (misalnya "Ape kabar, Batam?", "Mane tukang jahit yang bagus?"). Nama "City Hall" bisa dipertahankan sebagai lelucon: balai kota versi warga, lengkap dengan "loket-loket" yang lucu.

### Struktur menu ("Loket")

1. **Beranda = Peta Ilustrasi Batam.** Peta doodle Batam, Rempang, Galang, Bintan di kejauhan, dan Singapura di atas. Ada widget hari ini: hujan sekarang, ombak, feri terakhir, gempa terakhir (kalau ada).
2. **Loket Langit & Laut**: hujandibatam (radar hujan realtime), Ombak, peringatan dini BMKG, "Bisa nyebrang ke pulau hari ini?", gempa terkini.
3. **Loket Perut**: Batam-bites (direktori makan), ditambah editorial dan "Peta Lauk Melayu".
4. **Loket Tukang Langganan**: tukang jahit, mebel/furnitur, servis AC, bengkel motor, tukang kunci, laundry, sol sepatu, servis HP, tukang permak jeans, dan lain-lain.
5. **Loket Jalan-jalan**: jadwal feri (Singapura/Malaysia/pulau), CCTV kota, info macet/"jam pulang pabrik".
6. **Loket Cerita & Budaya**: Kampung Tua, Barelang, Batam Dulu vs Sekarang, kamus Melayu Kepri, cerita warga pendatang.
7. **Loket Info Warga**: harga pangan Batam, layanan publik (Samsat, Disdukcapil, PLN Batam, air), nomor darurat, kalender event.
8. **Loket Main-main**: fitur lucu (lihat di bawah).

### Daftar fitur per kelompok

**A. Cuaca & Laut** (sudah ada, tinggal dirapikan)
- Radar hujan realtime (hujandibatam) ditampilkan di atas peta ilustrasi, dengan animasi tetes hujan doodle.
- Prakiraan per kelurahan dari BMKG: data 3 hari, per 3 jam, diperbarui 2 kali sehari, memakai kode wilayah adm4.
- Peringatan dini cuaca (nowcast) BMKG dalam format CAP/XML sampai level kecamatan.
- Cuaca perairan BMKG (gelombang) untuk tab Ombak, ditambah indikator "Aman nyebrang ke Pulau Abang/Galang?". Ingatkan pengguna bahwa ini bukan pengganti info syahbandar.
- Gempa terkini (autogempa.json BMKG). Penting walaupun Batam relatif jarang gempa, karena warga punya keluarga di daerah lain.

**B. Makan (Batam-bites)**
- Peta makan dengan filter "buka subuh", "dekat pelabuhan", "halal", "kopi + roti", "seafood Barelang".
- Editorial pendek gaya Manual Jakarta: "5 Mi Lendir yang Diperdebatkan Warga".
- "Lauk-Pauk Melayu Kepri": infografis ilustrasi terinspirasi karya Kontinentalist *Malay Lauk-Pauk*.

**C. Tukang Langganan** (fitur andalan)
- Kartu tukang bergaya "kartu nama doodle": nama, keahlian ("jago permak jeans", "bisa vermak kebaya"), area, perkiraan harga, jam buka, cara menghubungi, dan **siapa yang merekomendasikan + kapan**.
- Badge: "Direkomendasikan 3 warga", "Langganan sejak 2010", "Dicek Mei 2027", "Bisa dipanggil ke rumah".
- Filter per kecamatan dan per kebutuhan ("baju seragam sekolah anak", "jahit baju raya", "mebel jati Belanda bekas").
- Halaman "Tukang Legendaris": profil cerita (foto dan wawancara singkat) ala proyek "My Neon City" di NEONSIGNS.HK.

**D. Budaya & Cerita**
- **Peta Kampung Tua** dengan gapura doodle per titik, cerita asal-usul, dan sumber yang jelas. Tone-nya netral soal sengketa lahan.
- **Barelang Scrollytelling**: scroll dari Jembatan 1 ke 6, tiap jembatan satu cerita.
- **Batam Dulu vs Sekarang**: foto lama warga di peta + slider tahun (pola OldNYC + Fortepan).
- **Kamus Melayu Kepri & Bahasa Gado-gado Batam**: kata-kata harian. Isinya crowdsourced dengan contoh kalimat dan rekaman suara.
- **"Dari Mana Kau?"**: peta interaktif asal daerah warga Batam (survei sukarela), sebagai perayaan melting pot.

**E. Info Warga**
- Harga pangan harian (Panel Harga Pangan Bapanas mencakup 514 kabupaten/kota; cek dulu apakah Kota Batam tersedia di filter kabupaten/kota sebelum dibangun).
- Panduan layanan publik ala "cara bikin KTP pindahan di Batam", karena banyak pendatang. Konten panduan ditulis sendiri dan ditautkan ke sumber resmi.
- Jadwal feri + "Feri Terakhir Hari Ini" sebagai widget besar.
- Kalender event (pasar malam, festival, Imlek, Pacu Jalur, dll.) yang diisi lewat form.

**F. Fun / Playful**
- **"Batam Vibe Map"**: versi aman ala Hoodmaps. Warga mewarnai area dengan kategori seperti "ngopi sampai subuh", "macet jam pulang pabrik", "angin paling kencang", "sinyal Singapura nyasar". Hindari kategori etnis atau kelas.
- **Kalkulator "Ke Singapura atau Ke Nagoya?"**: membandingkan biaya feri dengan belanja lokal (lelucon dengan data asli).
- **"Hujan Bingo"**: notifikasi lucu ketika hujan turun di Batam Centre tapi Sekupang kering.
- **Kartu Pos Batam**: generator kartu pos doodle (Barelang, Welcome to Batam, gonggong) untuk dibagikan ke media sosial. Ini juga bisa jadi merch.
- **Maskot**: misalnya **"Ong si Gonggong"** (siput gonggong, ikon kuliner Kepri) yang memakai helm proyek (kota industri) dan membawa payung (hujan). Variasi pose per loket: memegang gunting (tukang jahit), memakai pelampung (ombak), memegang tiket feri.

### Cara menggabungkan hujandibatam & batam-bites

1. **Domain payung** (misalnya batamcityhall.id atau subdomain masbash.id) dengan **satu peta dasar bersama** (MapLibre + style ilustrasi). Hujan, ombak, CCTV, makan, dan tukang menjadi *layer* yang bisa dinyalakan atau dimatikan.
2. **Fase transisi**: biarkan kedua situs lama tetap hidup. Tambahkan header/navbar bersama "Batam City Hall" dan redirect pelan-pelan. Jangan langsung memindahkan semua kode.
3. **Data bersama**: satu skema "tempat" (id, nama, koordinat, kategori, kecamatan, sumber, terakhir dicek) untuk resto *dan* tukang, supaya fitur seperti "makan dekat tukang jahit yang kamu tuju" gratis didapat.
4. **Widget silang**: di halaman resto muncul "lagi hujan di sini, bawa payung", dan di peta hujan muncul "warung kopi terdekat buat berteduh".

### Konsep visual

- **Gaya**: line art hitam yang sedikit goyah (hand-drawn) + **palet terbatas**: oranye senja Barelang, biru laut Selat Singapura, hijau bakau, dan kuning ruko. Pakai formula "satu spot color per section" ala Russell Shaw supaya konsisten dan murah dikerjakan sendiri.
- **Peta ilustrasi**: peta dasar vektor OSM yang di-style "kertas" (warna krem, garis jalan tipis, tekstur), lalu ditaburi ikon doodle untuk landmark (Barelang, Masjid Agung, Welcome to Batam, pelabuhan, kampung tua). Pendekatan hibrida ini jauh lebih realistis daripada menggambar seluruh peta dengan tangan.
- **Tipografi**: judul memakai font tulisan tangan/rounded yang playful, isi memakai font sans yang sangat terbaca (karena banyak data angka seperti jam feri dan harga).
- **Infografis**: chart bergaya sketsa (Rough.js/roughViz) untuk angka sederhana seperti harga cabai minggu ini, curah hujan, dan jumlah feri per hari.
- **Mikro-interaksi**: animasi hujan di peta saat hujandibatam mendeteksi hujan, dan kapal feri doodle yang bergerak di Selat saat jam berangkat.

### Crowdsourcing Tukang Langganan & cara menjaga kualitas

**Pengumpulan data (bertahap):**
1. **Seed manual**: kamu sendiri + 10–20 kenalan mengisi 50–100 tukang pertama. Jangan launching dalam keadaan kosong.
2. **Form publik** (Tally/Google Form → Supabase/Sheets) dengan pertanyaan wajib: nama tukang, keahlian spesifik, lokasi/kecamatan, cara menghubungi, *pernah pakai kapan*, *kenapa direkomendasikan* (cerita 1–3 kalimat), dan kontak pemberi rekomendasi (tidak ditampilkan publik tanpa izin).
3. **Kampanye bertema bulanan** ala "Repair Month": misalnya "Bulan Tukang Jahit" menjelang Lebaran, atau "Bulan Servis AC" saat musim panas.
4. **Rekrut "Duta Kecamatan"**: relawan per kecamatan, mirip Neighborhood Volunteers di Front Porch Forum.

**Menjaga kepercayaan:**
- **Aturan minimal 2 rekomendasi independen** sebelum tampil dengan badge "Terverifikasi warga". Kalau baru satu, tampil sebagai "Baru direkomendasikan 1 orang".
- **Tanggal "terakhir dicek"** di setiap kartu (pola daftar NEA yang selalu bertanggal), plus tombol "Masih buka?" / "Sudah pindah/tutup" untuk koreksi warga (pola OldNYC).
- **Persetujuan tukang**: kirim WA singkat minta izin dicantumkan. Ini penting secara etika dan juga untuk kepatuhan UU Pelindungan Data Pribadi (nomor HP adalah data pribadi).
- **Tanpa rating bintang**. Pakai *cerita* dan *tag* ("rapi", "on time", "harga jujur"). Rating bintang memicu drama dan review palsu, sedangkan cerita lebih sulit dipalsukan dan lebih "Batam".
- **Moderasi manual** di awal (kamu sendiri), dengan label jelas "Rekomendasi warga, bukan endorsement. Selalu sepakati harga di awal."
- **Jalur keluhan**: form "laporkan masalah" yang membuat listing disembunyikan sementara sampai dicek.

**Model keberlanjutan (urut dari paling mudah):**
1. **Donasi** (Saweria/Trakteer/KaryaKarsa): cocok untuk proyek kota yang disukai warga.
2. **Sponsor lokal per loket**, ala Front Porch Forum: misalnya "Loket Langit & Laut disponsori oleh [toko payung/operator feri]". Sponsor diberi label jelas, tanpa pelacakan pengguna, dan *tidak boleh membeli posisi di direktori tukang*.
3. **Merch**: kartu pos, stiker, poster peta ilustrasi Batam, dan kaos maskot. Peta ilustrasi kota terbukti laku sebagai produk (lihat Steady Hand Maps, Russell Shaw).
4. **Listing "Unggulan" untuk bisnis makan** (bukan tukang), dengan label "Sponsor".
5. **Hibah/kolaborasi**: komunitas budaya Melayu, kampus di Batam, atau program literasi digital. Repair Kopitiam dan Highland Repair Directory hidup dari pendanaan lembaga.

### Tech stack & sumber data

**Stack yang disarankan untuk solo dev:**
- **Frontend**: Next.js (sudah familiar karena Batam-bites di Vercel) atau Astro untuk halaman konten yang ringan. Hosting di Vercel.
- **Peta**: **MapLibre GL JS** (open source, tanpa biaya per load seperti Mapbox) + **Protomaps/PMTiles**: ekstrak wilayah Batam dari build OSM Protomaps jadi satu file `.pmtiles`, lalu host di Cloudflare R2/Vercel. Style dibuat dengan Maputnik. Leaflet tetap opsi untuk peta sederhana.
- **Scrollytelling**: **Scrollama** + MapLibre. Ada template siap pakai: digidem/maplibre-storymap (https://github.com/digidem/maplibre-storymap) dan scrolly-maplibre (https://github.com/OroraTech/scrolly-maplibre).
- **Infografis**: D3 untuk yang kompleks, Rough.js/roughViz untuk gaya sketsa, dan Observable Plot untuk chart cepat.
- **Data & form**: mulai dari Google Sheets + Tally (paling cepat), lalu pindah ke **Supabase** (Postgres + auth + storage foto) saat crowdsourcing sudah ramai.
- **Cron/ingest**: Vercel Cron atau GitHub Actions untuk menarik data BMKG dan menyimpan cache. Contohnya proyek QuakeLog, yang mengarsip feed BMKG tiap 15 menit lewat GitHub Actions.

**Sumber data terbuka:**
- **BMKG prakiraan cuaca**: `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4={kode}` (https://data.bmkg.go.id/prakiraan-cuaca/). Wajib mencantumkan BMKG sebagai sumber.
- **BMKG peringatan dini (CAP)**: https://data.bmkg.go.id/peringatan-dini-cuaca/
- **BMKG cuaca perairan/maritim**: https://peta-maritim.bmkg.go.id/public_api/perairan (GeoJSON wilayah + prakiraan gelombang).
- **BMKG gempa**: `https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`, `gempaterkini.json`, `gempadirasakan.json` (https://github.com/infoBMKG/data-gempabumi). Proyek komunitas menyebut batas akses 60 permintaan per menit per IP, jadi wajib di-cache.
- **OpenStreetMap / Protomaps** untuk peta dasar.
- **Panel Harga Pangan Bapanas**: panelharga.badanpangan.go.id (data harian dengan cutoff 13.00 WIB). Belum ada API publik yang terdokumentasi resmi, jadi cek ketentuan penggunaan sebelum di-scrape.
- **Jadwal feri**: papan jadwal Singapore Cruise Centre (https://singaporecruise.com.sg/schedule/ferries/) dan situs operator. Tidak ada API terbuka, jadi mulai dengan jadwal statis yang dikurasi manual + disclaimer.
- **Repair Café API** (kalau nanti ada Repair Café di Batam).

### Roadmap realistis untuk developer solo

**Fase 0 – Fondasi (2 minggu)**
- Tentukan nama, domain, dan palet. Gambar 15–20 ikon doodle + maskot dasar.
- Siapkan peta dasar MapLibre + PMTiles Batam dengan style "kertas".

**Fase 1 – MVP (6–8 minggu)**
- Beranda peta ilustrasi + widget "Hari Ini" (hujan, ombak, gempa terakhir, feri terakhir).
- Integrasi hujandibatam & batam-bites sebagai layer/loket (dengan header bersama).
- **Tukang Langganan v1**: 3 kategori saja (tukang jahit/permak, servis AC, mebel/furnitur), 50+ entri hasil seed, dan form submit.
- Halaman "Tentang" + tombol donasi.
- Target metrik: 100 rekomendasi tukang, 1.000 pengunjung/bulan.

**Fase 2 – Komunitas (bulan 3–5)**
- Tambah kategori (bengkel, laundry, tukang kunci, sol sepatu, servis HP).
- Badge verifikasi, tombol "masih buka?", dan Duta Kecamatan.
- Jadwal feri statis + kalender event via form.
- Sponsor lokal pertama + kartu pos/stiker.

**Fase 3 – Budaya & Cerita (bulan 6–9)**
- Scrollytelling Barelang, Peta Kampung Tua (kolaborasi dengan komunitas/LAM bila memungkinkan), dan kamus Melayu Kepri crowdsourced.
- "Batam Dulu vs Sekarang": kampanye pengumpulan foto lama.

**Fase 4 – Main-main & Skala (bulan 10+)**
- Batam Vibe Map, Hujan Bingo, generator kartu pos.
- Harga pangan + panduan layanan publik.
- Pindah ke Supabase penuh, akun pengguna ringan, dan PWA/notifikasi hujan.

## Recommendations

1. **Mulai dari Tukang Langganan + peta, bukan dari budaya.** Fitur budaya itu cantik, tapi yang membuat orang balik setiap minggu adalah utilitas: hujan, feri, dan tukang. Budaya jadi "alasan untuk betah".
2. **Jangan bersaing dengan Sejasa/Google Maps.** Posisikan Batam City Hall sebagai "rekomendasi dari mulut ke mulut yang dibukukan", dengan cerita, nama pemberi rekomendasi, dan tanggal cek.
3. **Kurasi lebih penting daripada volume.** 100 tukang yang benar-benar bagus mengalahkan 2.000 listing hasil scrape.
4. **Pakai peta hibrida (OSM + doodle overlay)**, jangan menggambar seluruh peta dengan tangan. Hemat ratusan jam dan tetap akurat.
5. **Hati-hati dengan humor.** Di kota multietnis dan dengan isu sensitif (Kampung Tua, Rempang), lelucon harus soal cuaca, macet, dan makanan, bukan soal kelompok orang. Pelajaran dari Hoodmaps: label crowdsourced bisa berubah jadi stereotip rasis kalau tidak dimoderasi.
6. **Cantumkan atribusi BMKG dan OSM di setiap layer.** Ini wajib menurut ketentuan data BMKG.

## Caveats

- Saya tidak menemukan direktori tukang komunitas di Indonesia/Batam yang terdokumentasi. Klaim "celah pasar" adalah inferensi dari ketiadaan bukti, bukan survei pasar.
- Jumlah Kampung Tua berbeda antarsumber (33, 36, 37, sampai 134 bila hinterland dihitung) karena perbedaan definisi dan tahun. Sebut sumber dan tahunnya kalau menampilkan angka.
- Jadwal feri berubah-ubah dan antarsumber (Tempo, redBus, batam.com) sering tidak sama. Perpindahan terminal ke Singapore Cruise Centre pada Juli 2026 bersumber dari batam.com (situs panduan, bukan operator resmi), jadi verifikasi ke operator sebelum ditampilkan.
- Belum terkonfirmasi langsung apakah Kota Batam muncul di filter kabupaten/kota Panel Harga Pangan (situsnya memuat data via JavaScript). Kemungkinan besar ada karena cakupannya 514 kabupaten/kota, tapi cek dulu.
- Detail metodologi dan pendanaan Recyclopedia.sg dan Bangsar portal belum terverifikasi.
- Angka-angka Front Porch Forum (235.000 rumah tangga, 16.000 bisnis, 48%) berasal dari FPF sendiri dan mitra hibahnya, bukan audit independen.

## Daftar sumber
- neonsigns — https://www.neonsigns.hk/?lang=en
- danvk — https://www.danvk.org/2015/06/04/launched-oldnyc.html
- Substack — https://mainstreetjournal.substack.com/p/how-the-front-porch-enriches-vermont
- trustforciviclife — https://trustforciviclife.org/grantees/example-grantee-1/
- bmkg — https://data.bmkg.go.id/prakiraan-cuaca/
- bmkg — https://peta-maritim.bmkg.go.id/public_api/perairan
- bmkg — https://data.bmkg.go.id/peringatan-dini-cuaca/
- bmkg — https://api.bmkg.go.id/gempabumi
- google — https://play.google.com/store/apps/details?id=com.panelhargapangan.app&hl=en_US
- singaporecruise — https://singaporecruise.com.sg/schedule/ferries/
- hyperallergic — https://hyperallergic.com/152810/saving-the-memory-of-hong-kongs-neon-before-it-goes-dark/
- betalist — https://betalist.com/startups/hoodmaps
- informationisbeautifulawards — https://www.informationisbeautifulawards.com/showcase/1932-hoodmaps
- santamonicasun — https://santamonicasun.com/local-news/crowdsourced-map-stereotypes-santa-monica/
- pudding — https://pudding.cool/2018/03/neighborhoods/
- pudding — https://pudding.cool/2018/12/3d-cities-story/
- datainnovation — https://datainnovation.org/2018/12/mapping-population-sizes-as-3d-mountains/
- kontinentalist — https://kontinentalist.com/about
- nightingaledvs — https://nightingaledvs.com/kontinentalist-journalists-visual-stories/
- kontinentalist — https://studio.kontinentalist.com/work
- linkedin — https://www.linkedin.com/company/manual-jakarta
- manual — https://manual.co.id/directory/
- steadyhandmaps — https://steadyhandmaps.com/
- russellshawdesign — https://russellshawdesign.com/illustrated-city-guides
- awwwards — https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/
- awwwards — https://www.awwwards.com/inspiration/interactive-map-navigation
- newgeography — https://www.newgeography.com/content/00943-online-neighborhood-the-front-porch-forum
- frontporchforum — https://frontporchforum.com/media/article02
- frontporchforum — https://frontporchforum.com/media/article82
- robertmaudlin — https://robertmaudlin.com/Tradesmen%20Recommendations%20Feb.%202013.pdf
- Substack — https://emiliapetrarca.substack.com/p/the-repair-month-google-doc-is-here
- putthison — https://putthison.com/a-tailoring-directory/
- keepscotlandbeautiful — https://www.keepscotlandbeautiful.org/media/ojzhw0yr/luct-hrd.pdf
- repaircafe — https://www.repaircafe.org/en/visit/
- repaircafe — https://www.repaircafe.org/en/api/
- repairkopitiam — https://repairkopitiam.sg/about
- sl2impact — https://sl2impact.org/projects/project-repair-kopitiam/
- nea — https://www.nea.gov.sg/our-services/waste-management/donation-resale-and-repair-channels
- recyclopedia — https://recyclopedia.sg/resources?section=Repair
- bangsar — https://www.bangsar.net.my/directory-listings/page/62/?view=list&wpbdp_sort=-field-1
- sejasa — https://www.sejasa.com/
- navi — https://navi.id/10-rekomendasi-tukang-jahit-yang-ada-di-kota-jambi/
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689483994/sejarah-10-kampung-tua-di-batam-jejak-orang-ladi-hingga-bugis-di-tanah-melayu?page=all
- antaranews — https://kepri.antaranews.com/berita/60967/mengenal-kampung-tua-batam
- stpn — http://repository.stpn.ac.id/232/1/18%20Permasalahan%20Penguasaan%20Tanah%20Perkampungan.pdf
- batam — https://mediacenter.batam.go.id/2019/04/01/menteri-atr-dengarkan-aspirasi-masyarakat-kampung-tua/
- jantungmelayu — https://jantungmelayu.co/2017/03/36-titik-kampung-tua-yang-disebut-cagar-budaya-batam-menolak-bayar-uwto/
- batam-island-info — https://batam-island-info.com/barelang-islands.html
- ragamtour — https://www.ragamtour.com/6-six-barelang-bridge/
- steemit — https://steemit.com/history/@aaupvote/history-of-barelang-bridge-batam-a457ce832e46
- batam — https://batam.com/blog/how-to-get-from-singapore-to-batam-the-complete-guide
- tempo — https://en.tempo.co/read/2081085/batam-singapore-ferry-guide-2026-schedule-and-ticket-prices
- redbus — https://www.redbus.sg/ferry-tickets/singapore-to-batam-centre
- redbus — https://www.redbus.sg/ferry-tickets-online/majestic-fast-ferry-schedule
- github — https://github.com/infoBMKG/data-gempabumi
- protomaps — https://docs.protomaps.com/pmtiles/maplibre
- antoniogioia — https://www.antoniogioia.com/protomaps-open-source-single-file-maps
- snorpey — https://snorpey.codes/en/articles/selfhosted-openstreetmaps-widgets-with-protomaps
- medium — https://medium.com/@erica.scaduto/building-a-mapping-application-with-open-source-tools-and-cost-effective-hosting-15b1a8f06100
- github — https://github.com/digidem/maplibre-storymap
- github — https://github.com/OroraTech/scrolly-maplibre
- github — https://github.com/SulthanAndyno/quakelog
- bmkg — https://api.bmkg.go.id/prakiraan-cuaca
- github — https://github.com/isyraqawwaluthorid/Flutter-Gempa-Terkini
- badanpangan — https://dev-panelharga.badanpangan.go.id/harga-eceran
- univbatam — https://ejurnal.univbatam.ac.id/index.php/Potensi/article/download/1217/996
- unp — http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564
- batam — https://webarchive.batam.go.id/humas.com/01/index-2685.html
