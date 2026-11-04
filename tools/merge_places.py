#!/usr/bin/env python3
"""Gabungkan semua data/places/*.json menjadi data/places.json.

- Validasi & rapikan field sesuai skema tempat (lihat tools/_agent_spec.md).
- Gabungkan duplikat antar-laporan (nama dinormalisasi + kategori, atau koordinat sangat dekat + nama mirip).
- Tulis konflik ke data/places_konflik.json, statistik ke data/places_stats.json,
  dan daftar koordinat yang belum pasti ke data/koordinat_perlu_diisi.csv.

Pakai: python3 tools/merge_places.py   (jalankan dari root paket)
"""
import csv, glob, json, math, os, re, sys
from urllib.parse import quote_plus
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KECAMATAN = ["Batam Kota", "Batu Aji", "Batu Ampar", "Belakang Padang", "Bengkong", "Bulang",
             "Galang", "Lubuk Baja", "Nongsa", "Sagulung", "Sei Beduk", "Sekupang"]
KATEGORI = ["pemerintahan", "layanan_publik", "keamanan_darurat", "kesehatan", "pendidikan", "perpustakaan",
            "ibadah", "pemakaman", "transportasi", "belanja", "ruang_publik", "wisata", "olahraga",
            "akomodasi", "jasa", "pertanahan_hukum", "landmark", "kampung_tua", "budaya", "khas_batam", "kuliner", "lainnya"]
STATUS_KOORD = ["terverifikasi", "perlu_cek_ulang", "perlu_diisi_user"]
RANK = {"terverifikasi": 0, "perlu_cek_ulang": 1, "perlu_diisi_user": 2}
FIELDS = ["id", "nama", "nama_alternatif", "kategori", "subkategori", "kecamatan", "kelurahan", "alamat",
          "lat", "lng", "status_koordinat", "catatan_koordinat", "jam_layanan", "kontak", "atribut",
          "status_data", "catatan", "tag_osm", "sumber_url", "sumber_riset"]

STOP = r"\b(kantor|the|kota batam|batam|kel|kelurahan|kec|kecamatan|dan|&|internasional)\b"

