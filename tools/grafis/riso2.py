"""Grafis tambahan: ilustrasi submenu cuaca, ilustrasi kepiting, peta radar (contoh), peta detail."""
import sys, json, math
OUT, GEO = sys.argv[1], sys.argv[2]
sys.argv = [sys.argv[0], OUT, GEO]
import numpy as np
from PIL import Image, ImageFilter
import riso as R
from shapely.geometry import box
from shapely.ops import unary_union

wave, circ = R.wave, R.circ

# ---------------------------------------------------------------- submenu cuaca (320 x 200)
SUB = {}
SUB["sub-radar"] = [
    ("yellow", '<path fill="#000" fill-opacity=".55" d="M70,120 C80,84 120,70 150,82 C176,92 200,78 222,96 C246,116 236,150 204,160 C170,170 150,150 122,160 C96,170 62,152 70,120 Z"/>', (0, 0)),
    ("blue", '<rect width="320" height="200" fill="#000" fill-opacity=".12"/>'
     '<path fill="url(#dot1)" d="M150,60 C190,40 250,56 262,92 C272,124 238,140 206,128 C186,120 168,132 146,118 C120,102 118,74 150,60 Z"/>'
     '<path fill="#000" fill-opacity=".8" d="M186,76 C212,66 240,80 238,100 C236,116 214,118 198,110 C182,102 170,84 186,76 Z"/>', (1.5, -1)),
    ("black", '<g fill="none" stroke="#000" stroke-width="1.6" stroke-opacity=".75">' + circ(160, 110, 40) + circ(160, 110, 76) + circ(160, 110, 112)
     + '</g><line x1="160" y1="110" x2="262" y2="58" stroke="#000" stroke-width="2.4"/>' + circ(160, 110, 4, 'fill="#000"'), (0.6, 0.6)),
    ("red", circ(122, 118, 6, 'fill="#000"'), (-1, 1.5)),
]
SUB["sub-gelombang"] = [
    ("yellow", circ(250, 52, 30, 'fill="#000"'), (0, 0)),
    ("blue", f'<path fill="url(#dotbig)" d="{wave(98, 10, 90, 320, close_to=210)}"/>'
     f'<path fill="#000" fill-opacity=".55" d="{wave(126, 12, 110, 320, close_to=210)}"/>'
     f'<path fill="#000" fill-opacity=".9" d="{wave(156, 9, 80, 320, close_to=210)}"/>', (1.5, -1)),
    ("red", '<path fill="#000" d="M104,112 L136,112 L130,132 L110,132 Z"/><rect x="112" y="82" width="16" height="30" rx="3" fill="#000"/>'
     '<path fill="#000" d="M120,58 L124,82 L116,82 Z"/>', (-1, 1.5)),
    ("black", '<g stroke="#000" stroke-width="2" stroke-linecap="round"><line x1="24" y1="40" x2="24" y2="168"/>'
     + "".join(f'<line x1="24" y1="{y}" x2="34" y2="{y}"/>' for y in (60, 92, 124, 156)) + "</g>"
     '<rect x="112" y="92" width="16" height="6" fill="#000"/>', (0.6, 0.6)),
]
SUB["sub-cctv"] = [
    ("yellow", '<path fill="#000" d="M0,150 L320,118 L320,200 L0,200 Z"/>', (0, 0)),
    ("black", '<path d="M0,176 L320,152" stroke="#000" stroke-width="3" stroke-dasharray="16 12"/>'
     '<line x1="92" y1="40" x2="92" y2="160" stroke="#000" stroke-width="5"/><line x1="92" y1="52" x2="132" y2="52" stroke="#000" stroke-width="4"/>'
     + circ(186, 76, 8, 'fill="#000"'), (0.6, 0.6)),
    ("blue", '<g transform="rotate(14 160 70)"><rect x="128" y="52" width="70" height="34" rx="6" fill="#000"/><rect x="196" y="60" width="16" height="18" fill="#000"/></g>'
     '<path fill="#000" fill-opacity=".22" d="M208,84 L320,40 L320,150 L232,104 Z"/>', (1.5, -1)),
    ("red", '<rect x="168" y="150" width="44" height="18" rx="5" fill="#000"/><rect x="250" y="140" width="40" height="16" rx="5" fill="#000"/>'
     + circ(30, 30, 0.1), (-1, 1.5)),
]
for k, v in SUB.items():
    R.riso(k, 320, 200, v, s=2, grain=0.15)

# ---------------------------------------------------------------- kepiting (detail Makan) 480 x 360
legs = ""
for side in (-1, 1):
    for i, a in enumerate((18, 38, 58)):
        x0 = 240 + side * 70
        y0 = 214 + i * 14
        x1 = x0 + side * 60
        y1 = y0 + 26 + i * 6
        legs += f'<path d="M{x0},{y0} L{x1},{y1 - 18} L{x1 + side * 20},{y1 + 14}" fill="none" stroke="#000" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>'
claws = ('<path d="M196,170 C170,140 150,128 132,108" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round"/>'
         '<path d="M284,170 C310,140 330,128 348,108" fill="none" stroke="#000" stroke-width="10" stroke-linecap="round"/>'
         '<path fill="#000" d="M132,108 C104,104 94,80 108,62 C116,74 126,80 140,80 C138,70 140,60 148,54 C158,74 154,98 132,108 Z"/>'
         '<path fill="#000" d="M348,108 C376,104 386,80 372,62 C364,74 354,80 340,80 C342,70 340,60 332,54 C322,74 326,98 348,108 Z"/>')
