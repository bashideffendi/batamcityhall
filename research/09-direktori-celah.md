# Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, dan Transportasi (Riset Celah, November 2026)
> task_id: wf-c44b0f7c-d7dc-821b-b2f4-992da004e4f7

# Seed Data Tambahan Batam City Hall: Layanan Publik, Kesehatan, Ibadah, dan Transportasi (Riset Celah, November 2026)

Celah terbesar yang sekarang bisa langsung diisi dengan sumber resmi adalah **kantor-kantor Pemko Batam dan instansi vertikal** (DPRD, Bapenda, Dinkes, Dinsos, Disdik, BPBD, Kemenag, KSOP, Pos SAR, Kodim, Lanud), **12 KUA kecamatan**, **6 paroki Katolik**, **Taman Makam Pahlawan**, **PMI**, **SPKLU PLN Batam**, dan **rute pompong utama ke hinterland**. Tapi hampir semua koordinat belum bisa dipastikan dari OpenStreetMap/Wikidata, jadi sebagian besar entri ditandai `perlu_diisi_user`.

## TL;DR
- Ada 65 entri baru di blok JSON, lengkap dengan alamat dan kontak kantor resmi. Sumber terkuat ada di subdomain batam.go.id, kemenag.go.id, bpbatam.go.id, plnbatam.com, dan situs Basarnas. Beberapa alamat lama yang beredar (Disdik, BPBD, Dinsos) ternyata sudah berbeda dengan situs resmi terbaru.
- Koordinat yang bisa dipakai hanya sedikit: 3 paroki (dari Wikipedia), TMP Bulan Gebang (dihitung dari plus code), dan beberapa titik dari situs direktori non-resmi. Semuanya berstatus `perlu_cek_ulang`. Koordinat lain, termasuk terminal feri Waterfront City/Teluk Senimba dan Gold Coast Bengkong, berstatus `null` dan `perlu_diisi_user`.
- Masih ada celah yang belum tersentuh riset: klinik 24 jam, lab klinik, apotek 24 jam, klinik hewan, psikolog RS, gereja Protestan, klenteng/vihara tambahan, masjid besar per kecamatan, terminal bus, pool travel, SPBU, dan UPT Trans Batam. Celah ini saya cantumkan sebagai daftar kerja, bukan sebagai data karangan.

## Ringkasan singkat

Riset ini menambah lima kelompok data: (1) layanan publik dan pemerintahan, (2) kesehatan pelengkap, (3) ibadah dan makam, (4) transportasi, (5) nomor darurat nasional yang tidak punya titik peta. Beberapa temuan penting:

- **Lanal Batam sudah tidak ada di Batam.** Markasnya diambil alih Lantamal IV, yang sekarang bernama **Kodaeral IV**. Menurut Danlantamal IV Laksma TNI Kemas M. Ikhwan kepada ANTARA Kepri, Lanal Batam bergeser ke Tanjung Uban dengan nama Lanal Bintan. Menurut Batam Pos, Lantamal IV resmi berganti nama menjadi Kodaeral IV pada 11 Agustus 2025. Jadi entri yang benar untuk peta adalah Kodaeral IV (ex-Lantamal IV) di Tanjung Sengkuang, Batu Ampar.
- **Basarnas di Batam masih berstatus Pos SAR**, di bawah Kantor Pencarian dan Pertolongan (KPP) Kelas A Tanjungpinang. Pada 7 Agustus 2026, Kepala KPP Basarnas Tanjungpinang Fazli menyebut Pos SAR Batam berpeluang naik status menjadi kantor tersendiri dengan wilayah kerja sendiri (Kantor SAR Kelas B, menurut KoranBatam). Tapi ini **belum terjadi**: usulannya baru akan diteruskan ke Kantor Pusat Basarnas setelah dokumennya lengkap.
- **Waspada situs tidak resmi.** disdikkotabatam.org ("Jl. Trans Papua"), disdikbatampemkot.com (hotline kode 021), dan bpbd.damkarbatam.com ("Provinsi Batam", nomor kode 021) **jangan dipakai**. Pakai hanya subdomain resmi `*.batam.go.id`.
- **Tarif pompong Sekupang ke Belakang Padang** naik dari Rp18.000 menjadi Rp20.000 per orang sekali jalan akibat kenaikan harga BBM. Ini disampaikan Razali, pengurus Persatuan Pengemudi Motor Sangkut, kepada Tribun Batam (5 September 2022). Menurut Kumparan/Kepripedia, tarif carter Rp160.000 untuk 1–4 orang dan Rp200.000 untuk 5–10 orang. Sejak itu belum ada sumber yang melaporkan perubahan, tapi tetap tandai "mungkin usang".
- Menurut siaran pers plnbatam.com tanggal 13 Juni 2026, **SPKLU PLN Batam** berjumlah 26 unit, setelah tambahan 3 unit ultra fast charging di Kantor Korporat PLN Batam.

## Key Findings dan Tabel per Kategori

Legenda status koordinat:
- ✅ `terverifikasi`: dari sumber resmi atau OSM/Wikidata.
- ⚠️ `perlu_cek_ulang`: dari sumber sekunder (Wikipedia, direktori pihak ketiga, plus code).
- ❓ `perlu_diisi_user`: koordinat belum ada.

Data yang sumbernya lama (sebelum 2023) atau rawan berubah ditandai "usang" di kolom atau atribut.

### A. Layanan Publik dan Pemerintahan

