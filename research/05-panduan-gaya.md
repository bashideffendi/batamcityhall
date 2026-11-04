# Batam City Hall: Panduan Gaya dan Design Tokens Peta Laut
> task_id: wf-758f4152-ff9a-54eb-9ec5-2bd1b4fe7099

# Batam City Hall: Panduan Gaya & Design Tokens "Peta Laut"

Kesimpulan utamanya: arah "peta laut" ini bisa dibuat elegan dan legal sekaligus. Ambil tata bahasa visual chart Admiralty 1840-an dan peta Belanda 1847 yang memang domain publik. Pakai palet kertas–tinta–biru-abu–terakota yang dipatok ke warna tinta Riso asli, dan pasangan font OFL dengan Source Serif 4 sebagai tulang punggung. Alasannya, Source Serif 4 adalah salah satu sedikit serif gratis yang punya small caps asli, angka tabular, dan optical size.

## TL;DR

- **Visual:** pinjam elemen dari chart Admiralty "Straits of Singapore, Durian and Rhio" (1840/1846, domain publik di NLB Singapura) dan "Kaart van de Noordkust van het Eiland Bantang" (1847, KITLV Leiden). Hindari aset David Rumsey sebagai tekstur produksi karena lisensinya CC BY-NC-SA, yang bersifat menular (ShareAlike).
- **Sistem:** Source Serif 4 (judul, small caps, angka) + Plus Jakarta Sans (isi, karya Tokotype, Indonesia) + IBM Plex Mono (data). Paletnya kertas #F4EFE4, tinta #1C1B19, laut #4E6A7A, dan terakota #A2482A untuk teks atau Riso Copper #BD6439 untuk dekor. Semua pasangan teks sudah dihitung lolos WCAG AA.
- **Eksekusi:** pakai grain sebagai PNG/WebP kecil yang di-tile, bukan `feTurbulence` live. Label MapLibre tidak bisa memakai small caps OpenType, jadi pakai huruf kapital + letter-spacing. Jauhi perisai, keris, Jembatan Barelang, dan kombinasi merah-kuning-hijau, karena itu milik lambang resmi Pemko Batam.

---

## Ringkasan arah visual

Bayangkan sebuah chart pelayaran 1846 dicetak ulang oleh studio risograph di Tanjung Uma lalu dipajang di museum kecil. Darat berwarna kertas gading, laut biru-abu yang pudar, garis kedalaman tipis, dan bakau berupa arsiran pendek. Label tempat ditulis dalam serif kapital kecil dengan spasi lega, ada koordinat di tepi dengan garis 1°N yang diberi aksen, dan satu-satunya warna "panas" adalah terakota senja Barelang. Di mode malam semua dibalik: garis krem di atas biru dongker, seperti chart yang dibaca dengan lampu kabin.

Tiga prinsip yang mengikat semuanya:
1. **Satu keluarga tinta.** Warna web, layer peta, dan mural semuanya diambil dari padanan tinta Riso, sehingga tidak ada warna "digital" yang nyasar.
2. **Data selalu mono.** Jam feri, tinggi ombak, dan "terakhir dicek" selalu memakai monospace dengan angka tabular. Ini cara halus untuk bilang "ini fakta, bukan hiasan".
3. **Ornamen = garis, bukan gambar.** Motif Melayu hadir sebagai garis 0,75–1 px, pembatas, atau sudut kartu. Tidak ada clip-art, tidak ada gradasi emas.

Legenda status: **[V]** = sudah saya verifikasi dari sumber yang bisa dicek dalam riset ini. **[A]** = asumsi, pengetahuan umum yang belum dicek ulang di riset ini, atau rekomendasi desain saya sendiri.

---

## 1. Referensi peta laut & peta lama

### Sumber utama dan status lisensi

| Sumber | Apa yang relevan | Lisensi / status pakai | Status |
|---|---|---|---|
| **NLB Singapore (BookSG / Rare Maps)**: "Straits of Singapore, Durian and Rhio", Hydrographic Office of Admiralty, 1840, ukiran J & C Walker | Chart Admiralty yang mencakup Selat Singapura, Durian, dan Riau. Halaman katalognya mencantumkan "Copyright: Public domain" | Domain publik | [V] |
| **NLB**: edisi 1846 dengan judul yang sama, "from the several surveys of Captn. Daniel Ross, 1827… Rio Strait by Lieut.s Dittl of Tjassens Royal Dutch Navy 1843… corrected by J. T. Thomson Government surveyor at Singapore 1846" | Deskripsinya menyebut "Battam Island", Galang, dan pulau-pulau bakau. Ini kandidat terbaik untuk referensi gaya "chart Batam" | Status hak cipta edisi ini tidak terlihat di cuplikan, jadi cek di halaman itemnya. Karena terbit 1846, kemungkinan besar domain publik | [V] / [A] untuk status |
| **KITLV / Leiden University Libraries**: "Kaart van de Noordkust van het Eiland Bantang [i.e. Batam]", 1847, E.H. Boom (survei 1846), Jacob Swart, T. Ettling, diterbitkan Commissie tot Verbetering der Oost-Indische Zeekarten, Amsterdam | Pesisir utara Batam dengan Belakangpadang, Sambu, Tanjung Pinggir, Kampong Nongsa, Tring, Jodoe, Mentarau | Kebijakan Leiden: gambar tanpa hak cipta "can be freely downloaded and reused under a CC-BY license". Pada Public Domain Day 2026 (7 Jan 2026), Leiden melepas sekitar delapan ratus item tambahan yang bisa diunduh bebas. Item domain publik bisa disaring lewat filter "use and reproduction" | [V] |
| **KITLV Maps** (koleksi) | Menurut halaman "Maps (KITLV)" di Leiden Digital Collections, koleksinya sekitar 16.000 lembar peta dan 500 atlas. Diperkirakan 80% tentang Indonesia dan sekitar 5% tentang Suriname serta bekas Antillen Belanda. Sekitar 8.000 lembar sudah daring | Sama seperti di atas, tapi cek label "use and reproduction" per item | [V] |
| **David Rumsey Map Collection** | Chart dan atlas maritim dunia, cocok untuk referensi mawar angin dan kartusis | Gambar digital berlisensi CC BY-NC-SA 3.0. Halaman Copyright and Permissions-nya membolehkan pemakaian "without charge for personal use or in any publication… by any for profit or non profit publisher". Izin baru diminta untuk faksimile cetak yang dijual, dan kredit yang diminta adalah "David Rumsey Map Collection, David Rumsey Map Center, Stanford University Libraries". Peta pasca-1929 mungkin masih berhak cipta | [V] |
| **Atlas of Mutual Heritage / Nationaal Archief** (peta VOC, misalnya seri VEL) | Peta pena VOC dengan tag "compass / dial" dan "anchorage" | Banyak salinannya ada di Wikimedia Commons. Cek lisensi per file | [V] sebagian |

**Rekomendasi lisensi:**
- Untuk **tekstur produksi**, misalnya potongan arsiran laut atau mawar angin yang di-vektorkan ulang, pakai item NLB berstatus "Public domain" atau item Leiden berlabel Public Domain/CC-BY, lalu tulis atribusi di halaman Kolofon.
- Rumsey **jangan dipakai sebagai aset produksi**. ShareAlike berarti turunanmu (misalnya tekstur kertas yang diolah) wajib dirilis dengan lisensi yang sama. Ini merepotkan kalau suatu hari situsnya punya donasi atau merchandise. Rumsey cukup jadi moodboard. [V untuk lisensi, A untuk penilaian risiko]
- Gowest.id dan bintorosuryo.com memuat potongan peta 1847 dengan kredit "Universiteit Leiden/koleksi pribadi". **Ambil langsung dari Leiden**, jangan dari blog. [V]

### Elemen yang bisa dipinjam (dan cara menerjemahkannya)

