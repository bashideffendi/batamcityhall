# Sumber Berita Batam

Daftar feed untuk `/info/berita` dan widget beranda (CLAUDE_CODE_PROMPT bagian 4.8). Daftar yang dipakai situs ada di `features/berita/sumber.ts`.

Semua pengecekan: **5 Nov 2026**, dengan User-Agent `BatamCityHall/0.1 (pembaca RSS, proyek warga non-komersial)`, tanpa menyamar sebagai browser. `robots.txt` dibaca dulu untuk `User-agent: *`. Situs yang menolak dicatat ditolak dan tidak dicoba dengan cara lain. Tidak ada scraping halaman, tidak ada proxy, tidak ada TLS yang dilonggarkan.

## Dipakai (6 feed, terbukti valid)

Keenamnya juga terbaca lewat route `/api/berita` di server dev pada 5 Nov 2026, status `ok`, masing-masing 10 judul setelah dibatasi, semua waktu terbaca.

| Sumber | URL feed | Terakhir dicek | Status | Catatan |
| --- | --- | --- | --- | --- |
| Batam Pos | https://batampos.co.id/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | Tautan artikel di subdomain `news.` dan `metropolis.batampos.co.id`. `robots.txt` tidak melarang. |
| Antara Kepri | https://kepri.antaranews.com/rss/terkini.xml | 5 Nov 2026 | Valid, RSS, 20 item | `robots.txt` tidak ada (404). Cakupan se-Kepri, bukan hanya Batam. |
| GoWest | https://gowest.id/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | `robots.txt` tidak melarang. |
| GoKepri | https://gokepri.com/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | `www.` dialihkan ke sini. `robots.txt` tidak melarang. |
| Ulasan.co | https://ulasan.co/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | `robots.txt` tidak melarang. Tambahan di luar daftar prompt. |
| Media Center Pemko Batam | https://mediacenter.batam.go.id/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | Sumber resmi. Diiklankan situsnya lewat `<link rel="alternate">`. `robots.txt` tidak melarang. |

## Valid, sengaja belum dipakai

| Sumber | URL feed | Terakhir dicek | Status | Catatan |
| --- | --- | --- | --- | --- |
| Pemerintah Kota Batam | https://batam.go.id/feed/ | 5 Nov 2026 | Valid, RSS, 10 item | Tiga item teratas punya `pubDate` persis sama, jadi waktunya tidak bisa dipercaya untuk urutan. Ada judul berhuruf Unicode tebal yang buruk untuk pembaca layar. Isinya tampak beririsan dengan Media Center. |
| Presmedia | https://presmedia.id/feed/ | 5 Nov 2026 | Valid, RSS, 30 item | Tiga judul teratas yang dicek tidak ada yang khusus soal Batam. Bisa ditambah satu baris di `sumber.ts` kalau pemilik mau. |

## Ditolak atau gagal

| Sumber | URL yang dicoba | Terakhir dicek | Status | Catatan |
| --- | --- | --- | --- | --- |
| Tribun Batam | https://batam.tribunnews.com/rss, `/feed` | 5 Nov 2026 | **Ditolak, HTTP 403** | Halaman "Akses ditolak". `robots.txt` tidak melarang jalur itu, tapi jawaban servernya jelas. Tidak dicoba lagi. |
| Batamnews | https://www.batamnews.co.id/rss, `/feed`, https://batamnews.co.id/feed | 5 Nov 2026 | **Ditolak, HTTP 403** | Tidak dicoba lagi. |
| BatamToday | https://batamtoday.com/rss, `/feed`, https://www.batamtoday.com/rss.xml | 5 Nov 2026 | **Gagal** | `/rss` dan `/feed` HTTP 500 dengan pesan JSON bahwa hanya melayani permintaan HTML. `www.../rss.xml` HTTP 403. Beranda tidak mengiklankan feed. Besar kemungkinan tidak punya feed publik, tapi itu belum dipastikan. |
| BP Batam | https://bpbatam.go.id/feed/, https://www.bpbatam.go.id/feed/ | 5 Nov 2026 | **Gagal di Node** | Node menolak TLS server: `ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED`. `curl` di Windows mendapat HTTP 200 `application/rss+xml`, jadi feed-nya ada. Melonggarkan TLS demi ini tidak layak. Bisa ikut kalau server mereka diperbarui. `robots.txt` belum terbaca lewat Node. |
| Kepri Post | https://kepripost.com/feed/ | 5 Nov 2026 | **Gagal** | Sertifikat tidak cocok dengan nama domain (`ERR_TLS_CERT_ALTNAME_INVALID`). |
| Batam Pos (alamat Jawa Pos) | https://batampos.jawapos.com/feed, `/rss` | 5 Nov 2026 | Bukan feed | `/feed` dialihkan ke halaman pencarian HTML, `/rss` 404, beranda tidak mengiklankan feed. Pakai batampos.co.id. |
| Portal Pemprov Kepri | https://kepriprov.go.id/feed/ | 5 Nov 2026 | Tidak ada | HTTP 404. |
| Haluan Kepri | https://haluankepri.com/feed/ | 5 Nov 2026 | Tidak ada | HTTP 404. |
| Batam Times | https://batamtimes.co.id/feed/ | 5 Nov 2026 | Tidak terjangkau | Domain tidak ditemukan (ENOTFOUND). URL ini tebakan, bisa jadi alamatnya lain. |
| Suara Batam | https://suarabatam.id/feed | 5 Nov 2026 | Tidak terjangkau | Galat DNS sementara (EAI_AGAIN). Belum dicek ulang. |
| Metro Batam | https://metrobatam.com/feed/ | 5 Nov 2026 | Tidak terjangkau | Waktu habis. Belum dicek ulang. |
| Batam Xinwen | https://batamxinwen.com/feed/ | 5 Nov 2026 | Gagal | TLS handshake gagal. |

## Catatan

- **Isi feed bukan hanya soal Batam.** Feed media lokal juga memuat berita nasional. Judul tidak disaring dengan kata kunci, karena saringan begitu mudah salah dan berarti kami memilih berita. Halaman menjelaskan hal ini.
- **Status "terakhir berhasil" adalah ingatan server**, di memori tiap instance. Setelah server dinyalakan ulang, sumber yang gagal tertulis "belum ada pengambilan yang berhasil tercatat". Ini jujur, tapi bukan riwayat permanen.
- **Waktu:** tanggal tanpa zona waktu atau yang tak terbaca ditampilkan "Waktu tidak terbaca" dan ditaruh paling bawah. Waktu lebih dari satu jam di masa depan diperlakukan sama.
- **Batas:** 10 judul per sumber, 60 total, feed maksimal 3 MB, tunggu 8 detik per feed, cache 20 menit.
- **Hak cipta:** yang ditampilkan hanya judul, sumber, waktu, dan tautan. Parser tidak mengeluarkan deskripsi atau isi artikel.