| Nama | Subkategori | Kecamatan | Kelurahan | Alamat | Jam/Kontak | Lat | Lng | Status | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| Kantor Wali Kota Batam | pemerintahan kota | Batam Kota | Teluk Tering | Jl. Engku Putri No.1, Batam Centre 29432 | (0778) 462164 (dari direktori pihak ketiga) | null | null | ❓ | https://apeksi.id/batam/ ; https://idalamat.com/alamat/kantor-walikota-batam-878 |
| DPRD Kota Batam (Sekretariat) | legislatif | Batam Kota | Teluk Tering | Jl. Engku Putri, Teluk Tering 29432 | (0778) 464229; setdprd@batam.go.id | 1.1265179 | 104.0552557 | ⚠️ | https://dprd.batam.go.id/kontak/ ; koordinat: https://idalamat.com/alamat/11688/kantor-dprd-kota-batam |
| Bapenda Kota Batam (PBB-P2, BPHTB, pajak daerah) | pajak daerah | Batam Kota | Teluk Tering | Gedung Bersama Pemko Batam Lt. 2, Jl. Raja Isa, Batam Centre | (0778) 470670/71/72; fax 470673; bapenda@batam.go.id; bayar online epbb.batam.go.id | null | null | ❓ | https://bapenda.batam.go.id/media-center/ |
| Dinas Perhubungan Kota Batam | dinas | Batam Kota | Sukajadi | Jl. Jend. Sudirman No.2, Sukajadi 29444 | belum ada kontak resmi terverifikasi | null | null | ❓ | https://idalamat.com/alamat/dinas-perhubungan-kota-batam-40088 ; https://webarchive.batam.go.id/humas.com/01/pdf/0915-batam-directory.pdf (usang) |
| Dinas Sosial dan Pemberdayaan Masyarakat | dinas | Sekupang | Sungai Harapan | Jl. Raja Haji No.9, Sei Harapan 29425 | (0778) 321370; dinsospm@batam.go.id | null | null | ❓ | https://dinsospm.batam.go.id/kontak/ |
| Dinas Kesehatan Kota Batam | dinas | Sekupang | Sungai Harapan | Jl. Raja Haji No.7, Sekupang | (0778) 323506; fax 321856; dinkes@batam.go.id | null | null | ❓ | https://dinkes.batam.go.id/kontak/ |
| Dinas Pendidikan Kota Batam | dinas | Sekupang | Sungai Harapan | Jl. Pramuka, Komp. Perkantoran Sekupang | (0778) 322569 / 326189; disdik@batam.go.id | 1.109933 | 103.953554 | ⚠️ | https://disdik.batam.go.id/kontak/ ; koordinat: https://idalamat.com/alamat/12417/kantor-dinas-pendidikan-kota-batam |
| Disnaker Kota Batam (cek ulang) | dinas | Sekupang | Sungai Harapan | Jl. Kartini I No.29–30, Sei Harapan 29425 | (0778) 327601 (data 2017) | null | null | ❓ | https://kepriau.com/daftar-alamat-kantor-dinas-kota-batam/ (blog, usang) |
| BPBD Kota Batam | kebencanaan | Batam Kota | perlu dicek | Shop House Orchard Park, Orchard Walk Blok D No.3, Batam Kota 29431 | (0811) 70087575; bpbd@batam.go.id | null | null | ❓ | https://bpbd.batam.go.id/kontak/ |
| Kantor Kementerian Agama Kota Batam | instansi vertikal | Sekupang | Sungai Harapan | Jl. Masjid Baiturrahman No.1, Sei Harapan | (0778) 321124; WA resmi 0822-8000-1114; kemenagkotabatam@kemenag.go.id | null | null | ❓ | https://batam.kemenag.go.id/main/ ; https://www.youtube.com/@kemenagbatam |
| KSOP Khusus Batam (Syahbandar) | pelabuhan | Sekupang | Tanjung Pinggir (perlu dicek) | Jl. RE Martadinata, Sekupang 29433 | (0778) 322333; fax 322344 | null | null | ❓ | https://www.ksopkhususbatam.id/spbb.aspx |
| Pos SAR Batam (Basarnas) | SAR | Sekupang | Tanjung Pinggir (perlu dicek) | Jl. R.E. Martadinata, Sekupang | darurat 115; KPP Tanjungpinang (0771) 319300 | null | null | ❓ | https://tanjungpinang.basarnas.go.id/berita/no-telepon-penting-22 ; https://www.datalpse.com/lelang/3121469-pembangunan-rettening-wall-pos-pencarian-dan-pertolongan-batam |
| Kodim 0316/Batam | militer (TNI AD) | Batu Ampar | Seraya | Jl. Yos Sudarso, Seraya Atas | belum ada kontak resmi | null | null | ❓ | https://id.wikipedia.org/wiki/Komando_Distrik_Militer_0316 ; https://kepripedia.com/kodim-0316-batam-ajak-wartawan-bersinergi-demi-kemajuan-kota-batam/ |
| Kodaeral IV (ex-Lantamal IV; menggantikan Lanal Batam) | militer (TNI AL) | Batu Ampar | Tanjung Sengkuang | Jl. Tamalatea, Tanjung Sengkuang 29432 | 0821-7078-4496 (tercantum di halaman kontak resmi) | null | null | ❓ | https://lantamal4-koarmada1.tnial.mil.id/contact_us/ |
| Lanud Hang Nadim (TNI AU) | militer (TNI AU) | Nongsa | Batu Besar | Jl. Hang Jebat Km 3, Batu Besar | belum ada kontak resmi | null | null | ❓ | https://www.lanudhangnadim.com/ |
| Kantor Pos Batam (KCU) | pos | Batam Kota | Sukajadi (perlu dicek) | Jl. Jend. Sudirman, Batam Centre 29444 | (0778) 462496 / 462033 (direktori pihak ketiga) | null | null | ❓ | https://idalamat.com/alamat/80618/kantor-pos-batam ; http://karimunbatam.blogspot.com/2014/08/alamat-nomor-telepon-kantor-pos-di-kota-batam-indonesia.html (usang) |
| Kantor Pos Nagoya | pos cabang | Lubuk Baja | Lubuk Baja Kota (perlu dicek) | Komp. Wijaya Kusuma Blok E No.01, Nagoya | (0778) 456726 (2014) | null | null | ❓ | blog 2014 di atas; https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam |
| Kantor Pos Jodoh | pos cabang | Batu Ampar | Sungai Jodoh | Komp. Jodoh Square Blok C No.38 | (0778) 459737 (2014) | null | null | ❓ | blog 2014 di atas |
| Kantor Pos Muka Kuning | pos cabang | Sei Beduk | Muka Kuning (perlu dicek) | Shop House Blok D 01-17 | nomor di sumber tampak salah ketik (kode 0770) | null | null | ❓ | blog 2014 di atas |
| Kantor Pos cabang lain: Batu Aji (Komp. Sentosa Perdana Blok J No.12), Mega Legenda, Botania Plaza (Batam Kota), Baloi (Jl. Bunga Raya), Tiban (Tiban Palapa Blok AA No.2) | pos cabang/agen | beragam | perlu dicek | lihat JSON | — | null | null | ❓ | https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam (usang) |
| UPT Trans Batam | transportasi kota | — | — | belum ditemukan | — | null | null | ❓ | belum ada sumber |

**KUA 12 kecamatan.** Sumber utamanya daftar resmi Kanwil Kemenag Kepri, "Alamat KUA se Prov Kepri" (https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri). Daftar ini dibuat sekitar 2017, jadi tandai **mungkin usang**. Nomor HP yang tercantum di daftar Kanwil sengaja tidak dimasukkan. Yang dicantumkan hanya nomor kantor (0778).

| Nama | Kecamatan | Kelurahan | Alamat | Kontak/Jam | Lat | Lng | Status | Sumber tambahan |
|---|---|---|---|---|---|---|---|---|
| KUA Batam Kota | Batam Kota | Belian | Komp. Perum Cendana Tahap III | (0778) 475468 | null | null | ❓ | https://kemenagbatam.com/main/detail/kua-batam-kota-siap-berikan-layanan-prima-pada-masyarakat |
| KUA Batu Aji | Batu Aji | Kibing (perlu dicek) | Jl. Suprapto, MKGR, Batu Aji | — | 1.0385515 | 103.9960996 | ⚠️ | https://idalamat.com/alamat/32814/kantor-urusan-agama-kua-kec-batu-aji-kota-batam |
| KUA Batu Ampar | Batu Ampar | Sungai Jodoh | Jl. Kuda Laut No.1 (versi lain: No.3) | (0778) 450917 | null | null | ❓ | daftar Kanwil |
| KUA Belakang Padang | Belakang Padang | perlu dicek | Jl. Hang Lekiu No.21 | (0778) 312213 | null | null | ❓ | daftar Kanwil |
| KUA Bengkong | Bengkong | Sadai | Jl. Tuah Sakti No.1 | — | null | null | ❓ | daftar Kanwil |
| KUA Bulang | Bulang | Bulang Lintang | Bulang Lintang (tanpa nama jalan) | — | null | null | ❓ | daftar Kanwil |
| KUA Galang | Galang | Sembulang | Jl. Batin Limat No.2 | — | null | null | ❓ | daftar Kanwil |
| KUA Lubuk Baja | Lubuk Baja | Baloi Indah | Belakang Perum Batu Batam Permai | — | null | null | ❓ | https://batam.kemenag.go.id/main/detail/kua-lubuk-baja-3-pekan-ini-sudah-9-pasang-pengantin-yang-menikah |
| KUA Nongsa | Nongsa | perlu dicek | Jl. Hang Kasturi No.7 | — | null | null | ❓ | daftar Kanwil |
| KUA Sagulung | Sagulung | perlu dicek | Jl. R. Suprapto No.1 (pernah menumpang di Rumah Dinas Camat; rencana pindah ke Sei Pelunggut) | (0778) 700227 | null | null | ❓ | https://batam.kemenag.go.id/main/detail/kemenag-batam-survey-lokasi-lahan-kua-kecamatan-sagulung |
| KUA Sei Beduk | Sei Beduk | Mangsang | Jl. S. Parman Pintu II, Kav. Bida Ayu, Tg. Piayu | — | null | null | ❓ | daftar Kanwil |
| KUA Sekupang | Sekupang | Sungai Harapan | Jl. Pramuka No.1 (berita 2024: Jl. Masjid Raya Baiturrahman) | (0778) 327526; Sen–Kam 07.30–16.00, Jum 07.30–16.30 | null | null | ❓ | https://www.instagram.com/kua_sekupang_batam/ |

