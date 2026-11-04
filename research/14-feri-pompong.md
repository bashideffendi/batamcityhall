# Feri, RoRo, dan Pompong dari Batam: Jadwal, Tarif, dan Data Rute per November 2026
> task_id: wf-45ea1918-1dd9-865f-844b-d2b422910e8a

# Data Loket Langit & Laut + Loket Jalan-jalan: Feri, RoRo, dan Pompong dari Batam (data per 4 November 2026)

Intinya: buat widget "Feri terakhir hari ini", sumber yang paling bisa dipegang adalah jadwal resmi tiap operator. Feri terakhir Batam → Singapura (waktu Batam/WIB) per awal November 2026 adalah 20:30 dari Batam Centre (BatamFast) dan Harbour Bay (Horizon), 20:35 dari Batam Centre (Majestic), 20:00 dari Nongsapura ke Tanah Merah, dan sekitar 17:40–18:00 dari Sekupang. Untuk domestik, Telaga Punggur → Tanjungpinang berhenti sekitar 17:30 dan RoRo ke Tanjung Uban sekitar 18:00. Pompong Sekupang–Belakang Padang secara resmi jalan 24 jam, tapi malam hari harus pesan dulu.

## TL;DR

- **Feri Batam–Singapura:** ada 4 operator utama, yaitu BatamFast, Majestic, Sindo, dan Horizon. Rutenya dari 6 terminal Batam ke HarbourFront (sekarang Singapore Cruise Centre, 5 HarbourFront Avenue) dan Tanah Merah. Waktu tempuh 50–70 menit. Harga all-in sekitar SGD 43 sekali jalan dan SGD 76 pulang-pergi, ditambah fuel surcharge SGD 6 / Rp65.000 sejak 12 Maret 2026 (menurut pengumuman Sindo Ferry dan Mothership) kalau belum termasuk. Jadwal di laporan ini diambil dari situs operator per Mei–November 2026.
- **Domestik:** Telaga Punggur adalah hub ke Bintan (Tanjungpinang Rp80.500, Tanjung Uban Rp63.500, RoRo Rp27.000 yang tiketnya wajib online lewat Ferizy) serta ke Lingga dan Anambas. Sekupang Domestik melayani Karimun (Rp132.000) dan Riau (Dumai/Kuala Tungkal Rp600.000). Kapal Pelni KM Kelud sandar di Pelabuhan Bintang 99, Batu Ampar.
- **Pompong:** data paling solid hanya untuk Sekupang–Belakang Padang (PPMS, Rp20.000, ±25 menit). Pelantar rakyat lain (Sagulung, Sembulang, Punggur/Kampung Tua, Jembatan Barelang) tarifnya berbasis nego dan datanya banyak yang lama. Belum ada koordinat pelantar rakyat yang bisa diverifikasi, jadi di JSON semuanya ditulis null atau perlu_diisi_user.

---

## Key Findings

1. **Terminal HarbourFront sudah pindah.** BatamFast pindah ke Singapore Cruise Centre (HarbourFront), 5 HarbourFront Avenue, mulai 7 Juli 2026. Horizon, Majestic, Sindo, dan Indo Falcon menyusul 15 Juli 2026. Dalam pengumumannya pada 15 Juni 2026, Singapore Cruise Centre menyatakan "There are no changes to ferry routes, destinations served and scheduling as a result of the move", dan gedung barunya hanya sekitar 70 m dari terminal lama. HarbourFront Centre lama tutup 27 Juli 2026. Teks lama di situs yang masih menyebut "HarbourFront Centre / 1 Maritime Square" perlu diganti.
2. **Ada beda zona waktu.** Batam (WIB) satu jam di belakang Singapura. Semua jadwal keberangkatan dari Singapura ditulis dalam waktu Singapura, dan dari Batam dalam WIB. Di kode, simpan jam beserta zona waktunya (`Asia/Singapore` vs `Asia/Jakarta`), jangan disatukan.
3. **Gold Coast Bengkong sedang terganggu.** Di jadwal BatamFast yang berlaku 1 November 2026, sebagian besar trip HarbourFront–Gold Coast bertanda "Suspended until further notice". Yang tidak bertanda suspend tinggal HF→GC 09:35 (dioperasikan Sindo) dan 10:30, serta GC→HF 15:30 (Sindo) dan 19:00.
4. **Sekupang adalah terminal yang paling cepat "tutup".** Feri terakhir Sekupang → HarbourFront jatuh di 17:40 (BatamFast) atau 18:00 (Majestic). Situs Sindo mencantumkan 20:30, dan angka ini perlu dicek ulang.
5. **RoRo Punggur–Tanjung Uban tidak menjual tiket di loket.** Tiket hanya lewat trip.ferizy.com dan check-in minimal 2 jam sebelum berangkat. Ini penting untuk ditulis di panduan warga.
6. **Musim angin utara jatuh November–Februari, puncaknya Desember–Januari.** Suratman, Kasi Data dan Informasi BMKG Kelas I Hang Nadim (ANTARA, Januari 2023), menyebut gelombang akibat angin utara di Batam, Bintan, Lingga, dan Karimun "tidak terlalu tinggi karena secara geografis masih terhalang oleh pulau-pulau di sekitarnya". Menurutnya, yang paling terdampak adalah Anambas dan Natuna karena "langsung menghadap langsung ke arah utara", dengan kecepatan angin yang "bisa mencapai 30 kilometer per jam, bahkan lebih". Rute panjang seperti Dumai dan Lingga juga ikut merasakan dampaknya.

---

## Details

### 1. Feri internasional Batam–Singapura

#### Tabel operator dan rute

| Rute | Operator | Durasi | Harga (sekali jalan) | Link jadwal resmi |
|---|---|---|---|---|
| Batam Centre ⇄ HarbourFront | BatamFast, Majestic, Sindo | ±60–70 mnt | BatamFast SGD 43 all-in; Sindo SGD 28 + fee; Majestic ±SGD 43 | batamfast.com · majesticfastferry.com.sg · sindoferry.com.sg/schedules |
| Batam Centre ⇄ Tanah Merah | BatamFast (sebagian trip interline Sindo), Majestic, Sindo | ±60 mnt | ±SGD 43 all-in | sama |
| Sekupang ⇄ HarbourFront | BatamFast, Majestic, Sindo | ±50 mnt | ±SGD 43 all-in / SGD 28 + fee | sama |
| Harbour Bay ⇄ HarbourFront | Horizon | ±50 mnt | mulai SGD 43 (Economy) + fuel surcharge | horizonfastferry.com.sg |
| Nongsapura ⇄ Tanah Merah | BatamFast | ±50 mnt | SGD 43 all-in | batamfast.com |
| Gold Coast Bengkong ⇄ HarbourFront | BatamFast / Sindo (interline) | ±50–60 mnt | promo SGD 17,50 (belum termasuk pajak & surcharge) | batamfast.com |
| Waterfront City ⇄ HarbourFront | Sindo (akhir pekan saja) | ±60 mnt | SGD 28 + fee | sindoferry.com.sg/schedules |
| Harbour Bay ⇄ Nirup Island | Horizon | ±45 mnt | – | horizonfastferry.com.sg |

**Biaya tambahan (penting untuk teks panduan):**
- **Sindo** memasang tarif dasar mulai SGD 28. Saat berangkat dari Singapura ada tambahan Singapore Passenger Departure Fee SGD 10, yang menurut pengumuman Sindo naik dari SGD 7 mulai 1 November 2022. Saat berangkat dari Batam ada Batam Terminal Fee Rp100.000, yang menurut Sindo dinaikkan BP Batam dari Rp65.000 mulai 1 September 2023.
- **BatamFast** memasang SGD 43 sekali jalan / SGD 76 PP yang sudah termasuk fee.
- **Fuel surcharge** dikenakan karena kenaikan harga BBM: SGD 6 (Singapura → Batam) dan Rp65.000 (Batam → Singapura). Menurut pengumuman resmi Sindo Ferry, "Temporary Fuel Surcharge, effective from March 12, 2026". Mothership (12 Maret 2026) juga menyebut 12 Maret untuk BatamFast, Horizon, dan Majestic. Satu-satunya yang berbeda adalah judul berita di situs BatamFast, "Fuel Surcharge Implementation Effective 14th March 2026". Penumpang Horizon yang beli tiket lewat pihak ketiga dilaporkan harus membayar surcharge di konter.
- **Cara beli resmi:** situs atau aplikasi operator (batamfast.com, majesticfastferry.com.sg, sindoferry.com.sg, horizonfastferry.com.sg) atau konter di terminal. Klook/KKday/Traveloka hanya agregator. Untuk Jumat sore, Sabtu pagi, dan libur nasional Singapura, sebaiknya pesan 2–3 hari sebelumnya.

