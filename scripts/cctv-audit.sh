#!/usr/bin/env bash
# Audit armada CCTV Pemko Batam dari laptop (BUKAN dari klien): 28 GET playlist ~250 B, plus HEAD potongan
# terakhir kamera yang hidup (tanpa isi video) untuk membaca ukurannya.
# Jalankan sebelum/sesudah rilis atau tiap ada keluhan "kamera nggak bisa dibuka".
#   ENDLIST=1                 → stream ditutup (kamera mati)
#   lastmod tua tanpa ENDLIST → beku (playlist nggak di-update, mis. delta2 sejak Jun 2026)
#   seg                       → jumlah potongan di playlist (Pemko biasanya 2; aturan HLS meminta minimal 3)
#   MB/mnt                    → perkiraan pemakaian data dari ukuran potongan terakhir
# Codec (H.264/H.265) tidak dibaca di sini; lihat catatan audit 8 Nov 2026 di docs/CHANGELOG.md.
cd "$(dirname "$0")/.." || exit 1
HOST="https://matanya.batam.go.id"
for s in $(grep -o 'slug: "[^"]*"' features/langit-laut/lib/cctv.ts | cut -d'"' -f2); do
  r=$(curl -s -m 10 -D - "$HOST/cctv/$s/stream.m3u8")
  code=$(echo "$r" | head -1 | awk '{print $2}')
  end=$(echo "$r" | grep -c ENDLIST)
  lm=$(echo "$r" | grep -i '^last-modified' | sed 's/last-modified: //I' | tr -d '\r')
  seg=$(echo "$r" | grep -c '\.ts')
  mb="-"
  akhir=$(echo "$r" | grep '\.ts' | tail -1 | tr -d '\r')
  dur=$(echo "$r" | grep '^#EXTINF' | tail -1 | sed 's/#EXTINF:\([0-9.]*\).*/\1/')
  if [ "$end" = "0" ] && [ -n "$akhir" ] && [ -n "$dur" ]; then
    len=$(curl -s -m 10 -I "$HOST/cctv/$s/$akhir" | grep -i '^content-length' | awk '{print $2}' | tr -d '\r')
    [ -n "$len" ] && mb=$(awk -v b="$len" -v d="$dur" 'BEGIN { printf "%.0f", b / 1e6 * 60 / d }')
  fi
  printf "%-16s http=%s ENDLIST=%s seg=%s MB/mnt=%s lastmod=%s\n" "$s" "$code" "$end" "$seg" "$mb" "$lm"
done