Catatan KUA: pendaftaran nikah dilakukan lewat SIMKAH (simkah4.kemenag.go.id). Alamat KUA Batu Aji dan KUA Sagulung sama-sama disebut di "Jl. R. Suprapto". Ini perlu dicek ulang di lapangan karena bisa saja tertukar.

### B. Kesehatan Pelengkap

| Nama | Subkategori | Kecamatan | Kelurahan | Alamat | Jam/Kontak | Lat | Lng | Status | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| UPD PMI Kota Batam (donor darah) | donor darah | Batam Kota | perlu dicek | Jl. Cempaka, Batam Centre | layanan darah 24/7; (0778) 741368; WA admin donor resmi +62 811-7001-9960; markas@pmibatam.or.id | null | null | ❓ | https://updpmibatam.id/ ; https://pmibatam.or.id/ |
| Ambulans/gawat darurat 119 | nomor darurat nasional | seluruh kota | — | non-lokasi | 119 | null | null | n/a | (nomor nasional; belum diverifikasi pengelolanya di Batam) |

Celah kesehatan yang **belum diriset**: klinik 24 jam per kecamatan, Prodia/Kimia Farma/Pramita, apotek 24 jam, klinik/psikolog jiwa di RS, klinik hewan. Saya tidak menuliskan data untuk kategori ini karena tidak ada sumber yang sudah dicek. Untuk klinik jiwa, titik awal yang masuk akal adalah poli jiwa RSUD Embung Fatimah dan RS BP Batam, yang sudah ada di data RS. RS BP Batam beralamat di Jl. Cipto Mangunkusumo No.1, Tj. Pinggir, Sekupang, telp (0778) 322121.

### C. Ibadah dan Makam

| Nama | Subkategori | Kecamatan | Kelurahan | Alamat | Kontak | Lat | Lng | Status | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| Paroki Santo Petrus Lubuk Baja | gereja Katolik | Lubuk Baja | perlu dicek | belum ada alamat | — | null | null | ❓ | https://katolikdibatam.wordpress.com/about/kevikepan-kepulauan-riau/ |
| Paroki Santo Damian Bengkong | gereja Katolik | Bengkong | Bengkong Laut | Komp. Green Town, Bengkong Laut 29458 | santodamian.com | 1.1540247 | 104.0219444 | ⚠️ | https://id.wikipedia.org/wiki/Gereja_Santo_Damian,_Bengkong ; https://id.wikipedia.org/wiki/Daftar_paroki_di_Keuskupan_Pangkalpinang |
| Paroki Kerahiman Ilahi Tiban | gereja Katolik | Sekupang | Patam Lestari | Jl. Tiban III, Patam Lestari 29426 | (0778) 322886 | 1.1147716 | 103.9673676 | ⚠️ | https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/ ; Wikipedia daftar paroki |
| Paroki Maria Bunda Pembantu Abadi | gereja Katolik | Batu Aji | perlu dicek | Kavling Baru Sumber Jaya, Jl. Gereja | — | 1.0398111 | 103.9676321 | ⚠️ | https://id.wikipedia.org/wiki/Gereja_Maria_Bunda_Pembantu_Abadi,_Batu_Aji |
| Paroki Santo Hilarius Sei Beduk | gereja Katolik | Sei Beduk | Mangsang | Kavling depan Bida Ayu Blok S, Pintu 1, 29437 | — | null | null | ❓ | https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/ |
| Paroki Santo Fransiskus Asisi Kabil | gereja Katolik | Nongsa | Kabil | Jl. Raya Bumi Perkemahan, Kabil 29467 | (0778) 7100 212 | null | null | ❓ | https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/ ; https://id.wikipedia.org/wiki/Gereja_Santo_Fransiskus_Assisi,_Kabil |
| Taman Makam Pahlawan Pusara Bhakti Bulan Gebang | TMP | Batu Aji | Bukit Tempayan | Jl. Letjend Suprapto, Bukit Tempayan (plus code 2XW9+P2R) | dikelola Dinsos PM Kota Batam | 1.04686 | 103.96752 | ⚠️ | https://batam.imigrasi.go.id/berita/2022/08/rangkaian-kegiatan-hdkd-ke-77-imigrasi-batam-laksanakan-kegiatan-bersih-bersih-taman-makam-pahlawan-dan-tempat-ibadah ; https://simapankesos.com/ |

Catatan ibadah:
- Paroki MBPA Batu Aji adalah paroki ketiga di Pulau Batam (1 November 2003). Umatnya sekitar 12.000 jiwa menurut Wikipedia.
- Koordinat TMP saya hitung sendiri dari plus code 2XW9+P2R (wilayah 6PH5). Harus dicek di OSM.
- Gereja Protestan (HKBP, GBI, GPdI, GKPS, GMIM, GKI, Bethel), klenteng/vihara tambahan, dan masjid besar per kecamatan **belum diriset**.

### D. Transportasi