- **Kartusis (cartouche):** judul peta dalam bingkai garis ganda tipis. Versi Batam City Hall berupa persegi panjang dengan garis luar 1 px dan garis dalam 0,5 px berjarak 3 px, isinya judul serif kapital kecil, subjudul italic, dan "Skala 1 : 25.000" dalam mono. Tanpa ornamen keriting. [A]
- **Mawar angin:** cukup panah utara 8 titik versi minimal, garis 0,75 px, dengan satu ujung utara diisi terakota. Taruh di pojok peta, bukan di logo. [A]
- **Skala batang:** batang hitam-putih berselang (0–1–2 km dan nautical mile), angka mono. Ini fungsional dan sekaligus sangat "chart". [A]
- **Garis kedalaman (isobath):** chart Admiralty memakai angka sounding kecil berserakan dan garis titik-titik untuk kontur dangkal. Di MapLibre ini berupa garis putus halus 0,5 px dengan opacity 40–60%. Angka sounding bisa jadi easter egg di zoom tinggi. [A]
- **Arsiran:** garis horizontal rapat di sepanjang pantai (waterlining) adalah ciri chart abad ke-19. Bisa dibuat dengan 2–3 garis offset dari pantai (`line-offset`) yang makin pudar ke laut. [A]
- **Tipografi peta lama:** nama laut dan selat dalam italic berspasi lebar, nama pulau dalam kapital, nama kampung dalam roman kecil. Hierarki ini langsung dipakai untuk aturan label (lihat bagian 3). [A, berdasarkan konvensi kartografi]
- **Warna:** chart abad ke-19 pada dasarnya monokrom: tinta hitam di kertas krem, kadang dengan sapuan biru atau kuning tangan. Ini membenarkan palet terbatas. [A]
- **Graticule/koordinat tepi:** strip tepi berselang hitam-putih tiap 1′ dengan label derajat. Garis **1°N** memotong Batam bagian utara, jadi beri label khusus "1°00′ U" dengan warna aksen. [A, posisinya perlu dicek dengan data]

---

## 2. Estetika Melayu & Kepri tanpa kitsch

### Motif

| Motif | Makna yang umum dikutip | Cara pakai halus | Status |
|---|---|---|---|
| **Pucuk rebung** | Harapan baik atau terus tumbuh. Selalu ada sebagai kepala kain atau tumpal songket | Deret segitiga runcing garis tunggal 0,75 px sebagai **pembatas section** (tinggi 8–12 px). Bentuknya diulang, bukan diisi | [V, sumber lemah] |
| **Awan larat** | Awan bersambung yang ditiup angin. Disebut "corak yang paling dimuliakan" dalam ukir Melayu | Satu sulur spiral di **sudut kartu label museum** (maksimal 24 px), atau sebagai garis ombak alternatif di mode Mural | [V, sumber lemah] |
| **Itik pulang petang / itik sekawan** | Itik berjalan beriringan pulang ke kandang, melambangkan kerukunan dan ketertiban | Ikon **loading/antrean** (3 itik garis berjalan pelan) dan pembatas di halaman Loket 03 Tukang Langganan. Jenaka yang kalem | [V, sumber lemah] / ide [A] |
| **Selembayung** | Hiasan bersilang di ujung perabung atap | Bentuk siluet untuk **ikon "rumah/tentang"** atau puncak frame kartu | [V, sumber lemah] |
| **Lebah bergayut, kaluk pakis, sayap layang-layang** | Dipakai pada ukiran bangunan | Cadangan pola untuk footer atau halaman 404 | [V, sumber lemah] |

Catatan sumber: makna motif di atas berasal dari beberapa materi presentasi pelajar di SlideShare dan blog edukasi yang isinya saling konsisten. Untuk teks publik di situs, **verifikasi ulang** ke LAM Kepri, Dinas Kebudayaan, atau buku Tenas Effendy tentang ornamen Melayu (belum saya cek). [A]

### Huruf Jawi Riau-Lingga
- **Konteks terverifikasi:** proyek British Library **EAP153 "Riau manuscripts: the gateway to the Malay intellectual world"** menyebut Pulau Penyengat sebagai pusat budaya buku tempat Raja Ali Haji (1809–1873) hidup dan berkarya. Menurut halaman proyek EAP153, 13 koleksi di 4 pulau didigitalkan menjadi sekitar 8.000 foto dari 450 item. Salinannya disimpan di British Library, NLB Singapura, Perpusnas RI, dan Yayasan Manuskrip Nusantara. Hibahnya (2007, £11.272) dipegang Dr Jan van der Putten dari National University of Singapore. [V]
- Percetakan kerajaan **Mathba'ah al-Riauwiyah** mencetak di Penyengat, misalnya sebuah terbitan tahun 1313 H / 1895 M. Rujukan akademisnya Jan van der Putten, "Printing in Riau: Two Steps Toward Modernity" (BKI 153, 1997). [V]
- **Tahun berdiri Rusydiah Klub tidak konsisten antarsumber** (1880, 1885, 1892, 1895). Tulis saja "akhir abad ke-19". [V untuk konfliknya]
- **Cara pakai:** jangan memakai font "Arab-Melayu" dekoratif untuk UI. Pakai Jawi hanya sebagai **aksen tipografis kecil**, misalnya nama Loket dalam Jawi berukuran kecil di bawah judul Latin (seperti teks bilingual di label museum), dan hanya setelah dicek penutur atau ahli Jawi. Font Naskh OFL seperti Noto Naskh Arabic atau Amiri (asumsi, belum dicek dukungan huruf Jawi seperti ڠ ڤ ۏ ڽ ݢ) harus diuji dulu. [A]

### Perahu & arsitektur
- **Pompong, sampan, jong:** gambar dengan garis profil samping saja, tanpa bayangan, untuk ikon rute feri/pompong dan penanda pelabuhan rakyat. Jong layar tanja bisa jadi ilustrasi pembuka mode Mural. [A]
- **Rumah limas & rumah panggung pesisir:** tiang-tiang di atas air adalah motif garis vertikal ritmis yang sempurna untuk **pola pembatas** ("tiang pelantar"), lebih orisinal daripada ornamen ukir. [A]

---

## 3. Tipografi

### Pasangan yang direkomendasikan

**Pasangan A, "Arsip" (rekomendasi utama)**
- **Display & label: Source Serif 4** (Frank Grießhammer, Adobe, OFL-1.1). Variable dengan sumbu `opsz` 8–60 dan `wght` 200–900. Fiturnya mencakup `smcp`, `c2sc`, `tnum`, `onum`, `frac`, dan `zero`. File variable TTF upstream sekitar 1.181 KB (roman) dan 835 KB (italic), jadi **wajib di-subset** ke Latin dan diubah ke WOFF2. [V]
- **Isi: Plus Jakarta Sans** (Gumpita Rahayu / Tokotype, foundry Indonesia, OFL). Variable ExtraLight–ExtraBold dengan italic. Awalnya dipesan 6616 Studio untuk identitas +Jakarta City of Collaboration (2020). Google Fonts menyebut x-height-nya "slightly taller" dengan counter terbuka, jadi bagus untuk HP. [V]
- **Data: IBM Plex Mono** (OFL, punya italic dan banyak bobot). [A, lisensi dan fiturnya belum dicek di riset ini]

**Pasangan B, "Majalah" (lebih berkarakter)**
- **Display: Fraunces** (Undercase Type: Phaedra Charles & Flavia Zimbardi, OFL-1.1). Sumbu `opsz` 9–144, `wght` 100–900, `SOFT` 0–100, `WONK` 0–1. **Kelemahannya: tidak ada small caps dan tidak ada angka tabular**, dan bobot default-nya 900 kalau tidak diset. Untuk kesan elegan, set `SOFT 0`, `WONK 0`, dan `opsz` maksimal. [V]
- Isi tetap Plus Jakarta Sans. Data pakai **JetBrains Mono** (OFL, [A]).
- Small caps tetap diambil dari Source Serif 4, atau diganti kapital + tracking.

**Pasangan C, "Museum"**
- **Display: EB Garamond** (OFL, ada di Google Fonts; fiturnya mencakup `smcp`, `c2sc`, `tnum`, `onum`, `swsh`) [V]
- **Isi/UI: Cooper Hewitt** (Chester Jenkins, dipesan Pentagram untuk Cooper Hewitt, Smithsonian Design Museum; OFL; sudah diunduh lebih dari 25.000 kali). Sans kondensed yang sangat "label museum". Kurang nyaman untuk paragraf panjang di HP, jadi lebih cocok untuk UI dan label. [V] / penilaian keterbacaan [A]
- Data: IBM Plex Mono.

**Opsi Indonesia lain:** Tokotype juga punya Fonetika & Fonetika Mono (2024) dan Frasa, tapi ini font **retail/komersial**, bukan OFL. Jangan dipakai tanpa lisensi. [V untuk keberadaannya, A untuk status lisensinya, cek di tokotype.com]

### Matriks pemeriksaan

| Font | Small caps asli | Angka tabular | Variable | HP | Cocok untuk PBF MapLibre |
|---|---|---|---|---|---|
| Source Serif 4 | Ya [V] | Ya [V] | Ya (opsz, wght) [V] | Baik di opsz kecil [A] | Ya, ekspor instance statis dulu [A] |
| Fraunces | Tidak [V] | Tidak [V] | Ya (4 sumbu) [V] | Hanya judul [A] | Ya, tapi karakter "wonky" mengganggu di peta [A] |
| Plus Jakarta Sans | — | Perlu dicek [A] | Ya (wght) [V] | Baik [V/A] | Ya [A] |
| EB Garamond | Ya [V] | Ya [V] | Ya di Google Fonts [A] | Kecil-kecil agak tipis [A] | Ya [A] |
| Cooper Hewitt | Tidak [A] | Perlu dicek [A] | Tidak (statis 100–800) [V] | UI saja [A] | Ya [A] |
| IBM Plex Mono / JetBrains Mono | — | Monospace = tabular | JetBrains ya, Plex statis [A] | Baik [A] | Tidak perlu |

