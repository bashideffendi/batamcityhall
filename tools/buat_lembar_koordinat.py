#!/usr/bin/env python3
"""Buat data/koordinat_perlu_diisi.xlsx: semua lokasi yang koordinatnya kosong atau masih perkiraan.

Satu lokasi hanya muncul di satu lembar. Sumber kebenaran koordinat tempat adalah data/places.json.
Setelah diisi pemilik, masukkan kembali dengan tools/impor_lembar_koordinat.py.

Butuh: pip install xlsxwriter
Pakai: python tools/buat_lembar_koordinat.py
"""
import csv
import json
import os
import re
from urllib.parse import quote_plus

import xlsxwriter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KELUAR = os.path.join(ROOT, "data", "koordinat_perlu_diisi.xlsx")

PRIORITAS = {
    1: ["keamanan_darurat", "kesehatan", "layanan_publik", "pemerintahan", "transportasi"],
    2: ["belanja", "ibadah", "pemakaman", "pendidikan", "perpustakaan", "pertanahan_hukum"],
    3: ["budaya", "kampung_tua", "khas_batam", "kuliner", "landmark", "olahraga", "ruang_publik", "wisata"],
    4: ["jasa", "lainnya"],
    5: ["akomodasi"],
}
PRIORITAS_KET = {
    1: "Darurat, Kesehatan, Pemerintahan, Layanan Publik, Transportasi",
    2: "Belanja, Ibadah, Pemakaman, Pendidikan, Perpustakaan, Pertanahan dan Hukum",
    3: "Kuliner, Kampung Tua, Budaya, Wisata, Olahraga, Ruang Publik, Penanda Kota",
    4: "Jasa dan Lainnya",
    5: "Akomodasi",
}
PRIORITAS_DARI = {k: p for p, daftar in PRIORITAS.items() for k in daftar}
NAMA_KATEGORI = {
    "keamanan_darurat": "Keamanan dan Darurat",
    "kesehatan": "Kesehatan",
    "layanan_publik": "Layanan Publik",
    "pemerintahan": "Pemerintahan",
    "transportasi": "Transportasi",
    "belanja": "Belanja",
    "ibadah": "Ibadah",
    "pemakaman": "Pemakaman",
    "pendidikan": "Pendidikan",
    "perpustakaan": "Perpustakaan",
    "pertanahan_hukum": "Pertanahan dan Hukum",
    "budaya": "Budaya",
    "kampung_tua": "Kampung Tua",
    "khas_batam": "Khas Batam",
    "kuliner": "Kuliner",
    "landmark": "Penanda Kota",
    "olahraga": "Olahraga",
    "ruang_publik": "Ruang Publik",
    "wisata": "Wisata",
    "jasa": "Jasa",
    "lainnya": "Lainnya",
    "akomodasi": "Akomodasi",
}
KOLOM_ISI = "Koordinat (Tempel di Sini)"


def baca(*p):
    with open(os.path.join(ROOT, *p), encoding="utf-8") as f:
        return json.load(f)


SINGKATAN = {"kua", "kkp", "rs", "rsud", "smp", "sma", "smk", "sd", "tk", "bpn", "uwt", "ptsp", "ppat", "atm", "spbu", "ac", "tv"}


def judul(s):
    kata = str(s or "").replace("_", " ").replace("-", " ").split()
    return " ".join(k.upper() if k.lower() in SINGKATAN else k.capitalize() for k in kata)


def cari_url(*kata):
    return "https://www.google.com/maps/search/?api=1&query=" + quote_plus(" ".join(k for k in kata if k))


def titik_url(lat, lng):
    return f"https://www.google.com/maps/search/?api=1&query={lat},{lng}"


def cek_rumus(sel):
    """Tidak memakai VALUE: Excel berbahasa Indonesia membaca titik sebagai pemisah ribuan."""
    lng = f'LEFT(TRIM(MID({sel},FIND(",",{sel})+1,30)),4)'
    return (
        f'=IF({sel}="","",IF(LOWER(TRIM({sel}))="benar","Benar",'
        f'IFERROR(IF(AND(OR(LEFT(TRIM({sel}),2)="0.",LEFT(TRIM({sel}),2)="1."),OR({lng}="103.",{lng}="104.")),"OK","Periksa"),"Periksa")))'
    )