| Nama | Subkategori | Kecamatan | Kelurahan | Alamat | Jam/Kontak/Tarif | Lat | Lng | Status | Sumber |
|---|---|---|---|---|---|---|---|---|---|
| Pelabuhan Pancung/Pengumpan Sekupang (dermaga pompong ke Belakang Padang) | pelantar pompong | Sekupang | perlu dicek | Kawasan Pelabuhan Sekupang, Jl. RE Martadinata | 24 jam (malam pesan dulu) via PPMS; Rp20.000/orang sekali jalan; ±10–25 menit; 12 penumpang per pompong | null | null | ❓ | https://batam.tribunnews.com/2022/09/05/tarif-tiket-pompong-ke-belakangpadang-batam-naik-dampak-kenaikan-harga-bbm |
| Pelabuhan Belakang Padang | pelabuhan rakyat | Belakang Padang | perlu dicek | Pulau Belakang Padang | ke Sekupang Rp20.000; Pulau Geranting ke Belakang Padang ±1 jam, Rp140.000/orang | null | null | ❓ | https://nasional.tvrinews.com/berita/twrlaf5-pulau-belakang-padang-sebuah-permata-tersembunyi-di-wilayah-batam |
| Pelabuhan Rakyat Sagulung | pelabuhan rakyat | Sagulung | perlu dicek | Sagulung | pompong/pancung ke Pulau Buluh (±5–10 menit) dan pulau Kec. Bulang: Rp20.000 (pulau dekat) s.d. Rp25.000 (pulau jauh), data 2022 | null | null | ❓ | https://gokepri.com/kisah-warga-batam-mudik-lebaran-ke-pulau-bulang-lintang/ |
| Rute Pulau Pemping / Terong / Pecung | rute pompong | Belakang Padang | — | non-lokasi | pompong reguler sekali sehari, carter mahal (data riset lama) | null | null | n/a | https://www.researchgate.net/publication/316854142_POTRET_KEHIDUPAN_MASYARAKAT_HINTERLAND_KOTA_BATAM |
| Terminal Feri Waterfront City / Teluk Senimba | terminal feri internasional | Sekupang | Tanjung Riau | Marina City, Tanjung Riau | operator PT Senimba Bay Resort | null | null | ❓ | https://batamport.bpbatam.go.id/teluk-senimba/ |
| Terminal Feri Gold Coast Bengkong | terminal feri internasional | Bengkong | perlu dicek | Kawasan Pantai Indah Mutiara Blok B No.36–37, Bengkong (menurut BatamNow) | operator PT Aneka Sarana Sentosa; diresmikan Senin 14 April 2025 oleh Menko AHY bersama Kapolri Listyo Sigit Prabowo; rute harian Batam–Stulang Laut (Malaysia) dengan armada Ferry Dolphin | null | null | ❓ | Ulasan.co dan BatamToday (15 April 2025); BatamNow |
| SPKLU Ultra Fast Charging Kantor Korporat PLN Batam | SPKLU | Batam Kota | Teluk Tering | Jl. Engku Putri No.3, Batam Centre | 3 unit ultra fast; cek ketersediaan di PLN Mobile | null | null | ❓ | https://www.plnbatam.com/pln-batam-hadirkan-spklu-ultra-fast-charging-dorong-ekosistem-kendaraan-listrik-di-batam/ |
| SPKLU lain (13 titik di JSON): Grand Batam Mall, Nagoya Thamrin City, Harbour Bay, Mega Mall, Mall Botania 2, Aston Pelita, Panbil Mall, Polresta Barelang, Masjid Bintang Amin Angkasa, Kantor Pajak Sukajadi, Padang Golf Sukajadi, Harris Batam Centre, Petra Tiban | SPKLU | beragam | — | lihat JSON | PLN Mobile | null | null | ❓ | https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html ; https://wartakepri.co.id/2026/04/30/anda-pengguna-mobil-listrik-di-batam-catat-21-lokasi-spklu-pln-batam/ ; https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam |

Menurut siaran pers PLN Batam tanggal 13 Juni 2026, total SPKLU sudah mencapai 26 unit (21 titik ditambah 3 unit baru di Kantor PLN Batam Center), tapi koordinat per unit belum dipublikasikan. Sisanya (Kantor Disyan 1 dan 2, Taman Golf Residence, showroom BYD, Kantor PP Polri, Metro Showroom, Kongkow Driving Range, Grand Mercure) bisa ditambahkan lewat aplikasi PLN Mobile. Terminal bus, pool travel, dan SPBU **belum diriset**.

### E. Nomor Darurat dan Pengaduan (non-lokasi, tanpa titik peta)

| Nama | Kontak | Catatan |
|---|---|---|
| Panggilan darurat 112 | 112 | Nomor darurat nasional. Pengelola lokal di Batam belum diverifikasi |
| Polisi | 110 | nasional |
| Pemadam kebakaran | 113 | nasional |
| SAR/Basarnas | 115 | Diarahkan ke kantor SAR terdekat (Pos SAR Batam / KPP Tanjungpinang) |
| Ambulans | 119 | nasional |
| LAPOR! (SP4N) | lapor.go.id | Kanal pengaduan nasional. BP Batam juga punya ditpam.laporsp4n@bpbatam.go.id |

## Data JSON

