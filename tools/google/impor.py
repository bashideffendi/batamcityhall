"""Impor Direktori dari Excel data Google Maps milik pemilik ke data/tempat-google.json.

Keputusan pemilik 11 Nov 2026: Direktori memakai semua data Google Maps yang dikumpulkan pemilik
(Direktori_Batam.xlsx), termasuk nomor telepon yang dipasang pemilik usaha dan tautan Google Maps untuk tombol arah.
Baris yang bersumber dari data pajak tidak dipakai. Tempat di kategori rekomendasi dengan rating minimal 4,5 dan
minimal 100 ulasan ditandai Rekomendasi.

Pakai:
    python -I tools/google/impor.py "C:/Users/user/Desktop/Direktori_Batam_diperbaiki.xlsx"
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[2]

# Fungsi wilayah, jarak, dan kemiripan nama dipakai bersama dengan alat impor lama.
_spec = importlib.util.spec_from_file_location("alat_tempat", ROOT / "tools/overture/impor.py")
alat = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(alat)

RATING_MIN = 4.5
ULASAN_MIN = 100

# Kategori di Excel -> kategori data situs. Yang ditandai True disaring sebagai rekomendasi.
KATEGORI: dict[str, tuple[str, bool]] = {
    "Kuliner": ("kuliner", True),
    "Hotel dan Penginapan": ("akomodasi", True),
    "Wisata": ("wisata", True),
    "Belanja": ("belanja", True),
    "Jasa": ("jasa", True),
    "Olahraga": ("olahraga", True),
    "Khas Batam": ("khas_batam", True),
    "Kesehatan": ("kesehatan", False),
    "Pendidikan": ("pendidikan", False),
    "Tempat Ibadah": ("ibadah", False),
    "Transportasi": ("transportasi", False),
    "Perpustakaan": ("perpustakaan", False),
    "Ruang Publik": ("ruang_publik", False),
    "Budaya": ("budaya", False),
    "Kantor dan Layanan Publik": ("layanan_publik", False),
    "Darurat dan Keamanan": ("keamanan_darurat", False),
    "Penanda Kota": ("landmark", False),
    "Pemakaman": ("pemakaman", False),
    "Pertanahan dan Hukum": ("pertanahan_hukum", False),
    "Lain-Lain": ("lainnya", False),
    # Kampung tua memakai daftar resmi di data kurasi. Isi Google untuk kategori ini kebanyakan kompleks perumahan,
    # jadi masuk Lainnya supaya tidak tertulis sebagai kampung tua.
    "Kampung Tua": ("lainnya", False),
}

# Jenis Google -> jenis situs, supaya saringan menyatu dengan data yang sudah ada. Urutan penting: yang pertama cocok
# yang dipakai. Jenis yang tidak cocok dengan pola mana pun memakai namanya sendiri ("Toko Pakaian" -> toko_pakaian).
JENIS: list[tuple[str, str]] = [
    # Kuliner, mengikuti kategori Makanan
    (r"seafood|ikan bakar", "seafood"),
    (r"padang", "makanan-padang"),
    (r"sunda", "makanan-sunda"),
    (r"jawa", "makanan-jawa"),
    (r"sulawesi|makassar|manado", "makanan-sulawesi"),
    (r"batak", "lapo-batak"),
    (r"pempek", "pempek"),
    (r"penyet", "penyetan"),
    (r"soto", "soto"),
    (r"\bsate\b", "sate"),
    (r"bakso|mie ayam", "bakso-mie-ayam"),
    (r"dim ?sum", "dimsum"),
    (r"china|chinese|tionghoa|kanton", "chinese-food"),
    (r"bubur", "bubur"),
    (r"jepang|sushi|ramen", "makanan-jepang"),
    (r"korea", "makanan-korea"),
    (r"india", "makanan-india"),
    (r"steak|pizza|barat|western|italia|amerika", "western-steak"),
    (r"es krim|ice cream|gelato", "ice-cream"),
    (r"sarapan", "sarapan-pagi"),
    (r"vegetarian|vegan", "vegetarian"),
    (r"toko roti|toko kue|kue kering|bakery|prasmanan kue", "bakery"),
    (r"kedai kopi|coffee", "coffee-shop"),
    (r"^kafe$|^cafe$", "kafe"),
    (r"cepat saji", "cepat_saji"),
    (r"rumah makan|warung", "rumah_makan"),
    (r"kaki lima", "kedai_kaki_lima"),
    (r"jus|minuman|^teh|boba", "kedai_minuman"),
    (r"^restoran", "restoran"),
    # Penginapan
    (r"^hotel|motel", "hotel"),
    (r"resor|resort", "resor"),
    (r"vila|cottage|guest ?house|hostel|penginapan|wisma|homestay|losmen|bed & breakfast|pondok|rumah wisata", "penginapan"),
    # Kesehatan
    (r"apotek|toko obat", "apotek"),
    (r"gigi", "klinik_gigi"),
    (r"rumah sakit", "rumah_sakit"),
    (r"pusat kesehatan masyarakat|puskesmas", "puskesmas"),
    (r"laboratorium", "laboratorium"),
    (r"optik|kacamata|perawatan mata", "optik"),
    (r"dokter hewan", "dokter_hewan"),
    (r"^klinik", "klinik"),
    # Pendidikan
    (r"penitipan anak", "daycare"),
    (r"taman kanak|kelompok bermain", "tk_paud"),
    (r"sekolah dasar", "sd"),
    (r"sekolah menengah pertama|^smp$", "smp"),
    (r"kejuruan|^smk$", "smk"),
    (r"sekolah menengah atas|sekolah menengah umum|^sma$", "sma"),
    (r"universitas|perguruan tinggi|fakultas", "universitas"),
    (r"kursus|les privat|bimbingan|pusat belajar|pusat pembelajaran|pelatihan", "kursus"),
    # Ibadah
    (r"masjid", "masjid"),
    (r"musala|musholla", "musala"),
    (r"gereja katolik", "gereja_katolik"),
    (r"gereja|church", "gereja"),
    (r"vihara|pagoda|biara", "vihara"),
    (r"kuil penganut agama tao", "kelenteng"),
    # Belanja
    (r"minimarket", "minimarket"),
    (r"toko swalayan|supermarket", "supermarket"),
    (r"^pasar", "pasar"),
    (r"pusat perbelanjaan|^mall?$", "mal"),
    (r"toserba", "toserba"),
    (r"elektronik", "toko_elektronik"),
    (r"perlengkapan olahraga|peralatan olahraga|toko olahraga", "toko_olahraga"),
    (r"bahan bangunan|perabot", "perabot_bangunan"),
    # Jasa
    (r"^atm$", "atm"),
    (r"^bank", "bank"),
    (r"salon|cukur rambut|barbershop", "salon_barbershop"),
    (r"binatu|laundry", "laundry"),
    (r"bengkel", "bengkel"),
    (r"percetakan|cetak", "percetakan"),
    (r"pengiriman|kurir|kargo|logistik", "ekspedisi"),
    (r"penukaran mata uang", "money_changer"),
    (r"penjahit|tukang jahit", "penjahit"),
    # Transportasi
    (r"spbu|pom bensin", "spbu"),
    # Olahraga
    (r"futsal", "futsal"),
    (r"bola basket", "basket"),
    (r"lapangan tenis|olahraga tenis", "tenis"),
    (r"voli", "voli"),
    (r"bulutangkis|bulu tangkis|badminton", "badminton"),
    (r"padel", "padel"),
    (r"golf", "golf"),
    (r"kolam renang", "kolam_renang"),
    (r"fitness|kebugaran|^gym$|yoga", "pusat_kebugaran"),
    # Lain
    (r"perpustakaan", "perpustakaan"),
    (r"kantor pos", "kantor_pos"),
    (r"notaris", "notaris"),
    (r"pemadam kebakaran", "damkar"),
    (r"kantor polisi|polisi", "polisi"),
    (r"^taman$|taman kota", "taman"),
    (r"pantai", "pantai"),
    (r"museum", "museum"),
]
JENIS = [(re.compile(p, re.I), s) for p, s in JENIS]


def angka(x) -> float | None:
    try:
        return float(str(x).replace(",", "."))
    except (TypeError, ValueError):
        return None


# Kategori menurut jenis Google, untuk tempat yang di Excel tercatat di kategori yang tidak cocok (toko rokok di Kuliner,
# kafe di Olahraga, toko pakaian di Jasa). Yang pertama cocok yang dipakai; makanan diperiksa lebih dulu supaya "Toko
# Roti" tidak terbaca toko biasa. Oleh-oleh di Khas Batam tidak dipindah.
KATEGORI_DARI_JENIS = [(re.compile(p, re.I), k) for p, k in [
    (r"^(restoran|rumah makan|kedai|kafe|cafe|kafetaria|warung|toko roti|toko kue|bakery|patisserie|catering|catring|"
     r"dapur umum|pujasera|toko es krim|prasmanan|bistro|panggang|bar grill|bar & grill|bar kopi|toko kopi|tempat penyangraian kopi)", "kuliner"),
    (r"toko optik|toko obat|^apotek|^klinik|^rumah sakit|^dokter|^bidan|^puskesmas|^optik|^laboratorium", "kesehatan"),
    (r"spbu|pom bensin", "transportasi"),
    (r"^atm$|^bank", "layanan_publik"),
    (r"bengkel|pencucian|cuci mobil|kontraktor|^jasa|binatu|laundry|salon|cukur|percetakan|cetak|warnet|penjahit|"
     r"reparasi|^agen|^biro|rental|persewaan|fotografer|studio foto|tukang", "jasa"),
    (r"^(toko|grosir|pemasok|produsen|minimarket|supermarket|pusat perbelanjaan|mall?$|pasar|dealer|ahli tembakau|distributor)", "belanja"),
    (r"^(hotel|motel|vila|wisma|penginapan|guest ?house|hostel|homestay|cottage|losmen|apartemen sewa)", "akomodasi"),
    (r"perumahan|^kantor perusahaan|^perusahaan|^gudang|kompleks bangunan|^yayasan|organisasi|asosiasi", "lainnya"),
    (r"^bar$|^bar |karaoke|klub malam|kelab malam|lounge", "lainnya"),
    (r"^klub olahraga|^lapangan|kolam renang|fitness|kebugaran|^gym|biliar|^gor$|^arena|kompleks olahraga|^studio yoga|"
     r"^klub badminton|^klub padel", "olahraga"),
    (r"^taman$|^taman (kota|bermain|umum|komunitas)|taman komunitas", "ruang_publik"),
    (r"^masjid|^gereja|^vihara|^musala|^musholla", "ibadah"),
    (r"^sekolah|^kursus|^universitas|^taman kanak|kelompok bermain|penitipan anak", "pendidikan"),
    (r"^dok |^dok$|^marina|^tujuan wisata|^area mendaki", "wisata"),
]]
REKOMENDASI_KAT = {"kuliner", "akomodasi", "wisata", "belanja", "jasa", "olahraga", "khas_batam"}
KULINER_SAH = {"kopitiam", "pujasera", "katering", "sop-ikan", "mie-tarempa", "nasi-mie-goreng", "gado-pecel",
               "nasi-ayam-hainan", "martabak-prata", "kue-jajanan", "ayce"}


def kategori_dari_jenis(sub: str | None) -> str | None:
    for pola, kat in KATEGORI_DARI_JENIS:
        if pola.search((sub or "").strip()):
            return kat
    return None


def jenis_kuliner_rapi(sub: str, teks: str) -> str:
    """Jenis makanan di luar daftar Makanan digabung ke jenis terdekat supaya saringan Kuliner tidak berserak."""
    if sub in JENIS_MAKANAN or sub in KULINER_SAH:
        return sub
    if re.search(r"catering|catring|dapur umum", teks, re.I):
        return "katering"
    if re.search(r"pujasera|food ?court", teks, re.I):
        return "pujasera"
    if re.search(r"kopi|espresso|coffee", teks, re.I):
        return "coffee-shop"
    if re.search(r"kafe|cafe|kafetaria", teks, re.I):
        return "kafe"
    if re.search(r"kue|roti|patisserie|penutup|dessert", teks, re.I):
        return "bakery"
    return "restoran"
JENIS_MAKANAN = {"seafood", "makanan-padang", "makanan-sunda", "makanan-jawa", "makanan-sulawesi", "lapo-batak", "pempek",
                 "penyetan", "soto", "sate", "bakso-mie-ayam", "dimsum", "chinese-food", "bubur", "makanan-jepang",
                 "makanan-korea", "makanan-india", "western-steak", "ice-cream", "sarapan-pagi", "vegetarian", "bakery",
                 "coffee-shop", "kafe", "cepat_saji", "rumah_makan", "kedai_kaki_lima", "kedai_minuman", "restoran"}


def jenis(sub: str | None, nama: str, kategori: str = "kuliner") -> str:
    teks = (sub or "").strip()
    for pola, hasil in JENIS:
        # Pola makanan hanya untuk Kuliner dan Khas Batam; di kategori lain "Pantai" atau "Bar" berarti hal lain.
        if hasil in JENIS_MAKANAN and kategori not in ("kuliner", "khas_batam"):
            continue
        if pola.search(teks):
            return hasil
    # Kedai kopi bergaya kopitiam dipisah dari coffee shop menurut namanya.
    if not teks:
        return "lainnya"
    return re.sub(r"[^a-z0-9]+", "_", teks.lower()).strip("_") or "lainnya"


def alamat_ringkas(teks: str | None) -> str | None:
    if not teks:
        return None
    t = re.sub(r",?\s*Kota Batam,?\s*Kepulauan Riau\s*\d{0,5}\s*$", "", str(teks).strip(), flags=re.I)
    t = re.sub(r",?\s*Kota Batam\s*$", "", t, flags=re.I).strip(" ,")
    return t or None


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    wb = load_workbook(sys.argv[1], read_only=True, data_only=True)
    baris = list(wb["Direktori Batam"].iter_rows(values_only=True))
    kepala, isi = baris[0], [dict(zip(baris[0], b)) for b in baris[1:]]

    wilayah = alat.muat_kecamatan()
    kurasi = [p for p in json.loads((ROOT / "data/places.json").read_text(encoding="utf-8")) if p.get("nama")]
    kecamatan_sah = {n for n, _ in wilayah}
    hitung: Counter = Counter()

    hasil = []
    for d in isi:
        kat_excel = d.get("Kategori")
        if kat_excel not in KATEGORI:
            hitung[f"kategori {kat_excel} tidak dipakai"] += 1
            continue
        if "pajak" in str(d.get("Sumber Data") or "").lower():
            hitung["bersumber data pajak"] += 1
            continue
        kategori, _ = KATEGORI[kat_excel]
        rating, ulasan = angka(d.get("Rating")), angka(d.get("Jml Review"))
        lat, lng = angka(d.get("Lat")), angka(d.get("Lng"))
        if lat is None or lng is None:
            hitung["tanpa koordinat"] += 1
            continue
        nama = alat.rapikan_nama(str(d.get("Nama") or ""))
        if not nama:
            hitung["tanpa nama"] += 1
            continue
        kec = alat.kecamatan_dari(lng, lat, wilayah)
        if not kec and d.get("Kecamatan") in kecamatan_sah:
            kec = d["Kecamatan"]
        teks_jenis = str(d.get("Sub-kategori") or "")
        dari_jenis = kategori_dari_jenis(teks_jenis)
        if dari_jenis and dari_jenis != kategori and kategori != "khas_batam":
            hitung[f"pindah {kategori} -> {dari_jenis}"] += 1
            kategori = dari_jenis
        sub = jenis(teks_jenis, nama, kategori)
        if kategori == "kuliner":
            sub = jenis_kuliner_rapi(sub, teks_jenis)
        rekomendasi = kategori in REKOMENDASI_KAT and (rating or 0) >= RATING_MIN and (ulasan or 0) >= ULASAN_MIN
        if sub == "coffee-shop" and re.search(r"kopitiam|kopi tiam|kedai kopi", nama, re.I):
            sub = "kopitiam"
        telepon = re.sub(r"\s+", " ", str(d["Telepon"])).strip() if d.get("Telepon") else None
        # Excel hasil perbaikan memisahkan media sosial; dipakai bila usaha itu tidak punya situs sendiri.
        situs = str(d.get("Website") or d.get("Media Sosial") or "").strip() or None
        gmaps = str(d.get("URL Maps") or "").strip()
        hasil.append(
            {
                "nama": nama,
                "kategori": kategori,
                "sub": sub,
                "kecamatan": kec,
                "kelurahan": (str(d["Kelurahan"]).strip() or None) if d.get("Kelurahan") else None,
                "lat": round(lat, 6),
                "lng": round(lng, 6),
                "alamat": alamat_ringkas(d.get("Alamat")),
                "telepon": telepon,
                "situs": situs,
                "gmaps": gmaps if gmaps.startswith("https://www.google.com/maps/") else None,
                "rating": rating,
                "ulasan": int(ulasan) if ulasan is not None else None,
                "rekomendasi": rekomendasi,
            }
        )

    # Tempat yang sudah ada di data kurasi tidak digandakan.
    akhir = []
    for c in hasil:
        sama = False
        for p in kurasi:
            if p.get("lat") is not None:
                if alat.jarak_m(c["lat"], c["lng"], p["lat"], p["lng"]) < 300 and alat.mirip(c["nama"], p["nama"]):
                    sama = True
                    break
            elif p.get("kategori") == c["kategori"] and alat.kunci_nama(p["nama"]) == alat.kunci_nama(c["nama"]):
                sama = True
                break
        if sama:
            hitung["sudah ada di data kurasi"] += 1
            continue
        akhir.append(c)

    for c in akhir:
        c["id"] = "gm-" + hashlib.sha1(f"{c['nama']}|{c['lat']}|{c['lng']}".encode()).hexdigest()[:10]
    if len({c["id"] for c in akhir}) != len(akhir):
        # Nama dan titik sama persis: sisakan satu.
        unik = {}
        for c in akhir:
            unik.setdefault(c["id"], c)
        hitung["ganda persis"] += len(akhir) - len(unik)
        akhir = list(unik.values())

    akhir.sort(key=lambda c: (c["kategori"], c["sub"], alat.kunci_nama(c["nama"])))
    urutan = ["id", "nama", "kategori", "sub", "kecamatan", "kelurahan", "lat", "lng", "alamat", "telepon", "situs",
              "gmaps", "rating", "ulasan", "rekomendasi"]
    keluaran = {
        "sumber": {"nama": "Google Maps", "dihimpun": "pemilik situs", "diimpor": date.today().isoformat()},
        "tempat": [{k: c[k] for k in urutan} for c in akhir],
    }
    tujuan = ROOT / "data/tempat-google.json"
    tujuan.write_text(json.dumps(keluaran, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")

    print("ditulis", len(akhir), "tempat ke", tujuan)
    print("per kategori", dict(Counter(c["kategori"] for c in akhir).most_common()))
    print("dilewati", dict(hitung))
    print("rekomendasi", sum(1 for c in akhir if c["rekomendasi"]),
          dict(Counter(c["kategori"] for c in akhir if c["rekomendasi"]).most_common()))
    print("bertelepon", sum(1 for c in akhir if c["telepon"]), "bersitus", sum(1 for c in akhir if c["situs"]),
          "tanpa kecamatan", sum(1 for c in akhir if not c["kecamatan"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