### Catatan MapLibre (penting untuk Claude Code)
- Konversi TTF/OTF ke glyph PBF memakai **maplibre/font-maker** (web app di maplibre.org/font-maker) atau, di CI, GitHub Action **linz/action-build-pbf-glyphs**. Hasilnya di-host statis, lalu style diarahkan ke `"glyphs": "/glyphs/{fontstack}/{range}.pbf"`. [V]
- Protomaps menyediakan **basemaps-assets** dengan Noto Sans Regular/Medium/Italic. Repo itu sendiri menyarankan kamu memelihara repo font sendiri untuk font kustom. [V]
- **Batasan kunci:** font-maker memetakan "1 codepoint ke 1 glyph". Artinya fitur OpenType seperti `smcp` **tidak akan jalan di label peta**. Solusinya: pakai `text-transform: uppercase` + `text-letter-spacing: 0.12–0.2` (em) dengan Source Serif 4 Semibold di ukuran lebih kecil. Ini jadi "pseudo small caps" yang di peta tetap terlihat seperti chart. [V untuk batasan, A untuk solusi]
- Ekspor dulu **instance statis** dari variable font (misalnya `SourceSerif4-Semibold`, `SourceSerif4-It`, `PlusJakartaSans-Medium`) dengan fontTools `varLib.instancer` sebelum dikonversi. Batasi range ke Latin (0-255, 256-511, 8192-8447) supaya ringan. [A]
- Hierarki label peta: **laut/selat** = Source Serif 4 Italic, warna laut, tracking 0,2. **Pulau** = Semibold kapital, tracking 0,15. **Kampung/kelurahan** = Regular campuran huruf, 11–12 px. **POI** = Plus Jakarta Sans Medium 11 px. [A]

### Skala tipografi

| Token | Desktop (≥1024 px) | HP (≤480 px) | Line-height | Letter-spacing | Font |
|---|---|---|---|---|---|
| `display` | 72 px | 40 px | 1.02 | -0.02em | Serif, opsz 60, wght 400 |
| `h1` | 52 px | 32 px | 1.08 | -0.015em | Serif 400 |
| `h2` | 36 px | 26 px | 1.15 | -0.01em | Serif 500 |
| `h3` | 26 px | 21 px | 1.25 | 0 | Serif 600 |
| `kicker` (Loket 01) | 13 px | 12 px | 1.2 | 0.14em | Serif `smcp` / kapital |
| `body-lg` (lede) | 21 px | 18 px | 1.5 | 0 | Sans 400 |
| `body` | 18 px | 16 px | 1.6 | 0 | Sans 400 |
| `small` | 15 px | 14 px | 1.5 | 0.005em | Sans 400 |
| `caption` | 13 px | 12.5 px | 1.4 | 0.02em | Sans 500 |
| `data` | 15 px | 14 px | 1.4 | 0 | Mono 400, `tnum` |
| `data-lg` (jam feri besar) | 40 px | 30 px | 1.0 | -0.01em | Mono 300 |

Panjang baris isi 60–72 karakter (`max-width: 38rem`). [A]

---

## 4. Warna

### Tinta Riso sebagai jangkar
Semua hex berikut adalah padanan **perkiraan** tinta RISO resmi menurut stencil.wiki. Ingat, tinta Riso itu semi-transparan dan hasil aslinya tergantung kertas. Lab lain bahkan memakai hex berbeda untuk nama yang sama; contohnya, BYU Print Lab memakai Bright Red #CC231F, sementara stencil.wiki memakai #F15060. [V]

| Tinta Riso | Hex (stencil.wiki) | Peran di Batam City Hall |
|---|---|---|
| Black | #000000 | tidak dipakai murni. Tinta UI #1C1B19 |
| Riso-Federal Blue | #3D5588 | laut dalam di mode Mural |
| Medium Blue | #3255A4 | cadangan, jarang dipakai |
| Teal | #00838A | tidak dipakai (terlalu jenuh) |
| Lagoon | #2F6F65 | bakau/hutan di Mural |
| Hunter Green | #407060 | status "aman/normal" |
| Copper | #BD6439 | **aksen terakota senja Barelang** (dekor/teks besar) |
| Brick | #A75154 | alternatif aksen yang lolos AA (4,64:1 di atas kertas) |
| Flat Gold | #BB8B41 | pasir/tanah di Mural, jangan untuk UI |
| Charcoal | #70747C | garis sekunder |
| Granite | #A5AAA8 | garis graticule malam |
| Indigo | #484D7A | bayangan Mural malam |
| Bisque | #F2CDCF | rona senja tipis di Mural |