```json
[
{"id":"pub-walikota","nama":"Kantor Wali Kota Batam","kategori":"layanan_publik","subkategori":"pemerintahan_kota","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri No.1, Batam Centre 29432","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 462164","atribut":{},"sumber_url":"https://apeksi.id/batam/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-dprd","nama":"DPRD Kota Batam","kategori":"layanan_publik","subkategori":"legislatif","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri, Teluk Tering 29432","lat":1.1265179,"lng":104.0552557,"jam_layanan":null,"kontak":"(0778) 464229; setdprd@batam.go.id","atribut":{"jumlah_anggota":50,"periode":"2024-2029"},"sumber_url":"https://dprd.batam.go.id/kontak/","status_koordinat":"perlu_cek_ulang"},
{"id":"pub-bapenda","nama":"Bapenda Kota Batam","kategori":"layanan_publik","subkategori":"pajak_daerah","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Gedung Bersama Pemko Batam Lt. 2, Jl. Raja Isa, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 470670/71/72; bapenda@batam.go.id","atribut":{"layanan":["PBB-P2","BPHTB","pajak daerah"],"online":"https://epbb.batam.go.id","jemput_bola":"SIBIJAK Ngemall Jumat-Minggu 12.00-20.00 (berkala)"},"sumber_url":"https://bapenda.batam.go.id/media-center/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-dishub","nama":"Dinas Perhubungan Kota Batam","kategori":"layanan_publik","subkategori":"dinas","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Jl. Jend. Sudirman No.2, Sukajadi 29444","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":"https://idalamat.com/alamat/dinas-perhubungan-kota-batam-40088","status_koordinat":"perlu_diisi_user"},
{"id":"pub-dinsos","nama":"Dinas Sosial dan Pemberdayaan Masyarakat Kota Batam","kategori":"layanan_publik","subkategori":"dinas","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Raja Haji No.9, Sei Harapan 29425","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 321370; dinsospm@batam.go.id","atribut":{"mengelola":"Taman Makam Pahlawan"},"sumber_url":"https://dinsospm.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-dinkes","nama":"Dinas Kesehatan Kota Batam","kategori":"layanan_publik","subkategori":"dinas","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Raja Haji No.7, Sekupang","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 323506; dinkes@batam.go.id","atribut":{},"sumber_url":"https://dinkes.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-disdik","nama":"Dinas Pendidikan Kota Batam","kategori":"layanan_publik","subkategori":"dinas","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Pramuka, Komp. Perkantoran Sekupang","lat":1.109933,"lng":103.953554,"jam_layanan":null,"kontak":"(0778) 322569 / 326189; disdik@batam.go.id","atribut":{},"sumber_url":"https://disdik.batam.go.id/kontak/","status_koordinat":"perlu_cek_ulang"},
{"id":"pub-disnaker","nama":"Dinas Tenaga Kerja Kota Batam","kategori":"layanan_publik","subkategori":"dinas","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Kartini I No.29-30, Sei Harapan 29425","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 327601","atribut":{"usang":true},"sumber_url":"https://kepriau.com/daftar-alamat-kantor-dinas-kota-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-bpbd","nama":"BPBD Kota Batam","kategori":"layanan_publik","subkategori":"kebencanaan","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Shop House Orchard Park, Orchard Walk Blok D No.3, Batam Kota 29431","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0811) 70087575; bpbd@batam.go.id","atribut":{},"sumber_url":"https://bpbd.batam.go.id/kontak/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-kemenag","nama":"Kantor Kementerian Agama Kota Batam","kategori":"layanan_publik","subkategori":"instansi_vertikal","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Masjid Baiturrahman No.1, Sei Harapan","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 321124; WA 0822-8000-1114; kemenagkotabatam@kemenag.go.id","atribut":{},"sumber_url":"https://batam.kemenag.go.id/main/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-ksop","nama":"KSOP Khusus Batam","kategori":"layanan_publik","subkategori":"pelabuhan_syahbandar","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. RE Martadinata, Sekupang 29433","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 322333","atribut":{},"sumber_url":"https://www.ksopkhususbatam.id/spbb.aspx","status_koordinat":"perlu_diisi_user"},
{"id":"pub-possar","nama":"Pos SAR Batam (Basarnas)","kategori":"layanan_publik","subkategori":"sar","kecamatan":"Sekupang","kelurahan":null,"alamat":"Jl. R.E. Martadinata, Sekupang","lat":null,"lng":null,"jam_layanan":"24 jam (darurat)","kontak":"115; KPP Tanjungpinang (0771) 319300","atribut":{"induk":"KPP Basarnas Kelas A Tanjungpinang","kapal":"KN Ganesha 105"},"sumber_url":"https://tanjungpinang.basarnas.go.id/berita/no-telepon-penting-22","status_koordinat":"perlu_diisi_user"},
{"id":"pub-kodim","nama":"Kodim 0316/Batam","kategori":"layanan_publik","subkategori":"militer_tni_ad","kecamatan":"Batu Ampar","kelurahan":"Seraya","alamat":"Jl. Yos Sudarso, Seraya Atas","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"koramil":["Lubuk Baja","Sekupang","Nongsa","Galang","Belakang Padang"]},"sumber_url":"https://id.wikipedia.org/wiki/Komando_Distrik_Militer_0316","status_koordinat":"perlu_diisi_user"},
{"id":"pub-kodaeral4","nama":"Kodaeral IV (ex-Lantamal IV)","kategori":"layanan_publik","subkategori":"militer_tni_al","kecamatan":"Batu Ampar","kelurahan":"Tanjung Sengkuang","alamat":"Jl. Tamalatea, Tanjung Sengkuang 29432","lat":null,"lng":null,"jam_layanan":null,"kontak":"0821-7078-4496 (halaman kontak resmi)","atribut":{"catatan":"menggantikan Lanal Batam"},"sumber_url":"https://lantamal4-koarmada1.tnial.mil.id/contact_us/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-lanud","nama":"Lanud Hang Nadim","kategori":"layanan_publik","subkategori":"militer_tni_au","kecamatan":"Nongsa","kelurahan":"Batu Besar","alamat":"Jl. Hang Jebat Km 3, Batu Besar","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":"https://www.lanudhangnadim.com/","status_koordinat":"perlu_diisi_user"},
{"id":"pub-uptransbatam","nama":"UPT Trans Batam","kategori":"layanan_publik","subkategori":"transportasi_kota","kecamatan":null,"kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"pos-kcu","nama":"Kantor Pos Batam (KCU)","kategori":"layanan_publik","subkategori":"kantor_pos","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Jend. Sudirman, Batam Centre 29444","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 462496","atribut":{"catatan":"nomor 463150 di idalamat milik PLN Batam, jangan dipakai"},"sumber_url":"https://idalamat.com/alamat/80618/kantor-pos-batam","status_koordinat":"perlu_diisi_user"},
{"id":"pos-nagoya","nama":"Kantor Pos Nagoya","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Komp. Wijaya Kusuma Blok E No.01, Nagoya","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 456726","atribut":{"usang":true},"sumber_url":"http://karimunbatam.blogspot.com/2014/08/alamat-nomor-telepon-kantor-pos-di-kota-batam-indonesia.html","status_koordinat":"perlu_diisi_user"},
{"id":"pos-jodoh","nama":"Kantor Pos Jodoh","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Batu Ampar","kelurahan":"Sungai Jodoh","alamat":"Komp. Jodoh Square Blok C No.38","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 459737","atribut":{"usang":true},"sumber_url":"http://karimunbatam.blogspot.com/2014/08/alamat-nomor-telepon-kantor-pos-di-kota-batam-indonesia.html","status_koordinat":"perlu_diisi_user"},
{"id":"pos-mukakuning","nama":"Kantor Pos Muka Kuning","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Sei Beduk","kelurahan":null,"alamat":"Shop House Blok D 01-17, Muka Kuning","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"http://karimunbatam.blogspot.com/2014/08/alamat-nomor-telepon-kantor-pos-di-kota-batam-indonesia.html","status_koordinat":"perlu_diisi_user"},
{"id":"pos-batuaji","nama":"Kantor Pos Batu Aji","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Batu Aji","kelurahan":null,"alamat":"Komp. Sentosa Perdana Blok J No.12","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"pos-megalegenda","nama":"Kantor Pos Mega Legenda","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Komp. Mega Legenda, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"pos-botania","nama":"Kantor Pos Botania","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Komp. Botania Plaza, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"pos-baloi","nama":"Kantor Pos Baloi","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Jl. Bunga Raya, Baloi","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"pos-tiban","nama":"Kantor Pos Tiban","kategori":"layanan_publik","subkategori":"kantor_pos_cabang","kecamatan":"Sekupang","kelurahan":null,"alamat":"Tiban Palapa Blok AA No.2","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang":true},"sumber_url":"https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"kua-batamkota","nama":"KUA Kecamatan Batam Kota","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Batam Kota","kelurahan":"Belian","alamat":"Komp. Perum Cendana Tahap III","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 475468","atribut":{"usang_mungkin":true},"sumber_url":"https://kemenagbatam.com/main/detail/kua-batam-kota-siap-berikan-layanan-prima-pada-masyarakat","status_koordinat":"perlu_diisi_user"},
{"id":"kua-batuaji","nama":"KUA Kecamatan Batu Aji","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Batu Aji","kelurahan":"Kibing","alamat":"Jl. Suprapto, MKGR, Batu Aji","lat":1.0385515,"lng":103.9960996,"jam_layanan":null,"kontak":null,"atribut":{"catatan":"alamat bentrok dengan KUA Sagulung"},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_cek_ulang"},
{"id":"kua-batuampar","nama":"KUA Kecamatan Batu Ampar","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Batu Ampar","kelurahan":"Sungai Jodoh","alamat":"Jl. Kuda Laut No.1","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 450917","atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-belakangpadang","nama":"KUA Kecamatan Belakang Padang","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Belakang Padang","kelurahan":null,"alamat":"Jl. Hang Lekiu No.21","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 312213","atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-bengkong","nama":"KUA Kecamatan Bengkong","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Bengkong","kelurahan":"Sadai","alamat":"Jl. Tuah Sakti No.1","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-bulang","nama":"KUA Kecamatan Bulang","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Bulang","kelurahan":"Bulang Lintang","alamat":"Bulang Lintang","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-galang","nama":"KUA Kecamatan Galang","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Galang","kelurahan":"Sembulang","alamat":"Jl. Batin Limat No.2, Sembulang","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-lubukbaja","nama":"KUA Kecamatan Lubuk Baja","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Lubuk Baja","kelurahan":"Baloi Indah","alamat":"Belakang Perum Batu Batam Permai","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":"https://batam.kemenag.go.id/main/detail/kua-lubuk-baja-3-pekan-ini-sudah-9-pasang-pengantin-yang-menikah","status_koordinat":"perlu_diisi_user"},
{"id":"kua-nongsa","nama":"KUA Kecamatan Nongsa","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Nongsa","kelurahan":null,"alamat":"Jl. Hang Kasturi No.7, Nongsa","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"usang_mungkin":true},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-sagulung","nama":"KUA Kecamatan Sagulung","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Sagulung","kelurahan":null,"alamat":"Jl. R. Suprapto No.1, Sagulung","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 700227","atribut":{"catatan":"rencana kantor baru di Kel. Sei Pelunggut"},"sumber_url":"https://batam.kemenag.go.id/main/detail/kemenag-batam-survey-lokasi-lahan-kua-kecamatan-sagulung","status_koordinat":"perlu_diisi_user"},
{"id":"kua-seibeduk","nama":"KUA Kecamatan Sei Beduk","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Sei Beduk","kelurahan":"Mangsang","alamat":"Jl. S. Parman Pintu II, Kav. Bida Ayu, Tg. Piayu","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":"https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri","status_koordinat":"perlu_diisi_user"},
{"id":"kua-sekupang","nama":"KUA Kecamatan Sekupang","kategori":"layanan_publik","subkategori":"kua","kecamatan":"Sekupang","kelurahan":"Sungai Harapan","alamat":"Jl. Pramuka No.1, Sei Harapan","lat":null,"lng":null,"jam_layanan":"Senin-Kamis 07.30-16.00; Jumat 07.30-16.30","kontak":"(0778) 327526","atribut":{"daftar_nikah":"simkah4.kemenag.go.id"},"sumber_url":"https://www.instagram.com/kua_sekupang_batam/","status_koordinat":"perlu_diisi_user"},
{"id":"kes-pmi","nama":"UPD PMI Kota Batam","kategori":"kesehatan","subkategori":"donor_darah","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Jl. Cempaka, Batam Centre","lat":null,"lng":null,"jam_layanan":"Layanan darah 24/7","kontak":"(0778) 741368; WA admin donor +62 811-7001-9960; markas@pmibatam.or.id","atribut":{},"sumber_url":"https://updpmibatam.id/","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-stpetrus","nama":"Paroki Santo Petrus Lubuk Baja","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"keuskupan":"Pangkalpinang"},"sumber_url":"https://katolikdibatam.wordpress.com/about/kevikepan-kepulauan-riau/","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-stdamian","nama":"Paroki Santo Damian Bengkong","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Bengkong","kelurahan":"Bengkong Laut","alamat":"Komp. Green Town, Bengkong Laut 29458","lat":1.1540247,"lng":104.0219444,"jam_layanan":null,"kontak":null,"atribut":{"didirikan":"1995-06-11"},"sumber_url":"https://id.wikipedia.org/wiki/Gereja_Santo_Damian,_Bengkong","status_koordinat":"perlu_cek_ulang"},
{"id":"ibd-kerahimanilahi","nama":"Paroki Kerahiman Ilahi Tiban","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Sekupang","kelurahan":"Patam Lestari","alamat":"Jl. Tiban III, Patam Lestari 29426","lat":1.1147716,"lng":103.9673676,"jam_layanan":null,"kontak":"(0778) 322886","atribut":{},"sumber_url":"https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/","status_koordinat":"perlu_cek_ulang"},
{"id":"ibd-mbpa","nama":"Paroki Maria Bunda Pembantu Abadi Batu Aji","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Batu Aji","kelurahan":null,"alamat":"Kavling Baru Sumber Jaya, Jl. Gereja, Batu Aji","lat":1.0398111,"lng":103.9676321,"jam_layanan":null,"kontak":null,"atribut":{"didirikan":"2003-11-01"},"sumber_url":"https://id.wikipedia.org/wiki/Gereja_Maria_Bunda_Pembantu_Abadi,_Batu_Aji","status_koordinat":"perlu_cek_ulang"},
{"id":"ibd-sthilarius","nama":"Paroki Santo Hilarius Sei Beduk","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Sei Beduk","kelurahan":"Mangsang","alamat":"Kavling depan Bida Ayu Blok S, Pintu 1, 29437","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{},"sumber_url":"https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/","status_koordinat":"perlu_diisi_user"},
{"id":"ibd-stfransiskus","nama":"Paroki Santo Fransiskus Asisi Kabil","kategori":"ibadah","subkategori":"gereja_katolik","kecamatan":"Nongsa","kelurahan":"Kabil","alamat":"Jl. Raya Bumi Perkemahan, Kabil 29467","lat":null,"lng":null,"jam_layanan":null,"kontak":"(0778) 7100 212","atribut":{},"sumber_url":"https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/","status_koordinat":"perlu_diisi_user"},
{"id":"mkm-tmp","nama":"Taman Makam Pahlawan Pusara Bhakti Bulan Gebang","kategori":"ibadah","subkategori":"taman_makam_pahlawan","kecamatan":"Batu Aji","kelurahan":"Bukit Tempayan","alamat":"Jl. Letjend Suprapto, Bukit Tempayan","lat":1.04686,"lng":103.96752,"jam_layanan":null,"kontak":"via Dinsos PM (0778) 321370","atribut":{"plus_code":"6PH52XW9+P2R"},"sumber_url":"https://batam.imigrasi.go.id/berita/2022/08/rangkaian-kegiatan-hdkd-ke-77-imigrasi-batam-laksanakan-kegiatan-bersih-bersih-taman-makam-pahlawan-dan-tempat-ibadah","status_koordinat":"perlu_cek_ulang"},
{"id":"trp-pancungsekupang","nama":"Pelabuhan Pancung Sekupang (pompong ke Belakang Padang)","kategori":"transportasi","subkategori":"pelantar_pompong","kecamatan":"Sekupang","kelurahan":null,"alamat":"Kawasan Pelabuhan Sekupang, Jl. RE Martadinata","lat":null,"lng":null,"jam_layanan":"24 jam (malam pesan dulu)","kontak":null,"atribut":{"operator":"PPMS","tarif_idr":20000,"tarif_sejak":"2022-09","usang_mungkin":true},"sumber_url":"https://batam.tribunnews.com/2022/09/05/tarif-tiket-pompong-ke-belakangpadang-batam-naik-dampak-kenaikan-harga-bbm","status_koordinat":"perlu_diisi_user"},
{"id":"trp-pelbelakangpadang","nama":"Pelabuhan Belakang Padang","kategori":"transportasi","subkategori":"pelabuhan_rakyat","kecamatan":"Belakang Padang","kelurahan":null,"alamat":"Pulau Belakang Padang","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"rute":[{"tujuan":"Sekupang","tarif_idr":20000},{"tujuan":"Pulau Geranting","tarif_idr":140000}]},"sumber_url":"https://nasional.tvrinews.com/berita/twrlaf5-pulau-belakang-padang-sebuah-permata-tersembunyi-di-wilayah-batam","status_koordinat":"perlu_diisi_user"},
{"id":"trp-pelsagulung","nama":"Pelabuhan Rakyat Sagulung","kategori":"transportasi","subkategori":"pelabuhan_rakyat","kecamatan":"Sagulung","kelurahan":null,"alamat":"Sagulung","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"rute":["Pulau Buluh","Bulang Lintang","pulau Kec. Bulang"],"tarif_idr":"20000-25000 (2022)","usang_mungkin":true},"sumber_url":"https://gokepri.com/kisah-warga-batam-mudik-lebaran-ke-pulau-bulang-lintang/","status_koordinat":"perlu_diisi_user"},
{"id":"trp-rutepemping","nama":"Rute pompong Pulau Pemping / Terong / Pecung","kategori":"transportasi","subkategori":"rute_pompong","kecamatan":"Belakang Padang","kelurahan":null,"alamat":null,"lat":null,"lng":null,"jam_layanan":"sekali sehari (reguler)","kontak":null,"atribut":{"usang":true},"sumber_url":"https://www.researchgate.net/publication/316854142_POTRET_KEHIDUPAN_MASYARAKAT_HINTERLAND_KOTA_BATAM","status_koordinat":"perlu_diisi_user"},
{"id":"trp-telukssenimba","nama":"Terminal Feri Waterfront City / Teluk Senimba","kategori":"transportasi","subkategori":"terminal_feri_internasional","kecamatan":"Sekupang","kelurahan":"Tanjung Riau","alamat":"Marina City, Tanjung Riau","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"operator":"PT Senimba Bay Resort"},"sumber_url":"https://batamport.bpbatam.go.id/teluk-senimba/","status_koordinat":"perlu_diisi_user"},
{"id":"trp-goldcoast","nama":"Terminal Feri Gold Coast Bengkong","kategori":"transportasi","subkategori":"terminal_feri_internasional","kecamatan":"Bengkong","kelurahan":null,"alamat":"Kawasan Pantai Indah Mutiara Blok B No.36-37, Bengkong","lat":null,"lng":null,"jam_layanan":null,"kontak":null,"atribut":{"operator":"PT Aneka Sarana Sentosa","diresmikan":"2025-04-14","rute":"Batam - Stulang Laut (Malaysia), harian, Ferry Dolphin"},"sumber_url":null,"status_koordinat":"perlu_diisi_user"},
{"id":"spklu-plnkorporat","nama":"SPKLU Kantor Korporat PLN Batam","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":"Teluk Tering","alamat":"Jl. Engku Putri No.3, Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{"tipe":"3 unit ultra fast","total_spklu_pln_batam":26},"sumber_url":"https://www.plnbatam.com/pln-batam-hadirkan-spklu-ultra-fast-charging-dorong-ekosistem-kendaraan-listrik-di-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-grandbatam","nama":"SPKLU Grand Batam Mall","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batu Ampar","kelurahan":null,"alamat":"Grand Batam Mall","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-thamrin","nama":"SPKLU Nagoya Thamrin City","kategori":"transportasi","subkategori":"spklu","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Nagoya Thamrin City","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-harbourbay","nama":"SPKLU Harbour Bay","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batu Ampar","kelurahan":null,"alamat":"Harbour Bay","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-megamall","nama":"SPKLU Mega Mall Batam Centre","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Mega Mall Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-botania2","nama":"SPKLU Mall Botania 2","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Mall Botania 2","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-astonpelita","nama":"SPKLU Hotel Aston Pelita","kategori":"transportasi","subkategori":"spklu","kecamatan":"Lubuk Baja","kelurahan":null,"alamat":"Hotel Aston Pelita","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://wartakepri.co.id/2026/04/30/anda-pengguna-mobil-listrik-di-batam-catat-21-lokasi-spklu-pln-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-panbil","nama":"SPKLU Panbil Mall","kategori":"transportasi","subkategori":"spklu","kecamatan":null,"kelurahan":null,"alamat":"Panbil Mall","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://wartakepri.co.id/2026/04/30/anda-pengguna-mobil-listrik-di-batam-catat-21-lokasi-spklu-pln-batam/","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-polresta","nama":"SPKLU Polresta Barelang","kategori":"transportasi","subkategori":"spklu","kecamatan":null,"kelurahan":null,"alamat":"Polresta Barelang","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-bintangamin","nama":"SPKLU Masjid Bintang Amin Angkasa","kategori":"transportasi","subkategori":"spklu","kecamatan":null,"kelurahan":null,"alamat":"Masjid Bintang Amin Angkasa","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-pajaksukajadi","nama":"SPKLU Kantor Pajak Sukajadi","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Kantor Pajak Sukajadi","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-golfsukajadi","nama":"SPKLU Padang Golf Sukajadi","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":"Sukajadi","alamat":"Padang Golf Sukajadi","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-harris","nama":"SPKLU Hotel Harris Batam Centre","kategori":"transportasi","subkategori":"spklu","kecamatan":"Batam Kota","kelurahan":null,"alamat":"Hotel Harris Batam Centre","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam","status_koordinat":"perlu_diisi_user"},
{"id":"spklu-petratiban","nama":"SPKLU Kawasan Petra Tiban","kategori":"transportasi","subkategori":"spklu","kecamatan":"Sekupang","kelurahan":null,"alamat":"Kawasan Petra Tiban","lat":null,"lng":null,"jam_layanan":null,"kontak":"PLN Mobile","atribut":{},"sumber_url":"https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam","status_koordinat":"perlu_diisi_user"}
]
```