def norm_name(s):
    s = (s or "").lower()
    s = re.sub(r"\(.*?\)", " ", s)
    s = s.replace("rumah sakit", "rs").replace("puskesmas", "pkm").replace("sei ", "sungai ")
    s = s.replace("ferry", "feri").replace("pelabuhan", "terminal").replace("international", "internasional")
    s = s.replace("bandar udara", "bandara").replace("hangnadim", "hang nadim")
    s = re.sub(STOP, " ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()

def dist_m(a, b):
    if None in (a.get("lat"), a.get("lng"), b.get("lat"), b.get("lng")):
        return None
    R = 6371000
    p1, p2 = math.radians(a["lat"]), math.radians(b["lat"])
    dp = p2 - p1; dl = math.radians(b["lng"] - a["lng"])
    h = math.sin(dp/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2
    return 2*R*math.asin(math.sqrt(h))

def as_list(v):
    if v is None: return []
    if isinstance(v, list): return [x for x in v if x not in (None, "")]
    return [v]

def clean(e, src_file, problems):
    o = {k: e.get(k) for k in FIELDS}
    o["nama_alternatif"] = as_list(o["nama_alternatif"])
    o["sumber_url"] = as_list(o["sumber_url"])
    o["kontak"] = o["kontak"] if isinstance(o["kontak"], dict) else ({"lainnya": o["kontak"]} if o["kontak"] else {})
    o["atribut"] = o["atribut"] if isinstance(o["atribut"], dict) else {}
    o["sumber_riset"] = as_list(o["sumber_riset"]) or [os.path.splitext(os.path.basename(src_file))[0]]
    for k in ("lat", "lng"):
        if o[k] is not None:
            try: o[k] = float(o[k])
            except (TypeError, ValueError):
                problems.append(f"{src_file}:{o['id']}: {k} tidak numerik ({o[k]!r}), dikosongkan"); o[k] = None
    if o["lat"] is not None and not o["atribut"].get("lokasi_luar_batam") and not (0.3 <= o["lat"] <= 1.6 and 103.4 <= (o["lng"] or 0) <= 104.9):
        problems.append(f"{src_file}:{o['id']}: koordinat di luar kotak Batam ({o['lat']},{o['lng']}), status diturunkan ke perlu_cek_ulang")
        o["status_koordinat"] = "perlu_cek_ulang"
    if o["lat"] is None or o["lng"] is None:
        o["lat"] = o["lng"] = None
        o["status_koordinat"] = "perlu_diisi_user"
    if o["status_koordinat"] not in STATUS_KOORD:
        problems.append(f"{src_file}:{o['id']}: status_koordinat '{o['status_koordinat']}' → perlu_cek_ulang")
        o["status_koordinat"] = "perlu_cek_ulang"
    if o["kecamatan"] not in KECAMATAN and o["kecamatan"] is not None:
        fix = {"Sungai Beduk": "Sei Beduk"}.get(o["kecamatan"])
        if fix: o["kecamatan"] = fix
        else:
            problems.append(f"{src_file}:{o['id']}: kecamatan '{o['kecamatan']}' tidak dikenal → null")
            o["catatan"] = ((o["catatan"] or "") + f" Kecamatan asli: {o['kecamatan']}.").strip()
            o["kecamatan"] = None
    if o["kategori"] not in KATEGORI:
        problems.append(f"{src_file}:{o['id']}: kategori '{o['kategori']}' → lainnya")
        o["atribut"].setdefault("kategori_asli", o["kategori"]); o["kategori"] = "lainnya"
    if not o["id"]:
        o["id"] = re.sub(r"[^a-z0-9]+", "-", (o["nama"] or "tanpa-nama").lower()).strip("-")
    return o

def merge(a, b, conflicts):
    """Gabungkan b ke a. a = entri yang dipertahankan."""
    if RANK[b["status_koordinat"]] < RANK[a["status_koordinat"]]:
        for k in ("lat", "lng", "status_koordinat", "catatan_koordinat"): a[k] = b[k]
    elif b["lat"] is not None and a["lat"] is not None:
        d = dist_m(a, b)
        if d and d > 300:
            conflicts.append({"id": a["id"], "nama": a["nama"], "jenis": "koordinat_beda",
                              "a": [a["lat"], a["lng"], a["sumber_riset"]], "b": [b["lat"], b["lng"], b["sumber_riset"]],
                              "jarak_m": round(d)})
    for k in ("kecamatan", "kelurahan", "alamat", "jam_layanan", "tag_osm", "status_data", "subkategori"):
        if not a.get(k) and b.get(k): a[k] = b[k]
        elif a.get(k) and b.get(k) and str(a[k]).strip().lower() != str(b[k]).strip().lower() and k in ("kecamatan", "alamat"):
            conflicts.append({"id": a["id"], "nama": a["nama"], "jenis": f"{k}_beda", "a": a[k], "b": b[k],
                              "sumber": [a["sumber_riset"], b["sumber_riset"]]})
    for k, v in b["kontak"].items():
        if v and not a["kontak"].get(k): a["kontak"][k] = v
    for k, v in b["atribut"].items():
        if k not in a["atribut"]: a["atribut"][k] = v
    a["nama_alternatif"] = sorted(set(a["nama_alternatif"] + b["nama_alternatif"] + ([b["nama"]] if b["nama"] != a["nama"] else [])))
    a["sumber_url"] = list(dict.fromkeys(a["sumber_url"] + b["sumber_url"]))
    a["sumber_riset"] = list(dict.fromkeys(a["sumber_riset"] + b["sumber_riset"]))
    if b.get("catatan") and b["catatan"] not in (a.get("catatan") or ""):
        a["catatan"] = ((a.get("catatan") or "") + " | " + b["catatan"]).strip(" |")
    a.setdefault("id_alias", [])
    if b["id"] != a["id"]: a["id_alias"] = sorted(set(a["id_alias"] + [b["id"]] + b.get("id_alias", [])))
    return a

def main():
    files = sorted(glob.glob(os.path.join(ROOT, "data", "places", "*.json")))
    problems, conflicts, all_e = [], [], []
    for f in files:
        try: arr = json.load(open(f, encoding="utf-8"))
        except Exception as ex: problems.append(f"{f}: JSON tidak valid: {ex}"); continue
        for e in arr: all_e.append(clean(e, os.path.relpath(f, ROOT), problems))
    # grup alias manual (tools/merge_aliases.json): id anggota → id kanonik
    alias_path = os.path.join(ROOT, "tools", "merge_aliases.json")
    groups = json.load(open(alias_path, encoding="utf-8"))["grup"] if os.path.exists(alias_path) else []
    alias_map = {a: g["id"] for g in groups for a in g["anggota"]}
    seen_raw = {e["id"] for e in all_e}
    for g in groups:
        for a in g["anggota"]:
            if a not in seen_raw: problems.append(f"merge_aliases.json: anggota '{a}' (grup {g['id']}) tidak ditemukan")
    merged, by_key, by_id, by_canon = [], {}, {}, {}
    for e in all_e:
        key = (norm_name(e["nama"]), e["kategori"])
        canon = alias_map.get(e["id"])
        hit = by_canon.get(canon) if canon else None
        if hit is None:
            hit = by_id.get(e["id"])
        if hit is None and canon:
            # anggota pertama grup: jadi entri kanonik
            orig = e["id"]; e["id"] = canon
            if orig != canon: e["id_alias"] = [orig]
            merged.append(e); by_key.setdefault(key, e); by_canon[canon] = e
            by_id.setdefault(orig, e); by_id.setdefault(canon, e)
            continue
        if hit is None:
            cand = by_key.get(key)
            # jangan gabungkan dua entri dari laporan yang sama kecuali id-nya sama (misalnya dua cabang hotel)
            if cand is not None and not (set(cand["sumber_riset"]) & set(e["sumber_riset"])):
                hit = cand
        if hit is None:
            for m in merged:
                d = dist_m(m, e)
                if (d is not None and d < 60 and m["kategori"] == e["kategori"] and m["subkategori"] == e["subkategori"]
                        and not (set(m["sumber_riset"]) & set(e["sumber_riset"]))
                        and (norm_name(m["nama"]) in norm_name(e["nama"]) or norm_name(e["nama"]) in norm_name(m["nama"]))):
                    hit = m; break
        if hit is not None: merge(hit, e, conflicts)
        else:
            merged.append(e); by_key.setdefault(key, e); hit = e
        by_id.setdefault(e["id"], hit)
        if canon: by_canon.setdefault(canon, hit)
    # nama & catatan kanonik dari grup alias
    for g in groups:
        m = by_canon.get(g["id"])
        if not m: continue
        if g.get("nama") and m["nama"] != g["nama"]:
            m["nama_alternatif"] = sorted(set(m["nama_alternatif"] + [m["nama"]]) - {g["nama"]})
            m["nama"] = g["nama"]
        if g.get("catatan") and g["catatan"] not in (m.get("catatan") or ""):
            m["catatan"] = ((m.get("catatan") or "") + " | " + g["catatan"]).strip(" |")
        # id dari modul lain yang menunjuk tempat ini tetapi bukan entri di data/places/*.json
        if g.get("id_alias"):
            m["id_alias"] = sorted(set(m.get("id_alias", []) + g["id_alias"]))
    for m in merged:
        m["nama_alternatif"] = sorted(set(m["nama_alternatif"]) - {m["nama"]})
        m.setdefault("id_alias", [])
    # koordinat yang sudah diisi pemilik proyek (tools/import_koordinat.py) selalu menang
    user_path = os.path.join(ROOT, "data", "koordinat_user.json")
    if os.path.exists(user_path):
        look = {}
        for m in merged:
            look[m["id"]] = m
            for a in m.get("id_alias", []): look.setdefault(a, m)
        for pid, k in json.load(open(user_path, encoding="utf-8")).items():
            m = look.get(pid)
            if not m: problems.append(f"koordinat_user.json: id '{pid}' tidak ditemukan"); continue
            m.update(lat=k["lat"], lng=k["lng"], status_koordinat="terverifikasi",
                     catatan_koordinat=f"diisi/dicek pemilik proyek {k.get('tanggal', '')}".strip())
    ids = Counter(m["id"] for m in merged)
    for m in merged:
        if ids[m["id"]] > 1:
            old = m["id"]; m["id"] = f"{m['id']}-{m['sumber_riset'][0][:2]}"
            problems.append(f"id ganda '{old}' → '{m['id']}'")
    merged.sort(key=lambda m: (m["kategori"], m["subkategori"] or "", m["nama"]))
    out = os.path.join(ROOT, "data")
    json.dump(merged, open(os.path.join(out, "places.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(conflicts, open(os.path.join(out, "places_konflik.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # indeks: id apa pun (kanonik atau id asli dari laporan/file domain) → id kanonik di places.json
    index = {}
    for m in merged:
        index[m["id"]] = m["id"]
        for a in m.get("id_alias", []): index.setdefault(a, m["id"])
    json.dump(dict(sorted(index.items())), open(os.path.join(out, "places_id_index.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # daftar untuk diisi pemilik proyek: urut prioritas, dengan tautan pencarian Google Maps
    PRIO = {"keamanan_darurat": 1, "kesehatan": 1, "transportasi": 1, "pemerintahan": 1, "layanan_publik": 1,
            "pertanahan_hukum": 2, "perpustakaan": 2, "pendidikan": 2, "ibadah": 2, "pemakaman": 2, "belanja": 2,
            "ruang_publik": 3, "wisata": 3, "landmark": 3, "kampung_tua": 3, "budaya": 3, "khas_batam": 3, "kuliner": 3, "olahraga": 3,
            "jasa": 4, "lainnya": 4, "akomodasi": 5}
    rows = [m for m in merged if m["status_koordinat"] != "terverifikasi" and not m["atribut"].get("lokasi_luar_batam")]
    rows.sort(key=lambda m: (PRIO.get(m["kategori"], 4), m["kategori"], m["kecamatan"] or "~", m["nama"]))
    with open(os.path.join(out, "koordinat_perlu_diisi.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["prioritas", "id", "nama", "kategori", "subkategori", "kecamatan", "kelurahan", "alamat",
                    "lat", "lng", "status_koordinat", "catatan_koordinat", "cari_di_google_maps", "sumber_url"])
        for m in rows:
            q = quote_plus(f"{m['nama']} {m['alamat'] or ''} Batam".replace("  ", " "))
            w.writerow([PRIO.get(m["kategori"], 4), m["id"], m["nama"], m["kategori"], m["subkategori"], m["kecamatan"] or "",
                        m["kelurahan"] or "", m["alamat"] or "", m["lat"] if m["lat"] is not None else "",
                        m["lng"] if m["lng"] is not None else "", m["status_koordinat"], m.get("catatan_koordinat") or "",
                        f"https://www.google.com/maps/search/?api=1&query={q}", " ".join(m["sumber_url"][:2])])
    stats = {
        "total_tempat": len(merged), "total_entri_sebelum_gabung": len(all_e),
        "per_kategori": dict(Counter(m["kategori"] for m in merged).most_common()),
        "per_status_koordinat": dict(Counter(m["status_koordinat"] for m in merged)),
        "per_kecamatan": dict(Counter(m["kecamatan"] or "(belum diketahui)" for m in merged).most_common()),
        "per_laporan": dict(Counter(s for m in merged for s in m["sumber_riset"])),
        "jumlah_konflik": len(conflicts), "masalah_validasi": problems,
    }
    json.dump(stats, open(os.path.join(out, "places_stats.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({k: v for k, v in stats.items() if k != "masalah_validasi"}, ensure_ascii=False, indent=1))
    print("masalah_validasi:", len(problems))

if __name__ == "__main__":
    main()
