<!-- Salinan verbatim dari research/10-trans-batam.md (task_id wf-36063ca2-a5e1-819c-a7c8-6e6e789889d3): bagian 'Referensi desain peta transit' (termasuk palet warna koridor) dan 'Struktur data yang disarankan untuk Claude Code'. -->

## Referensi desain peta transit

**Contoh dan inspirasi:**
- **Transit Maps oleh Cameron Booth** (transitmap.net). Proyek UTA Rail + BRT-nya relevan langsung: koridor BRT digambar *sederhana* di diagram utama, lalu ditautkan ke **inset strip map** yang memuat semua nama halte. Ini solusi ideal untuk Trans Batam, yang koridornya punya 54–78 halte. Booth juga menekankan hierarki informasi yang kuat, penanda transfer yang jelas, dan label horizontal. Peta favoritnya, Stuttgart sekitar tahun 2000, memakai grid isometrik 30°.
- **Strip map Lisbon dan Prague** (diulas di Transit Maps): mengorbankan geografi demi keterbacaan, cocok untuk tampilan per koridor di mobile.
- **TransJakarta**: rujukan lokal untuk sistem penomoran koridor plus warna. Peta resminya padat, jadi ambil logika warna dan kode koridornya, bukan kepadatannya.

**Prinsip desain diagram:**
- Sudut **0°/45°/90°** (oktilinier). Jarak antarhalte dibuat seragam di antara dua halte transfer.
- **Satu warna per koridor**. Ruas berimpit digambar sebagai garis paralel (bukan ditumpuk), urutannya konsisten sepanjang ruas.
- **Halte transfer** = lingkaran/kapsul bergaris tebal yang menghubungkan semua garis. Halte biasa = tick kecil. Terminal = kapsul tebal di ujung.
- **Label horizontal**, satu keluarga huruf. Halte A/B digabung jadi satu nama di diagram (A/B hanya dipakai di peta geografis).
- **Legenda**: warna koridor, simbol transfer, pelabuhan (jangkar), bandara (pesawat), halte bangunan vs tiang, dan garis putus-putus untuk koridor rencana.
- **Hierarki**: koridor aktif tebal, rencana tipis/putus-putus, feri sebagai garis tipis biru-abu ke Singapura/pulau lain (menyambung nuansa peta laut).

**Tools dan library untuk web:**
- **LOOM** (github.com/ad-freiburg/loom, Universitas Freiburg, GPL-3.0): pipeline `topo | loom | octi | transitmap` menghasilkan SVG geografis, oktilinier, atau ortoradial dari GeoJSON atau GTFS. Ada plugin QGIS buatan Transport for Cairo. Cocok untuk menghasilkan **draf** tata letak, lalu dirapikan manual di Figma/Illustrator atau sebagai SVG.
- **transit-map** (github.com/juliuste/transit-map): oktilinier berbasis MIP. Butuh solver Gurobi dan masih berlabel "work in progress". Kurang praktis.
- **SVG manual + D3** untuk interaksi (hover halte, highlight koridor). Untuk 9 koridor, menggambar manual di grid sering lebih cepat dan lebih indah daripada otomatis.
- **MapLibre `line-offset`** untuk layer geografis: offset dalam piksel, konsisten di semua zoom. Kelemahannya, bisa rusak di persimpangan kompleks. Alternatif terbaru: **maplibre-gl-lanes v1.0.0** (rilis September 2026), plugin yang menghitung urutan garis paralel ala LOOM sesuai zoom.

**Usulan palet (selaras peta laut: kertas gading, tinta hampir hitam, biru-abu, terakota, tinta risograph)**

| Elemen | Nama | Hex |
|---|---|---|
| Latar | Kertas gading | #F4EDDC |
| Teks/garis dasar | Tinta hampir hitam | #1C1B19 |
| Laut/feri | Biru-abu | #5B7083 |
| K1 Sekupang–BC | Biru federal (riso) | #2F4C7E |
| K2 T. Uncang–BC | Terakota | #B5532F |
| K3 Sekupang–Jodoh | Teal (riso) | #1F7A74 |
| K4 Sagulung–Sekupang | Emas tua (riso flat gold, digelapkan) | #9A7533 |
| K5 Jodoh–BC | Merah marine (riso) | #C0444F |
| K6 Piayu–BC | Burgundy (riso) | #7A4466 |
| K7 Nongsa–Bandara–BC | Aqua laut | #2E86A8 |
| K8 Punggur–Jodoh | Hijau lumut | #5E7D3A |
| K9 Punggur–Nongsa | Abu baja | #6B7F8E |
| Rencana (K10/feeder) | Garis putus tinta 40% | #1C1B19 @ 40% |