#### Tabel jadwal (tanggal data ditulis per baris; jadwal bisa berubah tanpa pemberitahuan)

**BatamFast** (berlaku mulai 1 November 2026, dari batamfast.com)

| Rute | Jam berangkat | Catatan |
|---|---|---|
| HarbourFront → Batam Centre (SGT) | 07:40, 08:40, 09:30, 10:50, 12:30, 14:20, 15:30, 16:50, 18:00, 19:10, 20:20, 21:40 | |
| Batam Centre → HarbourFront (WIB) | 06:00, 07:00, 08:20, 09:50, 11:10, 12:50, 14:10, 15:20, 16:30, 17:40, 19:00, **20:30** | |
| Tanah Merah → Batam Centre (SGT) | 10:20 (Sindo), 12:50, 14:30 (Sindo), 17:20, 17:40 (Minggu), 20:30 (Kam–Min) | |
| Batam Centre → Tanah Merah (WIB) | 07:45 (Kam–Min), 08:00 (Sindo), 09:20, 11:30 (Sindo), 13:20 | |
| HarbourFront → Sekupang (SGT) | 08:20, 09:20 (Sab–Sen), 10:00 (Sindo), 11:10, 14:10 (Sindo), 16:00 (Sindo, Sab–Min), 17:30, 18:10 (Sindo), 19:30 | |
| Sekupang → HarbourFront (WIB) | 06:00, 07:00 (Sindo), 08:30, 11:20 (Sindo), 12:30, 13:50 (Sindo, Sab–Min), 15:20 (Sindo), 15:30 (Jum–Min), **17:40** | |
| Tanah Merah → Nongsapura (SGT) | 08:00, 08:50, 10:50, 12:00, 14:20, 16:20, 18:30, 20:20 | |
| Nongsapura → Tanah Merah (WIB) | 06:00, 08:00, 09:30, 12:10, 14:20, 15:40, 17:30, **20:00** | |
| HarbourFront ⇄ Gold Coast | HF→GC 09:35 (Sindo), 10:30; GC→HF 15:30 (Sindo), 19:00 | trip lain berstatus suspended |

**Majestic Fast Ferry** (jadwal "New Timing" yang berlaku mulai Mei 2026, PDF di majesticfastferry.com.sg; sebagian trip hanya jalan di akhir pekan, malam libur, dan hari libur, tapi tanda mana yang khusus akhir pekan tidak terbaca jelas dari teks PDF, jadi **perlu_cek_ulang**)

| Rute | Jam berangkat |
|---|---|
| HarbourFront → Batam Centre (SGT) | 08:10, 08:50, 09:50, 10:40, 11:45, 12:20, 13:50, 15:20, 16:20, 17:10, 17:50, 18:50, 20:10, 21:20 |
| Batam Centre → HarbourFront (WIB) | 06:00, 07:10, 08:20, 09:30, 10:20, 11:30, 12:20, 13:30, 14:30, 15:15, 16:00, 17:30, 18:30, **20:35** |
| Tanah Merah → Batam Centre (SGT) | 08:15, 09:30, 10:30, 12:40, 15:15, 16:45, 18:00, 19:20, 20:45 |
| Batam Centre → Tanah Merah (WIB) | 06:15, 08:25, 09:40, 12:00, 13:00, 15:30, 17:00, 18:00, **19:50** |
| HarbourFront → Sekupang (SGT) | 08:45, 09:45, 12:45, 17:40, 20:40 |
| Sekupang → HarbourFront (WIB) | 06:00, 09:00, 13:10, 16:20, **18:00** |

Majestic meminta check-in di konter 60 menit sebelum berangkat.

**Sindo Ferry** (sindoferry.com.sg/schedules dan app.sindoferry.com.sg/schedule, diakses November 2026)

| Rute | Jam berangkat |
|---|---|
| HarbourFront → Batam Centre (SGT) | 08:00, 09:00, 10:20, 12:00, 13:20, 14:50, 16:10, 17:20, 18:30, 19:40, 20:45, 21:50 |
| Batam Centre → HarbourFront (WIB) | 06:00, 07:20, 08:40, 10:40, 12:40, 14:00, 15:10, 16:10, 17:20, 18:20, 19:30, 20:20 (perlu_cek_ulang: kedua halaman Sindo menampilkan versi yang berbeda) |
| Sekupang → HarbourFront (WIB) | 06:00, 07:00, 08:30, 11:20, 12:30, 13:50, 15:20, 17:00, 20:30 (20:30 perlu_cek_ulang) |
| HarbourFront → Waterfront (SGT, Sab–Min) | 10:00, 14:10 |
| Waterfront → HarbourFront (WIB, Sab–Min) | 13:20, 14:50 |
| Tanah Merah → Batam Centre (SGT) | 10:20, 12:30, 14:30, 16:30, 17:40 |
| Batam Centre → Tanah Merah (WIB) | 08:00, 09:20, 11:30, 13:20 |

**Horizon Fast Ferry** (horizonfastferry.com.sg, diakses November 2026)

| Rute | Jam berangkat |
|---|---|
| HarbourFront → Harbour Bay (SGT) | 08:15, 09:10, 10:15, 11:15, 12:15, 13:15, 14:15, 15:15, 16:30, 17:45, 19:00, 20:15, 21:35 |
| Harbour Bay → HarbourFront (WIB) | 06:00, 07:15, 08:30, 09:45, 10:45, 11:45, 12:45, 14:00, 15:30, 16:30, 17:30, 19:15, **20:30** |

Check-in Horizon ditutup 20 menit sebelum berangkat di HarbourFront dan 30 menit sebelum berangkat di Harbour Bay (sumber pihak ketiga, perlu_cek_ulang).

> Catatan untuk Claude Code: Singapore Cruise Centre punya papan kedatangan/keberangkatan live di singaporecruise.com.sg/schedule/ferries/. Isinya status per trip, termasuk kode trip seperti FRDI0600 untuk BatamFast Batam Centre jam 06:00, dan status "CANCELLED". Papan ini bisa dijadikan rujukan visual atau tautan di widget. Jangan di-scrape tanpa izin.

### 2. Feri internasional Batam–Malaysia

| Rute | Operator | Jadwal | Durasi | Harga | Tanggal data |
|---|---|---|---|---|---|
| Batam Centre ⇄ Stulang Laut (Berjaya Waterfront, Johor Bahru) | Indomas Ferry; juga Dolphin Fast Ferry, Pintas Fast Ferry | BC→Stulang (WIB): 06:00, 08:30, 11:40, 13:30. Stulang→BC (MYT): 09:30, 12:00, 15:15, 17:00 | ±2–2,5 jam | Dari Batam: Rp430.000 sekali jalan / Rp650.000 PP dewasa (termasuk seaport tax Rp100.000). Dari Stulang: MYR 123 sekali jalan | tarif berlaku mulai 1 Januari 2026 (indomasferry.com) |
| Harbour Bay ⇄ Puteri Harbour (Iskandar Puteri) | Putri Anggreni (Ferry Global Group) | HB→PH (WIB): 07:15 (data 3 Nov 2026). PH→HB (MYT): 07:30, 11:00, 13:00, 18:30 (data 4 Nov 2026) | ±1,5–3 jam (sumber tidak konsisten) | RM 125–172 (redBus, Economy/Business) | 3–4 Nov 2026 (ferryglobalgroup.com/schedule) |
| Harbour Bay / Batam Centre / Nongsapura ⇄ Pasir Gudang | Dolphin Fast Ferry, Pasir Gudang Ferry, BatamFast (Nongsapura) | belum ada jadwal resmi yang terverifikasi | ±1,5 jam | – | perlu_cek_ulang |

Satu catatan: Stulang Laut sekarang secara resmi bernama Berjaya Waterfront Ferry Terminal. Media dan warga masih memakai nama "Stulang Laut", jadi di UI sebaiknya tampilkan keduanya.

### 3. Feri dan kapal domestik dari Batam