## Caveats

- **Koordinat.** Tidak ada satu pun koordinat yang saya cek langsung ke OSM/Wikidata. Semua koordinat yang terisi berstatus `perlu_cek_ulang`. Koordinat dari idalamat.com sebaiknya dianggap kasar. Ada indikasi data idalamat kadang tertukar, misalnya nomor PLN Batam yang ditempel ke entri Pos Indonesia.
- **Terminal Batam Centre.** Situs BP Batam mencantumkan lintang 01°17'15" LU untuk Terminal Batam Centre, yang terlalu ke utara (seharusnya sekitar 1,13°). Kemungkinan salah ketik, jadi cek lagi di OSM.
- **Data usang.** Daftar KUA Kanwil Kepri (sekitar 2017), daftar kantor pos (blog 2014 dan Foursquare), dan alamat Disnaker (blog 2017) rawan sudah berubah. Cabang kantor pos di atas perlu dicek apakah masih buka.
- **Tarif pompong** adalah tarif swadaya PPMS dan tekong, bukan tarif resmi pemerintah. Dishub hanya "mengetahui" kesepakatan tarif. Untuk pulau lain, tarifnya dinegosiasikan langsung dengan tekong.
- **Belum diriset sama sekali:** klinik 24 jam, lab klinik, apotek 24 jam, klinik hewan, psikolog RS, gereja Protestan, klenteng/vihara tambahan, masjid besar per kecamatan, terminal bus, pool travel, SPBU, UPT Trans Batam, Pulau Kasu, dan Pulau Terong (rute spesifik).

