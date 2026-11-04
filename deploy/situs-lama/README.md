# Pengalihan situs lama

**Belum dijalankan. Tidak ada satu pun berkas di sini yang sudah menyentuh situs lama.** Eksekusinya menunggu izin eksplisit pemilik proyek, setelah situs baru tayang dan `docs/PARITAS.md` semua ✔.

Keadaan terakhir yang diketahui: hujandibatam.masbash.id dan batam-bites.vercel.app membalas HTTP 402 (dicek 4 Nov 2026). Kalau masih begitu, pengalihan tidak akan jalan sebelum akun Vercel-nya beres.

## Isi

| Berkas | Tujuan |
|---|---|
| `hujandibatam/vercel.json` | Redirect 301 semua halaman ke `/langit-laut`. Vercel membawa `?mode=&view=&cam=` secara otomatis |
| `hujandibatam/public/sw.js` | Pengganti service worker: hapus cache, arahkan tab ke situs baru, lepas diri |
| `batam-bites/vercel.json` | Redirect 301 per path ke `/makan/...` |
| `batam-bites/public/sw.js` | Sama, dengan peta path Makan |
| `batam-bites/public/saved.html` | Halaman pindah favorit. Favorit ada di localStorage domain lama, jadi hanya bisa dibaca dari domain itu |

## Langkah, kalau sudah diizinkan

1. Ganti `DOMAIN-BARU` di semua berkas dengan domain situs baru.
2. Di masing-masing repo situs lama: pindahkan isi folder ini ke akar repo, hapus kode aplikasi, deploy. Situs tetap hidup, hanya berisi pengalihan.
3. Biarkan minimal 6 bulan, supaya pengguna PWA lama sempat membuka dan terlepas dari service worker lama. `sw.js` harus tetap tersedia di alamat yang sama.
4. Cek: `curl -I https://hujandibatam.masbash.id/?mode=ombak` harus 301 ke `/langit-laut?mode=ombak`.

## Catatan

- `/saved` di batam-bites sengaja bukan redirect. Halaman `saved.html` membaca `bb_favorites`, lalu pindah ke `/makan/tersimpan?simpan=a,b,c`. Di sana pengguna memilih menambahkannya.
- `/api/*` lama tidak dialihkan: tab lama yang masih terbuka dialihkan service worker, dan CORS situs baru tidak membuka API untuk domain lain.
- Peta path sama dengan `lib/redirect-lama.ts`, dan dites di `tests/unit/redirect-lama.test.ts`.
