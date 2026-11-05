# Foto tempat makan

Taruh foto di folder bernama id tempat, lalu build. Galeri terisi sendiri.

```
public/foto/makan/golden-prawn-933/01.webp
public/foto/makan/golden-prawn-933/02.webp
```

- Id tempat adalah bagian akhir alamat halamannya: `/makan/tempat/golden-prawn-933`.
- Urutan mengikuti nama berkas. `01` tampil paling besar.
- Format: WebP, JPEG, PNG, atau AVIF. Lebar sekitar 2000 px sudah cukup.
- Lima foto pertama tampil di mosaik. Sisanya dibuka lewat tombol "Semua foto".

Keterangan dan kredit boleh ditulis di `info.json` di folder yang sama:

```json
{ "01.webp": { "alt": "Kepiting saus padang di meja", "kredit": "Nama pemotret" } }
```

Pakai hanya foto yang boleh ditampilkan.
