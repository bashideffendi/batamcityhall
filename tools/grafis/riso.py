"""Grafis gaya cetak Riso (tinta overprint multiply, butiran, salah-register) untuk mockup Batam City Hall.
Keluaran: peta hari ini (hero), 7 ilustrasi loket, 1 ilustrasi cerita, peta jelajah (SVG bersih), posisi penanda."""
import io, json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from shapely.geometry import shape, box, Polygon, Point
from shapely.ops import unary_union

OUT = sys.argv[1]
GEO = sys.argv[2]
os.makedirs(OUT, exist_ok=True)

INK = {"blue": (0, 120, 191), "red": (241, 80, 96), "yellow": (255, 181, 17), "black": (34, 34, 38)}
PAPER = (255, 255, 255)

DEFS = """
<pattern id="dot1" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="1.15"/></pattern>
<pattern id="dot2" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="0.8"/></pattern>
<pattern id="dot3" patternUnits="userSpaceOnUse" width="4" height="4"><circle cx="2" cy="2" r="0.5"/></pattern>
<pattern id="dotbig" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(30)"><circle cx="3" cy="3" r="1.6"/></pattern>
<pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect x="0" y="0" width="1.7" height="5"/></pattern>
<pattern id="hatchfine" patternUnits="userSpaceOnUse" width="3.4" height="3.4" patternTransform="rotate(-35)"><rect x="0" y="0" width="0.9" height="3.4"/></pattern>
"""


def mask(inner, W, H, s):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*s}" height="{H*s}" viewBox="0 0 {W} {H}">'
           f'<defs>{DEFS}</defs>{inner}</svg>')
    p = subprocess.run(["rsvg-convert", "-f", "png"], input=svg.encode(), capture_output=True)
    if p.returncode:
        raise SystemExit(p.stderr.decode() + svg[:500])
    im = Image.open(io.BytesIO(p.stdout)).convert("RGBA")
    return np.asarray(im)[:, :, 3].astype(np.float32) / 255