| Asal | Tujuan | Operator / kapal | Jadwal | Durasi | Harga | Tanggal data |
|---|---|---|---|---|---|---|
| Telaga Punggur | Tanjungpinang (SBP) | MV Oceanna, Marina, Ocean Dragon, Putra Maju | 07:30–17:30, tiap ±30 menit (contoh Juli 2026: 07:30, 08:30, 08:45, 09:15, 09:30, 10:00 …) | 45–60 mnt | Rp80.500 | Feb & Jul 2026 |
| Telaga Punggur | Tanjung Uban (speedboat) | antara lain Bayu Indah Group | 07:00–18:00, tiap ±30 menit | ±15 mnt | Rp63.500 | Feb 2026 |
| Telaga Punggur (RoRo) | Tanjung Uban | ASDP: KMP Trisakti Adinda, KMP Tanjung Burang (KMP Barau sedang docking) | Trisakti Adinda dari Punggur 06:00, 10:00, 14:00, 18:00; Tanjung Burang dari Punggur 08:00, 12:00, 16:00. Dari Tg. Uban: Trisakti Adinda 08:00, 12:00, 16:00; Tanjung Burang 06:00, 10:00, 14:00, 18:00 | ±1 jam (perlu_cek_ulang) | Dewasa Rp27.000; motor (Gol. II) Rp51.000; mobil (Gol. IVA) Rp309.000 | 9 Okt 2026 |
| Telaga Punggur | Seitenam – Dabo Singkep (Lingga) | – | 10:30 setiap hari | – | Rp306.000 (Seitenam Rp252.000) | Feb 2026 |
| Telaga Punggur | Senayang – Pancur – Benan – Tajur Biru – Seitenam | – | 11:00, dua hari sekali | – | Rp212.000–252.000 | Feb 2026 |
| Telaga Punggur | Letung – Tarempa (Anambas) | – | 08:30, 2x seminggu, tergantung cuaca | – | Letung Rp440.000; Tarempa Rp494.000 | Feb 2026 |
| Telaga Punggur (RoRo) | Mengkapan Buton, Kuala Tungkal | ASDP | ada (contoh 2 April 2026), jam belum terverifikasi | – | – | perlu_cek_ulang |
| Sekupang Domestik | Tanjung Balai Karimun | Dumai Line / Batam Jet 8 & 9 | 07:20 setiap hari (Tribun, Jun–Agu 2026); jadwal lama Dumai Express 07:00, 07:30, 09:30, 13:00, 14:15, 16:15 (usang) | ±1–1,5 jam (perlu_cek_ulang) | Rp132.000 | 2026 |
| Sekupang Domestik | Tanjung Samak, Selat Panjang, Bengkalis, Buton, Dumai, Kuala Enok, Kuala Tungkal | Dumai Line Group | Batam–Buton–Bengkalis–Dumai berangkat 07:30 (jadwal lama) | – | Tg. Samak Rp222.000; Selat Panjang Rp282.000; Bengkalis Rp442.000; Buton Rp452.000; Dumai/Kuala Enok/Kuala Tungkal Rp600.000 | menjelang Lebaran 2026 (batampos) |
| Sekupang Domestik | Tanjung Batu (Kundur), Penyalai | – | 07:45 (jadwal lama) | – | – | usang |
| Harbour Bay Domestik | Tanjung Balai Karimun, Moro (Sri Mandah) | – | ada di easybook, jam belum terverifikasi | – | – | perlu_cek_ulang |
| Bintang 99, Batu Ampar (Pelni) | Tanjung Priok (Jakarta), Belawan (Medan), Tanjung Balai Karimun | PT Pelni, KM Kelud (Januari 2026 juga KM Nggapulu) | sekitar mingguan; contoh Batam→Jakarta Rabu 5 Agu 2026 16:00, Batam→Belawan Minggu 2 Agu 2026 12:00 | Jakarta ±32 jam; Belawan ±28 jam | Kelas 1A ke Jakarta Rp1.283.000–1.308.000; ekonomi ke Jakarta mulai ±Rp382.000; ekonomi ke Belawan mulai ±Rp267.000 | Feb–Agu 2026 |

Tiket Pelni bisa dibeli lewat aplikasi PELNI Mobile, pelni.co.id, atau loket cabang Pelni Batam. Kapal Pelni pindah sandar ke Pelabuhan Bintang 99 Persada (Batu Ampar) sejak Desember 2024. Natuna tidak punya rute reguler yang terverifikasi dari Batam dalam riset ini, jadi statusnya perlu_diisi_user.

Harga resmi Punggur ditetapkan BP Batam lewat pengelola BatamPort (batamport.bpbatam.go.id). Itu link rujukan terbaik untuk domestik.

### 4. Pompong dan pancung ke pulau hinterland

| Pelantar | Kecamatan | Tujuan | Jam operasi | Tarif | Durasi | Status data |
|---|---|---|---|---|---|---|
| Pelabuhan Rakyat Sekupang (PPMS / KPompong) | Sekupang | Belakang Padang | 24 jam (malam harus pesan); berangkat kalau sudah ±6 penumpang | Rp20.000/orang; carter 1–4 orang Rp160.000, 5–10 orang Rp200.000 | ±25 mnt (5,7 km) | tarif sejak Sept 2022, perlu_cek_ulang |
| Pelabuhan Rakyat Sekupang | Sekupang | Pulau lain (Kasu, Pemping, Terong, Pecong) | tidak terjadwal | nego dengan tekong; Kasu–Batam ±Rp180.000 PP (kemungkinan carter) | Kasu ±30 mnt, Terong ±45 mnt | lemah |
| Belakang Padang (pelantar pompong antarpulau) | Belakang Padang | Kasu (pompong reguler sekali sehari ±11:00, balik esok ±07:00); Pulau Geranting | – | carter ke Kasu Rp150.000–200.000; Geranting Rp140.000/orang | Kasu ±45 mnt; Geranting ±1 jam | data lama |
| Pelabuhan Rakyat Sagulung (dekat Tg. Uncang) | Sagulung | Pulau Buluh (Bulang); Pemping dan Pulau Bulan dengan carter | – | Rp15.000 (2020–2021); Lebaran Rp20.000–25.000 | <10 mnt ke Pulau Buluh | perlu_cek_ulang |
| Pelabuhan Rakyat Tanjung Riau | Sekupang | lebih banyak angkutan barang ke Riau | – | – | – | perlu_diisi_user |
| Pelantar Batu Ampar / Tanjung Sengkuang | Batu Ampar | – | – | – | – | perlu_diisi_user |
| Kampung Tua Telaga Punggur | Nongsa | Pulau Ngenang | – | carter Rp100.000 PP (kapasitas 10); tarif warga Rp20.000 PP | 15–20 mnt | perlu_cek_ulang |
| Bawah Jembatan 1 Barelang | Bulang/Galang | keliling jembatan, Pulau Panjang, Pulau Akar (wisata) | ramai akhir pekan | Rp10.000/orang (2016) | – | usang |
| Pelantar Jembatan 2 Barelang | Galang | Pulau Panjang | – | Rp60.000 PP (2014) | <15 mnt | usang |
| Pelabuhan Sembulang | Galang (Rempang) | Pulau Mubut Darat, Pulau Tunjuk | – | Rp20.000–25.000 sekali jalan; Rp70.000 PP termasuk tiket masuk | 10–15 mnt | perlu_cek_ulang |
| Pelabuhan Sungai Budus | Galang | Pulau Abang | tidak ada kapal rutin | ±Rp20.000/orang; paket transport snorkeling Rp50.000–60.000 | ±30 mnt | lemah |
| Setokok | Bulang | – | – | – | – | perlu_diisi_user |

**Tips keselamatan untuk panduan warga:**
- Minta dan pakai pelampung (life jacket) sebelum pompong jalan, terutama untuk anak-anak.
- Jangan naik kalau pompong sudah kelebihan muatan. Satu pompong PPMS standarnya 12 penumpang + 1 pengemudi.
- Simpan HP dan dokumen di kantong kedap air. Siapkan uang tunai pecahan kecil.
- Hindari menyeberang saat hujan badai atau angin kencang, dan cek situs hujandibatam sebelum berangkat. Rute malam hanya lewat pesanan.
- Untuk pulau yang jauh (Kasu, Terong, Abang), sepakati jam jemput balik dengan tekong dan simpan nomornya.

### 5. Info praktis menyeberang

