#!/usr/bin/env python3
"""Masukkan kembali koordinat yang sudah diisi pemilik proyek.

Dua jenis CSV didukung (dideteksi otomatis dari header):
1. data/koordinat_perlu_diisi.csv                       → memperbarui data/places.json
2. data/trans_batam/halte_koordinat_perlu_diisi.csv     → memperbarui data/trans_batam/halte.json
   (CSV halte punya kolom "kelompok"; id halte adalah namespace tersendiri,
   misalnya halte "bandara-hang-nadim" BUKAN entri bandara di places.json)

Cara isi: tulis angka di kolom lat dan lng, atau tempel format Google Maps
"1.1234, 104.0567" di kolom lat saja. Baris yang terisi akan:
- mengisi lat/lng,
- mengubah status_koordinat menjadi "terverifikasi",
- mencatat catatan_koordinat = "diisi/dicek pemilik proyek <tanggal>".
- (CSV tempat) disimpan juga ke data/koordinat_user.json, yang dipakai ulang
  otomatis oleh tools/merge_places.py.
Baris yang kolom lat/lng-nya tidak diubah dari nilai lama (status perlu_cek_ulang)
tidak dianggap terverifikasi; ubah kolom status_koordinat menjadi "terverifikasi"
kalau koordinat lama memang sudah dicek dan benar.

Pakai:
  python3 tools/import_koordinat.py data/koordinat_perlu_diisi.csv
  python3 tools/import_koordinat.py data/trans_batam/halte_koordinat_perlu_diisi.csv
"""
import csv, datetime, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path_csv = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "data", "koordinat_perlu_diisi.csv")
rows = list(csv.DictReader(open(path_csv, encoding="utf-8-sig")))
is_halte = bool(rows) and "kelompok" in rows[0]

if is_halte:
    path_json = os.path.join(ROOT, "data", "trans_batam", "halte.json")
    doc = json.load(open(path_json, encoding="utf-8"))
    items = doc["halte"]
    idx = {p["id"]: p for p in items}
else:
    path_json = os.path.join(ROOT, "data", "places.json")
    doc = items = json.load(open(path_json, encoding="utf-8"))
    idx = {p["id"]: p for p in items}
    for p in items:
        for a in p.get("id_alias", []): idx.setdefault(a, p)

today = datetime.date.today().isoformat()
path_user = os.path.join(ROOT, "data", "koordinat_user.json")
user_koord = json.load(open(path_user, encoding="utf-8")) if os.path.exists(path_user) else {}
n_ok = n_bad = 0
for row in rows:
    lat, lng = (row.get("lat") or "").strip(), (row.get("lng") or "").strip()
    if lat and not lng and "," in lat:
        lat, lng = [x.strip() for x in lat.split(",", 1)]
    if not lat or not lng:
        continue
    try:
        la, lo = float(lat), float(lng)
    except ValueError:
        print("lewati (bukan angka):", row["id"], lat, lng); n_bad += 1; continue
    if not (0.3 <= la <= 1.6 and 103.4 <= lo <= 104.9):
        print("lewati (di luar Batam, mungkin lat/lng tertukar):", row["id"], la, lo); n_bad += 1; continue
    p = idx.get(row["id"])
    if not p:
        print("id tidak ditemukan:", row["id"]); n_bad += 1; continue
    unchanged = p.get("lat") == la and p.get("lng") == lo
    if unchanged and (row.get("status_koordinat") or "").strip() != "terverifikasi":
        continue  # koordinat lama dibiarkan apa adanya, status tidak dinaikkan
    p.update(lat=la, lng=lo, status_koordinat="terverifikasi", catatan_koordinat=f"diisi/dicek pemilik proyek {today}")
    if not is_halte:
        user_koord[p["id"]] = {"lat": la, "lng": lo, "tanggal": today}
    n_ok += 1

json.dump(doc, open(path_json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
if not is_halte:
    # disimpan terpisah supaya tidak hilang kalau tools/merge_places.py dijalankan ulang
    json.dump(dict(sorted(user_koord.items())), open(path_user, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{os.path.relpath(path_json, ROOT)} diperbarui: {n_ok}, dilewati: {n_bad}")