def noise(h, w, seed, blur):
    rng = np.random.default_rng(seed)
    n = (rng.random((h, w)) * 255).astype(np.uint8)
    n = np.asarray(Image.fromarray(n).filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255
    n = (n - n.mean()) / (n.std() + 1e-6)
    return n


def riso(name, W, H, layers, s=2, grain=0.16, fmt="webp"):
    """layers: [(ink, svg_inner, (dx, dy) salah-register dalam satuan viewBox)]"""
    h, w = H * s, W * s
    out = np.ones((h, w, 3), np.float32) * (np.array(PAPER) / 255)
    for i, (ink, inner, off) in enumerate(layers):
        a = mask(inner, W, H, s)
        dx, dy = int(round(off[0] * s)), int(round(off[1] * s))
        a = np.roll(np.roll(a, dy, axis=0), dx, axis=1)
        fine = noise(h, w, 11 + i, 0.6)
        coarse = noise(h, w, 101 + i, 26 * s / 2)
        a = a * np.clip(1 - grain * np.abs(fine) * 0.9 - 0.07 * coarse, 0, 1)
        c = np.array(INK[ink]) / 255
        out *= 1 - a[..., None] * (1 - c)
    img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))
    path = f"{OUT}/{name}.{fmt}"
    if fmt == "webp":
        img.save(path, "WEBP", quality=88, method=6)
    else:
        img.save(path)
    print(name, img.size, os.path.getsize(path) // 1024, "KB")


# ---------------------------------------------------------------- geometri
D = json.load(open(GEO))


def polys(g):
    if isinstance(g, Polygon):
        return [g]
    o = []
    for q in getattr(g, "geoms", []):
        o += polys(q)
    return o


class Proj:
    def __init__(self, bbox, W, H):
        self.lon0, self.lat0, self.lon1, self.lat1 = bbox
        self.W, self.H = W, H

    def x(self, lon):
        return (lon - self.lon0) / (self.lon1 - self.lon0) * self.W

    def y(self, lat):
        return (self.lat1 - lat) / (self.lat1 - self.lat0) * self.H

    def pct(self, lon, lat):
        return round(self.x(lon) / self.W * 100, 2), round(self.y(lat) / self.H * 100, 2)

    def path(self, geom, min_area=0):
        out = []
        for p in polys(geom):
            if p.is_empty or p.area < min_area:
                continue
            for ring in [p.exterior] + list(p.interiors):
                cs = list(ring.coords)
                if len(cs) < 3:
                    continue
                out.append("M" + " L".join(f"{self.x(c[0]):.1f},{self.y(c[1]):.1f}" for c in cs) + "Z")
        return " ".join(out)


def load(bbox, tol):
    lon0, lat0, lon1, lat1 = bbox
    clip = box(lon0 - 0.03, lat0 - 0.03, lon1 + 0.03, lat1 + 0.03)
    batam, other, kec = [], [], {}
    for f in D["features"]:
        g = shape(f["geometry"]).buffer(0)
        if not g.intersects(clip):
            continue
        g = g.intersection(clip).simplify(tol, preserve_topology=True)
        if f["properties"]["kab"] == "Batam":
            batam.append(g)
            kec[f["properties"]["name"]] = g
        else:
            other.append(g)
    return unary_union(batam), unary_union(other) if other else None, kec, clip


# ---------------------------------------------------------------- 1. peta hari ini (pajangan)
def peta_hari_ini(name, W, H, bbox, s=2, hujan=("Bulang", "Belakang Padang")):
    P = Proj(bbox, W, H)
    land, other, kec, clip = load(bbox, 0.0006)
    allland = unary_union([land] + ([other] if other else []))
    frame = f"M-20,-20 H{W+20} V{H+20} H-20 Z"
    sea = f'<path fill-rule="evenodd" d="{frame} {P.path(allland)}"/>'
    bands = []
    prev = allland
    for d, pat in ((0.0035, "dot1"), (0.0085, "dot2"), (0.016, "dot3")):
        b = allland.buffer(d, resolution=6)
        ring = b.difference(prev).intersection(clip)
        bands.append(f'<path fill="url(#{pat})" d="{P.path(ring)}"/>')
        prev = b
    blue = (f'<g fill="#000">{sea.replace("<path", "<path fill-opacity=\".13\"")}{"".join(bands)}</g>')
    rain = "".join(f'<path fill="url(#hatch)" d="{P.path(kec[k])}"/>' for k in hujan if k in kec)
    yellow = f'<path fill="#000" fill-opacity=".34" d="{P.path(land)}"/>'
    if other:
        yellow += f'<path fill="#000" fill-opacity=".16" d="{P.path(other)}"/>'
    # rute feri (skematis) ke Singapura, keluar dari tepi atas
    routes = [((104.0552, 1.1309), (104.03, 1.31)), ((103.9971, 1.1539), (103.90, 1.31)),
              ((103.9253, 1.1314), (103.80, 1.30)), ((104.0949, 1.18838), (104.05, 1.33))]
    red = ""
    for (a, b) in routes:
        x0, y0, x1, y1 = P.x(a[0]), P.y(a[1]), P.x(b[0]), P.y(b[1])
        cx, cy = (x0 + x1) / 2 + (y0 - y1) * 0.12, (y0 + y1) / 2
        red += (f'<path d="M{x0:.1f},{y0:.1f} Q{cx:.1f},{cy:.1f} {x1:.1f},{y1:.1f}" fill="none" stroke="#000" '
                f'stroke-width="2.2" stroke-dasharray="7 5" stroke-linecap="round"/>')
        red += f'<circle cx="{x0:.1f}" cy="{y0:.1f}" r="5.5" fill="#000"/>'
    bx, by = P.x(104.11861), P.y(1.12083)
    red += f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="4.5" fill="#000"/>'
    black = (f'<path fill="none" stroke="#000" stroke-width="0.9" stroke-opacity=".85" stroke-linejoin="round" d="{P.path(land)}"/>')
    if other:
        black += f'<path fill="none" stroke="#000" stroke-width="0.6" stroke-opacity=".5" d="{P.path(other)}"/>'
    for k, g in kec.items():
        black += f'<path fill="none" stroke="#000" stroke-width="0.6" stroke-opacity=".45" stroke-dasharray="1.5 2.5" d="{P.path(g)}"/>'
    riso(name, W, H, [("yellow", yellow, (0, 0)), ("blue", blue, (1.2, -0.8)), ("blue", rain, (1.2, -0.8)),
                      ("red", red, (-0.8, 1.0)), ("black", black, (0.6, 0.6))], s=s, grain=0.14)
    return P


# ---------------------------------------------------------------- 2. ilustrasi spot (240 x 240)
def wave(y, amp, per, W, x0=-10, x1=None, close_to=None):
    x1 = x1 if x1 is not None else W + 10
    pts = []
    x = x0
    while x <= x1:
        pts.append(f"{x:.1f},{y + amp * math.sin((x - x0) / per * 2 * math.pi):.1f}")
        x += 4
    d = "M" + " L".join(pts)
    if close_to is not None:
        d += f" L{x1},{close_to} L{x0},{close_to} Z"
    return d


def circ(cx, cy, r, extra=""):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" {extra}/>'


SPOTS = {}

# 01 Cuaca dan Laut
SPOTS["loket-cuaca"] = [
    ("yellow", circ(162, 78, 46, 'fill="#000"'), (0, 0)),
    ("blue", '<g fill="#000" fill-opacity=".92">' + circ(92, 104, 28) + circ(126, 88, 38) + circ(162, 106, 28)
     + '<rect x="66" y="104" width="122" height="30" rx="15"/></g>'
     + '<g stroke="#000" stroke-width="5" stroke-linecap="round">'
     + "".join(f'<line x1="{x}" y1="148" x2="{x-8}" y2="170"/>' for x in (88, 110, 132, 154, 176)) + "</g>", (1.5, -1)),
    ("blue", f'<path fill="url(#dotbig)" d="{wave(186, 4, 60, 240, close_to=250)}"/>'
     f'<path fill="#000" fill-opacity=".85" d="{wave(204, 5, 70, 240, close_to=250)}"/>', (1.5, -1)),
    ("red", '<path fill="#000" d="M118,190 L172,190 L163,203 L127,203 Z"/><rect x="141" y="172" width="3.5" height="18" fill="#000"/>'
     '<path fill="#000" d="M144.5,172 L160,184 L144.5,184 Z"/>', (-1, 1.5)),
]

# 02 Makan (mangkuk dilihat dari atas)
SPOTS["loket-makan"] = [
    ("blue", circ(120, 128, 90, 'fill="url(#dotbig)"'), (1, -1)),
    ("red", circ(116, 132, 66, 'fill="#000"'), (-1, 1)),
    ("yellow", circ(116, 132, 50, 'fill="#000"'), (0, 0)),
    ("red", "".join(circ(x, y, r, 'fill="#000"') for x, y, r in ((98, 120, 9), (128, 146, 9), (122, 108, 7), (100, 150, 6))), (-1, 1)),
    ("black", '<g fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-opacity=".85">'
     '<path d="M86,128 q8,-8 16,0 t16,0 t16,0"/><path d="M90,138 q8,-8 16,0 t16,0 t16,0"/><path d="M96,118 q8,-8 16,0 t16,0"/></g>'
     '<g stroke="#000" stroke-width="5.5" stroke-linecap="round"><line x1="126" y1="40" x2="220" y2="150"/><line x1="142" y1="30" x2="230" y2="136"/></g>', (0.6, 0.6)),
]

# 03 Tukang Langganan (kotak perkakas + kunci ring)
SPOTS["loket-tukang"] = [
    ("yellow", circ(120, 122, 84, 'fill="#000"'), (0, 0)),
    ("blue", '<rect x="56" y="112" width="128" height="74" rx="8" fill="#000"/>'
     '<path d="M96,112 V96 a8,8 0 0 1 8,-8 h32 a8,8 0 0 1 8,8 V112" fill="none" stroke="#000" stroke-width="9"/>', (1.5, -1)),
    ("red", '<line x1="70" y1="200" x2="160" y2="96" stroke="#000" stroke-width="15" stroke-linecap="round"/>'
     '<path fill-rule="evenodd" fill="#000" d="M172,62 a24,24 0 1,0 0.01,0 Z M172,75 a11,11 0 1,1 -0.01,0 Z"/>', (-1, 1.5)),
    ("black", '<g fill="#000">' + circ(78, 132, 4) + circ(162, 132, 4) + '</g><line x1="56" y1="140" x2="184" y2="140" stroke="#000" stroke-width="2.5" stroke-opacity=".8"/>', (0.6, 0.6)),
]

# 04 Transportasi (feri)
SPOTS["loket-transportasi"] = [
    ("yellow", circ(62, 70, 34, 'fill="#000"'), (0, 0)),
    ("blue", f'<path fill="url(#dotbig)" d="{wave(156, 3, 50, 240, close_to=250)}"/>'
     f'<path fill="#000" fill-opacity=".9" d="{wave(178, 4, 64, 240, close_to=250)}"/>', (1.5, -1)),
    ("red", '<path fill="#000" d="M34,150 L210,150 L192,182 L54,182 Z"/><rect x="70" y="116" width="110" height="34" rx="6" fill="#000"/>'
     '<rect x="96" y="96" width="56" height="20" rx="4" fill="#000"/>', (-1, 1.5)),
    ("black", '<g fill="#000">' + "".join(f'<rect x="{x}" y="126" width="11" height="10" rx="2"/>' for x in range(80, 172, 17))
     + '</g><line x1="124" y1="96" x2="124" y2="72" stroke="#000" stroke-width="3"/>'
     '<path d="M124,72 L142,79 L124,86 Z" fill="#000"/>'
     '<g stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-opacity=".8"><line x1="14" y1="196" x2="44" y2="196"/><line x1="24" y1="206" x2="60" y2="206"/></g>', (0.6, 0.6)),
]

# 05 Cerita dan Budaya (rumah panggung dengan selembayung)
SPOTS["loket-cerita"] = [
    ("yellow", circ(170, 70, 40, 'fill="#000"'), (0, 0)),
    ("red", '<path fill="#000" d="M34,112 L120,54 L206,112 Z"/>', (-1, 1.5)),
    ("blue", '<rect x="56" y="112" width="128" height="50" fill="#000" fill-opacity=".88"/>'
     f'<path fill="url(#dotbig)" d="{wave(196, 3, 50, 240, close_to=250)}"/>'
     f'<path fill="#000" fill-opacity=".85" d="{wave(214, 3, 64, 240, close_to=250)}"/>', (1.5, -1)),
    ("black", '<g stroke="#000" stroke-linecap="round"><line x1="104" y1="38" x2="128" y2="62" stroke-width="5"/>'
     '<line x1="136" y1="38" x2="112" y2="62" stroke-width="5"/>'
     + "".join(f'<line x1="{x}" y1="162" x2="{x}" y2="214" stroke-width="5"/>' for x in (64, 98, 142, 176))
     + '<line x1="28" y1="112" x2="212" y2="112" stroke-width="3"/></g>'
     '<rect x="108" y="122" width="24" height="40" fill="#000"/><rect x="72" y="124" width="20" height="16" fill="#000"/>'
     '<rect x="148" y="124" width="20" height="16" fill="#000"/>', (0.6, 0.6)),
]

# 06 Informasi Warga (peta lipat + penanda)
SPOTS["loket-informasi"] = [
    ("yellow", '<path fill="#000" d="M34,92 L94,70 L146,92 L206,70 L206,186 L146,208 L94,186 L34,208 Z"/>', (0, 0)),
    ("blue", '<path fill="#000" fill-opacity=".22" d="M94,70 L146,92 L146,208 L94,186 Z"/>'
     '<g fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"><path d="M40,150 C70,140 80,170 110,160 S160,120 200,130"/>'
     '<path d="M60,100 C70,120 64,170 80,196"/></g>', (1.5, -1)),
    ("black", '<path d="M62,190 C90,176 104,150 124,132" fill="none" stroke="#000" stroke-width="3" stroke-dasharray="5 6" stroke-linecap="round"/>', (0.6, 0.6)),
    ("red", '<path fill-rule="evenodd" fill="#000" d="M128,150 C108,122 96,106 96,92 a32,32 0 1,1 64,0 c0,14 -12,30 -32,58 Z M128,80 a12,12 0 1,0 0.01,0 Z"/>', (-1, 1.5)),
]

# 07 Ruang Main (kartu pos + perangko + cap pos)
SPOTS["loket-main"] = [
    ("yellow", '<g transform="rotate(-6 120 130)"><rect x="28" y="66" width="184" height="128" rx="4" fill="#000"/></g>', (0, 0)),
    ("blue", '<g transform="rotate(-6 120 130)"><rect x="150" y="78" width="46" height="56" fill="#000"/></g>', (1.5, -1)),
    ("black", '<g transform="rotate(-6 120 130)"><rect x="155" y="83" width="36" height="46" fill="none" stroke="#000" stroke-width="1.6" stroke-dasharray="3 3"/>'
     '<g stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-opacity=".85"><line x1="44" y1="150" x2="126" y2="150"/><line x1="44" y1="166" x2="126" y2="166"/>'
     '<line x1="44" y1="182" x2="104" y2="182"/><line x1="138" y1="146" x2="138" y2="186"/>'
     '<line x1="148" y1="160" x2="200" y2="160"/><line x1="148" y1="174" x2="200" y2="174"/></g>'
     f'<path d="{wave(112, 4, 16, 0, x0=158, x1=188)}" fill="none" stroke="#000" stroke-width="2"/></g>', (0.6, 0.6)),
    ("red", '<g fill="none" stroke="#000" stroke-width="3">' + circ(142, 100, 24) + circ(142, 100, 15)
     + f'<path d="{wave(92, 4, 22, 0, x0=60, x1=120)}"/><path d="{wave(104, 4, 22, 0, x0=60, x1=120)}"/><path d="{wave(116, 4, 22, 0, x0=60, x1=120)}"/></g>', (-1, 1.5)),
]

# ---------------------------------------------------------------- 3. ilustrasi cerita (480 x 340)
def cerita():
    W, H = 480, 340
    layers = [
        ("yellow", '<path fill="#000" d="M168,198 A62,62 0 0 1 292,198 Z"/>' + '<rect x="0" y="0" width="480" height="196" fill="url(#dot3)"/>', (0, 0)),
        ("blue", '<path fill="#000" fill-opacity=".55" d="M0,196 L0,184 C40,176 70,178 100,182 C130,186 150,178 190,180 L220,196 Z"/>'
         f'<path fill="url(#dot1)" d="{wave(200, 2, 70, W, close_to=360)}"/>'
         f'<path fill="#000" fill-opacity=".82" d="{wave(236, 3, 90, W, close_to=360)}"/>'
         f'<path fill="#000" d="{wave(290, 4, 110, W, close_to=360)}"/>'
         '<rect x="292" y="148" width="150" height="54" fill="#000" fill-opacity=".9"/>', (1.5, -1)),
        ("red", '<path fill="#000" d="M270,150 L367,86 L464,150 Z"/>'
         '<path fill="#000" d="M52,226 L170,226 L156,246 L68,246 Z"/>'
         '<path fill="#000" d="M94,226 L94,204 L134,204 L140,226 Z" fill-opacity=".9"/>', (-1, 1.5)),
        ("black", '<g stroke="#000" stroke-linecap="round"><line x1="350" y1="70" x2="376" y2="96" stroke-width="5"/>'
         '<line x1="384" y1="70" x2="358" y2="96" stroke-width="5"/>'
         + "".join(f'<line x1="{x}" y1="202" x2="{x}" y2="262" stroke-width="5"/>' for x in (302, 340, 394, 432))
         + '<line x1="262" y1="150" x2="472" y2="150" stroke-width="3"/>'
         '<line x1="52" y1="226" x2="170" y2="226" stroke-width="3"/>'
         '<line x1="114" y1="204" x2="114" y2="178" stroke-width="2.5"/></g>'
         '<rect x="356" y="160" width="26" height="42" fill="#000"/><rect x="312" y="162" width="22" height="16" fill="#000"/>'
         '<rect x="404" y="162" width="22" height="16" fill="#000"/>'
         '<g stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".75"><line x1="30" y1="292" x2="70" y2="292"/>'
         '<line x1="40" y1="304" x2="96" y2="304"/><line x1="190" y1="300" x2="222" y2="300"/></g>', (0.6, 0.6)),
    ]
    riso("cerita-nongsa", W, H, layers, s=2, grain=0.15)


if __name__ == "__main__":
    which = sys.argv[3] if len(sys.argv) > 3 else "all"
    meta = {}
    if which in ("all", "hero"):
        P = peta_hari_ini("peta-hari-ini", 760, 780, (103.80, 0.7703, 104.26, 1.2424))
        P2 = peta_hari_ini("peta-hari-ini-ponsel", 358, 400, (103.84, 0.895, 104.16, 1.2525))
    if which in ("all", "dasar"):
        peta_hari_ini("peta-hari-ini-dasar", 760, 780, (103.80, 0.7703, 104.26, 1.2424), hujan=())
        peta_hari_ini("peta-hari-ini-ponsel-dasar", 358, 400, (103.84, 0.895, 104.16, 1.2525), hujan=())
    if which in ("all", "spots"):
        for k, v in SPOTS.items():
            riso(k, 240, 240, v, s=2, grain=0.15)
    if which in ("all", "cerita"):
        cerita()