def baris_tempat(p, link_csv, gmaps=None):
    ada = p.get("lat") is not None and p.get("lng") is not None
    return {
        "ID": p["id"],
        "Prioritas": PRIORITAS_DARI.get(p["kategori"], 4),
        "Nama": p["nama"],
        "Kategori": NAMA_KATEGORI.get(p["kategori"], judul(p["kategori"])),
        "Subkategori": judul(p.get("subkategori")),
        "Kecamatan": p.get("kecamatan") or "",
        "Kelurahan": p.get("kelurahan") or "",
        "Alamat": p.get("alamat") or "",
        "Cari": gmaps or link_csv.get(p["id"]) or cari_url(p["nama"], p.get("alamat"), p.get("kecamatan"), "Batam"),
        "Titik": (p["lat"], p["lng"]) if ada else None,
        "Catatan": p.get("catatan_koordinat") or "",
    }


def urut_tempat(b):
    return (b["Prioritas"], b["Kategori"], b["Kecamatan"], b["Nama"].lower())


def kumpulkan():
    places = baca("data", "places.json")
    with open(os.path.join(ROOT, "data", "koordinat_perlu_diisi.csv"), encoding="utf-8-sig") as f:
        link_csv = {r["id"]: r["cari_di_google_maps"] for r in csv.DictReader(f)}
    mk = {m["id"]: m for m in baca("data", "makan", "places.json")}
    kawasan = {a["id"]: a["name"] for a in baca("data", "makan", "areas.json")}

    # Titik wakil wilayah yang sudah diisi pemilik tidak ditanyakan lagi, walau di peta tetap Lokasi Perkiraan.
    perlu = [
        p
        for p in places
        if p["status_koordinat"] in ("perlu_diisi_user", "perlu_cek_ulang")
        and not str(p.get("catatan_koordinat") or "").startswith("titik wakil")
    ]
    kosong, cek, makan, kampung = [], [], [], []
    for p in perlu:
        if p["kategori"] == "kuliner":
            b = baris_tempat(p, link_csv, mk.get(p["id"], {}).get("gmaps"))
            b["Kecamatan"] = b["Kecamatan"] or kawasan.get(mk.get(p["id"], {}).get("area"), "")
            makan.append(b)
        elif p["kategori"] == "kampung_tua":
            kampung.append(baris_tempat(p, link_csv))
        elif p["status_koordinat"] == "perlu_diisi_user":
            kosong.append(baris_tempat(p, link_csv))
        else:
            cek.append(baris_tempat(p, link_csv))

    halte = []
    for h in baca("data", "trans_batam", "halte.json")["halte"]:
        if h["status_koordinat"] not in ("perlu_diisi_user", "perlu_cek_ulang"):
            continue
        ada = h.get("lat") is not None and h.get("lng") is not None
        halte.append(
            {
                "ID": h["id"],
                "Nama": h["nama"],
                "Koridor": ", ".join(h.get("koridor") or []),
                "Kecamatan": h.get("kecamatan") or "",
                "Alamat": h.get("alamat") or "",
                "Cari": cari_url("Halte Trans Batam", h["nama"], "Batam"),
                "Titik": (h["lat"], h["lng"]) if ada else None,
                "Catatan": h.get("catatan_koordinat") or "",
            }
        )

    # Kamera berkoordinat perkiraan. Lokasinya ada di kode, bukan berkas data.
    cctv = []
    with open(os.path.join(ROOT, "features", "langit-laut", "lib", "cctv.ts"), encoding="utf-8") as f:
        for baris in f:
            if not re.match(r"\s*\{ slug:", baris) or "approx: true" not in baris:
                continue
            ambil = lambda kunci: re.search(kunci + r': "([^"]*)"', baris).group(1)
            angka = lambda kunci: float(re.search(kunci + r": ([\d.]+)", baris).group(1))
            cctv.append(
                {
                    "ID": ambil("slug"),
                    "Nama": ambil("name"),
                    "Kecamatan": ambil("area"),
                    "Cari": cari_url(ambil("name"), ambil("area"), "Batam"),
                    "Titik": (angka("lat"), angka("lng")),
                    "Catatan": "Lokasi perkiraan.",
                }
            )

    # Terminal di luar Batam tidak ada di places.json.
    id_tempat = {p["id"] for p in places} | {a for p in places for a in p.get("id_alias", [])}
    luar = []
    for t in baca("data", "feri", "terminal.json")["terminal"]:
        if t["id"] in id_tempat or t["status_koordinat"] == "terverifikasi":
            continue
        ada = t.get("lat") is not None and t.get("lng") is not None
        luar.append(
            {
                "ID": t["id"],
                "Nama": t["nama"],
                "Alamat": t.get("alamat") or "",
                "Cari": cari_url(t["nama"]),
                "Titik": (t["lat"], t["lng"]) if ada else None,
                "Catatan": t.get("catatan_koordinat") or "",
            }
        )

    food_court = []
    for f in baca("data", "makan", "foodcourt.json")["tempat"]:
        if f.get("lat") is not None and f.get("lng") is not None:
            continue
        food_court.append(
            {
                "ID": f["id"],
                "Nama": f["nama"],
                "Kecamatan": f["kecamatan"],
                "Alamat": f["alamat"],
                "Cari": cari_url(f["nama"], f["alamat"], "Batam"),
                "Titik": None,
                "Catatan": "Alamat perlu dicek." if f["tingkat"] == "daftar" else "",
            }
        )

    return [
        {
            "nama": "Food Court",
            "isi": "Food court dan pujasera di bagian Makanan",
            "baris": food_court,
            "kolom": ["Nama", "Kecamatan", "Alamat", "Cari", "Catatan"],
        },
        {
            "nama": "Belum Ada Koordinat",
            "isi": "Tempat di direktori tanpa koordinat sama sekali",
            "baris": sorted(kosong, key=urut_tempat),
            "kolom": ["Prioritas", "Nama", "Kategori", "Subkategori", "Kecamatan", "Kelurahan", "Alamat", "Cari"],
        },
        {
            "nama": "Perlu Dicek",
            "isi": "Tempat di direktori yang titiknya masih perkiraan",
            "baris": sorted(cek, key=urut_tempat),
            "kolom": ["Prioritas", "Nama", "Kategori", "Subkategori", "Kecamatan", "Alamat", "Cari", "Titik", "Catatan"],
        },
        {
            "nama": "Makanan",
            "isi": "Semua titik hanya perkiraan area, bukan titik tempat",
            "baris": sorted(makan, key=lambda b: (b["Kecamatan"], b["Nama"].lower())),
            "kolom": ["Nama", "Subkategori", "Kecamatan", "Alamat", "Cari", "Titik"],
        },
        {
            "nama": "Kampung Tua",
            "isi": "Titik kampung tua, sebagian besar perkiraan kasar",
            "baris": sorted(kampung, key=lambda b: (b["Kecamatan"], b["Nama"].lower())),
            "kolom": ["Nama", "Kecamatan", "Kelurahan", "Alamat", "Cari", "Titik", "Catatan"],
        },
        {
            "nama": "Halte Trans Batam",
            "isi": "Halte dan titik transfer",
            "baris": halte,
            "kolom": ["Nama", "Koridor", "Kecamatan", "Alamat", "Cari", "Titik", "Catatan"],
        },
        {
            "nama": "CCTV",
            "isi": "Kamera yang lokasinya masih perkiraan",
            "baris": cctv,
            "kolom": ["Nama", "Kecamatan", "Cari", "Titik", "Catatan"],
        },
        {
            "nama": "Terminal Luar Batam",
            "isi": "Terminal tujuan feri di Singapura dan Johor",
            "baris": luar,
            "kolom": ["Nama", "Alamat", "Cari", "Titik", "Catatan"],
        },
    ]