KEP = [
    ("blue", circ(240, 196, 150, 'fill="url(#dot2)"') + '<ellipse cx="240" cy="300" rx="190" ry="40" fill="#000" fill-opacity=".85"/>', (1.5, -1)),
    ("red", '<ellipse cx="240" cy="204" rx="92" ry="62" fill="#000"/>' + legs + claws, (-1, 1.5)),
    ("yellow", circ(372, 62, 18, 'fill="#000"') + '<path fill="#000" d="M318,292 A30,30 0 0 1 378,292 Z"/>', (0, 0)),
    ("black", '<g fill="#000">' + circ(214, 140, 7) + circ(266, 140, 7) + '</g>'
     '<g stroke="#000" stroke-width="3.5" stroke-linecap="round"><line x1="214" y1="148" x2="220" y2="160"/><line x1="266" y1="148" x2="260" y2="160"/></g>'
     '<g fill="none" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".55"><path d="M176,214 q64,30 128,0"/></g>', (0.6, 0.6)),
]
R.riso("ilustrasi-kepiting", 480, 360, KEP, s=2, grain=0.15)


# ---------------------------------------------------------------- peta radar (contoh) 1000 x 820
def radar(name, W, H, bbox, s=2):
    P = R.Proj(bbox, W, H)
    land, other, kec, clip = R.load(bbox, 0.0006)
    allland = unary_union([land] + ([other] if other else []))
    frame = f"M-20,-20 H{W+20} V{H+20} H-20 Z"
    base = [
        ("blue", f'<path fill-rule="evenodd" fill="#000" fill-opacity=".10" d="{frame} {P.path(allland)}"/>', (0, 0)),
        ("yellow", f'<path fill="#000" fill-opacity=".16" d="{P.path(land)}"/>' + (f'<path fill="#000" fill-opacity=".08" d="{P.path(other)}"/>' if other else ""), (0, 0)),
        ("black", f'<path fill="none" stroke="#000" stroke-width="0.8" stroke-opacity=".55" d="{P.path(land)}"/>'
         + (f'<path fill="none" stroke="#000" stroke-width="0.5" stroke-opacity=".35" d="{P.path(other)}"/>' if other else "")
         + "".join(f'<path fill="none" stroke="#000" stroke-width="0.6" stroke-opacity=".3" stroke-dasharray="1.5 2.5" d="{P.path(g)}"/>' for g in kec.values()), (0, 0)),
    ]
    h, w = H * s, W * s
    out = np.ones((h, w, 3), np.float32)
    for i, (ink, inner, off) in enumerate(base):
        a = R.mask(inner, W, H, s)
        c = np.array(R.INK[ink]) / 255
        out *= 1 - a[..., None] * (1 - c)
    # gema radar: medan derau halus x kernel lokasi
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    field = np.zeros((h, w), np.float32)
    for lon, lat, sx, sy, amp in ((103.885, 0.99, 0.055, 0.045, 1.0), (103.865, 1.14, 0.03, 0.025, 0.75), (103.75, 1.03, 0.05, 0.08, 0.9)):
        cx, cy = P.x(lon) * s, P.y(lat) * s
        rx, ry = sx / (bbox[2] - bbox[0]) * w, sy / (bbox[3] - bbox[1]) * h
        field += amp * np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))
    n = R.noise(h, w, 7, 14 * s)
    n2 = R.noise(h, w, 9, 5 * s)
    f = field * (0.75 + 0.35 * n + 0.12 * n2)
    lv1 = np.clip((f - 0.30) * 12, 0, 1)
    lv2 = np.clip((f - 0.78) * 12, 0, 1)
    lv3 = np.clip((f - 0.92) * 12, 0, 1)
    # halftone untuk ringan
    dots = R.mask('<rect width="%d" height="%d" fill="url(#dot1)"/>' % (W, H), W, H, s)
    for a, ink, k in ((lv1 * (0.35 + 0.65 * dots), "blue", 0.85), (lv2, "blue", 0.75), (lv3, "red", 0.7)):
        c = np.array(R.INK[ink]) / 255
        grain = np.clip(1 - 0.12 * np.abs(R.noise(h, w, 31, 0.6)), 0, 1)
        out *= 1 - (a * k * grain)[..., None] * (1 - c)
    img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))
    img.save(f"{OUT}/{name}.webp", "WEBP", quality=86, method=6)
    print(name, img.size)
    return P


radar("peta-radar", 1000, 820, (103.70, 0.6577, 104.40, 1.2317))


# ---------------------------------------------------------------- peta detail (SVG bersih) 440 x 300
def detail(name, W, H, bbox):
    P = R.Proj(bbox, W, H)
    land, other, kec, clip = R.load(bbox, 0.00008)
    s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
         f'<rect width="{W}" height="{H}" fill="#E4EFF7"/>',
         f'<path d="{P.path(land)}" fill="#FFF5E0" stroke="#7E9AAE" stroke-width="0.9" stroke-linejoin="round"/>']
    for g in kec.values():
        s.append(f'<path d="{P.path(g)}" fill="none" stroke="#D8C9AC" stroke-width="0.9" stroke-dasharray="2 3"/>')
    s.append("</svg>")
    open(f"{OUT}/{name}.svg", "w").write("\n".join(s))
    print(name, P.pct(104.0312, 1.1551), P.pct(103.9971, 1.1539))


detail("peta-detail-golden", 440, 300, (103.990, 1.1315, 104.060, 1.1792))
