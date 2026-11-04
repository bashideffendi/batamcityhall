# Log pemindahan: 16-tokoh-nama-jalan

- task_id: `wf-d6f02bac-a0a3-8339-8faa-3d61117e584a`
- Judul: Siapa di Balik Nama Jalan: Tokoh-Tokoh yang Namanya Dipakai di Kota Batam
- Tool mengembalikan `truncated: true`. Teks laporan tampak utuh: berakhir dengan blok JSON yang tertutup lengkap. Yang kemungkinan terpotong adalah daftar `sources`, karena isinya tepat 100 item. Semua 100 item masuk `## Daftar sumber`. Ada 24 URL yang dikutip di teks tetapi tidak ada di daftar `sources`; URL itu tetap ada di teks verbatim dan di file domain.

## File yang dibuat
| File | Isi |
|---|---|
| `research/16-tokoh-nama-jalan.md` | Teks laporan verbatim + Daftar sumber (100) |
| `data/raw/16-tokoh-nama-jalan__1.json` | Satu-satunya blok ```json, verbatim: `tokoh` 29, `penamaan` 40, `relasi` 23 |
| `data/places/16-tokoh-nama-jalan.json` | 18 tempat yang dinamai tokoh (tanpa jalan) |
| `data/tokoh/tokoh.json` | 46 tokoh: 29 dari JSON (+ `kelompok_tabel`) + 17 tokoh nasional yang hanya ada di tabel inventaris/bagian (c) |
| `data/tokoh/penamaan.json` | 61 entri: 40 dari JSON (dilengkapi kolom tabel) + 21 yang hanya ada di tabel (`pt01`–`pt21`) |
| `data/tokoh/relasi.json` | 23 relasi, sama persis dengan JSON (laporan tidak punya tabel relasi) |
| `data/tokoh/profil_tokoh.md` | Bagian "Profil tokoh (format kartu)" verbatim, (a)–(e) |

## Jumlah
- Blok JSON: 1, valid tanpa perbaikan.
- Tabel inventaris: 50 baris, semuanya terpetakan ke `penamaan`.
- Tempat: 18. Ada 6 jembatan Barelang, 3 masjid, 2 makam, bandara, stadion, museum, RSUD, Dataran Engku Putri, bumi perkemahan, dan Gedung Nong Isa.
  - Semua `lat`/`lng` null dengan `status_koordinat: perlu_diisi_user`.
  - `status_data`: 10 `perlu_cek_ulang` (lokasi/kecamatan "perlu dicek" atau nama beda versi), 8 `null` (laporan tidak memberi label status untuk tempatnya). Status tokoh disimpan di `atribut.status_tokoh`.
  - Setiap tempat punya `atribut.tokoh_id` dan `atribut.penamaan_id`.

## Masalah dan keputusan
1. **penamaan: pelengkap dari tabel.** Setiap entri JSON mendapat `nama_tabel`, `jenis_tabel`, `kecamatan_tabel` (verbatim, termasuk ruas simpang), `tokoh_tabel`, `kelompok_tabel`, `sumber_tabel`, `sumber_entri`, dan `catatan`. Field JSON tidak diubah; `sumber_url` tetap string seperti di JSON. Baris tabel gabungan "Jl. Raja Isa; Gedung Nong Isa" dan "Jl. Engku Putri; Dataran Engku Putri" dipetakan ke dua entri JSON masing-masing.
2. **penamaan: 21 entri yang hanya ada di tabel (`pt01`–`pt21`, id dibuat agen):**
   - Masjid Temenggung Abdul Jamal, dipisah dari baris gabungan "Makam & Masjid";
   - Masjid Agung/Masjid Raya di Dataran Engku Putri (kaitan nama perlu dicek, sumber "perlu dicek", jadi `sumber_url: null`);
   - Jl. Laksamana (Bulang);
   - julukan "Jembatan Habibie";
   - 8 jalan pahlawan (Katamso, R. Suprapto, S. Parman, Ahmad Yani, Sudirman, Gajah Mada, Imam Bonjol, Teuku Umar). Untuk jalan-jalan ini `kecamatan` = isi tabel tanpa keterangan ruas dalam kurung, dan teks lengkapnya ada di `kecamatan_tabel`;
   - 9 jalan dari satu baris gabungan (Raden Patah … Pattimura). `kecamatan` null karena tabel hanya memberi gabungan "Lubuk Baja, Batu Ampar, Sekupang, Nongsa". Bagian (c) menyebut "Lubuk Baja, Sekupang, dan Nongsa" tanpa Batu Ampar; ini inkonsistensi kecil di laporan.
3. **tokoh: 17 entri yang hanya ada di tabel/bagian (c)** (id snake_case dibuat agen: `katamso`, `r_suprapto`, `s_parman`, `ahmad_yani`, `sudirman`, `gajah_mada`, `imam_bonjol`, `teuku_umar`, `raden_patah`, `yos_sudarso`, `diponegoro`, `kartini`, `cipto_mangunkusumo`, `ahmad_dahlan`, `re_martadinata`, `hasanuddin`, `pattimura`).
   - `ringkasan` disalin verbatim dari bullet (c). Untuk sembilan tokoh nasional terakhir, ringkasannya kalimat kelompok yang sama.
   - `gelar`, `kaitan_batam`, dan `status_verifikasi` diisi null.
   - `sumber_url: []`, karena laporan tidak memberi sumber biografi. Sumber penamaan jalannya ada di penamaan.json.
   - Semua 29 tokoh JSON mendapat `kelompok_tabel` (kelompok dari baris tabel, misalnya Hang Nadim "a/b", padahal JSON-nya "b").
4. **Places: aturan kecamatan.**
   - Nilai yang diberi "(perlu dicek)" → `kecamatan: null`, dan nilai aslinya ditulis di `catatan`. Ini berlaku untuk Jembatan I–III, stadion, museum, Masjid Sultan Mahmud Riayat Syah, dan bumi perkemahan.
   - "Bulang–Galang" (Jembatan IV) → null, karena melintasi dua kecamatan.
   - Gedung Nong Isa → null: JSON null, sedangkan baris tabel gabungan menyebut Batam Kota.
   - Bandara Hang Nadim → Nongsa, Kel. Batu Besar. Makam Zuriat Nong Isa → Nongsa, Kel. Sambau.
5. **ID tempat disamakan dengan laporan lain** untuk tempat fisik yang sama, supaya penggabungan bisa dedupe:
   - `jembatan-barelang-1`…`-6`, `bandara-hang-nadim`, `dataran-engku-putri`, `masjid-sultan-mahmud-riayat-syah`: juga di 03;
   - `museum-batam-raja-ali-haji`: juga di 13;
   - `bandara-hang-nadim` dan `makam-temenggung-abdul-jamal`: juga di 15.

   `penamaan_id` (p01, dst.) tidak dipakai sebagai id tempat karena terlalu generik, tetapi disimpan di `atribut.penamaan_id`.
6. Julukan "Jembatan Habibie" tidak dibuat sebagai tempat tersendiri. Julukan ini disimpan di atribut keenam jembatan (`julukan_populer_kompleks`, `julukan_tokoh_id: bj_habibie`, `penamaan_julukan_id: pt04`).
7. Profil kartu tetap hanya di `profil_tokoh.md`; field kartu (Gelar/Masa hidup/Kisah/Tempat/Status) tidak dipecah ke JSON. Field `tokoh.json` dari JSON laporan sudah memuat ringkasannya.

## Hal yang tidak dipetakan / sengaja tidak dimasukkan
- **Jalan tidak masuk places** (sesuai instruksi); semuanya ada di `data/tokoh/penamaan.json`. "Kecamatan Nongsa" (p07) adalah wilayah administratif, jadi tidak dijadikan tempat.
- **Kantor Kecamatan Galang** (beralamat di Jl. Batin Limat) tidak dimasukkan karena tidak dinamai tokoh.
- **Makam di luar Batam** tidak dimasukkan: Makam Engku Putri dan Makam Embung Fatimah (Pulau Penyengat), Makam Narasinga II (Indragiri Hulu), Makam Sultan Mahmud (Daik, Lingga).
- **Bagian "Hubungan antartokoh" (bullet, bukan tabel)** memuat relasi yang tidak ada di blok JSON. Contohnya Daeng Celak → Raja Haji, Raja Jaafar (YDM VI), Raja Ali (YDM V) → Nong Isa, Raja Muhammad Yusuf, Sultan Abdul Rahman Muazzam Syah II, garis Temenggung (Tun Abbas → Abdul Jamal → Tun Abdul Hamid → Temenggung Abdul Rahman → Daeng Ibrahim → Abu Bakar), Hang Mahmud, Dang Wangi, dan Sultan Sulaiman. Tokoh-tokoh ini tidak punya entri `tokoh`, jadi relasinya tidak ditambahkan ke `relasi.json`. Teksnya tetap ada di research md. Laporan juga meminta catatan UI: "Raja Ali" (YDM V) berbeda orang dari Raja Ali Haji dan Raja Ali Kelana.
- **Kolom `osm_name_bila_ada` masih null semua.** Laporan meminta Claude Code mengisinya lewat Overpass; contoh kuerinya ada di research md, bagian "Blok data JSON".
- **Hanya ada di research md:** "Penamaan resmi (konteks singkat)" (SK Wali Kota 2011: 230 ruas; evaluasi 2017; usulan LAM 2026: 46 simpang/bundaran), "Bacaan lanjutan", dan Caveats.
