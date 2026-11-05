#!/usr/bin/env python3
"""Masukkan kembali data/koordinat_perlu_diisi.xlsx yang sudah diisi pemilik proyek.

Isi kolom kuning: "1.1234, 104.0567", atau "benar" untuk menyatakan titik yang ada sudah tepat.
Baris kosong dilewati. Baris yang salah dilaporkan dan tidak diubah.

Yang diperbarui:
- Tempat: data/places.json dan data/koordinat_user.json, data/places_stats.json, lalu salinannya
  di data/makan/places.json, data/kampung_tua/kampung_tua.json, data/mural/landmarks.json.
- Halte: data/trans_batam/halte.json.
- CCTV: features/langit-laut/lib/cctv.ts.
- Terminal luar Batam: data/feri/terminal.json.
- Food court: data/makan/foodcourt.json.

Butuh: pip install openpyxl
Pakai: python tools/impor_lembar_koordinat.py [berkas.xlsx] [--coba]
       --coba hanya melaporkan, tidak menulis apa pun.
       AKAR_REPO=<folder> memakai salinan data di folder lain, untuk uji.
"""
import datetime
import json
import os
import re
import sys

from openpyxl import load_workbook

ROOT = os.environ.get("AKAR_REPO") or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KOLOM_ISI = "Koordinat (Tempel di Sini)"
LEMBAR_TEMPAT = ("Belum Ada Koordinat", "Perlu Dicek", "Makanan", "Kampung Tua")
BATAS_LAT = (0.3, 1.6)
BATAS_LNG = (103.4, 104.9)


def baca_json(*p):
    with open(os.path.join(ROOT, *p), encoding="utf-8") as f:
        return json.load(f)


def tulis_json(doc, *p):
    """Pertahankan lekukan dan akhir berkas yang sudah ada, supaya diff hanya baris yang berubah."""
    path = os.path.join(ROOT, *p)
    lekuk = 1
    akhir = ""
    with open(path, encoding="utf-8", newline="") as f:
        asli = f.read()
    m = re.search(r"\n( +)\S", asli)
    if m:
        lekuk = len(m.group(1))
    if asli.endswith("\n"):
        akhir = "\n"
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(doc, ensure_ascii=False, indent=lekuk) + akhir)


def uraikan(teks):
    """Kembalikan "benar", (lat, lng), atau melempar ValueError dengan alasannya."""
    s = str(teks).strip()
    if s.lower() == "benar":
        return "benar"
    if "," not in s:
        raise ValueError("bukan format lat, lng")
    la, lo = (x.strip() for x in s.split(",", 1))
    try:
        la, lo = float(la), float(lo)
    except ValueError:
        raise ValueError("bukan angka")
    if not (BATAS_LAT[0] <= la <= BATAS_LAT[1] and BATAS_LNG[0] <= lo <= BATAS_LNG[1]):
        raise ValueError("di luar wilayah, mungkin lat dan lng tertukar")
    return la, lo


def baris_terisi(ws):
    kepala = [c.value for c in ws[1]]
    if KOLOM_ISI not in kepala or "ID" not in kepala:
        raise SystemExit(f"Lembar {ws.title}: kolom {KOLOM_ISI} atau ID hilang.")
    ci, cid = kepala.index(KOLOM_ISI), kepala.index("ID")
    for nomor, r in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        if r[ci] is not None and str(r[ci]).strip():
            yield nomor, r[cid], r[ci]


