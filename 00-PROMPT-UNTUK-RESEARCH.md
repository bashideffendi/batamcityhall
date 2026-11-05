# Salin teks di bawah garis ke Claude Research, lalu lampirkan file-file di folder ini

---

Halo. Beberapa hari lalu kamu menyusun riset dan brief untuk proyek **Batam City Hall**: 17 laporan riset (00–16) dan prompt utama `CLAUDE_CODE_PROMPT.md`. Berdasarkan itu, Claude Code sudah membangun situsnya sampai fase 10. Saya ingin kamu **mengaudit secara independen apakah hasilnya sesuai brief**. Jangan percaya begitu saja laporan dari Claude Code; periksa sendiri lewat screenshot dan repo.

**Repo publik:** https://github.com/bashideffendi/batamcityhall (cabang `fase-1-fondasi`). Kode, data, dan dokumen ada di sana kalau kamu bisa membacanya.

**Terlampir:**
1. `01-LAPORAN-KESESUAIAN.md`: klaim Claude Code tentang apa yang sudah dan belum dikerjakan, beserta penyimpangannya.
2. `02-galeri-desktop.pdf` (66 halaman) dan `03-galeri-hp.pdf` (63 halaman): screenshot semua halaman dari build produksi dengan data langsung, 5 Nov 2026. Tiap halaman PDF punya pita judul berisi nomor, route, dan ukuran layar.
3. `dokumen/`: `CLAUDE_CODE_PROMPT.md` dan `00-keputusan-percakapan.md` (acuan), plus `COVERAGE.md`, `PARITAS.md`, `DATA_DECISIONS.md`, `TODO_PEMILIK.md`, `PLAN.md`, `CHANGELOG.md`, `MURAL.md`.

**Yang saya minta:**
1. **Kesesuaian per bagian 4 prompt** (4.0 sampai 4.10) dan **definisi selesai bagian 11**. Untuk tiap bagian: sesuai, sebagian, atau tidak? Sebutkan nomor screenshot sebagai bukti.
2. **Klaim yang meragukan.** Cari klaim di laporan atau `COVERAGE.md` yang tidak tampak di screenshot, atau bertentangan dengan brief. Ambil sampel baris `[x]` dan `[-]` di `COVERAGE.md`, karena sebagian diklasifikasi subagen dan belum dicek ulang.
3. **Penilaian keputusan sepihak** di bagian 6 laporan. Terutama nomor 3: label Makan diganti, padahal prompt 4.0 butir 6 meminta dipertahankan. Juga nomor 2 (segmen mural) dan nomor 1 ("Aman nyebrang" tidak dibuat).
4. **Topik sensitif (bagian 6 prompt).** Baca screenshot 26 sampai 29 (Kampung Tua, legalitas, Rempang). Apakah netral, bertanggal, beratribusi, tanpa batas atau luas lahan, dan tanpa humor? Galang dan Nghia Trang tidak boleh bernada game.
5. **Nada dan gaya (laporan 05):** apakah tampilan sesuai panduan gaya "Peta Laut"? Apakah ada kata yang masuk daftar hindari?
6. **Privasi (bagian 7 prompt):** apakah ada nomor HP pribadi, data perekomendasi, atau rating bintang yang tampil?
7. **Prioritas perbaikan:** daftar pendek, urut dari yang paling penting sebelum situs tayang.

Jawab dalam Bahasa Indonesia. Pisahkan **temuan yang terbukti dari screenshot atau repo** dari **dugaan**.
