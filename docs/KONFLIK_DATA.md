# Konflik data

Dibuat oleh `scripts/tulis-konflik.mjs` dari `data/places_konflik.json`. 63 konflik.

Aturan umumnya: situs memakai nilai yang dipilih saat penggabungan (`tools/merge_places.py`), konflik tidak diselesaikan dengan menebak, dan pemilik bisa mengubahnya kapan saja. Baris tanpa bukti luar tetap seperti ini sampai ada yang mengecek ke lapangan.

## alamat_beda (54)

Situs memakai alamat di `places.json`. Tidak ditebak mana yang benar.

| Tempat | Versi A | Versi B | Dipakai situs | Cek OSM |
|---|---|---|---|---|
| WYNDHAM PANBIL BATAM HOTEL | JL. AHMAD YANI KEL. MUKA KUNING KEC. SUNGAI BEDUK | JL AHMAD YANI KEL. SUNGAI BEDUK KEC. MUKA KUNING | JL. AHMAD YANI KEL. MUKA KUNING KEC. SUNGAI BEDUK |  |
| Pelabuhan Feri Internasional Nongsapura | Jl. Hang Lekiu | Nongsa Pura | Jl. Hang Lekiu | 50 m dari Terminal Feri Nongsa |
| MONTIGO HOTEL & RESORT | JL. HANG LEKIR KELURAHAN SAMBAU KEC. NONGSA BATAM | Nongsa | JL. HANG LEKIR KELURAHAN SAMBAU KEC. NONGSA BATAM |  |
| Kantor Wali Kota Batam | Jl. Engku Putri No.1, Teluk Tering | Jl. Engku Putri No. 01 | Jl. Engku Putri No.1, Teluk Tering |  |
| Puskesmas Sekupang | Jl. Raja Haji No.6, Sei Harapan | Jl. Raja Haji No. 6 | Jl. Raja Haji No.6, Sei Harapan |  |
| Puskesmas Tanjung Uncang | Jl. Brigjen Katamso, Tanjung Uncang | Jl. Brigjen Katamso No. 1 | Jl. Brigjen Katamso, Tanjung Uncang |  |
| Puskesmas Kabil | Jl. Hasanuddin No.1, Kabil | Jl. Hasanuddin No. 1 | Jl. Hasanuddin No.1, Kabil |  |
| Puskesmas Botania | Komp. Botania Garden, Belian | Komp. Botania Garden | Komp. Botania Garden, Belian |  |
| Puskesmas Baloi Permai | Jl. Graha Legenda Malaka | Graha Legenda Malaka | Jl. Graha Legenda Malaka |  |
| Puskesmas Lubuk Baja | Jl. Duyung, Tanjung Uma | Jl. Duyung (cek ulang) | Jl. Duyung, Tanjung Uma |  |
| Puskesmas Belakang Padang | Jl. Hang Tuah, Tanjung Sari | Jl. Hang Tuah No. 1 | Jl. Hang Tuah, Tanjung Sari |  |
| Puskesmas Galang | Jl. Batin Limat No.15, Sembulang | Jl. Batin Limat No. 15 | Jl. Batin Limat No.15, Sembulang |  |
| RSUD Embung Fatimah | Jl. Letjen R. Suprapto Blok D 1-9, Bukit Tempayan | Jl. Pertiwi No. 27 | Jl. Letjen R. Suprapto Blok D 1-9, Bukit Tempayan | 13 m dari RSUD Embung Fatimah |
| RS Awal Bros Batam | Jl. Gajah Mada Kav. 1, Baloi Indah | Jl. Gajah Mada No. 1 | Jl. Gajah Mada Kav. 1, Baloi Indah |  |
| RS Bhayangkara Batam | Jl. Dang Merdu No.2, Batu Besar | Jl. Dang Merdu No. 2 | Jl. Dang Merdu No.2, Batu Besar |  |
| RS Budi Kemuliaan | Jl. Budi Kemuliaan No.1, Kampung Seraya | Jl. Budi Kemuliaan No. 1 | Jl. Budi Kemuliaan No.1, Kampung Seraya |  |
| RS Santa Elisabeth | Jl. Anggrek, Lubuk Baja Kota | Jl. Anggrek No. 2 | Jl. Anggrek, Lubuk Baja Kota |  |
| RS Elisabeth Batam Kota | Jl. Raja Alikelana No.37, Belian | Jl. Raja Ali Kelana No. 37 | Jl. Raja Alikelana No.37, Belian |  |
| Pelabuhan Feri Internasional Batam Centre | Teluk Tering | Batam Centre | Teluk Tering | 13 m dari Pelabuhan Batam Centre |
| Pelabuhan Feri Internasional Sekupang | Sekupang | Jl. R.E. Martadinata | Sekupang | 1447 m dari Sekupang (Batam) |
| Pelabuhan Feri Internasional Nongsapura | Jl. Hang Lekiu | Nongsa | Jl. Hang Lekiu | 50 m dari Terminal Feri Nongsa |
| Pelabuhan Domestik Telaga Punggur | Telaga Punggur, Kabil | Telaga Punggur | Telaga Punggur, Kabil | 254 m dari Telaga Punggur |
| Pelabuhan Gold Coast Bengkong | Bengkong | Kawasan Pantai Indah Mutiara Blok B No. 36-37, Golden City | Bengkong |  |
| Bandar Udara Internasional Hang Nadim | Batu Besar | Jl. Hang Nadim No. 01 | Batu Besar |  |
| Dataran Engku Putri | Batam Centre | Jl. Engku Putri No. 1 | Batam Centre | 177 m dari Engku Putri |
| Kantor Pertanahan Kota Batam | Jl. Jaksa Agung R. Soeprapto | Jl. Jaksa Agung R. Soeprapto, Sungai Harapan, Sekupang, Kota Batam 29428 | Jl. Jaksa Agung R. Soeprapto |  |
| Kantor BP Batam | Jl. Ibnu Sutowo No.1 | Jl. Ibnu Sutowo No. 1, Batam Centre, Kota Batam 29400 | Jl. Ibnu Sutowo No.1 |  |
| Mal Pelayanan Publik Kota Batam | Lt. Dasar Sumatera Convention Center, Jl. Engku Putri | Lt. Dasar, Gedung Sumatera Convention Center, Jl. Engku Putri, Batam Centre | Lt. Dasar Sumatera Convention Center, Jl. Engku Putri |  |
| DPMPTSP Kota Batam | Pengelola MPP (alamat kantor perlu cek) | Lt. 2 MPP, Gedung Sumatera Convention Centre, Jl. Engku Putri, Batam 29461 | Pengelola MPP (alamat kantor perlu cek) |  |
| Kantor Imigrasi Kelas I Khusus TPI Batam | Jl. Engku Putri No.3 | Jl. Engku Putri No. 3 | Jl. Engku Putri No.3 |  |
| Kantor Wali Kota Batam | Jl. Engku Putri No.1, Teluk Tering | Jl. Engku Putri No.1, Batam Centre 29432 | Jl. Engku Putri No.1, Teluk Tering |  |
| Dinas Tenaga Kerja Kota Batam | Jl. Kartini I No. 29-30 | Jl. Kartini I No.29-30, Sei Harapan 29425 | Jl. Kartini I No. 29-30 |  |
| Kantor Kementerian Agama Kota Batam | Jl. Masjid Baiturrahman No. 1 | Jl. Masjid Baiturrahman No.1, Sei Harapan | Jl. Masjid Baiturrahman No. 1 |  |
| Gereja Kerahiman Ilahi | Tiban | Jl. Tiban III, Patam Lestari 29426 | Tiban | 26 m dari Gereja Kerahiman Ilahi |
| Pelabuhan Rakyat (Pancung) Sekupang | Sebelah terminal domestik Sekupang, Jl. R.E. Martadinata | Kawasan Pelabuhan Sekupang, Jl. RE Martadinata | Sebelah terminal domestik Sekupang, Jl. R.E. Martadinata |  |
| Pelabuhan Belakang Padang (Tanjung Sari) | Belakang Padang | Pulau Belakang Padang | Belakang Padang |  |
| Pelabuhan Gold Coast Bengkong | Bengkong | Kawasan Pantai Indah Mutiara Blok B No.36-37, Bengkong | Bengkong |  |
| RS Badan Pengusahaan Batam | Sekupang (perlu cek) | Jl. Cipto Mangunkusumo No.1, Tj. Pinggir, Sekupang | Sekupang (perlu cek) |  |
| Dataran Engku Putri | Batam Centre | Jl. Engku Putri, Batam Centre | Batam Centre | 177 m dari Engku Putri |
| Taman Dang Anom | Batam Centre | Jl. Sudirman, samping flyover Laluan Madani (eks Simpang Jam) | Batam Centre |  |
| Pantai Melur | Sijantung, Pulau Galang | Pulau Galang via Barelang | Sijantung, Pulau Galang |  |
| Play Padel | Teluk Tering | Jl. Engku Putri (samping SPBU Ocarina) | Teluk Tering |  |
| Padel Box Orchid | Orchid Park, Taman Baloi | GOR Bulu Tangkis Orchid Park, Batam Centre | Orchid Park, Taman Baloi |  |
| Kantor Pos Batam (KCU) | Jl. Jend. Sudirman, Batam Centre 29444 | Jl. Jend. Sudirman, Batam Centre | Jl. Jend. Sudirman, Batam Centre 29444 |  |
| Kantor Pos Jodoh | Komp. Jodoh Square Blok C No.38 | Komp. Jodoh Square Blok C No. 38 | Komp. Jodoh Square Blok C No.38 |  |
| Pelabuhan Feri Internasional Batam Centre | Teluk Tering | Jl. Engku Putri, Batam Centre | Teluk Tering | 13 m dari Pelabuhan Batam Centre |
| Pelabuhan Feri Internasional Sekupang | Sekupang | Jl. RE Martadinata, Sekupang | Sekupang | 1447 m dari Sekupang (Batam) |
| Pelabuhan Feri Internasional Harbour Bay | Harbour Bay | Harbourbay Downtown, Bayfront Mall | Harbour Bay |  |
| Pelabuhan Feri Internasional Nongsapura | Jl. Hang Lekiu | Nongsa | Jl. Hang Lekiu | 50 m dari Terminal Feri Nongsa |
| Pelabuhan Gold Coast Bengkong | Bengkong | Kawasan Pantai Indah Mutiara Blok B No. 36-37, Bengkong | Bengkong |  |
| Waterfront City/Marina Teluk Senimba | Marina City, Tanjung Riau | Jl. KH Ahmad Dahlan, Tanjung Uncang | Marina City, Tanjung Riau | 866 m dari Waterfront City Ferry Terminal |
| Pelabuhan Domestik Telaga Punggur | Telaga Punggur, Kabil | Telaga Punggur | Telaga Punggur, Kabil | 254 m dari Telaga Punggur |
| Pelabuhan Rakyat (Pancung) Sekupang | Sebelah terminal domestik Sekupang, Jl. R.E. Martadinata | bersebelahan Terminal Sekupang | Sebelah terminal domestik Sekupang, Jl. R.E. Martadinata |  |
| Pelabuhan Rakyat Sagulung | Sagulung | dekat Tanjung Uncang | Sagulung |  |