**Aturan Mural:** maksimal 3 tinta per panel (misalnya Federal Blue + Copper + Charcoal di atas kertas #F4EFE4), overprint dengan `mix-blend-mode: multiply`, dan tanpa warna di luar tabel ini. [A]

### Palet UI, mode siang

| Token | Hex | Pakai | Kontras di atas #F4EFE4 |
|---|---|---|---|
| `paper` | #F4EFE4 | latar & darat | — |
| `paper-2` | #EBE4D5 | kartu, panel | — |
| `ink` | #1C1B19 | teks utama | **15,0 : 1** ✓ AAA |
| `ink-muted` | #5A564E | teks sekunder | **5,9 : 1** ✓ AA |
| `sea-ink` | #4E6A7A | link, label air | **5,0 : 1** ✓ AA |
| `accent` | #A2482A | teks aksen, link aktif | **5,2 : 1** ✓ AA |
| `accent-riso` | #BD6439 | dekor, angka besar ≥24 px | 3,6 : 1 (khusus teks besar) |
| `rule` | #CFC6B4 | garis pemisah | non-teks |
| `status-ok` | #407060 | aman/buka | **4,9 : 1** ✓ AA |
| `status-caution` | #7A5C0E | waspada (ombak sedang) | **5,4 : 1** ✓ AA |
| `status-danger` | #9E2B25 | bahaya (feri batal) | **6,5 : 1** ✓ AA |
| `status-info` | #4E6A7A | info | 5,0 : 1 ✓ |

### Palet UI, mode "chart malam"

| Token | Hex | Kontras di atas #0F1B2A |
|---|---|---|
| `paper` (latar/laut) | #0F1B2A | — |
| `paper-2` (darat/kartu) | #16263A | — |
| `ink` (krem) | #EDE4CF | **13,7 : 1** ✓ |
| `ink-muted` | #A9A493 | **7,0 : 1** ✓ |
| `sea-ink` | #7FA3B5 | **6,5 : 1** ✓ |
| `accent` | #E08A63 | **6,6 : 1** ✓ |
| `status-ok` | #8FC1A0 | **8,5 : 1** ✓ |
| `status-caution` | #E3C26B | **10,1 : 1** ✓ |
| `status-danger` | #F08C80 | **7,2 : 1** ✓ |

Rasio di atas saya hitung sendiri dengan rumus relative luminance WCAG 2.x [V untuk metode, hitungan manual]. Tetap cek ulang di WebAIM Contrast Checker sebelum rilis. Status peringatan **selalu** disertai ikon + kata ("WASPADA", "BATAL"), jangan pernah hanya warna. Terakota dan merah bahaya sengaja dibuat berbeda kecerahannya (#A2482A vs #9E2B25 tidak cukup beda bagi buta warna, jadi label kata itu wajib). [A]

### Layer peta

| Layer | Siang | Malam |
|---|---|---|
| Darat | #F4EFE4 | #16263A |
| Laut | #DCE3E1 | #0F1B2A |
| Laut dangkal (0–5 m) | #E6EBE7 | #132235 |
| Garis kedalaman | #8FA5B0, 0,5 px, opacity 0,6 | #EDE4CF, opacity 0,25 |
| Waterlining pantai | #4E6A7A, opacity 0,35→0,1 | #EDE4CF, opacity 0,3→0,08 |
| Bakau (pola arsir) | #7C8C6E | #8FA597 opacity 0,5 |
| Hutan (pola arsir) | #9AA38A | #6F8577 opacity 0,4 |
| Jalan utama | #B9AE98 | #3A4A5C |
| Jalan minor | #D8CFBD | #26364A |
| Bangunan | isi #E7DFCF, garis #BFB4A0 | isi #1B2C41, garis #33465C |
| Rute feri | #A2482A, putus 4-3 | #E08A63 |
| Graticule & 1°N | #8B8579 (1°N: #A2482A) | #A5AAA8 (1°N: #E08A63) |
| Label air | #4E6A7A, halo #DCE3E1 | #7FA3B5, halo #0F1B2A |
| Label darat | #1C1B19, halo #F4EFE4 | #EDE4CF, halo #16263A |

[A: rekomendasi desain]

---

## 5. Tekstur & efek cetak

**Temuan kunci [V]:** `feTurbulence` live itu mahal. Pengguna GitHub ngmanhtruong menuliskannya dalam Issue #6 "Investigating Scroll Jank: SVG feTurbulence & GPU Rasterization at high FPS" di repo ngmanhtruong.github.io: grain `feTurbulence` membuat scrolling patah-patah dengan blok Paint/Rasterization besar, dan masalahnya hilang setelah beralih ke `background-image: url(noise.webp)` yang di-repeat. Panduan lain menyebut grain statis via data-URI yang dirasterisasi sekali dan di-cache "nearly free after first paint". Biayanya naik kalau filter dipasang di elemen besar, `numOctaves` tinggi, dan terutama kalau grain dianimasikan.

**Resep yang disarankan:**
1. **Grain kertas:** satu tile WebP abu 256×256 px (target <15 KB), dipasang di `body::before { position: fixed; inset: 0; pointer-events: none; background: url(/tex/grain-256.webp); opacity: .06; mix-blend-mode: multiply; }`. Di mode malam pakai `opacity: .05; mix-blend-mode: screen` dengan tile terang. [A]
2. **Serat kertas:** satu tile 512 px dari scan kertas CC0, didesaturasi dan dibuat high-pass. Sumbernya publicdomainpictures.net "Paper texture" (CC0, 1.280×900, 0,77 MB, "Attribution is not required") atau koleksi CC0 rawpixel. Tile ini **diproses dan dikompres**, bukan dipakai mentah. [V untuk lisensi]
3. **Halftone:** untuk ilustrasi Mural, tanam halftone langsung di aset (diekspor dari Illustrator/Affinity atau dithering dengan script), bukan filter CSS. Untuk aksen UI kecil boleh `radial-gradient` dengan `background-size: 4px 4px`. [A]
4. **Misregistration Riso:** per layer ilustrasi SVG, beri offset `transform: translate(0.6px, -0.4px)` pada layer warna kedua dan `mix-blend-mode: multiply`. Offsetnya statis, **tidak dianimasikan**. [A]
5. **Grain di peta:** jangan taruh grain di atas canvas MapLibre (menambah compositing tiap frame saat pan). Cukup grain halaman di luar peta. Kalau ingin peta terasa "kertas", pakai `fill-pattern` dari sprite kecil untuk darat. [A]
6. **Hormati pengguna:** `@media (prefers-reduced-motion)` mematikan semua transisi ilustrasi. `@media (prefers-reduced-data)` / `saveData` mematikan tekstur sama sekali. [A]

**Dampak di Android kelas menengah [A]:** satu overlay `position: fixed` dengan tile kecil biasanya aman. Yang bikin berat adalah filter SVG live di area besar, `backdrop-filter`, dan blend mode di atas canvas WebGL. Uji di Chrome DevTools dengan CPU throttling 4× dan Paint flashing, plus satu HP asli (misalnya kelas Redmi Note).

---

## 6. Gaya ilustrasi & ikon

### Aturan garis [A]
- **Ikon UI:** grid 24 px, stroke 1,25 px, ujung `round`, sambungan `round`, tanpa isi. Satu-satunya isi yang boleh adalah titik aksen terakota.
- **Ilustrasi landmark (kartu):** stroke 0,75 px untuk detail dan 1,25 px untuk siluet luar. Arsiran 45° untuk sisi bayangan, jarak 2–3 px. Tidak ada gradasi.
- **Panorama Mural:** 3 bobot garis (0,5 / 1 / 1,75 px pada skala 1×), maksimal 3 tinta Riso, dan area warna sebagai bidang datar dengan halftone.

### Cara menggambar
- **Landmark (gaya arsitek):** perspektif satu atau dua titik, garis konstruksi tipis dibiarkan sedikit melewati sudut (overshoot 2–4 px) seperti sketsa arsitek, orang berupa siluet kecil untuk skala.
- **Pohon:** awan garis putus-putus (scallop) untuk tajuk, batang dua garis. **Bakau:** akar tunjang berupa lengkung "ʌ" berulang di garis air.
- **Air:** garis horizontal terputus dengan jarak makin rapat ke cakrawala. Ini gaungan waterlining di peta, supaya peta dan Mural satu bahasa.
- **Atap ruko (Nagoya, Jodoh, Tanjung Uma):** garis atap datar dengan lis, kanopi, papan nama sebagai persegi kosong (jangan menulis merek), AC outdoor sebagai kotak kecil. Itu detail lucu yang jujur.

### Ilustrator yang bisa diajak bicara
- **Tidak ditemukan komunitas "Urban Sketchers Batam" yang bisa diverifikasi** (Instagram, Flickr, maupun berita). Jangan cantumkan handle yang belum pasti. Payung terdekatnya **Indonesia's Sketchers** (@indonesia_sketchers, afiliasi @usk.jakarta, sekitar 12 ribu pengikut). [V]
- **Singapura (paling dekat secara geografis dan gaya):**
  - **Don Low**, ilustrator dan komikus, salah satu pendiri USk Singapore dan koresponden Urban Sketchers. Bekerja dengan pena & tinta, termasuk dip pen (donlowsketcher.com). [V]
  - **Tia Boon Sim**, arsitek lulusan University of Singapore (1979) yang memimpin komunitas USk Singapore. [V]
  - **Shruti Balaji**, anggota USk Singapore yang membuat sketsa pena gedung heritage (shrutibalaji.com/Urban-Sketch). [V]
  - **Marvin Chew, Vu Hoa Giang (arsitek), Pocholo Estremos, Lisa Huang, Chua Hee Lai, Tan Chit Seng**, yang karyanya dimuat NLB BiblioAsia "Sketches of Singapore" (2015). Grup ini rutin sketchwalk tiap Sabtu terakhir bulanan. [V]
  - Grup Flickr **USk Singapore** (flickr.com/groups/usksg). [V]
- **Batam:** festival grafiti internasional "Wave of Wall" (April 2026, Nagoya Citywalk, art director Revino Arena) menunjukkan ada ekosistem seniman jalanan lokal. Ini grafiti, bukan garis halus, tapi bisa jadi pintu jejaring. [V]
- **Kontinentalist** (Singapura) bekerja dengan ilustrator seperti Griselda Gabriele dan punya pedoman ilustrasi internal yang ketat. Ini referensi standar kerja sama ilustrator–data. [V]
- Saran praktis [A]: buat open call kecil "Gambar Batam dalam 0,5 mm" lewat Instagram, beri brief 1 halaman (aturan garis di atas + 3 tinta), dan bayar honor yang layak walau proyeknya non-komersial.

---

## 7. Referensi website premium & pola yang ditiru

| Situs | Pola yang dipinjam | Status |
|---|---|---|
| **Kontinentalist** (kontinentalist.com) | Studio data storytelling Singapura (berdiri 2017, 100+ cerita). Scrollytelling peta, ilustrasi menggantikan foto untuk topik sensitif, kredit lengkap di akhir cerita (Code / Data / Design / Illustration). **Tiru blok kredit** untuk halaman Loket | [V] |
| **Cooper Hewitt** (cooperhewitt.org) | Satu typeface yang dipakai dari label objek sampai situs. Data koleksi CC0, font OFL. **Tiru semangat "open source"** dengan halaman Kolofon yang merilis tokens dan font | [V] |
| **The Pudding** (pudding.cool) | Esai visual satu topik per halaman, intro besar, interaksi minimal tapi bermakna | [A] |
| **Zolima CityMag** (zolimacitymag.com) & **Saigoneer** (saigoneer.com) | Media kota Saigon: nada hangat, kategori jelas, ilustrasi lokal. Contoh "majalah kota" Asia Tenggara | [A] |
| **M+** (mplus.org.hk) | Label objek bilingual dengan hierarki rapi: nama, tahun, medium, nomor akses | [A] |
| **Rijksmuseum** (rijksmuseum.nl, Rijksstudio) | Zoom gambar resolusi tinggi dan narasi detail. Analog langsung untuk **OpenSeadragon mode Mural** | [A] |

### Pola konkret untuk komponen [A]

**Kartu label museum (tempat):**
```
┌──────────────────────────────────────┐
│ LOKET 02 · MAKAN              No. 017 │  ← kicker smcp + nomor mono
│                                       │
│ Mi Lendir Pak Atan                    │  ← h3 serif
│ Jodoh, Batu Ampar                     │  ← italic serif, sea-ink
│ ───────────────────────────────────── │  ← rule 0.5px + pucuk rebung mini
│ Mi kuning, kuah kacang kental.        │  ← body sans
│ Antre sebelum jam 9.                  │
│                                       │
│ BUKA   06.30–11.00     1°08′U 104°00′T│  ← data mono, tnum
│ DICEK  2026-10-28                     │
└──────────────────────────────────────┘
```
Contoh di atas fiktif. Kartu tanpa bayangan, garis 1 px `rule`, radius 2 px, sulur awan larat di pojok kanan atas pada `hover`.

**Strip navigasi:** satu baris tipis di atas (tinggi 44 px) berisi wordmark di kiri, "Loket 01–07" dalam smcp di tengah (bisa digeser di HP), dan tombol siang/malam di kanan dengan ikon bulan sabit garis. Di HP, menu dibuka sebagai **daftar isi majalah** layar penuh: nomor besar mono, judul serif, satu baris deskripsi jenaka.

**Tombol layer peta:** pakai legenda chart, bukan toggle bergaya iOS. Tiap layer berupa baris dengan **swatch pola** (kotak 16 px berisi arsiran bakau, putus-putus feri) + nama smcp + checkbox persegi 14 px. Posisi di kiri bawah, dibingkai kartusis.

**Halaman Loket:** pembuka berupa nomor raksasa ("02") dalam serif 160 px warna `accent-riso` opacity 0,9, judul, lede 1 kalimat, lalu grid 12 kolom (desktop) / 4 kolom (HP) dengan kartu label. Di akhir ada blok "Kolofon Loket" berisi sumber, tanggal dicek, dan penyusun.

**Gerak:** fade + translate 8 px, `cubic-bezier(0.2, 0, 0, 1)`, 240–420 ms. Peta `flyTo` dengan `speed: 0.6`, `curve: 1.2`. Tanpa spring, tanpa bounce, tanpa parallax berlebihan.

---

## 8. Logo & wordmark "Batam City Hall"

**Yang wajib dihindari (lambang resmi, Perda Kota Batam No. 3 Tahun 2001) [V]:** bentuk **perisai/tameng**, bintang, **keris Melayu**, **gelombang lima lapis**, **perahu dendang**, **Jembatan Barelang**, pita merah bertulisan, dan rantai 45 mata. Warna utamanya merah–kuning–hijau dengan pendukung hitam–putih–biru. Logo Hari Jadi Batam ke-196 (2025) memakai **biru tua, kuning emas, merah**.

Konsekuensinya [A]:
- **Jangan** pakai emas/kuning, perisai, keris, atau siluet Barelang di logo. (Barelang boleh muncul sebagai ilustrasi di Loket, bukan sebagai emblem.)
- Wajib ada disclaimer di footer: "Proyek warga, independen, bukan situs resmi Pemerintah Kota Batam. Untuk layanan resmi: batam.go.id."
- Kata "City Hall" berpotensi disalahpahami sebagai kantor resmi. Imbangi dengan tagline seperti "Balai warga, bukan balai kota" atau "Loket informasi tidak resmi".

**Arah yang disarankan [A]:**
1. **Wordmark arsip:** "BATAM CITY HALL" dalam Source Serif 4 smcp tracking 0,12em, di bawahnya baris mono kecil "1°08′ U · 104°03′ T · EST. 2026". Rasanya seperti cap katalog perpustakaan. (Koordinat perlu dicek.)
2. **Emblem stempel bulat:** lingkaran garis ganda tipis (seperti cap pos atau stempel arsip, bukan perisai) berisi mawar angin minimal dan tulisan melingkar. Satu warna, tinta atau terakota.
3. **Monogram "BCH"** dalam kartusis persegi panjang kecil untuk favicon. Tiga huruf dalam bingkai garis ganda, terbaca di 16 px.

Referensi semangat: identitas Cooper Hewitt (wordmark yang menjadi typeface publik) [V]. Untuk proyek kota indie lain (stempel arsip, cap pos) belum saya cari secara spesifik, jadi telusuri sendiri di Fonts In Use atau Brand New dengan kata kunci "civic", "archive", "postal". [A]

---

## 9. Nada tulisan (microcopy)

### Prinsip [A]
- **Fakta dulu, lelucon sesudahnya, dan leluconnya maksimal satu klausa.** Kalau dihapus, informasinya harus tetap utuh.
- Kalimat pendek. Subjek konkret (nama tempat, jam, angka). Humor datang dari **pengamatan**, bukan dari kata seru.
- Kering dan jujur soal ketidakpastian: "Kami cek tanggal 28 Oktober. Setelah itu, Tuhan dan pemilik warung yang tahu."

### Contoh pola

| Konteks | Bahasa Indonesia | English |
|---|---|---|
| Cuaca lokal | Sekupang kering. Batam Centre tidak. | Sekupang is dry. Batam Centre is not. |
| Ombak | Ombak 1,5 m. Pompong ke Belakangpadang tetap jalan, perut belum tentu. | 1.5 m swell. The pompong runs; your stomach may not. |
| Feri | Feri 10.30 ke HarbourFront: sesuai jadwal. Paspor: tanggung jawab Anda. | 10:30 to HarbourFront: on time. Passport: your department. |
| Data lama | Terakhir dicek 3 minggu lalu. Anggap ini sejarah lisan. | Last checked 3 weeks ago. Treat as oral history. |
| Kosong / 404 | Halaman ini tenggelam. Kemungkinan di sekitar 1°N. | This page sank. Somewhere near 1°N. |
| Memuat | Itik sedang berbaris… | The ducks are lining up… |
| Tukang langganan | Datang Selasa dan Jumat. Kalau hujan, Rabu. Kalau hujan lagi, sabar. | Tuesdays and Fridays. Wednesdays if it rains. If it rains again, patience. |
| Error | Peta gagal dimuat. Laut masih ada, kami saja yang belum. | The map didn't load. The sea's still there; we're not. |

Semua contoh di atas adalah draf saya [A]. Untuk kalibrasi nada, baca kolom pendek di media kota seperti Saigoneer dan Zolima (belum saya analisis secara spesifik di riset ini).

### Daftar hindari
- Tanda seru berderet, huruf kapital untuk berteriak, emoji di judul.
- Kata-kata promosi wisata: "surga tersembunyi", "wajib dikunjungi", "hits", "instagramable", "kekinian", "healing".
- Bahasa birokrasi: "dalam rangka", "guna", "sehubungan dengan", "dihimbau".
- Lelucon yang merendahkan kelompok (pendatang, Orang Laut, buruh pabrik, Singapura sebagai "tetangga sombong").
- Lelucon soal bencana, kecelakaan laut, atau banjir **saat sedang terjadi**. Peringatan cuaca aktif ditulis lurus tanpa candaan.
- Bahasa campur yang dipaksakan ("so basically guys"). Pilih satu bahasa per kalimat.

---

## Moodboard (link referensi, dikelompokkan)

**Peta laut & peta lama**
- NLB, Straits of Singapore, Durian and Rhio (1840): https://www.nlb.gov.sg/main/book-detail?cmsuuid=f787c30d-eeba-49db-af72-5bd381e20e0f
- NLB, edisi 1846 (Ross/Thomson): https://www.nlb.gov.sg/main/book-detail?cmsuuid=24890515-4953-4ee8-a557-0d3310a95ff0
- BiblioAsia, "Searching for Singapore in Old Maps and Sea Charts": https://biblioasia.nlb.gov.sg/vol-11/issue-1/apr-jun-2015/search-sg-old-map/
- Leiden, Maps (KITLV): https://digitalcollections.universiteitleiden.nl/maps-kitlv
- Leiden, aturan pakai gambar: https://www.library.universiteitleiden.nl/special-collections/using-special-collections
- Leiden, Public Domain Day 2026: https://www.library.universiteitleiden.nl/news/2026/01/celebrate-free-access-public-domain-day-2026
- Konteks peta 1847 (GoWest): https://gowest.id/peta-pesisir-utara-pulau-bantang-i-e-batam/
- David Rumsey, hak cipta: https://www.davidrumsey.com/about/copyright-and-permissions

**Melayu, Jawi, Kepri**
- British Library EAP153, Riau manuscripts: https://eap.bl.uk/project/EAP153
- Van der Putten, "Printing in Riau" (JSTOR): https://www.jstor.org/stable/27865396
- Kompas, Tamadun Melayu di Penyengat: https://www.kompas.id/artikel/mengingat-tamadun-melayu-di-pulau-penyengat/
- Jantung Melayu, Rusydiah Club: https://jantungmelayu.co/2018/09/taman-penghiburan-rusydiah-club-riouw-pulau-penyengat-tahun-1895/

**Tipografi & peta**
- Plus Jakarta Sans: https://fonts.google.com/specimen/Plus+Jakarta+Sans/about
- Fraunces (axes): https://github.com/undercasetype/Fraunces
- Source Serif 4 (fitur & ukuran): https://fontsource.org/fonts/source-serif-4/about
- Cooper Hewitt typeface: https://www.cooperhewitt.org/open-source-at-cooper-hewitt/
- MapLibre font-maker: https://github.com/maplibre/font-maker
- Protomaps basemaps-assets: https://github.com/protomaps/basemaps-assets
- Protomaps docs (glyphs): https://docs.protomaps.com/basemaps/maplibre
- LINZ action build PBF glyphs: https://github.com/linz/action-build-pbf-glyphs

**Warna & cetak**
- stencil.wiki, tinta Riso: https://stencil.wiki/wiki/Category:Riso_inks
- BYU Print Lab (pembanding hex): https://printlab.byu.edu/riso

**Tekstur & performa**
- Studi kasus scroll jank feTurbulence: https://github.com/ngmanhtruong/ngmanhtruong.github.io/issues/6
- CSS-Tricks, pola feTurbulence: https://css-tricks.com/creating-patterns-with-svg-filters/
- Kertas CC0: https://www.publicdomainpictures.net/en/view-image.php?image=3558&picture=paper-texture

**Ilustrasi & sketsa**
- Don Low: http://www.donlowsketcher.com/
- Urban Sketchers, instruktur: https://urbansketchers.org/instructors/
- Shruti Balaji: https://shrutibalaji.com/Urban-Sketch
- BiblioAsia, Sketches of Singapore: https://biblioasia.nlb.gov.sg/vol-11/issue-2/jul-sep-2015/sketches-of-singapore/
- USk Singapore (Flickr): https://www.flickr.com/groups/usksg/
- Indonesia's Sketchers: https://www.instagram.com/indonesia_sketchers/

**Editorial & museum**
- Kontinentalist: https://kontinentalist.com/about
- The Pudding: https://pudding.cool · Zolima: https://zolimacitymag.com · Saigoneer: https://saigoneer.com · M+: https://www.mplus.org.hk · Rijksmuseum: https://www.rijksmuseum.nl [A, belum dibuka di riset ini]

**Larangan logo**
- Lambang Kota Batam (Bagian Umum Pemko): https://bagumum.batam.go.id/lambang-pemerintah-kota-batam/
- Logo HJB ke-196: https://mediacenter.batam.go.id/2025/11/20/pemko-batam-luncurkan-logo-resmi-hjb-ke-196-wali-kota-ajak-warga-turut-memeriahkan/

---

## Design tokens

### CSS custom properties

```css
/* Batam City Hall — design tokens v0.1 */
:root {
  /* ---------- Warna: siang ---------- */
  --bch-paper: #F4EFE4;
  --bch-paper-2: #EBE4D5;
  --bch-paper-3: #E2D9C6;
  --bch-ink: #1C1B19;
  --bch-ink-muted: #5A564E;
  --bch-sea-ink: #4E6A7A;
  --bch-accent: #A2482A;        /* teks aksen, AA */
  --bch-accent-riso: #BD6439;   /* Riso Copper: dekor / teks ≥24px */
  --bch-rule: #CFC6B4;
  --bch-rule-strong: #8B8579;
  --bch-focus: #A2482A;

  --bch-status-ok: #407060;      /* Riso Hunter Green */
  --bch-status-caution: #7A5C0E;
  --bch-status-danger: #9E2B25;
  --bch-status-info: #4E6A7A;
  --bch-status-ok-bg: #E3EAE2;
  --bch-status-caution-bg: #F1E7CC;
  --bch-status-danger-bg: #F3DCD6;

  /* Layer peta */
  --bch-map-land: #F4EFE4;
  --bch-map-water: #DCE3E1;
  --bch-map-shallow: #E6EBE7;
  --bch-map-depth-line: #8FA5B0;
  --bch-map-waterline: #4E6A7A;
  --bch-map-mangrove: #7C8C6E;
  --bch-map-forest: #9AA38A;
  --bch-map-road-major: #B9AE98;
  --bch-map-road-minor: #D8CFBD;
  --bch-map-building: #E7DFCF;
  --bch-map-building-line: #BFB4A0;
  --bch-map-ferry: #A2482A;
  --bch-map-graticule: #8B8579;
  --bch-map-1n: #A2482A;

  /* Tinta Riso (mural) — perkiraan hex stencil.wiki */
  --riso-federal-blue: #3D5588;
  --riso-copper: #BD6439;
  --riso-brick: #A75154;
  --riso-lagoon: #2F6F65;
  --riso-hunter-green: #407060;
  --riso-flat-gold: #BB8B41;
  --riso-charcoal: #70747C;
  --riso-granite: #A5AAA8;
  --riso-indigo: #484D7A;
  --riso-bisque: #F2CDCF;

  /* ---------- Tipografi ---------- */
  --bch-font-serif: "Source Serif 4", "Source Serif Pro", Georgia, serif;
  --bch-font-display: var(--bch-font-serif); /* alt: "Fraunces" */
  --bch-font-sans: "Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --bch-font-mono: "IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace;

  --bch-text-display: clamp(2.5rem, 1.2rem + 5.2vw, 4.5rem);
  --bch-text-h1: clamp(2rem, 1.1rem + 3.6vw, 3.25rem);
  --bch-text-h2: clamp(1.625rem, 1.2rem + 1.7vw, 2.25rem);
  --bch-text-h3: clamp(1.3125rem, 1.1rem + 0.8vw, 1.625rem);
  --bch-text-lede: clamp(1.125rem, 1rem + 0.5vw, 1.3125rem);
  --bch-text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --bch-text-small: clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem);
  --bch-text-caption: 0.8125rem;
  --bch-text-kicker: 0.8125rem;
  --bch-text-data: clamp(0.875rem, 0.85rem + 0.1vw, 0.9375rem);
  --bch-text-data-lg: clamp(1.875rem, 1.4rem + 1.9vw, 2.5rem);

  --bch-leading-tight: 1.05;
  --bch-leading-heading: 1.15;
  --bch-leading-body: 1.6;
  --bch-leading-data: 1.4;

  --bch-tracking-display: -0.02em;
  --bch-tracking-heading: -0.01em;
  --bch-tracking-kicker: 0.14em;
  --bch-tracking-caption: 0.02em;

  --bch-measure: 38rem;

  /* ---------- Spasi (basis 4px) ---------- */
  --bch-space-1: 0.25rem;
  --bch-space-2: 0.5rem;
  --bch-space-3: 0.75rem;
  --bch-space-4: 1rem;
  --bch-space-5: 1.5rem;
  --bch-space-6: 2rem;
  --bch-space-7: 3rem;
  --bch-space-8: 4rem;
  --bch-space-9: 6rem;
  --bch-space-10: 8rem;
  --bch-gutter: clamp(1rem, 0.5rem + 2vw, 2rem);

  /* ---------- Garis, radius, bayangan ---------- */
  --bch-stroke-hair: 0.5px;
  --bch-stroke-fine: 0.75px;
  --bch-stroke-base: 1px;
  --bch-stroke-icon: 1.25px;
  --bch-radius-0: 0;
  --bch-radius-1: 2px;
  --bch-radius-2: 4px;
  --bch-radius-pill: 999px; /* hanya untuk chip status */
  --bch-shadow-none: none;
  --bch-shadow-paper: 0 1px 0 rgba(28, 27, 25, 0.06), 0 2px 6px -2px rgba(28, 27, 25, 0.08);
  --bch-shadow-lift: 0 8px 24px -12px rgba(28, 27, 25, 0.18);

  /* ---------- Gerak ---------- */
  --bch-ease: cubic-bezier(0.2, 0, 0, 1);
  --bch-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --bch-dur-instant: 120ms;
  --bch-dur-fast: 240ms;
  --bch-dur-base: 420ms;
  --bch-dur-slow: 700ms;
  --bch-dur-map: 1600ms;
  --bch-shift: 8px;

  /* ---------- Tekstur ---------- */
  --bch-grain-url: url("/tex/grain-256.webp");
  --bch-grain-opacity: 0.06;
  --bch-grain-blend: multiply;
  --bch-riso-offset-x: 0.6px;
  --bch-riso-offset-y: -0.4px;
}

/* ---------- Mode "chart malam" ---------- */
:root[data-theme="night"] {
  --bch-paper: #0F1B2A;
  --bch-paper-2: #16263A;
  --bch-paper-3: #1D3048;
  --bch-ink: #EDE4CF;
  --bch-ink-muted: #A9A493;
  --bch-sea-ink: #7FA3B5;
  --bch-accent: #E08A63;
  --bch-accent-riso: #E08A63;
  --bch-rule: #2C3E54;
  --bch-rule-strong: #A5AAA8;
  --bch-focus: #E08A63;

  --bch-status-ok: #8FC1A0;
  --bch-status-caution: #E3C26B;
  --bch-status-danger: #F08C80;
  --bch-status-info: #7FA3B5;
  --bch-status-ok-bg: #18332C;
  --bch-status-caution-bg: #3A3220;
  --bch-status-danger-bg: #3E2226;

  --bch-map-land: #16263A;
  --bch-map-water: #0F1B2A;
  --bch-map-shallow: #132235;
  --bch-map-depth-line: rgba(237, 228, 207, 0.25);
  --bch-map-waterline: rgba(237, 228, 207, 0.3);
  --bch-map-mangrove: #8FA597;
  --bch-map-forest: #6F8577;
  --bch-map-road-major: #3A4A5C;
  --bch-map-road-minor: #26364A;
  --bch-map-building: #1B2C41;
  --bch-map-building-line: #33465C;
  --bch-map-ferry: #E08A63;
  --bch-map-graticule: #A5AAA8;
  --bch-map-1n: #E08A63;

  --bch-shadow-paper: 0 1px 0 rgba(0, 0, 0, 0.3);
  --bch-shadow-lift: 0 8px 24px -12px rgba(0, 0, 0, 0.5);

  --bch-grain-url: url("/tex/grain-256-light.webp");
  --bch-grain-opacity: 0.05;
  --bch-grain-blend: screen;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="day"]) { color-scheme: dark; }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --bch-dur-fast: 0ms;
    --bch-dur-base: 0ms;
    --bch-dur-slow: 0ms;
    --bch-dur-map: 0ms;
    --bch-shift: 0px;
  }
}

/* Utilitas tipografi */
.bch-kicker {
  font-family: var(--bch-font-serif);
  font-variant-caps: all-small-caps; /* smcp + c2sc, Source Serif 4 */
  letter-spacing: var(--bch-tracking-kicker);
  font-size: var(--bch-text-kicker);
}
.bch-data {
  font-family: var(--bch-font-mono);
  font-variant-numeric: tabular-nums slashed-zero;
  font-size: var(--bch-text-data);
  line-height: var(--bch-leading-data);
}
.bch-display {
  font-family: var(--bch-font-display);
  font-optical-sizing: auto;
  font-size: var(--bch-text-display);
  line-height: var(--bch-leading-tight);
  letter-spacing: var(--bch-tracking-display);
  font-weight: 400; /* Fraunces default 900 — selalu set eksplisit */
}
```

### Versi JSON

```json
{
  "color": {
    "day": {
      "paper": "#F4EFE4", "paper-2": "#EBE4D5", "paper-3": "#E2D9C6",
      "ink": "#1C1B19", "ink-muted": "#5A564E", "sea-ink": "#4E6A7A",
      "accent": "#A2482A", "accent-riso": "#BD6439",
      "rule": "#CFC6B4", "rule-strong": "#8B8579", "focus": "#A2482A",
      "status": { "ok": "#407060", "caution": "#7A5C0E", "danger": "#9E2B25", "info": "#4E6A7A",
                  "ok-bg": "#E3EAE2", "caution-bg": "#F1E7CC", "danger-bg": "#F3DCD6" },
      "map": { "land": "#F4EFE4", "water": "#DCE3E1", "shallow": "#E6EBE7", "depth-line": "#8FA5B0",
               "waterline": "#4E6A7A", "mangrove": "#7C8C6E", "forest": "#9AA38A",
               "road-major": "#B9AE98", "road-minor": "#D8CFBD", "building": "#E7DFCF",
               "building-line": "#BFB4A0", "ferry": "#A2482A", "graticule": "#8B8579", "1n": "#A2482A" },
      "contrastOnPaper": { "ink": 15.0, "ink-muted": 5.9, "sea-ink": 5.0, "accent": 5.2,
                           "accent-riso": 3.6, "ok": 4.9, "caution": 5.4, "danger": 6.5 }
    },
    "night": {
      "paper": "#0F1B2A", "paper-2": "#16263A", "paper-3": "#1D3048",
      "ink": "#EDE4CF", "ink-muted": "#A9A493", "sea-ink": "#7FA3B5",
      "accent": "#E08A63", "accent-riso": "#E08A63",
      "rule": "#2C3E54", "rule-strong": "#A5AAA8", "focus": "#E08A63",
      "status": { "ok": "#8FC1A0", "caution": "#E3C26B", "danger": "#F08C80", "info": "#7FA3B5",
                  "ok-bg": "#18332C", "caution-bg": "#3A3220", "danger-bg": "#3E2226" },
      "map": { "land": "#16263A", "water": "#0F1B2A", "shallow": "#132235",
               "depth-line": "rgba(237,228,207,0.25)", "waterline": "rgba(237,228,207,0.3)",
               "mangrove": "#8FA597", "forest": "#6F8577", "road-major": "#3A4A5C", "road-minor": "#26364A",
               "building": "#1B2C41", "building-line": "#33465C", "ferry": "#E08A63",
               "graticule": "#A5AAA8", "1n": "#E08A63" },
      "contrastOnPaper": { "ink": 13.7, "ink-muted": 7.0, "sea-ink": 6.5, "accent": 6.6,
                           "ok": 8.5, "caution": 10.1, "danger": 7.2 }
    },
    "riso": { "federal-blue": "#3D5588", "copper": "#BD6439", "brick": "#A75154", "lagoon": "#2F6F65",
              "hunter-green": "#407060", "flat-gold": "#BB8B41", "charcoal": "#70747C",
              "granite": "#A5AAA8", "indigo": "#484D7A", "bisque": "#F2CDCF" }
  },
  "font": {
    "family": {
      "serif": "'Source Serif 4', 'Source Serif Pro', Georgia, serif",
      "display": "'Source Serif 4', Georgia, serif",
      "display-alt": "Fraunces",
      "sans": "'Plus Jakarta Sans', system-ui, sans-serif",
      "mono": "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
      "map": { "island": ["Source Serif 4 Semibold"], "water": ["Source Serif 4 Italic"], "poi": ["Plus Jakarta Sans Medium"] }
    },
    "size": {
      "display": ["72px", "40px"], "h1": ["52px", "32px"], "h2": ["36px", "26px"], "h3": ["26px", "21px"],
      "kicker": ["13px", "12px"], "lede": ["21px", "18px"], "body": ["18px", "16px"], "small": ["15px", "14px"],
      "caption": ["13px", "12.5px"], "data": ["15px", "14px"], "data-lg": ["40px", "30px"],
      "_format": "[desktop, mobile]"
    },
    "lineHeight": { "tight": 1.05, "heading": 1.15, "body": 1.6, "data": 1.4 },
    "letterSpacing": { "display": "-0.02em", "heading": "-0.01em", "kicker": "0.14em", "caption": "0.02em", "mapIsland": 0.15, "mapWater": 0.2 },
    "measure": "38rem"
  },
  "space": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "24px", "6": "32px", "7": "48px", "8": "64px", "9": "96px", "10": "128px" },
  "stroke": { "hair": "0.5px", "fine": "0.75px", "base": "1px", "icon": "1.25px" },
  "radius": { "0": "0", "1": "2px", "2": "4px", "pill": "999px" },
  "shadow": {
    "day": { "paper": "0 1px 0 rgba(28,27,25,0.06), 0 2px 6px -2px rgba(28,27,25,0.08)", "lift": "0 8px 24px -12px rgba(28,27,25,0.18)" },
    "night": { "paper": "0 1px 0 rgba(0,0,0,0.3)", "lift": "0 8px 24px -12px rgba(0,0,0,0.5)" }
  },
  "motion": {
    "ease": "cubic-bezier(0.2, 0, 0, 1)", "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
    "duration": { "instant": "120ms", "fast": "240ms", "base": "420ms", "slow": "700ms", "map": "1600ms" },
    "shift": "8px", "mapFlyTo": { "speed": 0.6, "curve": 1.2 }
  },
  "texture": {
    "grain": { "day": ["/tex/grain-256.webp", 0.06, "multiply"], "night": ["/tex/grain-256-light.webp", 0.05, "screen"] },
    "risoOffset": { "x": "0.6px", "y": "-0.4px" }
  }
}
```

---

## Boleh & Jangan

### Desain
**Boleh**
- Garis 0,5–1,25 px, arsiran, waterlining, skala batang, graticule dengan 1°N.
- Maksimal 3 tinta Riso per ilustrasi, overprint `multiply`, misregistration statis kurang dari 1 px.
- Small caps asli (Source Serif 4) untuk kicker, dan angka tabular untuk semua data.
- Motif Melayu sebagai garis pembatas atau sudut kartu dengan ukuran kecil.
- Ruang kosong berlimpah, satu ide per layar.
- Atribusi lengkap peta lama di halaman Kolofon.

**Jangan**
- `feTurbulence` live di area besar, grain beranimasi, atau `backdrop-filter` di atas peta.
- Gradasi emas, kuning-merah-hijau, perisai, keris, atau siluet Barelang sebagai logo.
- Ornamen Melayu penuh warna sebagai wallpaper, atau font "Arab-Melayu" dekoratif untuk UI.
- Tekstur dari David Rumsey atau blog untuk aset produksi.
- Animasi bounce/spring, parallax berat, atau kursor kustom.
- Status yang hanya dibedakan lewat warna.
- Teks terakota #BD6439 di bawah 24 px.

### Tulisan
**Boleh**
- Kalimat pendek, fakta dulu, satu lelucon kering paling banyak.
- Menyebut tanggal "terakhir dicek" di setiap data.
- Jujur soal ketidakpastian dengan nada santai.
- Nama tempat lokal yang spesifik (Tanjung Uma, Sekupang, Belakangpadang).

**Jangan**
- "Surga tersembunyi", "wajib dikunjungi", "hits", "instagramable", "healing".
- Tanda seru berderet, emoji di judul, huruf kapital untuk berteriak.
- Bercanda saat peringatan cuaca atau kecelakaan sedang aktif.
- Lelucon yang merendahkan kelompok mana pun.
- Bahasa birokrasi ("dalam rangka", "dihimbau").

---

## Caveats: terverifikasi vs asumsi

**Terverifikasi dalam riset ini [V]:** lisensi NLB, Leiden, dan Rumsey; data peta 1847; hex Riso stencil.wiki; fitur Source Serif 4, Fraunces, Plus Jakarta Sans, Cooper Hewitt; batasan font-maker dan aset Protomaps; masalah performa `feTurbulence`; lambang resmi Kota Batam dan logo HJB ke-196; EAP153 dan Mathba'ah al-Riauwiyah; nama sketcher Singapura; tidak ditemukannya USk Batam.

**Masih asumsi / perlu dicek [A]:**
- Lisensi dan fitur IBM Plex Mono & JetBrains Mono. Angka tabular di Plus Jakarta Sans. Status variable EB Garamond di Google Fonts. Status lisensi retail Fonetika/Frasa.
- Status hak cipta persis peta 1847 di halaman item Leiden, dan edisi NLB 1846.
- Makna motif, yang hanya bersumber dari materi pelajar. Verifikasi ke LAM Kepri atau literatur Tenas Effendy.
- Dukungan huruf Jawi pada font Naskh OFL.
- Posisi persis garis 1°N terhadap daratan Batam, dan koordinat di wordmark.
- Semua rekomendasi desain (skala, palet UI, layer peta, aturan garis, komponen, microcopy) adalah usulan saya.
- Analisis situs The Pudding, Zolima, Saigoneer, M+, dan Rijksmuseum, yang belum dibuka langsung di riset ini.
- Rasio kontras dihitung manual. Cek ulang dengan alat otomatis sebelum rilis.
- Dampak performa di HP kelas menengah harus diukur, bukan diasumsikan.

## Daftar sumber
- nlb — https://www.nlb.gov.sg/main/book-detail?cmsuuid=f787c30d-eeba-49db-af72-5bd381e20e0f
- nlb — https://www.nlb.gov.sg/main/book-detail?cmsuuid=24890515-4953-4ee8-a557-0d3310a95ff0
- gowest — https://gowest.id/peta-pesisir-utara-pulau-bantang-i-e-batam/
- unp — http://kronologi.ppj.unp.ac.id/index.php/jk/article/download/949/564
- atlasofmutualheritage — https://www.atlasofmutualheritage.nl/page/2431/map-of-the-north-coast-of-java-with-neighbouring-islands
- legalgenealogist — https://www.legalgenealogist.com/2020/12/23/the-joy-of-david-rumsey/
- gowest — https://gowest.id/mereka-yang-bersumpah-jadi-terasing-di-tanah-batam/
- slideshare — https://www.slideshare.net/slideshow/motif-dan-ukiran-melayu-riau-armel/33188572
- wordpress — https://ombuno21.wordpress.com/2013/03/26/motif-khas-riau/
- slideshare — https://www.slideshare.net/slideshow/motif-dan-ukiran-melayu/32447783
- slideshare — https://www.slideshare.net/slideshow/motif-ukiran-melayu-riau-31258587/31258587
- slideshare — https://www.slideshare.net/tikha12/motif-dan-ukiran-melayu-riau-32086679
- slideshare — https://www.slideshare.net/slideshow/ragam-kreasi-motif-corak-dan-ukiran-tradisonal-melayu-riau-nazhiira-saputra-xii7-pptx/274986118
- slideshare — https://slideshare.net/febiii24/motif-dan-ukiran-melayu-riau
- slideshare — https://www.slideshare.net/slideshow/motif-dan-ukiran-arab-melayu/33187651
- jantungmelayu — https://jantungmelayu.co/2018/09/taman-penghiburan-rusydiah-club-riouw-pulau-penyengat-tahun-1895/
- jstor — https://www.jstor.org/stable/27865396
- sastra-indonesia — http://sastra-indonesia.com/2010/01/menggugat-sejarah-menggugat-jakarta/
- Wikipedia — https://id.wikipedia.org/wiki/Pendidikan_di_Riau
- kompas — https://www.kompas.id/artikel/mengingat-tamadun-melayu-di-pulau-penyengat/
- riaukepri — https://www.riaukepri.com/2025/08/12/mengangkat-kembali-semangat-rusydiah-club-warisan-nilai-dalam-menghadapi-tantangan-masa-kini/
- fontsource — https://fontsource.org/fonts/source-serif-4/about
- csstypestudio — https://www.csstypestudio.com/library/font/source-serif-4
- google — https://fonts.google.com/specimen/Plus%2BJakarta%2BSans/about
- cufonfonts — https://www.cufonfonts.com/font/plus-jakarta-sans
- fontalternatives — https://fontalternatives.com/fonts/fraunces/
- csstypestudio — https://www.csstypestudio.com/library/font/fraunces
- fontaza — https://fontaza.com/fraunces-font/
- Wikipedia — https://en.wikipedia.org/wiki/EB_Garamond
- pentagram — https://www.pentagram.com/news/cooper-hewitt-a-democratic-design-identity
- cooperhewitt — https://www.cooperhewitt.org/open-source-at-cooper-hewitt/open-source-at-cooper-hewittcooper-hewitt-typeface-in-the-wild/
- x — https://x.com/tokotype?lang=en
- github — https://github.com/maplibre/font-maker
- linkedin — https://www.linkedin.com/pulse/web-maps-open-source-serverless-adam-nyx-mpt1c
- github — https://github.com/linz/action-build-pbf-glyphs
- github — https://github.com/protomaps/basemaps-assets
- mica — https://gradlab.mica.edu/RisoPrinting
- byu — https://printlab.byu.edu/riso
- stencil — https://stencil.wiki/wiki/Category:Riso_inks
- codefronts — https://codefronts.com/design-styles/tailwind-css-grain-texture/
- rawpixel — https://www.rawpixel.com/search/old%20paper%20texture
- publicdomainpictures — https://www.publicdomainpictures.net/en/view-image.php?image=3558&picture=paper-texture
- instagram — https://www.instagram.com/indonesia_sketchers/
- flickr — https://www.flickr.com/groups/usksg/?rb=1
- urbansketchers — https://urbansketchers.org/2016/02/workshop-instructor-don-low-singapore.html
- urbansketchers — https://urbansketchers.org/tag/singapore/
- urbansketchers — https://urbansketchers.org/instructors/
- shrutibalaji — https://shrutibalaji.com/Urban-Sketch
- nlb — https://biblioasia.nlb.gov.sg/vol-11/issue-2/jul-sep-2015/sketches-of-singapore/
- batampos — https://harian.batampos.co.id/2026/04/13/nagoya-citywalk-disulap-jadi-kanvas-raksasa/
- kontinentalist — https://kontinentalist.com/stories/popular-science-fiction-works-of-southeast-asia
- nightingaledvs — https://nightingaledvs.com/kontinentalist-journalists-visual-stories/
- theplot — https://www.theplot.media/p/kontinentalist
- pentagram — https://www.pentagram.com/news/preview-cooper-hewitt-smithsonian-design-museum
- cooperhewitt — https://www.cooperhewitt.org/open-source-at-cooper-hewitt/
- goodnewsfromindonesia — https://www.goodnewsfromindonesia.id/2025/02/21/lambang-kota-batam-dan-maknanya
- hstkb — https://read.hstkb.sch.id/2018/08/penjelasan-arti-lambang-logo-kota-batam.html?m=1
- batam — https://bagumum.batam.go.id/lambang-pemerintah-kota-batam/
- batam — https://mediacenter.batam.go.id/2025/11/20/pemko-batam-luncurkan-logo-resmi-hjb-ke-196-wali-kota-ajak-warga-turut-memeriahkan/
