"""Peta jelajah (SVG bersih) + penanda tempat dari data nyata (hanya yang punya koordinat), dengan klaster."""
import json, sys, collections
from shapely.geometry import shape, box, Polygon
from shapely.ops import unary_union

GEO, PLACES, MAKAN, OUT = sys.argv[1:5]
D = json.load(open(GEO))

# kategori -> (grup, label)
CATS = [
    # id, grup, label, emoji
    ("seafood", "makan", "Makanan laut dan gonggong", "🦀"),
    ("kopi", "makan", "Kopitiam dan kafe", "☕"),
    ("mi", "makan", "Mi, bakso, dan sup", "🍜"),
    ("dimsum", "makan", "Dim sum dan bubur", "🥟"),
    ("nasi", "makan", "Nasi dan lauk", "🍛"),
    ("oleh", "makan", "Oleh-oleh", "🎁"),
    ("hotel", "menginap", "Hotel", "🏨"),
    ("masjid", "ibadah", "Masjid", "🕌"),
    ("gereja", "ibadah", "Gereja", "⛪"),
    ("wihara", "ibadah", "Wihara dan kelenteng", "🏮"),
    ("pura", "ibadah", "Pura", "🛕"),
    ("rs", "kesehatan", "Rumah sakit", "🏥"),
    ("feri", "transportasi", "Pelabuhan feri", "⛴️"),
    ("bandara", "transportasi", "Bandara", "✈️"),
    ("halte", "transportasi", "Halte Trans Batam", "🚏"),
    ("mal", "belanja", "Mal dan pusat belanja", "🏬"),
    ("bekas", "belanja", "Pasar barang bekas", "🏷️"),
    ("kampung", "cerita", "Kampung tua", "🛖"),
    ("jembatan", "cerita", "Jembatan Barelang", "🌉"),
    ("sejarah", "cerita", "Museum dan situs sejarah", "🏛️"),
    ("pantai", "alam", "Pantai", "🏖️"),
    ("taman", "alam", "Taman dan alun-alun", "🌳"),
    ("olahraga", "alam", "Olahraga", "🏸"),
]
CAT = {c[0]: c for c in CATS}

MAKAN_MAP = {"seafood-gonggong": "seafood", "sup-ikan": "mi", "kopitiam": "kopi", "cafe": "kopi", "mie-bakmi": "mi",
             "bakso": "mi", "mie-tarempa": "mi", "dimsum-chinese": "dimsum", "bubur": "dimsum", "oleh-oleh": "oleh"}
SUB_MAP = {"masjid": "masjid", "gereja_katolik": "gereja", "vihara": "wihara", "pura": "pura", "rumah_sakit": "rs",
           "terminal_feri": "feri", "pelabuhan_domestik": "feri", "pelabuhan_internasional": "feri", "bandara": "bandara",
           "halte_bus": "halte", "halte_transfer_bus": "halte", "mal": "mal", "hypermarket": "mal", "pasar_barang_seken": "bekas",
           "jembatan": "jembatan", "museum": "sejarah", "monumen": "sejarah", "monumen_memorial": "sejarah",
           "situs_sejarah_memorial": "sejarah", "makam_memorial": "sejarah", "landmark_viewpoint": "taman",
           "pantai": "pantai", "taman": "taman", "alun_alun": "taman", "badminton": "olahraga", "stadion_gor": "olahraga",
           "kedai_kopi": "kopi", "kuliner_seafood": "seafood"}

items = []
for x in json.load(open(MAKAN)):
    c = MAKAN_MAP.get(x["category"], "nasi")
    items.append(dict(cat=c, nama=x["name"], lat=x["lat"], lng=x["lng"], perkiraan=bool(x.get("coord_approx"))))
hotel_total = 0
for x in json.load(open(PLACES)):
    if x["kategori"] == "akomodasi":
        hotel_total += 1
    if not x.get("lat"):
        continue
    c = "kampung" if x["kategori"] == "kampung_tua" else SUB_MAP.get(x["subkategori"])
    if not c:
        continue
    items.append(dict(cat=c, nama=x["nama"], lat=x["lat"], lng=x["lng"], perkiraan=x["status_koordinat"] != "terverifikasi"))

counts = collections.Counter(i["cat"] for i in items)
counts["hotel"] = hotel_total


