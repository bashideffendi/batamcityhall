"""Siapkan peta isometrik Barelang untuk Cloudflare Pages (gratis, tanpa kartu; batas 20.000 berkas per situs).

Ubin DZI dari barelang-iso berukuran 512 px (±233 ribu berkas). Skrip ini menjahitnya menjadi ubin 2048 px
(±14.600 berkas) tanpa mengubah gambar, lalu menyalin data lapisan dan menulis berkas _headers untuk CORS.

Pakai Python dari barelang-iso (sudah ada Pillow):
  C:/Users/user/Projects/barelang-iso/.venv/Scripts/python.exe -I tools/peta/ubin_publik.py \
      C:/Users/user/Projects/barelang-iso/data/derived/fase5/ubin/barelang-v2-20261110 \
      C:/Users/user/Projects/barelang-peta-publik
Lalu unggah: npx wrangler pages deploy C:/Users/user/Projects/barelang-peta-publik --project-name barelang-peta
"""

import math
import re
import shutil
import sys
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

from PIL import Image

BARU, Q = 2048, 82


def baca_dzi(f: Path) -> tuple[int, int, int, int, str]:
    s = f.read_text(encoding="utf-8")
    ts = int(re.search(r'TileSize="(\d+)"', s).group(1))
    ov = int(re.search(r'Overlap="(\d+)"', s).group(1))
    fmt = re.search(r'Format="(\w+)"', s).group(1)
    w = int(re.search(r'Width="(\d+)"', s).group(1))
    h = int(re.search(r'Height="(\d+)"', s).group(1))
    return ts, ov, w, h, fmt


def kerja(a) -> int:
    asal, tujuan, lv, wl, hl, ts, ov, fmt, C, R = a
    x0, y0 = C * BARU - (ov if C else 0), R * BARU - (ov if R else 0)
    x1, y1 = min(wl, (C + 1) * BARU + ov), min(hl, (R + 1) * BARU + ov)
    kanvas = Image.new("RGB", (x1 - x0, y1 - y0))
    k = BARU // ts
    for c in range(C * k, min((C + 1) * k, math.ceil(wl / ts))):
        for r in range(R * k, min((R + 1) * k, math.ceil(hl / ts))):
            f = asal / str(lv) / f"{c}_{r}.{fmt}"
            if not f.exists():
                continue
            with Image.open(f) as im:
                kanvas.paste(im.convert("RGB"), (c * ts - (ov if c else 0) - x0, r * ts - (ov if r else 0) - y0))
    kanvas.save(tujuan / str(lv) / f"{C}_{R}.webp", "WEBP", quality=Q, method=4)
    return 1


def main() -> None:
    sumber, keluar = Path(sys.argv[1]), Path(sys.argv[2])
    versi = sumber.name
    ts, ov, w, h, fmt = baca_dzi(sumber / "barelang.dzi")
    assert BARU % ts == 0
    asal = sumber / "barelang_files"
    dv = keluar / versi
    tujuan = dv / "barelang_files"
    lmaks = math.ceil(math.log2(max(w, h)))
    tugas = []
    for lv in range(lmaks + 1):
        s = 2 ** (lmaks - lv)
        wl, hl = math.ceil(w / s), math.ceil(h / s)
        (tujuan / str(lv)).mkdir(parents=True, exist_ok=True)
        for C in range(math.ceil(wl / BARU)):
            for R in range(math.ceil(hl / BARU)):
                tugas.append((asal, tujuan, lv, wl, hl, ts, ov, fmt, C, R))
    print(f"{versi}: {len(tugas)} ubin {BARU} px dari level 0-{lmaks}", flush=True)
    selesai = 0
    with ProcessPoolExecutor() as ex:
        for n in ex.map(kerja, tugas, chunksize=16):
            selesai += n
            if selesai % 1000 == 0:
                print(f"  {selesai}/{len(tugas)}", flush=True)
    (dv / "barelang.dzi").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<Image xmlns="http://schemas.microsoft.com/deepzoom/2008" Format="webp" Overlap="{ov}" TileSize="{BARU}">\n'
        f'  <Size Width="{w}" Height="{h}"/>\n</Image>\n',
        encoding="utf-8",
    )
    # Data lapisan memakai piksel kamera versi ini, jadi ikut di folder versi.
    for nama in ("poi_wisata.json", "lapisan_kota.json"):
        f = sumber.parent / nama
        if f.exists():
            shutil.copy2(f, dv / nama)
    # Ubin tidak pernah berubah dalam satu versi (versi baru = folder baru), jadi boleh disimpan lama di peramban.
    # JSON dan .dzi memakai cache bawaan Pages (selalu dicek ulang) supaya data lapisan bisa diperbarui.
    (keluar / "_headers").write_text(
        "/*\n  Access-Control-Allow-Origin: *\n"
        "/:versi/barelang_files/*\n  Cache-Control: public, max-age=31536000, immutable\n",
        encoding="utf-8",
    )
    jumlah = sum(1 for p in keluar.rglob("*") if p.is_file())
    print(f"selesai: {jumlah} berkas di {keluar}")


if __name__ == "__main__":
    main()