Tips: beri setiap garis *casing* tipis warna kertas (#F4EDDC, 1–1,5 px) supaya garis paralel tetap terpisah. Pastikan kontras grafis minimal 3:1 terhadap latar; warna emas dan abu paling rawan, makanya sudah digelapkan. Efek risograph bisa didapat lewat tekstur noise halus dan *misregistration* 0,5 px, khusus di versi poster/diagram, jangan di peta interaktif.

## Struktur data yang disarankan untuk Claude Code

**File:**
- `corridors.json`: id, nomor, nama, warna, terminal, status (`aktif`/`rencana`), jam, headway, hari, catatan, sumber.
- `stops.geojson`: Point per halte fisik (sisi A dan B dipisah), properti sesuai skema di bawah.
- `stop_groups.json`: mengelompokkan A/B dan halte transfer jadi satu "stasiun" untuk diagram.
- `patterns.json`: urutan halte per koridor **per arah** (karena arah pergi dan balik sering berbeda).
- `routes.geojson`: LineString per koridor per arah (hasil map-matching).
- `service.json`: jam operasi, headway per periode, jeda Jumat, dan hari operasi.
- `schematic.json`: koordinat grid (x, y) untuk diagram, terpisah dari lat/lng.

**Aturan ketidakpastian (berlaku di semua objek):**
- `status_koordinat`: `terverifikasi` (dicek di lapangan atau citra satelit, akurasi ≤15 m) / `perlu_cek_ulang` (dari landmark atau sumber sekunder) / `perlu_diisi_user` (null).
- `status_data`: `terverifikasi` / `perlu_cek_ulang` / `mungkin_usang`, plus `diverifikasi_pada` (tanggal) dan `sumber_url[]`.
- Di UI, halte berstatus selain `terverifikasi` ditampilkan dengan simbol berongga dan tooltip "lokasi perkiraan".

**Seed data JSON** (koordinat = landmark terdekat, bukan halte; semua `perlu_cek_ulang` atau `null`):

```json
{
  "meta": {
    "versi": "2026-11-04",
    "catatan": "Koordinat adalah titik landmark (pelabuhan/mal/kampus), BUKAN posisi halte. Belum ada koordinat halte terverifikasi. Halte dalam 'urutan' yang tidak ada di 'halte' harus dibuat otomatis dengan lat/lng null dan status_koordinat 'perlu_diisi_user'.",
    "status_enum": ["terverifikasi", "perlu_cek_ulang", "perlu_diisi_user"]
  },
  "koridor": [
    {"id":"K1","nama":"Sekupang – Batam Centre","warna":"#2F4C7E","status":"aktif","jam":"05:45-19:00","headway_menit":null,"hari":"setiap hari","jeda_jumat":"perlu_cek_ulang","jumlah_halte_sumber":56,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025","https://id.wikipedia.org/wiki/Trans_Batam"]},
    {"id":"K2","nama":"Tanjung Uncang – Batam Centre","warna":"#B5532F","status":"aktif","jam":"05:45-19:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":78,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689482853/jadwal-dan-tarif-trans-batam-rute-batam-center-ke-tanjung-uncang-juli-2025"]},
    {"id":"K3","nama":"Sekupang – Jodoh","warna":"#1F7A74","status":"aktif","jam":"06:00-19:00","headway_menit":null,"hari":"setiap hari","jeda_jumat":"perlu_cek_ulang","jumlah_halte_sumber":65,"sumber_url":["https://wartajayavision.com/jadwal-trans-batam-rute-sekupang-jodoh-2025-pembayaran-dana/"]},
    {"id":"K4","nama":"Sagulung – Sekupang","warna":"#9A7533","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":69,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689989631/jadwal-dan-tarif-tiket-trans-batam-rute-sagulung-sekupang-februari-2026?page=all"]},
    {"id":"K5","nama":"Jodoh – Batam Centre","warna":"#C0444F","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":{"nilai":[41,65],"status":"perlu_cek_ulang"},"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-2689553172/jadwal-trans-batam-rute-jodoh-ke-batam-center-agustus-2025-lengkap-tarif-umum-dan-pelajar","https://kepri.pikiran-rakyat.com/kepri/pr-26810369499/bisa-bayar-pakai-brizzi-bri-catat-jadwal-trans-batam-jodoh-batam-center-agustus-2026?page=all"]},
    {"id":"K6","nama":"Tanjung Piayu – Batam Centre","warna":"#7A4466","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":{"nilai":[41,58],"status":"perlu_cek_ulang"},"sumber_url":["https://inspirasitoday.com/ini-jadwal-trans-batam-rute-tanjung-piayu-batam-center-mei-2026/"]},
    {"id":"K7","nama":"Nongsa – Bandara Hang Nadim – Batam Centre","warna":"#2E86A8","status":"aktif","mulai":"2026-07-02","jam":"06:00-19:00","headway_menit":{"pagi_sibuk":20,"siang_sore":30},"armada":"5 + 1 cadangan","hari":"setiap hari","jumlah_halte_sumber":{"nilai":76,"catatan":"sebelum rute bandara"},"sumber_url":["https://batamtoday.com/news/trans-batam-koridor-7-resmi-layani-bandara-hang-nadim-tarif-mulai-rp-2500","https://www.terasbatam.id/mulai-2-juli-trans-batam-resmi-layani-rute-bandara-hang-nadim/","https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"]},
    {"id":"K8","nama":"Punggur – Jodoh","warna":"#5E7D3A","status":"aktif","jam":"06:00-18:00","headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":78,"sumber_url":["https://kepri.pikiran-rakyat.com/kepri/pr-26810054749/koridor-8-trans-batam-rute-punggur-jodoh-catat-jadwal-maret-2026?page=all"]},
    {"id":"K9","nama":"Punggur – Nongsa","warna":"#6B7F8E","status":"aktif","jam":"06:00-18:00","berangkat_pertama":{"dari_nongsa":"06:00","dari_punggur":"06:40"},"headway_menit":null,"hari":"setiap hari","jumlah_halte_sumber":54,"sumber_url":["https://1news.id/54-titik-pemberhentian-rute-trans-batam-punggur-ke-nongsa-oktober-2025/","https://www.batamnews.co.id/berita-126767-jadwal-lengkap-trans-batam-di-9-koridor-dari-sekupang-hingga-punggur-jangan-sampai-ketinggalan.html"]},
    {"id":"K10","nama":"Tembesi – Barelang/Galang","warna":"#1C1B19","status":"rencana","sumber_url":["https://metro.batampos.co.id/13-bus-baru-layani-rute-jodoh-punggur-dan-sekupang-sagulung/"]}
  ],
  "halte": [
    {"id":"tp-batam-center","nama":"Transferpoint Batam Center","koridor":["K1","K2","K5","K6","K7"],"urutan":{"K1":31,"K2":1,"K5":"akhir","K6":27,"K7":"akhir"},"kecamatan":"Batam Kota","alamat":"Jl. Duyung / kawasan Mega Mall–Pelabuhan Batam Centre (perlu_cek_ulang)","lat":1.130856,"lng":104.055225,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri, halte ±240 m","sumber_url":"https://en.wikipedia.org/wiki/Batam_Center_Ferry_Terminal"},
    {"id":"tp-sekupang","nama":"Transferpoint Sekupang","koridor":["K1","K3","K4"],"urutan":{"K1":1,"K3":1,"K4":"akhir"},"kecamatan":"Sekupang","alamat":"Pelabuhan Domestik Sekupang","lat":1.13139,"lng":103.92528,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik pelabuhan (BP Batam)","sumber_url":"https://batamport.bpbatam.go.id/sekupang-domestik/"},
    {"id":"tp-jodoh","nama":"Transferpoint Terminal Jodoh","koridor":["K3","K5","K8"],"urutan":{"K3":"akhir","K5":1,"K8":"akhir"},"kecamatan":"Batu Ampar","alamat":"Sungai Jodoh (Waze plus code 42X3+XR8)","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","catatan_koordinat":"landmark dekat: Jodoh Square II 1.1525,104.0036","sumber_url":"https://www.waze.com/live-map/directions/id/riau-islands/trans-batam-jodoh-bus-terminal?to=place.ChIJ-fM5rCeK2TERgyGcNjnZ8NQ"},
    {"id":"tp-punggur","nama":"Transferpoint Punggur","koridor":["K8","K9"],"urutan":{"K8":1,"K9":1},"kecamatan":"Nongsa","alamat":"Pelabuhan Telaga Punggur","lat":1.03523,"lng":104.133397,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"Wikidata; BP Batam memberi 1.1175,104.1683 (konflik ±9 km)","sumber_url":"https://www.wikidata.org/wiki/Q14236384"},
    {"id":"bandara-hang-nadim","nama":"Bandara Hang Nadim (pintu kedatangan)","koridor":["K7"],"urutan":{"K7":"setelah Simpang Bandara (perlu_cek_ulang)"},"kecamatan":"Nongsa","alamat":"Area kedatangan Bandara Internasional Hang Nadim","lat":1.12083,"lng":104.11861,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik referensi bandara","sumber_url":"https://en.wikipedia.org/wiki/Hang_Nadim_International_Airport"},
    {"id":"pelabuhan-nongsa","nama":"Pelabuhan Nongsa","koridor":["K7"],"urutan":{"K7":2},"kecamatan":"Nongsa","alamat":"Nongsa Pura Ferry Terminal","lat":1.188382,"lng":104.094902,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri (Wikidata)","sumber_url":"https://www.wikidata.org/wiki/Q12504175"},
    {"id":"teluk-mata-ikan","nama":"Teluk Mata Ikan","koridor":["K7"],"urutan":{"K7":1},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"},
    {"id":"pelabuhan-sagulung","nama":"Pelabuhan Sagulung","koridor":["K4"],"urutan":{"K4":1},"kecamatan":"Sagulung","alamat":"Pelabuhan Rakyat Sagulung","lat":1.026217,"lng":103.9255162,"status_koordinat":"perlu_cek_ulang","sumber_url":"https://www.waze.com/id/live-map/directions/id/kepulauan-riau/pelabuhan-rakyat-sagulung-batam?to=place.ChIJScMGBvaT2TERTuNEtDjrbXo"},
    {"id":"hidayatullah","nama":"Hidayatullah (A/B)","koridor":["K2","K4"],"urutan":{"K2":"akhir","K4":3},"kecamatan":"Sagulung","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482853/jadwal-dan-tarif-trans-batam-rute-batam-center-ke-tanjung-uncang-juli-2025"},
    {"id":"tanjung-piayu-laut","nama":"Tanjung Piayu Laut","koridor":["K6"],"urutan":{"K6":1},"kecamatan":"Sei Beduk","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/ini-jadwal-trans-batam-rute-tanjung-piayu-batam-center-mei-2026/"},
    {"id":"harbourbay","nama":"Harbourbay","koridor":["K5"],"urutan":{"K5":"perlu_cek_ulang"},"kecamatan":"Batu Ampar","alamat":"Jl. Duyung, Sungai Jodoh","lat":1.15389,"lng":103.99711,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik terminal feri (Wikidata)","sumber_url":"https://www.wikidata.org/wiki/Q65091241"},
    {"id":"kepri-mall","nama":"Kepri Mall (A/B)","koridor":["K2","K6"],"urutan":{"K2":13,"K6":24},"kecamatan":"Batam Kota","alamat":"Jl. Jend. Sudirman","lat":1.10111,"lng":104.03639,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik mal","sumber_url":"https://wikimapia.org/14749451/Kepri-Mall"},
    {"id":"panbil","nama":"Panbil Mukakuning / Kawasan Industri Panbil","koridor":["K2","K6"],"urutan":{"K2":16,"K6":21},"kecamatan":"Sei Beduk","alamat":"Jl. Ahmad Yani, Muka Kuning","lat":1.072,"lng":104.024,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik Panbil Mall","sumber_url":"https://id.wikipedia.org/wiki/Panbil_Mall"},
    {"id":"politeknik","nama":"Politeknik (A/B)","koridor":["K2","K6"],"urutan":{"K2":8,"K6":25},"kecamatan":"Batam Kota","alamat":"Jl. Ahmad Yani, Batam Centre","lat":1.11869,"lng":104.048442,"status_koordinat":"perlu_cek_ulang","catatan_koordinat":"titik kampus Polibatam","sumber_url":"https://www.wikidata.org/wiki/Q12506025"},
    {"id":"mega-mall","nama":"Mega Mall","koridor":["K1","K5"],"urutan":{"K1":30},"kecamatan":"Batam Kota","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025"},
    {"id":"bundaran-madani","nama":"Bundaran Madani","koridor":["K1","K5"],"urutan":{"K1":24},"kecamatan":"Batam Kota","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://kepri.pikiran-rakyat.com/kepri/pr-2689482812/jadwal-dan-tarif-trans-batam-rute-sekupang-ke-batam-center-juli-2025"},
    {"id":"uib","nama":"UIB (A/B)","koridor":["K1","K3"],"urutan":{"K1":16,"K3":16},"kecamatan":null,"alamat":"Jl. Gajah Mada (perlu_cek_ulang)","lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://wartajayavision.com/jadwal-trans-batam-rute-sekupang-jodoh-2025-pembayaran-dana/"},
    {"id":"kabil-raya","nama":"Kabil Raya","koridor":["K8","K9"],"urutan":{"K8":6,"K9":6},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://1news.id/54-titik-pemberhentian-rute-trans-batam-punggur-ke-nongsa-oktober-2025/"},
    {"id":"kampung-mangga","nama":"Kampung Mangga","koridor":["K7","K9"],"urutan":{"K7":7,"K9":9},"kecamatan":"Nongsa","alamat":null,"lat":null,"lng":null,"status_koordinat":"perlu_diisi_user","sumber_url":"https://inspirasitoday.com/jadwal-trans-batam-rute-nongsa-batam-center-mei-2026/"}
  ],
  "urutan_ringkas": {
    "K1_pergi": ["tp-sekupang","taman-palapa","telkom-sekupang","shangrila-a","lampu-merah-patam-lestari","kartini","stc","gor-sekupang-a","mutiara-view","tiban-iii","tiban-raya","taman-sari-a","tiban-center","tiban-ayu-a","tiban-kampung-a","uib","baloi-view","rs-awal-bros","orchid-a","gelael-a","raflesia-a","kawasaki-a","royal-grande","bundaran-madani","kadin","ikan-daun","inko","engku-putri","imigrasi","mega-mall","tp-batam-center"],
    "K6_pergi": ["tanjung-piayu-laut","kampung-jawa","laguna","oleana","bukit-barelang","rhabayu-asri-a","smpn-40","simpang-pancur","pasar-pancur","simpang-bagan","simpang-atb","bidaayu-pintu-3","bidaayu-pintu","smpn-16","bidadari","nusa-indah","bukit-sentosa","pintu-4-mukakuning","pintu-3-mukakuning","pintu-2-mukakuning","panbil","best-western-panbil","stadion-temenggung","kepri-mall","politeknik","masjid-agung","tp-batam-center"],
    "K7_pergi": ["teluk-mata-ikan","pelabuhan-nongsa","turi-beach","polda-kepri","bandoeng-resto","citra-mas","kampung-mangga","kampung-tengah","simpang-ojek","darul-falah","pura-asri","family-garden","pasar-mtc","simpang-bandara","bandara-hang-nadim","dotamana","bida-asri-2","kapita-plaza","botania-2","uniba","mustafa-plaza","kantor-camat-batam-kota","kda","puri-legenda","grand-mas","purimas","gedung-lam","tp-batam-center"],
    "K9_pergi": ["tp-punggur","pltu-tanjung-kasam","tpa","polsek-nongsa","pasar-top-one","kabil-raya","al-munawaroh","bri-batu-besar","kampung-mangga","citra-mas","bandoeng-resto","polda-kepri","kampung-sambau"],
    "catatan": "Urutan K2, K3, K4, K5, K8 ada di tabel laporan; daftar sumber tidak lengkap (ada gap '…'), tandai pola sebagai lengkap=false."
  }
}
```