## Daftar Entri dengan Koordinat Belum Pasti (per kategori)

**Layanan publik – perlu_diisi_user:** Kantor Wali Kota Batam; Bapenda; Dishub; Dinsos PM; Dinkes; Disnaker; BPBD; Kantor Kemenag; KSOP Khusus Batam; Pos SAR Batam; Kodim 0316/Batam; Kodaeral IV; Lanud Hang Nadim; UPT Trans Batam; 9 Kantor Pos (KCU, Nagoya, Jodoh, Muka Kuning, Batu Aji, Mega Legenda, Botania, Baloi, Tiban); 11 KUA (Batam Kota, Batu Ampar, Belakang Padang, Bengkong, Bulang, Galang, Lubuk Baja, Nongsa, Sagulung, Sei Beduk, Sekupang).
**Layanan publik – perlu_cek_ulang:** DPRD Kota Batam; Dinas Pendidikan; KUA Batu Aji.

**Kesehatan – perlu_diisi_user:** UPD PMI Kota Batam.

**Ibadah dan makam – perlu_diisi_user:** Paroki Santo Petrus Lubuk Baja; Paroki Santo Hilarius Sei Beduk; Paroki Santo Fransiskus Asisi Kabil.
**Ibadah dan makam – perlu_cek_ulang:** Paroki Santo Damian Bengkong; Paroki Kerahiman Ilahi Tiban; Paroki MBPA Batu Aji; TMP Pusara Bhakti Bulan Gebang.

**Transportasi – perlu_diisi_user:** Pelabuhan Pancung Sekupang; Pelabuhan Belakang Padang; Pelabuhan Rakyat Sagulung; Rute Pemping/Terong/Pecung; Terminal Feri Waterfront City/Teluk Senimba; Terminal Feri Gold Coast Bengkong; seluruh 14 SPKLU di JSON.

## Daftar sumber

