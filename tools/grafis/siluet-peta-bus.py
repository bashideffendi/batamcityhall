"""Siluet Batam untuk Peta Bus Trans Batam, diambil dari PDF Peta Bus Batam.

Sumber: Peta Bus Batam karya Farhan S. Fadhillah, akurat per 24 Oktober 2024, lisensi CC BY 4.0
(s.id/TransitMapBTM). Yang diambil hanya bentuk darat, area bandara, dan landasan, lalu diubah ke kanvas
features/jalan/peta-bus (skala dan geser sama dengan jaringan.ts). PDF tidak disimpan di repo.

Butuh: pip install pymupdf
Pakai:  python tools/grafis/siluet-peta-bus.py <Batam_Bus_Map.pdf>
"""
import os
import sys

import pymupdf

AKAR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
KELUARAN = os.path.join(AKAR, "features", "jalan", "peta-bus", "siluet.ts")

# Harus sama dengan KANVAS di features/jalan/peta-bus/jaringan.ts.
SKALA = 1.5
GESER_X = 50
GESER_Y = -95
LEBAR_PDF = 1684
TINGGI_PDF = 1185

WARNA = {"#e5e4e4": "darat", "#46792f": "bandara", "#989898": "landasan"}


def titik(p):
    return f"{(p.x + GESER_X) * SKALA:.1f} {(p.y + GESER_Y) * SKALA:.1f}"


def ke_d(items, tutup):
    """Jalur SVG dari item gambar PDF. Sub-jalur yang sangat kecil (serpihan) dibuang."""
    sub = []  # [(teks, [titik])]
    kini = None
    for it in items:
        if it[0] in ("l", "c"):
            a = it[1]
            b = it[2] if it[0] == "l" else it[4]
            if kini is None or abs(kini.x - a.x) > 0.01 or abs(kini.y - a.y) > 0.01:
                sub.append([f"M{titik(a)}", [a]])
            if it[0] == "l":
                sub[-1][0] += f"L{titik(b)}"
            else:
                sub[-1][0] += f"C{titik(it[2])} {titik(it[3])} {titik(b)}"
            sub[-1][1].append(b)
            kini = b
        elif it[0] == "qu":
            q = it[1]
            sub.append([f"M{titik(q.ul)}L{titik(q.ur)}L{titik(q.lr)}L{titik(q.ll)}Z", [q.ul, q.lr]])
            kini = None
    hasil = []
    for teks, pts in sub:
        lebar = max(p.x for p in pts) - min(p.x for p in pts)
        tinggi = max(p.y for p in pts) - min(p.y for p in pts)
        if max(lebar, tinggi) > 12:
            hasil.append(teks + ("Z" if tutup and not teks.endswith("Z") else ""))
    return "".join(hasil)


def main():
    page = pymupdf.open(sys.argv[1])[0]
    hasil = {"darat": [], "bandara": [], "landasan": []}
    for dr in page.get_drawings():
        f = dr.get("fill")
        if f is None:
            continue
        kunci = "#%02x%02x%02x" % tuple(int(round(v * 255)) for v in f)
        r = dr["rect"]
        # Serpihan kecil di PDF (sisa garis penunjuk label) dibuang.
        if kunci in WARNA and max(r.width, r.height) > 12:
            hasil[WARNA[kunci]].append(ke_d(dr["items"], dr.get("closePath")))
    lebar = round((LEBAR_PDF + GESER_X) * SKALA)
    tinggi = round((TINGGI_PDF + GESER_Y) * SKALA)
    isi = f"""// Dibuat oleh tools/grafis/siluet-peta-bus.py. Jangan disunting tangan.
// Bentuk darat, bandara, dan landasan dari Peta Bus Batam karya Farhan S. Fadhillah (Oktober 2024, CC BY 4.0).

export const LEBAR_KANVAS = {lebar};
export const TINGGI_KANVAS = {tinggi};

export const DARAT = {"".join(hasil["darat"])!r};
export const BANDARA = {"".join(hasil["bandara"])!r};
export const LANDASAN = {"".join(hasil["landasan"])!r};
""".replace("'", '"')
    with open(KELUARAN, "w", encoding="utf-8", newline="\n") as f:
        f.write(isi)
    print(f"siluet: {lebar} x {tinggi}, {len(isi) // 1024} KB")


if __name__ == "__main__":
    main()