def main():
    arg = [a for a in sys.argv[1:] if not a.startswith("--")]
    coba = "--coba" in sys.argv
    berkas = arg[0] if arg else os.path.join(ROOT, "data", "koordinat_perlu_diisi.xlsx")
    wb = load_workbook(berkas, data_only=False)
    hari_ini = datetime.date.today().isoformat()
    tanda = f"diisi/dicek pemilik proyek {hari_ini}"

    tempat = baca_json("data", "places.json")
    id_tempat = {}
    for p in tempat:
        id_tempat[p["id"]] = p
    for p in tempat:
        for a in p.get("id_alias", []):
            id_tempat.setdefault(a, p)
    pengguna = baca_json("data", "koordinat_user.json")
    halte_doc = baca_json("data", "trans_batam", "halte.json")
    id_halte = {h["id"]: h for h in halte_doc["halte"]}
    terminal_doc = baca_json("data", "feri", "terminal.json")
    id_terminal = {t["id"]: t for t in terminal_doc["terminal"]}
    makan = baca_json("data", "makan", "places.json")
    id_makan = {m["id"]: m for m in makan}
    kampung = baca_json("data", "kampung_tua", "kampung_tua.json")
    id_kampung = {k["id"]: k for k in kampung}
    mural = baca_json("data", "mural", "landmarks.json")
    id_mural = {m["id"]: m for m in mural}
    fc_doc = baca_json("data", "makan", "foodcourt.json")
    id_fc = {f["id"]: f for f in fc_doc["tempat"]}
    cctv_path = os.path.join(ROOT, "features", "langit-laut", "lib", "cctv.ts")
    with open(cctv_path, encoding="utf-8", newline="") as f:
        cctv = f.read()

    hitung = {}
    masalah = []

    def terapkan(obj, nilai, lembar, nomor, ident):
        if nilai == "benar":
            if obj.get("lat") is None or obj.get("lng") is None:
                masalah.append(f"{lembar} baris {nomor} ({ident}): ditulis benar, padahal belum ada titik")
                return None
            return obj["lat"], obj["lng"]
        return nilai

    for ws in wb.worksheets:
        if ws.title == "Petunjuk":
            continue
        for nomor, ident, isi in baris_terisi(ws):
            try:
                nilai = uraikan(isi)
            except ValueError as e:
                masalah.append(f"{ws.title} baris {nomor} ({ident}): {e}: {isi}")
                continue
            if ws.title in LEMBAR_TEMPAT:
                p = id_tempat.get(ident)
                if not p:
                    masalah.append(f"{ws.title} baris {nomor}: id {ident} tidak ada")
                    continue
                titik = terapkan(p, nilai, ws.title, nomor, ident)
                if not titik:
                    continue
                la, lo = titik
                p.update(lat=la, lng=lo, status_koordinat="terverifikasi", catatan_koordinat=tanda)
                pengguna[p["id"]] = {"lat": la, "lng": lo, "tanggal": hari_ini}
                if p["id"] in id_makan:
                    id_makan[p["id"]].update(lat=la, lng=lo, coord_approx=False)
                if p["id"] in id_kampung:
                    id_kampung[p["id"]].update(lat=la, lng=lo, akurasi_koordinat=tanda)
                if p["id"] in id_mural:
                    id_mural[p["id"]].update(lat=la, lng=lo, akurasi_koordinat=tanda)
            elif ws.title == "Food Court":
                f = id_fc.get(ident)
                if not f:
                    masalah.append(f"{ws.title} baris {nomor}: id {ident} tidak ada")
                    continue
                titik = terapkan(f, nilai, ws.title, nomor, ident)
                if not titik:
                    continue
                f.update(lat=titik[0], lng=titik[1])
            elif ws.title == "Halte Trans Batam":
                h = id_halte.get(ident)
                if not h:
                    masalah.append(f"{ws.title} baris {nomor}: id {ident} tidak ada")
                    continue
                titik = terapkan(h, nilai, ws.title, nomor, ident)
                if not titik:
                    continue
                h.update(lat=titik[0], lng=titik[1], status_koordinat="terverifikasi", catatan_koordinat=tanda)
            elif ws.title == "Terminal Luar Batam":
                t = id_terminal.get(ident)
                if not t:
                    masalah.append(f"{ws.title} baris {nomor}: id {ident} tidak ada")
                    continue
                titik = terapkan(t, nilai, ws.title, nomor, ident)
                if not titik:
                    continue
                t.update(lat=titik[0], lng=titik[1], status_koordinat="terverifikasi")
            elif ws.title == "CCTV":
                pola = re.compile(r'(\{ slug: "' + re.escape(str(ident)) + r'",.*?lat: )([\d.]+)(, lng: )([\d.]+)(, approx: true)?')
                if not pola.search(cctv):
                    masalah.append(f"{ws.title} baris {nomor}: kamera {ident} tidak ada")
                    continue
                if nilai == "benar":
                    cctv = pola.sub(lambda m: m.group(1) + m.group(2) + m.group(3) + m.group(4), cctv, count=1)
                else:
                    la, lo = nilai
                    cctv = pola.sub(lambda m: f"{m.group(1)}{la}{m.group(3)}{lo}", cctv, count=1)
            else:
                masalah.append(f"Lembar tidak dikenal: {ws.title}")
                break
            hitung[ws.title] = hitung.get(ws.title, 0) + 1

    for lembar, n in hitung.items():
        print(f"{lembar}: {n} baris")
    print(f"Total diterapkan: {sum(hitung.values())}. Bermasalah: {len(masalah)}.")
    for m in masalah:
        print(" -", m)
    if coba:
        print("Mode coba: tidak ada berkas yang ditulis.")
        return

    tulis_json(tempat, "data", "places.json")
    tulis_json(dict(sorted(pengguna.items())), "data", "koordinat_user.json")
    stats = baca_json("data", "places_stats.json")
    per_status = {}
    for p in tempat:
        per_status[p["status_koordinat"]] = per_status.get(p["status_koordinat"], 0) + 1
    stats["per_status_koordinat"] = per_status
    tulis_json(stats, "data", "places_stats.json")
    tulis_json(halte_doc, "data", "trans_batam", "halte.json")
    tulis_json(terminal_doc, "data", "feri", "terminal.json")
    tulis_json(makan, "data", "makan", "places.json")
    tulis_json(fc_doc, "data", "makan", "foodcourt.json")
    tulis_json(kampung, "data", "kampung_tua", "kampung_tua.json")
    tulis_json(mural, "data", "mural", "landmarks.json")
    with open(cctv_path, "w", encoding="utf-8", newline="") as f:
        f.write(cctv)
    print("Berkas data diperbarui.")


if __name__ == "__main__":
    main()