def polys(g):
    if isinstance(g, Polygon):
        return [g]
    o = []
    for q in getattr(g, "geoms", []):
        o += polys(q)
    return o


def build(name, bbox, W, H, tol, min_area, thr):
    lon0, lat0, lon1, lat1 = bbox
    X = lambda lon: (lon - lon0) / (lon1 - lon0) * W
    Y = lambda lat: (lat1 - lat) / (lat1 - lat0) * H
    clip = box(lon0 - 0.03, lat0 - 0.03, lon1 + 0.03, lat1 + 0.03)

    def path(geom):
        out = []
        for p in polys(geom):
            if p.is_empty or p.area < min_area:
                continue
            for ring in [p.exterior] + list(p.interiors):
                cs = list(ring.coords)
                if len(cs) >= 3:
                    out.append("M" + " L".join(f"{X(c[0]):.1f},{Y(c[1]):.1f}" for c in cs) + "Z")
        return " ".join(out)

    batam, other, kec = [], [], {}
    for f in D["features"]:
        g = shape(f["geometry"]).buffer(0)
        if not g.intersects(clip):
            continue
        full = g
        g = g.intersection(clip).simplify(tol, preserve_topology=True)
        if f["properties"]["kab"] == "Batam":
            batam.append(g)
            kec[f["properties"]["name"]] = (g, full)
        else:
            other.append(g)
    land = unary_union(batam)
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<rect width="{W}" height="{H}" fill="#E4EFF7"/>']
    if other:
        s.append(f'<path d="{path(unary_union(other))}" fill="#FBF7EF" stroke="#9DB3C3" stroke-width="0.6"/>')
    s.append(f'<path d="{path(land)}" fill="#FFF5E0" stroke="#7E9AAE" stroke-width="0.9" stroke-linejoin="round"/>')
    for k, (g, _) in kec.items():
        s.append(f'<path d="{path(g)}" fill="none" stroke="#D8C9AC" stroke-width="0.9" stroke-dasharray="2 3"/>')
    s.append("</svg>")
    open(f"{OUT}/{name}.svg", "w").write("\n".join(s))

    # label kecamatan (titik representatif dalam bingkai, pakai poligon terbesar)
    labels = []
    for k, (g, full) in kec.items():
        big = max(polys(g), key=lambda p: p.area) if polys(g) else None
        if big is None or big.area < 0.0002:
            continue
        pt = big.representative_point()
        px, py = X(pt.x) / W * 100, Y(pt.y) / H * 100
        if 4 < px < 96 and 4 < py < 96:
            labels.append(dict(nama=k, x=round(px, 2), y=round(py, 2)))

    # penanda + klaster (rakus, prioritas: bukan makan dulu agar ikon beragam tetap tampil)
    order = sorted(items, key=lambda i: (CAT[i["cat"]][1] == "makan", i["perkiraan"]))
    placed = []
    for it in order:
        px, py = X(it["lng"]), Y(it["lat"])
        if not (8 < px < W - 8 and 8 < py < H - 8):
            continue
        hit = None
        for p in placed:
            if (p["px"] - px) ** 2 + (p["py"] - py) ** 2 < thr ** 2:
                hit = p
                break
        if hit:
            hit["n"] += 1
            hit["cats"].add(it["cat"])
        else:
            placed.append(dict(px=px, py=py, x=round(px / W * 100, 2), y=round(py / H * 100, 2), cat=it["cat"],
                               nama=it["nama"], perkiraan=it["perkiraan"], n=1, cats={it["cat"]}))
    for p in placed:
        p["cats"] = sorted(p["cats"])
        del p["px"], p["py"]
    json.dump(dict(labels=labels, markers=placed), open(f"{OUT}/{name}.json", "w"), ensure_ascii=False, indent=0)
    print(name, len(placed), "penanda,", sum(1 for p in placed if p["n"] > 1), "klaster;", [l["nama"] for l in labels])


build("peta-jelajah", (103.855, 1.005, 104.205, 1.215), 1200, 720, 0.0004, 1e-6, 22)
build("peta-jelajah-ponsel", (103.92, 0.97, 104.12, 1.2158), 358, 440, 0.0005, 1e-6, 20)
json.dump(dict(cats=CATS, counts=counts, total=len(items)), open(f"{OUT}/kategori.json", "w"), ensure_ascii=False, indent=0)
print(dict(counts), len(items))
