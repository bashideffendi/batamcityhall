<!-- Salinan verbatim dari research/14-feri-pompong.md (task_id wf-45ea1918-1dd9-865f-844b-d2b422910e8a): bagian '5. Info praktis menyeberang' dan '6. Data geometri rute untuk peta'. Ditambah dua kutipan verbatim pendukung dari bagian 1 (Biaya tambahan) dan bagian 4 (Tips keselamatan). -->

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

<!-- kutipan verbatim tambahan (bukan bagian yang diminta), dimulai dari baris: **Biaya tambahan (penting untuk teks panduan):** -->
**Biaya tambahan (penting untuk teks panduan):**
- **Sindo** memasang tarif dasar mulai SGD 28. Saat berangkat dari Singapura ada tambahan Singapore Passenger Departure Fee SGD 10, yang menurut pengumuman Sindo naik dari SGD 7 mulai 1 November 2022. Saat berangkat dari Batam ada Batam Terminal Fee Rp100.000, yang menurut Sindo dinaikkan BP Batam dari Rp65.000 mulai 1 September 2023.
- **BatamFast** memasang SGD 43 sekali jalan / SGD 76 PP yang sudah termasuk fee.
- **Fuel surcharge** dikenakan karena kenaikan harga BBM: SGD 6 (Singapura → Batam) dan Rp65.000 (Batam → Singapura). Menurut pengumuman resmi Sindo Ferry, "Temporary Fuel Surcharge, effective from March 12, 2026". Mothership (12 Maret 2026) juga menyebut 12 Maret untuk BatamFast, Horizon, dan Majestic. Satu-satunya yang berbeda adalah judul berita di situs BatamFast, "Fuel Surcharge Implementation Effective 14th March 2026". Penumpang Horizon yang beli tiket lewat pihak ketiga dilaporkan harus membayar surcharge di konter.
- **Cara beli resmi:** situs atau aplikasi operator (batamfast.com, majesticfastferry.com.sg, sindoferry.com.sg, horizonfastferry.com.sg) atau konter di terminal. Klook/KKday/Traveloka hanya agregator. Untuk Jumat sore, Sabtu pagi, dan libur nasional Singapura, sebaiknya pesan 2–3 hari sebelumnya.

<!-- kutipan verbatim tambahan (bukan bagian yang diminta), dimulai dari baris: **Tips keselamatan untuk panduan warga:** -->
**Tips keselamatan untuk panduan warga:**
- Minta dan pakai pelampung (life jacket) sebelum pompong jalan, terutama untuk anak-anak.
- Jangan naik kalau pompong sudah kelebihan muatan. Satu pompong PPMS standarnya 12 penumpang + 1 pengemudi.
- Simpan HP dan dokumen di kantong kedap air. Siapkan uang tunai pecahan kecil.
- Hindari menyeberang saat hujan badai atau angin kencang, dan cek situs hujandibatam sebelum berangkat. Rute malam hanya lewat pesanan.
- Untuk pulau yang jauh (Kasu, Terong, Abang), sepakati jam jemput balik dengan tekong dan simpan nomornya.