LEBAR = {
    "No": 6,
    "Prioritas": 9,
    "Nama": 42,
    "Kategori": 22,
    "Subkategori": 22,
    "Koridor": 16,
    "Kecamatan": 16,
    "Kelurahan": 16,
    "Alamat": 44,
    "Cari": 11,
    "Titik": 22,
    "Catatan": 40,
    KOLOM_ISI: 30,
    "Cek": 9,
    "Catatan Anda": 30,
    "ID": 24,
}
JUDUL_KOLOM = {"Cari": "Cari di Google Maps", "Titik": "Titik Saat Ini", "Catatan": "Catatan Data"}


def tulis(lembar):
    wb = xlsxwriter.Workbook(KELUAR)
    wb.set_properties({"title": "Koordinat Batam City Hall", "author": "Batam City Hall"})
    dasar = {"font_name": "Arial", "font_size": 10, "valign": "top"}
    f = lambda **k: wb.add_format({**dasar, **k})
    garis = {"bottom": 1, "bottom_color": "#D9D5CC"}
    fmt = {
        "kepala": f(bold=True, font_color="#FFFFFF", bg_color="#1F3A44", text_wrap=True, valign="vcenter", border=1, border_color="#1F3A44"),
        "kepala_isi": f(bold=True, font_color="#1F3A44", bg_color="#FFD84D", text_wrap=True, valign="vcenter", border=1, border_color="#C9A500"),
        "teks": f(text_wrap=True, **garis),
        "tengah": f(align="center", **garis),
        "link": f(font_color="#0B5CAD", underline=1, **garis),
        "isi": f(bg_color="#FFF6CC", num_format="@", border=1, border_color="#E5CF7A"),
        "catatan_anda": f(text_wrap=True, border=1, border_color="#E0DCD3"),
        "id": f(font_color="#6B6B6B", **garis),
        "ok": wb.add_format({"font_color": "#1B6E3C", "bold": True}),
        "salah": wb.add_format({"font_color": "#FFFFFF", "bg_color": "#B3261E", "bold": True}),
        "h1": f(bold=True, font_size=18, font_color="#1F3A44"),
        "h2": f(bold=True, font_size=12, font_color="#1F3A44"),
        "polos": f(text_wrap=True),
        "kuat": f(bold=True, text_wrap=True),
        "angka": f(num_format="#,##0", align="right", **garis),
        "angka_kuat": f(num_format="#,##0", align="right", bold=True, top=1),
        "teks_kuat": f(bold=True, top=1),
        "contoh_isi": f(bg_color="#FFF6CC", num_format="@", border=1, border_color="#E5CF7A"),
    }

    # ---------- Petunjuk ----------
    ws = wb.add_worksheet("Petunjuk")
    ws.hide_gridlines(2)
    ws.set_column("A:A", 34)
    ws.set_column("B:B", 58)
    ws.set_column("C:E", 12)
    r = 0
    ws.write(r, 0, "Koordinat Batam City Hall", fmt["h1"])
    ws.set_row(r, 28)
    r += 1
    ws.merge_range(r, 0, r, 4, "Isi hanya kolom kuning. Boleh bertahap: baris yang kosong dilewati saat dimasukkan ke situs.", fmt["polos"])
    r += 2
    ws.write(r, 0, "Cara Mengisi", fmt["h2"])
    r += 1
    langkah = [
        "1. Klik Buka di kolom Cari di Google Maps.",
        "2. Di Google Maps, klik kanan titik tempatnya, lalu klik angka koordinat paling atas. Angkanya langsung tersalin.",
        f"3. Tempel di kolom kuning, {KOLOM_ISI}. Contoh isi ada di bawah.",
        "4. Kolom Cek menampilkan OK. Bila Periksa, angkanya salah atau tertukar.",
        "5. Bila ada kolom Titik Saat Ini dan titiknya sudah tepat, cukup ketik benar di kolom kuning.",
        "6. Bila tempatnya tidak ketemu atau sudah tutup, kosongkan kolom kuning dan tulis di Catatan Anda.",
        "7. Selesai sebagian atau semua, kirim file ini kembali. Koordinatnya saya masukkan ke situs.",
    ]
    for t in langkah:
        ws.merge_range(r, 0, r, 4, t, fmt["polos"])
        ws.set_row(r, 15 if len(t) < 100 else 28)
        r += 1
    r += 1
    ws.write(r, 0, "Pulau, Kampung, dan Kawasan", fmt["h2"])
    r += 1
    wakil = [
        "Satu titik saja, di tempat orang datang. Bukan di tengah pulau atau kawasan.",
        "Gedung di pulau (rumah sakit, puskesmas, sekolah): titik gedungnya. Ini titik tepat, bukan area.",
        "Pulau tujuan wisata: dermaga atau pelabuhan tempat orang turun dari perahu.",
        "Kampung tua: pusat kampung, misalnya masjid atau surau tua, balai kampung, atau dermaganya.",
        "Kawasan (Nagoya, kawasan olahraga, kawasan industri): pintu masuk utama atau tempat paling ramai.",
        "Pantai: pintu masuk atau tempat parkirnya.",
        "Halte bernama kampung atau kawasan: titik halte di tepi jalan, bukan kampungnya.",
        "Bila titiknya hanya mewakili sebuah wilayah, tulis area di Catatan Anda. Di peta titik itu tampil sebagai Lokasi Perkiraan, dan arah jalan dicari menurut nama.",
    ]
    for t in wakil:
        ws.merge_range(r, 0, r, 4, t, fmt["polos"])
        ws.set_row(r, 15 if len(t) < 100 else 28)
        r += 1
    r += 1
    ws.write(r, 0, "Contoh", fmt["h2"])
    r += 1
    ws.write(r, 0, "Nama", fmt["kepala"])
    ws.write(r, 1, KOLOM_ISI, fmt["kepala_isi"])
    ws.write(r, 2, "Catatan Anda", fmt["kepala"])
    r += 1
    ws.write(r, 0, "Pura Amertabhuana", fmt["teks"])
    ws.write_string(r, 1, "1.112828, 104.002754", fmt["contoh_isi"])
    r += 1
    ws.write(r, 0, "Pulau Belakang Padang", fmt["teks"])
    ws.write_string(r, 1, "(titik dermaga utamanya)", fmt["contoh_isi"])
    ws.write_string(r, 2, "area", fmt["teks"])
    r += 2

    ws.write(r, 0, "Daftar Lembar", fmt["h2"])
    r += 1
    for c, t in enumerate(["Lembar", "Isi", "Jumlah", "Sudah Diisi", "Sisa"]):
        ws.write(r, c, t, fmt["kepala"])
    r += 1
    awal = r
    total = 0
    for l in lembar:
        kolom = kolom_lembar(l)
        n = len(l["baris"])
        total += n
        huruf_isi = xlsxwriter.utility.xl_col_to_name(kolom.index(KOLOM_ISI))
        huruf_id = xlsxwriter.utility.xl_col_to_name(kolom.index("ID"))
        rujuk = f"'{l['nama']}'!"
        ws.write_url(r, 0, f"internal:'{l['nama']}'!A1", fmt["link"], string=l["nama"])
        ws.write(r, 1, l["isi"], fmt["teks"])
        ws.write_formula(r, 2, f"=COUNTA({rujuk}{huruf_id}2:{huruf_id}{n + 1})", fmt["angka"], n)
        ws.write_formula(r, 3, f"=COUNTA({rujuk}{huruf_isi}2:{huruf_isi}{n + 1})", fmt["angka"], 0)
        ws.write_formula(r, 4, f"=C{r + 1}-D{r + 1}", fmt["angka"], n)
        r += 1
    ws.write(r, 0, "Total", fmt["teks_kuat"])
    ws.write(r, 1, "", fmt["teks_kuat"])
    for c, nilai in ((2, total), (3, 0), (4, total)):
        h = "CDE"[c - 2]
        ws.write_formula(r, c, f"=SUM({h}{awal + 1}:{h}{r})", fmt["angka_kuat"], nilai)
    r += 2

    ws.write(r, 0, "Prioritas", fmt["h2"])
    r += 1
    for c, t in enumerate(["Prioritas", "Kategori"]):
        ws.write(r, c, t, fmt["kepala"])
    r += 1
    for p, ket in PRIORITAS_KET.items():
        ws.write(r, 0, p, fmt["tengah"])
        ws.write(r, 1, ket, fmt["teks"])
        r += 1
    r += 1
    ws.merge_range(
        r, 0, r, 4,
        "Dasar lembar: data/places.json, data/trans_batam/halte.json, data/feri/terminal.json, dan kode CCTV, per pembuatan file ini. "
        "Tidak ada koordinat yang ditebak: Titik Saat Ini adalah perkiraan dari sumber yang tercatat.",
        fmt["polos"],
    )
    ws.set_row(r, 28)

    # ---------- Lembar data ----------
    for l in lembar:
        ws = wb.add_worksheet(l["nama"])
        kolom = kolom_lembar(l)
        for c, k in enumerate(kolom):
            ws.write(0, c, JUDUL_KOLOM.get(k, k), fmt["kepala_isi"] if k == KOLOM_ISI else fmt["kepala"])
            ws.set_column(c, c, LEBAR.get(k, 16))
        ws.set_row(0, 30)
        ci = kolom.index(KOLOM_ISI)
        huruf_isi = xlsxwriter.utility.xl_col_to_name(ci)
        for i, b in enumerate(l["baris"]):
            r = i + 1
            for c, k in enumerate(kolom):
                if k == "No":
                    ws.write_number(r, c, i + 1, fmt["tengah"])
                elif k == "Prioritas":
                    ws.write_number(r, c, b[k], fmt["tengah"])
                elif k == "Cari":
                    ws.write_url(r, c, b["Cari"], fmt["link"], string="Buka")
                elif k == "Titik":
                    if b["Titik"]:
                        la, lo = b["Titik"]
                        ws.write_url(r, c, titik_url(la, lo), fmt["link"], string=f"{la}, {lo}")
                    else:
                        ws.write_blank(r, c, None, fmt["teks"])
                elif k == KOLOM_ISI:
                    ws.write_blank(r, c, None, fmt["isi"])
                elif k == "Cek":
                    ws.write_formula(r, c, cek_rumus(f"{huruf_isi}{r + 1}"), fmt["tengah"], "")
                elif k == "Catatan Anda":
                    ws.write_blank(r, c, None, fmt["catatan_anda"])
                elif k == "ID":
                    ws.write_string(r, c, b["ID"], fmt["id"])
                else:
                    ws.write_string(r, c, str(b.get(k, "") or ""), fmt["teks"])
        n = len(l["baris"])
        ws.freeze_panes(1, kolom.index("Nama") + 1)
        ws.autofilter(0, 0, n, len(kolom) - 1)
        cc = kolom.index("Cek")
        ws.conditional_format(1, cc, n, cc, {"type": "cell", "criteria": "==", "value": '"Periksa"', "format": fmt["salah"]})
        ws.conditional_format(1, cc, n, cc, {"type": "cell", "criteria": "==", "value": '"OK"', "format": fmt["ok"]})
        ws.conditional_format(1, cc, n, cc, {"type": "cell", "criteria": "==", "value": '"Benar"', "format": fmt["ok"]})
    wb.close()


def kolom_lembar(l):
    return ["No"] + l["kolom"] + [KOLOM_ISI, "Cek", "Catatan Anda", "ID"]


if __name__ == "__main__":
    lembar = kumpulkan()
    tulis(lembar)
    for l in lembar:
        print(f"{l['nama']}: {len(l['baris'])}")
    print("Total:", sum(len(l["baris"]) for l in lembar))
    print(os.path.relpath(KELUAR, ROOT))