- **Paspor dan imigrasi:** paspor sebaiknya berlaku minimal 6 bulan. Warga negara asing yang masuk Batam mengisi All Indonesia e-Arrival Card dalam 72 jam sebelum tiba. Warga Singapura dan ASEAN bebas visa 30 hari. Kebanyakan negara lain memakai VoA USD 35 atau e-VOA. Warga Batam yang ke Singapura perlu mengisi SG Arrival Card. Ini perlu_cek_ulang di ica.gov.sg, karena belum diverifikasi dalam riset ini.
- **Check-in:** datang minimal 45 menit sebelum berangkat, dan 60 menit pada Jumat sore, Sabtu pagi, atau hari libur. Majestic mensyaratkan check-in di konter 60 menit sebelum berangkat. RoRo ASDP minta datang minimal 2 jam sebelumnya.
- **Barang bawaan pulang dari Singapura:** menurut PMK 203/PMK.04/2017 (beacukai.go.id dan KMS Kemenkeu), barang pribadi penumpang senilai maksimal FOB USD 500 per orang per kedatangan dibebaskan dari bea masuk dan pajak. Kelebihannya kena bea masuk flat 10% + PPN, ditambah PPh "0,5-10% (jika punya NPWP) atau 1-20% (jika tidak punya NPWP)". Pembebasan cukai berlaku untuk "200 batang sigaret, 25 batang cerutu, atau 100 gram tembakau iris... dan/atau 1 liter minuman mengandung etil alkohol" (usia 21+ untuk alkohol). PMK 92/2025 yang berlaku 1 April 2026 mengatur penyelesaian barang yang terkendala administrasi kepabeanan, dan tidak mengubah angka USD 500. Uang tunai di atas Rp100 juta (atau setara) wajib dilaporkan.
- **Kartu kesehatan:** tidak ditemukan kewajiban kartu kesehatan khusus untuk rute Batam–Singapura/Malaysia per November 2026. BatamFast menautkan dokumen "Quick Travel Requirement" untuk panduan terbaru.
- **Musim angin utara dan ombak:** November–Februari, puncaknya Desember–Januari. Gelombang di perairan Batam, Bintan, Karimun, dan Lingga bisa 1,25–2,5 m. Di Natuna dan Anambas 2,5–4 m, bahkan bisa lebih. Feri Dumai Line sempat dihantam ombak 2–3 m pada 4 Januari 2026. Di musim ini, siapkan obat antimabuk, pilih kursi di tengah atau belakang kapal, beri buffer waktu, dan pantau pengumuman pembatalan. Jadwal RoRo Punggur–Uban pernah dijarangkan menjadi tiap 1 jam 15 menit pada Januari 2026 karena cuaca.
- **Feri terakhir:** untuk day trip, patokannya feri terakhir dari Singapura ke Batam Centre adalah 21:40 (BatamFast) / 21:50 (Sindo) SGT. Ke Harbour Bay 21:35 SGT. Ke Sekupang 19:30 (BatamFast) / 20:40 (Majestic) SGT.

### 6. Data geometri rute untuk peta

**Pendekatan yang disarankan:**
1. Ambil dulu `route=ferry` dari OpenStreetMap lewat Overpass. Jalur feri di OSM biasanya berupa way bertag `route=ferry`, dan kadang dibungkus relation `type=route` + `route=ferry`. Terminal biasanya bertag `amenity=ferry_terminal`.
2. Kalau sebuah rute tidak ada di OSM (kemungkinan besar untuk pompong), gambar manual sebagai LineString dari koordinat pelantar ke pelantar tujuan. Tambahkan 2–5 titik belok supaya garisnya tidak memotong daratan atau kawasan pelabuhan. MarineTraffic hanya dipakai sebagai referensi visual pola lintasan, dan geometrinya jangan disalin.
3. Simpan satu Feature per rute dengan properti `rute_id`, `jenis`, `operator`, `durasi_menit`, `sumber_geometri` (`osm` / `manual` / `perkiraan`), dan `osm_id` bila ada.
4. Untuk animasi kapal di mural: interpolasi posisi sepanjang LineString memakai `turf.along(line, (t_now - t_depart) / durasi * panjang)`, dan sesuaikan zona waktu keberangkatan (SGT vs WIB). Beri label "posisi perkiraan, bukan AIS".

**Contoh query Overpass (bbox Batam + Selat Singapura + Bintan; urutan south, west, north, east):**

```
[out:json][timeout:60];
(
  way["route"="ferry"](0.70,103.55,1.50,104.60);
  relation["route"="ferry"](0.70,103.55,1.50,104.60);
);
out geom;
```

**Terminal dan pelantar:**

```
[out:json][timeout:60];
(
  nwr["amenity"="ferry_terminal"](0.70,103.55,1.50,104.60);
  nwr["man_made"="pier"](0.85,103.80,1.25,104.20);
);
out center tags;
```

Catatan: Overpass akan error kalau bujur pertama lebih besar dari bujur kedua, jadi pastikan urutannya (lat_min, lon_min, lat_max, lon_max). Hasil `out geom` bisa langsung dikonversi ke GeoJSON pakai `osmtogeojson`.

