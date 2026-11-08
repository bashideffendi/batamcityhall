# Dokumen "Batam Almanac": status per butir

Sumber: dokumen pemilik "Batam Almanac: Spesifikasi, Peta Jalan, dan Prompt Claude Code" (Desktop pemilik, 8 November 2026). Pemilik meminta: kerjakan yang bisa dikerjakan, lewati yang teknis bagi pemilik (akun, hukum, pendaftaran, verifikasi lapangan).

Keputusan pemilik 8 November 2026:
- **Nama tidak diganti dulu.** Tetap Batam City Hall.
- **Pemerintah tidak disebut.** Sejalan dengan PEDOMAN 2.9 (tanpa tautan ke situs pemerintah, tanpa daftar tautan sumber, kredit hanya di Kolofon).

Bila dokumen Almanac bertentangan dengan PEDOMAN atau `research/00-keputusan-percakapan.md`, yang dipakai PEDOMAN dan keputusan pemilik.

## Sudah dikerjakan (8 Nov 2026)

| Butir Almanac | Wujud di situs |
|---|---|
| Kebijakan Editorial, Koreksi, Kebijakan AI | `/standar-redaksi`: independensi, cara data dihimpun, jenis isi, koreksi (`#koreksi`), penggunaan AI (`#ai`) |
| Log koreksi publik bertanggal | `/log-koreksi`, data `data/redaksi/log-koreksi.json` (divalidasi `logKoreksiSchema`) |
| Pernyataan Aksesibilitas | `/aksesibilitas` |
| Structured data kepercayaan | `lib/data-terstruktur.ts`: Organization dengan `publishingPrinciples`, `ethicsPolicy`, `correctionsPolicy`, `actionableFeedbackPolicy`, `ownershipFundingInfo`; WebSite; Article (Jurnal, Infografik); FoodEstablishment (tempat makan, tanpa telepon, rating, dan titik perkiraan) |
| RSS | `/rss.xml` (Jurnal dan Infografik), diumumkan di `<head>` |
| Tes data pajak di keluaran publik | `scripts/cek-keluaran.mjs` (`npm run check:rules`, juga `postbuild`): HTML, RSC, sitemap, RSS, bundel JS, dan JSON-LD |
| Tautan semua kebijakan di kaki situs | Kaki situs: Privasi, Syarat, Standar Redaksi, Log Koreksi, Aksesibilitas |

Sudah ada sebelumnya: Tentang, Kolofon (kredit data teks biasa), Kirim Koreksi dan tautan koreksi per tempat (aktif setelah Supabase), Privasi, Syarat, header keamanan, tanpa pelacak, uji axe, `prefers-reduced-motion` dan tombol Animasi, validasi data pajak dan koordinat (`validate-data`), permalink dengan pengalihan 301 di `next.config.ts`.

## Menunggu pemilik

- **Masthead:** nama penanggung jawab dan kota. Jangan dikarang.
- **Kontak redaksi:** alamat email untuk koreksi dan hak jawab. Email pribadi pemilik tidak boleh dipakai tanpa izin.
- **Asal gambar:** grafis Riso dibuat skrip `tools/grafis`. Asal gambar kartu pos dan 32 ilustrasi hidangan belum tercatat. Bila ada yang dibuat AI generatif, beri keterangan sesuai `/standar-redaksi#ai`.
- **Isi Standar Redaksi:** semua pernyataan di halaman itu atas nama pemilik dan harus disetujui sebelum tayang.
- Verifikasi lapangan, fotografi orisinal, panduan kawasan, itinerary, dan teks Mandarin: pekerjaan pemilik.

## Dilewati, dengan alasan

| Butir | Alasan |
|---|---|
| Ganti nama ke Batam Almanac | Keputusan pemilik 8 Nov: jangan dulu |
| Lencana "Belum diverifikasi" di tiap tempat | PEDOMAN 2.9 melarang catatan kerja tampil di kartu. Makanan sudah menulis bulan data diperiksa |
| Halaman penulis dan byline orang | Belum ada penulis selain Redaksi; bio harus dari pemilik |
| Label jenis konten per artikel | Jurnal dan Infografik sudah dibedakan per bagian dan rubrik; label Bersponsor dan Kemitraan baru perlu bila ada konten berbayar |
| Komponen AffiliateLink, Pengungkapan Afiliasi | Belum ada program afiliasi. Standar Redaksi sudah berjanji memberi label dan memperbarui kebijakan lebih dulu |
| Forum Discourse, PSE, Pedoman Komunitas, 18+ | Butuh keputusan hukum dan pendaftaran PSE oleh pemilik |
| CSP dengan nonce | Memaksa semua halaman dirender per permintaan, kehilangan halaman statis. CSP saat ini sudah memuat `frame-ancestors`, `object-src`, `base-uri`, `form-action` |
| Pemantauan uptime dan galat, analitik tanpa kuki | Butuh akun layanan milik pemilik |
| Keystatic | Situs sudah punya dashboard admin dengan basis data; dua CMS akan membingungkan |
| hreflang dan versi Inggris | Terjemahan Inggris belum dikerjakan |
| Double opt-in newsletter | Butuh penyedia email |
| Badan hukum, PSE, kebijakan iklan, prosedur insiden data | Pekerjaan pemilik dan ahli hukum |
