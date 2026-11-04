# Spesifikasi kerja agen: memindahkan laporan riset ke paket handoff "Batam City Hall"

Root paket: `/home/claude/batam-city-hall-handoff/`

Kamu memindahkan satu atau beberapa laporan riset (diambil dengan tool `mcp__claude_ai__read_research_report` memakai `task_id`) ke file di disk, supaya Claude Code bisa membangun website "Batam City Hall" tanpa kehilangan satu pun hasil riset. Kalau tool `mcp__claude_ai__read_research_report` tidak tersedia, langsung berhenti dan laporkan itu.

## Prinsip
- JANGAN meringkas, memotong, atau menulis ulang isi laporan. Salinan markdown harus verbatim.
- JANGAN mengarang data. Jangan menebak koordinat. Jangan mengisi kolom yang tidak ada di laporan.
- Semua JSON hasilmu harus valid (cek dengan `python3 -I -c "import json,sys;json.load(open(sys.argv[1]))" <file>`).
- Kalau laporan sangat panjang, tulis bertahap: `Write` untuk bagian pertama, lalu tambahkan sisanya dengan Bash `cat >> file <<'EOF_BCH' ... EOF_BCH` (heredoc dengan delimiter berkutip supaya `$` dan backtick tidak diproses).

## Output wajib per laporan (ganti `NN-slug` dengan slug yang diberikan)
1. `research/NN-slug.md`
   - Baris pertama: `# <judul laporan>`
   - Baris kedua: `> task_id: <task_id>`
   - Lalu seluruh `text` laporan verbatim (tabel, kode, JSON, semuanya).
   - Di akhir: `## Daftar sumber` berisi semua item `sources` sebagai `- <title> — <url>`.
2. `data/raw/NN-slug__<k>.json` untuk SETIAP blok kode ```json di laporan (k = 1, 2, 3, ...), isi verbatim. Kalau blok tidak valid JSON, perbaiki seminimal mungkin (misalnya koma) dan catat di log.
3. `data/places/NN-slug.json`: array entri TEMPAT yang dinormalisasi (lihat skema di bawah) dari semua objek di laporan yang mewakili lokasi fisik (kantor, RS, sekolah, masjid, pelabuhan, taman, lapangan, landmark, kampung tua, dll.). Kalau laporan tidak berisi tempat, tulis `[]`.
4. File domain sesuai mapping yang diberikan di tugasmu (kalau ada).
5. `data/logs/NN-slug.md`: jumlah blok JSON, jumlah tempat, file domain yang dibuat, masalah/perbaikan, dan hal di laporan yang tidak bisa dipetakan.

Selain blok JSON, kalau laporan punya TABEL berisi data terstruktur yang tidak ada versi JSON-nya (misalnya tabel kecamatan-kelurahan, tabel taksonomi, tabel kalender), konversikan tabel itu ke JSON di file domain yang sesuai. Nilai tetap persis seperti di tabel.

## Skema tempat (dipakai di `data/places/*.json`)
```json
{
  "id": "slug-unik (pakai id asli dari laporan kalau ada)",
  "nama": "string",
  "nama_alternatif": ["string"],
  "kategori": "salah satu enum kategori",
  "subkategori": "string bebas, snake_case",
  "kecamatan": "salah satu enum kecamatan atau null",
  "kelurahan": "string atau null",
  "alamat": "string atau null",
  "lat": null,
  "lng": null,
  "status_koordinat": "terverifikasi | perlu_cek_ulang | perlu_diisi_user",
  "catatan_koordinat": "string atau null (sumber/akurasi koordinat dari laporan)",
  "jam_layanan": "string atau null",
  "kontak": {"telepon": null, "whatsapp": null, "email": null, "website": null},
  "atribut": {},
  "status_data": "terverifikasi | perlu_cek_ulang | sumber_tunggal | cerita_rakyat | usang | rencana | null",
  "catatan": "string atau null (catatan penting: data usang, pindah alamat, konflik antarsumber, topik sensitif)",
  "tag_osm": "string atau null",
  "sumber_url": ["url"],
  "sumber_riset": "NN-slug"
}
```

Aturan normalisasi:
- `kategori` enum: `pemerintahan`, `layanan_publik`, `keamanan_darurat`, `kesehatan`, `pendidikan`, `perpustakaan`, `ibadah`, `pemakaman`, `transportasi`, `belanja`, `ruang_publik`, `wisata`, `olahraga`, `akomodasi`, `jasa`, `pertanahan_hukum`, `landmark`, `kampung_tua`, `budaya`, `khas_batam`, `lainnya`. Pilih yang paling cocok; simpan kategori asli laporan di `atribut.kategori_asli` kalau berbeda.
- `kecamatan` enum persis: `Batam Kota`, `Batu Aji`, `Batu Ampar`, `Belakang Padang`, `Bengkong`, `Bulang`, `Galang`, `Lubuk Baja`, `Nongsa`, `Sagulung`, `Sei Beduk`, `Sekupang`. ("Sungai Beduk" → `Sei Beduk`.) Kalau laporan ragu/tidak menyebut, `null` dan tulis keraguannya di `catatan`.
- Koordinat: salin persis. Kalau `lat`/`lng` null → `status_koordinat` WAJIB `perlu_diisi_user`. Kalau ada angka tetapi laporan menyebut estimasi/kasar/sedang/rendah/pihak ketiga/perlu cek → `perlu_cek_ulang`. Hanya `terverifikasi` kalau laporan menyatakan terverifikasi.
- `sumber_url` selalu array (ubah string tunggal jadi array; buang null).
- Kontak: hanya kontak kantor/usaha yang dicantumkan laporan. Pindahkan field lain (jam, harga, booking, tipe RS, rawat inap, BPJS, dll.) ke `atribut`.
- Label status dari laporan (✅/⚠️/terverifikasi/perlu cek/sumber tunggal/cerita rakyat/usang/rencana) → `status_data`.
- Entri yang sama dalam satu laporan (misalnya muncul di tabel dan di JSON) cukup satu; utamakan versi JSON lalu lengkapi dari tabel.

## Laporan balik ke pemanggil
Kirim ringkasan singkat: file yang dibuat, jumlah tempat per file, jumlah blok JSON, dan masalah yang perlu diketahui. Jangan menyalin isi laporan ke pesan balik.