- tnial — https://lantamal4-koarmada1.tnial.mil.id/contact_us/
- damkarbatam — https://bpbd.damkarbatam.com/
- damkarbatam — https://bpbd.damkarbatam.com/kontak
- disdikkotabatam — https://www.disdikkotabatam.org/kontak-dinas/
- disdikbatampemkot — https://disdikbatampemkot.com/
- idalamat — https://idalamat.com/alamat/kantor-walikota-batam-878
- apeksi — https://apeksi.id/batam/
- batam — https://dprd.batam.go.id/kontak/
- idalamat — https://idalamat.com/alamat/11688/kantor-dprd-kota-batam
- tribunnews — https://batam.tribunnews.com/kota-batam/692333/jelang-jatuh-tempo-pbb-p2-31-agustus-bapenda-batam-perluas-layanan-pajak
- batam — https://bapenda.batam.go.id/media-center/
- idalamat — https://idalamat.com/alamat/dinas-perhubungan-kota-batam-40088
- batam — https://dinsospm.batam.go.id/kontak/
- batam — https://dinkes.batam.go.id/kontak/
- batam — https://dinkes.batam.go.id/wp-content/uploads/sites/35/2019/01/PROFIL-KESEHATAN-KOTA-BATAM-2018_oke.pdf
- blogspot — https://alamat-dinas-kesehatan.blogspot.com/2015/03/alamat-dinas-kesehatan-kota-batam.html
- informasibatam — https://informasibatam.com/listing/dinas-kesehatan-kota-batam/
- batam — https://disdik.batam.go.id/kontak/
- idalamat — https://idalamat.com/alamat/12417/kantor-dinas-pendidikan-kota-batam
- kepriau — https://kepriau.com/daftar-alamat-kantor-dinas-kota-batam/
- batam — https://bpbd.batam.go.id/kontak/
- kemenag — https://batam.kemenag.go.id/main/
- youtube — https://www.youtube.com/@kemenagbatam
- ksopkhususbatam — https://www.ksopkhususbatam.id/spbb.aspx
- basarnas — https://tanjungpinang.basarnas.go.id/berita/no-telepon-penting-22
- tanjungpinangkota — https://www.tanjungpinangkota.go.id/berita/basarnas-tanjungpinang-siapkan-siaga-sar-khusus-akhir-tahun
- datalpse — https://www.datalpse.com/lelang/3121469-pembangunan-rettening-wall-pos-pencarian-dan-pertolongan-batam
- Wikipedia — https://id.wikipedia.org/wiki/Komando_Distrik_Militer_0316
- kepripedia — https://kepripedia.com/kodim-0316-batam-ajak-wartawan-bersinergi-demi-kemajuan-kota-batam/
- lanudhangnadim — https://www.lanudhangnadim.com/
- blogspot — http://karimunbatam.blogspot.com/2014/08/alamat-nomor-telepon-kantor-pos-di-kota-batam-indonesia.html
- idalamat — https://idalamat.com/alamat/80618/kantor-pos-batam
- foursquare — https://id.foursquare.com/awwa_s/list/pos-indonesia-di-batam
- kemenagbatam — https://kemenagbatam.com/main/detail/kua-batam-kota-siap-berikan-layanan-prima-pada-masyarakat
- kemenag — https://kepri.kemenag.go.id/page/detmenu/02102017101955_alamatkuaseprovkepri
- idalamat — https://idalamat.com/alamat/32814/kantor-urusan-agama-kua-kec-batu-aji-kota-batam
- idalamat — https://idalamat.com/alamat/kantor-urusan-agama-kua-kec-batu-ampar-kota-batam-32816
- kemenag — https://batam.kemenag.go.id/main/detail/kua-lubuk-baja-3-pekan-ini-sudah-9-pasang-pengantin-yang-menikah
- kemenag — https://batam.kemenag.go.id/main/detail/kemenag-batam-survey-lokasi-lahan-kua-kecamatan-sagulung
- blogspot — https://kuaseibedukbatam.blogspot.com/
- kemenag — https://batam.kemenag.go.id/main/kua-sekupang-peristiwa-nikah-selama-2024-hingga-hari-ini-tercatat-sebanyak-382-pasang-pengantin
- instagram — https://www.instagram.com/kua_sekupang_batam/
- updpmibatam — https://updpmibatam.id/
- pmibatam — https://pmibatam.or.id/
- bpbatam — https://bpbatam.go.id/profile-bp-batam/
- bpbatam — https://bpbatam.go.id/en/profile/contact-us/
- wordpress — https://katolikdibatam.wordpress.com/about/kevikepan-kepulauan-riau/
- fkubbatam — https://www.fkubbatam.or.id/index.php?p=daftar-rumah-ibadah
- Wikipedia — https://id.wikipedia.org/wiki/Gereja_Santo_Damian,_Bengkong
- stekom — https://p2k.stekom.ac.id/ensiklopedia/Daftar_paroki_di_Keuskupan_Pangkalpinang
- Wikipedia — https://id.wikipedia.org/wiki/Daftar_paroki_di_Keuskupan_Pangkalpinang
- dokpenkwi — https://www.dokpenkwi.org/keuskupan-pangkalpinang-2/4/
- Wikipedia — https://id.wikipedia.org/wiki/Gereja_Maria_Bunda_Pembantu_Abadi,_Batu_Aji
- Wikipedia — https://id.wikipedia.org/wiki/Gereja_Santo_Fransiskus_Assisi,_Kabil
- mindtrip — https://mindtrip.ai/attraction/batu-aji-riau-islands/taman-makam-pahlawan-pusara-bhakti-bulan-gebang/at-RrDTGYAf
- imigrasi — https://batam.imigrasi.go.id/berita/2022/08/rangkaian-kegiatan-hdkd-ke-77-imigrasi-batam-laksanakan-kegiatan-bersih-bersih-taman-makam-pahlawan-dan-tempat-ibadah
- simapankesos — https://simapankesos.com/
- researchgate — https://www.researchgate.net/publication/394905333_Pengelolaan_Antrian_Kapal_Pompong_Berbasis_Teknologi_di_Pelabuhan_Sekupang-Belakang_Padang
- lemon8-app — https://www.lemon8-app.com/@duo_dingdong/7129447379429900801?region=id
- tribunnews — https://batam.tribunnews.com/2022/09/05/tarif-tiket-pompong-ke-belakangpadang-batam-naik-dampak-kenaikan-harga-bbm
- tvrinews — https://nasional.tvrinews.com/berita/twrlaf5-pulau-belakang-padang-sebuah-permata-tersembunyi-di-wilayah-batam
- researchgate — https://www.researchgate.net/publication/316854142_POTRET_KEHIDUPAN_MASYARAKAT_HINTERLAND_KOTA_BATAM
- linasasmita — https://www.linasasmita.com/2015/06/pulau-buluh-batam-tempat-mudik-dikala.html
- gokepri — https://gokepri.com/kisah-warga-batam-mudik-lebaran-ke-pulau-bulang-lintang/
- bpbatam — https://batamport.bpbatam.go.id/teluk-senimba/
- plnbatam — https://www.plnbatam.com/hubungi-kami/
- ulasan — https://ulasan.co/pln-batam-tambah-tiga-spklu-ultra-fast-charging-dukung-pengembangan-ekosistem-kendaraan-listrik/?amp=1
- plnbatam — https://www.plnbatam.com/pln-batam-hadirkan-spklu-ultra-fast-charging-dorong-ekosistem-kendaraan-listrik-di-batam/
- jawapos — https://batampos.jawapos.com/batam/2604200002/infrastruktur-kendaraan-listrik-digeber-spklu-kian-meluas-di-batam
- batamramah — https://www.batamramah.com/2026/05/spklu-pln-batam-meluas-ekosistem.html
- wartakepri — https://wartakepri.co.id/2026/04/30/anda-pengguna-mobil-listrik-di-batam-catat-21-lokasi-spklu-pln-batam/