## koordinat_beda (9)

Situs memakai nilai di `places.json`, tetap berstatus perkiraan kecuali cocok OSM. Pemilik memutuskan lewat CSV koordinat.

| Tempat | Versi A | Versi B | Dipakai situs | Cek OSM |
|---|---|---|---|---|
| Kampung Tua Tanjung Uma | [1.152,104.002,["03-landmark-jalur-mural"]] | [1.158,103.988,["04-kampung-tua"]] | 1.152, 104.002 (perlu_cek_ulang) |  |
| Kampung Tua Tiban | [1.11,103.96,["03-landmark-jalur-mural"]] | [1.115,103.965,["04-kampung-tua"]] | 1.11, 103.96 (perlu_cek_ulang) |  |
| Pelabuhan Feri Internasional Harbour Bay | [1.156,103.9955,["01-inspirasi-konsep","03-landmark-jalur-mural"]] | [1.15371,103.99746,["06-direktori-taksonomi"]] | 1.153889, 103.997111 (terverifikasi) |  |
| Nagoya Hill Mall | [1.1435,104.0085,["03-landmark-jalur-mural"]] | [1.146512,104.012342,["06-direktori-taksonomi"]] | 1.1435, 104.0085 (perlu_cek_ulang) |  |
| Pantai Melur | [0.768,104.175,["03-landmark-jalur-mural"]] | [0.755748,104.186082,["06-direktori-taksonomi"]] | 0.768, 104.175 (perlu_cek_ulang) |  |
| Pelabuhan Feri Internasional Sekupang | [1.122,103.939,["01-inspirasi-konsep","03-landmark-jalur-mural","06-direktori-taksonomi"]] | [1.125328,103.925633,["07-direktori-layanan-publik"]] | 1.122, 103.939 (perlu_cek_ulang) | 1447 m dari Sekupang (Batam) |
| Pelabuhan Feri Internasional Nongsapura | [1.18838,104.0949,["01-inspirasi-konsep","03-landmark-jalur-mural","06-direktori-taksonomi"]] | [1.17283,104.07809,["07-direktori-layanan-publik"]] | 1.18838, 104.0949 (terverifikasi) | 50 m dari Terminal Feri Nongsa |
| Dataran Engku Putri | [1.1275,104.0525,["03-landmark-jalur-mural","06-direktori-taksonomi"]] | [1.106639,104.052681,["07-direktori-layanan-publik"]] | 1.1275, 104.0525 (perlu_cek_ulang) | 177 m dari Engku Putri |
| Pelabuhan Feri Internasional Sekupang | [1.122,103.939,["01-inspirasi-konsep","03-landmark-jalur-mural","06-direktori-taksonomi","07-direktori-layanan-publik"]] | [1.1314,103.9253,["14-feri-pompong"]] | 1.122, 103.939 (perlu_cek_ulang) | 1447 m dari Sekupang (Batam) |