**Contoh GeoJSON (geometri perkiraan, bukan dari OSM):**

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "rute_id": "btc-hfc",
        "jenis": "internasional",
        "operator": ["BatamFast", "Majestic", "Sindo"],
        "durasi_menit": 70,
        "sumber_geometri": "perkiraan"
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [[104.0552, 1.1309], [104.0300, 1.1650], [103.9300, 1.2000], [103.8250, 1.2600]]
      }
    }
  ]
}
```

Format koordinat GeoJSON adalah [lng, lat]. Titik HarbourFront 103.8250, 1.2600 di contoh ini hanya perkiraan, dan harus diganti dengan koordinat Singapore Cruise Centre yang terverifikasi.

---

## Recommendations

1. **Widget "Feri terakhir hari ini":** sumbernya file JSON statis hasil ketik ulang dari jadwal resmi (BatamFast PDF 1 Nov 2026, Majestic PDF Mei 2026, halaman Sindo, halaman Horizon). Tampilkan `tanggal_data`. Kalau `tanggal_data` sudah lebih dari 60 hari, munculkan banner "jadwal mungkin sudah berubah". Selalu sertakan tombol ke link resmi operator.
2. **Jangan menampilkan harga sebagai angka pasti.** Tulis sebagai "mulai dari" dan tambahkan catatan soal fee dan fuel surcharge.
3. **Untuk pompong, tampilkan sebagai "rute rakyat, tarif nego"** kecuali Sekupang–Belakang Padang. Siapkan tombol "laporkan tarif terbaru" untuk warga.
4. **Prioritas verifikasi koordinat** (lihat daftar di bagian paling akhir): Singapore Cruise Centre, Nongsapura, Gold Coast Bengkong, Bintang 99, dan semua pelantar rakyat.

## Caveats

- Banyak jadwal di laporan ini berasal dari situs operator yang bisa berubah kapan saja. Ada beberapa ketidakcocokan antarsumber: Sindo Sekupang 20:30, versi jadwal Sindo Batam Centre, dan tanggal mulai fuel surcharge (12 Maret 2026 menurut Sindo Ferry dan Mothership, sedangkan judul berita BatamFast menulis 14 Maret 2026).
- Data pompong mayoritas dari berita atau blog 2014–2022. Tarifnya kemungkinan sudah naik.
- Koordinat terminal belum dicek langsung di OpenStreetMap. Label "terverifikasi" artinya minimal dua sumber independen (Wikidata + Waze/Wikimapia) cocok. Koordinat resmi di situs BatamPort untuk Batam Centre, Nongsapura, dan Telaga Punggur tampak salah ketik, jadi jangan dipakai.
- Jadwal Pelni dan RoRo per hari bisa berbeda dari contoh. Gunakan aplikasi PELNI dan Ferizy sebagai rujukan final.

---

## Blok data JSON

### (a) Terminal dan pelantar

```json
[
  {"id":"btc","nama":"Pelabuhan Internasional Batam Centre","jenis":"terminal_internasional","kecamatan":"Batam Kota","alamat":"Jl. Engku Putri, Batam Centre","lat":1.1309,"lng":104.0552,"status_koordinat":"terverifikasi","sumber_url":"https://www.wikidata.org/wiki/Q12504166"},
  {"id":"skp","nama":"Pelabuhan Internasional & Domestik Sekupang","jenis":"terminal_internasional_domestik","kecamatan":"Sekupang","alamat":"Jl. RE Martadinata, Sekupang","lat":1.1314,"lng":103.9253,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://batamport.bpbatam.go.id/sekupang/"},
  {"id":"hb","nama":"Harbour Bay Ferry Terminal","jenis":"terminal_internasional_domestik","kecamatan":"Batu Ampar","alamat":"Harbourbay Downtown, Bayfront Mall","lat":1.1539,"lng":103.9971,"status_koordinat":"terverifikasi","sumber_url":"https://www.wikidata.org/wiki/Q65091241"},
  {"id":"nsp","nama":"Nongsapura Ferry Terminal","jenis":"terminal_internasional","kecamatan":"Nongsa","alamat":"Nongsa","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://batamport.bpbatam.go.id/nongsapura/"},
  {"id":"gcb","nama":"Gold Coast International Ferry Terminal Bengkong","jenis":"terminal_internasional","kecamatan":"Bengkong","alamat":"Kawasan Pantai Indah Mutiara Blok B No. 36-37, Bengkong","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://batamstraits.com/2025/04/14/gold-coast-international-ferry-terminal-bengkong-diresmikan-di-batam/"},
  {"id":"wfc","nama":"Waterfront City Ferry Terminal (Teluk Senimba)","jenis":"terminal_internasional","kecamatan":"Sekupang","alamat":"Jl. KH Ahmad Dahlan, Tanjung Uncang","lat":1.08243,"lng":103.93751,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://www.streetdirectory.com/indonesia/batam/travel/travel_id_14593/travel_site_10111/travel_no_/"},
  {"id":"tpg","nama":"Pelabuhan Telaga Punggur (feri & RoRo)","jenis":"terminal_domestik","kecamatan":"Nongsa","alamat":"Telaga Punggur","lat":1.0352,"lng":104.1334,"status_koordinat":"terverifikasi","sumber_url":"https://www.wikidata.org/wiki/Q14236384"},
  {"id":"b99","nama":"Pelabuhan Bintang 99 Persada (sandar Pelni)","jenis":"pelabuhan_pelni","kecamatan":"Batu Ampar","alamat":"selatan Pelabuhan Batu Ampar","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://sumatra.bisnis.com/read/20241202/534/1820818/dermaga-kapal-pelni-pindah-ke-pelabuhan-bintang-99-batam-4-desember-2024"},
  {"id":"bta","nama":"Pelabuhan Batu Ampar","jenis":"pelabuhan_pelni","kecamatan":"Batu Ampar","alamat":"Batu Ampar","lat":1.1648,"lng":104.0016,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://readmore.id/jadwal-kapal/pelabuhan/pelabuhan-batu-ampar"},
  {"id":"pr-skp","nama":"Pelabuhan Rakyat Sekupang (pompong PPMS)","jenis":"pelantar_pompong","kecamatan":"Sekupang","alamat":"bersebelahan Terminal Sekupang","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepripedia.com/tarif-boat-pancung-ke-belakang-padang-pp-naik-2-ribu/"},
  {"id":"pr-tgr","nama":"Pelabuhan Rakyat Tanjung Riau","jenis":"pelantar_pompong","kecamatan":"Sekupang","alamat":"Tanjung Riau","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://rempangpost.com/pelabuhan-rakyat-tanjung-riau-jalur-senyap-barang-dari-batam-ke-riau/"},
  {"id":"pr-sgl","nama":"Pelabuhan Rakyat Sagulung","jenis":"pelantar_pompong","kecamatan":"Sagulung","alamat":"dekat Tanjung Uncang","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://www.batamnews.co.id/berita-105973-pelabuhan-rakyat-sagulung-batam-tempat-penyeberangan-yang-bersih-dan-layak-dikunjungi.html"},
  {"id":"pr-bta","nama":"Pelantar Batu Ampar / Tanjung Sengkuang","jenis":"pelantar_pompong","kecamatan":"Batu Ampar","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":null},
  {"id":"pr-ktp","nama":"Pelantar Kampung Tua Telaga Punggur","jenis":"pelantar_pompong","kecamatan":"Nongsa","alamat":"Kampung Tua Telaga Punggur","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://travel.detik.com/cerita-perjalanan/d-5404649/ngenang-pulau-kenangan-yang-tak-terlupakan"},
  {"id":"pr-jb1","nama":"Pelantar bawah Jembatan 1 Barelang","jenis":"pelantar_pompong","kecamatan":"Bulang","alamat":"Jembatan 1 Barelang","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://ulasan.co/nikmati-keindahan-jembatan-1-barelang-sambil-keliling-naik-kapal-pancung/"},
  {"id":"pr-jb2","nama":"Pelantar Jembatan 2 Barelang","jenis":"pelantar_pompong","kecamatan":"Galang","alamat":"Jembatan 2 Barelang","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://www.linasasmita.com/2014/12/island-hopping-ke-pulau-panjang_90.html"},
  {"id":"pr-smb","nama":"Pelabuhan Sembulang","jenis":"pelantar_pompong","kecamatan":"Galang","alamat":"Sembulang, Pulau Rempang (Plus Code R7W6+43C)","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://sg.trip.com/travel-guide/attraction/galang/pelabuhan-sembulang-137076004"},
  {"id":"pr-sbd","nama":"Pelabuhan Sungai Budus","jenis":"pelantar_pompong","kecamatan":"Galang","alamat":"±12 km setelah Jembatan 6","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://jalankemanagitu.wordpress.com/tag/diving-pulau-abang/"},
  {"id":"pr-stk","nama":"Pelantar Setokok","jenis":"pelantar_pompong","kecamatan":"Bulang","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":null},
  {"id":"sg-scc","nama":"Singapore Cruise Centre (HarbourFront)","jenis":"terminal_tujuan","kecamatan":null,"alamat":"5 HarbourFront Avenue, Singapore 099549","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://sg.news.yahoo.com/batam-fast-run-harbourfront-terminal-100000719.html"},
  {"id":"sg-tmft","nama":"Tanah Merah Ferry Terminal","jenis":"terminal_tujuan","kecamatan":null,"alamat":"Tanah Merah, Singapura","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://singaporecruise.com.sg/schedule/ferries/"},
  {"id":"my-stl","nama":"Stulang Laut / Berjaya Waterfront Ferry Terminal","jenis":"terminal_tujuan","kecamatan":null,"alamat":"Stulang, Johor Bahru","lat":1.471028,"lng":103.783083,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://en.wikipedia.org/wiki/Stulang_Laut_Ferry_Terminal"}
]
```

### (b) Rute

```json
[
  {"id":"btc-hfc","asal_id":"btc","tujuan":"HarbourFront (Singapore Cruise Centre)","operator":["BatamFast","Majestic","Sindo"],"durasi_menit":70,"harga_kisaran":"SGD 28 + fee s/d SGD 43 all-in; fuel surcharge Rp65.000 dari Batam","jenis":"internasional","link_jadwal_resmi":"https://www.batamfast.com/","sumber_url":"https://batam.com/blog/how-to-get-from-singapore-to-batam-the-complete-guide"},
  {"id":"btc-tmft","asal_id":"btc","tujuan":"Tanah Merah","operator":["BatamFast","Majestic","Sindo"],"durasi_menit":60,"harga_kisaran":"±SGD 43 all-in","jenis":"internasional","link_jadwal_resmi":"https://www.majesticfastferry.com.sg/Assets/Schedule/webschedule12052026113353.pdf","sumber_url":"https://www.batamfast.com/"},
  {"id":"skp-hfc","asal_id":"skp","tujuan":"HarbourFront (Singapore Cruise Centre)","operator":["BatamFast","Majestic","Sindo"],"durasi_menit":50,"harga_kisaran":"SGD 28 + fee s/d SGD 43 all-in","jenis":"internasional","link_jadwal_resmi":"https://www.sindoferry.com.sg/schedules","sumber_url":"https://www.batamfast.com/"},
  {"id":"hb-hfc","asal_id":"hb","tujuan":"HarbourFront (Singapore Cruise Centre)","operator":["Horizon"],"durasi_menit":50,"harga_kisaran":"mulai SGD 43 + fuel surcharge","jenis":"internasional","link_jadwal_resmi":"https://horizonfastferry.com.sg/","sumber_url":"https://horizonfastferry.com.sg/"},
  {"id":"nsp-tmft","asal_id":"nsp","tujuan":"Tanah Merah","operator":["BatamFast"],"durasi_menit":50,"harga_kisaran":"SGD 43 all-in","jenis":"internasional","link_jadwal_resmi":"https://www.batamfast.com/","sumber_url":"https://www.batamfast.com/"},
  {"id":"gcb-hfc","asal_id":"gcb","tujuan":"HarbourFront (Singapore Cruise Centre)","operator":["BatamFast","Sindo"],"durasi_menit":60,"harga_kisaran":"promo SGD 17,50 belum termasuk pajak & surcharge","jenis":"internasional","link_jadwal_resmi":"https://www.batamfast.com/","sumber_url":"https://www.batamfast.com/"},
  {"id":"wfc-hfc","asal_id":"wfc","tujuan":"HarbourFront (Singapore Cruise Centre)","operator":["Sindo"],"durasi_menit":60,"harga_kisaran":"SGD 28 + fee","jenis":"internasional","link_jadwal_resmi":"https://www.sindoferry.com.sg/schedules","sumber_url":"https://www.sindoferry.com.sg/schedules"},
  {"id":"btc-stl","asal_id":"btc","tujuan":"Stulang Laut (Johor Bahru)","operator":["Indomas","Dolphin Fast Ferry","Pintas Fast Ferry"],"durasi_menit":150,"harga_kisaran":"Rp430.000 sekali jalan / Rp650.000 PP (termasuk seaport tax)","jenis":"internasional","link_jadwal_resmi":"https://www.indomasferry.com/","sumber_url":"https://www.indomasferry.com/"},
  {"id":"hb-ph","asal_id":"hb","tujuan":"Puteri Harbour (Iskandar Puteri)","operator":["Putri Anggreni (Ferry Global Group)"],"durasi_menit":null,"harga_kisaran":"RM 125-172","jenis":"internasional","link_jadwal_resmi":"https://ferryglobalgroup.com/schedule","sumber_url":"https://www.redbus.my/ferry-tickets/harbour-bay-ferry-terminal-to-puteri-harbour-ferry-terminal-departure-hall"},
  {"id":"tpg-tpi","asal_id":"tpg","tujuan":"Tanjungpinang (Sri Bintan Pura)","operator":["Oceanna","Marina","Ocean Dragon","Putra Maju"],"durasi_menit":50,"harga_kisaran":"Rp80.500","jenis":"domestik","link_jadwal_resmi":"https://batamport.bpbatam.go.id/telaga-punggur/","sumber_url":"https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/"},
  {"id":"tpg-tgu","asal_id":"tpg","tujuan":"Tanjung Uban (speedboat)","operator":["Bayu Indah Group","lainnya"],"durasi_menit":15,"harga_kisaran":"Rp63.500","jenis":"domestik","link_jadwal_resmi":"https://batamport.bpbatam.go.id/telaga-punggur/","sumber_url":"https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/"},
  {"id":"tpg-tgu-roro","asal_id":"tpg","tujuan":"Tanjung Uban (RoRo)","operator":["ASDP: KMP Trisakti Adinda","KMP Tanjung Burang","KMP Barau"],"durasi_menit":null,"harga_kisaran":"dewasa Rp27.000; motor Rp51.000; mobil Rp309.000","jenis":"domestik","link_jadwal_resmi":"https://trip.ferizy.com","sumber_url":"https://www.batamnews.co.id/berita-130793-jadwal-roro-telaga-punggur-tanjung-uban-jumat-9-oktober-2026-dua-kapal-beroperasi-hingga-sore.html"},
  {"id":"tpg-dabo","asal_id":"tpg","tujuan":"Seitenam - Dabo Singkep (Lingga)","operator":[],"durasi_menit":null,"harga_kisaran":"Rp252.000-306.000","jenis":"domestik","link_jadwal_resmi":"https://batamport.bpbatam.go.id/telaga-punggur/","sumber_url":"https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/"},
  {"id":"tpg-trp","asal_id":"tpg","tujuan":"Letung - Tarempa (Anambas)","operator":[],"durasi_menit":null,"harga_kisaran":"Rp440.000-494.000","jenis":"domestik","link_jadwal_resmi":"https://batamport.bpbatam.go.id/telaga-punggur/","sumber_url":"https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/"},
  {"id":"skp-tbk","asal_id":"skp","tujuan":"Tanjung Balai Karimun","operator":["Dumai Line (Batam Jet 8/9)"],"durasi_menit":null,"harga_kisaran":"Rp132.000","jenis":"domestik","link_jadwal_resmi":null,"sumber_url":"https://metropolis.batampos.co.id/ini-harga-tiket-ferry-dari-pelabuhan-domestik-sekupang-ke-berbagai-daerah/"},
  {"id":"skp-dumai","asal_id":"skp","tujuan":"Selat Panjang - Bengkalis - Dumai / Kuala Enok / Kuala Tungkal","operator":["Dumai Line Group"],"durasi_menit":null,"harga_kisaran":"Rp282.000-600.000","jenis":"domestik","link_jadwal_resmi":null,"sumber_url":"https://metropolis.batampos.co.id/ini-harga-tiket-ferry-dari-pelabuhan-domestik-sekupang-ke-berbagai-daerah/"},
  {"id":"b99-pelni","asal_id":"b99","tujuan":"Tanjung Priok / Belawan / Tanjung Balai Karimun","operator":["PELNI KM Kelud"],"durasi_menit":1920,"harga_kisaran":"ekonomi mulai ±Rp267.000 (Belawan) / ±Rp382.000 (Jakarta); kelas 1A Rp1.283.000-1.308.000","jenis":"domestik","link_jadwal_resmi":"https://www.pelni.co.id","sumber_url":"https://papua.tribunnews.com/news/128375/jadwal-kapal-pelni-batam-jakarta-agustus-2026-cek-harga-tiket-km-kelud"},
  {"id":"skp-blp","asal_id":"pr-skp","tujuan":"Belakang Padang","operator":["PPMS / KPompong"],"durasi_menit":25,"harga_kisaran":"Rp20.000; carter Rp160.000-200.000","jenis":"pompong","link_jadwal_resmi":"https://kpompong.com/","sumber_url":"https://www.researchgate.net/publication/394905333_Pengelolaan_Antrian_Kapal_Pompong_Berbasis_Teknologi_di_Pelabuhan_Sekupang-Belakang_Padang"},
  {"id":"sgl-buluh","asal_id":"pr-sgl","tujuan":"Pulau Buluh (Bulang)","operator":["penambang pancung Sagulung"],"durasi_menit":10,"harga_kisaran":"Rp15.000-25.000","jenis":"pompong","link_jadwal_resmi":null,"sumber_url":"https://gokepri.com/pelabuhan-rakyat-sagulung-batam-ramai-saat-lebaran/"},
  {"id":"ktp-ngenang","asal_id":"pr-ktp","tujuan":"Pulau Ngenang","operator":["pompong warga"],"durasi_menit":20,"harga_kisaran":"Rp20.000 PP (warga) / carter Rp100.000 PP","jenis":"pompong","link_jadwal_resmi":null,"sumber_url":"https://travel.detik.com/cerita-perjalanan/d-5404649/ngenang-pulau-kenangan-yang-tak-terlupakan"},
  {"id":"smb-mubut","asal_id":"pr-smb","tujuan":"Pulau Mubut Darat","operator":["pompong warga"],"durasi_menit":15,"harga_kisaran":"Rp20.000-25.000 sekali jalan","jenis":"pompong","link_jadwal_resmi":null,"sumber_url":"https://www.beritaibukota.com/pulau-mubut-di-galang-menyediakan-wisata-bahari-sajikan-pemandangan-alam-berbeda-di-sisi-pulau/"},
  {"id":"sbd-abang","asal_id":"pr-sbd","tujuan":"Pulau Abang","operator":["pompong/kapal nelayan"],"durasi_menit":30,"harga_kisaran":"±Rp20.000/orang (tidak rutin)","jenis":"pompong","link_jadwal_resmi":null,"sumber_url":"https://jalankemanagitu.wordpress.com/tag/diving-pulau-abang/"},
  {"id":"blp-kasu","asal_id":"pr-skp","tujuan":"Pulau Kasu / Pemping / Terong","operator":["pancung carter"],"durasi_menit":45,"harga_kisaran":"nego; Kasu carter Rp150.000-200.000 sekali jalan","jenis":"pompong","link_jadwal_resmi":null,"sumber_url":"https://www.researchgate.net/publication/316854142_POTRET_KEHIDUPAN_MASYARAKAT_HINTERLAND_KOTA_BATAM"}
]
```

### (c) Contoh jadwal

```json
[
  {"rute_id":"btc-hfc","arah":"Batam Centre -> HarbourFront (BatamFast, WIB)","jam_berangkat":["06:00","07:00","08:20","09:50","11:10","12:50","14:10","15:20","16:30","17:40","19:00","20:30"],"hari":"setiap hari","tanggal_data":"2026-11-01","sumber_url":"https://www.batamfast.com/"},
  {"rute_id":"btc-hfc","arah":"HarbourFront -> Batam Centre (BatamFast, SGT)","jam_berangkat":["07:40","08:40","09:30","10:50","12:30","14:20","15:30","16:50","18:00","19:10","20:20","21:40"],"hari":"setiap hari","tanggal_data":"2026-11-01","sumber_url":"https://www.batamfast.com/"},
  {"rute_id":"btc-hfc","arah":"Batam Centre -> HarbourFront (Majestic, WIB)","jam_berangkat":["06:00","07:10","08:20","09:30","10:20","11:30","12:20","13:30","14:30","15:15","16:00","17:30","18:30","20:35"],"hari":"sebagian trip hanya akhir pekan/libur (perlu_cek_ulang)","tanggal_data":"2026-05","sumber_url":"https://www.majesticfastferry.com.sg/Assets/Schedule/webschedule12052026113353.pdf"},
  {"rute_id":"btc-hfc","arah":"HarbourFront -> Batam Centre (Sindo, SGT)","jam_berangkat":["08:00","09:00","10:20","12:00","13:20","14:50","16:10","17:20","18:30","19:40","20:45","21:50"],"hari":"setiap hari","tanggal_data":"2026-11-04","sumber_url":"https://www.sindoferry.com.sg/schedules"},
  {"rute_id":"hb-hfc","arah":"Harbour Bay -> HarbourFront (Horizon, WIB)","jam_berangkat":["06:00","07:15","08:30","09:45","10:45","11:45","12:45","14:00","15:30","16:30","17:30","19:15","20:30"],"hari":"setiap hari","tanggal_data":"2026-11-04","sumber_url":"https://horizonfastferry.com.sg/"},
  {"rute_id":"hb-hfc","arah":"HarbourFront -> Harbour Bay (Horizon, SGT)","jam_berangkat":["08:15","09:10","10:15","11:15","12:15","13:15","14:15","15:15","16:30","17:45","19:00","20:15","21:35"],"hari":"setiap hari","tanggal_data":"2026-11-04","sumber_url":"https://horizonfastferry.com.sg/"},
  {"rute_id":"nsp-tmft","arah":"Nongsapura -> Tanah Merah (BatamFast, WIB)","jam_berangkat":["06:00","08:00","09:30","12:10","14:20","15:40","17:30","20:00"],"hari":"setiap hari","tanggal_data":"2026-11-01","sumber_url":"https://www.batamfast.com/"},
  {"rute_id":"skp-hfc","arah":"Sekupang -> HarbourFront (Majestic, WIB)","jam_berangkat":["06:00","09:00","13:10","16:20","18:00"],"hari":"setiap hari (perlu_cek_ulang)","tanggal_data":"2026-05","sumber_url":"https://www.majesticfastferry.com.sg/Assets/Schedule/webschedule12052026113353.pdf"},
  {"rute_id":"btc-tmft","arah":"Batam Centre -> Tanah Merah (Majestic, WIB)","jam_berangkat":["06:15","08:25","09:40","12:00","13:00","15:30","17:00","18:00","19:50"],"hari":"sebagian trip akhir pekan (perlu_cek_ulang)","tanggal_data":"2026-05","sumber_url":"https://www.majesticfastferry.com.sg/Assets/Schedule/webschedule12052026113353.pdf"},
  {"rute_id":"btc-stl","arah":"Batam Centre -> Stulang Laut (Indomas, WIB)","jam_berangkat":["06:00","08:30","11:40","13:30"],"hari":"setiap hari (perlu_cek_ulang)","tanggal_data":"2026-01-01","sumber_url":"https://www.indomasferry.com/"},
  {"rute_id":"hb-ph","arah":"Puteri Harbour -> Harbour Bay (Putri Anggreni, MYT)","jam_berangkat":["07:30","11:00","13:00","18:30"],"hari":"contoh 4 Nov 2026","tanggal_data":"2026-11-04","sumber_url":"https://ferryglobalgroup.com/schedule"},
  {"rute_id":"tpg-tgu-roro","arah":"Telaga Punggur -> Tanjung Uban (RoRo, WIB)","jam_berangkat":["06:00","08:00","10:00","12:00","14:00","16:00","18:00"],"hari":"contoh Jumat 9 Okt 2026","tanggal_data":"2026-10-09","sumber_url":"https://www.batamnews.co.id/berita-130793-jadwal-roro-telaga-punggur-tanjung-uban-jumat-9-oktober-2026-dua-kapal-beroperasi-hingga-sore.html"},
  {"rute_id":"tpg-tpi","arah":"Telaga Punggur -> Tanjungpinang (WIB)","jam_berangkat":["07:30","08:30","08:45","09:15","09:30","10:00"],"hari":"contoh sebagian akhir Juli 2026; operasi 07:30-17:30 tiap ±30 menit","tanggal_data":"2026-07","sumber_url":"https://batam.tribunnews.com/kepri/690711/harga-tiket-kapal-ferry-punggur-tanjung-pinang-pada-akhir-juli-2026"},
  {"rute_id":"skp-tbk","arah":"Sekupang -> Tanjung Balai Karimun (WIB)","jam_berangkat":["07:20"],"hari":"setiap hari (contoh Jul-Agu 2026)","tanggal_data":"2026-08","sumber_url":"https://batam.tribunnews.com/kepri/692964/harga-tiket-kapal-ferry-sekupang-tanjung-balai-karimun-pada-agustus-2026"},
  {"rute_id":"tpg-dabo","arah":"Telaga Punggur -> Seitenam - Dabo Singkep (WIB)","jam_berangkat":["10:30"],"hari":"setiap hari","tanggal_data":"2026-02-17","sumber_url":"https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/"},
  {"rute_id":"skp-blp","arah":"Sekupang <-> Belakang Padang","jam_berangkat":[],"hari":"24 jam, berangkat saat ±6 penumpang; malam pesan dulu","tanggal_data":"2025","sumber_url":"https://www.researchgate.net/publication/394905333_Pengelolaan_Antrian_Kapal_Pompong_Berbasis_Teknologi_di_Pelabuhan_Sekupang-Belakang_Padang"}
]
```

---

## Daftar terminal dan pelantar yang koordinatnya belum pasti (untuk diisi user)

**Perlu diisi (belum ada koordinat sama sekali):**
- Nongsapura Ferry Terminal (`nsp`). Koordinat di BatamPort salah salin karena bujurnya sama dengan Sekupang.
- Gold Coast International Ferry Terminal Bengkong (`gcb`)
- Pelabuhan Bintang 99 Persada, Batu Ampar (`b99`)
- Singapore Cruise Centre HarbourFront, 5 HarbourFront Avenue (`sg-scc`)
- Tanah Merah Ferry Terminal (`sg-tmft`)
- Pelabuhan Rakyat Sekupang / pompong PPMS (`pr-skp`)
- Pelabuhan Rakyat Tanjung Riau (`pr-tgr`)
- Pelabuhan Rakyat Sagulung (`pr-sgl`)
- Pelantar Batu Ampar / Tanjung Sengkuang (`pr-bta`)
- Pelantar Kampung Tua Telaga Punggur (`pr-ktp`)
- Pelantar bawah Jembatan 1 Barelang (`pr-jb1`)
- Pelantar Jembatan 2 Barelang (`pr-jb2`)
- Pelabuhan Sembulang (`pr-smb`). Sudah ada Plus Code R7W6+43C, tinggal dikonversi.
- Pelabuhan Sungai Budus (`pr-sbd`)
- Pelantar Setokok (`pr-stk`)
- Pelantar pompong antarpulau di Belakang Padang (belum punya id)

**Perlu dicek ulang (koordinat ada, baru dari satu sumber):**
- Sekupang (`skp`): 1.1314, 103.9253 (BatamPort)
- Waterfront City (`wfc`): 1.08243, 103.93751 (Streetdirectory)
- Pelabuhan Batu Ampar (`bta`): 1.1648, 104.0016 (readmore.id)
- Stulang Laut / Berjaya Waterfront (`my-stl`): 1.471028, 103.783083 (Wikipedia)

## Daftar sumber
- batamfast — https://www.batamfast.com/
- batam — https://batam.com/blog/how-to-get-from-singapore-to-batam-the-complete-guide
- tentangkepri — https://tentangkepri.com/17/02/2026/jadwal-kapal-feri-dari-pelabuhan-punggur-batam-ke-sejumlah-pulau-di-kepri/
- batamnews — https://www.batamnews.co.id/berita-126490-update-jadwal-kapal-roro-punggur-2-april-2026-keberangkatan-tiap-jam-tiket-wajib-online.html
- researchgate — https://www.researchgate.net/publication/394905333_Pengelolaan_Antrian_Kapal_Pompong_Berbasis_Teknologi_di_Pelabuhan_Sekupang-Belakang_Padang
- horizonfastferry — https://horizonfastferry.com.sg/blog/horizon-singapore-cruise-centre/
- sindoferry — https://www.sindoferry.com.sg/id-ID
- littlebigreddot — https://littlebigreddot.com/batam-ferry-from-singapore-2026-new-harbourfront-terminal/
- Wikipedia — https://en.wikipedia.org/wiki/HarbourFront_Centre
- batamferrytickets — https://blog.batamferrytickets.com/sekupang-to-singapore-ferry-schedule/
- majesticfastferry — https://www.majesticfastferry.com.sg/Assets/Schedule/webschedule12052026113353.pdf
- tempo — https://en.tempo.co/read/2081085/batam-singapore-ferry-guide-2026-schedule-and-ticket-prices
- sindoferry — https://www.sindoferry.com.sg/schedules
- batamnews — https://www.batamnews.co.id/berita-125205-catat-ini-jadwal-lengkap-roro-tanjung-uban-telaga-punggur-rabu-28-januari-2026.html
- matakepri — https://www.matakepri.com/detail-news/2026/04/13/35282/Info-tarif-dan-Jadwal-Roro-Pelabuhan-Telaga-Punggur-Batam-13-April-2026
- kompas — https://www.kompas.id/artikel/musim-ombak-tinggi-kapal-asing-dan-minyak-tumpah-di-perairan-kepri
- redbus — https://www.redbus.sg/ferry-tickets-online/sindo-ferry-schedule
- redbus — https://www.redbus.sg/ferry-travels/horizon-fast-ferry
- traveloka — https://www.traveloka.com/en-sg/activities/singapore/product/batam-fast-ferry-tickets-harbourfront-terminal-3273817152957
- instarem — https://www.instarem.com/blog/singapore-to-batam-ferry-guide-ticket-price-schedule/
- sindoferry — https://app.sindoferry.com.sg/schedule/
- horizonfastferry — https://horizonfastferry.com.sg/
- singaporeferries — https://www.singaporeferries.com/horizon-fast-ferry/
- singaporecruise — https://singaporecruise.com.sg/schedule/ferries/
- indomasferry — https://www.indomasferry.com/
- ferryglobalgroup — https://ferryglobalgroup.com/schedule
- rome2rio — https://www.rome2rio.com/s/Puteri-Harbour-Ferry/Harbour-Bay-Batam
- redbus — https://www.redbus.my/ferry-tickets/harbour-bay-ferry-terminal-to-puteri-harbour-ferry-terminal-departure-hall
- ferryhopper — https://www.ferryhopper.com/en/ferries/indonesia/batam
- Wikipedia — https://en.wikipedia.org/wiki/Stulang_Laut_Ferry_Terminal
- tribunnews — https://batam.tribunnews.com/kepri/690711/harga-tiket-kapal-ferry-punggur-tanjung-pinang-pada-akhir-juli-2026
- batamnews — https://www.batamnews.co.id/berita-101663-jadwal-kapal-dan-harga-tiket-pelabuhan-punggur-batam-ke-tanjungpinang.html
- tiktok — https://www.tiktok.com/@cecepromosi/video/7647894469454613768
- batamnews — https://www.batamnews.co.id/berita-130793-jadwal-roro-telaga-punggur-tanjung-uban-jumat-9-oktober-2026-dua-kapal-beroperasi-hingga-sore.html
- sempadanpos — https://sempadanpos.com/asdp-tanjung-uban-beri-diskon-tarif-kapal-roro-sambut-nataru-berlaku-hingga-10-januari-2026/tanjungpinang/
- pikiran-rakyat — https://kepri.pikiran-rakyat.com/kepri/pr-2689899109/tarif-tiket-dan-jadwal-kapal-roro-batamtanjung-uban-2026?page=all
- jurnas — https://www.jurnas.com/artikel/1647774/kawasan-strategis-asdp-perkuat-layanan-telaga-punggur-ke-tanjung-uban
- tribunnews — https://batam.tribunnews.com/kepri/689282/harga-tiket-kapal-ferry-tujuan-sekupang-tanjung-balai-karimun-periode-juli-2026
- tribunnews — https://batam.tribunnews.com/kepri/692964/harga-tiket-kapal-ferry-sekupang-tanjung-balai-karimun-pada-agustus-2026
- ulasan — https://ulasan.co/jadwal-dan-harga-tiket-kapal-feri-terbaru-dari-pelabuhan-sekupang-ke-karimun-dan-riau/
- batampos — https://metropolis.batampos.co.id/ini-harga-tiket-ferry-dari-pelabuhan-domestik-sekupang-ke-berbagai-daerah/
- modatransportasi — https://modatransportasi.com/moda-transportasi/jadwal-kapal-dari-terminal-ferry-domestik-sekupang/
- easybook — https://www.easybook.com/ferry/booking/pelabuhanpasirgudang-to-harbourbaybatam
- tribunnews — https://papua.tribunnews.com/news/128375/jadwal-kapal-pelni-batam-jakarta-agustus-2026-cek-harga-tiket-km-kelud
- tribunnews — https://papua.tribunnews.com/news/127922/jadwal-kapal-pelni-batam-belawan-agustus-2026-cek-harga-tiket-km-kelud
- tribunnews — https://papua.tribunnews.com/news/123161/jadwal-kapal-pelni-batam-jakarta-terbaru-februari-2026-harga-tiket-mulai-rp382-ribu
- tribunnews — https://papua.tribunnews.com/news/126234/jadwal-kapal-pelni-batam-belawan-terbaru-juni-2026-cek-harga-tiket-km-kelud
- batampos — https://metropolis.batampos.co.id/ini-jadwal-kapal-pelni-dari-batam-untuk-bulan-januari-dan-februari-2026/
- matakepri — https://www.matakepri.com/detail-news/2026/04/13/35283/Jadwal-Lengkap-dan-Rincian-Tarif-KM-Kelud-dari-Batam-Per-13-April-2026
- bisnis — https://sumatra.bisnis.com/read/20241202/534/1820818/dermaga-kapal-pelni-pindah-ke-pelabuhan-bintang-99-batam-4-desember-2024
- gokepri — https://gokepri.com/pelabuhan-pelni-di-bintang-99-lebih-nyaman-dan-aman-untuk-penumpang/
- kepripedia — https://kepripedia.com/tarif-boat-pancung-ke-belakang-padang-pp-naik-2-ribu/
- batamnews — https://www.batamnews.co.id/berita-105977-harga-tiket-ke-belakang-padang-batam-dan-cara-menuju-ke-sana.html
- medcom — https://www.medcom.id/nasional/daerah/ybJQV2mN-harga-tiket-kapal-pompong-di-batam-naik
- suara — https://riau.suara.com/read/2022/09/06/203453/tarif-tiket-kapal-pompong-di-batam-naik-menyesuaikan-harga-bbm
- batampos — https://metropolis.batampos.co.id/merangkai-jalur-cahaya-dari-pulau-ke-pulau-di-perbatasan-negeri/
- ulasan — https://ulasan.co/tarif-kapal-pancung-ke-belakang-padang-sekupang-naik/
- researchgate — https://www.researchgate.net/publication/316854142_POTRET_KEHIDUPAN_MASYARAKAT_HINTERLAND_KOTA_BATAM
- tvrinews — https://nasional.tvrinews.com/berita/twrlaf5-pulau-belakang-padang-sebuah-permata-tersembunyi-di-wilayah-batam
- batamnews — https://www.batamnews.co.id/berita-105973-pelabuhan-rakyat-sagulung-batam-tempat-penyeberangan-yang-bersih-dan-layak-dikunjungi.html
- linasasmita — https://www.linasasmita.com/2015/06/pulau-buluh-batam-tempat-mudik-dikala.html
- tribunnews — https://batam.tribunnews.com/2020/06/03/penambang-boat-pancung-di-pelabuhan-sagulung-menjerit-sejak-corona-cari-rp-20-ribu-saja-sulit
- gokepri — https://gokepri.com/pelabuhan-rakyat-sagulung-batam-ramai-saat-lebaran/
- rempangpost — https://rempangpost.com/pelabuhan-rakyat-tanjung-riau-jalur-senyap-barang-dari-batam-ke-riau/
- detik — https://travel.detik.com/cerita-perjalanan/d-5404649/ngenang-pulau-kenangan-yang-tak-terlupakan
- researchgate — https://www.researchgate.net/publication/404376255_Orang_Laut_Tersisih_dalam_Pembangunan_Kota_Batam_The_Sea_People_Are_Marginalized_in_the_Development_of_Batam_City
- liputan6 — https://www.liputan6.com/regional/read/2855959/pagi-dan-kenangan-di-pulau-ngenang
- ulasan — https://ulasan.co/nikmati-keindahan-jembatan-1-barelang-sambil-keliling-naik-kapal-pancung/
- jokka2traveller — http://jokka2traveller.com/2016/02/26/jembatan-barelang-memikat-mata-si-pinoy/
- linasasmita — https://www.linasasmita.com/2014/12/island-hopping-ke-pulau-panjang_90.html
- adventurose — https://www.adventurose.com/2015/12/pulau-mubut-darat-diam-diam-bikin.html
- transkepri — https://transkepri.com/news/cetak/5141/
- beritaibukota — https://www.beritaibukota.com/pulau-mubut-di-galang-menyediakan-wisata-bahari-sajikan-pemandangan-alam-berbeda-di-sisi-pulau/
- seniberjalan — https://seniberjalan.com/5-pilihan-tempat-kemping-di-batam/
- jejakpiknik — https://jejakpiknik.com/tempat-wisata-di-batam/
- wordpress — https://jalankemanagitu.wordpress.com/tag/diving-pulau-abang/
- batampos — https://metropolis.batampos.co.id/boat-pancung-sekupang-belakangpadang-dilengkapi-jaket-pelampung-tarif-naik-rp-3-ribu/
- lemon8-app — https://www.lemon8-app.com/@duo_dingdong/7129447379429900801?region=id
- abcnews — https://abcnews.co.id/wisata/1097/panduan-aturan-bea-cukai-terbaru-2026-syarat-barang-bawaan-luar-negeri/
- beacukai — https://soetta.beacukai.go.id/mandatory/barang-penumpang.html
- kabarsumatra — https://www.kabarsumatra.com/2025/11/28/gelombang-4-meter-ancam-perairan-kepri-bmkg-keluarkan-peringatan-dini/
- disway — https://kepri.disway.id/travel/read/794/ombak-3-meter-hantam-kapal-ferry-dumaibatam-ini-penjelasan-operator
- batampos — https://metropolis.batampos.co.id/keberangkatan-kapal-roro-punggur-tanjung-uban-kini-tiap-1-jam-15-menit/
- openstreetmap — https://wiki.openstreetmap.org/wiki/Overpass_API/Language_Guide
